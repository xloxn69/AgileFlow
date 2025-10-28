# Changelog

All notable changes to the AgileFlow plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.16.0] - 2025-10-28

### Added - BMAD-METHOD Architecture Context Extraction

Implemented key patterns from BMAD-METHOD framework for improved dev agent context awareness and knowledge transfer between stories.

**Architecture Context Extraction** (in Story Template):
- New `Architecture Context` section in story template with auto-filled subsections:
  - **Data Models & Schemas**: Specific data structures and validation rules relevant to the story
  - **API Specifications**: Endpoint details, request/response formats, auth requirements
  - **Component Specifications**: UI component details and state management
  - **File Locations & Naming**: Exact paths where new code should be created
  - **Testing Requirements**: Specific test cases and testing patterns for the story
  - **Technical Constraints**: Version requirements, performance, security rules
- **Source Citations** (CRITICAL): Every technical detail includes `[Source: architecture/{filename}.md#{section}]`
- **Strategy**: Extract ONLY relevant architecture sections, never invent details
- **Benefit**: Dev agents have focused, self-contained context without reading massive docs

**Dev Agent Record** (in Story Template):
- New structured section populated during implementation:
  - **Agent Model & Version**: Which AI model was used (e.g., claude-sonnet, gpt-4o)
  - **Completion Notes**: What was actually built vs. what was planned
  - **Issues Encountered**: Challenges faced and how they were resolved
  - **Lessons Learned**: Key insights and patterns for next story in epic
  - **Files Modified**: List of all files created, modified, or deleted
  - **Debug References**: Links to debug logs, test runs, or decision traces
- **Benefit**: Captures implementation wisdom for knowledge transfer to next stories

**Previous Story Insights** (in Story Template):
- New section for flowing insights between stories in same epic
- Populated from previous story's Dev Agent Record:
  - Key learnings from previous story
  - Architectural patterns that worked/didn't work
  - Technical debt discovered
- **Benefit**: Knowledge transfers between agent implementations

### Changed - Epic Planner Agent Enhanced

Updated `agileflow-epic-planner` agent with new Architecture Context Extraction workflow:

**New ARCHITECTURE CONTEXT EXTRACTION Section** (for story creation):
- Documents BMAD-METHOD pattern for extracting architecture context
- Specifies which architecture files to read based on story type:
  - **All stories**: tech-stack.md, coding-standards.md, project-structure.md
  - **Backend/API stories**: data-models.md, api-spec.md, database.md
  - **Frontend/UI stories**: components.md, styling.md, state-management.md
  - **Full-Stack stories**: All of the above
- Requires source citations for every technical detail
- Never invents details - only extracts from actual docs

**Updated Workflow Steps** (Step 7):
- New explicit step `[ARCHITECTURE CONTEXT EXTRACTION]` in story creation workflow
- Integrates context extraction into planning process
- Extracts previous story insights when applicable

### Added - New Story Validation Command

**New Command**: `/AgileFlow:validate-story` (validates individual story completeness)

Validates that a story is complete, well-structured, and ready for implementation:

**Validation Checks**:
1. **Required Sections**: All template sections present (frontmatter, AC, Architecture Context, Dev Agent Record, etc.)
2. **Architecture Context**: Populated with source citations, files exist, no invented details
3. **Acceptance Criteria**: Clear, testable, uses Given/When/Then format, 2-5 criteria
4. **Story Completeness**: Realistic estimate (0.5-2d), dependencies documented, owner assigned
5. **Dev Agent Record**: Structure present (content may be empty at ready/draft stage)
6. **Previous Story Insights**: Present and relevant to epic sequence
7. **Cross-Story Consistency**: Aligns with epic goals and team capacity

**Output**: Comprehensive validation report with passed/failed/warnings grouped by severity

**Example Story**: `docs/06-stories/EP-0001/US-0001-user-login-api.md`
- Demonstrates all new sections in action
- Shows proper Architecture Context with source citations
- Shows populated Dev Agent Record with real-world implementation notes
- Includes Previous Story Insights example for follow-on stories

### Improved - Story Template Enhancement

Enhanced `templates/story-template.md` with BMAD-inspired sections:
- Architecture Context section with clear subsections and source citation requirements
- Dev Agent Record section with structured subsections for implementation tracking
- Previous Story Insights section for inter-story knowledge transfer
- Detailed comments explaining when/how sections are populated

### Why This Matters

**Before**: Dev agents had to read entire architecture docs, losing context in token overhead. Dev insights were lost when implementation finished.

**After**:
- Dev agents get focused, self-contained context (reduced token overhead)
- Architecture decisions are traced to their source (verifiable and auditable)
- Implementation wisdom flows between stories in an epic (knowledge transfer)
- Stories are validated before assignment (higher quality work)

**Pattern Origins**: These patterns are proven in BMAD-METHOD framework, now adapted for AgileFlow's command-based architecture.

## [2.15.2] - 2025-10-28

### Changed - Official Claude Code Plugin Format with Auto-Discovery

Adopted the official Claude Code plugin format used by Anthropic's official plugins for better maintainability and consistency.

**Key Changes**:
1. **plugin.json Simplification**:
   - Removed explicit command/agent/skills lists (now uses auto-discovery from directory structure)
   - Added `"homepage": "https://github.com/xloxn69/AgileFlow"` field
   - Version bumped to 2.15.2

2. **Agent Model Specifications**:
   - Added `model: sonnet` to complex agents (mentor, epic-planner) for better reasoning
   - Added `model: haiku` to all other agents for efficiency
   - Replaces previous `model: inherit` declarations

3. **Auto-Discovery**:
   - Commands auto-discovered from `commands/` directory
   - Agents auto-discovered from `agents/` directory
   - Skills auto-discovered from `skills/` directory
   - No need to manually register in plugin.json anymore

**Benefits**:
- ✅ Simpler maintenance (add new commands/agents without editing plugin.json)
- ✅ Cleaner plugin.json (follows official Anthropic plugin format)
- ✅ Better agent performance tuning via explicit model specs
- ✅ Consistent with official plugins (backend-architect, feature-dev, agent-sdk-dev)
- ✅ Easier for community to contribute

**Migration Notes**:
- Users don't need to do anything - auto-discovery is transparent
- Install command remains the same: `/plugin install AgileFlow`
- All 36 commands, 9 agents, and 8 skills work exactly as before

## [2.15.1] - 2025-10-28

### Added

**New Subagent: agileflow-context7 (Documentation Specialist)**

Added 9th subagent specialized in fetching and presenting current documentation through Context7:

- **Purpose**: Isolate Context7 documentation lookups from main conversation to prevent token bloat
- **Capabilities**:
  - Fetches current documentation for libraries and frameworks
  - Provides implementation guidance based on latest docs
  - Handles multi-library integration documentation
  - Delivers code examples reflecting current best practices
- **When to Use**: When users need accurate, up-to-date documentation for specific technologies
- **Benefits**:
  - Main conversation stays focused on implementation
  - Token budget preserved for coding work
  - Documentation lookups don't clutter decision history
  - Users get focused, accurate guidance on each library

**Example Invocations**:
```
Use the agileflow-context7 agent to fetch the latest React hooks documentation
Use the agileflow-context7 agent to get current Express.js authentication setup guides
Use the agileflow-context7 agent to find MongoDB and Mongoose best practices
```

**Files Added**:
- `agents/agileflow-context7.md` - Complete Context7 specialist agent definition

**Why This Matters**: With Context7 lookups now isolated in a dedicated agent, the main AgileFlow conversation can focus on implementation strategy and code work rather than documentation overhead. This significantly improves token efficiency and keeps decision history focused on actual development decisions.

## [2.15.0] - 2025-10-28

### Changed - Simplified Command Names (Breaking Change)

**Why**: Command names are easier to remember and faster to type when they're short. `/setup` is faster than `/setup-system`, `/epic` vs `/epic-new`, etc.

**All 28 Command Renames**:

