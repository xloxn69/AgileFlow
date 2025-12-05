#!/bin/bash
# validate-setup.sh - Validate and ensure complete AgileFlow directory structure
# Part of AgileFlow v2.22.2+
# Usage: bash scripts/validate-setup.sh

set -e

echo "📋 AgileFlow Setup Validation"
echo "=============================="
echo ""

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
MISSING_DIRS=0
CREATED_DIRS=0
EXISTING_DIRS=0

# Define all required directories
REQUIRED_DIRS=(
  "docs"
  "docs/00-meta"
  "docs/00-meta/templates"
  "docs/00-meta/guides"
  "docs/00-meta/scripts"
  "docs/01-brainstorming"
  "docs/01-brainstorming/ideas"
  "docs/01-brainstorming/sketches"
  "docs/02-practices"
  "docs/02-practices/prompts"
  "docs/02-practices/prompts/agents"
  "docs/03-decisions"
  "docs/04-architecture"
  "docs/05-epics"
  "docs/06-stories"
  "docs/07-testing"
  "docs/07-testing/acceptance"
  "docs/07-testing/test-cases"
  "docs/08-project"
  "docs/09-agents"
  "docs/09-agents/bus"
  "docs/10-research"
  ".github"
  ".github/workflows"
  ".claude"
  "scripts"
)

# Define critical files that should exist (check only)
CRITICAL_FILES=(
  "docs/09-agents/status.json"
  "docs/00-meta/agileflow-metadata.json"
  ".gitignore"
)

echo "🔍 Checking directory structure..."
echo ""

# Check and create directories
for dir in "${REQUIRED_DIRS[@]}"; do
  if [ -d "$dir" ]; then
    echo -e "${GREEN}✅${NC} $dir"
    ((EXISTING_DIRS++))
  else
    echo -e "${RED}❌${NC} $dir (missing)"
    ((MISSING_DIRS++))

    # Create the directory
    mkdir -p "$dir"
    if [ -d "$dir" ]; then
      echo -e "${BLUE}  └─ Created${NC}"
      ((CREATED_DIRS++))
    else
      echo -e "${RED}  └─ Failed to create${NC}"
    fi
  fi
done

echo ""
echo "🔍 Checking critical files..."
echo ""

# Check critical files (don't create, just report)
MISSING_FILES=0
for file in "${CRITICAL_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo -e "${GREEN}✅${NC} $file"
  else
    echo -e "${YELLOW}⚠️${NC} $file (missing - will be created by setup)"
    ((MISSING_FILES++))
  fi
done

echo ""
echo "📊 Validation Summary"
echo "===================="
echo ""
echo -e "Directories:"
echo -e "  ${GREEN}✅ Existing: $EXISTING_DIRS${NC}"
echo -e "  ${BLUE}🆕 Created: $CREATED_DIRS${NC}"
echo -e "  ${RED}❌ Missing (before): $MISSING_DIRS${NC}"
echo ""

if [ $MISSING_FILES -gt 0 ]; then
  echo -e "Critical Files:"
  echo -e "  ${YELLOW}⚠️ Missing: $MISSING_FILES${NC}"
  echo -e "  ${BLUE}ℹ️  These will be created when you run /AgileFlow:setup${NC}"
  echo ""
fi

# Final status
if [ $CREATED_DIRS -gt 0 ]; then
  echo -e "${GREEN}✅ Validation complete! Created $CREATED_DIRS missing directories.${NC}"
elif [ $MISSING_FILES -gt 0 ]; then
  echo -e "${YELLOW}⚠️ Directory structure is complete, but some critical files are missing.${NC}"
  echo -e "${BLUE}ℹ️  Run /AgileFlow:setup to create them.${NC}"
else
  echo -e "${GREEN}✅ All directories and critical files exist! Setup is complete.${NC}"
fi

echo ""
echo "💡 Tips:"
echo "  - Run this script anytime to verify your AgileFlow setup"
echo "  - Safe to run multiple times (idempotent)"
echo "  - Run /AgileFlow:setup for full setup with all files"
echo ""

exit 0
