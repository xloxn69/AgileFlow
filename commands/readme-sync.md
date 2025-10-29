---
description: Synchronize a folder's README.md with its current contents
allowed-tools: Task
---

# readme-sync

Synchronize a folder's README.md with its current contents by spawning the agileflow-readme-updater subagent.

## Prompt

**ROLE**: README Sync Command Handler

**OBJECTIVE**: Spawn the `agileflow-readme-updater` subagent to synchronize a folder's README.md with its current contents.

**WORKFLOW**:

1. **Extract folder path from user's message**:
   - User might say: "sync docs/02-practices"
   - Or: "/AgileFlow:readme-sync docs/04-architecture"
   - Or: "update README for docs/06-stories"

2. **If folder path is clear**, spawn the subagent immediately:
   ```
   Use the Task tool to spawn agileflow-readme-updater subagent:

   Task(
     description: "Sync README.md for [folder]",
     prompt: "Audit and synchronize README.md for the folder: [folder_path]

     Your task:
     1. List all files and subdirectories in [folder_path]
     2. Read the current README.md (if exists)
     3. Extract descriptions from each file (first heading or sentence)
     4. Build a new '## Contents' section with all files listed
     5. Show the proposed changes (diff format)
     6. Ask user to confirm: 'Update README.md? (YES/NO)'
     7. If YES: Update only the '## Contents' section (preserve everything else)
     8. Report what was changed",
     subagent_type: "agileflow-readme-updater"
   )
   ```

3. **If folder path is unclear**, ask user:
   - "Which folder should I sync the README for? (e.g., docs/02-practices)"
   - Then spawn the subagent with the provided folder

**EXAMPLE INVOCATIONS**:

User: "sync docs/02-practices"
→ Spawn agileflow-readme-updater with prompt: "Audit and synchronize README.md for docs/02-practices"

User: "update readme for docs/06-stories"
→ Spawn agileflow-readme-updater with prompt: "Audit and synchronize README.md for docs/06-stories"

User: "/AgileFlow:readme-sync"
→ Ask: "Which folder should I sync?"
→ User responds: "docs/04-architecture"
→ Spawn agileflow-readme-updater with that folder

**KEY POINTS**:
- This command is just a launcher - it spawns the subagent
- The subagent (agileflow-readme-updater) does the actual work
- Subagent has tools: Bash, Read, Edit, Write
- Subagent will handle all file discovery, diffing, and updating

## How It Works

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

## Example Output

```
📁 Syncing docs/02-practices/README.md
=====================================

Found 7 files:
  • README.md (existing)
  • testing.md – Test strategy, patterns, test infrastructure
  • git-branching.md – Git workflow, branching strategy, commit conventions
  • ci.md – CI/CD pipeline configuration, testing gates
  • security.md – Security practices, input validation, authentication
  • releasing.md – Release procedures, versioning, changelog
  • prompts/ (directory) – Agent customization prompts

Proposed Changes to ## Contents Section:
─────────────────────────────────────────
- testing.md – Test strategy, patterns, test infrastructure
- git-branching.md – Git workflow, branching strategy, commit conventions
- ci.md – CI/CD pipeline configuration, testing gates
- security.md – Security practices, input validation, authentication
- releasing.md – Release procedures, versioning, changelog
- prompts/ – Agent customization prompts
  - agents/ – Custom agent instructions for this project
  - commands-catalog.md – Reference list of slash commands

Update README.md with these changes? (YES/NO)
```

## When to Use

- After adding new files to a folder (keep README current)
- Before major releases (ensure docs match code)
- During documentation cleanup (quarterly maintenance)
- After reorganizing folder structure (update navigation)
- When README "Contents" section is out of date

## Usage Examples

```bash
# Sync docs/02-practices folder
/AgileFlow:readme-sync FOLDER=docs/02-practices

# Sync docs/04-architecture folder
/AgileFlow:readme-sync FOLDER=docs/04-architecture

# Sync src/components folder (if it has README)
/AgileFlow:readme-sync FOLDER=src/components
```

## What It Updates

Only the `## Contents` section of README.md:
- Removes old file listings
- Adds all current files with descriptions
- Maintains all other sections unchanged
- Preserves custom notes and links

## How to Sync Multiple Folders

Run the command for each folder one at a time, or create a script:
```bash
for folder in docs/0[0-9]-*; do
  /AgileFlow:readme-sync FOLDER="$folder"
done
```

## Related Commands

- `/AgileFlow:doc-coverage` - Report on documentation completeness
- `/AgileFlow:impact-analysis` - See what changed
- `/AgileFlow:board` - View project status
