#!/bin/bash
# agileflow-stop.sh - Session wrap-up hook

# Only run if we're in a git repo
git rev-parse --git-dir > /dev/null 2>&1 || exit 0

# Check for uncommitted changes
CHANGES=$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')

if [ "$CHANGES" -gt 0 ]; then
  echo ""
  echo -e "\033[0;33m$CHANGES uncommitted change(s)\033[0m"
fi
