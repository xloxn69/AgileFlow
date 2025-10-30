---
name: agileflow-tech-debt
description: Identifies and tracks technical debt items with impact/effort matrix and prioritization. Loads when discussing code quality, refactoring, or long-term maintenance.
allowed-tools: Read, Write, Edit, Glob
---

# agileflow-tech-debt

ROLE & IDENTITY
- Skill ID: TECH-DEBT
- Specialization: Technical debt identification, tracking, and prioritization with impact/effort scoring
- Part of the AgileFlow docs-as-code system

OBJECTIVE
Identify, document, prioritize, and track technical debt using impact/effort matrix and priority scoring. Ensure debt is visible, measured, and addressed systematically without accumulating to the point of slowing down development.

INPUTS
- User mentions of code quality, refactoring, maintenance issues ("tech debt", "needs cleanup", "messy code")
- Existing tech debt inventory at docs/08-quality/tech-debt.md
- Codebase analysis (complexity, duplication, test coverage)
- Team pain points from retrospectives
- Developer complaints about specific code areas

FIRST ACTION

**Deterministic boot sequence**:
1. Check if docs/08-quality/tech-debt.md exists: `[ -f docs/08-quality/tech-debt.md ] && echo "Found" || echo "Not found"`
2. If found, read existing tech debt inventory to understand current state
3. Count current items by priority: `grep -c "## High Priority" docs/08-quality/tech-debt.md`
4. Calculate total estimated effort from existing items
5. Identify last TD-### ID to determine next number

PROACTIVE KNOWLEDGE LOADING

**Before documenting tech debt**:
- Read docs/08-quality/tech-debt.md for existing debt items and numbering
- Check docs/09-agents/bus/log.jsonl for recent tech debt mentions from agents
- Read docs/03-decisions/ for architectural constraints that may affect solutions
- Scan docs/09-agents/retro/ for retrospective notes mentioning quality issues
- Review recent code review comments for patterns indicating tech debt

**Tech Debt Classification Knowledge**:
- **Code Quality**: Duplicate code, complex logic, poor naming, missing docs, inconsistent patterns
- **Performance**: Slow queries, N+1 problems, inefficient algorithms, missing caching, large bundles
- **Security**: Outdated dependencies, vulnerable packages, missing auth, insufficient validation
- **Maintainability**: Tightly coupled code, missing tests, unclear architecture, hard to deploy
- **Testing**: Low coverage, flaky tests, slow suite, missing integration/E2E tests

WORKFLOW

1. **Identify tech debt** from user description, code analysis, or pain points:
   - What specific code/system is problematic?
   - Why is this debt (not just "messy" but concrete issues)?
   - What pain does it cause (slows features, causes bugs, blocks scaling)?

2. **Classify type**:
   - Code Quality | Performance | Security | Maintainability | Testing
   - Use most specific type (e.g., "Performance" not just "Code Quality")

3. **Assess dimensions** (1-5 scale):
   - **Impact**: How much does this hurt us? (1=Low, 3=Medium, 5=High)
   - **Urgency**: How soon must we fix? (1=Low, 3=Medium, 5=High)
   - **Effort**: How hard to fix? (1=Low <1 sprint, 3=Medium 1-2 sprints, 5=High >2 sprints)

4. **Calculate Priority Score**:
   - Formula: `Priority = (Impact × Urgency) / Effort`
   - Example: High impact (5), High urgency (5), Low effort (1) → (5 × 5) / 1 = **25** (Critical)
   - Example: Medium impact (3), Medium urgency (3), Low effort (1) → (3 × 3) / 1 = **9** (High)
   - Example: Low impact (1), Low urgency (1), High effort (5) → (1 × 1) / 5 = **0.2** (Low)

5. **Determine priority tier**:
   - **Score >10**: 🔴 High Priority (DO NOW)
   - **Score 3-10**: 🟡 Medium Priority (PLAN)
   - **Score <3**: 🟢 Low Priority (LATER)

6. **Create tech debt item**:
   - ID: TD-### (next sequential number)
   - Include: Problem, Impact, Proposed Solution, Estimated Effort, Priority Score, Status
   - Format following template (see Tech Debt Item Template below)

7. **Update docs/08-quality/tech-debt.md** (diff-first, YES/NO):
   - Add item under appropriate priority tier
   - Update metrics section (total items, total effort, net change)
   - Update "Last Updated" timestamp

8. **Suggest actions**:
   - **High priority (score >10)**: Suggest creating story via `/AgileFlow:story`
   - **Major refactoring**: Suggest documenting decision via `/AgileFlow:adr-new`
   - **Blocking features**: Suggest updating status.json with blocked stories
   - **Quarterly review**: Update tech debt health metrics

RELATED COMMANDS

- `/AgileFlow:adr-new` - Document major refactoring decisions (architecture changes)
- `/AgileFlow:story` - Convert high-priority debt to actionable stories (score >10)
- `/AgileFlow:retro` - Retrospectives surface new tech debt (use to capture pain points)
- `/AgileFlow:sprint` - Allocate 10-20% sprint capacity for debt reduction
- `/AgileFlow:ai-code-review` - Identify tech debt during code reviews
- `/AgileFlow:chatgpt MODE=research TOPIC=...` - Research refactoring approaches

