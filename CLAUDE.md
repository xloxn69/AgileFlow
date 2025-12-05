# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 🚫 CRITICAL: NO AI ATTRIBUTION IN COMMITS

**NEVER ADD AI ATTRIBUTION TO ANY COMMITS IN THIS REPOSITORY.**

This is a hard requirement and user preference. All git commit messages MUST appear as human-authored only.

### Forbidden Practices (NEVER do these)

- ❌ **No AI attribution footers** - NEVER add "🤖 Generated with Claude Code" or similar
- ❌ **No Co-Authored-By lines** - NEVER add "Co-Authored-By: Claude <noreply@anthropic.com>"
- ❌ **No AI mentions in commit messages** - NEVER mention "Claude", "AI", "automation", "generated", "assisted by", or any AI-related terms
- ❌ **No AI metadata in git history** - NEVER add any form of AI disclosure in commit messages, trailers, or git notes
- ❌ **Applies to ALL git operations** - This includes: `git commit`, `git commit --amend`, `git rebase` (reword messages), `git merge` messages, ALL git operations that write messages

### Required Behavior

- ✅ **ALL commits must be clean** - Commit messages should appear 100% human-authored
- ✅ **Use standard Conventional Commits only** - Format: `feat:`, `fix:`, `chore:`, `docs:`, etc.
- ✅ **No AI-related metadata anywhere** - Keep git history professional and clean
- ✅ **Write as a human developer** - Commit messages should sound like they were written by a team member

### Examples

**WRONG** (NEVER do this):
```
feat: add new command

🤖 Generated with Claude Code
https://claude.com/claude-code

Co-Authored-By: Claude <noreply@anthropic.com>
```

**WRONG** (NEVER do this):
```
fix: correct validation logic

Fixed the validation bug with AI assistance.
```

**CORRECT** (Always do this):
```
feat: add new command

Added /AgileFlow:compress command to reduce status.json file size
by stripping verbose fields while preserving data in markdown files.
```

**CORRECT** (Always do this):
```
fix: correct validation logic

Fixed validation bug where empty fields were incorrectly accepted.
Updated regex pattern to require non-empty values.
```

### Rationale

User preference: No disclosure of AI assistance in git history for professional, client, and personal reasons. The git history should reflect clean, professional commit messages without any indication of AI tooling.

### When in Doubt

Write the commit message as if you were a human developer on the team. No mentions of AI tools, automation, or assistance whatsoever. Keep it professional, concise, and focused on WHAT changed and WHY (not HOW it was created).

---

## 🚫 CRITICAL: NO SOURCE ATTRIBUTION

**NEVER MENTION SOURCE REPOSITORIES WHEN IMPLEMENTING FEATURES.**

When implementing features inspired by or copied from other repositories, NEVER document the source repository name in commits, documentation, or code comments.

### Forbidden Practices (NEVER do these)

- ❌ **No repository attribution** - NEVER mention "based on repo X", "inspired by Y", "copied from Z"
- ❌ **No URL references** - NEVER include GitHub URLs or repo links when discussing implementations
- ❌ **No author attribution** - NEVER mention other developers or projects by name
- ❌ **No "credit" comments** - NEVER add comments like "// Credit to ProjectX for this approach"

### Required Behavior

- ✅ **Describe the FEATURE, not the SOURCE** - Focus on WHAT was built, not WHERE it came from
- ✅ **Use generic terminology** - "Implemented workflow system" NOT "Copied workflow from RepoX"
- ✅ **Focus on functionality** - Document what the code does, not its origins
- ✅ **Keep documentation clean** - No paper trail linking to external repositories

### Examples

**WRONG** (NEVER do this):
```
feat: add release automation workflow

Implemented GitHub Actions workflow based on jeremylongshore/claude-code-plugins-plus.
Copied their release.yml and adapted it for our use case.
```

**WRONG** (NEVER do this):
```markdown
## Release Process

This process follows the pattern from https://github.com/jeremylongshore/claude-code-plugins-plus
```

