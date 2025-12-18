# Command Structure

How to structure AgileFlow slash commands for consistency.

---

## Frontmatter

Every command file starts with YAML frontmatter:

```yaml
---
description: Brief one-line description of command
argument-hint: REQUIRED=<value> [OPTIONAL=<value>]
---
```

### Fields

| Field | Required | Description |
|-------|----------|-------------|
| `description` | Yes | One-line summary shown in help |
| `argument-hint` | If has args | Shows usage pattern in command list |

### argument-hint Patterns

```yaml
# Required arguments
argument-hint: STORY=<US-ID> STATUS=<status>

# Optional arguments (brackets)
argument-hint: STORY=<US-ID> [SUMMARY=<text>]

# All optional
argument-hint: [BRANCH=<name>] [BASE=<branch>]

# Alternatives (pipe)
argument-hint: FOLDER=<path> | FOLDER=all

# Lists
argument-hint: EPIC=<EP-ID> [STORIES=<US-001,US-002>]
```

---

## Prompt Structure

After frontmatter, use this structure:

```markdown
# command-name

Brief description of what command does.

## Prompt

ROLE: <Role Name>

INPUTS
PARAM1=<type>   Description of param1
PARAM2=<type>   Description of param2 (optional)

ACTIONS
1) First action
2) Second action
3) Third action

<additional sections as needed>
```

### Required Sections

1. **ROLE** - Single line naming the agent's role
2. **INPUTS** - Parameter definitions with types
3. **ACTIONS** - Numbered list of what command does

### Optional Sections

- **AGENT SPAWNING** - If command spawns subagents
- **WORKFLOW DETAILS** - Step-by-step breakdown
- **EXAMPLE OUTPUT** - Sample output format
- **WHEN TO USE** - Usage guidance
- **USAGE EXAMPLES** - Command invocation examples
- **RELATED** - Links to related commands/docs

---

## Agent Spawning

Commands that delegate work should spawn agents:

```markdown
AGENT SPAWNING
This command spawns the `<agent-name>` agent:

\`\`\`
Task(
  description: "Brief task description",
  prompt: "Detailed instructions for agent",
  subagent_type: "AgileFlow:<agent-name>"
)
\`\`\`
```

### When to Spawn Agents

- **Spawn** when work is domain-specific (UI, API, database, etc.)
- **Spawn** for long-running or complex tasks
- **Don't spawn** for simple coordination or status updates

---

## Example: Complete Command

```markdown
---
description: Synchronize a folder's README.md with its current contents
argument-hint: FOLDER=<path> | FOLDER=all
---

# readme-sync

Synchronize a folder's README.md with its current contents.

## Prompt

ROLE: README Sync Orchestrator

INPUTS
FOLDER=<path>   Path to folder (e.g., docs/02-practices)
FOLDER=all      Sync all docs/ subfolders

AGENT SPAWNING
This command spawns the `readme-updater` agent:

\`\`\`
Task(
  description: "Sync README for <FOLDER>",
  prompt: "Audit and synchronize README.md for: <FOLDER>",
  subagent_type: "AgileFlow:readme-updater"
)
\`\`\`

ACTIONS
1) If FOLDER=all: spawn agent for each docs/*/ folder
2) If FOLDER=<path>: spawn agent for that folder
3) If FOLDER missing: ask user which folder

USAGE EXAMPLES
\`\`\`bash
/agileflow:readme-sync FOLDER=docs/02-practices
/agileflow:readme-sync FOLDER=all
\`\`\`
```

---

## Checklist

Before creating a command:

- [ ] `description` in frontmatter
- [ ] `argument-hint` if command takes parameters
- [ ] `ROLE:` line in prompt
- [ ] `INPUTS` section listing all parameters
- [ ] `ACTIONS` section with numbered steps
- [ ] `AGENT SPAWNING` section if delegating to agent
- [ ] `USAGE EXAMPLES` showing invocation

---

## Related

- [Async Agent Spawning](./async-agent-spawning.md) - How to spawn background agents
- [Agent Structure](./agent-structure.md) - How to structure agent files (if exists)
