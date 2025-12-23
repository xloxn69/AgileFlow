---
description: Onboard a new agent with profile and contract
argument-hint: AGENT_ID=<id> ROLE=<role> [TOOLS=<list>] [SCOPE=<dirs>]
---

# agent-new

Onboard a new agent with profile and system prompt.

## STEP 0: Gather Context

```bash
node .agileflow/scripts/obtain-context.js agent
```

<!-- COMPACT_SUMMARY_START -->
## Compact Summary

**Command**: `agent`
**Purpose**: Onboard new agents with profiles and system prompts (contracts)

**Quick Usage**:
```
/agileflow:agent AGENT_ID=AG-UI ROLE="Frontend Developer" TOOLS="Read,Write,Bash" SCOPE="src/components/,US-00*"
```

**What It Does**:
1. Creates agent profile at `docs/02-practices/prompts/agents/agent-<AGENT_ID>.md`
2. Updates `docs/09-agents/roster.yaml` with agent mapping
3. Generates persona snippet to paste as terminal system prompt

**Profile Components**:
- Agent ID (e.g., AG-UI, AG-API, AG-CI)
- Role and responsibilities
- Available tools (Read, Write, Edit, Bash, etc.)
- Scope boundaries (directories, story tags)
- System prompt (contract with strict rules)

**Contract Rules Include**:
- Scope boundaries (what files/stories agent can touch)
- Commit/branch rules (naming conventions)
- Test requirements (when to run tests)
- Status/bus update protocols

**Example Agent Profile**:
```markdown
---
agent_id: AG-UI
role: Frontend Developer
tools: [Read, Write, Edit, Bash, Glob]
scope:
  directories: [src/components/, src/pages/]
  story_tags: [frontend, ui, ux]
---

# AG-UI: Frontend Developer Agent

## Responsibilities
Build and maintain user interface components...

## System Prompt (Contract)
**Scope**: Only modify files in src/components/ and src/pages/
**Testing**: Run `npm test` before committing
**Commits**: Prefix with "feat(ui):" or "fix(ui):"
**Status**: Update status.json after completing stories
```

**Best Practices**:
- Use descriptive agent IDs (AG-UI, AG-API, not AG-001)
- Define clear scope boundaries to prevent conflicts
- Include test requirements in contract
- Map agents to specific story types

<!-- COMPACT_SUMMARY_END -->

## Prompt

ROLE: Agent Onboarder

INPUTS
AGENT_ID=<AG-UI|AG-API|AG-CI or custom>  ROLE=<role>
TOOLS=[list]  SCOPE=<directories & story tags>

TEMPLATE
Use the following agent profile template:
@packages/cli/src/core/templates/agent-profile-template.md

ACTIONS
1) Create docs/02-practices/prompts/agents/agent-<AGENT_ID>.md from agent-profile-template.md including a strict "System Prompt (contract)" (scope boundaries, commit/branch rules, tests, status/bus updates).
2) Update docs/09-agents/roster.yaml (create if missing) mapping id→role/tools/scope.
3) Print a persona snippet to paste as that terminal's system prompt.

Diff-first; YES/NO.
