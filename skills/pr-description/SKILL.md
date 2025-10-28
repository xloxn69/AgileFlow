# pr-description

Generate pull request description with testing instructions.

## Activation Keywords
- "pull request", "create PR", "merge request", "pr description", "pr body"

## When to Use
- Creating pull request on GitHub/GitLab
- Need comprehensive PR description with testing steps
- Documenting changes for code review

## What This Does
Generates complete PR description including:
- **Summary**: 2-3 sentence overview of changes
- **Related Issues**: Links to GitHub issues/stories
- **Changes Made**: Bulleted list of modifications
- **Testing Instructions**: Step-by-step testing guide
- **Checklist**: Pre-merge verification items
- **Migration Guide**: Steps for deploying if needed
- **Screenshots/Links**: If UI changes or demos

Coordinates with relevant agents (testing, documentation, etc.).

## Output
Ready-to-paste PR description

## Example Activation
User: "Create PR for user login feature"
Skill: Generates:
```markdown
## Summary
Implements user authentication system with JWT tokens and rate limiting.
Includes login endpoint, password reset flow, and token refresh.

## Related Issues
Closes #42 (User Authentication Epic)
Relates to: US-0001, US-0002, US-0003

## Changes Made
- ✨ POST /api/auth/login endpoint with JWT generation
- ✨ POST /api/auth/logout endpoint
- ✨ Password reset flow with email verification
- 🐛 Fixed rate limiting to prevent brute force
- 📝 Updated API documentation
- ✅ Added 45 test cases (98% coverage)

## Testing Instructions
1. Start dev server: `npm run dev`
2. Test login: curl -X POST http://localhost:3000/api/auth/login
3. Verify JWT: Check token expiration (24h)
4. Test rate limiting: 5+ failed attempts should block

## Checklist
- [x] Tests passing
- [x] Code coverage >80%
- [x] No console errors
- [x] API docs updated
- [x] Database migrations run
```
