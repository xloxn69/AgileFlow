# github-sync

Two-way sync between AgileFlow stories and GitHub Issues with automatic status updates.

## Prompt

ROLE: GitHub Integration Specialist

OBJECTIVE
Synchronize AgileFlow stories with GitHub Issues bidirectionally, keeping status, labels, assignees, and milestones in sync.

INPUTS (optional)
- MODE=import|export|sync (default: sync)
- EPIC=<EP_ID> (filter by specific epic)
- STORY=<US_ID> (sync single story)
- DRY_RUN=true|false (default: false - preview changes)
- DIRECTION=agileflow-to-github|github-to-agileflow|bidirectional (default: bidirectional)

PREREQUISITES

1. **GitHub Token** (read from .env):
   ```bash
   GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
   GITHUB_REPO=owner/repo
   ```

2. **GitHub CLI** (check if installed):
   ```bash
   which gh || echo "Please install GitHub CLI: https://cli.github.com"
   ```

3. **Sync Mapping** (create if missing):
   `docs/08-project/github-sync-map.json`:
   ```json
   {
     "last_sync": "2025-10-17T14:30:00Z",
     "mappings": {
       "US-0030": {"issue_number": 42, "last_synced": "2025-10-17T10:00:00Z"},
       "US-0031": {"issue_number": 43, "last_synced": "2025-10-17T11:00:00Z"}
     },
     "config": {
       "status_mapping": {
         "ready": "Status: Ready",
         "in-progress": "Status: In Progress",
         "in-review": "Status: In Review",
         "done": "Status: Done"
       },
       "epic_to_milestone": {
         "EP-0010": "Milestone 1: Authentication",
         "EP-0011": "Milestone 2: Payments"
       }
     }
   }
   ```

SYNC WORKFLOW

### 1. Read Current State

```bash
# AgileFlow state
Read docs/09-agents/status.json
Read docs/06-stories/**/*.md

# GitHub state
gh issue list --repo $GITHUB_REPO --json number,title,state,labels,assignees,milestone --limit 1000
```

### 2. Detect Changes

**From AgileFlow to GitHub**:
- New stories not in mapping → Create GitHub Issues
- Status changes → Update GitHub labels
- Story updates (title, description, AC) → Update Issue body
- Assignment changes → Update Issue assignees

**From GitHub to AgileFlow**:
- New Issues with `agileflow:` label → Create stories
- Issue closed → Update status to "done"
- Label changes → Update status.json
- Assignee changes → Update story frontmatter

### 3. Apply Changes (with conflict resolution)

If both sides changed:
1. Check timestamps (last_synced vs. GitHub updated_at vs. bus/log.jsonl timestamp)
2. Prefer most recent change
3. Log conflict to docs/09-agents/bus/log.jsonl:
   ```json
   {"ts":"2025-10-17T14:30:00Z","type":"sync-conflict","story":"US-0030","github_issue":42,"resolution":"kept_github","reason":"GitHub updated more recently"}
   ```

AGILEFLOW → GITHUB EXPORT

### Create GitHub Issue from Story

For each story in docs/06-stories/**/*.md:

```bash
# Read story frontmatter
story_id=US-0030
title="User registration endpoint"
owner=AG-API
epic=EP-0010
status=done

# Create issue if not exists
if ! in_mapping($story_id); then
  issue_number=$(gh issue create \
    --repo $GITHUB_REPO \
    --title "[$story_id] $title" \
    --body "$(cat <<EOF
## Story: $story_id

**Epic**: $epic
**Owner**: $owner
**Estimate**: 1d

### Acceptance Criteria

- [ ] Given a new user submits registration form
- [ ] When all fields are valid
- [ ] Then account is created and confirmation email sent

### Links
- [Story file](docs/06-stories/EP-0010/US-0030.md)
- [Test cases](docs/07-testing/test-cases/US-0030.md)

---
*Synced from AgileFlow*
EOF
)" \
    --label "agileflow:story" \
    --label "epic:EP-0010" \
    --label "owner:AG-API" \
    --label "Status: Done" \
    --milestone "Milestone 1: Authentication" \
    | grep -oP '#\K\d+')

  # Record mapping
  update_mapping $story_id $issue_number
fi
```

