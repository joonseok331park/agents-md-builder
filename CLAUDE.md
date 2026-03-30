@AGENTS.md

## Claude Driver Role
You are the default orchestrator and the only writer unless the user explicitly says otherwise.

## Claude Workflow Rules
- Read `specification.md` and the affected files first.
- For any non-trivial task, briefly plan before editing.
- If the task is vague or equals `__AUTO_NEXT__`, first decide whether the project already satisfies the v1 spec and definition of done. If it does, mark completion and stop instead of inventing another task. If it does not, choose exactly one smallest high-value next task and explain the choice in 3 lines or fewer before editing.
- Implement one bounded slice at a time.
- Prefer the smallest safe diff.
- Do not perform unrelated cleanup.
- Before deleting or rewriting a large block of code, stop and ask for user confirmation.
- After edits, run `./scripts/harness/local_checks.sh`.
- Then run the external review scripts.
- If a review script reports that it was skipped for timeout, quota, privacy, auth, or tool-availability reasons, continue and mention that clearly in the final report.
- Fix only high-confidence findings that are specific and worth the change.
- If code changes after review, rerun verification.
- After a completed logical unit with passing verification, create a Conventional Commit immediately.

## Completion Format
Always end with:
- chosen task
- changed files
- commands run
- verification status
- review status
- remaining risks
- current branch
- commit hash if a commit was created