**CORRECT** (Always do this):
```
feat: add release automation workflow

Implemented GitHub Actions workflow for automated releases.
Workflow validates CHANGELOG, updates version files, creates git tags, and publishes releases.
```

**CORRECT** (Always do this):
```markdown
## Release Process

AgileFlow supports automated releases using GitHub Actions.
The workflow handles version bumping, tagging, and release creation.
```

### Rationale

User preference: Avoid legal issues and attribution problems by not creating a paper trail to source repositories. Focus on describing the functionality implemented, not where the implementation idea originated.

### When in Doubt

Describe WHAT the system does, not WHERE you learned about it. If you implement a feature after studying another repository, document the feature itself without mentioning the source.

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

**AgileFlow** is a Claude Code plugin providing a universal agile/docs-as-code system. It's a **command pack** (37 slash commands + 26 specialized subagents + 23 auto-loaded skills), not a traditional application codebase. There is no build step, runtime, or deployment process.

**Current Version**: v2.23.0 (26 specialized agents, 37 commands, 23 refactored skills following Anthropic specification + hooks system for event-driven automation covering UI, API, CI, DevOps, Planning, Research, Mentoring, Documentation, Monitoring, Compliance, Security, Database, Testing, Product, Performance, Mobile, Integrations, Refactoring, Design, Accessibility, Analytics, Data Migration, and QA + status.json compression - MCP-free for reduced context usage)

---

## 🎯 Command Safety Policy

**When working with AgileFlow, follow these execution rules:**

### Slash Commands (Autonomous)
✅ **Run autonomously without asking** - Slash commands like `/AgileFlow:story`, `/AgileFlow:epic`, `/AgileFlow:status` can be invoked directly as part of workflow orchestration. The user expects proactive command execution.

### File Operations (Confirmation Required)
⚠️ **Require diff + YES/NO confirmation** - Any file write, edit, or creation must:
1. Show a clear diff of changes
2. Wait for explicit YES/NO approval from user
3. Keep JSON valid (repair if broken and explain the fix)

### Shell Operations (Risk-Based)
- **Safe commands** (autonomous): `ls`, `cat`, `grep`, `npm test`, `npm run build`, file scaffolding
- **Dangerous commands** (require justification + confirmation): `rm -rf`, `git reset --hard`, `git push --force` to main/master

**Summary**: Commands are autonomous, writes need approval.

---

## 📊 Test Coverage Policy

**AgileFlow enforces consistent test coverage standards across all projects:**

### Coverage Targets
- **Global target**: 80% overall code coverage
- **Critical paths**: 100% coverage required (authentication, payment, data integrity, security)
- **CI enforcement**: Builds fail if coverage drops below 80%

### Coverage by Component Type
- **Unit tests**: 80%+ (business logic, utilities)
- **Integration tests**: 60%+ (API endpoints, database interactions)
- **E2E tests**: 30%+ (critical user flows)

### Guidelines
- New code should aim for 90%+ coverage
- Never accept <70% without documented exceptions and plan to improve
- Test quality matters: prefer meaningful tests over coverage percentage
- Document any coverage exceptions in story's Testing Strategy section

### Reporting
- Coverage reports generated on every CI run
- Dev agents must report coverage metrics when completing stories
- Blockers created if coverage drops below threshold

**Rationale**: Consistent standards prevent "coverage drift" where different agents/docs cite different thresholds.

---

## Architecture

### Plugin Structure

