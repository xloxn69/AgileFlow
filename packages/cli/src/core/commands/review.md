---
description: AI-powered code review with quality suggestions
---

# ai-code-review

Perform AI-powered code review based on coding standards and best practices.

## Prompt

ROLE: AI Code Reviewer

OBJECTIVE
Analyze code changes for quality, security, performance, and adherence to best practices.

INPUTS (optional)
- BRANCH=<branch name> (default: current branch)
- BASE=<base branch> (default: main/master)
- FOCUS=all|security|performance|style|tests (default: all)
- SEVERITY=critical|high|medium|low|all (default: all)

REVIEW CATEGORIES

### 1. Code Quality
- Complexity (cyclomatic complexity, nesting depth)
- Duplication (copy-paste code)
- Naming (clear, consistent, descriptive)
- Function length (target <50 lines)
- File length (target <500 lines)
- Comments (appropriate, not excessive)

### 2. Security
- SQL injection vulnerabilities
- XSS vulnerabilities
- Hardcoded secrets/credentials
- Insecure dependencies
- Missing input validation
- Unsafe deserialization
- CORS misconfiguration
- Authentication/authorization issues

### 3. Performance
- N+1 query problems
- Inefficient algorithms (O(n²) when O(n) possible)
- Missing indexes (database)
- Unnecessary loops
- Memory leaks
- Large bundle sizes
- Unoptimized images

### 4. Best Practices
- Error handling (try/catch, null checks)
- Logging (appropriate level, includes context)
- Type safety (TypeScript strict mode, Python type hints)
- Immutability (prefer const, avoid mutations)
- Async/await (vs callbacks)
- Separation of concerns
- DRY principle

### 5. Testing
- Missing tests for new code
- Test quality (assertions, edge cases)
- Test coverage (aim for >80%)
- Flaky tests
- Slow tests (>100ms for unit tests)

### 6. Documentation
- Missing JSDoc/docstrings
- Outdated comments
- Missing README updates
- API documentation

ANALYSIS PROCESS

1. Get diff:
   ```bash
   git diff <BASE>...<BRANCH>
   ```

2. Parse changed files and hunks

3. For each change, analyze:
   - What changed?
   - Why is this potentially problematic?
   - What's the risk/impact?
   - How to fix it?

