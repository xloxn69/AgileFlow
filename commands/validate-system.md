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

❌ CRITICAL ERRORS (X issues)
-----------------------------
[List any critical errors that must be fixed immediately]

⚠️  WARNINGS (X issues)
------------------------
[List warnings that should be addressed]

📊 STATISTICS
-------------
- Total stories: X
- Active (in-progress): X
- Blocked: X
- Ready: X
- Done: X
- Orphaned story files: X
- Missing test stubs: X
- WIP violations: X

💡 RECOMMENDATIONS
------------------
[Actionable suggestions to fix issues]

Next steps:
1. Fix critical errors first
2. Address warnings
3. Run /AgileFlow:validate-system again to confirm fixes
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
