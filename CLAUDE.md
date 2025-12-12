# CLAUDE.md

AgileFlow CLI package guidance for Claude Code (claude.ai/code).

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
1. `packages/cli/package.json` → `"version": "X.Y.Z"`
2. Root `package.json` → `"version": "X.Y.Z"`
3. `CHANGELOG.md` → Add `[X.Y.Z]` section at top

**CRITICAL WORKFLOW - ALWAYS FOLLOW THESE STEPS IN ORDER:**
1. Commit changes with version update
2. Push to GitHub immediately
3. Create git tag and push
4. Create GitHub release
5. **GitHub Actions automatically publishes to npm** (no manual step needed!)

**Automated npm Publishing**:
- GitHub Action triggers on git tags matching `v*.*.*`
- Workflow: `.github/workflows/npm-publish.yml`
- Automatically publishes to npm when you push a tag
- **No manual npm publish needed** - it's fully automated!

**GitHub Secrets Setup** (One-time):
- Navigate to: https://github.com/projectquestorg/AgileFlow/settings/secrets/actions
- Click "New repository secret"
- Name: `NPM_TOKEN`
- Value: Your npm token (starts with `npm_`)
- This token is encrypted and never exposed in logs

**Manual npm Publishing** (Backup/Testing):
- Local token stored in: `~/.npmrc` (for emergency manual publishes)
- Format: `//registry.npmjs.org/:_authToken=<npm_token>`
- This file persists across sessions and is NOT committed to git

---

## Repository Overview

**AgileFlow**: npm package providing AI-driven agile development system for Claude Code, Cursor, Windsurf, and other AI IDEs.

- **Package**: `agileflow`
- **Type**: npm CLI tool + IDE command pack
- **Current Version**: v2.30.0
- **Distribution**: npm registry
- **Structure**: Monorepo (CLI package + docs + website)

---

## Architecture

### Monorepo Structure
```
AgileFlow/
├── packages/
│   └── cli/                           # Main package (agileflow)
│       ├── package.json               # Package metadata, version
│       ├── src/core/
│       │   ├── commands/              # 41 slash commands (*.md)
│       │   ├── agents/                # 26 specialized agents (*.md)
│       │   ├── skills/                # 23 skills (*/SKILL.md)
│       │   └── templates/             # Document templates
│       ├── scripts/
│       │   └── generators/            # Content generation system
│       │       ├── command-registry.js
│       │       ├── agent-registry.js
│       │       ├── skill-registry.js
│       │       ├── inject-help.js
│       │       ├── inject-babysit.js
│       │       ├── inject-readme.js
│       │       ├── index.js
│       │       └── generate-all.sh
│       └── tools/                     # CLI entry points, installers
│           ├── agileflow-npx.js       # npx entry point
│           ├── postinstall.js         # Auto-setup on npm install
│           └── cli/                   # CLI commands (install, status, update)
├── apps/
│   ├── website/                       # Landing page
│   └── docs/                          # Documentation site (Fumadocs)
├── package.json                       # Root workspace config
├── CHANGELOG.md                       # Version history
└── README.md                          # User-facing docs
```

### Key Concepts
- **Slash Commands**: Stateless actions in `packages/cli/src/core/commands/*.md`
- **Subagents**: Specialized agents in `packages/cli/src/core/agents/*.md` with YAML frontmatter
- **Skills**: Auto-loaded from `packages/cli/src/core/skills/*/SKILL.md`
- **Content Generation**: Frontmatter metadata → Auto-generated docs (v2.30.0+)
- **AgileFlow System**: Created by `/AgileFlow:setup` in user projects (NOT this repo)

### Critical Files
- **packages/cli/package.json**: Package version (single source of truth for npm)
- **Root package.json**: Monorepo version (kept in sync)
- **CHANGELOG.md**: Keep a Changelog format, matches package versions

---

## Development Tasks

### Updating Package Version (2.29.0 → 2.30.0)

