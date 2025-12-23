#!/bin/bash

# compress-status.sh
# Removes verbose fields from status.json to reduce file size
# Keeps only essential tracking metadata

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default paths (relative to project root)
DOCS_DIR="docs"
STATUS_FILE="$DOCS_DIR/09-agents/status.json"

# Find project root (directory containing .agileflow)
PROJECT_ROOT="$(pwd)"
while [[ ! -d "$PROJECT_ROOT/.agileflow" ]] && [[ "$PROJECT_ROOT" != "/" ]]; do
  PROJECT_ROOT="$(dirname "$PROJECT_ROOT")"
done

if [[ "$PROJECT_ROOT" == "/" ]]; then
  echo -e "${RED}Error: Not in an AgileFlow project (no .agileflow directory found)${NC}"
  exit 1
fi

# Update paths to absolute
STATUS_FILE="$PROJECT_ROOT/$STATUS_FILE"

# Check if status.json exists
if [[ ! -f "$STATUS_FILE" ]]; then
  echo -e "${YELLOW}No status.json found at $STATUS_FILE${NC}"
  exit 0
fi

echo -e "${BLUE}Compressing status.json...${NC}"

# Get original size
ORIGINAL_SIZE=$(wc -c < "$STATUS_FILE")

# Compress using Node.js
if command -v node &> /dev/null; then
  STATUS_FILE="$STATUS_FILE" node <<'EOF'
const fs = require('fs');

const statusFile = process.env.STATUS_FILE;

// Read status.json
const status = JSON.parse(fs.readFileSync(statusFile, 'utf8'));
const stories = status.stories || {};

// Fields to keep (essential tracking metadata only)
const KEEP_FIELDS = [
  'id',
  'title',
  'status',
  'owner',
  'created_at',
  'updated_at',
  'completed_at',
  'epic',
  'dependencies',
  'blocked_by',
  'blocks',
  'pr_url',
  'test_status',
  'priority',
  'tags'
];

// Compress each story
let removedFields = 0;
const compressed = {};

for (const [storyId, story] of Object.entries(stories)) {
  compressed[storyId] = {};

  for (const field of KEEP_FIELDS) {
    if (story[field] !== undefined) {
      compressed[storyId][field] = story[field];
    }
  }

  const originalFieldCount = Object.keys(story).length;
  const compressedFieldCount = Object.keys(compressed[storyId]).length;
  removedFields += (originalFieldCount - compressedFieldCount);
}

// Update status.json
status.stories = compressed;
status.updated = new Date().toISOString();
fs.writeFileSync(statusFile, JSON.stringify(status, null, 2));

console.log(`\x1b[32m✓ Removed ${removedFields} verbose fields\x1b[0m`);
console.log(`\x1b[34mStories processed: ${Object.keys(compressed).length}\x1b[0m`);
EOF

  # Get new size
  NEW_SIZE=$(wc -c < "$STATUS_FILE")
  SAVED=$((ORIGINAL_SIZE - NEW_SIZE))
  PERCENT=$((SAVED * 100 / ORIGINAL_SIZE))

  echo -e "${GREEN}Compression complete!${NC}"
  echo -e "${BLUE}Original size: ${ORIGINAL_SIZE} bytes${NC}"
  echo -e "${BLUE}New size: ${NEW_SIZE} bytes${NC}"
  echo -e "${BLUE}Saved: ${SAVED} bytes (${PERCENT}%)${NC}"
else
  echo -e "${RED}Error: Node.js not found. Cannot compress status.json.${NC}"
  exit 1
fi

exit 0
