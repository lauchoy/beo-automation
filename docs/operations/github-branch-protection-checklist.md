# GitHub Branch Protection Checklist

Use this checklist to enforce CI and review gates for `main`.

## 1) Protect `main`

In GitHub:
1. Go to `Settings` -> `Branches` -> `Add branch protection rule`.
2. Branch name pattern: `main`.
3. Enable `Require a pull request before merging`.
4. Set required approvals to at least `1`.
5. Enable `Dismiss stale pull request approvals when new commits are pushed`.
6. Enable `Require conversation resolution before merging`.

## 2) Require status checks

Enable `Require status checks to pass before merging`, then add:
- `quality-gate`
- `dependency-review`

Set status checks mode to `Strict` (Require branches to be up to date before merging).

## 3) Restrict bypass paths

1. Enable `Do not allow bypassing the above settings`.
2. Keep `Allow force pushes` disabled.
3. Keep `Allow deletions` disabled.

## 4) Optional but recommended hardening

1. Enable `Require signed commits`.
2. Add `.github/workflows/*` to `CODEOWNERS` and enable `Require review from Code Owners`.
3. In `Settings` -> `Actions` -> `General`, set default `GITHUB_TOKEN` permissions to read-only.
4. In the same page, enable the policy that requires actions to be pinned to full-length commit SHAs.

## 5) Verification pass

After configuration:
1. Open a test PR.
2. Confirm both required checks run and pass.
3. Confirm merge is blocked when either check fails.
