"""The City: a demo chatbot service the aliens infest.

Chaos flags are hot-read per request:
  latency_leech  -> 2-6s sleep on /chat
  error_swarm    -> 60% of /chat requests return 500
  token_devourer -> pads every LLM prompt with junk tokens
  memory_worm    -> background worker leaks memory
  zombie_loop    -> background worker logs a repeating poison message
(ghost lives in trafficgen, not here)
"""
import asyncio
import json
import logging
import os
import random
import sqlite3
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from opentelemetry import trace
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from pydantic import BaseModel

from .flags import flags
from .otel import init_otel, get_chat_requests, get_llm_output_tokens, get_llm_cost_usd

# Initialize OTel before getting instruments
init_otel(os.getenv("OTEL_SERVICE_NAME", "city"))
log = logging.getLogger("city")
tracer = trace.get_tracer("city")

# Global reference holding for background tasks to prevent GC
BACKGROUND_TASKS = set()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start the worker task on boot
    task = asyncio.create_task(worker())
    BACKGROUND_TASKS.add(task)
    task.add_done_callback(BACKGROUND_TASKS.discard)
    yield
    # Shutdown logic if any can go here


app = FastAPI(title="The City", lifespan=lifespan)
FastAPIInstrumentor.instrument_app(app)

DB_PATH = os.path.join(os.getenv("DATA_DIR", "/data"), "citizens.db")
QUEUE_PATH = os.path.join(os.getenv("DATA_DIR", "/data"), "queue.json")
_leak = []  # memory_worm dumps here


class ChatIn(BaseModel):
    message: str


@app.middleware("http")
async def alien_effects(request: Request, call_next):
    # Hot-read flags and cache them in request.state to avoid duplicate disk reads
    f = flags()
    request.state.flags = f
    
    if request.url.path == "/chat":
        # Increment chat requests early to capture failed/exploded requests as well
        get_chat_requests().add(1)
        if f.get("latency_leech"):
            await asyncio.sleep(random.uniform(2, 6))
        if f.get("error_swarm") and random.random() < 0.6:
            log.error("chat handler exploded: upstream dependency returned garbage")
            return JSONResponse({"error": "internal error"}, status_code=500)
            
    return await call_next(request)


def llm_reply(message: str, is_devourer: bool) -> tuple[str, int, int]:
    """Returns (reply, input_tokens, output_tokens). Offline fallback without API key."""
    if is_devourer:
        message = message + " please consider the following context: " + ("blah " * 3000)
        
    key = os.getenv("ANTHROPIC_API_KEY")
    if not key:
        reply = f"City hall heard you: {message[:60]}"
        tin = 3500 if is_devourer else max(1, len(message) // 4)
        tout = 1500 if is_devourer else max(1, len(reply) // 4)
        return reply, tin, tout
        
    import anthropic
    client = anthropic.Anthropic()

    # If devourer is active, request a large response length with high token count
    max_tokens = 1500 if is_devourer else 200
    system_prompt = (
        "You are a helpful assistant. Please write an extremely long, descriptive, and verbose story with at least 500 words."
        if is_devourer else anthropic.NOT_GIVEN
    )

    resp = client.messages.create(
        model=os.getenv("CITY_MODEL", "claude-haiku-4-5"),
        max_tokens=max_tokens,
        system=system_prompt,
        messages=[{"role": "user", "content": message}],
    )
    return resp.content[0].text, resp.usage.input_tokens, resp.usage.output_tokens


@app.post("/chat")
async def chat(body: ChatIn, request: Request):
    is_devourer = request.state.flags.get("token_devourer", False)
    
    with tracer.start_as_current_span("llm_call") as span:
        reply, tin, tout = await asyncio.to_thread(llm_reply, body.message, is_devourer)
        span.set_attribute("gen_ai.operation.name", "chat")
        span.set_attribute("gen_ai.provider.name", "anthropic")
        span.set_attribute("gen_ai.request.model", os.getenv("CITY_MODEL", "claude-haiku-4-5"))
        span.set_attribute("gen_ai.response.model", os.getenv("CITY_MODEL", "claude-haiku-4-5"))
        span.set_attribute("gen_ai.usage.input_tokens", tin)
        span.set_attribute("gen_ai.usage.output_tokens", tout)
        
        get_llm_output_tokens().add(tout)
        cost = (tin * 1.0 + tout * 5.0) / 1_000_000.0
        get_llm_cost_usd().add(cost)
        
    log.info("chat served, tokens in=%d out=%d", tin, tout)
    return {"reply": reply}


@app.get("/citizens")
def citizens():
    try:
        with sqlite3.connect(DB_PATH) as con:
            con.execute("CREATE TABLE IF NOT EXISTS citizens (id INTEGER PRIMARY KEY, name TEXT)")
            # Seed citizens if completely empty to prevent empty response
            cursor = con.cursor()
            cursor.execute("SELECT count(*) FROM citizens")
            if cursor.fetchone()[0] == 0:
                citizens_seed = [(i, f"Citizen-{i}") for i in range(1, 51)]
                con.executemany("INSERT INTO citizens (id, name) VALUES (?, ?)", citizens_seed)
            rows = con.execute("SELECT id, name FROM citizens LIMIT 20").fetchall()
            return {"citizens": [{"id": r[0], "name": r[1]} for r in rows]}
    except Exception as e:
        log.error("Failed to query database citizens: %s", e)
        return {"citizens": []}


@app.get("/health")
def health():
    return {"status": "nominal"}


def read_queue():
    try:
        with open(QUEUE_PATH, "r") as f:
            return json.load(f)
    except (OSError, json.JSONDecodeError):
        return []


def write_queue(q):
    try:
        tmp = QUEUE_PATH + ".tmp"
        with open(tmp, "w") as f:
            json.dump(q, f, indent=2)
        os.replace(tmp, QUEUE_PATH)
    except Exception:
        pass


async def worker():
    """Steady baseline telemetry + host body for two aliens."""
    while True:
        f = flags()
        if f.get("memory_worm"):
            # Leak 25MB every 5s (reaches 300MB+ in 1 min)
            _leak.append(bytearray(25 * 1024 * 1024))
            log.warning("worker memory rising, leak size ~%dMB", len(_leak) * 25)
        else:
            _leak.clear()

        q = read_queue()
        if q:
            msg = q[0]
            with tracer.start_as_current_span("worker.process_message") as span:
                span.set_attribute("message.id", msg.get("id", "unknown"))
                if msg.get("poison"):
                    log.error("worker retry: cannot process message id=%s", msg.get("id"))
                    # do NOT pop: retry forever
                else:
                    q.pop(0)
                    write_queue(q)
                    log.info("processed message id=%s", msg.get("id"))
        else:
            with tracer.start_as_current_span("worker.heartbeat"):
                log.info("queue worker tick: nothing unusual")
        await asyncio.sleep(5)