```
AgileFlow/
├── .claude-plugin/
│   ├── plugin.json           # Plugin metadata (version, command/subagent registry)
│   └── marketplace.json      # Marketplace listing
├── commands/                 # 38 slash command definitions (*.md files)
├── agents/                   # 27 subagent definitions (*.md files)
├── skills/                   # 23 skill definitions (*/SKILL.md files)
├── scripts/                  # Helper scripts
│   └── get-env.js           # Dynamic environment variable loader
├── templates/                # Document templates for epics, stories, ADRs, Claude settings
│   ├── claude-settings.example.json   # Basic Claude settings template (hooks)
│   └── claude-settings.advanced.example.json  # Advanced settings template
├── CHANGELOG.md             # Version history (Keep a Changelog format)
├── README.md                # Plugin documentation
├── SUBAGENTS.md             # Subagent usage guide
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

**AgileFlow System** (created by `/AgileFlow:setup` command):
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

## Architecture Context & Knowledge Transfer Patterns (v2.16.0+)

AgileFlow now implements key patterns for improved dev agent context awareness and knowledge transfer between stories.

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

### Story Validation (`/story-validate`)

**Purpose**: Validate stories are complete before dev agent assignment.

**New command**: `/AgileFlow:story-validate US-XXXX`

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

### New Features
- ✅ **Architecture Context Extraction**: Stories now include auto-filled Architecture Context with source citations
- ✅ **Dev Agent Record**: Capture implementation model, issues, lessons learned for knowledge transfer
- ✅ **Previous Story Insights**: Flow lessons between stories in same epic
- ✅ **Story Validation Command**: `/AgileFlow:story-validate US-XXXX` for completeness checking
- ✅ **Enhanced /babysit**: Integrated workflow guidance (validate → read context → implement → record lessons)

### New Files Created
- `commands/story-validate.md` - Story validation command
- `docs/06-stories/EP-0001/US-0001-user-login-api.md` - Example story with all new sections

### Modified Files
- `templates/story-template.md` - Added Architecture Context, Dev Agent Record, Previous Story Insights
- `agents/agileflow-epic-planner.md` - Added Architecture Context Extraction workflow
- `commands/babysit.md` - Enhanced with workflow guidance sections
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

### Workflow 2: Implement Story with Enhanced Patterns

```
Dev Agent receives: US-XXXX (Story with Architecture Context populated)
  ↓
1. Validate: /AgileFlow:story-validate US-XXXX
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
Run: /AgileFlow:story-validate US-XXXX
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

### Creating GitHub Releases (v2.23.0+)

AgileFlow now supports automated GitHub Releases using GitHub Actions workflow.

**Manual Release Process** (for immediate releases):

1. **Ensure version is bumped** (see "Updating Plugin Version" above)
2. **Ensure CHANGELOG has section** for the new version
3. **Create git tag**:
   ```bash
   git tag -a v2.23.0 -m "Release v2.23.0 - Description"
   ```
4. **Push tag**:
   ```bash
   git push origin v2.23.0
   ```
5. **Create GitHub Release using gh CLI**:
   ```bash
   # Extract changelog section
   awk '/## \[2.23.0\]/,/## \[/ {if (/## \[/ && !/## \[2.23.0\]/) exit; print}' CHANGELOG.md > /tmp/release-notes.txt

   # Create release
   gh release create v2.23.0 --title "Release v2.23.0" --notes-file /tmp/release-notes.txt --latest
   ```

**Automated Release Process** (using GitHub Actions):

1. **Prepare CHANGELOG entry** for the new version BEFORE triggering workflow
2. **Navigate to Actions tab** in GitHub repository
3. **Select "Release Pipeline" workflow**
4. **Click "Run workflow"**
5. **Enter new version** (e.g., 2.23.1)
6. **Workflow automatically**:
   - Updates all 3 version files (plugin.json, marketplace.json, README.md)
   - Verifies CHANGELOG has section for this version
   - Commits version bump
   - Creates git tag with changelog notes
   - Pushes changes and tag
   - Creates GitHub Release

**Workflow Location**: `.github/workflows/release.yml`

**Requirements**:
- CHANGELOG.md must have `## [X.Y.Z]` section BEFORE running workflow
- Workflow validates CHANGELOG presence and fails if missing
- Version must be in format X.Y.Z (e.g., 2.23.1)