| Old Name | New Name | Purpose |
|----------|----------|---------|
| `/setup-system` | `/setup` | Bootstrap the entire system |
| `/validate-system` | `/validate` | Validate system integrity |
| `/system-help` | `/help` | Display system overview |
| `/epic-new` | `/epic` | Create a new epic |
| `/story-new` | `/story` | Create a user story with AC |
| `/adr-new` | `/adr` | Create Architecture Decision Record |
| `/agent-new` | `/agent` | Onboard a new agent |
| `/story-assign` | `/assign` | Assign/reassign a story |
| `/story-status` | `/status` | Update story status |
| `/pr-template` | `/pr` | Generate PR description |
| `/ci-setup` | `/ci` | Bootstrap CI workflow |
| `/research-init` | `/research` | Save research notes |
| `/doc-coverage` | `/docs` | Synchronize docs with code changes |
| `/impact-analysis` | `/impact` | Analyze change impact on codebase |
| `/tech-debt` | `/debt` | Track and prioritize technical debt |
| `/agent-feedback` | `/feedback` | Collect feedback for continuous improvement |
| `/setup-tests` | `/tests` | Automated testing infrastructure setup |
| `/ai-code-review` | `/review` | AI-powered code review |
| `/auto-story` | `/auto` | Generate stories from PRDs/mockups/specs |
| `/generate-changelog` | `/changelog` | Auto-generate changelog from commits |
| `/setup-deployment` | `/deploy` | Automated deployment pipeline setup |
| `/custom-template` | `/template` | Create and manage custom templates |
| `/stakeholder-update` | `/update` | Generate stakeholder reports |
| `/sprint-plan` | `/sprint` | Data-driven sprint planning |
| `/github-sync` | `/github` | Bidirectional GitHub Issues sync |
| `/notion-export` | `/notion` | Bidirectional Notion database sync |
| `/dependencies` | `/deps` | Dependency graph visualization |

**Commands That Stayed the Same** (already simple):
- `/babysit` - Interactive mentor for end-to-end implementation
- `/chatgpt` - Generate/export/manage ChatGPT context
- `/packages` - Manage dependencies
- `/board` - Visual kanban board
- `/blockers` - Blocker tracking
- `/velocity` - Velocity tracking and forecasting
- `/metrics` - Comprehensive analytics dashboard
- `/retro` - Automated retrospective generator
- `/handoff` - Document handoff between agents

**Migration Guide**:

This is a breaking change if you have scripts or documentation referencing old command names.

**Update your workflows:**
- Change `/setup-system` → `/setup`
- Change `/validate-system` → `/validate`
- Change `/story-new STORY=...` → `/story STORY=...`
- etc. (see table above)

**Why Minor Version (2.14 → 2.15)?**
- Backwards incompatible (old command names no longer work)
- Users need to update scripts and documentation
- Still non-breaking for plugin functionality (same commands, just renamed)
- Users updating to v2.15+ will need to adjust their workflows

**Files Changed**:
- `plugin.json`: Updated all 36 command paths to new names
- `marketplace.json`: Updated description with v2.15.0
- `README.md`: Updated all command references to new names
- 28 command files: Renamed in `commands/` directory

**Testing**:
- All commands should work with new names immediately after plugin reload
- Old command names will no longer work (hence breaking change)

## [2.14.1] - 2025-10-28

### Removed

**agileflow-changelog skill** - Removed same day

**Why**: User feedback indicated that nobody uses project changelogs. The skill was confusing because users thought it was for AgileFlow's own changelog, not their projects. Removing it to reduce bloat.

**Impact**: 9 skills → 8 skills. All other skills remain unchanged and fully functional.

**Alternative**: Users can still use the `/AgileFlow:generate-changelog` command if needed for their projects.

## [2.14.0] - 2025-10-28

### Added - Claude Skills (9 Autonomous Workflow Enhancers)

**What Are Skills?**: Skills are model-invoked enhancements that Claude autonomously loads when relevant to your task. Unlike slash commands (which you manually type), skills activate automatically based on conversation context.

**Why This Matters**: Skills make AgileFlow "just work" without needing to remember specific commands. When you discuss features, Claude automatically formats them as user stories. When you commit code, Claude respects your attribution preferences. When you plan sprints, Claude helps with capacity calculations.

**8 Skills Added (3 Phases)**:

#### Phase 1: High-ROI Workflow Skills

**1. agileflow-story-writer** 📝
- **Auto-activates when**: User describes features, requirements, or tasks to implement
- **What it does**: Automatically formats discussions into proper user stories with Given/When/Then acceptance criteria
- **Files**: SKILL.md, templates/, examples/
- **Example**: You say "I need a login feature" → Claude creates STORY-042.md with full AC
- **Quality**: Ensures owner assignment, priority, estimates, and DoD checklist

**2. agileflow-commit-messages** 💬
- **Auto-activates when**: User creates git commits or discusses code changes
- **What it does**: Formats commits following Conventional Commits spec + respects CLAUDE.md attribution toggle
- **Files**: SKILL.md, scripts/check-attribution.sh, reference/{good,bad}-examples.md
- **Example**: You commit changes → Claude suggests "feat(auth): add 2FA" with proper body/footer
- **Security**: Checks CLAUDE.md for "DO NOT ADD AI ATTRIBUTION" policy before adding footer

#### Phase 2: Quality & Planning Skills

**4. agileflow-acceptance-criteria** ✅
- **Auto-activates when**: Discussing architecture, technology choices, or trade-offs
- **What it does**: Captures decisions as Architecture Decision Records (ADRs) with pros/cons/alternatives
- **Files**: SKILL.md, templates/adr-template.md, examples/database-choice-example.md
- **Example**: Debating "PostgreSQL vs MongoDB" → Claude creates ADR-012.md with full analysis
- **Format**: MADR (Markdown ADR) with context, drivers, options, decision, consequences

**5. agileflow-acceptance-criteria** ✅
- **Auto-activates when**: User describes feature behavior or requirements
- **What it does**: Generates detailed Given/When/Then acceptance criteria for stories
- **Files**: SKILL.md, examples/
- **Example**: "When user logs in with wrong password" → AC with happy path, errors, edge cases
- **Coverage**: Ensures happy path, error handling, permissions, responsive behavior

**6. agileflow-epic-planner** 🗺️
- **Auto-activates when**: User describes large features spanning multiple sprints
- **What it does**: Breaks down initiatives into epics with milestones and story groupings
- **Files**: SKILL.md, templates/epic-template.md
- **Example**: "We need to build a payment system" → EPIC-005.md with 3 milestones, 12 stories
- **Planning**: Includes success metrics, dependencies, risks, progress tracking

#### Phase 3: Team Process Skills

**6. agileflow-sprint-planner** 🏃
- **Auto-activates when**: User mentions sprint planning or iteration planning
- **What it does**: Helps plan sprints with capacity calculations, story grouping, risk identification
- **Files**: SKILL.md, templates/
- **Example**: "Plan next sprint" → Capacity calculation, story selection, sprint goal, schedule
- **Metrics**: Tracks velocity, calculates realistic capacity, identifies dependencies/blockers

**7. agileflow-retro-facilitator** 🔄
- **Auto-activates when**: Discussing retrospectives or sprint reviews
- **What it does**: Structures retro feedback using Start/Stop/Continue format with action items
- **Files**: SKILL.md, templates/
- **Example**: "Let's do a retro" → Structured feedback collection, action items with owners
- **Formats**: Supports multiple formats (Start/Stop/Continue, Glad/Sad/Mad, 4Ls, Sailboat)

**8. agileflow-tech-debt** 🔧
- **Auto-activates when**: Discussing code quality, refactoring, or maintenance
- **What it does**: Documents tech debt with impact/effort matrix and prioritization
- **Files**: SKILL.md, templates/
- **Example**: "This code is messy" → TD-042.md with impact analysis, effort estimate, priority score
- **Metrics**: Tracks total debt, resolution rate, top contributors

### Technical Implementation

**File Structure**:
```
skills/
├── agileflow-story-writer/
│   ├── SKILL.md (instructions + when to activate)
│   ├── templates/story-template.md
│   └── examples/good-story-example.md
├── agileflow-commit-messages/
│   ├── SKILL.md
│   ├── scripts/check-attribution.sh (executable)
│   └── reference/{good,bad}-examples.md
├── agileflow-changelog/
│   ├── SKILL.md
│   └── templates/changelog-examples.md
├── agileflow-adr/
│   ├── SKILL.md
│   ├── templates/adr-template.md
│   └── examples/database-choice-example.md
├── agileflow-acceptance-criteria/
│   ├── SKILL.md
│   └── examples/
├── agileflow-epic-planner/
│   ├── SKILL.md
│   └── templates/epic-template.md
├── agileflow-sprint-planner/
│   ├── SKILL.md
│   └── templates/
├── agileflow-retro-facilitator/
│   ├── SKILL.md
│   └── templates/
└── agileflow-tech-debt/
    ├── SKILL.md
    └── templates/
```

**Registration** (at time of v2.14.0):
- Added `"skills"` array to `.claude-plugin/plugin.json`
- 9 skills paths: `"./skills/agileflow-*"` (later reduced to 8 in v2.14.1)
- Skills load automatically when Claude detects relevance

