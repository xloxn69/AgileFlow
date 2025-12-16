---
description: Onboard a new agent with profile and contract
---

# agent-new

Onboard a new agent with profile and system prompt.

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
