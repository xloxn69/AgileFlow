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

# ============================================================================
# ANSI Color Codes
# ============================================================================
RESET="\033[0m"
BOLD="\033[1m"
DIM="\033[2m"

# Foreground colors
BLACK="\033[30m"
RED="\033[31m"
GREEN="\033[32m"
YELLOW="\033[33m"
BLUE="\033[34m"
MAGENTA="\033[35m"
CYAN="\033[36m"
WHITE="\033[37m"

# Bright foreground colors (standard ANSI)
BRIGHT_RED="\033[91m"
BRIGHT_GREEN="\033[92m"
BRIGHT_YELLOW="\033[93m"
BRIGHT_BLUE="\033[94m"
BRIGHT_MAGENTA="\033[95m"
BRIGHT_CYAN="\033[96m"

# 256-color palette (vibrant modern colors from cc-statusline)
# Use these for context/session indicators for better visibility
CTX_GREEN="\033[38;5;158m"      # Mint green - healthy context
CTX_YELLOW="\033[38;5;215m"     # Peach - moderate usage
CTX_ORANGE="\033[38;5;215m"     # Peach/orange - high usage
CTX_RED="\033[38;5;203m"        # Coral red - critical

SESSION_GREEN="\033[38;5;194m"  # Light green - plenty of time
SESSION_YELLOW="\033[38;5;228m" # Light yellow - getting low
SESSION_RED="\033[38;5;210m"    # Light pink/red - critical

# Brand color (burnt orange #e8683a = RGB 232,104,58)
BRAND="\033[38;2;232;104;58m"

# ============================================================================
# Helper Functions
# ============================================================================

# Progress bar with custom characters: ▓ (filled) ░ (empty)
# Usage: progress_bar <percent> <width>
# Example: progress_bar 75 10 → "▓▓▓▓▓▓▓░░░"
progress_bar() {
  local pct="${1:-0}"
  local width="${2:-10}"

  # Validate and clamp percentage
  [[ "$pct" =~ ^[0-9]+$ ]] || pct=0
  ((pct < 0)) && pct=0
  ((pct > 100)) && pct=100

  local filled=$(( pct * width / 100 ))
  local empty=$(( width - filled ))

  # Build bar with custom characters
  local bar=""
  for ((i=0; i<filled; i++)); do bar+="▓"; done
  for ((i=0; i<empty; i++)); do bar+="░"; done

  echo "$bar"
}

# Convert ISO timestamp to epoch seconds (cross-platform)
to_epoch() {
  local ts="$1"
  # Try gdate first (macOS with coreutils)
  if command -v gdate >/dev/null 2>&1; then
    gdate -d "$ts" +%s 2>/dev/null && return
  fi
  # Try BSD date (macOS)
  date -u -j -f "%Y-%m-%dT%H:%M:%S%z" "${ts/Z/+0000}" +%s 2>/dev/null && return
  # Fallback to Python
  python3 - "$ts" <<'PY' 2>/dev/null
import sys, datetime
s=sys.argv[1].replace('Z','+00:00')
print(int(datetime.datetime.fromisoformat(s).timestamp()))
PY
}

# Format epoch to HH:MM
fmt_time_hm() {
  local epoch="$1"
  if date -r 0 +%s >/dev/null 2>&1; then
    date -r "$epoch" +"%H:%M"
  else
    date -d "@$epoch" +"%H:%M"
  fi
}

# ============================================================================
# Read Component Configuration
# ============================================================================
# Default: all components enabled
SHOW_AGILEFLOW=true
SHOW_MODEL=true
SHOW_STORY=true
SHOW_EPIC=true
SHOW_WIP=true
SHOW_CONTEXT=true
SHOW_CONTEXT_BAR=true
SHOW_SESSION_TIME=true
SHOW_COST=true
SHOW_GIT=true

