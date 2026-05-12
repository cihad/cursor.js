---
name: task-workflow
description: End-to-end repository task workflow adapted from .github/prompts/task.prompt.md. Use when the user asks to run a Copilot-style task command, mentions /task, or wants a feature, fix, refactor, chore, or style task handled through branch creation, implementation, validation, changeset, commit, push, and PR.
---

# Task Workflow

Use this skill for explicit full workflow requests. For small one-off edits, normal Codex behavior is enough unless the user asks for the task command or PR-ready flow.

## 1. Classify The Task

Identify every task type involved:

- `feat`: new feature or capability
- `fix`: bug fix
- `refactor`: code restructuring without behavior change
- `chore`: maintenance, dependencies, tooling
- `style`: formatting, naming, cosmetic changes

Choose one primary type for the branch name and Conventional Commit prefix. If the request is ambiguous or lacks necessary product detail, ask concise clarifying questions before changing files.

## 2. Create The Branch

- If the task is for `packages/pro`, first `cd packages/pro` and run all git, commit, and changeset operations inside that submodule only.
- Use the `git-flow-branch-creator` skill to create an appropriate branch from the primary task type.
- Wait for successful branch creation before implementation.
- If the worktree already has unrelated user changes, leave them alone and mention them when relevant.

## 3. Investigate And Implement

- Read `AGENTS.md` and any nested `AGENTS.md` that applies to touched files.
- Search relevant code with `rg` and follow existing project patterns.
- For `feat` or `fix` in core packages, use the `tdd` skill: write or update failing Vitest tests first, then implement until tests pass.
- For `refactor`, `chore`, `style`, or `apps/docs` work, apply tests where useful but relax strict TDD when the change is documentation, configuration, or UI-only.
- Preserve the core package export surface in `packages/core/src/index.ts` when editing public APIs.
- Keep code and documentation terminology in English.
- For asynchronous waits inside the `Cursor` sequence, use raw `setTimeout` inside promises. Do not call `this.wait()` recursively inside action methods.
- In jsdom tests, mock `getBoundingClientRect` when layout measurements matter.
- Preserve the React input setter behavior handled by `EventDispatcher.ts`.

## 4. Validate

Run focused checks first, then broader checks as risk increases:

- `pnpm lint`
- `pnpm test`
- `pnpm build` when imports, exports, packaging, or docs app behavior could be affected
- `pnpm format` when formatting changed or lint indicates formatting drift

Fix issues and rerun the relevant checks. If a required command cannot run, report the exact blocker.

## 5. Ask Before Versioning And Publishing

After implementation and validation, stop and ask the user for explicit approval before changeset, commit, push, or PR creation. Summarize:

- implemented changes
- changed files
- validation commands and results
- whether a changeset is needed

Use a plain question if no UI question tool is available.

## 6. Versioning

After approval, create a changeset when any condition is true:

- the task includes `feat` or `fix`
- public API exports, signatures, classes, or types changed
- behavior or API is breaking

Use the `creating-changesets` skill. Prefer its manual method: create a markdown file in `.changeset/` directly instead of running interactive `pnpm changeset`.

Skip changesets for pure internal refactor, chore, style, or docs-only work with no public API or package behavior impact.

## 7. Commit, Push, And PR

After approval:

- Stage only the intended files.
- Use the `git-commit` skill to generate a Conventional Commit message with the primary task type.
- Push with `git push -u origin <branch-name>`.
- Use the GitHub plugin/app to open a PR with a concise title, summary, tests, and changeset note.

