# CHANGELOG Examples

## Good Example: Feature Release

```markdown
## [1.5.0] - 2025-01-15

### Added
- Add user profile editing with real-time validation
- Add avatar upload with automatic image resizing
- Add export reports to PDF functionality
- Add keyboard shortcuts for common actions (Ctrl+S to save, etc.)

### Changed
- Improve search performance by 80% with database indexing
- Update notification system to use WebSockets instead of polling
- Enhance error messages with actionable suggestions

### Fixed
- Fix memory leak in image processing causing crashes after 100+ uploads
- Resolve timezone issue in date calculations for international users
- Correct calculation error in monthly sales reports

### Security
- Patch XSS vulnerability in user comment system (CVE-2025-12345)
- Update bcrypt dependency to address timing attack vulnerability

Closes #45, #67, #89
```

## Good Example: Breaking Change Release

```markdown
## [2.0.0] - 2025-02-01

### Added
- Add GraphQL API alongside REST endpoints
- Add real-time notifications via WebSocket
- Add admin dashboard for user management

### Changed
- **BREAKING**: Change authentication from session-based to JWT tokens
  - Old format: Sessions stored server-side with cookie-based auth
  - New format: JWT tokens in Authorization header
  - Migration guide: docs/migrations/auth-v2.md
  - Backwards compatibility support until v3.0.0

- **BREAKING**: Rename API endpoints for consistency
  - `/api/users` → `/api/v2/users`
  - `/api/posts` → `/api/v2/articles`
  - Full mapping: docs/api-v2-endpoints.md

### Removed
- Remove deprecated `/api/v1/legacy` endpoints (use `/api/v2` instead)
- Delete Internet Explorer 11 support

### Fixed
- Fix race condition in concurrent file uploads
- Resolve SQL injection vulnerability in search functionality

### Migration
- See full migration guide: docs/migrations/v2.0.0.md
- Automated migration script: scripts/migrate-to-v2.sh

Closes #12, #34, #56
```

## Good Example: Patch Release

```markdown
## [1.4.3] - 2025-01-20

### Fixed
- Fix login redirect loop for users with special characters in email
- Resolve CSS rendering issue in Safari 17+
- Correct timestamp formatting in exported CSV files

### Security
- Update lodash dependency to patch prototype pollution vulnerability
```

## Good Example: Multiple Features

```markdown
## [1.6.0] - 2025-03-10

### Added

**User Experience**
- Add dark mode toggle with system preference detection
- Add customizable keyboard shortcuts
- Add offline mode support with service workers

**API Enhancements**
- Add rate limiting with configurable thresholds
- Add webhook support for real-time integrations
- Add API versioning (v1, v2) with deprecation warnings

**Developer Tools**
- Add TypeScript type definitions
- Add Swagger/OpenAPI documentation
- Add development environment using Docker Compose

### Changed
- Improve dashboard load time from 3s to <500ms
- Update UI components to use design system v2
- Enhance accessibility (WCAG 2.1 AA compliance)

### Fixed
- Fix pagination issue with filtered results
- Resolve mobile menu not closing after navigation
- Correct date range picker timezone handling

### Deprecated
- Deprecate `/api/v1/users` endpoint (use `/api/v2/users`)
  - Will be removed in v2.0.0 (planned for 2025-Q3)

Closes #78, #90, #112, #145
```

## Bad Example: Too Vague

```markdown
❌ Don't do this:

## [1.2.0] - 2025-01-15

### Added
- New stuff

### Fixed
- Bugs

### Changed
- Things
```

## Bad Example: Too Technical

```markdown
❌ Don't do this:

## [1.3.0] - 2025-01-20

### Added
- Implement RedisCache adapter extending AbstractCacheProvider
- Add MutationObserver for DOM change detection in FormValidator

### Fixed
- Refactor UserRepository.findByEmail to use QueryBuilder
- Modify webpack config to enable tree-shaking
```

**Better (user-focused)**:
```markdown
✅ Do this instead:

## [1.3.0] - 2025-01-20

### Added
- Add Redis caching for 10x faster data retrieval
- Add real-time form validation with instant feedback

### Fixed
- Improve user lookup performance by 50%
- Reduce JavaScript bundle size by 30%
```

## Unreleased Section Example

```markdown
## [Unreleased]

### Added
- Add two-factor authentication (in development)
- Add CSV export for analytics dashboard (pending review)

### Fixed
- Fix dropdown menu positioning on mobile (merged, awaiting release)
```
