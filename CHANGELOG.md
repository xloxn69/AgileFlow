# Changelog

All notable changes to the AgileFlow plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.31.0] - 2025-12-12

### Added - Dynamic Content Injection System

Implemented placeholder-based dynamic content injection system to keep command files automatically updated with current agents and commands.

**Problem Solved**:
Command files (like `babysit.md`, `help.md`) had hardcoded agent and command lists that required manual updates when adding/removing agents or commands. This caused maintenance burden and risk of outdated information.

**Solution**:
- Source files use placeholders: `<!-- {{AGENT_LIST}} -->` and `<!-- {{COMMAND_LIST}} -->`
- New content-injector module scans agents/ and commands/ directories
- During installation, placeholders are replaced with current agent/command lists
- Installed files always have up-to-date information (50 agents, 39 commands)

**Implementation**:
- `tools/cli/lib/content-injector.js` - Scans frontmatter and generates formatted lists
- Base IDE installer enhanced with `injectDynamicContent()` method
- All 3 IDE installers updated (Claude Code, Cursor, Windsurf)
- `babysit.md` and `help.md` converted to use placeholders

**Benefits**:
- Zero maintenance: Add/remove agents → automatically reflected in installed files
- Always current: No manual updates needed
- Clean source: Source files are minimal and readable
- Works everywhere: All IDEs get the same dynamic injection

### Changed - Brand Identity Update

Updated ASCII logo and brand color for improved visual identity.

**Changes**:
- **New ASCII Logo**: Replaced old text-based logo with bold Unicode block-style logo
- **Brand Color**: Changed from cyan to custom brand color `#C15F3C` (burnt orange/terracotta)

**Files Updated**:
- `ui.js` - Logo display and section headers
- `docs-setup.js` - Docs structure creation messages
- All IDE installers (claude-code.js, cursor.js, windsurf.js) - Setup messages

**New Logo**:
```
 █████╗  ██████╗ ██╗██╗     ███████╗███████╗██╗      ██████╗ ██╗    ██╗
██╔══██╗██╔════╝ ██║██║     ██╔════╝██╔════╝██║     ██╔═══██╗██║    ██║
███████║██║  ███╗██║██║     █████╗  █████╗  ██║     ██║   ██║██║ █╗ ██║
██╔══██║██║   ██║██║██║     ██╔══╝  ██╔══╝  ██║     ██║   ██║██║███╗██║
██║  ██║╚██████╔╝██║███████╗███████╗██║     ███████╗╚██████╔╝╚███╔███╔╝
╚═╝  ╚═╝ ╚═════╝ ╚═╝╚══════╝╚══════╝╚═╝     ╚══════╝ ╚═════╝  ╚══╝╚══╝
```

## [2.30.0] - 2025-12-11

### Added - Automatic Docs Structure & Customizable Folder Names

**Problem Solved**:
Previously, users had to run two separate commands to get started. This release streamlines onboarding.

**Solution**:
- `npx agileflow install` now creates both IDE config AND docs structure
- Users can customize the docs folder name during installation
- `npx agileflow update` ensures all docs files exist (idempotent)

### Fixed - Cursor IDE Configuration Path

**Issue**: Cursor installer was using `.cursor/rules/` (deprecated) instead of `.cursor/commands/` per official Cursor documentation.

**Fix**:
- Changed Cursor installer from `.cursor/rules/agileflow/*.mdc` to `.cursor/commands/AgileFlow/*.md`
- Updated cleanup to remove old `.cursor/rules/agileflow/` directory
- Now uses plain Markdown files like Claude Code

**Reference**: Cursor official docs state "Commands are defined as plain Markdown files that can be stored in three locations: Project commands: Stored in the .cursor/commands directory"

### Changed

**Installation Flow**:
- `npx agileflow install` now creates both IDE config AND docs structure in one step
- No need to run `/AgileFlow:setup` separately
- Prompts for docs folder name during installation

**Update Flow**:
- `npx agileflow update` now ensures docs structure is complete
- Reads existing docs folder name from metadata
- Creates any missing README files or directories

**IDE Installers**:
- All installers now copy full command/agent/skill content (not launcher stubs)
- All installers apply docs folder name replacement to .md files
- Commands/agents/skills work offline without needing to reference source files

## [2.30.0] - 2025-12-12

### Added - Content Generation System

Implemented automated content generation system to eliminate manual synchronization debt across AgileFlow documentation and command files.

**Problem Solved**:
Previously, adding new commands, agents, or skills required manually updating multiple files (help.md, babysit.md, README.md, SUBAGENTS.md). This created sync debt where documentation would become outdated.

**Solution**:
Frontmatter-driven metadata extraction with automated content injection using AUTOGEN markers.

**Architecture**:
```
scripts/generators/
├── index.js                 # Orchestrator (runs all generators)
├── command-registry.js      # Scans commands/*.md for frontmatter
├── agent-registry.js        # Scans agents/*.md for frontmatter
├── skill-registry.js        # Scans skills/*/SKILL.md for frontmatter
├── inject-help.js           # Generates command list for help.md
├── inject-babysit.js        # Generates agent list for babysit.md
└── inject-readme.js         # Generates stats/tables for README.md
```

**Usage**:
```bash
# Run all generators at once
bash packages/cli/scripts/generate-all.sh

# Or run individually
node packages/cli/scripts/generators/index.js
```

**Files with AUTOGEN Markers**:
- `commands/help.md` - Auto-generates command list (41 commands, grouped by category)
- `commands/babysit.md` - Auto-generates agent list (26 agents with descriptions, tools, categories)
- `README.md` - Auto-generates stats (41 commands, 26 agents, 23 skills)

**Benefits**:
- **Zero sync debt**: One source of truth (frontmatter metadata)
- **Automatic updates**: Adding new command/agent/skill automatically updates all references
- **Less manual work**: No more editing multiple files for same change
- **Consistency**: Generated content always matches actual code

**When to Run**:
After adding/removing/renaming commands, agents, or skills, or after changing descriptions/metadata.

**Developer Notes**:
Do not manually edit content between AUTOGEN markers - changes will be overwritten on next generation.

### Changed - Agent Naming Convention

Removed `agileflow-` prefix from all 26 agent filenames for cleaner, more concise naming.

**Before**: `agileflow-ui.md`, `agileflow-api.md`, `agileflow-ci.md`
**After**: `ui.md`, `api.md`, `ci.md`

**Files Renamed** (26 agents):
- Core: ui, api, ci, devops, security, database, testing, qa
- Specialized: performance, mobile, integrations, refactor, design
- Advanced: accessibility, analytics, datamigration, monitoring, compliance
- Planning: epic-planner, adr-writer, research, product, mentor
- Template: context7

**References Updated** (46 files):
All command files, README.md, SUBAGENTS.md, and CLAUDE.md updated to use new agent names.

**Rationale**:
The `agileflow-` prefix was redundant since all agents are already scoped within the AgileFlow system. Shorter names improve readability and reduce verbosity in command invocations.

### Changed - Repository Migration

Migrated repository from `xloxn69/AgileFlow` to `projectquestorg/AgileFlow`.

**Updated**:
- Package name: `@xloxn69/agileflow` → `agileflow`
- Repository URLs: Updated in package.json, README.md
- All documentation references to new repository URL

### Improved - Documentation Cleanup

**README.md**:
- Removed "Repository Structure" section (monorepo details no longer needed)
- Removed development commands (npm run dev:website, dev:docs, build:all)
- Streamlined to focus on user-facing features and installation

**CLAUDE.md**:
- Added "Content Generation System (v2.30.0+)" section
- Documented registry scanners, content injectors, and orchestration
- Added workflow examples for adding new agents with auto-generation
- Clarified when to run generators and how AUTOGEN markers work

## [2.29.0] - 2025-12-08

### Added - TODO List Tracking for Complex Commands

Commands now create and track todo lists for multi-step workflows, ensuring comprehensive execution without missed steps.

**What Changed**:
Added TODO LIST TRACKING sections to 22 complex commands. Each command now:
- Creates a todo list immediately when invoked (using TodoWrite tool)
- Tracks progress through multi-step workflows
- Marks each step complete as it progresses
- Ensures nothing is forgotten in complex operations

**Commands Enhanced** (22 total):
- Core workflows: `/epic`, `/story`, `/setup`, `/babysit`, `/context` (MODE=full and MODE=research)
- Session harness: `/session-init`, `/verify`, `/resume`, `/baseline`
- Complex operations: `/auto`, `/sprint`, `/retro`, `/story-validate`
- Infrastructure: `/deploy`, `/ci`, `/tests`, `/packages`
- Documentation: `/adr`, `/handoff`, `/pr`, `/research`

**Example Workflow** (`/epic` command):
```
1. Parse inputs (EPIC, TITLE, OWNER, GOAL, STORIES)
2. Create docs/05-epics/<EPIC>.md from template
3. For each story: create docs/06-stories/<EPIC>/<US_ID>-<slug>.md
4. Merge entries into docs/09-agents/status.json
5. Append assign lines to docs/09-agents/bus/log.jsonl
6. Show preview and wait for YES/NO confirmation
```

**Benefits**:
- **Comprehensive execution**: No more forgotten steps in complex workflows
- **Progress visibility**: Users can see exactly what's happening
- **Error recovery**: Easy to resume if interrupted
- **Consistency**: Every command follows same tracking pattern

### Improved - Research Workflow Enhancement

Enhanced `/AgileFlow:context MODE=research` with complete two-step workflow:

**STEP 1 - Generate Research Prompt**:
- Creates comprehensive prompt for web AI tools (ChatGPT, Perplexity, etc.)
- Instructs user to paste results back

**STEP 2 - Store Research Results** (NEW):
- When user returns with research, automatically:
  - Formats into structured markdown with all sections
  - Preserves ALL content (code snippets, main points, context)
  - Saves to `docs/10-research/YYYYMMDD-topic-slug.md`
  - Updates `docs/10-research/README.md` index
  - Asks if user wants to create ADR/Epic/Story from research
  - Auto-links research file from created ADR/Epic/Story

**Format Structure**:
```markdown
# [Topic Title]
- Summary (2-3 paragraphs)
- Key Findings (with details)
- Implementation Approach
- Code Snippets (preserved exactly)
- Security Considerations
- Testing Strategy
- Risks & Gotchas
- ADR Recommendation
- Story Breakdown
- References (with URLs and dates)
```

**Integration**:
Research files are now automatically referenced in ADRs/Epics/Stories:
```markdown
**Research**: See [Topic Research](../10-research/YYYYMMDD-topic-slug.md)
```

### Improved - Babysit Command Research Guidance

Updated `/AgileFlow:babysit` to emphasize `/context MODE=research` as a valuable tool for avoiding debugging headaches:

- Presented as helpful tip (not mandatory)
- Focuses on practical benefit: learn patterns upfront, avoid issues later
- Suggests using when: implementing new features, researching best practices, exploring unfamiliar tech
- Highlights time savings from research-first approach

**Example scenarios**:
- "Implementing JWT authentication" → Research security patterns first
- "Adding payment processing" → Research Stripe integration best practices
- "Building real-time features" → Research WebSocket patterns and gotchas

## [2.28.0] - 2025-12-06

### Fixed - Session Harness Hook Configuration

Fixes critical bug where `/AgileFlow:session-init` configured SessionStart hooks incorrectly, causing "No such file or directory" errors.

