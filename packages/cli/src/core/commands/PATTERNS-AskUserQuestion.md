# AskUserQuestion Tool - Usage Patterns & Best Practices

This document provides reusable patterns for using the AskUserQuestion tool across all AgileFlow commands.

## Core Format

```xml
<invoke name="AskUserQuestion">
<parameter name="questions">[{
  "question": "Your question text here",
  "header": "Short label (max 12 chars)",
  "multiSelect": false,
  "options": [
    {"label": "Option 1", "description": "Detailed description of option 1"},
    {"label": "Option 2", "description": "Detailed description of option 2"}
  ]
}]</parameter>
</invoke>
```

## Key Principles

### 1. Always Include Recommendations
Mark the recommended option and explain WHY it's recommended:
- Bad: `"label": "Yes"`
- Good: `"label": "Yes, create workflow", "description": "Write .github/workflows/ci.yml (Recommended - standard team setup)"`

### 2. Be Specific in Labels
- Bad: `"Continue?"` or `"Yes/No"`
- Good: `"Yes, create story"` or `"Skip this step"`

### 3. Provide Context in Descriptions
- Bad: `"description": "Proceed with action"`
- Good: `"description": "Write 3 files, update status.json, run tests (Recommended - follows Definition of Ready)"`

### 4. Give Users Control
Always offer 3 options minimum:
- Recommended action (with reason)
- Alternative approach
- Skip/Cancel/Pause

### 5. Headers Must Be ≤12 Characters
- Bad: `"header": "Create new story"`
- Good: `"header": "Create"`

## Common Patterns

### Pattern 1: YES/NO Confirmation (File Operations)

**Old Way:**
```
Show diff. Proceed? (YES/NO)
```

**New Way:**
```xml
<invoke name="AskUserQuestion">
<parameter name="questions">[{
  "question": "Apply these changes to [filename]?",
  "header": "Confirm",
  "multiSelect": false,
  "options": [
    {
      "label": "Yes, apply changes",
      "description": "Write the shown diff to the file (Recommended - changes look good)"
    },
    {
      "label": "No, revise first",
      "description": "I want to modify the changes before applying"
    },
    {
      "label": "Skip this file",
      "description": "Skip this change and move to next step"
    }
  ]
}]</parameter>
</invoke>
```

### Pattern 2: YES/NO Confirmation (Command Execution)

**Old Way:**
```
Run command: npm test
Proceed? (YES/NO)
```

**New Way:**
```xml
<invoke name="AskUserQuestion">
<parameter name="questions">[{
  "question": "Run this command: [command]?",
  "header": "Run cmd",
  "multiSelect": false,
  "options": [
    {
      "label": "Yes, run it",
      "description": "Execute the command as shown (Recommended - safe operation)"
    },
    {
      "label": "No, modify first",
      "description": "I want to adjust the command"
    },
    {
      "label": "Skip",
      "description": "Don't run this command"
    }
  ]
}]</parameter>
</invoke>
```

### Pattern 3: Next Action Confirmation

**Old Way:**
```
Next action I can take → Create story US-0042
Proceed? (YES/NO)
```

**New Way:**
```xml
<invoke name="AskUserQuestion">
<parameter name="questions">[{
  "question": "Next action: Create US-0042 with AC from requirements. Proceed?",
  "header": "Next step",
  "multiSelect": false,
  "options": [
    {
      "label": "Yes, proceed",
      "description": "Create story file, test stub, update status.json (Recommended - story is READY)"
    },
    {
      "label": "No, different approach",
      "description": "I want to adjust the plan or take a different direction"
    },
    {
      "label": "Pause here",
      "description": "Stop here - I'll review and come back later"
    }
  ]
}]</parameter>
</invoke>
```

### Pattern 4: Multiple Choice Selection

**Old Way:**
```
Select CI provider:
1. GitHub Actions
2. GitLab CI
3. CircleCI

Your choice (1-3):
```

**New Way:**
```xml
<invoke name="AskUserQuestion">
<parameter name="questions">[{
  "question": "Which CI/CD provider would you like to configure?",
  "header": "CI Provider",
  "multiSelect": false,
  "options": [
    {
      "label": "GitHub Actions",
      "description": "Best for GitHub repos - free for public, 2000 min/month private (Recommended)"
    },
    {
      "label": "GitLab CI",
      "description": "Best for GitLab repos - unlimited minutes, powerful pipelines"
    },
    {
      "label": "CircleCI",
      "description": "Universal platform - works with any Git provider"
    },
    {
      "label": "Skip CI setup",
      "description": "Configure CI later"
    }
  ]
}]</parameter>
</invoke>
```

### Pattern 5: Intelligent Recommendations (from analysis)

