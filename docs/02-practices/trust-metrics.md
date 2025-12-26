# Trust Metrics

Measuring and interpreting agent reliability through tool call patterns.

---

## Overview

Trust metrics quantify how reliably an agent completes tasks autonomously. The core insight from "Year of Trust" research:

> **Trust = Speed = Iteration = Impact**

The more you can trust an agent, the more autonomy you grant, the faster work gets done.

---

## Key Metrics

### 1. Tool Call Count

**What it measures**: Total number of tool invocations during a task.

**Format**: `[Tools: 12 calls]`

**Interpretation**:

| Count | Interpretation |
|-------|----------------|
| 1-5 | Simple task, quick completion |
| 6-15 | Moderate complexity, normal |
| 16-30 | Complex task, expected for features |
| 31-50 | Very complex, monitor for loops |
| 50+ | Potential issues (loops, confusion) |

**What high counts may indicate**:
- Complex task requiring many file operations
- Agent exploring/searching (normal for unfamiliar code)
- Potential loop or confusion (if count keeps climbing)
- Overly cautious agent making many small edits

### 2. Max Chain Length

**What it measures**: Longest sequence of consecutive tool calls without human input.

**Format**: `[max chain: 5]`

**Interpretation**:

| Chain | Trust Level | Meaning |
|-------|-------------|---------|
| 1-3 | Low | Agent checks in frequently |
| 4-7 | Medium | Agent works in focused bursts |
| 8-15 | High | Agent handles multi-step autonomously |
| 16-25 | Very High | Agent completes complex workflows |
| 25+ | Expert | Full feature implementation autonomously |

**Why chain length matters**:
- Longer chains = agent handles more without interruption
- Shorter chains = more human oversight needed
- Goal: Increase chain length over time as trust builds

### 3. Combined Format

**Full format**: `[Tools: 12 calls, max chain: 5]`

**Reading the combination**:

| Tools | Chain | Assessment |
|-------|-------|------------|
| Low | Low | Simple task, completed quickly |
| Low | High | Efficient agent, minimal wasted calls |
| High | Low | Complex task with frequent checkpoints |
| High | High | Major feature, high autonomy |

---

## Trust Levels

### Level 1: Supervised (New Agent/Domain)
- Max chain: 3-5
- Human reviews each output
- Agent asks before significant changes
- Example: First time using security agent

### Level 2: Monitored (Building Trust)
- Max chain: 6-10
- Human spot-checks outputs
- Agent proceeds with standard patterns
- Example: API agent after few successful tasks

### Level 3: Trusted (Proven Reliability)
- Max chain: 11-20
- Human reviews final result only
- Agent handles variations autonomously
- Example: UI agent after many successful components

### Level 4: Autonomous (High Trust)
- Max chain: 20+
- Human sets goal, reviews completion
- Agent handles entire features
- Example: Database agent on familiar schema patterns

---

## Building Trust

### Start Low, Increase Gradually

```
Week 1: Chain limit 5
  └─ Agent completes small tasks
  └─ Review each output carefully

Week 2: Chain limit 10
  └─ Agent handles medium tasks
  └─ Spot-check outputs

Week 3: Chain limit 15
  └─ Agent tackles features
  └─ Review final results

Week 4+: Chain limit 20+
  └─ Agent works autonomously
  └─ Trust but verify
```

### Trust-Building Actions

| Action | Trust Impact |
|--------|--------------|
| Agent completes task correctly | +1 trust |
| Agent handles edge case well | +2 trust |
| Agent catches own mistake | +3 trust |
| Agent asks good clarifying question | +1 trust |
| Agent makes silent error | -2 trust |
| Agent loops or gets stuck | -1 trust |
| Agent misunderstands requirements | -1 trust |

---

## Metrics by Agent Type

Different agents have different baseline expectations:

| Agent | Expected Tools | Expected Chain | Notes |
|-------|----------------|----------------|-------|
| `agileflow-api` | 10-25 | 8-15 | File reads, writes, tests |
| `agileflow-ui` | 15-35 | 10-20 | Components, styles, stories |
| `agileflow-database` | 5-15 | 5-10 | Schema, migrations |
| `agileflow-testing` | 20-40 | 15-25 | Many test files |
| `agileflow-security` | 10-20 | 5-10 | Analysis, then fixes |
| `agileflow-documentation` | 5-15 | 8-15 | Mostly writing |
| `agileflow-research` | 3-10 | 3-8 | Reading, summarizing |

---

## Red Flags

### Tool Count Red Flags

| Pattern | Possible Issue | Action |
|---------|----------------|--------|
| Count climbing rapidly | Agent in loop | Interrupt, clarify |
| 50+ tools, no output | Agent confused | Reset, simplify task |
| Many failed tool calls | Permission/path issues | Check environment |

### Chain Length Red Flags

| Pattern | Possible Issue | Action |
|---------|----------------|--------|
| Very short chains, simple task | Over-cautious agent | Encourage autonomy |
| Very long chains, many errors | Runaway agent | Add checkpoints |
| Inconsistent chain lengths | Unclear requirements | Clarify scope |

---

## Future: Automated Tracking

When Claude Code exposes tool call metrics, agents will output:

```
## Task Complete

Created user authentication system:
- Added JWT middleware
- Created login/logout endpoints
- Added password hashing

[Tools: 23 calls, max chain: 12]
```

This enables:
- Automatic trust scoring per agent
- Trend analysis over time
- Anomaly detection for stuck agents
- Comparison across similar tasks

---

## Practical Application

### Before Starting a Task

1. Assess task complexity (simple/medium/complex)
2. Choose appropriate trust level
3. Set expectations for tool count and chain length

### During Task Execution

1. Monitor for unusual patterns (loops, climbing counts)
2. Intervene if red flags appear
3. Note successful autonomous completions

### After Task Completion

1. Review metrics against expectations
2. Adjust trust level for future tasks
3. Document exceptional cases (good or bad)

---

## Related Documentation

- [Best-of-N Pattern](./best-of-n-pattern.md) - Multiple agents for higher confidence
- [ADR-0003: Multi-Agent Orchestration](../03-decisions/adr-0003-multi-agent-orchestration.md)
- [Research: Top 2% Agentic Engineer 2026](../10-research/20251225-top-2pct-agentic-engineer-2026.md)
