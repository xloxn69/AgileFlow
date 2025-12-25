---
description: Generate context export for web AI tools
argument-hint: [MODE=full|export|note|research|import] [NOTE=<text>] [TOPIC=<text>] [DETAILS=<text>] [CONTENT=<text>] [SOURCE=<url>]
---

<!-- COMPACT_SUMMARY_START
This section is extracted by the PreCompact hook to preserve essential context across conversation compacts.
-->

## Compact Summary

Web AI Context Manager - Generates/exports/manages project context briefs for web AI tools (ChatGPT, Perplexity, Gemini, Claude web).

### Critical Behavioral Rules
- **ALWAYS create TodoWrite list** for MODE=full, MODE=research, and MODE=import to track multi-step workflows
- **Diff-first approach**: Show changes and wait for YES/NO confirmation before ANY file writes
- **Preserve user-written content**: Only update managed sections in docs/context.md
- **No writes in export mode**: MODE=export outputs text only, never writes files
- **Research is two-step**: STEP 1 generates prompt, STEP 2 stores results when user returns
- **Import is one-step**: Process CONTENT immediately and create research file
- **Link research files**: Always reference research from ADRs/Epics/Stories that use it

### Tool Usage Examples

**TodoWrite** (for all modes requiring multi-step tracking):
```xml
<invoke name="TodoWrite">
<parameter name="content">1. Read existing docs/context.md
2. Gather sources (status.json, bus/log.jsonl, epics)
3. Extract key information
4. Generate managed sections
5. Show diff for review
6. Apply changes after YES</parameter>
<parameter name="status">in-progress</parameter>
<parameter name="activeForm">1</parameter>
</invoke>
```

**Edit** (when writing context or research files):
```xml
<invoke name="Edit">
<parameter name="file_path">/full/path/to/docs/context.md</parameter>
<parameter name="old_string"><!-- MANAGED_SECTION -->\n[old content]\n<!-- END_MANAGED --></parameter>
<parameter name="new_string"><!-- MANAGED_SECTION -->\n[new content]\n<!-- END_MANAGED --></parameter>
</invoke>
```

**AskUserQuestion** (when needing confirmation):
```xml
<invoke name="AskUserQuestion">
<parameter name="questions">[{"question": "Apply these changes?", "header": "Diff Preview", "multiSelect": false, "options": [{"label": "Yes, update", "description": "Write changes"}, {"label": "No, abort", "description": "Cancel"}]}]</parameter>
</invoke>
```

### Core Workflow

**MODE=full**: Create todo list → Read docs/context.md → Gather sources → Generate sections → Show diff → Apply after YES

**MODE=export**: Read docs/context.md → Output ≤300 line excerpt → No file writes

**MODE=note**: Create todo list → Append timestamped note → Show diff → Apply after YES

**MODE=research**: Create todo list → STEP 1: Generate prompt → STEP 2: Format & save to docs/10-research/

**MODE=import**: Create todo list → Validate inputs → Process content → Save to docs/10-research/

### Key Files
- docs/context.md - Main context brief
- docs/10-research/YYYYMMDD-topic-slug.md - Research storage
- docs/10-research/README.md - Research index
- status.json - Current work tracking
- bus/log.jsonl - Recent progress messages

<!-- COMPACT_SUMMARY_END -->

# context

Generate, export, or manage the web AI context brief.

## Prompt

ROLE: Web AI Context Manager

INPUTS (optional)
- MODE=full|export|note|research|import (default: full)
- NOTE=<text> (required if MODE=note)
- TOPIC=<text> (required if MODE=research or MODE=import)
- CONTENT=<text> (required if MODE=import - raw content to process)
- SOURCE=<url> (optional for MODE=import - original source URL)

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

## MODE=import
Import raw content (transcripts, articles, notes) and convert to structured research file.

### Input
- TOPIC=<text> (required - name for the research file)
- CONTENT=<text> (required - raw content to process: transcript, article, notes, etc.)
- SOURCE=<url> (optional - original source URL for reference)

