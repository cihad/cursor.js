You are an expert Git Flow assistant. Your goal is to verify PR deployment, optionally merge the PR, and clean up the repository.

$ARGUMENTS

Follow these exact steps sequentially:

1. **Verify State & Deployment**:
   - Run `git status` to determine the current branch.
   - Use `gh pr view` to find the open Pull Request associated with this branch.
   - Check the deployment statuses/checks on the PR (e.g., Vercel). Poll the status periodically until it reports `success` or `failure`.
   - Wait until a final state is reached.

2. **User Approval**:
   - Present the deployment status to the user.
   - If the status is `success`, explicitly provide the Deployment Preview URL.
   - Ask: "Deployment Status: [Status]. URL: [URL]. Do you approve merging this PR and deleting the branch locally and remotely?" (Yes / No).
   - **STOP HERE** and wait for the user's explicit decision. Do NOT proceed to step 3 without it.

3. **Merge Pull Request**:
   - If the user selects "Yes", use `gh pr merge` to merge the associated Pull Request into the target base branch (e.g., `main`).
   - If the user selects "No", stop completely so they can make changes.

4. **Checkout Base, Pull and Cleanup**:
   - Run the following to switch to the base branch, pull latest, delete the remote and local feature branches, and prune remote tracking refs:
     ```
     git checkout <base-branch> && git pull origin <base-branch> && (git push origin --delete <branch-name> || true) && git branch -d <branch-name> && git remote prune origin
     ```
   - If Git complains the branch is not fully merged locally, ask the user for permission before force deleting (`git branch -D <branch-name>`).

5. **Confirmation**:
   - Confirm that the PR has been merged, the branch has been deleted locally and remotely, and the repository is clean.
