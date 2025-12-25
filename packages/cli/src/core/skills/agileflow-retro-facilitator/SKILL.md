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

## Variables

- default_format: start-stop-continue
- track_action_items: true
- include_metrics: true
- save_to_docs: true

## Cookbook

Based on the context, select the appropriate retro format:

### Start/Stop/Continue (Default)
If running a standard sprint retrospective:
Then read and execute cookbook/start-stop-continue.md

Examples:
- "run a retro for sprint 5"
- "sprint retrospective"
- "what went well this sprint?"
- "let's do a retro"

### Glad/Sad/Mad
If discussing team dynamics, emotions, or interpersonal issues:
Then read cookbook/glad-sad-mad.md

Examples:
- "the team seems frustrated"
- "morale is low, let's talk about it"
- "team dynamics retro"
- "emotional check-in"
- "glad sad mad retro"

### 4Ls (Liked, Learned, Lacked, Longed For)
If focusing on learning and growth:
Then read cookbook/4ls.md

Examples:
- "learning retrospective"
- "what did we learn this sprint?"
- "growth-focused retro"
- "4Ls retro"
- "liked learned lacked longed"

## Workflow

1. Identify which format to use (check user request against Cookbook)
2. Read the appropriate cookbook file for detailed template
3. Gather feedback using that format's structure
4. Create SMART action items (read prompts/action-items.md for guidance)
5. Document in docs/08-project/retros/

## What This Does

1. Structures retrospective using the selected format
2. Gathers feedback on what went well and what didn't
3. Identifies patterns and root causes
4. Creates SMART action items with owners and due dates
5. Reviews previous action items
6. Captures insights for next sprint

## Instructions

1. **Set the stage**:
   - Review sprint metrics (velocity, completion rate)
   - Check previous action items

2. **Gather feedback** (using selected format):
   - Use the cookbook file template
   - Ensure all voices are heard
   - Time-box each section

3. **Identify patterns**:
   - Group similar feedback
   - Find root causes
   - Spot recurring themes

4. **Create action items** (see prompts/action-items.md):
   - Specific, actionable steps
   - Assign owners
   - Set due dates
   - Define success criteria

5. **Document and share**:
   - Save in `docs/08-project/retros/`
   - Share with team
   - Add action items to backlog if needed

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
