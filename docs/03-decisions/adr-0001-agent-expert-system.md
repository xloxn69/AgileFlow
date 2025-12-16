# ADR-0001: Agent Expert System

**Status**: Accepted
**Date**: 2025-12-16
**Decision Makers**: Development Team
**Epic**: [EP-0001](../05-epics/EP-0001-agent-expert-pilot.md)

---

## Context

AgileFlow has 26+ specialized agents (database, api, ui, testing, etc.) that handle domain-specific tasks. Currently, these agents operate as "generic" agents:

- **Start fresh each session**: No memory of previous work
- **Explore to understand**: Must search/grep the codebase every time
- **No accumulated learning**: Insights from one session don't carry forward
- **Repeated discovery**: Same files, patterns, and conventions rediscovered repeatedly

This results in:
1. Slower task completion (redundant exploration)
2. Inconsistent accuracy (depends on what agent finds each time)
3. Higher token usage (exploration consumes context)
4. Missed patterns (agent may not find relevant existing patterns)

### Research Foundation

Based on research from IndyDevDan's Tactical Agentic Coding Course (Lesson 13: Agent Experts), we identified a pattern where agents maintain "mental models" (expertise files) that:
- Persist domain knowledge across sessions
- Must be validated against actual code (not source of truth)
- Auto-update after completing work (self-improving)
- Accelerate future tasks through pre-loaded knowledge

See: `docs/10-research/20251216-agent-experts-self-improving-agents.md`

---

## Decision

**Adopt the Agent Expert pattern for AgileFlow agents.**

Each agent will maintain:
1. **Expertise File** (`expertise.yaml`): Domain-specific knowledge
2. **Question Prompt** (`question.md`): Expertise-first Q&A workflow
3. **Self-Improve Prompt** (`self-improve.md`): Auto-update after changes
4. **Workflow Prompt** (`workflow.md`): Complete Plan→Build→Self-Improve chain

### Implementation Structure

```
experts/
├── templates/           # Reusable templates
│   ├── expertise-template.yaml
│   ├── question-template.md
│   ├── self-improve-template.md
│   └── workflow-template.md
└── {domain}/            # Per-agent expertise
    ├── expertise.yaml
    ├── question.md
    ├── self-improve.md
    └── workflow.md
```

### Pilot Scope (3 agents)

- **Database Expert** (AG-DATABASE)
- **API Expert** (AG-API)
- **UI Expert** (AG-UI)

---

## Options Considered

### Option 1: Single Global Expert (Rejected)
- One expertise file for entire codebase
- **Rejected**: Too broad, would become unmanageable, defeats purpose of focused knowledge

### Option 2: Feature-Based Experts (Deferred)
- Experts per feature (auth-expert, payments-expert, etc.)
- **Deferred**: May be valuable but requires project-specific knowledge. Consider for future.

### Option 3: Domain-Based Experts (Selected)
- One expert per technical domain (database, api, ui, etc.)
- **Selected**: Aligns with existing agent structure, focused but comprehensive

### Option 4: No Change (Rejected)
- Keep agents generic
- **Rejected**: Leaves performance and accuracy improvements on the table

---

## Consequences

### Benefits

1. **Faster Task Completion**
   - Pre-loaded file locations reduce search operations
   - Known patterns enable immediate action vs. exploration

2. **Improved Accuracy**
   - Expertise validated before use ensures correctness
   - Accumulated learnings prevent repeated mistakes

3. **Lower Token Usage**
   - Less exploration = less context consumption
   - Expertise files are small (<200 lines) but dense

4. **Consistent Behavior**
   - Agents follow documented patterns consistently
   - Conventions enforced through expertise knowledge

5. **Knowledge Preservation**
   - Learnings persist across sessions
   - Team knowledge captured in expertise files

### Trade-offs

1. **Initial Setup Effort**
   - Each agent needs expertise files created
   - Templates reduce effort but don't eliminate it

2. **Maintenance Overhead**
   - Expertise files need validation over time
   - Mitigated by self-improve automating updates

3. **Stale Knowledge Risk**
   - Expertise may become outdated
   - Mitigated by mandatory validation against actual code

4. **Training Requirement**
   - Users need to understand expertise-first workflow
   - Mitigated by comprehensive documentation and agent prompts

---

## Implementation Plan

### Phase 1: Pilot (Completed)
- [x] Create directory structure and templates
- [x] Implement Database Expert
- [x] Implement API Expert
- [x] Implement UI Expert
- [x] Create Three-Step Workflow
- [x] Document and validate

### Phase 2: Full Rollout (Pending)
- Upgrade remaining 23 agents to experts
- Prioritize by usage frequency:
  1. High: testing, ci, devops, security
  2. Medium: documentation, refactor, performance
  3. Lower: specialized agents (mobile, analytics, etc.)

### Phase 3: Refinement (Future)
- Consider feature-based experts for common patterns
- Evaluate babysit integration (spawn experts vs. generic agents)
- Measure and optimize expertise file sizes

---

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Stale expertise | Mandatory validation step in all prompts |
| Expertise becomes source of truth | Training: "Code is always source of truth" |
| Files grow too large | Guideline: <200 lines, split if larger |
| Poor initial expertise | Start minimal, let self-improve grow organically |
| User ignores workflow | Agent prompts enforce workflow automatically |

---

## Success Criteria

The Agent Expert system is successful if:

1. **Qualitative**
   - Agents provide faster, more accurate responses
   - Developers report improved experience
   - Expertise files stay accurate over time

2. **Quantitative** (to be measured)
   - 30%+ reduction in search operations per task
   - 20%+ improvement in first-attempt accuracy
   - Expertise files used in 80%+ of domain tasks

---

## Related Documents

- [EP-0001: Agent Expert Pilot](../05-epics/EP-0001-agent-expert-pilot.md)
- [Research: Agent Experts](../10-research/20251216-agent-experts-self-improving-agents.md)
- [Experts README](../../packages/cli/src/core/experts/README.md)
