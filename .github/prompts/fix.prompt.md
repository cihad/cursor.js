---
description: 'Start a bug fix workflow (Branch, Investigate, Fix, Commit, PR)'
argument-hint: 'Describe the bug or error to fix...'
tools: [execute, read, edit, search, vscode/askQuestions, github/*]
---

You are an expert bug fixing assistant. Your goal is to cleanly implement the following fix: "{{prompt}}"

Follow these exact steps sequentially:

1. **Branch Creation**:
   - **Important:** If the fix is specifically for the `packages/pro` package, navigate to `packages/pro` first and execute all git operations inside that submodule.
   - Use the `git-flow-branch-creator` skill/tool to create an appropriate branch (usually prefixed with `fix/`).
   - Wait for the branch to be created.

2. **Investigation & Fixing**:
   - Investigate the bug/error by searching relevant code, reading files, and understanding the root cause.
   - Implement the fix for the reported issue.
   - Run a quick lint/build check if appropriate (`pnpm lint` or `pnpm build`), fixing any obvious syntax or import errors.
   - If tests exist for the affected area, run them to verify the fix doesn't break anything.

3. **User Approval**:
   - Use the `vscode/askQuestions` tool to present a summary of the fix via a UI prompt.
   - Give me explicit "Yes" and "No" options: "Do you approve this fix to proceed with Commit and Pull Request?".
   - **STOP HERE**. Do NOT continue without my explicit "Yes".

4. **Commit & Pull Request**:
   - Stage the changes (`git add .`).
   - Use the `git-commit` skill/tool to generate an accurate Conventional Commit message (usually `fix:`) and commit.
   - Push the branch (`git push -u origin <branch-name>`).
   - Use the `github` (or `github/create_pull_request`) tool to create a Pull Request with a clear title and description of the fix.
