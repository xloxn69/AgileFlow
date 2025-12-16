---
description: Update database expertise after making schema/query changes
argument-hint: [optional context about what changed]
variables:
  EXPERTISE_FILE: packages/cli/src/core/experts/database/expertise.yaml
---

# Database Expert - Self-Improve

You are updating your mental model (expertise file) to reflect database changes. This keeps your expertise accurate and useful for future tasks.

## CRITICAL: Self-Improve Workflow

### Step 1: Read Current Expertise
Load your expertise file at `{{EXPERTISE_FILE}}`.

Understand what you currently know about:
- Schema file locations
- Migration patterns
- Table relationships
- Query conventions

### Step 2: Analyze What Changed
Identify database changes using:

**Check git diff for database files:**
```bash
git diff HEAD~1 --name-only | grep -E "(schema|migration|model|db|prisma|drizzle)"
```

**Look for:**
- New tables/models added
- Schema modifications (new columns, changed types)
- New migrations created
- New query patterns introduced
- Relationship changes (foreign keys added/removed)

### Step 3: Update Expertise

**Update `files` section if:**
- New schema/model files were added
- File locations changed
- New query/repository files created

**Update `relationships` section if:**
- New foreign keys added
- Tables now reference each other
- Cascade behavior changed
- Relationships removed

Example addition:
```yaml
relationships:
  - parent: users
    child: sessions
    type: one-to-many
    cascade: delete
    foreign_key: user_id
```

**Update `patterns` section if:**
- New database patterns introduced
- Existing patterns modified
- Better approaches discovered

**Update `conventions` section if:**
- New naming conventions established
- Conventions changed project-wide

**ALWAYS add to `learnings` section:**
```yaml
learnings:
  - date: 2025-12-16
    insight: "Added sessions table for user login tracking"
    files_affected:
      - prisma/schema.prisma
      - src/db/migrations/20251216_add_sessions.ts
    context: "US-0042 - User session management"
```

### Step 4: Validate Updated Model
After updating, verify:
1. All schema file paths still exist
2. Relationships match actual foreign keys in schema
3. No orphaned references to deleted tables
4. Conventions match what's actually in codebase

### Step 5: Write Updated Expertise
Save the updated expertise.yaml file with:
- Updated `last_updated` timestamp
- New/modified sections
- New learnings entry

## Database-Specific Rules

### DO:
- Track all table relationships
- Note index additions
- Record migration patterns
- Document query optimizations discovered
- Update when ORM/database type changes

### DON'T:
- Store actual data or credentials
- Include sensitive column details
- Keep references to dropped tables
- Document one-off queries (only patterns)

## Quality Checklist

Before saving:
- [ ] `last_updated` is today's date
- [ ] All schema file paths verified
- [ ] Relationships match actual foreign keys
- [ ] New learnings entry added
- [ ] No references to non-existent tables
- [ ] Expertise stays focused (<200 lines)

## Context

{{argument}}
