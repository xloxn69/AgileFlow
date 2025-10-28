# changelog-entry

Generate Keep a Changelog format entries.

## Activation Keywords
- "changelog", "release notes", "version notes", "changelog entry"

## When to Use
- Creating release notes for new version
- Documenting changes for changelog
- Preparing version announcement

## What This Does
Generates changelog entries in Keep a Changelog format:
- **Version header** with date (YYYY-MM-DD)
- **Categories**: Added, Changed, Fixed, Improved, Deprecated, Removed, Security
- **Detailed descriptions** of each change
- **Breaking changes** clearly marked
- **Links to related issues/PRs**
- **Migration guides** for breaking changes

Can auto-extract changes from commit messages if provided.

## Output
Ready-to-add section for CHANGELOG.md

## Example Activation
User: "Version 2.18.0 - Added 8 new agents"
Skill: Generates:
```markdown
## [2.18.0] - 2025-10-28

### Added
- **Documentation Agent** - Technical docs, API documentation, user guides
- **Monitoring Agent** - Observability, logging, metrics, alerting
- **Compliance Agent** - GDPR, HIPAA, SOC2 compliance
- **Design Agent** - Design systems, component specs
- **Accessibility Agent** - WCAG compliance, a11y testing
- **Analytics Agent** - Event tracking, product analytics
- **Data Migration Agent** - Zero-downtime migrations
- **QA Agent** - Test strategy, release gates

### Changed
- Expanded agent ecosystem from 17 to 25 agents
- Improved agent coverage for enterprise features

### Improved
- Added comprehensive monitoring and compliance support
- Enhanced quality assurance gates
```
