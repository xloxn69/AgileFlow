# AgileFlow Plugin

Universal agile/docs-as-code system for Claude Code. Framework-agnostic command pack combining Scrum, Kanban, ADRs, and docs-as-code principles.

## Why AgileFlow?

AgileFlow combines three proven methodologies into one cohesive system:

- **Agile (Scrum/Kanban)**: Break work into Epics → Stories → Acceptance Criteria; flow small batches to done with WIP limits
- **ADRs (Architecture Decision Records)**: Record why decisions were made so future teams/agents don't re-debate
- **Docs-as-Code**: Humans and AI agents coordinate via versioned files in the repo (traceable, reviewable, automatable)

## Benefits

- ✅ Clear priorities and testable increments
- ✅ Durable memory and decision history
- ✅ Effortless multi-agent collaboration via message bus
- ✅ 8 specialized subagents for focused work (UI, API, CI, DevOps, planning, ADRs, research, mentor)
- ✅ 36 slash commands for complete workflow automation
- ✅ System validation with JSON schemas
- ✅ Intelligent blocker tracking and resolution
- ✅ Data-driven sprint planning with velocity forecasting
- ✅ Automated dependency management and security audits
- ✅ AI-powered code review and quality checks
- ✅ Technical debt tracking and reduction
- ✅ Automated deployment pipeline setup
- ✅ CI as a guardrail
- ✅ Works with any tech stack or framework

## Installation

**Step 1 - Add the marketplace:**
```
/plugin marketplace add xloxn69/AgileFlow
```

**Step 2 - Install the plugin:**
```
/plugin install AgileFlow
```

## Quick Start

1. **Initialize the system**:
   ```
   /AgileFlow:setup
   ```
   This scaffolds the entire docs structure, templates, and optional CI.

   During setup, you can optionally enable:
   - GitHub Issues sync (uses GitHub MCP - Model Context Protocol)
   - Notion integration (uses Notion MCP - Model Context Protocol)

2. **Get help**:
   ```
   /help
   ```
   View the system overview, folder structure, and available commands.

3. **Use the mentor subagent** (recommended):
   ```
   Use the agileflow-mentor subagent to guide me through implementing <your feature>
   ```
   Interactive mentor that guides you through epic/story creation, implementation, research, and PR preparation.

## Folder Structure

After running `/AgileFlow:setup`, you'll have:

```
docs/
  00-meta/             # Templates, glossary, conventions
  01-brainstorming/    # Ideas and sketches
  02-practices/        # Testing, git, CI, security practices
    prompts/agents/    # Agent profiles and contracts
  03-decisions/        # ADRs
  04-architecture/     # Architecture docs
  05-epics/            # Epic definitions
  06-stories/          # User stories (grouped by epic)
  07-testing/          # Test cases and acceptance criteria
  08-project/          # Roadmap, backlog, milestones, risks
  09-agents/           # Agent status and message bus
    bus/log.jsonl      # Agent communication log
    status.json        # Current story statuses
  10-research/         # Saved research notes
  chatgpt.md           # One-page context brief for ChatGPT
```

## Commands

### Core Workflow
- `/AgileFlow:setup` - Bootstrap the entire system
- `/AgileFlow:validate` - Validate system integrity (JSON schemas, orphaned stories, WIP limits, dependencies) 🆕
- `/AgileFlow:help` - Display system overview
- `/AgileFlow:babysit` - Interactive mentor for end-to-end implementation

### Planning & Structure
- `/AgileFlow:epic` - Create a new epic
- `/AgileFlow:story` - Create a user story with AC
- `/AgileFlow:sprint` - Data-driven sprint planning with velocity forecasting and capacity analysis 🆕
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

### Automation & DevOps 🆕
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

### Visualization & Analytics 🎯
- `/AgileFlow:board` - Visual kanban board with WIP limits
- `/AgileFlow:blockers` - Comprehensive blocker tracking with resolution suggestions and cross-agent coordination analysis 🆕
- `/AgileFlow:velocity` - Velocity tracking and forecasting
- `/AgileFlow:metrics` - Comprehensive analytics dashboard (cycle time, lead time, throughput, flow efficiency)
- `/AgileFlow:retro` - Automated retrospective generator with insights and action items
- `/AgileFlow:deps` - Dependency graph visualization with critical path and circular dependency detection

### Integration & Collaboration 🔗
- `/AgileFlow:github` - Bidirectional GitHub Issues sync (uses GitHub MCP - Model Context Protocol)
- `/AgileFlow:notion` - Bidirectional Notion database sync (uses Notion MCP - Model Context Protocol)

