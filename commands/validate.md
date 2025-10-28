---
description: validate-system
allowed-tools: Bash, Read, Edit, Write, Glob, Grep
---

# validate-system

Validate AgileFlow system integrity: JSON schemas, orphaned stories, WIP limits, and consistency checks.

## Prompt

ROLE: System Validator

OBJECTIVE
Validate the entire AgileFlow system for structural integrity, data consistency, and best practices. Provide actionable recommendations for fixes.

DETECTION PHASE (run first, silently)
```bash
# Check if AgileFlow is initialized
[ -f docs/09-agents/status.json ] || { echo "❌ AgileFlow not initialized. Run /AgileFlow:setup-system first."; exit 1; }

# Check if schemas exist
[ -f schemas/status.schema.json ] || echo "⚠️  Status schema missing (schemas/status.schema.json)"
[ -f schemas/bus-message.schema.json ] || echo "⚠️  Bus message schema missing (schemas/bus-message.schema.json)"
```

VALIDATION CATEGORIES

## 1. JSON Schema Validation

**Status.json Validation**:
```bash
# Use jq to validate against schema (if ajv or similar is available, prefer that)
# Otherwise, validate structure manually

# Check required fields
jq -e '.updated' docs/09-agents/status.json >/dev/null 2>&1 || echo "❌ Missing 'updated' field"
jq -e '.stories' docs/09-agents/status.json >/dev/null 2>&1 || echo "❌ Missing 'stories' field"

# Check story structure
jq -r '.stories | to_entries[] | .key' docs/09-agents/status.json | while read story_id; do
  # Validate story ID format
  [[ "$story_id" =~ ^(US|EP)-[0-9]{4}$ ]] || echo "❌ Invalid story ID format: $story_id"

  # Check required fields
  jq -e ".stories[\"$story_id\"].owner" docs/09-agents/status.json >/dev/null 2>&1 || echo "❌ $story_id missing 'owner'"
  jq -e ".stories[\"$story_id\"].status" docs/09-agents/status.json >/dev/null 2>&1 || echo "❌ $story_id missing 'status'"
  jq -e ".stories[\"$story_id\"].last_update" docs/09-agents/status.json >/dev/null 2>&1 || echo "❌ $story_id missing 'last_update'"

  # Validate status enum
  status=$(jq -r ".stories[\"$story_id\"].status" docs/09-agents/status.json)
  [[ "$status" =~ ^(ready|in-progress|blocked|in-review|done)$ ]] || echo "❌ $story_id has invalid status: $status"
done
```

**Bus Message Validation**:
```bash
# Validate each line in log.jsonl
if [ -f docs/09-agents/bus/log.jsonl ]; then
  line_num=0
  while IFS= read -r line; do
    line_num=$((line_num + 1))

    # Check if valid JSON
    echo "$line" | jq empty 2>/dev/null || echo "❌ Line $line_num: Invalid JSON"

    # Check required fields
    echo "$line" | jq -e '.ts' >/dev/null 2>&1 || echo "❌ Line $line_num: Missing 'ts'"
    echo "$line" | jq -e '.from' >/dev/null 2>&1 || echo "❌ Line $line_num: Missing 'from'"
    echo "$line" | jq -e '.type' >/dev/null 2>&1 || echo "❌ Line $line_num: Missing 'type'"
    echo "$line" | jq -e '.text' >/dev/null 2>&1 || echo "❌ Line $line_num: Missing 'text'"

    # Validate message type enum
    msg_type=$(echo "$line" | jq -r '.type')
    [[ "$msg_type" =~ ^(status|blocked|unblock|assign|handoff|question|research-request|research-complete|dependency-resolved|epic-created|story-created|adr-created|pr-opened|pr-merged)$ ]] || echo "⚠️  Line $line_num: Unknown message type: $msg_type"
  done < docs/09-agents/bus/log.jsonl
fi
```

## 2. Orphaned Story Detection

