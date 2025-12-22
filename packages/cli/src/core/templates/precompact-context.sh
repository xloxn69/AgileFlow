#!/bin/bash
#
# AgileFlow PreCompact Hook
#
# This script runs before Claude compacts the conversation.
# It outputs critical context that should survive summarization.
#
# Features:
# - Project status (version, branch, stories)
# - Active command detection (babysit, etc.) with preserve_rules
# - Key conventions from CLAUDE.md
#
# Usage: Automatically invoked by Claude Code before compact
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

# ============================================================
# ACTIVE COMMAND DETECTION
# ============================================================
# Check if a command (babysit, etc.) is currently active
# If so, extract its Compact Summary section (or preserve_rules as fallback)

ACTIVE_COMMAND=""
COMMAND_SUMMARY=""

if [ -f "docs/09-agents/session-state.json" ]; then
  ACTIVE_COMMAND=$(node -p "
    const s = require('./docs/09-agents/session-state.json');
    s.active_command?.name || '';
  " 2>/dev/null || echo "")

  if [ ! -z "$ACTIVE_COMMAND" ] && [ "$ACTIVE_COMMAND" != "null" ]; then
    # Look for the command file in .agileflow or .claude/commands
    COMMAND_FILE=""
    if [ -f ".agileflow/commands/${ACTIVE_COMMAND}.md" ]; then
      COMMAND_FILE=".agileflow/commands/${ACTIVE_COMMAND}.md"
    elif [ -f ".claude/commands/agileflow/${ACTIVE_COMMAND}.md" ]; then
      COMMAND_FILE=".claude/commands/agileflow/${ACTIVE_COMMAND}.md"
    fi

    if [ ! -z "$COMMAND_FILE" ]; then
      # Try to extract Compact Summary section first (between markers)
      COMMAND_SUMMARY=$(node -e "
        const fs = require('fs');
        const content = fs.readFileSync('$COMMAND_FILE', 'utf8');

        // Try to extract content between COMPACT_SUMMARY_START and COMPACT_SUMMARY_END markers
        const summaryMatch = content.match(/<!-- COMPACT_SUMMARY_START[\\s\\S]*?-->([\\s\\S]*?)<!-- COMPACT_SUMMARY_END -->/);
        if (summaryMatch) {
          console.log('## ACTIVE COMMAND: /agileflow:${ACTIVE_COMMAND}');
          console.log('');
          console.log(summaryMatch[1].trim());
          process.exit(0);
        }

        // Fallback: extract preserve_rules from frontmatter
        const fmMatch = content.match(/^---\\n([\\s\\S]*?)\\n---/);
        if (!fmMatch) process.exit(0);

        const frontmatter = fmMatch[1];
        const rulesMatch = frontmatter.match(/preserve_rules:\\s*\\n([\\s\\S]*?)(?=\\n\\s*[a-z_]+:|$)/);
        if (!rulesMatch) process.exit(0);

        const rules = rulesMatch[1]
          .split('\\n')
          .filter(line => line.trim().startsWith('-'))
          .map(line => line.replace(/^\\s*-\\s*[\"']?/, '').replace(/[\"']?\\s*$/, ''))
          .filter(Boolean);

        if (rules.length > 0) {
          console.log('## ACTIVE COMMAND RULES (MUST FOLLOW)');
          rules.forEach(rule => console.log('- ' + rule));
        }
      " 2>/dev/null || echo "")
    fi
  fi
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
EOF

# Output active command summary if present
if [ ! -z "$COMMAND_SUMMARY" ]; then
  echo ""
  echo "$COMMAND_SUMMARY"
fi

cat << EOF

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
