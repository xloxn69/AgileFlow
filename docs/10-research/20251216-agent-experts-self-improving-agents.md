# Agent Experts: Self-Improving Agents That Actually Learn

**Research Date**: 2025-12-16
**Topic**: Agent Experts - Building self-improving agents with expertise files and mental models
**Source**: IndyDevDan's Tactical Agentic Coding Course - Lesson 13: Agent Experts (Agentic Horizon)
**Course URL**: https://agenticengineer.com

---

## Executive Summary

The fundamental problem with AI agents today is that **they forget**. Unlike traditional software that improves through analytics and usage patterns, agents start fresh every session. This creates a critical limitation: agents don't learn. While memory files and manual updates exist as solutions, they consume human time and require constant maintenance.

**Agent Experts** solve this by creating self-improving agents that automatically store the right information and reuse it with no human in the loop. The key differentiator: Agent Experts learn on their own. You teach them HOW to learn, then they accumulate and manage their own expertise autonomously.

An Agent Expert is defined as a **concrete form of a self-improving template metaprompt** - agents that execute, learn, and reuse their expertise at runtime. This represents the evolution from generic "execute and forget" agents to specialized "execute and learn" agents.

---

## Core Concepts

### The Agent Expert Definition

An **Agent Expert** is:
1. A self-improving template metaprompt
2. An agent that executes tasks AND learns from them
3. A system that maintains a "mental model" (expertise file) of its domain
4. A specialized agent that validates its understanding against actual code

**Key Distinction**: Agent Experts are NOT generic agents. They are domain-specific experts that know one area of your codebase extraordinarily well - database, websockets, UI, API, etc.

### The Problem with Current Solutions

| Solution | Problem |
|----------|---------|
| Memory Files | Global forced context that always loads; must be manually updated |
| CLAUDE.md | Expertise requires breaking rules when the time is right; can't adapt |
| Prime Prompts | Must be manually updated for new information |
| Sub-agents | No learning mechanism; start fresh each time |
| Skills | Static; require manual updates to steer direction |

### What Makes an Expert an Expert

Real experts share these characteristics:
1. **They don't relearn their craft** every time they have a new task
2. **They're always learning** - updating their mental model continuously
3. **You don't need to tell them to learn** - it's in their DNA
4. **They accumulate information, examples, and expertise** around a specific topic
5. **They understand the game never ends** - except when they stop learning

---

## The Mental Model Concept

### What is an Expertise File?

The **expertise file** is the mental model of the problem space for your agent expert. It is stored as a YAML file and contains:

- File locations the expert needs to know
- Schema definitions and relationships
- Patterns and conventions used in that domain
- Key functions, classes, and their purposes
- Data flow and communication patterns

### Critical Clarification: NOT a Source of Truth

> "This is not a source of truth. The mental model you have of your codebases - you don't have a source of truth in your mind. You have a working memory file. You have a mental model."

The expertise file is analogous to an engineer's understanding:
- **Source of Truth**: The actual code (always)
- **Mental Model**: The expertise file (working memory)

The code is what runs and builds the product. But auxiliary documents, memory, and mental models are **extremely valuable** for rapid execution.

### How Agents Use the Mental Model

1. **Read the expertise file FIRST** - before any task
2. **Validate assumptions against the codebase** - compare mental model to actual code
3. **Execute the task** - with validated understanding
4. **Update the expertise file** - after changes are made

This workflow means the agent doesn't search or explore - it **knows where things are** and only validates its understanding.

---

## Meta-Agentics Foundation

Before building Agent Experts, you need **meta-agentics** - elements of the system that build the system:

### 1. Meta Prompts (Prompts that write prompts)
- Create new versions of existing prompts
- Generate specialized prompt variants
- Example: Create "question with mermaid diagrams" from base question prompt

### 2. Meta Agents (Agents that build agents)
- Create new agents from existing prompts
- Scale prompts into parallel agent execution
- Example: Create a "planner agent" that reads and executes the plan prompt

### 3. Meta Skills (Skills that build skills)
- Create reusable skills from common workflows
- Automate multi-step processes
- Example: Create "start orchestrator" skill for frontend/backend startup

**Critical Insight**: Meta-agentics are NOT Agent Experts because they're **not learning**. Nothing inside them updates automatically. They're powerful but static.

> "Every codebase must have meta-agentics."

---

