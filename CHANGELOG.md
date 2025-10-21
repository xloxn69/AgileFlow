# Changelog

All notable changes to the AgileFlow plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.7.0] - 2025-10-21

### Improved

**All Agents Now Proactive with Shared Vocabulary and Cross-Agent Coordination**

This is a major enhancement to agent intelligence and coordination. All 8 agents now:

#### 🗣️ **Shared Vocabulary** - Consistent terminology across all agents
- **Common Terms**: Story, Epic, AC, DoR, DoD, Bus, WIP, Blocker, Unblock, Handoff, Research Note, ADR, Test Stub
- **Agent IDs**: MENTOR, AG-UI, AG-API, AG-CI, AG-DEVOPS, EPIC-PLANNER, ADR-WRITER, RESEARCH
- **Standardized Bus Message Formats**:
  ```jsonl
  {"ts":"<ISO>","from":"<AGENT-ID>","type":"status|blocked|unblock|assign|handoff|question|research-request|research-complete","story":"<US-ID>","text":"<description>"}
  ```
- **Agent-Specific Terminology**: Each agent has domain-specific vocabulary (Component, Endpoint, Pipeline, Migration, Vulnerability, etc.)

#### 🔄 **Proactive FIRST ACTION** - All agents now load knowledge before asking user
- **Knowledge Loading** (automatic on first message):
  - Read `docs/09-agents/status.json` → Current story statuses, WIP, blockers
  - Read `docs/09-agents/bus/log.jsonl` (last 10 messages) → Recent coordination
  - Read `CLAUDE.md` → Project-specific conventions and architecture
  - Check `docs/10-research/` → Existing research notes
  - Check `docs/03-decisions/` → Architectural constraints from ADRs
  - Check `.mcp.json` → Notion/GitHub sync enabled?

- **Status Summaries** (provided before asking user):
  - **MENTOR**: "AgileFlow active. X stories in progress, Y ready, Z blocked. ⚠️ 2 stories blocked: [list]"
  - **AG-UI**: "3 UI stories ready, 1 in progress, 2 blocked on AG-API. ⚠️ Blocked: US-0042 needs API endpoint"
  - **AG-API**: "2 API stories ready, 1 in progress. ⚠️ CRITICAL: 2 AG-UI stories blocked waiting for endpoints"
  - **AG-CI**: "CI found: GitHub Actions, 3 workflows, last run: passing. 1 CI story ready"
  - **AG-DEVOPS**: "47 dependencies, 3 outdated, 2 vulnerabilities (1 critical). 🚨 CRITICAL: CVE-2024-XXXX in lodash"
  - **EPIC-PLANNER**: "Team capacity: 3 agents at WIP limit, 2 available. Last epic: EP-0005 (4/6 stories done)"
  - **ADR-WRITER**: "Next ADR: ADR-0006. Recent decisions: [last 3 ADRs]. Found research: auth patterns"
  - **RESEARCH**: "15 research notes, 3 >90 days old (stale). ⚠️ Stale: JWT auth (210 days old). 📋 Pending: AG-API requested OAuth2 research"

- **Auto-Suggestions** (prioritized actions with context):
  - Format: `US-####: <title> (estimate: <time>, priority: <why>, impact: <what>, unblocks: <story-ids>)`
  - Includes file paths: `docs/06-stories/EP-####/US-####.md`
  - **AG-API prioritizes** stories that unblock AG-UI
  - **AG-DEVOPS prioritizes** critical security vulnerabilities
  - **RESEARCH** suggests stale research to refresh

#### 🔗 **Cross-Agent Dependency Handling** - Especially AG-UI ↔ AG-API
- **AG-UI Blocking Pattern**:
  ```jsonl
  // AG-UI marks story as blocked
  {"ts":"2025-10-21T10:00:00Z","from":"AG-UI","type":"blocked","story":"US-0042","text":"Blocked: needs GET /api/users/:id endpoint from US-0040"}

  // AG-API actively checks for AG-UI blockers before starting work
  // When AG-API completes endpoint, sends unblock message
  {"ts":"2025-10-21T10:15:00Z","from":"AG-API","type":"unblock","story":"US-0040","text":"API endpoint GET /api/users/:id ready (200 OK, user object), unblocking US-0042"}

  // AG-UI monitors bus, sees unblock, resumes work
  {"ts":"2025-10-21T10:16:00Z","from":"AG-UI","type":"status","story":"US-0042","text":"Unblocked, resuming implementation"}
  ```

