---
name: agileflow-story-writer
description: Automatically formats user requirements and feature discussions into proper user stories with acceptance criteria following AgileFlow templates. Loads when user describes features, requirements, or tasks to implement.
allowed-tools: Read, Write, Edit, Glob
---

# AgileFlow Story Writer

## Purpose

This skill automatically structures feature discussions, requirements, and task descriptions into properly formatted user stories in the AgileFlow `docs/06-stories/` directory.

## When This Skill Activates

Load this skill when the user:
- Describes a feature to implement ("I need a login feature", "We should add dark mode")
- Discusses requirements or user needs
- Talks about functionality to build
- Mentions tasks or work items
- Uses phrases like "we need to...", "users should be able to...", "add support for..."

## User Story Format

Follow this structure:

```markdown
# [STORY-###] Title

**Owner**: AG-UI | AG-API | AG-CI | AG-DEVOPS (choose based on work type)
**Status**: TODO | IN_PROGRESS | BLOCKED | DONE
**Epic**: Link to related epic if applicable
**Priority**: P0 (Critical) | P1 (High) | P2 (Medium) | P3 (Low)
**Estimate**: 1-13 story points (Fibonacci sequence)

## User Story

As a [user type],
I want to [action/capability],
So that [benefit/value].

## Acceptance Criteria

### AC1: [Criterion Name]
**Given** [initial context/state]
**When** [action/trigger]
**Then** [expected outcome]

### AC2: [Another Criterion]
**Given** [context]
**When** [action]
**Then** [outcome]

## Technical Notes

- [Implementation details]
- [Dependencies]
- [Risks/Considerations]

## Testing Strategy

- [How to test this story]
- [Edge cases to verify]

## Definition of Done

- [ ] Code implemented and reviewed
- [ ] Tests written and passing
- [ ] Documentation updated
- [ ] Deployed to staging
- [ ] Acceptance criteria validated
```

## Workflow

1. **Detect story need**: User describes a feature/requirement
2. **Read existing stories**: Check `docs/06-stories/` for numbering and patterns
3. **Extract key information**:
   - Who is this for? (user type)
   - What do they want? (capability)
   - Why do they want it? (benefit)
4. **Determine metadata**:
   - **Owner**: Based on work type (UI, API, CI, DevOps)
   - **Priority**: Ask user or infer from context
   - **Estimate**: Suggest based on complexity
5. **Generate acceptance criteria**: 2-5 specific, testable criteria
6. **Create file**: `docs/06-stories/STORY-###-descriptive-name.md`
7. **Confirm with user**: Show the story and ask if it looks correct

## Owner Guidelines

- **AG-UI**: Frontend components, styling, user interactions, accessibility
- **AG-API**: Backend services, APIs, data models, business logic
- **AG-CI**: CI/CD pipelines, testing infrastructure, quality gates
- **AG-DEVOPS**: Infrastructure, deployment, monitoring, automation

## Story Point Estimation

- **1 point**: Trivial change (update text, fix typo)
- **2 points**: Simple feature (add form field, new button)
- **3 points**: Small feature (basic CRUD endpoint)
- **5 points**: Medium feature (authentication flow)
- **8 points**: Large feature (payment integration)
- **13 points**: Very large (consider splitting)

## Priority Guidelines

- **P0 (Critical)**: Blocking users, security issues, data loss
- **P1 (High)**: Major features, important fixes, user-facing improvements
- **P2 (Medium)**: Nice-to-have features, minor improvements
- **P3 (Low)**: Tech debt, cleanup, future enhancements

## Examples

See `examples/` directory for well-formed stories across different domains.

## Quality Checklist

Before creating the story file, ensure:
- [ ] User story follows "As a...I want...So that..." format
- [ ] At least 2 acceptance criteria with Given/When/Then
- [ ] Owner is appropriate for the work type
- [ ] Priority reflects urgency and impact
- [ ] Estimate is in Fibonacci sequence (1,2,3,5,8,13)
- [ ] File name matches pattern: STORY-###-descriptive-name.md
- [ ] Technical notes capture implementation details
- [ ] Definition of Done is comprehensive

## Integration with Other Skills

- **agileflow-acceptance-criteria**: Can enhance AC section
- **agileflow-epic-planner**: Links stories to epics
- **agileflow-sprint-planner**: Groups stories into sprints

## Notes

- If user is vague, ask clarifying questions before generating
- Always increment story number based on existing stories
- Update `docs/06-stories/README.md` index after creating story
- If story is too large (>13 points), suggest breaking into multiple stories
