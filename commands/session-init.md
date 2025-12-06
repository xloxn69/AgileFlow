---
description: Initialize session harness with test verification
argument-hint: (no arguments)
---

# Session Harness Initialization

You are running the `/AgileFlow:session-init` command to set up test verification and session management for the AgileFlow project.

## Command Purpose

First-time setup of the **Session Harness System**. Detects project configuration, creates environment files, runs initial test verification, and optionally configures automatic session resumption.

## Prerequisites

- AgileFlow must be initialized (`/AgileFlow:setup` must have been run)
- Project must have a test suite configured
- Must be in project root directory

## Execution Flow

### 1. Pre-flight Checks

```bash
# Verify AgileFlow is initialized
if [ ! -f "docs/09-agents/status.json" ]; then
  echo "❌ AgileFlow not initialized"
  echo ""
  echo "Run /AgileFlow:setup first to create the docs structure"
  exit 1
fi

# Verify not already initialized
if [ -f "docs/00-meta/environment.json" ]; then
  echo "⚠️  Session harness already initialized"
  echo ""
  echo "Found existing docs/00-meta/environment.json"
  echo ""
  echo "Options:"
  echo "  1. Continue (overwrite existing configuration)"
  echo "  2. Skip initialization"
  echo ""
  read -p "Choice [1/2]: " choice

  if [ "$choice" != "1" ]; then
    echo "Skipping initialization"
    exit 0
  fi
fi
```

### 2. Project Type Detection

Auto-detect project type and test framework:

**Node.js Detection:**
```bash
if [ -f "package.json" ]; then
  PROJECT_TYPE="nodejs"

  # Detect test command from package.json
  if grep -q '"test":' package.json; then
    TEST_COMMAND=$(jq -r '.scripts.test // "npm test"' package.json)
  else
    TEST_COMMAND="npm test"
  fi

  # Detect dev server
  if grep -q '"dev":' package.json; then
    DEV_COMMAND=$(jq -r '.scripts.dev // "npm run dev"' package.json)
  fi
fi
```

**Python Detection:**
```bash
if [ -f "requirements.txt" ] || [ -f "pyproject.toml" ] || [ -f "setup.py" ]; then
  PROJECT_TYPE="python"

  # Detect test framework
  if grep -q pytest requirements.txt 2>/dev/null; then
    TEST_COMMAND="pytest"
  elif grep -q unittest requirements.txt 2>/dev/null; then
    TEST_COMMAND="python -m unittest discover"
  else
    TEST_COMMAND="pytest"
  fi
fi
```

**Rust Detection:**
```bash
if [ -f "Cargo.toml" ]; then
  PROJECT_TYPE="rust"
  TEST_COMMAND="cargo test"
  DEV_COMMAND="cargo run"
fi
```

**Go Detection:**
```bash
if [ -f "go.mod" ]; then
  PROJECT_TYPE="go"
  TEST_COMMAND="go test ./..."
  DEV_COMMAND="go run ."
fi
```

**Detection Summary:**
```
🔍 Project Detection Results

Project type: nodejs
Test command: npm test
Dev server: npm run dev (port 3000)
```

### 3. User Confirmation

Confirm detected settings with user:

```
Detected configuration:
  Project Type: nodejs
  Test Command: npm test
  Dev Server: npm run dev

Is this correct? [Y/n]: _
```

If not correct:
```
Enter test command (or press Enter to skip): _
Enter dev server command (or press Enter to skip): _
Enter dev server port (default 3000): _
Enter ready pattern (default "Ready"): _
```

### 4. Create environment.json

Generate `docs/00-meta/environment.json` from template:

```json
{
  "$schema": "https://json-schema.org/draft-07/schema#",
  "description": "AgileFlow session harness environment configuration",
  "project_type": "nodejs",
  "init_script": "./docs/00-meta/init.sh",
  "test_command": "npm test",
  "test_timeout_ms": 60000,
  "dev_server": {
    "command": "npm run dev",
    "port": 3000,
    "ready_pattern": "Ready on"
  },
  "verification_policy": "warn",
  "baseline_commit": null,
  "baseline_established": null,
  "created_at": "2025-12-06T10:00:00Z",
  "updated_at": "2025-12-06T10:00:00Z"
}
```

### 5. Create init.sh

Copy template from `templates/init.sh` to `docs/00-meta/init.sh`:

```bash
cp templates/init.sh docs/00-meta/init.sh
chmod +x docs/00-meta/init.sh

# Customize based on project type
sed -i "s/{{PROJECT_TYPE}}/$PROJECT_TYPE/g" docs/00-meta/init.sh
```

### 6. Create session-state.json

Initialize session state file:

```json
{
  "$schema": "https://json-schema.org/draft-07/schema#",
  "description": "AgileFlow session state tracking",
  "current_session": {
    "id": "sess-20251206-100000",
    "started_at": "2025-12-06T10:00:00Z",
    "baseline_verified": false,
    "initial_test_status": "not_run",
    "current_story": null,
    "active_agent": null
  },
  "last_session": {
    "id": null,
    "ended_at": null,
    "stories_completed": [],
    "final_test_status": "not_run",
    "commits": []
  },
  "session_history": []
}
```

### 7. Run Initial Test Verification

Run `/AgileFlow:verify` to establish baseline test status:

```
🧪 Running initial test verification...

Command: npm test
```

**If tests pass:**
```
✅ Tests passed (42/42)

Baseline test status: passing
All systems ready for session tracking
```

**If tests fail:**
```
⚠️  Tests failed (40/42)

Failed tests:
  ❌ auth.test.ts:42 - Expected redirect
  ❌ auth.test.ts:67 - Session not persisting

Recommendation: Fix failing tests before proceeding
Continue anyway? [y/N]: _
```