- **AG-API Proactive Coordination**:
  - **CRITICAL**: Before starting API story, checks `bus/log.jsonl` for blocked AG-UI stories
  - Prioritizes API stories that unblock AG-UI (shown in FIRST ACTION)
  - After completing endpoint, actively sends unblock message with endpoint details (method, path, response format)
  - Updates `status.json`: changes blocked AG-UI story from `blocked` → `ready`

- **Other Common Patterns**:
  - **AG-CI** → AG-UI/AG-API: Test infrastructure ready messages
  - **AG-DEVOPS** → All agents: Critical security vulnerability alerts
  - **RESEARCH** → Requesting agent: Research complete notifications
  - **MENTOR** → Specialized agents: Dependency resolution and unblocking

#### 🎯 **Agent Coordination Shortcuts** - Quick reference for who handles what
- **AG-UI**: Components, styling, design systems, accessibility, user interactions
- **AG-API**: Endpoints, business logic, data models, database, external integrations
- **AG-CI**: Test infrastructure, CI/CD pipelines, linting, code coverage, quality tools
- **AG-DEVOPS**: Dependencies, deployment, technical debt, impact analysis, changelogs, security
- **EPIC-PLANNER**: Breaking features into epics/stories, AC writing, estimation, dependency mapping
- **ADR-WRITER**: Architecture decisions, alternatives analysis, consequence documentation
- **RESEARCH**: Technical research, ChatGPT prompt building, stale research identification
- **MENTOR**: End-to-end orchestration, story creation, research integration, agent coordination

#### 📊 **Dependency Handling Protocols** - Formal blocking/unblocking process
- **When Story Has Dependencies**:
  1. Mark status as `blocked` in `status.json`
  2. Append bus message with blocker details
  3. Check if blocking story exists (create if needed)
  4. Sync to Notion/GitHub (stakeholders see blocker)

- **When Removing Blocker**:
  1. Update `status.json`: change story from `blocked` to `ready`
  2. Append bus message: unblock notification with details
  3. Sync to Notion/GitHub
  4. Notify assigned agent if they're waiting

- **Examples**:
  - AG-UI blocked on AG-API endpoint → Bus message + prioritize API story
  - AG-API blocked on database migration → Coordinate with AG-DEVOPS
  - AG-CI blocked on test data → Request fixtures from AG-API

#### 🛠️ **Enhanced Agent Context** - Every agent knows:
- **AgileFlow System Overview**: Docs structure, story lifecycle, coordination files, WIP limits
- **Slash Commands**: Which commands they can invoke autonomously
- **Agent Coordination**: When to delegate to specialized agents
- **Research Integration**: Check existing research, invoke `/AgileFlow:chatgpt-research` when needed
- **Notion/GitHub Auto-Sync**: Sync after status changes (if enabled)
- **CLAUDE.md Maintenance**: When to update project conventions

### Added

**Specialized Agent Features**:

- **AG-UI**:
  - Design system check on first story (proactive detection)
  - Monitors bus for AG-API unblock messages
  - Checks for blocked UI stories waiting on endpoints

- **AG-API**:
  - **CRITICAL**: Actively searches for blocked AG-UI stories on first message
  - Prioritizes stories that unblock AG-UI
  - Includes endpoint details in unblock messages

- **AG-CI**:
  - CI health check on first message (platform, workflows, last run status)
  - Proactive audit offers (flaky tests, slow builds, coverage gaps)

- **AG-DEVOPS**:
  - Proactive security scan on first message (dependencies, vulnerabilities)
  - Flags critical vulnerabilities with CVE IDs
  - Prioritizes security issues in recommendations

- **EPIC-PLANNER**:
  - Team capacity check before planning (WIP limits)
  - Warns if team at max capacity
  - Auto-syncs to Notion after creating epics/stories

