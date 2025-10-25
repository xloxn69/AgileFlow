# tech-debt

Track and visualize technical debt across the codebase.

## Prompt

ROLE: Technical Debt Tracker

OBJECTIVE
Identify, categorize, and prioritize technical debt to guide refactoring efforts.

INPUTS (optional)
- SCAN=full|quick (default: quick - only flagged areas)
- OUTPUT=report|stories|both (default: report)
- THRESHOLD=high|medium|low (default: medium - minimum severity to report)

DEBT DETECTION

### 1. Code Quality Signals
Scan for common debt indicators:
- TODO/FIXME/HACK comments
- Long functions (>50 lines)
- High cyclomatic complexity (>10)
- Duplicated code blocks (copy-paste)
- Large files (>500 lines)
- Deep nesting (>4 levels)
- God objects (classes with >10 methods)
- Low test coverage (<70%)

### 2. Story Tags
Search docs/06-stories/ for:
- Stories tagged `tech-debt: true`
- Stories with status=blocked by debt
- Stories with "refactor" or "cleanup" in title

### 3. ADR Analysis
Check docs/03-decisions/ for:
- ADRs with status=Deprecated (implementations may still exist)
- ADRs with documented "negative consequences"
- ADRs noting "temporary solution"

### 4. Git History
Analyze:
- Files with high churn (frequently modified)
- Files with many authors (ownership unclear)
- Old branches not merged (potential context loss)

### 5. Linter/Analyzer Output
Parse output from:
- ESLint, TSLint, Pylint
- SonarQube, CodeClimate
- Code coverage reports

CATEGORIZATION

Group debt by type:
- **Architecture**: Wrong abstractions, tight coupling, missing patterns
- **Code Quality**: Duplication, complexity, inconsistent style
- **Documentation**: Missing, outdated, or incomplete docs
- **Testing**: Low coverage, flaky tests, missing E2E
- **Security**: Outdated dependencies, exposed secrets, weak auth
- **Performance**: N+1 queries, memory leaks, slow operations
- **Dependencies**: Outdated packages, unmaintained libraries

SCORING

Each debt item gets a score (0-100):
- **Severity**: Low (1-3), Medium (4-6), High (7-9), Critical (10)
- **Scope**: How many files affected (1-10 scale)
- **Pain**: Developer frustration (1-10 scale)

Score = Severity × Scope × Pain / 10

DEBT REPORT
```markdown
# Technical Debt Report

**Generated**: <ISO timestamp>
**Total Debt Items**: 42
**Critical**: 3 | **High**: 12 | **Medium**: 18 | **Low**: 9

---

## Critical Debt (Score >80)

### 1. Auth service tightly coupled to database layer
**Type**: Architecture
**Score**: 87
**Impact**: Blocks US-0055 (Add OAuth), US-0061 (Add 2FA)
**Files**: src/services/auth.ts (287 lines, complexity 18)
**ADR**: ADR-0003 recommends service layer separation (not implemented)
**Estimate**: 3-5 days to refactor
**Stories**:
- Create epic: EP-0010 "Refactor auth architecture"
- Stories: Separate concerns, add interface, migrate callers

---

### 2. Missing integration tests for payment flow
**Type**: Testing
**Score**: 85
**Impact**: High risk for regressions, blocking production deploy
**Files**: src/api/payments/*.ts (12 files, 0% integration coverage)
**Last incident**: 2025-09-15 (payment bug in production)
**Estimate**: 2-3 days
**Stories**:
- US-XXXX: Write integration tests for payment flow

---

### 3. Unmaintained dependency: old-oauth-lib (3 years outdated)
**Type**: Security
**Score**: 82
**Impact**: 2 known CVEs, blocks security audit
**Files**: 8 files import this library
**ADR**: ADR-0012 marked this for replacement (6 months ago)
**Estimate**: 1-2 days to migrate to modern-oauth-lib
**Stories**:
- US-XXXX: Migrate from old-oauth-lib to modern-oauth-lib

---

## High Debt (Score 60-80)

[12 items...]

---

## Summary by Category

| Category | Count | Avg Score | Estimated Effort |
|----------|-------|-----------|------------------|
| Architecture | 8 | 72 | 15 days |
| Code Quality | 15 | 58 | 8 days |
| Testing | 10 | 65 | 12 days |
| Security | 3 | 78 | 5 days |
| Performance | 4 | 61 | 6 days |
| Documentation | 2 | 45 | 2 days |

**Total Estimated Effort**: 48 days

---

## Trend Analysis

Debt added this sprint: +5 items
Debt resolved this sprint: -2 items
Net change: +3 items ⚠️

---

## Recommendations

1. **Immediate** (Critical): Address auth refactor and payment tests
2. **This Sprint**: Tackle 3 high-severity items (choose by ROI)
3. **Next Sprint**: Reserve 20% capacity for debt reduction
4. **Ongoing**: Require tests for all new code (enforce in CI)

---

## Debt Heatmap

Most problematic files:
- src/services/auth.ts: 3 debt items (arch, complexity, coupling)
- src/api/payments/process.ts: 2 debt items (no tests, deprecated API)
- src/utils/legacy.ts: 2 debt items (duplication, no docs)
```

