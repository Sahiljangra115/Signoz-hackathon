"""Every MIB-flavored string lives here so the tone stays consistent."""

Z_OPENED = "Z: We got a hot one. Case #{case_id} opened. K, you're up."
Z_DUPLICATE = "Z: Same alien, same block. Folding this alarm into case #{case_id}."
Z_BAD_TOKEN = "Z: Someone knocked without credentials. Door stays shut."
K_START = "K: On it. Pulling traces and logs for the last 15 minutes."
K_VERDICT = "K: Ran the evidence. Species: {codename}. Confidence {confidence:.2f}."
K_LOW_CONF = "K: Evidence is thin. I don't flash on a hunch. Escalating to a human."
K_BAD_TELEMETRY = "K: My scanners came back empty. {failed} queries failed, zero traces or logs. This smells like broken tooling, not an alien. Kicking it upstairs."
J_ACTING = "J: Engaging. Action: {action_id}."
J_DONE = "J: Flash. Neuralyzed. Civilians saw nothing."
J_FAILED = "J: It resisted. Escalating to a human. Some things even we don't flash."
O_FILED = "O: Case #{case_id} filed. Memory wiped. Registry updated."

def hedge_root_cause(root_cause: str, confidence: float) -> str:
    """Deterministic backstop: prefix root_cause by confidence bucket, in case the
    model ignores the SYSTEM prompt's hedging instruction (brain.py)."""
    if confidence >= 0.6:
        return root_cause
    if confidence >= 0.3:
        return f"Tentative read (confidence {confidence:.2f}): {root_cause}"
    return f"Low confidence ({confidence:.2f}), evidence thin: {root_cause}"


REPORT_TEMPLATE = """# CASE FILE #{case_id}

**Status:** {status}
**Species:** {codename}
**Confidence:** {confidence:.2f}
**Opened:** {opened_at}

## Incident
Alert rule `{rule}` fired. {root_cause}

## Evidence
{evidence_lines}

## Action taken
{action_line}

## Sign-off
Civilians noticed nothing. The city sleeps.
This file self-classifies. You were never here.
"""
