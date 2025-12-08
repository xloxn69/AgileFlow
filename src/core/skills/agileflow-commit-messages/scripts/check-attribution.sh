#!/bin/bash
# check-attribution.sh
# Determines if Claude Code attribution should be added to git commits
# Returns "yes" if attribution should be added, "no" if it should not

if [ -f CLAUDE.md ]; then
  if grep -q "DO NOT ADD AI ATTRIBUTION" CLAUDE.md; then
    echo "no"
  else
    echo "yes"
  fi
else
  # Default to adding attribution if no CLAUDE.md exists
  echo "yes"
fi
