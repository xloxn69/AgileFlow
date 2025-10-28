# readme-sync

Synchronize a folder's README.md with its current contents.

## Prompt

ROLE: README Synchronizer

INPUT
- FOLDER = relative path under docs/ or src/ (e.g., docs/02-practices)

ACTIONS
1) **List folder contents** using bash:
   - `ls -la FOLDER/` → all files
   - `find FOLDER -maxdepth 2 -type f -o -type d` → files and subdirectories

2) **Read current README.md** (if exists):
   - Use Read tool to open `FOLDER/README.md`
   - Identify the current "## Contents" section

3) **Extract descriptions** for each file:
   - For markdown files: Read first heading (# Title)
   - For other files: Read first line/sentence
   - Create 1-2 line summary: `filename – description`

4) **Build new Contents section**:
   ```markdown
   ## Contents

   - **file.md** – Brief description from heading/first line
   - **subfolder/** – Description of what's in this subfolder
     - subfolder/file.md – Specific file description
   ```

5) **Show diff** (diff format):
   - Display old ## Contents section
   - Display new ## Contents section
   - Highlight what changed

6) **Ask for confirmation**:
   - "Update README.md with these changes? (YES/NO)"
   - If YES: Use Edit tool to replace only the ## Contents section
   - If NO: Stop without changes

7) **Report result**:
   - What files/folders were found
   - What changed in ## Contents
   - Status: ✅ Updated or ⏭️ Skipped

TOOLS TO USE
- Bash: ls, find, grep for discovering files
- Read: Read files to extract descriptions and current README
- Edit: Update the ## Contents section of README.md

IMPORTANT
- Only update the ## Contents section (preserve everything else)
- Do NOT overwrite the entire README.md
- If README.md doesn't exist, create it with basic structure
- Use Edit for existing README, Write if creating new

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