**Check for stories in status.json without corresponding files**:
```bash
jq -r '.stories | to_entries[] | select(.key | startswith("US-")) | .key' docs/09-agents/status.json | while read story_id; do
  # Try to find story file
  found=$(find docs/06-stories -type f -name "*${story_id}*.md" 2>/dev/null | head -n 1)
  [ -z "$found" ] && echo "⚠️  $story_id exists in status.json but no file found in docs/06-stories/"
done
```

**Check for story files without status.json entries**:
```bash
find docs/06-stories -type f -name "US-*.md" 2>/dev/null | while read story_file; do
  # Extract story ID from filename
  story_id=$(basename "$story_file" | grep -oE 'US-[0-9]{4}')

  # Check if in status.json
  jq -e ".stories[\"$story_id\"]" docs/09-agents/status.json >/dev/null 2>&1 || echo "⚠️  $story_file exists but $story_id not in status.json"
done
```

**Check for epics in status.json without corresponding files**:
```bash
jq -r '.stories | to_entries[] | select(.key | startswith("EP-")) | .key' docs/09-agents/status.json 2>/dev/null | while read epic_id; do
  [ -f "docs/05-epics/${epic_id}.md" ] || echo "⚠️  $epic_id exists in status.json but docs/05-epics/${epic_id}.md not found"
done
```

## 3. WIP Limit Violations

**Check each agent's WIP count (max 2 in-progress)**:
```bash
jq -r '.stories | to_entries[] | select(.value.status=="in-progress") | "\(.value.owner)|\(.key)"' docs/09-agents/status.json | \
  awk -F'|' '{count[$1]++; stories[$1]=stories[$1] $2 ", "} END {for (agent in count) if (count[agent] > 2) print "❌ WIP VIOLATION: " agent " has " count[agent] " stories in-progress (max 2): " stories[agent]}'
```

## 4. Dependency Validation

**Check for circular dependencies**:
```bash
# Extract all dependencies
jq -r '.stories | to_entries[] | select(.value.deps) | "\(.key)|\(.value.deps | join(","))"' docs/09-agents/status.json 2>/dev/null | while IFS='|' read story deps; do
  # Check each dependency
  IFS=',' read -ra DEP_ARRAY <<< "$deps"
  for dep in "${DEP_ARRAY[@]}"; do
    # Check if dependency exists
    jq -e ".stories[\"$dep\"]" docs/09-agents/status.json >/dev/null 2>&1 || echo "❌ $story depends on $dep which doesn't exist in status.json"

    # Check if dependency also depends on this story (direct circular)
    dep_deps=$(jq -r ".stories[\"$dep\"].deps[]?" docs/09-agents/status.json 2>/dev/null)
    echo "$dep_deps" | grep -q "^${story}$" && echo "❌ CIRCULAR DEPENDENCY: $story ↔ $dep"
  done
done
```

**Check for blocked stories with unresolved dependencies**:
```bash
jq -r '.stories | to_entries[] | select(.value.status=="blocked") | "\(.key)|\(.value.deps // [] | join(","))"' docs/09-agents/status.json 2>/dev/null | while IFS='|' read story deps; do
  if [ -n "$deps" ]; then
    IFS=',' read -ra DEP_ARRAY <<< "$deps"
    for dep in "${DEP_ARRAY[@]}"; do
      dep_status=$(jq -r ".stories[\"$dep\"].status" docs/09-agents/status.json 2>/dev/null)
      [ "$dep_status" != "done" ] && echo "⚠️  $story is blocked, dependency $dep is $dep_status (not done)"
    done
  else
    echo "⚠️  $story is blocked but has no dependencies listed (check blocked_by reason)"
  fi
done
```

## 5. Story Files Validation

**Check for stories missing acceptance criteria**:
```bash
find docs/06-stories -type f -name "US-*.md" 2>/dev/null | while read story_file; do
  # Check for AC section
  grep -q "## Acceptance Criteria" "$story_file" || echo "⚠️  $story_file missing '## Acceptance Criteria' section"

  # Check for Given/When/Then format
  grep -q "Given\|When\|Then" "$story_file" || echo "⚠️  $story_file missing Given/When/Then criteria"
done
```