**Skill Format** (YAML frontmatter + Markdown):
```yaml
---
name: agileflow-story-writer
description: Automatically formats user requirements into proper user stories...
allowed-tools: Read, Write, Edit, Glob
---
```

### Benefits of Skills vs Slash Commands

**Slash Commands** (User-Invoked):
- User must remember to type `/AgileFlow:story-new`
- Manual trigger every time
- Good for intentional, explicit actions

**Skills** (Model-Invoked):
- Claude detects context and loads automatically
- No manual trigger needed
- Seamless, invisible enhancement

**Example Workflow**:
```
User: "I need to add a login feature with email/password"

WITHOUT Skills:
  User: /AgileFlow:story-new
  Claude: What's the feature?
  User: Login with email/password...

WITH Skills (agileflow-story-writer):
  Claude: *detects feature discussion, loads story-writer skill*
  Claude: "I'll create a user story for that..."
  Claude: *creates STORY-042.md automatically*
```

### Skill Stacking

Skills can coordinate automatically:
- **story-writer** + **acceptance-criteria** = Stories with detailed AC
- **commit-messages** + **changelog** = Commits inform changelog entries
- **epic-planner** + **sprint-planner** = Epic stories flow into sprints
- **adr** + **tech-debt** = Decisions inform debt tracking

### Why Minor Version (2.13 → 2.14)?

