---
name: close-workflow
description: Close out a repository task by performing final verification, merging the PR, and cleaning up local and remote branches. Use when the user says /close, close this task, finish up, wrap up, or asks for a Copilot-style close prompt adapted for Codex.
---

# Close Workflow

Use this skill when the user wants the current task fully wrapped up rather than more implementation.

## Closeout Steps

1. Check the current state with `git status --short`.
2. Review the relevant diff or changed files without reverting user changes.
3. Confirm whether implementation, tests, formatting, changesets, commits, pushes, or PRs are still pending.
4. If validation has not been run, run the most relevant focused checks unless the user only asked for a status summary.
5. If a PR exists and is ready to land, merge it using the requested merge strategy or the repository's normal default for that kind of change.
6. After merging, clean up the associated branches:
   - delete the remote branch
   - switch local checkout to a safe branch such as `main`
   - delete the local feature branch
   - prune stale remote-tracking refs if needed
7. Produce a concise final report:
   - what changed
   - what was verified
   - any user-owned unrelated changes left untouched
   - what was not verified and why
   - the merge result and cleaned-up branches
   - the next concrete action, if one remains

Do not merge or delete branches only when the user explicitly asks for a status-only closeout.

