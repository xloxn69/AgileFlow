# Agent Expert System Architecture

**Research**: See [Agent Experts Research](../10-research/20251216-agent-experts-self-improving-agents.md)

The Agent Expert System enables self-improving AI agents that learn from their work and accumulate domain expertise over time.

---

## Overview

```mermaid
flowchart TD
  accTitle: Agent Expert System Overview
  accDescr: Shows the relationship between agents, expertise files, and the self-improvement loop

  subgraph Input[User Request]
    req([User runs command])
  end

  subgraph Routing[Domain Detection]
    detect{Detect domain keywords}
    detect -->|database, schema| db[Database Expert]
    detect -->|API, endpoint| api[API Expert]
    detect -->|component, styling| ui[UI Expert]
    detect -->|test, coverage| test[Testing Expert]
    detect -->|deploy, CI| ci[CI Expert]
  end

  subgraph Expert[Agent Expert]
    load[Load expertise.yaml]
    plan[Plan with mental models]
    build[Build solution]
    improve[Update expertise]
  end

  req --> detect
  db & api & ui & test & ci --> load
  load --> plan --> build --> improve
  improve -.->|learns| load
```

---

## Three-Step Workflow

Every Agent Expert follows the same workflow pattern:

```mermaid
flowchart LR
  accTitle: Agent Expert Three-Step Workflow
  accDescr: Plan, Build, Self-Improve cycle

  subgraph Step1[1. PLAN]
    read[Read expertise.yaml]
    analyze[Analyze codebase]
    design[Design approach]
  end

  subgraph Step2[2. BUILD]
    implement[Implement solution]
    test[Run tests]
    validate[Validate output]
  end

  subgraph Step3[3. SELF-IMPROVE]
    reflect[Reflect on work]
    extract[Extract learnings]
    update[Update expertise.yaml]
  end

  read --> analyze --> design
  design --> implement --> test --> validate
  validate --> reflect --> extract --> update
  update -.->|next task| read
```

---

## Expertise File Structure

Each domain expert has a dedicated directory with mental models and workflows:

```mermaid
flowchart TD
  accTitle: Expertise File Structure
  accDescr: Shows the file organization for each domain expert

  experts[experts/]

  subgraph Domain[database/]
    yaml[expertise.yaml<br/>Mental models, patterns, learnings]
    question[question.md<br/>Q&A workflow]
    workflow[workflow.md<br/>Implementation workflow]
    improve[self-improve.md<br/>Learning protocol]
  end

  subgraph Templates[templates/]
    t1[expertise-template.yaml]
    t2[workflow-template.md]
    t3[question-template.md]
    t4[self-improve-template.md]
  end

  experts --> Domain
  experts --> Templates
```

### expertise.yaml Schema

```yaml
domain: database
description: Database and data layer specialist

mental_models:
  - name: Schema Design Patterns
    description: Normalization, indexing, constraints
    key_files:
      - src/db/schema.ts
      - prisma/schema.prisma
    patterns:
      - Use UUID for primary keys
      - Add indexes on foreign keys
    anti_patterns:
      - N+1 queries
      - Missing indexes on frequently queried columns

learnings:
  - date: 2025-12-16
    context: Implemented user authentication tables
    insight: Always add soft-delete columns for audit trails
    files_involved:
      - prisma/migrations/001_users.sql
```

---

## Domain Expert Routing

The `/AgileFlow:babysit` command automatically routes requests to appropriate domain experts:

```mermaid
flowchart TD
  accTitle: Domain Expert Routing
  accDescr: Shows how user requests are routed to domain experts based on keywords

  user([User Request])

  user --> analyze{Analyze keywords}

  analyze -->|"database, SQL, schema,<br/>migration, query"| db[/AgileFlow:agents:database]
  analyze -->|"API, endpoint, REST,<br/>GraphQL, route"| api[/AgileFlow:agents:api]
  analyze -->|"component, styling,<br/>CSS, theme, UI"| ui[/AgileFlow:agents:ui]
  analyze -->|"test, spec, coverage,<br/>mock, fixture"| test[/AgileFlow:agents:testing]
  analyze -->|"CI, pipeline, deploy,<br/>workflow, action"| ci[/AgileFlow:agents:ci]
  analyze -->|"security, auth, OWASP,<br/>vulnerability"| sec[/AgileFlow:agents:security]
  analyze -->|"performance, optimize,<br/>profile, cache"| perf[/AgileFlow:agents:performance]

  db & api & ui & test & ci & sec & perf --> expert[Expert executes with expertise.yaml]
```

