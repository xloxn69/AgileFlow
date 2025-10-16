# AgileFlow Subagents Guide

This document explains how to use the 6 specialized subagents included with AgileFlow.

## What are Subagents?

Subagents are specialized AI assistants that operate in **separate context windows** from your main conversation with Claude. Each subagent has:
- Focused expertise and specialized knowledge
- Defined scope and boundaries
- Specific tool access
- Consistent behavior contracts

## The 6 AgileFlow Subagents

### 1. `agileflow-ui` - UI/Presentation Specialist
**When to use**: Implementing front-end components, styling, accessibility

**Capabilities**:
- Implements UI stories (owner: AG-UI)
- Writes component tests
- Ensures WCAG 2.1 AA accessibility
- Updates status.json and message bus

**Example invocation**:
```
Use the agileflow-ui subagent to implement US-0042 (login form component)
```

---

### 2. `agileflow-api` - Backend/Services Specialist
**When to use**: Implementing APIs, business logic, data access

**Capabilities**:
- Implements backend stories (owner: AG-API)
- Writes API tests (unit + integration + contract)
- Ensures validation and error handling
- Documents API endpoints

**Example invocation**:
```
Use the agileflow-api subagent to implement US-0043 (user authentication endpoint)
```

---

### 3. `agileflow-ci` - CI/CD & Quality Specialist
**When to use**: Setting up CI, testing infrastructure, quality gates

**Capabilities**:
- Sets up and maintains CI/CD pipelines
- Configures linting, type checking, coverage
- Audits and optimizes workflows
- Implements security scanning

**Example invocation**:
```
Use the agileflow-ci subagent to set up GitHub Actions for this project
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

**Example invocation**:
```
Use the agileflow-mentor subagent to guide me through implementing JWT authentication
```

**This is the most powerful subagent** - use it when you need comprehensive guidance.

---

### 5. `agileflow-epic-planner` - Feature Planning Specialist
**When to use**: Breaking down large features into executable stories

**Capabilities**:
- Decomposes features into epics and stories
- Writes Given/When/Then acceptance criteria
- Estimates effort (0.5d, 1d, 2d)
- Maps dependencies
- Creates test stubs

**Example invocation**:
```
Use the agileflow-epic-planner subagent to plan a user profile management feature
```

---

### 6. `agileflow-adr-writer` - Decision Documentation Specialist
**When to use**: Documenting technical decisions and trade-offs

**Capabilities**:
- Creates ADRs in docs/03-decisions/
- Documents context, decision, alternatives
- Records consequences (positive/negative/neutral)
- Links related decisions

**Example invocation**:
```
Use the agileflow-adr-writer subagent to document our choice of PostgreSQL vs MongoDB
```

---

### 7. `agileflow-research` - Research & Knowledge Specialist
**When to use**: Gathering technical information, building research prompts

**Capabilities**:
- Conducts web research and doc reviews
- Builds comprehensive ChatGPT research prompts
- Saves research notes to docs/10-research/
- Maintains research index
- Identifies stale or missing research

**Example invocation**:
```
Use the agileflow-research subagent to research best practices for React state management
```

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
