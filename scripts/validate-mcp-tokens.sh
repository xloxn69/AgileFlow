#!/bin/bash
# MCP Token Validation Script
# Securely validates that MCP tokens are present in .env without exposing them
# Usage: bash scripts/validate-mcp-tokens.sh

echo "🔐 MCP Token Validation (Secure Check - No Tokens Exposed)"
echo "============================================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
  echo "❌ .env file NOT found"
  echo ""
  echo "To create .env, copy from template:"
  echo "  cp .env.example .env"
  echo "Then edit .env and add your real tokens (DO NOT COMMIT)"
  echo ""
  exit 1
fi

echo "✅ .env file found"
echo ""

# Check GitHub token (secure - doesn't print value)
if grep -q "^GITHUB_PERSONAL_ACCESS_TOKEN=" .env && ! grep -q "GITHUB_PERSONAL_ACCESS_TOKEN=$" .env; then
  TOKEN_VALUE=$(grep "^GITHUB_PERSONAL_ACCESS_TOKEN=" .env | cut -d'=' -f2)
  if [ -z "$TOKEN_VALUE" ] || [ "$TOKEN_VALUE" = "your_token_here" ] || [ "$TOKEN_VALUE" = "ghp_placeholder" ] || [[ "$TOKEN_VALUE" == *"ghp_your"* ]]; then
    echo "⚠️  GITHUB_PERSONAL_ACCESS_TOKEN is set but appears to be placeholder"
    echo "    → Replace with real token (starts with ghp_)"
  else
    echo "✅ GITHUB_PERSONAL_ACCESS_TOKEN is set (length: ${#TOKEN_VALUE})"
  fi
else
  echo "ℹ️  GITHUB_PERSONAL_ACCESS_TOKEN not found in .env (optional if GitHub MCP not enabled)"
fi

echo ""

# Check Notion token (secure - doesn't print value)
if grep -q "^NOTION_TOKEN=" .env && ! grep -q "NOTION_TOKEN=$" .env; then
  TOKEN_VALUE=$(grep "^NOTION_TOKEN=" .env | cut -d'=' -f2)
  if [ -z "$TOKEN_VALUE" ] || [ "$TOKEN_VALUE" = "your_token_here" ] || [[ "$TOKEN_VALUE" == *"placeholder"* ]] || [[ "$TOKEN_VALUE" == *"ntn_your"* ]]; then
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
  echo "ℹ️  CONTEXT7_API_KEY not found in .env (optional - Context7 works without it)"
fi

echo ""
echo "🔒 Security Check:"

# Check .gitignore protection
GITIGNORE_MCP="NO"
GITIGNORE_ENV="NO"

if [ -f .gitignore ]; then
  grep -q '^\\.mcp\\.json$' .gitignore && GITIGNORE_MCP="YES"
  grep -q '^\\.env$' .gitignore && GITIGNORE_ENV="YES"
fi

echo "  .mcp.json is in .gitignore: $GITIGNORE_MCP"
echo "  .env is in .gitignore: $GITIGNORE_ENV"

if [ "$GITIGNORE_MCP" = "NO" ] || [ "$GITIGNORE_ENV" = "NO" ]; then
  echo ""
  echo "⚠️  SECURITY WARNING: Secrets not protected by .gitignore!"
  echo ""
  if [ "$GITIGNORE_MCP" = "NO" ]; then
    echo "  Add to .gitignore: echo '.mcp.json' >> .gitignore"
  fi
  if [ "$GITIGNORE_ENV" = "NO" ]; then
    echo "  Add to .gitignore: echo '.env' >> .gitignore"
  fi
fi

echo ""
echo "🛠️  Infrastructure Check:"

# Check if wrapper script exists
if [ -f scripts/mcp-wrappers/load-env.sh ]; then
  echo "  ✅ Wrapper script exists (scripts/mcp-wrappers/load-env.sh)"

  # Check if executable
  if [ -x scripts/mcp-wrappers/load-env.sh ]; then
    echo "  ✅ Wrapper script is executable"
  else
    echo "  ⚠️  Wrapper script is NOT executable"
    echo "     Fix: chmod +x scripts/mcp-wrappers/load-env.sh"
  fi
else
  echo "  ❌ Wrapper script NOT found (scripts/mcp-wrappers/load-env.sh)"
  echo "     Run /AgileFlow:setup to create it"
fi

# Check if .mcp.json exists
if [ -f .mcp.json ]; then
  echo "  ✅ .mcp.json exists"

  # Check if using wrapper approach
  if grep -q "scripts/mcp-wrappers/load-env.sh" .mcp.json; then
    echo "  ✅ .mcp.json uses wrapper approach"
  else
    echo "  ⚠️  .mcp.json may not be using wrapper approach"
    echo "     Check if 'command': 'bash' and 'args' includes load-env.sh"
  fi
else
  echo "  ℹ️  .mcp.json not found (run /AgileFlow:setup to create)"
fi

echo ""
echo "📋 Next Steps:"
echo ""

# Determine if tokens are missing
HAS_ISSUES=false

if [ ! -f .env ]; then
  HAS_ISSUES=true
fi

if [ -f .env ]; then
  if grep -q "your_token_here\|placeholder\|ghp_your\|ntn_your" .env 2>/dev/null; then
    HAS_ISSUES=true
  fi
fi

if [ "$GITIGNORE_MCP" = "NO" ] || [ "$GITIGNORE_ENV" = "NO" ]; then
  HAS_ISSUES=true
fi

if [ "$HAS_ISSUES" = true ]; then
  echo "⚠️  Issues detected. To fix:"
  echo ""
  echo "1. Copy template: cp .env.example .env"
  echo "2. Edit .env and replace placeholders with real tokens"
  echo "3. Add secrets to .gitignore (run /AgileFlow:setup to auto-fix)"
  echo "4. NEVER commit .env or .mcp.json to git"
  echo "5. 🔴 RESTART CLAUDE CODE after updating .env"
  echo ""
else
  echo "✅ All checks passed!"
  echo ""
  echo "If MCP servers still aren't working:"
  echo "1. 🔴 RESTART CLAUDE CODE (MCP servers only load on startup)"
  echo "2. Wait 5-10 seconds after restart for MCP servers to initialize"
  echo "3. Check Claude Code startup logs for MCP errors"
  echo ""
fi
