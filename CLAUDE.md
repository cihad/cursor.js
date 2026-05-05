# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Run all commands from the monorepo root unless working inside `packages/pro` (see submodule note below).

```bash
pnpm build        # Build all packages via Turborepo
pnpm test         # Run Vitest across all packages
pnpm lint         # ESLint + Prettier check
pnpm format       # Auto-fix formatting

# Single package
pnpm --filter @cursor.js/core test
pnpm --filter @cursor.js/core build

# Run a single test file
pnpm --filter @cursor.js/core test src/core/Cursor.test.ts
```

For releases, create a changeset manually (see **Changesets** below) — never run `pnpm changeset` interactively as it hangs.

## Architecture

This is a **pnpm + Turborepo monorepo**. The published library lives in `packages/core`; `packages/pro` is a separate Git submodule with Pro plugins.

| Layer | File | Role |
|---|---|---|
| Visual | `packages/core/src/core/GhostCursor.ts` | Renders `#virtual-cursor` DOM element, handles scroll/resize |
| Engine & Queue | `packages/core/src/Cursor.ts` | Chainable promise-based action queue (`.hover()`, `.click()`, `.type()`) |
| Event Dispatcher | `packages/core/src/core/EventDispatcher.ts` | Dispatches real `MouseEvent`/`Event` classes, synthetic hover via CSS classes |
| Math | `packages/core/src/core/utils.ts` | Bezier curves, Fitts's Law path generation |
| Plugin API | `packages/core/src/plugins/` | `CursorPlugin` interface; core plugins: Theme, Indicator, Ripple, ClickSound, Logging, Say, Speech |
| Pro Plugins | `packages/pro/` | TrailPlugin, GeminiTTSPlugin, ParticlePlugin (submodule) |
| Docs | `apps/docs/` | Next.js documentation site — see `apps/docs/AGENTS.md` for breaking-change warnings |

Public exports are gated through `packages/core/src/index.ts`. Any new export must be added there.

## Critical Conventions

**No recursive `this.wait()` inside action methods.** The `Cursor` class has a promise queue; calling `this.wait()` from within an action pushes a new event to the *tail* of the queue, causing an infinite loop. Use raw `setTimeout` inside a `new Promise(...)` instead.

**Strict Vanilla JS in core.** `packages/core` must not import any framework library (React, Vue, etc.). Use native DOM APIs only. Strict DOM typings are required (`HTMLInputElement`, `MouseEventInit`, etc.) — no implicit `any`.

**React 16+ input hack.** `EventDispatcher.ts` already overrides React's native value setter to trigger reliable `input`/`change` simulation. Don't reimplement this elsewhere.

**jsdom layout mocking.** In Vitest tests, `getBoundingClientRect` always returns zeros. Always mock it when a test depends on element position.

**TDD for core and pro packages.** Write failing Vitest tests first, then implement until green. TDD is optional for `apps/docs` and `refactor`/`chore`/`style` tasks.

## Pro Submodule (`packages/pro`)

`packages/pro` is an independent Git submodule with its own history and changeset config. **All** git operations (branch, commit, push) and changesets for Pro work must be run from inside `packages/pro/`:

```bash
cd packages/pro
git checkout -b feat/my-feature
# ... make changes, run tests ...
# create changeset manually inside packages/pro/.changeset/
git add . && git commit -m "feat: ..."
git push -u origin feat/my-feature
```

Never use the root monorepo's changeset config for Pro changes.

## Changesets (Versioning)

Required for any `feat`, `fix`, or public API change. Create manually — **do not** run `pnpm changeset` interactively:

```bash
# Create .changeset/<random-name>.md with this structure:
---
"@cursor.js/core": patch   # or minor / major
---

Short description of the change for CHANGELOG.
```

Pure internal refactors, chores, and style changes with no public API impact do not need a changeset.

## Task Workflow (Slash Commands)

`.github/prompts/task.prompt.md` and `.github/prompts/close.prompt.md` define the full development workflow (branch → implement → test → changeset → commit → PR). These are usable as Claude Code custom slash commands if placed in `.claude/commands/`.

Custom development skills (git-flow-branch-creator, tdd, git-commit, creating-changesets, etc.) are located in `.agents/skills/`.
