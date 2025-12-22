---
description: Synchronize a folder's README.md with its current contents
argument-hint: FOLDER=<path> | FOLDER=all
---

# readme-sync

Synchronize a folder's README.md with its current contents.

---

## STEP 0: Activation

```bash
node -e "
const fs = require('fs');
const path = 'docs/09-agents/session-state.json';
if (fs.existsSync(path)) {
  const state = JSON.parse(fs.readFileSync(path, 'utf8'));
  state.active_command = { name: 'readme-sync', activated_at: new Date().toISOString(), state: {} };
  fs.writeFileSync(path, JSON.stringify(state, null, 2) + '\n');
  console.log('✅ readme-sync command activated');
}
"
```

---

## STEP 0: Activation (Documentation)

**PURPOSE**: Immediately load full context before executing any logic.

**ACTIONS**:
1. Read `/home/coder/AgileFlow/packages/cli/src/core/commands/readme-sync.md` (this file) in its entirety
2. Absorb all instructions, rules, and examples
3. Proceed to execution phase with complete context

**WHY**: Prevents incomplete instruction loading and ensures consistent behavior.

---

<!-- COMPACT_SUMMARY_START -->
## Compact Summary
- **Command**: /agileflow:readme-sync
- **Purpose**: Synchronize folder README.md with current contents
- **Arguments**: FOLDER=<path> | FOLDER=all
- **Agent Spawning**: Spawns `readme-updater` agent for actual work
- **Key Actions**:
  1. List all files and subdirectories in FOLDER
  2. Read current README.md (if exists)
  3. Extract descriptions from each file (first heading or sentence)
  4. Build new "## Contents" section with bullet list
  5. Show diff and ask for confirmation via AskUserQuestion
  6. Update if approved using Edit tool
- **FOLDER=all**: Sync all docs/*/ subdirectories in parallel
- **AskUserQuestion**: Use XML format with multiSelect for decisions
- **Output**: Updates only "## Contents" section, preserves all other sections
- **Use Cases**: After adding files, before releases, documentation cleanup, reorganizing folders
- **Related**: docs/02-practices/async-agent-spawning.md, ask-user-question.md
<!-- COMPACT_SUMMARY_END -->

---

## Prompt

ROLE: README Sync Orchestrator

🔴 **AskUserQuestion Format** (when asking decisions):
- NEVER ask users to "type" anything - use proper options
- Use XML invoke format with multiSelect for multiple choices
- See `docs/02-practices/ask-user-question.md` for examples

INPUTS
FOLDER=<path>   Path to folder (e.g., docs/02-practices)
FOLDER=all      Sync all docs/ subfolders

AGENT SPAWNING
This command spawns the `readme-updater` agent to do the actual work:

```
Task(
  description: "Sync README for <FOLDER>",
  prompt: "Audit and synchronize README.md for: <FOLDER>
    1. List all files and subdirectories
    2. Read current README.md (if exists)
    3. Extract descriptions from each file
    4. Build new '## Contents' section
    5. Show diff and ask for confirmation
    6. Update if approved",
  subagent_type: "AgileFlow:readme-updater"
)
```

ACTIONS
1) If FOLDER=all:
   - List all docs/*/ subdirectories
   - Spawn readme-updater agent for each folder (can run in parallel)
   - Report summary of all folders updated

2) If FOLDER=<path>:
   - Validate folder exists
   - Spawn readme-updater agent with the folder path
   - Agent handles: listing, diffing, confirmation, updating

3) If FOLDER is missing:
   - Use AskUserQuestion to ask which folder to sync:
   ```xml
   <invoke name="AskUserQuestion">
   <parameter name="questions">[{
     "question": "Which folder should I sync?",
     "header": "Folder",
     "multiSelect": false,
     "options": [
       {"label": "docs/02-practices (Recommended)", "description": "Sync practices documentation folder"},
       {"label": "docs/04-architecture", "description": "Sync architecture documentation"},
       {"label": "all", "description": "Sync all docs/ subfolders"},
       {"label": "Other", "description": "Enter custom folder path"}
     ]
   }]</parameter>
   </invoke>
   ```

WORKFLOW DETAILS

### Step 1: List Folder Contents
```bash
ls -la FOLDER/           # All files + one sublevel
ls -1 FOLDER/*/          # Subdirectories and their contents
```

### Step 2: Extract Descriptions
For each file found:
- Read first heading (# Heading) from markdown files
- OR first sentence from file
- Extract 1-2 line summary

### Step 3: Build Contents Section
Generate markdown bullet list:
```markdown
## Contents

- **filename.md** – Brief description of what this file is
- **subfolder/** – Description of what's in this subfolder
  - subfolder/file.md – Specific file description
```

### Step 4: Show Diff & Apply
- Display the proposed changes (diff format)
- Ask user with AskUserQuestion:
  ```xml
  <invoke name="AskUserQuestion">
  <parameter name="questions">[{
    "question": "Apply these changes to README.md?",
    "header": "Update",
    "multiSelect": false,
    "options": [
      {"label": "Yes, update README (Recommended)", "description": "Write the proposed ## Contents section to README.md"},
      {"label": "No, abort", "description": "Cancel without making changes"}
    ]
  }]</parameter>
  </invoke>
  ```
- If "Yes, update README": Use Edit tool to update "## Contents" section
- If "No, abort": Exit without changes

EXAMPLE OUTPUT

```
📁 Syncing docs/02-practices/README.md
=====================================

Found 8 files:
  • README.md (existing)
  • testing.md – Test strategy, patterns, test infrastructure
  • git-branching.md – Git workflow, branching strategy, commit conventions
  • ci.md – CI/CD pipeline configuration, testing gates
  • security.md – Security practices, input validation, authentication
  • releasing.md – Release procedures, versioning, changelog
  • diagrams.md – Mermaid diagram generation with light/dark themes
  • async-agent-spawning.md – Launch, monitor, and retrieve background agents
  • ask-user-question.md – Using the AskUserQuestion tool effectively

Proposed Changes to ## Contents Section:
─────────────────────────────────────────
- **testing.md** – Test strategy, patterns, test infrastructure
- **git-branching.md** – Git workflow, branching strategy, commit conventions
- **ci.md** – CI/CD pipeline configuration, testing gates
- **security.md** – Security practices, input validation, authentication
- **releasing.md** – Release procedures, versioning, changelog
- **diagrams.md** – Mermaid diagram generation with light/dark themes
- **async-agent-spawning.md** – Launch, monitor, and retrieve background agents
- **ask-user-question.md** – Using the AskUserQuestion tool effectively

Update README.md with these changes? (YES/NO)
```

WHEN TO USE
- After adding new files to a folder (keep README current)
- Before major releases (ensure docs match code)
- During documentation cleanup (quarterly maintenance)
- After reorganizing folder structure (update navigation)
- When README "Contents" section is out of date
- Use FOLDER=all to sync entire docs/ directory at once

USAGE EXAMPLES
```bash
# Sync single folder
/agileflow:readme-sync FOLDER=docs/02-practices

# Sync all docs folders
/agileflow:readme-sync FOLDER=all

# Sync architecture docs
/agileflow:readme-sync FOLDER=docs/04-architecture
```

WHAT IT UPDATES
Only the `## Contents` section of README.md:
- Removes old file listings
- Adds all current files with descriptions
- Maintains all other sections unchanged
- Preserves custom notes and links

RELATED
- [Diagram Practice](docs/02-practices/diagrams.md) - How to create diagrams
- [Async Agent Spawning](docs/02-practices/async-agent-spawning.md) - Background agent patterns