```bash
# 1. Edit 3 files (version must match across all)
packages/cli/package.json    # "version": "2.30.0"
package.json                 # "version": "2.30.0" (root monorepo)
CHANGELOG.md                 # Add [2.30.0] section at top

# 2. Run content generators (updates counts, lists)
bash packages/cli/scripts/generate-all.sh

# 3. Verify changes
git diff

# 4. Commit
git add -A
git commit -m "chore: bump version to v2.30.0"

# 5. Push immediately (CRITICAL)
git push origin main
```

### Adding New Command

```bash
# 1. Create command file
cat > packages/cli/src/core/commands/new-command.md << 'EOF'
---
description: Brief description of what this command does
argument-hint: [ARG1] [ARG2] (optional)
---

# /AgileFlow:new-command

[Command implementation details here]
EOF

# 2. Run content generators (auto-updates /help, README)
bash packages/cli/scripts/generate-all.sh

# 3. Bump version in 3 files, update CHANGELOG
# (see "Updating Package Version" above)
```

### Adding New Agent

```bash
# 1. Create agent file (NO agileflow- prefix)
cat > packages/cli/src/core/agents/translator.md << 'EOF'
---
name: translator
description: i18n and localization specialist
tools:
  - Read
  - Write
  - Edit
model: haiku
color: purple
---

# Translator Agent

[Agent implementation details here]
EOF

# 2. Run content generators (auto-updates /babysit, README)
bash packages/cli/scripts/generate-all.sh

# 3. Bump version in 3 files, update CHANGELOG
```

### Adding New Skill

```bash
# 1. Create skill directory and SKILL.md
mkdir -p packages/cli/src/core/skills/new-skill
cat > packages/cli/src/core/skills/new-skill/SKILL.md << 'EOF'
---
name: new-skill
description: Brief description under 150 chars
---

# Skill Implementation

[Skill details here - keep to 80-280 lines total]
EOF

# 2. Run content generators
bash packages/cli/scripts/generate-all.sh

# 3. Bump version in 3 files, update CHANGELOG
```

### Creating GitHub Releases

**CRITICAL POLICY**: Create a GitHub release for EVERY significant update (new features, major improvements, multi-phase work).

**WHEN TO CREATE RELEASES**:
- ✅ After completing an entire phase/feature (e.g., "Phase 3 complete" not "Phase 3 started")
- ✅ After all files updated (version bumped, CHANGELOG updated, README updated, generators run, committed, pushed)
- ✅ When the work is FULLY DONE and documented
- ❌ NOT before completing all steps
- ❌ NOT while work is in progress
- ❌ NOT without updating README.md with new features

**Release Title Specificity**:
- ✅ **GOOD**: "Release v2.30.0 - Content Generation System"
- ✅ **GOOD**: "Release v2.26.0 - Session Harness Phase 3 (Dev Agent Integration)"
- ❌ **BAD**: "Release v2.30.0 - Improvements" (too generic)
- ❌ **BAD**: "Release v2.30.0 - Updates" (vague)

**Release Process**:
```bash
# 1. ONLY run this AFTER all work is complete:
#    - Version bumped in 3 files (2 package.json + CHANGELOG.md)
#    - CHANGELOG.md updated with detailed entry
#    - README.md updated with new feature documentation
#    - Content generators run (bash packages/cli/scripts/generate-all.sh)
#    - Changes committed and pushed to GitHub

# 2. Create and push git tag
git tag -a v2.30.0 -m "Release v2.30.0 - Content Generation System"
git push origin v2.30.0

# 3. Extract changelog notes for this version
awk '/## \[2.30.0\]/,/## \[2.29.0\]/ {if (/## \[2.29.0\]/) exit; print}' CHANGELOG.md > /tmp/v2.30.0-notes.txt

# 4. Create GitHub release
gh release create v2.30.0 \
  --title "Release v2.30.0 - Content Generation System" \
  --notes-file /tmp/v2.30.0-notes.txt \
  --latest

# 5. GitHub Actions automatically publishes to npm
# No manual step needed! Just wait for the action to complete.
# Monitor at: https://github.com/projectquestorg/AgileFlow/actions
```