# Check agileflow-metadata.json for component settings
if [ -f "docs/00-meta/agileflow-metadata.json" ]; then
  COMPONENTS=$(jq '.features.statusline.components // null' docs/00-meta/agileflow-metadata.json 2>/dev/null)
  if [ "$COMPONENTS" != "null" ] && [ -n "$COMPONENTS" ]; then
    # Use 'if . == null then true else . end' to properly handle false values
    # (jq's // operator treats false as falsy and applies the fallback)
    SHOW_AGILEFLOW=$(echo "$COMPONENTS" | jq -r '.agileflow | if . == null then true else . end')
    SHOW_MODEL=$(echo "$COMPONENTS" | jq -r '.model | if . == null then true else . end')
    SHOW_STORY=$(echo "$COMPONENTS" | jq -r '.story | if . == null then true else . end')
    SHOW_EPIC=$(echo "$COMPONENTS" | jq -r '.epic | if . == null then true else . end')
    SHOW_WIP=$(echo "$COMPONENTS" | jq -r '.wip | if . == null then true else . end')
    SHOW_CONTEXT=$(echo "$COMPONENTS" | jq -r '.context | if . == null then true else . end')
    SHOW_CONTEXT_BAR=$(echo "$COMPONENTS" | jq -r '.context_bar | if . == null then true else . end')
    SHOW_SESSION_TIME=$(echo "$COMPONENTS" | jq -r '.session_time | if . == null then true else . end')
    SHOW_COST=$(echo "$COMPONENTS" | jq -r '.cost | if . == null then true else . end')
    SHOW_GIT=$(echo "$COMPONENTS" | jq -r '.git | if . == null then true else . end')
  fi
fi

# ============================================================================
# AgileFlow Version & Update Check
# ============================================================================
AGILEFLOW_DISPLAY=""
if [ "$SHOW_AGILEFLOW" = "true" ]; then
  # Get local version from package.json or metadata
  LOCAL_VERSION=""
  if [ -f ".agileflow/package.json" ]; then
    LOCAL_VERSION=$(jq -r '.version // ""' .agileflow/package.json 2>/dev/null)
  elif [ -f "docs/00-meta/agileflow-metadata.json" ]; then
    LOCAL_VERSION=$(jq -r '.version // ""' docs/00-meta/agileflow-metadata.json 2>/dev/null)
  fi

  if [ -n "$LOCAL_VERSION" ] && [ "$LOCAL_VERSION" != "null" ]; then
    # Check for updates (cached for 1 hour to avoid rate limiting)
    UPDATE_CACHE="/tmp/agileflow-update-check"
    UPDATE_AVAILABLE=""
    LATEST_VERSION=""

    # Only check npm if cache is stale (older than 1 hour)
    if [ ! -f "$UPDATE_CACHE" ] || [ "$(find "$UPDATE_CACHE" -mmin +60 2>/dev/null)" ]; then
      # Quick npm check (timeout after 2 seconds)
      LATEST_VERSION=$(timeout 2 npm view agileflow version 2>/dev/null || echo "")
      if [ -n "$LATEST_VERSION" ]; then
        echo "$LATEST_VERSION" > "$UPDATE_CACHE"
      fi
    else
      LATEST_VERSION=$(cat "$UPDATE_CACHE" 2>/dev/null)
    fi

    # Compare versions
    if [ -n "$LATEST_VERSION" ] && [ "$LATEST_VERSION" != "$LOCAL_VERSION" ]; then
      # Simple version comparison (works for semver)
      if [ "$(printf '%s\n' "$LOCAL_VERSION" "$LATEST_VERSION" | sort -V | tail -n1)" = "$LATEST_VERSION" ] && [ "$LOCAL_VERSION" != "$LATEST_VERSION" ]; then
        UPDATE_AVAILABLE="$LATEST_VERSION"
      fi
    fi

    # Build display
    if [ -n "$UPDATE_AVAILABLE" ]; then
      AGILEFLOW_DISPLAY="${BRAND}agileflow${RESET} ${DIM}v${LOCAL_VERSION}${RESET} ${YELLOW}↑${UPDATE_AVAILABLE}${RESET}"
    else
      AGILEFLOW_DISPLAY="${BRAND}agileflow${RESET} ${DIM}v${LOCAL_VERSION}${RESET}"
    fi
  else
    AGILEFLOW_DISPLAY="${BRAND}agileflow${RESET}"
  fi
fi

# ============================================================================
# Parse Input JSON
# ============================================================================
input=$(cat)

# Parse model info
MODEL_DISPLAY=$(echo "$input" | jq -r '.model.display_name // "Claude"')

# Parse context usage
CONTEXT_SIZE=$(echo "$input" | jq -r '.context_window.context_window_size // 200000')
USAGE=$(echo "$input" | jq '.context_window.current_usage // null')

