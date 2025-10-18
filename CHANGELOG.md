# Changelog

All notable changes to the AgileFlow plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.3.1] - 2025-10-18

### Added

- **`.env.example` template** with comprehensive environment variable documentation
  - NOTION_TOKEN with setup instructions
  - SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY placeholders
  - GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO for GitHub sync
  - Clear instructions for obtaining each token type

### Improved

- **Enhanced `/setup-system` MCP detection** - Now properly detects and reports MCP integration status
  - Detects existing `.mcp.json` (not just `.mcp.json.example`)
  - Checks individual MCP servers (Notion, Supabase) and their configuration
  - Reports three-level status: `.mcp.json` config vs `.env.example` vs actual `.env`
  - Granular status reporting: ✅ Configured / ⚠️ Partially configured / ❌ Missing
  - Offers to add missing environment variables to `.env.example`
  - Updated prompts to handle partial MCP configuration scenarios
  - Better final status summary with detailed MCP integration breakdown
  - Prevents redundant setup prompts when MCP is already configured

### Fixed

- `/setup-system` no longer skips MCP setup when `.mcp.json` already exists
- Environment variable templates now properly documented for all integrations
- Better detection of incomplete MCP setups (config exists but env vars missing)

### Technical

- Updated `commands/setup-system.md` detection phase with improved MCP checks
- Created `.env.example` as committed template (gitignored `.env` for actual secrets)
- Improved status reporting logic for partial configurations
- Added support for detecting multiple MCP servers simultaneously

## [2.3.0] - 2025-10-18

### ⚠️ CRITICAL CORRECTION (2025-10-18 - Same Day)

**Initial documentation was incorrect** - OAuth claims were based on a misunderstanding of Notion's MCP documentation.

**CORRECTED APPROACH**:
- Notion MCP uses `@notionhq/notion-mcp-server` package (NOT `mcp-remote`)
- Still requires NOTION_TOKEN in .env (NOT OAuth via /mcp)
- MCP provides **standardized tool interface**, not authentication
- .mcp.json should be gitignored (contains token references)
- .mcp.json.example committed as template for teams

**What Actually Changed in v2.3.0**:
- Uses MCP tools instead of raw Notion API calls
- Better error handling and rate limiting via MCP
- Project-level .mcp.json configuration (in repo root, not ~/.claude-code/)
- Template-based team setup (.mcp.json.example + individual .env files)
- Each team member still needs their own NOTION_TOKEN

**Corrected Files** (same day):
- `.mcp.json` - Fixed to use @notionhq/notion-mcp-server
- `.gitignore` - Added .mcp.json and .env
- `.mcp.json.example` - Created as template
- `commands/setup-system.md` - Removed OAuth, added token-based setup
- `README.md` - Removed OAuth claims, clarified token requirement
- `commands/babysit.md` - Detection still via .mcp.json (correct)
- `agents/agileflow-mentor.md` - Detection still via .mcp.json (correct)

**Apologies for the confusion** - The initial v2.3.0 release incorrectly claimed OAuth support. This correction was made the same day after user testing revealed the error.

---

### Added

**Notion Integration via Model Context Protocol (MCP)** (CORRECTED):

- Migrated `/notion-export` from direct API calls to MCP tool-based implementation
  - Uses `@notionhq/notion-mcp-server` for standardized tool access
  - Still requires NOTION_TOKEN in .env (token-based, NOT OAuth)
  - MCP provides better error handling and rate limiting
  - Native Claude Code integration with mcp__notion__* tools
  - Project-level .mcp.json configuration (gitignored)
  - .mcp.json.example template for team sharing

- `.mcp.json.example` configuration template
  - Project-scoped MCP server configuration template
  - Committed to git for team sharing
  - Uses env var substitution: ${NOTION_TOKEN}
  - Each team member copies to .mcp.json and adds their own token

- Enhanced `/setup-system` for MCP
  - Interactive Notion integration setup wizard
  - Creates .mcp.json.example template
  - Updates .gitignore to exclude .mcp.json and .env
  - Guides token setup in .env
  - Database creation via MCP tools
  - Team onboarding instructions

**MCP Tools Integration**:

The `/notion-export` command now uses these Notion MCP tools:
- `notion-search` - Find databases in workspace
- `notion-fetch` - Read database/page content
- `notion-create-database` - Set up AgileFlow databases
- `notion-create-pages` - Export stories/epics/ADRs
- `notion-update-page` - Sync changes back to Notion
- `notion-get-users` - Resolve user assignments
- `notion-get-comments` - Fetch discussions (future)
- `notion-get-teams` - Retrieve teamspaces (future)

**GitHub MCP Documentation**:

- Added future GitHub MCP integration notes to `/github-sync`
- Documented advantages of MCP approach vs GitHub CLI
- Current recommendation: Continue using `gh` CLI for stability
- Prepared for future migration when GitHub MCP matures

### Changed

- **Not Breaking** (Corrected): Notion integration still uses NOTION_TOKEN, now via MCP tools
  - Uses @notionhq/notion-mcp-server package instead of direct API calls
  - Token goes in .env (gitignored), referenced in .mcp.json via ${NOTION_TOKEN}
  - .mcp.json is gitignored, .mcp.json.example is template
  - Existing `notion-sync-map.json` files remain compatible
  - Migration guide updated with correct token-based approach

- Updated README with corrected Notion MCP setup instructions
  - Added "Notion Integration (MCP-based)" section (corrected)
  - Team onboarding workflow documented (token-based)
  - Advantages of MCP tool interface over direct API calls

- Enhanced command descriptions
  - `/github-sync` now mentions "uses GitHub CLI"
  - `/notion-export` now mentions "uses MCP"

### Improved

- 🔒 **Security**: Tokens in .env (gitignored, never committed)
- 👥 **Team Collaboration**: Template-based setup (.mcp.json.example + individual tokens)
- 🚀 **Developer Experience**: MCP tools instead of raw API calls (better errors)
- 🛠️ **Maintenance**: Better error handling and rate limiting via MCP
- 📦 **Portability**: Project-level .mcp.json config (repo root, not ~/.claude-code/)
- 🎯 **Setup Intelligence**: `/setup-system` now detects existing configuration before prompting
  - Shows status summary first (✅ configured / ❌ missing / ⚠️ partial)
  - Only asks about features that aren't set up
  - Final output distinguishes already-configured vs newly-created
  - No redundant setup prompts for existing features
  - Better UX for incremental setup and updates

### Migration Guide (Corrected)

For users of AgileFlow v2.2.0 or earlier with existing Notion integration:

**IF YOU ALREADY HAVE NOTION_TOKEN in .env**:
1. Backup sync map: `cp docs/08-project/notion-sync-map.json{,.backup}`
2. Keep your NOTION_TOKEN in .env (still needed!)
3. Set up MCP: Run `/setup-system` and select "yes" for Notion
4. This creates .mcp.json.example and copies to .mcp.json
5. Restart Claude Code (to load MCP server)
6. Verify: Run `/notion-export DRY_RUN=true`
7. Resume syncing: Run `/notion-export`

**IF STARTING FRESH**:
1. Create Notion integration: https://www.notion.so/my-integrations
2. Add NOTION_TOKEN to .env
3. Run `/setup-system` and select "yes" for Notion
4. Restart Claude Code
5. Run `/notion-export MODE=setup` to create databases
6. Start syncing!

Your existing database IDs are preserved - no need to recreate databases!

### Technical

- Plugin version bumped to 2.3.0 (minor release)
- Added `.mcp.json.example` template to repository root
- Added `.mcp.json` to .gitignore (contains token references)
- Rewrote `/notion-export` implementation to use MCP tools
- Updated `commands/setup-system.md` with corrected token-based MCP setup
- Updated `README.md` to remove OAuth claims, clarify token requirement
- Updated `.mcp.json` to use @notionhq/notion-mcp-server with env var substitution
- Documented MCP tool advantages over direct API calls
- Updated `/babysit` and `agileflow-mentor` to detect Notion via .mcp.json
- Command count remains at 41 in all documentation

## [2.2.0] - 2025-10-17

### Added

**New Data-Driven Analytics Commands**:

- `/metrics` - Comprehensive analytics dashboard
  - Cycle time, lead time, throughput analysis
  - Work In Progress (WIP) tracking with limits
  - Agent utilization and workload distribution
  - Epic health scores and progress tracking
  - Estimation accuracy metrics
  - Blocked story analysis
  - Flow efficiency calculation
  - Cumulative flow diagrams (ASCII visualization)
  - Export formats: ASCII dashboard, JSON, CSV, Markdown
  - Historical trend analysis with comparisons
  - Actionable recommendations based on data
  - Saved reports to docs/08-project/metrics-reports/