**Check for stories missing test stubs**:
```bash
jq -r '.stories | to_entries[] | select(.key | startswith("US-")) | select(.value.status != "done") | .key' docs/09-agents/status.json 2>/dev/null | while read story_id; do
  [ -f "docs/07-testing/test-cases/${story_id}.md" ] || echo "⚠️  $story_id missing test stub at docs/07-testing/test-cases/${story_id}.md"
done
```

## 6. Epic Validation

**Check for stories referencing non-existent epics**:
```bash
jq -r '.stories | to_entries[] | select(.value.epic) | "\(.key)|\(.value.epic)"' docs/09-agents/status.json 2>/dev/null | while IFS='|' read story epic; do
  [ -f "docs/05-epics/${epic}.md" ] || echo "❌ $story references epic $epic which doesn't exist"
done
```

## 7. Data Freshness Checks

**Check for stale in-progress stories (>7 days with no update)**:
```bash
seven_days_ago=$(date -u -d '7 days ago' +%Y-%m-%dT%H:%M:%S 2>/dev/null || date -u -v-7d +%Y-%m-%dT%H:%M:%S 2>/dev/null)

jq -r --arg cutoff "$seven_days_ago" '.stories | to_entries[] | select(.value.status=="in-progress") | select(.value.last_update < $cutoff) | "\(.key)|\(.value.last_update)|\(.value.owner)"' docs/09-agents/status.json 2>/dev/null | while IFS='|' read story last_update owner; do
  echo "⚠️  $story owned by $owner has been in-progress since $last_update (>7 days, may be stale)"
done
```

**Check for old blocked stories (>14 days)**:
```bash
fourteen_days_ago=$(date -u -d '14 days ago' +%Y-%m-%dT%H:%M:%S 2>/dev/null || date -u -v-14d +%Y-%m-%dT%H:%M:%S 2>/dev/null)

jq -r --arg cutoff "$fourteen_days_ago" '.stories | to_entries[] | select(.value.status=="blocked") | select(.value.last_update < $cutoff) | "\(.key)|\(.value.last_update)|\(.value.owner)"' docs/09-agents/status.json 2>/dev/null | while IFS='|' read story last_update owner; do
  echo "⚠️  $story owned by $owner has been blocked since $last_update (>14 days, needs attention)"
done
```

## 8. Integration Consistency

**Check GitHub sync consistency** (if enabled):
```bash
if [ -f docs/08-project/github-sync-map.json ]; then
  # Check for stories in status.json that should have GitHub issues
  jq -r '.stories | to_entries[] | select(.value.status != "done") | .key' docs/09-agents/status.json | while read story_id; do
    # Check if mapped in github-sync-map.json
    github_issue=$(jq -r ".mappings[\"$story_id\"]" docs/08-project/github-sync-map.json 2>/dev/null)
    [ "$github_issue" == "null" ] && echo "⚠️  $story_id not synced to GitHub (no mapping in github-sync-map.json)"
  done
fi
```

**Check Notion sync consistency** (if enabled):
```bash
if [ -f docs/08-project/notion-sync-map.json ]; then
  # Similar check for Notion
  jq -r '.stories | to_entries[] | select(.value.status != "done") | .key' docs/09-agents/status.json | while read story_id; do
    notion_page=$(jq -r ".stories[\"$story_id\"]" docs/08-project/notion-sync-map.json 2>/dev/null)
    [ "$notion_page" == "null" ] && echo "⚠️  $story_id not synced to Notion (no mapping in notion-sync-map.json)"
  done
fi
```

## 9. MCP Security Validation (CRITICAL)

**⚠️ CRITICAL SECURITY CHECKS - Prevent Token Leaks**

**Check .gitignore contains MCP secrets**:
```bash
# CRITICAL: Check if .mcp.json is gitignored
if [ -f .gitignore ]; then
  grep -E '^\\.mcp\\.json$' .gitignore >/dev/null 2>&1 || echo "❌ CRITICAL: .mcp.json NOT in .gitignore - tokens will leak to git!"
  grep -E '^\\.env$' .gitignore >/dev/null 2>&1 || echo "❌ CRITICAL: .env NOT in .gitignore - tokens will leak to git!"
else
  echo "❌ CRITICAL: .gitignore missing - create it and add .mcp.json and .env!"
fi
```