### ChatGPT Integration
- `/AgileFlow:chatgpt` - Generate/export/manage ChatGPT context (MODE=full|export|note|research)
- `/AgileFlow:research` - Save research notes

### Specialized Agents (Commands)
- `/agent-ui` - UI/presentation layer agent
- `/agent-api` - Services/data layer agent
- `/agent-ci` - CI & quality agent

## Subagents

AgileFlow includes 8 specialized subagents that operate in separate context windows for focused work:

### Core Implementation Agents

#### `agileflow-ui`
**UI/Presentation Layer Specialist**
- Implements front-end components, styling, theming
- Ensures accessibility (WCAG 2.1 AA)
- Writes component tests
- Works on stories tagged `owner: AG-UI`
- Invocation: "Use the agileflow-ui subagent to implement this UI feature"

#### `agileflow-api`
**Services/Data Layer Specialist**
- Implements backend APIs, business logic, data models
- Writes API tests (unit + integration + contract)
- Ensures proper error handling and validation
- Works on stories tagged `owner: AG-API`
- Invocation: "Use the agileflow-api subagent to implement this API endpoint"

#### `agileflow-ci`
**CI/CD & Quality Specialist**
- Sets up and maintains CI/CD pipelines
- Configures linting, type checking, testing
- Ensures test coverage and quality gates
- Works on stories tagged `owner: AG-CI`
- Invocation: "Use the agileflow-ci subagent to set up the test pipeline"

### Orchestration & Planning Agents

#### `agileflow-mentor`
**End-to-End Implementation Mentor** (Replaces `/AgileFlow:babysit` command)
- Guides feature implementation from idea to PR
- Finds/creates epics and stories
- Integrates research and suggests gaps
- Coordinates multi-step workflows
- Can run commands (diff-first, YES/NO)
- Invocation: "Use the agileflow-mentor subagent to guide me through implementing this feature"

#### `agileflow-epic-planner`
**Epic & Story Planning Specialist**
- Breaks down large features into epics and stories
- Writes testable acceptance criteria (Given/When/Then)
- Estimates effort and maps dependencies
- Creates test stubs
- Invocation: "Use the agileflow-epic-planner subagent to plan this feature"

#### `agileflow-adr-writer`
**Architecture Decision Record Specialist**
- Documents technical decisions and trade-offs
- Records alternatives considered
- Maintains decision history
- Links related decisions
- Invocation: "Use the agileflow-adr-writer subagent to document this decision"

#### `agileflow-research`
**Research & Knowledge Management Specialist**
- Conducts technical research (web search, docs)
- Builds comprehensive ChatGPT research prompts
- Saves and indexes research notes
- Identifies research gaps
- Invocation: "Use the agileflow-research subagent to research authentication approaches"

### Automation & DevOps Agent 🆕

#### `agileflow-devops`
**DevOps & Automation Specialist**
- Manages dependencies and security audits
- Sets up deployment pipelines (Vercel, Netlify, AWS, Docker, etc.)
- Configures testing infrastructure
- Performs AI-powered code reviews
- Tracks and reduces technical debt
- Generates changelogs and stakeholder reports
- Synchronizes documentation with code
- Analyzes impact of code changes
- Works on stories tagged `owner: AG-DEVOPS`
- Invocation: "Use the agileflow-devops subagent to set up the deployment pipeline"

### How Subagents Work

Subagents operate in **separate context windows** from the main conversation, allowing:
- **Focused expertise**: Each subagent has specialized knowledge and constraints
- **Parallel work**: Multiple subagents can work simultaneously (future)
- **Context isolation**: Long implementation details don't clutter main conversation
- **Consistent behavior**: Subagents follow strict contracts (testing, status updates, etc.)

### When to Use Subagents vs Commands

**Use Subagents** for:
- Complex, multi-step implementation work
- Specialized tasks requiring focused expertise
- Work that benefits from separate context
- Tasks that need to run commands or write code

**Use Commands** for:
- Quick, single-purpose actions
- Status updates and assignments
- Generating templates or prompts
- Simple file operations

### Example: Using Subagents

```
# Planning a feature
User: "I need to add user authentication with JWT"
Claude: "Use the agileflow-epic-planner subagent to plan this feature"
[Subagent creates epic + 5 stories with AC]

# Implementing UI
User: "Use the agileflow-ui subagent to implement US-0001 (login form)"
[Subagent implements component + tests + updates status]

# Documenting decision
User: "Use the agileflow-adr-writer subagent to document why we chose JWT"
[Subagent creates ADR with context, alternatives, consequences]
```

