# AgileFlow Subagents Guide

This document explains how to use the 26 specialized subagents included with AgileFlow.

## What are Subagents?

Subagents are specialized AI assistants that operate in **separate context windows** from your main conversation with Claude. Each subagent has:
- Focused expertise and specialized knowledge
- Defined scope and boundaries
- Specific tool access
- Consistent behavior contracts

## ✨ NEW in v2.7.0: Proactive & Connected

All subagents now feature enhanced intelligence and coordination:

### 🔄 **Proactive FIRST ACTION**
Agents **load knowledge BEFORE asking** you:
- Read `status.json` → Current story statuses, WIP, blockers
- Read `bus/log.jsonl` → Recent agent coordination messages
- Read `CLAUDE.md` → Project conventions and architecture
- Check `docs/10-research/` → Existing research notes
- Check `docs/03-decisions/` → Architectural constraints

Then provide **status summaries** and **auto-suggest prioritized actions** with reasoning.

### 🗣️ **Shared Vocabulary**
All agents speak the same language:
- **Common Terms**: Story (US-####), Epic (EP-####), AC (Acceptance Criteria), DoR (Definition of Ready), Bus (message bus), Blocker, Unblock
- **Agent IDs**: MENTOR, AG-UI, AG-API, AG-CI, AG-DEVOPS, EPIC-PLANNER, ADR-WRITER, RESEARCH

### 🔗 **Cross-Agent Coordination**
Agents communicate via standardized **bus messages** in `docs/09-agents/bus/log.jsonl`:
```jsonl
{"ts":"2025-10-21T10:00:00Z","from":"AG-UI","type":"blocked","story":"US-0042","text":"Blocked: needs API endpoint from US-0040"}
{"ts":"2025-10-21T10:15:00Z","from":"AG-API","type":"unblock","story":"US-0040","text":"API ready, unblocking US-0042"}
```

**Message Types**: `status`, `blocked`, `unblock`, `assign`, `handoff`, `question`, `research-request`, `research-complete`

---

## All AgileFlow Subagents

AgileFlow includes 26 specialized agents covering all aspects of software development. Here are the core workflow agents:

### 1. `agileflow-ui` - UI/Presentation Specialist
**When to use**: Implementing front-end components, styling, accessibility

**Capabilities**:
- Implements UI stories (owner: AG-UI)
- Writes component tests (unit + integration + accessibility)
- Ensures WCAG 2.1 AA accessibility
- **Proactive design system detection** (first story only)
- **Monitors bus for AG-API unblock messages**
- Updates status.json and message bus

**Proactive Behaviors** (v2.7.0):
- Checks for blocked UI stories waiting on AG-API endpoints
- Scans for design system inconsistencies (hardcoded colors/spacing)
- Auto-suggests ready UI stories with context
- Monitors bus for endpoint readiness from AG-API

**Example invocation**:
```
Use the agileflow-ui subagent to implement US-0042 (login form component)
```

**First Message Example**:
```
⚠️ No global design system found. Should I create one? (YES/NO)

3 UI stories ready, 1 in progress, 2 blocked on AG-API
⚠️ Blocked stories:
- US-0042: User profile display (needs GET /api/users/:id from US-0040)
- US-0055: Settings page (needs GET /api/settings from US-0053)

Auto-suggestions:
- US-0041: Login button component (estimate: 0.5d, AC: 3 criteria)
- US-0044: Navigation menu (estimate: 1d, unblocks: US-0046, AC: 4 criteria)
```

---

### 2. `agileflow-api` - Backend/Services Specialist
**When to use**: Implementing APIs, business logic, data access

**Capabilities**:
- Implements backend stories (owner: AG-API)
- Writes API tests (unit + integration + contract)
- Ensures validation and error handling
- Documents API endpoints
- **CRITICAL: Actively searches for blocked AG-UI stories**
- **Prioritizes stories that unblock AG-UI**

**Proactive Behaviors** (v2.7.0):
- **Scans bus for AG-UI blockers** before starting work
- Prioritizes API stories that unblock AG-UI (shown in suggestions)
- Sends detailed unblock messages when endpoints ready (method, path, response format)
- Updates status.json to change AG-UI stories from `blocked` → `ready`

**Example invocation**:
```
Use the agileflow-api subagent to implement US-0043 (user authentication endpoint)
```

**First Message Example**:
```
2 API stories ready, 1 in progress
⚠️ CRITICAL: 2 AG-UI stories blocked waiting for API endpoints:
- US-0042: User profile display (blocked on US-0040: GET /api/users/:id)
- US-0055: Settings page (blocked on US-0053: GET /api/settings)

Auto-suggestions (prioritizing AG-UI unblocking):
- US-0040: User profile API endpoint (estimate: 1d, unblocks: US-0042, AC: 4 criteria) 🔥 PRIORITY
- US-0053: Settings API endpoint (estimate: 1d, unblocks: US-0055, AC: 3 criteria) 🔥 PRIORITY
- US-0060: Admin dashboard API (estimate: 2d, AC: 5 criteria)

I'll automatically notify AG-UI when endpoints are ready and sync to Notion/GitHub.
```

---

### 3. `agileflow-ci` - CI/CD & Quality Specialist
**When to use**: Setting up CI, testing infrastructure, quality gates

**Capabilities**:
- Sets up and maintains CI/CD pipelines
- Configures linting, type checking, coverage
- Audits and optimizes workflows
- Implements security scanning
- **Proactive CI health checks**

**Proactive Behaviors** (v2.7.0):
- CI health check on first message (platform, workflows, last run status)
- Proactive audit offers (flaky tests, slow builds, coverage gaps)
- Identifies blockers waiting on test infrastructure
- Auto-suggests CI improvements even without stories

**Example invocation**:
```
Use the agileflow-ci subagent to set up GitHub Actions for this project
```

**First Message Example**:
```
CI found: GitHub Actions, 3 workflows, last run: passing (4m 32s)
1 CI story ready, 0 in progress

Proactive CI audit:
- ⚠️ 2 flaky tests detected in test-suite.yml (UserService.test, AuthController.test)
- ⚠️ Build time increased 40% over last 10 runs (now 4m 32s, was 3m 15s)
- ✅ Coverage: 82% (target: 80%)

Auto-suggestions:
- US-0050: Fix flaky tests (impact: CI reliability, estimate: 1d)
- Proactive: Optimize build (add caching, parallelize jobs) - I can do this now
```

---

### 4. `agileflow-mentor` - Implementation Guide
**When to use**: Need end-to-end guidance from idea to PR

**Capabilities**:
- Reads entire knowledge index (docs/*)
- Finds or creates epics/stories
- Integrates research from docs/10-research/
- Plans implementation steps
- Can run commands (with confirmation)
- Prepares PR descriptions
- **Orchestrates other subagents**

**Proactive Behaviors** (v2.7.0):
- Loads all knowledge sources before planning (status.json, bus, research, ADRs, CLAUDE.md)
- Identifies missing epics/stories and offers to create them
- Detects research gaps and suggests research topics
- Maps dependencies across all agents
- Monitors overall project health and team capacity

**Example invocation**:
```
Use the agileflow-mentor subagent to guide me through implementing JWT authentication
```

**First Message Example**:
```
Knowledge loaded: 3 epics, 12 stories (4 ready, 3 in-progress, 2 blocked, 3 done)
Research index: 5 notes (1 on authentication: OAuth 2.1, 90 days old)
ADRs: 2 decisions (database choice, API framework)

⚠️ No epic found for JWT authentication. I'll create EP-0003 if you proceed.
⚠️ Research on JWT vs session-based auth is 90 days old - may need refresh.

Implementation plan outline:
1. Research refresh (optional): JWT security best practices 2025
2. Epic creation: EP-0003 "User authentication system"
3. Stories needed: ~5 stories (backend, UI, tests, deployment)
4. Dependencies: Will require AG-API (endpoints), AG-UI (login flow), AG-CI (security tests)
5. Estimated effort: 5-7 days across all agents

Would you like me to proceed with creating the epic and stories? (YES/NO)
```

**This is the most powerful subagent** - use it when you need comprehensive guidance and orchestration across multiple agents.

---

### 5. `agileflow-epic-planner` - Feature Planning Specialist
**When to use**: Breaking down large features into executable stories

**Capabilities**:
- Decomposes features into epics and stories
- Writes Given/When/Then acceptance criteria
- Estimates effort (0.5d, 1d, 2d)
- Maps dependencies between stories
- Creates test stubs
- **Assigns stories to appropriate agents** (AG-UI, AG-API, AG-CI, AG-DEVOPS)

**Proactive Behaviors** (v2.7.0):
- Checks team capacity before creating stories (WIP limits)
- Reviews existing epics/stories to avoid duplicates
- Suggests research if topic is complex or unfamiliar
- Identifies cross-agent dependencies proactively
- Auto-assigns stories based on scope (UI stories → AG-UI, API stories → AG-API)

**Example invocation**:
```
Use the agileflow-epic-planner subagent to plan a user profile management feature
```

**First Message Example**:
```
Current capacity: 2/8 agents at WIP limit (AG-UI: 2 in-progress, AG-API: 2 in-progress)
Existing epics: 3 (EP-0001: Auth, EP-0002: Dashboard, none match user profile)

Planning new epic: "User Profile Management"

Proposed breakdown:
- EP-0004: User Profile Management
  - US-0065: Profile data model & API (owner: AG-API, estimate: 1d)
  - US-0066: Profile view component (owner: AG-UI, estimate: 1d, depends: US-0065)
  - US-0067: Profile edit component (owner: AG-UI, estimate: 1.5d, depends: US-0065)
  - US-0068: Profile image upload (owner: AG-API + AG-UI, estimate: 2d, depends: US-0065)
  - US-0069: Profile tests (owner: AG-CI, estimate: 0.5d, depends: US-0065, US-0066, US-0067)

⚠️ US-0068 needs coordination: AG-API (upload endpoint) → AG-UI (upload UI)
⚠️ Consider research: "Image storage solutions" (S3, Cloudinary, local storage)

Total estimate: 6 days across 3 agents
Create epic and stories? (YES/NO)
```

---

### 6. `agileflow-devops` - DevOps & Automation Specialist
**When to use**: Dependencies, deployment, tech debt, automation

**Capabilities**:
- Manages dependencies and security audits
- Sets up deployment pipelines
- Tracks technical debt
- Generates changelogs and stakeholder reports
- Impact analysis and code quality automation
- **Proactive security vulnerability scanning**

**Proactive Behaviors** (v2.7.0):
- **Runs dependency audit on first message** (flags critical CVEs immediately)
- Scans for tech debt trends
- CI health monitoring
- Auto-prioritizes critical security issues

**Example invocation**:
```
Use the agileflow-devops subagent to audit dependencies and fix critical vulnerabilities
```

**First Message Example**:
```
🚨 CRITICAL: 2 vulnerabilities found:
- CVE-2024-12345: lodash (HIGH severity, CVSS 8.2) - RCE via prototype pollution
- CVE-2024-67890: axios (MEDIUM severity, CVSS 5.3) - SSRF in proxy config

Dependency audit: 47 dependencies, 3 outdated, 2 vulnerabilities
CI health: Last build 4m 32s (40% slower than baseline)
Tech debt: Score 42/100 (last scan: 14 days ago)

1 DevOps story ready

Auto-suggestions (prioritizing security):
- 🔥 URGENT: Fix CVE-2024-12345 in lodash (create story or fix immediately?)
- US-0062: Set up deployment pipeline (impact: production readiness, estimate: 2d)
- Proactive: Run tech debt scan (identify refactoring priorities)
```

---

### 7. `agileflow-adr-writer` - Decision Documentation Specialist
**When to use**: Documenting technical decisions and trade-offs

**Capabilities**:
- Creates ADRs in docs/03-decisions/
- Documents context, decision, alternatives
- Records consequences (positive/negative/neutral)
- Links related decisions
- **Integrates with research notes**

**Proactive Behaviors** (v2.7.0):
- Checks docs/10-research/ for relevant research before writing ADR
- Reviews existing ADRs to maintain consistency and link related decisions
- Identifies missing context and suggests research if needed
- Auto-links to related stories/epics
- Suggests ADR status changes (proposed → accepted → deprecated → superseded)

**Example invocation**:
```
Use the agileflow-adr-writer subagent to document our choice of PostgreSQL vs MongoDB
```

**First Message Example**:
```
Existing ADRs: 2 (ADR-0001: REST vs GraphQL, ADR-0002: React vs Vue)
Research found: docs/10-research/20251015-database-comparison.md (PostgreSQL vs MongoDB benchmarks)

⚠️ No existing database ADR found - this will be ADR-0003

ADR outline:
- **Title**: ADR-0003: PostgreSQL for primary database
- **Context**: Need relational integrity for user/order data, ACID guarantees
- **Decision**: Use PostgreSQL 15+ with pgvector extension
- **Alternatives considered**:
  - MongoDB: Better for unstructured data, lacks relational integrity
  - MySQL: Mature but weaker JSON support
- **Consequences**:
  - Positive: Strong consistency, mature ecosystem, JSON + relational
  - Negative: More complex schema migrations than NoSQL
  - Neutral: Requires learning SQL for team members familiar with MongoDB

Research integration: Benchmarks from 20251015-database-comparison.md support decision
Related stories: US-0010 (database setup), US-0011 (schema design)

Create ADR-0003? (YES/NO)
```

---

### 8. `agileflow-research` - Research & Knowledge Specialist
**When to use**: Gathering technical information, building research prompts

**Capabilities**:
- Conducts web research and doc reviews
- Builds comprehensive ChatGPT research prompts
- Saves research notes to docs/10-research/
- Maintains research index
- Identifies stale or missing research
- **Responds to research requests from other agents**

**Proactive Behaviors** (v2.7.0):
- Scans docs/10-research/ for stale research (>90 days old) on first message
- Checks bus for pending research requests from other agents
- Reviews ADRs to identify decisions that lack supporting research
- Auto-suggests research topics based on current epic/story focus
- Maintains research index freshness

**Example invocation**:
```
Use the agileflow-research subagent to research best practices for React state management
```

**First Message Example**:
```
Research index: 5 notes, avg age: 67 days
⚠️ Stale research (>90 days):
- 20240715-oauth-security.md (127 days old) - OAuth 2.1 security patterns
- 20240801-state-management.md (112 days old) - Redux vs Zustand vs Jotai

📋 Bus messages:
- AG-API requested: "JWT token refresh strategies" (from US-0042, 2 hours ago)
- EPIC-PLANNER suggested: "Image storage solutions" (from epic planning, 30 mins ago)

Current project focus (from status.json):
- 3 stories in auth epic (EP-0001) - JWT/OAuth related
- 2 stories in profile epic (EP-0004) - Image upload related

Auto-suggestions:
- 🔥 PRIORITY: JWT token refresh strategies (requested by AG-API for US-0042)
- Image storage solutions (S3, Cloudinary, local) - needed for US-0068
- Refresh stale OAuth research (supports existing work)
- New: React state management 2025 (if you're asking about this topic)

Which research topic should I prioritize?
I can create a ChatGPT research prompt, search the web, or refresh existing notes.
```

---

## AG-UI ↔ AG-API Coordination Example

One of the most common coordination patterns is between AG-UI and AG-API when UI components need backend endpoints. Here's how the v2.7.0 blocking/unblocking protocol works:

### Scenario: User Profile Display Feature

**Initial State** (from status.json):
```json
{
  "stories": [
    {
      "id": "US-0040",
      "title": "User profile API endpoint",
      "owner": "AG-API",
      "status": "ready",
      "estimate": "1d"
    },
    {
      "id": "US-0042",
      "title": "User profile display component",
      "owner": "AG-UI",
      "status": "ready",
      "estimate": "1d",
      "depends_on": ["US-0040"]
    }
  ]
}
```

### Step 1: AG-UI Detects Blocking Dependency

When AG-UI is invoked for US-0042, it proactively checks dependencies:

```
AG-UI First Message:
⚠️ US-0042 depends on US-0040 (User profile API endpoint) which is still 'ready' (not done).
I cannot implement the profile display without the endpoint.

Marking US-0042 as 'blocked' and notifying AG-API via bus.
```

**AG-UI actions**:
1. Updates status.json: US-0042 status → `blocked`
2. Appends bus message:
```jsonl
{"ts":"2025-10-21T10:00:00Z","from":"AG-UI","type":"blocked","story":"US-0042","text":"Blocked: needs GET /api/users/:id endpoint from US-0040"}
```

### Step 2: AG-API Proactively Detects Blocker

When AG-API is invoked next, it **always checks the bus for AG-UI blockers** in its FIRST ACTION:

```
AG-API First Message:
⚠️ CRITICAL: 1 AG-UI story blocked waiting for API endpoint:
- US-0042: User profile display (blocked on US-0040: GET /api/users/:id)

Auto-suggestions (prioritizing AG-UI unblocking):
- US-0040: User profile API endpoint (estimate: 1d, unblocks: US-0042) 🔥 PRIORITY
- US-0060: Admin dashboard API (estimate: 2d)

I'll automatically notify AG-UI when US-0040 endpoint is ready.
Should I start with US-0040 to unblock AG-UI? (YES/NO)
```

### Step 3: AG-API Implements and Unblocks

User chooses YES. AG-API implements US-0040 and upon completion:

**AG-API actions**:
1. Updates status.json: US-0040 status → `done`
2. Updates status.json: US-0042 status → `ready` (unblocking AG-UI)
3. Appends detailed unblock message:
```jsonl
{"ts":"2025-10-21T11:30:00Z","from":"AG-API","type":"unblock","story":"US-0040","text":"Endpoint GET /api/users/:id ready (returns 200 OK with {id, name, email, avatar, createdAt}), unblocking US-0042"}
```

### Step 4: AG-UI Proceeds with Implementation

When AG-UI is invoked again for US-0042, it checks the bus:

```
AG-UI First Message:
✅ US-0042 unblocked! AG-API completed endpoint GET /api/users/:id
Endpoint details from bus: 200 OK, returns {id, name, email, avatar, createdAt}

Ready to implement profile display component.
Proceed with US-0042? (YES/NO)
```

### Key Takeaways

1. **AG-UI marks stories as `blocked`** when dependencies aren't met
2. **AG-API actively searches for AG-UI blockers** on every invocation
3. **AG-API prioritizes unblocking work** in its auto-suggestions
4. **Detailed unblock messages** include endpoint method, path, response format
5. **Both agents update status.json** to maintain single source of truth
6. **Bus messages create audit trail** for debugging coordination issues

---

## Workflow: Using Multiple Subagents

A typical feature implementation might use multiple subagents:

1. **Research** (if needed):
   ```
   Use the agileflow-research subagent to research OAuth 2.1 implementation patterns
   ```

2. **Plan**:
   ```
   Use the agileflow-epic-planner subagent to break down the OAuth implementation into stories
   ```

3. **Document Decision**:
   ```
   Use the agileflow-adr-writer subagent to document why we chose OAuth 2.1 over OAuth 2.0
   ```

4. **Implement UI**:
   ```
   Use the agileflow-ui subagent to implement US-0050 (OAuth login button)
   ```

5. **Implement Backend**:
   ```
   Use the agileflow-api subagent to implement US-0051 (OAuth callback handler)
   ```

6. **Set up Tests**:
   ```
   Use the agileflow-ci subagent to add OAuth integration tests to CI
   ```

---

## Subagents vs Commands

| When to Use | Subagent | Slash Command |
|-------------|----------|---------------|
| Complex implementation | ✅ | ❌ |
| Multi-step workflow | ✅ | ❌ |
| Need to run commands | ✅ | ⚠️ (limited) |
| Quick status update | ❌ | ✅ |
| Generate template | ❌ | ✅ |
| Simple file operation | ❌ | ✅ |

---

## Tips for Using Subagents

1. **Be specific**: Include story IDs, file paths, or clear requirements
2. **One task at a time**: Let subagent complete before moving to next
3. **Check status.json**: After subagent work, verify status was updated
4. **Use mentor for guidance**: When unsure, start with `agileflow-mentor`
5. **Chain subagents**: Plan → Document → Implement → Test

---

## Subagent Guarantees

All AgileFlow subagents follow these contracts:

- ✅ **Diff-first**: Always show changes before applying
- ✅ **YES/NO confirmation**: Require explicit approval
- ✅ **JSON validation**: Never break status.json or bus/log.jsonl
- ✅ **Status updates**: Update docs/09-agents/status.json
- ✅ **Message bus**: Log coordination to bus/log.jsonl
- ✅ **Tests required**: Implementation includes tests
- ✅ **Conventional commits**: Use proper commit formats
- ✅ **No secrets**: Never commit credentials or tokens

---

## Installation

Subagents are included with the AgileFlow plugin. After installing the plugin:

1. Subagents are available immediately via invocation
2. No additional configuration needed
3. They automatically access your project's docs/ structure

---

## Customization

You can customize subagents by:
1. Editing files in `AgileFlow/agents/*.md`
2. Modifying the system prompt sections
3. Adjusting tool access in frontmatter
4. Changing scope boundaries

---

## Troubleshooting

**Subagent not recognizing story IDs?**
- Ensure docs/09-agents/status.json exists and is valid JSON

**Subagent skipping tests?**
- Check the subagent's quality checklist in its .md file

**JSON validation errors?**
- Subagent will auto-repair and explain the fix

**Need broader context?**
- Use `agileflow-mentor` - it reads the entire knowledge index

---

For more information, see:
- [Main README](README.md)
- [Slash Commands](commands/)
- [Templates](templates/)
