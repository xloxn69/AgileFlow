# Agent Experts

**Self-improving agents that maintain domain expertise over time.**

## What Are Agent Experts?

Agent Experts are specialized agents that:
1. **Remember** - Maintain expertise files (mental models) of their domain
2. **Validate** - Check their understanding against actual code
3. **Learn** - Update expertise after making changes
4. **Accelerate** - Work faster by skipping unnecessary exploration

### Generic Agent vs Agent Expert

| Aspect | Generic Agent | Agent Expert |
|--------|---------------|--------------|
| Knowledge | Starts fresh each session | Loads expertise file first |
| Search behavior | Explores/searches codebase | Knows where things are |
| Learning | None - forgets everything | Updates expertise after tasks |
| Domain focus | General purpose | Specialized (database, api, ui) |
| Execution speed | Slower (must discover) | Faster (pre-loaded knowledge) |

## Directory Structure

```
experts/
├── README.md              # This file
├── templates/
│   ├── expertise-template.yaml   # Schema for expertise files
│   ├── question-template.md      # Template for question prompts
│   ├── self-improve-template.md  # Template for self-improve prompts
│   └── workflow-template.md      # Template for Plan→Build→Self-Improve workflow
│
│  # Pilot Phase (EP-0001)
├── database/              # Database specialist
├── api/                   # API/backend specialist
├── ui/                    # UI/frontend specialist
│
│  # Phase 1 Rollout
├── testing/               # Testing specialist
├── ci/                    # CI/CD specialist
├── devops/                # DevOps specialist
├── security/              # Security specialist
│
│  # Phase 2 Rollout
├── documentation/         # Documentation specialist
├── refactor/              # Refactoring specialist
├── performance/           # Performance specialist
├── accessibility/         # Accessibility specialist
│
│  # Phase 3 Rollout
├── mobile/                # Mobile specialist
├── integrations/          # Integrations specialist
├── analytics/             # Analytics specialist
├── monitoring/            # Monitoring specialist
│
│  # Phase 4 Rollout
├── product/               # Product specialist
├── qa/                    # QA specialist
├── design/                # Design specialist
├── compliance/            # Compliance specialist
├── datamigration/         # Data migration specialist
├── mentor/                # Mentor/orchestration specialist
├── epic-planner/          # Epic planning specialist
├── adr-writer/            # ADR writing specialist
├── research/              # Research specialist
└── readme-updater/        # README updating specialist
```

**Each expert directory contains:**
- `expertise.yaml` - Domain mental model (files, relationships, patterns)
- `question.md` - Q&A workflow with expertise-first approach
- `self-improve.md` - Auto-update expertise after changes
- `workflow.md` - Complete Plan→Build→Self-Improve chain

## The Three-Step Workflow

Agent Experts follow **Plan → Build → Self-Improve**:

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

### Using Workflow Prompts

Each expert has a `workflow.md` that chains all three steps together:

```bash
# For complete feature implementation
# 1. Read the workflow prompt for your domain
packages/cli/src/core/experts/database/workflow.md  # Database features
packages/cli/src/core/experts/api/workflow.md       # API features
packages/cli/src/core/experts/ui/workflow.md        # UI features
```

The workflow prompt:
1. **Loads expertise** before planning
2. **Validates** assumptions against codebase
3. **Creates detailed plan** with exact file paths
4. **Executes the plan** with proper error handling
5. **Captures diff** of all changes
6. **Updates expertise** with new learnings

### Individual Prompts

For specific tasks, use individual prompts:

| Prompt | Use When |
|--------|----------|
| `question.md` | You need information from the domain |
| `self-improve.md` | You made changes and need to update expertise |
| `workflow.md` | You're implementing a complete feature |

**Example - Asking a question:**
```
Read packages/cli/src/core/experts/database/question.md
Then ask: "Where is the users schema defined?"
```

**Example - Full feature workflow:**
```
Read packages/cli/src/core/experts/database/workflow.md
Then request: "Add a sessions table to track user logins"
```

## Creating a New Agent Expert

### 1. Create Domain Directory
```bash
mkdir -p experts/{domain}
```

### 2. Copy and Customize Templates
```bash
# Copy templates
cp templates/expertise-template.yaml {domain}/expertise.yaml
cp templates/question-template.md {domain}/question.md
cp templates/self-improve-template.md {domain}/self-improve.md

# Replace placeholders
# {{DOMAIN}} → your domain name (e.g., "database")
# {{DOMAIN_TITLE}} → title case (e.g., "Database")
# {{DOMAIN_PATTERN}} → file pattern (e.g., "db|database|schema")
# {{ISO_DATE}} → current date (e.g., "2025-12-16")
```

### 3. Populate Initial Expertise
Edit `expertise.yaml` with initial domain knowledge:
- File locations the expert needs to know
- Relationships between entities
- Patterns and conventions
- Leave `learnings` empty (self-improve populates it)

### 4. Update Main Agent
Modify the main agent file (e.g., `agents/database.md`) to:
- Read expertise file in FIRST ACTION section
- Run self-improve after completing work

## Expertise File Schema

```yaml
domain: string           # Domain identifier (database, api, ui)
last_updated: ISO-date   # When expertise was last updated
version: string          # Schema version

files:                   # Key files the expert needs to know
  category:
    - path: string       # File or directory path
      purpose: string    # What this file/dir contains
      key_exports: []    # Important exports (optional)
      conventions: ""    # Naming/structure conventions (optional)

relationships: []        # How entities relate to each other
  # - parent: string
  #   child: string
  #   type: string       # one-to-many, many-to-many, etc.

patterns: []             # Recurring approaches in this domain
  # - name: string
  #   description: string
  #   location: string

conventions: []          # Rules the agent should follow
  # - "Convention description"

learnings: []            # AUTO-UPDATED by self-improve
  # - date: ISO-date
  #   insight: string
  #   files_affected: []
  #   context: string
```

## Key Principles

### 1. Expertise is NOT Source of Truth
The code is always the source of truth. Expertise is a mental model - like an engineer's understanding - that must be validated against actual code.

### 2. Validate Before Acting
Always compare expertise against the codebase before relying on it. Code changes, expertise may be stale.

### 3. Learn Automatically
Self-improve runs after successful builds. The agent updates its own expertise - no manual maintenance.

### 4. Stay Focused
Each expert focuses on ONE domain. Don't create "Frontend Expert" - create "React Component Expert" or "Form Validation Expert".

### 5. Keep It Small
Expertise files should be <200 lines. If larger, the domain is too broad. Split into sub-domains.

## Anti-Patterns to Avoid

1. **Treating Expertise as Source of Truth** - Always validate against code
2. **Global Expertise Files** - Each domain needs its own focused file
3. **Manual Expertise Updates** - Let self-improve handle it
4. **Skipping Validation** - Never trust expertise blindly
5. **Over-broad Domains** - Keep domains focused and specific

## Research Reference

This system is based on the Agent Expert pattern from:
- **Source**: IndyDevDan's Tactical Agentic Coding Course
- **Lesson**: 13 - Agent Experts: Finally, Agents That Actually Learn
- **Research**: See `docs/10-research/20251216-agent-experts-self-improving-agents.md`