### Use Cases
- YouTube video transcripts
- Conference talk notes
- Podcast transcripts
- Blog posts / articles
- Documentation pages
- Forum discussions / Stack Overflow threads
- Meeting notes

### TODO LIST TRACKING
**CRITICAL**: Immediately create a todo list using TodoWrite tool to track import workflow:
```
1. Validate TOPIC and CONTENT are provided
2. Analyze and summarize key points from content
3. Extract any code snippets
4. Generate action items based on content
5. Create user story suggestions (if applicable)
6. Format into structured research markdown
7. Show diff for review
8. Save to docs/10-research/YYYYMMDD-topic-slug.md
9. Update docs/10-research/README.md index
10. Ask about creating ADR/Epic/Story from research
```

Mark each step complete as you finish it.

### Processing Steps

1. **Validate Inputs**
   - Verify TOPIC is provided (error if missing)
   - Verify CONTENT is provided (error if missing)
   - SOURCE is optional but recommended for attribution

2. **Analyze Content**
   Extract from the raw content:
   - **Summary**: 2-3 paragraph TL;DR of the main points
   - **Key Findings**: Bullet list of important takeaways
   - **Code Snippets**: Any code blocks, commands, or configuration (preserve exactly)
   - **Action Items**: Concrete next steps mentioned or implied
   - **Story Suggestions**: Potential user stories/epics based on content

3. **Format Research File**
   ```markdown
   # [Topic Title]

   **Import Date**: YYYY-MM-DD
   **Topic**: [original topic]
   **Source**: [URL if provided, or "Direct import"]
   **Content Type**: [transcript/article/notes/etc.]

   ## Summary
   [2-3 paragraph executive summary of the content]

   ## Key Findings
   - [Main point 1 with details]
   - [Main point 2 with details]
   - [Main point 3 with details]
   - ...

   ## Code Snippets
   [Preserve all code snippets exactly as they appeared]
   ```language
   [code here]
   ```

   ## Action Items
   - [ ] [Action 1 - concrete next step]
   - [ ] [Action 2 - concrete next step]
   - [ ] [Action 3 - concrete next step]

   ## Story Suggestions
   [If content suggests feature work, list potential stories]

   ### Potential Epic: [Epic Title]
   - **US-XXXX**: [Story 1 title]
     - AC: [acceptance criteria bullet]
   - **US-XXXX**: [Story 2 title]
     - AC: [acceptance criteria bullet]

   ## Raw Content Reference
   <details>
   <summary>Original content (click to expand)</summary>

   [First 500 chars of original content for reference...]
   </details>

   ## References
   - Source: [URL or "Direct import"]
   - Import date: [YYYY-MM-DD]
   ```

4. **Save and Index**
   - Save to `docs/10-research/YYYYMMDD-<topic-slug>.md`
   - Update `docs/10-research/README.md` with new entry

5. **Offer Next Steps**
   Ask user via AskUserQuestion:
   - Create an ADR referencing this research?
   - Create an Epic/Stories based on the story suggestions?
   - Link this research to an existing Epic/Story?

### Rules
- Diff-first; YES/NO before writing research file
- Preserve ALL code snippets exactly as provided
- Generate actionable items (not vague suggestions)
- Keep raw content reference collapsed to save space
- Always update the research index

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

# Build research prompt for web AI
/agileflow:context MODE=research TOPIC="Implement OAuth 2.0 with Google"
/agileflow:context MODE=research TOPIC="Add Stripe payments" DETAILS="Launch by end of sprint"

# Import external content (transcripts, articles, notes)
/agileflow:context MODE=import TOPIC="React Server Components" CONTENT="[paste transcript here]"
/agileflow:context MODE=import TOPIC="Stripe Webhooks Tutorial" SOURCE="https://youtube.com/..." CONTENT="[paste transcript here]"
```

---

## Output

Depending on MODE:
- **full**: Updated docs/context.md (after YES confirmation)
- **export**: Text output ready to paste into web AI tool
- **note**: Appended note to docs/context.md (after YES confirmation)
- **research**: Research prompt in code block ready to paste into web AI tool
- **import**: Processed research file saved to docs/10-research/ (after YES confirmation)
