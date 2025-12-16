---
description: Analyze change impact across codebase
---

# impact-analysis

Analyze the impact of code changes on other parts of the codebase.

## Prompt

ROLE: Impact Analyzer

OBJECTIVE
Analyze and identify which files, tests, and features are affected by code changes to prevent regressions. Evaluate dependencies comprehensively, assess risk levels, and consider indirect impacts across the codebase.

INPUTS (optional)
- FILES=<comma-separated paths> (default: auto-detect from git diff)
- BASE=<base branch> (default: main/master)
- RUN_TESTS=yes|no (default: yes, if tests found)

DETECTION
1. Get changed files:
   ```bash
   git diff <BASE>...HEAD --name-only
   ```

2. For each changed file, find:
   - **Direct imports**: Files that import this file
   - **Indirect imports**: Files that import files that import this file (2 levels)
   - **Test files**: Corresponding test files (*\.test\*, *\.spec\*)
   - **Related stories**: Stories mentioning this file in docs/06-stories/

ANALYSIS METHODS

### Static Analysis (AST parsing)
- Parse import/require statements
- Build dependency graph
- Identify circular dependencies
- Find dead code (exported but never imported)

### Test Coverage Mapping
- Read coverage reports (coverage/lcov.info, coverage.json)
- Map changed lines to test files
- Identify uncovered changes

### Pattern Matching
- API routes → API tests
- Components → Component tests + Storybook stories
- Services → Service tests + Integration tests
- Database models → Migration tests

IMPACT REPORT
```markdown
# Impact Analysis Report

**Branch**: <BRANCH>
**Base**: <BASE>
**Changed Files**: 5
**Potentially Affected Files**: 23
**Tests to Run**: 12

## Direct Impacts

### src/api/auth/login.ts (MODIFIED)
**Type**: API endpoint
**Changes**: 23 lines modified

**Direct dependents** (3):
- src/api/auth/index.ts (exports this endpoint)
- src/middleware/auth.ts (uses login logic)
- tests/api/auth/login.test.ts (tests this file)

**Indirect dependents** (8):
- src/app.ts → src/api/auth/index.ts → login.ts
- src/routes.ts → src/api/auth/index.ts → login.ts
- [6 more...]

**Related tests**:
- ✅ tests/api/auth/login.test.ts (exists)
- ⚠️ tests/integration/auth-flow.test.ts (may need updates)
- ❌ Missing: E2E test for login flow

**Related stories**:
- US-0042: Implement JWT authentication (IN-REVIEW)

**Coverage**: 87% (lines 45-52 uncovered)

---

### src/components/LoginForm.tsx (MODIFIED)
**Type**: UI component
**Changes**: 15 lines modified

**Direct dependents** (2):
- src/pages/Login.tsx
- src/components/AuthModal.tsx

**Related tests**:
- ✅ tests/components/LoginForm.test.tsx (exists)
- ⚠️ Accessibility tests not found

**Related stories**:
- US-0041: Create login form UI (IN-REVIEW)

**Coverage**: 92%
```

## Breaking Changes Detection

Analyze function signatures and types:
```
⚠️ BREAKING CHANGE DETECTED

File: src/api/auth/login.ts
Function: login()

Before:
  login(email: string, password: string): Promise<Token>

After:
  login(credentials: LoginRequest): Promise<AuthResponse>

Affected callers (3):
- src/middleware/auth.ts:45
- tests/api/auth/login.test.ts:23
- tests/integration/auth-flow.test.ts:67
```

## Test Recommendations

Based on changes, suggest tests to run:

**Critical** (always run):
- tests/api/auth/login.test.ts (direct test)
- tests/integration/auth-flow.test.ts (integration)

**Recommended** (affected indirectly):
- tests/api/users/*.test.ts (uses auth)
- tests/e2e/login.spec.ts (E2E)

**Optional** (low risk):
- tests/components/Header.test.tsx (displays user from auth)

ACTIONS (after user review)

1. Show impact summary
2. Ask: "Run affected tests? (YES/NO)"
3. If YES:
   ```bash
   # Run only affected tests
   npm test -- tests/api/auth/login.test.ts tests/integration/auth-flow.test.ts
   ```
4. If tests fail:
   - Show failures
   - Suggest creating story: "US-XXXX: Fix regressions from <change>"

5. If breaking changes detected:
   - Warn user
   - Suggest creating ADR if architectural change
   - Create stories for updating affected callers

INTEGRATION

### CI Optimization
Suggest optimized CI that only runs affected tests:
```yaml
- name: Impact analysis
  run: npx claude-code /AgileFlow:impact-analysis BASE=main

- name: Run affected tests
  run: npm test -- $(cat affected-tests.txt)
```

### Story Updates
- Update related stories with impact notes
- Create new stories for regressions or breaking changes
- Append to bus/log.jsonl: {"type":"impact","affected":23,"tests":12}

VISUALIZATION (optional)
Generate dependency graph:
```
src/api/auth/login.ts
├── src/api/auth/index.ts
│   ├── src/app.ts
│   └── src/routes.ts
├── src/middleware/auth.ts
│   └── src/app.ts
└── tests/api/auth/login.test.ts
```

RULES
- Use static analysis when possible (faster than running tests)
- Prioritize tests by risk (critical path first)
- Never skip tests for modified files
- Warn about uncovered changes
- Suggest creating tests for uncovered code
- Diff-first for any file modifications

OUTPUT
- Impact analysis report (markdown)
- List of affected files and tests
- Test recommendations (critical/recommended/optional)
- Optional: Run tests and report results