**Release Checklist**:
- [ ] All implementation work complete
- [ ] Version bumped in packages/cli/package.json, root package.json, CHANGELOG.md
- [ ] CHANGELOG.md updated with detailed entry
- [ ] README.md updated with new feature documentation
- [ ] Content generators run (generate-all.sh)
- [ ] All changes committed and pushed to GitHub
- [ ] Release title is SPECIFIC about what was completed in THIS version
- [ ] Git tag created and pushed
- [ ] GitHub release created with extracted changelog notes
- [ ] **Wait for GitHub Actions to publish to npm** (automatic - check Actions tab)
- [ ] Verify publish: `npm view agileflow version`

---

## Content Generation System (v2.30.0+)

AgileFlow uses a **content generation system** to keep plugin files synchronized with metadata from frontmatter. This eliminates manual sync debt when adding/removing/renaming commands, agents, or skills.

### Problem Solved
- Manual sync: Add command → Update /babysit → Update /help → Update README → Easy to forget
- Duplication: Agent list appears in multiple files, all must stay in sync
- Human error: Forget to update counts, descriptions, tool lists

### Solution
Single source of truth (frontmatter) → Auto-generate content

### Architecture
```
packages/cli/scripts/generators/
├── command-registry.js   # Scans commands/, extracts metadata
├── agent-registry.js     # Scans agents/, extracts metadata
├── skill-registry.js     # Scans skills/, extracts metadata
├── inject-help.js        # Generates command list for /help
├── inject-babysit.js     # Generates agent list for /babysit
├── inject-readme.js      # Generates stats/tables for README
├── index.js              # Orchestrator (runs all generators)
└── generate-all.sh       # Shell wrapper
```

### How It Works
1. Scanners read frontmatter from all commands/agents/skills
2. Generators create formatted content (tables, lists, stats)
3. Content injected between `<!-- AUTOGEN:NAME:START/END -->` markers
4. Original files updated in-place

### Usage
```bash
# Regenerate all content
bash packages/cli/scripts/generate-all.sh

# Or run specific generator
node packages/cli/scripts/generators/inject-help.js
```

### When to Run
- After adding/removing commands, agents, or skills
- After changing command/agent descriptions
- After changing tool lists or models
- Before committing changes

### AUTOGEN Markers
- `packages/cli/src/core/commands/help.md` → `<!-- AUTOGEN:COMMAND_LIST:START/END -->`
- `packages/cli/src/core/commands/babysit.md` → `<!-- AUTOGEN:AGENT_LIST:START/END -->`
- `README.md` → `<!-- AUTOGEN:STATS:START/END -->`

### Benefits
- **Zero sync debt**: Frontmatter is single source of truth
- **Automatic updates**: Command counts, agent lists always current
- **Less manual work**: No more updating 5 files for one change
- **Consistent formatting**: Generated content follows templates

### Developer Notes
- Do NOT manually edit content between AUTOGEN markers
- ALWAYS regenerate after metadata changes
- Markers are added automatically by generators if missing

---

## User Project Systems

The following sections describe systems that AgileFlow creates in **user projects** (not this repository). These are created when users run `/AgileFlow:setup` in their own codebases.

### Hooks System (v2.19.0+)

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

**Best Practices**: Keep fast, use background jobs (`command &`), log to files, test incrementally

### Auto-Archival System (v2.19.4+)

Manages `docs/09-agents/status.json` size to prevent "file too large" errors (>25k tokens).

**Solution**: `status.json` (active work + recent completions) + `status-archive.json` (older completions)

**Configuration**: `docs/00-meta/agileflow-metadata.json` → `archival.threshold_days` (3/7/14/30/custom)

