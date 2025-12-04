---
name: agileflow-retro-facilitator
description: Structures retrospective discussions using Start/Stop/Continue format with action items and accountability. Loads during retrospective conversations or sprint reviews.
---

# AgileFlow Retro Facilitator

Facilitates sprint retrospectives by structuring feedback, identifying actionable improvements, and tracking action items across sprints.

## When to Use

This skill activates when:
- Keywords: "retrospective", "retro", "sprint review"
- Discussing what went well/poorly in a sprint
- Keywords: "lessons learned", "process improvements", "reflect on..."
- Gathering team feedback
- Running sprint reviews

## What This Does

1. Structures retrospective using Start/Stop/Continue format
2. Gathers feedback on what went well and what didn't
3. Identifies patterns and root causes
4. Creates SMART action items with owners and due dates
5. Reviews previous action items
6. Captures insights for next sprint

## Instructions

1. **Set the stage**:
   - Review sprint metrics (velocity, completion rate)
   - Check previous action items

2. **Gather feedback**:
   - What went well?
   - What didn't go well?
   - What should we start doing?
   - What should we stop doing?
   - What should we continue doing?

3. **Identify patterns**:
   - Group similar feedback
   - Find root causes
   - Spot recurring themes

4. **Create action items**:
   - Specific, actionable steps
   - Assign owners
   - Set due dates
   - Define success criteria

5. **Document and share**:
   - Save in `docs/08-project/retros/`
   - Share with team
   - Add action items to backlog if needed

## Retro Format (Start/Stop/Continue)

```markdown
# Sprint [Number] Retrospective

**Date**: YYYY-MM-DD
**Facilitator**: [Name]
**Attendees**: [Team members present]
**Sprint Duration**: [Start] - [End]

## Sprint Metrics

- **Committed**: X story points
- **Completed**: Y story points
- **Velocity**: Z%
- **Stories Done**: A / B
- **Bugs Found**: C

## What Went Well ✅

- [Positive 1: Specific thing that worked]
- [Positive 2: Team success]
- [Positive 3: Process improvement]

## What Didn't Go Well ❌

- [Challenge 1: Specific problem]
- [Challenge 2: Blocker or delay]
- [Challenge 3: Process issue]

## Start (New Practices) 🟢

- **[Practice 1]**
  - Why: [Reasoning]
  - Owner: [Who will drive this]
  - Success metric: [How we'll measure]

## Stop (Remove Practices) 🔴

- **[Practice 1]**
  - Why it's not working: [Reasoning]
  - Alternative: [What we'll do instead]

## Continue (Keep Doing) 🟡

- **[Practice 1]**
  - Why it's working: [Reasoning]
  - How to maintain: [Keep it going]

## Action Items

- [ ] **[Action 1]** - @Owner - Due: [Date]
  - Success criteria: [How we know it's done]

- [ ] **[Action 2]** - @Owner - Due: [Date]
  - Success criteria: [How we know it's done]

## Previous Action Items Review

- [✅] **[Completed Action]** - Implemented, improved X by Y%
- [🔄] **[In Progress Action]** - Still working on it, 60% done
- [❌] **[Not Done Action]** - Blocked by Z, rolling to next sprint

## Key Insights

1. [Insight 1: Pattern or learning]
2. [Insight 2: Team dynamic observation]
3. [Insight 3: Process discovery]
```

## Retro Formats

Choose based on context:

**Start/Stop/Continue**: Best for regular sprint retros

**Glad/Sad/Mad**: Best for emotional topics, team dynamics
```markdown
## Glad 😊
- [Things that made us happy]

## Sad 😔
- [Things that disappointed us]

## Mad 😡
- [Things that frustrated us]
```

**4Ls (Liked, Learned, Lacked, Longed For)**: Best for learning-focused retros
```markdown
## Liked 👍
- [What we enjoyed]

## Learned 💡
- [New knowledge or skills]

## Lacked ⚠️
- [What was missing]

## Longed For 🌟
- [What we wish we had]
```

## Good vs Bad Feedback

**Good (Specific, Actionable)**:
```
✅ "Daily standups ran long (20+ min) because we discussed
   implementation details. Consider moving technical discussions
   to separate sessions."

✅ "Code reviews were faster this sprint (avg 4 hours vs 24 hours
   last sprint) thanks to smaller PR sizes."
```

**Bad (Vague, Blame-Oriented)**:
```
❌ "Meetings were bad"
❌ "Bob didn't do his job"
❌ "Everything was terrible"
❌ "Process is broken"
```

## SMART Action Items

- **S**pecific: Clear what needs to be done
- **M**easurable: Can verify it's complete
- **A**ssignable: Has an owner
- **R**elevant: Addresses the issue
- **T**ime-bound: Has a deadline

**Example**:
```
✅ Good:
- [ ] **Create PR size guideline** - @TechLead - Due: Before next sprint
  - Success: Document written, shared with team, added to CLAUDE.md
  - Metric: 80% of PRs under 300 lines

❌ Bad:
- [ ] Fix code reviews
```

## Metrics to Track

**Sprint Health**:
- Velocity trend (increasing, stable, decreasing?)
- Commitment accuracy (completed vs committed)
- Bug count (increasing, decreasing?)
- Blocker frequency

**Team Health**:
- Meeting effectiveness
- Communication quality
- Collaboration level
- Work-life balance

**Process Health**:
- Cycle time (story start to done)
- Code review turnaround
- Deployment frequency
- Incident count

## Common Themes to Watch For

**Positive Patterns**:
- Consistent velocity
- Low bug count
- Fast code reviews
- Clear requirements
- Good collaboration

**Warning Signs**:
- Declining velocity
- Recurring blockers
- Communication issues
- Scope creep
- Burnout indicators

## Facilitator Tips

**Do**:
- Create safe space for honest feedback
- Focus on process, not people
- Time-box discussions (5-10 min per topic)
- Ensure everyone participates
- End on positive note
- Follow up on action items

**Don't**:
- Blame individuals
- Let discussions run too long
- Skip retros ("too busy")
- Create action items without owners
- Ignore previous action items

## Remote Retro Adaptations

For distributed teams:
- Use anonymous feedback tools (Retrium, Metro Retro)
- Give time for async reflection before meeting
- Use polls/voting for prioritization
- Record session for absent team members
- Use collaborative docs for brainstorming

## Frequency Guidelines

- **Every sprint**: Standard retros (60-90 min)
- **Major milestones**: Extended retros (2-3 hours)
- **Quarterly**: Big-picture retros (process, tools, culture)
- **Post-incident**: Blameless postmortems (as needed)

## Integration

- **agileflow-sprint-planner**: Retro insights inform next sprint planning
- **agileflow-tech-debt**: Identifies tech debt to address
- **agileflow-story-writer**: Improves story writing process

## Notes

- Retros are for the team, not management reporting
- Psychological safety is critical for honest feedback
- Action items should be small and achievable
- Track action item completion rate (target: >80%)
- Vary retro format to keep it fresh
- Celebrate wins, don't just focus on problems