**Example Workflow Run**:
```bash
# In GitHub UI: Actions → Release Pipeline → Run workflow → Enter "2.23.1"
# Workflow outputs:
# ✅ Version bumped to 2.23.1
# ✅ Git tag created: v2.23.1
# ✅ GitHub release published
# View Release: https://github.com/xloxn69/AgileFlow/releases/tag/v2.23.1
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

### Adding a New Skill (v2.21.0+)

1. **Create skill directory** (auto-discovered):
   ```bash
   mkdir skills/new-skill-name
   ```

2. **Create SKILL.md with Anthropic-compliant frontmatter**:
   ```bash
   skills/new-skill-name/SKILL.md
   ```

   **Frontmatter requirements** (v2.21.0+):
   ```yaml
   ---
   name: new-skill-name
   description: Brief description of what this skill does and when to use it (<150 chars)
   ---
   ```

   **REMOVED in v2.21.0** (no longer supported):
   - ❌ `allowed-tools` field
   - ❌ ROLE & IDENTITY section
   - ❌ OBJECTIVE section
   - ❌ INPUTS section
   - ❌ FIRST ACTION / Deterministic boot sequence
   - ❌ PROACTIVE KNOWLEDGE LOADING section
   - ❌ HANDOFFS section
   - ❌ OUTPUTS section

3. **Follow minimal structure** (see `templates/skill-template.md`):
   ```markdown
   ---
   name: skill-name
   description: Brief description
   ---

   # Skill Name

   Brief overview (1-2 sentences)

   ## When to Use
   - Activation keywords/scenarios

   ## What This Does
   - Key functionality (4-6 bullet points)

   ## Instructions
   1. Step-by-step workflow

   ## Output Examples
   [Concise examples with code blocks]

   ## Quality Checklist
   - [ ] Pre-execution checks

   ## Notes
   - Important considerations
   ```

4. **Target length**: 80-150 lines (simple skills) or 130-280 lines (complex skills)

5. **Update README.md** - Add skill to Skills section with category

6. **Bump version and update changelog**:
   - Update `.claude-plugin/plugin.json` version (e.g., 2.21.0 → 2.21.1)
   - Update `.claude-plugin/marketplace.json` description
   - Add new section to `CHANGELOG.md` documenting the new skill under "Added"

7. **No need to edit plugin.json** - Auto-discovery handles registration

**Skills Architecture (v2.21.0)**:
- All 23 skills refactored to follow Anthropic's official specification
- Removed `allowed-tools` field from all skills frontmatter
- Simplified structure: 6-8 core sections (down from 10-15 sections)
- 27% complexity reduction (517 lines removed across all skills)
- Consistent YAML frontmatter: `name` + `description` only
- Simple skills: 34-84 lines
- Complex skills: 130-281 lines
- Total: 2,435 lines (down from ~3,000+ lines)

**Why this structure?**:
- Matches Anthropic's official skills specification
- Easier to scan and maintain
- Removes meta-information (ROLE, FIRST ACTION, etc.)
- Focuses on practical guidance for Claude
- Consistent with other skills in Anthropic ecosystem

## Hooks System (v2.19.0+)

AgileFlow now supports first-class hooks following Claude Code's official specification for event-driven automation and dynamic configuration.

### Overview

**Hooks** allow you to execute commands in response to Claude Code lifecycle events:
- **SessionStart**: Runs when Claude Code session starts (welcome messages, context setup)
- **UserPromptSubmit**: Runs after user submits a prompt (logging, analytics)
- **Stop**: Runs when Claude stops responding (cleanup, notifications)

### File Structure

```
User Project/
├── .claude/
│   ├── settings.json        # Project-level Claude settings (hooks config, committed to git)
│   └── settings.local.json  # User-specific overrides (gitignored)
├── scripts/
│   └── get-env.js          # Dynamic environment variable helper
```

**Template Files** (in AgileFlow plugin):
```
AgileFlow/templates/
├── claude-settings.example.json         # Basic hooks template
└── claude-settings.advanced.example.json # Advanced hooks template
```

### settings.json Format

**Location**: `.claude/settings.json` (project-level configuration, committed to git)

**Structure**:
```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "echo '🚀 AgileFlow loaded - Use /AgileFlow:help to see available commands'"
          }
        ]
      }
    ],
    "UserPromptSubmit": [],
    "Stop": []
  }
}
```

**Fields**:
- `matcher`: Regex pattern to match against event data (empty = always run)
- `type`: Always "command" for shell commands
- `command`: Shell command to execute (can use environment variables)

### Dynamic Environment Variables

**Helper Script**: `scripts/get-env.js`

**Purpose**: Load environment variables from `.claude/settings.json` and `.claude/settings.local.json` without requiring Claude Code restart.

**Usage in hooks**:
```json
{
  "type": "command",
  "command": "echo Welcome $(node scripts/get-env.js USER_NAME 'Developer')"
}
```

**How it works**:
1. Reads `.claude/settings.json` (base config)
2. Reads `.claude/settings.local.json` (local overrides - gitignored)
3. Returns variable value or default if not found
4. No restart needed when config changes

**Example settings.json**:
```json
{
  "env": {
    "USER_NAME": "Alice",
    "PROJECT_NAME": "MyProject"
  }
}
```

**Example settings.local.json** (overrides):
```json
{
  "env": {
    "USER_NAME": "Bob"
  }
}
```

Result: `$(node scripts/get-env.js USER_NAME 'Developer')` returns "Bob"

### Hook Examples

**SessionStart - Welcome Message**:
```json
{
  "SessionStart": [
    {
      "matcher": "",
      "hooks": [
        {
          "type": "command",
          "command": "echo '🚀 AgileFlow v2.19.0 loaded - Use /AgileFlow:help to see available commands'"
        }
      ]
    }
  ]
}
```

**SessionStart - Context Loading**:
```json
{
  "SessionStart": [
    {
      "matcher": "",
      "hooks": [
        {
          "type": "command",
          "command": "echo '📁 Loading project context from docs/...'"
        },
        {
          "type": "command",
          "command": "ls -la docs/"
        }
      ]
    }
  ]
}
```

**Stop - Cleanup Notification**:
```json
{
  "Stop": [
    {
      "matcher": "",
      "hooks": [
        {
          "type": "command",
          "command": "echo '✅ Claude finished responding'"
        }
      ]
    }
  ]
}
```

**UserPromptSubmit - Logging**:
```json
{
  "UserPromptSubmit": [
    {
      "matcher": "",
      "hooks": [
        {
          "type": "command",
          "command": "echo '[LOG] User submitted prompt at $(date)' >> .claude/prompt-log.txt"
        }
      ]
    }
  ]
}
```

### Setup Instructions

1. **Create .claude directory**:
   ```bash
   mkdir -p .claude
   ```

2. **Copy template from AgileFlow plugin**:
   ```bash
   cp ~/.claude-code/plugins/AgileFlow/templates/claude-settings.example.json .claude/settings.json
   ```

3. **Edit .claude/settings.json** to add your desired hooks

4. **Create user-specific overrides** (optional):
   ```bash
   cat > .claude/settings.local.json << 'EOF'
   {
     "env": {
       "USER_NAME": "YourName",
       "PROJECT_NAME": "YourProject"
     }
   }
   EOF
   ```

5. **Restart Claude Code** - Hooks won't load without restart

6. **Test hooks**:
   - SessionStart: Start new Claude Code session
   - Stop: Wait for Claude to finish responding
   - UserPromptSubmit: Submit any prompt

### Security Considerations

**settings.json vs settings.local.json**:
- `.claude/settings.json` - Project-level config (committed to git, shared with team)
- `.claude/settings.local.json` - User-specific overrides (gitignored, personal config)

**Recommended .gitignore entries**:
```
.claude/settings.local.json
.claude/prompt-log.txt
.claude/session.log
.claude/activity.log
.claude/context.log
.claude/hook.log
```

**Template files (committed to git)**:
- `templates/claude-settings.example.json` - Example settings for users to copy
- Users copy to `.claude/settings.json` and customize

### Advanced: Conditional Hooks with Matchers

**Matcher Pattern**: Regex to match event data

**Example - Only run hook for specific transcripts**:
```json
{
  "SessionStart": [
    {
      "matcher": ".*epic.*",
      "hooks": [
        {
          "type": "command",
          "command": "echo 'Epic planning session detected'"
        }
      ]
    }
  ]
}
```

**Example - Run different hooks based on context**:
```json
{
  "UserPromptSubmit": [
    {
      "matcher": ".*create story.*",
      "hooks": [
        {
          "type": "command",
          "command": "echo 'Story creation detected - loading story template context'"
        }
      ]
    },
    {
      "matcher": ".*epic.*",
      "hooks": [
        {
          "type": "command",
          "command": "echo 'Epic planning detected - loading epic context'"
        }
      ]
    }
  ]
}
```

### Hooks Best Practices

1. **Keep hooks fast** - Slow hooks delay Claude Code startup/response
2. **Use background jobs** - For long-running tasks: `command &`
3. **Log to files** - Capture output for debugging: `command >> .claude/hook.log 2>&1`
4. **Test incrementally** - Add one hook at a time, restart, verify
5. **Use get-env.js for config** - Avoid hardcoding values in hooks.json
6. **Document custom hooks** - Add comments in hooks.json explaining purpose

**Example - Efficient SessionStart hook**:
```json
{
  "SessionStart": [
    {
      "matcher": "",
      "hooks": [
        {
          "type": "command",
          "command": "echo '🚀 AgileFlow loaded' && (node scripts/load-context.js >> .claude/context.log 2>&1 &)"
        }
      ]
    }
  ]
}
```

## Auto-Archival System (v2.19.4+)

AgileFlow includes an automatic archival system to manage `docs/09-agents/status.json` file size and prevent agents from failing with "file too large" errors.

### The Problem

**As projects grow, status.json can exceed token limits**:
- status.json contains ALL stories (ready, in-progress, blocked, completed)
- Agents must read status.json on every invocation
- Files >25k tokens (typically >100KB) cause "file content exceeds maximum allowed tokens" error
- This breaks ALL agent workflows (UI, API, CI, DevOps, etc.)

### The Solution

**Active/Archive Split**:
- `docs/09-agents/status.json` - Only active work + recent completions (last N days)
- `docs/09-agents/status-archive.json` - Older completed stories (full history preserved)
- Auto-archival runs on SessionStart hook (silently in background)
- Nothing is deleted - full history maintained in archive

### How It Works

**Auto-Archival Script** (`scripts/archive-completed-stories.sh`):
- Takes threshold parameter (days): `bash scripts/archive-completed-stories.sh 7`
- Moves completed stories older than threshold from status.json → status-archive.json
- Keeps active work (ready, in-progress, blocked) + recent completions in status.json
- Runs via SessionStart hook configured during `/AgileFlow:setup`

**Example Auto-Archival Hook** (in `.claude/settings.json`):
```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "bash scripts/archive-completed-stories.sh > /dev/null 2>&1 &"
          }
        ]
      }
    ]
  }
}
```

**Configuration** (in `docs/00-meta/agileflow-metadata.json`):
```json
{
  "version": "2.19.5",
  "created": "2025-10-30T00:00:00Z",
  "updated": "2025-10-30T00:00:00Z",
  "archival": {
    "threshold_days": 7,
    "enabled": true
  },
  "git": {
    "initialized": true,
    "remoteConfigured": true,
    "remoteUrl": "git@github.com:user/repo.git"
  }
}
```

### File Structure

**docs/09-agents/status.json** (Active Work):
- Stories with status: `ready`, `in-progress`, `blocked`
- Completed stories within threshold (recent completions)
- Agents read this file (small, fast, <25k tokens)
- Example: 45 stories, 18KB

**docs/09-agents/status-archive.json** (Historical):
- Completed stories older than threshold
- Full history preserved (nothing deleted)
- Agents rarely need to read this
- Example: 105 stories, 82KB

### User Configuration Options

During `/AgileFlow:setup`, users choose archival threshold:
1. **3 days** - Very aggressive (keeps status.json tiny, for fast-moving teams)
2. **7 days** - Weekly archival (recommended for active projects)
3. **14 days** - Bi-weekly archival (good balance)
4. **30 days** - Monthly archival (default, keeps recent context)
5. **Custom** - Specify any number of days

**To change threshold after setup**:
1. Edit `docs/00-meta/agileflow-metadata.json`:
   ```bash
   # Update threshold to 7 days
   jq '.archival.threshold_days = 7 | .updated = "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'"' docs/00-meta/agileflow-metadata.json > tmp.json && mv tmp.json docs/00-meta/agileflow-metadata.json
   ```
2. Changes take effect immediately (no restart needed)
3. Next SessionStart will use new threshold

### Manual Archival

**Run archival manually anytime**:
```bash
# Archive stories completed >7 days ago
bash scripts/archive-completed-stories.sh 7

