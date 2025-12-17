# Agent Expert System Architecture

**Research**: See [Agent Experts Research](../10-research/20251216-agent-experts-self-improving-agents.md)

The Agent Expert System enables self-improving AI agents that learn from their work and accumulate domain expertise over time.

---

## Overview

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/agent-expert-system-1.dark.svg">
  <img alt="Diagram 1" src="images/agent-expert-system-1.light.svg">
</picture>


---

## Three-Step Workflow

Every Agent Expert follows the same workflow pattern:

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/agent-expert-system-2.dark.svg">
  <img alt="Diagram 2" src="images/agent-expert-system-2.light.svg">
</picture>


---

## Expertise File Structure

Each domain expert has a dedicated directory with mental models and workflows:

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/agent-expert-system-3.dark.svg">
  <img alt="Diagram 3" src="images/agent-expert-system-3.light.svg">
</picture>


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

The `/agileflow:babysit` command automatically routes requests to appropriate domain experts:

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/agent-expert-system-4.dark.svg">
  <img alt="Diagram 4" src="images/agent-expert-system-4.light.svg">
</picture>


---

## Self-Improvement Protocol

After completing work, agents update their expertise files:

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/agent-expert-system-5.dark.svg">
  <img alt="Diagram 5" src="images/agent-expert-system-5.light.svg">
</picture>


---

## Multi-Expert Orchestration

For complex cross-domain tasks, multiple experts can be deployed in parallel:

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/agent-expert-system-6.dark.svg">
  <img alt="Diagram 6" src="images/agent-expert-system-6.light.svg">
</picture>


---

## State Diagram: Expert Lifecycle

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/agent-expert-system-7.dark.svg">
  <img alt="Diagram 7" src="images/agent-expert-system-7.light.svg">
</picture>


---

## Integration Points

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/agent-expert-system-8.dark.svg">
  <img alt="Diagram 8" src="images/agent-expert-system-8.light.svg">
</picture>


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