CTX_DISPLAY=""
CTX_BAR_DISPLAY=""
CTX_COLOR="$CTX_GREEN"
if [ "$USAGE" != "null" ]; then
  CURRENT_TOKENS=$(echo "$USAGE" | jq '.input_tokens + (.cache_creation_input_tokens // 0) + (.cache_read_input_tokens // 0)')
  if [ "$CURRENT_TOKENS" != "null" ] && [ "$CURRENT_TOKENS" -gt 0 ] 2>/dev/null; then
    PERCENT_USED=$((CURRENT_TOKENS * 100 / CONTEXT_SIZE))

    # Color based on usage level (using vibrant 256-color palette)
    if [ "$PERCENT_USED" -ge 80 ]; then
      CTX_COLOR="$CTX_RED"      # Coral red - critical
    elif [ "$PERCENT_USED" -ge 60 ]; then
      CTX_COLOR="$CTX_ORANGE"   # Peach - high usage
    elif [ "$PERCENT_USED" -ge 40 ]; then
      CTX_COLOR="$CTX_YELLOW"   # Peach - moderate
    else
      CTX_COLOR="$CTX_GREEN"    # Mint green - healthy
    fi

    CTX_DISPLAY="${CTX_COLOR}${PERCENT_USED}%${RESET}"

    # Generate progress bar (8 chars wide for compactness)
    CTX_BAR=$(progress_bar "$PERCENT_USED" 8)
    CTX_BAR_DISPLAY="${DIM}[${RESET}${CTX_COLOR}${CTX_BAR}${RESET}${DIM}]${RESET}"
  fi
fi

# Parse cost
TOTAL_COST=$(echo "$input" | jq -r '.cost.total_cost_usd // 0')
COST_DISPLAY=""
if [ "$TOTAL_COST" != "0" ] && [ "$TOTAL_COST" != "null" ]; then
  COST_CENTS=$(echo "$TOTAL_COST * 100" | bc 2>/dev/null | cut -d. -f1)
  if [ -n "$COST_CENTS" ] && [ "$COST_CENTS" -gt 100 ]; then
    # Over $1 - show in yellow
    COST_DISPLAY="${YELLOW}$(printf '$%.2f' "$TOTAL_COST")${RESET}"
  else
    COST_DISPLAY="${DIM}$(printf '$%.2f' "$TOTAL_COST")${RESET}"
  fi
fi

# ============================================================================
# Session Time Remaining (via ccusage if available)
# ============================================================================
SESSION_DISPLAY=""
if [ "$SHOW_SESSION_TIME" = "true" ]; then
  # Try to get session info from ccusage (fast cached check)
  if command -v npx >/dev/null 2>&1 && command -v jq >/dev/null 2>&1; then
    # Use timeout to prevent blocking - ccusage should be fast
    BLOCKS_OUTPUT=$(timeout 3 npx ccusage@latest blocks --json 2>/dev/null || true)

    if [ -n "$BLOCKS_OUTPUT" ]; then
      ACTIVE_BLOCK=$(echo "$BLOCKS_OUTPUT" | jq -c '.blocks[] | select(.isActive == true)' 2>/dev/null | head -n1)

      if [ -n "$ACTIVE_BLOCK" ]; then
        # Get reset time
        RESET_TIME_STR=$(echo "$ACTIVE_BLOCK" | jq -r '.usageLimitResetTime // .endTime // empty')
        START_TIME_STR=$(echo "$ACTIVE_BLOCK" | jq -r '.startTime // empty')

        if [ -n "$RESET_TIME_STR" ] && [ -n "$START_TIME_STR" ]; then
          START_SEC=$(to_epoch "$START_TIME_STR")
          END_SEC=$(to_epoch "$RESET_TIME_STR")
          NOW_SEC=$(date +%s)

          if [ -n "$START_SEC" ] && [ -n "$END_SEC" ] && [ "$START_SEC" -gt 0 ] && [ "$END_SEC" -gt 0 ]; then
            TOTAL=$(( END_SEC - START_SEC ))
            [ "$TOTAL" -lt 1 ] && TOTAL=1

            ELAPSED=$(( NOW_SEC - START_SEC ))
            [ "$ELAPSED" -lt 0 ] && ELAPSED=0
            [ "$ELAPSED" -gt "$TOTAL" ] && ELAPSED=$TOTAL

            SESSION_PCT=$(( ELAPSED * 100 / TOTAL ))
            REMAINING=$(( END_SEC - NOW_SEC ))
            [ "$REMAINING" -lt 0 ] && REMAINING=0

            # Format remaining time
            RH=$(( REMAINING / 3600 ))
            RM=$(( (REMAINING % 3600) / 60 ))

            # Color based on time remaining (using vibrant 256-color palette)
            if [ "$RH" -eq 0 ] && [ "$RM" -lt 30 ]; then
              SESSION_COLOR="$SESSION_RED"     # Light pink - critical
            elif [ "$RH" -eq 0 ]; then
              SESSION_COLOR="$SESSION_YELLOW"  # Light yellow - getting low
            else
              SESSION_COLOR="$SESSION_GREEN"   # Light green - plenty of time
            fi

            # Build compact display: "⏱2h15m" or "⏱45m"
            if [ "$RH" -gt 0 ]; then
              SESSION_DISPLAY="${SESSION_COLOR}⏱${RH}h${RM}m${RESET}"
            else
              SESSION_DISPLAY="${SESSION_COLOR}⏱${RM}m${RESET}"
            fi
          fi
        fi
      fi
    fi
  fi
