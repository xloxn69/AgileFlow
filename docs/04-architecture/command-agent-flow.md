# Command & Agent Flow Architecture

This document describes how slash commands and agents work together in AgileFlow.

---

## Command Types

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/command-agent-flow-1.dark.svg">
  <img alt="Diagram 1" src="images/command-agent-flow-1.light.svg">
</picture>


---

## Command Execution Flow

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/command-agent-flow-2.dark.svg">
  <img alt="Diagram 2" src="images/command-agent-flow-2.light.svg">
</picture>


---

## Agent Execution Pattern

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/command-agent-flow-3.dark.svg">
  <img alt="Diagram 3" src="images/command-agent-flow-3.light.svg">
</picture>


---

## Agent vs Command Relationship

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/command-agent-flow-4.dark.svg">
  <img alt="Diagram 4" src="images/command-agent-flow-4.light.svg">
</picture>


**Key distinction:**
- **Commands**: User-facing actions (create story, view board, run sprint)
- **Agents**: Specialized workers with domain expertise (database, api, security)

---

## Babysit Routing Logic

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/command-agent-flow-5.dark.svg">
  <img alt="Diagram 5" src="images/command-agent-flow-5.light.svg">
</picture>


---

## State Updates

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/command-agent-flow-6.dark.svg">
  <img alt="Diagram 6" src="images/command-agent-flow-6.light.svg">
</picture>


---

## Command Categories

### Tracking Commands

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/command-agent-flow-7.dark.svg">
  <img alt="Diagram 7" src="images/command-agent-flow-7.light.svg">
</picture>


### Workflow Commands

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/command-agent-flow-8.dark.svg">
  <img alt="Diagram 8" src="images/command-agent-flow-8.light.svg">
</picture>


### Session Commands

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/command-agent-flow-9.dark.svg">
  <img alt="Diagram 9" src="images/command-agent-flow-9.light.svg">
</picture>


---

## Agent Specialization Map

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/command-agent-flow-10.dark.svg">
  <img alt="Diagram 10" src="images/command-agent-flow-10.light.svg">
</picture>


---

## Error Handling

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/command-agent-flow-11.dark.svg">
  <img alt="Diagram 11" src="images/command-agent-flow-11.light.svg">
</picture>


---

## Related Documentation

- [AgileFlow CLI Overview](./agileflow-cli-overview.md)
- [Agent Expert System](./agent-expert-system.md)
- [Multi-Expert Orchestration](./multi-expert-orchestration.md)
