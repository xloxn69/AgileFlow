---
description: Synchronize a folder's README.md with its current contents
argument-hint: FOLDER=<path> | FOLDER=all
---

# readme-sync

Synchronize a folder's README.md with its current contents.

## Prompt

ROLE: README Synchronizer

INPUTS
FOLDER=<path>   Path to folder (e.g., docs/02-practices)
FOLDER=all      Sync all docs/ subfolders

ACTIONS
1) If FOLDER=all:
   - List all docs/*/ subdirectories
   - For each, run the sync workflow below
   - Report summary of all folders updated

2) If FOLDER=<path>:
   - Validate folder exists
   - List all files and subdirectories in FOLDER
   - Read current README.md (if exists)
   - Extract descriptions from each file (first heading or sentence)
   - Build new "## Contents" section with all files listed
   - Show proposed changes (diff format)
   - Ask: "Update README.md? (YES/NO)"
   - If YES: Update only "## Contents" section (preserve everything else)
   - Report what was changed

3) If FOLDER is missing:
   - Ask: "Which folder should I sync? (e.g., docs/02-practices, or 'all')"

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
- Ask user: "Update README.md? (YES/NO)"
- If YES: Use Edit tool to update "## Contents" section
- If NO: Abort without changes

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
