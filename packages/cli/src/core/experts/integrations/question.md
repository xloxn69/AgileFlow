# Integrations Expert - Question Workflow

**Purpose**: Answer questions about third-party integrations using expertise-first approach.

## Workflow

### Step 1: Load Expertise
```
Read: packages/cli/src/core/experts/integrations/expertise.yaml
```

Parse the expertise file to understand:
- Known integration client locations
- Webhook handler patterns
- Environment variable conventions
- Retry and error handling patterns
- Active integrations catalog

### Step 2: Validate Against Codebase

Before answering, verify expertise is current:
1. Check if mentioned files/directories exist
2. Spot-check integration clients mentioned
3. Verify environment variables documented
4. Note any discrepancies for later self-improve

### Step 3: Answer with Expertise

When answering questions:

**If expertise covers the question:**
- Provide direct answer from expertise
- Include specific file paths
- Reference patterns (retry logic, webhook validation)
- Include required environment variables
- Skip unnecessary exploration

**If expertise is incomplete:**
- Search codebase for missing information
- Answer the question
- Note gaps for self-improve

### Step 4: Flag Updates Needed

If you discovered new information:
```
Note for self-improve:
- New integration discovered: [service]
- Webhook endpoint not documented: [path]
- Environment variable missing: [var]
```

## Example Usage

**Question**: "Where is the Stripe integration?"

**Expertise-First Answer**:
1. Check expertise.yaml → integrations_catalog → payment → Stripe
2. Check file locations → `src/integrations/clients/`
3. Answer: "Stripe client is in `src/integrations/clients/StripeClient.ts`. Required env vars: `STRIPE_API_KEY`, `STRIPE_WEBHOOK_SECRET`. Webhook handlers in `src/integrations/webhooks/`."

**Question**: "How do we handle webhook signature validation?"

**Expertise-First Answer**:
1. Check expertise.yaml → patterns → Webhook Handler Pattern
2. Reference the pattern description
3. Answer with specific implementation location

## Key Principles

1. **Expertise First**: Always check expertise.yaml before searching
2. **Security Focus**: Always mention required env vars and signature validation
3. **Be Specific**: Provide exact file paths and required configuration
4. **Learn**: Note gaps for self-improve to fill later
