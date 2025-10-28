---
name: agileflow-changelog
description: Generates CHANGELOG.md entries following Keep a Changelog format when discussing releases, versions, or changes. Auto-categorizes as Added/Changed/Fixed/Deprecated/Removed/Security/Improved.
allowed-tools: Read, Write, Edit
---

# AgileFlow Changelog

## Purpose

This skill automatically generates and maintains CHANGELOG.md entries following the "Keep a Changelog" format, ensuring consistent release documentation.

## When This Skill Activates

Load this skill when:
- User mentions preparing a release or version
- Discussing what changed in a version
- User asks to update the changelog
- Summarizing recent commits or changes
- User mentions "bump version" or "release notes"

## Keep a Changelog Format

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- New features

### Changed
- Changes in existing functionality

### Deprecated
- Soon-to-be removed features

### Removed
- Now removed features

### Fixed
- Bug fixes

### Security
- Vulnerability fixes

## [X.Y.Z] - YYYY-MM-DD

### Added
- Feature description

## [Older versions...]
```

## Categories

### Added
For new features:
- "Add dark mode toggle"
- "Add user profile editing"
- "Add export to PDF functionality"

### Changed
For changes in existing functionality:
- "Change authentication flow to use JWT"
- "Update API response format"
- "Modify user dashboard layout"

### Fixed
For bug fixes:
- "Fix login timeout issue"
- "Resolve memory leak in image processing"
- "Correct calculation in tax computation"

### Deprecated
For soon-to-be removed features:
- "Deprecate /api/v1/users endpoint (use /api/v2/users)"
- "Mark XMLHttpRequest usage as deprecated"

### Removed
For now removed features:
- "Remove legacy authentication module"
- "Delete deprecated API endpoints"

### Security
For vulnerability fixes:
- "Fix SQL injection in search query"
- "Patch XSS vulnerability in user comments"
- "Update dependency with known CVE"

### Improved (Custom Category)
For enhancements to existing features:
- "Improve search performance with indexing"
- "Enhance error messages with more context"
- "Optimize image loading times"

## Semantic Versioning

Determine version number based on changes:

### MAJOR version (X.0.0)
Increment when making incompatible API changes:
- Breaking changes
- Removed functionality
- Changed behavior that breaks existing usage

### MINOR version (0.X.0)
Increment when adding functionality in backwards-compatible manner:
- New features
- New APIs
- Deprecations (but not removals)

### PATCH version (0.0.X)
Increment for backwards-compatible bug fixes:
- Bug fixes
- Performance improvements
- Documentation updates
- Security patches (if backwards-compatible)

## Workflow

1. **Read existing CHANGELOG.md**:
   - Check current version
   - Understand existing format/style
   - Look for [Unreleased] section

2. **Analyze changes**:
   - Review recent commits (`git log`)
   - Ask user about changes if not clear
   - Categorize each change

3. **Determine version bump**:
   - Ask user or infer from change types
   - Follow semantic versioning rules

4. **Generate entry**:
   - Create new version section with today's date
   - Categorize changes appropriately
   - Write clear, concise descriptions
   - Move items from [Unreleased] if present

5. **Format properly**:
   - Use ISO date format (YYYY-MM-DD)
   - Keep categories in order (Added, Changed, Fixed, etc.)
   - Use bullet points with hyphens
   - Write in past tense or imperative mood

## Entry Quality Checklist

Before adding to CHANGELOG:
- [ ] Version number follows semver
- [ ] Date is in ISO format (YYYY-MM-DD)
- [ ] All changes are categorized correctly
- [ ] Descriptions are user-focused (not technical jargon)
- [ ] Breaking changes are clearly marked
- [ ] Links to issues/PRs included where appropriate
- [ ] Grammar and spelling are correct
- [ ] Latest version is at the top

## Examples

See `templates/changelog-examples.md` for good changelog entries.

## Writing Guidelines

### Be User-Focused
```
✅ "Add ability to export reports as PDF"
❌ "Implement PDFKit integration in ReportGenerator class"
```

### Be Concise but Informative
```
✅ "Fix memory leak in image processing that caused crashes after 100+ uploads"
❌ "Fix bug"
```

### Group Related Changes
```
✅
### Added
- Add user authentication with email/password
- Add session management with Redis
- Add password reset functionality

❌
### Added
- Add login
### Changed
- Change session storage
### Added
- Add password reset
```

### Include Context for Breaking Changes
```
✅
### Changed
- **BREAKING**: Change API response format from XML to JSON
  - Migration guide: docs/api-migration-v2.md
  - Old format deprecated but supported until v3.0.0

❌
### Changed
- Change API to JSON
```

## Unreleased Section

Maintain an [Unreleased] section for work in progress:

```markdown
## [Unreleased]

### Added
- Feature currently in development branch

### Fixed
- Bug fix waiting for next release
```

When creating a release, move items from Unreleased to the new version.

## Integration with Other Skills

- **agileflow-commit-messages**: Commit messages inform changelog entries
- **agileflow-story-writer**: Story titles/descriptions can be used in changelog

## Multiple Changes in One Entry

For complex releases, provide subsections:

```markdown
## [2.0.0] - 2025-01-15

### Added

**Authentication**
- Add OAuth2 integration with Google and GitHub
- Add two-factor authentication support
- Add session management with automatic renewal

**User Interface**
- Add dark mode toggle with system preference detection
- Add accessibility improvements (ARIA labels, keyboard navigation)
- Add responsive design for mobile devices

### Changed

**BREAKING CHANGES**
- Change authentication API from v1 to v2 format
  - Old: POST /auth with username/password in body
  - New: POST /auth/login with credentials in JSON format
  - Migration guide: docs/auth-migration.md
```

## Notes

- Always update the [Unreleased] section when adding features
- When releasing, move [Unreleased] items to new version section
- Include links to issues/PRs for traceability
- Use comparison links at bottom: `[1.0.0]: https://github.com/user/repo/compare/v0.9.0...v1.0.0`
