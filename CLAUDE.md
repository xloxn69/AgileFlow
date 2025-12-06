# CLAUDE.md

AgileFlow plugin guidance for Claude Code (claude.ai/code).

---

## 🚫 CRITICAL POLICIES

### NO AI ATTRIBUTION IN COMMITS
**NEVER add AI attribution to commits in this repository.**

❌ **Forbidden**: AI footers, Co-Authored-By lines, AI mentions in messages, any AI metadata
✅ **Required**: Clean human-authored commits, standard Conventional Commits format

**Examples**:
```
# WRONG
feat: add new command
🤖 Generated with Claude Code

# CORRECT
feat: add new command
Added /AgileFlow:compress to reduce status.json size by stripping verbose fields.
```

### NO SOURCE ATTRIBUTION
**NEVER mention source repositories when implementing features.**

❌ **Forbidden**: Repo attribution, GitHub URLs, author attribution, credit comments
✅ **Required**: Describe the FEATURE, not the SOURCE

### Version Management
**ALWAYS update these 3 files together for ANY release:**
1. `.claude-plugin/plugin.json` → `"version": "X.Y.Z"`
2. `.claude-plugin/marketplace.json` → `"description"` (mentions version)
3. `CHANGELOG.md` → Add `[X.Y.Z]` section at top

**ALWAYS PUSH TO GITHUB IMMEDIATELY** - Marketplace reads from GitHub, not local files.

---

## Repository Overview

**AgileFlow**: Claude Code plugin providing universal agile/docs-as-code system.
- **Type**: Command pack
- **Current Version**: v2.27.0 (41 commands + 26 specialized agents + 23 refactored skills)
- **No build step, runtime, or deployment process**

---

## Policies

### Command Safety
- **Slash commands**: Autonomous (no asking)
- **File operations**: Require diff + YES/NO confirmation, keep JSON valid
- **Shell operations**: Safe commands autonomous, dangerous require confirmation

### Test Coverage
- **Global**: 80% overall, 100% critical paths
- **Component**: Unit 80%+, Integration 60%+, E2E 30%+
- **New code**: Aim for 90%+
- **CI**: Fails if <80%

---

## Architecture

### Structure
```
AgileFlow/
├── .claude-plugin/          # plugin.json, marketplace.json
├── commands/                # 41 slash commands (*.md, auto-discovered)
├── agents/                  # 26 subagents (*.md, auto-discovered)
├── skills/                  # 23 skills (*/SKILL.md, auto-discovered)
├── scripts/                 # Helper scripts (get-env.js, archive, compress)
├── templates/               # Document templates
├── CHANGELOG.md
└── README.md
```

### Key Concepts
- **Slash Commands**: Stateless actions in `commands/*.md`, auto-discovered
- **Subagents**: Specialized agents in `agents/*.md` with YAML frontmatter, auto-discovered
- **Skills**: Auto-loaded from `skills/*/SKILL.md`, auto-discovered
- **AgileFlow System**: Created by `/AgileFlow:setup` in user projects (NOT this repo)

### Critical Files
- **plugin.json**: Version is single source of truth, auto-discovers commands/agents/skills
- **marketplace.json**: Must sync with plugin.json version
- **CHANGELOG.md**: Keep a Changelog format, matches plugin.json version

---

## Architecture Context & Knowledge Transfer (v2.16.0+)

### Architecture Context Extraction
Epic Planner extracts relevant sections from `docs/04-architecture/` into story's "Architecture Context" (6 subsections: Data Models, API Specs, Components, File Locations, Testing, Constraints). Every detail cites source: `[Source: architecture/file.md#section]`.

**Benefits**: Dev agents get self-contained context, no reading massive docs, verifiable decisions.

### Dev Agent Record (Knowledge Transfer)
Populated during implementation with 6 subsections: Agent Model & Version, Completion Notes, Issues Encountered, Lessons Learned, Files Modified, Debug References. Used to transfer knowledge to next stories in epic.

### Previous Story Insights (Epic Flow)
Story US-0001 completes → Dev Agent Record → Story US-0002 created with US-0001's lessons in "Previous Story Insights" → Knowledge flows: US-0001 → US-0002 → US-0003

