---
description: Plan, build, and improve database feature with expertise-driven workflow
argument-hint: <database feature description>
variables:
  EXPERTISE_FILE: packages/cli/src/core/experts/database/expertise.yaml
---

# Database Expert: Plan → Build → Self-Improve

You are executing a complete database feature implementation with automatic knowledge capture. This workflow ensures you leverage existing database expertise, execute efficiently, and capture learnings for future tasks.

## CRITICAL: Three-Step Workflow

**You MUST follow this exact sequence. Do not skip steps.**

---

## Step 1: PLAN (Expertise-Informed)

### 1.1 Load Your Expertise
Read your expertise file at `{{EXPERTISE_FILE}}` FIRST.

Extract from it:
- Schema file locations (migrations, models)
- Existing table relationships
- Naming conventions (snake_case, prefixes)
- Migration patterns
- Recent learnings that might apply

### 1.2 Validate Against Codebase
Before planning, verify your expertise is accurate:

```bash
# Check schema files exist
ls -la src/db/ prisma/ migrations/ 2>/dev/null || true

# Check for recent changes
git log --oneline -5 -- "**/*migration*" "**/*schema*" "**/prisma*" 2>/dev/null || true
```

Note any discrepancies between expertise and actual state.

### 1.3 Create Implementation Plan
Based on validated expertise, create a specific plan:

```markdown
## Database Implementation Plan

### Schema Changes
1. [Table name] - [columns, types, constraints]
2. [Index/constraint changes]

### Migration Strategy
- Migration file: [path/filename]
- Rollback plan: [how to reverse]

### Related Files
- [model file if ORM used]
- [seed data if applicable]

### Pattern to Follow
[Reference specific pattern from expertise - e.g., "Use timestamps pattern from users table"]

### Validation
- [ ] Migration runs without errors
- [ ] Foreign keys valid
- [ ] Indexes created properly
```

**Output**: A detailed plan with exact file paths and specific changes.

---

## Step 2: BUILD (Execute Plan)

### 2.1 Pre-Build Verification
Before making changes:
- Ensure referenced tables exist
- Verify ORM client is in sync
- Check for pending migrations

### 2.2 Execute the Plan
Follow your implementation plan:

**For Prisma projects:**
```bash
# After schema changes
npx prisma generate
npx prisma migrate dev --name descriptive_name
```

**For raw SQL migrations:**
```bash
# Create migration file following naming convention
# Run migration
```

### 2.3 Capture Changes
After building, document what changed:

```bash
# Capture the diff for self-improve
git diff --name-only | grep -E "(schema|migration|model|prisma)"
git diff HEAD
```

### 2.4 Validate Build
Verify the implementation:
- Migration completed successfully
- Database schema reflects changes
- Related models/types updated
- No type errors

**Output**: Working schema changes with captured diff.

**On Failure**: Stop and report the error. Do NOT proceed to self-improve.

---

## Step 3: SELF-IMPROVE (Update Expertise)

**ONLY run this step if Step 2 succeeded.**

### 3.1 Analyze What Changed
Review the git diff and identify:
- New tables added
- New columns on existing tables
- New relationships (foreign keys)
- New indexes or constraints
- New migration patterns used

### 3.2 Update Expertise File
Read and update `{{EXPERTISE_FILE}}`:

**Update `files` section if:**
```yaml
files:
  migrations:
    - path: path/to/new/migration
      purpose: "New table for [feature]"
```

**Update `relationships` section if:**
```yaml
relationships:
  - from: new_table
    to: existing_table
    type: belongs_to
    foreign_key: existing_table_id
```

**Update `patterns` section if:**
New pattern discovered or confirmed.

**Update `conventions` section if:**
New naming or structural conventions applied.

### 3.3 Add Learnings Entry
**ALWAYS** add a new learnings entry:

```yaml
learnings:
  - date: 2025-12-16
    insight: "Added [table] for [purpose]"
    files_affected:
      - path/to/migration
      - path/to/model
    context: "Feature: {{argument}}"
```

### 3.4 Validate Updated Expertise
Before saving:
- [ ] All file paths exist
- [ ] Relationships match actual foreign keys
- [ ] `last_updated` is current
- [ ] No duplicate table entries
- [ ] File stays focused (<200 lines)

### 3.5 Save Expertise
Write the updated expertise.yaml file.

---

## Database-Specific Error Handling

### If Migration Fails
- Check for conflicting migrations
- Verify foreign key references exist
- Check for duplicate table/column names
- Rollback if partial migration occurred

### If Validation Fails
- Type errors: regenerate ORM client
- FK errors: verify referenced tables exist
- Index errors: check for duplicate index names

---

## Example Usage

**Request**: "Add a sessions table to track user logins"

**Step 1 Output** (Plan):
```markdown
## Database Implementation Plan

### Schema Changes
1. sessions table - id, user_id (FK), token, ip_address, user_agent, expires_at, created_at

### Migration Strategy
- File: prisma/migrations/20251216_add_sessions
- Rollback: DROP TABLE sessions;

### Pattern to Follow
Using timestamps pattern from users table (created_at, updated_at)
Using uuid for id (matching users.id pattern)
```

**Step 2 Output** (Build):
- Created migration file
- Ran `npx prisma migrate dev`
- Generated new Prisma client
- Diff: prisma/schema.prisma, prisma/migrations/...

**Step 3 Output** (Self-Improve):
- Added sessions to tables list
- Added sessions→users relationship
- Added learning: "Added sessions table for auth tracking"

---

## Feature Request

{{argument}}
