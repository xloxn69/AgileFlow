# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## ⚠️ CRITICAL: Version Management

**ALWAYS update versions in these 3 files together when making ANY release:**
1. `.claude-plugin/plugin.json` → `"version": "X.Y.Z"`
2. `.claude-plugin/marketplace.json` → `"description"` (mentions version)
3. `CHANGELOG.md` → Add new `[X.Y.Z]` section at top

**Never update just one or two files** - they must always stay in sync.

**ALWAYS PUSH TO GITHUB IMMEDIATELY AFTER COMMITTING** - The marketplace reads from GitHub, not local files. Unpushed commits mean users see the old version.

See "Updating Plugin Version" section below for detailed steps.

---

## Repository Overview

**AgileFlow** is a Claude Code plugin providing a universal agile/docs-as-code system. It's a **command pack** (42 slash commands + 17 subagents), not a traditional application codebase. There is no build step, runtime, or deployment process.

**Current Version**: v2.17.0 (8 new specialized agents for security, database, testing, product, performance, mobile, integrations, and refactoring)

## Architecture

### Plugin Structure

```
AgileFlow/
├── .claude-plugin/
│   ├── plugin.json           # Plugin metadata (version, command/subagent registry)
│   └── marketplace.json      # Marketplace listing
├── commands/                 # 41 slash command definitions (*.md files)
├── agents/                   # 8 subagent definitions (*.md files)
├── templates/                # Document templates for epics, stories, ADRs
├── CHANGELOG.md             # Version history (Keep a Changelog format)
├── README.md                # Plugin documentation
├── SUBAGENTS.md             # Subagent usage guide
├── .mcp.json.example        # MCP server config template (GitHub, Notion, Supabase)
└── .env.example             # Environment variable template
```

### Key Concepts

**Slash Commands** (`/command-name`):
- Defined in `commands/*.md` files
- Each file contains a prompt executed when user runs the command
- Commands are stateless, single-purpose actions
- **Auto-discovered** from `commands/` directory (no manual registration needed)

**Subagents** (invoked via "Use the X subagent to..."):
- Defined in `agents/*.md` files with YAML frontmatter (name, description, tools, model, color)
- Run in separate context windows for focused work
- Have specialized expertise (UI, API, CI, DevOps, planning, research, mentoring, documentation)
- **Auto-discovered** from `agents/` directory (no manual registration needed)

**Skills** (auto-loaded based on context):
- Defined in `skills/*/SKILL.md` files
- Activate automatically based on keywords in user messages
- Provide specialized capabilities (story writing, commit messages, ADRs, acceptance criteria, etc.)
- **Auto-discovered** from `skills/` directory (no manual registration needed)

**AgileFlow System** (created by `/AgileFlow:setup-system` command):
- **Not part of this repository** - created in user's project repos
- Scaffolds `docs/` directory structure (00-meta through 10-research)
- Manages epics, stories, ADRs, agent status, message bus
- All commands operate on this docs structure

### Critical Files

**`.claude-plugin/plugin.json`** - Plugin metadata (minimal, clean format):
```json
{
  "name": "AgileFlow",
  "version": "X.Y.Z",
  "description": "...",
  "author": { "name": "AgileFlow Contributors" },
  "homepage": "https://github.com/xloxn69/AgileFlow"
}
```
- Commands, agents, and skills are **auto-discovered** from directory structure
- Version number is the single source of truth for releases
- No manual registry maintenance needed

**`.claude-plugin/marketplace.json`** - Marketplace metadata:
- Plugin name and owner
- Version description (shown in plugin UI)
- Must stay in sync with `plugin.json` version

**`CHANGELOG.md`** - Version history:
- Follows Keep a Changelog format
- Latest version section must match `plugin.json` version
- Documents all changes per version with Added/Changed/Fixed/Improved sections

## BMAD-METHOD Patterns (v2.16.0+)