### Story Validation
`/AgileFlow:story-validate US-XXXX` validates: required sections present, Architecture Context populated with citations, AC testable (Given/When/Then), completeness, Previous Story Insights relevance.

---

## Common Workflows

### Epic Creation with Architecture Context
```
User: "Build user auth" → /AgileFlow:epic-new → Epic Planner creates EP-XXXX
→ Breaks into stories (US-0001, US-0002, etc.)
→ Extract architecture context from docs/04-architecture/
→ Cite sources → Populate Architecture Context → Create test stubs
→ Stories status = "ready"
```

### Story Implementation
```
1. Validate: /AgileFlow:story-validate US-XXXX
2. Read: Story's Architecture Context (NOT full docs)
3. Check: Previous Story Insights (if not first in epic)
4. Implement: Architecture Context is single source of truth
5. Record: Populate Dev Agent Record during work
6. Next Story: Lessons flow to next story automatically
```

---

## Development Tasks

### Updating Plugin Version (v2.3.1 → v2.3.2)
```bash
# 1. Edit 3 files
.claude-plugin/plugin.json       # "version": "2.3.2"
.claude-plugin/marketplace.json  # Update description
CHANGELOG.md                     # Add [2.3.2] section at top

# 2. Commit
git add .claude-plugin/plugin.json .claude-plugin/marketplace.json CHANGELOG.md
git commit -m "chore: bump version to v2.3.2"

# 3. Push immediately (CRITICAL)
git push origin main

# 4. Verify
grep -n "2.3.2" .claude-plugin/plugin.json .claude-plugin/marketplace.json CHANGELOG.md

# 5. Validate (CRITICAL)
bash scripts/validate-plugin.sh
```

### Creating GitHub Releases (v2.23.0+)

**CRITICAL POLICY**: Create a GitHub release for EVERY significant update (new features, major improvements, multi-phase work).

**WHEN TO CREATE RELEASES**:
- ✅ After completing an entire phase/feature (e.g., "Phase 3 complete" not "Phase 3 started")
- ✅ After all files updated (version bumped, CHANGELOG updated, README updated, validation passed, committed, pushed)
- ✅ When the work is FULLY DONE and documented
- ❌ NOT before completing all steps
- ❌ NOT while work is in progress
- ❌ NOT without updating README.md with new features

