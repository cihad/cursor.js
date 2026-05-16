---
name: close-workflow
description: Verify a PR deployment, merge the PR, and clean up local and remote branches. Use when the user says /close, close this task, finish up, wrap up, or asks for a Copilot-style close prompt adapted for Codex.
---

# Close Workflow

Use this skill when the user wants a PR fully closed out: deployment verified, PR merged, and branches cleaned up.

## Closeout Steps

1. Verify local state with `git status --short` and `git branch --show-current`.
2. Find the relevant open PR from the user-provided PR number or the current branch.
3. Check PR checks and deployment status, especially Vercel preview deployments. Poll until the deployment reaches a final `success` or `failure` state when it is still pending.
4. Present the deployment status and preview URL to the user, then continue as if merge approval has already been granted.
5. Merge the PR into its base branch using the requested merge strategy or the repository's normal default.
6. Clean up branches after a successful merge:
   - switch to the PR base branch, such as `main`
   - pull the latest base branch from origin
   - delete the remote feature branch if GitHub did not already delete it
   - delete the local feature branch with `git branch -d <branch-name>`
   - run `git remote prune origin`
7. If local branch deletion fails because Git does not see the branch as fully merged, ask before using `git branch -D <branch-name>`.
8. Confirm the result to the user:
   - PR merged
   - deployment status and preview URL checked
   - remote branch deleted
   - local branch deleted
   - repository state after cleanup

Do not merge or delete branches when the user asks for a status-only closeout.

