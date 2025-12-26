# Best-of-N Pattern

Run multiple agents on the same task, compare results, select the best.

---

## Overview

The Best-of-N pattern spawns N agents (typically 3) to solve the same problem independently, then compares outputs to select the highest quality result. This trades compute cost for reliability.

```
           ┌─────────────┐
           │   Problem   │
           └──────┬──────┘
      ┌──────────┼──────────┐
      ▼          ▼          ▼
 ┌─────────┐ ┌─────────┐ ┌─────────┐
 │ Agent A │ │ Agent B │ │ Agent C │
 └────┬────┘ └────┬────┘ └────┬────┘
      │          │          │
      ▼          ▼          ▼
 ┌─────────┐ ┌─────────┐ ┌─────────┐
 │Result A │ │Result B │ │Result C │
 └────┬────┘ └────┬────┘ └────┬────┘
      └──────────┼──────────┘
                 ▼
          ┌──────────────┐
          │   Compare    │
          │  & Select    │
          └──────┬───────┘
                 ▼
          ┌──────────────┐
          │ Best Result  │
          └──────────────┘
```

---

## When to Use

| Scenario | Why Best-of-N Helps |
|----------|---------------------|
| **Critical code paths** | Payment processing, auth, data migrations — errors are costly |
| **Low trust situations** | New agent type, unfamiliar domain, first-time task |
| **Multiple valid approaches** | Several architectural patterns could work; let agents explore |
| **Complex algorithms** | Sorting, search, optimization where correctness matters |
| **Security-sensitive code** | Multiple perspectives catch more vulnerabilities |
| **Ambiguous requirements** | Different interpretations surface better solutions |

### When NOT to Use

- Simple, well-defined tasks with one obvious solution
- Cost-sensitive situations where quality is "good enough"
- Time-critical tasks where latency matters more than perfection
- Tasks where agents would produce identical outputs

---

## Implementation

### Step 1: Spawn Parallel Agents

Use `run_in_background: true` to run agents simultaneously:

```
# Spawn 3 agents with the same task
Task(
  description: "Implement auth (approach A)",
  prompt: "Implement JWT authentication for the API. Focus on security best practices. Use short-lived tokens with refresh mechanism.",
  subagent_type: "agileflow-api",
  run_in_background: true
)

Task(
  description: "Implement auth (approach B)",
  prompt: "Implement JWT authentication for the API. Focus on simplicity and developer experience. Use longer-lived tokens with explicit logout.",
  subagent_type: "agileflow-api",
  run_in_background: true
)

Task(
  description: "Implement auth (approach C)",
  prompt: "Implement JWT authentication for the API. Focus on performance. Use stateless tokens with minimal database lookups.",
  subagent_type: "agileflow-api",
  run_in_background: true
)
```

### Step 2: Collect Results

Wait for all agents to complete:

```
TaskOutput(task_id: "<agent_a_id>", block: true)
TaskOutput(task_id: "<agent_b_id>", block: true)
TaskOutput(task_id: "<agent_c_id>", block: true)
```

### Step 3: Compare and Select

Evaluate results against selection criteria (see below).

---

## Selection Criteria

### Correctness (Weight: 40%)
- Does the code work as intended?
- Are edge cases handled?
- Are there any bugs or logical errors?

### Security (Weight: 25%)
- Input validation present?
- No hardcoded secrets?
- Follows OWASP guidelines?

### Maintainability (Weight: 20%)
- Clear, readable code?
- Follows existing patterns?
- Appropriate abstractions?

### Performance (Weight: 15%)
- Efficient algorithms?
- Minimal database queries?
- No obvious bottlenecks?

### Scoring Example

| Criterion | Agent A | Agent B | Agent C |
|-----------|---------|---------|---------|
| Correctness (40%) | 35/40 | 40/40 | 30/40 |
| Security (25%) | 25/25 | 20/25 | 25/25 |
| Maintainability (20%) | 15/20 | 18/20 | 12/20 |
| Performance (15%) | 12/15 | 10/15 | 15/15 |
| **Total** | **87** | **88** | **82** |

**Winner: Agent B** (highest total score)

---

## Variation: Different Perspectives

Instead of the same agent with different prompts, use different specialist agents:

```
# Security-focused review
Task(
  description: "Security review of auth",
  prompt: "Review this auth implementation for vulnerabilities",
  subagent_type: "agileflow-security",
  run_in_background: true
)

# Performance-focused review
Task(
  description: "Performance review of auth",
  prompt: "Review this auth implementation for performance issues",
  subagent_type: "agileflow-performance",
  run_in_background: true
)

# API design review
Task(
  description: "API design review of auth",
  prompt: "Review this auth implementation for API design best practices",
  subagent_type: "agileflow-api",
  run_in_background: true
)
```

This surfaces issues that a single agent might miss.

---

## Cost/Benefit Analysis

### Costs
| Factor | Impact |
|--------|--------|
| Token usage | 3x (or Nx) the tokens for N agents |
| Latency | Slight increase (parallel, but synthesis takes time) |
| Complexity | Need comparison logic |

### Benefits
| Factor | Impact |
|--------|--------|
| Reliability | Catches bugs/issues single agent misses |
| Confidence | Multiple agreeing outputs = higher trust |
| Exploration | Surfaces approaches you wouldn't consider |
| Learning | See different valid solutions |

### Break-Even Analysis

**Use Best-of-N when:**
```
(Cost of bug/issue) > (Extra token cost) × (Probability of catching issue)
```

**Example:**
- Payment bug cost: $10,000 (refunds, reputation, debugging)
- Extra tokens: $0.50 (2 additional agents)
- Probability of catching: 30%

Expected value: $10,000 × 0.30 = $3,000 saved
Cost: $0.50

**Clear win for Best-of-N on critical paths.**

---

## Integration with Orchestrator

The orchestrator can use Best-of-N automatically for high-stakes tasks:

```
Task(
  description: "Best-of-3 auth implementation",
  prompt: "Use Best-of-N pattern with 3 API agents to implement auth. Compare results and select the best based on security and correctness.",
  subagent_type: "agileflow-orchestrator"
)
```

The orchestrator will:
1. Spawn 3 API agents in parallel
2. Collect all results
3. Compare against criteria
4. Return the winner with reasoning

---

## Anti-Patterns

### 1. Using for Trivial Tasks
```
# BAD: Overkill for simple work
Best-of-3 agents to fix a typo
```

### 2. Identical Prompts
```
# BAD: Same prompt = likely same output
Task(prompt: "Implement X", ...)
Task(prompt: "Implement X", ...)
Task(prompt: "Implement X", ...)

# GOOD: Different constraints/focus
Task(prompt: "Implement X focusing on security", ...)
Task(prompt: "Implement X focusing on simplicity", ...)
Task(prompt: "Implement X focusing on performance", ...)
```

### 3. Skipping Comparison
```
# BAD: Just picking the first result
result = agents[0].output

# GOOD: Systematic comparison
scores = compare_all(agents)
best = max(scores)
```

---

## Related Patterns

- **Orchestrator Pattern**: Coordinates multiple agents for different tasks
- **Parallel Execution**: Running independent workstreams simultaneously
- **Cross-Validation**: Using one agent to check another's work
- **Ensemble Methods**: Combining multiple results (not just selecting one)

---

## References

- [ADR-0003: Multi-Agent Orchestration](../03-decisions/adr-0003-multi-agent-orchestration.md)
- [Research: Top 2% Agentic Engineer 2026](../10-research/20251225-top-2pct-agentic-engineer-2026.md)
- [Orchestrator Agent](../../packages/cli/src/core/agents/orchestrator.md)
