---
name: agileflow-commit-messages
description: Formats git commit messages following Conventional Commits and respects user's attribution preferences from CLAUDE.md. Loads when creating commits or discussing code changes to commit.
allowed-tools: Read, Bash
---

# AgileFlow Commit Messages

## Purpose

This skill automatically formats git commit messages following Conventional Commits specification and respects the user's Claude Code attribution preferences configured in CLAUDE.md.

## When This Skill Activates

Load this skill when:
- User asks to create a git commit
- User says "commit these changes"
- Discussing what changes to commit
- User runs git commands or mentions staging changes
- After completing code changes that need to be committed

## Conventional Commits Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semicolons, etc.)
- **refactor**: Code refactoring (neither fixes a bug nor adds a feature)
- **perf**: Performance improvements
- **test**: Adding or modifying tests
- **chore**: Build process, dependencies, tooling changes
- **ci**: CI/CD configuration changes
- **revert**: Reverts a previous commit

### Scope (Optional)

The scope specifies what part of the codebase is affected:
- `(api)`, `(ui)`, `(auth)`, `(db)`, `(config)`, etc.
- Can be omitted if change affects multiple areas

### Subject

- Imperative mood ("add" not "added" or "adds")
- No capitalization of first letter
- No period at the end
- Max 50 characters

### Body (Optional but Recommended)

- Explain WHAT and WHY, not HOW
- Wrap at 72 characters
- Separate from subject with blank line
- Use bullet points for multiple changes

### Footer (Optional)

- Breaking changes: `BREAKING CHANGE: description`
- Issue references: `Closes #123`, `Fixes #456`
- Attribution (see below)

## Attribution Handling (CRITICAL)

**ALWAYS check CLAUDE.md for attribution preferences before adding footer!**

### Workflow

1. **Check for CLAUDE.md**:
   ```bash
   [ -f CLAUDE.md ] && echo "Found" || echo "Not found"
   ```

2. **Read attribution policy**:
   ```bash
   grep -A 20 "Git Commit Attribution Policy" CLAUDE.md
   ```

3. **Apply attribution based on policy**:

**If CLAUDE.md says "DO NOT ADD AI ATTRIBUTION":**
```
feat(auth): add two-factor authentication

Implemented TOTP-based 2FA with QR code generation
for user account security.

Closes #234
```

**If CLAUDE.md has NO attribution policy (or doesn't exist):**
```
feat(auth): add two-factor authentication

Implemented TOTP-based 2FA with QR code generation
for user account security.

Closes #234

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**If user explicitly requests no attribution (in current conversation):**
Respect their request for THIS commit, but note that CLAUDE.md should be updated for permanent preference.

## Commit Message Quality Checklist

Before suggesting a commit message:
- [ ] Type is appropriate for the change
- [ ] Subject is imperative mood, lowercase, <50 chars
- [ ] Body explains WHY (not just WHAT)
- [ ] Footer includes issue references if applicable
- [ ] **Attribution policy checked in CLAUDE.md**
- [ ] Line lengths respected (subject <50, body <72)

## Examples

See `reference/` directory for good vs bad commit message examples.

## Multi-File Commits

For commits affecting multiple files:
- Choose the most significant type (feat > fix > refactor > chore)
- Use scope that represents the feature/module
- List key changes in body as bullet points

Example:
```
feat(user-profile): add profile editing and avatar upload

- Implemented profile form with validation
- Added avatar upload with image cropping
- Created API endpoints for profile updates
- Added unit tests for profile service

Closes #123, #124
```

## Breaking Changes

When introducing breaking changes:
```
feat(api)!: change authentication endpoint structure

BREAKING CHANGE: The /auth/login endpoint now returns a different
response format. Clients must update to handle the new structure.

Old: { token: "..." }
New: { accessToken: "...", refreshToken: "...", expiresIn: 3600 }

Migration guide: docs/migrations/auth-response-v2.md
```

## Revert Commits

```
revert: feat(auth): add two-factor authentication

This reverts commit abc1234def5678.

Reason: 2FA implementation caused login failures for users with
certain browser configurations. Reverting to investigate and fix.
```

## Integration with Other Skills

- **agileflow-changelog**: Commit messages inform changelog entries
- **agileflow-story-writer**: Reference story IDs in commits (`Closes STORY-042`)

## Script: check-attribution.sh

Use `scripts/check-attribution.sh` to determine attribution preference:

```bash
#!/bin/bash
# Returns "yes" if attribution should be added, "no" if it should not

if [ -f CLAUDE.md ]; then
  if grep -q "DO NOT ADD AI ATTRIBUTION" CLAUDE.md; then
    echo "no"
  else
    echo "yes"
  fi
else
  echo "yes"  # Default to adding attribution if no CLAUDE.md
fi
```

## Notes

- **ALWAYS** check CLAUDE.md first before formatting commit message
- Respect user preferences - attribution is a sensitive topic
- If unsure about type, ask the user
- For large commits, suggest breaking into smaller logical commits
- Include context in body - future developers will thank you
