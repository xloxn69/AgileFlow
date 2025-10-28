# Good Commit Message Examples

## Simple Feature Addition

```
feat(auth): add password reset via email

Users can now request a password reset link sent to their
registered email address. The link expires after 1 hour.

Closes #456
```

## Bug Fix with Context

```
fix(cart): prevent duplicate items in shopping cart

Fixed race condition where clicking "Add to Cart" rapidly
could add the same item multiple times. Added debouncing
and server-side validation.

Fixes #789
```

## Refactoring with Explanation

```
refactor(api): extract authentication middleware

Moved authentication logic from individual route handlers
into reusable middleware. This reduces code duplication
and makes auth logic easier to maintain and test.

No behavioral changes.
```

## Breaking Change

```
feat(api)!: migrate to v2 response format

BREAKING CHANGE: All API endpoints now return data wrapped
in a standardized envelope format.

Before: { id: 1, name: "..." }
After: { data: { id: 1, name: "..." }, meta: { version: 2 } }

Migration guide: docs/api-v2-migration.md

Closes #234
```

## Multiple Related Changes

```
feat(profile): add profile editing and avatar upload

- Implemented profile form with field validation
- Added avatar upload with client-side image cropping
- Created PUT /api/users/:id endpoint
- Added error handling for file size limits
- Wrote unit tests for profile update logic

Closes #123, #124
```

## Documentation

```
docs(readme): add installation instructions for Docker

Added step-by-step guide for running the application
in Docker containers, including environment variable
configuration and volume mounting.
```

## Performance Improvement

```
perf(db): add index on user email column

Query performance for user lookup by email improved from
~500ms to ~5ms. Added composite index on (email, status)
for common query patterns.
```

## Dependency Update

```
chore(deps): upgrade React to v18.2

Updated React and React DOM to latest stable version.
Migrated deprecated lifecycle methods in UserProfile
and Dashboard components.

Tested with full E2E suite - all tests passing.
```

## CI/CD Change

```
ci(github): add automated dependency updates

Configured Dependabot to create PRs for npm package
updates weekly. Auto-merge enabled for patch updates
that pass all tests.
```

## Revert

```
revert: feat(payments): add Stripe integration

This reverts commit abc123def456.

Stripe webhook validation is failing in production.
Reverting to investigate HMAC signature verification
before re-deploying.
```
