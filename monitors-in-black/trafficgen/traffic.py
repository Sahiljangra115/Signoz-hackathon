"""Citizens of the city: steady chat traffic so dashboards stay alive.

The ghost alien lives here: when the ghost flag is on, 90% of traffic vanishes.
"""
import json
import os
import pathlib
import random
import time
from concurrent.futures import ThreadPoolExecutor

import httpx

CITY = os.getenv("CITY_URL", "http://localhost:8000")
FLAGS = pathlib.Path(os.getenv("DATA_DIR", "/data")) / "flags.json"

LINES = [
    "when is the next train downtown?",
    "report a broken streetlight on 5th",
    "what are the library hours today?",
    "is the park open after dark?",
    "how do I renew my pet license?",
]


def ghost_active() -> bool:
    try:
        return json.loads(FLAGS.read_text()).get("ghost", False)
    except (OSError, json.JSONDecodeError):
        return False


# Module-level HTTPX client with connection pool reuse
http_client = httpx.Client(timeout=10)


def send_citizen_request():
    try:
        http_client.post(f"{CITY}/chat", json={"message": random.choice(LINES)})
        if random.random() < 0.3:
            http_client.get(f"{CITY}/citizens")
    except Exception:
        pass


def main():
    # ThreadPoolExecutor to fire requests concurrently
    executor = ThreadPoolExecutor(max_workers=20)
    while True:
        if ghost_active() and random.random() < 0.9:
            time.sleep(1)
            continue
        
        # Fire-and-forget submission so slow chat responses do not drag down request rate
        executor.submit(send_citizen_request)
        
        time.sleep(random.uniform(0.3, 1.0))


if __name__ == "__main__":
    main()
