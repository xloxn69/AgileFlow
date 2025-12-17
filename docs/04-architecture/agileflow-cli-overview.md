# AgileFlow CLI Architecture Overview

AgileFlow is an agile workflow system for Claude Code that provides slash commands, specialized agents, and self-improving experts.

---

## System Architecture

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/agileflow-cli-overview-1.dark.svg">
  <img alt="Diagram 1" src="images/agileflow-cli-overview-1.light.svg">
</picture>


---

## Installation Structure

When you run `npx agileflow setup`, this structure is created:

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/agileflow-cli-overview-2.dark.svg">
  <img alt="Diagram 2" src="images/agileflow-cli-overview-2.light.svg">
</picture>


---

## Command Flow

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/agileflow-cli-overview-3.dark.svg">
  <img alt="Diagram 3" src="images/agileflow-cli-overview-3.light.svg">
</picture>


---

## Component Layers

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/agileflow-cli-overview-4.dark.svg">
  <img alt="Diagram 4" src="images/agileflow-cli-overview-4.light.svg">
</picture>


---

## Data Flow

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/agileflow-cli-overview-5.dark.svg">
  <img alt="Diagram 5" src="images/agileflow-cli-overview-5.light.svg">
</picture>


---

## State Management

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/agileflow-cli-overview-6.dark.svg">
  <img alt="Diagram 6" src="images/agileflow-cli-overview-6.light.svg">
</picture>


---

## Agent Communication

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/agileflow-cli-overview-7.dark.svg">
  <img alt="Diagram 7" src="images/agileflow-cli-overview-7.light.svg">
</picture>


---

## Key Directories

| Directory | Purpose |
|-----------|---------|
| `.agileflow/` | Core installation (commands, agents, experts) |
| `.agileflow/experts/` | Domain expertise files (25 domains) |
| `.claude/commands/agileflow/` | Slash command definitions |
| `docs/02-practices/` | Development practices |
| `docs/03-decisions/` | Architecture Decision Records |
| `docs/04-architecture/` | System architecture docs |
| `docs/10-research/` | Research notes |

---

## Integration with Claude Code

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/agileflow-cli-overview-8.dark.svg">
  <img alt="Diagram 8" src="images/agileflow-cli-overview-8.light.svg">
</picture>


---

## Related Documentation

- [Agent Expert System](./agent-expert-system.md)
- [Multi-Expert Orchestration](./multi-expert-orchestration.md)
- [Command & Agent Flow](./command-agent-flow.md)
- [Monorepo Setup](./monorepo-setup.md)
