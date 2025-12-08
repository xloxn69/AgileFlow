---
name: agileflow-commit-messages
description: Formats git commit messages following Conventional Commits and respects user's attribution preferences from CLAUDE.md
---

# Conventional Commits Skill

Automatically formats git commit messages following the Conventional Commits specification while respecting the user's attribution policy defined in CLAUDE.md.

## When to Use

This skill activates when:
- Creating or staging git commits
- Discussing code changes that need committing
- Keywords: "commit", "git commit", "conventional commit", "commit message"

## What This Does

1. Checks CLAUDE.md for attribution policy (respects user preferences)
2. Analyzes staged changes to determine commit type and scope
3. Formats message using Conventional Commits format
4. Shows message to user for approval before executing

## Instructions

1. **Check attribution policy**:
   - Read CLAUDE.md for "Git Commit Attribution Policy"
   - If "DO NOT ADD AI ATTRIBUTION" found → skip footer
   - Otherwise → prepare attribution footer

2. **Analyze changes**:
   - Run `git diff --cached --stat` to see staged files
   - Determine primary change type (feat, fix, refactor, etc.)
   - Identify affected scope (api, ui, auth, db, config, etc.)

3. **Format message**:
   ```
   <type>(<scope>): <subject>

   <body>

   <footer>
   ```

4. **Show for approval**: Display formatted message (diff-first pattern)

5. **Execute after confirmation**: Run git commit with user's YES

## Conventional Commits Format

**Types**: feat, fix, docs, style, refactor, perf, test, chore, ci, revert

**Scope (optional)**: (api), (ui), (auth), (db), (config), etc.

**Subject rules**:
- Imperative mood: "add feature" not "added feature"
- Lowercase, no period, max 50 characters

**Body (optional)**:
- Explain WHAT and WHY (not HOW)
- Wrap at 72 characters per line

**Footer (optional)**:
- Issue references: `Closes #123`
- Breaking changes: `BREAKING CHANGE: description`
- Attribution: Add if CLAUDE.md allows

## Output Examples

**WITH attribution** (default):
```
feat(auth): add two-factor authentication

Implemented TOTP-based 2FA with QR code generation
for enhanced user account security.

Closes #234

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**WITHOUT attribution** (if CLAUDE.md specifies):
```
feat(auth): add two-factor authentication

Implemented TOTP-based 2FA with QR code generation
for enhanced user account security.

Closes #234
```

**Breaking changes**:
```
feat(api)!: change authentication endpoint structure

BREAKING CHANGE: The /auth/login endpoint now returns
a different response format.

Old: { token: "..." }
New: { accessToken: "...", refreshToken: "...", expiresIn: 3600 }

Closes #456
```

## Quality Checklist

Before suggesting commit message:
- [ ] Type is appropriate (feat/fix/refactor/docs/chore)
- [ ] Subject uses imperative mood
- [ ] Subject is lowercase, <50 chars, no period
- [ ] Body explains WHY, wrapped at 72 chars
- [ ] **Attribution policy checked in CLAUDE.md** (CRITICAL)
- [ ] No secrets in staged files (.env, tokens, credentials)
- [ ] Breaking changes marked with `!` and `BREAKING CHANGE:` footer

## Integration

- **agileflow-changelog**: Commit messages inform changelog entries
- **agileflow-story-writer**: Reference story IDs in commits (Closes STORY-042)
- **agileflow-adr**: Link ADRs in footer (Refs: ADR-0005)

## Notes

- ALWAYS check CLAUDE.md first for attribution preferences
- For large commits, suggest breaking into smaller logical commits
- Keep line lengths: subject <50 chars, body <72 chars
- Check for secrets before committing (.env, credentials.json, API keys)
- Security check: Warn user if sensitive files are staged
