# AgileFlow

[![npm version](https://img.shields.io/npm/v/%40xloxn69%2Fagileflow?color=brightgreen)](https://www.npmjs.com/package/@xloxn69/agileflow)
[![Commands](https://img.shields.io/badge/commands-41-blue)](#commands)
[![Subagents](https://img.shields.io/badge/subagents-26-orange)](SUBAGENTS.md)
[![Skills](https://img.shields.io/badge/skills-23-purple)](#skills)

**AI-driven agile development for Claude Code, Cursor, Windsurf, and more.** Combining Scrum, Kanban, ADRs, and docs-as-code principles into one framework-agnostic system.

## Quick Start

### Installation

```bash
npx @xloxn69/agileflow install
```

This will:
1. Prompt you to select your IDE(s) (Claude Code, Cursor, Windsurf)
2. Install AgileFlow core (41 commands, 26 agents, 23 skills)
3. Configure your selected IDEs

### CLI Commands

```bash
npx @xloxn69/agileflow install     # Install to project
npx @xloxn69/agileflow status      # Check installation + updates
npx @xloxn69/agileflow update      # Update to latest version
npx @xloxn69/agileflow doctor      # Diagnose issues
npx @xloxn69/agileflow uninstall   # Remove from project
```

### After Installation

**Initialize the system:**
```
/AgileFlow:setup
```
Scaffolds docs structure, templates, and optional CI configuration.

**Get help:**
```
/AgileFlow:help
```
View system overview and available commands.

**Use the mentor (recommended):**
```
Use the agileflow-mentor subagent to guide me through implementing <feature>
```
Interactive mentor guides you through epic/story creation, implementation, and PR preparation.

### Supported IDEs

| IDE | Status | Config Location |
|-----|--------|-----------------|
| Claude Code | ✅ Supported | `.claude/commands/agileflow/` |
| Cursor | ✅ Supported | `.cursor/rules/agileflow/` |
| Windsurf | ✅ Supported | `.windsurf/workflows/agileflow/` |

## Why AgileFlow?

AgileFlow combines three proven methodologies:

- **Agile (Scrum/Kanban)** - Break work into Epics → Stories → Acceptance Criteria with WIP limits
- **ADRs** - Record architectural decisions so future teams don't re-debate
- **Docs-as-Code** - Humans and AI agents coordinate via versioned files (traceable, reviewable, automatable)

**Key Benefits:**
- Clear priorities and testable increments
- Durable memory and decision history
- Effortless multi-agent collaboration via message bus
- Works with any tech stack or framework

<details>
<summary><strong>📁 Folder Structure</strong> (click to expand)</summary>

After running `/AgileFlow:setup`:

```
docs/
  00-meta/             # Templates, glossary, conventions
  01-brainstorming/    # Ideas and sketches
  02-practices/        # Testing, git, CI, security practices
    prompts/agents/    # Agent profiles and contracts
  03-decisions/        # ADRs (Architecture Decision Records)
  04-architecture/     # Architecture documentation
  05-epics/            # Epic definitions
  06-stories/          # User stories (grouped by epic)
  07-testing/          # Test cases and acceptance criteria
  08-project/          # Roadmap, backlog, milestones, risks
  09-agents/           # Agent status and message bus
    bus/log.jsonl      # Agent communication log
    status.json        # Current story statuses
  10-research/         # Saved research notes
  context.md           # One-page context brief for web AI tools
```

</details>

<details>
<summary><strong>📚 Commands</strong> (41 total - click to expand)</summary>

### Core Workflow
- `/AgileFlow:setup` - Bootstrap the entire system
- `/AgileFlow:help` - Display system overview
- `/AgileFlow:babysit` - Interactive mentor for end-to-end implementation

### Planning & Structure
- `/AgileFlow:epic` - Create a new epic
- `/AgileFlow:story` - Create a user story with acceptance criteria
- `/AgileFlow:story-validate` - Validate story completeness before development
- `/AgileFlow:sprint` - Data-driven sprint planning with velocity forecasting
- `/AgileFlow:adr` - Create an Architecture Decision Record
- `/AgileFlow:agent` - Onboard a new agent

### Task Management
- `/AgileFlow:assign` - Assign/reassign a story
- `/AgileFlow:status` - Update story status
- `/AgileFlow:handoff` - Document handoff between agents

### Quality & CI
- `/AgileFlow:pr` - Generate PR description
- `/AgileFlow:ci` - Bootstrap CI workflow
- `/AgileFlow:readme-sync` - Sync folder READMEs
- `/AgileFlow:tests` - Automated testing infrastructure setup
- `/AgileFlow:review` - AI-powered code review
- `/AgileFlow:verify` - Run tests and update story test status (Session Harness)
- `/AgileFlow:session-init` - Initialize session harness with test verification (Phase 2)
- `/AgileFlow:resume` - Resume session with environment verification and context (Phase 2)
- `/AgileFlow:baseline` - Mark current state as verified baseline (Phase 2)
- `/AgileFlow:compress` - Compress status.json (fixes token limit issues)

### Automation & DevOps
- `/AgileFlow:packages` - Manage dependencies (dashboard, updates, security audits)
- `/AgileFlow:docs` - Synchronize docs with code changes
- `/AgileFlow:impact` - Analyze change impact on codebase
- `/AgileFlow:debt` - Track and prioritize technical debt
- `/AgileFlow:deploy` - Automated deployment pipeline setup
- `/AgileFlow:changelog` - Auto-generate changelog from commits
- `/AgileFlow:auto` - Generate stories from PRDs/mockups/specs
- `/AgileFlow:template` - Create and manage custom templates
- `/AgileFlow:feedback` - Collect feedback for continuous improvement
- `/AgileFlow:update` - Generate stakeholder reports

### Visualization & Analytics
- `/AgileFlow:board` - Visual kanban board with WIP limits
- `/AgileFlow:blockers` - Comprehensive blocker tracking with resolution suggestions
- `/AgileFlow:velocity` - Velocity tracking and forecasting
- `/AgileFlow:metrics` - Analytics dashboard (cycle time, lead time, throughput, flow efficiency)
- `/AgileFlow:retro` - Automated retrospective generator with insights
- `/AgileFlow:deps` - Dependency graph visualization with critical path detection

### Web AI Integration
- `/AgileFlow:context` - Generate/export/manage context for web AI tools (ChatGPT, Perplexity, Gemini, Claude, etc.)
- `/AgileFlow:research` - Save research notes

</details>

<details>
<summary><strong>🤖 Subagents</strong> (27 specialized agents - click to expand)</summary>

AgileFlow includes **27 specialized subagents** that operate in separate context windows for focused work. See [SUBAGENTS.md](SUBAGENTS.md) for complete documentation.

### Core Implementation Agents

**`agileflow-ui`** - UI/Presentation Layer Specialist
- Front-end components, styling, theming, accessibility (WCAG 2.1 AA)
- Invocation: "Use the agileflow-ui subagent to implement this UI feature"

**`agileflow-api`** - Services/Data Layer Specialist
- Backend APIs, business logic, data models, API tests
- Invocation: "Use the agileflow-api subagent to implement this API endpoint"

**`agileflow-ci`** - CI/CD & Quality Specialist
- CI/CD pipelines, linting, type checking, test coverage
- Invocation: "Use the agileflow-ci subagent to set up the test pipeline"

### Orchestration & Planning Agents

**`agileflow-mentor`** - End-to-End Implementation Mentor
- Guides feature implementation from idea to PR
- Invocation: "Use the agileflow-mentor subagent to guide me through this feature"

**`agileflow-epic-planner`** - Epic & Story Planning Specialist
- Breaks down features into epics and stories with acceptance criteria
- Invocation: "Use the agileflow-epic-planner subagent to plan this feature"

**`agileflow-adr-writer`** - Architecture Decision Record Specialist
- Documents technical decisions, trade-offs, alternatives
- Invocation: "Use the agileflow-adr-writer subagent to document this decision"

**`agileflow-research`** - Research & Knowledge Management Specialist
- Conducts technical research, builds research prompts, saves notes
- Invocation: "Use the agileflow-research subagent to research authentication approaches"

### Additional Specialized Agents
- `agileflow-devops` - DevOps & Automation
- `agileflow-security` - Security & Compliance
- `agileflow-database` - Database & Data Layer
- `agileflow-testing` - Testing & QA Automation
- `agileflow-product` - Product Management & Prioritization
- `agileflow-performance` - Performance Optimization
- `agileflow-mobile` - Mobile Development
- `agileflow-integrations` - Third-Party Integrations
- `agileflow-refactor` - Code Refactoring & Technical Debt
- `agileflow-design` - Design Systems & UI/UX
- `agileflow-accessibility` - Accessibility Compliance (WCAG)
- `agileflow-analytics` - Analytics & Metrics Implementation
- `agileflow-data-migration` - Data Migration & ETL
- `agileflow-qa` - Quality Assurance & Test Planning
- And more...

**When to Use Subagents:**
- Complex, multi-step implementation work
- Specialized tasks requiring focused expertise
- Work benefiting from separate context
- Tasks needing to run commands or write code

**When to Use Commands:**
- Quick, single-purpose actions
- Status updates and assignments
- Generating templates or prompts
- Simple file operations

</details>

<details>
<summary><strong>🎯 Skills</strong> (23 auto-loaded skills - click to expand)</summary>

Skills are **context-aware helpers** that activate automatically based on keywords (no manual invocation needed).

### How Skills Work
- **Activation:** Automatic (keyword-based detection)
- **Context:** Main conversation
- **Purpose:** Quick enhancements and formatting
- **Structure:** Follow Anthropic's minimal specification (v2.21.0+)

### Skills by Category

#### AgileFlow Skills (8 skills)
Auto-formatted outputs following AgileFlow templates:
- `agileflow-story-writer` - Converts discussions to user stories
- `agileflow-acceptance-criteria` - Generates Given/When/Then AC
- `agileflow-epic-planner` - Breaks features into epics/stories
- `agileflow-sprint-planner` - Plans sprints with velocity
- `agileflow-retro-facilitator` - Structures retrospectives
- `agileflow-adr` - Captures architectural decisions
- `agileflow-commit-messages` - Formats Conventional Commits
- `agileflow-tech-debt` - Tracks technical debt

#### Template Generators (15 skills)
Generate code templates and documentation:
- `story-skeleton` - Story template scaffolding
- `acceptance-criteria-generator` - AC formatting
- `commit-message-formatter` - Git commit messages
- `adr-template` - Architecture decision records
- `api-documentation-generator` - OpenAPI/Swagger docs
- `changelog-entry` - Keep a Changelog format
- `pr-description` - Pull request descriptions
- `test-case-generator` - Test cases from AC
- `type-definitions` - TypeScript interfaces
- `sql-schema-generator` - SQL schemas with migrations
- `error-handler-template` - Error handling patterns
- `diagram-generator` - Mermaid/ASCII diagrams
- `validation-schema-generator` - Joi/Zod/Yup schemas
- `deployment-guide-generator` - Deployment runbooks
- `migration-checklist` - Data migration checklists

### Example Activation
```
User: "I need to create a user story for login functionality"
[agileflow-story-writer skill activates automatically]
Claude: Generates formatted story with AC, owner, priority, estimate
```

</details>

<details>
<summary><strong>🎯 Hooks System</strong> (event-driven automation - click to expand)</summary>

AgileFlow supports **event-driven automation** through Claude Code's official hooks system.

### What Are Hooks?

Hooks are automatic triggers that execute commands in response to events:
- **SessionStart** - Runs when Claude Code session starts
- **UserPromptSubmit** - Runs after you submit a prompt
- **Stop** - Runs when Claude stops responding

### Quick Setup

1. **Create .claude directory:**
   ```bash
   mkdir -p .claude
   ```

2. **Copy template:**
   ```bash
   cp templates/claude-settings.example.json .claude/settings.json
   ```

3. **Customize hooks** (edit `.claude/settings.json`):
   ```json
   {
     "hooks": {
       "SessionStart": [{
         "hooks": [{
           "type": "command",
           "command": "echo '🚀 AgileFlow loaded - Type /AgileFlow:help'"
         }]
       }]
     }
   }
   ```

4. **Restart Claude Code**

### Example Use Cases

**Welcome message:**
```json
{
  "SessionStart": [{
    "hooks": [{
      "type": "command",
      "command": "echo '👋 Welcome! Current sprint: $(cat docs/08-project/current-sprint.txt)'"
    }]
  }]
}
```

**Activity logging:**
```json
{
  "UserPromptSubmit": [{
    "hooks": [{
      "type": "command",
      "command": "echo '[LOG] Prompt at $(date)' >> .claude/activity.log"
    }]
  }]
}
```

### Configuration Files
- `.claude/settings.json` - Project-level config (committed to git)
- `.claude/settings.local.json` - User-specific overrides (gitignored)

</details>

<details>
<summary><strong>🔧 Advanced Topics</strong> (click to expand)</summary>

### Daily Workflow

1. **Pick a story** - Use `agileflow-mentor` or check `docs/09-agents/status.json`
2. **Implement to AC** - Follow acceptance criteria
3. **Write tests** - Reference `docs/07-testing/test-cases/<STORY_ID>.md`
4. **Update status** - Use `/AgileFlow:status`
5. **Create PR** - Use `/AgileFlow:pr`
6. **Mark done** - Update status after merge

### Multi-Agent Collaboration

AgileFlow uses a message bus (`docs/09-agents/bus/log.jsonl`) for coordination:
- Agents update `docs/09-agents/status.json` with current work
- Messages logged to bus for async communication
- Use `/AgileFlow:handoff` to transfer work between agents
- WIP limit: max 2 stories per agent

### Git Worktrees for Context Preservation

For advanced users handling urgent hotfixes during feature work:

**Benefits:**
- Preserve AI context when switching tasks
- Handle production bugs without losing feature flow
- Compare implementations side-by-side
- Test risky refactors in isolation

**Quick Start:**
```bash
# Use helper script (created by /AgileFlow:setup)
./docs/00-meta/scripts/worktree-create.sh auth-hotfix

# Open in new window
code ../myapp-auth-hotfix
/AgileFlow:babysit
```

See `docs/00-meta/guides/worktrees.md` for comprehensive guide.

### Web AI Integration

Share context with web AI tools (ChatGPT, Perplexity, Gemini, Claude, etc.):

1. Run `/AgileFlow:context` to generate/refresh context
2. Use `/AgileFlow:context MODE=export` for concise excerpt
3. Paste into web AI tool for research/ideation
4. Use `/AgileFlow:context MODE=research TOPIC="..."` for structured prompts
5. Save results with `/AgileFlow:research`

### Session Harness System (v2.24.0+)

Ensures test verification and session continuity for long-running projects. Prevents agents from breaking functionality and maintains progress across context windows.

**The Problem:**
Without verification, agents can:
- Break existing functionality without noticing
- Claim features work when tests fail
- Lose context between sessions
- Mark incomplete work as finished

**The Solution:**
Session Harness System tracks test status, verifies baselines, and maintains session state.

**Quick Start:**
```bash
# First time setup (interactive)
/AgileFlow:session-init

# Start each session (or auto-run via hook)
/AgileFlow:resume

# Run tests and update test status
/AgileFlow:verify

# Create verified checkpoint
/AgileFlow:baseline "Sprint 12 complete"
```

**How It Works:**
1. **Test Tracking**: Every story has `test_status` field (passing/failing/not_run)
2. **Pre-Implementation**: Agents check test_status before starting work
3. **Post-Implementation**: Agents run `/AgileFlow:verify` before marking complete
4. **Session Resume**: Loads context and detects regressions
5. **Baselines**: Git tags mark known-good states for reset points

**Benefits:**
- **No Broken Baselines**: Agents can't mark stories complete with failing tests
- **Fail Fast**: Catch regressions immediately, not at PR review
- **Context Continuity**: Structured handoff between sessions
- **Regression Detection**: Alerts when tests were passing, now failing

**Agent Integration (v2.26.0):**
All 18 dev agents now include verification protocol:
- agileflow-ui, agileflow-api, agileflow-ci, agileflow-devops
- agileflow-security, agileflow-database, agileflow-testing
- agileflow-performance, agileflow-mobile, agileflow-integrations
- agileflow-refactor, agileflow-design, agileflow-accessibility
- agileflow-analytics, agileflow-datamigration, agileflow-monitoring
- agileflow-compliance, agileflow-qa

**Learn More:** See CLAUDE.md "Session Harness System" section for complete documentation.

### Status.json Compression

Prevent "file too large" errors:

```bash
# Compress status.json (removes verbose fields)
/AgileFlow:compress

# Typical result: 80-90% size reduction
```

Full story content remains in `docs/06-stories/` markdown files (no data loss).

</details>

## Examples

### Creating an Epic with Stories
```
/AgileFlow:epic EPIC=EP-0001 TITLE="User Authentication" OWNER=AG-API GOAL="Secure user login and registration" STORIES="US-0001|Login form|AG-UI,US-0002|Auth API|AG-API"
```

### Working on a Story
```
/AgileFlow:assign STORY=US-0001 NEW_OWNER=AG-UI NEW_STATUS=in-progress NOTE="Starting implementation"
# ... do the work ...
/AgileFlow:status STORY=US-0001 STATUS=in-review SUMMARY="Login form complete with tests" PR=https://github.com/...
```

### Recording a Decision
```
/AgileFlow:adr NUMBER=0001 TITLE="Use JWT for authentication" CONTEXT="Need stateless auth for API" DECISION="JWT with 15min access + refresh tokens" CONSEQUENCES="Simpler scaling but requires token refresh flow"
```

## Templates

All templates are located in `templates/` and `docs/00-meta/templates/`:

- `epic-template.md` - Epic structure
- `story-template.md` - User story format
- `adr-template.md` - Architecture decision record
- `agent-profile-template.md` - Agent profile and contract
- `comms-note-template.md` - Handoff documentation
- `research-template.md` - Research note structure
- `README-template.md` - Folder README template

## Contributing

This plugin is designed to be framework-agnostic. Customize templates and commands to fit your team's workflow.

## License

MIT

## Support

For issues or questions, please visit the [GitHub repository](https://github.com/xloxn69/AgileFlow).
