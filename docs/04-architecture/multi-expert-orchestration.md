# Multi-Expert Orchestration Architecture

Multi-Expert Orchestration deploys multiple domain experts in parallel to analyze complex, cross-domain problems and synthesize their findings into unified recommendations.

---

## Overview

```mermaid
flowchart TD
  accTitle: Multi-Expert Orchestration Overview
  accDescr: Shows how multiple experts analyze a problem in parallel

  problem([Complex Problem])

  problem --> analyze[Analyze Problem Domain]

  analyze --> select{Select Experts<br/>3-5 domains}

  select --> spawn[Spawn Experts in Parallel]

  subgraph Parallel[Parallel Execution]
    direction LR
    e1[Expert 1]
    e2[Expert 2]
    e3[Expert 3]
    e4[Expert 4]
    e5[Expert 5]
  end

  spawn --> Parallel

  Parallel --> collect[Collect Results]
  collect --> synthesize[Synthesize Findings]
  synthesize --> output([Unified Recommendation])
```

---

## When to Use Multi-Expert

```mermaid
flowchart TD
  accTitle: Multi-Expert Decision Tree
  accDescr: When to use multi-expert vs single expert

  start{Task Type?}

  start -->|Single domain| single[Use Single Expert]
  start -->|Cross-domain| check{How complex?}

  check -->|2 domains| pair[Consider Pair]
  check -->|3+ domains| multi[Use Multi-Expert]
  check -->|Architectural| multi

  single --> done([Execute])
  pair --> done
  multi --> orchestrate[Multi-Expert Orchestration]
  orchestrate --> done
```

**Use Multi-Expert when:**
- Task spans 3+ domains (e.g., "Add user authentication" touches DB, API, UI, Security)
- Making architectural decisions that affect multiple systems
- Need diverse perspectives on a complex problem
- Want to validate an approach from multiple angles

---

## Expert Selection Process

```mermaid
sequenceDiagram
  accTitle: Expert Selection Process
  accDescr: How the orchestrator selects which experts to deploy

  participant User
  participant Orch as Orchestrator
  participant Analyzer as Domain Analyzer
  participant Registry as Expert Registry

  User->>Orch: Submit complex task
  Orch->>Analyzer: Analyze task keywords

  Analyzer->>Analyzer: Extract domain signals
  Note over Analyzer: "authentication" → security, api<br/>"database schema" → database<br/>"login form" → ui

  Analyzer-->>Orch: Domain list [security, api, database, ui]

  Orch->>Registry: Get experts for domains
  Registry-->>Orch: Available experts

  Orch->>Orch: Select top 3-5 by relevance
  Orch-->>User: Selected: security, api, database
```

---

## Parallel Execution Pattern

```mermaid
flowchart LR
  accTitle: Parallel Execution Pattern
  accDescr: Shows how experts execute in parallel using Task tool

  task([Task Description])

  task --> t1[Task Tool<br/>run_in_background: true]
  task --> t2[Task Tool<br/>run_in_background: true]
  task --> t3[Task Tool<br/>run_in_background: true]

  t1 --> e1[Security Expert]
  t2 --> e2[API Expert]
  t3 --> e3[Database Expert]

  e1 --> r1[Security Analysis]
  e2 --> r2[API Analysis]
  e3 --> r3[Database Analysis]

  r1 & r2 & r3 --> wait[TaskOutput<br/>block: true]

  wait --> synthesize[Synthesize]
```

---

## Synthesis Process

```mermaid
flowchart TD
  accTitle: Result Synthesis Process
  accDescr: How individual expert results are synthesized

  subgraph Results[Expert Results]
    r1[Security: Use JWT + rate limiting]
    r2[API: RESTful with versioning]
    r3[Database: Users table with indexes]
  end

  Results --> compare[Compare Findings]

  compare --> agree{Agreement?}

  agree -->|All agree| high[High Confidence]
  agree -->|Partial| medium[Medium Confidence]
  agree -->|Disagree| low[Low Confidence]

  subgraph Output[Synthesis Output]
    findings[Key Findings]
    insights[Unique Insights]
    conflicts[Areas of Disagreement]
    recommendation[Unified Recommendation]
  end

  high & medium & low --> Output
```

---

## Confidence Scoring

