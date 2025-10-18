# notion-export

Export AgileFlow epics, stories, and ADRs to Notion via Model Context Protocol (MCP).

## Prompt

ROLE: Notion Integration Agent (MCP-based)

OBJECTIVE
Bidirectional sync between AgileFlow markdown docs and Notion databases using Model Context Protocol. Supports initial setup, export, import, and incremental sync.

---

## PREREQUISITES

### 1. MCP Server Configuration

**CRITICAL**: This command requires Notion MCP server to be configured. If not set up:

```bash
# Check if MCP is configured
cat .mcp.json 2>/dev/null || echo "MCP not configured"

# If missing, run setup
/setup-system
# Select "yes" for Notion integration
```

Your `.mcp.json` should contain:
```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.notion.com/mcp"]
    }
  }
}
```

Or for HTTP transport (recommended for teams):
```json
{
  "mcpServers": {
    "notion": {
      "url": "https://mcp.notion.com/mcp",
      "transport": "http"
    }
  }
}
```

### 2. OAuth Authentication

**CRITICAL**: You must authenticate with Notion via OAuth before first use:

```bash
# Authenticate (opens browser for OAuth)
/mcp

# Verify connection
# Test search to confirm access
```

Use MCP tool `notion-search` to search for databases in your workspace. If it returns results, you're authenticated.

### 3. Database Setup (First Time Only)

Run this command with `MODE=setup` to create the three required databases:

```bash
/notion-export MODE=setup
```

This will:
- Create **AgileFlow Epics** database
- Create **AgileFlow Stories** database
- Create **AgileFlow ADRs** database
- Store database IDs in `docs/08-project/notion-sync-map.json`

---

## USAGE

```bash
# Initial setup (create databases)
/notion-export MODE=setup

# Preview export without writing to Notion
/notion-export DRY_RUN=true

# Export all docs to Notion
/notion-export

# Export specific type only
/notion-export TYPE=epics
/notion-export TYPE=stories
/notion-export TYPE=adrs

# Import from Notion back to markdown
/notion-export MODE=import

# Bidirectional sync (smart merge)
/notion-export MODE=sync

# Force overwrite (export wins)
/notion-export MODE=export FORCE=true

# Force overwrite (import wins)
/notion-export MODE=import FORCE=true
```

### Environment Variables

- `MODE`: `setup` | `export` | `import` | `sync` (default: export)
- `TYPE`: `epics` | `stories` | `adrs` | `all` (default: all)
- `DRY_RUN`: `true` | `false` (default: false) - Preview only
- `FORCE`: `true` | `false` (default: false) - Overwrite without merge

---

## MCP TOOLS REFERENCE

This command uses the following Notion MCP tools:

### Database Operations
- **notion-create-database** - Create AgileFlow databases during setup
- **notion-update-database** - Modify database properties
- **notion-fetch** - Read database structure and pages by URL

### Page Management
- **notion-create-pages** - Export stories/epics/ADRs to Notion
- **notion-update-page** - Sync changes back to existing pages
- **notion-move-pages** - Organize pages within databases
- **notion-duplicate-page** - Clone templates

### Search & Retrieval
- **notion-search** - Find existing AgileFlow databases
- **notion-fetch** - Read page content for import

### Metadata
- **notion-get-users** - Resolve user mentions/assignments
- **notion-get-comments** - Fetch page discussions (future feature)
- **notion-get-teams** - Retrieve teamspaces (future feature)

---

## ARCHITECTURE

### File Structure

```
docs/08-project/
├── notion-sync-map.json    # Database IDs and sync state
└── notion-sync-log.jsonl   # Audit trail (created on first sync)
```

### Sync Map Schema

```json
{
  "last_sync": "2025-01-15T10:30:00Z",
  "databases": {
    "epics": "notion-database-id-1",
    "stories": "notion-database-id-2",
    "adrs": "notion-database-id-3"
  },
  "pages": {
    "docs/05-epics/AG-001-authentication.md": {
      "notion_id": "page-id-1",
      "last_synced": "2025-01-15T10:30:00Z",
      "checksum": "abc123def456"
    },
    "docs/06-stories/AG-API-001-login-endpoint.md": {
      "notion_id": "page-id-2",
      "last_synced": "2025-01-15T10:30:00Z",
      "checksum": "xyz789uvw012"
    }
  },
  "config": {
    "auto_sync": false,
    "conflict_resolution": "manual",
    "workspace_url": "https://www.notion.so/your-workspace"
  }
}
```

