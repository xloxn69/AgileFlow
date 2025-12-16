# Command & Agent Flow Architecture

This document describes how slash commands and agents work together in AgileFlow.

---

## Command Types

```mermaid
flowchart TD
  accTitle: AgileFlow Command Types
  accDescr: Shows the different types of commands and their purposes

  commands[AgileFlow Commands]

  commands --> workflow[Workflow Commands]
  commands --> tracking[Tracking Commands]
  commands --> agents[Agent Commands]
  commands --> utility[Utility Commands]

  subgraph Workflow[Workflow]
    babysit[/babysit<br/>End-to-end mentor]
    sprint[/sprint<br/>Sprint planning]
    retro[/retro<br/>Retrospective]
  end

  subgraph Tracking[Tracking]
    story[/story<br/>Create story]
    epic[/epic<br/>Create epic]
    status[/status<br/>Update status]
    board[/board<br/>Kanban view]
  end

  subgraph Agents[Agents]
    db[/agents:database]
    api[/agents:api]
    ui[/agents:ui]
    more[+22 more]
  end

  subgraph Utility[Utility]
    context[/context<br/>Export context]
    validate[/validate-expertise]
    multiexp[/multi-expert]
  end

  workflow --> Workflow
  tracking --> Tracking
  agents --> Agents
  utility --> Utility
```

---

## Command Execution Flow

```mermaid
sequenceDiagram
  accTitle: Command Execution Flow
  accDescr: Shows the lifecycle of a slash command execution

  actor User
  participant CC as Claude Code
  participant Parser as Command Parser
  participant Handler as Command Handler
  participant State as State Manager
  participant Output as Output Formatter

  User->>CC: /AgileFlow:story TITLE="Add login"

  CC->>Parser: Parse command string
  Parser->>Parser: Extract command name
  Parser->>Parser: Extract arguments
  Parser-->>CC: {cmd: "story", args: {TITLE: "Add login"}}

  CC->>Handler: Load command markdown
  Handler->>Handler: Read .agileflow/commands/story.md
  Handler->>Handler: Execute prompt instructions

  Handler->>State: Create story entry
  State->>State: Update status.json
  State-->>Handler: Story ID: US-0001

  Handler->>Output: Format response
  Output-->>CC: Formatted output
  CC-->>User: Story US-0001 created
```

---

## Agent Execution Pattern

```mermaid
flowchart TD
  accTitle: Agent Execution Pattern
  accDescr: Shows how an agent command executes with expertise

  start([/AgileFlow:agents:database])

  start --> load[Load Agent Markdown<br/>agents/database.md]

  load --> first{FIRST ACTION}

  first --> expertise[Read expertise.yaml<br/>Load mental models]

  expertise --> analyze[Analyze User Request]

  analyze --> plan[Create Plan<br/>Using patterns from expertise]

  plan --> execute[Execute Task]

  execute --> validate[Validate Output]

  validate --> improve[Self-Improve<br/>Update expertise.yaml]

  improve --> output([Return Result])
```

---

## Agent vs Command Relationship

```mermaid
flowchart LR
  accTitle: Agent vs Command Relationship
  accDescr: Shows how commands can invoke agents

  subgraph Commands[Commands]
    story[/story]
    babysit[/babysit]
    multiexp[/multi-expert]
  end

  subgraph Agents[Agents]
    db[database]
    api[api]
    ui[ui]
    epic[epic-planner]
  end

  story -.->|"may invoke"| epic
  babysit -->|"routes to"| db & api & ui
  multiexp -->|"spawns multiple"| db & api & ui
```

**Key distinction:**
- **Commands**: User-facing actions (create story, view board, run sprint)
- **Agents**: Specialized workers with domain expertise (database, api, security)

---

## Babysit Routing Logic