---

## Self-Improvement Protocol

After completing work, agents update their expertise files:

```mermaid
sequenceDiagram
  accTitle: Self-Improvement Protocol
  accDescr: Shows how an agent updates its expertise after completing work

  participant User
  participant Agent as Domain Expert
  participant Expertise as expertise.yaml
  participant Codebase

  User->>Agent: Request implementation
  Agent->>Expertise: Load mental models
  Expertise-->>Agent: Patterns, anti-patterns, learnings

  Agent->>Codebase: Analyze existing code
  Codebase-->>Agent: Current patterns, structure

  Agent->>Agent: Plan using mental models
  Agent->>Codebase: Implement solution
  Agent->>Codebase: Run tests

  Note over Agent: SELF-IMPROVE PHASE

  Agent->>Agent: Reflect on work done
  Agent->>Agent: Extract new learnings
  Agent->>Expertise: Update with new insights

  Agent-->>User: Work complete + learnings recorded
```

---

## Multi-Expert Orchestration

For complex cross-domain tasks, multiple experts can be deployed in parallel:

```mermaid
flowchart TD
  accTitle: Multi-Expert Orchestration
  accDescr: Shows how multiple experts analyze the same problem and synthesize results

  task([Complex Task])

  task --> orchestrator[Multi-Expert Orchestrator]

  orchestrator --> |spawn| e1[Database Expert]
  orchestrator --> |spawn| e2[API Expert]
  orchestrator --> |spawn| e3[Security Expert]

  e1 --> r1[DB Analysis]
  e2 --> r2[API Analysis]
  e3 --> r3[Security Analysis]

  r1 & r2 & r3 --> synthesize[Synthesize Results]

  synthesize --> confidence{Agreement Level}

  confidence -->|3+ agree| high[High Confidence]
  confidence -->|2 agree| medium[Medium Confidence]
  confidence -->|1 only| low[Low Confidence]

  high & medium & low --> output([Unified Recommendation])
```

---

## State Diagram: Expert Lifecycle

```mermaid
stateDiagram-v2
  accTitle: Expert Lifecycle States
  accDescr: Shows the states an expert goes through during task execution

  [*] --> Idle

  Idle --> Loading: Task assigned
  Loading --> Planning: Expertise loaded

  Planning --> Building: Plan approved
  Planning --> Idle: Plan rejected

  Building --> Validating: Implementation done
  Validating --> Building: Tests failed
  Validating --> Improving: Tests passed

  Improving --> Idle: Learnings saved

  Idle --> [*]: Session ends
```

---

## Integration Points

```mermaid
flowchart LR
  accTitle: Agent Expert Integration Points
  accDescr: Shows how the expert system integrates with other AgileFlow components

  subgraph Commands[Slash Commands]
    babysit[/babysit]
    multiexp[/multi-expert]
    validate[/validate-expertise]
  end

  subgraph Experts[Expert System]
    routing[Domain Routing]
    expertise[Expertise Files]
    learning[Self-Improvement]
  end

  subgraph Agents[Specialized Agents]
    db[database]
    api[api]
    ui[ui]
    more[...25 domains]
  end

  babysit --> routing
  multiexp --> routing
  validate --> expertise

  routing --> Agents
  Agents --> expertise
  Agents --> learning
  learning --> expertise
```

---

## Key Benefits

1. **Accumulated Knowledge**: Expertise files grow smarter over time
2. **Consistent Patterns**: Mental models enforce best practices
3. **Reduced Mistakes**: Anti-patterns prevent known issues
4. **Domain Specialization**: Each expert deeply understands their area
5. **Parallel Analysis**: Multi-expert mode for complex decisions

---

## Related Documentation

- [Multi-Expert Orchestration](./multi-expert-orchestration.md)
- [AgileFlow CLI Overview](./agileflow-cli-overview.md)
- [Research: Agent Experts](../10-research/20251216-agent-experts-self-improving-agents.md)
