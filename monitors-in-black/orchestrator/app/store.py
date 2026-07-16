"""JSON file persistence. Single writer (the pipeline), atomic tmp+rename writes."""
import json
import os
import pathlib
import time
import logging
import fcntl

log = logging.getLogger("store")

DATA = pathlib.Path(os.getenv("DATA_DIR", "/data"))
CASES = DATA / "cases"
REGISTRY = DATA / "registry.json"
FLAGS = DATA / "flags.json"
QUEUE = DATA / "queue.json"


def _atomic_write(path: pathlib.Path, obj) -> None:
    tmp = path.with_suffix(".tmp")
    tmp.write_text(json.dumps(obj, indent=2, default=str))
    tmp.replace(path)


def new_case(alert: dict) -> dict:
    CASES.mkdir(parents=True, exist_ok=True)
    lock_file = DATA / "cases.lock"
    
    with open(lock_file, "a+") as lf:
        fcntl.flock(lf, fcntl.LOCK_EX)
        try:
            # ponytail: O(N) glob directory listing scan, fine for low count demo cases; upgrade to DB if cases scale
            existing = list(CASES.glob("case-*.json"))
            next_num = 1
            if existing:
                nums = []
                for p in existing:
                    try:
                        num_str = p.stem.split("-")[-1]
                        nums.append(int(num_str))
                    except Exception:
                        pass
                if nums:
                    next_num = max(nums) + 1
            case_id = f"case-{next_num:04d}"
            
            case = {
                "id": case_id,
                "opened_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                "status": "open",
                "alert": alert,
                "species": None,
                "confidence": None,
                "evidence": [],
                "action": None,
                "report_md": None,
                "timeline": [],
            }
            # Save under lock to prevent any ID overwrite race
            _atomic_write(CASES / f"{case_id}.json", case)
            return case
        finally:
            fcntl.flock(lf, fcntl.LOCK_UN)


def save_case(case: dict) -> None:
    _atomic_write(CASES / f"{case['id']}.json", case)


def load_cases() -> list[dict]:
    if not CASES.exists():
        return []
    cases = []
    for p in sorted(CASES.glob("case-*.json")):
        try:
            cases.append(json.loads(p.read_text()))
        except Exception as e:
            log.warning("Failed to load case file %s: %s", p, e)
    return cases


def load_registry() -> list[dict]:
    if not REGISTRY.exists():
        return []
    try:
        return json.loads(REGISTRY.read_text())
    except Exception:
        return []


def record_capture(species: str) -> None:
    if not species or species == "unknown":
        log.warning("record_capture skipped: invalid species name: %s", species)
        return
    registry = load_registry()
    updated = False
    for entry in registry:
        if entry.get("species") == species:
            entry["captures"] = entry.get("captures", 0) + 1
            entry["last_seen"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
            updated = True
    if updated:
        _atomic_write(REGISTRY, registry)
    else:
        log.warning("record_capture failed: species %s not found in registry", species)


def disable_flag(species: str) -> bool:
    try:
        if not FLAGS.exists():
            _atomic_write(FLAGS, {})
        flags = json.loads(FLAGS.read_text())
        flags[species] = False
        _atomic_write(FLAGS, flags)
        return True
    except Exception as e:
        log.error("Failed to disable flag %s: %s", species, e)
        return False


def flag_is_off(species: str) -> bool:
    if not FLAGS.exists():
        return True
    try:
        return not json.loads(FLAGS.read_text()).get(species, False)
    except Exception:
        return True


def purge_queue() -> bool:
    try:
        # Atomic clear queue.json
        _atomic_write(QUEUE, [])
        # Also ensure zombie_loop flag is disabled
        disable_flag("zombie_loop")
        log.info("Queue purged and zombie_loop flag disabled")
        return True
    except Exception as e:
        log.error("Failed to purge queue: %s", e)
        return False