### Update GitHub Issue Status

```bash
# When status changes in status.json
story_id=US-0030
new_status=in-review

# Remove old status label, add new
gh issue edit $issue_number \
  --remove-label "Status: In Progress" \
  --add-label "Status: In Review"

# If done, close issue
if [ "$new_status" = "done" ]; then
  gh issue close $issue_number --comment "✅ Story completed in AgileFlow"
fi

# Log to bus
echo "{\"ts\":\"$(date -Iseconds)\",\"type\":\"github-sync\",\"story\":\"$story_id\",\"issue\":$issue_number,\"action\":\"status_updated\",\"status\":\"$new_status\"}" >> docs/09-agents/bus/log.jsonl
```

GITHUB → AGILEFLOW IMPORT

### Create Story from GitHub Issue

For each Issue with label `agileflow:story`:

```bash
gh issue view $issue_number --json number,title,body,labels,assignees,milestone,state

# Extract story metadata from labels
epic=$(echo $labels | grep -oP 'epic:\K[A-Z]+-\d+')
owner=$(echo $labels | grep -oP 'owner:\K[A-Z]+-[A-Z]+')
status_label=$(echo $labels | grep -oP 'Status: \K.*')

# Map status
case "$status_label" in
  "Ready") status=ready ;;
  "In Progress") status=in-progress ;;
  "In Review") status=in-review ;;
  "Done") status=done ;;
esac

# Generate story ID if not in title
if [[ $title =~ \[US-([0-9]+)\] ]]; then
  story_id=US-${BASH_REMATCH[1]}
else
  # Find next available ID
  story_id=$(find_next_story_id)
  # Update GitHub issue title
  gh issue edit $issue_number --title "[$story_id] $title"
fi

# Create story file if doesn't exist
if [ ! -f "docs/06-stories/$epic/$story_id.md" ]; then
  cat > "docs/06-stories/$epic/$story_id.md" <<EOF
---
id: $story_id
title: $title
epic: $epic
owner: $owner
status: $status
estimate: 1d
github_issue: $issue_number
---

# $title

## Description
$body

## Acceptance Criteria

- [ ] (Imported from GitHub - please refine)

## GitHub
- Issue: #$issue_number
- [View on GitHub](https://github.com/$GITHUB_REPO/issues/$issue_number)
EOF

  # Update status.json
  update_status_json $story_id $status $owner

  # Log to bus
  echo "{\"ts\":\"$(date -Iseconds)\",\"type\":\"github-import\",\"story\":\"$story_id\",\"issue\":$issue_number,\"action\":\"created\"}" >> docs/09-agents/bus/log.jsonl
fi
```

### Sync Issue Closure

```bash
# When GitHub issue is closed
if [ "$issue_state" = "CLOSED" ]; then
  # Update AgileFlow status
  story_id=$(get_story_from_mapping $issue_number)

  if [ -n "$story_id" ]; then
    # Update status.json
    update_status_json $story_id "done" "$owner"

    # Log to bus
    echo "{\"ts\":\"$(date -Iseconds)\",\"type\":\"github-sync\",\"story\":\"$story_id\",\"issue\":$issue_number,\"action\":\"closed\",\"status\":\"done\"}" >> docs/09-agents/bus/log.jsonl
  fi
fi
```

SYNC REPORT

After sync completes, generate report:

