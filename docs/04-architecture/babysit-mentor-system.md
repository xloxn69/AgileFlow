# Babysit Mentor System Architecture

The `/AgileFlow:babysit` command is an end-to-end implementation mentor that guides users through feature development from idea to PR.

---

## Overview

```mermaid
flowchart TD
  accTitle: Babysit Mentor System Overview
  accDescr: Shows how babysit guides users through implementation

  user([User Request])

  user --> babysit[AgileFlow-babysit]

  babysit --> understand[Understand Request]
  understand --> research[Research Codebase]
  research --> plan[Create Implementation Plan]

  plan --> check{Existing Story/Epic?}

  check -->|No| create[Create Story/Epic]
  check -->|Yes| link[Link to Existing]

  create --> implement
  link --> implement[Guide Implementation]

  implement --> expert{Need Domain Expert?}

  expert -->|Yes| spawn[Spawn Expert Agent]
  expert -->|No| continue[Continue Mentoring]

  spawn --> work[Expert Does Work]
  work --> continue

  continue --> review[Review & Iterate]
  review --> pr[Create PR]
  pr --> done([Feature Complete])
```

---

## Core Responsibilities

```mermaid
flowchart LR
  accTitle: Babysit Core Responsibilities
  accDescr: The five main responsibilities of the babysit command

  babysit[Babysit Mentor]

  babysit --> r1[Research<br/>Understand codebase]
  babysit --> r2[Plan<br/>Break into steps]
  babysit --> r3[Route<br/>Delegate to experts]
  babysit --> r4[Track<br/>Update status.json]
  babysit --> r5[Guide<br/>Help user through PR]
```

---

## Domain Expert Routing

Babysit automatically detects domains from user requests and spawns appropriate experts:

```mermaid
flowchart TD
  accTitle: Domain Detection and Routing
  accDescr: How babysit routes requests to domain experts

  request([User Request])

  request --> analyze[Analyze Keywords]

  analyze --> detect{Domains Detected}

  detect --> single{Single Domain?}
  detect --> multi{Multiple Domains?}

  single -->|database| db[AgileFlow-agents:database]
  single -->|API| api[AgileFlow-agents:api]
  single -->|UI| ui[AgileFlow-agents:ui]
  single -->|testing| test[AgileFlow-agents:testing]
  single -->|security| sec[AgileFlow-agents:security]

  multi --> orchestrate[Multi-Expert Mode]
  orchestrate --> spawn[Spawn 3-5 Experts]

  db & api & ui & test & sec --> execute[Expert Executes]
  spawn --> synthesize[Synthesize Results]

  execute --> result([Return to Babysit])
  synthesize --> result
```

### Domain Keyword Map

| Keywords | Domain Expert |
|----------|---------------|
| database, schema, SQL, migration, query | database |
| API, endpoint, REST, GraphQL, route | api |
| component, styling, CSS, theme, layout | ui |
| test, spec, coverage, mock, fixture | testing |
| auth, security, OWASP, vulnerability | security |
| CI, pipeline, deploy, workflow | ci |
| performance, optimize, cache, profile | performance |
| docs, README, guide, tutorial | documentation |

---

## Workflow Sequence

```mermaid
sequenceDiagram
  accTitle: Babysit Workflow Sequence
  accDescr: Full sequence of babysit guiding a feature implementation

  actor User
  participant Babysit as /babysit
  participant Research as Codebase Research
  participant Story as Story Management
  participant Expert as Domain Expert
  participant PR as PR Creation

  User->>Babysit: "Add user authentication"

  Note over Babysit: UNDERSTAND PHASE
  Babysit->>Research: Analyze codebase
  Research-->>Babysit: Found: Express app, no auth yet

  Note over Babysit: PLAN PHASE
  Babysit->>User: Here's my plan:<br/>1. Add users table<br/>2. Create auth endpoints<br/>3. Add login UI<br/>4. Add JWT middleware

  User->>Babysit: Looks good, proceed

  Note over Babysit: TRACK PHASE
  Babysit->>Story: Create EP-0001 + stories
  Story-->>Babysit: Created US-0001 to US-0004

  Note over Babysit: IMPLEMENT PHASE
  loop For each story
    Babysit->>Expert: Route to domain expert
    Expert->>Expert: Execute with expertise
    Expert-->>Babysit: Work complete
    Babysit->>Story: Update status
    Babysit->>User: Progress update
  end

  Note over Babysit: FINALIZE PHASE
  Babysit->>PR: Create pull request
  PR-->>Babysit: PR #123 created
  Babysit-->>User: Done! PR ready for review
```

---

## State Management

