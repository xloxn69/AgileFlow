# readme-sync

Audit and update all README.md files across /docs in parallel using specialized agents.

## Command

`/AgileFlow:readme-sync`

## Description

Spawns specialized agents in PARALLEL - one per /docs folder - to audit and update all README.md files simultaneously. Each agent:
1. Reads the folder's current README.md (if exists)
2. Scans folder contents to understand what's there
3. Identifies gaps, outdated info, missing documentation
4. Proposes updates (improved structure, new content, removed obsolete info)
5. Updates README.md with improvements

Results are coordinated and reported back to the user.

## How It Works

```
/AgileFlow:readme-sync
  ↓
Scan /docs structure
  ├── docs/00-meta/
  ├── docs/01-brainstorming/
  ├── docs/02-practices/
  ├── docs/03-decisions/
  ├── docs/04-architecture/
  ├── docs/05-epics/
  ├── docs/06-stories/
  ├── docs/07-testing/
  ├── docs/08-project/
  ├── docs/09-agents/
  └── docs/10-research/
  ↓
Spawn agileflow-readme-updater agent IN PARALLEL (one per folder):
  Task(
    description: "Update docs/00-meta/README.md",
    prompt: "Audit folder and update README.md with current contents",
    subagent_type: "agileflow-readme-updater"
  )
  Task(
    description: "Update docs/01-brainstorming/README.md",
    prompt: "Audit folder and update README.md with current contents",
    subagent_type: "agileflow-readme-updater"
  )
  ... (11 agents running simultaneously)
  ↓
Each agent:
  1. Reads current README
  2. Audits folder contents
  3. Identifies gaps/outdated info
  4. Identifies improvements
  5. Updates README.md
  6. Reports what was changed
  ↓
Coordinate results and generate summary report
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