### 8. Create Baseline Tag (Optional)

If tests are passing, offer to create baseline:

```
Create baseline git tag? [Y/n]: _
```

If yes:
```bash
TAG_NAME="agileflow-baseline-$(date +%Y%m%d-%H%M%S)"
git tag -a "$TAG_NAME" -m "AgileFlow baseline: all tests passing"

# Update environment.json
COMMIT_SHA=$(git rev-parse HEAD)
# Update baseline_commit and baseline_established fields
```

### 9. Configure SessionStart Hook

Offer to add automatic session resumption:

```
Enable automatic session resumption on startup? [Y/n]: _

This will:
  - Run /AgileFlow:resume on every Claude Code session start
  - Verify tests and load context automatically
  - Show session summary with recent activity
```

If yes:
```bash
# Create or update .claude/settings.json
mkdir -p .claude

if [ -f ".claude/settings.json" ]; then
  # Merge with existing settings
  echo "Updating existing .claude/settings.json..."
else
  # Create new settings.json
  cat > .claude/settings.json <<'EOF'
{
  "hooks": {
    "SessionStart": [{
      "matcher": "",
      "hooks": [{
        "type": "command",
        "command": "/AgileFlow:resume"
      }]
    }]
  }
}
EOF
fi
```

### 10. Final Summary

Display setup completion summary:

```
✅ Session Harness Initialized

Files Created:
  ✅ docs/00-meta/environment.json
  ✅ docs/00-meta/init.sh
  ✅ docs/09-agents/session-state.json

Baseline Status:
  ✅ Tests: 42/42 passing
  ✅ Git tag: agileflow-baseline-20251206-103000
  ✅ Commit: abc123def456

Configuration:
  Project Type: nodejs
  Test Command: npm test
  Verification Policy: warn
  Auto-Resume: enabled

Next Steps:
  1. Run /AgileFlow:verify to check tests anytime
  2. Run /AgileFlow:baseline to mark new baselines
  3. Run /AgileFlow:resume to manually resume session
  4. Tests will auto-verify on session start (hook enabled)

Session harness is ready! 🚀
```

## Error Handling

### No Test Command Found
```
⚠️  Could not detect test command

Please specify test command manually:
  Test command: _

Or skip test verification:
  Skip tests? [y/N]: _
```

### Test Command Fails
```
❌ Test command failed: npm test
Error: npm: command not found

Possible causes:
  1. Dependencies not installed
  2. Test command incorrect
  3. Node.js not in PATH

Would you like to:
  1. Run init script (install dependencies)
  2. Specify different test command
  3. Skip test verification

Choice [1/2/3]: _
```

### Init Script Execution Fails
```
❌ Init script failed
Error: ...

The init script at docs/00-meta/init.sh encountered an error.

Review the script and try again, or continue without running init.

Continue without init? [y/N]: _
```

### Git Not Available
```
⚠️  Git not found - baseline tagging unavailable

Session harness will be created without git baseline tracking.

This is optional - you can add baseline tags manually later using:
  git tag -a agileflow-baseline-YYYYMMDD -m "Baseline"
```

## Integration Points

### Called By
- `/AgileFlow:setup` - Optionally runs session-init during initial setup

### Calls
- `/AgileFlow:verify` - For initial test verification
- Template system - Uses templates/environment.json, templates/init.sh

### Creates
- `docs/00-meta/environment.json` - Session harness config
- `docs/00-meta/init.sh` - Environment initialization script
- `docs/09-agents/session-state.json` - Session state tracking
- `.claude/settings.json` - SessionStart hook (if enabled)
- Git tag (optional) - Baseline marker

## Implementation Notes

1. **Idempotent**: Safe to run multiple times (asks before overwriting)
2. **Interactive**: Confirms all detected settings before creating files
3. **Graceful Degradation**: Works even if tests fail or git unavailable
4. **User Control**: Every optional feature requires explicit consent
5. **Clear Output**: Step-by-step progress with clear status indicators
6. **Error Recovery**: Provides options to retry, skip, or fix issues

## Example Execution

```
User: /AgileFlow:session-init

Claude: Initializing session harness...

        🔍 Detecting project configuration...

        Found: package.json
        Project Type: Node.js
        Test Command: npm test (from package.json scripts)
        Dev Server: npm run dev

        Detected configuration:
          Project Type: nodejs
          Test Command: npm test
          Dev Server: npm run dev (port 3000)

        Is this correct? [Y/n]

User: y

Claude: ✅ Configuration confirmed

        Creating files...
        ✅ docs/00-meta/environment.json
        ✅ docs/00-meta/init.sh (executable)
        ✅ docs/09-agents/session-state.json

        🧪 Running initial test verification...
        Command: npm test

        ✅ Tests passed (42/42)
        Duration: 12.3s

        Create baseline git tag? [Y/n]

User: y

Claude: ✅ Git tag created: agileflow-baseline-20251206-103000
        ✅ Baseline commit: abc123def456

        Enable automatic session resumption? [Y/n]

User: y

Claude: ✅ SessionStart hook configured
        ✅ .claude/settings.json updated

        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        ✅ Session Harness Initialized
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        Files Created:
          ✅ docs/00-meta/environment.json
          ✅ docs/00-meta/init.sh
          ✅ docs/09-agents/session-state.json
          ✅ .claude/settings.json (hook added)

        Baseline Status:
          ✅ Tests: 42/42 passing
          ✅ Git tag: agileflow-baseline-20251206-103000
          ✅ Commit: abc123def456

        Configuration:
          Project Type: nodejs
          Test Command: npm test
          Verification Policy: warn
          Auto-Resume: enabled

        Next session will automatically:
          1. Run init script
          2. Verify tests
          3. Load context
          4. Show summary

        Session harness is ready! 🚀
```
