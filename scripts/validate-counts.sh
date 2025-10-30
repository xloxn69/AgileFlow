#!/bin/bash
# validate-counts.sh
# Validates that command/subagent/skill counts match across documentation files
# Run this before releasing new versions to catch count drift

set -e

echo "🔍 AgileFlow Count Validation"
echo ""

# Count actual files
COMMANDS_COUNT=$(ls commands/*.md 2>/dev/null | wc -l)
AGENTS_COUNT=$(ls agents/*.md 2>/dev/null | wc -l)
SKILLS_COUNT=$(ls skills/*/SKILL.md 2>/dev/null | wc -l)

echo "📊 Actual Counts:"
echo "   Commands: $COMMANDS_COUNT"
echo "   Subagents: $AGENTS_COUNT"
echo "   Skills: $SKILLS_COUNT"
echo ""

# Check marketplace.json
MARKETPLACE_FILE=".claude-plugin/marketplace.json"
if [ ! -f "$MARKETPLACE_FILE" ]; then
    echo "❌ ERROR: $MARKETPLACE_FILE not found"
    exit 1
fi

# Extract counts from marketplace description
MARKETPLACE_DESC=$(jq -r '.description' "$MARKETPLACE_FILE")
echo "📝 Marketplace Description:"
echo "   $MARKETPLACE_DESC"
echo ""

# Validate counts in marketplace.json
ERRORS=0

if ! echo "$MARKETPLACE_DESC" | grep -q "$COMMANDS_COUNT commands"; then
    echo "❌ ERROR: Marketplace shows wrong command count (expected: $COMMANDS_COUNT)"
    ERRORS=$((ERRORS + 1))
fi

if ! echo "$MARKETPLACE_DESC" | grep -q "$AGENTS_COUNT specialized subagents"; then
    echo "❌ ERROR: Marketplace shows wrong subagent count (expected: $AGENTS_COUNT)"
    ERRORS=$((ERRORS + 1))
fi

if ! echo "$MARKETPLACE_DESC" | grep -q "$SKILLS_COUNT auto-loaded skills"; then
    echo "❌ ERROR: Marketplace shows wrong skill count (expected: $SKILLS_COUNT)"
    ERRORS=$((ERRORS + 1))
fi

# Check README.md counts
README_FILE="README.md"
if [ ! -f "$README_FILE" ]; then
    echo "❌ ERROR: $README_FILE not found"
    exit 1
fi

# Check for count mentions in README
if ! grep -q "$COMMANDS_COUNT slash commands" "$README_FILE"; then
    echo "⚠️  WARNING: README.md may have incorrect command count"
    ERRORS=$((ERRORS + 1))
fi

if ! grep -q "$AGENTS_COUNT specialized subagents" "$README_FILE"; then
    echo "⚠️  WARNING: README.md may have incorrect subagent count"
    ERRORS=$((ERRORS + 1))
fi

# Summary
echo ""
if [ $ERRORS -eq 0 ]; then
    echo "✅ All counts are consistent!"
    echo ""
    echo "📋 Summary:"
    echo "   ✅ Commands: $COMMANDS_COUNT"
    echo "   ✅ Subagents: $AGENTS_COUNT"
    echo "   ✅ Skills: $SKILLS_COUNT"
    echo ""
    echo "✅ Validation passed - ready to release!"
    exit 0
else
    echo "❌ Found $ERRORS inconsistencies"
    echo ""
    echo "🔧 To fix:"
    echo "   1. Update .claude-plugin/marketplace.json description"
    echo "   2. Update README.md mentions of counts"
    echo "   3. Update CLAUDE.md Repository Overview section"
    echo "   4. Re-run this script to verify"
    exit 1
fi