```markdown
# GitHub Sync Report

**Generated**: 2025-10-17 14:30
**Mode**: Bidirectional sync
**Repository**: owner/repo

---

## 📊 Summary

**AgileFlow → GitHub**: 5 changes
- ✅ 3 issues created
- ✅ 2 statuses updated

**GitHub → AgileFlow**: 2 changes
- ✅ 1 story created
- ✅ 1 status updated (closed)

**Conflicts**: 1 resolved
- US-0030: GitHub updated more recently (kept GitHub state)

---

## 📤 Exported to GitHub

| Story | Issue | Action | Status |
|-------|-------|--------|--------|
| US-0042 | #45 | Created | ✅ Success |
| US-0043 | #46 | Created | ✅ Success |
| US-0044 | #47 | Created | ✅ Success |
| US-0038 | #40 | Updated status | ✅ Success |
| US-0035 | #38 | Updated status | ✅ Success |

## 📥 Imported from GitHub

| Issue | Story | Action | Status |
|-------|-------|--------|--------|
| #48 | US-0050 | Created story | ✅ Success |
| #42 | US-0030 | Closed → done | ✅ Success |

## ⚠️ Conflicts Resolved

| Story | Issue | Conflict | Resolution |
|-------|-------|----------|------------|
| US-0030 | #42 | Both updated | Kept GitHub (more recent) |

## 🔗 Mapping Updates

Updated `docs/08-project/github-sync-map.json` with 5 new mappings.

**Next sync**: Run `/github-sync` again to keep in sync, or set up GitHub Actions webhook.

---

## 🤖 Automation Recommendation

Set up automatic sync with GitHub Actions:

`.github/workflows/agileflow-sync.yml`:
```yaml
name: AgileFlow Sync
on:
  issues:
    types: [opened, edited, closed, labeled]
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: /github-sync MODE=sync
```
```

LABEL MANAGEMENT

### Auto-create AgileFlow Labels

```bash
# Create standard labels if they don't exist
labels=(
  "agileflow:story|Story tracked in AgileFlow|0366d6"
  "epic:EP-0010|Epic: User Authentication|d4c5f9"
  "owner:AG-UI|Owner: UI Agent|fbca04"
  "owner:AG-API|Owner: API Agent|0e8a16"
  "Status: Ready|Ready to start|ededed"
  "Status: In Progress|Work in progress|fbca04"
  "Status: In Review|Under review|0075ca"
  "Status: Done|Completed|0e8a16"
)

for label_def in "${labels[@]}"; do
  IFS='|' read -r name description color <<< "$label_def"
  gh label create "$name" --description "$description" --color "$color" --force
done
```

WEBHOOK INTEGRATION (Advanced)

For real-time sync, set up GitHub webhook:

```bash
# webhook-handler.sh (runs on issue events)
payload=$(cat)
action=$(echo $payload | jq -r '.action')
issue_number=$(echo $payload | jq -r '.issue.number')

case $action in
  opened|edited)
    # Import/update story
    /github-sync MODE=import ISSUE=$issue_number
    ;;
  closed)
    # Mark story done
    story_id=$(get_story_from_mapping $issue_number)
    /status STORY=$story_id STATUS=done
    ;;
  labeled)
    # Sync status if status label changed
    new_label=$(echo $payload | jq -r '.label.name')
    if [[ $new_label =~ ^Status: ]]; then
      /github-sync MODE=import ISSUE=$issue_number
    fi
    ;;
esac
```

CONFLICT RESOLUTION STRATEGY

1. **Timestamp comparison**:
   - AgileFlow: Parse latest timestamp from bus/log.jsonl for story
   - GitHub: Use `updated_at` from issue
   - **Winner**: Most recent timestamp

2. **Manual resolution** (if timestamps within 5 minutes):
   - Show diff to user
   - Ask which to keep
   - Log decision to bus

3. **Auto-resolution rules**:
   - Status changes: Prefer GitHub (closer to source of truth for developers)
   - Content changes: Prefer AgileFlow (more detailed AC and structure)
   - Assignment: Prefer GitHub (reflects actual work assignment)

DRY RUN MODE

Preview changes before applying:

```bash
/github-sync DRY_RUN=true
```

