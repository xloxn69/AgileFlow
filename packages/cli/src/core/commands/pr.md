---
description: Generate pull request description from story
argument-hint: STORY=<US-ID> [TITLE=<text>] [TEST_EVIDENCE=<text>]
---

# pr-template

## STEP 0: Activation

```bash
node -e "
const fs = require('fs');
const path = 'docs/09-agents/session-state.json';
if (fs.existsSync(path)) {
  const state = JSON.parse(fs.readFileSync(path, 'utf8'));
  state.active_command = { name: 'pr-template', activated_at: new Date().toISOString(), state: {} };
  fs.writeFileSync(path, JSON.stringify(state, null, 2) + '\n');
  console.log('✅ pr-template command activated');
}
"
```

---

<!-- COMPACT_SUMMARY_START -->
## Compact Summary

**Purpose**: Generate complete, paste-ready pull request descriptions from user story files and test evidence.

**Role**: PR Author

**Key Inputs**:
- `STORY=<US-ID>` - User story identifier (required)
- `TITLE=<text>` - Short PR title (optional)
- `AC_CHECKED=<checkbox list>` - Acceptance criteria with checked/unchecked state (optional)
- `TEST_EVIDENCE=<bullets/paths>` - Test results, screenshots, logs (optional)
- `NOTES=<text>` - Additional context or notes (optional)

**Core Workflow**:
1. Parse all input arguments (STORY, TITLE, AC_CHECKED, TEST_EVIDENCE, NOTES)
2. Read the story file from `docs/06-stories/<STORY>.md` to extract:
   - Epic reference and context
   - Story summary and description
   - Dependencies on other stories
   - Acceptance criteria
3. Generate comprehensive PR description with all standard sections
4. Output paste-ready PR body in markdown format
5. Suggest Conventional Commit subject line for squash merges

**PR Description Structure**:
- **Title**: `<STORY>: <TITLE>` format
- **Summary**: High-level overview of changes
- **Linked Issues**: Story ID + dependencies from story file
- **Checklist**: Acceptance criteria with checkbox states from AC_CHECKED
- **Test Evidence**: Formatted test results, paths, screenshots from TEST_EVIDENCE
- **Screenshots/GIFs**: Placeholder section for visual evidence
- **Risk Assessment**: Potential risks and rollback plan
- **Code Owners**: Auto-populated from @CODEOWNERS

**Output Format**:
```markdown
## Summary
[Generated from story summary + NOTES]

## Linked Issues
- Implements #<STORY>
- Depends on #<DEP-1>, #<DEP-2>

## Checklist
- [x] AC1: Description
- [ ] AC2: Description

## Test Evidence
[Formatted TEST_EVIDENCE content]

## Screenshots/GIFs
[Placeholder or provided content]

## Risk Assessment
[Analysis of potential risks and rollback strategy]

## Code Owners
@team-name
```

**Conventional Commit Suggestion**: Provides a proper commit message following conventional commit format (feat/fix/chore) based on story type.

**File Operations**: Read-only - no file writes, only reads story file for context.

**Best Practices**:
- Always read the story file first to ensure accurate context
- Include all dependencies found in story file
- Preserve checkbox states from AC_CHECKED input
- Format test evidence clearly and readably
- Suggest meaningful commit messages aligned with change type
<!-- COMPACT_SUMMARY_END -->

---

Generate a complete PR description from story and test evidence.

## Prompt

ROLE: PR Author

TODO LIST TRACKING
**CRITICAL**: Immediately create a todo list using TodoWrite tool to track PR description generation:
```
1. Parse inputs (STORY, TITLE, AC_CHECKED, TEST_EVIDENCE, NOTES)
2. Read story file to extract epic/summary/deps
3. Generate PR description with all sections
4. Output paste-ready PR body
5. Suggest Conventional Commit subject for squash
```

Mark each step complete as you finish it. This ensures nothing is forgotten.

INPUTS
STORY=<US-ID>  TITLE=<short>
AC_CHECKED=<checkbox list>  TEST_EVIDENCE=<bullets/paths>  NOTES=<optional>

ACTIONS
1) Read story file to pull epic/summary/deps.
2) Output a paste-ready PR body including: Title "<STORY>: <TITLE>", Summary, Linked Issues (story+deps), Checklist (AC with checked state), Test Evidence, Screens/GIFs, Risk/Rollback, Owners (@CODEOWNERS).
3) Suggest a Conventional Commit subject for squash.

No file writes.
