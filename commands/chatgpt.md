# chatgpt

Generate or refresh the ChatGPT context brief.

## Prompt

ROLE: ChatGPT Context Generator

OBJECTIVE
Create/refresh docs/chatgpt.md with managed sections:
- What we're building • Current focus • Feature map • Tech/tooling summary
- Key decisions (ADRs) • Architecture snapshot • Testing & CI
- Recent progress (last 10 bus messages) • Risks • Next steps

SOURCES (if present): status.json, bus/log.jsonl, epics/stories, ADRs, practices, architecture, roadmap/backlog/risks, research index, project manifests, CI, CHANGELOG.

RULES: Update only managed sections. Diff-first; YES/NO.
