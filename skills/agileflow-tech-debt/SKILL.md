---
name: agileflow-tech-debt
description: Identifies and tracks technical debt items with impact/effort matrix and prioritization. Loads when discussing code quality, refactoring, or long-term maintenance.
allowed-tools: Read, Write, Edit, Glob
---

# AgileFlow Tech Debt

## Purpose

This skill helps identify, document, and prioritize technical debt, ensuring it doesn't accumulate to the point of slowing down development.

## When This Skill Activates

Load this skill when:
- User mentions "tech debt", "refactoring", "code quality"
- Discussing code that's hard to maintain
- User says "this is messy", "needs cleanup", "temporary solution"
- Talking about slow test suites or builds
- Discussing "shortcuts we took" or "quick fixes"

## Tech Debt Format

```markdown
# Tech Debt Inventory

Last Updated: YYYY-MM-DD

## High Priority (Impact: High, Effort: Low-Medium) 🔴

### [TD-###] Title
**Impact**: High | Medium | Low
**Effort**: Low (< 1 sprint) | Medium (1-2 sprints) | High (> 2 sprints)
**Type**: Code Quality | Performance | Security | Maintainability | Testing
**Created**: YYYY-MM-DD
**Owner**: Team/Person responsible

**Problem**:
[What's wrong? Why is this debt?]

**Impact**:
- [How does this hurt us? Specific pain points]
- [What can't we do because of this?]

**Proposed Solution**:
- [What should we do to address this?]

**Estimated Effort**: X story points / Y hours / Z sprints

**Priority Score**: [Impact × Urgency / Effort]

**Status**: Identified | Planned | In Progress | Resolved

---

## Medium Priority (Mixed Impact/Effort) 🟡

[Same format as above]

## Low Priority (Impact: Low or Effort: High) 🟢

[Same format as above]

## Resolved Tech Debt ✅

[Completed items for reference]
```

## Impact/Effort Matrix

```
High Impact,  │ TD-012 │ TD-045 │        │
Low Effort    │ DO NOW │ DO NOW │        │
              ├────────┼────────┼────────┤
High Impact,  │ TD-023 │ TD-067 │        │
Med Effort    │ PLAN   │ PLAN   │        │
              ├────────┼────────┼────────┤
Low Impact,   │ TD-089 │ TD-091 │ TD-003 │
Any Effort    │ LATER  │ LATER  │ NEVER  │
              └────────┴────────┴────────┘
              Low      Medium    High
                    EFFORT
```

## Types of Tech Debt

### Code Quality
- Duplicate code
- Complex/nested logic
- Poor naming
- Missing documentation
- Inconsistent patterns

**Example**:
```markdown
### [TD-042] Extract Duplicate User Validation Logic

**Impact**: Medium - Code is duplicated across 8 files
**Effort**: Low - ~3 hours to extract into utility module
**Type**: Code Quality

**Problem**:
User validation logic (email format, password strength) is copy-pasted
in 8 different files. Changes require updating all 8 locations.

**Impact**:
- Bug fixes take longer (must update multiple places)
- Inconsistent behavior across modules
- New developers confused by duplicated code

**Proposed Solution**:
- Extract to `utils/userValidation.ts`
- Replace all 8 instances with utility calls
- Add unit tests for validation logic

**Estimated Effort**: 3 story points
```

### Performance
- Slow queries
- N+1 problems
- Inefficient algorithms
- Missing caching
- Large bundle sizes

**Example**:
```markdown
### [TD-067] Add Database Index on User Email Column

**Impact**: High - Every login query does full table scan
**Effort**: Low - 10 minutes to add index
**Type**: Performance

**Problem**:
User lookup by email takes ~500ms for 100K users due to missing index.

**Impact**:
- Slow login experience (500ms → should be <10ms)
- Database CPU at 80% during peak hours
- Cannot scale to 1M+ users

**Proposed Solution**:
- Add index: `CREATE INDEX idx_users_email ON users(email)`
- Test with production data copy
- Deploy during low-traffic window

**Estimated Effort**: 1 story point
```

### Security
- Outdated dependencies
- Vulnerable packages
- Missing authentication
- Insufficient validation
- Exposed secrets

