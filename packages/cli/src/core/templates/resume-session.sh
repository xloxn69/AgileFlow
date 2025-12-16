#!/bin/bash
# AgileFlow Session Resume Script
# This script is called by the SessionStart hook to automatically resume sessions.
# It replicates the functionality of /AgileFlow:session:resume as a shell script.

set -e

echo "🔄 Resuming AgileFlow Session..."
echo ""

# Load environment configuration
if [ ! -f "docs/00-meta/environment.json" ]; then
  echo "⚠️  Session harness not initialized"
  echo "   Run /AgileFlow:session:init to set up session management"
  exit 0
fi

# Extract configuration
TEST_COMMAND=$(jq -r '.test_command // "echo \"No test command configured\""' docs/00-meta/environment.json 2>/dev/null)
INIT_SCRIPT=$(jq -r '.init_script // "./docs/00-meta/init.sh"' docs/00-meta/environment.json 2>/dev/null)
VERIFICATION_POLICY=$(jq -r '.verification_policy // "warn"' docs/00-meta/environment.json 2>/dev/null)

# Step 1: Run initialization script
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 Running Initialization Script..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ -f "$INIT_SCRIPT" ] && [ -x "$INIT_SCRIPT" ]; then
  if bash "$INIT_SCRIPT"; then
    echo ""
    echo "✅ Initialization complete"
  else
    echo ""
    echo "⚠️  Initialization script failed (exit code $?)"
    echo "   Continuing with test verification..."
  fi
else
  echo "⚠️  Init script not found or not executable: $INIT_SCRIPT"
  echo "   Skipping initialization"
fi

echo ""

# Step 2: Run test verification
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧪 Running Test Verification..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Command: $TEST_COMMAND"
echo ""

START_TIME=$(date +%s)

if eval "$TEST_COMMAND"; then
  END_TIME=$(date +%s)
  DURATION=$((END_TIME - START_TIME))
  echo ""
  echo "✅ Tests passing (${DURATION}s)"
  TEST_STATUS="passing"
else
  END_TIME=$(date +%s)
  DURATION=$((END_TIME - START_TIME))
  EXIT_CODE=$?
  echo ""
  echo "⚠️  Tests failing (exit code $EXIT_CODE, ${DURATION}s)"
  TEST_STATUS="failing"

  if [ "$VERIFICATION_POLICY" = "block" ]; then
    echo ""
    echo "❌ Verification policy: block"
    echo "   Cannot proceed with failing tests"
    exit 1
  else
    echo ""
    echo "⚠️  Verification policy: warn"
    echo "   You can proceed, but tests are failing"
  fi
fi

echo ""

# Step 3: Load session context
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Session Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Get baseline info
BASELINE_COMMIT=$(jq -r '.baseline_commit // "Not established"' docs/00-meta/environment.json 2>/dev/null)
BASELINE_DATE=$(jq -r '.baseline_established // "N/A"' docs/00-meta/environment.json 2>/dev/null)

# Get current session info
if [ -f "docs/09-agents/session-state.json" ]; then
  CURRENT_STORY=$(jq -r '.current_session.current_story // "None"' docs/09-agents/session-state.json 2>/dev/null)
  ACTIVE_AGENT=$(jq -r '.current_session.active_agent // "None"' docs/09-agents/session-state.json 2>/dev/null)
else
  CURRENT_STORY="None"
  ACTIVE_AGENT="None"
fi

# Display summary
echo "Baseline: ${BASELINE_COMMIT:0:7} ($BASELINE_DATE)"
echo "Status: $TEST_STATUS"
echo "Active Story: $CURRENT_STORY"
echo "Active Agent: $ACTIVE_AGENT"

# Get recent commits
echo ""
echo "Recent Activity:"
if git log --oneline -3 2>/dev/null; then
  :
else
  echo "  (Git history unavailable)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Session Resumed - Ready to work! 🚀"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
