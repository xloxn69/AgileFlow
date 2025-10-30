---
name: agileflow-commit-messages
description: Formats git commit messages following Conventional Commits and respects user's attribution preferences from CLAUDE.md. Loads when creating commits or discussing code changes to commit.
allowed-tools: Read, Bash
---

# agileflow-commit-messages

ROLE & IDENTITY
- Skill ID: COMMIT-MSG
- Specialization: Git commit message formatting with Conventional Commits + attribution policy compliance
- Part of the AgileFlow docs-as-code system

OBJECTIVE
Format git commit messages following Conventional Commits specification while respecting user's Claude Code attribution preferences from CLAUDE.md. Ensure commits are clear, concise, and follow project conventions for type, scope, and footer formatting.

INPUTS
- User request to commit changes
- Files staged for commit (from git status)
- Change descriptions or diff context
- CLAUDE.md (optional) - Attribution policy

FIRST ACTION
**Deterministic boot sequence**:
1. Check if CLAUDE.md exists: `[ -f CLAUDE.md ] && echo "Found" || echo "Not found"`
2. If found, read attribution policy: `grep -A 20 "Git Commit Attribution Policy" CLAUDE.md`
3. Scan git status: `git status --short` to understand scope of changes
4. Check for staged changes: `git diff --cached --stat`

PROACTIVE KNOWLEDGE LOADING
**Before generating commit message:**
- Read CLAUDE.md for attribution policy (CRITICAL - respect user preference)
- Read .git/config for repo context (if available)
- Scan staged files to determine commit type and scope
- Check recent commit history: `git log --oneline -5` to match style

**Attribution Policy Detection**:
- IF `grep -q "DO NOT ADD AI ATTRIBUTION" CLAUDE.md` → No attribution
- ELSE → Add default attribution footer

WORKFLOW
1. **Analyze staged changes**:
   - Run `git diff --cached --stat` to see files
   - Determine primary change type (feat, fix, refactor, etc.)
   - Identify affected scope (api, ui, auth, db, config, etc.)

2. **Check attribution policy** (CRITICAL):
   - Read CLAUDE.md for "Git Commit Attribution Policy"
   - IF "DO NOT ADD AI ATTRIBUTION" found → skip footer
   - ELSE → prepare attribution footer

3. **Format commit message** following Conventional Commits:
   ```
   <type>(<scope>): <subject>

   <body>

   <footer>
   ```
   - **Type**: feat, fix, docs, style, refactor, perf, test, chore, ci, revert
   - **Scope** (optional): api, ui, auth, db, config, etc.
   - **Subject**: Imperative mood, lowercase, <50 chars, no period
   - **Body** (optional): Explain WHAT and WHY (not HOW), wrap at 72 chars
   - **Footer**: Issue refs (Closes #123), breaking changes, attribution

4. **Add attribution footer** (if policy allows):
   ```
   🤖 Generated with [Claude Code](https://claude.com/claude-code)

   Co-Authored-By: Claude <noreply@anthropic.com>
   ```

5. **Show commit message** to user for approval (diff-first pattern)

6. **Execute commit** after YES confirmation:
   ```bash
   git commit -m "$(cat <<'EOF'
   <formatted message>
   EOF
   )"
   ```

RELATED COMMANDS
- `/AgileFlow:setup` - Creates CLAUDE.md with attribution policy during setup
- `/AgileFlow:ai-code-review` - Use before committing to verify quality
- `/AgileFlow:generate-changelog` - Parses commit messages for changelog generation
- `/AgileFlow:status STORY=... STATUS=in-review` - Update story status after commit

**When to use slash commands**:
- After committing code changes → `/AgileFlow:status` to update story
- After completing story → `/AgileFlow:generate-changelog` for release notes

OUTPUTS
- Formatted commit message (shown to user for approval)
- Git commit executed (if user says YES)
- Commit SHA (from git output)

HANDOFFS
**AgileFlow Coordination** (optional - if working within AgileFlow system):
- DOES NOT update docs/09-agents/status.json directly (commit is atomic)
- DOES NOT append to bus/log.jsonl (commits don't trigger coordination)
- **Story lifecycle**: Commits typically happen during `in-progress` phase
- **After commit**: Dev agent should update status.json to `in-review` if story complete

**Security Note**: NEVER commit secrets to git
- Check for .env, credentials.json, tokens, API keys
- Warn user if sensitive files are staged
- Suggest adding to .gitignore instead

QUALITY CHECKLIST
Before suggesting commit message:
- [ ] Type is appropriate (feat/fix/refactor/docs/chore/etc.)
- [ ] Subject is imperative mood ("add" not "added" or "adds")
- [ ] Subject is lowercase, <50 chars, no period at end
- [ ] Body explains WHY (not just WHAT), wrapped at 72 chars
- [ ] Footer includes issue references if applicable (Closes #123)
- [ ] **Attribution policy checked in CLAUDE.md** (CRITICAL)
- [ ] No secrets in staged files (.env, tokens, credentials)
- [ ] Breaking changes marked with `!` and `BREAKING CHANGE:` footer

## Conventional Commits Format

### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation only changes
- **style**: Code style (formatting, missing semicolons, whitespace)
- **refactor**: Code refactor (neither fixes bug nor adds feature)
- **perf**: Performance improvements
- **test**: Adding/modifying tests
- **chore**: Build process, dependencies, tooling
- **ci**: CI/CD configuration changes
- **revert**: Reverts a previous commit

### Scope (Optional)
- `(api)`, `(ui)`, `(auth)`, `(db)`, `(config)`, etc.
- Can be omitted if change affects multiple areas

### Subject Rules
- Imperative mood: "add feature" not "added feature" or "adds feature"
- No capitalization of first letter
- No period at the end
- Max 50 characters
- Clear and concise

### Body (Optional but Recommended)
- Explain WHAT changed and WHY (not HOW - code shows that)
- Wrap at 72 characters per line
- Separate from subject with blank line
- Use bullet points for multiple changes

### Footer (Optional)
- **Breaking changes**: `BREAKING CHANGE: description`
- **Issue references**: `Closes #123`, `Fixes #456`
- **Attribution**: Add if CLAUDE.md allows (see attribution policy)

## Attribution Examples

**WITH attribution** (default if no policy):
```
feat(auth): add two-factor authentication

Implemented TOTP-based 2FA with QR code generation
for enhanced user account security.

Closes #234

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**WITHOUT attribution** (if CLAUDE.md says "DO NOT ADD AI ATTRIBUTION"):
```
feat(auth): add two-factor authentication

Implemented TOTP-based 2FA with QR code generation
for enhanced user account security.

Closes #234
```

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

When introducing breaking changes, use `!` and `BREAKING CHANGE:`:
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
- **agileflow-story-writer**: Reference story IDs in commits (Closes STORY-042)
- **agileflow-adr-writer**: Link ADRs in footer (Refs: ADR-0005)

## Notes

- **ALWAYS** check CLAUDE.md first before formatting commit message
- Respect user preferences - attribution is a sensitive topic
- If unsure about type, ask the user
- For large commits, suggest breaking into smaller logical commits
- Include context in body - future developers will thank you
- Keep line lengths: subject <50 chars, body <72 chars
