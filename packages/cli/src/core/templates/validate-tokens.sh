#!/bin/bash

# AgileFlow Token Validation Script
# Safely checks if required MCP tokens are present in .env WITHOUT exposing them
# Security-first approach: shows token lengths, never displays actual values

echo "🔐 Token Validation (Secure Check - No Tokens Exposed)"
echo "========================================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
  echo "❌ .env file NOT found"
  echo ""
  echo "To create .env, copy from template:"
  echo "  cp .env.example .env"
  echo "Then edit .env and add your real tokens (DO NOT COMMIT)"
  exit 1
fi

echo "✅ .env file found"
echo ""

# Check GitHub token (secure - doesn't print value)
if grep -q "^GITHUB_PERSONAL_ACCESS_TOKEN=" .env && ! grep -q "GITHUB_PERSONAL_ACCESS_TOKEN=$" .env; then
  TOKEN_VALUE=$(grep "^GITHUB_PERSONAL_ACCESS_TOKEN=" .env | cut -d'=' -f2)
  if [ -z "$TOKEN_VALUE" ] || [ "$TOKEN_VALUE" = "your_token_here" ] || [ "$TOKEN_VALUE" = "ghp_placeholder" ]; then
    echo "⚠️  GITHUB_PERSONAL_ACCESS_TOKEN is set but appears to be placeholder"
    echo "    → Replace with real token (starts with ghp_)"
  else
    echo "✅ GITHUB_PERSONAL_ACCESS_TOKEN is set (length: ${#TOKEN_VALUE})"
  fi
else
  echo "⚠️  GITHUB_PERSONAL_ACCESS_TOKEN not found in .env"
fi

echo ""

# Check Notion token (secure - doesn't print value)
if grep -q "^NOTION_TOKEN=" .env && ! grep -q "NOTION_TOKEN=$" .env; then
  TOKEN_VALUE=$(grep "^NOTION_TOKEN=" .env | cut -d'=' -f2)
  if [ -z "$TOKEN_VALUE" ] || [ "$TOKEN_VALUE" = "your_token_here" ] || [[ "$TOKEN_VALUE" == *"placeholder"* ]]; then
    echo "⚠️  NOTION_TOKEN is set but appears to be placeholder"
    echo "    → Replace with real token (starts with ntn_ or secret_)"
  else
    echo "✅ NOTION_TOKEN is set (length: ${#TOKEN_VALUE})"
  fi
else
  echo "ℹ️  NOTION_TOKEN not found in .env (optional if Notion not enabled)"
fi

echo ""

# Check Context7 token (secure - doesn't print value)
if grep -q "^CONTEXT7_API_KEY=" .env && ! grep -q "CONTEXT7_API_KEY=$" .env; then
  TOKEN_VALUE=$(grep "^CONTEXT7_API_KEY=" .env | cut -d'=' -f2)
  if [ -z "$TOKEN_VALUE" ] || [ "$TOKEN_VALUE" = "your_key_here" ] || [[ "$TOKEN_VALUE" == *"placeholder"* ]]; then
    echo "⚠️  CONTEXT7_API_KEY is set but appears to be placeholder"
    echo "    → Replace with real key (optional for higher rate limits)"
  else
    echo "✅ CONTEXT7_API_KEY is set (length: ${#TOKEN_VALUE})"
  fi
else
  echo "ℹ️  CONTEXT7_API_KEY not found in .env (optional)"
fi

echo ""
echo "🔒 Security Check:"

# Check .gitignore for .mcp.json
if grep -q '^\\.mcp\\.json$' .gitignore 2>/dev/null; then
  echo "✅ .mcp.json is in .gitignore"
else
  echo "❌ .mcp.json NOT in .gitignore (CRITICAL - must exclude!)"
fi

# Check .gitignore for .env
if grep -q '^\\.env$' .gitignore 2>/dev/null; then
  echo "✅ .env is in .gitignore"
else
  echo "❌ .env NOT in .gitignore (CRITICAL - must exclude!)"
fi

echo ""
echo "If you added new tokens to .env, remember to:"
echo "  1. Verify .mcp.json and .env are in .gitignore (NEVER commit them!)"
echo "  2. 🔴 RESTART Claude Code for MCP servers to load new tokens"
echo "  3. Test MCP commands after restart"
