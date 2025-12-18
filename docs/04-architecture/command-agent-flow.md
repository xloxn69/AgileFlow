# Command & Agent Flow Architecture

This document describes how slash commands and agents work together in AgileFlow.

---

## Command Types

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/command-agent-flow-1.dark.svg">
  <img alt="Diagram 1" src="images/command-agent-flow-1.light.svg">
</picture>

> Three command types: tracking commands (story, epic, board), workflow commands (sprint, review, pr), and session commands (resume, baseline, verify).

---

## Command Execution Flow

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/command-agent-flow-2.dark.svg">
  <img alt="Diagram 2" src="images/command-agent-flow-2.light.svg">
</picture>

> Command execution flow: user invokes command → parser extracts parameters → router determines handler → handler executes → response returned.

---

## Agent Execution Pattern

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/command-agent-flow-3.dark.svg">
  <img alt="Diagram 3" src="images/command-agent-flow-3.light.svg">
</picture>

> Agent execution pattern: load expertise file → validate against mental models → execute task → self-improve by updating expertise.

---

## Agent vs Command Relationship

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/command-agent-flow-4.dark.svg">
  <img alt="Diagram 4" src="images/command-agent-flow-4.light.svg">
</picture>

> Relationship diagram: commands are user-facing actions that may spawn agents; agents are specialized workers with domain expertise that can be invoked by commands.

**Key distinction:**
- **Commands**: User-facing actions (create story, view board, run sprint)
- **Agents**: Specialized workers with domain expertise (database, api, security)

---

## Babysit Routing Logic

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/command-agent-flow-5.dark.svg">
  <img alt="Diagram 5" src="images/command-agent-flow-5.light.svg">
</picture>

> Babysit routing logic: analyzes user request keywords, maps to appropriate domain expert(s), spawns expert with context, collects results.

---

## State Updates

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/command-agent-flow-6.dark.svg">
  <img alt="Diagram 6" src="images/command-agent-flow-6.light.svg">
</picture>

> State update flow: commands and agents update status.json with story progress, write to bus/log.jsonl for inter-agent communication.

---

## Command Categories

### Tracking Commands

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/command-agent-flow-7.dark.svg">
  <img alt="Diagram 7" src="images/command-agent-flow-7.light.svg">
</picture>

> Tracking commands: story, epic, board, status, assign, blockers - manage work items and visualize progress.

### Workflow Commands

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/command-agent-flow-8.dark.svg">
  <img alt="Diagram 8" src="images/command-agent-flow-8.light.svg">
</picture>

> Workflow commands: sprint, review, pr, deploy, changelog - manage development lifecycle from planning to release.

### Session Commands

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/command-agent-flow-9.dark.svg">
  <img alt="Diagram 9" src="images/command-agent-flow-9.light.svg">
</picture>

> Session commands: resume, baseline, verify, session-init - manage session state, checkpoints, and test verification.

---

## Agent Specialization Map

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/command-agent-flow-10.dark.svg">
  <img alt="Diagram 10" src="images/command-agent-flow-10.light.svg">
</picture>

> Agent specialization map: 25 domain experts grouped by focus area (data layer, presentation, infrastructure, quality, planning).

---

## Error Handling

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/command-agent-flow-11.dark.svg">
  <img alt="Diagram 11" src="images/command-agent-flow-11.light.svg">
</picture>

> Error handling flow: detect error → classify type → apply recovery strategy → log to bus → notify user if unrecoverable.

---

## Related Documentation

- [AgileFlow CLI Overview](./agileflow-cli-overview.md)
- [Agent Expert System](./agent-expert-system.md)
- [Multi-Expert Orchestration](./multi-expert-orchestration.md)
