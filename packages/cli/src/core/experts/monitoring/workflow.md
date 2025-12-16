# Monitoring Expert - Complete Workflow

**Purpose**: End-to-end workflow for implementing monitoring with expertise-first approach.

## The Three-Step Workflow

```
Plan (with Expertise) → Build (Execute) → Self-Improve (Update Expertise)
```

---

## Step 1: Plan (with Expertise)

### 1.1 Load Expertise First
```
Read: packages/cli/src/core/experts/monitoring/expertise.yaml
```

Parse and internalize:
- Known logging and metrics locations
- Structured logging patterns
- Metric types (counter, gauge, histogram)
- Health check implementations
- Alert rules and runbooks
- SLO targets

### 1.2 Validate Expertise Against Codebase

Before planning, verify expertise is current:
```bash
# Check monitoring implementation exists
ls src/logging/
ls src/metrics/
ls monitoring/alerts/
```

Note any discrepancies for later update.

### 1.3 Create Detailed Plan

With expertise loaded, create implementation plan:

1. **Identify monitoring gap** (from expertise)
2. **Determine metric types needed** (counter, gauge, histogram)
3. **Plan alert thresholds** based on SLO targets
4. **Create runbook outline** for the alert

Example Plan:
```markdown
## Implementation Plan: Add Database Monitoring

### From Expertise:
- Metrics location: src/metrics/
- Metric types: RED (Rate, Errors, Duration)
- SLO targets: p95 <200ms, error rate <0.1%
- Every alert needs runbook

### Metrics to Add:
- db_query_duration_seconds (histogram)
- db_query_total (counter)
- db_query_errors_total (counter)
- db_connection_pool_size (gauge)
- db_connection_pool_available (gauge)

### Alerts to Create:
- DatabaseSlowQueries: p95 query time >200ms
- DatabaseConnectionPoolExhausted: available <5

### Runbooks to Write:
- monitoring/runbooks/db-slow-queries.md
- monitoring/runbooks/db-pool-exhausted.md

### Implementation Steps:
1. Add metrics collection to database client
2. Create Grafana dashboard for database metrics
3. Configure alerts with thresholds
4. Write runbooks for each alert
5. Test alerting in staging
```

---

## Step 2: Build (Execute Plan)

### 2.1 Execute Implementation

Follow the plan exactly:
- Use metric naming from expertise
- Apply structured logging pattern
- Follow runbook template

### 2.2 Handle Discoveries

If you discover something not in expertise:
```markdown
## Discovery Log
- Found: Connection pool metrics require custom instrumentation
- Pattern: Use histogram for latency, counter for errors
- Gotcha: Prometheus labels have cardinality limits
```

### 2.3 Security Checklist

Per expertise conventions:
- ✅ No PII in logs
- ✅ No secrets in logs
- ✅ Request ID included for correlation
- ✅ Appropriate log levels used

### 2.4 Capture Changes

Document what was actually changed:
```markdown
## Changes Made
- Created: src/metrics/database.ts
- Created: monitoring/dashboards/database.json
- Created: monitoring/alerts/database-alerts.yaml
- Created: monitoring/runbooks/db-slow-queries.md
- Created: monitoring/runbooks/db-pool-exhausted.md
```

---

## Step 3: Self-Improve (Update Expertise)

### 3.1 Load Current Expertise
```
Read: packages/cli/src/core/experts/monitoring/expertise.yaml
```

### 3.2 Identify Updates Needed

Compare discoveries with current expertise:
- New metric files?
- New alert rules?
- New runbooks?
- SLO adjustments?

### 3.3 Update Expertise File

Add to files section:
```yaml
files:
  metrics:
    - path: src/metrics/database.ts
      purpose: "Database query metrics"
```

Add learning entry:
```yaml
learnings:
  - date: 2025-12-16
    insight: "Database connection pool needs prometheus-client custom collector"
    files_affected:
      - src/metrics/database.ts
    context: "US-0120: Database monitoring"
```

Update `last_updated` date.

### 3.4 Validate Update

Ensure expertise.yaml:
- Is valid YAML
- All alerts have runbook references
- SLO targets are current

---

## Quick Reference

### Before ANY Monitoring Work
```
1. Read expertise.yaml
2. Check existing metrics and alerts
3. Identify SLO targets
4. Plan runbooks for new alerts
```

### After ANY Monitoring Work
```
1. Document new metrics
2. Link alerts to runbooks
3. Update SLO targets if changed
4. Update expertise.yaml
```

### Metric Types (from expertise)
- **Counter**: Cumulative (requests_total, errors_total)
- **Gauge**: Current value (connections, queue_size)
- **Histogram**: Distribution (duration, size)

### Log Levels (from expertise)
- **ERROR**: Service unavailable, data loss
- **WARN**: Degraded, unexpected but handled
- **INFO**: Important state changes
- **DEBUG**: Diagnostic info (dev only)

---

## Example: Complete Monitoring Implementation

**Task**: Add API endpoint monitoring

### Plan Phase
```markdown
From expertise:
- RED metrics pattern (Rate, Errors, Duration)
- SLO: p95 <200ms, error rate <0.1%
- Every alert needs runbook

Metrics:
- http_request_total (counter)
- http_request_duration_seconds (histogram)
- http_request_errors_total (counter)

Alerts:
- HighLatency: p95 >200ms for 5 minutes
- HighErrorRate: error rate >0.1% for 5 minutes

Runbooks:
- high-latency.md
- high-error-rate.md
```

### Build Phase
```markdown
Created:
- src/metrics/http.ts
- monitoring/dashboards/api-overview.json
- monitoring/alerts/api-alerts.yaml
- monitoring/runbooks/high-latency.md
- monitoring/runbooks/high-error-rate.md

Discoveries:
- Need request_id label for correlation
- 5-minute window reduces alert noise
- Should add endpoint label for drill-down
```

### Self-Improve Phase
```yaml
patterns:
  - name: HTTP Metrics Middleware
    description: "Collect RED metrics for all HTTP endpoints"
    location: src/metrics/middleware.ts

learnings:
  - date: 2025-12-16
    insight: "5-minute alerting window reduces transient spike noise by 80%"
    files_affected:
      - monitoring/alerts/api-alerts.yaml
    context: "US-0121: API monitoring"

# Updated SLO if needed:
slo_targets:
  latency_p95: "<200ms"
  error_rate: "<0.1%"
```

---

This workflow ensures comprehensive observability and continuous improvement.
