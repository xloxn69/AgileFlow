# Action Items Template

Shared template for creating SMART action items across all retro formats.

## SMART Action Items

- **S**pecific: Clear what needs to be done
- **M**easurable: Can verify it's complete
- **A**ssignable: Has an owner
- **R**elevant: Addresses the issue
- **T**ime-bound: Has a deadline

## Good vs Bad Examples

**Good (Specific, Actionable)**:
```
- [ ] **Create PR size guideline** - @TechLead - Due: Before next sprint
  - Success criteria: Document written, shared with team, added to CLAUDE.md
  - Metric: 80% of PRs under 300 lines
```

**Bad (Vague, Unactionable)**:
```
- [ ] Fix code reviews
- [ ] Be better at communication
- [ ] Improve quality
```

## Good vs Bad Feedback

**Good (Specific, Constructive)**:
```
"Daily standups ran long (20+ min) because we discussed
implementation details. Consider moving technical discussions
to separate sessions."

"Code reviews were faster this sprint (avg 4 hours vs 24 hours
last sprint) thanks to smaller PR sizes."
```

**Bad (Vague, Blame-Oriented)**:
```
"Meetings were bad"
"Bob didn't do his job"
"Everything was terrible"
"Process is broken"
```

## Action Item Template

```markdown
- [ ] **[Specific Action]** - @Owner - Due: [Date]
  - Context: [What retro item this addresses]
  - Success criteria: [How we know it's done]
  - Metric: [Measurable outcome if applicable]
```

## Tracking Action Items

**Status Markers**:
- `[ ]` - Not started
- `[~]` - In progress
- `[x]` - Completed
- `[!]` - Blocked
- `[-]` - Cancelled/Deferred

**Review Format**:
```markdown
## Previous Action Items Review

- [x] **[Completed Action]** - Implemented, improved X by Y%
- [~] **[In Progress Action]** - 60% done, on track for next week
- [!] **[Blocked Action]** - Blocked by Z, need help from [team]
- [-] **[Cancelled Action]** - No longer relevant due to [reason]
```

## Best Practices

1. **Limit to 3-5 actions per retro** - More than 5 rarely get done
2. **Assign single owners** - Shared ownership = no ownership
3. **Set realistic deadlines** - Usually before next retro
4. **Review at next retro** - Accountability matters
5. **Track completion rate** - Target: >80%
