# ADR-0005: Agentic Layer Enhancements - Path to Class 2/3

**Status**: Proposed
**Date**: 2026-01-01
**Decision Makers**: Development Team
**Research**: [Agentic Layer Architecture](../10-research/20260101-agentic-layer-architecture.md)

---

## Context

Based on the Agentic Layer Architecture framework (IndyDevDan's Agentic Horizon series), AgileFlow has been assessed against a classification system for agentic codebases:

- **Class 1**: Foundation (memory files, prompts, sub-agents, skills, MCP servers, feedback loops)
- **Class 2**: Advanced (self-improving agents, expertise files, continuous learning)
- **Class 3**: Autonomous (orchestrator-driven end-to-end workflows, codebase singularity)

### Current State Assessment

**AgileFlow Current Grade: Class 1, Grade 4-5 (High)**

| Component | Status | Details |
|-----------|--------|---------|
| Memory files | ✅ Strong | CLAUDE.md, project context |
| Commands (58) | ✅ Strong | Comprehensive slash command library |
| Sub-agents (27+) | ✅ Strong | Domain specialists (API, UI, Database, etc.) |
| Skills (24+) | ✅ Strong | Reusable capability modules |
| Closed-loop prompts | ✅ Strong | review.md, verify.md with feedback loops |
| Orchestrator | ✅ Strong | Multi-domain coordination |
| MCP servers | ⚠️ Partial | Only Playwright configured |
| AI Developer Workflows | ❌ Missing | No end-to-end autonomous workflows |
| Self-improving agents | ❌ Missing | Agents don't update their own expertise |
| Orchestrator workflow control | ❌ Missing | Can't kick off arbitrary workflows |

### Problem Statement

AgileFlow is a strong Class 1, Grade 4-5 system but lacks the distinguishing features of Class 2 (self-improving agents) and Class 3 (autonomous end-to-end workflows). This limits the system's ability to achieve "codebase singularity" - where agents can run the codebase better than humans.

---

## Decision

We will enhance AgileFlow's agentic layer in three phases:

### Phase 1: Grade 5 Completion (Low Effort, High Value)

1. **Add `app-reviews/` output directory** for code review artifacts
2. **Add `/agileflow:reproduce-bug` closed-loop workflow**
3. **Enhance orchestrator to spawn domain experts sequentially when dependent**

### Phase 2: Class 2 Features (Medium Effort, High Value)

1. **Self-Improving Expertise System**
   - Agents create/update expertise files in `.agileflow/expertise/`
   - Act → Learn → Reuse pattern from research
   - Expertise drift detection and refresh

2. **Workflow Templates**
   - Reusable workflow definitions (plan→build→review→fix)
   - Configurable via `.agileflow/workflows/`
   - Support sequential and parallel stages

### Phase 3: Class 3 Features (Higher Effort, Transformative)

1. **AI Developer Workflows**
   - End-to-end autonomous implementation
   - `/agileflow:workflow RUN=plan-build-review-fix TARGET=feature-dir`
   - Orchestrator can kick off arbitrary workflows

2. **Codebase Singularity Metrics**
   - Agent confidence scores
   - Human intervention tracking
   - Automation success rate

---

## Alternatives Considered

### Alternative 1: Stay at Class 1
**Pros**: No development effort
**Cons**: Limited autonomy, more human intervention required

### Alternative 2: Jump directly to Class 3
**Pros**: Maximum autonomy
**Cons**: High risk, complex to implement correctly

### Alternative 3: Incremental enhancement (Chosen)
**Pros**: Lower risk, iterative validation, value delivered at each phase
**Cons**: Takes longer to reach Class 3

---

## Consequences

### Positive
- Higher agent autonomy reduces human intervention
- Self-improving agents continuously get better
- End-to-end workflows increase throughput
- Path toward "codebase singularity"

### Negative
- Increased complexity in agentic layer
- More files to maintain
- Requires careful prompt engineering
- Risk of over-engineering tools (Grade 3 trap)

### Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Over-engineering tools | Audit tool count quarterly, prefer prompts over MCPs |
| Expertise file drift | Automatic staleness detection via `/agileflow:validate-expertise` |
| Workflow complexity | Start with simple 2-stage workflows, add stages incrementally |
| Token cost increase | Monitor token usage, prefer haiku for delegation |

---

## Implementation Plan

### Phase 1 Stories (Grade 5 Completion)

**EP-XXXX: Grade 5 Completion**

| Story | Description | Estimate |
|-------|-------------|----------|
| US-XXXX | Add `docs/08-project/code-reviews/` directory and update review.md | S |
| US-XXXX | Create `/agileflow:reproduce-bug` closed-loop command | M |
| US-XXXX | Enhance orchestrator sequential dependency handling | M |

### Phase 2 Stories (Class 2)

**EP-XXXX: Self-Improving Agent System**

| Story | Description | Estimate |
|-------|-------------|----------|
| US-XXXX | Define expertise file schema and storage location | S |
| US-XXXX | Implement expertise capture hook (Act→Learn) | L |
| US-XXXX | Implement expertise reuse in agent context (Reuse) | M |
| US-XXXX | Add expertise drift detection to validate-expertise | M |

**EP-XXXX: Workflow Templates**

| Story | Description | Estimate |
|-------|-------------|----------|
| US-XXXX | Define workflow template schema (stages, dependencies) | M |
| US-XXXX | Create plan-build-review-fix workflow template | M |
| US-XXXX | Add `/agileflow:workflow` command to execute templates | L |

### Phase 3 Stories (Class 3)

**EP-XXXX: AI Developer Workflows**

| Story | Description | Estimate |
|-------|-------------|----------|
| US-XXXX | Enable orchestrator to kick off workflow templates | L |
| US-XXXX | Add autonomous error recovery and retry logic | L |
| US-XXXX | Implement codebase singularity metrics dashboard | M |

---

## Success Metrics

| Metric | Current | Phase 1 | Phase 2 | Phase 3 |
|--------|---------|---------|---------|---------|
| Agentic Grade | 4-5 | 5 | Class 2 | Class 3 |
| Human interventions per feature | ~5 | ~4 | ~2 | ~1 |
| Agent confidence (self-reported) | N/A | N/A | Added | Tracked |
| Workflow completion rate | N/A | N/A | N/A | >90% |

---

## References

- [Agentic Layer Architecture Research](../10-research/20260101-agentic-layer-architecture.md)
- [ADR-0001: Agent Expert System](./adr-0001-agent-expert-system.md)
- [ADR-0003: Multi-Agent Orchestration](./adr-0003-multi-agent-orchestration.md)
- IndyDevDan Tactical Agentic Coding Course (Lessons 3, 5, referenced)