# Archive stories completed >30 days ago
bash scripts/archive-completed-stories.sh 30
```

**Output Example**:
```
📦 AgileFlow Story Archival
   Threshold: 7 days
   Cutoff Date: 2025-10-23T00:00:00Z

📊 Current status.json: 150 stories

📦 Archiving 105 completed stories older than 7 days...

Stories to archive:
   • US-0001: User Login API (completed: 2025-10-15)
   • US-0002: Password Reset (completed: 2025-10-16)
   ... and 103 more

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

### Troubleshooting

**If agents fail with "file too large" error**:
1. Run manual archival: `bash scripts/archive-completed-stories.sh 7`
2. Reduce threshold in `docs/00-meta/agileflow-metadata.json` (e.g., 3 days instead of 30)
3. Verify auto-archival hook exists in `.claude/settings.json`
4. Check file sizes: `ls -lh docs/09-agents/status*.json`

**To restore archived story to active**:
```bash
# 1. Find story in archive
jq '.stories["US-0042"]' docs/09-agents/status-archive.json

# 2. Copy story object

# 3. Add to status.json
jq '.stories["US-0042"] = <COPIED_OBJECT>' docs/09-agents/status.json > tmp.json && mv tmp.json docs/09-agents/status.json

# 4. Update story status if needed
```

