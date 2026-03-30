#!/usr/bin/env python3

import json
import subprocess
import sys
from pathlib import Path


SENSITIVE_FILES = {
    "lib/build-agents-md.ts",
    "lib/lint-agents-md.ts",
}


def load_review(path: Path) -> dict:
    if not path.exists():
        return {"summary": f"{path.name} missing", "findings": []}
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise ValueError(f"{path.name} must be a JSON object")
    data.setdefault("summary", "")
    data.setdefault("findings", [])
    return data


def load_resolutions(path: Path) -> list[dict]:
    if not path.exists():
        return []
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, list):
        raise ValueError("review_resolution.json must be a JSON array")
    return data


def changed_files(root: Path) -> list[str]:
    commands = [
        ["git", "diff", "--name-only", "--relative", "--", "."],
        ["git", "diff", "--cached", "--name-only", "--relative", "--", "."],
        ["git", "ls-files", "--others", "--exclude-standard"],
    ]
    result: set[str] = set()
    for command in commands:
        output = subprocess.run(command, cwd=root, check=False, capture_output=True, text=True)
        for line in output.stdout.splitlines():
            if line.strip():
                result.add(line.strip())
    return sorted(result)


def main() -> int:
    root = Path(__file__).resolve().parents[2]
    reviews_dir = root / ".harness" / "reviews"
    codex_review = load_review(reviews_dir / "codex_review.json")
    gemini_review = load_review(reviews_dir / "gemini_review.json")
    resolutions = load_resolutions(reviews_dir / "review_resolution.json")

    changed = changed_files(root)
    changed_tests = [path for path in changed if path.startswith("tests/") and path.endswith(".test.ts")]
    changed_sensitive = [path for path in changed if path in SENSITIVE_FILES]

    resolution_map: dict[tuple[str, int], dict] = {}
    errors: list[str] = []

    for entry in resolutions:
      source = entry.get("source")
      index = entry.get("index")
      decision = entry.get("decision")
      notes = str(entry.get("notes", "")).strip()
      evidence = entry.get("evidence", [])

      if source not in {"codex", "gemini"}:
          errors.append(f"Invalid resolution source: {source!r}")
          continue
      if not isinstance(index, int) or index < 0:
          errors.append(f"Invalid resolution index for {source}: {index!r}")
          continue
      if decision not in {"fixed", "declined"}:
          errors.append(f"Invalid decision for {source}#{index}: {decision!r}")
          continue
      if not notes:
          errors.append(f"Resolution notes are required for {source}#{index}")
      if not isinstance(evidence, list):
          errors.append(f"Resolution evidence must be a list for {source}#{index}")
          evidence = []
      key = (source, index)
      if key in resolution_map:
          errors.append(f"Duplicate resolution entry for {source}#{index}")
      resolution_map[key] = {
          "decision": decision,
          "notes": notes,
          "evidence": [str(item).strip() for item in evidence if str(item).strip()],
      }

    reviews = {
        "codex": codex_review.get("findings", []),
        "gemini": gemini_review.get("findings", []),
    }

    for source, findings in reviews.items():
        for index, finding in enumerate(findings):
            key = (source, index)
            if key not in resolution_map:
                errors.append(f"Missing resolution for {source} finding #{index}")
                continue

            resolution = resolution_map[key]
            decision = resolution["decision"]
            evidence = resolution["evidence"]
            file_ref = str(finding.get("file") or "")
            file_path = file_ref.split(":", 1)[0]

            if decision == "fixed" and not evidence:
                errors.append(f"Fixed {source} finding #{index} requires evidence")

            if decision == "declined" and not resolution["notes"]:
                errors.append(f"Declined {source} finding #{index} requires rationale")

            if decision == "fixed" and file_path in SENSITIVE_FILES:
                has_test_evidence = any(item.startswith("tests/") for item in evidence)
                if not has_test_evidence:
                    errors.append(
                        f"Fixed {source} finding #{index} in {file_path} requires at least one test file in evidence"
                    )

    if changed_sensitive and not changed_tests:
        errors.append("Generator or lint logic changed without any matching tests/*.test.ts changes")

    if errors:
        print("[review-gate] review resolution verification failed:", file=sys.stderr)
        for error in errors:
            print(f"- {error}", file=sys.stderr)
        return 1

    print("[review-gate] review resolution verification passed.")
    if changed_sensitive:
        print(f"[review-gate] generator-sensitive files changed: {', '.join(changed_sensitive)}")
    if changed_tests:
        print(f"[review-gate] matching test files changed: {', '.join(changed_tests)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
