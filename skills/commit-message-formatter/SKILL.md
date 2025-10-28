# commit-message-formatter

Generate conventional commit messages with detailed descriptions.

## Activation Keywords
- "commit", "git commit", "conventional commit", "commit message"

## When to Use
- User is about to commit code changes
- Need to format commit in conventional commits style
- Writing clear, searchable commit messages

## What This Does
Generates properly-formatted commit messages following Conventional Commits standard:
- Type: feat, fix, chore, docs, style, refactor, perf, test
- Scope: module or component affected
- Subject: concise description (imperative mood, <50 chars)
- Body: detailed explanation of change (wrapped at 72 chars)
- Footer: references to issues, breaking changes, co-authorship

Automatically includes:
- Claude Code co-authorship footer
- Link to related story/issue if mentioned
- Breaking change notation if applicable

## Output
Ready-to-use commit message for `git commit -m`

## Example Activation
User: "I implemented user login endpoint with JWT auth and rate limiting"
Skill: Generates:
```
feat(auth): implement JWT-based user login endpoint

Implemented POST /api/auth/login endpoint with:
- Email/password validation
- JWT token generation (24h expiration)
- Rate limiting (5 attempts per 15 minutes)
- Proper error handling and logging

Matches acceptance criteria from US-0001.

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```
