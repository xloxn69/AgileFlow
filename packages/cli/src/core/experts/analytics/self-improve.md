# Analytics Expert - Self-Improve Workflow

**Purpose**: Automatically update expertise.yaml after completing analytics work.

## When to Run

Run this workflow after:
- Adding new event tracking
- Creating new metrics or dashboards
- Updating event schemas
- Implementing new analytics features
- Discovering privacy or data quality issues

## Workflow

### Step 1: Load Current Expertise
```
Read: packages/cli/src/core/experts/analytics/expertise.yaml
```

### Step 2: Analyze Changes Made

Review what was just implemented:
1. What new events were added?
2. What dashboards or metrics were created?
3. What schemas were defined?
4. What privacy considerations were addressed?
5. What was learned during implementation?

### Step 3: Generate Diff

Identify what's new or changed:
- New events not in event_categories
- New metrics not in key_metrics
- Schema changes
- New tracking patterns
- Privacy or compliance updates

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

Update event_categories if new events added:
```yaml
event_categories:
  category_name:
    - new_event_added
```

### Step 5: Validate Update

Ensure the expertise file:
- Is valid YAML
- Has updated `last_updated` date
- All events follow naming convention
- Privacy considerations documented

## Learning Categories

### New Events
```yaml
learnings:
  - date: 2025-12-16
    insight: "Added checkout funnel events: cart_viewed, checkout_started, payment_submitted"
    files_affected:
      - src/analytics/events/checkout.ts
      - src/analytics/schemas/checkout.ts
    context: "US-0070: Checkout funnel tracking"

# Also update event_categories:
event_categories:
  conversions:
    - cart_viewed
    - checkout_started
    - payment_submitted
    - purchase_completed
```

### Dashboard Learnings
```yaml
learnings:
  - date: 2025-12-16
    insight: "Retention cohort dashboard requires BigQuery for performance"
    files_affected: [docs/analytics/dashboards/retention.md]
    context: "US-0071: Build retention dashboard"
```

### Schema Discoveries
```yaml
learnings:
  - date: 2025-12-16
    insight: "Event properties exceeding 100 keys cause Amplitude to drop events"
    files_affected: [src/analytics/schemas/validation.ts]
    context: "US-0072: Fix event validation"
```

### Privacy Insights
```yaml
learnings:
  - date: 2025-12-16
    insight: "Must hash user_id before sending to analytics per GDPR requirements"
    files_affected:
      - src/analytics/privacy.ts
      - src/analytics/providers/AmplitudeProvider.ts
    context: "US-0073: GDPR compliance update"
```

### A/B Testing Learnings
```yaml
learnings:
  - date: 2025-12-16
    insight: "Need minimum 10k users per variant for statistical significance on conversion"
    files_affected: [docs/analytics/ab-testing.md]
    context: "US-0074: Set up A/B test framework"
```

## Example Update

Before work:
```yaml
event_categories:
  user_actions:
    - button_clicked
    - form_submitted
```

After adding search tracking:
```yaml
event_categories:
  user_actions:
    - button_clicked
    - form_submitted
  search:
    - search_performed
    - search_result_clicked
    - search_filter_applied
    - search_no_results

learnings:
  - date: 2025-12-16
    insight: "Search events need query_length and result_count for analysis"
    files_affected:
      - src/analytics/events/search.ts
      - src/analytics/schemas/search.ts
    context: "US-0075: Implement search analytics"
```

## Key Principles

1. **Event Naming**: Always use object_action snake_case format
2. **Privacy First**: Note any PII handling or consent requirements
3. **Schema Validation**: Document any schema constraints discovered
4. **Data Quality**: Note validation rules and data quality checks
5. **GDPR Compliance**: Always document privacy implications
