# Skills Reference

AgileFlow includes **23 auto-loaded skills** that activate automatically based on keywords.

---

## How Skills Work

Skills are context-aware helpers that activate automatically:

- **Activation:** Keyword-based detection (no manual invocation)
- **Context:** Main conversation (not separate window)
- **Purpose:** Quick enhancements and formatting
- **Structure:** Follow Anthropic's minimal specification

### Example Activation

```
User: "I need to create a user story for login functionality"

[agileflow-story-writer skill activates automatically]

Claude: Generates formatted story with AC, owner, priority, estimate
```

---

## AgileFlow Skills (8)

Auto-formatted outputs following AgileFlow templates.

| Skill | Trigger Keywords | Output |
|-------|------------------|--------|
| `agileflow-story-writer` | "user story", "create story" | Formatted story with AC |
| `agileflow-acceptance-criteria` | "acceptance criteria", "AC" | Given/When/Then format |
| `agileflow-epic-planner` | "break down", "epic", "plan feature" | Epic with stories |
| `agileflow-sprint-planner` | "sprint", "plan sprint" | Sprint plan with velocity |
| `agileflow-retro-facilitator` | "retrospective", "retro" | Start/Stop/Continue format |
| `agileflow-adr` | "architecture decision", "ADR" | Decision record template |
| `agileflow-commit-messages` | "commit message" | Conventional Commits format |
| `agileflow-tech-debt` | "technical debt", "tech debt" | Debt tracking entry |

---

## Template Generators (15)

Generate code templates and documentation.

| Skill | Trigger Keywords | Output |
|-------|------------------|--------|
| `story-skeleton` | "story template" | Story template scaffolding |
| `acceptance-criteria-generator` | "generate AC" | AC formatting |
| `commit-message-formatter` | "format commit" | Git commit messages |
| `adr-template` | "ADR template" | Architecture decision template |
| `api-documentation-generator` | "API docs", "OpenAPI" | OpenAPI/Swagger docs |
| `changelog-entry` | "changelog" | Keep a Changelog format |
| `pr-description` | "PR description" | Pull request template |
| `test-case-generator` | "test cases from AC" | Test cases from acceptance criteria |
| `type-definitions` | "TypeScript types" | TypeScript interfaces |
| `sql-schema-generator` | "SQL schema" | SQL schemas with migrations |
| `error-handler-template` | "error handling" | Error handling patterns |
| `diagram-generator` | "diagram", "mermaid" | Mermaid/ASCII diagrams |
| `validation-schema-generator` | "validation schema" | Joi/Zod/Yup schemas |
| `deployment-guide-generator` | "deployment guide" | Deployment runbooks |
| `migration-checklist` | "migration checklist" | Data migration checklists |

---

## Skills vs Commands vs Subagents

| Feature | Activation | Context | Best For |
|---------|------------|---------|----------|
| **Skills** | Automatic (keywords) | Main conversation | Quick formatting, templates |
| **Commands** | Manual (`/agileflow:*`) | Main conversation | Single-purpose actions |
| **Subagents** | Manual (Task tool) | Separate window | Complex implementation |

---

## Related Documentation

- [Commands](./commands.md) - 41 slash commands
- [Subagents](./subagents.md) - 26 specialized agents
