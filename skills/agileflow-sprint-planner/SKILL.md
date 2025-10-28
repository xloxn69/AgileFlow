---
name: agileflow-sprint-planner
description: Helps plan sprints by grouping stories, calculating capacity, identifying risks, and creating sprint goals. Loads when discussing sprint planning or iteration planning.
allowed-tools: Read, Write, Edit, Glob, Bash
---

# AgileFlow Sprint Planner

## Purpose

This skill assists with sprint planning by analyzing available stories, team capacity, dependencies, and creating balanced sprint plans.

## When This Skill Activates

Load this skill when:
- User mentions "sprint planning", "iteration planning"
- Discussing what to work on next sprint
- User asks "what should we work on?"
- Calculating team capacity or velocity
- User mentions "sprint goal", "sprint commitment"

## Sprint Plan Format

```markdown
# Sprint [Number]: [Sprint Goal]

**Duration**: [Start Date] - [End Date] (2 weeks)
**Team Capacity**: X story points
**Sprint Goal**: [1-2 sentence description of what we aim to achieve]

## Committed Stories

### High Priority (P0/P1)
- [ ] [STORY-###: Title](link) - X pts - @Owner
- [ ] [STORY-###: Title](link) - X pts - @Owner

### Medium Priority (P2)
- [ ] [STORY-###: Title](link) - X pts - @Owner

### Stretch Goals (if capacity allows)
- [ ] [STORY-###: Title](link) - X pts - @Owner

**Total Committed**: X story points
**Total with Stretch**: Y story points

## Capacity Breakdown

| Team Member | Availability | Capacity (pts) | Assigned (pts) |
|-------------|--------------|----------------|----------------|
| Alice       | 10 days      | 15             | 13             |
| Bob         | 8 days (PTO) | 12             | 11             |
| Carol       | 10 days      | 15             | 14             |
| **Total**   | 28 days      | **42**         | **38**         |

## Dependencies & Blockers

- [Dependency 1: What needs to happen]
- [Blocker 1: Known issue]

## Risks

- [Risk 1: What might go wrong]
- [Risk 2: Mitigation plan]

## Sprint Schedule

- **Day 1 (Mon)**: Sprint Planning
- **Day 3 (Wed)**: Mid-sprint check-in
- **Day 8 (Wed)**: Feature freeze / Code review
- **Day 10 (Fri)**: Sprint Review & Retro

## Definition of Done

- [ ] Code reviewed and approved
- [ ] Tests written and passing (unit + integration)
- [ ] Documentation updated
- [ ] Deployed to staging
- [ ] Acceptance criteria validated
- [ ] No open bugs
```

## Workflow

1. **Gather Information**:
   - Read backlog stories from `docs/06-stories/`
   - Check team capacity (PTO, holidays, meetings)
   - Review last sprint's velocity

2. **Calculate Capacity**:
   - Team members × days available × points per day
   - Account for:
     - PTO/vacation
     - Holidays
     - Meetings/ceremonies (10-20% overhead)
     - Ongoing support work

3. **Select Stories**:
   - Start with highest priority (P0, P1)
   - Consider dependencies
   - Balance work across team members
   - Group related stories
   - Add stretch goals (20% buffer)

4. **Define Sprint Goal**:
   - One clear, achievable objective
   - Aligns with epic/milestone
   - Measurable outcome

5. **Validate Plan**:
   - Check for blockers/dependencies
   - Ensure balanced workload
   - Verify stories are ready (well-defined AC)

## Capacity Calculation

### Basic Formula:
```
Capacity = Team Members × Available Days × Points per Day
```

### Example:
- 3 developers
- 10 working days per person
- ~1.5 story points per day average
- Capacity = 3 × 10 × 1.5 = **45 story points**

### Adjustments:
- **Meetings overhead**: -15% (6.75 pts)
- **Code reviews**: -10% (4.5 pts)
- **Bug fixes**: -10% (4.5 pts)
- **Realistic capacity**: ~30 story points

## Velocity Tracking

```markdown
## Historical Velocity

| Sprint | Committed | Completed | Velocity |
|--------|-----------|-----------|----------|
| 12     | 40        | 38        | 95%      |
| 11     | 35        | 35        | 100%     |
| 10     | 42        | 30        | 71%      |
| 9      | 38        | 40        | 105%     |
| **Avg**| **38.75** | **35.75** | **92%**  |

**Recommended commitment**: 36-40 story points
```

## Sprint Goal Guidelines

### Good Sprint Goals:
- ✅ "Complete user authentication (login, signup, password reset)"
- ✅ "Launch MVP of dark mode feature"
- ✅ "Improve search performance to <100ms"
- ✅ "Integrate Stripe payment processing"

### Bad Sprint Goals:
- ❌ "Complete as many stories as possible" (not specific)
- ❌ "Fix bugs" (too vague)
- ❌ "Work on 10 different features" (no focus)

## Story Selection Strategy

### Priority-Based:
1. **P0 (Critical)**: Blockers, security fixes, production bugs
2. **P1 (High)**: Planned features, important improvements
3. **P2 (Medium)**: Nice-to-haves, enhancements
4. **P3 (Low)**: Tech debt, cleanup, future work

### Dependency-Based:
- Group stories that depend on each other
- Complete prerequisites first
- Avoid half-done features

### Skill-Based:
- Match stories to team member expertise
- Allow learning opportunities
- Pair complex tasks

### Balance:
- Mix of UI, API, infrastructure work
- Mix of large and small stories
- Include testing and documentation

## Risk Identification

### Common Risks:
- **Underestimated complexity**: Add buffer or spike story
- **External dependencies**: Identify early, create fallback plan
- **Unclear requirements**: Refine stories before sprint starts
- **Team availability**: Plan for reduced capacity
- **Technical unknowns**: Add research/investigation time

### Risk Matrix:
```markdown
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| API changes | High | High | Coordinate with team early |
| PTO overlap | Medium | Medium | Reduce commitment by 20% |
```

## Quality Checklist

Before finalizing sprint plan:
- [ ] Sprint goal is clear and achievable
- [ ] Stories sum to realistic capacity (80-90% of max)
- [ ] All stories have defined acceptance criteria
- [ ] Dependencies identified and resolved
- [ ] Work balanced across team members
- [ ] Stretch goals identified (10-20% extra)
- [ ] Blockers documented with mitigation plans
- [ ] Team has reviewed and committed

## Integration with Other Skills

- **agileflow-story-writer**: Ensures stories are well-formed
- **agileflow-epic-planner**: Pulls stories from epic milestones
- **agileflow-retro-facilitator**: Uses retro insights for planning

## Mid-Sprint Adjustments

If scope changes mid-sprint:

```markdown
## Mid-Sprint Adjustments (Day 5)

**Added**:
- [STORY-###: Critical Bug Fix](link) - 5 pts (replaces STORY-089)

**Removed**:
- [STORY-089: Feature Polish](link) - 5 pts (moved to next sprint)

**Reason**: Production bug requires immediate attention
**Impact**: Sprint goal remains achievable
```

## Notes

- Sprint planning should take ~2 hours for 2-week sprint
- Don't overcommit - better to under-promise and over-deliver
- Review velocity trends, not just last sprint
- Team capacity varies - account for real availability
- Leave 10-20% buffer for unknowns
- Pair estimation with multiple team members
- Re-estimate stories that seem unclear during planning
