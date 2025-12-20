# Plan Mode Patterns

Best practices for using EnterPlanMode and ExitPlanMode tools across AgileFlow commands.

## Quick Reference

### EnterPlanMode
```xml
<invoke name="EnterPlanMode">
<parameter name=""></parameter>
</invoke>
```

### ExitPlanMode
```xml
<invoke name="ExitPlanMode">
<parameter name="launchSwarm">false</parameter>
<parameter name="teammateCount">0</parameter>
</invoke>
```

## What Plan Mode Does

| Normal Mode | Plan Mode |
|-------------|-----------|
| Read + Write operations | Read-only operations |
| Execute changes immediately | Design approach first |
| Quick fixes | Complex implementations |
| Direct implementation | User approval before changes |

---

## When to Use EnterPlanMode

### Use It For

| Scenario | Example |
|----------|---------|
| **New features** | "Add user authentication" |
| **Multiple approaches** | "Add caching" (Redis vs in-memory vs file) |
| **Multi-file changes** | "Refactor the auth system" |
| **Architectural decisions** | "Add real-time updates" (WebSocket vs SSE) |
| **Unclear requirements** | "Make the app faster" |
| **User preferences matter** | Implementation could go multiple ways |

### Skip It For

| Scenario | Example |
|----------|---------|
| **Single-line fixes** | Fix typo in README |
| **Obvious bugs** | Missing semicolon |
| **Specific instructions** | "Add console.log to line 42" |
| **Pure research** | "What files handle routing?" |

---

## Key Principles

### 1. Plan Before Complex Work
Enter plan mode proactively for non-trivial tasks:
```
User: "Add dark mode toggle"
→ Enter plan mode (involves UI, state, styling decisions)

User: "Fix the typo in header"
→ Just fix it (no planning needed)
```

### 2. Explore Thoroughly
In plan mode, use read-only tools extensively:
- `Glob` - Find relevant files
- `Grep` - Search for patterns
- `Read` - Understand existing code
- `Bash` - Inspection commands only (ls, git log, etc.)

### 3. Present Clear Plans
Structure your plan with:
- Files to modify (with line numbers if relevant)
- Specific changes per file
- Implementation order
- Potential risks or trade-offs

### 4. Get User Buy-In
Before exiting plan mode:
- Confirm the approach
- Clarify ambiguities with AskUserQuestion
- Address concerns raised

---

## Common Patterns

### New Feature Implementation

```
1. User requests feature
2. → EnterPlanMode
3. Explore codebase (Glob, Grep, Read)
4. Identify affected files
5. Design implementation approach
6. Present plan to user
7. Answer clarifying questions
8. → ExitPlanMode (with user approval)
9. Implement the plan
```

### Refactoring Task

```
1. User requests refactor
2. → EnterPlanMode
3. Map current architecture
4. Identify dependencies
5. Plan migration steps
6. Note breaking changes
7. Present phased approach
8. → ExitPlanMode
9. Execute phase by phase
```

### Unclear Requirements

```
1. User gives vague request ("make it faster")
2. → EnterPlanMode
3. Profile/analyze current state
4. Identify bottlenecks
5. Present options with trade-offs
6. Use AskUserQuestion to clarify approach
7. Refine plan based on answers
8. → ExitPlanMode
9. Implement chosen solution
```

---

## ExitPlanMode Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `launchSwarm` | boolean | false | Launch parallel agents to implement |
| `teammateCount` | number | 0 | Number of agents if swarm enabled |

### Standard Exit
```xml
<invoke name="ExitPlanMode">
<parameter name="launchSwarm">false</parameter>
</invoke>
```

### Exit with Swarm (Parallel Implementation)
```xml
<invoke name="ExitPlanMode">
<parameter name="launchSwarm">true</parameter>
<parameter name="teammateCount">3</parameter>
</invoke>
```

---

## Plan Quality Checklist

Before calling ExitPlanMode:

- [ ] Explored relevant parts of codebase
- [ ] Identified all files that need changes
- [ ] Considered existing patterns/conventions
- [ ] Noted potential risks or breaking changes
- [ ] Presented clear implementation steps
- [ ] Addressed user questions/concerns
- [ ] Got explicit user approval

---

## Common Mistakes

| Don't | Do |
|-------|-----|
| Enter plan mode for trivial fixes | Just make the fix directly |
| Skip plan mode for complex features | Plan first, implement second |
| Exit without user approval | Confirm approach before exiting |
| Present vague plans | Be specific: files, changes, order |
| Forget to explore first | Read existing code before planning |
| Plan for research tasks | Use Task tool with Explore agent instead |

---

## Integration with AskUserQuestion

When in plan mode, use AskUserQuestion to:

### Clarify Approach
```xml
<invoke name="AskUserQuestion">
<parameter name="questions">[{
  "question": "Which authentication approach should we use?",
  "header": "Auth",
  "multiSelect": false,
  "options": [
    {"label": "JWT tokens", "description": "Stateless, scalable (Recommended for your API)"},
    {"label": "Session-based", "description": "Traditional, simpler"},
    {"label": "OAuth2 only", "description": "Delegate to providers"}
  ]
}]</parameter>
</invoke>
```

### Confirm Plan Before Exit
```xml
<invoke name="AskUserQuestion">
<parameter name="questions">[{
  "question": "Ready to implement this plan?",
  "header": "Confirm",
  "multiSelect": false,
  "options": [
    {"label": "Yes, proceed", "description": "Exit plan mode and start implementation (Recommended)"},
    {"label": "Revise plan", "description": "Adjust the approach first"},
    {"label": "Cancel", "description": "Abandon this plan"}
  ]
}]</parameter>
</invoke>
```

---

## Decision Tree

```
User Request
    │
    ├─ Trivial fix (typo, obvious bug)?
    │   └─ NO plan mode → Just fix it
    │
    ├─ Research/exploration only?
    │   └─ NO plan mode → Use Task tool with Explore agent
    │
    ├─ Specific instructions given?
    │   └─ NO plan mode → Follow instructions directly
    │
    └─ Complex/multi-file/unclear?
        └─ YES → EnterPlanMode
            │
            ├─ Explore codebase
            ├─ Design approach
            ├─ Present plan
            ├─ Clarify with AskUserQuestion
            ├─ Get approval
            └─ ExitPlanMode → Implement
```

---

## Examples

### Good: Complex Feature
```
User: "Add user authentication to the app"

Claude: This requires architectural decisions. Let me enter plan mode
to explore your codebase and design an approach.

[EnterPlanMode]
[Explores auth patterns, database, existing middleware]
[Presents detailed plan with JWT vs sessions trade-offs]
[Uses AskUserQuestion to clarify preferred approach]
[ExitPlanMode after user approves]
[Implements the approved plan]
```

### Bad: Unnecessary Planning
```
User: "Fix the typo in the README"

Claude: Let me enter plan mode to explore...
[WRONG - just fix the typo directly]
```

### Good: Research Without Plan Mode
```
User: "What files handle API routing?"

Claude: [Uses Task tool with Explore agent]
[Returns findings directly - no plan mode needed]
```