fi

# ============================================================================
# AgileFlow Status - Read from status.json
# ============================================================================
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
      STORY_DISPLAY="${CYAN}${STORY_ID}${RESET}${DIM}:${RESET} ${STORY_TITLE}"
    fi

    # Get epic progress if we have an epic
    if [ -n "$EPIC_ID" ] && [ "$EPIC_ID" != "null" ]; then
      # Count total stories in this epic
      TOTAL_IN_EPIC=$(echo "$STATUS_JSON" | jq "[.stories | to_entries[] | select(.value.epic == \"$EPIC_ID\")] | length")
      # Count done stories in this epic
      DONE_IN_EPIC=$(echo "$STATUS_JSON" | jq "[.stories | to_entries[] | select(.value.epic == \"$EPIC_ID\" and .value.status == \"done\")] | length")

      if [ "$TOTAL_IN_EPIC" -gt 0 ] 2>/dev/null; then
        EPIC_PCT=$((DONE_IN_EPIC * 100 / TOTAL_IN_EPIC))

        # Color epic progress based on completion
        if [ "$EPIC_PCT" -ge 80 ]; then
          EPIC_COLOR="$GREEN"
        elif [ "$EPIC_PCT" -ge 50 ]; then
          EPIC_COLOR="$YELLOW"
        else
          EPIC_COLOR="$DIM"
        fi
        EPIC_DISPLAY="${MAGENTA}${EPIC_ID}${RESET} ${EPIC_COLOR}${DONE_IN_EPIC}/${TOTAL_IN_EPIC}${RESET}"
      fi
    fi
  else
    # No story in-progress - find next READY story (priority: high > medium > low)
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
      NEXT_PRIORITY=$(echo "$STATUS_JSON" | jq -r ".stories[\"$NEXT_ID\"].priority // \"\"")
      # Color based on priority
      case "$NEXT_PRIORITY" in
        high) PRIORITY_COLOR="$RED" ;;
        medium) PRIORITY_COLOR="$YELLOW" ;;
        *) PRIORITY_COLOR="$GREEN" ;;
      esac
      NEXT_STORY="${DIM}Next:${RESET} ${PRIORITY_COLOR}${NEXT_ID}${RESET}"
    fi
  fi

  # Calculate WIP count
  WIP_COUNT=$(echo "$STATUS_JSON" | jq '[.stories | to_entries[] | select(.value.status == "in-progress" or .value.status == "in-review")] | length')
  WIP_LIMIT=3  # Default WIP limit
  if [ -n "$WIP_COUNT" ] && [ "$WIP_COUNT" != "null" ] && [ "$WIP_COUNT" -gt 0 ] 2>/dev/null; then
    # Color WIP based on limit
    if [ "$WIP_COUNT" -gt "$WIP_LIMIT" ]; then
      WIP_COLOR="$RED"
    elif [ "$WIP_COUNT" -eq "$WIP_LIMIT" ]; then
      WIP_COLOR="$YELLOW"
    else
      WIP_COLOR="$GREEN"
    fi
    WIP_DISPLAY="${DIM}WIP${RESET} ${WIP_COLOR}${WIP_COUNT}${RESET}"
  fi
fi