## The Three-Step Agent Expert Workflow

### Step 1: Plan (with Expertise)
```
Read expertise file → Validate against code → Create detailed plan
```

### Step 2: Build (Execute Plan)
```
Execute plan changes → Update source code → Generate diff
```

### Step 3: Self-Improve (Update Expertise)
```
Analyze what changed → Update expertise file → Sync mental model
```

This creates a **closed loop** where the agent's knowledge evolves with the codebase.

---

## Implementation Architecture

### Directory Structure

```
.claude/
└── commands/
    └── experts/
        ├── database/
        │   ├── question.md          # Question prompt (reads expertise)
        │   ├── self-improve.md      # Updates expertise after changes
        │   └── expertise.yaml       # Mental model file
        ├── websocket/
        │   ├── question.md
        │   ├── self-improve.md
        │   ├── plan.md              # Domain-specific planning
        │   ├── build.md             # Domain-specific building
        │   └── expertise.yaml
        └── [other-domains]/
```

### Question Prompt Structure

```markdown
---
description: Ask questions about [domain]
argument-hint: <question>
variables:
  EXPERTISE_FILE: .claude/commands/experts/[domain]/expertise.yaml
---

# [Domain] Expert Question

## Workflow
1. Read the expertise file at {{EXPERTISE_FILE}}
2. Validate assumptions against the actual codebase
3. ONLY THEN answer the user's question

## Important
- Read expertise file FIRST
- Validate assumptions against codebase (repeat for emphasis)
- Report findings based on validated mental model

## Question
{{argument}}
```

### Self-Improve Prompt Structure

```markdown
---
description: Update [domain] expertise after changes
variables:
  EXPERTISE_FILE: .claude/commands/experts/[domain]/expertise.yaml
---

# Self-Improve [Domain] Expert

## Purpose
Sync the expertise mental model with the current state of the codebase.

## Workflow
1. Read the current expertise file at {{EXPERTISE_FILE}}
2. Analyze recent changes (git diff or provided context)
3. Identify new patterns, files, schemas, or relationships
4. Update the expertise file with new knowledge
5. Validate the updated mental model against actual code

## Rules
- Only add verified information
- Remove outdated references
- Keep the mental model accurate and useful
- Focus on [domain]-specific knowledge only
```

### Three-Step Workflow Prompt

```markdown
---
description: Plan, build, and improve [domain] feature
argument-hint: <feature description>
---

# [Domain] Expert: Plan → Build → Self-Improve

## Step 1: Plan
Launch sub-agent with [domain]-plan prompt
- Reads expertise file
- Validates against codebase
- Creates detailed implementation plan

## Step 2: Build
Launch sub-agent with [domain]-build prompt
- Executes the plan
- Makes code changes
- Captures diff output

## Step 3: Self-Improve
Launch sub-agent with [domain]-self-improve prompt
- Analyzes what changed
- Updates expertise file
- Syncs mental model with new state

## Input
{{argument}}
```

---

## Expertise File Schema (YAML)

```yaml
# expertise.yaml - Mental Model for [Domain] Expert

domain: database  # or websocket, ui, api, etc.
last_updated: 2025-12-16
version: 1.0

# Key files this expert needs to know
files:
  schemas:
    - path: src/db/schema.ts
      purpose: Database table definitions
      key_exports: [users, posts, comments]
    - path: src/db/migrations/
      purpose: Schema migrations
      pattern: "YYYYMMDD-description.ts"

  operations:
    - path: src/db/queries/
      purpose: Database query functions
      conventions: "One file per table"
    - path: src/db/transactions.ts
      purpose: Multi-table operations

# Relationships between entities
relationships:
  - parent: users
    child: posts
    type: one-to-many
    cascade: delete
  - parent: posts
    child: comments
    type: one-to-many
    cascade: delete

# Data flow patterns
patterns:
  - name: "CRUD operations"
    description: "All tables follow create/read/update/delete pattern"
    location: src/db/queries/{table}.ts
  - name: "Soft deletes"
    description: "Use deleted_at timestamp, not hard deletes"
    applies_to: [users, posts]

# Key conventions
conventions:
  - "All queries use prepared statements"
  - "Transactions wrap multi-table operations"
  - "Migrations are reversible"
  - "Foreign keys enforce referential integrity"

# Recent learnings (auto-updated by self-improve)
learnings:
  - date: 2025-12-16
    insight: "Added session_events table for websocket tracking"
    files_affected: [src/db/schema.ts, src/db/queries/events.ts]
```