### Maintainability
- Tightly coupled code
- Missing tests
- Unclear architecture
- No documentation
- Hard to deploy

### Testing
- Low coverage
- Flaky tests
- Slow test suite
- Missing integration tests
- No E2E tests

## Prioritization Framework

### Priority Score Formula:
```
Priority = (Impact × Urgency) / Effort

Impact:  1 (Low), 3 (Medium), 5 (High)
Urgency: 1 (Low), 3 (Medium), 5 (High)
Effort:  1 (Low), 3 (Medium), 5 (High)
```

### Example:
```
TD-042: (3 × 3) / 1 = 9  → High Priority
TD-067: (5 × 5) / 1 = 25 → Critical Priority
TD-089: (1 × 1) / 5 = 0.2 → Low Priority
```

## When to Address Tech Debt

### Continuous (Every Sprint):
- Allocate 10-20% of sprint capacity
- Pay interest as you go
- Fix small items immediately

### Scheduled (Quarterly):
- Tech debt sprint (full sprint)
- Major refactoring initiatives
- Architecture improvements

### Opportunistic:
- While working on nearby code
- When adding related features
- During bug fixes

### Strategic:
- Before major new features
- When debt blocks progress
- When quality metrics decline

## Tech Debt Metrics

Track these over time:

```markdown
## Tech Debt Health (Q1 2025)

**Total Items**: 24 (🔴 6 High, 🟡 11 Medium, 🟢 7 Low)
**Total Estimated Effort**: 156 story points
**Resolved This Quarter**: 8 items (42 story points)
**New This Quarter**: 5 items (18 story points)
**Net Change**: -3 items (-24 points) ✅ Improving

**Top Contributors**:
- Legacy authentication module: 6 items (45 points)
- Missing test coverage: 5 items (30 points)
- Outdated dependencies: 4 items (20 points)

**Blockers**:
- TD-012 blocks 3 planned features
- TD-045 causes 60% of production bugs
```

## Quality Checklist

Good tech debt items should:
- [ ] Clearly describe the problem
- [ ] Explain the impact (not just "it's messy")
- [ ] Propose a specific solution
- [ ] Estimate effort realistically
- [ ] Have an owner or responsible team
- [ ] Include priority score
- [ ] Link to related stories/epics if applicable

## Integration with Other Skills

- **agileflow-adr**: Major refactoring decisions become ADRs
- **agileflow-story-writer**: High-priority debt becomes stories
- **agileflow-retro-facilitator**: Retros surface new tech debt
- **agileflow-sprint-planner**: Allocate capacity for debt each sprint

## Preventing Tech Debt

### Best Practices:
- ✅ Code reviews catch issues early
- ✅ Automated testing prevents regressions
- ✅ Regular refactoring (Boy Scout Rule)
- ✅ Document intentional decisions (ADRs)
- ✅ Allocate time for quality work
- ✅ Monitor metrics (coverage, complexity, performance)

### Warning Signs:
- 🔴 Slowing velocity
- 🔴 Increasing bug rate
- 🔴 Developers avoiding certain code
- 🔴 "It's too scary to touch"
- 🔴 Long PR review times

## Debt vs Investment

Not all "ugly code" is tech debt:

### Tech Debt (Should Fix):
- Code that slows us down
- Blocks new features
- Causes bugs
- Hampers onboarding

### Intentional Trade-offs (OK to Keep):
- Prototype/POC code (if labeled)
- Code that works and won't change
- Third-party library quirks
- Platform limitations

Document intentional trade-offs as ADRs, not tech debt.

## Communication

### To Stakeholders:
```markdown
"We have $156k in tech debt (story points × hourly rate).
Paying down high-priority items would:
- Reduce bug rate by 40%
- Speed up feature development by 25%
- Improve developer satisfaction

Proposal: Dedicate one sprint to high-impact, low-effort items."
```

### To Team:
```markdown
"Let's tackle TD-042 this sprint. It's blocking 3 upcoming features
and should only take 3 points. Who wants to own it?"
```

## Notes

- Track tech debt, don't let it hide
- Make it visible (dashboard, metrics)
- Allocate consistent capacity (10-20% per sprint)
- Celebrate debt reduction
- Prevent new debt through code review
- Balance new features with quality
- Tech debt is not failure - it's reality of software development
