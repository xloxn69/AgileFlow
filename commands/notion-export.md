# notion-export

Bidirectional sync between AgileFlow and Notion databases with real-time collaboration.

## Prompt

ROLE: Notion Integration Specialist

OBJECTIVE
Sync AgileFlow stories, epics, and ADRs with Notion databases bidirectionally, enabling team collaboration while maintaining AgileFlow as the source of truth.

INPUTS (optional)
- MODE=setup|export|import|sync (default: sync)
- DATABASE=epics|stories|adrs|all (default: all)
- EPIC=<EP_ID> (filter by specific epic)
- DRY_RUN=true|false (default: false)
- DIRECTION=agileflow-to-notion|notion-to-agileflow|bidirectional (default: bidirectional)

PREREQUISITES

1. **Notion Integration** (create at https://www.notion.so/my-integrations):
   - Create a new integration
   - Get Integration Token (starts with `secret_`)
   - Share databases with integration

2. **Environment Variables** (add to .env):
   ```bash
   NOTION_TOKEN=secret_xxxxxxxxxxxxxxxxxxxx
   NOTION_EPICS_DB=https://notion.so/...   # Or database ID
   NOTION_STORIES_DB=https://notion.so/...
   NOTION_ADRS_DB=https://notion.so/...
   ```

3. **Sync Mapping** (create if missing):
   `docs/08-project/notion-sync-map.json`:
   ```json
   {
     "last_sync": "2025-10-17T14:30:00Z",
     "epics": {
       "EP-0010": {"notion_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890", "last_synced": "2025-10-17T10:00:00Z"}
     },
     "stories": {
       "US-0030": {"notion_id": "b2c3d4e5-f6a7-8901-bcde-f01234567890", "last_synced": "2025-10-17T11:00:00Z"}
     },
     "adrs": {
       "0001": {"notion_id": "c3d4e5f6-a7b8-9012-cdef-012345678901", "last_synced": "2025-10-17T12:00:00Z"}
     }
   }
   ```

NOTION API CLIENT

Use curl or notion-cli for API calls:

```bash
# Helper function
notion_api() {
  local endpoint=$1
  local method=${2:-GET}
  local data=${3:-}

  curl -s -X $method \
    "https://api.notion.com/v1/$endpoint" \
    -H "Authorization: Bearer $NOTION_TOKEN" \
    -H "Notion-Version: 2022-06-28" \
    -H "Content-Type: application/json" \
    ${data:+-d "$data"}
}

# Example: Get database
notion_api "databases/$NOTION_EPICS_DB"

# Example: Create page
notion_api "pages" POST '{
  "parent": {"database_id": "'$NOTION_STORIES_DB'"},
  "properties": {
    "Name": {"title": [{"text": {"content": "US-0030: User registration"}}]},
    "Status": {"status": {"name": "In Progress"}}
  }
}'
```

SETUP MODE

Create Notion databases with proper schema:

```bash
/notion-export MODE=setup
```

### 1. Create Epics Database

```json
{
  "parent": {"type": "page_id", "page_id": "<YOUR_PAGE_ID>"},
  "title": [{"type": "text", "text": {"content": "AgileFlow Epics"}}],
  "properties": {
    "Name": {"title": {}},
    "Epic ID": {"rich_text": {}},
    "Owner": {
      "select": {
        "options": [
          {"name": "AG-UI", "color": "blue"},
          {"name": "AG-API", "color": "green"},
          {"name": "AG-CI", "color": "orange"},
          {"name": "AG-DEVOPS", "color": "purple"}
        ]
      }
    },
    "Status": {
      "status": {
        "options": [
          {"name": "Planning", "color": "gray"},
          {"name": "In Progress", "color": "yellow"},
          {"name": "Done", "color": "green"}
        ]
      }
    },
    "Stories": {"relation": {"database_id": "<STORIES_DB_ID>"}},
    "Goal": {"rich_text": {}},
    "Started": {"date": {}},
    "Completed": {"date": {}},
    "AgileFlow File": {"url": {}}
  }
}
```

### 2. Create Stories Database

```json
{
  "parent": {"type": "page_id", "page_id": "<YOUR_PAGE_ID>"},
  "title": [{"type": "text", "text": {"content": "AgileFlow Stories"}}],
  "properties": {
    "Name": {"title": {}},
    "Story ID": {"rich_text": {}},
    "Epic": {"relation": {"database_id": "<EPICS_DB_ID>"}},
    "Owner": {
      "select": {
        "options": [
          {"name": "AG-UI", "color": "blue"},
          {"name": "AG-API", "color": "green"},
          {"name": "AG-CI", "color": "orange"},
          {"name": "AG-DEVOPS", "color": "purple"}
        ]
      }
    },
    "Status": {
      "status": {
        "options": [
          {"name": "Ready", "color": "gray"},
          {"name": "In Progress", "color": "yellow"},
          {"name": "In Review", "color": "blue"},
          {"name": "Done", "color": "green"},
          {"name": "Blocked", "color": "red"}
        ]
      }
    },
    "Estimate": {"number": {}},
    "Priority": {
      "select": {
        "options": [
          {"name": "High", "color": "red"},
          {"name": "Medium", "color": "yellow"},
          {"name": "Low", "color": "blue"}
        ]
      }
    },
    "Assignee": {"people": {}},
    "AC Count": {"number": {}},
    "GitHub Issue": {"url": {}},
    "AgileFlow File": {"url": {}},
    "Created": {"created_time": {}},
    "Last Edited": {"last_edited_time": {}}
  }
}
```

### 3. Create ADRs Database

```json
{
  "parent": {"type": "page_id", "page_id": "<YOUR_PAGE_ID>"},
  "title": [{"type": "text", "text": {"content": "AgileFlow ADRs"}}],
  "properties": {
    "Name": {"title": {}},
    "ADR Number": {"number": {}},
    "Status": {
      "select": {
        "options": [
          {"name": "Proposed", "color": "yellow"},
          {"name": "Accepted", "color": "green"},
          {"name": "Deprecated", "color": "gray"},
          {"name": "Superseded", "color": "red"}
        ]
      }
    },
    "Date": {"date": {}},
    "Supersedes": {"relation": {"database_id": "<SELF>"}},
    "Related Stories": {"relation": {"database_id": "<STORIES_DB_ID>"}},
    "Tags": {"multi_select": {}},
    "AgileFlow File": {"url": {}}
  }
}
```

After creation, output database URLs and IDs for .env.

AGILEFLOW → NOTION EXPORT

### Export Epic

```bash
# Read epic file
epic_id=EP-0010
epic_file=docs/05-epics/$epic_id.md

# Parse frontmatter
title=$(grep '^title:' $epic_file | cut -d: -f2- | xargs)
owner=$(grep '^owner:' $epic_file | cut -d: -f2- | xargs)
goal=$(grep '^goal:' $epic_file | cut -d: -f2- | xargs)

# Check if exists in Notion
notion_id=$(get_notion_id_from_mapping "epics" $epic_id)

if [ -z "$notion_id" ]; then
  # Create new page
  response=$(notion_api "pages" POST '{
    "parent": {"database_id": "'$NOTION_EPICS_DB'"},
    "properties": {
      "Name": {"title": [{"text": {"content": "'"$title"'"}}]},
      "Epic ID": {"rich_text": [{"text": {"content": "'"$epic_id"'"}}]},
      "Owner": {"select": {"name": "'"$owner"'"}},
      "Goal": {"rich_text": [{"text": {"content": "'"$goal"'"}}]},
      "Status": {"status": {"name": "In Progress"}},
      "AgileFlow File": {"url": "file://docs/05-epics/'"$epic_id"'.md"}
    },
    "children": [
      {
        "object": "block",
        "type": "paragraph",
        "paragraph": {
          "rich_text": [{"type": "text", "text": {"content": "Synced from AgileFlow"}}]
        }
      }
    ]
  }')

  notion_id=$(echo $response | jq -r '.id')
  update_mapping "epics" $epic_id $notion_id

else
  # Update existing page
  notion_api "pages/$notion_id" PATCH '{
    "properties": {
      "Name": {"title": [{"text": {"content": "'"$title"'"}}]},
      "Owner": {"select": {"name": "'"$owner"'"}},
      "Goal": {"rich_text": [{"text": {"content": "'"$goal"'"}}]}
    }
  }'
fi
```

### Export Story

```bash
# Read story file
story_id=US-0030
story_file=docs/06-stories/*/$story_id.md

# Parse frontmatter
title=$(grep '^title:' $story_file | cut -d: -f2- | xargs)
epic=$(grep '^epic:' $story_file | cut -d: -f2- | xargs)
owner=$(grep '^owner:' $story_file | cut -d: -f2- | xargs)
estimate=$(grep '^estimate:' $story_file | cut -d: -f2- | xargs | grep -oP '\d+(\.\d+)?')
priority=$(grep '^priority:' $story_file | cut -d: -f2- | xargs)

# Get status from status.json
status=$(jq -r '.stories["'$story_id'"].status' docs/09-agents/status.json)

# Map status to Notion status
case $status in
  ready) notion_status="Ready" ;;
  in-progress) notion_status="In Progress" ;;
  in-review) notion_status="In Review" ;;
  done) notion_status="Done" ;;
  blocked) notion_status="Blocked" ;;
esac

# Get epic's Notion ID for relation
epic_notion_id=$(get_notion_id_from_mapping "epics" $epic)

# Count acceptance criteria
ac_count=$(grep -c '^- \[ \]' $story_file || echo 0)

# Extract AC and description as page content
description=$(sed -n '/^## Description/,/^## /p' $story_file | sed '1d;$d')
acceptance_criteria=$(sed -n '/^## Acceptance Criteria/,/^## /p' $story_file | sed '1d;$d')

notion_id=$(get_notion_id_from_mapping "stories" $story_id)

if [ -z "$notion_id" ]; then
  # Create new story page
  response=$(notion_api "pages" POST '{
    "parent": {"database_id": "'$NOTION_STORIES_DB'"},
    "properties": {
      "Name": {"title": [{"text": {"content": "'"$story_id: $title"'"}}]},
      "Story ID": {"rich_text": [{"text": {"content": "'"$story_id"'"}}]},
      "Epic": {"relation": [{"id": "'"$epic_notion_id"'"}]},
      "Owner": {"select": {"name": "'"$owner"'"}},
      "Status": {"status": {"name": "'"$notion_status"'"}},
      "Estimate": {"number": '$estimate'},
      "Priority": {"select": {"name": "'"${priority:-Medium}"'"}},
      "AC Count": {"number": '$ac_count'},
      "AgileFlow File": {"url": "file://docs/06-stories/'"$epic/$story_id"'.md"}
    },
    "children": [
      {
        "object": "block",
        "type": "heading_2",
        "heading_2": {"rich_text": [{"text": {"content": "Description"}}]}
      },
      {
        "object": "block",
        "type": "paragraph",
        "paragraph": {"rich_text": [{"text": {"content": "'"$description"'"}}]}
      },
      {
        "object": "block",
        "type": "heading_2",
        "heading_2": {"rich_text": [{"text": {"content": "Acceptance Criteria"}}]}
      },
      {
        "object": "block",
        "type": "paragraph",
        "paragraph": {"rich_text": [{"text": {"content": "'"$acceptance_criteria"'"}}]}
      }
    ]
  }')

  notion_id=$(echo $response | jq -r '.id')
  update_mapping "stories" $story_id $notion_id

else
  # Update existing page
  notion_api "pages/$notion_id" PATCH '{
    "properties": {
      "Status": {"status": {"name": "'"$notion_status"'"}},
      "Estimate": {"number": '$estimate'},
      "AC Count": {"number": '$ac_count'}
    }
  }'
fi
```

### Export ADR

```bash
# Read ADR file
adr_number=0001
adr_file=docs/03-decisions/$adr_number-*.md

# Parse frontmatter
title=$(grep '^title:' $adr_file | cut -d: -f2- | xargs)
status=$(grep '^status:' $adr_file | cut -d: -f2- | xargs)
date=$(grep '^date:' $adr_file | cut -d: -f2- | xargs)

# Extract sections as blocks
context=$(sed -n '/^## Context/,/^## /p' $adr_file | sed '1d;$d')
decision=$(sed -n '/^## Decision/,/^## /p' $adr_file | sed '1d;$d')
consequences=$(sed -n '/^## Consequences/,/^## /p' $adr_file | sed '1d;$d')

notion_id=$(get_notion_id_from_mapping "adrs" $adr_number)

if [ -z "$notion_id" ]; then
  response=$(notion_api "pages" POST '{
    "parent": {"database_id": "'$NOTION_ADRS_DB'"},
    "properties": {
      "Name": {"title": [{"text": {"content": "ADR-'"$adr_number"': '"$title"'"}}]},
      "ADR Number": {"number": '$adr_number'},
      "Status": {"select": {"name": "'"${status:-Accepted}"'"}},
      "Date": {"date": {"start": "'"$date"'"}},
      "AgileFlow File": {"url": "file://docs/03-decisions/'"$adr_number"'-'"$title"'.md"}
    },
    "children": [
      {"type": "heading_2", "heading_2": {"rich_text": [{"text": {"content": "Context"}}]}},
      {"type": "paragraph", "paragraph": {"rich_text": [{"text": {"content": "'"$context"'"}}]}},
      {"type": "heading_2", "heading_2": {"rich_text": [{"text": {"content": "Decision"}}]}},
      {"type": "paragraph", "paragraph": {"rich_text": [{"text": {"content": "'"$decision"'"}}]}},
      {"type": "heading_2", "heading_2": {"rich_text": [{"text": {"content": "Consequences"}}]}},
      {"type": "paragraph", "paragraph": {"rich_text": [{"text": {"content": "'"$consequences"'"}}]}}
    ]
  }')

  notion_id=$(echo $response | jq -r '.id')
  update_mapping "adrs" $adr_number $notion_id
fi
```

NOTION → AGILEFLOW IMPORT

### Import Story from Notion

```bash
# Query Notion database for new/updated stories
response=$(notion_api "databases/$NOTION_STORIES_DB/query" POST '{
  "filter": {
    "property": "Last Edited",
    "date": {
      "after": "'"$last_sync_timestamp"'"
    }
  },
  "sorts": [{"property": "Last Edited", "direction": "ascending"}]
}')

# Process each page
echo $response | jq -r '.results[]' | while read -r page; do
  notion_id=$(echo $page | jq -r '.id')
  story_id=$(echo $page | jq -r '.properties["Story ID"].rich_text[0].text.content')
  title=$(echo $page | jq -r '.properties.Name.title[0].text.content' | sed "s/$story_id: //")
  epic=$(echo $page | jq -r '.properties.Epic.relation[0].id')  # Need to resolve to epic ID
  owner=$(echo $page | jq -r '.properties.Owner.select.name')
  status=$(echo $page | jq -r '.properties.Status.status.name')
  estimate=$(echo $page | jq -r '.properties.Estimate.number')

  # Map Notion status to AgileFlow
  case $status in
    "Ready") agileflow_status=ready ;;
    "In Progress") agileflow_status=in-progress ;;
    "In Review") agileflow_status=in-review ;;
    "Done") agileflow_status=done ;;
    "Blocked") agileflow_status=blocked ;;
  esac

  # Get epic ID from mapping (reverse lookup)
  epic_id=$(get_agileflow_id_from_notion_mapping "epics" $epic)

  # Check if story exists
  story_file=docs/06-stories/$epic_id/$story_id.md

  if [ ! -f "$story_file" ]; then
    # Create new story (import from Notion)
    mkdir -p docs/06-stories/$epic_id

    # Get page content for description/AC
    page_content=$(notion_api "blocks/$notion_id/children")
    description=$(echo $page_content | jq -r '.results[] | select(.type == "paragraph") | .paragraph.rich_text[0].text.content' | head -1)

    cat > "$story_file" <<EOF
---
id: $story_id
title: $title
epic: $epic_id
owner: $owner
status: $agileflow_status
estimate: ${estimate}d
notion_page: https://notion.so/$notion_id
---

# $title

## Description

$description

## Acceptance Criteria

- [ ] (Imported from Notion - please refine)

## Notes

Imported from Notion on $(date -Iseconds)
EOF

    # Update status.json
    update_status_json $story_id $agileflow_status $owner

    # Update mapping
    update_mapping "stories" $story_id $notion_id

    # Log to bus
    echo "{\"ts\":\"$(date -Iseconds)\",\"type\":\"notion-import\",\"story\":\"$story_id\",\"action\":\"created\"}" >> docs/09-agents/bus/log.jsonl

  else
    # Update existing story status
    current_status=$(jq -r '.stories["'$story_id'"].status' docs/09-agents/status.json)

    if [ "$current_status" != "$agileflow_status" ]; then
      update_status_json $story_id $agileflow_status $owner

      echo "{\"ts\":\"$(date -Iseconds)\",\"type\":\"notion-sync\",\"story\":\"$story_id\",\"action\":\"status_updated\",\"old\":\"$current_status\",\"new\":\"$agileflow_status\"}" >> docs/09-agents/bus/log.jsonl
    fi
  fi
done
```

CONFLICT RESOLUTION

Same strategy as GitHub sync:

1. **Timestamp comparison**: Compare Notion's `last_edited_time` with bus/log.jsonl timestamp
2. **Winner: Most recent change**
3. **Log conflicts** to bus with resolution strategy

```bash
# Get last AgileFlow update
agileflow_timestamp=$(jq -r '.stories["'$story_id'"] | .timestamp // "1970-01-01T00:00:00Z"' docs/09-agents/status.json)

# Get Notion update
notion_timestamp=$(echo $page | jq -r '.last_edited_time')

# Compare
if [[ "$notion_timestamp" > "$agileflow_timestamp" ]]; then
  echo "Notion is newer, importing..."
  resolution="kept_notion"
else
  echo "AgileFlow is newer, exporting..."
  resolution="kept_agileflow"
fi

# Log conflict
echo "{\"ts\":\"$(date -Iseconds)\",\"type\":\"notion-conflict\",\"story\":\"$story_id\",\"resolution\":\"$resolution\"}" >> docs/09-agents/bus/log.jsonl
```

SYNC REPORT

```markdown
# Notion Sync Report

**Generated**: 2025-10-17 14:30
**Mode**: Bidirectional sync
**Databases**: Epics, Stories, ADRs

---

## 📊 Summary

**AgileFlow → Notion**: 8 changes
- ✅ 2 epics created
- ✅ 5 stories created/updated
- ✅ 1 ADR created

**Notion → AgileFlow**: 3 changes
- ✅ 2 stories updated (status changes)
- ✅ 1 story created (new from Notion)

**Conflicts**: 1 resolved
- US-0030: Notion updated more recently (kept Notion state)

---

## 📤 Exported to Notion

### Epics
| Epic | Notion Page | Action |
|------|-------------|--------|
| EP-0010 | [View](https://notion.so/...) | Created |
| EP-0011 | [View](https://notion.so/...) | Created |

### Stories
| Story | Notion Page | Action |
|-------|-------------|--------|
| US-0042 | [View](https://notion.so/...) | Created |
| US-0043 | [View](https://notion.so/...) | Created |
| US-0038 | [View](https://notion.so/...) | Updated status |

### ADRs
| ADR | Notion Page | Action |
|-----|-------------|--------|
| 0001 | [View](https://notion.so/...) | Created |

## 📥 Imported from Notion

| Notion Page | Story | Action |
|-------------|-------|--------|
| [View](https://notion.so/...) | US-0050 | Created |
| [View](https://notion.so/...) | US-0030 | Status updated |
| [View](https://notion.so/...) | US-0035 | Status updated |

---

## 🔗 View in Notion

- [Epics Database](https://notion.so/$NOTION_EPICS_DB)
- [Stories Database](https://notion.so/$NOTION_STORIES_DB)
- [ADRs Database](https://notion.so/$NOTION_ADRS_DB)

**Collaboration**: Team members can now view and update stories in Notion. Changes will sync back to AgileFlow.

---

## 🤖 Real-time Sync (Optional)

For instant sync, set up Notion webhook:

1. Enable webhooks in Notion integration settings
2. Point webhook to your server endpoint
3. On database updates, trigger `/notion-export MODE=sync`

Or run periodic sync with cron:
```bash
*/30 * * * * cd /path/to/project && /notion-export MODE=sync
```
```

COLLABORATION WORKFLOW

### Team Member Updates Story in Notion

1. User opens Notion Stories database
2. Changes US-0042 status from "Ready" to "In Progress"
3. Next sync (manual or automatic):
   - `/notion-export` detects change
   - Updates `docs/09-agents/status.json`
   - Logs to `docs/09-agents/bus/log.jsonl`
4. Developer sees updated status in AgileFlow

### Developer Creates Story in AgileFlow

1. Developer runs `/story-new` to create US-0050
2. Runs `/notion-export` (or waits for auto-sync)
3. New page appears in Notion Stories database
4. Team members can see it in Notion and add comments/assign

### Product Manager Creates Epic in Notion

1. PM creates new epic in Notion Epics database
2. Fills in goal, stories, owner
3. Next sync:
   - `/notion-export MODE=import` creates epic file in `docs/05-epics/`
   - Linked stories are created as well
4. Developers can now work on stories via AgileFlow

USAGE EXAMPLES

### Initial setup (one-time)
```bash
/notion-export MODE=setup
# Follow prompts to create databases and configure .env
```

### Full bidirectional sync
```bash
/notion-export
```

### Export all to Notion
```bash
/notion-export MODE=export
```

### Import from Notion only
```bash
/notion-export MODE=import
```

### Sync specific epic
```bash
/notion-export EPIC=EP-0010
```

### Preview changes (dry run)
```bash
/notion-export DRY_RUN=true
```

### Sync only stories database
```bash
/notion-export DATABASE=stories
```

INTEGRATION WITH OTHER COMMANDS

- After `/epic-new`: Optionally export to Notion
- After `/story-new`: Optionally create Notion page
- After `/status`: Auto-sync to Notion
- In `/board`: Include Notion page links
- In `/stakeholder-update`: Include Notion database views

BENEFITS OF NOTION INTEGRATION

1. **Visual Project Management**: Team can use Notion's kanban/calendar/timeline views
2. **Collaboration**: Non-technical stakeholders can comment and update
3. **Rich Content**: Embed images, files, videos in story descriptions
4. **Notifications**: Notion sends notifications on updates
5. **Mobile Access**: Team can update stories from Notion mobile app
6. **Reporting**: Use Notion's charts and dashboards
7. **Source of Truth**: AgileFlow remains authoritative, Notion is view layer

RULES
- AgileFlow is always the source of truth for AC and technical details
- Notion is the collaboration and visualization layer
- Never delete AgileFlow files based on Notion deletions (archive instead)
- Always log sync actions to bus/log.jsonl
- Validate Notion token before any write operations
- Handle Notion API rate limits (3 requests/second)
- Preserve Notion page IDs in story frontmatter

OUTPUT
- Sync report (markdown)
- Updated notion-sync-map.json
- Updated status.json (if Notion → AgileFlow changes)
- Bus log entries for all sync actions
- Optional: Saved report to docs/08-project/sync-reports/notion-sync-YYYYMMDD-HHMMSS.md