---

## Scaling with Multi-Agent Orchestration

### The Power of Multiple Experts

Instead of having one agent answer a question:
- Deploy 3, 5, or 10 experts against the same problem
- Each validates independently against the codebase
- Orchestrator synthesizes results for higher confidence

> "Sometimes if you throw five agents at the problem, only one makes it. One finds something the other didn't, the other finds some things the others didn't, and then you compose that together, you get a better result."

### Context Protection Strategy

The three-step workflow protects the orchestrator's context:
- **Plan step**: May consume 80k tokens
- **Build step**: May use 61k tokens, 41 tool uses
- **Orchestrator**: Context completely protected - only passes return values

This enables long-running, high-token operations without context overflow.

---

## The Core Four Framework

Everything in agentic coding reduces to the **Core Four**:

1. **Context** - What information the agent has access to
2. **Model** - Which LLM is executing
3. **Prompt** - The instructions driving behavior
4. **Tools** - What actions the agent can take

> "Build whatever abstraction you want - build your own MCP servers, build your own skills, do whatever you want. I always focus on the foundational units."

Agent Experts are simply an optimized composition of the Core Four with a learning feedback loop.

---

## Comparison: Generic Agent vs Agent Expert

| Aspect | Generic Agent | Agent Expert |
|--------|---------------|--------------|
| **Knowledge** | Starts fresh each session | Loads expertise file first |
| **Search behavior** | Explores/searches codebase | Knows where things are |
| **Learning** | None - forgets everything | Updates expertise after each task |
| **Domain focus** | General purpose | Specialized (database, websocket, etc.) |
| **Mental model** | None | Maintained in expertise.yaml |
| **Validation** | Trusts its assumptions | Validates against actual code |
| **Human maintenance** | Requires manual updates | Self-improving |
| **Execution speed** | Slower (must discover) | Faster (pre-loaded knowledge) |

---

## Implementation Checklist

### Phase 1: Foundation
- [ ] Set up `.claude/commands/experts/` directory structure
- [ ] Create meta-prompt for generating new expert templates
- [ ] Create meta-agent for scaling prompts to parallel agents
- [ ] Create meta-skill for common multi-step workflows

### Phase 2: First Expert
- [ ] Choose initial domain (database, API, websocket, etc.)
- [ ] Create expertise.yaml with current knowledge
- [ ] Build question.md prompt
- [ ] Build self-improve.md prompt
- [ ] Test question → validate → answer workflow

### Phase 3: Three-Step Workflow
- [ ] Create plan.md for domain-specific planning
- [ ] Create build.md for domain-specific execution
- [ ] Wire up Plan → Build → Self-Improve composition
- [ ] Test full workflow with real feature

### Phase 4: Scaling
- [ ] Add additional domain experts
- [ ] Integrate with orchestrator for multi-expert queries
- [ ] Implement confidence-based result synthesis
- [ ] Monitor expertise file accuracy over time

---

## Anti-Patterns to Avoid

### 1. Treating Expertise as Source of Truth
The code is always the source of truth. The expertise file is a mental model that must be validated.

### 2. Global Expertise Files
Each domain should have its own expertise file. A single global file becomes unwieldy and unfocused.

### 3. Manual Expertise Updates
If you're manually updating expertise files, you've missed the point. The self-improve prompt handles this.

### 4. Skipping Validation
Never trust the expertise file blindly. Always validate assumptions against the actual codebase.

### 5. Over-broad Domains
"Frontend Expert" is too broad. "React Component Expert" or "Form Validation Expert" is better.

---

## Success Metrics

How to know your Agent Experts are working:

1. **Reduced search operations** - Experts know where things are
2. **Accurate first-pass responses** - Validated mental model
3. **Growing expertise files** - Self-improve is adding learnings
4. **Faster task completion** - No exploration overhead
5. **Consistent code patterns** - Experts enforce conventions

---

## Course Context: Tactical Agentic Coding

This research comes from **Lesson 13: Agent Experts** in the Agentic Horizon extended course, part of:

**Tactical Agentic Coding (TAC)** by IndyDevDan
- 8 core lessons on Agentic Engineering
- Focus: "Build the system that builds the system"
- Primary tool: Claude Code
- Target audience: Mid/Senior+ engineers shipping production code

