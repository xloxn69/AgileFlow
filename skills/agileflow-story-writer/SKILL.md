---
name: agileflow-story-writer
description: Automatically formats user requirements and feature discussions into proper user stories with acceptance criteria following AgileFlow templates. Loads when user describes features, requirements, or tasks to implement.
---

# AgileFlow Story Writer

Automatically converts user feature descriptions and requirements into properly formatted user stories with acceptance criteria, owner assignment, priority, and estimates.

## When to Use

This skill activates when:
- User describes how a feature should behave or requirements
- Discussing features to build or tasks to implement
- Creating or reviewing user stories
- Keywords: "user story", "feature", "build", "implement", "requirement"

## What This Does

1. Extracts user story components from feature discussions
2. Determines metadata (owner, priority, estimate)
3. Generates acceptance criteria in Given/When/Then format
4. Shows story for approval before writing
5. Creates story file and updates tracking

## Instructions

1. **Extract user story components**:
   - **Who** (user type): As a [user type]
   - **What** (capability): I want to [action/capability]
   - **Why** (benefit): So that [benefit/value]

2. **Determine metadata**:
   - **Owner**: Based on work type (AG-UI, AG-API, AG-CI, AG-DEVOPS)
   - **Priority**: P0/P1/P2/P3
   - **Estimate**: Fibonacci scale (1,2,3,5,8,13)
   - **Epic**: Link if part of larger epic

3. **Generate acceptance criteria** (2-5 criteria):
   - Format: **Given** [context] **When** [action] **Then** [outcome]
   - Cover happy path, errors, edge cases

4. **Show diff**: Display story and wait for YES/NO confirmation

5. **After YES**:
   - Write story file to `docs/06-stories/US-####-descriptive-name.md`
   - Update `docs/06-stories/README.md` index
   - Update `docs/09-agents/status.json` with new story (status: ready)
   - Create test stub at `docs/07-testing/test-cases/US-####.md`

## User Story Format

```markdown
---
story_id: US-0042
epic: EP-0001
title: User Login Form
owner: AG-UI
status: ready
estimate: 5
priority: P1
created: 2025-10-30
updated: 2025-10-30
dependencies: [US-0040]
---

## Description

As a user,
I want to log in with my email and password,
So that I can access my account and personalized features.

## Acceptance Criteria

### AC1: Successful Login
**Given** a registered user with valid credentials
**When** user enters email and password
**Then** user is redirected to dashboard with welcome message

### AC2: Invalid Credentials
**Given** user enters incorrect password
**When** user submits login form
**Then** error message "Invalid email or password" is displayed

### AC3: Input Validation
**Given** user submits empty email field
**When** user clicks "Login" button
**Then** validation error "Email is required" is shown

## Technical Notes

- Use JWT authentication with 24h expiration
- Store tokens in httpOnly cookies
- Implement rate limiting (5 attempts per 15 minutes)
- Hash passwords with bcrypt

## Testing Strategy

- Unit tests for form validation logic
- Integration tests for authentication flow
- E2E test for full login journey
- Test stub: docs/07-testing/test-cases/US-0042.md

## Definition of Done

- [ ] Code implemented and reviewed
- [ ] Tests written and passing
- [ ] Documentation updated
- [ ] Deployed to staging
- [ ] Acceptance criteria validated
```

## Owner Determination

- **AG-UI**: Frontend components, styling, user interactions, accessibility
- **AG-API**: Backend services, APIs, data models, business logic
- **AG-CI**: CI/CD pipelines, testing infrastructure, quality gates
- **AG-DEVOPS**: Infrastructure, deployment, monitoring, automation

## Story Point Estimation

- **1 point**: Trivial change (update text, fix typo, config tweak)
- **2 points**: Simple feature (add form field, new button, basic validation)
- **3 points**: Small feature (basic CRUD endpoint, simple component)
- **5 points**: Medium feature (authentication flow, data model)
- **8 points**: Large feature (payment integration, complex UI workflow)
- **13 points**: Very large (consider splitting into multiple stories or epic)

## Priority Guidelines

- **P0 (Critical)**: Blocking users, security issues, data loss, production outage
- **P1 (High)**: Major features, important fixes, user-facing improvements
- **P2 (Medium)**: Nice-to-have features, minor improvements, enhancements
- **P3 (Low)**: Tech debt, cleanup, future enhancements, optimizations

## Quality Checklist

Before creating story:
- [ ] User story follows "As a...I want...So that..." format
- [ ] At least 2 acceptance criteria with Given/When/Then
- [ ] Owner is appropriate for work type
- [ ] Priority reflects urgency and impact (P0-P3)
- [ ] Estimate is in Fibonacci sequence (1,2,3,5,8,13)
- [ ] File name matches pattern: US-####-descriptive-name.md
- [ ] Technical notes capture implementation details
- [ ] Definition of Done is comprehensive
- [ ] Story will be added to status.json with status=ready
- [ ] Test stub will be created

## Integration

- **agileflow-epic-planner**: Stories are part of epics
- **agileflow-sprint-planner**: Stories selected for sprints
- **agileflow-acceptance-criteria**: AC skill enhances AC sections
- **agileflow-adr**: Reference architectural decisions in technical notes

## Notes

- If user is vague, ask clarifying questions before generating story
- Update story number based on existing stories in docs/06-stories/
- If story is >13 points, suggest breaking into multiple stories or epic
- Use "diff-first; YES/NO" pattern - show story before writing file
- Create test stub to satisfy Definition of Ready
