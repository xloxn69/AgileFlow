# AgileFlow CLI Architecture Overview

AgileFlow is an agile workflow system for Claude Code that provides slash commands, specialized agents, and self-improving experts.

---

## System Architecture

```mermaid
flowchart TB
  accTitle: AgileFlow CLI System Architecture
  accDescr: High-level view of AgileFlow components and their relationships

  subgraph User[User Layer]
    dev([Developer])
    claude[Claude Code]
  end

  subgraph Commands[Command Layer]
    slash[Slash Commands<br/>42 commands]
    agents[Agent Commands<br/>25 agents]
  end

  subgraph Core[Core Engine]
    direction TB
    router[Command Router]
    experts[Expert System]
    state[State Manager]
  end

  subgraph Storage[Storage Layer]
    agileflow[.agileflow/<br/>Config, experts, commands]
    docs[docs/<br/>Stories, epics, ADRs]
    status[status.json<br/>Current state]
  end

  subgraph External[External Services]
    github[GitHub API]
    git[Git]
  end

  dev --> claude
  claude --> Commands
  Commands --> Core
  Core --> Storage
  Core --> External
```

---

## Installation Structure

When you run `npx agileflow setup`, this structure is created:

```mermaid
flowchart LR
  accTitle: AgileFlow Installation Structure
  accDescr: Shows what gets installed and where

  subgraph NPM[npm package]
    src[src/core/]
  end

  subgraph Project[Your Project]
    subgraph AF[.agileflow/]
      commands[commands/]
      agents[agents/]
      experts[experts/]
      skills[skills/]
      config[config.yaml]
    end

    subgraph Claude[.claude/]
      afcmds[commands/AgileFlow/]
    end

    subgraph Docs[docs/]
      practices[02-practices/]
      decisions[03-decisions/]
      arch[04-architecture/]
      research[10-research/]
    end
  end

  src -->|install| AF
  src -->|symlink| Claude
  src -->|scaffold| Docs
```

---

## Command Flow

```mermaid
sequenceDiagram
  accTitle: Command Execution Flow
  accDescr: Shows how a slash command is executed from start to finish

  actor User
  participant CC as Claude Code
  participant Router as Command Router
  participant Agent as Specialized Agent
  participant Expert as Expert System
  participant State as State Manager

  User->>CC: /AgileFlow:story TITLE Add login
  CC->>Router: Parse command + args

  Router->>Router: Load command markdown
  Router->>Agent: Dispatch to agent (if needed)

  Agent->>Expert: Load domain expertise
  Expert-->>Agent: Mental models, patterns

  Agent->>Agent: Execute task
  Agent->>State: Update status.json

  State-->>Agent: Confirmation
  Agent-->>CC: Result
  CC-->>User: Output
```

---

## Component Layers

```mermaid
flowchart TD
  accTitle: AgileFlow Component Layers
  accDescr: Shows the layered architecture of AgileFlow

  subgraph L1[Presentation Layer]
    slash[Slash Commands]
    cli[CLI Interface]
  end

  subgraph L2[Orchestration Layer]
    babysit[Babysit<br/>End-to-end mentor]
    multiexp[Multi-Expert<br/>Parallel analysis]
    session[Session<br/>Context management]
  end

  subgraph L3[Agent Layer]
    db[Database]
    api[API]
    ui[UI]
    test[Testing]
    sec[Security]
    more[+20 more]
  end

  subgraph L4[Expert Layer]
    expertise[Expertise Files]
    mental[Mental Models]
    learning[Self-Improvement]
  end

  subgraph L5[Storage Layer]
    status[status.json]
    bus[bus/log.jsonl]
    docs[docs/*]
  end

  L1 --> L2
  L2 --> L3
  L3 --> L4
  L4 --> L5
```

---

## Data Flow

```mermaid
flowchart LR
  accTitle: AgileFlow Data Flow
  accDescr: Shows how data flows through the system

  subgraph Input
    user([User Command])
    context[Project Context]
  end

  subgraph Processing
    parse[Parse Args]
    load[Load Config]
    route[Route to Handler]
    exec[Execute]
  end

  subgraph Output
    result[Result]
    state[State Update]
    learn[Learning Update]
  end

  user --> parse
  context --> load
  parse --> load --> route --> exec
  exec --> result
  exec --> state
  exec --> learn
```

---

## State Management

```mermaid
stateDiagram-v2
  accTitle: Story State Machine
  accDescr: Shows the lifecycle states of a user story

  [*] --> backlog: /story create

  backlog --> ready: /assign
  ready --> in_progress: /status in_progress
  in_progress --> review: /pr create
  review --> in_progress: changes requested
  review --> done: merged
  done --> [*]

  in_progress --> blocked: blocker found
  blocked --> in_progress: blocker resolved
```

---

## Agent Communication

```mermaid
sequenceDiagram
  accTitle: Agent Handoff Communication
  accDescr: Shows how agents communicate during handoffs

  participant A as Agent A (UI)
  participant Bus as Message Bus<br/>bus/log.jsonl
  participant B as Agent B (API)

  A->>A: Complete UI work
  A->>Bus: Log completion + context
  Note over Bus: {"from":"AG-UI","to":"AG-API",<br/>"type":"handoff","context":{...}}

  B->>Bus: Read pending messages
  Bus-->>B: Handoff message
  B->>B: Continue with context
  B->>Bus: Log completion
```

---

## Key Directories

| Directory | Purpose |
|-----------|---------|
| `.agileflow/` | Core installation (commands, agents, experts) |
| `.agileflow/experts/` | Domain expertise files (25 domains) |
| `.claude/commands/AgileFlow/` | Slash command definitions |
| `docs/02-practices/` | Development practices |
| `docs/03-decisions/` | Architecture Decision Records |
| `docs/04-architecture/` | System architecture docs |
| `docs/10-research/` | Research notes |

---

## Integration with Claude Code

```mermaid
flowchart LR
  accTitle: Claude Code Integration
  accDescr: Shows how AgileFlow integrates with Claude Code

  subgraph CC[Claude Code]
    tools[Tool Use]
    context[Context Window]
    commands[/slash commands]
  end

  subgraph AF[AgileFlow]
    handlers[Command Handlers]
    agents[Agents]
    experts[Experts]
  end

  subgraph Project[Project]
    code[Source Code]
    docs[Documentation]
    state[State Files]
  end

  commands --> handlers
  handlers --> agents
  agents --> experts
  agents --> tools
  tools --> code
  tools --> docs
  tools --> state
  context --> experts
```

---

## Related Documentation

- [Agent Expert System](./agent-expert-system.md)
- [Multi-Expert Orchestration](./multi-expert-orchestration.md)
- [Command & Agent Flow](./command-agent-flow.md)
- [Monorepo Setup](./monorepo-setup.md)