### The 8 Tactics of Agentic Coding
1. Hello Agentic Coding - Become irreplaceable
2. The 12 Leverage Points
3. Success is Planned (80-20 of Agentic Coding)
4. AFK Agents (PITER framework)
5. Close The Loops (self-correcting systems)
6. Agentic Review and Documentation
7. ZTE - Zero Touch Engineering
8. The Agentic Layer

### Agentic Horizon Extended Lessons
9. Elite Context Engineering
10. Agentic Prompt Engineering
11. Building Domain-Specific Agents
12. Multi-Agent Orchestration
13. **Agent Experts** (this research)
14. Community Vote (upcoming)

---

## Key Quotes from Source Material

> "The difference between a generic agent and an agent expert is simple. One executes and forgets, the other executes and learns."

> "Real experts don't relearn their craft every time they have a new task. True experts are always learning. They're updating their mental model."

> "Agent experts must learn on their own. You teach them to learn, but after that they must accumulate and manage their own expertise."

> "The expertise file is the mental model of the problem space for your agent expert."

> "The true source of truth is always the code. Not the comments, not the documentation, not the plans. It is the code."

> "We are reducing and delegating our context. The plan step took 80k tokens. Our top level agent has its context completely protected."

---

## ADR Recommendation

**Title**: ADR-XXXX: Implement Agent Expert System for Domain-Specific Automation

**Status**: Proposed

**Context**:
Current agents start fresh each session, requiring extensive codebase exploration. This wastes tokens, time, and produces inconsistent results. We need agents that maintain and grow domain expertise over time.

**Decision Options**:
1. **A) Single Global Expert** - One expertise file for entire codebase
2. **B) Domain-Specific Experts** - Separate experts for database, API, UI, websocket, etc.
3. **C) Feature-Based Experts** - Experts per major feature area

**Recommended Decision**: Option B - Domain-Specific Experts

**Rationale**:
- Focused expertise produces better results than broad knowledge
- Easier to maintain and validate smaller, domain-specific files
- Scales with codebase complexity
- Aligns with engineering team structure (backend, frontend, etc.)

**Consequences**:
- (+) Faster task execution with pre-loaded knowledge
- (+) Self-improving system reduces maintenance burden
- (+) Consistent patterns enforced by domain experts
- (-) Initial setup effort for each domain
- (-) Need to ensure expertise files stay in sync with code
- (-) Potential for stale expertise if self-improve fails

---

## Story Breakdown

### Epic: Implement Agent Expert System

**US-001: Create Expert Directory Structure**
- AC: `.claude/commands/experts/` directory exists
- AC: Template files for question.md, self-improve.md, expertise.yaml
- AC: Documentation for adding new experts

**US-002: Build First Domain Expert (Database)**
- AC: expertise.yaml captures current database knowledge
- AC: question.md reads expertise and validates before answering
- AC: self-improve.md updates expertise after changes
- AC: Successfully answers database questions using mental model

**US-003: Implement Three-Step Workflow**
- AC: Plan → Build → Self-Improve chain works end-to-end
- AC: Sub-agents protect orchestrator context
- AC: Expertise file updated after build completion

**US-004: Add Meta-Expert Generator**
- AC: Meta-prompt creates new expert templates
- AC: Generated experts follow established patterns
- AC: Reduces expert creation time to < 5 minutes

**US-005: Integrate with Multi-Agent Orchestration**
- AC: Multiple experts can be deployed on same question
- AC: Orchestrator synthesizes results
- AC: Confidence scoring based on expert agreement

**US-006: Monitoring and Validation**
- AC: Track expertise file accuracy over time
- AC: Alert when expertise diverges from codebase
- AC: Automated validation of mental model against code

---

## References

- **Source**: IndyDevDan's Tactical Agentic Coding Course
- **Lesson**: 13 - Agent Experts: Finally, Agents That Actually Learn
- **Course URL**: https://agenticengineer.com
- **Course Author**: @IndyDevDan (YouTube: 2M+ views, 90k subscribers)
- **GitHub**: 8k+ stars with 2k+ forks

---

## Next Steps

1. Create initial expert directory structure
2. Build database expert as proof of concept
3. Test three-step workflow with real feature
4. Iterate on expertise file schema
5. Expand to additional domains (API, websocket, UI)
6. Integrate with existing AgileFlow orchestration
