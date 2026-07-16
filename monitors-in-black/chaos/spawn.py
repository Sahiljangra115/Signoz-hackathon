"""Alien spawner. Flips species flags the city hot-reads every request.

Usage:
  python chaos/spawn.py error_swarm      # spawn one species
  python chaos/spawn.py --banish         # end all chaos
  python chaos/spawn.py --status
"""
import argparse
import json
import os
import pathlib
import sys

# Support DATA_DIR environment variable to prevent host vs container path mismatch
DATA_DIR = os.getenv("DATA_DIR")
if DATA_DIR:
    FLAGS_PATH = pathlib.Path(DATA_DIR) / "flags.json"
else:
    FLAGS_PATH = pathlib.Path(__file__).resolve().parent.parent / "data" / "flags.json"

SPECIES = ["latency_leech", "error_swarm", "token_devourer", "memory_worm", "zombie_loop", "ghost"]


def read_flags():
    if not FLAGS_PATH.exists():
        FLAGS_PATH.parent.mkdir(parents=True, exist_ok=True)
        FLAGS_PATH.write_text(json.dumps({k: False for k in SPECIES}))
    try:
        return json.loads(FLAGS_PATH.read_text())
    except Exception:
        return {k: False for k in SPECIES}


def write_flags(flags):
    tmp = FLAGS_PATH.with_suffix(".tmp")
    tmp.write_text(json.dumps(flags, indent=2))
    tmp.replace(FLAGS_PATH)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("species", nargs="?", choices=SPECIES)
    parser.add_argument("--banish", action="store_true")
    parser.add_argument("--status", action="store_true")
    args = parser.parse_args()

    flags = read_flags()
    queue_path = FLAGS_PATH.parent / "queue.json"

    if args.status:
        print(json.dumps(flags, indent=2))
        return
    if args.banish:
        write_flags({k: False for k in flags})
        # Filter out poison messages
        try:
            if queue_path.exists():
                q = json.loads(queue_path.read_text())
                q = [m for m in q if not m.get("poison")]
                tmp = queue_path.with_suffix(".tmp")
                tmp.write_text(json.dumps(q, indent=2))
                tmp.replace(queue_path)
        except Exception:
            pass
        print("All aliens banished. The city sleeps.")
        return
    if not args.species:
        parser.error("give a species or --banish")
    
    # Enable the flag for all species
    flags[args.species] = True
    write_flags(flags)

    if args.species == "zombie_loop":
        try:
            q = []
            if queue_path.exists():
                q = json.loads(queue_path.read_text())
            if not any(m.get("poison") for m in q):
                q.append({
                    "id": "undead-042",
                    "kind": "poison",
                    "poison": True,
                    "created_at": "2026-07-16T12:00:00Z"
                })
                tmp = queue_path.with_suffix(".tmp")
                tmp.write_text(json.dumps(q, indent=2))
                tmp.replace(queue_path)
        except Exception as e:
            print(f"Failed to queue poison message: {e}")
        
    print(f"{args.species} has crossed over. Watch the skies (and the dashboards).")


if __name__ == "__main__":
    sys.exit(main())
