---
story_id: US-0001
epic: EP-0001
title: Implement User Login API Endpoint
owner: AG-API
status: ready
estimate: 1d
created: 2025-10-28
updated: 2025-10-28
dependencies: []
test_status: passing
test_results:
  last_run: 2025-10-28T16:30:00Z
  command: npm test
  passed: 15
  failed: 0
  exit_code: 0
  output_summary: "All tests passed (15/15)"
session_metadata:
  last_session_start: 2025-10-28T09:00:00Z
  session_count: 1
  agents_involved: ["agileflow-api"]
---

# US-0001: Implement User Login API Endpoint

**Epic**: EP-0001
**Owner**: AG-API
**Estimate**: 1d

## Description

Implement a secure POST /api/auth/login endpoint that authenticates users with email and password credentials, returning a JWT token for authenticated requests. This is the first API endpoint in the authentication flow and is foundational for all user-specific operations.

## Acceptance Criteria

- **Given** a user with valid email and password
  **When** they POST to /api/auth/login with credentials
  **Then** they receive a JWT token with 24h expiration and success response (HTTP 200)

- **Given** a user with invalid email
  **When** they attempt login
  **Then** they receive error response "User not found" (HTTP 404) without token

- **Given** a user with correct email but wrong password
  **When** they attempt login
  **Then** they receive error response "Invalid password" (HTTP 401) after rate limit check

- **Given** 5 failed login attempts from same IP in 15 minutes
  **When** another login attempt occurs
  **Then** request is rate-limited with "Too many attempts" (HTTP 429) for 15 minutes

- **Given** a valid JWT token from login
  **When** used in Authorization header as "Bearer {token}"
  **Then** downstream endpoints validate token and accept authenticated request

## Architecture Context

