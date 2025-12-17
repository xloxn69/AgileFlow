---
name: agileflow-tech-debt
description: Identifies and tracks technical debt items with impact/effort matrix and prioritization. Loads when discussing code quality, refactoring, or long-term maintenance.
---

# AgileFlow Tech Debt

Identifies, documents, prioritizes, and tracks technical debt using impact/effort matrix and priority scoring to manage debt systematically.

## When to Use

This skill activates when:
- Discussing code quality, refactoring, maintenance issues
- Keywords: "tech debt", "needs cleanup", "messy code", "technical debt"
- Team pain points from retrospectives
- Developer complaints about specific code areas
- During code reviews when debt is identified

## What This Does

1. Identifies technical debt from user descriptions
2. Classifies type (Code Quality, Performance, Security, Maintainability, Testing)
3. Assesses impact/urgency/effort (1-5 scale)
4. Calculates priority score: (Impact × Urgency) / Effort
5. Documents in docs/08-quality/tech-debt.md
6. Suggests actions (create story for high-priority items)

## Instructions

1. **Identify tech debt** from user description or code analysis:
   - What specific code/system is problematic?
   - Why is this debt (not just "messy" but concrete issues)?
   - What pain does it cause?

2. **Classify type**:
   - Code Quality | Performance | Security | Maintainability | Testing

3. **Assess dimensions** (1-5 scale):
   - **Impact**: How much does this hurt us?
   - **Urgency**: How soon must we fix?
   - **Effort**: How hard to fix?

4. **Calculate priority score**: (Impact × Urgency) / Effort
   - Score >10: High Priority (DO NOW)
   - Score 3-10: Medium Priority (PLAN)
   - Score <3: Low Priority (LATER)

5. **Document item** in docs/08-quality/tech-debt.md:
   - ID: TD-### (next sequential number)
   - Include: Problem, Impact, Proposed Solution, Effort, Priority Score, Status

6. **Suggest actions**:
   - **High priority (>10)**: Create story via `/agileflow:story`
   - **Major refactoring**: Document via `/agileflow:adr-new`
   - **Blocking features**: Update status.json with blocked stories

## Tech Debt Item Template

```markdown
### [TD-###] Descriptive Title

**Impact**: 1-5 (Low/Medium/High)
**Urgency**: 1-5 (Low/Medium/High)
**Effort**: 1-5 (Low <1 sprint / Medium 1-2 sprints / High >2 sprints)
**Priority Score**: (Impact × Urgency) / Effort = X.X
**Type**: Code Quality | Performance | Security | Maintainability | Testing
**Status**: Identified | Planned | In Progress | Resolved

**Problem**:
[What's wrong? Be specific, not vague.]

**Impact**:
- [How does this hurt us? Specific pain points]
- [What can't we do because of this?]

**Proposed Solution**:
- [What should we do to address this?]
- [What tools/patterns to use?]

**Estimated Effort**: X story points
```

## Priority Score Formula

```
Priority = (Impact × Urgency) / Effort

Impact:  1 (Low), 3 (Medium), 5 (High)
Urgency: 1 (Low), 3 (Medium), 5 (High)
Effort:  1 (Low <1 sprint), 3 (Medium 1-2 sprints), 5 (High >2 sprints)
```

**Examples**:
- TD-042: (3 × 3) / 1 = 9 (High Priority - duplicate code, easy fix)
- TD-067: (5 × 5) / 1 = 25 (Critical Priority - slow query, add index)
- TD-089: (1 × 1) / 5 = 0.2 (Low Priority - minor cleanup, major refactor)

## Impact/Effort Matrix

```
High Impact,  │ DO NOW │ DO NOW │        │
Low Effort    │        │        │        │
              ├────────┼────────┼────────┤
High Impact,  │ PLAN   │ PLAN   │        │
Med Effort    │        │        │        │
              ├────────┼────────┼────────┤
Low Impact,   │ LATER  │ LATER  │ NEVER  │
Any Effort    │        │        │        │
              └────────┴────────┴────────┘
              Low      Medium    High
                    EFFORT
```

## Types of Tech Debt

**Code Quality**: Duplicate code, complex logic, poor naming, missing docs
- Example: User validation copy-pasted in 8 files

**Performance**: Slow queries, N+1 problems, inefficient algorithms, missing caching
- Example: Login query takes 500ms due to missing index

**Security**: Outdated dependencies, vulnerable packages, missing auth, insufficient validation
- Example: Package X has known CVE, needs update

**Maintainability**: Tightly coupled code, missing tests, unclear architecture
- Example: Module X has 0 tests, 300 LOC

**Testing**: Low coverage, flaky tests, slow suite, missing integration tests
- Example: Test coverage at 45%, target is 80%

## When to Address Tech Debt

**Continuous** (Every Sprint):
- Allocate 10-20% of sprint capacity for debt reduction
- Boy Scout Rule: Leave code cleaner than you found it

**Scheduled** (Quarterly):
- Tech debt sprint (full sprint dedicated to quality)
- Major refactoring initiatives

**Opportunistic**:
- While working on nearby code
- When adding related features
- During bug fixes in affected areas

**Strategic**:
- Before major new features (clean foundation)
- When debt blocks progress (unblock development)
- When quality metrics decline

## Tech Debt Metrics

Track in docs/08-quality/tech-debt.md:

```markdown
## Tech Debt Health (Q4 2025)

**Total Items**: 24 (🔴 6 High, 🟡 11 Medium, 🟢 7 Low)
**Total Estimated Effort**: 156 story points
**Resolved This Quarter**: 8 items (42 story points)
**New This Quarter**: 5 items (18 story points)
**Net Change**: -3 items (-24 points) ✅ Improving
```

## Quality Checklist

Before creating tech debt item:
- [ ] Problem clearly described (specific code/system, not vague)
- [ ] Impact explained with concrete pain points
- [ ] Proposed solution is specific and actionable
- [ ] Effort estimated realistically
- [ ] Priority score calculated: (Impact × Urgency) / Effort
- [ ] Type assigned correctly
- [ ] Owner or responsible team identified
- [ ] Status set appropriately
- [ ] TD-### ID is next sequential number

## Priority Tiers

- **🔴 High Priority (score >10)**: DO NOW - High impact, low-medium effort
- **🟡 Medium Priority (score 3-10)**: PLAN - Mixed impact/effort
- **🟢 Low Priority (score <3)**: LATER - Low impact or high effort

## Integration

- **agileflow-story**: Convert high-priority debt (>10) to stories
- **agileflow-adr**: Document major refactoring decisions
- **agileflow-retro**: Retrospectives surface new tech debt
- **agileflow-sprint**: Allocate 10-20% sprint capacity for debt reduction

## Preventing Tech Debt

**Best Practices**:
- Code reviews catch issues early
- Automated testing prevents regressions (80%+ coverage)
- Regular refactoring (Boy Scout Rule)
- Document intentional decisions (ADRs)
- Allocate time for quality work

**Warning Signs**:
- Slowing velocity (stories taking longer)
- Increasing bug rate
- Developers avoiding certain code
- Long PR review times
- New developer onboarding difficulty

## Notes

- Track tech debt, don't let it hide (visibility is key)
- Make it visible (metrics, reviews)
- Allocate consistent capacity (10-20% per sprint)
- Celebrate debt reduction
- Prevent new debt through code review
- Balance new features with quality
- Not all "ugly code" is debt - document intentional trade-offs as ADRs
