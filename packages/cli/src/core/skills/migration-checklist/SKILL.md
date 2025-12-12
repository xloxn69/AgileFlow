---
name: migration-checklist
description: Generate data migration checklist with validation, rollback, and zero-downtime procedures
---

# migration-checklist

Generate data migration checklist.

## Activation Keywords
- "migration", "zero-downtime", "data migration", "migration checklist"

## When to Use
- Planning data migrations (schema changes, zero-downtime)
- Moving data between systems
- Large-scale data transformations

## What This Does
Generates comprehensive migration checklist including:
- **Pre-migration validation** (backup, verify counts)
- **Migration phases** (dual-write, backfill, switch)
- **Rollback procedures** (tested and documented)
- **Data validation rules** (checksums, counts, integrity)
- **Monitoring during migration** (watch for anomalies)
- **Post-migration verification** (smoke tests, queries)
- **Cleanup procedures** (remove old schema/data)
- **Communication timeline**

Coordinates with datamigration agent for detailed migration planning.

## Output
Ready-to-execute migration checklist

## Example Activation
User: "Plan zero-downtime migration from sessions to JWT"
Skill: Generates:
```markdown
## Migration Checklist: Session → JWT Migration

### Phase 1: Preparation (pre-migration)
- [ ] Create full database backup (test restore)
- [ ] Verify staging matches production (data volume, schema)
- [ ] Prepare rollback procedure (documented and tested)
- [ ] Brief team on timeline and communication
- [ ] Schedule 2-hour maintenance window
- [ ] Set up monitoring dashboards

### Phase 2: Dual-Write (no downtime)
- [ ] Deploy code that writes to BOTH sessions + JWT
- [ ] Monitor for errors (should be zero)
- [ ] Backfill JWT for existing sessions (background job)
- [ ] Track conversion progress (% of sessions migrated)
- [ ] Once 100% converted: Wait 24h for safety

### Phase 3: Verify
- [ ] Check record counts match:
  - SELECT COUNT(*) FROM sessions
  - SELECT COUNT(*) FROM jwt_tokens
  - Should be equal
- [ ] Validate JWT expiration timestamps
- [ ] Check no orphaned sessions
- [ ] Spot-check 100 random sessions

### Phase 4: Switch Reads
- [ ] Deploy code to read from JWT instead of sessions
- [ ] Monitor error rate (should be zero)
- [ ] Keep writing to BOTH for 24h (safety)
- [ ] Verify user experience

### Phase 5: Cleanup
- [ ] Stop writing to sessions table
- [ ] Archive sessions (backup)
- [ ] Drop sessions table
- [ ] Update documentation

### Rollback Point
If issues during Phase 1-2: Revert to code writing sessions only (backward compatible)
If issues during Phase 3-4: Switch reads back to sessions (keep JWT as backup)

**Estimated Timeline**: 3-4 hours total
**Expected Downtime**: 0 (zero-downtime migration)
```
