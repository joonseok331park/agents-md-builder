#!/usr/bin/env python3

import argparse
import json
from pathlib import Path


VALID_SOURCES = {"codex", "gemini"}
VALID_DECISIONS = {"fixed", "declined"}


def load_entries(path: Path) -> list[dict]:
    if not path.exists():
        return []
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, list):
        raise ValueError("review_resolution.json must contain a JSON array")
    return data


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", required=True, choices=sorted(VALID_SOURCES))
    parser.add_argument("--index", required=True, type=int)
    parser.add_argument("--decision", required=True, choices=sorted(VALID_DECISIONS))
    parser.add_argument("--notes", required=True)
    parser.add_argument("--evidence", nargs="*", default=[])
    args = parser.parse_args()

    root = Path(__file__).resolve().parents[2]
    out_dir = root / ".harness" / "reviews"
    out_dir.mkdir(parents=True, exist_ok=True)
    path = out_dir / "review_resolution.json"

    entries = load_entries(path)
    entry = {
        "source": args.source,
        "index": args.index,
        "decision": args.decision,
        "notes": args.notes.strip(),
        "evidence": [value.strip() for value in args.evidence if value.strip()],
    }

    replaced = False
    for idx, current in enumerate(entries):
        if current.get("source") == args.source and current.get("index") == args.index:
            entries[idx] = entry
            replaced = True
            break

    if not replaced:
        entries.append(entry)

    path.write_text(json.dumps(entries, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(path)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
