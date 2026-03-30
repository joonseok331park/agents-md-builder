You are resolving git rebase conflicts for the AGENTS.md Builder completion harness.

Follow `AGENTS.md` and `CLAUDE.md` exactly.

Scope:
- Resolve only the files currently marked as conflicted by git.
- Preserve the completed branch's intended behavior while integrating the newer base-branch changes.
- Keep the diff minimal and do not make unrelated edits.
- Remove all conflict markers and leave files in a clean merged state.

Do:
- Read the conflicted files and nearby context carefully.
- Use the current base-branch code when it is required for correctness or compatibility.
- Keep existing tests and static-export constraints intact.

Do not:
- start new feature work
- do cleanup unrelated to the conflict
- run `git merge`, `git rebase`, `git commit`, `git push`, `git pull`, `git reset`, or `git stash`
- leave conflict markers in any file

Finish by reporting:
- which conflicted files you resolved
- any assumptions or residual risks