**Check if .mcp.json or .env are staged/committed** (CRITICAL):
```bash
# Check if secrets are in git (CRITICAL ERROR)
if [ -d .git ]; then
  # Check if .mcp.json is tracked
  git ls-files | grep -E '^\\.mcp\\.json$' >/dev/null 2>&1 && echo "❌ CRITICAL: .mcp.json IS COMMITTED TO GIT - TOKENS ARE LEAKED! Run: git rm --cached .mcp.json && git commit -m 'Remove leaked secrets' && git push --force"

  # Check if .env is tracked
  git ls-files | grep -E '^\\.env$' >/dev/null 2>&1 && echo "❌ CRITICAL: .env IS COMMITTED TO GIT - TOKENS ARE LEAKED! Run: git rm --cached .env && git commit -m 'Remove leaked secrets' && git push --force"

  # Check if staged (not yet committed)
  git diff --cached --name-only | grep -E '^\\.mcp\\.json$' >/dev/null 2>&1 && echo "❌ CRITICAL: .mcp.json is STAGED - DO NOT COMMIT! Run: git reset HEAD .mcp.json"
  git diff --cached --name-only | grep -E '^\\.env$' >/dev/null 2>&1 && echo "❌ CRITICAL: .env is STAGED - DO NOT COMMIT! Run: git reset HEAD .env"
fi
```

**Check .mcp.json uses ${VAR} syntax (not hardcoded tokens)**:
```bash
if [ -f .mcp.json ]; then
  # Check if using ${VAR} syntax (correct)
  if grep -q '\${[A-Z_]*}' .mcp.json; then
    echo "✅ .mcp.json uses ${VAR} environment variable substitution"
  else
    # Check if has hardcoded tokens (WRONG - old approach)
    if grep -qE 'ghp_[A-Za-z0-9]{36}|ntn_[A-Za-z0-9]{50}' .mcp.json; then
      echo "❌ CRITICAL: .mcp.json contains HARDCODED TOKENS - Use ${VAR} syntax and store tokens in .env!"
    else
      echo "⚠️  .mcp.json exists but doesn't use ${VAR} syntax - verify it's correct"
    fi
  fi
else
  [ -f .mcp.json.example ] && echo "⚠️  .mcp.json.example exists but not copied to .mcp.json - run: cp .mcp.json.example .mcp.json"
fi
```

**Check .env exists with required tokens**:
```bash
if [ -f .env ]; then
  # Check for required tokens based on .mcp.json config
  if [ -f .mcp.json ]; then
    # Check for GitHub token if GitHub MCP is configured
    grep -q '"github"' .mcp.json && {
      grep -q 'GITHUB_PERSONAL_ACCESS_TOKEN=' .env || echo "⚠️  GitHub MCP configured but GITHUB_PERSONAL_ACCESS_TOKEN not in .env"
    }

    # Check for Notion token if Notion MCP is configured
    grep -q '"notion"' .mcp.json && {
      grep -q 'NOTION_TOKEN=' .env || echo "⚠️  Notion MCP configured but NOTION_TOKEN not in .env"
    }
  fi
else
  [ -f .env.example ] && echo "⚠️  .env.example exists but not copied to .env - run: cp .env.example .env && edit with your tokens"
fi
```

**Check AgileFlow version metadata**:
```bash
if [ -f docs/00-meta/agileflow-metadata.json ]; then
  # Check version
  version=$(jq -r '.agileflow.version' docs/00-meta/agileflow-metadata.json 2>/dev/null)
  [ "$version" != "null" ] && echo "✅ AgileFlow version: $version" || echo "⚠️  AgileFlow version not set in metadata"

  # Check security flags
  mcp_gitignored=$(jq -r '.security.mcpJsonGitignored' docs/00-meta/agileflow-metadata.json 2>/dev/null)
  [ "$mcp_gitignored" == "true" ] || echo "⚠️  Metadata indicates .mcp.json may not be gitignored - verify .gitignore"

  env_gitignored=$(jq -r '.security.envGitignored' docs/00-meta/agileflow-metadata.json 2>/dev/null)
  [ "$env_gitignored" == "true" ] || echo "⚠️  Metadata indicates .env may not be gitignored - verify .gitignore"

  # Check git remote
  git_remote=$(jq -r '.git.remoteConfigured' docs/00-meta/agileflow-metadata.json 2>/dev/null)
  [ "$git_remote" == "true" ] && echo "✅ Git remote configured" || echo "⚠️  Git remote not configured - run /AgileFlow:setup-system to add remote"
else
  echo "⚠️  AgileFlow metadata missing (docs/00-meta/agileflow-metadata.json) - may be outdated setup"
fi
```