- Major new functionality (8 skills - changelog removed in v2.14.1)
- Backwards compatible (all existing features work)
- Non-breaking (skills enhance, don't replace commands)
- Significant user experience improvement

### Changed (Version Files)

- **plugin.json**: v2.13.3 → v2.14.0, added `"skills"` array with 9 entries
- **marketplace.json**: Description updated with "9 autonomous skills"
- **CHANGELOG.md**: Comprehensive v2.14.0 entry (this section)

### Integration with Existing AgileFlow

Skills complement slash commands:
- **/AgileFlow:story-new** still works (explicit story creation)
- **agileflow-story-writer** skill auto-formats during conversations
- Users can use whichever fits their workflow

### User Experience

**Before v2.14.0**:
```
User: I need to add dark mode
User: /AgileFlow:story-new
Claude: [asks questions, creates story]
```

**After v2.14.0**:
```
User: I need to add dark mode
Claude: [skill activates automatically]
Claude: I'll create a user story for that feature...
[STORY-042-add-dark-mode.md created]
```

**Result**: Faster workflow, less cognitive overhead, more natural conversation.

## [2.13.3] - 2025-10-28

### Added - Context7 MCP Integration

**Problem**: Claude's training data is frozen at January 2025, causing hallucinated/outdated APIs when working with frameworks/libraries released or updated after that date.

**Solution**: Added Context7 MCP integration to provide Claude with up-to-date, version-specific documentation from npm, PyPI, and GitHub repositories.

**What is Context7?**
- MCP server that fetches latest framework/library documentation on-demand
- Overcomes Claude's training data cutoff by accessing current docs
- Prevents hallucinated APIs and outdated code generation
- Optional API key for higher rate limits and private repository access
- Works WITHOUT an API key (standard rate limits, public repos only)

**What Changed**:

**`/AgileFlow:setup-system` Command**:
- Added Context7 to MCP integration question: "Enable Context7? (Latest framework/library documentation) yes/no"
- Added Context7 detection in status reporting
- Added comprehensive Context7 setup section (after Notion section)
- Creates CLAUDE.md with Context7 usage instructions
- Shows Context7 as optional (works without API key)

**Context7 Setup Flow**:
1. Ask user if they want Context7 during MCP setup
2. If yes:
   - Add Context7 server to .mcp.json.example
   - Document CONTEXT7_API_KEY in .env.example (marked as OPTIONAL)
   - Add Context7 usage instructions to CLAUDE.md
   - Explain API key is optional (standard rate limits without key)
3. User copies templates: `cp .mcp.json.example .mcp.json && cp .env.example .env`
4. OPTIONAL: User adds CONTEXT7_API_KEY to .env for higher rate limits
5. Restart Claude Code to load Context7 MCP server
6. Claude now has access to current documentation automatically!

**CLAUDE.md Context7 Section** (added to user projects):
```markdown
## Context7 MCP Integration

**Purpose**: Access up-to-date framework/library documentation to overcome Claude's training data cutoff (January 2025).

**When to use Context7**:
- ✅ When working with frameworks/libraries where API may have changed since January 2025
- ✅ When implementing features using newer package versions
- ✅ When user mentions specific library versions (e.g., "React 19", "Next.js 15")
- ✅ When encountering deprecation warnings or outdated patterns
- ✅ When you're uncertain about current best practices for a library

**How to use Context7**:
Before generating code for modern frameworks/libraries, mentally note: "Should I check latest docs via Context7?"

**Available tools** (via MCP):
- Context7 tools are available as mcp__context7__* when you need them
- The system automatically fetches relevant documentation when you reference it

**Rate limits**:
- Without API key: Standard rate limits (sufficient for most projects)
- With API key (CONTEXT7_API_KEY in .env): Higher limits + private repos
```

**Configuration Files**:

**`.mcp.json.example`** (template):
```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp", "--api-key", "${CONTEXT7_API_KEY}"]
    }
  }
}
```

**`.env.example`** (template):
```bash
# Context7 API Key (OPTIONAL - for latest framework/library documentation)
# Get from: https://context7.com/dashboard
# IMPORTANT: Context7 works WITHOUT an API key (standard rate limits, public repos)
# API key provides: higher rate limits, private repo access, priority support
# If NOT using: Leave blank or remove this line
# Purpose: Provides Claude with up-to-date docs (overcomes January 2025 training cutoff)
CONTEXT7_API_KEY=your_context7_api_key_here
```

**Security Notes**:
- ✅ Context7 works WITHOUT an API key (standard rate limits, public repos only)
- ✅ If using API key: Use ${VAR} syntax in .mcp.json (reads from .env)
- ✅ Store actual key in .env (NOT .mcp.json)
- ✅ BOTH .mcp.json AND .env MUST be gitignored
- ✅ Commit .mcp.json.example and .env.example (templates with ${VAR} syntax)
- ❌ NEVER hardcode API key in .mcp.json
- ❌ NEVER commit .mcp.json or .env to git

**Benefits**:
- ✅ Overcomes Claude's training data cutoff (January 2025)
- ✅ Provides version-specific documentation (React 19, Next.js 15, etc.)
- ✅ Prevents hallucinated/outdated APIs
- ✅ Supports npm, PyPI, GitHub docs
- ✅ Works without API key for public repos (no friction)
- ✅ Optional API key for higher limits + private repos

### Fixed - Attribution Toggle Formatting

**Problem**: User feedback indicated "CRITICAL" should appear in generated CLAUDE.md (correct), but NOT in the /setup-system prompt itself.

**What Changed**:
- Removed "**CRITICAL - Git Attribution Preference**" from /setup-system prompt (line 91)
- Changed to: "**Git Attribution Preference** (ALWAYS ask on first setup):"
- The prompt now asks the question normally, without the "CRITICAL" emphasis
- The generated CLAUDE.md section (lines 169-199) still has "⚠️ CRITICAL: Git Commit Attribution Policy" (correct behavior)

**Why This Matters**:
- Setup prompt should be calm and professional
- CLAUDE.md is where the CRITICAL enforcement happens (for Claude's attention)
- Separates user-facing prompts from AI instructions

### Changed (Version Files)

- **plugin.json**: Updated version to 2.13.3
- **marketplace.json**: Updated description with "v2.13.3 - Added Context7 MCP for latest framework/library documentation"
- **CHANGELOG.md**: Added v2.13.3 section
- **commands/setup-system.md**: Fixed attribution toggle, added Context7 integration
- **.mcp.json.example**: Added Context7 server configuration
- **.env.example**: Added CONTEXT7_API_KEY documentation (marked as OPTIONAL)

### Technical

**Files Modified**:
- `commands/setup-system.md` - 2 changes:
  1. Removed "CRITICAL" from attribution question prompt (still in generated CLAUDE.md)
  2. Added full Context7 setup section (175 lines) with detection, configuration, usage instructions
- `.mcp.json.example` - Added Context7 server (npx @upstash/context7-mcp with ${CONTEXT7_API_KEY})
- `.env.example` - Added CONTEXT7_API_KEY with comprehensive documentation
- `.claude-plugin/plugin.json` - Version 2.13.2 → 2.13.3
- `.claude-plugin/marketplace.json` - Description updated with v2.13.3 and Context7

**Setup Flow Enhancement**:
- Detection phase now checks for Context7 in .mcp.json
- MCP question now includes Context7: "Enable Context7? (Latest framework/library documentation) yes/no"
- Status summary includes Context7: "Context7: ✅ Configured / ❌ Not configured / ℹ️ Optional"
- Full setup section with security notes, team onboarding, and usage instructions

**Why Patch Release (v2.13.3)**:
- Enhancement to existing /setup-system command
- No breaking changes (all changes are additive)
- Improves user experience (attribution question, Context7 access to current docs)
- Template files updated (.mcp.json.example, .env.example)

## [2.13.2] - 2025-10-25

### ⚠️ REVERTED (Same Day)

**This release was reverted the same day** - The .example template approach was solving a non-existent problem.

**Why reverted**: Claude Code automatically syncs all commands from `plugin.json` when users install/update the plugin. There's no need for template files - the commands are already available to users through the plugin system.

**What was removed**:
- `templates/validate-commands.md.example` - Deleted (unnecessary)
- `templates/release.md.example` - Deleted (unnecessary)
- `.claude/` from .gitignore - Removed (not needed in plugin repo)

**Original intent** (misguided): v2.13.0 added `/validate-commands` and `/release` as PLUGIN commands, but these were for the AgileFlow plugin itself (correct scope). v2.13.2 mistakenly tried to move them to user projects via templates, but this was unnecessary complexity.

**Correct understanding**:
- Plugin commands in `plugin.json` are automatically available to all users
- No need for .example templates or .claude/ directories in user projects
- Commands work via the plugin system - users just run `/AgileFlow:validate-commands`

### Removed (Reverted)

- **templates/validate-commands.md.example** - Deleted (plugin commands auto-sync)
- **templates/release.md.example** - Deleted (plugin commands auto-sync)
- **.gitignore** - Removed `.claude/` entry (not needed in plugin)

## [2.13.1] - 2025-10-25

### 🚨 CRITICAL FIX - Old Command Syntax in Agent Prompts

**Problem**: After v2.12.0 consolidated commands (41 → 36), all 8 agent prompts still contained OLD command syntax. This caused Claude to use incorrect commands like `/AgileFlow:chatgpt-research` instead of `/AgileFlow:chatgpt MODE=research`.

**User Impact**:
- ❌ Commands would fail (old command names don't exist)
- ❌ Agents would use wrong SlashCommand() syntax
- ❌ Frustrating user experience with broken references
- ❌ "/AgileFlow:" prefix missing in some examples

**Root Cause**: v2.12.0 updated command consolidation but forgot to update agent prompt files (the "everything is connected" lesson).

### Fixed

**Updated All Agent Prompts** (8 files):
- `agents/agileflow-mentor.md` - 8 old command references fixed
- `agents/agileflow-devops.md` - 7 old command references fixed
- `agents/agileflow-adr-writer.md` - 6 old command references fixed
- `agents/agileflow-epic-planner.md` - 4 old command references fixed
- `agents/agileflow-ci.md` - 3 old command references fixed
- `agents/agileflow-api.md` - 3 old command references fixed
- `agents/agileflow-ui.md` - 3 old command references fixed
- `commands/blockers.md` - 3 old command references fixed

**All Instances Fixed**:
```bash
# ChatGPT commands (5 → 1 with MODE parameter)
❌ /AgileFlow:chatgpt-research
❌ /AgileFlow:chatgpt-export
❌ /AgileFlow:chatgpt-note
✅ /AgileFlow:chatgpt MODE=research TOPIC="..."
✅ /AgileFlow:chatgpt MODE=export
✅ /AgileFlow:chatgpt MODE=note NOTE="..."

# Package commands (2 → 1 with ACTION parameter)
❌ /AgileFlow:dependency-update
❌ /AgileFlow:dependencies-dashboard
✅ /AgileFlow:packages ACTION=update
✅ /AgileFlow:packages ACTION=dashboard

# SlashCommand examples
❌ SlashCommand("/AgileFlow:chatgpt-research TOPIC=...")
✅ SlashCommand("/AgileFlow:chatgpt MODE=research TOPIC=\"...\"")
```

**Verification**:
- ✅ All agent files now use correct v2.12.0 syntax
- ✅ All SlashCommand() examples use /AgileFlow: prefix
- ✅ No more references to old command names
- ✅ MODE/ACTION parameters used correctly

### Technical

**Files Modified**: 8 agent files + 1 command file
- Bulk replacement with sed: `chatgpt-research → chatgpt MODE=research`
- Bulk replacement with sed: `dependency-update → packages ACTION=update`
- Bulk replacement with sed: `dependencies-dashboard → packages ACTION=dashboard`
- Manual fix: agileflow-devops.md line 219 (documentation comment)

**Validation**: Grepped entire codebase to confirm no old syntax remains outside CHANGELOG.md.

**Version Bump**: Patch release (2.13.0 → 2.13.1) - critical bug fix, no new features.

### Why This Matters

This is why we built `/validate-commands` in v2.13.0 - to catch exactly this kind of issue! The command consolidation in v2.12.0 broke agent prompts, and without validation, users experienced broken commands.

**Lesson**: When commands change, ALL references must update (plugin.json, marketplace.json, CHANGELOG.md, README.md, commands/*.md, **agents/*.md**). "Everything is connected."

### Changed (Version Files)

- **plugin.json**: Updated version to 2.13.1
- **marketplace.json**: Updated description with v2.13.1 and CRITICAL fix notice
- **CHANGELOG.md**: Added v2.13.1 section

## [2.13.0] - 2025-10-25

### 🎯 Quality Assurance & Developer Experience (36 → 38 commands)

This release adds powerful automation for validation, releases, and error recovery, significantly improving plugin quality and development workflows.

### Added

**Automated Validation** - `/validate-commands`:
- **Command Registry Validation** - Ensures all commands in plugin.json exist as files
- **Subagent Registry Validation** - Verifies all agents in plugin.json exist
- **Command Reference Validation** - Finds all /AgileFlow: references across 44 files
  - Detects broken command references (e.g., /chatgpt-research after v2.12.0 consolidation)
  - Reports exact file and line number for each broken reference
  - Validates that referenced commands actually exist
- **Version Sync Validation** - Checks plugin.json, marketplace.json, CHANGELOG.md match
- **Template Path Validation** - Verifies template references in commands exist
- **MCP Configuration Validation** - Checks for common token/config issues
- **Comprehensive Reporting** - Groups issues by severity with action items
- **Catches "Everything is Connected" Issues** - Prevents broken references after command changes

**Release Automation** - `/release VERSION=X.Y.Z`:
- **Automated Version Management** - Updates all 3 version files in sync
- **Pre-Release Validation** - Runs /validate-commands before proceeding
- **Interactive CHANGELOG Prompting** - Guides user through release notes
- **Git Workflow Automation** - Commit, push reminders, branch checks
- **Semantic Versioning Guide** - Explains when to bump MAJOR/MINOR/PATCH
- **Conventional Commit Format** - Generates properly formatted commit messages
- **Version Consistency Enforcement** - Prevents partial version updates
- **Critical Push Reminder** - Marketplace reads from GitHub (must push!)
- **Prevents Common Mistakes** - Version mismatches, forgotten CHANGELOG, unpushed commits

**Error Handling & Recovery** - Enhanced `/babysit`:
- **10 Common Failure Modes** documented with diagnosis and recovery:
  1. Command Not Found (after consolidations)
  2. Invalid JSON in status.json
  3. MCP Integration Failures
  4. Test Execution Failures
  5. Build Failures (TypeScript, npm)
  6. Git Conflicts
  7. Missing Prerequisites (docs/, stories)
  8. Permission Denied
  9. Command Execution Timeouts
  10. Dependency Version Conflicts
- **General Recovery Pattern** - 8-step systematic approach to errors
- **Proactive Error Prevention** - Validation before risky operations
- **Error Recovery Checklist** - Structured approach to diagnosing issues
- **Escalation Guidelines** - When to involve user (security, data loss, unknown errors)

### Improved

**Enhanced /babysit** - Comprehensive error handling section:
- Specific recovery steps for each error type
- Command references for resolution (e.g., /validate-commands, /packages)
- Proactive validation before file operations
- Clear explanation of what went wrong and why
- Links to relevant commands for fixing issues

**Release Process** - Streamlined and automated:
- Single command replaces manual 6-step process
- Validation catches issues before release
- No more version mismatches across files
- Automatic changelog prompting
- Git workflow integrated

**Quality Assurance** - Built-in validation:
- Run /validate-commands before every release
- Catches broken references immediately
- Ensures "everything is connected" principle
- Prevents shipping broken command references

### Technical

**Command Count**: 36 → 38 commands (+2):
- Added: `/validate-commands` (command integrity validation)
- Added: `/release` (automated version management)

**Files Modified**:
- Created: `commands/validate-commands.md` (command validation logic)
- Created: `commands/release.md` (release automation workflow)
- Enhanced: `commands/babysit.md` (added 210-line error handling section)
- Updated: `.claude-plugin/plugin.json` (added 2 commands, version 2.12.0 → 2.13.0)
- Updated: `.claude-plugin/marketplace.json` (description updated: 36 → 38 commands, v2.13.0)

**Validation Coverage**:
- 6 validation categories (registry, references, versions, templates, MCP)
- Scans all 44 plugin files (36 commands + 8 agents)
- Reports detailed statistics with action items

**Release Workflow**:
- 6-step automated process (validation → version update → changelog → diff → commit → push)
- Pre-release checks (format, git status, branch, remote)
- Semantic versioning guidance with examples
- Conventional commit message generation

**Error Handling**:
- 10 documented failure modes with recovery
- General recovery pattern (8 steps)
- Proactive prevention checklist
- Escalation guidelines for critical issues

### Benefits

**For Plugin Developers**:
- ✅ Catch broken references before users see them
- ✅ Automated version management (no manual file editing)
- ✅ Consistent releases with validation
- ✅ Better error messages and recovery guidance

**For Plugin Users**:
- ✅ Fewer broken command references
- ✅ Comprehensive error recovery documentation
- ✅ Clear guidance when things go wrong
- ✅ Better quality releases with validation

**For "Everything is Connected" Principle**:
- ✅ Validation ensures all connections intact
- ✅ Release automation prevents partial updates
- ✅ Error handling covers common disconnection scenarios
- ✅ Quality gates before every release

### Changed (Version Files)

- **plugin.json**: Updated version to 2.13.0, added 2 commands (38 total)
- **marketplace.json**: Updated description ("38 commands", v2.13.0 features)
- **CHANGELOG.md**: Added comprehensive v2.13.0 entry

## [2.12.0] - 2025-10-25

### 🎯 Command Consolidation (41 → 36 commands)

This release streamlines AgileFlow by consolidating redundant commands into unified commands with MODE/ACTION parameters, improving discoverability and user experience.

### Removed

**ChatGPT Commands (5 → 1)** - Consolidated into single `/chatgpt` command:
- **Removed**: `/chatgpt-refresh` (complete duplicate of `/chatgpt`)
- **Removed**: `/chatgpt-export` (now `/chatgpt MODE=export`)
- **Removed**: `/chatgpt-note` (now `/chatgpt MODE=note NOTE="..."`)
- **Removed**: `/chatgpt-research` (now `/chatgpt MODE=research TOPIC="..."`)

**Package Dependency Commands (2 → 1)** - Consolidated into single `/packages` command:
- **Removed**: `/dependencies-dashboard` (now `/packages ACTION=dashboard`)
- **Removed**: `/dependency-update` (now `/packages ACTION=update`)

**Why Consolidate?**
- ✅ Easier to discover - One command with modes vs 5+ separate commands
- ✅ Cleaner namespace - Reduced command clutter from 41 to 36
- ✅ Better UX - Related functionality grouped together
- ✅ Consistent patterns - MODE/ACTION parameters make capabilities obvious

### Changed

**ChatGPT Command** - Now unified with 4 modes:
```bash
# Generate/refresh full context (default)
/AgileFlow:chatgpt
/AgileFlow:chatgpt MODE=full

# Export concise excerpt for ChatGPT
/AgileFlow:chatgpt MODE=export

# Append timestamped note
/AgileFlow:chatgpt MODE=note NOTE="User reported auth bug"

# Build research prompt
/AgileFlow:chatgpt MODE=research TOPIC="Implement OAuth 2.0"
```

**Package Management Command** - Now unified with 3 actions:
```bash
# Show dependency dashboard (default)
/AgileFlow:packages
/AgileFlow:packages ACTION=dashboard OUTPUT=html

# Update dependencies with security audit
/AgileFlow:packages ACTION=update SCOPE=security
/AgileFlow:packages ACTION=update SCOPE=all AUTO_PR=yes

# Security audit only
/AgileFlow:packages ACTION=audit
```

**Renamed for Clarity**:
- `/status` → `/story-status` (clearer that it updates story status)
- `/assign` → `/story-assign` (clearer that it assigns stories)
- `/docs-sync` → `/doc-coverage` (clearer purpose: documentation coverage analysis)

### Improved

**Better Command Organization**:
- **ChatGPT workflows** - All ChatGPT operations in one place
- **Package management** - Dashboard, updates, and audits unified
- **Story operations** - Clearer naming (story-status, story-assign)

**Enhanced Discoverability**:
- MODE/ACTION parameters self-document capabilities
- Users discover all options from single command help
- Reduced cognitive load (fewer top-level commands to remember)

**Backward Compatibility**:
- All functionality preserved - nothing removed, just reorganized
- Existing usage patterns still work (same underlying behavior)
- Plugin.json updated with new command paths

### Technical

**Command Count Changes**:
- ChatGPT: 5 commands → 1 command (4 modes)
- Package deps: 2 commands → 1 command (3 actions)
- Renames: 3 commands (status, assign, docs-sync)
- **Total**: 41 commands → 36 commands (-5 commands)

**Files Modified**:
- Created: `commands/chatgpt.md` (combined from 5 files)
- Created: `commands/packages.md` (combined from 2 files)
- Renamed: `commands/status.md` → `commands/story-status.md`
- Renamed: `commands/assign.md` → `commands/story-assign.md`
- Renamed: `commands/docs-sync.md` → `commands/doc-coverage.md`
- Deleted: 6 redundant command files

**Registry Updates**:
- `.claude-plugin/plugin.json` - Updated commands array (41 → 36 entries)
- `.claude-plugin/marketplace.json` - Updated description ("36 commands")

### Migration Guide

**If you used ChatGPT commands**:
- `/chatgpt-refresh` → `/chatgpt` (or `/chatgpt MODE=full`)
- `/chatgpt-export` → `/chatgpt MODE=export`
- `/chatgpt-note NOTE="..."` → `/chatgpt MODE=note NOTE="..."`
- `/chatgpt-research TOPIC="..."` → `/chatgpt MODE=research TOPIC="..."`

**If you used dependency commands**:
- `/dependencies-dashboard` → `/packages` (or `/packages ACTION=dashboard`)
- `/dependency-update SCOPE=security` → `/packages ACTION=update SCOPE=security`

**If you used renamed commands**:
- `/status STORY=US-001 STATUS=done` → `/story-status STORY=US-001 STATUS=done`
- `/assign STORY=US-001 OWNER=AG-UI` → `/story-assign STORY=US-001 OWNER=AG-UI`
- `/docs-sync` → `/doc-coverage`

**No breaking changes** - All functionality preserved, just reorganized for better UX!

### Changed (Version Files)

- **plugin.json**: Updated version to 2.12.0, updated commands registry (41 → 36)
- **marketplace.json**: Updated description ("36 commands", v2.12.0 features)
- **CHANGELOG.md**: Added comprehensive v2.12.0 entry

## [2.11.0] - 2025-10-25

### 🚨 CRITICAL SECURITY FIX - MCP Token Management

**⚠️ URGENT**: This release fixes a critical security vulnerability that could cause MCP tokens (GitHub, Notion) to be leaked to git repositories.

#### What Was Wrong (v2.10.0 and earlier):
- `/AgileFlow:setup-system` did NOT ensure `.mcp.json` and `.env` were in user's `.gitignore`
- `.mcp.json.example` instructed users to HARDCODE tokens directly in `.mcp.json`
- No validation to detect if secrets were committed to git
- Users could accidentally commit tokens, exposing GitHub/Notion/database credentials

**This affected one of our users** - their `.mcp.json` wasn't gitignored and ALL TOKENS LEAKED (GitHub, Notion, everything). This release prevents that from happening again.

#### What's Fixed (v2.11.0):
✅ **Environment Variable Substitution** - `.mcp.json` now uses `${VAR}` syntax (reads from `.env`)
✅ **Actual tokens in `.env`** - NOT in `.mcp.json`
✅ **Both `.mcp.json` AND `.env` are gitignored** - `/setup-system` ensures this
✅ **Validation command** - `/AgileFlow:validate-system` detects leaked secrets
✅ **Updated documentation** - All MCP docs corrected across 6 files

### Fixed

**MCP Security** - Environment Variable Approach (CORRECT):

**Updated Files**:
- `.mcp.json.example` - Now uses `${GITHUB_PERSONAL_ACCESS_TOKEN}` and `${NOTION_TOKEN}` syntax
- `.env.example` - Comprehensive token documentation with security warnings
- `commands/setup-system.md` - Ensures `.mcp.json` and `.env` are in user's `.gitignore` (CRITICAL)
- `commands/validate-system.md` - New security validation checks (section 9)
- `CLAUDE.md` - Updated MCP Integration section with correct approach
- All other MCP documentation corrected

**New Security Checks in `/AgileFlow:validate-system`**:
- ❌ CRITICAL: Detects if `.mcp.json` or `.env` are committed to git
- ❌ CRITICAL: Detects if `.mcp.json` or `.env` are staged (not yet committed)
- ❌ CRITICAL: Detects hardcoded tokens in `.mcp.json`
- ⚠️  Warns if `.mcp.json` or `.env` not in `.gitignore`
- ⚠️  Warns if `.env` missing required tokens
- ✅ Validates `${VAR}` syntax is used in `.mcp.json`

**Wrapper Scripts** (for MCP servers without `${VAR}` support):
- Created `templates/mcp-wrapper-postgres.sh` - Example wrapper for Postgres MCP
- Created `templates/MCP-WRAPPER-SCRIPTS.md` - Comprehensive guide
- Documents when to use wrapper scripts vs direct `${VAR}` substitution
- GitHub MCP and Notion MCP support `${VAR}` (no wrapper needed)
- Postgres MCP requires wrapper (example provided)

### Added

**Metadata Tracking** - AgileFlow Version and Setup Health:

- **`templates/agileflow-metadata.json`** - Tracks AgileFlow setup version and health
  - AgileFlow version number (2.11.0)
  - Setup timestamp and last validation
  - Feature flags (epics, stories, ADRs, research, MCP integrations)
  - Directory structure validation
  - Git repository status (initialized, remote configured, remote URL)
  - Security status (`.mcp.json` gitignored, `.env` gitignored)

- **Deployed by `/AgileFlow:setup-system`** - Automatically created at `docs/00-meta/agileflow-metadata.json`
- **Validated by `/AgileFlow:validate-system`** - Checks version compatibility and setup health

**Git Remote Setup** - Every Project Needs Version Control:

- **Enhanced `/AgileFlow:setup-system`** with git repository setup
  - Detects if git is initialized
  - Asks for git remote URL if not configured
  - Configures `git remote add origin <url>`
  - Updates `agileflow-metadata.json` with remote URL
  - Provides next steps (first commit, push to remote)

**Why This Matters**:
- Version control for all AgileFlow docs (epics, stories, ADRs)
- Team collaboration via GitHub/GitLab
- Backup and disaster recovery
- Enables proper `.gitignore` for MCP secrets

### Improved

**Enhanced `/AgileFlow:validate-system`** - Comprehensive Security Validation:

Added **Section 9: MCP Security Validation (CRITICAL)** with 6 new checks:
1. `.gitignore` contains `.mcp.json` and `.env`
2. `.mcp.json` and `.env` NOT committed to git (detects leaked secrets)
3. `.mcp.json` and `.env` NOT staged (prevents committing)
4. `.mcp.json` uses `${VAR}` syntax (not hardcoded tokens)
5. `.env` exists with required tokens
6. AgileFlow metadata version and security flags
7. Git repository health (remote configured, unpushed commits)

**Output includes**:
- Security critical errors section (leaked secrets)
- Security warnings section (setup issues)
- Security next steps with remediation commands
- If secrets leaked: IMMEDIATE token revocation instructions

**Updated `/AgileFlow:setup-system`** - MCP Security Enforcement:

- **Step 3** (NEW): Ensures `.mcp.json` and `.env` in user's `.gitignore`
  ```bash
  grep -E '^\\.mcp\\.json$' .gitignore || echo ".mcp.json" >> .gitignore
  grep -E '^\\.env$' .gitignore || echo ".env" >> .gitignore
  ```

- **GitHub MCP Setup** - Updated instructions:
  - ✅ Use `${VAR}` in `.mcp.json`
  - ✅ Store tokens in `.env`
  - ✅ Both files MUST be gitignored
  - ❌ NEVER hardcode tokens
  - ❌ NEVER commit `.mcp.json` or `.env`

- **Notion MCP Setup** - Updated instructions (same pattern as GitHub)

- **Next Steps Printouts** - Updated to reflect env var approach

### Changed (Version Files)

- **plugin.json**: Updated version to 2.11.0
- **marketplace.json**: Updated description with "v2.11.0 - CRITICAL: MCP security fix, metadata tracking, git remote setup"
- **CHANGELOG.md**: Added comprehensive v2.11.0 entry

### Technical

- **Security Model Change**: Hardcoded tokens → `${VAR}` environment variable substitution
- **Template Files Added**: 3 new templates (agileflow-metadata.json, mcp-wrapper-postgres.sh, MCP-WRAPPER-SCRIPTS.md)
- **Documentation Update**: 6 files updated with correct MCP security approach
- **Validation Enhancement**: 7 new security checks in `/validate-system`
- **Setup Enhancement**: Git remote configuration added to `/setup-system`
- **Gitignore Enforcement**: `/setup-system` ALWAYS adds `.mcp.json` and `.env` to user's `.gitignore`

### Migration Guide

**If you're upgrading from v2.10.0 or earlier:**

1. **CRITICAL**: Check if your tokens leaked to git
   ```bash
   # Check if .mcp.json or .env are tracked
   git ls-files | grep -E '^\\.mcp\\.json$|^\\.env$'
   ```

   **If output is NOT empty** (files are tracked):
   ```bash
   # YOUR TOKENS ARE LEAKED - Follow these steps IMMEDIATELY:

   # 1. Remove from git
   git rm --cached .mcp.json .env

   # 2. Add to .gitignore
   echo ".mcp.json" >> .gitignore
   echo ".env" >> .gitignore

   # 3. Commit removal
   git commit -m "Remove leaked secrets from git"

   # 4. REVOKE AND REGENERATE ALL TOKENS IMMEDIATELY:
   #    - GitHub: https://github.com/settings/tokens (revoke old, create new)
   #    - Notion: https://www.notion.so/my-integrations (regenerate secret)

   # 5. Force push (ONLY if you haven't shared this branch publicly)
   git push --force

   # 6. If branch is public, assume tokens are compromised - revoke ASAP
   ```

2. **Update `.mcp.json.example`** to use `${VAR}` syntax:
   ```bash
   # Backup current
   cp .mcp.json.example .mcp.json.example.backup

   # Get updated template from AgileFlow v2.11.0
   # (copy from AgileFlow plugin templates/.mcp.json.example)
   ```

3. **Update `.env.example`** with new format:
   ```bash
   # Get updated template from AgileFlow v2.11.0
   # (copy from AgileFlow plugin templates/.env.example)
   ```

4. **Update your `.mcp.json`** to use `${VAR}`:
   ```bash
   # Edit .mcp.json
   # Change: "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_actual_token"
   # To:     "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PERSONAL_ACCESS_TOKEN}"
   ```

5. **Move tokens to `.env`**:
   ```bash
   # Create/edit .env
   echo "GITHUB_PERSONAL_ACCESS_TOKEN=ghp_your_actual_token_here" >> .env
   echo "NOTION_TOKEN=ntn_your_actual_token_here" >> .env
   ```

6. **Verify gitignore**:
   ```bash
   grep -E '\\.mcp\\.json|\\.env' .gitignore
   ```

7. **Restart Claude Code** (to reload MCP with env vars)

8. **Run validation**:
   ```bash
   /AgileFlow:validate-system
   ```

**If starting fresh with v2.11.0**:
- Just follow `/AgileFlow:setup-system` - it now does everything correctly!

## [2.10.0] - 2025-10-25

### Removed

**Command Cleanup: Removed 4 Redundant Commands (44 → 41 commands)**

Since 99% of users only use `/AgileFlow:babysit`, which can orchestrate everything, we removed redundant command shortcuts:

- **`/AgileFlow:agent-ui`** - Redundant (just invoked agileflow-ui subagent, which `/babysit` can do directly)
- **`/AgileFlow:agent-api`** - Redundant (just invoked agileflow-api subagent, which `/babysit` can do directly)
- **`/AgileFlow:agent-ci`** - Redundant (just invoked agileflow-ci subagent, which `/babysit` can do directly)
- **`/AgileFlow:readme-sync`** - Redundant (narrow scope, superseded by `/docs-sync` and `/babysit`)

**Why remove them?**
- The `/babysit` command already has full access to all 8 subagents via the Task tool
- These were just thin wrappers with no additional functionality
- Simplifies the command surface area
- **All 8 subagents remain** - they're the real power (agileflow-ui, agileflow-api, agileflow-ci, agileflow-mentor, agileflow-epic-planner, agileflow-adr-writer, agileflow-research, agileflow-devops)

### Changed

**Standardized Command References: ALL Commands Now Use `/AgileFlow:` Prefix**

Fixed command references across **all 65 markdown files** to use proper `/AgileFlow:` prefix:
- ❌ Before: `/epic-new`, `/story-new`, `/board`, `/github-sync`, `/notion-export`, etc.
- ✅ After: `/AgileFlow:epic-new`, `/AgileFlow:story-new`, `/AgileFlow:board`, `/AgileFlow:github-sync`, `/AgileFlow:notion-export`, etc.

**Files Updated** (65 total):
- All `commands/*.md` files (41 commands)
- All `agents/*.md` files (8 subagents)
- `README.md`, `SUBAGENTS.md`, `CHANGELOG.md`
- Template files in `templates/` directory

**Benefits**:
- ✅ Consistent command references throughout all documentation
- ✅ Proper namespace indication (commands belong to AgileFlow plugin)
- ✅ No confusion with built-in CLI commands
- ✅ Better discoverability in Claude Code command palette

### Improved

**Enhanced `/AgileFlow:babysit` - README.md Files Now Prioritized in Knowledge Loading**

The `/babysit` command now explicitly prioritizes README.md files at startup:

**New Knowledge Loading Order**:
1. **README.md Files (READ FIRST)** - Now the top priority
   - Root `README.md` - Project overview, setup, getting started, architecture
   - `docs/README.md` - Documentation structure
   - ALL `docs/**/README.md` - Folder-specific docs with TODOs, open questions, risks
   - `src/README.md` and module READMEs - Code organization docs
   - Extracts critical info: TODOs, open questions, planned features, known risks

2. **Core Context Files** - CLAUDE.md, docs/chatgpt.md
3. **AgileFlow Command Files** - All 41 command capabilities
4. **AgileFlow State & Planning** - status.json, bus/log.jsonl, epics, stories, ADRs, research

**Why This Matters**:
- README files contain the most important project context for starting work
- AI assistant now understands project setup, architecture, and open questions immediately
- Better informed decision-making from the start
- Reduces "what is this project?" questions

**README.md Maintenance Emphasis Added**

Added **README.MD MAINTENANCE** sections to proactively update documentation:

**In `/AgileFlow:babysit` command**:
- Added "README.MD MAINTENANCE (proactive, CRITICAL PRIORITY)" section
- Lists when to update README (after features, architectural changes, dependencies, scripts, patterns)
- Specifies which READMEs to update (root, docs, modules, components)
- Includes examples of README updates for common scenarios
- **CRITICAL**: "Do NOT wait for user to ask - proactively suggest README updates after significant work"

**In `agileflow-ui` subagent**:
- Added "README.MD MAINTENANCE (Proactive - CRITICAL PRIORITY for UI work)" section
- UI-specific guidance: design system docs, component catalogs, styling conventions
- Emphasizes documenting theming, dark mode, component props, accessibility
- Examples: design token usage, component README updates, styling approach changes

**Benefits**:
- ✅ READMEs stay current with actual codebase
- ✅ Onboarding friction reduced for new developers
- ✅ AI assistant has accurate context for all future work
- ✅ Documentation rot prevented

**Clarified `docs/02-practices` Purpose**

Updated `/AgileFlow:setup-system` and `/babysit` to clarify that **docs/02-practices is for USER'S CODEBASE practices**, NOT AgileFlow system practices:

**Added to `/setup-system`**:
```
**IMPORTANT - docs/02-practices Purpose**:
- docs/02-practices is for **USER'S CODEBASE practices** (NOT AgileFlow system practices)
- Examples: Styling conventions, typography standards, CSS architecture, component patterns, API design patterns
- AgileFlow system documentation goes in docs/00-meta/ (guides, templates, scripts)
- This distinction ensures clarity between "how we build the product" vs "how we use AgileFlow"
```

**Added to `/babysit` KNOWLEDGE INDEX**:
- Full directory structure explanation with docs/02-practices clearly labeled as "USER'S CODEBASE practices"
- Examples: styling, typography, component patterns, API conventions
- Clear separation from AgileFlow system docs (docs/00-meta/)

**Why This Matters**:
- Prevents mixing of project-specific practices with AgileFlow system documentation
- Clear separation of concerns: "how we build our product" vs "how we use AgileFlow"
- Better organization for teams using AgileFlow
- Reduces confusion about where to put different types of documentation

### Technical

- **Command Count**: Reduced from 44 to 41 commands (removed 4 redundant shortcuts)
- **Files Modified**: 65 markdown files updated with `/AgileFlow:` prefix standardization
- **Documentation Enhancement**: README.md maintenance protocols added to 2 key commands
- **Clarity Improvement**: docs/02-practices purpose clarified in 2 command files
- **Knowledge Loading**: /babysit now prioritizes README.md files (4-phase loading sequence)

### Changed (Version Files)

- **plugin.json**: Updated version to 2.10.0, removed 4 commands from registry (44 → 41)
- **marketplace.json**: Updated description with "41 commands" and v2.10.0 features
- **CHANGELOG.md**: Added comprehensive v2.10.0 entry

## [2.9.0] - 2025-10-24

### Added

**Git Worktrees Guide for Context Preservation**

This release adds comprehensive documentation and tooling for using git worktrees with AgileFlow, enabling developers to work on multiple features simultaneously while preserving AI context in each `/babysit` session.

#### 📚 **Worktrees Guide** (`docs/00-meta/guides/worktrees.md`)
- **What Are Git Worktrees?** - Explanation of multiple working directories for same repo
- **Key Benefits**:
  - Context Preservation - Each worktree maintains independent `/babysit` session with full AI context
  - Zero Context Switching - No need to `git stash` and re-explain work to Claude
  - Safe Isolation - Experiment with risky changes without affecting main work
  - Instant Availability - Main work stays exactly as you left it

- **✅ GOOD Use Cases**:
  - **Critical Hotfix During Feature Development** - Handle urgent production bugs without losing feature work context
  - **Comparing Architectural Approaches** - Test GraphQL vs REST side-by-side with separate `/babysit` sessions
  - **Safe Testing of Risky Refactors** - Isolate experimental migrations from stable codebase

- **⚠️ CRITICAL LIMITATIONS**:
  - **DO NOT Run Multiple Babysits on Same Epic** - AgileFlow's `status.json` uses read-modify-write (race condition risk)
  - **The Golden Rule**: Use worktrees for **ISOLATION** (different features), not **PARALLEL EXECUTION** (concurrent edits to same epic)
  - Prominent warnings about file-based coordination (`status.json`, `bus/log.jsonl`)

- **Quick Start Guide**:
  - Helper script usage instructions
  - Manual worktree creation steps
  - Cleanup procedures

- **Best Practices**:
  - One epic per worktree (keep work streams completely separate)
  - Descriptive naming conventions
  - Regular cleanup of merged worktrees
  - Independent dependencies per worktree

- **Integration with AgileFlow**:
  - Message bus coordination (`bus/log.jsonl` is append-only, safer for concurrent use)
  - GitHub & Notion MCP sync (both update same remote workspace)
  - Troubleshooting guide for common issues

#### 🛠️ **Worktree Helper Script** (`docs/00-meta/scripts/worktree-create.sh`)
- **Automated Worktree Creation**:
  - Proper naming conventions (`../myapp-feature-name`)
  - Branch management with base branch support
  - Safety checks (existing directories, branch conflicts)
  - Colorized terminal output with clear instructions

- **Features**:
  - Base branch validation (defaults to `main`)
  - Worktree path conflict detection
  - Existing branch handling
  - Post-creation guidance (how to open editor, start `/babysit`)

- **Safety Checks**:
  - Git repository detection
  - Feature name requirement
  - Base branch existence verification
  - Directory conflict prevention
  - Branch status reporting

- **User Guidance**:
  - Step-by-step next actions
  - Important reminders about isolation vs parallel execution
  - Links to comprehensive documentation
  - All active worktrees listing

#### 🔧 **Enhanced /AgileFlow:setup-system Command**
- **New Directories Created**:
  - `docs/00-meta/guides/` - AgileFlow system guides
  - `docs/00-meta/scripts/` - Helper scripts

- **New Files Seeded**:
  - `docs/00-meta/guides/worktrees.md` - Copied from `templates/worktrees-guide.md`
  - `docs/00-meta/scripts/worktree-create.sh` - Copied from `templates/worktree-create.sh` (made executable)

- **Automatic Deployment**:
  - Users running `/setup-system` automatically get worktrees guide and helper script
  - Zero manual setup required
  - Files placed in correct location (`00-meta/` for AgileFlow system documentation)

#### 📖 **Enhanced README Documentation**
- **New "Advanced Workflows" Section**:
  - Git worktrees quick start
  - Key benefits summary
  - Critical warning about isolation vs parallel execution
  - Links to comprehensive guide in user projects

### Changed

- **plugin.json**: Updated version to 2.9.0
- **marketplace.json**: Updated description to reflect v2.9.0 and worktrees feature
- **commands/setup-system.md**: Added worktrees guide and script deployment
- **README.md**: Added "Advanced Workflows" section with worktrees documentation

### Technical

- **Template System**: Added 2 new templates for worktrees documentation and tooling
- **Location Strategy**: Files placed in `docs/00-meta/` (AgileFlow system meta-documentation) rather than `docs/02-practices/` (codebase practices)
- **Documentation-Only Release**: No new commands or subagents, purely documentation and tooling
- **File-Based Coordination**: Explicitly documented limitations of concurrent `status.json` edits
- **Message Bus Safety**: Documented that `bus/log.jsonl` (append-only JSONL) is safer for concurrent use than `status.json` (read-modify-write)

**Why Documentation-Only?**
- The `/babysit` command already understands worktrees through `CLAUDE.md` and documentation
- Users need education on **when to use worktrees** (isolation) vs **when NOT to use them** (parallel execution on same epic)
- Worktrees are a git feature, not an AgileFlow feature - we just need to explain safe usage patterns
- AgileFlow's file-based coordination naturally supports isolation but has limitations for parallel execution

## [2.8.0] - 2025-10-22

### Added

**System Validation, Blocker Tracking, and Sprint Planning (3 new commands)**

This release focuses on quality assurance, workflow optimization, and intelligent planning capabilities.

#### 🔍 **JSON Schema Validation** (`/validate-system`)
- **Schema Definitions**: Added JSON schemas for `status.json` and `bus/log.jsonl` messages
  - `schemas/status.schema.json` - Validates story structure, required fields, enums
  - `schemas/bus-message.schema.json` - Validates message bus format and message types
- **Comprehensive System Validation**: `/validate-system` command performs 8 validation categories:
  1. **JSON Schema Validation** - Validates status.json and bus messages against schemas
  2. **Orphaned Story Detection** - Finds stories in status.json without files (and vice versa)
  3. **WIP Limit Violations** - Detects agents exceeding max 2 in-progress stories
  4. **Dependency Validation** - Checks for circular dependencies and invalid references
  5. **Story Files Validation** - Ensures AC and test stubs exist
  6. **Epic Validation** - Verifies epic references are valid
  7. **Data Freshness Checks** - Flags stale in-progress (>7 days) and blocked (>14 days) stories
  8. **Integration Consistency** - Validates GitHub/Notion sync mappings
- **Detailed Reporting**: Groups issues by severity (Critical → Warning → Info) with statistics
- **Actionable Recommendations**: Suggests specific fix commands for each issue type
- **Read-Only Safety**: Validation never modifies files, only reports inconsistencies

#### 🚧 **Blocker Dashboard** (`/blockers`)
- **Comprehensive Blocker Extraction**: Extracts 4 types of blockers:
  1. **Direct Blockers** - Stories with status="blocked"
  2. **Dependency Blockers** - Stories waiting on incomplete dependencies
  3. **WIP Capacity Blockers** - Agents at limit with ready stories waiting
  4. **Stale Blockers** - Blocked >14 days (critical priority)
- **Blocker Categorization**: Automatically categorizes by type:
  - Technical (missing APIs, infrastructure)
  - Coordination (waiting on other agents)
  - Clarification (unclear requirements)
  - External (third-party dependencies)
  - Capacity (agent bandwidth)
  - Research (needs investigation)
- **AG-API ↔ AG-UI Coordination Analysis** (leverages v2.7.0):
  - Shows which AG-UI stories are blocked waiting for AG-API
  - Displays AG-API progress on unblocking stories
  - Estimates unblock timeline based on story estimates
  - Highlights recent AG-API unblock messages from bus
- **Resolution Suggestions**: Provides actionable recommendations for each blocker:
  - Technical: Completion estimates, interim workarounds (mocks, feature flags)
  - Coordination: Handoff suggestions, communication gaps
  - Clarification: Specific questions to ask, AC analysis
  - External: Escalation paths, parallel work suggestions
  - Capacity: Workload redistribution, bandwidth forecasts
  - Research: Links to docs/10-research/, suggests `/chatgpt-research`
- **ADR & Research Linking**: Automatically links relevant ADRs and research notes based on keyword matching
- **Recently Resolved Tracking**: Shows blockers resolved in last 7 days (with `SHOW_RESOLVED=true`)
- **Prioritized Actions**: Lists specific next commands to resolve blockers

#### 📅 **Sprint Planning** (`/sprint-plan`)
- **Data-Driven Planning**: Creates sprint plans based on historical velocity and team capacity
- **5-Phase Planning Process**:
  1. **Current State Analysis** - Agent capacity assessment, backlog health check
  2. **Historical Velocity Calculation** - Team and per-agent velocity from last 30 days
  3. **Story Selection & Prioritization** - Validates dependencies, respects backlog order
  4. **Risk Assessment** - Dependency chains, cross-agent coordination, epic freshness
  5. **Sprint Commitment** - Updates status.json and milestones.md (if `MODE=commit`)
- **Intelligent Story Selection**: 7 prioritization criteria:
  1. Story must be "ready" (Definition of Ready met)
  2. Dependencies resolved (all deps status="done")
  3. Backlog priority (from backlog.md/roadmap.md)
  4. Epic alignment (optional `FOCUS_EPIC` parameter)
  5. Milestone deadlines (urgent items from milestones.md)
  6. Team capacity (respects calculated velocity)
  7. Agent balance (distributes work evenly)
- **Velocity Forecasting**: Analyzes completed stories from last 30 days:
  - Calculates team velocity (total days completed)
  - Per-agent velocity for accurate capacity planning
  - Projects capacity for sprint duration (default: 10 days)
  - Uses historical data or defaults if insufficient history
- **Risk Analysis**:
  - **Dependency Chain Analysis** - Warns about stories blocking others
  - **Cross-Agent Coordination Check** - Identifies AG-API + AG-UI work requiring sequencing
  - **Stale Epic Check** - Flags mixing of old and new epics
- **Sprint Modes**:
  - `MODE=suggest` (default) - Preview sprint plan without modifications
  - `MODE=commit` - Updates status.json with sprint metadata and creates milestone
- **Comprehensive Output**: Includes capacity analysis, backlog status, recommended commitment, deferred stories, sprint goals, risks, timeline, and next steps

### Technical

- **Command Count**: Increased from 41 to 44 commands
- **New Schema Files**: Added 2 JSON schema definitions in `schemas/` directory
- **Validation Coverage**: 8 validation categories covering entire AgileFlow system
- **Blocker Types**: Tracks 6 distinct blocker categories with 4 extraction methods
- **Planning Phases**: 5-phase sprint planning process with 7 prioritization criteria

### Changed

- **plugin.json**: Updated version to 2.8.0, added 3 new commands to registry
- **marketplace.json**: Updated description to reflect 44 commands and v2.8.0 features

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

**Command: /AgileFlow:babysit - GitHub MCP Integration**

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
- Removed legacy GitHub CLI references from /AgileFlow:babysit command
- Added GitHub MCP sync automation to /AgileFlow:babysit implementation flow

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

4. **Continue using /AgileFlow:github-sync as before** - All existing `docs/08-project/github-sync-map.json` files remain compatible

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
6. Verify: Run `/AgileFlow:notion-export DRY_RUN=true`
7. Resume syncing: Run `/notion-export`

**IF STARTING FRESH**:
1. Create Notion integration: https://www.notion.so/my-integrations
2. Add NOTION_TOKEN to .env
3. Run `/setup-system` and select "yes" for Notion
4. Restart Claude Code
5. Run `/AgileFlow:notion-export MODE=setup` to create databases
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
  - Integration with /AgileFlow:metrics for data-driven insights

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

**Enhanced /AgileFlow:babysit and agileflow-mentor**:
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