**When to use slash commands**:
- After documenting high-priority debt → `/AgileFlow:story` to schedule work
- For major architectural refactoring → `/AgileFlow:adr-new` to document decision
- Quarterly tech debt review → `/AgileFlow:sprint` to allocate capacity
- During retros → `/AgileFlow:retro` to capture new debt items

OUTPUTS

- Tech debt item at docs/08-quality/tech-debt.md with:
  - TD-### ID and descriptive title
  - Impact/Urgency/Effort scores (1-5 scale)
  - Priority score calculation
  - Priority tier assignment (High 🔴, Medium 🟡, Low 🟢)
  - Problem description, impact, proposed solution
  - Estimated effort (story points or time)
  - Owner and status
- Updated tech debt metrics (total items, total effort, net change)
- Optional: Story created for high-priority debt (via `/AgileFlow:story`)

HANDOFFS

**AgileFlow Coordination** (if working within AgileFlow system):
- **High-priority debt (score >10)**: Suggest creating story in docs/06-stories/ via `/AgileFlow:story`
  - Story gets added to status.json with owner (AG-REFACTOR or relevant agent)
  - Example bus message: `{"ts":"2025-10-30T10:00:00Z","from":"TECH-DEBT","type":"status","story":"US-0078","text":"High-priority tech debt TD-042 converted to story, assigned to AG-REFACTOR"}`
- **Major refactoring**: Document architectural decision via `/AgileFlow:adr-new` in docs/03-decisions/
- **Debt blocking features**: If tech debt blocks story, update status.json:
  - Blocked story status → `blocked`
  - Add dependency: `"dependencies": ["TD-042"]`
- **Quarterly metrics**: Include tech debt health in stakeholder updates
- **Security debt**: Coordinate with AG-SECURITY agent for vulnerability remediation

**Tech Debt Lifecycle**:
- Identified → docs/08-quality/tech-debt.md (status: Identified)
- High priority → Convert to story (status: Planned, appears in status.json)
- Assigned → Dev agent picks up (status: In Progress)
- Resolved → Marked complete (status: Resolved, moved to "Resolved Tech Debt" section)

**Security Note**: Security-related tech debt (outdated deps, vulnerabilities) should be prioritized immediately and coordinated with AG-SECURITY agent.

QUALITY CHECKLIST

Before creating tech debt item, verify:
- [ ] Problem clearly described (specific code/system, not vague "messy")
- [ ] Impact explained with concrete pain points (not just "it's messy")
- [ ] Proposed solution is specific and actionable
- [ ] Effort estimated realistically (story points or time)
- [ ] Priority score calculated: (Impact × Urgency) / Effort
- [ ] Type assigned (Code Quality/Performance/Security/Maintainability/Testing)
- [ ] Owner or responsible team identified
- [ ] Status set (Identified/Planned/In Progress/Resolved)
- [ ] TD-### ID is next sequential number
- [ ] Item added under correct priority tier (🔴/🟡/🟢)

## Prioritization Framework

### Priority Score Formula

```
Priority = (Impact × Urgency) / Effort

Impact:  1 (Low), 3 (Medium), 5 (High)
Urgency: 1 (Low), 3 (Medium), 5 (High)
Effort:  1 (Low <1 sprint), 3 (Medium 1-2 sprints), 5 (High >2 sprints)
```

### Scoring Examples

```
TD-042: (3 × 3) / 1 = 9   → High Priority (duplicate code, easy fix)
TD-067: (5 × 5) / 1 = 25  → Critical Priority (slow query, add index)
TD-089: (1 × 1) / 5 = 0.2 → Low Priority (minor cleanup, major refactor)
```

### Priority Tiers

- **🔴 High Priority (score >10)**: DO NOW - High impact, low-medium effort, blocks features
- **🟡 Medium Priority (score 3-10)**: PLAN - Mixed impact/effort, include in sprint planning
- **🟢 Low Priority (score <3)**: LATER - Low impact or high effort, address opportunistically

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
- Duplicate code across multiple files
- Complex/nested logic (high cyclomatic complexity)
- Poor naming (unclear variables/functions)
- Missing documentation
- Inconsistent patterns

**Example**:
```markdown
### [TD-042] Extract Duplicate User Validation Logic

**Impact**: 3 (Medium) - Code duplicated across 8 files
**Urgency**: 3 (Medium) - Causes bugs when logic diverges
**Effort**: 1 (Low) - ~3 hours to extract into utility module
**Priority Score**: (3 × 3) / 1 = **9** (High Priority)
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
- Slow database queries (missing indexes)
- N+1 query problems
- Inefficient algorithms (O(n²) when O(n log n) possible)
- Missing caching
- Large bundle sizes

**Example**:
```markdown
### [TD-067] Add Database Index on User Email Column

**Impact**: 5 (High) - Every login query does full table scan
**Urgency**: 5 (High) - Affects all users, slows login
**Effort**: 1 (Low) - 10 minutes to add index
**Priority Score**: (5 × 5) / 1 = **25** (Critical Priority)
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
- Outdated dependencies (known vulnerabilities)
- Vulnerable packages (CVE warnings)
- Missing authentication checks
- Insufficient input validation
- Exposed secrets in code

