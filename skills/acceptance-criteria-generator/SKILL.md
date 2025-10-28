# acceptance-criteria-generator

Generate properly-formatted Given/When/Then acceptance criteria.

## Activation Keywords
- "AC", "acceptance criteria", "Given When Then", "given when then", "acceptance", "criteria"

## When to Use
- User is writing acceptance criteria
- Need to format AC in proper Given/When/Then structure
- Ensuring clarity and testability of requirements

## What This Does
Takes user's plain English requirements and converts to structured Given/When/Then format:
- **Given**: Initial state/preconditions
- **When**: User action or trigger
- **Then**: Expected outcome/result

Generates multiple AC items if needed (typically 2-5 per story).

Ensures each criterion is:
- Testable (not vague)
- Independent (doesn't depend on other AC)
- Clear (unambiguous language)
- Measurable (has a clear success/failure)

## Output
Well-formatted acceptance criteria ready to add to story.

## Example Activation
User: "User should be able to log in with email and password, and receive a JWT token"
Skill: Generates:
```
- **Given** a registered user with valid email and password
  **When** user POSTs to /api/auth/login with credentials
  **Then** they receive a 200 response with JWT token (24h expiration)

- **Given** a user enters wrong password
  **When** they attempt login
  **Then** they receive 401 Unauthorized and rate limit applied
```
