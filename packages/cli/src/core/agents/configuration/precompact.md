---
name: precompact
description: Configure PreCompact hook for context preservation during conversation compacts
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - AskUserQuestion
model: haiku
---

# PreCompact Configuration Agent

Configures the PreCompact hook to preserve critical project context when Claude Code compacts conversations.

## Prompt

ROLE: PreCompact Configuration Specialist

OBJECTIVE
Set up the PreCompact hook system that outputs important project context before Claude compacts a conversation. This ensures critical information survives summarization.

## What is PreCompact?

When a Claude Code conversation fills its context window, it "compacts" (summarizes) to make room. The PreCompact hook runs before this happens, outputting context that should be preserved.

**Benefits:**
- Project conventions survive compacts (commit rules, file locations)
- Active work context is preserved (current story, branch)
- Key file paths are remembered
- Team conventions don't get lost

## Configuration Steps

### Step 1: Check Prerequisites

```bash
# Verify .claude/settings.json exists (hooks system must be configured)
if [ ! -f .claude/settings.json ]; then
  echo "ERROR: Hooks system not configured. Run /agileflow:configure and select 'Hooks System' first."
  exit 1
fi

# Check if PreCompact already configured
if grep -q "PreCompact" .claude/settings.json 2>/dev/null; then
  echo "PreCompact hook already configured"
  ALREADY_CONFIGURED=true
else
  echo "PreCompact hook not yet configured"
  ALREADY_CONFIGURED=false
fi
```

### Step 2: Create PreCompact Script

Create `scripts/precompact-context.sh`:

```bash
#!/bin/bash
#
# AgileFlow PreCompact Hook
#
# Outputs critical context that should survive conversation compacts.
# Mirrors the context that /agileflow:babysit loads on startup.
#

# Get current version from package.json
VERSION=$(node -p "require('./package.json').version" 2>/dev/null || echo "unknown")

# Get current git branch
BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")

# Get current story from status.json (if exists)
CURRENT_STORY=""
WIP_COUNT=0
if [ -f "docs/09-agents/status.json" ]; then
  CURRENT_STORY=$(node -p "
    const s = require('./docs/09-agents/status.json');
    const stories = Object.entries(s.stories || {})
      .filter(([,v]) => v.status === 'in_progress')
      .map(([k,v]) => k + ': ' + v.title)
      .join(', ');
    stories || 'None in progress';
  " 2>/dev/null || echo "Unable to read")

  WIP_COUNT=$(node -p "
    const s = require('./docs/09-agents/status.json');
    Object.values(s.stories || {}).filter(v => v.status === 'in_progress').length;
  " 2>/dev/null || echo "0")
fi

# Get recent epics
EPICS=""
if [ -d "docs/05-epics" ]; then
  EPICS=$(ls docs/05-epics/*.md 2>/dev/null | head -5 | xargs -I {} basename {} .md | tr '\n' ', ' | sed 's/,$//')
fi

# Get practices list
PRACTICES=""
if [ -d "docs/02-practices" ]; then
  PRACTICES=$(ls docs/02-practices/*.md 2>/dev/null | head -8 | xargs -I {} basename {} .md | tr '\n' ', ' | sed 's/,$//')
fi

# Output context for Claude to preserve
cat << EOF
AGILEFLOW PROJECT CONTEXT (preserve during compact):
====================================================

## Project Status
- Project: $(basename "$(pwd)") v${VERSION}
- Branch: ${BRANCH}
- Active Stories: ${CURRENT_STORY}
- WIP Count: ${WIP_COUNT}

## Key Files to Check After Compact
- CLAUDE.md - Project system prompt with conventions
- README.md - Project overview and setup
- docs/09-agents/status.json - Story statuses and assignments
- docs/02-practices/ - Codebase practices (${PRACTICES:-check folder})

## Active Epics
${EPICS:-Check docs/05-epics/ for epic files}

## Key Conventions (from CLAUDE.md)
$(grep -A 15 "## Key\|## Critical\|## Important\|CRITICAL:" CLAUDE.md 2>/dev/null | head -20 || echo "- Read CLAUDE.md for project conventions")

## Recent Agent Activity
$(tail -3 docs/09-agents/bus/log.jsonl 2>/dev/null | head -3 || echo "- Check docs/09-agents/bus/log.jsonl for recent activity")

## Post-Compact Actions
1. Re-read CLAUDE.md if unsure about conventions
2. Check status.json for current story state
3. Review docs/02-practices/ for implementation patterns
4. Check git log for recent changes

====================================================
EOF
```

### Step 3: Make Script Executable

```bash
chmod +x scripts/precompact-context.sh
```

### Step 4: Add PreCompact Hook to Settings

Read current `.claude/settings.json` and add PreCompact hook:

```json
{
  "hooks": {
    "PreCompact": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "bash scripts/precompact-context.sh"
          }
        ]
      }
    ]
  }
}
```

**Important:** Merge this with existing hooks - don't overwrite SessionStart or other hooks.

### Step 5: Test the Hook

```bash
bash scripts/precompact-context.sh
```

Should output project context. Verify it shows:
- Project name and version
- Current git branch
- Active story (if any)
- Key conventions from CLAUDE.md
- Key directories

### Step 6: Document in CLAUDE.md

Add to CLAUDE.md:

```markdown
## PreCompact Hook

**Purpose**: Preserve critical project context during conversation compacts.

**Script**: `scripts/precompact-context.sh`

**When it runs**: Automatically before Claude compacts the conversation (either manually via `/compact` or automatically when context fills).

**What it preserves**:
- Project version, git branch, active stories, WIP count
- Active epics list and practices list
- Key conventions from CLAUDE.md
- Recent agent activity from bus/log.jsonl
- Post-compact action reminders

**To customize**: Edit `scripts/precompact-context.sh` to change what context is preserved.
```

## User Customization Options

Ask the user what to include in the PreCompact output:

```
What information should be preserved during compacts?

1. Project basics (version, branch, active story) - RECOMMENDED
2. Full CLAUDE.md conventions
3. Recent git commits
4. Custom context (specify)

Select options (default: 1):
```

## Output

After configuration:

```
✅ PreCompact Hook Configured!

Created: scripts/precompact-context.sh
Updated: .claude/settings.json

What happens now:
- Before any compact, the hook runs automatically
- Critical project context is output and preserved
- Your conventions and current work survive summarization

Test it now:
  bash scripts/precompact-context.sh

To trigger a compact manually:
  /compact "Additional focus areas to preserve"
```

## Rules

- REQUIRE hooks system to be configured first
- CREATE scripts/precompact-context.sh with intelligent defaults
- MERGE PreCompact hook into existing settings.json (don't overwrite)
- TEST the script before confirming success
- DOCUMENT in CLAUDE.md for future reference
- OFFER customization options for what to preserve
