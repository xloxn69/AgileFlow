# Architecture Documentation

System architecture, component design, and technical documentation for AgileFlow CLI.

---

## Documents

| Document | Description |
|----------|-------------|
| [AgileFlow CLI Overview](./agileflow-cli-overview.md) | High-level system architecture and component layers |
| [Agent Expert System](./agent-expert-system.md) | Self-improving agents with expertise files |
| [Multi-Expert Orchestration](./multi-expert-orchestration.md) | Parallel expert analysis and synthesis |
| [Command & Agent Flow](./command-agent-flow.md) | How commands and agents work together |
| [Monorepo Setup](./monorepo-setup.md) | Repository structure and organization |

---

## Quick Reference

### System Layers

```
Presentation    →  Slash Commands, CLI Interface
Orchestration   →  Babysit, Multi-Expert, Session
Agent           →  25 Domain Experts
Expert          →  Expertise Files, Mental Models
Storage         →  status.json, docs/, bus/
```

### Key Components

- **Commands**: 42 slash commands for agile workflows
- **Agents**: 25 domain-specialized experts
- **Experts**: Self-improving knowledge bases per domain
- **State**: JSON-based tracking (status.json, bus/log.jsonl)

### Data Flow

```
User Request → Command Parser → Agent Router → Expert System → Output
                                     ↓
                              State Updates (status.json)
```

---

## Diagram Conventions

All architecture docs use [Mermaid.js](https://mermaid.js.org/) for diagrams.

See [Mermaid Research](../10-research/20251216-mermaid-js-diagramming.md) for syntax reference.

**Diagram types used:**
- **Flowchart**: Process flows, decision trees, component relationships
- **Sequence**: API calls, agent interactions, request/response flows
- **State**: Lifecycle states (story states, expert states)
- **Class**: Agent relationships (when needed)

---

## Related Documentation

- [Research Notes](../10-research/) - Technical investigations
- [Decisions (ADRs)](../03-decisions/) - Architecture Decision Records
- [Practices](../02-practices/) - Development practices
