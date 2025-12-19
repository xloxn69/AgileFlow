#!/bin/bash
# AgileFlow Status Line for Claude Code
# Displays contextual information from status.json and session data
#
# This script is called by Claude Code and receives JSON via stdin.
# Customize this script to change what's displayed in your status line.
#
# Available data from stdin JSON:
#   .model.display_name          - Model name (Opus, Sonnet, etc.)
#   .cost.total_cost_usd         - Session cost in USD
#   .context_window.context_window_size - Total context window size
#   .context_window.current_usage.input_tokens - Current input tokens
#   .workspace.current_dir       - Current working directory

# Read JSON input from stdin (Claude Code provides this)
input=$(cat)

# Parse model info
MODEL_DISPLAY=$(echo "$input" | jq -r '.model.display_name // "Claude"')

# Parse context usage
CONTEXT_SIZE=$(echo "$input" | jq -r '.context_window.context_window_size // 200000')
USAGE=$(echo "$input" | jq '.context_window.current_usage // null')

CTX_DISPLAY=""
if [ "$USAGE" != "null" ]; then
  CURRENT_TOKENS=$(echo "$USAGE" | jq '.input_tokens + (.cache_creation_input_tokens // 0) + (.cache_read_input_tokens // 0)')
  if [ "$CURRENT_TOKENS" != "null" ] && [ "$CURRENT_TOKENS" -gt 0 ] 2>/dev/null; then
    PERCENT_USED=$((CURRENT_TOKENS * 100 / CONTEXT_SIZE))
    CTX_DISPLAY="${PERCENT_USED}% ctx"
  fi
fi

# Parse cost
TOTAL_COST=$(echo "$input" | jq -r '.cost.total_cost_usd // 0')
COST_DISPLAY=""
if [ "$TOTAL_COST" != "0" ] && [ "$TOTAL_COST" != "null" ]; then
  COST_DISPLAY=$(printf '$%.2f' "$TOTAL_COST")
fi

# AgileFlow Status - Read from status.json
STORY_DISPLAY=""
EPIC_DISPLAY=""
NEXT_STORY=""
WIP_DISPLAY=""

if [ -f "docs/09-agents/status.json" ]; then
  STATUS_JSON=$(cat docs/09-agents/status.json 2>/dev/null)

  # Find first in-progress story and its epic
  STORY_ID=$(echo "$STATUS_JSON" | jq -r '.stories | to_entries | map(select(.value.status == "in-progress")) | .[0].key // empty')

  if [ -n "$STORY_ID" ] && [ "$STORY_ID" != "null" ]; then
    STORY_TITLE=$(echo "$STATUS_JSON" | jq -r ".stories[\"$STORY_ID\"].title // \"\"")
    EPIC_ID=$(echo "$STATUS_JSON" | jq -r ".stories[\"$STORY_ID\"].epic // \"\"")

    if [ -n "$STORY_TITLE" ] && [ "$STORY_TITLE" != "null" ]; then
      # Truncate title if too long (max 25 chars)
      if [ ${#STORY_TITLE} -gt 25 ]; then
        STORY_TITLE="${STORY_TITLE:0:22}..."
      fi
      STORY_DISPLAY="${STORY_ID}: ${STORY_TITLE}"
    fi

    # Get epic progress if we have an epic
    if [ -n "$EPIC_ID" ] && [ "$EPIC_ID" != "null" ]; then
      # Count total stories in this epic
      TOTAL_IN_EPIC=$(echo "$STATUS_JSON" | jq "[.stories | to_entries[] | select(.value.epic == \"$EPIC_ID\")] | length")
      # Count done stories in this epic
      DONE_IN_EPIC=$(echo "$STATUS_JSON" | jq "[.stories | to_entries[] | select(.value.epic == \"$EPIC_ID\" and .value.status == \"done\")] | length")

      if [ "$TOTAL_IN_EPIC" -gt 0 ] 2>/dev/null; then
        EPIC_PCT=$((DONE_IN_EPIC * 100 / TOTAL_IN_EPIC))
        EPIC_DISPLAY="${EPIC_ID}: ${DONE_IN_EPIC}/${TOTAL_IN_EPIC} (${EPIC_PCT}%)"
      fi
    fi
  else
    # No story in-progress - find next READY story (priority: high > medium > low)
    # Look for stories with status "ready" or stories without blockers
    NEXT_ID=$(echo "$STATUS_JSON" | jq -r '
      .stories | to_entries
      | map(select(.value.status == "ready" or .value.status == "backlog" or .value.status == "draft"))
      | sort_by(
          if .value.priority == "high" then 0
          elif .value.priority == "medium" then 1
          else 2
          end
        )
      | .[0].key // empty
    ')

    if [ -n "$NEXT_ID" ] && [ "$NEXT_ID" != "null" ]; then
      NEXT_TITLE=$(echo "$STATUS_JSON" | jq -r ".stories[\"$NEXT_ID\"].title // \"\"")
      NEXT_PRIORITY=$(echo "$STATUS_JSON" | jq -r ".stories[\"$NEXT_ID\"].priority // \"\"")
      if [ ${#NEXT_TITLE} -gt 20 ]; then
        NEXT_TITLE="${NEXT_TITLE:0:17}..."
      fi
      # Add priority indicator
      PRIORITY_ICON=""
      case "$NEXT_PRIORITY" in
        high) PRIORITY_ICON="🔴" ;;
        medium) PRIORITY_ICON="🟡" ;;
        *) PRIORITY_ICON="🟢" ;;
      esac
      NEXT_STORY="${PRIORITY_ICON} Next: ${NEXT_ID}"
    fi
  fi

  # Calculate WIP count
  WIP_COUNT=$(echo "$STATUS_JSON" | jq '[.stories | to_entries[] | select(.value.status == "in-progress" or .value.status == "in-review")] | length')
  WIP_LIMIT=3  # Default WIP limit
  if [ -n "$WIP_COUNT" ] && [ "$WIP_COUNT" != "null" ]; then
    WIP_DISPLAY="WIP: ${WIP_COUNT}/${WIP_LIMIT}"
  fi
fi

# Get git branch
GIT_BRANCH=""
if git rev-parse --git-dir > /dev/null 2>&1; then
  BRANCH=$(git branch --show-current 2>/dev/null)
  if [ -n "$BRANCH" ]; then
    GIT_BRANCH="$BRANCH"
  fi
fi

# Build status line
OUTPUT="[${MODEL_DISPLAY}]"

# Add current story OR next story suggestion
if [ -n "$STORY_DISPLAY" ]; then
  OUTPUT="${OUTPUT} 📋 ${STORY_DISPLAY}"
elif [ -n "$NEXT_STORY" ]; then
  OUTPUT="${OUTPUT} ${NEXT_STORY}"
fi

# Add epic progress (if working on a story in an epic)
if [ -n "$EPIC_DISPLAY" ]; then
  OUTPUT="${OUTPUT} | 📦 ${EPIC_DISPLAY}"
fi

# Add WIP count
if [ -n "$WIP_DISPLAY" ]; then
  OUTPUT="${OUTPUT} | ${WIP_DISPLAY}"
fi

# Add context usage
if [ -n "$CTX_DISPLAY" ]; then
  OUTPUT="${OUTPUT} | ${CTX_DISPLAY}"
fi

# Add cost
if [ -n "$COST_DISPLAY" ]; then
  OUTPUT="${OUTPUT} | ${COST_DISPLAY}"
fi

# Add git branch
if [ -n "$GIT_BRANCH" ]; then
  OUTPUT="${OUTPUT} | ${GIT_BRANCH}"
fi

echo "$OUTPUT"
