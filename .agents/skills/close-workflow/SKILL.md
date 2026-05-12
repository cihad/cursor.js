---
name: close-workflow
description: Close out a repository task with a final sanity check, changed-file summary, validation status, and clear next steps. Use when the user says /close, close this task, finish up, wrap up, or asks for a Copilot-style close prompt adapted for Codex.
---

# Close Workflow

Use this skill when the user wants the current task wrapped up rather than more implementation.

## Closeout Steps

1. Check the current state with `git status --short`.
2. Review the relevant diff or changed files without reverting user changes.
3. Confirm whether implementation, tests, formatting, changesets, commits, pushes, or PRs are still pending.
4. If validation has not been run, run the most relevant focused checks unless the user only asked for a status summary.
5. Produce a concise final report:
   - what changed
   - what was verified
   - what was not verified and why
   - any user-owned unrelated changes left untouched
   - the next concrete action, if one remains

Do not create commits, push, or open PRs during closeout unless the user explicitly asks.

