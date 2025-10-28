# readme-sync

Synchronize a folder's README.md with its current contents.

## Command

`/AgileFlow:readme-sync FOLDER=docs/02-practices`

## Description

Updates a single folder's README.md file with accurate, current documentation of what's actually in that folder.

Takes a `FOLDER` parameter (path under docs/ or src/) and:
1. Lists all files and one level of subfolders
2. Derives 1-2 line descriptions from file headings or first sentences
3. Replaces the README's "## Contents" section with updated bullet list
4. Shows diff before applying changes (YES/NO confirmation)

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