Use this when presenting options based on project analysis:

```xml
<invoke name="AskUserQuestion">
<parameter name="questions">[{
  "question": "What would you like to work on?",
  "header": "Choose task",
  "multiSelect": false,
  "options": [
    {
      "label": "US-0042: User Login API (READY) ⭐",
      "description": "✅ Ready to implement | Epic: Auth | Priority: High | Unblocks 3 stories"
    },
    {
      "label": "US-0038: Password Reset (Blocked)",
      "description": "⚠️ Needs US-0042 first | Clear unblock path"
    },
    {
      "label": "EP-0005: Payment (80% done)",
      "description": "🎯 Near complete | 4/5 stories done | Finish strong"
    },
    {
      "label": "Research: JWT practices",
      "description": "📚 Prep for Auth epic | Avoid debugging pain"
    },
    {
      "label": "Other",
      "description": "Custom input"
    }
  ]
}]</parameter>
</invoke>
```

**Key Elements**:
- **Visual markers**: ⭐ for READY, ⚠️ for blocked, 🎯 for near-complete
- **Status indicators**: READY, Blocked, % completion
- **Impact/reason**: "Unblocks 3 stories", "Avoid debugging pain"
- **Always recommend based on logic**: READY > Unblock > Near-complete > Research > New

### Pattern 6: Multi-Select (when user can choose multiple)

```xml
<invoke name="AskUserQuestion">
<parameter name="questions">[{
  "question": "Which commands should run in CI? (Select multiple)",
  "header": "CI Commands",
  "multiSelect": true,
  "options": [
    {
      "label": "Install dependencies",
      "description": "Run before other commands (Recommended)"
    },
    {
      "label": "Run tests",
      "description": "Execute test suite (Recommended)"
    },
    {
      "label": "Run linter",
      "description": "Check code style"
    },
    {
      "label": "Type checker",
      "description": "Verify TypeScript types"
    }
  ]
}]</parameter>
</invoke>
```

Note: `"multiSelect": true` allows selecting 0 or more options

### Pattern 7: Batch Multiple Questions (max 4)

When you need to ask multiple related questions:

```xml
<invoke name="AskUserQuestion">
<parameter name="questions">[
  {
    "question": "What command runs your tests?",
    "header": "Test cmd",
    "multiSelect": false,
    "options": [
      {"label": "npm test", "description": "Standard npm test script (Recommended)"},
      {"label": "jest", "description": "Run Jest directly"},
      {"label": "vitest", "description": "Run Vitest directly"}
    ]
  },
  {
    "question": "What command runs your linter?",
    "header": "Lint cmd",
    "multiSelect": false,
    "options": [
      {"label": "npm run lint", "description": "Standard lint script (Recommended)"},
      {"label": "eslint .", "description": "Run ESLint directly"},
      {"label": "biome check", "description": "Use Biome linter"}
    ]
  }
]</parameter>
</invoke>
```

**Limit**: Max 4 questions per invocation

## Recommendation Logic

When adding "(Recommended)" to an option, base it on these priorities:

### For Story/Task Selection:
1. **READY status** → Always recommend first
2. **Blocked but clear unblock** → Recommend with "Clear path to unblock"
3. **Near-complete epic** → Recommend with "Finish what's started"
4. **Roadmap priority** → Recommend with "High-priority item"
5. **Research before implementation** → Recommend with "Avoid debugging pain"

### For Configuration:
1. **Standard/default setup** → "(Recommended - standard team setup)"
2. **Most popular option** → "(Recommended - most teams use this)"
3. **Project-specific detection** → "(Recommended - detected in your package.json)"

### For File Operations:
1. **Changes look good** → "(Recommended - changes look good)"
2. **Follows practices** → "(Recommended - follows docs/02-practices/)"
3. **Safe operation** → "(Recommended - safe operation)"

### For Dangerous Operations:
- **Never** mark dangerous operations as "(Recommended)"
- Always require explicit opt-in
- Example: Force push, delete files, destructive operations

## Migration Checklist

When updating a command from old YES/NO to AskUserQuestion:

- [ ] Replace "Proceed? (YES/NO)" with AskUserQuestion
- [ ] Replace "(y/n)" prompts with AskUserQuestion
- [ ] Replace numbered lists with AskUserQuestion
- [ ] Add recommendations with reasoning
- [ ] Include 3+ options (recommended, alternative, skip/cancel)
- [ ] Keep header ≤12 characters
- [ ] Add visual markers for priority (⭐⚠️🎯📚💡)
- [ ] Provide specific, actionable descriptions
- [ ] Use multiSelect: true only when multiple selections make sense
- [ ] Update TODO list to reference AskUserQuestion instead of YES/NO