**The Problem**:
- `/AgileFlow:session-init` tried to execute `/AgileFlow:resume` as a shell command via hooks
- Slash commands are Claude Code commands, NOT shell executables
- Hook system tried to run: `/bin/sh -c /AgileFlow:resume`
- Result: "SessionStart:startup hook error: /AgileFlow:resume: No such file or directory"

**The Solution**:
Created shell wrapper script that replicates `/AgileFlow:resume` functionality and can be executed by hooks.

**Changes**:
- **New Template**: `templates/resume-session.sh` - Shell script for automatic session resumption
- **Updated Command**: `commands/session-init.md` - Now creates resume-session.sh and configures hook correctly
- **Hook Configuration**: Changed from `"/AgileFlow:resume"` to `"bash docs/00-meta/resume-session.sh"`

**What the Shell Script Does**:
1. Runs init script (`docs/00-meta/init.sh`) - Environment setup
2. Runs test verification - Detects regressions
3. Loads session context - Recent commits, active stories
4. Shows session summary - Status, baseline info

**Before (BROKEN)**:
```json
{
  "hooks": {
    "SessionStart": [{
      "hooks": [{
        "type": "command",
        "command": "/AgileFlow:resume"  // ❌ Slash commands don't work in hooks!
      }]
    }]
  }
}
```

**After (FIXED)**:
```json
{
  "hooks": {
    "SessionStart": [{
      "hooks": [{
        "type": "command",
        "command": "bash docs/00-meta/resume-session.sh"  // ✅ Shell script works!
      }]
    }]
  }
}
```

**User Impact**:
- ✅ Automatic session resumption now works correctly
- ✅ No more "file or directory" errors on session start
- ✅ Users who already ran `/AgileFlow:session-init` should re-run it to get the fix
- ✅ Manual workaround: Run `/AgileFlow:resume` manually at session start (still works)

**Files Modified**:
- `templates/resume-session.sh` (NEW) - Shell wrapper for session resume
- `commands/session-init.md` - Updated hook configuration logic and documentation

**Note**: Slash commands like `/AgileFlow:resume` still work manually - this only affects automatic hook execution.

## [2.27.0] - 2025-12-06

### Fixed - Setup Version Synchronization

Ensures `/AgileFlow:setup` always uses the current plugin version when initializing projects.

**Changes**:
- **Template Update**: Updated `templates/agileflow-metadata.json` from v2.10.0 → v2.26.0
- **Setup Command**: Updated `commands/setup.md` to explicitly read current version from plugin.json (v2.21.0 → v2.26.0)
- **Documentation**: Added instruction to always use CURRENT plugin version when creating agileflow-metadata.json

**Why This Matters**:
- Projects initialized with `/AgileFlow:setup` now correctly show current plugin version
- Metadata version matches installed plugin version (prevents confusion)
- Future version bumps only require updating plugin.json and template (setup auto-reads current version)

**Files Modified**:
- `templates/agileflow-metadata.json` - Version field updated to 2.26.0
- `commands/setup.md` - Added explicit instruction to read version from plugin.json during setup

**Note**: The `/AgileFlow:help` command already exists and is properly configured.

## [2.26.0] - 2025-12-06

### Added - Session Harness System (Phase 3: Dev Agent Integration)

Completes Phase 3 of the Session Harness System with comprehensive verification protocols integrated into all dev agents and orchestration tools. This ensures agents cannot claim work is complete when tests fail, and maintains test baselines across all implementations.

**Core Achievement**: All dev agents now enforce test verification before marking stories complete.

**Dev Agent Updates (18 agents)**:

All implementation agents now include SESSION HARNESS & VERIFICATION PROTOCOL section with:
- **Pre-Implementation Verification**: Check test_status before starting work
- **During Implementation**: Incremental testing with `/AgileFlow:verify`
- **Post-Implementation Verification**: Mandatory test verification before marking in-review
- **Override Protocol**: Documented process for proceeding with failing tests (rare, requires full documentation)
- **Baseline Management**: Suggest baseline creation after major milestones
- **Session Resume**: Load context from previous sessions and detect regressions

**Updated Agents**:
1. ui (UI/presentation layer)
2. api (Backend services)
3. ci (CI/CD & quality)
4. devops (DevOps & automation)
5. security (Security specialist)
6. database (Database & data layer)
7. testing (Testing specialist)
8. performance (Performance optimization)
9. mobile (Mobile development)
10. integrations (Third-party integrations)
11. refactor (Refactoring specialist)
12. design (Design systems)
13. accessibility (Accessibility compliance)
14. analytics (Analytics implementation)
15. datamigration (Data migration specialist)
16. monitoring (Monitoring & observability)
17. compliance (Compliance specialist)
18. qa (QA & test planning)

**Command Updates**:
- **`/AgileFlow:babysit`**: Enhanced with comprehensive session harness integration
  - Detection & initialization prompts for new projects
  - Auto-resume integration at session start
  - Pre/during/post implementation verification guidance
  - Baseline management suggestions after milestones
  - Error handling for test failures and regressions
  - Guides spawned dev agents on verification protocols

**Verification Protocol Details**:

1. **Pre-Implementation**:
   - Check `test_status` from story in status.json
   - If `"failing"`: STOP - cannot start with failing baseline
   - If `"not_run"`: Run `/AgileFlow:verify` to establish baseline
   - If `"passing"`: Proceed with implementation

