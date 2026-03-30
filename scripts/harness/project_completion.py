#!/usr/bin/env python3

import argparse
import json
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path


def repo_root() -> Path:
    return Path(__file__).resolve().parents[2]


def marker_path(root: Path) -> Path:
    return root / ".harness" / "project_completion.json"


def current_head(root: Path) -> str | None:
    result = subprocess.run(
        ["git", "rev-parse", "--verify", "HEAD"],
        cwd=root,
        check=False,
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        return None
    return result.stdout.strip() or None


def worktree_is_clean(root: Path) -> bool:
    commands = [
        ["git", "diff", "--quiet", "--", "."],
        ["git", "diff", "--cached", "--quiet", "--", "."],
    ]
    for command in commands:
        result = subprocess.run(command, cwd=root, check=False)
        if result.returncode != 0:
            return False

    untracked = subprocess.run(
        ["git", "ls-files", "--others", "--exclude-standard"],
        cwd=root,
        check=False,
        capture_output=True,
        text=True,
    )
    return not bool(untracked.stdout.strip())


def load_marker(path: Path) -> dict | None:
    if not path.exists():
        return None

    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise ValueError("project_completion.json must be a JSON object")
    return data


def write_marker(path: Path, head: str | None, summary: str) -> None:
    payload = {
        "status": "complete",
        "head": head,
        "summary": summary.strip(),
        "completedAt": datetime.now(timezone.utc).isoformat(),
    }
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def clear_marker(path: Path) -> int:
    if path.exists():
        path.unlink()
    return 0


def check_marker(path: Path, root: Path, clear_stale: bool) -> int:
    marker = load_marker(path)
    if marker is None:
        print("No completion marker is recorded.", file=sys.stderr)
        return 1

    marker_head = marker.get("head")
    head = current_head(root)
    clean = worktree_is_clean(root)

    stale = not clean or not head or marker_head != head
    if stale:
        if clear_stale:
            clear_marker(path)
        print("Completion marker is stale.", file=sys.stderr)
        return 1

    summary = str(marker.get("summary", "")).strip()
    print(summary or "Project is already marked complete.")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser()
    subparsers = parser.add_subparsers(dest="command", required=True)

    mark_parser = subparsers.add_parser("mark")
    mark_parser.add_argument("--summary", required=True)

    check_parser = subparsers.add_parser("check")
    check_parser.add_argument("--clear-stale", action="store_true")

    subparsers.add_parser("clear")

    args = parser.parse_args()

    root = repo_root()
    path = marker_path(root)

    if args.command == "mark":
        write_marker(path, current_head(root), args.summary)
        print(path)
        return 0

    if args.command == "check":
        return check_marker(path, root, args.clear_stale)

    if args.command == "clear":
        return clear_marker(path)

    return 1


if __name__ == "__main__":
    raise SystemExit(main())
