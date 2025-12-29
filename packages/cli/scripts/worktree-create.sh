#!/bin/bash
# AgileFlow Worktree Helper Script
# Creates a git worktree with proper naming and guidance

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if running in a git repository
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    echo -e "${RED}Error: Not in a git repository${NC}"
    exit 1
fi

# Check for feature name argument
if [ $# -eq 0 ]; then
    echo -e "${RED}Error: Feature name required${NC}"
    echo ""
    echo "Usage: $0 <feature-name> [base-branch]"
    echo ""
    echo "Examples:"
    echo "  $0 authentication"
    echo "  $0 payment-integration"
    echo "  $0 hotfix-memory-leak main"
    echo "  $0 experiment-graphql develop"
    echo ""
    exit 1
fi

FEATURE_NAME=$1
BASE_BRANCH=${2:-main}
BRANCH_NAME="feature/$FEATURE_NAME"
REPO_NAME=$(basename "$(git rev-parse --show-toplevel)")
WORKTREE_PATH="../${REPO_NAME}-${FEATURE_NAME}"

# Check if base branch exists
if ! git rev-parse --verify "$BASE_BRANCH" > /dev/null 2>&1; then
    echo -e "${RED}Error: Base branch '$BASE_BRANCH' does not exist${NC}"
    echo ""
    echo "Available branches:"
    git branch -a
    exit 1
fi

# Check if worktree path already exists
if [ -d "$WORKTREE_PATH" ]; then
    echo -e "${RED}Error: Directory already exists: $WORKTREE_PATH${NC}"
    echo ""
    echo "Options:"
    echo "  1. Remove existing directory: rm -rf $WORKTREE_PATH"
    echo "  2. Use different feature name"
    echo "  3. List existing worktrees: git worktree list"
    exit 1
fi

# Check if branch already exists
if git rev-parse --verify "$BRANCH_NAME" > /dev/null 2>&1; then
    echo -e "${YELLOW}Warning: Branch '$BRANCH_NAME' already exists${NC}"
    echo "Creating worktree from existing branch..."
    git worktree add "$WORKTREE_PATH" "$BRANCH_NAME"
else
    echo -e "${BLUE}Creating new branch '$BRANCH_NAME' from '$BASE_BRANCH'${NC}"
    git worktree add -b "$BRANCH_NAME" "$WORKTREE_PATH" "$BASE_BRANCH"
fi

echo ""
echo -e "${GREEN}✅ Worktree created successfully!${NC}"
echo ""
echo -e "${BLUE}📂 Location:${NC} $WORKTREE_PATH"
echo -e "${BLUE}🌿 Branch:${NC} $BRANCH_NAME"
echo -e "${BLUE}📌 Base:${NC} $BASE_BRANCH"
echo ""
echo -e "${GREEN}🤖 Next steps:${NC}"
echo "   1. Open in new editor window:"
echo -e "      ${YELLOW}code $WORKTREE_PATH${NC}"
echo ""
echo "   2. Navigate to worktree:"
echo -e "      ${YELLOW}cd $WORKTREE_PATH${NC}"
echo ""
echo "   3. Start AgileFlow babysit:"
echo -e "      ${YELLOW}/babysit${NC}"
echo ""
echo -e "${YELLOW}⚠️  Important Reminders:${NC}"
echo "   • Use this worktree for '$FEATURE_NAME' work only"
echo "   • Avoid concurrent edits to the same epic/stories across worktrees"
echo "   • Clean up when done: git worktree remove $WORKTREE_PATH"
echo ""
echo -e "${BLUE}📚 Documentation:${NC} docs/guides/worktrees.md"
echo ""
echo -e "${GREEN}Shared across worktrees:${NC}"
echo "   • Git history (commits, branches)"
echo "   • AgileFlow status.json and message bus"
echo "   • All docs/ files (ADRs, epics, stories)"
echo ""
echo -e "${BLUE}Independent in this worktree:${NC}"
echo "   • Working directory files (src/, etc.)"
echo "   • Dependencies (node_modules/, .venv/, etc.)"
echo "   • /babysit AI context"
echo ""

# List all worktrees
echo -e "${BLUE}📋 All active worktrees:${NC}"
git worktree list
echo ""

echo -e "${GREEN}Happy coding with preserved context! 🚀${NC}"
