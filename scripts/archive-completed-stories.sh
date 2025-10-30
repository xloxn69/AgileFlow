#!/bin/bash
# Archive Completed Stories Script
# Moves completed stories older than threshold from status.json to status-archive.json
# Usage: bash scripts/archive-completed-stories.sh [DAYS_THRESHOLD]
# If DAYS_THRESHOLD not provided, reads from docs/00-meta/agileflow-metadata.json

set -euo pipefail

# Configuration
METADATA_FILE="docs/00-meta/agileflow-metadata.json"
STATUS_FILE="docs/09-agents/status.json"
ARCHIVE_FILE="docs/09-agents/status-archive.json"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Determine threshold: CLI arg > metadata file > default 30
if [ -n "${1:-}" ]; then
  DAYS_THRESHOLD="$1"
elif [ -f "$METADATA_FILE" ] && command -v jq &> /dev/null; then
  DAYS_THRESHOLD=$(jq -r '.archival.threshold_days // 30' "$METADATA_FILE" 2>/dev/null || echo "30")
else
  DAYS_THRESHOLD=30
fi

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Validate status.json before processing (CRITICAL)
if ! jq empty "$STATUS_FILE" 2>/dev/null; then
    echo -e "${RED}❌ ERROR: $STATUS_FILE is invalid JSON${NC}"
    echo ""
    echo -e "${YELLOW}To diagnose the issue, run:${NC}"
    echo "   jq . $STATUS_FILE"
    echo ""
    echo -e "${YELLOW}To fix manually:${NC}"
    echo "   1. Open $STATUS_FILE in a text editor"
    echo "   2. Look for syntax errors (unescaped quotes, missing commas, etc.)"
    echo "   3. Fix the JSON syntax"
    echo "   4. Validate: jq empty $STATUS_FILE"
    echo ""
    echo -e "${YELLOW}Or use the validation helper:${NC}"
    echo "   bash scripts/validate-json.sh $STATUS_FILE"
    exit 1
fi

# Calculate cutoff date (stories completed before this date will be archived)
CUTOFF_DATE=$(date -u -d "$DAYS_THRESHOLD days ago" +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || date -u -v-${DAYS_THRESHOLD}d +"%Y-%m-%dT%H:%M:%SZ")

echo -e "${BLUE}📦 AgileFlow Story Archival${NC}"
echo -e "   Threshold: $DAYS_THRESHOLD days"
echo -e "   Cutoff Date: $CUTOFF_DATE"
echo ""

# Read status.json
STATUS_JSON=$(cat "$STATUS_FILE")

# Extract stories
STORIES=$(echo "$STATUS_JSON" | jq '.stories // {}')

# Initialize archive if it doesn't exist
if [ ! -f "$ARCHIVE_FILE" ]; then
    echo '{
  "archived": "'$TIMESTAMP'",
  "stories": {}
}' > "$ARCHIVE_FILE"
    echo -e "${GREEN}✅ Created new archive: $ARCHIVE_FILE${NC}"
fi

ARCHIVE_JSON=$(cat "$ARCHIVE_FILE")

# Count stories
TOTAL_STORIES=$(echo "$STORIES" | jq 'length')
echo -e "📊 Current status.json: $TOTAL_STORIES stories"

# Find stories to archive (status=done AND completed_at < cutoff)
STORIES_TO_ARCHIVE=$(echo "$STORIES" | jq --arg cutoff "$CUTOFF_DATE" '
  to_entries |
  map(select(
    .value.status == "done" and
    (.value.completed_at // .value.updated // "9999-12-31T00:00:00Z") < $cutoff
  )) |
  from_entries
')

ARCHIVE_COUNT=$(echo "$STORIES_TO_ARCHIVE" | jq 'length')

if [ "$ARCHIVE_COUNT" -eq 0 ]; then
    echo -e "${GREEN}✅ No stories to archive (all completed stories are within $DAYS_THRESHOLD days)${NC}"
    echo ""
    echo -e "${BLUE}📊 Status Summary:${NC}"
    echo "$STORIES" | jq -r '
      group_by(.status) |
      map({status: .[0].status, count: length}) |
      .[] |
      "   \(.status): \(.count) stories"
    '
    exit 0
fi

echo -e "${YELLOW}📦 Archiving $ARCHIVE_COUNT completed stories older than $DAYS_THRESHOLD days...${NC}"

# Show stories being archived
echo ""
echo -e "${BLUE}Stories to archive:${NC}"
echo "$STORIES_TO_ARCHIVE" | jq -r '
  to_entries |
  .[] |
  "   • \(.key): \(.value.title) (completed: \(.value.completed_at // .value.updated // "unknown"))"
' | head -20

if [ "$ARCHIVE_COUNT" -gt 20 ]; then
    echo "   ... and $(($ARCHIVE_COUNT - 20)) more"
fi
echo ""

# Merge stories to archive into archive file
UPDATED_ARCHIVE=$(echo "$ARCHIVE_JSON" | jq --argjson new_stories "$STORIES_TO_ARCHIVE" '
  .archived = "'$TIMESTAMP'" |
  .stories = (.stories + $new_stories)
')

# Remove archived stories from status.json
UPDATED_STATUS=$(echo "$STATUS_JSON" | jq --argjson archived "$STORIES_TO_ARCHIVE" '
  .updated = "'$TIMESTAMP'" |
  .stories = (.stories | to_entries | map(select(.key as $k | ($archived | has($k) | not))) | from_entries)
')

# Backup original files
cp "$STATUS_FILE" "${STATUS_FILE}.backup"
cp "$ARCHIVE_FILE" "${ARCHIVE_FILE}.backup" 2>/dev/null || true

# Write updated files
echo "$UPDATED_STATUS" | jq '.' > "$STATUS_FILE"
echo "$UPDATED_ARCHIVE" | jq '.' > "$ARCHIVE_FILE"

# Calculate new counts
NEW_STATUS_COUNT=$(echo "$UPDATED_STATUS" | jq '.stories | length')
NEW_ARCHIVE_COUNT=$(echo "$UPDATED_ARCHIVE" | jq '.stories | length')

# Calculate file sizes
STATUS_SIZE=$(du -h "$STATUS_FILE" | cut -f1)
ARCHIVE_SIZE=$(du -h "$ARCHIVE_FILE" | cut -f1)

echo -e "${GREEN}✅ Archival complete!${NC}"
echo ""
echo -e "${BLUE}📊 Results:${NC}"
echo "   status.json: $TOTAL_STORIES → $NEW_STATUS_COUNT stories ($STATUS_SIZE)"
echo "   status-archive.json: $NEW_ARCHIVE_COUNT stories total ($ARCHIVE_SIZE)"
echo "   Archived: $ARCHIVE_COUNT stories"
echo ""
echo -e "${BLUE}📋 Active Status Summary:${NC}"
echo "$UPDATED_STATUS" | jq -r '
  .stories |
  group_by(.status) |
  map({status: .[0].status, count: length}) |
  .[] |
  "   \(.status): \(.count) stories"
'
echo ""
echo -e "${YELLOW}💾 Backups created:${NC}"
echo "   ${STATUS_FILE}.backup"
echo "   ${ARCHIVE_FILE}.backup (if existed)"
echo ""
echo -e "${GREEN}✅ Agents will now work with smaller, faster status.json${NC}"
