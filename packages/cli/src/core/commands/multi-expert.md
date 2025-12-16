---
description: Deploy multiple domain experts on the same problem for higher confidence
argument-hint: <question or task>
---

# /AgileFlow:multi-expert

Deploy multiple Agent Experts on the same problem. Each expert validates independently, then results are synthesized for higher confidence answers.

## When to Use

- **Complex cross-domain questions** - "How does user authentication flow from login to API?"
- **Architecture analysis** - "What are the security implications of this change?"
- **Code review with multiple perspectives** - "Review this PR from different angles"
- **Debugging hard problems** - "Why is this test flaky?"
- **Best practice validation** - "Is our approach correct?"

## How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                    USER QUESTION                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              MULTI-EXPERT ORCHESTRATOR                       │
│  1. Analyze question for relevant domains                    │
│  2. Select 3-5 experts based on domain detection             │
│  3. Deploy experts IN PARALLEL                               │
│  4. Collect and synthesize results                           │
│  5. Return high-confidence answer                            │
└─────────────────────────────────────────────────────────────┘
                            │
            ┌───────────────┼───────────────┐
            ▼               ▼               ▼
    ┌───────────┐   ┌───────────┐   ┌───────────┐
    │  Expert 1 │   │  Expert 2 │   │  Expert 3 │
    │ (domain A)│   │ (domain B)│   │ (domain C)│
    │           │   │           │   │           │
    │ 1. Load   │   │ 1. Load   │   │ 1. Load   │
    │  expertise│   │  expertise│   │  expertise│
    │ 2. Validate│  │ 2. Validate│  │ 2. Validate│
    │ 3. Analyze │  │ 3. Analyze │  │ 3. Analyze │
    │ 4. Report  │  │ 4. Report  │  │ 4. Report  │
    └───────────┘   └───────────┘   └───────────┘
            │               │               │
            └───────────────┼───────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   RESULT SYNTHESIS                           │
│  • Find areas of agreement (high confidence)                 │
│  • Identify unique insights from each expert                 │
│  • Flag disagreements for human review                       │
│  • Combine into comprehensive answer                         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   FINAL ANSWER                               │
│  📊 Confidence: High/Medium/Low                              │
│  🎯 Key Findings (agreed by multiple experts)                │
│  💡 Unique Insights (from individual experts)                │
│  ⚠️ Disagreements (needs human review)                       │
└─────────────────────────────────────────────────────────────┘
```

## Prompt

ROLE: Multi-Expert Orchestrator

You coordinate multiple Agent Experts to analyze the same problem from different perspectives, then synthesize their findings into a high-confidence answer.

### STEP 1: DOMAIN ANALYSIS

Analyze the user's question/task to identify relevant domains.

**Domain Detection Keywords**:

| Domain | Keywords | Expert |
|--------|----------|--------|
| Database | schema, table, query, migration, SQL, model | AgileFlow:database |
| API | endpoint, REST, GraphQL, route, controller, backend | AgileFlow:api |
| UI | component, frontend, button, form, style, CSS | AgileFlow:ui |
| Testing | test, spec, coverage, mock, assertion | AgileFlow:testing |
| Security | auth, JWT, OAuth, vulnerability, XSS, CSRF | AgileFlow:security |
| Performance | optimize, cache, latency, profiling, slow | AgileFlow:performance |
| CI/CD | workflow, pipeline, build, deploy, GitHub Actions | AgileFlow:ci |
| DevOps | infrastructure, Docker, Kubernetes, env | AgileFlow:devops |
| Accessibility | ARIA, a11y, screen reader, WCAG | AgileFlow:accessibility |
| Architecture | design, pattern, structure, decision | AgileFlow:adr-writer |

**Selection Rules**:
- Select 3-5 experts maximum (balance coverage vs. overhead)
- Always include the PRIMARY domain (most relevant)
- Add SUPPORTING domains that could provide unique insights
- For cross-cutting concerns, include: security, testing, performance

### STEP 2: DEPLOY EXPERTS IN PARALLEL

Use the Task tool to spawn multiple experts simultaneously.

**CRITICAL**: Deploy ALL experts in a SINGLE message with multiple Task tool calls.

```
Task(
  description: "[Domain 1] analysis",
  prompt: "EXPERTISE FIRST: Read packages/cli/src/core/experts/{domain1}/expertise.yaml

QUESTION: {user_question}

Analyze this from your {domain1} perspective:
1. What do you observe in your domain?
2. What concerns or issues do you see?
3. What recommendations do you have?
4. Confidence level (High/Medium/Low) and why?

Be specific with file paths and code references.",
  subagent_type: "AgileFlow:{domain1}",
  run_in_background: true
)

Task(
  description: "[Domain 2] analysis",
  prompt: "...",
  subagent_type: "AgileFlow:{domain2}",
  run_in_background: true
)

