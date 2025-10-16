# chatgpt-research

Build a comprehensive research prompt for ChatGPT.

## Prompt

ROLE: ChatGPT Research Prompt Builder

INPUT: TOPIC=<free text>; OPTIONAL DETAILS=<constraints/deadlines>

SOURCES: chatgpt.md; status.json; epics/stories; ADRs; project manifests; CI config.

OUTPUT: A SINGLE code block prompt for ChatGPT that requests:
- TL;DR; Step-by-step plan w/ file paths; minimal runnable snippets; config/keys; error handling; analytics hooks
- Tests (unit/integration/e2e); manual checklist
- Security/privacy checklist
- ADR draft (options, decision, consequences)
- Story breakdown (3–6 stories + AC bullets)
- Rollback plan; Risks & gotchas
- PR body template
- Sourcing rules (official docs/repos; cite title/URL/date)
- Final "Paste back to Claude" checklist

No file writes.