**Check git repository health**:
```bash
if [ -d .git ]; then
  # Check if remote is configured
  git remote -v 2>/dev/null | grep -q origin && echo "✅ Git remote configured" || echo "⚠️  Git remote not configured - run /AgileFlow:setup-system"

  # Check for unpushed commits (user may have local work)
  unpushed=$(git log @{u}.. --oneline 2>/dev/null | wc -l)
  [ "$unpushed" -gt 0 ] && echo "⚠️  $unpushed unpushed commits - run: git push"
else
  echo "⚠️  Not a git repository - run: git init && run /AgileFlow:setup-system"
fi
```

## OUTPUT FORMAT

Display results grouped by severity:

```
🔍 AgileFlow System Validation Report
=====================================

✅ PASSED (X checks)
-------------------
- JSON Schema: status.json is valid
- JSON Schema: All bus messages valid (N lines checked)
- WIP Limits: All agents within limits
- Dependencies: No circular dependencies detected
- Epic References: All valid
- Security: .mcp.json and .env are gitignored
- Security: No secrets committed to git
- MCP: Using ${VAR} environment variable substitution
- Git: Remote configured
- Metadata: AgileFlow version X.X.X

❌ CRITICAL ERRORS (X issues)
-----------------------------
[List any critical errors that must be fixed immediately]

SECURITY CRITICAL ERRORS (if any):
- ❌ .mcp.json committed to git - TOKENS LEAKED
- ❌ .env committed to git - TOKENS LEAKED
- ❌ .mcp.json not in .gitignore
- ❌ .mcp.json contains hardcoded tokens

⚠️  WARNINGS (X issues)
------------------------
[List warnings that should be addressed]

SECURITY WARNINGS (if any):
- ⚠️  .mcp.json not copied from .mcp.json.example
- ⚠️  .env not copied from .env.example
- ⚠️  Git remote not configured

📊 STATISTICS
-------------
- AgileFlow Version: X.X.X
- Total stories: X
- Active (in-progress): X
- Blocked: X
- Ready: X
- Done: X
- Orphaned story files: X
- Missing test stubs: X
- WIP violations: X
- Git remote: configured/not configured
- MCP integrations: GitHub (yes/no), Notion (yes/no)

💡 RECOMMENDATIONS
------------------
[Actionable suggestions to fix issues]

🔒 SECURITY NEXT STEPS (if issues found):
1. If .mcp.json or .env committed: Remove from git IMMEDIATELY
   - git rm --cached .mcp.json .env
   - Add to .gitignore
   - git commit -m "Remove leaked secrets"
   - REVOKE AND REGENERATE ALL TOKENS (GitHub, Notion, etc.)
   - git push --force
2. Ensure .mcp.json uses ${VAR} syntax (not hardcoded tokens)
3. Store tokens in .env (not .mcp.json)
4. Verify .gitignore has .mcp.json and .env

Next steps:
1. Fix SECURITY CRITICAL errors IMMEDIATELY
2. Fix other critical errors
3. Address warnings
4. Run /AgileFlow:validate-system again to confirm fixes
```

RULES
- Always run silently first, collect all issues
- Group by severity (Critical → Warning → Info)
- Provide specific file paths and line numbers for errors
- Suggest fix commands where applicable
- Exit code 0 if no critical errors, 1 if critical errors found
- Display validation summary at the end

SAFE EXECUTION
- Read-only operations (no modifications)
- Handle missing files gracefully
- Validate JSON before parsing (prevent jq errors)
- Use color codes if terminal supports it (red for errors, yellow for warnings, green for success)
