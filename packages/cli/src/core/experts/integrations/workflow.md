# Integrations Expert - Complete Workflow

**Purpose**: End-to-end workflow for implementing third-party integrations with expertise-first approach.

## The Three-Step Workflow

```
Plan (with Expertise) → Build (Execute) → Self-Improve (Update Expertise)
```

---

## Step 1: Plan (with Expertise)

### 1.1 Load Expertise First
```
Read: packages/cli/src/core/experts/integrations/expertise.yaml
```

Parse and internalize:
- Known integration client locations
- Existing integrations catalog
- Webhook handler patterns
- Error handling conventions
- Environment variable requirements

### 1.2 Validate Expertise Against Codebase

Before planning, verify expertise is current:
```bash
# Check key directories exist
ls src/integrations/clients/
ls src/integrations/webhooks/
```

Note any discrepancies for later update.

### 1.3 Create Detailed Plan

With expertise loaded, create implementation plan:

1. **Check if similar integration exists** (from catalog)
2. **Identify required patterns** (retry, webhook validation, etc.)
3. **List environment variables needed**
4. **Plan error handling strategy**

Example Plan:
```markdown
## Implementation Plan: Add Twilio SMS Integration

### From Expertise:
- Client location: src/integrations/clients/
- Webhook location: src/integrations/webhooks/
- Pattern: Retry with exponential backoff
- Pattern: Webhook signature validation

### Environment Variables:
- TWILIO_ACCOUNT_SID
- TWILIO_AUTH_TOKEN
- TWILIO_WEBHOOK_SECRET

### Files to Create:
- src/integrations/clients/TwilioClient.ts
- src/integrations/webhooks/TwilioWebhookHandler.ts

### Implementation Steps:
1. Create TwilioClient with retry logic
2. Implement SMS sending method
3. Create webhook handler with signature validation
4. Add environment variable documentation
5. Write integration tests with mocks
```

---

## Step 2: Build (Execute Plan)

### 2.1 Execute Implementation

Follow the plan exactly:
- Use file paths from expertise
- Apply patterns (retry, webhook validation) from expertise
- Follow security conventions (no hardcoded secrets)

### 2.2 Handle Discoveries

If you discover something not in expertise:
```markdown
## Discovery Log
- Found: Twilio returns 429 with Retry-After header
- Pattern: Queue-based rate limiting more effective than token bucket
- Gotcha: Webhook signature uses raw body, not parsed JSON
```

### 2.3 Security Checklist

Per expertise conventions:
- ✅ API keys in environment variables
- ✅ Webhook signatures validated
- ✅ No secrets in logs or errors
- ✅ Retry logic with exponential backoff
- ✅ Rate limiting respected

### 2.4 Capture Changes

Document what was actually changed:
```markdown
## Changes Made
- Created: src/integrations/clients/TwilioClient.ts
- Created: src/integrations/webhooks/TwilioWebhookHandler.ts
- Updated: .env.example (added Twilio vars)
- Created: src/integrations/__tests__/TwilioClient.test.ts
```

---

## Step 3: Self-Improve (Update Expertise)

### 3.1 Load Current Expertise
```
Read: packages/cli/src/core/experts/integrations/expertise.yaml
```

### 3.2 Identify Updates Needed

Compare discoveries with current expertise:
- New integration to add to catalog?
- New environment variables documented?
- New webhook endpoints?
- Error handling learnings?

### 3.3 Update Expertise File

Add to integrations_catalog:
```yaml
integrations_catalog:
  messaging:
    - name: Twilio
      env_vars: [TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WEBHOOK_SECRET]
      webhooks: [message.delivered, message.failed, message.received]
```

Add learning entry:
```yaml
learnings:
  - date: 2025-12-16
    insight: "Twilio webhook validation requires X-Twilio-Signature header and raw body"
    files_affected:
      - src/integrations/webhooks/TwilioWebhookHandler.ts
    context: "US-0100: Add Twilio SMS support"
```

Update `last_updated` date.

### 3.4 Validate Update

Ensure expertise.yaml:
- Is valid YAML
- All env vars documented
- Reflects current integrations

---

## Quick Reference

### Before ANY Integration Work
```
1. Read expertise.yaml
2. Check integrations_catalog for similar services
3. Identify required patterns
4. Plan with security in mind
```

### After ANY Integration Work
```
1. Add new integration to catalog
2. Document all environment variables
3. Note webhook handling requirements
4. Update expertise.yaml
```

### Key Patterns (from expertise)
- API Client Pattern: Wrap SDK for testability
- Webhook Handler Pattern: Validate → Check idempotency → Process → Respond 200
- Retry Pattern: Exponential backoff with jitter
- Circuit Breaker: Stop calling failing services

### Security Conventions (from expertise)
- NEVER hardcode API keys
- ALWAYS validate webhook signatures
- ALWAYS implement retry with backoff
- ALWAYS log without secrets

---

## Example: Complete Integration Implementation

**Task**: Integrate Stripe for payments

### Plan Phase
```markdown
From expertise:
- Client pattern: src/integrations/clients/
- Webhook pattern: signature validation required
- Similar integration: See PayPal in catalog

Plan:
1. Create StripeClient.ts
2. Implement payment methods
3. Create webhook handler with signature validation
4. Add idempotency for webhook events
5. Document env vars
```

### Build Phase
```markdown
Created:
- src/integrations/clients/StripeClient.ts
- src/integrations/webhooks/StripeWebhookHandler.ts

Discoveries:
- Stripe requires raw body for webhook signature
- Need to use stripe.webhooks.constructEvent()
- Idempotency key useful for create operations
```

### Self-Improve Phase
```yaml
integrations_catalog:
  payment:
    - name: Stripe
      env_vars: [STRIPE_API_KEY, STRIPE_WEBHOOK_SECRET]
      webhooks: [payment_intent.succeeded, charge.refunded, subscription.updated]

learnings:
  - date: 2025-12-16
    insight: "Stripe webhooks need express.raw() middleware before json parsing"
    files_affected:
      - src/integrations/webhooks/StripeWebhookHandler.ts
      - src/app.ts
    context: "US-0101: Stripe payment integration"
```

---

This workflow ensures secure integrations and continuous learning.