```mermaid
flowchart TD
  accTitle: Babysit Command Routing
  accDescr: Shows how babysit routes requests to appropriate agents

  input([User Request])

  input --> analyze[Analyze Keywords]

  analyze --> keywords{Keywords Found?}

  keywords -->|database, SQL| route_db[Route to Database Expert]
  keywords -->|API, endpoint| route_api[Route to API Expert]
  keywords -->|component, CSS| route_ui[Route to UI Expert]
  keywords -->|test, spec| route_test[Route to Testing Expert]
  keywords -->|multiple domains| route_multi[Multi-Expert Mode]
  keywords -->|none clear| route_mentor[Mentor Mode<br/>Ask for clarification]

  route_db --> exec[Execute with Expert]
  route_api --> exec
  route_ui --> exec
  route_test --> exec
  route_multi --> spawn[Spawn Multiple Experts]
  route_mentor --> clarify[Ask User]

  exec --> done([Result])
  spawn --> synthesize[Synthesize] --> done
  clarify --> analyze
```

---

## State Updates

```mermaid
sequenceDiagram
  accTitle: State Update Flow
  accDescr: Shows how commands update state files

  participant Cmd as Command
  participant Status as status.json
  participant Bus as bus/log.jsonl
  participant Docs as docs/

  Cmd->>Status: Update story status
  Note over Status: {"US-0001": {"status": "in_progress"}}

  Cmd->>Bus: Log activity
  Note over Bus: {"ts": "...", "type": "status",<br/>"story": "US-0001", "status": "in_progress"}

  Cmd->>Docs: Update story file (if needed)
  Note over Docs: docs/06-stories/US-0001.md
```

---

## Command Categories

### Tracking Commands

```mermaid
flowchart LR
  accTitle: Tracking Commands
  accDescr: Commands for project tracking

  subgraph Create[Create]
    story[/story]
    epic[/epic]
    adr[/adr]
  end

  subgraph Update[Update]
    status[/status]
    assign[/assign]
    blockers[/blockers]
  end

  subgraph View[View]
    board[/board]
    deps[/deps]
    metrics[/metrics]
  end

  Create --> status.json
  Update --> status.json
  View --> status.json
```

### Workflow Commands

```mermaid
flowchart LR
  accTitle: Workflow Commands
  accDescr: Commands for agile workflow

  sprint[/sprint] --> plan[Sprint Planning]
  retro[/retro] --> review[Retrospective]
  velocity[/velocity] --> track[Velocity Tracking]
  update[/update] --> report[Stakeholder Update]
```

### Session Commands

```mermaid
flowchart LR
  accTitle: Session Commands
  accDescr: Commands for session management

  init[/session:init] --> start[Start Session]
  resume[/session:resume] --> continue[Resume Work]
  status[/session:status] --> check[Check State]
  end_[/session:end] --> close[Close Session]
```

---

## Agent Specialization Map

```mermaid
flowchart TD
  accTitle: Agent Specialization Map
  accDescr: Shows what each agent category handles

  agents[25 Agent Experts]

  agents --> backend[Backend]
  agents --> frontend[Frontend]
  agents --> infra[Infrastructure]
  agents --> quality[Quality]
  agents --> process[Process]

  subgraph Backend[Backend Agents]
    database
    api
    integrations
    datamigration
  end

  subgraph Frontend[Frontend Agents]
    ui
    mobile
    accessibility
    design
  end

  subgraph Infra[Infrastructure Agents]
    ci
    devops
    monitoring
    security
  end

  subgraph Quality[Quality Agents]
    testing
    qa
    performance
    refactor
  end

  subgraph Process[Process Agents]
    product
    epic-planner
    documentation
    research
  end
```

---

## Error Handling

```mermaid
flowchart TD
  accTitle: Command Error Handling
  accDescr: How errors are handled in command execution

  exec[Execute Command]

  exec --> check{Success?}

  check -->|Yes| output[Return Output]
  check -->|No| error{Error Type}

  error -->|Missing args| prompt[Prompt for Args]
  error -->|Invalid state| suggest[Suggest Fix]
  error -->|System error| log[Log Error]

  prompt --> retry[Retry]
  suggest --> user[Show to User]
  log --> fail[Fail Gracefully]

  retry --> exec
```

---

## Related Documentation

- [AgileFlow CLI Overview](./agileflow-cli-overview.md)
- [Agent Expert System](./agent-expert-system.md)
- [Multi-Expert Orchestration](./multi-expert-orchestration.md)
