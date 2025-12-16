# AgileFlow CLI Architecture Overview

AgileFlow is an agile workflow system for Claude Code that provides slash commands, specialized agents, and self-improving experts.

---

## System Architecture

![Diagram 1](images/agileflow-cli-overview-1.svg)


---

## Installation Structure

When you run `npx agileflow setup`, this structure is created:

![Diagram 2](images/agileflow-cli-overview-2.svg)


---

## Command Flow

![Diagram 3](images/agileflow-cli-overview-3.svg)


---

## Component Layers

![Diagram 4](images/agileflow-cli-overview-4.svg)


---

## Data Flow

![Diagram 5](images/agileflow-cli-overview-5.svg)


---

## State Management

![Diagram 6](images/agileflow-cli-overview-6.svg)


---

## Agent Communication

![Diagram 7](images/agileflow-cli-overview-7.svg)


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

![Diagram 8](images/agileflow-cli-overview-8.svg)


---

## Related Documentation

- [Agent Expert System](./agent-expert-system.md)
- [Multi-Expert Orchestration](./multi-expert-orchestration.md)
- [Command & Agent Flow](./command-agent-flow.md)
- [Monorepo Setup](./monorepo-setup.md)
