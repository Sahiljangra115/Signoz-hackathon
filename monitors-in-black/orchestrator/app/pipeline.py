"""The hunt: Z (dispatch) -> K (investigate) -> J (neuralyze) -> O (records).

Sequential, in-process, readable top to bottom. Every step emits chatter and a
case SSE update. Status machine: open -> investigating -> neuralyzed | escalated.
"""
import asyncio
import logging
import time

from . import actions, brain, bus, signoz_client, store, voice

log = logging.getLogger("pipeline")

CONFIDENCE_GATE = 0.6
_recent: dict[str, float] = {}  # dedupe: rule name -> last seen monotonic time
_recent_case_ids: dict[str, str] = {}  # dedupe: rule name -> last active case_id
DEDUP_WINDOW_S = 300

CODENAMES = {
    "latency_leech": "Latency Leech",
    "error_swarm": "Error Swarm",
    "token_devourer": "Token Devourer",
    "memory_worm": "Memory Worm",
    "zombie_loop": "Zombie Loop",
    "ghost": "The Ghost",
}


def _timeline(case: dict, entry: dict) -> None:
    case["timeline"].append(entry)
    store.save_case(case)
    # Strip heavy raw payload from alert before broadcasting over SSE
    light_case = case.copy()
    if "alert" in light_case:
        light_case["alert"] = light_case["alert"].copy()
        light_case["alert"].pop("payload", None)
    bus.case_update(light_case)


def dispatch(alert: dict) -> dict | None:
    """Agent Z: dedupe and open the case."""
    rule = alert.get("rule", "unknown")
    now = time.monotonic()
    
    # Prune old keys from the cache
    keys_to_prune = [k for k, v in _recent.items() if now - v > DEDUP_WINDOW_S]
    for k in keys_to_prune:
        _recent.pop(k, None)
        _recent_case_ids.pop(k, None)
        
    last_id = _recent_case_ids.get(rule)
    if last_id and now - _recent.get(rule, -DEDUP_WINDOW_S) < DEDUP_WINDOW_S:
        bus.chatter("Z", voice.Z_DUPLICATE.format(case_id=last_id))
        return None
        
    case = store.new_case(alert)
    _recent[rule] = now
    _recent_case_ids[rule] = case["id"]
    
    _timeline(case, bus.chatter("Z", voice.Z_OPENED.format(case_id=case["id"]), case["id"]))
    return case


async def run_case(case: dict) -> None:
    case_id = case["id"]
    try:
        # Agent K: investigate
        case["status"] = "investigating"
        _timeline(case, bus.chatter("K", voice.K_START, case_id))
        evidence = await asyncio.to_thread(signoz_client.gather_evidence, case["alert"])
        case["evidence"] = evidence
        
        verdict = await asyncio.to_thread(brain.classify, case["alert"], evidence)
        
        # Safe validate LLM outputs
        species = verdict.get("species")
        if species not in CODENAMES:
            species = "unknown"
        case["species"] = species
        
        raw_conf = verdict.get("confidence")
        if raw_conf is None:
            raw_conf = 0.0
        try:
            confidence = float(raw_conf)
        except (ValueError, TypeError):
            confidence = 0.0
        case["confidence"] = max(0.0, min(1.0, confidence))
        
        codename = CODENAMES.get(case["species"], "Unknown")
        _timeline(case, bus.chatter("K", voice.K_VERDICT.format(codename=codename, confidence=case["confidence"]), case_id))

        # Gate: no action on thin evidence or invalid actions
        action_id = verdict.get("action_id")
        if action_id not in actions.ALLOWLIST or action_id == "none":
            action_id = None

        if not action_id or case["confidence"] < CONFIDENCE_GATE:
            case["status"] = "escalated"
            _timeline(case, bus.chatter("K", voice.K_LOW_CONF, case_id))
        else:
            # Agent J: neuralyze
            _timeline(case, bus.chatter("J", voice.J_ACTING.format(action_id=action_id), case_id))
            ok, result = await asyncio.to_thread(actions.execute, action_id)
            
            # RUN VERIFY IN A THREAD to prevent blocking the async event loop!
            verified = ok and await asyncio.to_thread(actions.verify, action_id, case)
            
            case["action"] = {
                "id": action_id,
                "executed_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                "verified": verified,
                "result": result,
            }
            if verified:
                case["status"] = "neuralyzed"
                store.record_capture(case["species"])
                _timeline(case, bus.chatter("J", voice.J_DONE, case_id))
            else:
                case["status"] = "escalated"
                _timeline(case, bus.chatter("J", voice.J_FAILED, case_id))

        # Agent O: records
        evidence_lines = "\n".join(f"- {e['type']} `{e['ref']}`: {e['excerpt'][:120]}" for e in case["evidence"]) or "- (no external evidence, heuristic classification)"
        action_line = (
            f"`{case['action']['id']}` executed, verified={case['action']['verified']}. {case['action']['result']}"
            if case.get("action")
            else "No action taken. Escalated to a human agent."
        )
        case["report_md"] = voice.REPORT_TEMPLATE.format(
            case_id=case_id,
            status=case["status"].upper(),
            codename=codename,
            confidence=case["confidence"] or 0,
            opened_at=case["opened_at"],
            rule=case["alert"].get("rule", "unknown"),
            root_cause=verdict.get("root_cause", ""),
            evidence_lines=evidence_lines,
            action_line=action_line,
        )
        _timeline(case, bus.chatter("O", voice.O_FILED.format(case_id=case_id), case_id))
        log.info("case %s closed: %s", case_id, case["status"])
        
    except Exception as exc:
        log.exception("Pipeline exception for case %s", case_id)
        case["status"] = "escalated"
        # Recover gracefully so the case list doesn't get corrupted
        case["action"] = {
            "id": None,
            "executed_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "verified": False,
            "result": f"pipeline error: {exc}"
        }
        case["report_md"] = f"# Pipeline Fault\nCase execution failed.\n\nError: {exc}"
        _timeline(case, bus.chatter("Z", f"pipeline fault: {exc}; kicking upstairs", case_id))
