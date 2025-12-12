---
name: epic-planner
description: Breaks down large features into properly-scoped epics with milestones and story groupings. Loads when user describes major features or initiatives.
---

# AgileFlow Epic Planner

Automatically structures large features or initiatives into epics, breaking them down into logical story groupings and milestones.

## When to Use

This skill activates when:
- User describes a large feature spanning multiple sprints
- Discussing a major initiative or project
- Keywords: "epic", "initiative", "theme", "big feature", "multi-month project"
- Feature seems too large to be a single story (>13 story points)

## What This Does

1. Detects large feature descriptions
2. Asks clarifying questions (problem, timeline, success metrics)
3. Breaks down into logical milestones (MVP, Phase 2, Polish)
4. Estimates effort and suggests timeline
5. Creates epic file in docs/05-epics/

## Instructions

1. **Ask clarifying questions**:
   - "What's the main problem you're solving?"
   - "Who are the users?"
   - "What's the timeline/urgency?"
   - "What defines success?"

2. **Break down into logical chunks**:
   - Identify milestones (MVP, Phase 2, Polish)
   - Group related functionality
   - Ensure each milestone delivers value

3. **Create epic structure**:
   - Read existing epics for numbering
   - Write epic file in `docs/05-epics/`
   - Outline stories (create skeleton, defer details)

4. **Estimate effort**:
   - Rough story point estimates
   - Calculate milestone totals
   - Suggest timeline based on team velocity

## Epic Format

```markdown
# [EPIC-###] Title

**Status**: PLANNING | ACTIVE | ON_HOLD | COMPLETED
**Owner**: Product Owner / Team Lead
**Start Date**: YYYY-MM-DD
**Target Completion**: YYYY-MM-DD
**Priority**: P0 | P1 | P2 | P3
**Business Value**: High | Medium | Low

## Problem Statement

[What problem does this epic solve? Why is it important?]

## Goals and Objectives

- [Goal 1: Specific, measurable outcome]
- [Goal 2: Business or user metric to improve]
- [Goal 3: Strategic alignment]

## Success Metrics

- [Metric 1: e.g., 20% increase in user engagement]
- [Metric 2: e.g., Reduce support tickets by 30%]

## User Stories

### Milestone 1: [Name] (Target: YYYY-MM-DD)
- [ ] [STORY-###: Title](../06-stories/STORY-###-title.md) - 5 pts
- [ ] [STORY-###: Title](../06-stories/STORY-###-title.md) - 8 pts
**Total: 16 story points**

### Milestone 2: [Name] (Target: YYYY-MM-DD)
- [ ] [STORY-###: Title](../06-stories/STORY-###-title.md) - 5 pts
- [ ] [STORY-###: Title](../06-stories/STORY-###-title.md) - 8 pts
**Total: 13 story points**

## Dependencies

- [Dependency 1: What needs to be done first]
- [Dependency 2: External team dependencies]
- [Dependency 3: Technical prerequisites]

## Risks and Assumptions

**Risks**:
- [Risk 1: What could go wrong]
- [Risk 2: Mitigation plan]

**Assumptions**:
- [Assumption 1: What we're assuming is true]
- [Assumption 2: Needs validation]

## Out of Scope

- [What we're explicitly NOT doing in this epic]
- [Features deferred to future epics]

## Progress Tracking

**Overall Progress**: X / Y stories completed (Z%)
**Last Updated**: YYYY-MM-DD
```

## Epic vs Story

**This Should Be an Epic If**:
- Takes more than 1-2 sprints (>13 story points total)
- Involves multiple team members or subteams
- Has distinct phases or milestones
- Requires coordination across different areas (UI, API, DevOps)
- Has significant business impact or strategic value

**This Should Be a Story If**:
- Can be completed in one sprint
- Single developer can own it
- Clear, specific acceptance criteria
- One or two related tasks

## Milestone Planning

- **Milestone 1: MVP** - Core functionality only, simplest path to value
- **Milestone 2: Feature Complete** - All planned functionality, edge cases handled
- **Milestone 3: Polish & Optimization** - Performance, UX enhancements, accessibility

## Epic Size Guidelines

- **Small Epic**: 15-30 story points (1-2 sprints)
- **Medium Epic**: 30-60 story points (2-4 sprints)
- **Large Epic**: 60-100 story points (4-6 sprints)
- **Initiative**: >100 story points (break into multiple epics)

## Quality Checklist

Before creating epic:
- [ ] Problem statement is clear and specific
- [ ] Goals are measurable
- [ ] Success metrics defined
- [ ] At least 2 milestones planned
- [ ] Stories grouped logically
- [ ] Dependencies identified
- [ ] Risks acknowledged with mitigations
- [ ] Out-of-scope explicitly stated

## Risk Management

**Common Risks**:
- **Scope creep**: Clearly define out-of-scope items
- **Technical unknowns**: Spike stories for research
- **Resource constraints**: Buffer time in estimates
- **Dependency delays**: Identify critical path early

**Risk Format**:
```markdown
**Risks**:
- **Risk**: Integration with legacy system may be complex
  **Impact**: High (could delay Milestone 2 by 2 weeks)
  **Mitigation**: Allocate spike story to investigate (5 pts)
  **Owner**: Backend Lead
```

## Integration

- **agileflow-story-writer**: Creates individual stories for the epic
- **agileflow-sprint-planner**: Assigns stories to sprints
- **agileflow-adr**: Links architectural decisions made during epic

## Notes

- Epics are living documents - update as you learn
- Don't over-plan - detail emerges during execution
- Review epic scope at sprint planning
- Celebrate milestone completions
- Link to ADRs for major technical decisions