```mermaid
flowchart LR
  accTitle: Confidence Scoring System
  accDescr: How confidence is calculated from expert agreement

  subgraph Experts[5 Experts Deployed]
    e1[Expert 1: A]
    e2[Expert 2: A]
    e3[Expert 3: A]
    e4[Expert 4: B]
    e5[Expert 5: B]
  end

  Experts --> count[Count Agreement]

  count --> score{Score}

  score -->|"3+ same (A=3)"| high["HIGH (60%+)<br/>Strong consensus"]
  score -->|"2 same"| medium["MEDIUM (40-59%)<br/>Partial consensus"]
  score -->|"All different"| low["LOW (<40%)<br/>No consensus"]
```

| Experts Agree | Confidence | Action |
|---------------|------------|--------|
| 3+ of 5 | HIGH | Proceed with recommendation |
| 2 of 5 | MEDIUM | Review disagreements |
| 1 each | LOW | Manual review required |

---

## Output Format

```mermaid
flowchart TD
  accTitle: Multi-Expert Output Structure
  accDescr: Structure of the synthesized output

  output[Multi-Expert Analysis]

  output --> meta[Metadata<br/>Experts deployed, confidence]
  output --> findings[Key Findings<br/>Points all experts agree on]
  output --> insights[Unique Insights<br/>Valuable points from individuals]
  output --> conflicts[Disagreements<br/>Where experts differ]
  output --> recommendation[Recommendation<br/>Synthesized approach]
  output --> actions[Action Items<br/>Next steps]
```

### Example Output

```markdown
## Multi-Expert Analysis: User Authentication System

**Experts Deployed**: security, api, database, ui
**Overall Confidence**: HIGH (3/4 agree on core approach)

### Key Findings (High Confidence)
- Use JWT tokens with 15-minute expiry
- Store refresh tokens in httpOnly cookies
- Add rate limiting on auth endpoints

### Unique Insights
- **Security**: Consider adding device fingerprinting
- **Database**: Use partial indexes on active sessions

### Areas of Disagreement
- Token storage: Security prefers cookies, UI prefers localStorage
- **Resolution**: Use httpOnly cookies (security wins for auth)

### Recommendation
Implement JWT-based auth with:
1. Access tokens (15min) in memory
2. Refresh tokens (7d) in httpOnly cookies
3. Rate limiting: 5 attempts/minute

### Action Items
- [ ] Create users table migration
- [ ] Implement /auth/login endpoint
- [ ] Add JWT middleware
- [ ] Build login form component
```

---

## Sequence: Full Orchestration

```mermaid
sequenceDiagram
  accTitle: Full Multi-Expert Orchestration Sequence
  accDescr: Complete flow from request to synthesized output

  actor User
  participant Orch as Orchestrator
  participant Task as Task Tool
  participant E1 as Security Expert
  participant E2 as API Expert
  participant E3 as Database Expert
  participant Synth as Synthesizer

  User->>Orch: /multi-expert TASK="Add auth system"

  Orch->>Orch: Analyze domains needed
  Note over Orch: Domains: security, api, database

  par Spawn Experts
    Orch->>Task: spawn security (background)
    Task->>E1: Execute analysis
    and
    Orch->>Task: spawn api (background)
    Task->>E2: Execute analysis
    and
    Orch->>Task: spawn database (background)
    Task->>E3: Execute analysis
  end

  E1-->>Task: Security findings
  E2-->>Task: API findings
  E3-->>Task: Database findings

  Orch->>Task: TaskOutput (wait all)
  Task-->>Orch: All results

  Orch->>Synth: Synthesize findings
  Synth->>Synth: Compare & score
  Synth->>Synth: Generate recommendation

  Synth-->>Orch: Unified analysis
  Orch-->>User: Multi-Expert Report
```

---

## Expert Registry

Available experts for orchestration:

| Domain | Expert | Specialization |
|--------|--------|----------------|
| database | `/AgileFlow:agents:database` | Schema, queries, migrations |
| api | `/AgileFlow:agents:api` | Endpoints, REST, GraphQL |
| ui | `/AgileFlow:agents:ui` | Components, styling, UX |
| security | `/AgileFlow:agents:security` | Auth, OWASP, vulnerabilities |
| testing | `/AgileFlow:agents:testing` | Unit, integration, E2E |
| performance | `/AgileFlow:agents:performance` | Optimization, caching |
| devops | `/AgileFlow:agents:devops` | CI/CD, deployment |
| documentation | `/AgileFlow:agents:documentation` | API docs, guides |

---

## Related Documentation

- [Agent Expert System](./agent-expert-system.md)
- [AgileFlow CLI Overview](./agileflow-cli-overview.md)
- [Command: /multi-expert](../../.agileflow/commands/multi-expert.md)
