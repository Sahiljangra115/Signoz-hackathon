"""OpenTelemetry init: traces + logs + metrics to OTLP (SigNoz collector).

Endpoint comes from OTEL_EXPORTER_OTLP_ENDPOINT env var.
"""
import logging
import os
import atexit

from opentelemetry import trace, metrics
from opentelemetry._logs import set_logger_provider
from opentelemetry.exporter.otlp.proto.grpc._log_exporter import OTLPLogExporter
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.exporter.otlp.proto.grpc.metric_exporter import OTLPMetricExporter
from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
from opentelemetry.sdk._logs.export import BatchLogRecordProcessor
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.sdk.metrics import MeterProvider
from opentelemetry.sdk.metrics.export import PeriodicExportingMetricReader
from opentelemetry.metrics import CallbackOptions, Observation

from opentelemetry.instrumentation.logging import LoggingInstrumentor
from opentelemetry.instrumentation.httpx import HTTPXClientInstrumentor
from opentelemetry.instrumentation.sqlite3 import SQLite3Instrumentor

log = logging.getLogger("otel")

# Placeholders for lazy initialization to prevent early creation before provider setup
_chat_requests = None
_llm_output_tokens = None
_llm_cost_usd = None


def get_chat_requests():
    global _chat_requests
    if _chat_requests is None:
        _chat_requests = metrics.get_meter("city").create_counter("city.chat.requests", description="Total chat requests")
    return _chat_requests


def get_llm_output_tokens():
    global _llm_output_tokens
    if _llm_output_tokens is None:
        _llm_output_tokens = metrics.get_meter("city").create_counter("city.llm.output_tokens", unit="{token}", description="LLM output tokens")
    return _llm_output_tokens


def get_llm_cost_usd():
    global _llm_cost_usd
    if _llm_cost_usd is None:
        _llm_cost_usd = metrics.get_meter("city").create_counter("city.llm.cost_usd", description="LLM cost in USD")
    return _llm_cost_usd


def get_vm_rss():
    try:
        with open("/proc/self/status", "r") as f:
            for line in f:
                if line.startswith("VmRSS:"):
                    parts = line.split()
                    if len(parts) >= 2:
                        return int(parts[1]) * 1024  # convert KB to bytes
    except Exception:
        pass
    return 0


def rss_callback(options: CallbackOptions):
    yield Observation(get_vm_rss())


def init_otel(service_name: str) -> None:
    resource = Resource.create({
        "service.name": service_name,
        "service.version": "1.0",
        "deployment.environment": "demo"
    })

    # 1. Traces
    tracer_provider = TracerProvider(resource=resource)
    tracer_provider.add_span_processor(BatchSpanProcessor(OTLPSpanExporter()))
    trace.set_tracer_provider(tracer_provider)

    # 2. Metrics
    metric_reader = PeriodicExportingMetricReader(OTLPMetricExporter(), export_interval_millis=10000)
    meter_provider = MeterProvider(resource=resource, metric_readers=[metric_reader])
    metrics.set_meter_provider(meter_provider)

    # Register observable gauge
    metrics.get_meter("city").create_observable_gauge(
        "city.process.memory.rss",
        callbacks=[rss_callback],
        description="Process memory RSS",
        unit="By"
    )

    # 3. Logs
    logger_provider = LoggerProvider(resource=resource)
    logger_provider.add_log_record_processor(BatchLogRecordProcessor(OTLPLogExporter()))
    set_logger_provider(logger_provider)
    root = logging.getLogger()
    root.addHandler(LoggingHandler(logger_provider=logger_provider))
    root.setLevel(logging.INFO)

    # 4. Instrumentations
    LoggingInstrumentor().instrument(set_logging_format=True)
    HTTPXClientInstrumentor().instrument()
    SQLite3Instrumentor().instrument()


def shutdown_otel():
    try:
        tp = trace.get_tracer_provider()
        if hasattr(tp, "shutdown"):
            tp.shutdown()
        mp = metrics.get_meter_provider()
        if hasattr(mp, "shutdown"):
            mp.shutdown()
    except Exception as e:
        log.warning("Failed to shutdown OTel SDK: %s", e)


atexit.register(shutdown_otel)
