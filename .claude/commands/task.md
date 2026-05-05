You are an expert development assistant. Your goal is to cleanly implement the following task: "$ARGUMENTS"

## Task Analysis

First, analyze the prompt to determine **all** task types involved. A single request may contain multiple types (e.g., a new feature that also requires a refactor and a bug fix). Identify each one:

- `feat` — new feature or capability
- `fix` — bug fix
- `refactor` — code restructuring without behavior change
- `chore` — maintenance, dependencies, tooling
- `style` — formatting, naming, cosmetic changes

Determine the **primary** task type for branch naming and commit message prefix. Note all types for conditional steps below.

## Steps

Follow these exact steps sequentially. Complete one step before moving to the next:

1. **Branch Creation**:
   - **Important:** If the task is specifically for the `packages/pro` package, navigate to `packages/pro` first and execute all git operations inside that submodule.
   - Create an appropriate branch based on the primary task type (e.g., `feat/`, `fix/`, `refactor/`, `chore/`).
   - Wait for the branch to be successfully created before proceeding.

2. **Investigation & Implementation**:
   - Investigate the requirements by searching relevant code, reading files, and understanding the context.
   - Check `AGENTS.md` to refresh your memory on the architectural rules (Vanilla JS, strict DOM typings, no recursive `wait()`).
   - Implement the requested changes.
   - **Context Rules:**
     - For `feat` or `fix` in core packages, adhere strictly to TDD and Vanilla JS rules from AGENTS.md. Write failing Vitest tests first, then implement the code until the tests pass.
     - For `refactor`, `chore`, or `style`, or changes in `apps/docs` (Next.js/React), strict TDD/Vanilla JS rules can be relaxed appropriately.
   - Run `pnpm lint` and/or `pnpm build` to check for syntax or import errors, fixing any issues found.
   - Run `pnpm test` to verify the changes don't break anything. Iterate until all tests are green.
   - **Test Coverage:** Review the affected test files. If existing tests don't cover the changed behavior, add missing tests.

3. **User Approval**:
   - Present a summary of the implemented changes, changed files, and test results.
   - Ask explicitly: "Do you approve these changes to proceed with versioning and Pull Request creation?" (Yes / No).
   - **STOP HERE** and wait. Do NOT continue to step 4 without explicit confirmation.

4. **Versioning (Changeset)**:
   - Once approved, evaluate whether a changeset is needed. Create one if **any** of the following are true:
     - The task includes a `feat` or `fix`.
     - The changes modify or remove a public API export (function signature, class, type).
     - The changes are a breaking change (behavioral or API).
   - If a changeset is needed, manually create a markdown file in `.changeset/` — **do NOT run `pnpm changeset` interactively** as it will hang waiting for user input. Autonomously decide the bump type (patch/minor/major).
   - If none of the above conditions are met (e.g., pure internal refactor, chore, or style with no public API impact), skip this step.

5. **Commit & Pull Request**:
   - Stage the changes (`git add .`).
   - Generate an accurate Conventional Commit message. If multiple task types are involved, use the primary type as the prefix (e.g., `feat: add undo support with internal refactor`).
   - Push the branch to the remote repository (`git push -u origin <branch-name>`).
   - Create a Pull Request with a clear title and description of the changes using `gh pr create`.

Before executing step 1, ask any clarifying questions if the task request is ambiguous or lacks necessary detail.
