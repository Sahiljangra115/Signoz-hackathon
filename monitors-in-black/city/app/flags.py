"""Hot-read chaos flags. The chaos CLI writes this file; the city reads it every request."""
import json
import os
import pathlib

FLAGS_PATH = pathlib.Path(os.getenv("DATA_DIR", "/data")) / "flags.json"


def flags() -> dict:
    try:
        return json.loads(FLAGS_PATH.read_text())
    except (OSError, json.JSONDecodeError):
        return {}
