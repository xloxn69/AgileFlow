# Changelog

All notable changes to the AgileFlow plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-10-16

### Added

**New Automation & DevOps Commands** (13 total):
- `/dependency-update` - Automated dependency tracking and security audits
- `/dependencies-dashboard` - Visual overview of all project dependencies
- `/docs-sync` - Synchronize documentation with codebase changes
- `/impact-analysis` - Analyze impact of code changes on tests and features
- `/tech-debt` - Track and prioritize technical debt with scoring
- `/agent-feedback` - Collect feedback for continuous process improvement
- `/setup-tests` - Automated testing infrastructure setup for any project type
- `/ai-code-review` - AI-powered code review with security and performance checks
- `/auto-story` - Generate user stories from PRDs, mockups, or API specs
- `/generate-changelog` - Auto-generate changelog from commits and PRs
- `/setup-deployment` - Automated deployment pipeline setup (Vercel, Netlify, Heroku, AWS, Docker, EAS)
- `/custom-template` - Create and manage custom document templates
- `/stakeholder-update` - Generate stakeholder communication reports

**New Subagent**:
- `agileflow-devops` - DevOps & Automation specialist subagent
  - Manages all 13 new automation commands
  - Handles dependencies, deployment, testing, code quality
  - Tracks technical debt and generates reports
  - Works on stories tagged `owner: AG-DEVOPS`

**Enhanced Subagents**:
- Converted agents to proper Claude Code subagent format with YAML frontmatter
- All subagents now operate in separate context windows
- Added `agileflow-mentor` (replaces `/babysit` command functionality)
- Added `agileflow-epic-planner` for feature planning
- Added `agileflow-adr-writer` for decision documentation
- Added `agileflow-research` for technical research

### Changed
- Upgraded from 3 agents to 8 specialized subagents
- Increased command count from 21 to 34
- Enhanced plugin description to include automation features
- Updated README with comprehensive automation & DevOps documentation
- Added SUBAGENTS.md guide for using all subagents

### Improved
- Better separation of concerns across specialized subagents
- More comprehensive automation coverage
- Enhanced DevOps workflows
- Better code quality enforcement
- Improved stakeholder communication

### Technical
- Plugin version bumped to 2.0.0 (major release)
- All subagent files now follow proper format with YAML frontmatter
- Added tool specifications to subagent definitions
- Enhanced agent boundaries and responsibilities

## [1.0.0] - 2025-10-16

### Added
- Initial release of AgileFlow plugin
- 21 slash commands for agile workflow management
- Epic and story management commands
- Architecture Decision Record (ADR) support
- Multi-agent collaboration via message bus
- ChatGPT integration commands for research and context sharing
- Three specialized agents: AG-UI, AG-API, AG-CI
- Complete template system for epics, stories, ADRs, agents, research
- Idempotent system setup with `/setup-system`
- Interactive `/babysit` mentor mode
- Status tracking and handoff documentation
- CI bootstrapping with `/ci-setup`
- README synchronization with `/readme-sync`
- Research notes management with `/research-init`

### Features
- Framework-agnostic design works with any tech stack
- Diff-first, YES/NO confirmation for all file operations
- JSON validation for status and message bus
- OS/runtime detection
- Optional GitHub token and branch protection setup
- WIP limits (max 2 stories per agent)
- Conventional Commits support
- Test-driven workflow with acceptance criteria
