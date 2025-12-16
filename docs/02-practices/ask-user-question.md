# AskUserQuestion Patterns

Best practices for using the AskUserQuestion tool across AgileFlow commands.

## Quick Reference

```xml
<invoke name="AskUserQuestion">
<parameter name="questions">[{
  "question": "Your question here?",
  "header": "Label",
  "multiSelect": false,
  "options": [
    {"label": "Option 1", "description": "Description (Recommended)"},
    {"label": "Option 2", "description": "Alternative"},
    {"label": "Skip", "description": "Cancel this action"}
  ]
}]</parameter>
</invoke>
```

## Constraints

| Property | Limit |
|----------|-------|
| `header` | Max 12 characters |
| `questions` | Max 4 per invocation |
| `options` | Min 2, recommended 3-6 |

## Key Principles

### 1. Always Recommend
Mark best option with `(Recommended)` and explain why:
```json
{"label": "GitHub Actions", "description": "Free for public repos (Recommended - you're using GitHub)"}
```

### 2. Be Specific
```
Bad:  "Continue?"
Good: "Create US-0042 with these acceptance criteria?"
```

### 3. Give Control
Always offer 3+ options:
- Recommended action (with reason)
- Alternative approach
- Skip/Cancel/Pause

### 4. Use Visual Markers
- `⭐` READY stories
- `⚠️` Blocked items
- `🎯` Near-complete
- `📚` Research
- `💡` New ideas

---

## Common Patterns

### Confirm File Changes

```xml
<invoke name="AskUserQuestion">
<parameter name="questions">[{
  "question": "Apply these changes to src/api/user.ts?",
  "header": "Confirm",
  "multiSelect": false,
  "options": [
    {"label": "Yes, apply changes", "description": "Write the diff to file (Recommended)"},
    {"label": "No, revise first", "description": "Modify before applying"},
    {"label": "Skip this file", "description": "Move to next step"}
  ]
}]</parameter>
</invoke>
```

### Confirm Command Execution

```xml
<invoke name="AskUserQuestion">
<parameter name="questions">[{
  "question": "Run: npm test?",
  "header": "Run cmd",
  "multiSelect": false,
  "options": [
    {"label": "Yes, run it", "description": "Execute command (Recommended - safe operation)"},
    {"label": "No, modify", "description": "Adjust command first"},
    {"label": "Skip", "description": "Don't run"}
  ]
}]</parameter>
</invoke>
```

### Next Action

```xml
<invoke name="AskUserQuestion">
<parameter name="questions">[{
  "question": "Next: Create US-0042 story file. Proceed?",
  "header": "Next step",
  "multiSelect": false,
  "options": [
    {"label": "Yes, proceed", "description": "Create story, test stub, update status (Recommended)"},
    {"label": "Different approach", "description": "Adjust the plan"},
    {"label": "Pause here", "description": "Review and come back later"}
  ]
}]</parameter>
</invoke>
```

### Task Selection

```xml
<invoke name="AskUserQuestion">
<parameter name="questions">[{
  "question": "What would you like to work on?",
  "header": "Choose task",
  "multiSelect": false,
  "options": [
    {"label": "US-0042: Login API (READY) ⭐", "description": "✅ Ready | High priority | Unblocks 3 stories"},
    {"label": "US-0038: Password Reset", "description": "⚠️ Blocked - needs US-0042 first"},
    {"label": "EP-0005: Payment (80%)", "description": "🎯 Near complete | Finish strong"},
    {"label": "Research: JWT practices", "description": "📚 Prep work | Avoid bugs later"},
    {"label": "Other", "description": "Custom input"}
  ]
}]</parameter>
</invoke>
```

### Multiple Selection

```xml
<invoke name="AskUserQuestion">
<parameter name="questions">[{
  "question": "Which CI steps to include? (Select multiple)",
  "header": "CI Steps",
  "multiSelect": true,
  "options": [
    {"label": "Install deps", "description": "npm ci (Recommended)"},
    {"label": "Run tests", "description": "npm test (Recommended)"},
    {"label": "Run linter", "description": "npm run lint"},
    {"label": "Type check", "description": "tsc --noEmit"}
  ]
}]</parameter>
</invoke>
```

### Multiple Questions

```xml
<invoke name="AskUserQuestion">
<parameter name="questions">[
  {
    "question": "Test command?",
    "header": "Tests",
    "multiSelect": false,
    "options": [
      {"label": "npm test", "description": "Standard (Recommended)"},
      {"label": "jest", "description": "Direct Jest"},
      {"label": "vitest", "description": "Vitest"}
    ]
  },
  {
    "question": "Lint command?",
    "header": "Lint",
    "multiSelect": false,
    "options": [
      {"label": "npm run lint", "description": "Standard (Recommended)"},
      {"label": "eslint .", "description": "Direct ESLint"}
    ]
  }
]</parameter>
</invoke>
```

---

## Recommendation Logic

### Story Selection Priority
1. **READY** → Always first
2. **Blocked with clear unblock** → "Clear path"
3. **Near-complete epic** → "Finish started"
4. **Roadmap priority** → "High-priority"
5. **Research** → "Avoid debugging"

### Configuration Priority
1. **Standard setup** → "standard team setup"
2. **Most popular** → "most teams use this"
3. **Detected from project** → "detected in package.json"

### Dangerous Operations
- **Never** mark as Recommended
- Always require explicit opt-in
- Examples: force push, delete, destructive

---

## Common Mistakes

| Don't | Do |
|-------|-----|
| `"label": "Yes"` | `"label": "Yes, create story"` |
| `"description": "Proceed"` | `"description": "Write 3 files, run tests (Recommended)"` |
| `"header": "Create new story"` | `"header": "Create"` |
| Only 2 options | 3+ options (action, alternative, skip) |
| Missing recommendation | One option with `(Recommended)` |

---

## Checklist

Before using AskUserQuestion:
- [ ] Header ≤12 characters
- [ ] Question is specific (not just "Continue?")
- [ ] 3+ options provided
- [ ] One option marked `(Recommended)` with reason
- [ ] Labels describe action (not just "Yes/No")
- [ ] Descriptions are actionable
- [ ] Visual markers used where helpful