# ============================================================================
# Git Branch with Colors
# ============================================================================
GIT_DISPLAY=""
if git rev-parse --git-dir > /dev/null 2>&1; then
  BRANCH=$(git branch --show-current 2>/dev/null)
  if [ -n "$BRANCH" ]; then
    # Color based on branch type
    case "$BRANCH" in
      main|master)
        GIT_COLOR="$GREEN"
        ;;
      develop|dev)
        GIT_COLOR="$BLUE"
        ;;
      feature/*|feat/*)
        GIT_COLOR="$CYAN"
        ;;
      fix/*|bugfix/*|hotfix/*)
        GIT_COLOR="$RED"
        ;;
      release/*)
        GIT_COLOR="$MAGENTA"
        ;;
      *)
        GIT_COLOR="$DIM"
        ;;
    esac

    # Truncate long branch names
    if [ ${#BRANCH} -gt 20 ]; then
      BRANCH="${BRANCH:0:17}..."
    fi
    GIT_DISPLAY="${GIT_COLOR}${BRANCH}${RESET}"
  fi
fi

# ============================================================================
# Build Status Line
# ============================================================================
OUTPUT=""

# Separator
SEP=" ${DIM}│${RESET} "

# AgileFlow branding (if enabled)
if [ "$SHOW_AGILEFLOW" = "true" ] && [ -n "$AGILEFLOW_DISPLAY" ]; then
  OUTPUT="${AGILEFLOW_DISPLAY}"
fi

# Model with subtle styling (if enabled)
if [ "$SHOW_MODEL" = "true" ]; then
  [ -n "$OUTPUT" ] && OUTPUT="${OUTPUT}${SEP}"
  OUTPUT="${OUTPUT}${DIM}[${RESET}${BOLD}${MODEL_DISPLAY}${RESET}${DIM}]${RESET}"
fi

# Add current story OR next story suggestion (if enabled)
if [ "$SHOW_STORY" = "true" ]; then
  if [ -n "$STORY_DISPLAY" ]; then
    [ -n "$OUTPUT" ] && OUTPUT="${OUTPUT}${SEP}"
    OUTPUT="${OUTPUT}${STORY_DISPLAY}"
  elif [ -n "$NEXT_STORY" ]; then
    [ -n "$OUTPUT" ] && OUTPUT="${OUTPUT}${SEP}"
    OUTPUT="${OUTPUT}${NEXT_STORY}"
  fi
fi

# Add epic progress (if enabled and working on a story in an epic)
if [ "$SHOW_EPIC" = "true" ] && [ -n "$EPIC_DISPLAY" ]; then
  [ -n "$OUTPUT" ] && OUTPUT="${OUTPUT}${SEP}"
  OUTPUT="${OUTPUT}${EPIC_DISPLAY}"
fi

# Add WIP count (if enabled)
if [ "$SHOW_WIP" = "true" ] && [ -n "$WIP_DISPLAY" ]; then
  [ -n "$OUTPUT" ] && OUTPUT="${OUTPUT}${SEP}"
  OUTPUT="${OUTPUT}${WIP_DISPLAY}"
fi

# Add context usage (if enabled) - percentage and/or bar
if [ "$SHOW_CONTEXT" = "true" ] && [ -n "$CTX_DISPLAY" ]; then
  [ -n "$OUTPUT" ] && OUTPUT="${OUTPUT}${SEP}"
  if [ "$SHOW_CONTEXT_BAR" = "true" ] && [ -n "$CTX_BAR_DISPLAY" ]; then
    # Show both percentage and bar: "45% [▓▓▓▓░░░░]"
    OUTPUT="${OUTPUT}${CTX_DISPLAY} ${CTX_BAR_DISPLAY}"
  else
    OUTPUT="${OUTPUT}${CTX_DISPLAY}"
  fi
fi

# Add session time remaining (if enabled and available)
if [ "$SHOW_SESSION_TIME" = "true" ] && [ -n "$SESSION_DISPLAY" ]; then
  [ -n "$OUTPUT" ] && OUTPUT="${OUTPUT}${SEP}"
  OUTPUT="${OUTPUT}${SESSION_DISPLAY}"
fi

# Add cost (if enabled)
if [ "$SHOW_COST" = "true" ] && [ -n "$COST_DISPLAY" ]; then
  [ -n "$OUTPUT" ] && OUTPUT="${OUTPUT}${SEP}"
  OUTPUT="${OUTPUT}${COST_DISPLAY}"
fi

# Add git branch (if enabled)
if [ "$SHOW_GIT" = "true" ] && [ -n "$GIT_DISPLAY" ]; then
  [ -n "$OUTPUT" ] && OUTPUT="${OUTPUT}${SEP}"
  OUTPUT="${OUTPUT}${GIT_DISPLAY}"
fi

echo -e "$OUTPUT"