---

## IMPLEMENTATION

### STEP 1: Load Sync Map

```bash
SYNC_MAP="docs/08-project/notion-sync-map.json"

if [[ ! -f "$SYNC_MAP" ]]; then
  echo "⚠️  Sync map not found. Run /notion-export MODE=setup first"
  exit 1
fi

# Parse database IDs
EPICS_DB=$(jq -r '.databases.epics // empty' "$SYNC_MAP")
STORIES_DB=$(jq -r '.databases.stories // empty' "$SYNC_MAP")
ADRS_DB=$(jq -r '.databases.adrs // empty' "$SYNC_MAP")

if [[ -z "$EPICS_DB" ]] && [[ "$MODE" != "setup" ]]; then
  echo "❌ Databases not configured. Run MODE=setup first"
  exit 1
fi
```

### STEP 2: Setup Mode (First Time)

```bash
if [[ "$MODE" == "setup" ]]; then
  echo "🔧 Setting up Notion databases..."

  # Check MCP connection
  echo "Verifying MCP authentication..."
  # Use notion-search to test connection
  # If fails: "Run /mcp to authenticate with Notion"

  # Create Epics Database
  echo "Creating AgileFlow Epics database..."
  # Use notion-create-database with schema:
  # {
  #   "parent": {"type": "workspace"},
  #   "title": [{"text": {"content": "AgileFlow Epics"}}],
  #   "properties": {
  #     "Name": {"title": {}},
  #     "Epic ID": {"rich_text": {}},
  #     "Status": {"status": {"options": [
  #       {"name": "Draft", "color": "gray"},
  #       {"name": "In Progress", "color": "blue"},
  #       {"name": "Done", "color": "green"}
  #     ]}},
  #     "Owner": {"people": {}},
  #     "Stories": {"number": {"format": "number"}},
  #     "Progress": {"number": {"format": "percent"}},
  #     "Start Date": {"date": {}},
  #     "End Date": {"date": {}},
  #     "Tags": {"multi_select": {}},
  #     "Description": {"rich_text": {}}
  #   }
  # }

  # Create Stories Database
  echo "Creating AgileFlow Stories database..."
  # Use notion-create-database with schema:
  # {
  #   "parent": {"type": "workspace"},
  #   "title": [{"text": {"content": "AgileFlow Stories"}}],
  #   "properties": {
  #     "Name": {"title": {}},
  #     "Story ID": {"rich_text": {}},
  #     "Epic": {"relation": {"database_id": "$EPICS_DB"}},
  #     "Status": {"status": {"options": [
  #       {"name": "Draft", "color": "gray"},
  #       {"name": "Ready", "color": "yellow"},
  #       {"name": "In Progress", "color": "blue"},
  #       {"name": "In Review", "color": "purple"},
  #       {"name": "Done", "color": "green"}
  #     ]}},
  #     "Owner": {"select": {"options": [
  #       {"name": "AG-UI", "color": "pink"},
  #       {"name": "AG-API", "color": "blue"},
  #       {"name": "AG-CI", "color": "green"}
  #     ]}},
  #     "Priority": {"select": {"options": [
  #       {"name": "Critical", "color": "red"},
  #       {"name": "High", "color": "orange"},
  #       {"name": "Medium", "color": "yellow"},
  #       {"name": "Low", "color": "gray"}
  #     ]}},
  #     "Effort": {"select": {"options": [
  #       {"name": "XS (1-2h)", "color": "gray"},
  #       {"name": "S (2-4h)", "color": "blue"},
  #       {"name": "M (4-8h)", "color": "yellow"},
  #       {"name": "L (1-2d)", "color": "orange"},
  #       {"name": "XL (2-5d)", "color": "red"}
  #     ]}},
  #     "Tags": {"multi_select": {}},
  #     "Acceptance Criteria": {"rich_text": {}},
  #     "File Path": {"rich_text": {}}
  #   }
  # }

  # Create ADRs Database
  echo "Creating AgileFlow ADRs database..."
  # Use notion-create-database with schema:
  # {
  #   "parent": {"type": "workspace"},
  #   "title": [{"text": {"content": "AgileFlow ADRs"}}],
  #   "properties": {
  #     "Name": {"title": {}},
  #     "ADR Number": {"number": {"format": "number"}},
  #     "Status": {"status": {"options": [
  #       {"name": "Proposed", "color": "yellow"},
  #       {"name": "Accepted", "color": "green"},
  #       {"name": "Deprecated", "color": "gray"},
  #       {"name": "Superseded", "color": "red"}
  #     ]}},
  #     "Date": {"date": {}},
  #     "Tags": {"multi_select": {}},
  #     "Decision": {"rich_text": {}},
  #     "Consequences": {"rich_text": {}},
  #     "File Path": {"rich_text": {}}
  #   }
  # }

  # Save database IDs to sync map
  # Update $SYNC_MAP with database IDs returned from MCP
  # Set last_sync to current timestamp

  echo "✅ Databases created successfully!"
  echo ""
  echo "Next steps:"
  echo "1. Run /notion-export DRY_RUN=true to preview export"
  echo "2. Run /notion-export to perform initial export"
  echo "3. Visit Notion to verify: https://notion.so/your-workspace"

  exit 0
fi
```

