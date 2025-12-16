# Integrations Expert - Self-Improve Workflow

**Purpose**: Automatically update expertise.yaml after completing integration work.

## When to Run

Run this workflow after:
- Adding a new third-party integration
- Implementing webhook handlers
- Updating API client implementations
- Discovering new integration patterns
- Adding new environment variables

## Workflow

### Step 1: Load Current Expertise
```
Read: packages/cli/src/core/experts/integrations/expertise.yaml
```

### Step 2: Analyze Changes Made

Review what was just implemented:
1. What new integration clients were created?
2. What webhook handlers were added?
3. What environment variables are required?
4. What error handling patterns were used?
5. What was learned during implementation?

### Step 3: Generate Diff

Identify what's new or changed:
- New integrations not in catalog
- New webhook endpoints
- New environment variables
- Pattern changes or improvements
- Gotchas and edge cases discovered

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

Update integrations_catalog if new service added:
```yaml
integrations_catalog:
  category:
    - name: ServiceName
      env_vars: [VAR1, VAR2]
      webhooks: [event.type1, event.type2]
```

### Step 5: Validate Update

Ensure the expertise file:
- Is valid YAML
- Has updated `last_updated` date
- Doesn't exceed ~200 lines
- All environment variables documented

## Learning Categories

### New Integrations
```yaml
learnings:
  - date: 2025-12-16
    insight: "Added Plaid integration for bank account linking"
    files_affected:
      - src/integrations/clients/PlaidClient.ts
      - src/integrations/webhooks/PlaidWebhookHandler.ts
    context: "US-0060: Bank account verification"

# Also update integrations_catalog:
integrations_catalog:
  banking:
    - name: Plaid
      env_vars: [PLAID_CLIENT_ID, PLAID_SECRET, PLAID_ENV]
      webhooks: [ITEM_LOGIN_REQUIRED, TRANSACTIONS_READY]
```

### Webhook Learnings
```yaml
learnings:
  - date: 2025-12-16
    insight: "Stripe webhooks require raw body for signature validation"
    files_affected: [src/integrations/webhooks/StripeWebhookHandler.ts]
    context: "US-0061: Fix webhook signature verification"
```

### Error Handling Discoveries
```yaml
learnings:
  - date: 2025-12-16
    insight: "Twilio returns 429 with Retry-After header - use that value for backoff"
    files_affected: [src/integrations/clients/TwilioClient.ts]
    context: "US-0062: Improve SMS retry logic"
```

### Security Insights
```yaml
learnings:
  - date: 2025-12-16
    insight: "Auth0 tokens must be validated server-side, not just decoded"
    files_affected: [src/services/auth/Auth0Service.ts]
    context: "US-0063: Security audit fixes"
```

## Example Update

Before work:
```yaml
integrations_catalog:
  payment:
    - name: Stripe
      env_vars: [STRIPE_API_KEY, STRIPE_WEBHOOK_SECRET]
```

After adding PayPal:
```yaml
integrations_catalog:
  payment:
    - name: Stripe
      env_vars: [STRIPE_API_KEY, STRIPE_WEBHOOK_SECRET]
    - name: PayPal
      env_vars: [PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_WEBHOOK_ID]
      webhooks: [PAYMENT.CAPTURE.COMPLETED, PAYMENT.CAPTURE.DENIED]

learnings:
  - date: 2025-12-16
    insight: "PayPal webhook validation requires fetching verification from PayPal API"
    files_affected:
      - src/integrations/clients/PayPalClient.ts
      - src/integrations/webhooks/PayPalWebhookHandler.ts
    context: "US-0064: Add PayPal payment support"
```

## Key Principles

1. **Document All Env Vars**: Every integration needs documented configuration
2. **Webhook Security**: Always note signature validation requirements
3. **Error Patterns**: Document retry strategies and error handling
4. **Rate Limits**: Note any rate limiting behavior discovered
5. **Test Credentials**: Note if sandbox/test mode available