## Daily Workflow

1. **Pick a story**: Use `agileflow-mentor` subagent or check `docs/09-agents/status.json`
2. **Implement to AC**: Follow acceptance criteria from the story
3. **Write tests**: Reference `docs/07-testing/test-cases/<STORY_ID>.md`
4. **Update status**: Use `/AgileFlow:status` to track progress
5. **Create PR**: Use `/AgileFlow:pr` to generate description
6. **Mark done**: Update status after merge

## Advanced Workflows

### Git Worktrees for Context Preservation

For advanced users who need to handle urgent hotfixes during feature work or compare architectural approaches side-by-side, AgileFlow supports **git worktrees** for isolated parallel development.

**Key Benefits:**
- Preserve AI context when switching between tasks
- Handle urgent production bugs without losing feature work flow
- Compare different implementations side-by-side
- Test risky refactors in complete isolation

**Quick Start:**
```bash
# Use the helper script (created by /AgileFlow:setup)
./docs/00-meta/scripts/worktree-create.sh auth-hotfix

# Open in new window and start babysit
code ../myapp-auth-hotfix
/AgileFlow:babysit
```

**Important:** Use worktrees for **ISOLATION** (separate features/experiments), not **PARALLEL EXECUTION** (concurrent edits to same epic).
See `docs/00-meta/guides/worktrees.md` for comprehensive guide and best practices.

## Multi-Agent Collaboration

AgileFlow uses a message bus (`docs/09-agents/bus/log.jsonl`) for agent coordination:

- Agents update `docs/09-agents/status.json` with their current work
- Messages are logged to the bus for async communication
- Use `/AgileFlow:handoff` to explicitly transfer work between agents
- WIP limit: max 2 stories per agent

## Notion Integration (MCP-based) 🆕

AgileFlow integrates with Notion using **Model Context Protocol (MCP)** for standardized tool access:

### Features
- ✅ **Standardized interface** - MCP provides unified tool API across services
- ✅ **Bidirectional sync** - Changes flow both ways (AgileFlow ↔ Notion)
- ✅ **Better error handling** - Improved over raw API calls
- ✅ **Project-scoped** - `.mcp.json.example` template committed to git
- ✅ **Three databases** - Epics, Stories, and ADRs synced to Notion

### Setup (One-Time)

1. **Create Notion Integration**:
   - Visit https://www.notion.so/my-integrations
   - Create new integration
   - Copy Integration Token (starts with `ntn_`)

2. **Enable during system setup**:
   ```
   /AgileFlow:setup
   # Select "yes" for Notion integration
   ```

3. **Add your token to MCP config**:
   ```bash
   # Copy MCP template to active config
   cp .mcp.json.example .mcp.json

   # Edit .mcp.json and replace "ntn_YOUR_NOTION_TOKEN_HERE" with your actual token
   # Notion tokens start with "ntn_"
   # CRITICAL: Tokens must be hardcoded in .mcp.json (env var substitution doesn't work)
   # Verify .mcp.json is in .gitignore - NEVER commit it!
   ```

4. **Restart Claude Code** (to load MCP server)

5. **Create Notion databases**:
   ```
   /AgileFlow:notion MODE=setup
   ```

6. **Start syncing**:
   ```
   /AgileFlow:notion
   ```

### Team Onboarding
New team members need to:
1. Pull the latest code (includes `.mcp.json.example`)
2. Create their own Notion integration at https://www.notion.so/my-integrations
3. Copy template: `cp .mcp.json.example .mcp.json`
4. Edit `.mcp.json` and hardcode their real token (replace placeholder)
5. Verify `.mcp.json` is in .gitignore (NEVER commit it!)
6. Restart Claude Code
7. Share databases with their integration
8. Start using `/AgileFlow:notion`!

### Advantages of MCP Approach
- 🔒 Tokens in `.mcp.json` (gitignored, never committed)
- 👥 Template-based setup (`.mcp.json.example` in git with placeholder)
- 🚀 Native Claude Code integration via MCP tools
- 🛠️ Better error handling and rate limiting
- 📦 Standardized protocol across services

### Critical Security Notes
- ⚠️ Environment variable substitution (`${NOTION_TOKEN}`) does NOT work in `.mcp.json`
- ⚠️ Tokens must be hardcoded directly in `.mcp.json` file
- ⚠️ `.mcp.json` MUST be gitignored to prevent token leaks
- ⚠️ Each team member needs their own token (no sharing)
- ⚠️ Always verify `.mcp.json` is in `.gitignore` before committing