AgileFlow now implements key patterns from BMAD-METHOD framework for improved dev agent context awareness and knowledge transfer between stories.

### Architecture Context Extraction

**Purpose**: Extract ONLY relevant architecture sections into each story so dev agents never need to read massive docs.

**How it works**:
1. Epic Planner extracts relevant sections from `docs/04-architecture/` when creating stories
2. Stores in story's "Architecture Context" section with 6 subsections:
   - **Data Models & Schemas**: Specific data structures and validation rules
   - **API Specifications**: Endpoint details, request/response formats
   - **Component Specifications**: UI component details and state management
   - **File Locations & Naming**: Exact paths where new code should go
   - **Testing Requirements**: Test patterns and coverage requirements
   - **Technical Constraints**: Security, performance, version requirements
3. **CRITICAL**: Every technical detail must cite source: `[Source: architecture/{filename}.md#{section}]`
4. Never invent details - only extract from actual architecture docs

**Benefits**:
- Dev agents have self-contained context (reduced token overhead)
- Architecture decisions are verifiable (all sources cited)
- Faster implementation (no doc reading needed)

**Example** (from docs/06-stories/EP-0001/US-0001-user-login-api.md):
```markdown
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
```

### Dev Agent Record (Knowledge Transfer)

**Purpose**: Capture implementation wisdom for knowledge transfer to next stories in epic.

**Populated during implementation** with 6 subsections:
- **Agent Model & Version**: Which AI model was used (e.g., claude-sonnet)
- **Completion Notes**: What was actually built vs. planned (deviations explained)
- **Issues Encountered**: Challenges faced and how resolved
- **Lessons Learned**: Insights for next story (patterns, technical debt discovered)
- **Files Modified**: List of all files created, modified, or deleted
- **Debug References**: Links to test runs, CI logs, decision traces

**Example**:
```markdown
### Completion Notes
Implemented POST /api/auth/login with bcrypt password verification and JWT generation.
All acceptance criteria met. Rate limiting implemented using Redis.

**Deviations**: Initially planned session-based auth, switched to JWT for scalability.

**Time**: 1 day (matched estimate)

### Lessons Learned
1. Middleware-based auth validation works well across routes - recommend for other cross-cutting concerns
2. Redis rate limiting needs careful TTL management - keys without expire cause memory leaks
```

### Previous Story Insights (Epic Flow)

**Purpose**: Flow knowledge between stories in same epic.

**Populated from previous story's Dev Agent Record** with:
- Key learnings from previous story
- Architectural patterns that worked/didn't work
- Technical debt discovered

**How it works**:
1. Story US-0001 in epic completes → populates Dev Agent Record with lessons
2. Story US-0002 created → automatically includes US-0001's lessons in "Previous Story Insights"
3. Dev agent for US-0002 reads insights → applies successful patterns, avoids pitfalls
4. Knowledge flows through epic: US-0001 → US-0002 → US-0003

**Example**:
```markdown
## Previous Story Insights

From US-0001 (User Login API):

**Lessons Learned**:
- Middleware pattern works well for authentication validation
- Redis rate limiting needs explicit TTL management

**Architectural Patterns**:
- Use middleware for cross-cutting concerns (auth, logging, error handling)
```

### Story Validation (`/validate-story`)

**Purpose**: Validate stories are complete before dev agent assignment.

**New command**: `/AgileFlow:validate-story US-XXXX`

**Validates**:
1. All required sections present (frontmatter, AC, Architecture Context, Dev Agent Record, etc.)
2. Architecture Context populated with real source citations
3. Acceptance Criteria clear and testable (Given/When/Then format)
4. Story completeness (estimate realistic, dependencies documented, owner assigned)
5. Previous Story Insights relevant (if not first in epic)

**Output**: Comprehensive report with passed/failed/warnings, ready for development or needs fixes.

### Epic Planner Workflow Update

The `agileflow-epic-planner` agent now includes Architecture Context Extraction:

**Step 3.1 - Determine Architecture Reading Strategy**:
- Reads `docs/04-architecture/` for relevant files based on story type
- **All stories**: tech-stack.md, coding-standards.md, project-structure.md
- **Backend/API**: data-models.md, api-spec.md, database.md
- **Frontend/UI**: components.md, styling.md, state-management.md
- **Full-Stack**: All of the above

**Step 3.2 - Extract Story-Specific Technical Details**:
- ONLY information relevant to THIS story
- NEVER invent technical details
- Include: data models, API endpoints, component specs, file paths, testing patterns

**Step 3.3 - Cite All Sources**:
- Format: `[Source: architecture/{filename}.md#{section}]`
- Every technical detail must be verifiable

**Step 4 - Verify Project Structure Alignment**:
- Cross-reference story requirements with project structure guide
- Document any conflicts in story

**Step 5 - Populate Architecture Context Section**:
- Add all 6 subsections to story template
- Include source citations in each subsection

## v2.16.0 Quick Reference

### New Features (BMAD Integration)
- ✅ **Architecture Context Extraction**: Stories now include auto-filled Architecture Context with source citations
- ✅ **Dev Agent Record**: Capture implementation model, issues, lessons learned for knowledge transfer
- ✅ **Previous Story Insights**: Flow lessons between stories in same epic
- ✅ **Story Validation Command**: `/AgileFlow:validate-story US-XXXX` for completeness checking
- ✅ **Enhanced /babysit**: Integrated BMAD workflow guidance (validate → read context → implement → record lessons)

### New Files Created
- `commands/validate-story.md` - Story validation command
- `docs/06-stories/EP-0001/US-0001-user-login-api.md` - Example story with all new sections

### Modified Files
- `templates/story-template.md` - Added Architecture Context, Dev Agent Record, Previous Story Insights
- `agents/agileflow-epic-planner.md` - Added Architecture Context Extraction workflow
- `commands/babysit.md` - Enhanced with BMAD guidance sections
- `CHANGELOG.md` - v2.16.0 entry with full details
- `.claude-plugin/plugin.json` - Version bumped to 2.16.0

## Common Workflows

### Workflow 1: Create Epic with Architecture Context

```
User: "I want to build user authentication system"
  ↓
/AgileFlow:epic-new → Epic Planner creates EP-XXXX
  ↓
Epic Planner breaks down into stories:
  - US-0001: User Login API
  - US-0002: Password Reset
  - US-0003: Token Refresh
  ↓
For each story:
  - Extract architecture context from docs/04-architecture/
  - Cite all sources: [Source: architecture/api-spec.md#endpoints]
  - Populate Architecture Context section
  - Create test stub at docs/07-testing/test-cases/US-XXXX.md
  ↓
Stories status = "ready" (Definition of Ready met)
```

### Workflow 2: Implement Story with BMAD Patterns

```
Dev Agent receives: US-XXXX (Story with Architecture Context populated)
  ↓
1. Validate: /AgileFlow:validate-story US-XXXX
   - Check Architecture Context populated
   - Check AC clear and testable
   - Check all sections present
  ↓
2. Read: Story's Architecture Context section (NOT full docs)
   - File paths from Architecture Context
   - Testing patterns from Testing Requirements
   - API specs already extracted with citations
  ↓
3. Check: Previous Story Insights (if not first in epic)
   - Apply successful patterns from previous story
   - Avoid pitfalls documented in previous story
  ↓
4. Implement: Use Architecture Context as single source of truth
   - No need to read full architecture docs
   - All context is self-contained in story
  ↓
5. Record: Populate Dev Agent Record as you work
   - Agent Model & Version: Which model was used
   - Completion Notes: What was built vs. planned
   - Issues Encountered: Challenges and solutions
   - Lessons Learned: Insights for NEXT story in epic
   - Files Modified: List all files touched
  ↓
6. Next Story: When epic planner creates US-XXXX+1
   - Automatically includes your Lessons Learned
   - Next dev agent applies your patterns
   - Knowledge flows through epic: US-0001 → US-0002 → US-0003
```

