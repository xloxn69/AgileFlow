---
description: context
allowed-tools: Bash, Read, Edit, Write, Glob, Grep
---

# context

Generate, export, or manage the web AI context brief.

## Prompt

ROLE: Web AI Context Manager

INPUTS (optional)
- MODE=full|export|note|research (default: full)
- NOTE=<text> (required if MODE=note)
- TOPIC=<text> (required if MODE=research)

---

## MODE=full (default)
Create/refresh docs/context.md with managed sections.

### Objective
Generate comprehensive context brief for web AI tools (ChatGPT, Perplexity, Gemini, Claude web, etc.) with:
- What we're building • Current focus • Feature map • Tech/tooling summary
- Key decisions (ADRs) • Architecture snapshot • Testing & CI
- Recent progress (last 10 bus messages) • Risks • Next steps

### Sources
If present: status.json, bus/log.jsonl, epics/stories, ADRs, practices, architecture, roadmap/backlog/risks, research index, project manifests, CI, CHANGELOG.

### Rules
- Update only managed sections
- Preserve user-written content
- Diff-first; YES/NO before changes

---

## MODE=export
Export a concise context excerpt for web AI tools.

### Task
Read docs/context.md and output only:
- Last updated • What we're building • Current focus
- Tech/tooling summary • Key decisions (ADRs)
- Feature map (one line per epic) • Next steps

### Constraints
- LIMIT ≤ 300 lines
- No file writes
- End with "Paste this excerpt into your web AI tool (ChatGPT, Perplexity, Gemini, etc.) to load context."

---

## MODE=note
Append a timestamped note to the context file.

### Input
NOTE=<1–5 line note>

### Action
Append under "Notes" section with ISO timestamp.
Create section if missing.

### Rules
Diff-first; YES/NO before changes.

---

## MODE=research
Build a comprehensive research prompt for web AI tools.

### Input
- TOPIC=<free text> (required)
- DETAILS=<constraints/deadlines> (optional)

### Sources
context.md; status.json; epics/stories; ADRs; project manifests; CI config.

### Output
A SINGLE code block prompt for web AI tools (ChatGPT, Perplexity, Gemini, Claude web, etc.) that requests:
- TL;DR; Step-by-step plan w/ file paths; minimal runnable snippets
- Config/keys; error handling; analytics hooks
- Tests (unit/integration/e2e); manual checklist
- Security/privacy checklist
- ADR draft (options, decision, consequences)
- Story breakdown (3–6 stories + AC bullets)
- Rollback plan; Risks & gotchas
- PR body template
- Sourcing rules (official docs/repos; cite title/URL/date)
- Final "Paste back to Claude Code" checklist

### Rules
No file writes. Copy-paste ready.

---

## Usage Examples

```bash
# Generate/refresh full context brief (default)
/AgileFlow:context
/AgileFlow:context MODE=full

# Export concise excerpt for pasting
/AgileFlow:context MODE=export

# Add a quick note
/AgileFlow:context MODE=note NOTE="User reported auth bug in production"

# Build research prompt
/AgileFlow:context MODE=research TOPIC="Implement OAuth 2.0 with Google"
/AgileFlow:context MODE=research TOPIC="Add Stripe payments" DETAILS="Launch by end of sprint"
```

---

## Output

Depending on MODE:
- **full**: Updated docs/context.md (after YES confirmation)
- **export**: Text output ready to paste into web AI tool
- **note**: Appended note to docs/context.md (after YES confirmation)
- **research**: Research prompt in code block ready to paste into web AI tool
