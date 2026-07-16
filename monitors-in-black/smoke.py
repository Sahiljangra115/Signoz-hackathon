"""The one test: full hunt, no SigNoz needed (webhook simulated).

Run with orchestrator up (docker compose or `uvicorn app.main:app --port 8100`
from orchestrator/ with DATA_DIR pointing at ./data):

    python smoke.py
"""
import json
import os
import pathlib
import subprocess
import sys
import time
import urllib.error
import urllib.request

BASE = os.getenv("ORCH_URL", "http://localhost:8100")
SECRET = os.getenv("WEBHOOK_SECRET", "change-me")
ROOT = pathlib.Path(__file__).parent
# Honor DATA_DIR like spawn.py/the orchestrator do, so the assert reads the same
# flags.json the pipeline just wrote.
DATA = pathlib.Path(os.getenv("DATA_DIR") or (ROOT / "data"))


def post(path, body, headers=None):
    req = urllib.request.Request(
        BASE + path, data=json.dumps(body).encode(), method="POST",
        headers={"Content-Type": "application/json", **(headers or {})},
    )
    with urllib.request.urlopen(req, timeout=10) as resp:
        return json.loads(resp.read())


def get(path):
    with urllib.request.urlopen(BASE + path, timeout=10) as resp:
        return json.loads(resp.read())


def main():
    subprocess.run([sys.executable, str(ROOT / "chaos" / "spawn.py"), "error_swarm"], check=True)

    # Use a timestamped rule name to bypass the 5-minute webhook deduplication window on consecutive runs
    rule_name = f"error rate breach {int(time.time())}"

    # No-token knock must bounce
    try:
        post("/hooks/signoz", {"ruleName": rule_name})
        raise AssertionError("webhook accepted without secret header")
    except urllib.error.HTTPError as e:
        assert e.code == 401, f"expected 401, got {e.code}"

    opened = post("/hooks/signoz", {"ruleName": rule_name}, {"x-agency-token": SECRET})
    assert opened["status"] == "case-opened", opened
    case_id = opened["case_id"]

    deadline = time.time() + 60
    status = None
    while time.time() < deadline:
        cases = {c["id"]: c for c in get("/api/cases")["cases"]}
        status = cases[case_id]["status"]
        if status in ("neuralyzed", "escalated"):
            break
        time.sleep(2)

    assert status == "neuralyzed", f"case ended as {status!r}, wanted neuralyzed"
    flags = json.loads((DATA / "flags.json").read_text())
    assert flags["error_swarm"] is False, "flag was not flipped off"
    print(f"SMOKE PASS: {case_id} neuralyzed, error_swarm flag off, report filed.")


if __name__ == "__main__":
    main()
