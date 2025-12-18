# Git Branching Strategy

Git workflow and branching conventions for AgileFlow.

---

## Branch Model

AgileFlow uses **trunk-based development** with `main` as the primary branch.

```
main (production)
  │
  ├── feature/US-0001-description
  ├── feature/EP-0001-epic-work
  ├── fix/bug-description
  └── chore/maintenance-task
```

---

## Branch Naming

| Prefix | Purpose | Example |
|--------|---------|---------|
| `feature/` | New functionality | `feature/US-0001-login-api` |
| `fix/` | Bug fixes | `fix/installer-path-issue` |
| `chore/` | Maintenance, docs | `chore/update-dependencies` |
| `refactor/` | Code restructuring | `refactor/cli-architecture` |

**Format**: `<type>/<story-id>-<short-description>` or `<type>/<short-description>`

---

## Commit Messages

Follow **Conventional Commits**:

```
<type>: <description>

[optional body]

[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `chore` | Maintenance (no production code change) |
| `refactor` | Code change that neither fixes nor adds feature |
| `style` | Formatting, whitespace |
| `test` | Adding or modifying tests |

### Examples

```bash
# Feature
feat: add async agent spawning documentation

# Fix
fix: correct path resolution in Windows installer

# Docs
docs: update architecture README with new document

# Chore
chore: bump version to v2.37.0

# Refactor
refactor: simplify command parser logic
```

---

## Important Rules

### NO AI Attribution

```bash
# WRONG - Contains AI attribution
feat: add new feature

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>

# RIGHT - Clean commit
feat: add new feature
```

**AI footers, Co-Authored-By, emoji robots, and AI mentions are forbidden.**

### Version Commits

Always use release script for version bumps:

```bash
./scripts/release.sh 2.37.0 "Feature Name"
```

Do NOT manually edit version and commit.

---

## Workflow

### Feature Development

```bash
# 1. Create branch from main
git checkout main
git pull origin main
git checkout -b feature/US-0001-description

# 2. Make changes and commit
git add .
git commit -m "feat: implement user login"

# 3. Push and create PR
git push -u origin feature/US-0001-description
gh pr create
```

### Quick Fixes

For simple fixes, commit directly to main (with care):

```bash
git checkout main
git pull origin main
# make small fix
git add .
git commit -m "fix: typo in README"
git push origin main
```

---

## Pull Requests

Use `/agileflow:pr` to generate PR descriptions:

```markdown
## Summary
- Brief description of changes

## Test plan
- [ ] Manual testing checklist
- [ ] Automated tests pass

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

---

## Protected Branch Rules (Recommended)

For team projects, consider:

| Rule | Setting |
|------|---------|
| Require PR before merge | Yes |
| Require approvals | 1+ |
| Require status checks | Yes (when tests exist) |
| Require branches up to date | Yes |

---

## Related Documentation

- [Release Process](./releasing.md) - Version and release workflow
- [CI Practices](./ci.md) - Automated workflows