## Examples by Command Type

### /AgileFlow:story
```xml
<invoke name="AskUserQuestion">
<parameter name="questions">[{
  "question": "Create story <STORY>: <TITLE> with these files?",
  "header": "Create story",
  "multiSelect": false,
  "options": [
    {"label": "Yes, create story", "description": "Write story file, test stub, update status.json (Recommended)"},
    {"label": "No, revise first", "description": "Modify content before creating"},
    {"label": "Cancel", "description": "Don't create this story"}
  ]
}]</parameter>
</invoke>
```

### /AgileFlow:epic
```xml
<invoke name="AskUserQuestion">
<parameter name="questions">[{
  "question": "Create epic <EPIC>: <TITLE> with <N> stories?",
  "header": "Create epic",
  "multiSelect": false,
  "options": [
    {"label": "Yes, create epic", "description": "Create epic file, stories, update status (Recommended)"},
    {"label": "No, adjust stories", "description": "Modify story list first"},
    {"label": "Cancel", "description": "Don't create this epic"}
  ]
}]</parameter>
</invoke>
```

### /AgileFlow:babysit (initial suggestions)
```xml
<invoke name="AskUserQuestion">
<parameter name="questions">[{
  "question": "What would you like to work on?",
  "header": "Choose task",
  "multiSelect": false,
  "options": [
    {"label": "US-0042: Login API (READY) ⭐", "description": "✅ Ready | High priority | Unblocks 3 stories"},
    {"label": "EP-0005: Payment (80% done)", "description": "🎯 Near complete | Finish strong"},
    {"label": "Research: JWT practices", "description": "📚 Prep work | Avoid bugs"},
    {"label": "Create new epic/story", "description": "💡 Start something new"},
    {"label": "Other", "description": "Custom input"}
  ]
}]</parameter>
</invoke>
```

### /AgileFlow:configure
```xml
<invoke name="AskUserQuestion">
<parameter name="questions">[{
  "question": "Which features would you like to configure? (Select multiple)",
  "header": "Features",
  "multiSelect": true,
  "options": [
    {"label": "Git Repository", "description": "Initialize git and add remote"},
    {"label": "Hooks System", "description": "Event-driven automation (Recommended - enables auto-archival)"},
    {"label": "Auto-Archival", "description": "Manage status.json size (Recommended - prevents token limit)"},
    {"label": "CI/CD", "description": "Automated testing"}
  ]
}]</parameter>
</invoke>
```

## Common Mistakes to Avoid

### ❌ DON'T: Vague options
```json
{"label": "Yes", "description": "Proceed"}
```

### ✅ DO: Specific, actionable options
```json
{"label": "Yes, create workflow", "description": "Write .github/workflows/ci.yml, runs on PR (Recommended)"}
```

---

### ❌ DON'T: Missing recommendations
```json
{"label": "Option A", "description": "Do thing A"}
{"label": "Option B", "description": "Do thing B"}
```

### ✅ DO: Clear recommendations with reasoning
```json
{"label": "GitHub Actions", "description": "Free for public repos, 2000 min/month (Recommended - you're using GitHub)"}
{"label": "GitLab CI", "description": "Alternative if you prefer GitLab"}
```

---

### ❌ DON'T: Only 2 options (yes/no clone)
```json
{"label": "Yes", "description": "Do it"}
{"label": "No", "description": "Don't do it"}
```

### ✅ DO: Give users control with 3+ options
```json
{"label": "Yes, proceed", "description": "Create files (Recommended)"}
{"label": "No, customize", "description": "Adjust before creating"}
{"label": "Cancel", "description": "Don't create"}
```

---

### ❌ DON'T: Header too long
```json
{"header": "Create new story with AC"}  // 24 chars - TOO LONG
```

### ✅ DO: Header ≤12 chars
```json
{"header": "Create"}  // 6 chars - GOOD
```

## Tool Constraints

- **Max 4 questions** per invocation
- **Max header length**: 12 characters
- **Min options**: 2 (but recommend 3+ for better UX)
- **Max options**: No hard limit, but 4-6 is optimal (avoid decision paralysis)
- **User always gets "Other"** option automatically for custom text input

## Testing Your AskUserQuestion

Before committing, verify:
1. [ ] XML is valid (proper closing tags)
2. [ ] JSON is valid (proper quotes, commas, brackets)
3. [ ] Header ≤12 characters
4. [ ] At least one option has "(Recommended)" with reasoning
5. [ ] Descriptions are specific and actionable
6. [ ] Labels are not just "Yes/No" but describe the action
7. [ ] Question is specific (not "Continue?" but "Create US-0042 with these AC?")