2. **During Implementation**:
   - Run tests incrementally (not just at end)
   - Fix failures immediately (don't accumulate debt)
   - Update test_status in real-time

3. **Post-Implementation**:
   - Run `/AgileFlow:verify [story_id]` before marking in-review
   - Story can ONLY be marked `"in-review"` if `test_status: "passing"`
   - If tests fail: Keep `"in-progress"` until fixed
   - No exceptions unless fully documented (override protocol)

4. **Override Protocol** (use with extreme caution):
   - Document override decision in bus message
   - Update Dev Agent Record with explanation
   - Create follow-up story for test fix
   - Notify user of risk

**Automation Script**:
- **`scripts/add-verification-protocol.py`**: Bulk-updated all 18 dev agents with verification protocol
  - Regex-based insertion after BOUNDARIES section
  - Consistent protocol across all agents
  - Skips agents already updated

**Benefits**:
- **No More Broken Baselines**: Agents cannot mark stories complete with failing tests
- **Fail Fast**: Catch regressions immediately, not at PR review
- **Context Preservation**: Session harness maintains progress across context windows
- **Transparency**: All override decisions fully documented
- **Accountability**: test_status field creates audit trail

**Integration**: Phase 3 completes the verification enforcement layer. All dev agents now share consistent verification behavior, preventing the common failure mode of agents claiming work is done when tests fail.

### Technical

- Agents updated: 18 dev agents + babysit orchestrator
- Verification protocol: 170+ lines per agent (comprehensive)
- Scripts: 1 new automation script for bulk updates
- Documentation: CLAUDE.md Phase 3 marked complete
- Version: v2.25.0 → v2.26.0

## [2.25.0] - 2025-12-06

### Added - Session Harness System (Phase 2: Session Management)

Completes Phase 2 of the Session Harness System with comprehensive session management including initialization, resumption, and baseline tracking.

**New Commands (3)**:

1. **`/AgileFlow:session-init`** - First-time session harness setup
   - Auto-detects project type (Node.js, Python, Rust, Go) and test command
   - Creates environment.json, session-state.json, init.sh
   - Runs initial test verification and creates baseline git tag (optional)
   - Configures SessionStart hook for auto-resume (optional)
   - Interactive setup with user confirmation

2. **`/AgileFlow:resume`** - Session startup routine
   - Runs environment initialization script
   - Verifies tests and detects regressions since last session
   - Loads context (git history, stories, insights from previous work)
   - Updates session-state.json and shows comprehensive summary
   - Auto-triggered via SessionStart hook or called manually
   - Regression detection: Alerts if tests were passing, now failing

3. **`/AgileFlow:baseline [message]`** - Establish verified checkpoints
   - Requires all tests passing and clean git working tree
   - Creates annotated git tag with timestamp
   - Updates environment.json and session history
   - Used for reset points before refactors, epic completion, sprint checkpoints

**Integration**: All commands work together for complete session lifecycle management. Session-init sets up infrastructure, resume handles startup, baseline creates verified checkpoints.

**Benefits**: Automated session startup, regression detection, context continuity, verified checkpoints, team collaboration via shared baselines.

### Technical

- Commands: 38 → 41 (+3: session-init, resume, baseline)
- Session management: Complete lifecycle support
- Documentation: Phase 2 complete in CLAUDE.md, README.md updated

## [2.24.0] - 2025-12-06

### Added - Session Harness System (Phase 1: Foundation)

This release introduces the **Session Harness System**, inspired by Anthropic's engineering practices for long-running agent workflows. This foundational release enables test verification and session state tracking to prevent regressions and maintain progress across multiple context windows.

**Core Problem Solved**:
Without verification, agents can:
- Break existing functionality without noticing
- Claim features work when they don't
- Lose context between sessions
- Mark incomplete work as finished

**Phase 1 Implementation** (Foundation):

*New Command*:
- **`/AgileFlow:verify [story_id]`**: Run project tests and update test status
  - No args: Updates all `in_progress` stories
  - With story_id: Updates specific story only
  - Detects test command from `environment.json`
  - Exit code 0 = passing, non-zero = failing
  - Parses test output for counts (best effort)
  - Updates `test_status` and `test_results` in status.json

*New Templates*:
- **`templates/environment.json`**: Session harness configuration
  - Project type detection (nodejs, python, rust, go)
  - Test command configuration
  - Timeout and verification policy settings
  - Baseline commit tracking
- **`templates/session-state.json`**: Session state tracking
  - Current and last session metadata
  - Session history for continuity
  - Test status verification records
- **`templates/init.sh`**: Environment initialization script
  - Multi-language support (npm, pip, cargo, go)
  - Dependency installation automation
  - Database migration support
  - Environment variable setup

*Story Schema Extensions* (optional fields):
```yaml
test_status: passing | failing | not_run | skipped
test_results:
  last_run: 2025-12-06T10:30:00Z
  command: npm test
  passed: 42
  failed: 0
  exit_code: 0
  output_summary: "All tests passed (42/42)"
session_metadata:
  last_session_start: 2025-12-06T09:00:00Z
  session_count: 3
  agents_involved: ["ui", "api"]
```

*Documentation*:
- **CLAUDE.md**: New "Session Harness System" section
  - Data model documentation
  - Workflow integration guidelines
  - Verification policy explanation
  - Implementation phases roadmap
- **README.md**: Updated with `/AgileFlow:verify` in Quality & CI section
- **examples/story-example.md**: Updated with test_status fields

**Benefits**:
1. **Prevents Regression**: Can't break existing features without noticing
2. **Context Continuity**: Structured handoff between sessions
3. **Early Failure Detection**: Catch broken tests immediately
4. **Better Handoffs**: Know exactly where you left off
5. **Confidence**: Know the system works before adding more

**Implementation Phases**:
- ✅ **Phase 1 (v2.24.0)**: Test status tracking, /verify command, templates
- ⏳ **Phase 2 (v2.25.0)**: Session management (/session-init, /resume, /baseline)
- ⏳ **Phase 3 (v2.26.0)**: Dev agent integration, verification protocols
- ⏳ **Phase 4 (v2.27.0+)**: Advanced features (test parsing, regression detection, dashboards)

**Inspiration**: Based on Anthropic's "Effective Harnesses for Long-Running Agents" engineering practices (https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)

### Technical

- Commands: 37 → 38 (+1: verify)
- Templates: Added 3 new session harness templates
- Example story: Enhanced with test status fields
- Documentation: +140 lines in CLAUDE.md

## [2.23.0] - 2025-12-05

### Changed - Major Repository Restructure and Organization

This release represents a comprehensive organizational overhaul of the AgileFlow repository, following professional plugin development standards.

**README.md Restructure** (43% reduction):
- **Before**: 760 lines, unorganized, outdated MCP content
- **After**: 430 lines with professional structure
- Added badges for version, commands (36), subagents (27), skills (23)
- Moved Quick Start to top for better onboarding
- Implemented collapsible `<details>` sections for:
  - Folder Structure
  - Commands (36 total)
  - Subagents (27 specialized agents)
  - Skills (23 auto-loaded)
  - Hooks System
  - Advanced Topics
- **Removed entirely**: All MCP integration sections (Notion and GitHub MCP documentation - outdated as of v2.22.0)
- Kept only essential examples (1-2 per section instead of many)
- Better visual hierarchy and scanability

**Git History Cleanup**:
- Rewrote all 103 commits to remove AI attribution
- Removed "🤖 Generated with Claude Code" footers
- Removed "Co-Authored-By: Claude <noreply@anthropic.com>" lines
- Clean git history with human-only attribution
- All commit hashes changed (force-pushed to GitHub)

**CLAUDE.md Enhancement**:
- Added prominent **NO AI ATTRIBUTION** policy at top (line 7-72)
- Moved from line 1336 to line 7 for visibility
- Comprehensive examples of forbidden vs. correct practices
- Clear guidelines for all future commits
- Removed CLAUDE.md from .gitignore (it's plugin documentation, should be committed)

**Documentation Cleanup**:
- Removed all outdated MCP integration references
- Removed Notion MCP setup instructions (v2.22.0 removed MCP)
- Removed GitHub MCP setup instructions (v2.22.0 removed MCP)
- Updated all documentation to reflect current architecture

**Why This Matters**:
- Professional presentation matching industry standards
- Easier onboarding for new users (Quick Start first, collapsible details)
- Cleaner git history without AI attribution clutter
- Clear policies preventing future attribution issues
- Up-to-date documentation (no outdated MCP content)
- Better maintainability with organized structure

**Reference**: This restructure follows patterns from high-quality Claude Code plugins like https://github.com/jeremylongshore/claude-code-plugins-plus

## [2.22.3] - 2025-12-05

### Changed - Renamed ChatGPT Command to Context (Platform-Agnostic)

This release renames the chatgpt command and file to "context" to better reflect multi-platform support for web-based AI tools.

**The Rationale**:
- ❌ "chatgpt" was too specific - users may use other web AI tools
- ✅ "context" is platform-agnostic and accurately describes purpose
- ✅ Supports ChatGPT, Perplexity, Gemini, Claude web, and other web AI tools
- ✅ Clearer intent: context file for web AI tools vs. Claude Code (CLI-based)

**What Changed**:

*Command Rename*:
- `/AgileFlow:chatgpt` → `/AgileFlow:context`
- `commands/chatgpt.md` → `commands/context.md`

*File Rename*:
- `docs/chatgpt.md` → `docs/context.md`

*Documentation Updates*:
- All references updated across 31 files (README.md, setup.md, all agent files, etc.)
- Command description now references "web AI tools (ChatGPT, Perplexity, Gemini, Claude, etc.)"
- Export mode message updated: "Paste this excerpt into your web AI tool..."
- Research mode now builds prompts for any web AI tool

**Usage** (same modes, new command name):
```bash
# Generate/refresh full context brief (default)
/AgileFlow:context
/AgileFlow:context MODE=full

# Export concise excerpt for pasting
/AgileFlow:context MODE=export

# Add a quick note
/AgileFlow:context MODE=note NOTE="User reported auth bug in production"

# Build research prompt
/AgileFlow:context MODE=research TOPIC="Implement OAuth 2.0 with Google"
```

**Migration**:
- Old command `/AgileFlow:chatgpt` will no longer work (renamed)
- Update any saved workflows or scripts to use `/AgileFlow:context`
- If you have existing `docs/chatgpt.md` files in projects, manually rename to `docs/context.md`
- Command functionality unchanged - only name changed

**Files Modified**:
- Renamed: `commands/chatgpt.md` → `commands/context.md`
- Updated: All 31 files with references (README.md, setup.md, 24 agent files, CONNECTEDNESS-PLAYBOOK.md, babysit.md, blockers.md, SUBAGENTS.md)
- CHANGELOG.md preserved historical references (this entry only new mention)

**Benefits**:
- ✅ **Platform-agnostic** - Works with any web AI tool, not just ChatGPT
- ✅ **Clearer intent** - "Context" describes purpose better than tool name
- ✅ **Future-proof** - Won't need to rename again when new AI tools emerge
- ✅ **Consistent** - Aligns with docs-as-code philosophy (content > tool)

**Technical**:
- Version bumped in all 3 required files (plugin.json, marketplace.json, CHANGELOG.md)
- 31 files updated with new command/file references
- No functionality changes - pure rename for clarity

## [2.22.2] - 2025-12-05

### Added - Setup Validation Script

This release adds a validation script to ensure all required directories are created during AgileFlow setup, addressing issues where some folders were occasionally missed.

**The Problem**:
- ❌ Sometimes `/AgileFlow:setup` didn't create all folders in docs/ structure
- ❌ Missing folders caused agent failures later in the workflow
- ❌ Manual directory creation was error-prone (28+ directories to create)
- ❌ No easy way to verify complete setup

**The Solution**:
- ✅ New validation script: `scripts/validate-setup.sh`
- ✅ Checks for all 26 required directories
- ✅ Creates any missing directories automatically
- ✅ Reports status of critical files (status.json, agileflow-metadata.json)
- ✅ Safe to run multiple times (idempotent)
- ✅ Integrated into `/AgileFlow:setup` command

**What It Validates**:

*Required Directories* (all auto-created if missing):
- docs/00-meta/{templates,guides,scripts}
- docs/01-brainstorming/{ideas,sketches}
- docs/02-practices/prompts/agents
- docs/03-decisions
- docs/04-architecture
- docs/05-epics
- docs/06-stories
- docs/07-testing/{acceptance,test-cases}
- docs/08-project
- docs/09-agents/bus
- docs/10-research
- .github/workflows
- .claude
- scripts

*Critical Files* (reported, not created):
- docs/09-agents/status.json
- docs/00-meta/agileflow-metadata.json
- .gitignore

**Usage**:

*During setup* (automatic):
```bash
# Validation script is copied and run automatically by /AgileFlow:setup
```

*Manual validation* (anytime):
```bash
bash scripts/validate-setup.sh
```

**Example Output**:
```
📋 AgileFlow Setup Validation
==============================

🔍 Checking directory structure...

✅ docs
✅ docs/00-meta
✅ docs/00-meta/templates
❌ docs/00-meta/guides (missing)
  └─ Created
...

📊 Validation Summary
====================

Directories:
  ✅ Existing: 22
  🆕 Created: 4
  ❌ Missing (before): 4

✅ Validation complete! Created 4 missing directories.

💡 Tips:
  - Run this script anytime to verify your AgileFlow setup
  - Safe to run multiple times (idempotent)
  - Run /AgileFlow:setup for full setup with all files
```

**Files Added**:
- `scripts/validate-setup.sh` - Setup validation and auto-repair script

**Files Modified**:
- `commands/setup.md` - Integrated validation script into setup workflow

**Benefits**:
- ✅ **Prevents setup failures** - All directories guaranteed to exist
- ✅ **Self-healing** - Automatically creates missing directories
- ✅ **Verifiable** - Clear report of what was created vs. existing
- ✅ **Idempotent** - Safe to run multiple times without side effects
- ✅ **User-friendly** - Color-coded output with clear status indicators

**Technical**:
- Version bumped in all 3 required files (plugin.json, marketplace.json, CHANGELOG.md)
- Script uses standard bash with no dependencies (works everywhere)
- Validates 26 directories + 3 critical files
- Exit code 0 (always succeeds, creates what's missing)

## [2.22.1] - 2025-12-05

### Fixed - Hooks Configuration Location (Critical Fix)

This release fixes a **critical error** in the hooks system implementation. AgileFlow was documenting hooks in the wrong location, causing all hooks to be non-functional.

**The Problem**:
- ❌ AgileFlow documented hooks in `hooks/hooks.json` (WRONG - doesn't exist in Claude Code spec)
- ❌ Official Claude Code location is `.claude/settings.json` (project-level) or `~/.claude/settings.json` (user-level)
- ❌ Our hooks were completely non-functional because Claude Code doesn't read from `hooks/` directory
- ❌ Wrong gitignore patterns (gitignored `.claude/settings.json` which should be committed to git)

**The Fix**:
- ✅ Renamed template files:
  - `templates/hooks.example.json` → `templates/claude-settings.example.json`
  - `templates/hooks.advanced.example.json` → `templates/claude-settings.advanced.example.json`
- ✅ Updated all documentation to use `.claude/settings.json` (correct location)
- ✅ Fixed `.gitignore` patterns:
  - `.claude/settings.json` is now committed (project-level config)
  - Only `.claude/settings.local.json` is gitignored (user-specific overrides)
- ✅ Updated 5 documentation files with correct hooks implementation

**Files Modified**:
- Renamed: `templates/hooks.example.json` → `templates/claude-settings.example.json`
- Renamed: `templates/hooks.advanced.example.json` → `templates/claude-settings.advanced.example.json`
- Updated: `CLAUDE.md` (hooks system section corrected)
- Updated: `commands/setup.md` (hooks setup instructions corrected)
- Updated: `commands/diagnose.md` (hooks diagnostics corrected)
- Updated: `README.md` (hooks documentation corrected)
- Updated: `.gitignore` (corrected patterns for `.claude/` directory)

**Migration Instructions for Users**:
If you previously set up hooks following AgileFlow documentation (v2.19.0 - v2.22.0):
1. Move your hooks configuration from `hooks/hooks.json` to `.claude/settings.json`
2. Update the format (hooks are nested under `"hooks"` key in settings.json)
3. Delete the old `hooks/` directory
4. Restart Claude Code to load the corrected hooks

**Impact**:
- All hooks documented in v2.19.0 - v2.22.0 were non-functional (wrong location)
- Users who followed our documentation need to migrate to `.claude/settings.json`
- Hooks will now work correctly following official Claude Code specification

**Technical**:
- Version bumped in all 3 required files (plugin.json, marketplace.json, CHANGELOG.md)
- 7 files modified (2 renamed, 5 updated)
- No functionality changes - purely fixing incorrect documentation and file locations

## [2.22.0] - 2025-12-04

### Removed - MCP Integration (Context Optimization)

This release removes all Model Context Protocol (MCP) integration to reduce context usage and simplify AgileFlow's architecture. MCP servers consumed significant context tokens, and integration complexity outweighed benefits.

**What Was Removed**:
- ❌ **Commands removed** (2): `/AgileFlow:github` (GitHub sync), `/AgileFlow:notion` (Notion export)
- ❌ **Agent removed** (1): `agileflow-notion-exporter` (parallel export agent)
- ❌ **MCP configuration files**: `.mcp.json.example`, `.env.example`, all MCP wrapper scripts
- ❌ **MCP documentation**: Removed ~1,340+ lines from setup.md, CLAUDE.md, README.md, babysit.md, diagnose.md, SUBAGENTS.md
- ❌ **MCP references**: All mentions of Model Context Protocol, MCP servers, MCP tools
- ❌ **GitHub MCP**: `@modelcontextprotocol/server-github` integration
- ❌ **Notion MCP**: `@notionhq/notion-mcp-server` integration
- ❌ **Token management**: GITHUB_PERSONAL_ACCESS_TOKEN, NOTION_TOKEN environment variables

**Why Remove MCP?**:
- **Context usage**: MCP servers consumed 2,000-3,000 tokens per session
- **Complexity**: Integration setup required multiple files (.mcp.json, .env, wrappers)
- **User feedback**: "MCPs take up a lot of context" - users prefer lightweight plugin
- **Simpler architecture**: Direct user integration (users handle GitHub/Notion sync themselves)
- **Focus**: AgileFlow core is docs-as-code + multi-agent collaboration, not external integrations

**What's Preserved** (100% of core functionality):
- ✅ All 27 specialized agents (UI, API, CI, DevOps, Planning, Research, Mentoring, Documentation, etc.)
- ✅ 36 slash commands (down from 38 - only github/notion removed)
- ✅ All 23 auto-loaded skills following Anthropic specification
- ✅ Hooks system for event-driven automation
- ✅ Status.json compression for managing file size
- ✅ Auto-archival system for completed stories
- ✅ Epic planning and story decomposition
- ✅ ADR system and architecture decision tracking
- ✅ Bus/log.jsonl agent coordination protocol
- ✅ All core AgileFlow workflows

**Migration Path**:
Users who relied on GitHub/Notion sync can:
1. Use GitHub CLI (`gh`) directly for GitHub Issues sync
2. Use Notion API directly or third-party tools for Notion export
3. AgileFlow remains the source of truth for docs-as-code in `docs/` directory
4. External integrations are now user responsibility (reduces plugin complexity)

**Benefits**:
- ✅ **~2,000-3,000 tokens saved** per session (more room for user project context)
- ✅ **Simpler setup** - no .mcp.json, no environment variables, no wrapper scripts
- ✅ **Cleaner documentation** - 1,340+ lines removed from docs
- ✅ **Faster plugin loading** - no MCP server initialization
- ✅ **Easier maintenance** - fewer dependencies, fewer integration points

**Files Modified**:
- Deleted: `commands/github.md`, `commands/notion.md`, `agents/agileflow-notion-exporter.md`
- Deleted: `.mcp.json.example`, `.env.example`, `scripts/validate-mcp-tokens.sh`
- Deleted: `templates/mcp-wrapper-load-env.sh`, `templates/mcp-wrapper-postgres.sh`, `templates/MCP-WRAPPER-SCRIPTS.md`
- Cleaned: `commands/setup.md` (788 lines removed), `CLAUDE.md` (160 lines), `README.md` (171 lines)
- Cleaned: `commands/babysit.md` (66 lines), `commands/diagnose.md` (50 lines), `SUBAGENTS.md`, `agents/mentor.md` (60 lines)

**Command Count**:
- Before: 38 commands
- After: 36 commands (github, notion removed)
- Agent count: 27 (notion-exporter agent removed)

### Technical

- Removed all MCP-related files and documentation (9 files deleted, 8 files cleaned)
- Updated command count from 38 → 36
- Version bumped in all 3 required files (plugin.json, marketplace.json, CHANGELOG.md)
- Net reduction: ~1,500 lines across all files

## [2.21.0] - 2025-12-04

### Changed - Skills Architecture Refactoring (Anthropic Specification)

This release refactors all 23 skills to follow Anthropic's official skills specification, resulting in cleaner, more maintainable, and consistent skills structure.

**Major Changes**:
- **Removed `allowed-tools` field** from all skills frontmatter (no longer part of Anthropic spec)
- **Simplified structure**: Removed verbose meta-sections (ROLE & IDENTITY, OBJECTIVE, INPUTS, FIRST ACTION, PROACTIVE KNOWLEDGE LOADING, HANDOFFS, OUTPUTS)
- **Consolidated into 6-8 core sections**: When to Use, What This Does, Instructions, Output Examples, Quality Checklist, Integration, Notes
- **27% complexity reduction**: Removed 517 lines across all 23 skills (from ~3,000+ lines to 2,435 lines)
- **Consistent YAML frontmatter**: Only `name` + `description` fields (matching Anthropic specification)
- **Added minimal frontmatter** to 15 simple skills that previously had none
- **Refactored 8 complex skills** to follow the same minimal pattern

**Skills Affected** (all 23 skills refactored):

*Simple Skills* (15 skills - added frontmatter, maintained simplicity):
- story-skeleton, acceptance-criteria-generator, commit-message-formatter
- adr-template, api-documentation-generator, changelog-entry
- pr-description, test-case-generator, type-definitions
- sql-schema-generator, error-handler-template, diagram-generator
- validation-schema-generator, deployment-guide-generator, migration-checklist

*Complex Skills* (8 skills - simplified structure):
- agileflow-story-writer (228 → 163 lines, 28% reduction)
- agileflow-acceptance-criteria (217 → 156 lines, 28% reduction)
- epic-planner (243 → 184 lines, 24% reduction)
- agileflow-sprint-planner (246 → 212 lines, 13% reduction)
- agileflow-retro-facilitator (305 → 281 lines, 8% reduction)
- agileflow-adr (216 → 147 lines, 32% reduction)
- agileflow-commit-messages (242 → 130 lines, 46% reduction)
- agileflow-tech-debt (427 → 215 lines, 49% reduction - largest reduction)

**Benefits**:
- ✅ **Standards compliance**: Now follows Anthropic's official skills specification
- ✅ **Improved scannability**: Faster to find information with consistent structure
- ✅ **Easier maintenance**: Less verbose, focused on practical guidance
- ✅ **Better onboarding**: Consistent patterns across all skills
- ✅ **No functionality loss**: All essential content preserved

**New Template**:
- Added `templates/skill-template.md` following Anthropic specification
- Provides standardized structure for creating new skills
- Documents all 6 core sections with examples

**Documentation Updates**:
- Updated README.md with comprehensive Skills section explaining architecture
- Updated CLAUDE.md with "Adding a New Skill (v2.21.0+)" guide
- Documented removed sections and new minimal structure

**Migration Notes**:
- Existing skills continue to work without changes
- New skills should follow the minimal template in `templates/skill-template.md`
- Do NOT use `allowed-tools` field in new skills (removed from specification)
- Do NOT add verbose meta-sections (ROLE & IDENTITY, FIRST ACTION, etc.)

### Technical

- Refactored all 23 SKILL.md files to match Anthropic specification
- Created standardized skill template (`templates/skill-template.md`)
- Updated plugin documentation (README.md, CLAUDE.md)
- Version bumped in all 3 required files (plugin.json, marketplace.json, CHANGELOG.md)

## [2.20.2] - 2025-11-02

### Fixed - Compression Script jq Error

This patch release fixes a critical bug in the compression script that caused it to fail with a jq error when generating the status summary.

**The Error**:
```
jq: error (at docs/09-agents/status.json:266):
object ({"US-0010":...) and array ([["in-progr...)
cannot be sorted, as they are not both arrays
```

**Root Cause**:
- The compression script's status summary (lines 143-149) tried to `group_by(.status)` directly on `.stories`
- `.stories` is an object (key-value pairs: `{"US-0010": {...}, "US-0011": {...}}`)
- `group_by()` requires an array, not an object
- Result: jq fails with "cannot be sorted" error

**The Fix**:
- Convert `.stories` object to array before grouping: `.stories | to_entries | map(.value) | group_by(.status)`
- This extracts the story objects from the key-value pairs into an array
- Now `group_by()` works correctly

**Files Modified**:
- `scripts/compress-status.sh` line 144 - Added `to_entries | map(.value)` to convert object to array

**Impact**:
- Before: Compression script would fail partway through with jq error (exit code 5)
- After: Compression completes successfully and shows status summary

**Testing**:
```bash
# Before fix (v2.20.1)
bash scripts/compress-status.sh
# jq: error (at docs/09-agents/status.json:266): object and array cannot be sorted

# After fix (v2.20.2)
bash scripts/compress-status.sh
# ✅ Compression complete!
# 📋 Status Summary:
#    done: 9 stories
#    in-progress: 3 stories
#    ready: 11 stories
```

## [2.20.1] - 2025-11-02

### Fixed - Compression Script Deployment

This patch release fixes an issue where `/AgileFlow:compress` would fail with "script not found" because the compression script wasn't deployed to user projects.

**The Issue**:
- v2.20.0 introduced `/AgileFlow:compress` command
- Script `compress-status.sh` exists in AgileFlow plugin
- But `/AgileFlow:compress` tries to run it from user's project directory
- Result: "bash: scripts/compress-status.sh: No such file or directory"

**The Fix**: Two-pronged approach

**1. Auto-Copy on First Run** (existing users who won't re-run setup):
- `/AgileFlow:compress` now checks if script exists in user's project
- If missing, automatically copies from plugin: `~/.claude-code/plugins/AgileFlow/scripts/compress-status.sh`
- Makes executable with `chmod +x`
- Then runs compression
- Users don't need to manually deploy the script

**2. Setup Command Deployment** (new users running `/AgileFlow:setup`):
- `/AgileFlow:setup` now copies BOTH archival and compression scripts
- Updated "Copy Scripts from Plugin" section in setup workflow
- Scripts deployed during initial setup alongside archival configuration
- Prints confirmation: "✅ Deployed compression script: scripts/compress-status.sh"

**Files Modified**:
- `commands/compress.md` - Added auto-copy logic in Step 1
- `commands/setup.md` - Updated to deploy compression script alongside archival script

**Why Both Approaches?**:
- **Auto-copy**: Helps existing v2.20.0 users who already ran setup
- **Setup deployment**: Ensures new users get script from the start
- **Result**: Works for everyone regardless of when they set up AgileFlow

**Testing**:
```bash
# Test auto-copy (existing users)
/AgileFlow:compress
# Output: "📦 Compression script not found - deploying from plugin..."
# Output: "✅ Deployed compression script: scripts/compress-status.sh"
# Output: [compression results]

# Test setup deployment (new users)
/AgileFlow:setup
# Output: "✅ Deployed archival script: scripts/archive-completed-stories.sh"
# Output: "✅ Deployed compression script: scripts/compress-status.sh (v2.20.0+)"
```

**No Breaking Changes**:
- Existing users: Script auto-deploys on first `/AgileFlow:compress` run
- New users: Script deployed during `/AgileFlow:setup`
- No manual intervention required

## [2.20.0] - 2025-11-02

### Added - Status.json Compression Command

This release adds `/AgileFlow:compress` to solve the "file content exceeds maximum allowed tokens" error when status.json grows too large, even with auto-archival enabled.

**The Problem**:
- Auto-archival moves completed stories >N days old to archive
- But status.json can still exceed 25k tokens from verbose story objects
- Story objects may contain full description, architectureContext, devAgentRecord, etc.
- This breaks ALL agent workflows when agents try to read status.json

**The Solution**: `/AgileFlow:compress`

**New Files**:
1. `scripts/compress-status.sh` - Compression script
2. `commands/compress.md` - Slash command definition

**How It Works**:
- Removes verbose fields: description, acceptanceCriteria, architectureContext, technicalNotes, testingStrategy, devAgentRecord, previousStoryInsights
- Keeps ONLY essential tracking metadata: story_id, epic, title, owner, status, estimate, timestamps, dependencies, branch, summary
- Full story content remains in `docs/06-stories/` markdown files (no data loss)
- Creates backup at `docs/09-agents/status.json.backup` before compression
- Typical result: 80-90% size reduction

**Usage**:
```bash
/AgileFlow:compress
```

**Output Example**:
```
📊 Before Compression:
   Stories: 145
   Size: 384KB
   Lines: 12,847

✅ Compression complete!

📊 After Compression:
   Stories: 145 (unchanged)
   Size: 384KB → 42KB
   Lines: 12,847 → 1,203
   Saved: 89% (342KB)

✅ Estimated tokens: ~10,500 (safely under 25000 limit)
```

**When to Use**:
- status.json exceeds 25000 tokens despite archival
- Agents fail with "file content exceeds maximum allowed tokens"
- status.json contains verbose story objects from external tools/imports

**Recommended Workflow**:
1. First run archival: `bash scripts/archive-completed-stories.sh 3` (move old stories)
2. If still too large, run compression: `/AgileFlow:compress` (strip verbose fields)
3. Result: status.json under 25000 tokens

**Archival vs. Compression**:
- **Archival** (automatic): Moves old completed stories to archive (50-70% savings)
- **Compression** (manual): Strips verbose fields from all stories (80-90% savings)
- **Best practice**: Use BOTH for maximum efficiency

**Safety**:
- Backup created before compression
- Full story content preserved in markdown files
- Reversible: `cp docs/09-agents/status.json.backup docs/09-agents/status.json`

**Documentation**:
- Added "Status.json Compression" section to CLAUDE.md
- Updated README.md with `/AgileFlow:compress` command
- Command reference in `commands/compress.md`

**Why This Matters**:
- Prevents agent failures when status.json grows large
- Improves performance (agents read smaller files faster)
- Separates concerns: status.json = tracking index, markdown files = full content
- Complements auto-archival for two-pronged size management

## [2.19.8] - 2025-10-30

### Improved - Skill Standardization & Consistency

This release standardizes all AgileFlow skill prompts (SKILL.md files) with a common skeleton structure, making them tighter, clearer, and more connected across the system.

**What Changed**:

1. **Standardized Skill Skeleton** (Applied to 3 representative skills):
   - **Simple**: agileflow-commit-messages/SKILL.md - Shows how straightforward skills benefit from structure
   - **Medium**: agileflow-story-writer/SKILL.md - Core workflow skill with full coordination
   - **Complex**: agileflow-tech-debt/SKILL.md - Evaluative skill with scoring and measurement

2. **New Required Sections** (All skills now have consistent structure):
   - **ROLE & IDENTITY**: Skill ID and specialization (e.g., "Skill ID: COMMIT-MSG")
   - **OBJECTIVE**: Clear one-sentence purpose
   - **INPUTS**: What the skill needs to operate
   - **FIRST ACTION**: Deterministic boot sequence (check files, read context, count items)
   - **PROACTIVE KNOWLEDGE LOADING**: What to read before doing work (CLAUDE.md, templates, status.json)
   - **WORKFLOW**: Numbered steps from input → processing → output
   - **RELATED COMMANDS**: Cross-links to slash commands (e.g., `/AgileFlow:epic`, `/AgileFlow:status`)
   - **OUTPUTS**: What the skill produces (files created, updates made)
   - **HANDOFFS**: AgileFlow coordination (status.json updates, bus/log.jsonl messages, security notes)
   - **QUALITY CHECKLIST**: Pre-flight checks before executing

3. **Key Improvements**:
   - **Cross-Linking**: Skills now reference related slash commands explicitly (e.g., "After creating story → `/AgileFlow:story-validate`")
   - **AgileFlow Coordination**: All skills document how they interact with status.json and bus/log.jsonl
   - **Deterministic Boot**: First Action sections ensure consistent context loading
   - **Diff-First Pattern**: Explicit "show diff, wait for YES/NO" in workflows
   - **Security Reminders**: "Never commit secrets" notes in relevant skills

4. **Examples of Improvements**:
   - **agileflow-commit-messages**: Now checks CLAUDE.md for attribution policy BEFORE formatting commit (deterministic boot)
   - **agileflow-story-writer**: Includes handoff pattern showing how stories flow to dev agents via status.json
   - **agileflow-tech-debt**: Enhanced with explicit priority scoring formula and handoff to `/AgileFlow:story` for high-priority debt

**Why These Changes?**:
- **Tighter Prompts**: Consistent structure reduces ambiguity, improves AI execution
- **Clearer Connections**: Cross-linking shows how skills work together (epic → stories → status updates)
- **Better Knowledge Transfer**: First Action + Proactive Knowledge Loading ensure skills read context before acting
- **System Awareness**: Handoffs section makes skills aware of AgileFlow coordination (status.json, bus, agents)

**User Impact**:
- ✅ Skills execute more reliably (deterministic boot sequences)
- ✅ Better integration between skills and commands (clear cross-links)
- ✅ Improved AgileFlow coordination (explicit handoffs to status.json/bus)
- ✅ Consistent "diff-first; YES/NO" pattern across all skills
- ✅ Security best practices baked in ("Never commit secrets")

**Files Modified**:
- `skills/agileflow-commit-messages/SKILL.md` - Refactored with standardized skeleton
- `skills/agileflow-story-writer/SKILL.md` - Refactored with standardized skeleton
- `skills/agileflow-tech-debt/SKILL.md` - Refactored with standardized skeleton
- `CHANGELOG.md` - This entry

**Next Steps**:
- Consider applying this skeleton to remaining 20 skills for full system consistency
- Demonstrated pattern: Simple → Medium → Complex skill refactoring
- Standardization improves maintainability and reduces prompt drift

## [2.19.7] - 2025-10-30

### Improved - Documentation Consistency & Governance

This release addresses inconsistencies identified in a comprehensive audit of AgileFlow's documentation and prompts, establishing clear policies and single sources of truth.

**What Changed**:

1. **Count Validation Script** (NEW - scripts/validate-counts.sh):
   - Automated validation to prevent count drift
   - Checks actual file counts vs. marketplace.json/README.md
   - Exits with error if inconsistencies found
   - Run before releases: `bash scripts/validate-counts.sh`
   - Prevents the "41 vs 37 commands" confusion from recurring

2. **Command/Subagent/Skill Count Accuracy**:
   - Updated marketplace.json: "38 commands, 27 specialized subagents, 23 auto-loaded skills" (was "37 commands, 26 subagents")
   - Updated README.md: Corrected counts in two locations (lines 18-20, 233)
   - Updated CLAUDE.md: Corrected counts in Repository Overview and Plugin Structure sections
   - **Source of Truth**: Actual file counts (ls commands/ agents/ skills/) - no more drift

2. **Command Safety Policy** (NEW - CLAUDE.md):
   - Added dedicated section clarifying execution rules
   - **Slash commands**: Run autonomously without asking (workflow orchestration)
   - **File operations**: Require diff + YES/NO confirmation
   - **Shell operations**: Risk-based (safe commands autonomous, dangerous require justification)
   - Resolves confusion between "autonomous command execution" and "require confirmation"

3. **Test Coverage Policy** (NEW - CLAUDE.md):
   - Standardized coverage targets: **80% global, 100% critical paths**
   - CI enforcement: Fail builds <80%
   - Coverage by type: Unit 80%+, Integration 60%+, E2E 30%+
   - Resolves drift where different docs cited 70%, 80%, or "target >80%"

**Why These Changes?**:
- **Eliminates Ambiguity**: Clear policies prevent agents from getting conflicting guidance
- **Single Source of Truth**: All counts auto-generated from directory structure
- **Prevents Coverage Drift**: One policy prevents different thresholds across docs
- **Better Developer Experience**: Clear rules = faster onboarding, fewer questions

**User Impact**:
- ✅ Agents follow consistent command execution patterns
- ✅ Test coverage standards are uniform across all projects
- ✅ Marketplace shows accurate capability counts
- ✅ No more "which threshold do I use?" confusion

**Files Modified**:
- `.claude-plugin/marketplace.json` - Updated description with correct counts + v2.19.7
- `.claude-plugin/plugin.json` - Version bumped to 2.19.7
- `README.md` - Corrected command/subagent counts (2 locations)
- `CLAUDE.md` - Added Command Safety Policy and Test Coverage Policy sections + updated counts
- `commands/notion.md` - Clarified v2.3.0 correction is historical reference
- `agents/mentor.md` - Added Execution Policy one-liner
- `agents/epic-planner.md` - Added Execution Policy one-liner
- `agents/ui.md` - Added Execution Policy one-liner
- `agents/api.md` - Added Execution Policy one-liner
- `agents/ci.md` - Added Execution Policy one-liner
- `scripts/validate-counts.sh` - NEW: Automated count validation script
- `CHANGELOG.md` - This entry

## [2.19.6] - 2025-10-30

### Added - JSON Validation & System Diagnostics

This release adds comprehensive JSON validation to prevent status.json corruption and introduces system health diagnostics to catch issues proactively.

**What's New**:

1. **validate-json.sh Helper Script** (`scripts/validate-json.sh`):
   - Validates JSON files and provides helpful error messages
   - Usage: `bash scripts/validate-json.sh <file_path>`
   - Returns exit code 0 for valid, 1 for invalid
   - Shows first 5 lines of error details for debugging

2. **/diagnose Command** (`commands/diagnose.md`):
   - Comprehensive system health checks
   - Validates all JSON files (status.json, metadata.json, sync maps, hooks.json)
   - Checks auto-archival system configuration
   - Verifies hooks system setup
   - Reports file sizes with recommendations
   - Warns when status.json exceeds 100KB
   - Validates MCP security (.mcp.json and .env in .gitignore)
   - Provides actionable next steps for issues found

3. **JSON Validation in Archive Script** (`scripts/archive-completed-stories.sh`):
   - Validates status.json before processing
   - Prevents corruption from cascading
   - Provides helpful error messages and fix instructions
   - References validate-json.sh for diagnostics

4. **JSON Validation in Status Commands**:
   - `/status` command now includes validation after updates
   - `/assign` command now includes validation after updates
   - Both commands document JSON safety guidelines
   - Emphasizes always using jq or Edit tool (never echo/cat)
   - Instructions to restore from backup if validation fails

### Improved - /setup Command Reliability

5. **TodoWrite Integration in /setup** (`commands/setup.md`):
   - **CRITICAL IMPROVEMENT**: Setup now creates comprehensive todo list at start
   - Prevents forgetting configuration steps (addresses v2.19.4 issue)
   - Todo list maps detection results to pending tasks
   - Tracks progress: pending → in_progress → completed
   - Example workflow: detect → create todos → ask user → complete todos → validate

6. **Auto-Archival Detection in /setup** (`commands/setup.md`):
   - Detection phase now checks for auto-archival configuration
   - Reports threshold: "✅ Auto-archival configured (threshold: 7 days)"
   - Warns if not configured: "❌ Auto-archival NOT configured (recommended)"
   - Status summary includes: "Auto-Archival: ✅ Configured (X days) / ❌ Not configured"

**Why These Changes?**:
- **Prevents JSON Corruption**: User reported status.json corrupted with 40 unescaped quotes
- **Catches Issues Early**: /diagnose identifies problems before they cause failures
- **Improves Setup Reliability**: TodoWrite prevents /setup from forgetting steps
- **Better Debugging**: Validation scripts provide actionable error messages
- **Proactive Monitoring**: File size warnings prevent token limit errors

**User Impact**:
- ✅ Fewer JSON corruption incidents
- ✅ Faster troubleshooting with /diagnose
- ✅ More reliable /setup (no forgotten config)
- ✅ Better error messages when issues occur

## [2.19.5] - 2025-10-30

### Changed - Moved Archival Config to agileflow-metadata.json (Architecture Consistency)

Refactored auto-archival configuration to use `docs/00-meta/agileflow-metadata.json` instead of `.claude/settings.json` for better consistency with AgileFlow's architecture.

**Why This Change?**:
- **Consistency**: All AgileFlow configuration should live in `docs/00-meta/`
- **Discoverability**: Developers know where to find all AgileFlow settings
- **Team-wide**: Can be committed to git, whole team uses same threshold
- **Simpler**: Don't need separate `.claude/settings.json` for archival
- **Clean Architecture**: One source of truth for AgileFlow settings

**What Changed**:

1. **Archive Script** (`scripts/archive-completed-stories.sh`):
   - Now reads threshold from `docs/00-meta/agileflow-metadata.json`
   - Falls back to CLI arg if provided: `bash scripts/archive-completed-stories.sh 7`
   - Falls back to 30 days if metadata file missing
   - Simpler: No dependency on `get-env.js` for archival config

2. **Setup Command** (`commands/setup.md`):
   - Writes archival config to `docs/00-meta/agileflow-metadata.json`
   - Structure: `{"archival": {"threshold_days": 7, "enabled": true}}`
   - Updates `agileflow-metadata.json` timestamp on config changes

3. **Hooks Template** (`templates/hooks.example.json`):
   - Simplified hook command: `bash scripts/archive-completed-stories.sh`
   - No need for `get-env.js` in hook command
   - Script reads config from metadata automatically

4. **Documentation** (`CLAUDE.md`):
   - Updated all references to new config location
   - Changed configuration examples to use `agileflow-metadata.json`
   - Updated troubleshooting to reference correct file
   - Clearer instructions for changing threshold

**Configuration Format Change**:

Before (v2.19.4) - in `.claude/settings.json`:
```json
{
  "env": {
    "ARCHIVE_THRESHOLD_DAYS": "7"
  }
}
```

After (v2.19.5) - in `docs/00-meta/agileflow-metadata.json`:
```json
{
  "version": "2.19.5",
  "archival": {
    "threshold_days": 7,
    "enabled": true
  }
}
```

**Benefits**:
1. ✅ **Better Architecture** - All AgileFlow config in one place (`docs/00-meta/`)
2. ✅ **Team-wide Config** - Can commit to git, whole team shares same archival threshold
3. ✅ **Discoverable** - Developers know where to find settings
4. ✅ **Simpler** - No need for `get-env.js` helper
5. ✅ **Consistent** - Follows existing pattern (metadata already stores git config)

**Files Modified**:
- `scripts/archive-completed-stories.sh` - Read from `agileflow-metadata.json`
- `commands/setup.md` - Write to `agileflow-metadata.json`
- `templates/hooks.example.json` - Simplified hook command
- `CLAUDE.md` - Updated all config references
- `.claude-plugin/plugin.json` - Version bumped to 2.19.5
- `.claude-plugin/marketplace.json` - Updated description

**Migration Path**:
- Existing projects: Re-run `/AgileFlow:setup` to migrate config
- New projects: Config stored in `agileflow-metadata.json` from start
- Backward compatible: Script still accepts CLI arg for manual runs

## [2.19.4] - 2025-10-30

### Added - Auto-Archival System (Prevents Agent Failures from Large status.json)

Implemented automatic archival system to manage `docs/09-agents/status.json` file size and prevent agents from failing with "file content exceeds maximum allowed tokens" error (25k token limit).

**The Problem Solved**:
- As projects grow, status.json can exceed 25k tokens (typically >100KB)
- Agents must read status.json on every invocation
- Files exceeding token limit cause agents to fail with "file too large" error
- This breaks ALL agent workflows (UI, API, CI, DevOps, etc.)
- User reported: "⏺ Read(docs/09-agents/status.json) ⎿ Error: File content (25574 tokens) exceeds maximum allowed tokens (25000)"

**The Solution - Active/Archive Split**:

1. **Archive Script** (`scripts/archive-completed-stories.sh`)
   - Moves completed stories older than threshold from status.json → status-archive.json
   - Keeps active work (ready, in-progress, blocked) + recent completions in status.json
   - Configurable threshold (3/7/14/30+ days)
   - Safe: Creates backups before modifying files
   - Detailed output showing what was archived and current status

2. **Setup Integration** (updated `/AgileFlow:setup`)
   - New section: "Auto-Archival Configuration"
   - Asks user for archival threshold preference:
     - 3 days (very aggressive - keeps status.json tiny)
     - 7 days (weekly archival - recommended for active projects)
     - 14 days (bi-weekly archival - good balance)
     - 30 days (monthly archival - default, keeps recent context)
     - Custom (specify any number of days)
   - Stores preference in `.claude/settings.json`
   - Copies archive script from plugin to project
   - Adds SessionStart hook for automatic archival
   - Updates project's CLAUDE.md with archival documentation

3. **Auto-Archival Hook** (updated `templates/hooks.example.json`)
   - Added SessionStart hook for automatic archival
   - Runs silently in background on every Claude Code session start
   - Uses `scripts/get-env.js` to read threshold from `.claude/settings.json`
   - No user interruption or prompts during normal usage

4. **Comprehensive Documentation** (updated `CLAUDE.md`)
   - New section: "Auto-Archival System (v2.19.4+)"
   - Explains the problem, solution, and benefits
   - File structure (active vs archive)
   - User configuration options
   - Manual archival commands
   - Troubleshooting guide
   - Integration with hooks system

**How It Works**:

```
SessionStart hook fires
  ↓
bash scripts/archive-completed-stories.sh $(node scripts/get-env.js ARCHIVE_THRESHOLD_DAYS 30)
  ↓
Script checks status.json for completed stories older than threshold
  ↓
If found: Move to status-archive.json, update status.json
  ↓
Agents work with smaller, faster status.json (under 25k tokens)
```

**Example Results**:
```
📦 AgileFlow Story Archival
   Threshold: 7 days
   Cutoff Date: 2025-10-23T00:00:00Z

📊 Current status.json: 150 stories

📦 Archiving 105 completed stories older than 7 days...

✅ Archival complete!

📊 Results:
   status.json: 150 → 45 stories (82KB → 18KB)
   status-archive.json: 105 stories total (82KB)
   Archived: 105 stories

📋 Active Status Summary:
   ready: 12 stories
   in-progress: 8 stories
   blocked: 3 stories
   done (recent): 22 stories

✅ Agents will now work with smaller, faster status.json
```

**File Structure**:

- **docs/09-agents/status.json** (Active Work):
  - Stories with status: ready, in-progress, blocked
  - Completed stories within threshold (recent completions)
  - Agents read this file (small, fast, <25k tokens)
  - Example: 45 stories, 18KB

- **docs/09-agents/status-archive.json** (Historical):
  - Completed stories older than threshold
  - Full history preserved (nothing deleted)
  - Agents rarely need to read this
  - Example: 105 stories, 82KB

**Benefits**:
1. **Prevents agent failures** - Keeps status.json under 25k token limit
2. **Improves performance** - Agents read smaller files faster (18KB vs 82KB)
3. **Maintains history** - Nothing deleted, full audit trail in archive
4. **Automatic** - Runs on SessionStart, no manual intervention needed
5. **Configurable** - Users choose threshold (3/7/14/30+ days)
6. **Transparent** - Runs silently in background
7. **Safe** - Creates backups before modifying files

**Files Created**:
- `scripts/archive-completed-stories.sh` - Archive script with configurable threshold

**Files Modified**:
- `commands/setup.md` - Added "Auto-Archival Configuration" section
- `templates/hooks.example.json` - Added auto-archival SessionStart hook example
- `CLAUDE.md` - Added "Auto-Archival System (v2.19.4+)" section with full documentation
- `.claude-plugin/plugin.json` - Version bumped to 2.19.4
- `.claude-plugin/marketplace.json` - Updated description with v2.19.4

**Usage**:

**Automatic** (via SessionStart hook):
- No action needed - runs automatically when Claude Code starts
- Configured during `/AgileFlow:setup`

**Manual** (run anytime):
```bash
# Archive stories completed >7 days ago
bash scripts/archive-completed-stories.sh 7

# Archive stories completed >30 days ago
bash scripts/archive-completed-stories.sh 30
```

**Configuration** (change threshold):
```bash
# Edit .claude/settings.json
{
  "env": {
    "ARCHIVE_THRESHOLD_DAYS": "7"
  }
}
```

**Why This Matters**:
- Solves critical scalability issue affecting all active projects
- Prevents "file too large" errors that break agent workflows
- No breaking changes - existing projects continue working
- Self-maintaining - runs automatically via hooks system
- User-reported issue: Fixed the exact error user encountered

**Technical Implementation**:
- Uses jq for JSON manipulation (safe, tested)
- Calculates cutoff date based on threshold
- Filters completed stories older than cutoff
- Merges filtered stories into archive
- Removes archived stories from active status
- Creates backups before modifications
- Provides detailed output with status summary

**Upgrade Path**:
- Existing projects: Run `/AgileFlow:setup` to enable auto-archival
- New projects: Auto-archival configured automatically during setup
- Backward compatible: Archive created on first run, no migration needed

## [2.19.3] - 2025-10-30

### Added - Parallel Notion Export Architecture (10-30x Performance Improvement)

Implemented parallel agent architecture for Notion exports, following the proven `/AgileFlow:readme-sync` pattern to achieve dramatic performance gains.

**New Features**:

1. **Parallel Export Agent** (`agents/agileflow-notion-exporter.md`)
   - NEW specialized subagent for individual item export
   - Processes ONE item at a time (epic, story, or ADR)
   - Generates comprehensive summaries with full content:
     - **Epic Summary**: Full description, goals, story list with progress (X/Y completed), dependencies, related ADRs, dates
     - **Story Summary**: Full description, all acceptance criteria (Given/When/Then), technical notes, testing strategy, architecture context, implementation details, files modified, dependencies
     - **ADR Summary**: Full context, decision rationale, alternatives considered with pros/cons, consequences, related epics/stories
   - Exports to Notion using MCP tools (mcp__notion__create_page, mcp__notion__update_page)
   - Calculates checksums for sync tracking
   - Uses Haiku model for fast processing
   - Returns JSON with page_id, status, checksum

2. **Orchestrated Batching** (updated `/AgileFlow:notion`)
   - Spawns multiple `agileflow-notion-exporter` agents in parallel
   - Batching strategy: Groups of 10 agents to respect API rate limits
   - Progress tracking: Real-time batch completion status
   - Error resilience: Failed items don't block successful exports
   - Collects JSON results from all agents
   - Updates sync map with checksums and page IDs

**Performance Gains**:
- **Sequential (v2.19.2 and earlier)**: 100 items = 3-5 minutes
- **Parallel (v2.19.3)**: 100 items = 10-30 seconds
- **Speed improvement**: 10-30x faster exports
- **Why it's faster**: Concurrent processing, Haiku model, parallel MCP calls

**Example Workflow**:
```
/AgileFlow:notion
  ↓
Orchestrator scans docs/ for all epics, stories, ADRs (100 items)
  ↓
Spawns agileflow-notion-exporter agents in batches of 10:
  - Batch 1: 10 agents → 10 items exported in 1-3 seconds
  - Batch 2: 10 agents → 10 items exported in 1-3 seconds
  - ... (10 batches total)
  ↓
Orchestrator collects 100 JSON results
  ↓
Updates sync map with all page IDs and checksums
  ↓
Total time: 10-30 seconds (vs 3-5 minutes sequential)
```

**Files Created**:
- `agents/agileflow-notion-exporter.md` - Parallel export agent definition (haiku model)

**Files Modified**:
- `commands/notion.md` - Added parallel execution architecture documentation, updated to emphasize detailed summaries for ALL items
- `SUBAGENTS.md` - Added documentation for agileflow-notion-exporter agent in new "Export & Integration Agents" section, updated agent count from 25 to 26
- `.claude-plugin/plugin.json` - Version bumped to 2.19.3
- `.claude-plugin/marketplace.json` - Updated description with v2.19.3 and agent count

**Why This Matters**:
- **Massive performance improvement**: 10-30x faster exports (100 items in seconds vs minutes)
- **Better UX**: Users see progress in real-time as batches complete
- **Scalability**: Can handle hundreds of items without timeout issues
- **Error resilience**: One failed item doesn't break the entire export
- **Proven pattern**: Same architecture as /AgileFlow:readme-sync (reliable, battle-tested)
- **Comprehensive summaries**: Full content, not just metadata - Notion becomes single source of truth

**Usage**:
```bash
# Export all epics, stories, and ADRs to Notion in parallel
/AgileFlow:notion

# Output shows batch progress:
# Processing batch 1/10 (10 items)... ✅ 10/10 complete
# Processing batch 2/10 (10 items)... ✅ 10/10 complete
# ...
# ✅ Successfully exported 100 items in 15 seconds
```

**Technical Implementation**:
- Orchestrator in `/AgileFlow:notion` spawns workers
- Each worker is an independent `agileflow-notion-exporter` agent
- Workers run in separate context windows (true parallelism)
- Haiku model balances speed and quality
- JSON result format enables structured result collection
- Batching prevents API rate limit issues

**Upgrade Path**:
- Existing `/AgileFlow:notion` command works as before (no breaking changes)
- Just MUCH faster with v2.19.3
- Sync map format unchanged (backward compatible)

## [2.19.2] - 2025-10-30

### Added - MCP Troubleshooting & UX Improvements

Implemented high-priority MCP integration improvements to solve the #1 support issue ("MCP not working") and improve user experience during setup.

**New Features**:

1. **Token Validation Script** (`scripts/validate-mcp-tokens.sh`)
   - Securely validates MCP tokens without exposing values
   - Checks if tokens exist (not placeholders like "your_token_here")
   - Shows token length only (not actual value)
   - Verifies .gitignore protection (.mcp.json and .env)
   - Checks wrapper script infrastructure
   - Validates .mcp.json uses wrapper approach
   - Provides clear next steps for fixing issues

2. **/AgileFlow:validate-mcp Command** (`commands/validate-mcp.md`)
   - User-facing command to run token validation
   - Provides detailed troubleshooting guidance
   - Safe to run and share output (no tokens exposed)
   - Helps users diagnose "MCP not working" issues

3. **.gitignore Auto-Fix in /AgileFlow:setup**
   - Automatically adds .mcp.json and .env to .gitignore (no prompt needed)
   - Security-critical protection happens automatically
   - Also auto-adds hooks/ and .claude/ directories
   - Prevents accidental token commits

4. **Enhanced Restart Warnings**
   - MUCH more prominent restart warnings throughout /AgileFlow:setup
   - Visual separators (═══) make warnings impossible to miss
   - Clear instructions: "Quit completely (Cmd+Q), wait 5 seconds, restart"
   - Emphasizes "MCP servers ONLY load on startup"
   - Added to all MCP setup sections (GitHub, Notion, Context7, Hooks)

**Why This Matters**:
- **Token validation** solves 80% of "MCP not working" support issues
- **.gitignore auto-fix** prevents accidental token commits (security critical)
- **Enhanced restart warnings** eliminate the #1 source of user confusion
- Users can self-diagnose with `/AgileFlow:validate-mcp` before asking for support

**Files Created**:
- `scripts/validate-mcp-tokens.sh` - Secure token validation script
- `commands/validate-mcp.md` - Token validation command

**Files Modified**:
- `commands/setup.md` - Added .gitignore auto-fix, enhanced restart warnings in all MCP sections
- `.claude-plugin/plugin.json` - Version bumped to 2.19.2
- `.claude-plugin/marketplace.json` - Updated description

**Impact**:
- Reduced support burden (users can self-diagnose)
- Improved security (auto .gitignore protection)
- Better UX (impossible to miss restart warnings)
- Faster onboarding (clear validation and troubleshooting)

**Usage**:
```bash
# Validate MCP token configuration
/AgileFlow:validate-mcp

# Output shows:
# ✅ Tokens configured correctly
# ✅ .gitignore protects secrets
# ✅ Wrapper script ready
# 🔴 Reminder to restart Claude Code if needed
```

## [2.19.1] - 2025-10-30

### Fixed - MCP Environment Variable Loading (Critical Bug Fix)

Fixed critical MCP integration issue where environment variables from `.env` files were not being loaded properly. The previous `${VAR}` substitution approach didn't work because Claude Code doesn't automatically load `.env` files for MCP servers.

**The Problem**:
- OLD approach: `.mcp.json` used `"env": {"VAR": "${VAR}"}` syntax
- Expected Claude Code to load `.env` files (it doesn't!)
- `${VAR}` substitution reads from system environment variables, not `.env` files
- Users had to manually export environment variables before starting Claude Code
- This caused MCP integrations (GitHub, Notion, Context7) to fail silently

**The Solution - Wrapper Approach**:
- Created universal wrapper script: `templates/mcp-wrapper-load-env.sh`
- Wrapper loads `.env` and exports variables before running MCP server
- Updated `.mcp.json.example` to use wrapper: `"command": "bash", "args": ["scripts/mcp-wrappers/load-env.sh", ...]`
- No "env" blocks needed - wrapper handles everything
- Works reliably across all platforms (Linux, macOS, Windows WSL)

**Files Modified**:
1. **templates/mcp-wrapper-load-env.sh** (NEW) - Universal environment variable loader for MCP servers
2. **.mcp.json.example** - Updated to use wrapper approach (removed "env" blocks)
3. **commands/setup.md** - Updated GitHub, Notion, and Context7 setup sections to deploy wrapper
4. **CLAUDE.md** - Updated MCP Integration and Setup Flow sections to document wrapper approach

**Migration for Existing Users**:
If you have an existing `.mcp.json` that's not working:
1. Create wrapper directory: `mkdir -p scripts/mcp-wrappers`
2. Copy wrapper script: `cp ~/.claude-code/plugins/AgileFlow/templates/mcp-wrapper-load-env.sh scripts/mcp-wrappers/load-env.sh`
3. Make executable: `chmod +x scripts/mcp-wrappers/load-env.sh`
4. Update your `.mcp.json` to use wrapper approach (see `.mcp.json.example` for template)
5. Ensure your tokens are in `.env` (not `.mcp.json`)
6. Restart Claude Code

**Why This Matters**:
- MCP integrations now work out-of-the-box without manual environment variable exports
- Improved developer experience - just edit `.env` and restart Claude Code
- Better security - wrapper approach is clearer and more maintainable than `${VAR}` substitution
- Cross-platform compatibility - works consistently on all operating systems

**Impact**:
- Fixes MCP integration for all users experiencing GitHub/Notion/Context7 connection issues
- /AgileFlow:setup now correctly configures MCP servers with working environment variable loading
- Aligns with industry best practices for MCP server configuration

## [2.19.0] - 2025-10-28

### Added - Hooks System (Event-Driven Automation)

Implemented first-class hooks system following dotai's pattern for event-driven automation and dynamic configuration. This enables users to execute custom commands in response to Claude Code lifecycle events without requiring plugin code changes.

**Hooks System Components**:
1. **hooks/hooks.json** - Main hook configuration file (gitignored - user-specific)
2. **scripts/get-env.js** - Dynamic environment variable helper for runtime config
3. **templates/hooks.example.json** - Basic example template for users to copy
4. **templates/hooks.advanced.example.json** - Advanced example with matchers and logging

**Supported Events**:
- **SessionStart**: Runs when Claude Code session starts (welcome messages, context setup)
- **UserPromptSubmit**: Runs after user submits a prompt (logging, analytics)
- **Stop**: Runs when Claude stops responding (cleanup, notifications)

**Key Features**:
- **Separate hooks.json**: First-class citizen pattern (not embedded in plugin.json)
- **Dynamic environment variables**: get-env.js helper loads from .claude/settings.json without restart
- **Conditional execution**: Matcher patterns for context-aware hooks
- **User-specific config**: All hooks files gitignored, users copy templates

**Why This Matters**:
- **Event-driven automation**: Users can automate workflows (logging, notifications, context loading)
- **No restart needed**: Dynamic config via get-env.js changes without Claude Code restart
- **Modular pattern**: Following successful dotai plugin architecture (1k+ stars)
- **Privacy-first**: User-specific hooks.json not committed to git

**Documentation**:
- Added comprehensive Hooks System section to CLAUDE.md (200+ lines)
- Covers setup, examples, security, best practices, comparison with MCP
- Includes advanced matchers, logging patterns, performance tips

**Files Modified**:
- `.gitignore` - Added hooks/, .claude/ log files
- `CLAUDE.md` - Added Hooks System section with full documentation
- `hooks/hooks.json` - Created basic SessionStart welcome hook
- `scripts/get-env.js` - Created dynamic environment variable helper
- `templates/hooks.example.json` - Created basic example template
- `templates/hooks.advanced.example.json` - Created advanced example with matchers

**Impact**:
- Users can now customize AgileFlow behavior without forking
- Session automation (welcome messages, context preloading)
- Activity tracking (prompt logging, analytics)
- Follows industry best practice (dotai pattern with 1k+ GitHub stars)

## [2.18.0] - 2025-10-28

### Added - 8 Additional Specialized Agents (Documentation, Monitoring, Compliance, Design, Accessibility, Analytics, Data Migration, QA)

Continued expansion of agent ecosystem from 17 to 25 specialized agents. This release adds critical domain coverage for production operations, quality assurance, and organizational compliance.

**New Agents (8 total)**:
1. **documentation** - Technical docs, API documentation, user guides, README maintenance, documentation architecture
2. **monitoring** - Logging, metrics, alerting, dashboards, observability, SLOs, incident response
3. **compliance** - GDPR, HIPAA, SOC2, PCI-DSS, CCPA, audit trails, regulatory compliance
4. **design** - Design systems, component design, design tokens, visual design, accessibility-first design
5. **accessibility** - WCAG compliance, inclusive design, a11y testing, assistive technology support
6. **analytics** - Event tracking, product analytics, user behavior analysis, metrics dashboards, A/B testing
7. **datamigration** - Zero-downtime migrations, data validation, rollback strategies, schema evolution
8. **qa** - Test strategy, quality metrics, regression testing, release readiness, UAT coordination

**Why These Agents**:
- **Documentation**: Knowledge transfer critical - users need guides, examples, API docs
- **Monitoring**: Production visibility essential - metrics, logs, alerts prevent surprises
- **Compliance**: Legal/regulatory mandatory - GDPR, HIPAA, SOC2 non-negotiable
- **Design**: Design systems at scale (design tokens, component specs, consistency)
- **Accessibility**: WCAG AA minimum legal requirement (AA/AAA best practice)
- **Analytics**: Product insights drive decisions (user behavior, conversion funnels, A/B tests)
- **Data Migration**: Zero-downtime migrations complex (dual-write, rollback, validation)
- **QA**: Quality gates protect releases (test strategy, release readiness, regression testing)

**Agent Ecosystem**:
- Total agents: 17 → 25 (47% increase)
- All agents maintain haiku model for efficiency
- Comprehensive domain coverage: Engineering (9), Operations (5), Quality (3), Legal/Compliance (2), Analytics (2), Design (2), Support (1)
- Deep specialization in every critical domain

### Improved - Agent Coverage Completeness

- Documentation: Full lifecycle from API docs to user guides to changelog
- Operations: Observability + compliance creates audit trail and incident response
- Quality: Test strategy, release gates, and UAT coordination ensure production readiness
- Enterprise features: GDPR/HIPAA compliance, zero-downtime migrations, analytics privacy

## [2.17.0] - 2025-10-28

### Added - 8 New Specialized Agents (Security, Database, Testing, Product, Performance, Mobile, Integrations, Refactoring)

Expanded agent team from 9 to 17 specialized agents. Each agent focuses deeply on their domain and can be spawned independently while preserving context.

**New Agents (8 total)**:
1. **security** - Vulnerability analysis, threat modeling, compliance, authentication patterns
2. **database** - Schema design, migrations, query optimization, data integrity
3. **testing** - Test strategy, patterns, coverage, anti-pattern elimination (different from CI)
4. **product** - Requirements analysis, user stories, acceptance criteria (upstream of epic-planner)
5. **performance** - Profiling, benchmarking, optimization, scalability analysis
6. **mobile** - React Native, Flutter, native modules, mobile UX patterns
7. **integrations** - Third-party APIs, webhooks, payment processors, authentication providers
8. **refactor** - Technical debt cleanup, code quality, legacy modernization

**Agent Spawning Documentation**:
- Updated `/babysit` with comprehensive agent spawning guidance
- All 17 agents documented with: Purpose, When to use, Specialization, Output
- Key messaging: "YOU SHOULD SPAWN AGENTS LIBERALLY"
- Demonstrated benefits: context preservation, focus, parallelization
- Showed workflow: babysit orchestrates, agents do focused work

**Why These Agents**:
- **Security**: Mandatory pre-release gate (enterprise requirement)
- **Database**: Complex data layer deserves specialization (schema, migrations, optimization)
- **Testing**: Different from CI infrastructure (test design vs infrastructure setup)
- **Product**: Upstream of epic-planner (clarify requirements FIRST)
- **Performance**: Spans all layers (profiling, benchmarking, optimization)
- **Mobile**: Growing importance (React Native, Flutter, native modules)
- **Integrations**: Third-party services common and complex (Stripe, Twilio, etc)
- **Refactor**: Proactive technical debt management (legacy modernization, code quality)

**Agent Architecture Benefits**:
- ✅ Deep specialization (expert in domain, not generalist)
- ✅ Parallel execution (agents work simultaneously)
- ✅ Fresh context windows (each agent uncluttered)
- ✅ Clear coordination (bus messages, dependencies)
- ✅ Token efficiency (focused, not sprawling)
- ✅ Quality improvement (specialist > generalist)

### Changed - Agent Team Expansion

- Total agents: 9 → 17 (88% increase)
- Agent model assignment: All new agents use haiku for efficiency
- Babysit role: Now lightweight orchestrator (spawns specialized agents)

### Improved - Babysit Command Documentation

- Agent spawning section with Task tool usage
- All 17 agents listed with purpose and specifications
- Context preservation benefit explained
- Recommended workflow: orchestrator + specialized agents
- Examples of parallel agent execution

## [2.16.0] - 2025-10-28

### Added - Architecture Context Extraction

Implemented key patterns for improved dev agent context awareness and knowledge transfer between stories.

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

Updated `epic-planner` agent with new Architecture Context Extraction workflow:

**New ARCHITECTURE CONTEXT EXTRACTION Section** (for story creation):
- Documents pattern for extracting architecture context
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

**New Command**: `/AgileFlow:story-validate` (validates individual story completeness)

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

**Example Story**: `examples/story-example.md`
- Demonstrates all new sections in action
- Shows proper Architecture Context with source citations
- Shows populated Dev Agent Record with real-world implementation notes
- Includes Previous Story Insights example for follow-on stories

### Improved - Story Template Enhancement

Enhanced `templates/story-template.md` with improved sections:
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

**Pattern Origins**: These patterns have been adapted and refined for AgileFlow's command-based architecture.

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

**New Subagent: context7 (Documentation Specialist)**

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
Use the context7 agent to fetch the latest React hooks documentation
Use the context7 agent to get current Express.js authentication setup guides
Use the context7 agent to find MongoDB and Mongoose best practices
```

**Files Added**:
- `agents/context7.md` - Complete Context7 specialist agent definition

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
| `/notion` | `/notion` | Bidirectional Notion database sync |
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

**6. epic-planner** 🗺️
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
├── epic-planner/
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
- `agents/mentor.md` - 8 old command references fixed
- `agents/devops.md` - 7 old command references fixed
- `agents/adr-writer.md` - 6 old command references fixed
- `agents/epic-planner.md` - 4 old command references fixed
- `agents/ci.md` - 3 old command references fixed
- `agents/api.md` - 3 old command references fixed
- `agents/ui.md` - 3 old command references fixed
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
- Manual fix: devops.md line 219 (documentation comment)

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

- **`/AgileFlow:agent-ui`** - Redundant (just invoked ui subagent, which `/babysit` can do directly)
- **`/AgileFlow:agent-api`** - Redundant (just invoked api subagent, which `/babysit` can do directly)
- **`/AgileFlow:agent-ci`** - Redundant (just invoked ci subagent, which `/babysit` can do directly)
- **`/AgileFlow:readme-sync`** - Redundant (narrow scope, superseded by `/docs-sync` and `/babysit`)

**Why remove them?**
- The `/babysit` command already has full access to all 8 subagents via the Task tool
- These were just thin wrappers with no additional functionality
- Simplifies the command surface area
- **All 8 subagents remain** - they're the real power (ui, api, ci, mentor, epic-planner, adr-writer, research, devops)

### Changed

**Standardized Command References: ALL Commands Now Use `/AgileFlow:` Prefix**

Fixed command references across **all 65 markdown files** to use proper `/AgileFlow:` prefix:
- ❌ Before: `/epic-new`, `/story-new`, `/board`, `/github-sync`, `/notion`, etc.
- ✅ After: `/AgileFlow:epic-new`, `/AgileFlow:story-new`, `/AgileFlow:board`, `/AgileFlow:github-sync`, `/AgileFlow:notion`, etc.

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

**In `ui` subagent**:
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
- `agents/mentor.md` - Added shared vocabulary, dependency protocols, proactive FIRST ACTION
- `agents/ui.md` - Added vocabulary, AG-API coordination, dependency handling, proactive status
- `agents/api.md` - Added vocabulary, AG-UI unblocking patterns, proactive blocker detection
- `agents/ci.md` - Added vocabulary, health checks, proactive audit offers
- `agents/devops.md` - Added vocabulary, security scans, proactive vulnerability alerts
- `agents/epic-planner.md` - Added vocabulary, capacity checks, auto-sync
- `agents/adr-writer.md` - Added vocabulary, research integration, proactive context
- `agents/research.md` - Added vocabulary, stale research detection, agent coordination
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

All three core agents (`ui`, `api`, `ci`) now proactively maintain CLAUDE.md:

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

- `agents/ui.md` - Added CLAUDE.md maintenance section and updated workflow
- `agents/api.md` - Added CLAUDE.md maintenance section and updated workflow
- `agents/ci.md` - Added CLAUDE.md maintenance section and updated workflow
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

The `ui` subagent now automatically detects and creates design systems:

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
- `agents/ui.md` - Added design system initialization workflow
- Plugin version bumped to 2.5.0 (minor release - new UI agent capability)

### Technical

- Added "DESIGN SYSTEM INITIALIZATION" section to ui agent
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
- `agents/mentor.md` - Detection still via .mcp.json (correct)

**Apologies for the confusion** - The initial v2.3.0 release incorrectly claimed OAuth support. This correction was made the same day after user testing revealed the error.

---

### Added

**Notion Integration via Model Context Protocol (MCP)** (CORRECTED):

- Migrated `/notion` from direct API calls to MCP tool-based implementation
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

The `/notion` command now uses these Notion MCP tools:
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
  - `/notion` now mentions "uses MCP"

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
6. Verify: Run `/AgileFlow:notion DRY_RUN=true`
7. Resume syncing: Run `/notion`

**IF STARTING FRESH**:
1. Create Notion integration: https://www.notion.so/my-integrations
2. Add NOTION_TOKEN to .env
3. Run `/setup-system` and select "yes" for Notion
4. Restart Claude Code
5. Run `/AgileFlow:notion MODE=setup` to create databases
6. Start syncing!

Your existing database IDs are preserved - no need to recreate databases!

### Technical

- Plugin version bumped to 2.3.0 (minor release)
- Added `.mcp.json.example` template to repository root
- Added `.mcp.json` to .gitignore (contains token references)
- Rewrote `/notion` implementation to use MCP tools
- Updated `commands/setup-system.md` with corrected token-based MCP setup
- Updated `README.md` to remove OAuth claims, clarify token requirement
- Updated `.mcp.json` to use @notionhq/notion-mcp-server with env var substitution
- Documented MCP tool advantages over direct API calls
- Updated `/babysit` and `mentor` to detect Notion via .mcp.json
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

**Enhanced /AgileFlow:babysit and mentor**:
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

- `/notion` - Bidirectional sync with Notion databases
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
- `devops` - DevOps & Automation specialist subagent
  - Manages all 13 new automation commands
  - Handles dependencies, deployment, testing, code quality
  - Tracks technical debt and generates reports
  - Works on stories tagged `owner: AG-DEVOPS`

**Enhanced Subagents**:
- Converted agents to proper Claude Code subagent format with YAML frontmatter
- All subagents now operate in separate context windows
- Added `mentor` (replaces `/babysit` command functionality)
- Added `epic-planner` for feature planning
- Added `adr-writer` for decision documentation
- Added `research` for technical research

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