See `/AgileFlow:notion` command for full documentation.

## GitHub Integration (MCP-based) 🆕

AgileFlow integrates with GitHub using **Model Context Protocol (MCP)** for standardized tool access:

### Features
- ✅ **Standardized interface** - MCP provides unified tool API across services
- ✅ **Bidirectional sync** - Changes flow both ways (AgileFlow ↔ GitHub Issues)
- ✅ **No sudo required** - Uses npx (unlike `gh` CLI which requires installation)
- ✅ **Better portability** - Works across environments without dependencies
- ✅ **Project-scoped** - `.mcp.json.example` template committed to git
- ✅ **Issue/PR management** - Create issues, labels, sync stories with GitHub

### Setup (One-Time)

1. **Create GitHub Personal Access Token**:
   - Visit https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Select scopes: `repo` (full control), `read:org` (if using organization repos)
   - Copy token (starts with `ghp_`)

2. **Enable during system setup**:
   ```
   /AgileFlow:setup
   # Select "yes" for GitHub integration
   ```

3. **Add your token to MCP config**:
   ```bash
   # Copy MCP template to active config
   cp .mcp.json.example .mcp.json

   # Edit .mcp.json and replace "ghp_YOUR_GITHUB_TOKEN_HERE" with your actual token
   # GitHub PATs start with "ghp_"
   # CRITICAL: Tokens must be hardcoded in .mcp.json (env var substitution doesn't work)
   # Verify .mcp.json is in .gitignore - NEVER commit it!
   ```

4. **Restart Claude Code** (to load MCP server)

5. **Configure repository**:
   ```
   # Edit docs/08-project/github-map.json
   # Set "repository": "owner/repo"
   ```

6. **Start syncing**:
   ```
   # Preview first
   /AgileFlow:github DRY_RUN=true

   # Perform sync
   /AgileFlow:github
   ```

### Team Onboarding
New team members need to:
1. Pull the latest code (includes `.mcp.json.example`)
2. Create their own GitHub PAT at https://github.com/settings/tokens
3. Copy template: `cp .mcp.json.example .mcp.json`
4. Edit `.mcp.json` and hardcode their real token (replace placeholder)
5. Verify `.mcp.json` is in .gitignore (NEVER commit it!)
6. Restart Claude Code
7. Start using `/AgileFlow:github`!

### Advantages of MCP Approach
- 🔒 Tokens in `.mcp.json` (gitignored, never committed)
- 👥 Template-based setup (`.mcp.json.example` in git with placeholder)
- 🚀 Native Claude Code integration via MCP tools
- 🛠️ Better error handling and rate limiting
- 📦 Standardized protocol across services
- ⚡ No sudo required (unlike `gh` CLI installation)

### Why We Switched from GitHub CLI
- ✅ No installation required (npx handles it automatically)
- ✅ No sudo permissions needed
- ✅ Consistent with Notion MCP approach
- ✅ Unified configuration in `.mcp.json`
- ✅ Better portability across environments

### Critical Security Notes
- ⚠️ Environment variable substitution (`${GITHUB_TOKEN}`) does NOT work in `.mcp.json`
- ⚠️ Tokens must be hardcoded directly in `.mcp.json` file
- ⚠️ `.mcp.json` MUST be gitignored to prevent token leaks
- ⚠️ Each team member needs their own token (no sharing)
- ⚠️ Always verify `.mcp.json` is in `.gitignore` before committing

See `/AgileFlow:github` command for full documentation.

## ChatGPT Integration

AgileFlow maintains a single source of truth context file (`docs/chatgpt.md`) that can be shared with ChatGPT for research and planning:

1. Run `/AgileFlow:chatgpt` to generate or refresh the context (default MODE=full)
2. Use `/AgileFlow:chatgpt MODE=export` to get a concise excerpt
3. Paste into ChatGPT for research or ideation
4. Use `/AgileFlow:chatgpt MODE=research TOPIC="..."` to build structured research prompts
5. Save results with `/AgileFlow:research`

## Examples

### Creating an Epic with Stories

```
/AgileFlow:epic EPIC=EP-0001 TITLE="User Authentication" OWNER=AG-API GOAL="Secure user login and registration" STORIES="US-0001|Login form|AG-UI,US-0002|Auth API|AG-API,US-0003|Session management|AG-API"
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

For issues or questions, please refer to your Claude Code plugin marketplace or repository.
