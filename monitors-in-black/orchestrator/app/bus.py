"""SSE broadcaster. Named events per plan-ui §5.4: chatter, case, ping."""
import asyncio
import json
import time
import logging

log = logging.getLogger("bus")

subscribers: set[asyncio.Queue] = set()


def _now_iso() -> str:
    return time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())


def _broadcast(event_type: str, data: dict) -> None:
    # Safely iterate over copy
    for queue in list(subscribers):
        try:
            queue.put_nowait((event_type, data))
        except asyncio.QueueFull:
            # ponytail: drop the event, keep the subscriber; a slow client recovers
            # on the next event instead of going silent forever
            log.warning("Subscriber queue full, dropping %s event", event_type)


def chatter(agent: str, message: str, case_id: str | None = None) -> dict:
    entry = {"ts": _now_iso(), "agent": agent, "case_id": case_id, "message": message}
    _broadcast("chatter", entry)
    return entry


def case_update(case: dict) -> None:
    _broadcast("case", case)


async def stream():
    queue: asyncio.Queue = asyncio.Queue(maxsize=200)
    subscribers.add(queue)
    try:
        yield "retry: 3000\n\n"
        while True:
            try:
                event_type, data = await asyncio.wait_for(queue.get(), timeout=15)
                yield f"event: {event_type}\ndata: {json.dumps(data, default=str)}\n\n"
            except asyncio.TimeoutError:
                yield "event: ping\ndata: {}\n\n"
    finally:
        subscribers.discard(queue)