- `/retro` - Automated retrospective generator
  - Start/Stop/Continue format insights
  - Pattern detection (velocity changes, blocking trends, estimation drift)
  - Team contribution analysis by agent
  - Action items prioritized by impact
  - Celebration moments for wins
  - Day-of-week productivity patterns
  - Recurring blocker identification
  - Story size efficiency analysis
  - Forward-looking predictions for next sprint
  - Saved to docs/08-project/retrospectives/
  - Integration with /metrics for data-driven insights

- `/dependencies` - Dependency graph visualization and analysis
  - ASCII dependency graph with status indicators
  - Critical path detection with duration estimates
  - Circular dependency detection and warnings
  - Blocking story impact analysis
  - Parallel work opportunity identification
  - Gantt chart generation (dependency-based scheduling)
  - Dependency health scoring
  - Mermaid and GraphViz export formats
  - Epic hierarchy visualization
  - Story-level and epic-level dependency tracking
  - Actionable recommendations for optimal work ordering

**Enhanced /babysit and agileflow-mentor**:
- Added full command catalog to knowledge index (all 41 commands)
- Explicit SlashCommand tool usage instructions
- Autonomous command execution capabilities
- Mandatory Notion/GitHub auto-sync after state changes
- Proactive command orchestration and chaining
- Updated implementation flow with sync steps

**Enhanced /setup-system**:
- Optional Notion integration setup during initialization
- Optional GitHub Issues sync setup
- Token management and .env configuration
- Database setup wizard for Notion
- Label creation for GitHub sync
- One-command complete system setup

### Changed
- Command count increased from 38 to 41
- Plugin version bumped to 2.2.0 (minor release)
- Updated README with new analytics commands
- Enhanced plugin.json with new commands
- Agents now read all command files for full context awareness

### Improved
- Better data-driven decision making with comprehensive metrics
- Automated retrospective insights save hours of manual analysis
- Dependency visualization prevents scheduling disasters
- Proactive problem detection through pattern analysis
- Real-time collaboration with automatic Notion/GitHub sync
- Complete workflow orchestration through babysit/mentor

## [2.1.0] - 2025-10-17

### Added

**New Visualization & Analytics Commands**:
- `/board` - Visual kanban board generator with ASCII/markdown/HTML output
  - Columns: Ready, In Progress, In Review, Done
  - Color coding with emoji indicators (🟢 🟡 🔵 ⚪ 🔴)
  - WIP limit tracking and warnings
  - Grouping by status/owner/epic
  - Statistics: throughput, velocity, completion times
  - Board snapshots for historical tracking
  - Export options for sharing with stakeholders

- `/velocity` - Team velocity tracking and forecasting
  - Historical velocity calculation from completed stories
  - Trend analysis with ASCII charts
  - Per-agent velocity breakdown
  - Epic/milestone completion forecasting with confidence levels
  - Risk analysis for schedule and capacity
  - Capacity planning recommendations
  - Monte Carlo simulation support (advanced)
  - Velocity by story size analysis

**New Integration Commands**:
- `/github-sync` - Bidirectional sync with GitHub Issues
  - Two-way sync: AgileFlow ↔ GitHub
  - Automatic status updates from issue state changes
  - Story → Issue creation with proper labels and milestones
  - Issue → Story import with metadata preservation
  - Conflict resolution with timestamp comparison
  - Label management for status, epic, owner
  - Webhook integration support for real-time sync
  - Dry run mode for previewing changes

- `/notion-export` - Bidirectional sync with Notion databases
  - Sync epics, stories, and ADRs to Notion
  - Rich collaboration with visual project management
  - Database setup wizard for first-time configuration
  - Real-time sync with conflict resolution
  - Team collaboration with non-technical stakeholders
  - Mobile access via Notion app
  - Preserves AgileFlow as source of truth while enabling rich UX

### Changed
- Command count increased from 34 to 38
- Plugin version bumped to 2.1.0 (minor release)
- Enhanced README with new command categories
- Updated plugin.json with new commands

### Improved
- Better visibility into project status with kanban board
- Data-driven forecasting with velocity tracking
- Seamless integration with popular tools (GitHub, Notion)
- Enhanced collaboration capabilities for distributed teams
- More comprehensive project analytics

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
