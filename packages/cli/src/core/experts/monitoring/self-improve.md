# Monitoring Expert - Self-Improve Workflow

**Purpose**: Automatically update expertise.yaml after completing monitoring work.

## When to Run

Run this workflow after:
- Adding new metrics or logging
- Creating dashboards or alerts
- Writing incident runbooks
- Updating health checks
- Discovering observability insights

## Workflow

### Step 1: Load Current Expertise
```
Read: packages/cli/src/core/experts/monitoring/expertise.yaml
```

### Step 2: Analyze Changes Made

Review what was just implemented:
1. What new metrics were added?
2. What logging changes were made?
3. What dashboards or alerts were created?
4. What runbooks were written?
5. What was learned during implementation?

### Step 3: Generate Diff

Identify what's new or changed:
- New metric types or names
- New logging patterns
- New alert rules
- SLO changes
- Health check updates

### Step 4: Update Expertise

Add a new learning entry:
```yaml
learnings:
  - date: YYYY-MM-DD
    insight: "Brief description of what was learned"
    files_affected:
      - path/to/file1
      - path/to/file2
    context: "Story or task context"
```

Update other sections as needed:
- Add new files to `files:`
- Add new patterns to `patterns:`
- Update `slo_targets:` if changed

### Step 5: Validate Update

Ensure the expertise file:
- Is valid YAML
- Has updated `last_updated` date
- All alerts have linked runbooks
- SLO targets are current

## Learning Categories

### New Metrics
```yaml
learnings:
  - date: 2025-12-16
    insight: "Added cache_hit_ratio gauge metric for Redis monitoring"
    files_affected:
      - src/metrics/cache.ts
      - monitoring/dashboards/cache.json
    context: "US-0080: Add cache monitoring"
```

### Logging Improvements
```yaml
learnings:
  - date: 2025-12-16
    insight: "Added trace_id propagation through async context"
    files_affected:
      - src/logging/context.ts
      - src/logging/middleware.ts
    context: "US-0081: Improve distributed tracing"
```

### Alert Tuning
```yaml
learnings:
  - date: 2025-12-16
    insight: "Error rate alert needs 5-minute window to reduce noise from transient spikes"
    files_affected: [monitoring/alerts/api-alerts.yaml]
    context: "US-0082: Reduce alert fatigue"
```

### Runbook Additions
```yaml
learnings:
  - date: 2025-12-16
    insight: "Created runbook for database connection pool exhaustion"
    files_affected: [monitoring/runbooks/db-pool-exhausted.md]
    context: "US-0083: Incident response preparation"
```

### SLO Updates
```yaml
learnings:
  - date: 2025-12-16
    insight: "Updated latency SLO from p95 <200ms to p95 <150ms after optimization"
    files_affected:
      - monitoring/slo/api-slo.yaml
      - docs/slo/api-targets.md
    context: "US-0084: Tighten SLO after performance work"
```

## Example Update

Before work:
```yaml
slo_targets:
  availability: "99.9%"
  latency_p95: "<200ms"
```

After performance optimization:
```yaml
slo_targets:
  availability: "99.9%"
  latency_p50: "<50ms"
  latency_p95: "<150ms"
  latency_p99: "<300ms"

learnings:
  - date: 2025-12-16
    insight: "After caching optimization, can tighten latency SLOs significantly"
    files_affected:
      - monitoring/slo/api-slo.yaml
      - monitoring/dashboards/slo-dashboard.json
    context: "US-0085: Update SLOs post-optimization"
```

## Key Principles

1. **Alert Hygiene**: Note any alert tuning to reduce noise
2. **Runbook Links**: Every alert needs a runbook reference
3. **SLO Evolution**: Track SLO changes over time
4. **Correlation IDs**: Always ensure tracing context is preserved
5. **Security**: Never log sensitive data (PII, secrets)