### STEP 3: Collect Local Docs

```bash
collect_docs() {
  local type=$1
  local dir=""

  case $type in
    epics)   dir="docs/05-epics" ;;
    stories) dir="docs/06-stories" ;;
    adrs)    dir="docs/03-decisions" ;;
  esac

  # Find all markdown files (excluding README)
  find "$dir" -type f -name "*.md" ! -name "README.md" | sort
}

# Collect based on TYPE parameter
declare -a DOCS_TO_EXPORT

if [[ "$TYPE" == "all" ]] || [[ "$TYPE" == "epics" ]]; then
  mapfile -t EPIC_DOCS < <(collect_docs epics)
  DOCS_TO_EXPORT+=("${EPIC_DOCS[@]}")
fi

if [[ "$TYPE" == "all" ]] || [[ "$TYPE" == "stories" ]]; then
  mapfile -t STORY_DOCS < <(collect_docs stories)
  DOCS_TO_EXPORT+=("${STORY_DOCS[@]}")
fi

if [[ "$TYPE" == "all" ]] || [[ "$TYPE" == "adrs" ]]; then
  mapfile -t ADR_DOCS < <(collect_docs adrs)
  DOCS_TO_EXPORT+=("${ADR_DOCS[@]}")
fi

echo "Found ${#DOCS_TO_EXPORT[@]} documents to sync"
```

### STEP 4: Parse Markdown to Notion Schema

