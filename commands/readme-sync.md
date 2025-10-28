# readme-sync

Audit and update all README.md files across /docs in parallel using specialized agents.

## Command

`/AgileFlow:readme-sync`

## Description

Audits and updates all README.md files across /docs folders in PARALLEL. Each agent:
1. Reads the folder's current README.md (if exists)
2. Scans folder contents using bash (ls, find, grep)
3. Identifies documentation gaps, outdated info, missing files
4. Proposes updates with improved structure and content
5. Updates README.md with improvements using the Edit tool
6. Reports changes made

## How It Works (Implementation)

### Step 1: Discover Folders (Using Bash)
```bash
# Find all numbered doc folders (00-meta through 10-research)
ls -d docs/[0-9][0-9]-* 2>/dev/null | sort
```

### Step 2: Spawn Agents in Parallel (Using Task Tool)
For each discovered folder, spawn agileflow-readme-updater agent with the folder path:

```javascript
// Example for docs/00-meta/
Task(
  description: "Update docs/00-meta/README.md",
  prompt: `You are updating README.md for the docs/00-meta/ folder.

FOLDER PATH: docs/00-meta/

TASK:
1. Use bash to list folder contents: ls -la docs/00-meta/
2. Check if README.md exists: [ -f docs/00-meta/README.md ] && echo exists
3. If exists, READ the current README.md to understand current structure
4. If not exists, create a new README.md
5. Identify all files/subfolders in docs/00-meta/
6. Update README.md with:
   - Clear folder purpose
   - List of key files with descriptions
   - Links to related folders
   - How to navigate this folder
   - Open questions or TODOs
   - Next steps/planned work
7. EDIT or WRITE the README.md file
8. Report what was changed or created

Use these tools:
- Bash: ls, find, grep to explore folder
- Read: Read files to understand current content
- Edit: Update existing README.md
- Write: Create new README.md if missing
`,
  subagent_type: "agileflow-readme-updater"
)

// Repeat for each folder: 01-brainstorming, 02-practices, etc.
```

### Step 3: Parallel Execution
- All Task calls are made in a single message block
- Claude Code executes them in parallel (not sequentially)
- Each agent works independently on their folder
- Results come back from each agent

### Step 4: Collect & Report Results
```
README Sync Report
==================

✅ docs/00-meta/README.md (UPDATED)
   - Created folder purpose section
   - Added navigation links
   - Listed key directories

✅ docs/01-brainstorming/README.md (UPDATED)
   - Added quick reference for all ideas
   - Organized by priority
   - Updated next steps

... (all 11 folders)

Total Updated: 11 README files
Success Rate: 11/11 (100%)
```

## Example Output

```
README Sync Report
==================

✅ docs/00-meta/README.md
   - Updated navigation links
   - Added quick reference section
   - Clarified folder purpose

✅ docs/01-brainstorming/README.md
   - Added new brainstorming ideas summary
   - Updated "Next Steps" section
   - Reorganized by feature area

⚠️  docs/02-practices/README.md
   - Found 3 outdated practice docs
   - Suggest removing deprecated patterns
   - Ready for update

✅ docs/03-decisions/README.md
   - Added latest ADRs to index
   - Updated decision timeline
   - Cross-referenced related decisions

... (all 11 folders processed in parallel)

Total Updated: 11 READMEs
Time: ~30 seconds (parallel execution)
```

## When to Use

- After major feature implementation (update all relevant READMEs)
- After completing an epic (document in multiple folders)
- During documentation audit (quarterly refresh)
- Before releases (ensure all docs current)
- After organizational changes (update practices/structure)

## What Gets Updated

**Each folder's README.md includes**:
- Folder purpose and contents
- Key files and their purpose
- How to navigate folder
- Links to related folders
- Open questions / TODOs
- Risks or important notes
- Next steps / planned work

## Parallel Execution

All README.md updates happen simultaneously:
- 11 folders = 11 agents running at once
- Much faster than sequential updates
- Each agent focused on one folder
- Results coordinated automatically

## No Manual Input Needed

The command:
1. Automatically discovers folders
2. Spawns agents without prompting
3. Coordinates parallel execution
4. Reports results
5. Saves all updates

Just run the command and wait for the report!

## Related Commands

- `/AgileFlow:doc-coverage` - Report on documentation completeness
- `/AgileFlow:impact-analysis` - See what changed
- `/AgileFlow:board` - View project status
