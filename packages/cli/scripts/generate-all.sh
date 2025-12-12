#!/bin/bash

###############################################################################
# AgileFlow Content Generation Script
#
# Regenerates all dynamic content in AgileFlow plugin files.
# Run this after:
# - Adding/removing/renaming commands
# - Adding/removing/renaming agents
# - Adding/removing/renaming skills
# - Changing command/agent/skill descriptions or metadata
#
# Usage:
#   bash scripts/generate-all.sh
#   npm run generate  (if added to package.json)
###############################################################################

set -e  # Exit on error

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GENERATORS_DIR="$SCRIPT_DIR/generators"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}============================================================${NC}"
echo -e "${BLUE}  AgileFlow Content Generation System${NC}"
echo -e "${BLUE}============================================================${NC}"
echo ""

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Error: Node.js is not installed or not in PATH${NC}"
    exit 1
fi

# Check if generators directory exists
if [ ! -d "$GENERATORS_DIR" ]; then
    echo -e "${RED}❌ Error: Generators directory not found: $GENERATORS_DIR${NC}"
    exit 1
fi

# Run the orchestrator
echo -e "${YELLOW}Running content generators...${NC}"
echo ""

cd "$GENERATORS_DIR"
node index.js

EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
    echo ""
    echo -e "${GREEN}============================================================${NC}"
    echo -e "${GREEN}✅ Content generation completed successfully!${NC}"
    echo -e "${GREEN}============================================================${NC}"
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo "1. Review the changes: git diff"
    echo "2. Test the plugin to ensure everything works"
    echo "3. Commit the generated content: git add -A && git commit -m 'chore: regenerate plugin content'"
    echo ""
else
    echo ""
    echo -e "${RED}============================================================${NC}"
    echo -e "${RED}❌ Content generation failed${NC}"
    echo -e "${RED}============================================================${NC}"
    echo ""
    echo -e "${YELLOW}Please check the errors above and fix any issues.${NC}"
    echo ""
    exit 1
fi
