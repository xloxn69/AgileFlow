# chatgpt

Generate, export, or manage the ChatGPT context brief.

## Prompt

ROLE: ChatGPT Context Manager

INPUTS (optional)
- MODE=full|export|note|research (default: full)
- NOTE=<text> (required if MODE=note)
- TOPIC=<text> (required if MODE=research)

---

## MODE=full (default)
Create/refresh docs/chatgpt.md with managed sections.

### Objective
Generate comprehensive ChatGPT context brief with:
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
Export a concise ChatGPT context excerpt.

### Task
Read docs/chatgpt.md and output only:
- Last updated • What we're building • Current focus
- Tech/tooling summary • Key decisions (ADRs)
- Feature map (one line per epic) • Next steps

### Constraints
- LIMIT ≤ 300 lines
- No file writes
- End with "Paste this excerpt into ChatGPT to load context."

---

## MODE=note
Append a timestamped note to the ChatGPT context file.

### Input
NOTE=<1–5 line note>

### Action
Append under "Notes for ChatGPT" section with ISO timestamp.
Create section if missing.

### Rules
Diff-first; YES/NO before changes.

---

## MODE=research
Build a comprehensive research prompt for ChatGPT.

### Input
- TOPIC=<free text> (required)
- DETAILS=<constraints/deadlines> (optional)

### Sources
chatgpt.md; status.json; epics/stories; ADRs; project manifests; CI config.

### Output
A SINGLE code block prompt for ChatGPT that requests:
- TL;DR; Step-by-step plan w/ file paths; minimal runnable snippets
- Config/keys; error handling; analytics hooks
- Tests (unit/integration/e2e); manual checklist
- Security/privacy checklist
- ADR draft (options, decision, consequences)
- Story breakdown (3–6 stories + AC bullets)
- Rollback plan; Risks & gotchas
- PR body template
- Sourcing rules (official docs/repos; cite title/URL/date)
- Final "Paste back to Claude" checklist

### Rules
No file writes. Copy-paste ready.

---

## Usage Examples

```bash
# Generate/refresh full context brief (default)
/AgileFlow:chatgpt
/AgileFlow:chatgpt MODE=full

# Export concise excerpt for pasting
/AgileFlow:chatgpt MODE=export

# Add a quick note
/AgileFlow:chatgpt MODE=note NOTE="User reported auth bug in production"

# Build research prompt
/AgileFlow:chatgpt MODE=research TOPIC="Implement OAuth 2.0 with Google"
/AgileFlow:chatgpt MODE=research TOPIC="Add Stripe payments" DETAILS="Launch by end of sprint"
```

---

## Output

Depending on MODE:
- **full**: Updated docs/chatgpt.md (after YES confirmation)
- **export**: Text output ready to paste into ChatGPT
- **note**: Appended note to docs/chatgpt.md (after YES confirmation)
- **research**: Research prompt in code block