**To view archived stories**:
```bash
# List all archived stories
jq '.stories | keys[]' docs/09-agents/status-archive.json

# View specific archived story
jq '.stories["US-0042"]' docs/09-agents/status-archive.json

# Count archived stories
jq '.stories | length' docs/09-agents/status-archive.json
```

### Integration with Hooks System

- Auto-archival uses the hooks system (v2.19.0+)
- Hook added automatically during `/AgileFlow:setup` if enabled
- Runs silently in background on every SessionStart
- No user interruption or prompts during normal usage
- Reads threshold from `docs/00-meta/agileflow-metadata.json` automatically

### Benefits

1. **Prevents agent failures** - Keeps status.json under 25k token limit
2. **Improves performance** - Agents read smaller files faster
3. **Maintains history** - Nothing deleted, full audit trail in archive
4. **Automatic** - Runs on SessionStart, no manual intervention
5. **Configurable** - Users choose threshold (3/7/14/30+ days)
6. **Transparent** - Runs silently in background
7. **Safe** - Creates backups before modifying files

### Setup

Auto-archival is configured automatically by `/AgileFlow:setup` when the hooks system is enabled. The setup process:
1. Asks user for archival threshold preference (3/7/14/30/custom days)
2. Stores preference in `docs/00-meta/agileflow-metadata.json` (team-wide config)
3. Copies `archive-completed-stories.sh` script from plugin to project
4. Adds SessionStart hook to `hooks/hooks.json`
5. Updates project's CLAUDE.md with archival documentation