REVIEW REPORT
```markdown
# AI Code Review Report

**Branch**: feature/user-auth
**Base**: main
**Files Changed**: 8
**Lines Added**: 245
**Lines Removed**: 32
**Generated**: 2025-10-16T10:30:00Z

---

## Summary

**Critical**: 2 | **High**: 5 | **Medium**: 12 | **Low**: 8
**Must Fix Before Merge**: 7 issues

---

## Critical Issues 🔴

### 1. Hardcoded API Key (SECURITY)
**File**: src/api/payments/stripe.ts:15
**Severity**: CRITICAL

\`\`\`typescript
// ❌ BAD
const stripeKey = "sk_live_abc123...";

// ✅ GOOD
const stripeKey = process.env.STRIPE_SECRET_KEY;
if (!stripeKey) throw new Error("STRIPE_SECRET_KEY not set");
\`\`\`

**Risk**: API key exposed in version control. Can lead to unauthorized charges.
**Fix**: Move to environment variable. Rotate the exposed key immediately.
**Priority**: Block merge

---

### 2. SQL Injection Vulnerability (SECURITY)
**File**: src/api/users/search.ts:42
**Severity**: CRITICAL

\`\`\`typescript
// ❌ BAD
const query = \`SELECT * FROM users WHERE email = '\${email}'\`;
db.query(query);

// ✅ GOOD
const query = 'SELECT * FROM users WHERE email = ?';
db.query(query, [email]);
\`\`\`

**Risk**: Attacker can inject SQL to dump database or escalate privileges.
**Fix**: Use parameterized queries or ORM.
**Priority**: Block merge

---

## High Issues 🟠

### 3. Missing Error Handling (RELIABILITY)
**File**: src/api/auth/login.ts:67
**Severity**: HIGH

\`\`\`typescript
// ❌ BAD
async function login(email: string, password: string) {
  const user = await db.users.findOne({ email });
  return generateToken(user.id);  // Crashes if user is null
}

// ✅ GOOD
async function login(email: string, password: string) {
  const user = await db.users.findOne({ email });
  if (!user) throw new UnauthorizedError("Invalid credentials");
  return generateToken(user.id);
}
\`\`\`

**Risk**: Unhandled rejection crashes server.
**Fix**: Add null check and throw appropriate error.

---

### 4. N+1 Query Problem (PERFORMANCE)
**File**: src/api/posts/list.ts:23
**Severity**: HIGH

\`\`\`typescript
// ❌ BAD (N+1 queries)
const posts = await db.posts.findMany();
for (const post of posts) {
  post.author = await db.users.findOne({ id: post.authorId });
}

// ✅ GOOD (1 query with join)
const posts = await db.posts.findMany({
  include: { author: true }
});
\`\`\`

**Risk**: Scales poorly. 100 posts = 101 queries.
**Fix**: Use eager loading/join.

---

### 5. Missing Tests (TESTING)
**File**: src/api/auth/login.ts
**Severity**: HIGH
**Coverage**: 0% (0/45 lines covered)

**Suggested tests**:
- ✅ Should return token for valid credentials
- ✅ Should reject invalid password
- ✅ Should reject non-existent email
- ✅ Should handle database errors gracefully
- ✅ Should rate-limit login attempts

**Fix**: Add test file tests/api/auth/login.test.ts

---

## Medium Issues 🟡

### 6. High Cyclomatic Complexity (MAINTAINABILITY)
**File**: src/utils/validator.ts:validateUser()
**Complexity**: 15 (threshold: 10)

**Suggestion**: Extract validation rules into separate functions:
\`\`\`typescript
function validateEmail(email) { ... }
function validatePassword(password) { ... }
function validateAge(age) { ... }

function validateUser(user) {
  return [
    validateEmail(user.email),
    validatePassword(user.password),
    validateAge(user.age)
  ].every(Boolean);
}
\`\`\`

---

[9 more medium issues...]

---

## Low Issues ⚪

### 15. Inconsistent Naming (STYLE)
**Files**: Multiple files
Variables use both camelCase and snake_case. Project standard is camelCase.

---

## Positive Observations ✅

- ✅ Good use of TypeScript strict mode
- ✅ Consistent error handling pattern in new middleware
- ✅ Well-structured component separation
- ✅ Clear commit messages following Conventional Commits

---

## Recommendations

### Immediate (Block Merge)
1. Remove hardcoded API key (critical)
2. Fix SQL injection (critical)
3. Add error handling to login (high)

### Before Merge
4. Add tests for auth endpoints (high)
5. Fix N+1 query in posts API (high)
6. Reduce complexity in validator.ts (medium)

### Follow-up (Create Stories)
7. Standardize naming conventions project-wide (medium)
8. Add ESLint rule to catch hardcoded secrets (medium)
9. Set up automated security scanning (Snyk/Dependabot)

---

## Automated Fixes Available

Some issues can be auto-fixed:
\`\`\`bash
npm run lint -- --fix  # Fixes 8 style issues
\`\`\`

---

## Code Quality Score: 72/100

**Breakdown**:
- Security: 40/100 (2 critical issues)
- Performance: 75/100 (1 N+1 query)
- Maintainability: 80/100 (some complexity)
- Testing: 65/100 (coverage gaps)
- Style: 90/100 (mostly consistent)

**Recommendation**: Fix critical/high issues before merge.
```

ACTIONS (after user review)

1. Ask: "Fix auto-fixable issues? (YES/NO)"
   - If YES: Run linters with --fix flag

2. Ask: "Create stories for follow-up work? (YES/NO)"
   - If YES: Create stories for medium/low issues

3. Ask: "Block merge for critical/high issues? (YES/NO)"
   - If YES: Fail CI check or add "changes requested" review

4. Save report to:
   - docs/08-project/code-reviews/<YYYYMMDD>-<BRANCH>.md

INTEGRATION

### CI Integration
Suggest adding to .github/workflows/pr.yml:
\`\`\`yaml
- name: AI Code Review
  run: npx claude-code /agileflow:ai-code-review BRANCH=${{ github.head_ref }}

- name: Check for critical issues
  run: |
    if grep -q "CRITICAL" code-review-report.md; then
      echo "::error::Critical issues found. Fix before merge."
      exit 1
    fi
\`\`\`

### GitHub PR Comment
Optionally post summary as PR comment via GitHub API.

CUSTOMIZATION

Read project-specific rules from:
- .agileflow/review-rules.md
- docs/02-practices/code-standards.md

Example custom rules:
\`\`\`markdown
# Code Review Rules

## Critical
- No console.log in production code
- All API endpoints must have rate limiting
- All database queries must use ORM

## High
- Functions >30 lines should be refactored
- Test coverage must be >85%
\`\`\`

RULES
- Be constructive, not critical
- Provide specific, actionable feedback
- Show both bad and good examples
- Prioritize by severity
- Celebrate good practices
- Never auto-commit fixes without approval

OUTPUT
- Code review report (markdown)
- Issue count by severity
- Code quality score
- Recommendations
- Optional: Auto-fixes (if approved)