### Workflow 3: Validate Story Before Assignment

```
Epic Planner finishes creating story:
  ↓
Run: /AgileFlow:validate-story US-XXXX
  ↓
If PASSED (all checks green):
  - Story is ready for development
  - Assign to dev agent
  - Dev agent can focus on implementation
  ↓
If FAILED (issues found):
  - Fix Architecture Context citations (must be real files)
  - Fix Acceptance Criteria (must be Given/When/Then)
  - Add missing sections
  - Update status to "draft"
  - Re-run validation
  ↓
Once all checks pass:
  - Status = "ready"
  - Safe to assign for implementation
```

## Common Development Tasks

### Updating Plugin Version

When releasing a new version (example: v2.3.1 → v2.3.2):

1. **Update version files**:
   ```bash
   # Edit these 3 files to bump version
   .claude-plugin/plugin.json       # "version": "2.3.2"
   .claude-plugin/marketplace.json  # Update description with version
   CHANGELOG.md                     # Add new [2.3.2] section at top
   ```

2. **Commit changes**:
   ```bash
   git add .claude-plugin/plugin.json .claude-plugin/marketplace.json CHANGELOG.md
   git commit -m "chore: bump version to v2.3.2"
   ```

3. **Push immediately** (CRITICAL - marketplace reads from GitHub):
   ```bash
   git push origin main
   ```

4. **Verify**:
   ```bash
   # Check all 3 files have matching version
   grep -n "2.3.2" .claude-plugin/plugin.json .claude-plugin/marketplace.json CHANGELOG.md
   ```

### Adding a New Command

1. **Create command file** (auto-discovered):
   ```bash
   # Add to commands/ directory with descriptive name
   commands/new-command.md
   ```

   **Frontmatter format** (optional but recommended):
   ```yaml
   ---
   description: Brief description of what command does
   argument-hint: Optional description of arguments
   ---
   ```

2. **Update README.md** - Add command to appropriate section with `/AgileFlow:` prefix

3. **Bump version and update changelog**:
   - Update `.claude-plugin/plugin.json` version (e.g., 2.15.1 → 2.15.2)
   - Update `.claude-plugin/marketplace.json` description with new version
   - Add new section to `CHANGELOG.md` documenting the new command under "Added"

4. **No need to edit plugin.json** - Auto-discovery handles registration

### Adding a New Subagent

1. **Create subagent file** (auto-discovered):
   ```bash
   agents/agileflow-newagent.md
   ```

2. **Frontmatter requirements**:
   ```yaml
   ---
   name: agileflow-newagent
   description: What this agent does and when to use it
   tools: Read, Write, Edit, Bash, Glob, Grep
   model: haiku  # or sonnet for complex agents
   color: blue   # Choose a color (optional)
   ---
   ```

3. **Update README.md** and **SUBAGENTS.md** - Document new subagent

4. **Bump version and update changelog**:
   - Update `.claude-plugin/plugin.json` version (e.g., 2.15.1 → 2.15.2)
   - Update `.claude-plugin/marketplace.json` description with new version
   - Add new section to `CHANGELOG.md` documenting the new subagent under "Added"

5. **No need to edit plugin.json** - Auto-discovery handles registration

**Model Selection Guide**:
- `model: sonnet` - For complex agents requiring reasoning (mentor, epic-planner)
- `model: haiku` - For specialized but straightforward agents (UI, API, CI, DevOps, research)

### Modifying Commands or Subagents

- **Command/subagent behavior** is defined in the `.md` file content (the prompt)
- **No build step required** - changes are live when plugin reloads
- **Test changes** by running the command or invoking the subagent in a test project
- **For bug fixes or improvements**: Bump version (patch for fixes, minor for improvements) and update all 3 version files

## MCP Integration

AgileFlow integrates with external services via Model Context Protocol (MCP):