**RELEASE TITLE SPECIFICITY**:
- ✅ **GOOD**: "Release v2.26.0 - Session Harness Phase 3 (Dev Agent Integration)"
- ✅ **GOOD**: "Release v2.24.0 - Session Harness Phase 1 (Foundation)"
- ❌ **BAD**: "Release v2.26.0 - Session Harness System" (too generic, doesn't say what was completed)
- ❌ **BAD**: "Release v2.26.0 - Implemented Session Harness" (vague, no phase context)

**Be specific about what was ACTUALLY completed in THIS release**, not the whole feature/system.

**Manual Release Process**:
```bash
# 1. ONLY run this AFTER all work is complete:
#    - Version bumped in 3 files (plugin.json, marketplace.json, README.md)
#    - CHANGELOG.md updated with detailed entry
#    - README.md updated with new feature documentation
#    - Validation passed (bash scripts/validate-plugin.sh)
#    - Changes committed and pushed to GitHub

# 2. Create and push git tag
git tag -a v2.26.0 -m "Release v2.26.0 - Session Harness Phase 3 (Dev Agent Integration)"
git push origin v2.26.0

# 3. Extract changelog notes for this version
awk '/## \[2.26.0\]/,/## \[2.25.0\]/ {if (/## \[2.25.0\]/) exit; print}' CHANGELOG.md > /tmp/v2.26.0-notes.txt

# 4. Create GitHub release with specific title
gh release create v2.26.0 \
  --title "Release v2.26.0 - Session Harness Phase 3 (Dev Agent Integration)" \
  --notes-file /tmp/v2.26.0-notes.txt \
  --latest
```

**Automated**: GitHub Actions → Run "Release Pipeline" workflow → Enter version

**Example Complete Workflow** (Session Harness Phase 3):
```bash
# Step 1: Complete all implementation work (18 agents updated, babysit updated)
# Step 2: Update version in 3 files
# Step 3: Write detailed CHANGELOG.md entry
# Step 4: Add feature documentation to README.md
# Step 5: Run validation
bash scripts/validate-plugin.sh
# Step 6: Commit and push
git add -A
git commit -m "feat: complete session harness phase 3 (dev agent integration)"
git push origin main
# Step 7: Update README.md with session harness system documentation
git add README.md
git commit -m "docs: add session harness system section to README"
git push origin main
# Step 8: NOW create the release (all work is done)
git tag -a v2.26.0 -m "Release v2.26.0 - Session Harness Phase 3 (Dev Agent Integration)"
git push origin v2.26.0
awk '/## \[2.26.0\]/,/## \[2.25.0\]/ {if (/## \[2.25.0\]/) exit; print}' CHANGELOG.md > /tmp/v2.26.0-notes.txt
gh release create v2.26.0 --title "Release v2.26.0 - Session Harness Phase 3 (Dev Agent Integration)" --notes-file /tmp/v2.26.0-notes.txt --latest
```

**Release Checklist**:
- [ ] All implementation work complete
- [ ] Version bumped in plugin.json, marketplace.json, README.md
- [ ] CHANGELOG.md updated with detailed entry
- [ ] README.md updated with new feature documentation
- [ ] Validation passed (bash scripts/validate-plugin.sh)
- [ ] All changes committed and pushed to GitHub
- [ ] Release title is SPECIFIC about what was completed in THIS version
- [ ] Git tag created and pushed
- [ ] GitHub release created with extracted changelog notes

### Adding New Command
1. Create `commands/new-command.md` (auto-discovered)
2. Add frontmatter: `description`, `argument-hint`
3. Update README.md
4. Bump version in 3 files, update CHANGELOG

### Adding New Subagent
1. Create `agents/agileflow-newagent.md` (auto-discovered)
2. Add frontmatter: `name`, `description`, `tools`, `model` (haiku/sonnet), `color`
3. Update README.md, SUBAGENTS.md
4. Bump version in 3 files, update CHANGELOG

### Adding New Skill (v2.21.0+)
1. Create `skills/new-skill/SKILL.md` (auto-discovered)
2. Frontmatter: `name`, `description` (<150 chars)
3. Follow minimal structure (see `templates/skill-template.md`): 80-150 lines (simple) or 130-280 lines (complex)
4. Update README.md
5. Bump version in 3 files, update CHANGELOG

**Removed in v2.21.0**: `allowed-tools`, ROLE, OBJECTIVE, INPUTS, FIRST ACTION, OUTPUTS sections

---

## Hooks System (v2.19.0+)

Event-driven automation via `.claude/settings.json` (project-level, committed) and `.claude/settings.local.json` (user-specific, gitignored).

**Events**: SessionStart, UserPromptSubmit, Stop

**Format**:
```json
{
  "hooks": {
    "SessionStart": [{
      "matcher": "",
      "hooks": [{"type": "command", "command": "echo 'AgileFlow loaded'"}]
    }]
  }
}
```

**Dynamic Env Vars**: `scripts/get-env.js` loads from settings.json/settings.local.json
```json
{"env": {"USER_NAME": "Alice"}}
# Usage: $(node scripts/get-env.js USER_NAME 'Default')
```

**Best Practices**: Keep fast, use background jobs (`command &`), log to files, test incrementally

---

## Auto-Archival System (v2.19.4+)

Manages `docs/09-agents/status.json` size to prevent "file too large" errors (>25k tokens).

**Solution**: `status.json` (active work + recent completions) + `status-archive.json` (older completions)

**How**: `scripts/archive-completed-stories.sh N` moves completed stories >N days old to archive. Runs via SessionStart hook (configured during `/AgileFlow:setup`).

**Configuration**: `docs/00-meta/agileflow-metadata.json` → `archival.threshold_days` (3/7/14/30/custom)

**Manual**: `bash scripts/archive-completed-stories.sh 7`

**Troubleshooting**: If agents fail with "file too large", run manual archival, reduce threshold, verify hook exists

---

## Status.json Compression (v2.20.0+)

Reduces status.json size when archival alone isn't enough.

**Command**: `/AgileFlow:compress`

**What it does**: Strips verbose fields (description, AC, architectureContext, devAgentRecord, etc.), keeps tracking metadata (story_id, status, owner, timestamps, dependencies). 80-90% size reduction.

**When to use**: status.json >25000 tokens despite archival, agents fail, verbose imports

**Workflow**: First archival → If still large, compression → Result: <25000 tokens

**Safety**: Backup saved to `status.json.backup`, full content remains in `docs/06-stories/` markdown files

**Archival vs Compression**:
- **Archival**: Move old completed stories (50-70% savings, automatic)
- **Compression**: Strip verbose fields (80-90% savings, manual)
- **Best practice**: Use BOTH

---

## Session Harness System (v2.24.0+)

Ensures test verification and session continuity for long-running projects. Inspired by Anthropic's engineering practices for maintaining progress across multiple context windows.

### Core Problem Solved
Without verification, agents can:
- Break existing functionality without noticing
- Claim features work when they don't
- Lose context between sessions
- Mark incomplete work as finished

### Solution: Test Verification + Session State

**Test Status Tracking**: Every story tracks whether tests pass/fail
**Session State**: Structured handoff between sessions
**Environment Init**: Standardized setup for consistency

### Data Model

**Story frontmatter additions** (optional fields):
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
  agents_involved: ["agileflow-ui", "agileflow-api"]
```

**Environment configuration** (`docs/00-meta/environment.json`):
```json
{
  "project_type": "nodejs",
  "init_script": "./docs/00-meta/init.sh",
  "test_command": "npm test",
  "test_timeout_ms": 60000,
  "verification_policy": "warn",
  "baseline_commit": "abc123",
  "baseline_established": "2025-12-01T10:00:00Z"
}
```

**Session state** (`docs/09-agents/session-state.json`):
```json
{
  "current_session": {
    "id": "sess-20251206-100000",
    "started_at": "2025-12-06T10:00:00Z",
    "baseline_verified": true,
    "initial_test_status": "passing",
    "current_story": "US-0042"
  },
  "last_session": {
    "stories_completed": ["US-0041"],
    "final_test_status": "passing"
  }
}
```

### Commands

**`/AgileFlow:verify [story_id]`**: Run tests and update test_status (Phase 1)
- No args: Update all in_progress stories
- With story_id: Update specific story
- Exit code 0 = passing, non-zero = failing
- Parses output for test counts (best effort)

**`/AgileFlow:session-init`**: First-time harness setup (Phase 2)
- Detects project type and test framework
- Creates environment.json, session-state.json, init.sh
- Runs initial test verification
- Creates baseline git tag
- Configures SessionStart hook (optional)

**`/AgileFlow:resume`**: Session startup routine (Phase 2)
- Runs init script (environment setup)
- Verifies tests and detects regressions
- Loads context from previous sessions
- Shows comprehensive session summary
- Auto-runs via SessionStart hook (if enabled)

**`/AgileFlow:baseline [message]`**: Establish known-good state (Phase 2)
- Requires all tests passing
- Creates git tag with baseline marker
- Updates environment.json with baseline commit
- Records in session history
- Used for reset points and regression tracking

### Workflow Integration

**Before Implementation**:
```
1. Check test_status from status.json
2. If failing: Fix or document override
3. If not_run: Run /AgileFlow:verify
4. Proceed only with passing tests (or documented exception)
```

**After Implementation**:
```
1. Run /AgileFlow:verify
2. Update test_status based on results
3. Only mark story "completed" if test_status="passing"
4. Document failures in Dev Agent Record
```

**Session Startup** (when implemented):
```
1. Run init script (environment setup)
2. Run tests (verify baseline)
3. Load context (last completed stories)
4. Show summary (current state, insights)
```

### Verification Policy

**warn** (default): Show test failures, allow override with confirmation
**block**: Require passing tests before proceeding
**skip**: No test verification (not recommended)

Set in `environment.json` → `verification_policy`

### Templates

- `templates/environment.json`: Session harness config
- `templates/session-state.json`: Session tracking
- `templates/init.sh`: Environment initialization script

### Benefits

1. **Prevents Regression**: Can't break existing features without noticing
2. **Context Continuity**: Structured handoff between sessions
3. **Early Failure Detection**: Catch broken tests immediately
4. **Better Handoffs**: Know exactly where you left off
5. **Confidence**: Know the system works before adding more

### Phases

- ✅ **Phase 1 (v2.24.0)**: Test status tracking, /verify command, templates
- ✅ **Phase 2 (v2.25.0)**: Session management, /session-init, /resume, /baseline
- ✅ **Phase 3 (v2.26.0)**: Dev agent integration (18 agents), verification protocols, /babysit integration
- ⏳ **Phase 4 (v2.27.0+)**: Advanced features (test parsing, regression detection, dashboards)

---

## Story Template (v2.16.0+)

### Frontmatter
```yaml
story_id, epic, title, owner, status, estimate, created, updated, dependencies
```

### Sections
- **Description**: What/why
- **Acceptance Criteria**: Given/When/Then (2-5 criteria)
- **Architecture Context** (NEW): 6 subsections extracted by Epic Planner, all with source citations
- **Technical Notes**: Hints, edge cases
- **Testing Strategy**: Points to `docs/07-testing/test-cases/<US_ID>.md`
- **Dependencies**: Other stories
- **Dev Agent Record** (NEW): 6 subsections for knowledge transfer
- **Previous Story Insights** (NEW): Lessons from previous story in epic

**Example**: `examples/story-example.md`

---

## Development Workflow

### Implementation Steps
1. **Validate**: `/AgileFlow:story-validate US-XXXX` (check Architecture Context, AC, sections)
2. **Read**: Story's Architecture Context (NOT full docs)
3. **Check**: Previous Story Insights (if not first in epic)
4. **Implement**: Architecture Context = single source of truth
5. **Record**: Populate Dev Agent Record (model, notes, issues, lessons, files, debug refs)
6. **Flow**: Lessons automatically flow to next story

---

## Documentation Standards

### Command Format
Markdown with heading, description, prompt, examples, technical notes

### Subagent Format
Markdown with YAML frontmatter, role, objective, knowledge sources, constraints, quality checklist, communication protocols

### Version Updates
Keep a Changelog format, categories (Added/Changed/Fixed/Improved/Technical), ISO dates, detailed context

---

## Git Workflow

**Branches**: `main` (stable), feature branches

**Commits**: Conventional Commits, NO AI ATTRIBUTION, ALWAYS PUSH AFTER COMMITTING

**Never commit**: `.env`

---

## Key Principles (v2.16.0+)

### Architecture Context is Self-Contained
Dev agents NEVER read full architecture docs. Everything in story's Architecture Context. Missing details = incomplete story (run `/story-validate`).

### Source Citations are Mandatory
Every detail cites source: `[Source: architecture/file.md#section]`. Sources must be real files. Never invent details.

### Knowledge Flows Through Epics
US-0001 completes → Dev Agent Record → US-0002 includes lessons → US-0003 learns from both. Learning loop.

### Story Validation is Essential
Run `/story-validate` before dev agent assignment. Catches issues early (missing context, unclear AC, structure problems).

### Dev Agent Record is for Knowledge Transfer
Populated DURING implementation. Lessons Learned for NEXT story (not just docs). Next story automatically benefits.

---

## Important Notes

### This is a Plugin, Not an Application
- No package.json, build process, tests, runtime
- Markdown files are source and distribution
- Commands execute within Claude Code context

### User Projects vs Plugin Repository
Plugin creates structure in user projects (`docs/` directories). This repo only contains command/subagent/skill definitions and templates.

### Version Sync is Critical
3 files must match: `plugin.json`, `marketplace.json`, `CHANGELOG.md`. Update all in same commit.
