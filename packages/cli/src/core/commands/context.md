---
description: Generate context export for web AI tools
argument-hint: [MODE=full|export|note|research] [NOTE=<text>] [TOPIC=<text>] [DETAILS=<text>]
---

<!-- COMPACT_SUMMARY_START
This section is extracted by the PreCompact hook to preserve essential context across conversation compacts.
-->

## Compact Summary

Web AI Context Manager - Generates/exports/manages project context briefs for web AI tools (ChatGPT, Perplexity, Gemini, Claude web).

### Critical Behavioral Rules
- **ALWAYS create TodoWrite list** for MODE=full and MODE=research to track multi-step workflows
- **Diff-first approach**: Show changes and wait for YES/NO confirmation before ANY file writes
- **Preserve user-written content**: Only update managed sections in docs/context.md
- **No writes in export mode**: MODE=export outputs text only, never writes files
- **Research is two-step**: STEP 1 generates prompt, STEP 2 stores results when user returns
- **Link research files**: Always reference research from ADRs/Epics/Stories that use it

### Core Workflow

**MODE=full (default)**
1. Create todo list tracking: read existing, gather sources, extract info, generate sections, preserve user content, show diff, apply after YES
2. Read docs/context.md (if exists)
3. Gather sources: status.json, bus/log.jsonl, epics, stories, ADRs, practices, architecture, roadmap, research, manifests, CI, CHANGELOG
4. Generate comprehensive context with: what we're building, current focus, feature map, tech/tooling, decisions, architecture, testing, recent progress, risks, next steps
5. Show diff, wait for YES confirmation
6. Update only managed sections

**MODE=export**
1. Read docs/context.md
2. Output concise excerpt (≤300 lines): last updated, what we're building, current focus, tech/tooling, key decisions, feature map, next steps
3. End with "Paste this excerpt into your web AI tool..."
4. NO file writes

**MODE=note**
1. Append timestamped note under "Notes" section
2. Create section if missing
3. Show diff, wait for YES confirmation

**MODE=research**
1. Create todo list tracking: generate prompt, wait for results, format research, save to docs/10-research/, update index, ask about ADR/Epic/Story, link research
2. STEP 1: Generate single code block prompt for web AI requesting TL;DR, step-by-step plan, code snippets, config, tests, security checklist, ADR draft, story breakdown, rollback plan, risks, PR template, sourcing rules
3. Tell user to paste prompt into ChatGPT/Perplexity and return with results
4. STEP 2: When user returns with results, format into structured markdown with sections: Summary, Key Findings, Implementation, Code Snippets, Security, Testing, Risks, ADR Recommendation, Story Breakdown, References
5. Save to docs/10-research/YYYYMMDD-topic-slug.md
6. Update docs/10-research/README.md index
7. Ask if user wants ADR/Epic/Story created from research
8. Add research reference to created ADR/Epic/Story

### Key Files
- docs/context.md - Main context brief (managed sections + user content)
- docs/10-research/YYYYMMDD-topic-slug.md - Research results storage
- docs/10-research/README.md - Research index
- status.json - Current work tracking
- bus/log.jsonl - Recent progress messages

<!-- COMPACT_SUMMARY_END -->

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

### TODO LIST TRACKING
**CRITICAL**: Immediately create a todo list using TodoWrite tool to track context generation:
```
1. Read existing docs/context.md (if exists)
2. Gather sources (status.json, bus/log.jsonl, epics, stories, ADRs)
3. Extract key information from each source
4. Generate/update managed sections
5. Preserve user-written content
6. Show diff for review
7. Apply changes after YES confirmation
```

Mark each step complete as you finish it. This ensures nothing is forgotten.

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
Build a comprehensive research prompt for web AI tools, then store results when user returns.

### Input
- TOPIC=<free text> (required)
- DETAILS=<constraints/deadlines> (optional)

### Sources
context.md; status.json; epics/stories; ADRs; project manifests; CI config.

### TODO LIST TRACKING
**CRITICAL**: Immediately create a todo list using TodoWrite tool to track research workflow:
```
1. Generate research prompt for user to paste into ChatGPT
2. Wait for user to return with research results
3. Format research into structured markdown
4. Save research to docs/10-research/YYYYMMDD-topic-slug.md
5. Update docs/10-research/README.md index
6. Ask user about creating ADR/Epic/Story from research
7. Link research file from created ADR/Epic/Story (if applicable)
```

Mark each step complete as you finish it. This ensures nothing is forgotten.

### Workflow

**STEP 1: Generate Research Prompt**
Output a SINGLE code block prompt for web AI tools (ChatGPT, Perplexity, Gemini, Claude web, etc.) that requests:
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

Tell user: "Copy this prompt and paste it into ChatGPT/Perplexity. When you return with the results, paste them here and I'll save them to docs/10-research/."

**STEP 2: Store Research Results (when user returns)**

When user pastes research results back:

1. **Format the research** into structured markdown:
   ```markdown
   # [Topic Title]

   **Research Date**: YYYY-MM-DD
   **Topic**: [original topic]
   **Sources**: [List key sources cited]

   ## Summary
   [2-3 paragraph executive summary of findings]

   ## Key Findings
   - [Main point 1 with details]
   - [Main point 2 with details]
   - [Main point 3 with details]

   ## Implementation Approach
   [Step-by-step plan from research]

   ## Code Snippets
   ```language
   [Preserve all code snippets exactly as provided]
   ```

   ## Security Considerations
   [Security/privacy checklist items]

   ## Testing Strategy
   [Test approach from research]

   ## Risks & Gotchas
   [Potential issues and mitigation]

   ## ADR Recommendation
   [If research suggests architectural decision]

   ## Story Breakdown
   [If research included story suggestions]

   ## References
   - [Source 1: Title, URL, Date]
   - [Source 2: Title, URL, Date]
   ```

2. **Save to** `docs/10-research/YYYYMMDD-<topic-slug>.md`

3. **Update** `docs/10-research/README.md` with new entry (create if missing)

4. **Ask user**: "Would you like me to:
   - Create an ADR referencing this research?
   - Create an Epic/Stories based on this research?
   - Link this research to existing Epic/Story?"

5. **If creating ADR/Epic/Story**: Add research reference at the top:
   ```markdown
   **Research**: See [Topic Research](../10-research/YYYYMMDD-topic-slug.md)
   ```

### Rules
- STEP 1: No file writes, copy-paste ready prompt only
- STEP 2: Format and preserve ALL content (summaries retain context, code snippets, main points)
- STEP 2: Diff-first; YES/NO before writing research file
- STEP 2: Always link research file from ADRs/Epics/Stories that use it

---

## Usage Examples

```bash
# Generate/refresh full context brief (default)
/agileflow:context
/agileflow:context MODE=full

# Export concise excerpt for pasting
/agileflow:context MODE=export

# Add a quick note
/agileflow:context MODE=note NOTE="User reported auth bug in production"

# Build research prompt
/agileflow:context MODE=research TOPIC="Implement OAuth 2.0 with Google"
/agileflow:context MODE=research TOPIC="Add Stripe payments" DETAILS="Launch by end of sprint"
```

---

## Output

Depending on MODE:
- **full**: Updated docs/context.md (after YES confirmation)
- **export**: Text output ready to paste into web AI tool
- **note**: Appended note to docs/context.md (after YES confirmation)
- **research**: Research prompt in code block ready to paste into web AI tool
