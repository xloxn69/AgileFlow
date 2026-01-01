# Agent Expert System Architecture

**Research**: See [Agent Experts Research](../10-research/20251216-agent-experts-self-improving-agents.md)

The Agent Expert System enables self-improving AI agents that learn from their work and accumulate domain expertise over time.

---

## Overview

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/agent-expert-system-1.dark.svg">
  <img alt="Agent Expert System Overview" src="images/agent-expert-system-1.light.svg">
</picture>

> High-level architecture showing 25 domain experts, each with expertise files (mental models), and their relationship to the orchestration layer.

---

## Three-Step Workflow

Every Agent Expert follows the same workflow pattern:

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/agent-expert-system-2.dark.svg">
  <img alt="Three-Step Workflow" src="images/agent-expert-system-2.light.svg">
</picture>

> The core workflow: (1) Load expertise, (2) Execute task with validated knowledge, (3) Self-improve by updating expertise file.

---

## Expertise File Structure

Each domain expert has a dedicated directory with mental models and workflows:

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/agent-expert-system-3.dark.svg">
  <img alt="Expertise File Structure" src="images/agent-expert-system-3.light.svg">
</picture>

> File structure per expert: expertise.yaml (knowledge), question.md (Q&A workflow), self-improve.md (update protocol), workflow.md (full task chain).

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
  <img alt="Domain Expert Routing" src="images/agent-expert-system-4.light.svg">
</picture>

> Babysit analyzes user request, detects domain (UI, API, database, etc.), and spawns appropriate expert with relevant expertise pre-loaded.

---

## Self-Improvement Protocol

After completing work, agents update their expertise files:

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/agent-expert-system-5.dark.svg">
  <img alt="Self-Improvement Protocol" src="images/agent-expert-system-5.light.svg">
</picture>

> After task completion: agent reflects on what was learned, updates expertise.yaml with new patterns/anti-patterns, adds to learnings section.

---

## Automatic Self-Improvement (Stop Hook)

As of v2.75.0, expertise updates happen **automatically** via the Stop hook:

```
┌─────────────────────────────────────────────────────────────┐
│                  AUTO SELF-IMPROVEMENT                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Claude stops working                                        │
│         ↓                                                    │
│  Stop Hook: auto-self-improve.js                            │
│         ↓                                                    │
│  ┌─────────────────────────────────────────────┐            │
│  │ 1. Get git diff (what changed?)             │            │
│  │ 2. Detect domain from file patterns         │            │
│  │    - *.test.* → testing                     │            │
│  │    - /api/ → api                            │            │
│  │    - schema, migration → database           │            │
│  │ 3. Generate learning summary                │            │
│  │ 4. Append to expertise.yaml                 │            │
│  └─────────────────────────────────────────────┘            │
│         ↓                                                    │
│  ✓ Auto-learned: database                                   │
│    → Updated database/expertise.yaml                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Auto-Generated Learning Entry

```yaml
learnings:
  - date: "2026-01-01"
    auto_generated: true
    context: "Session work - database domain"
    insight: "Modified 2 code file(s) in: src/db. Added migration."
    files_touched:
      - src/db/schema.ts
      - src/db/migrations/001_users.ts
```

### Domain Detection Patterns

| File Pattern | Detected Domain |
|--------------|-----------------|
| `*.test.*`, `*.spec.*` | testing |
| `/api/`, `controller`, `route` | api |
| `schema`, `migration`, `prisma` | database |
| `component`, `.tsx`, `.jsx` | ui |
| `auth`, `password`, `token` | security |
| `.github/workflows` | ci |
| `*.md`, `docs/` | documentation |

### Key Benefits

| Before (Manual) | After (Automatic) |
|-----------------|-------------------|
| Agent must remember to update | Updates happen automatically |
| Often skipped or forgotten | Always happens on stop |
| Requires explicit `/self-improve` | Zero manual intervention |
| Inconsistent learning capture | Consistent, structured entries |

---

## Multi-Expert Orchestration

For complex cross-domain tasks, multiple experts can be deployed in parallel:

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/agent-expert-system-6.dark.svg">
  <img alt="Multi-Expert Orchestration" src="images/agent-expert-system-6.light.svg">
</picture>

> Orchestrator spawns multiple experts (e.g., API + Security + Database), collects responses, and synthesizes into unified answer.

---

## State Diagram: Expert Lifecycle

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/agent-expert-system-7.dark.svg">
  <img alt="Expert Lifecycle States" src="images/agent-expert-system-7.light.svg">
</picture>

> Expert states: Idle → Loading Expertise → Validating → Executing → Self-Improving → Idle. Shows complete lifecycle with state transitions.

---

## Integration Points

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/agent-expert-system-8.dark.svg">
  <img alt="Integration Points" src="images/agent-expert-system-8.light.svg">
</picture>

> How experts integrate with other AgileFlow components: babysit spawning, status.json updates, bus/log.jsonl messages, and file system operations.

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
- [Ralph Loop](./ralph-loop.md) - Autonomous execution with auto self-improvement
- [AgileFlow CLI Overview](./agileflow-cli-overview.md)
- [Research: Agent Experts](../10-research/20251216-agent-experts-self-improving-agents.md)