No additional setup required - works automatically after `/AgileFlow:setup` completes!

## Status.json Compression (v2.20.0+)

AgileFlow includes a compression command to reduce status.json file size when archival alone isn't enough.

### The Problem

**Even with archival, status.json can still exceed 25000 tokens**:
- Archival moves completed stories >N days old to archive
- But status.json can still bloat from verbose story objects
- Story objects may contain full description, architectureContext, devAgentRecord, etc.
- status.json should be a **lightweight tracking index**, not a content store

### The Solution

**/AgileFlow:compress - Strip Verbose Fields**:
- Removes description, acceptanceCriteria, architectureContext, technicalNotes, testingStrategy, devAgentRecord, previousStoryInsights
- Keeps ONLY essential tracking metadata: story_id, epic, title, owner, status, estimate, created/updated timestamps, dependencies, branch, summary
- Full story content remains in `docs/06-stories/` markdown files (no data loss)
- Typical result: 80-90% size reduction

### When to Use

**Run compression when**:
- status.json exceeds 25000 tokens despite archival
- Agents fail with "file content exceeds maximum allowed tokens"
- status.json contains verbose story objects from external tools/imports

**Recommended workflow**:
1. First run archival: `bash scripts/archive-completed-stories.sh 3` (move old stories to archive)
2. If still too large, run compression: `bash scripts/compress-status.sh` (strip verbose fields)
3. Result: status.json under 25000 tokens

