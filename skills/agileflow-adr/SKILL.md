---
name: agileflow-adr
description: Detects architectural or technical decisions in conversations and formats them as Architecture Decision Records in docs/03-decisions/. Loads when discussing technology choices, architecture patterns, or trade-offs.
allowed-tools: Read, Write, Edit, Glob
---

# AgileFlow ADR (Architecture Decision Records)

## Purpose

This skill automatically captures architectural and technical decisions from conversations and formats them as formal Architecture Decision Records (ADRs) in `docs/03-decisions/`.

## When This Skill Activates

Load this skill when:
- Discussing technology choices ("Should we use PostgreSQL or MongoDB?")
- Debating architecture patterns ("REST vs GraphQL")
- Making framework decisions ("React vs Vue")
- Discussing infrastructure choices ("AWS vs GCP")
- Evaluating trade-offs between options
- User mentions "decision", "choose", "architecture", "trade-off"

## ADR Format (MADR - Markdown Architecture Decision Records)

```markdown
# [ADR-###] Title

**Date**: YYYY-MM-DD
**Status**: Proposed | Accepted | Deprecated | Superseded
**Deciders**: Names of people involved
**Tags**: architecture, database, api, etc.

## Context and Problem Statement

[Describe the context and the problem that led to this decision.
What are we trying to solve? Why is this decision necessary?]

## Decision Drivers

- [Driver 1: e.g., Performance requirements]
- [Driver 2: e.g., Team expertise]
- [Driver 3: e.g., Cost constraints]

## Considered Options

- [Option 1]
- [Option 2]
- [Option 3]

## Decision Outcome

**Chosen option**: [Option X]

**Justification**: [Why was this option chosen? What makes it the best fit for our context?]

### Positive Consequences

- [Good outcome 1]
- [Good outcome 2]

### Negative Consequences

- [Bad outcome 1]
- [Bad outcome 2 - with mitigation plan if possible]

## Pros and Cons of the Options

### [Option 1]

**Pros**:
- [Pro 1]
- [Pro 2]

**Cons**:
- [Con 1]
- [Con 2]

### [Option 2]

**Pros**:
- [Pro 1]
- [Pro 2]

**Cons**:
- [Con 1]
- [Con 2]

### [Option 3]

**Pros**:
- [Pro 1]
- [Pro 2]

**Cons**:
- [Con 1]
- [Con 2]

## Links

- [Related ADRs]
- [Relevant documentation]
- [External resources]

## Notes

- [Additional information]
- [Implementation notes]
- [Review date if applicable]
```

## Workflow

1. **Detect decision discussion**: User is debating options or asking "which should we use?"

2. **Ask clarifying questions** if needed:
   - "What problem are you trying to solve?"
   - "What options are you considering?"
   - "What are your constraints (cost, time, expertise)?"

3. **Extract decision elements**:
   - Context/problem
   - Options being considered
   - Trade-offs for each option
   - Decision drivers (requirements, constraints)

4. **Read existing ADRs**:
   - Check `docs/03-decisions/` for numbering
   - Look for related decisions

5. **Generate ADR**:
   - Create file: `docs/03-decisions/ADR-###-descriptive-title.md`
   - Fill in all sections with gathered information
   - Mark status as "Proposed" unless decision is final

6. **Confirm with user**: Show the ADR and ask for corrections

## ADR Statuses

- **Proposed**: Under consideration, not yet decided
- **Accepted**: Decision made and approved
- **Deprecated**: No longer relevant (but kept for history)
- **Superseded**: Replaced by a newer decision (link to new ADR)

## Decision Drivers (Common Examples)

- **Performance requirements** (latency, throughput)
- **Scalability needs** (expected growth)
- **Team expertise** (learning curve)
- **Cost constraints** (budget, licensing)
- **Time to market** (urgency)
- **Maintenance burden** (long-term support)
- **Ecosystem maturity** (libraries, community)
- **Security requirements** (compliance, encryption)
- **Integration needs** (existing systems)

## Quality Checklist

Before creating ADR:
- [ ] Problem statement is clear and specific
- [ ] At least 2 options were considered
- [ ] Each option has pros and cons listed
- [ ] Decision drivers are explicitly stated
- [ ] Chosen option has clear justification
- [ ] Consequences (both positive and negative) are documented
- [ ] File name follows pattern: ADR-###-descriptive-title.md
- [ ] Status is appropriate (Proposed/Accepted)

## Examples

See `examples/` directory for well-formed ADRs across different domains.

## Tags (Common)

- `architecture` - Overall system design
- `database` - Data storage choices
- `api` - API design decisions
- `infrastructure` - Cloud, hosting, deployment
- `frontend` - UI framework, state management
- `backend` - Server framework, language
- `security` - Authentication, encryption
- `testing` - Test strategy, tools
- `cicd` - CI/CD pipeline choices
- `monitoring` - Observability tools

## Linking ADRs

When decisions build on or replace each other:

```markdown
## Links

- Supersedes [ADR-042: Use REST API](./ADR-042-use-rest-api.md)
- Related to [ADR-056: API Authentication](./ADR-056-api-authentication.md)
- Informs [ADR-073: Rate Limiting Strategy](./ADR-073-rate-limiting.md)
```

## Integration with Other Skills

- **agileflow-story-writer**: ADRs inform technical notes in stories
- **agileflow-tech-debt**: Negative consequences become tech debt items
- **agileflow-changelog**: Major decisions appear in changelog

## Updating ADRs

ADRs are immutable once accepted - don't edit them! Instead:
- Create a new ADR that supersedes the old one
- Update status to "Superseded by ADR-XXX"

## Notes

- Capture decisions even if they seem small - they provide context later
- Be honest about negative consequences - helps with future decisions
- Include who made the decision (deciders) - accountability matters
- Date decisions - context changes over time
- Keep ADRs focused - one decision per ADR
