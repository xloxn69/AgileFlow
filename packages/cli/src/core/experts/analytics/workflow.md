# Analytics Expert - Complete Workflow

**Purpose**: End-to-end workflow for implementing analytics tracking with expertise-first approach.

## The Three-Step Workflow

```
Plan (with Expertise) → Build (Execute) → Self-Improve (Update Expertise)
```

---

## Step 1: Plan (with Expertise)

### 1.1 Load Expertise First
```
Read: packages/cli/src/core/experts/analytics/expertise.yaml
```

Parse and internalize:
- Known tracking file locations
- Event naming conventions (object_action snake_case)
- Existing event categories
- Key metrics definitions
- Privacy and consent patterns

### 1.2 Validate Expertise Against Codebase

Before planning, verify expertise is current:
```bash
# Check analytics implementation exists
ls src/analytics/
ls src/analytics/events/
```

Note any discrepancies for later update.

### 1.3 Create Detailed Plan

With expertise loaded, create implementation plan:

1. **Check existing event categories** (from expertise)
2. **Follow naming convention** (object_action snake_case)
3. **Define event schema** with required properties
4. **Plan privacy compliance** (consent check, no PII)

Example Plan:
```markdown
## Implementation Plan: Add Search Analytics

### From Expertise:
- Tracking facade: src/analytics/
- Event schemas: src/analytics/schemas/
- Naming convention: object_action snake_case
- Privacy: Check consent before tracking

### Events to Add:
- search_performed
- search_result_clicked
- search_filter_applied
- search_no_results

### Schema Definition:
```typescript
{
  event_name: 'search_performed',
  properties: {
    query: string,           // Search query (anonymized)
    result_count: number,
    filter_count: number,
    search_type: 'global' | 'scoped'
  }
}
```

### Implementation Steps:
1. Define event schemas in src/analytics/schemas/search.ts
2. Add events to catalog in src/analytics/events/search.ts
3. Implement tracking calls in search components
4. Verify consent check before tracking
5. Test events in development
```

---

## Step 2: Build (Execute Plan)

### 2.1 Execute Implementation

Follow the plan exactly:
- Use event naming convention from expertise
- Apply consent pattern from expertise
- Follow schema validation pattern

### 2.2 Handle Discoveries

If you discover something not in expertise:
```markdown
## Discovery Log
- Found: Amplitude has 100 property limit per event
- Pattern: Need to aggregate before sending
- Gotcha: User ID must be hashed for GDPR compliance
```

### 2.3 Privacy Checklist

Per expertise conventions:
- ✅ Consent checked before tracking
- ✅ No PII in event properties
- ✅ User ID hashed/anonymous
- ✅ Event schema validated
- ✅ Documented in event catalog

### 2.4 Capture Changes

Document what was actually changed:
```markdown
## Changes Made
- Created: src/analytics/schemas/search.ts
- Created: src/analytics/events/search.ts
- Modified: src/components/SearchBar.tsx (added tracking)
- Updated: docs/analytics/events.md (documented new events)
```

---

## Step 3: Self-Improve (Update Expertise)

### 3.1 Load Current Expertise
```
Read: packages/cli/src/core/experts/analytics/expertise.yaml
```

### 3.2 Identify Updates Needed

Compare discoveries with current expertise:
- New event categories to add?
- New metrics defined?
- Privacy learnings?
- Schema constraints discovered?

### 3.3 Update Expertise File

Add to event_categories:
```yaml
event_categories:
  search:
    - search_performed
    - search_result_clicked
    - search_filter_applied
    - search_no_results
```

Add learning entry:
```yaml
learnings:
  - date: 2025-12-16
    insight: "Search events need query_length (not full query) to avoid PII"
    files_affected:
      - src/analytics/schemas/search.ts
      - src/analytics/events/search.ts
    context: "US-0110: Search analytics implementation"
```

Update `last_updated` date.

### 3.4 Validate Update

Ensure expertise.yaml:
- Is valid YAML
- All events follow naming convention
- Privacy considerations documented

---

## Quick Reference

### Before ANY Analytics Work
```
1. Read expertise.yaml
2. Check existing event_categories
3. Follow naming convention
4. Plan privacy compliance
```

### After ANY Analytics Work
```
1. Add new events to categories
2. Document any privacy considerations
3. Note schema constraints
4. Update expertise.yaml
```

### Event Naming Convention (from expertise)
- Format: `object_action` in `snake_case`
- Examples: `button_clicked`, `form_submitted`, `page_viewed`
- DO NOT: `buttonClick`, `FormSubmit`, `pageView`

### Privacy Conventions (from expertise)
- NEVER track PII (email, name, phone)
- ALWAYS check consent before tracking
- Hash user IDs before sending
- Validate events against schema

---

## Example: Complete Analytics Implementation

**Task**: Track checkout funnel

### Plan Phase
```markdown
From expertise:
- Event categories exist for conversions
- Must follow object_action naming
- Need consent check

Events to add:
- cart_viewed
- checkout_started
- payment_method_selected
- payment_submitted
- purchase_completed
- purchase_failed
```

### Build Phase
```markdown
Created:
- src/analytics/events/checkout.ts
- src/analytics/schemas/checkout.ts

Properties tracked:
- cart_total (number, not amount string)
- item_count (number)
- payment_method (string, e.g., 'card', 'paypal')
- currency (string, ISO code)

Discoveries:
- Need to track cart_id for funnel correlation
- Should track time_in_step for optimization
```

### Self-Improve Phase
```yaml
event_categories:
  conversions:
    - cart_viewed
    - checkout_started
    - payment_method_selected
    - payment_submitted
    - purchase_completed
    - purchase_failed

key_metrics:
  conversion:
    - cart_to_checkout_rate
    - checkout_completion_rate
    - payment_success_rate

learnings:
  - date: 2025-12-16
    insight: "Checkout funnel needs cart_id to correlate events across sessions"
    files_affected:
      - src/analytics/events/checkout.ts
      - src/analytics/schemas/checkout.ts
    context: "US-0111: Checkout funnel tracking"
```

---

This workflow ensures privacy-compliant analytics and continuous improvement.