**`.mcp.json.example`** - Template committed to git:
- Configures MCP servers for GitHub, Notion, and Supabase integrations
- Uses `${VAR}` syntax for environment variable substitution
- Example: `"GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PERSONAL_ACCESS_TOKEN}"`
- Users copy to `.mcp.json` (gitignored) - do NOT modify, it reads from .env
- **Why MCP?** Standardized tool interface, no sudo required, better portability

**⚠️ CRITICAL: Environment Variable Security (NOT Hardcoded Tokens)**:
- ✅ `.mcp.json` uses `${VAR}` syntax to read from `.env`
- ✅ Actual tokens stored in `.env` (NOT in `.mcp.json`)
- ✅ BOTH `.mcp.json` AND `.env` MUST be gitignored
- ✅ Commit `.mcp.json.example` and `.env.example` (templates with `${VAR}` syntax)
- ❌ NEVER hardcode tokens in `.mcp.json`
- ❌ NEVER commit `.mcp.json` or `.env` to git
- ⚠️ Each team member needs their own tokens (NO SHARING)

**Supported MCP Servers**:
- **GitHub MCP** (`@modelcontextprotocol/server-github`):
  - Bidirectional GitHub Issues sync
  - No sudo required (uses npx)
  - Token: GitHub Personal Access Token (ghp_*) in `.env`
  - Permissions: `repo`, `read:org`
  - Command: `/AgileFlow:github-sync`
  - Supports `${VAR}` substitution: ✅

- **Notion MCP** (`@notionhq/notion-mcp-server`):
  - Bidirectional Notion database sync
  - Token: Notion Integration Token (ntn_*) in `.env`
  - Command: `/AgileFlow:notion-export`
  - Supports `${VAR}` substitution: ✅

- **Postgres MCP** (example of server WITHOUT `${VAR}` support):
  - Requires wrapper script (see `templates/mcp-wrapper-postgres.sh`)
  - Wrapper loads `.env` and passes credentials as CLI args
  - See `templates/MCP-WRAPPER-SCRIPTS.md` for guide

**`.env.example`** - Environment variable template:
- Documents ALL MCP tokens with placeholders
- CRITICAL: `GITHUB_PERSONAL_ACCESS_TOKEN`, `NOTION_TOKEN`, etc.
- Users copy to `.env` and replace placeholders with real tokens
- `.env` MUST be gitignored (contains actual secrets)

**Setup Flow (NEW - Secure Approach)**:
1. User runs `/AgileFlow:setup` and selects which MCPs to enable
2. AI creates `.mcp.json` directly with `${VAR}` syntax and `.env.example`
3. User edits `.env` (NOT `.mcp.json`) and adds real tokens:
   ```bash
   GITHUB_PERSONAL_ACCESS_TOKEN=ghp_actual_token_here
   NOTION_TOKEN=ntn_actual_token_here
   CONTEXT7_API_KEY=optional_key_here
   ```
4. User verifies `.mcp.json` and `.env` are in `.gitignore`:
   ```bash
   grep -E '\\.mcp\\.json|\\.env' .gitignore
   ```