### Command Usage

```bash
/AgileFlow:compress
```

**Output example**:
```
🗜️  AgileFlow Status Compression

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

### What Gets Removed vs. Kept

**Removed from status.json** (stored in story markdown files):
- description
- acceptanceCriteria
- architectureContext (6 subsections)
- technicalNotes
- testingStrategy
- devAgentRecord (6 subsections)
- previousStoryInsights
- Any other verbose fields

**Kept in status.json** (essential tracking metadata):
- story_id, epic, title, owner, status, estimate
- created, updated, completed_at timestamps
- dependencies, branch, summary, last_update, assigned_at

### Safety & Reversibility

**Backups**:
- Original saved to `docs/09-agents/status.json.backup`
- Restore anytime: `cp docs/09-agents/status.json.backup docs/09-agents/status.json`

**No Data Loss**:
- Full story content remains in `docs/06-stories/EP-XXXX/US-XXXX-*.md` files
- Only status.json tracking index is compressed
- Story markdown files are NOT modified

### Archival vs. Compression

| Feature | Archival | Compression |
|---------|----------|-------------|
| **Purpose** | Move old completed stories to archive | Strip verbose fields from story objects |
| **What it removes** | Completed stories >N days old | Verbose content fields from all stories |
| **Command** | `bash scripts/archive-completed-stories.sh` | `bash scripts/compress-status.sh` |
| **When to use** | Too many completed stories in status.json | Story objects are too verbose |
| **Automatic** | Yes (SessionStart hook) | No (manual command) |
| **Typical savings** | 50-70% (depends on threshold) | 80-90% (removes content fields) |

**Best practice**: Use BOTH for maximum efficiency:
1. Archival (automatic) - Keeps only active + recent stories
2. Compression (manual) - Strips verbose fields when needed

## Story Template Structure (v2.16.0+)

Stories in `docs/06-stories/` now follow enhanced template with improved patterns. Key sections:

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

**Architecture Context** (NEW)
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

## Development Workflow (Enhanced)

When implementing a story:

### 1. Validate Story Before Starting
```bash
/AgileFlow:story-validate US-XXXX
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
- **ALWAYS PUSH AFTER COMMITTING**: `git push origin main` (marketplace reads from GitHub)
- **NO AI ATTRIBUTION**: See "🚫 CRITICAL: NO AI ATTRIBUTION IN COMMITS" section at top of this file

**Never commit**:
- `.env` (gitignored - contains actual secrets/tokens)

**Critical reminder**: The plugin marketplace fetches from GitHub, not local files. If you don't push, users won't see your changes!

## Key Principles for v2.16.0+

### Architecture Context is Self-Contained
- **Dev agents should NEVER need to read full architecture docs**
- Everything needed is extracted into the story's Architecture Context section
- If something is missing, it means the story wasn't properly prepared (run `/story-validate`)
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
- Always run `/story-validate` before assigning story to dev agent
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
