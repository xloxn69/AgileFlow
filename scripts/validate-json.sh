#!/bin/bash
# validate-json.sh - Validates JSON files and provides helpful errors
# Usage: bash scripts/validate-json.sh <file_path>

FILE="$1"

if [ -z "$FILE" ]; then
  echo "Usage: bash scripts/validate-json.sh <file_path>"
  exit 1
fi

if [ ! -f "$FILE" ]; then
  echo "❌ File not found: $FILE"
  exit 1
fi

# Validate JSON using jq
if ! jq empty "$FILE" 2>/dev/null; then
  echo "❌ Invalid JSON in $FILE"
  echo ""
  echo "Error details:"
  jq . "$FILE" 2>&1 | head -5
  exit 1
fi

echo "✅ $FILE is valid JSON"
exit 0
