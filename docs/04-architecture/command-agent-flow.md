# Command & Agent Flow Architecture

This document describes how slash commands and agents work together in AgileFlow.

---

## Command Types

![Diagram 1](images/command-agent-flow-1.svg)


---

## Command Execution Flow

![Diagram 2](images/command-agent-flow-2.svg)


---

## Agent Execution Pattern

![Diagram 3](images/command-agent-flow-3.svg)


---

## Agent vs Command Relationship

```mermaid
flowchart LR
  accTitle: Agent vs Command Relationship
  accDescr: Shows how commands can invoke agents

  subgraph Commands[Commands]
    story[story]
    babysit[babysit]
    multiexp[multi-expert]
  end

  subgraph Agents[Agents]
    db[database]
    api[api]
    ui[ui]
    epic[epic-planner]
  end

  story -.->|"may invoke| epic
  babysit -->|routes to| db & api & ui
  multiexp -->|spawns multiple| db & api & ui
```

**Key distinction:**
- **Commands**: User-facing actions (create story, view board, run sprint)
- **Agents**: Specialized workers with domain expertise (database, api, security)

---

## Babysit Routing Logic

![Diagram 5](images/command-agent-flow-5.svg)


---

## State Updates

![Diagram 6](images/command-agent-flow-6.svg)


---

## Command Categories

### Tracking Commands

![Diagram 7](images/command-agent-flow-7.svg)


### Workflow Commands

![Diagram 8](images/command-agent-flow-8.svg)


### Session Commands

![Diagram 9](images/command-agent-flow-9.svg)


---

## Agent Specialization Map

![Diagram 10](images/command-agent-flow-10.svg)


---

## Error Handling

![Diagram 11](images/command-agent-flow-11.svg)


---

## Related Documentation

- [AgileFlow CLI Overview](./agileflow-cli-overview.md)
- [Agent Expert System](./agent-expert-system.md)
- [Multi-Expert Orchestration](./multi-expert-orchestration.md)
