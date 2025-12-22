<p align="center">
  <img src="assets/banner.png" alt="AgileFlow" />
</p>

[![npm version](https://img.shields.io/npm/v/agileflow?color=brightgreen)](https://www.npmjs.com/package/agileflow)
[![Commands](https://img.shields.io/badge/commands-41-blue)](#commands)
[![Subagents](https://img.shields.io/badge/subagents-26-orange)](#subagents)
[![Skills](https://img.shields.io/badge/skills-23-purple)](#skills)
[![Experts](https://img.shields.io/badge/experts-26-green)](#agent-expert-system)

**AI-driven agile development for Claude Code, Cursor, Windsurf, and more.** Combining Scrum, Kanban, ADRs, and docs-as-code principles into one framework-agnostic system.

## Quick Start

### Installation

#### Option 1: Global Installation (Recommended)

```bash
npm install -g agileflow
agileflow setup
```

#### Option 2: Project-Level Installation

```bash
npm install agileflow
npx agileflow setup
```

This will:
1. Prompt where to install AgileFlow
2. Prompt to select your IDE(s)
3. Install AgileFlow core (commands, agents, skills)
4. Configure your selected IDEs
5. Create documentation structure

### CLI Commands

**Global installation:**
```bash
agileflow setup       # Set up AgileFlow in project
agileflow status      # Check installation + updates
agileflow update      # Update to latest version
agileflow list        # List installed components
agileflow doctor      # Diagnose issues
agileflow uninstall   # Remove from project
```

**Project-level installation (use `npx`):**
```bash
npx agileflow setup       # Set up AgileFlow in project
npx agileflow status      # Check installation + updates
npx agileflow update      # Update to latest version
npx agileflow list        # List installed components
npx agileflow doctor      # Diagnose issues
npx agileflow uninstall   # Remove from project
```

### After Setup

**Initialize the system:**
```
/agileflow:setup
```
Scaffolds docs structure, templates, and optional CI configuration.

**Get help:**
```
/agileflow:help
```
View system overview and available commands.

**Use the mentor (recommended):**
```
Use the mentor subagent to guide me through implementing <feature>
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

After running `/agileflow:setup`:

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
- `/agileflow:setup` - Bootstrap the entire system
- `/agileflow:help` - Display system overview
- `/agileflow:babysit` - Interactive mentor for end-to-end implementation
- `/agileflow:configure` - Interactive configuration menu for all AgileFlow features
- `/agileflow:diagnose` - System health diagnostics

### Planning & Structure
- `/agileflow:epic` - Create a new epic
- `/agileflow:story` - Create a user story with acceptance criteria
- `/agileflow:story-validate` - Validate story completeness before development
- `/agileflow:sprint` - Data-driven sprint planning with velocity forecasting
- `/agileflow:adr` - Create an Architecture Decision Record
- `/agileflow:agent` - Onboard a new agent

### Task Management
- `/agileflow:assign` - Assign/reassign a story
- `/agileflow:status` - Update story status
- `/agileflow:handoff` - Document handoff between agents

### Quality & CI
- `/agileflow:pr` - Generate PR description
- `/agileflow:ci` - Bootstrap CI workflow
- `/agileflow:readme-sync` - Sync folder READMEs
- `/agileflow:tests` - Automated testing infrastructure setup
- `/agileflow:review` - AI-powered code review
- `/agileflow:verify` - Run tests and update story test status
- `/agileflow:session:init` - Initialize session harness with test verification
- `/agileflow:session:resume` - Resume session with environment verification and context
- `/agileflow:session:status` - View current session state and activity
- `/agileflow:session:end` - Cleanly end session and record summary
- `/agileflow:session:history` - View past session history and metrics
- `/agileflow:baseline` - Mark current state as verified baseline
- `/agileflow:compress` - Compress status.json (fixes token limit issues)

### Automation & DevOps
- `/agileflow:packages` - Manage dependencies (dashboard, updates, security audits)
- `/agileflow:docs` - Synchronize docs with code changes
- `/agileflow:impact` - Analyze change impact on codebase
- `/agileflow:debt` - Track and prioritize technical debt
- `/agileflow:deploy` - Automated deployment pipeline setup
- `/agileflow:changelog` - Auto-generate changelog from commits
- `/agileflow:auto` - Generate stories from PRDs/mockups/specs
- `/agileflow:template` - Create and manage custom templates
- `/agileflow:feedback` - Collect feedback for continuous improvement
- `/agileflow:update` - Generate stakeholder reports

### Visualization & Analytics
- `/agileflow:board` - Visual kanban board with WIP limits
- `/agileflow:blockers` - Comprehensive blocker tracking with resolution suggestions
- `/agileflow:velocity` - Velocity tracking and forecasting
- `/agileflow:metrics` - Analytics dashboard (cycle time, lead time, throughput, flow efficiency)
- `/agileflow:retro` - Automated retrospective generator with insights
- `/agileflow:deps` - Dependency graph visualization with critical path detection

### Web AI Integration
- `/agileflow:context` - Generate/export/manage context for web AI tools (ChatGPT, Perplexity, Gemini, Claude, etc.)
- `/agileflow:research` - Save research notes

### Expert System
- `/agileflow:multi-expert` - Deploy multiple domain experts for complex cross-domain analysis
- `/agileflow:validate-expertise` - Validate expertise files for drift and staleness

</details>

<details>
<summary><strong>🤖 Subagents</strong> (26 specialized agents - click to expand)</summary>

AgileFlow includes **26 specialized subagents** that operate in separate context windows for focused work.

### Core Implementation Agents

**`ui`** - UI/Presentation Layer Specialist
- Front-end components, styling, theming, accessibility (WCAG 2.1 AA)
- Invocation: "Use the ui subagent to implement this UI feature"

**`api`** - Services/Data Layer Specialist
- Backend APIs, business logic, data models, API tests
- Invocation: "Use the api subagent to implement this API endpoint"

**`ci`** - CI/CD & Quality Specialist
- CI/CD pipelines, linting, type checking, test coverage
- Invocation: "Use the ci subagent to set up the test pipeline"

### Orchestration & Planning Agents

**`mentor`** - End-to-End Implementation Mentor
- Guides feature implementation from idea to PR
- Invocation: "Use the mentor subagent to guide me through this feature"

**`epic-planner`** - Epic & Story Planning Specialist
- Breaks down features into epics and stories with acceptance criteria
- Invocation: "Use the epic-planner subagent to plan this feature"

**`adr-writer`** - Architecture Decision Record Specialist
- Documents technical decisions, trade-offs, alternatives
- Invocation: "Use the adr-writer subagent to document this decision"

**`research`** - Research & Knowledge Management Specialist
- Conducts technical research, builds research prompts, saves notes
- Invocation: "Use the research subagent to research authentication approaches"

### All 26 Specialized Agents

| Agent | Focus Area |
|-------|------------|
| `ui` | Frontend components, styling, accessibility |
| `api` | Backend APIs, business logic, data models |
| `ci` | CI/CD pipelines, quality automation |
| `database` | Schema design, migrations, query optimization |
| `devops` | Infrastructure, deployment, automation |
| `security` | Auth, vulnerabilities, compliance |
| `testing` | Test strategies, coverage, mocking |
| `performance` | Profiling, caching, optimization |
| `mobile` | React Native, Flutter, mobile-specific |
| `integrations` | Third-party APIs, webhooks |
| `refactor` | Technical debt, code quality |
| `design` | Design systems, UI/UX patterns |
| `accessibility` | WCAG compliance, assistive tech |
| `analytics` | Event tracking, metrics dashboards |
| `datamigration` | ETL, zero-downtime migrations |
| `monitoring` | Observability, logging, alerting |
| `compliance` | GDPR, HIPAA, SOC2, audit trails |
| `qa` | Test planning, release readiness |
| `product` | Requirements, user stories, AC |
| `documentation` | Technical docs, API docs, guides |
| `mentor` | End-to-end implementation guidance |
| `epic-planner` | Feature breakdown, story creation |
| `adr-writer` | Architecture decision records |
| `research` | Technical research, best practices |
| `readme-updater` | Documentation maintenance |
| `multi-expert` | Cross-domain expert orchestration |

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
<summary><strong>🧠 Agent Expert System</strong> (26 self-improving experts - click to expand)</summary>

Every subagent is backed by an **Agent Expert System** - a self-improving knowledge base that learns from each project.

### How It Works

Each of the 26 domain experts has:
- **expertise.yaml** - Mental models, patterns, anti-patterns, key files
- **question.md** - Workflow for answering domain questions
- **self-improve.md** - Protocol for updating expertise after tasks
- **workflow.md** - Full task execution chain

### Three-Step Expert Workflow

```
1. LOAD EXPERTISE    →  Read expertise.yaml, validate against actual code
2. EXECUTE TASK      →  Work with validated knowledge + patterns
3. SELF-IMPROVE      →  Update expertise.yaml with new learnings
```

### Example: Database Expert

```yaml
# packages/cli/src/core/experts/database/expertise.yaml
domain: database
mental_models:
  - name: Schema Design Patterns
    key_files:
      - src/db/schema.ts
      - prisma/schema.prisma
    patterns:
      - Use UUID for primary keys
      - Add indexes on foreign keys
    anti_patterns:
      - N+1 queries
      - Missing cascades
```

### Available Expert Domains

| Domain | Expertise Focus |
|--------|-----------------|
| `database` | Schema design, migrations, query optimization |
| `api` | REST/GraphQL patterns, validation, error handling |
| `ui` | Components, styling, accessibility, state management |
| `security` | Auth patterns, vulnerabilities, compliance |
| `testing` | Test strategies, coverage, mocking patterns |
| `performance` | Profiling, caching, optimization techniques |
| `devops` | CI/CD, deployment, infrastructure |
| ... | [26 domains total](docs/04-architecture/agent-expert-system.md) |

### Multi-Expert Orchestration

For complex cross-domain tasks, use `/agileflow:multi-expert`:

```
/agileflow:multi-expert Is this authentication implementation secure?
```

Deploys 3-5 relevant experts in parallel, synthesizes their analyses into unified recommendations.

**Learn More:** See [Agent Expert System Architecture](docs/04-architecture/agent-expert-system.md)

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
- `epic-planner` - Breaks features into epics/stories
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
           "command": "echo '🚀 AgileFlow loaded - Type /agileflow:help'"
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
<summary><strong>⚙️ Configuration System</strong> (8 configuration agents - click to expand)</summary>

AgileFlow includes a unified configuration system accessible via `/agileflow:configure`.

### Quick Access

```
/agileflow:configure
```

Opens an interactive menu to configure all AgileFlow features.

### Configuration Agents

| Agent | Purpose |
|-------|---------|
| `configuration:hooks` | Set up event-driven automation (SessionStart, PreCompact, etc.) |
| `configuration:precompact` | Context preservation during conversation compacts |
| `configuration:status-line` | Custom Claude Code status bar with project info |
| `configuration:git-config` | Git repository initialization and remote setup |
| `configuration:ci` | CI/CD workflow for automated testing and quality |
| `configuration:archival` | Auto-archival of completed stories (keeps status.json lean) |
| `configuration:attribution` | Git attribution preferences in CLAUDE.md |
| `configuration:verify` | Verify all configurations work correctly |

### PreCompact Context Preservation

Ensures command context (like `/babysit` rules) survives conversation compaction:

```
1. Command runs → Registers as "active"
2. Conversation compacts → PreCompact hook extracts rules
3. New context → Rules are preserved and followed
```

**Learn More:** See [PreCompact Architecture](docs/04-architecture/precompact-context.md)

### Status Line

Display project context in Claude Code's status bar:

```
[main] US-0007: Login Feature | WIP: 2 | Done: 85%
```

Configure with: `/agileflow:configure` → Status Line

</details>

<details>
<summary><strong>📐 Architecture Documentation</strong> (click to expand)</summary>

Comprehensive architecture documentation lives in `docs/04-architecture/`:

| Document | Description |
|----------|-------------|
| [AgileFlow CLI Overview](docs/04-architecture/agileflow-cli-overview.md) | High-level system architecture |
| [Agent Expert System](docs/04-architecture/agent-expert-system.md) | Self-improving agents with expertise files |
| [Multi-Expert Orchestration](docs/04-architecture/multi-expert-orchestration.md) | Parallel expert analysis and synthesis |
| [Babysit Mentor System](docs/04-architecture/babysit-mentor-system.md) | End-to-end implementation mentor |
| [Command & Agent Flow](docs/04-architecture/command-agent-flow.md) | How commands and agents work together |
| [PreCompact Context](docs/04-architecture/precompact-context.md) | Context preservation during compacts |
| [Dynamic Content Injection](docs/04-architecture/dynamic-content-injection.md) | Auto-updating command/agent lists |
| [Monorepo Setup](docs/04-architecture/monorepo-setup.md) | Repository structure |

### System Layers

```
Presentation    →  Slash Commands, CLI Interface
Orchestration   →  Babysit, Multi-Expert, Session
Agent           →  26 Domain Experts
Expert          →  Expertise Files, Mental Models
Storage         →  status.json, docs/, bus/
```

### Other Documentation

- **Research Notes:** `docs/10-research/` - Technical investigations and best practices
- **ADRs:** `docs/03-decisions/` - Architecture Decision Records
- **Practices:** `docs/02-practices/` - Team conventions and patterns

</details>

<details>
<summary><strong>🔧 Advanced Topics</strong> (click to expand)</summary>

### Daily Workflow

1. **Pick a story** - Use `mentor` or check `docs/09-agents/status.json`
2. **Implement to AC** - Follow acceptance criteria
3. **Write tests** - Reference `docs/07-testing/test-cases/<STORY_ID>.md`
4. **Update status** - Use `/agileflow:status`
5. **Create PR** - Use `/agileflow:pr`
6. **Mark done** - Update status after merge

### Multi-Agent Collaboration

AgileFlow uses a message bus (`docs/09-agents/bus/log.jsonl`) for coordination:
- Agents update `docs/09-agents/status.json` with current work
- Messages logged to bus for async communication
- Use `/agileflow:handoff` to transfer work between agents
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
# Use helper script (created by /agileflow:setup)
./docs/00-meta/scripts/worktree-create.sh auth-hotfix

# Open in new window
code ../myapp-auth-hotfix
/agileflow:babysit
```

See `docs/00-meta/guides/worktrees.md` for comprehensive guide.

### Web AI Integration

Share context with web AI tools (ChatGPT, Perplexity, Gemini, Claude, etc.):

1. Run `/agileflow:context` to generate/refresh context
2. Use `/agileflow:context MODE=export` for concise excerpt
3. Paste into web AI tool for research/ideation
4. Use `/agileflow:context MODE=research TOPIC="..."` for structured prompts
5. Save results with `/agileflow:research`

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
/agileflow:session:init

# Start each session (or auto-run via hook)
/agileflow:session:resume

# Run tests and update test status
/agileflow:verify

# Create verified checkpoint
/agileflow:baseline "Sprint 12 complete"

# End session cleanly
/agileflow:session:end
```

**How It Works:**
1. **Test Tracking**: Every story has `test_status` field (passing/failing/not_run)
2. **Pre-Implementation**: Agents check test_status before starting work
3. **Post-Implementation**: Agents run `/agileflow:verify` before marking complete
4. **Session Resume**: Loads context and detects regressions
5. **Baselines**: Git tags mark known-good states for reset points

**Benefits:**
- **No Broken Baselines**: Agents can't mark stories complete with failing tests
- **Fail Fast**: Catch regressions immediately, not at PR review
- **Context Continuity**: Structured handoff between sessions
- **Regression Detection**: Alerts when tests were passing, now failing

**Agent Integration (v2.26.0):**
All 18 dev agents now include verification protocol:
- ui, api, ci, devops
- security, database, testing
- performance, mobile, integrations
- refactor, design, accessibility
- analytics, datamigration, monitoring
- compliance, qa

**Learn More:** See CLAUDE.md "Session Harness System" section for complete documentation.

### Status.json Compression

Prevent "file too large" errors:

```bash
# Compress status.json (removes verbose fields)
/agileflow:compress

# Typical result: 80-90% size reduction
```

Full story content remains in `docs/06-stories/` markdown files (no data loss).

</details>

## Examples

### Creating an Epic with Stories
```
/agileflow:epic EPIC=EP-0001 TITLE="User Authentication" OWNER=AG-API GOAL="Secure user login and registration" STORIES="US-0001|Login form|AG-UI,US-0002|Auth API|AG-API"
```

### Working on a Story
```
/agileflow:assign STORY=US-0001 NEW_OWNER=AG-UI NEW_STATUS=in-progress NOTE="Starting implementation"
# ... do the work ...
/agileflow:status STORY=US-0001 STATUS=in-review SUMMARY="Login form complete with tests" PR=https://github.com/...
```

### Recording a Decision
```
/agileflow:adr NUMBER=0001 TITLE="Use JWT for authentication" CONTEXT="Need stateless auth for API" DECISION="JWT with 15min access + refresh tokens" CONSEQUENCES="Simpler scaling but requires token refresh flow"
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

For issues or questions, please visit the [GitHub repository](https://github.com/projectquestorg/AgileFlow).