```bash
parse_epic() {
  local file=$1
  local content
  content=$(cat "$file")

  # Extract frontmatter (YAML between --- markers)
  local epic_id status owner tags
  epic_id=$(echo "$content" | sed -n '/^epic_id:/s/.*: *//p' | tr -d '"' | tr -d "'")
  status=$(echo "$content" | sed -n '/^status:/s/.*: *//p' | tr -d '"' | tr -d "'")
  owner=$(echo "$content" | sed -n '/^owner:/s/.*: *//p' | tr -d '"' | tr -d "'")
  tags=$(echo "$content" | sed -n '/^tags:/,/^[a-z_]*:/p' | grep -v '^tags:' | grep -v '^[a-z_]*:' | sed 's/^[- ]*//' | tr '\n' ',' | sed 's/,$//')

  # Extract title (first # heading)
  local title
  title=$(echo "$content" | grep -m1 '^# ' | sed 's/^# //')

  # Extract description (everything between ## Overview and next ##)
  local description
  description=$(echo "$content" | sed -n '/## Overview/,/^##/p' | grep -v '^##' | sed '/^$/d' | head -20)

  # Return as JSON for notion-create-pages
  cat <<EOF
{
  "parent": {"database_id": "$EPICS_DB"},
  "properties": {
    "Name": {"title": [{"text": {"content": "$title"}}]},
    "Epic ID": {"rich_text": [{"text": {"content": "$epic_id"}}]},
    "Status": {"status": {"name": "$status"}},
    "Tags": {"multi_select": $(echo "$tags" | jq -R 'split(",") | map({name: .})')},
    "Description": {"rich_text": [{"text": {"content": "$description"}}]}
  },
  "children": [
    {"object": "block", "type": "paragraph", "paragraph": {"rich_text": [{"text": {"content": "$content"}}]}}
  ]
}
EOF
}

parse_story() {
  local file=$1
  local content
  content=$(cat "$file")

  # Extract frontmatter
  local story_id epic_id status owner priority effort tags
  story_id=$(echo "$content" | sed -n '/^story_id:/s/.*: *//p' | tr -d '"' | tr -d "'")
  epic_id=$(echo "$content" | sed -n '/^epic_id:/s/.*: *//p' | tr -d '"' | tr -d "'")
  status=$(echo "$content" | sed -n '/^status:/s/.*: *//p' | tr -d '"' | tr -d "'")
  owner=$(echo "$content" | sed -n '/^owner:/s/.*: *//p' | tr -d '"' | tr -d "'")
  priority=$(echo "$content" | sed -n '/^priority:/s/.*: *//p' | tr -d '"' | tr -d "'")
  effort=$(echo "$content" | sed -n '/^effort:/s/.*: *//p' | tr -d '"' | tr -d "'")
  tags=$(echo "$content" | sed -n '/^tags:/,/^[a-z_]*:/p' | grep -v '^tags:' | grep -v '^[a-z_]*:' | sed 's/^[- ]*//' | tr '\n' ',' | sed 's/,$//')

  # Extract title
  local title
  title=$(echo "$content" | grep -m1 '^# ' | sed 's/^# //')

  # Extract acceptance criteria
  local acceptance
  acceptance=$(echo "$content" | sed -n '/## Acceptance Criteria/,/^##/p' | grep -v '^##' | sed '/^$/d' | head -20)

  # Find related epic page ID from sync map
  local epic_page_id
  epic_page_id=$(jq -r --arg epic "$epic_id" '.pages | to_entries[] | select(.key | contains($epic)) | .value.notion_id' "$SYNC_MAP")

  # Return as JSON
  cat <<EOF
{
  "parent": {"database_id": "$STORIES_DB"},
  "properties": {
    "Name": {"title": [{"text": {"content": "$title"}}]},
    "Story ID": {"rich_text": [{"text": {"content": "$story_id"}}]},
    "Epic": ${epic_page_id:+{"relation": [{"id": "$epic_page_id"}]}},
    "Status": {"status": {"name": "$status"}},
    "Owner": {"select": {"name": "$owner"}},
    "Priority": {"select": {"name": "$priority"}},
    "Effort": {"select": {"name": "$effort"}},
    "Tags": {"multi_select": $(echo "$tags" | jq -R 'split(",") | map({name: .})')},
    "Acceptance Criteria": {"rich_text": [{"text": {"content": "$acceptance"}}]},
    "File Path": {"rich_text": [{"text": {"content": "$file"}}]}
  },
  "children": [
    {"object": "block", "type": "paragraph", "paragraph": {"rich_text": [{"text": {"content": "$content"}}]}}
  ]
}
EOF
}

parse_adr() {
  local file=$1
  local content
  content=$(cat "$file")

  # Extract ADR number from filename (ADR-XXX-title.md)
  local adr_num
  adr_num=$(basename "$file" | sed -n 's/ADR-\([0-9]*\)-.*/\1/p')

  # Extract frontmatter
  local status date tags
  status=$(echo "$content" | sed -n '/^status:/s/.*: *//p' | tr -d '"' | tr -d "'")
  date=$(echo "$content" | sed -n '/^date:/s/.*: *//p' | tr -d '"' | tr -d "'")
  tags=$(echo "$content" | sed -n '/^tags:/,/^[a-z_]*:/p' | grep -v '^tags:' | grep -v '^[a-z_]*:' | sed 's/^[- ]*//' | tr '\n' ',' | sed 's/,$//')

  # Extract title
  local title
  title=$(echo "$content" | grep -m1 '^# ' | sed 's/^# //')

  # Extract sections
  local decision consequences
  decision=$(echo "$content" | sed -n '/## Decision/,/^##/p' | grep -v '^##' | sed '/^$/d' | head -20)
  consequences=$(echo "$content" | sed -n '/## Consequences/,/^##/p' | grep -v '^##' | sed '/^$/d' | head -20)

  # Return as JSON
  cat <<EOF
{
  "parent": {"database_id": "$ADRS_DB"},
  "properties": {
    "Name": {"title": [{"text": {"content": "$title"}}]},
    "ADR Number": {"number": $adr_num},
    "Status": {"status": {"name": "$status"}},
    "Date": {"date": {"start": "$date"}},
    "Tags": {"multi_select": $(echo "$tags" | jq -R 'split(",") | map({name: .})')},
    "Decision": {"rich_text": [{"text": {"content": "$decision"}}]},
    "Consequences": {"rich_text": [{"text": {"content": "$consequences"}}]},
    "File Path": {"rich_text": [{"text": {"content": "$file"}}]}
  },
  "children": [
    {"object": "block", "type": "paragraph", "paragraph": {"rich_text": [{"text": {"content": "$content"}}]}}
  ]
}
EOF
}
```