Output:
```markdown
# GitHub Sync (DRY RUN)

**Would apply 7 changes** (use DRY_RUN=false to apply)

## AgileFlow → GitHub (5 changes)

✏️ **Create** Issue for US-0042 "Login form UI"
  - Labels: agileflow:story, epic:EP-0010, owner:AG-UI, Status: Ready
  - Milestone: Milestone 1: Authentication

✏️ **Create** Issue for US-0043 "Profile page"
  - Labels: agileflow:story, epic:EP-0011, owner:AG-UI, Status: Ready

✏️ **Update** Issue #40 status label
  - Remove: Status: Ready
  - Add: Status: In Progress

## GitHub → AgileFlow (2 changes)

✏️ **Create** Story US-0050 from Issue #48 "Add password reset flow"
  - File: docs/06-stories/EP-0010/US-0050.md
  - Status: ready
  - Owner: AG-API

✏️ **Update** US-0030 status to "done" (Issue #42 closed)
  - Update status.json
  - Log to bus

**Run with DRY_RUN=false to apply these changes.**
```

ERROR HANDLING

```bash
# Check for GitHub CLI
if ! command -v gh &> /dev/null; then
  echo "❌ GitHub CLI not installed. Install: https://cli.github.com"
  exit 1
fi

# Check authentication
if ! gh auth status &> /dev/null; then
  echo "❌ Not authenticated. Run: gh auth login"
  exit 1
fi

# Check repo access
if ! gh repo view $GITHUB_REPO &> /dev/null; then
  echo "❌ Cannot access repo $GITHUB_REPO. Check GITHUB_REPO in .env"
  exit 1
fi

# Validate sync map
if [ ! -f "docs/08-project/github-sync-map.json" ]; then
  echo "⚠️ Sync map not found. Creating new mapping file..."
  mkdir -p docs/08-project
  echo '{"last_sync":null,"mappings":{},"config":{}}' > docs/08-project/github-sync-map.json
fi
```

USAGE EXAMPLES

### Full bidirectional sync
```bash
/github-sync
```

### Export all stories to GitHub
```bash
/github-sync MODE=export
```

### Import GitHub issues to AgileFlow
```bash
/github-sync MODE=import
```

### Sync single story
```bash
/github-sync STORY=US-0030
```

### Sync specific epic
```bash
/github-sync EPIC=EP-0010
```

### Preview changes (dry run)
```bash
/github-sync DRY_RUN=true
```

### One-way sync (AgileFlow → GitHub only)
```bash
/github-sync DIRECTION=agileflow-to-github
```

INTEGRATION WITH OTHER COMMANDS

- After `/story-new`: Optionally prompt to create GitHub issue
- After `/status`: Auto-sync status to GitHub
- In `/board`: Show GitHub issue links
- In `/velocity`: Include GitHub activity metrics

RULES
- Never create duplicate issues (check mapping first)
- Always log sync actions to bus/log.jsonl
- Preserve GitHub issue numbers in story frontmatter
- Use labels for all metadata (status, epic, owner)
- Handle rate limits gracefully (GitHub API: 5000 req/hour)
- Validate GitHub token before any write operations

OUTPUT
- Sync report (markdown)
- Updated github-sync-map.json
- Updated status.json (if GitHub → AgileFlow changes)
- Bus log entries for all sync actions
- Optional: Saved report to docs/08-project/sync-reports/sync-YYYYMMDD-HHMMSS.md

---

## FUTURE: GITHUB MCP INTEGRATION

GitHub also offers a Model Context Protocol (MCP) server similar to Notion. While this command currently uses the GitHub CLI (`gh`), future versions could optionally use GitHub MCP for:

### Advantages of GitHub MCP
- ✅ OAuth authentication (similar to Notion)
- ✅ Native Claude Code integration
- ✅ Standardized protocol across services
- ✅ No CLI dependency

### Setup (Optional, for future use)
Add to `.mcp.json`:
```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.notion.com/mcp"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"]
    }
  }
}
```

### Current Recommendation
**Continue using GitHub CLI** (`gh`) for now because:
- More stable and widely adopted
- Better error messages
- Easier testing and debugging
- Direct integration with GitHub Actions

**Consider GitHub MCP** when:
- MCP ecosystem matures
- Team already using MCP for other services (Notion, Slack, etc.)
- Need unified authentication approach

---

## RELATED COMMANDS

- `/notion-export` - Sync with Notion (uses MCP)
- `/story-new` - Create new story (can auto-create GitHub issue)
- `/board` - Visualize stories with GitHub links
- `/velocity` - Track velocity including GitHub activity
