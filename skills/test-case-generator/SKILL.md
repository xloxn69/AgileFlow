# test-case-generator

Generate test cases from acceptance criteria.

## Activation Keywords
- "test cases", "test plan", "from AC", "test from acceptance"

## When to Use
- Converting acceptance criteria to test cases
- Creating test stubs for new features
- Planning test coverage

## What This Does
Converts Given/When/Then acceptance criteria into:
- **Unit test cases** (if applicable)
- **Integration test cases** (API, database)
- **E2E test cases** (full user workflow)
- **Negative test cases** (error scenarios)
- **Edge cases** (boundary conditions)

Generates test case names, setup steps, assertions, and expected results.

Coordinates with agileflow-testing and agileflow-qa agents.

## Output
Test case stub at docs/07-testing/test-cases/<STORY_ID>.md

## Example Activation
User: "Generate test cases from user login AC"
Skill: Generates:
```markdown
## Test Cases for User Login (US-0001)

### TC-001: Valid login succeeds
Given: Valid user registered with email/password
When: POST to /api/auth/login with valid credentials
Then: Returns 200 with JWT token (24h expiration)

### TC-002: Wrong password fails
Given: User exists, wrong password provided
When: POST to /api/auth/login
Then: Returns 401 with error message

### TC-003: Rate limiting active
Given: User failed login 5 times
When: Attempt 6th login
Then: Returns 429 Too Many Requests

### TC-004: Invalid email format
Given: Malformed email address
When: POST to /api/auth/login
Then: Returns 400 Bad Request

### Edge Cases
- Empty email/password
- SQL injection attempts
- Token validation after expiration
```