- **ADR-WRITER**:
  - Checks for supporting research before writing ADR
  - Offers to invoke `/AgileFlow:chatgpt-research` if alternatives unknown
  - Links ADRs to research notes

- **RESEARCH**:
  - Scans for stale research (>90 days old) on first message
  - Checks bus for pending research requests from other agents
  - Identifies ADRs lacking supporting research

- **MENTOR**:
  - Comprehensive status summary on first message
  - Auto-proposes 3-7 prioritized actions from knowledge index
  - Proactive blocker detection and resolution

### Changed

- All 8 agent prompts completely rewritten with enhanced intelligence
- `agents/agileflow-mentor.md` - Added shared vocabulary, dependency protocols, proactive FIRST ACTION
- `agents/agileflow-ui.md` - Added vocabulary, AG-API coordination, dependency handling, proactive status
- `agents/agileflow-api.md` - Added vocabulary, AG-UI unblocking patterns, proactive blocker detection
- `agents/agileflow-ci.md` - Added vocabulary, health checks, proactive audit offers
- `agents/agileflow-devops.md` - Added vocabulary, security scans, proactive vulnerability alerts
- `agents/agileflow-epic-planner.md` - Added vocabulary, capacity checks, auto-sync
- `agents/agileflow-adr-writer.md` - Added vocabulary, research integration, proactive context
- `agents/agileflow-research.md` - Added vocabulary, stale research detection, agent coordination
- Plugin version bumped to 2.7.0 (minor release - enhanced agent intelligence)

### Technical

**Key Behavioral Changes**:
- Agents load knowledge BEFORE asking user (not after)
- Agents provide status summaries automatically
- Agents auto-suggest prioritized actions with reasoning
- AG-API actively seeks blocked AG-UI stories and prioritizes their unblocking
- AG-DEVOPS proactively scans for security issues on first message
- All agents use standardized bus message formats
- Consistent terminology across all agent communication

**What This Means**:
- ✅ **Better Coordination**: Agents communicate via standardized bus messages
- ✅ **Reduced Latency**: AG-API unblocks AG-UI proactively (no manual coordination)
- ✅ **Proactive Intelligence**: Agents assess state before asking user
- ✅ **Shared Context**: All agents speak same language (vocabulary)
- ✅ **Prioritized Work**: Agents suggest highest-impact actions first
- ✅ **Security Focus**: AG-DEVOPS flags critical vulnerabilities immediately
- ✅ **Research-Driven**: Agents check existing research and identify gaps

## [2.6.0] - 2025-10-19

### Improved

**All Agent Slash Commands Now Match Full Agent Capabilities**

Updated all agent slash commands (`/agent-ui`, `/agent-api`, `/agent-ci`) to fully document what their corresponding subagents do:

- **`/agent-ui` Command** - Now comprehensive with:
  - 🎨 Design system automation (detection, creation, migration)
  - 🧠 Complete UX laws and design fundamentals (Jakob's Law, Miller's Law, Fitts's Law, etc.)
  - ♿ WCAG 2.1 AA accessibility requirements
  - 📋 Full quality checklist
  - 📝 CLAUDE.md maintenance for UI patterns
  - 🔄 Step-by-step workflow

- **`/agent-api` Command** - Now comprehensive with:
  - 🔧 Backend architecture capabilities
  - 🔒 Security and validation practices
  - 📊 Data layer best practices
  - 📝 CLAUDE.md maintenance for API patterns
  - 📋 Full quality checklist
  - 🔄 Complete workflow

- **`/agent-ci` Command** - Now comprehensive with:
  - ⚡ CI/CD pipeline management
  - 🧪 Test infrastructure setup
  - 🔍 Code quality enforcement
  - 📝 CLAUDE.md maintenance for CI/test patterns
  - 📋 Full quality checklist
  - 🎯 Proactive actions (auditing, optimization)

**Why This Matters:**
- Users can now see full agent capabilities from slash commands
- Commands serve as comprehensive reference documentation
- Easier to choose the right agent for the job
- Slash commands and agents stay perfectly in sync

### Added

**CLAUDE.md Maintenance for All Core Agents**

All three core agents (`agileflow-ui`, `agileflow-api`, `agileflow-ci`) now proactively maintain CLAUDE.md:

- **UI Agent** - Documents after:
  - Establishing design system → Token structure and usage
  - Implementing UI patterns → Pattern documentation
  - Adopting styling approach → CSS conventions
  - Documents: Styling system, component patterns, UI conventions, testing standards

- **API Agent** - Documents after:
  - Establishing API architecture → API type, auth, versioning
  - Adding database/ORM → Schema location, migration approach
  - Implementing validation → Validation conventions
  - Documents: API architecture, data layer, code organization, testing standards

- **CI Agent** - Documents after:
  - Setting up CI pipeline → Workflow files, required checks
  - Adding test frameworks → Test commands, organization
  - Configuring quality tools → Linting, formatting, type-check
  - Documents: CI/CD config, testing infrastructure, code quality tools, testing standards

**Benefits:**
- ✅ CLAUDE.md always stays current with project practices
- ✅ AI assistant has accurate context for all future work
- ✅ New team members see documented patterns immediately
- ✅ Reduces "how do we do X?" questions
- ✅ Ensures consistency across features

### Changed

- `agents/agileflow-ui.md` - Added CLAUDE.md maintenance section and updated workflow
- `agents/agileflow-api.md` - Added CLAUDE.md maintenance section and updated workflow
- `agents/agileflow-ci.md` - Added CLAUDE.md maintenance section and updated workflow
- `commands/agent-ui.md` - Completely rewritten to match full agent capabilities
- `commands/agent-api.md` - Completely rewritten to match full agent capabilities
- `commands/agent-ci.md` - Completely rewritten to match full agent capabilities
- Plugin version bumped to 2.6.0 (minor release - enhanced agent features)

### Technical

- All agent workflows now include step for updating CLAUDE.md after significant work
- Slash commands now serve as comprehensive agent documentation
- Added example CLAUDE.md snippets for each agent type
- Documented when/what to update in CLAUDE.md for each specialization

## [2.5.0] - 2025-10-19

### Added

**UI Agent: Proactive Design System Initialization**

The `agileflow-ui` subagent now automatically detects and creates design systems:

- ✅ **Automatic Detection** - Checks for existing design systems before first UI story
  - Scans common locations: `src/styles/`, `src/theme/`, `tailwind.config.js`
  - Detects CSS variables (`:root { --color-*, --spacing-* }`)
  - Searches for hardcoded colors/spacing across components
  - Identifies inconsistent styling patterns

- 🎨 **Smart Design Token Extraction**
  - Scans existing components for hardcoded styles
  - Identifies patterns (most-used colors, spacing values, fonts)
  - Creates consolidated design token file from codebase conventions
  - Learns from existing design language

- 🔧 **Multi-Framework Support**
  - **CSS/Vanilla**: Creates `design-tokens.css` with CSS variables
  - **React/TypeScript**: Creates `tokens.ts` with typed exports
  - **Tailwind CSS**: Updates `tailwind.config.js` with extracted tokens

- 📦 **Comprehensive Token Categories**
  - Colors (primary, semantic, text, backgrounds, borders)
  - Spacing (xs through 2xl, 8px grid system)
  - Typography (font families, sizes, weights, line heights)
  - Shadows (elevation levels)
  - Border radius (component roundness)
  - Breakpoints (responsive design)

- 🔄 **Migration Automation**
  - Offers to refactor existing components
  - Replaces hardcoded values with design tokens
  - Maintains visual consistency during migration
  - Tests components after refactoring

- 📋 **Quality Enforcement**
  - Added checklist item: "Uses design tokens (no hardcoded colors/spacing/fonts)"
  - Workflow step 1: Check design system before implementing UI stories
  - FIRST ACTION: Proactively checks and offers to create design system

**Benefits:**
- ✅ Consistency: All components use same design language
- ✅ Maintainability: Change one value, updates everywhere
- ✅ Theming: Easy to add dark mode or brand variations
- ✅ Accessibility: Ensures consistent contrast ratios
- ✅ Developer Experience: Autocomplete for design tokens
- ✅ Scalability: New components automatically match existing design

### Improved

**Command: /babysit - GitHub MCP Integration**

Updated `/babysit` command to reference GitHub MCP configuration (migrated from legacy approach):

- Updated integration detection to check `.mcp.json` for GitHub MCP server
- Added GitHub sync events alongside Notion sync events
- Updated sync pattern to include both GitHub and Notion integrations
- Clarified that tokens are hardcoded in `.mcp.json` (not read from `.env`)
- Added setup detection for both GitHub and Notion MCP servers
- Updated implementation flow to sync to GitHub/Notion after status changes
- Consistent MCP-based approach across all integrations

**Why This Matters:**
- Ensures `/babysit` mentor uses modern GitHub MCP approach
- Consistent with v2.4.0 GitHub MCP migration
- Automatic bidirectional sync for developer collaboration
- No more references to legacy `.env` or `gh` CLI approach

### Changed

- `commands/babysit.md` - Updated all GitHub integration references to use MCP
- `agents/agileflow-ui.md` - Added design system initialization workflow
- Plugin version bumped to 2.5.0 (minor release - new UI agent capability)

### Technical

- Added "DESIGN SYSTEM INITIALIZATION" section to agileflow-ui agent
- Updated UI agent SCOPE to include design tokens and theme files
- Updated UI agent WORKFLOW to check design system proactively
- Updated UI agent QUALITY CHECKLIST to enforce design token usage
- Updated UI agent FIRST ACTION to check design system before stories
- Removed legacy GitHub CLI references from /babysit command
- Added GitHub MCP sync automation to /babysit implementation flow

## [2.4.0] - 2025-10-19

### Changed

**GitHub Integration: Migrated from GitHub CLI to GitHub MCP**

- ⚡ **No sudo required** - Uses `npx @modelcontextprotocol/server-github` instead of `gh` CLI installation
- 🔧 **Unified MCP configuration** - GitHub joins Notion in `.mcp.json` for consistent setup
- 🚀 **Better portability** - Works across environments without system dependencies
- 📦 **Standardized interface** - MCP provides unified tool API across services
- 🛠️ **Better error handling** - Improved over direct CLI calls with MCP abstraction

**Why We Switched:**
- GitHub CLI requires sudo permissions for installation (friction for users)
- MCP approach is consistent with Notion integration (unified developer experience)
- Automatic installation via npx (no manual setup steps)
- Project-scoped configuration in `.mcp.json` (better team collaboration)

**Updated Documentation:**
- `.mcp.json.example` - Added GitHub MCP server configuration
  ```json
  "github": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github"],
    "env": {
      "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_YOUR_GITHUB_TOKEN_HERE"
    }
  }
  ```
- `/setup-system` - Added GitHub MCP detection and setup instructions
  - Detects existing GitHub MCP configuration
  - Checks if token is still placeholder vs real token
  - Guides users through GitHub PAT creation and configuration
- `/github-sync` - Updated to use GitHub MCP instead of `gh` CLI
  - Prerequisites changed from CLI installation to MCP setup
  - Error handling checks for MCP tools instead of `gh` command
  - Added "Why We Switched" section explaining migration rationale
- `README.md` - Added comprehensive "GitHub Integration (MCP-based)" section
  - Setup instructions matching Notion pattern
  - Team onboarding workflow
  - Security notes about token hardcoding
  - Advantages of MCP approach vs CLI
- `CLAUDE.md` - Updated MCP Integration section
  - Added GitHub alongside Notion and Supabase
  - Documented token format (ghp_*) and required permissions
  - Added setup flow and security notes

**Migration Guide for Existing Users:**

If you were using GitHub CLI (`gh`) for `/github-sync`:

1. **Create GitHub Personal Access Token:**
   - Visit https://github.com/settings/tokens
   - Generate new token (classic) with scopes: `repo`, `read:org`
   - Copy token (starts with `ghp_`)

2. **Update MCP configuration:**
   ```bash
   # If you don't have .mcp.json yet
   cp .mcp.json.example .mcp.json

   # Edit .mcp.json and add your GitHub token
   # Replace "ghp_YOUR_GITHUB_TOKEN_HERE" with your actual token
   # CRITICAL: Token must be hardcoded (env var substitution doesn't work)
   ```

3. **Restart Claude Code** (to load GitHub MCP server)

4. **Continue using /github-sync as before** - All existing `docs/08-project/github-sync-map.json` files remain compatible

5. **Optional: Uninstall GitHub CLI** if you only used it for AgileFlow

**No Breaking Changes:**
- Existing `github-sync-map.json` files are fully compatible
- `/github-sync` command interface unchanged (same DRY_RUN mode, same options)
- Only the underlying implementation changed (MCP tools instead of CLI)

### Improved

- **Consistency** - GitHub and Notion now follow identical MCP setup patterns
- **Security** - All tokens managed in one place (`.mcp.json`), gitignored
- **Developer Experience** - No sudo, no manual installations, just npx and config
- **Team Onboarding** - Same workflow for all integrations (copy template, add token, restart)

### Technical

- Updated `.mcp.json.example` with GitHub MCP server configuration
- Updated `commands/setup-system.md` detection phase to check for GitHub MCP
- Updated `commands/github-sync.md` implementation to use MCP tools
- Updated `README.md` with GitHub integration section (mirrors Notion section)
- Updated `CLAUDE.md` MCP documentation with GitHub details
- Plugin version bumped to 2.4.0 (minor release - new feature, backward compatible)

## [2.3.3] - 2025-10-18

### Fixed

**Documentation: Correct Notion Token Format**

- Fixed incorrect token format in all documentation (Notion tokens start with `ntn_`, not `secret_`)
- Updated `.mcp.json.example` placeholder from `secret_YOUR_NOTION_TOKEN_HERE` to `ntn_YOUR_NOTION_TOKEN_HERE`
- Updated `/setup-system` command to check for correct placeholder format
- Updated README.md Notion integration section
- Added clarification that Notion tokens start with `ntn_`

**Note**: If you copied from v2.3.2 docs and used `secret_` as your placeholder, replace it with `ntn_YOUR_ACTUAL_TOKEN`.

## [2.3.2] - 2025-10-18

### Fixed

**CRITICAL FIX: Notion MCP Token Configuration**

- ⚠️ **Environment variable substitution does NOT work** in `.mcp.json` - Tokens must be hardcoded
- Updated `.mcp.json.example` to show correct approach with placeholder token
- Updated `/setup-system` command to guide users to hardcode tokens
- Updated README.md Notion integration section with correct security model
- Updated CLAUDE.md MCP integration documentation
- Added prominent security warnings about token hardcoding

**What Changed:**
- `.mcp.json.example` now contains `"NOTION_TOKEN": "ntn_YOUR_NOTION_TOKEN_HERE"` (placeholder)
- Users must copy to `.mcp.json` and replace placeholder with real token
- Removed all references to `${NOTION_TOKEN}` environment variable substitution
- Clarified that `.mcp.json` must be gitignored (already was)
- **v2.3.3 update**: Fixed token format (Notion tokens start with `ntn_`, not `secret_`)

**Migration from v2.3.1:**
If you followed v2.3.1 docs and used `${NOTION_TOKEN}`:
1. Open your `.mcp.json` file
2. Replace `"NOTION_TOKEN": "${NOTION_TOKEN}"` with your actual token: `"NOTION_TOKEN": "ntn_your_real_token_here"`
3. Notion tokens start with `ntn_` (not `secret_`)
4. Remove NOTION_TOKEN from `.env` (not used by MCP)
5. Verify `.mcp.json` is in `.gitignore`
6. Restart Claude Code

**Security Notes:**
- `.mcp.json` MUST be gitignored (contains real tokens)
- `.mcp.json.example` is committed (contains only placeholders)
- Each team member needs their own token hardcoded in their local `.mcp.json`
- Never commit `.mcp.json` to version control

### Changed

- `/setup-system` detection now checks if token is still placeholder vs real token
- README Quick Start updated to reflect hardcoded token approach
- All documentation now consistently explains token hardcoding requirement

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