### STEP 5: Export to Notion

```bash
export_mode() {
  echo "📤 Exporting to Notion..."

  local exported=0
  local updated=0
  local skipped=0
  local failed=0

  for doc in "${DOCS_TO_EXPORT[@]}"; do
    echo "Processing: $doc"

    # Calculate checksum
    local checksum
    checksum=$(md5sum "$doc" | awk '{print $1}')

    # Check if already synced
    local existing_id existing_checksum
    existing_id=$(jq -r --arg path "$doc" '.pages[$path].notion_id // empty' "$SYNC_MAP")
    existing_checksum=$(jq -r --arg path "$doc" '.pages[$path].checksum // empty' "$SYNC_MAP")

    # Skip if unchanged (unless FORCE=true)
    if [[ "$checksum" == "$existing_checksum" ]] && [[ "$FORCE" != "true" ]]; then
      echo "  ⏭️  Unchanged, skipping"
      ((skipped++))
      continue
    fi

    # Parse document based on type
    local payload
    if [[ "$doc" == *"/05-epics/"* ]]; then
      payload=$(parse_epic "$doc")
    elif [[ "$doc" == *"/06-stories/"* ]]; then
      payload=$(parse_story "$doc")
    elif [[ "$doc" == *"/03-decisions/"* ]]; then
      payload=$(parse_adr "$doc")
    else
      echo "  ⚠️  Unknown document type"
      ((failed++))
      continue
    fi

    # DRY RUN: just preview
    if [[ "$DRY_RUN" == "true" ]]; then
      echo "  [DRY RUN] Would export:"
      echo "$payload" | jq -r '.properties.Name.title[0].text.content'
      ((exported++))
      continue
    fi

    # Create or update in Notion
    local notion_id
    if [[ -n "$existing_id" ]]; then
      # Use notion-update-page
      echo "  🔄 Updating existing page: $existing_id"
      # MCP call: notion-update-page with page_id=$existing_id and payload
      # notion_id=$existing_id (reuse)
      ((updated++))
    else
      # Use notion-create-pages
      echo "  ➕ Creating new page"
      # MCP call: notion-create-pages with payload
      # Extract returned page ID from MCP response
      # notion_id=<response.id>
      ((exported++))
    fi

    # Update sync map
    jq --arg path "$doc" \
       --arg id "$notion_id" \
       --arg checksum "$checksum" \
       --arg timestamp "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
       '.pages[$path] = {
         notion_id: $id,
         last_synced: $timestamp,
         checksum: $checksum
       } | .last_sync = $timestamp' \
       "$SYNC_MAP" > "${SYNC_MAP}.tmp" && mv "${SYNC_MAP}.tmp" "$SYNC_MAP"

    echo "  ✅ Synced"
  done

  # Summary
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "Export Summary:"
  echo "  ➕ Created: $exported"
  echo "  🔄 Updated: $updated"
  echo "  ⏭️  Skipped: $skipped"
  echo "  ❌ Failed: $failed"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}
```

### STEP 6: Import from Notion

