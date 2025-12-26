# ADR-0003: Multi-Agent Orchestration Pattern

**Status**: Accepted
**Date**: 2025-12-25
**Implemented**: 2025-12-25 (Phase 1 Foundation)
**Decision Makers**: Development Team
**Research**: [Top 2% Agentic Engineer 2026](../10-research/20251225-top-2pct-agentic-engineer-2026.md)

---

## Context

AgileFlow currently supports multi-agent workflows through:
- **Sub-agents** via the Task tool (spawn specialized agents)
- **26+ specialized agents** for domain-specific work
- **Skills system** for custom tools
- **Babysit command** for orchestrating feature implementation

However, the current model is primarily **in-loop**: users babysit agents prompt-by-prompt, manually coordinating between specialists. This limits throughput and doesn't leverage the full potential of parallel agent execution.

### Research Foundation

Based on IndyDevDan's "Top 2% Agentic Engineer 2026" predictions, the key insight is:

> **"2026 is the Year of Trust"** — Trust = Speed = Iteration = Impact

The limitation is no longer models; it's how much we trust agents to work autonomously. Key patterns identified:

1. **Multi-Agent Orchestration**: Run 3, 5, 10+ agents in parallel with cross-validation
2. **Lead Agent Pattern**: Orchestrator that delegates, monitors, and coordinates worker agents
3. **Agent Sandboxes**: Isolated environments for "deferred trust" (best-of-N pattern)
4. **In-Loop vs Out-Loop**: Maximize autonomous out-loop work, minimize babysitting
5. **Tool Call Chains**: Longer reliable tool call chains = higher trust = greater impact

See: `docs/10-research/20251225-top-2pct-agentic-engineer-2026.md`

---

## Decision

**Adopt the Multi-Agent Orchestration pattern to evolve AgileFlow from in-loop to out-loop agentic workflows.**

This involves:

1. **Lead Agent Architecture**: Enhance babysit/mentor to act as true orchestrators that spawn, monitor, and synthesize results from multiple worker agents

2. **Parallel Agent Execution**: Use `run_in_background: true` more aggressively for independent workstreams (API + UI, tests + docs)

3. **Trust Metrics**: Track tool call chain length as a proxy for agent reliability

4. **Best-of-N Pattern**: For critical tasks, spawn multiple agents and select the best result

### Evolution Path

```
Current State                    Future State
─────────────────                ─────────────
In-Loop (babysit)         →     Out-Loop (orchestrator)
Single agent focus        →     Multi-agent parallel
Manual coordination       →     Automated delegation
Prompt-by-prompt         →     Prompt-to-PR autonomy
```

---

## Options Considered

### Option 1: Keep Current In-Loop Model (Rejected)
- Users continue to babysit agents one at a time
- **Rejected**: Leaves significant productivity gains on the table; doesn't scale

### Option 2: Pure Out-Loop (Deferred)
- Fully autonomous agents with no human checkpoints
- **Deferred**: Requires higher trust levels; not ready for production-critical work yet

### Option 3: Hybrid Orchestration (Selected)
- Lead agent orchestrates worker agents
- Human reviews synthesized results, not individual steps
- **Selected**: Balances autonomy with oversight; incremental trust building

### Option 4: External Orchestration (Rejected)
- Use external tools (Slack, GitHub Actions) for coordination
- **Rejected**: Fragments the workflow; loses context between steps

---

## Consequences

### Benefits

1. **Increased Throughput**
   - Parallel agent execution reduces wall-clock time
   - API + UI work happens simultaneously instead of sequentially

2. **Higher Quality Through Cross-Validation**
   - Multiple agents reviewing same code catches more issues
   - Best-of-N pattern improves reliability for critical tasks

3. **Reduced Cognitive Load**
   - Users interact with lead agent, not individual specialists
   - Orchestrator handles delegation and synthesis

4. **Trust Building**
   - Measurable trust metrics (tool call chain length)
   - Gradual expansion of autonomous scope

5. **Alignment with Industry Direction**
   - Matches "Agentic Coding 2.0" trajectory
   - Prepares for end-to-end agentic engineering

### Trade-offs

1. **Increased Complexity**
   - Orchestration logic is more complex than single-agent
   - Debugging multi-agent issues is harder

2. **Resource Usage**
   - Parallel agents consume more tokens/compute
   - Mitigated by faster completion = fewer sessions

3. **Coordination Overhead**
   - Agent results must be synthesized
   - Mitigated by structured output formats

4. **Trust Calibration**
   - Must learn when to trust vs. verify
   - Mitigated by incremental trust expansion

---

## Implementation Plan

### Phase 1: Foundation (Q1 2026) ✅ COMPLETE
- [x] Add trust metrics to agent output (tool call count, chain length) - *Docs complete; tracking deferred until Claude Code API*
- [x] Enhance Task tool docs for parallel execution patterns - *Added to babysit.md*
- [x] Create orchestrator agent type (`agileflow-orchestrator`) - *With forced delegation (Task/TaskOutput only)*
- [x] Document best-of-N pattern in practices - *docs/02-practices/best-of-n-pattern.md*

### Phase 2: Orchestrator Enhancement (Q1 2026)
- [ ] Upgrade babysit to spawn parallel agents for multi-domain tasks
- [ ] Implement result synthesis for parallel agent outputs
- [ ] Add `/agileflow:parallel` command for explicit multi-agent tasks

### Phase 3: Out-Loop Integration (Q2 2026)
- [ ] GitHub Issues → Agent → PR pipeline
- [ ] Webhook-triggered agent workflows
- [ ] Scheduled agent tasks (nightly builds, dependency updates)

### Phase 4: Trust Dashboard (Q2 2026)
- [ ] Track tool call chain lengths over time
- [ ] Visualize trust metrics per agent type
- [ ] Identify reliability patterns and anti-patterns

---

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Agents conflict with each other | Clear domain boundaries; orchestrator resolves conflicts |
| Runaway compute costs | Set token budgets per agent; monitor usage |
| Lost context in parallel execution | Structured output format; orchestrator maintains shared context |
| User confusion about agent state | Clear status reporting; `/agileflow:board` shows all agents |
| Over-automation before ready | Gradual rollout; in-loop fallback always available |

---

## Success Criteria

The Multi-Agent Orchestration pattern is successful if:

1. **Qualitative**
   - Users report faster feature completion
   - Reduced context-switching between agents
   - Higher confidence in agent output quality

2. **Quantitative** (to be measured)
   - 40%+ reduction in wall-clock time for multi-domain features
   - 50%+ of complex tasks use parallel agent execution
   - Average tool call chain length increases 2x over 6 months
   - Best-of-N pattern catches 30%+ additional issues vs. single agent

---

## Related Documents

- [Research: Top 2% Agentic Engineer 2026](../10-research/20251225-top-2pct-agentic-engineer-2026.md)
- [ADR-0001: Agent Expert System](./adr-0001-agent-expert-system.md)
- [Babysit Command](../../.claude/commands/agileflow/babysit.md)
- [Multi-Expert Command](../../packages/cli/src/core/commands/multi-expert.md)