<!-- AUTO-FILLED by epic-planner: Extract ONLY relevant architecture sections from docs/04-architecture/ -->
<!-- Include file locations, data models, API endpoints, component specs, testing requirements -->
<!-- Every technical detail MUST cite its source: [Source: architecture/api.md#endpoints] -->

### Data Models & Schemas

User model structure includes email (unique), password_hash (bcrypt), and created_at timestamp [Source: architecture/data-models.md#user-model]. Password storage MUST use bcrypt with min salt rounds of 10 [Source: architecture/security.md#password-hashing]. JWT payload structure contains user_id, email, iat, and exp claims [Source: architecture/api-spec.md#jwt-structure].

### API Specifications

**Endpoint**: `POST /api/auth/login` [Source: architecture/api-spec.md#authentication-endpoints]

**Request Format**:
```json
{
  "email": "user@example.com",
  "password": "plaintext_password"
}
```
[Source: architecture/api-spec.md#login-request]

**Success Response (200)**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user-123",
    "email": "user@example.com"
  }
}
```
[Source: architecture/api-spec.md#login-response]

**Error Responses**: 404 for user not found, 401 for invalid password, 429 for rate limiting [Source: architecture/api-spec.md#error-codes]

**Authentication Method**: JWT with RS256 algorithm, 24-hour expiration [Source: architecture/security.md#jwt-config]

### Component Specifications

Not applicable - this is a backend API endpoint story

### File Locations & Naming

Backend models: `src/models/User.ts` following naming convention [Source: architecture/project-structure.md#backend-models]
API routes: `src/routes/auth.ts` for all authentication endpoints [Source: architecture/project-structure.md#api-routes]
Controllers: `src/controllers/AuthController.ts` with login method [Source: architecture/project-structure.md#controllers]
Tests: `src/routes/__tests__/auth.test.ts` following co-location pattern [Source: architecture/testing-strategy.md#test-location]

### Testing Requirements

Unit tests for bcrypt verification and JWT generation [Source: architecture/testing-strategy.md#unit-tests]
Integration tests for full login flow (request → database → response) [Source: architecture/testing-strategy.md#integration-tests]
Rate limiting tests with mock Redis client [Source: architecture/testing-strategy.md#mocking]
Security tests for password handling (never logged, never returned in response) [Source: architecture/security-testing.md#password-testing]

Minimum coverage: 85% line coverage, 100% branch coverage for auth logic [Source: architecture/testing-strategy.md#coverage-requirements]

### Technical Constraints

- Password must NEVER be returned in any API response [Source: architecture/security.md#password-handling]
- Rate limiting uses Redis with key format: `login_attempts:{ip}:{email}` [Source: architecture/infrastructure.md#redis-usage]
- Database queries must use parameterized queries to prevent SQL injection [Source: architecture/security.md#sql-injection-prevention]
- JWT secret stored in environment variable: `JWT_SECRET` [Source: architecture/config.md#environment-variables]
- Minimum Node.js version: 18.x [Source: architecture/tech-stack.md#backend-runtime]

## Technical Notes

Rate limiting strategy: Use Redis INCR with 15-minute expiration. Implementation detail to prevent brute force attacks within acceptable performance (sub-100ms latency required) [Source: architecture/performance.md#api-latency-targets]

## Testing Strategy

See: `docs/07-testing/test-cases/US-0001.md`

## Dependencies

No dependencies - this is the foundational authentication endpoint

## Dev Agent Record

<!-- POPULATED BY DEVELOPMENT AGENT DURING IMPLEMENTATION -->

### Agent Model & Version

Claude Sonnet (claude-3-5-sonnet-20241022)

### Completion Notes

Implemented POST /api/auth/login with bcrypt password verification and JWT token generation. All acceptance criteria met. Rate limiting implemented using Redis INCR with 15-minute TTL.

**Deviations from plan**: Initially planned to use session-based auth, but JWT approach provides better scalability for distributed systems per architecture guidance [Source: architecture/api-spec.md#jwt-rationale].

**Actual time vs estimate**: 1 day (matched estimate)

### Issues Encountered

**Challenge 1**: JWT token verification in downstream endpoints - solved by creating shared middleware at `src/middleware/authMiddleware.ts` for consistent token validation across all protected routes.

**Challenge 2**: Rate limiting edge case where Redis connection failure could block all logins - solved by implementing graceful degradation: if Redis unavailable, skip rate limiting but log warning (fail-open for availability).

**Bug Fixed**: Initial implementation returned user.password_hash in response despite security.md guidance - fixed by explicitly excluding password field from response serialization.

### Lessons Learned

1. **Pattern**: Middleware-based auth validation works well across all routes - recommend same pattern for other cross-cutting concerns (logging, error handling)

2. **Gotcha**: Redis rate limiting keys need careful TTL management - keys that don't expire create memory leaks. Solved with explicit EXPIRE command.

3. **Security insight**: Even though password is hashed in DB, returning error messages "User not found" vs "Invalid password" leaks whether user exists. Considered returning single error message but stakeholders accepted enumerated responses for UX clarity.

### Files Modified

- `src/models/User.ts` - Added login() method with bcrypt verification
- `src/controllers/AuthController.ts` - New file for login endpoint logic
- `src/routes/auth.ts` - New file for /api/auth/login route definition
- `src/middleware/authMiddleware.ts` - New file for JWT validation middleware
- `src/routes/__tests__/auth.test.ts` - Test suite with 15 test cases
- `src/config/jwt.ts` - JWT configuration (expiration, algorithm)
- `.env.example` - Added JWT_SECRET and REDIS_URL variables

### Debug References

- Test run: https://ci.example.com/builds/12345 (all 15 tests passing)
- Load test results: https://metrics.example.com/dashboards/auth-latency (avg 85ms, p99 120ms)
- Security scan: https://security.example.com/reports/us-0001 (no vulnerabilities)

## Previous Story Insights

<!-- POPULATED FROM PREVIOUS STORY IN THIS EPIC -->

First story in EP-0001 authentication epic - no previous story insights available.

---

**Example Notes for Future Stories**:
- If this were a follow-on story (e.g., US-0002 for password reset), this section would contain:
  - Key learnings: "JWT middleware pattern works well, reuse for all auth endpoints"
  - Architectural patterns: "Middleware-based validation cleanly separates concerns"
  - Technical debt: "Redis rate limiting needs monitoring - consider metrics dashboard in next story"