```bash
import_mode() {
  echo "📥 Importing from Notion..."

  # Query all pages from databases using notion-fetch
  # For each database, get all pages:
  #   - Use notion-fetch with database URL
  #   - Parse returned pages

  local imported=0
  local updated=0
  local skipped=0

  # Query epics database
  if [[ -n "$EPICS_DB" ]]; then
    echo "Querying AgileFlow Epics database..."
    # MCP: notion-fetch with database_id=$EPICS_DB
    # Returns array of pages
    # For each page:
    #   - Extract properties
    #   - Convert to markdown format
    #   - Calculate file path from Epic ID
    #   - Write to docs/05-epics/AG-XXX-title.md
    #   - Update sync map
  fi

  # Query stories database
  if [[ -n "$STORIES_DB" ]]; then
    echo "Querying AgileFlow Stories database..."
    # MCP: notion-fetch with database_id=$STORIES_DB
    # Similar process as epics
  fi

  # Query ADRs database
  if [[ -n "$ADRS_DB" ]]; then
    echo "Querying AgileFlow ADRs database..."
    # MCP: notion-fetch with database_id=$ADRS_DB
    # Similar process as epics
  fi

  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "Import Summary:"
  echo "  📥 Imported: $imported"
  echo "  🔄 Updated: $updated"
  echo "  ⏭️  Skipped: $skipped"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}
```

### STEP 7: Bidirectional Sync

```bash
sync_mode() {
  echo "🔄 Bidirectional sync..."

  # This is a smart merge operation
  # 1. Export all local changes to Notion (timestamp check)
  # 2. Import all Notion changes to local (timestamp check)
  # 3. Detect conflicts (both changed since last sync)
  # 4. For conflicts:
  #    - If conflict_resolution=manual: List conflicts and prompt
  #    - If conflict_resolution=notion_wins: Use Notion version
  #    - If conflict_resolution=local_wins: Use local version

  echo "Step 1: Export local changes"
  export_mode

  echo ""
  echo "Step 2: Import Notion changes"
  import_mode

  echo ""
  echo "✅ Bidirectional sync complete"
}
```

### STEP 8: Execute Based on Mode

```bash
case "$MODE" in
  setup)
    # Already handled above
    ;;
  export)
    export_mode
    ;;
  import)
    import_mode
    ;;
  sync)
    sync_mode
    ;;
  *)
    echo "❌ Invalid MODE: $MODE"
    echo "Valid modes: setup, export, import, sync"
    exit 1
    ;;
esac
```

### STEP 9: Audit Trail

```bash
# Log operation to audit trail
log_sync() {
  local log_file="docs/08-project/notion-sync-log.jsonl"

  local log_entry
  log_entry=$(cat <<EOF
{
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "mode": "$MODE",
  "type": "$TYPE",
  "dry_run": ${DRY_RUN:-false},
  "force": ${FORCE:-false},
  "stats": {
    "exported": $exported,
    "imported": $imported,
    "updated": $updated,
    "skipped": $skipped,
    "failed": $failed
  }
}
EOF
)

  echo "$log_entry" >> "$log_file"
}

if [[ "$DRY_RUN" != "true" ]]; then
  log_sync
fi
```

---

## EXAMPLE WORKFLOWS

### First-Time Setup

```bash
# 1. Run system setup (if not done)
/setup-system
# Select "yes" for Notion integration

# 2. Authenticate with Notion
/mcp
# Click "Authorize" in browser

# 3. Verify connection
# Test notion-search tool

# 4. Create databases
/notion-export MODE=setup

# 5. Preview export
/notion-export DRY_RUN=true

# 6. Perform initial export
/notion-export

# 7. Visit Notion to verify
# Open https://notion.so/your-workspace
```

### Daily Workflow

```bash
# Export new/changed docs to Notion
/notion-export

# Or just export stories
/notion-export TYPE=stories

# Import changes from Notion (team members edited in Notion)
/notion-export MODE=import

# Bidirectional sync (smart merge)
/notion-export MODE=sync
```

### Conflict Resolution

```bash
# Check for conflicts first
/notion-export MODE=sync DRY_RUN=true

# Manual conflict resolution (default)
# Script will list conflicts and prompt for each

# Or force local version to win
/notion-export MODE=export FORCE=true

# Or force Notion version to win
/notion-export MODE=import FORCE=true
```

