#!/bin/bash
# Compress Status.json Script
# Removes verbose fields from status.json, keeping only essential tracking metadata
# This prevents status.json from exceeding 25000 token limit
# Usage: bash scripts/compress-status.sh

set -euo pipefail

# Configuration
STATUS_FILE="docs/09-agents/status.json"
BACKUP_FILE="docs/09-agents/status.json.backup"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🗜️  AgileFlow Status Compression${NC}"
echo -e "   Purpose: Strip verbose fields from status.json"
echo -e "   Target: Keep only essential tracking metadata"
echo ""

# Check if status.json exists
if [ ! -f "$STATUS_FILE" ]; then
    echo -e "${RED}❌ Error: $STATUS_FILE not found${NC}"
    echo "   Run /AgileFlow:setup first to initialize the AgileFlow system"
    exit 1
fi

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo -e "${RED}❌ Error: jq is required but not installed${NC}"
    echo "   Install: sudo apt install jq (Linux) or brew install jq (macOS)"
    exit 1
fi

# Validate status.json before processing
if ! jq empty "$STATUS_FILE" 2>/dev/null; then
    echo -e "${RED}❌ ERROR: $STATUS_FILE is invalid JSON${NC}"
    exit 1
fi

# Get original file size
ORIGINAL_SIZE=$(du -h "$STATUS_FILE" | cut -f1)
ORIGINAL_LINES=$(wc -l < "$STATUS_FILE")

# Backup original
cp "$STATUS_FILE" "$BACKUP_FILE"
echo -e "${YELLOW}💾 Backup created: $BACKUP_FILE${NC}"
echo ""

# Read status.json
STATUS_JSON=$(cat "$STATUS_FILE")

# Count stories before
TOTAL_STORIES=$(echo "$STATUS_JSON" | jq '.stories | length')

echo -e "${BLUE}📊 Before Compression:${NC}"
echo "   Stories: $TOTAL_STORIES"
echo "   Size: $ORIGINAL_SIZE"
echo "   Lines: $ORIGINAL_LINES"
echo ""

# Compress stories: Keep ONLY essential tracking fields
# Remove: description, acceptanceCriteria, architectureContext, technicalNotes,
#         devAgentRecord, previousStoryInsights, testingStrategy, and any other verbose fields
COMPRESSED_STATUS=$(echo "$STATUS_JSON" | jq '
  .updated = "'$TIMESTAMP'" |
  .stories = (.stories | to_entries | map({
    key: .key,
    value: {
      story_id: .value.story_id,
      epic: .value.epic,
      title: .value.title,
      owner: .value.owner,
      status: .value.status,
      estimate: .value.estimate,
      created: .value.created,
      updated: .value.updated,
      completed_at: .value.completed_at,
      dependencies: .value.dependencies,
      branch: .value.branch,
      summary: .value.summary,
      last_update: .value.last_update,
      assigned_at: .value.assigned_at
    }
  }) | from_entries)
')

# Write compressed status.json
echo "$COMPRESSED_STATUS" | jq '.' > "$STATUS_FILE"

# Get new file size
NEW_SIZE=$(du -h "$STATUS_FILE" | cut -f1)
NEW_LINES=$(wc -l < "$STATUS_FILE")

# Calculate savings
ORIGINAL_BYTES=$(stat -f%z "$BACKUP_FILE" 2>/dev/null || stat -c%s "$BACKUP_FILE")
NEW_BYTES=$(stat -f%z "$STATUS_FILE" 2>/dev/null || stat -c%s "$STATUS_FILE")
SAVED_BYTES=$((ORIGINAL_BYTES - NEW_BYTES))
PERCENT_SAVED=$((SAVED_BYTES * 100 / ORIGINAL_BYTES))

echo -e "${GREEN}✅ Compression complete!${NC}"
echo ""
echo -e "${BLUE}📊 After Compression:${NC}"
echo "   Stories: $TOTAL_STORIES (unchanged)"
echo "   Size: $ORIGINAL_SIZE → $NEW_SIZE"
echo "   Lines: $ORIGINAL_LINES → $NEW_LINES"
echo "   Saved: ${PERCENT_SAVED}% ($(numfmt --to=iec-i --suffix=B $SAVED_BYTES 2>/dev/null || echo ${SAVED_BYTES}B))"
echo ""

echo -e "${BLUE}🗑️  Removed Fields (stored in story markdown files):${NC}"
echo "   • description"
echo "   • acceptanceCriteria"
echo "   • architectureContext"
echo "   • technicalNotes"
echo "   • testingStrategy"
echo "   • devAgentRecord"
echo "   • previousStoryInsights"
echo "   • And any other verbose fields"
echo ""

echo -e "${YELLOW}📝 Note: Full story details remain in docs/06-stories/ markdown files${NC}"
echo "   Agents should read story files for implementation details"
echo "   status.json is now a lightweight tracking index"
echo ""

# Verify new size is under 25000 tokens (rough estimate: 1 token ≈ 4 chars)
ESTIMATED_TOKENS=$((NEW_BYTES / 4))
if [ $ESTIMATED_TOKENS -lt 25000 ]; then
    echo -e "${GREEN}✅ Estimated tokens: ~$ESTIMATED_TOKENS (safely under 25000 limit)${NC}"
else
    echo -e "${YELLOW}⚠️  Estimated tokens: ~$ESTIMATED_TOKENS (still above 25000 limit)${NC}"
    echo "   Consider running archival with shorter threshold:"
    echo "   bash scripts/archive-completed-stories.sh 3"
fi
echo ""

echo -e "${BLUE}📋 Status Summary:${NC}"
echo "$COMPRESSED_STATUS" | jq -r '
  .stories | to_entries | map(.value) |
  group_by(.status) |
  map({status: .[0].status, count: length}) |
  .[] |
  "   \(.status): \(.count) stories"
'
echo ""

echo -e "${YELLOW}💾 To restore original: cp $BACKUP_FILE $STATUS_FILE${NC}"
