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
- ✅ 34 slash commands for complete workflow automation
- ✅ Automated dependency management and security audits
- ✅ AI-powered code review and quality checks
- ✅ Technical debt tracking and reduction
- ✅ Automated deployment pipeline setup
- ✅ CI as a guardrail
- ✅ Works with any tech stack or framework

## Installation

```bash
/plugin marketplace add xloxn69/AgileFlow
/plugin install AgileFlow
```

Or use locally:
```bash
/plugin marketplace add /path/to/AgileFlow
/plugin install AgileFlow
```

## Quick Start

1. **Initialize the system**:
   ```
   /setup-system
   ```
   This scaffolds the entire docs structure, templates, and optional CI.

2. **Get help**:
   ```
   /system-help
   ```
   View the system overview, folder structure, and available commands.

3. **Use the mentor subagent** (recommended):
   ```
   Use the agileflow-mentor subagent to guide me through implementing <your feature>
   ```
   Interactive mentor that guides you through epic/story creation, implementation, research, and PR preparation.

## Folder Structure

After running `/setup-system`, you'll have:

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
- `/setup-system` - Bootstrap the entire system
- `/system-help` - Display system overview
- `/babysit` - Interactive mentor for end-to-end implementation

### Planning & Structure
- `/epic-new` - Create a new epic
- `/story-new` - Create a user story with AC
- `/adr-new` - Create an Architecture Decision Record
- `/agent-new` - Onboard a new agent

### Task Management
- `/assign` - Assign/reassign a story
- `/status` - Update story status
- `/handoff` - Document handoff between agents

### Quality & CI
- `/pr-template` - Generate PR description
- `/ci-setup` - Bootstrap CI workflow
- `/readme-sync` - Sync folder READMEs
- `/setup-tests` - Automated testing infrastructure setup
- `/ai-code-review` - AI-powered code review

### Automation & DevOps 🆕
- `/dependency-update` - Track and update dependencies
- `/dependencies-dashboard` - Visual dependency overview
- `/docs-sync` - Synchronize docs with code changes
- `/impact-analysis` - Analyze change impact on codebase
- `/tech-debt` - Track and prioritize technical debt
- `/setup-deployment` - Automated deployment pipeline setup
- `/generate-changelog` - Auto-generate changelog from commits
- `/auto-story` - Generate stories from PRDs/mockups/specs
- `/custom-template` - Create and manage custom templates
- `/agent-feedback` - Collect feedback for continuous improvement
- `/stakeholder-update` - Generate stakeholder reports

### ChatGPT Integration
- `/chatgpt` - Generate ChatGPT context brief
- `/chatgpt-refresh` - Refresh context
- `/chatgpt-note` - Add note to context
- `/chatgpt-export` - Export concise excerpt
- `/chatgpt-research` - Build research prompt
- `/research-init` - Save research notes

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
**End-to-End Implementation Mentor** (Replaces `/babysit` command)
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
4. **Update status**: Use `/status` to track progress
5. **Create PR**: Use `/pr-template` to generate description
6. **Mark done**: Update status after merge

## Multi-Agent Collaboration

AgileFlow uses a message bus (`docs/09-agents/bus/log.jsonl`) for agent coordination:

- Agents update `docs/09-agents/status.json` with their current work
- Messages are logged to the bus for async communication
- Use `/handoff` to explicitly transfer work between agents
- WIP limit: max 2 stories per agent

## ChatGPT Integration

AgileFlow maintains a single source of truth context file (`docs/chatgpt.md`) that can be shared with ChatGPT for research and planning:

1. Run `/chatgpt` to generate or refresh the context
2. Use `/chatgpt-export` to get a concise excerpt
3. Paste into ChatGPT for research or ideation
4. Use `/chatgpt-research` to build structured research prompts
5. Save results with `/research-init`

## Examples

### Creating an Epic with Stories

```
/epic-new EPIC=EP-0001 TITLE="User Authentication" OWNER=AG-API GOAL="Secure user login and registration" STORIES="US-0001|Login form|AG-UI,US-0002|Auth API|AG-API,US-0003|Session management|AG-API"
```

### Working on a Story

```
/assign STORY=US-0001 NEW_OWNER=AG-UI NEW_STATUS=in-progress NOTE="Starting implementation"
# ... do the work ...
/status STORY=US-0001 STATUS=in-review SUMMARY="Login form complete with tests" PR=https://github.com/...
```

### Recording a Decision

```
/adr-new NUMBER=0001 TITLE="Use JWT for authentication" CONTEXT="Need stateless auth for API" DECISION="JWT with 15min access + refresh tokens" CONSEQUENCES="Simpler scaling but requires token refresh flow"
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