### Status.json Compression (v2.20.0+)

**Command**: `/AgileFlow:compress`

**What it does**: Strips verbose fields (description, AC, architectureContext, devAgentRecord, etc.), keeps tracking metadata. 80-90% size reduction.

**Archival vs Compression**:
- **Archival**: Move old completed stories (50-70% savings, automatic)
- **Compression**: Strip verbose fields (80-90% savings, manual)
- **Best practice**: Use BOTH

### Session Harness System (v2.24.0+)

Ensures test verification and session continuity for long-running projects.

**Core Problem**: Without verification, agents can break existing functionality, claim features work when they don't, lose context between sessions.

**Solution**: Test Status Tracking + Session State + Environment Init

**Commands**:
- `/AgileFlow:verify [story_id]` - Run tests and update test_status
- `/AgileFlow:session-init` - First-time harness setup
- `/AgileFlow:resume` - Session startup routine
- `/AgileFlow:baseline [message]` - Establish known-good state

**Phases**:
- ✅ Phase 1 (v2.24.0): Test status tracking, /verify command
- ✅ Phase 2 (v2.25.0): Session management, /session-init, /resume, /baseline
- ✅ Phase 3 (v2.26.0): Dev agent integration (18 agents), verification protocols
- ⏳ Phase 4 (v2.27.0+): Advanced features (test parsing, regression detection, dashboards)

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
User: "Build user auth" → /AgileFlow:epic → Epic Planner creates EP-XXXX
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

## Story Template (v2.16.0+)

### Frontmatter
```yaml
story_id, epic, title, owner, status, estimate, created, updated, dependencies
```

### Sections
- **Description**: What/why
- **Acceptance Criteria**: Given/When/Then (2-5 criteria)
- **Architecture Context**: 6 subsections extracted by Epic Planner, all with source citations
- **Technical Notes**: Hints, edge cases
- **Testing Strategy**: Points to `docs/07-testing/test-cases/<US_ID>.md`
- **Dependencies**: Other stories
- **Dev Agent Record**: 6 subsections for knowledge transfer
- **Previous Story Insights**: Lessons from previous story in epic

---

## Documentation Standards

### Command Format
Markdown with YAML frontmatter (`description`, `argument-hint`), heading, prompt, examples, technical notes

### Agent Format
Markdown with YAML frontmatter (`name`, `description`, `tools`, `model`, `color`), role, objective, knowledge sources, constraints, quality checklist

### Skill Format
Markdown with YAML frontmatter (`name`, `description`), minimal structure (80-280 lines)

### Version Updates
Keep a Changelog format, categories (Added/Changed/Fixed/Improved/Technical), ISO dates, detailed context

---

## Git Workflow

**Branches**: `main` (stable), feature branches

**Commits**: Conventional Commits, NO AI ATTRIBUTION, ALWAYS PUSH AFTER COMMITTING

**Never commit**: `.env`, `.mcp.json`, secrets

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

### This is an npm Package
- **Type**: npm CLI tool + IDE command pack
- **Distribution**: Published to npm as `agileflow`
- **Installation**: `npm install --save-dev agileflow` or `npx agileflow install`
- **Monorepo**: Contains CLI package, docs site, landing page
- **Build**: No build step for CLI (markdown files), build step for docs/website (Next.js)

### Repository vs User Projects
- **This Repository**: Contains CLI tool source code (commands, agents, skills, templates)
- **User Projects**: Where AgileFlow creates `docs/` structure via `/AgileFlow:setup`
- **Separation**: This repo develops the tool, user projects consume the tool

### Version Sync is Critical
3 files must match: `packages/cli/package.json`, root `package.json`, `CHANGELOG.md`. Update all in same commit.

### Content Generation is Automated
After adding/removing/renaming commands/agents/skills, ALWAYS run `bash packages/cli/scripts/generate-all.sh` before committing. This ensures documentation stays synchronized with code.
