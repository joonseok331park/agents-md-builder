You are running the AGENTS.md Builder ship workflow.

Follow `AGENTS.md` and `CLAUDE.md` exactly.

If the task is `__AUTO_NEXT__` or is vague such as `continue`, `next`, or `do the next step`:
1. Inspect `specification.md`, `git status`, and the current implementation state. Use `./scripts/harness/branch_context.sh` for branch-vs-base context. Never assume the base branch is `main`.
2. Decide whether the current branch already satisfies the v1 specification and whether any materially useful next task remains. Treat "more tests", "nice-to-have polish", and speculative cleanup as not materially useful once the spec and definition of done are already satisfied.
3. If the project is already complete or further progress would be unnecessary, run `./scripts/harness/project_completion.py mark --summary "<one-sentence completion reason>"`, do not edit tracked files, and stop with a completion report instead of choosing another task. `ship.sh` will handle any later automatic base-branch finalization for valid completed branches, including automatic reconciliation when possible and `FINALIZATION_BLOCKED` when it cannot safely finish.
4. Otherwise choose exactly one smallest high-value next task.
5. Explain the chosen task in 3 lines or fewer before editing.
6. Do not bundle multiple logical units into one run.

Branching rules:
- If there are no commits yet, stay on the current branch for the bootstrap task and create the first commit there.
- If the current branch is `main` or `master` and the task is a non-trivial feature or fix, create an appropriate working branch before editing.
- In `__AUTO_NEXT__`, never merge, rebase, cherry-pick, push, or pull. Finish the logical unit on the working branch, commit it, and stop.

Tool rules:
- In this ship workflow, use only built-in `Read`, `Glob`, `Grep`, `Edit`, `Write`, and `Bash`.
- Do not use MCP tools.
- Do not use `AskUserQuestion` or `TaskOutput`.
- Run commands sequentially. Do not launch background tasks.

Normal workflow:
1. Read `specification.md` and affected files first.
2. If the task requires deleting or rewriting a large block of existing code, stop and ask for user confirmation.
3. Make the smallest safe change in the fewest files possible.
4. Run `./scripts/harness/local_checks.sh`.
5. Run `./scripts/harness/codex_review.sh "<original user task>"`.
6. Run `./scripts/harness/gemini_review.sh "<original user task>"`.
7. Read both review outputs.
8. For every actionable review finding you fix or decline, record a resolution with `./scripts/harness/record_review_resolution.py`. Run the executable scripts directly so they stay within the harness allowlist.
9. If you fix a finding in `lib/build-agents-md.ts` or `lib/lint-agents-md.ts`, add or update a regression test and include the test file path in the resolution evidence.
10. Run `./scripts/harness/verify_review_resolution.py`.
11. Fix only specific, high-confidence, materially useful findings.
12. If code changed after review, rerun `./scripts/harness/local_checks.sh` and then rerun `./scripts/harness/verify_review_resolution.py`.
13. If verification passes and the logical unit is complete, create a Conventional Commit immediately.
14. If the task was `__AUTO_NEXT__` or another vague-next-step request and the project is now complete after your commit, run `./scripts/harness/project_completion.py mark --summary "<one-sentence completion reason>"` before exiting. Do not merge manually; the harness wrapper will finalize the branch on the next auto-next run when the fast-forward conditions are satisfied.
15. End with:
   - chosen task
   - changed files
   - commands run
   - verification status
   - review status
   - remaining risks
   - current branch
   - commit hash if created

Never:
- introduce backend, auth, API routes, middleware, analytics SDKs, or external AI calls
- violate static export
- add runtime remote fetches
- do unrelated cleanup
- edit generated artifacts
- claim manual verification if it was not actually performed
- commit in a broken state
- claim a review finding was fixed without recording evidence for it
- treat a Gemini skip for timeout, quota, auth, or tool availability as a blocker