```mermaid
stateDiagram-v2
  accTitle: Babysit Session States
  accDescr: States of a babysit mentoring session

  [*] --> Listening: User starts babysit

  Listening --> Understanding: User describes feature
  Understanding --> Researching: Analyze codebase

  Researching --> Planning: Research complete
  Planning --> AwaitingApproval: Plan presented

  AwaitingApproval --> Planning: User wants changes
  AwaitingApproval --> Tracking: User approves

  Tracking --> Implementing: Story/Epic created
  Implementing --> Routing: Domain detected

  Routing --> ExpertWorking: Expert spawned
  ExpertWorking --> Implementing: Expert done

  Implementing --> Reviewing: All steps complete
  Reviewing --> Implementing: Changes needed
  Reviewing --> CreatingPR: Ready for PR

  CreatingPR --> [*]: PR created
```

---

## Multi-Domain Handling

When a request spans multiple domains, babysit can either:
1. **Sequential**: Route to experts one at a time
2. **Parallel**: Use multi-expert orchestration

```mermaid
flowchart TD
  accTitle: Multi-Domain Decision
  accDescr: How babysit decides between sequential and parallel execution

  request([Complex Request])

  request --> analyze{How many domains?}

  analyze -->|1-2| sequential[Sequential Execution]
  analyze -->|3+| parallel[Parallel Execution]

  sequential --> s1[Expert 1]
  s1 --> s2[Expert 2]
  s2 --> done

  parallel --> p[Multi-Expert Orchestration]
  p --> e1[Expert 1] & e2[Expert 2] & e3[Expert 3]
  e1 & e2 & e3 --> synthesize[Synthesize]
  synthesize --> done([Continue])
```

---

## Integration Points

```mermaid
flowchart LR
  accTitle: Babysit Integration Points
  accDescr: How babysit integrates with other AgileFlow components

  babysit[/babysit]

  babysit --> story[/story<br/>Create stories]
  babysit --> epic[/epic<br/>Create epics]
  babysit --> status[/status<br/>Update progress]
  babysit --> agents[Domain Agents<br/>Delegate work]
  babysit --> multiexp[/multi-expert<br/>Complex analysis]
  babysit --> pr[/pr<br/>Create PR]
  babysit --> verify[/verify<br/>Run tests]
```

---

## When to Use Babysit

```mermaid
flowchart TD
  accTitle: When to Use Babysit
  accDescr: Decision tree for when babysit is appropriate

  start{What do you need?}

  start -->|End-to-end feature| babysit[Use /babysit]
  start -->|Single domain task| agent[Use specific agent]
  start -->|Quick question| direct[Ask directly]
  start -->|Complex analysis| multi[Use /multi-expert]

  babysit --> examples1["Add user authentication"<br/>"Implement payment system"<br/>"Build notification feature"]

  agent --> examples2["Fix database query"<br/>"Add API endpoint"<br/>"Style a component"]
```

**Use babysit for:**
- Features that span multiple domains
- When you want guided, step-by-step implementation
- When you need story/epic tracking
- When you want a PR at the end

**Don't use babysit for:**
- Quick single-domain tasks (use specific agent)
- Pure research/analysis (use /multi-expert)
- Simple questions (ask directly)

---

## Example Session

```
User: /AgileFlow:babysit I want to add a dark mode toggle

Babysit: I'll help you implement dark mode. Let me research your codebase...

Found:
- React app with Tailwind CSS
- No existing theme system
- Components in src/components/

Here's my implementation plan:
1. Add theme context (React Context API)
2. Create theme toggle component
3. Update Tailwind config for dark variants
4. Apply dark classes to existing components

This will need:
- US-0001: Theme context and provider
- US-0002: Theme toggle component
- US-0003: Tailwind dark mode config
- US-0004: Apply to existing components

Shall I proceed? (YES to continue, or suggest changes)

User: YES

Babysit: Creating epic EP-0010 "Dark Mode Support"...
Creating stories US-0051 through US-0054...

Starting with US-0051: Theme Context
[Routes to UI Expert]

UI Expert: Created src/contexts/ThemeContext.tsx with:
- ThemeProvider component
- useTheme hook
- localStorage persistence

Babysit: US-0051 complete. Moving to US-0052...

[Continues through all stories]

Babysit: All stories complete! Creating PR...

PR #45 created: "feat: Add dark mode toggle"
- 4 commits
- 8 files changed
- Tests passing

Ready for review!
```

---

## Related Documentation

- [Agent Expert System](./agent-expert-system.md)
- [Multi-Expert Orchestration](./multi-expert-orchestration.md)
- [Command & Agent Flow](./command-agent-flow.md)