ACTIONS (after user review)

1. Ask: "Generate stories for critical debt? (YES/NO)"
2. If YES:
   - Create epic: "EP-XXXX: Technical Debt Reduction"
   - Create stories for top 5 critical items
   - Use templates with AC focused on "before/after" state

3. Ask: "Save report to docs/08-project/? (YES/NO)"
4. If YES:
   - Save to docs/08-project/tech-debt-<YYYYMMDD>.md
   - Update docs/08-project/README.md with link

5. Suggest adding to roadmap:
   - Reserve 10-20% of each sprint for debt reduction
   - Add debt review to retrospectives

INTEGRATION

### Story Template for Debt
```markdown
---
story_id: US-XXXX
title: Refactor auth service to separate concerns
type: tech-debt
debt_score: 87
estimate: 3d
---

## Context
Auth service is tightly coupled to database layer, blocking OAuth integration.

## Current State (Before)
- auth.ts contains DB queries, business logic, and HTTP handling
- 287 lines, complexity 18
- Hard to test, hard to extend

## Desired State (After)
- Clear separation: AuthService, AuthRepository, AuthController
- Each <100 lines, complexity <8
- 80%+ test coverage
- Enables US-0055 (OAuth)

## Acceptance Criteria
- [ ] AuthRepository handles all DB operations
- [ ] AuthService contains only business logic
- [ ] AuthController handles only HTTP/routing
- [ ] Tests cover each layer independently
- [ ] All existing auth tests still pass
- [ ] No breaking changes to API

## References
- ADR-0003: Service layer separation
- Blocked stories: US-0055, US-0061
```

### Dashboard Integration
Suggest creating a simple dashboard:
```
docs/08-project/debt-dashboard.md

# Debt Dashboard (Updated Weekly)

## Trend
Week 42: 42 items (↑ from 39)
Week 41: 39 items (↓ from 43)

## Critical Items: 3
[List with links to stories]

## This Sprint Goal
Reduce critical debt from 3 → 1
```

AUTOMATION

Suggest adding to CI (weekly):
```yaml
- cron: '0 0 * * 1'  # Monday
- name: Technical debt scan
  run: npx claude-code /AgileFlow:tech-debt SCAN=full OUTPUT=report
```

RULES
- Never auto-create stories without approval
- Be honest about estimates (err on high side)
- Link debt items to blocked stories when possible
- Prioritize debt that blocks future work
- Celebrate debt reduction in retrospectives

OUTPUT
- Technical debt report (markdown)
- Optional: Stories for top debt items
- Optional: Trend analysis
- Recommendations for debt reduction