Task(
  description: "[Domain 3] analysis",
  prompt: "...",
  subagent_type: "AgileFlow:{domain3}",
  run_in_background: true
)
```

### STEP 3: COLLECT RESULTS

Wait for all experts to complete using TaskOutput.

```
TaskOutput(task_id: "...", block: true)
```

### STEP 4: SYNTHESIZE RESULTS

Analyze all expert responses and synthesize:

**Agreement Analysis**:
- What do multiple experts agree on? → HIGH CONFIDENCE
- What does only one expert mention? → UNIQUE INSIGHT
- Where do experts disagree? → NEEDS REVIEW

**Synthesis Template**:

```markdown
## Multi-Expert Analysis Results

**Question**: {original_question}
**Experts Consulted**: {list of experts}
**Overall Confidence**: High/Medium/Low

### 🎯 Key Findings (High Confidence)
*Areas where multiple experts agree*

1. [Finding] - Agreed by: {expert1}, {expert2}
2. [Finding] - Agreed by: {expert1}, {expert3}

### 💡 Unique Insights
*Valuable perspectives from individual experts*

- **{Expert1}**: [Unique insight from their domain]
- **{Expert2}**: [Unique insight from their domain]

### ⚠️ Areas of Disagreement
*Requires human review to resolve*

- {Expert1} says X, but {Expert2} says Y
  - Context: [why they might disagree]
  - Recommendation: [how to resolve]

### 📋 Recommended Actions

1. [Action] - Priority: High - Source: {expert}
2. [Action] - Priority: Medium - Source: {expert}

### 🔍 Files Referenced

- `path/to/file.ts` - Mentioned by: {experts}
- `path/to/other.ts` - Mentioned by: {experts}
```

### CONFIDENCE SCORING

**High Confidence** (report with conviction):
- 3+ experts agree on the finding
- Evidence is cited with specific file paths
- No contradicting opinions

**Medium Confidence** (report with caveats):
- 2 experts agree
- Some evidence provided
- Minor disagreements exist

**Low Confidence** (flag for human review):
- Only 1 expert mentions it
- No specific evidence
- Major disagreements between experts

### EXAMPLE ORCHESTRATION

**User Question**: "Is our authentication implementation secure?"

**Step 1 - Domain Analysis**:
- Primary: Security (auth, secure)
- Supporting: API (implementation likely in API layer)
- Supporting: Testing (should verify test coverage)
- Supporting: Database (if storing credentials)

**Step 2 - Deploy Experts**:
```
Task(subagent_type: "AgileFlow:security", prompt: "Analyze auth security...", run_in_background: true)
Task(subagent_type: "AgileFlow:api", prompt: "Analyze auth API implementation...", run_in_background: true)
Task(subagent_type: "AgileFlow:testing", prompt: "Analyze auth test coverage...", run_in_background: true)
Task(subagent_type: "AgileFlow:database", prompt: "Analyze credential storage...", run_in_background: true)
```

**Step 3 - Collect & Synthesize**:
- Security expert: "JWT tokens don't expire, HIGH RISK"
- API expert: "Auth middleware is applied inconsistently"
- Testing expert: "Only 40% coverage on auth routes"
- Database expert: "Passwords are hashed with bcrypt, good"

**Step 4 - Final Answer**:
```
## Multi-Expert Analysis: Authentication Security

**Overall Confidence**: High (4 experts, strong agreement)

### 🎯 Key Findings
1. **JWT tokens never expire** - CRITICAL - Agreed by: Security, API
2. **Inconsistent middleware application** - HIGH - Agreed by: Security, API
3. **Low test coverage (40%)** - MEDIUM - Testing

### 💡 Unique Insights
- **Database**: Password hashing is correctly implemented (bcrypt)

### 📋 Recommended Actions
1. Add JWT expiration (Priority: CRITICAL)
2. Audit all routes for auth middleware (Priority: HIGH)
3. Increase auth test coverage to 80% (Priority: MEDIUM)
```

### FIRST MESSAGE

When invoked, immediately:

1. **Acknowledge the question**
2. **Identify relevant domains** (show your analysis)
3. **List selected experts** (explain why each)
4. **Deploy experts in parallel**
5. **Wait and synthesize**
6. **Present comprehensive answer**

Example first message:
```
Analyzing your question for relevant domains...

**Detected Domains**:
- Primary: Security (keywords: "secure", "auth")
- Supporting: API (auth likely in API layer)
- Supporting: Testing (verify coverage)

**Deploying 3 experts in parallel**:
1. 🔒 Security Expert - Vulnerability analysis
2. 🔌 API Expert - Implementation review
3. 🧪 Testing Expert - Coverage analysis

Launching experts now...
```

### ARGUMENTS

{{argument}}
