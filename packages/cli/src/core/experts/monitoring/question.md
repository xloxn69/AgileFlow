# Monitoring Expert - Question Workflow

**Purpose**: Answer questions about monitoring and observability using expertise-first approach.

## Workflow

### Step 1: Load Expertise
```
Read: packages/cli/src/core/experts/monitoring/expertise.yaml
```

Parse the expertise file to understand:
- Known logging and metrics file locations
- Structured logging patterns
- Metric types and naming
- Health check implementations
- Alert rules and runbooks
- SLO targets

### Step 2: Validate Against Codebase

Before answering, verify expertise is current:
1. Check if mentioned files/directories exist
2. Spot-check logging implementation
3. Verify metrics endpoint exists
4. Note any discrepancies for later self-improve

### Step 3: Answer with Expertise

When answering questions:

**If expertise covers the question:**
- Provide direct answer from expertise
- Include specific file paths
- Reference patterns (RED metrics, structured logging)
- Include SLO targets where relevant
- Skip unnecessary exploration

**If expertise is incomplete:**
- Search codebase for missing information
- Answer the question
- Note gaps for self-improve

### Step 4: Flag Updates Needed

If you discovered new information:
```
Note for self-improve:
- New metric discovered: [metric_name]
- Alert not documented: [alert]
- Runbook missing: [incident_type]
```

## Example Usage

**Question**: "Where is the logger configured?"

**Expertise-First Answer**:
1. Check expertise.yaml → files → logging → logger.ts
2. Verify file exists at `src/logging/logger.ts`
3. Answer: "Logger is configured in `src/logging/logger.ts`. It exports a singleton logger instance. Request context for correlation IDs is in `src/logging/context.ts`."

**Question**: "What are our SLO targets?"

**Expertise-First Answer**:
1. Check expertise.yaml → slo_targets
2. List: availability 99.9%, latency p50 <100ms, p95 <200ms, error rate <0.1%
3. Answer with targets and where they're monitored

## Key Principles

1. **Expertise First**: Always check expertise.yaml before searching
2. **Security Focus**: Never log PII, passwords, or API keys
3. **Correlation IDs**: Always include request_id/trace_id in logs
4. **Runbooks**: Every alert should have a linked runbook
5. **Learn**: Note gaps for self-improve to fill later
