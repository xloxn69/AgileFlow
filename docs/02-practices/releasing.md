# Release Process

Versioning strategy and release workflow for AgileFlow.

---

## Quick Start

**Always use the automated script:**

```bash
./scripts/release.sh <version> "<title>"
```

**Example:**
```bash
./scripts/release.sh 2.37.0 "Async Agent Spawning Guide"
```

---

## What the Script Does

1. **Bumps version** in 2 files:
   - `packages/cli/package.json`
   - Root `package.json`

2. **Commits**: `chore: bump version to vX.Y.Z`

3. **Pushes** to `origin/main`

4. **Creates git tag**: `vX.Y.Z`

5. **Creates GitHub release** with auto-generated notes

6. **GitHub Actions** automatically publishes to npm

---

## Version Sync (Critical)

These files MUST always have matching versions:

| File | Field |
|------|-------|
| `packages/cli/package.json` | `"version": "X.Y.Z"` |
| `package.json` (root) | `"version": "X.Y.Z"` |

The release script handles this automatically.

---

## Semantic Versioning

Follow **SemVer** (`MAJOR.MINOR.PATCH`):

| Increment | When | Example |
|-----------|------|---------|
| MAJOR | Breaking changes | `3.0.0` |
| MINOR | New features (backward compatible) | `2.37.0` |
| PATCH | Bug fixes | `2.36.1` |

### Examples

```bash
# New feature
./scripts/release.sh 2.37.0 "Async Agent Spawning"

# Bug fix
./scripts/release.sh 2.36.1 "Fix Windows Path Issue"

# Breaking change
./scripts/release.sh 3.0.0 "New Agent Architecture"
```

---

## Pre-Release Checklist

Before running the release script:

- [ ] All changes committed and pushed
- [ ] CHANGELOG.md updated (user-facing changes only)
- [ ] Tests pass (when configured)
- [ ] `npm audit` shows no critical issues
- [ ] README.md accurate
- [ ] Main branch is clean

---

## CHANGELOG Guidelines

Only document **user-facing changes**:

```markdown
## [2.37.0] - 2025-12-18

### Added
- Async agent spawning architecture documentation

### Fixed
- Windows path resolution in installer

### Changed
- Updated babysit mentor workflow
```

**Do NOT include:**
- Internal development notes
- CLAUDE.md updates
- Refactoring without user impact

---

## Manual Release (Emergency Only)

If the script fails:

```bash
# 1. Bump versions manually
# Edit packages/cli/package.json and package.json

# 2. Commit
git add packages/cli/package.json package.json
git commit -m "chore: bump version to v2.37.0"

# 3. Push
git push origin main

# 4. Create and push tag
git tag -a v2.37.0 -m "Release v2.37.0 - Title"
git push origin v2.37.0

# 5. Create GitHub release
gh release create v2.37.0 --title "v2.37.0 - Title" --generate-notes

# GitHub Actions publishes to npm
```

---

## Post-Release Verification

After release:

```bash
# Check GitHub Actions
# https://github.com/projectquestorg/AgileFlow/actions

# Verify npm version
npm view agileflow version

# Test installation
npx agileflow@latest setup
```

---

## Troubleshooting

### Tag Already Exists

```bash
git tag -d v2.37.0
git push origin :refs/tags/v2.37.0
# Re-run release script
```

### npm Publish Failed

Check GitHub Actions logs. Common issues:
- `NPM_TOKEN` not set in GitHub Secrets
- package.json version doesn't match tag
- Network timeout (re-trigger by pushing tag again)

### Version Mismatch

The workflow validates versions match:

```
Error: package.json version (2.36.0) doesn't match tag (2.37.0)
```

Use the release script to avoid this - it keeps everything in sync.

---

## Related Documentation

- [CI Practices](./ci.md) - GitHub Actions workflow details
- [Git Branching](./git-branching.md) - Commit message conventions