5. **🔴 User RESTARTS Claude Code** (critical - MCPs won't load without restart!)
6. User runs commands to sync: `/AgileFlow:github`, `/AgileFlow:notion`, etc.

**Key principles**:
- `.mcp.json` (generated with `${VAR}` syntax) → gitignored (CRITICAL)
- `.env.example` (template with placeholders) → committed to git
- `.env` (actual tokens) → gitignored (CRITICAL - user creates locally)
- Tokens ONLY in `.env`, NEVER in `.mcp.json`
- AI creates `.mcp.json` during setup, users only edit `.env`

**Wrapper Scripts (for servers without `${VAR}` support)**:
- Some MCP servers don't support `${VAR}` substitution
- Use bash wrapper scripts that load `.env` and pass credentials
- See `templates/mcp-wrapper-postgres.sh` for example
- See `templates/MCP-WRAPPER-SCRIPTS.md` for full guide

## Story Template Structure (v2.16.0+)

Stories in `docs/06-stories/` now follow enhanced template with BMAD patterns. Key sections:

### Required Frontmatter
```yaml
---
story_id: US-0001
epic: EP-0001
title: User Login API Implementation
owner: AG-API
status: ready
estimate: 1d
created: 2025-10-28
updated: 2025-10-28
dependencies: []
---
```

### Main Sections

**Description** - What is being built and why

**Acceptance Criteria** - Given/When/Then format (2-5 criteria)
```
- **Given** a valid email and password
  **When** user POSTs to /api/auth/login
  **Then** they receive JWT token with 24h expiration (HTTP 200)
```

**Architecture Context** (NEW - BMAD pattern)
- Extracted by Epic Planner from `docs/04-architecture/`
- 6 subsections: Data Models, API Specs, Components, File Locations, Testing, Constraints
- Every detail includes source citation: `[Source: architecture/api-spec.md#endpoints]`
- Dev agents use this INSTEAD of reading full docs

**Technical Notes** - Implementation hints, edge cases

**Testing Strategy** - Points to test stub at `docs/07-testing/test-cases/<US_ID>.md`

**Dependencies** - Other stories this depends on

**Dev Agent Record** (NEW - Knowledge Transfer)
- Populated during implementation
- Agent Model & Version, Completion Notes, Issues Encountered, Lessons Learned, Files Modified, Debug References
- Next story in epic will reference this via "Previous Story Insights"

**Previous Story Insights** (NEW - Epic Flow)
- References lessons from previous story in same epic
- Includes learned patterns and technical debt from last implementation
- Helps dev agent avoid pitfalls and reuse successful patterns

### Example Story File

See: `docs/06-stories/EP-0001/US-0001-user-login-api.md`
- Demonstrates all new sections in action
- Shows Architecture Context with real source citations
- Shows populated Dev Agent Record with implementation notes
- Shows Previous Story Insights pattern for follow-on stories

## Development Workflow (with BMAD Patterns)

When implementing a story:

### 1. Validate Story Before Starting
```bash
/AgileFlow:validate-story US-XXXX
```
- Check Architecture Context is populated
- Check AC is clear and testable
- Check all required sections present
- **If validation fails**: Fix issues before starting implementation

### 2. Read Story's Architecture Context First
- **Do this INSTEAD of reading full docs**
- File locations are from Architecture Context
- Testing patterns are from Testing Requirements subsection
- API specs are already extracted with citations

### 3. Check Previous Story Insights (if applicable)
- If not first story in epic: Read Previous Story Insights
- Apply Architectural Patterns that worked
- Avoid Technical Debt noted from previous story

### 4. Implement with Reduced Context Overhead
- Architecture Context has everything needed
- No need to read entire architecture docs
- Dev agents can focus on implementation

### 5. Populate Dev Agent Record During Work
- **Agent Model & Version**: Record which AI model was used
- **Completion Notes**: Document actual vs. planned
- **Issues Encountered**: Capture challenges and solutions
- **Lessons Learned**: Extract insights for NEXT story in epic
- **Files Modified**: List all files touched
- **Debug References**: Link to test runs, CI logs

### 6. Knowledge Flows to Next Story
- When Epic Planner creates next story in epic
- It automatically includes your Lessons Learned as "Previous Story Insights"
- Next dev agent applies your patterns and avoids your pitfalls

**Example Flow**:
```
US-0001: User Login API
  ↓ [Implementation completed]
  ↓ [Dev Agent Record populated with Lessons Learned]
  ↓ [Next story created]
US-0002: Password Reset (uses lessons from US-0001)
  ↓ [Includes US-0001's patterns in Previous Story Insights]
  ↓ [Reuses middleware pattern, avoids Redis TTL issues]
  ↓ [Implementation completed]
  ↓ [Adds new lessons]
US-0003: Token Refresh (uses lessons from US-0001 + US-0002)
```

## Documentation Standards

### Command File Format

Commands are markdown files with:
- Heading (command name)
- Description
- Prompt section defining behavior
- Examples (if applicable)
- Technical notes (if applicable)

### Subagent File Format

Subagents are markdown files with:
- YAML frontmatter (name, description, tools)
- Role and objective
- Knowledge sources
- Constraints and quality checklist
- Communication protocols

### Version Updates

When updating CHANGELOG.md:
- Follow Keep a Changelog format strictly
- Use categories: Added, Changed, Fixed, Improved, Technical
- Include date in ISO format (YYYY-MM-DD)
- Add detailed context for changes (not just "fixed bug")

## Git Workflow

**Branches**:
- `main` - stable releases
- Feature branches - for development

**Commits**:
- Use Conventional Commits format
- Example: `feat: add /AgileFlow:new-command for X`, `fix: correct version in marketplace.json`
- Include co-authorship: `Co-Authored-By: Claude <noreply@anthropic.com>`
- **ALWAYS PUSH AFTER COMMITTING**: `git push origin main` (marketplace reads from GitHub)

**Never commit**:
- `.mcp.json` (gitignored - even though it uses `${VAR}`, keep gitignored as safety measure)
- `.env` (gitignored - contains actual secrets/tokens)

**Always commit**:
- `.mcp.json.example` (template with `${VAR}` syntax for team)
- `.env.example` (template with placeholder values)

**Critical reminder**: The plugin marketplace fetches from GitHub, not local files. If you don't push, users won't see your changes!

## Key Principles for v2.16.0+

### Architecture Context is Self-Contained
- **Dev agents should NEVER need to read full architecture docs**
- Everything needed is extracted into the story's Architecture Context section
- If something is missing, it means the story wasn't properly prepared (run `/validate-story`)
- This reduces token overhead and speeds up implementation

### Source Citations are Mandatory
- Every technical detail must cite its source: `[Source: architecture/api-spec.md#endpoints]`
- Sources must be real files in `docs/04-architecture/`
- Citations are verifiable - users can click through and understand decisions
- Never invent technical details - only extract from actual docs

### Knowledge Flows Through Epics
- Story US-0001 completes → populates Dev Agent Record with lessons
- Story US-0002 created → automatically includes US-0001's lessons in Previous Story Insights
- Story US-0003 learns from both US-0001 and US-0002
- This creates a learning loop: each story builds on previous implementation wisdom

### Story Validation is Essential
- Always run `/validate-story` before assigning story to dev agent
- Catches issues early (missing Architecture Context, unclear AC, structure problems)
- Prevents dev agent from starting work on incomplete story
- If validation fails, fix the story (not the dev agent's job)

### Dev Agent Record is for Knowledge Transfer
- Populated DURING implementation, not after
- Lessons Learned section specifically for NEXT story in epic (not just documentation)
- Example: "Middleware pattern works well for auth - recommend same for logging"
- Next story automatically benefits from this wisdom

## Important Notes

### This is a Plugin, Not an Application

- **No package.json** - Not a Node.js project
- **No build process** - Markdown files are the source and distribution
- **No tests** (in the traditional sense) - Validation happens through usage
- **No runtime** - Commands execute within Claude Code context

### User Projects vs Plugin Repository

The AgileFlow plugin **creates structure in user projects** (`docs/` directories, templates, status files) but this repository only contains:
- Command definitions that create/manage those files
- Subagent definitions that operate on those files
- Templates used to scaffold new files

### Version Sync is Critical

**Three files must always have matching versions**:
1. `.claude-plugin/plugin.json` → `"version"`
2. `.claude-plugin/marketplace.json` → `"description"` (mentions version)
3. `CHANGELOG.md` → Top-most `[X.Y.Z]` section

**When releasing**, update all three in the same commit.