---

## ADVANTAGES OF MCP APPROACH

### 🔒 Security
- ✅ OAuth authentication (no manual tokens)
- ✅ Tokens never stored in files
- ✅ Per-user permissions
- ✅ Easy to revoke access

### 🚀 Developer Experience
- ✅ Native Claude Code integration
- ✅ One `/mcp` command to authenticate
- ✅ No API version management
- ✅ Automatic rate limiting
- ✅ Better error messages

### 👥 Team Collaboration
- ✅ `.mcp.json` committed to git
- ✅ Each member authenticates individually
- ✅ No token sharing
- ✅ Consistent setup across team

### 🛠️ Maintenance
- ✅ Notion updates MCP server automatically
- ✅ No breaking API changes
- ✅ Standardized protocol (works with other tools too)

---

## MIGRATION FROM API APPROACH

If you previously used the API-based `/notion-export`:

1. **Backup your sync map**:
   ```bash
   cp docs/08-project/notion-sync-map.json docs/08-project/notion-sync-map.json.backup
   ```

2. **Remove old token** (if exists):
   ```bash
   # Remove NOTION_TOKEN from .env
   sed -i '/NOTION_TOKEN/d' .env
   ```

3. **Set up MCP**:
   ```bash
   /setup-system
   # Select "yes" for Notion integration
   ```

4. **Authenticate**:
   ```bash
   /mcp
   ```

5. **Verify databases**:
   ```bash
   # Your existing database IDs in sync map will work with MCP
   # No need to recreate databases!
   /notion-export DRY_RUN=true
   ```

6. **Resume syncing**:
   ```bash
   /notion-export
   ```

---

## TROUBLESHOOTING

### MCP Server Not Configured

**Error**: "notion MCP server not found"

**Fix**:
```bash
# Run setup
/setup-system

# Or manually add to .mcp.json
cat > .mcp.json <<'EOF'
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.notion.com/mcp"]
    }
  }
}
EOF
```

### Not Authenticated

**Error**: "Notion authentication required"

**Fix**:
```bash
/mcp
# Click "Authorize" in browser
```

### Databases Not Found

**Error**: "Database IDs missing in sync map"

**Fix**:
```bash
/notion-export MODE=setup
```

### Rate Limiting

**Error**: "Rate limit exceeded"

**Fix**: MCP handles this automatically with exponential backoff. Wait a few seconds and retry.

### Sync Conflicts

**Error**: "Conflict detected: both local and Notion changed"

**Fix**:
```bash
# Review conflict details
/notion-export MODE=sync DRY_RUN=true

# Choose resolution strategy
/notion-export MODE=sync  # Manual prompts
# or
/notion-export MODE=export FORCE=true  # Local wins
# or
/notion-export MODE=import FORCE=true  # Notion wins
```

---

## FUTURE ENHANCEMENTS

- [ ] Auto-sync on file changes (watch mode)
- [ ] Conflict resolution UI in Claude Code
- [ ] Comment syncing (notion-get-comments / notion-create-comment)
- [ ] Attachment support
- [ ] Webhook integration (Notion → AgileFlow)
- [ ] Multi-workspace support
- [ ] Custom property mappings
- [ ] Rollback support (restore from log)

---

## RELATED COMMANDS

- `/setup-system` - Initial AgileFlow + MCP configuration
- `/github-sync` - Sync with GitHub Issues
- `/story-new` - Create new story (auto-exports if Notion enabled)
- `/epic-new` - Create new epic (auto-exports if Notion enabled)
- `/adr-new` - Create new ADR (auto-exports if Notion enabled)
- `/board` - Visualize status (can pull from Notion)

---

## REFERENCES

- [Notion MCP Server](https://mcp.notion.com/mcp)
- [MCP Documentation](https://modelcontextprotocol.io/docs/getting-started/intro)
- [MCP Supported Tools](https://developers.notion.com/docs/mcp-supported-tools)
- [Claude Code MCP Guide](https://docs.claude.com/en/docs/claude-code/mcp)
- [Notion API Reference](https://developers.notion.com/reference/intro)