### Maintainability
- Tightly coupled code (hard to test)
- Missing tests (low coverage)
- Unclear architecture (no docs)
- Hard to deploy (manual steps)
- Configuration complexity

### Testing
- Low test coverage (<80%)
- Flaky tests (intermittent failures)
- Slow test suite (>10 min for unit tests)
- Missing integration tests
- No E2E tests for critical flows

## When to Address Tech Debt

### Continuous (Every Sprint)
- Allocate 10-20% of sprint capacity for debt reduction
- Pay interest as you go (fix small items immediately)
- Boy Scout Rule: Leave code cleaner than you found it

### Scheduled (Quarterly)
- Tech debt sprint (full sprint dedicated to quality)
- Major refactoring initiatives
- Architecture improvements

### Opportunistic
- While working on nearby code (touch it, improve it)
- When adding related features
- During bug fixes in affected areas

### Strategic
- Before major new features (clean foundation)
- When debt blocks progress (unblock development)
- When quality metrics decline (coverage drops, bugs increase)

## Tech Debt Metrics

Track these over time in docs/08-quality/tech-debt.md:

```markdown
## Tech Debt Health (Q4 2025)

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
- TD-012 blocks 3 planned features (US-0045, US-0046, US-0047)
- TD-045 causes 60% of production bugs
```

## Tech Debt Item Template

```markdown
### [TD-###] Descriptive Title

**Impact**: 1-5 (Low/Medium/High) - What hurts?
**Urgency**: 1-5 (Low/Medium/High) - How soon?
**Effort**: 1-5 (Low <1 sprint / Medium 1-2 sprints / High >2 sprints)
**Priority Score**: (Impact × Urgency) / Effort = X.X
**Type**: Code Quality | Performance | Security | Maintainability | Testing
**Created**: YYYY-MM-DD
**Owner**: Team/Person responsible
**Status**: Identified | Planned | In Progress | Resolved

**Problem**:
[What's wrong? Be specific, not vague. "Duplicate validation in 8 files" not "messy code"]

**Impact**:
- [How does this hurt us? Specific pain points]
- [What can't we do because of this?]
- [Quantify if possible: "500ms query", "60% of bugs", "8 duplicated files"]

**Proposed Solution**:
- [What should we do to address this? Specific steps]
- [What tools/patterns to use?]

**Estimated Effort**: X story points / Y hours / Z sprints
```

## Preventing Tech Debt

### Best Practices
- ✅ Code reviews catch issues early (require reviews before merge)
- ✅ Automated testing prevents regressions (80%+ coverage)
- ✅ Regular refactoring (Boy Scout Rule: leave cleaner than you found)
- ✅ Document intentional decisions (ADRs for architecture choices)
- ✅ Allocate time for quality work (10-20% sprint capacity)
- ✅ Monitor metrics (coverage, complexity, performance, bundle size)

### Warning Signs
- 🔴 Slowing velocity (stories taking longer each sprint)
- 🔴 Increasing bug rate (more bugs per feature)
- 🔴 Developers avoiding certain code ("don't touch that module")
- 🔴 "It's too scary to touch" comments
- 🔴 Long PR review times (complex changes, unclear code)
- 🔴 New developer onboarding difficulty

## Debt vs Investment

Not all "ugly code" is tech debt. Distinguish between debt and intentional trade-offs:

### Tech Debt (Should Fix)
- Code that slows us down
- Blocks new features
- Causes bugs frequently
- Hampers developer onboarding

### Intentional Trade-offs (OK to Keep)
- Prototype/POC code (if clearly labeled and isolated)
- Code that works and won't change (stable, low-risk)
- Third-party library quirks (external constraints)
- Platform limitations (can't be fixed by us)

**Document intentional trade-offs as ADRs via `/AgileFlow:adr-new`, not tech debt.**

## Communication Templates

### To Stakeholders
```markdown
"We have $156k in tech debt (156 story points × $1k/point).
Paying down high-priority items would:
- Reduce bug rate by 40% (TD-045 causes 60% of bugs)
- Speed up feature development by 25% (TD-012 blocks 3 features)
- Improve developer satisfaction (less time fighting code)

Proposal: Dedicate one sprint to high-impact, low-effort items (TD-012, TD-042, TD-067).
Expected ROI: 25 story points effort → unlocks 78 story points of features."
```

### To Team
```markdown
"Let's tackle TD-042 this sprint. It's blocking 3 upcoming features
and should only take 3 points. Who wants to own it?"
```

## Notes

- Track tech debt, don't let it hide (visibility is key)
- Make it visible (dashboard, metrics, regular reviews)
- Allocate consistent capacity (10-20% per sprint, not "when we have time")
- Celebrate debt reduction (recognize quality improvements)
- Prevent new debt through code review (catch issues before merge)
- Balance new features with quality (don't just ship, ship sustainably)
- Tech debt is not failure - it's reality of software development (manage it, don't ignore it)
- Use priority scoring to make objective decisions (not just "feels messy")
