# story-skeleton

Auto-generate story template with boilerplate sections pre-filled.

## Activation Keywords
- "create story", "new story", "story template", "story skeleton"

## When to Use
- User requests to create a new user story
- Need to quickly scaffold a story structure
- Starting epic implementation

## What This Does
Generates story YAML frontmatter + markdown template with:
- Story ID (auto-generated from epic context)
- Epic reference
- Title and description sections
- Acceptance Criteria (Given/When/Then format stubs)
- Architecture Context section with 6 subsections
- Previous Story Insights section
- Testing Strategy section
- Dev Agent Record template

## Output
Complete story file ready for population by epic-planner agent.

## Example Activation
User: "Create a story for user login API"
Skill: Generates story skeleton with all sections, ready for epic-planner to fill in details
