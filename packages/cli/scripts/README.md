# AgileFlow Release Scripts

Automated scripts to streamline the release process and reduce cognitive strain.

## 📦 Release Script

**Purpose**: Automate the entire release process from version bump to npm publish.

**Usage**:
```bash
./scripts/release.sh <version> <release-title>
```

**Example**:
```bash
./scripts/release.sh 2.32.0 "Dynamic Content Injection System"
```

**What it does**:
1. ✅ Bumps version in `packages/cli/package.json`
2. ✅ Bumps version in root `package.json`
3. ⏸️ Prompts you to update `CHANGELOG.md` manually (then press ENTER)
4. ✅ Commits changes with conventional commit message
5. ✅ Pushes to GitHub
6. ✅ Creates and pushes git tag `vX.Y.Z`
7. ✅ Extracts changelog notes for this version
8. ✅ Creates GitHub release with extracted notes
9. ✅ GitHub Actions automatically publishes to npm

**Benefits**:
- No manual steps to remember
- Consistent release process every time
- Automatic changelog extraction
- Automatic tag creation
- Zero chance of forgetting to push the tag

## 🎯 Quick Release Flow

For a typical release:

```bash
# 1. Make your changes
git add -A
git commit -m "feat: add new feature"
git push origin main

# 2. Update CHANGELOG.md with new [X.Y.Z] section

# 3. Run release script
./scripts/release.sh 2.32.0 "New Feature Name"

# 4. Wait for GitHub Actions to publish to npm
# (Check: https://github.com/projectquestorg/AgileFlow/actions)

# 5. Verify publish
npm view agileflow version
```

## 🔧 Troubleshooting

**If GitHub Actions fails**:
- Check that `NPM_TOKEN` secret is configured: https://github.com/projectquestorg/AgileFlow/settings/secrets/actions
- Check workflow run logs: https://github.com/projectquestorg/AgileFlow/actions

**If tag already exists**:
```bash
# Delete local and remote tag
git tag -d v2.32.0
git push origin :refs/tags/v2.32.0

# Re-run release script
./scripts/release.sh 2.32.0 "Feature Name"
```

**Manual publish** (if GitHub Actions fails):
```bash
cd packages/cli
npm publish --access public
```

## 🔍 Environment Info Script

**Purpose**: Output project environment information for hooks and automation.

**File**: `scripts/get-env.js`

**Usage**:
```bash
# Human-readable format
node scripts/get-env.js

# JSON format
node scripts/get-env.js --json
```

**Output**:
- Project name, version, description
- Git branch and commit hash
- Node.js version
- Platform and architecture
- Current user and hostname
- Timestamp

**Example output** (human-readable):
```
Project: agileflow v2.35.0
Description: AI-driven agile development system for Claude Code, Cursor, Windsurf, and more
Root Directory: /home/coder/AgileFlow
Git Branch: main
Git Commit: 45bb0da
Node Version: v18.20.8
Platform: linux (x64)
User: coder@ProjectQuest
Timestamp: 2025-12-15T20:31:44.742Z
```

**Example output** (JSON):
```json
{
  "project": {
    "name": "agileflow",
    "version": "2.35.0",
    "description": "AI-driven agile development system...",
    "rootDir": "/home/coder/AgileFlow"
  },
  "git": {
    "branch": "main",
    "commit": "45bb0da"
  },
  "system": {
    "node": "v18.20.8",
    "platform": "linux",
    "arch": "x64",
    "hostname": "ProjectQuest",
    "user": "coder"
  },
  "timestamp": "2025-12-15T20:31:44.742Z"
}
```

**Use Cases**:
- Session start hook (display project info)
- CI/CD environment validation
- Debugging environment issues
- Logging and audit trails
- Integration with external tools

## 📁 Auto-Archival Scripts

**Purpose**: Automatically manage `status.json` file size by archiving old completed stories.

### Archive Completed Stories

**File**: `scripts/archive-completed-stories.sh`

**Usage**:
```bash
bash scripts/archive-completed-stories.sh
```

**What it does**:
1. Reads `docs/09-agents/status.json`
2. Identifies stories with `status: "completed"` older than threshold (default: 7 days)
3. Moves them to `docs/09-agents/archive/YYYY-MM.json` (organized by completion month)
4. Removes archived stories from `status.json`
5. Logs what was archived

**Configuration**:
Edit `docs/00-meta/agileflow-metadata.json`:
```json
{
  "archival": {
    "threshold_days": 7,
    "enabled": true
  }
}
```

**Automation**:
- Runs automatically on each session start via `.claude/settings.json` hook
- Runs in background (non-blocking)
- Idempotent (safe to run multiple times)

**Example output**:
```
Starting auto-archival (threshold: 7 days)...
Cutoff date: 2025-12-08T20:41:15.000Z
✓ Archived 3 stories to 2025-11.json
✓ Removed 3 archived stories from status.json
Stories remaining: 5
Auto-archival complete!
```

### Compress Status

**File**: `scripts/compress-status.sh`

**Usage**:
```bash
bash scripts/compress-status.sh
```

**What it does**:
1. Reads `docs/09-agents/status.json`
2. Removes verbose fields from each story (descriptions, notes, acceptance criteria, etc.)
3. Keeps only essential tracking metadata:
   - `id`, `title`, `status`, `owner`
   - `created_at`, `updated_at`, `completed_at`
   - `epic`, `dependencies`, `blocked_by`, `blocks`
   - `pr_url`, `test_status`, `priority`, `tags`
4. Updates `status.json` with compressed version
5. Reports size savings

**When to use**:
- When `status.json` grows too large
- Before committing to git
- As part of cleanup workflow
- Manually when needed (not automated)

**Example output**:
```
Compressing status.json...
✓ Removed 15 verbose fields
Stories processed: 8
Compression complete!
Original size: 12543 bytes
New size: 4821 bytes
Saved: 7722 bytes (61%)
```

### Archive Directory Structure

```
docs/09-agents/
├── status.json              # Active stories only
├── archive/
│   ├── 2025-11.json        # Stories completed in Nov 2025
│   ├── 2025-12.json        # Stories completed in Dec 2025
│   └── ...
└── bus/
    └── log.jsonl
```

**Archive file format**:
```json
{
  "month": "2025-11",
  "archived_at": "2025-12-15T20:41:15.983Z",
  "stories": {
    "US-001": {
      "id": "US-001",
      "title": "Old completed story",
      "status": "completed",
      "completed_at": "2025-11-05T15:00:00.000Z",
      ...
    }
  }
}
```

**Benefits**:
- Keeps `status.json` small and fast to process
- Preserves historical data in organized archives
- No manual intervention required
- Easy to retrieve archived stories by month
- Reduces git diff noise
- Faster parsing for slash commands
