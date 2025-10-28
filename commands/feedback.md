---
description: agent-feedback
allowed-tools: Bash, Read, Edit, Write, Glob, Grep
---

# agent-feedback

Collect feedback from agents and humans for continuous process improvement.

## Prompt

ROLE: Feedback Collector & Retrospective Facilitator

OBJECTIVE
Gather feedback on story completion, agent performance, and process effectiveness for continuous improvement.

INPUTS (optional)
- SCOPE=story|epic|sprint (default: story - feedback on single story)
- STORY=<US_ID> (required if SCOPE=story)
- EPIC=<EP_ID> (required if SCOPE=epic)
- ANONYMOUS=yes|no (default: no)

FEEDBACK TYPES

### 1. Story Completion Feedback
After marking story as "done", prompt for:
```markdown
## Story Feedback: <US_ID>

**Completed by**: <agent or human>
**Date**: <ISO timestamp>

### Definition of Ready (1-5 scale)
- Were acceptance criteria clear? (1=very unclear, 5=crystal clear): ___
- Were dependencies resolved? (1=many blockers, 5=no issues): ___
- Was estimate accurate? (1=way off, 5=spot on): ___

### Implementation Process (1-5 scale)
- How smooth was implementation? (1=many obstacles, 5=smooth): ___
- Were tests adequate? (1=missing, 5=comprehensive): ___
- Was documentation sufficient? (1=inadequate, 5=excellent): ___

### What Went Well? (2-3 bullets)
-
-
-

### What Could Be Improved? (2-3 bullets)
-
-
-

### Blockers Encountered? (if any)
-

### Learning/Insights? (optional)
-
```

### 2. Agent Performance Feedback
Track agent effectiveness:
```markdown
## Agent Feedback: <AGENT_ID>

**Time Period**: <start> to <end>
**Stories Completed**: X
**Stories Blocked**: Y
**Avg Completion Time**: Z days

### Strengths (observed patterns)
- Consistently writes thorough tests
- Updates status.json reliably
- Good at identifying edge cases

### Areas for Improvement
- Sometimes skips accessibility checks
- Could improve commit message clarity

### Recommendations
- Add accessibility checklist to workflow
- Review Conventional Commits guide
```

### 3. Epic Retrospective
After epic completion:
```markdown
## Epic Retrospective: <EP_ID>

**Completed**: <ISO timestamp>
**Duration**: X days (estimated: Y days)
**Stories**: X completed, Y blocked, Z punted

### Success Metrics (from epic definition)
- [ ] Goal 1: <status>
- [ ] Goal 2: <status>

### What Went Well?
-
-

### What Didn't Go Well?
-
-

### Surprises/Learnings?
-
-

### Actions for Next Epic
- [ ] Action 1
- [ ] Action 2
```

### 4. Sprint Retrospective
After sprint/iteration:
```markdown
## Sprint Retrospective: Sprint <N>

**Dates**: <start> to <end>
**Velocity**: X stories completed
**Team**: <list of agents/humans>

### Continue (keep doing)
-
-

### Stop (no longer useful)
-
-

### Start (new practices)
-
-

### Experiments (try next sprint)
-
-

### Blockers Removed This Sprint
-
-

### Recurring Issues (need addressing)
-
-
```

COLLECTION WORKFLOW

1. Auto-prompt at trigger points:
   - Story status → done
   - Epic 100% complete
   - Sprint end date reached

2. Present feedback form with pre-filled context

3. Ask: "Provide feedback now? (YES/NO/LATER)"
   - YES: Collect feedback interactively
   - NO: Skip (not required)
   - LATER: Add reminder to docs/09-agents/bus/log.jsonl

4. Save feedback to:
   - docs/08-project/feedback/<YYYYMMDD>-<US_ID or EP_ID>.md
   - Append summary to docs/08-project/retrospectives.md

ANALYSIS

### Patterns & Insights
Scan all feedback for patterns:
- Stories with "unclear AC" → Improve story template
- "Blocked by missing tests" → Enforce test stubs earlier
- "Estimate off by 2x" → Revise estimation guide

### Metrics Tracking
Track over time:
- Avg story clarity score (target: >4.0)
- Avg estimate accuracy (target: within 50%)
- Blocker frequency (target: <20% of stories)

### Agent Performance
Per agent:
- Completion rate
- Test coverage avg
- Status update reliability
- Feedback sentiment

ACTIONABLE OUTPUTS

### Improvement Stories
Auto-generate stories for recurring issues:
```
Issue: 5 stories in last sprint had "unclear AC" (score <3)
Suggested story: "US-XXXX: Improve story template with AC examples"

Issue: Estimates consistently off by 2x for API stories
Suggested ADR: "ADR-XXXX: Update estimation guidelines for backend work"
```

### Recognition
Celebrate wins:
```
🎉 AG-UI completed 8 stories this sprint with 100% test coverage!
🎉 AG-API reduced avg completion time from 2.1d to 1.6d
```

### Process Changes
Suggest concrete improvements:
```
Pattern detected: Stories with test stubs created upfront (by epic-planner)
have 40% fewer blockers.

Recommendation: Always create test stubs with /story-new.
```

RETROSPECTIVE REPORT
```markdown
# Retrospective Summary

**Period**: <start> to <end>
**Stories Reviewed**: X
**Epics Reviewed**: Y

---

## Overall Sentiment
📈 Improving: AC clarity (4.2 → 4.5)
📉 Declining: Estimate accuracy (85% → 78%)
➡️ Stable: Test coverage (avg 87%)

---

## Top Wins 🎉
1. Zero critical bugs this sprint
2. All security stories completed on time
3. Improved docs sync (100% of PRs had doc updates)

---

## Top Challenges ⚠️
1. Dependencies blocking 3 stories
2. Estimates off for DB migration work
3. Flaky E2E tests caused delays

---

## Actions for Next Iteration
- [ ] Review estimation guide for DB work (assign: EPIC-PLANNER)
- [ ] Fix flaky tests (assign: AG-CI, priority: high)
- [ ] Improve dependency tracking in story planning

---

## Insights & Learning
- Smaller stories (<1d) have 50% fewer blockers
- Pairing AG-UI and AG-API on complex features reduces handoff issues
- Weekly debt reviews prevent accumulation
```

INTEGRATION

### Story Creation
If feedback reveals issues, offer to create stories:
```
Feedback indicates: Test coverage inadequate for 3 stories

Create story? (YES/NO)
→ US-XXXX: Add missing tests for authentication flow
```

### ADR Creation
If architectural learnings emerge:
```
Learning: Microservices added complexity without clear benefit

Create ADR to document this? (YES/NO)
→ ADR-XXXX: Revert to modular monolith architecture
```

### Message Bus
Log feedback events:
```json
{"ts":"2025-10-16T10:00:00Z","type":"feedback","story":"US-0042","clarity":5,"smooth":4,"improved":"Add more examples in AC"}
```

AUTOMATION

Suggest periodic reminders:
```
# In docs/08-project/roadmap.md
- Every Friday: Sprint retrospective (if applicable)
- End of epic: Epic retrospective
- Monthly: Review all feedback for patterns
```

RULES
- Feedback is always optional (never block workflow)
- Keep feedback forms short (<5 min to complete)
- Focus on actionable insights, not blame
- Anonymize if requested
- Share retrospective summaries with team
- Celebrate wins before discussing challenges

OUTPUT
- Feedback form (interactive)
- Saved feedback (markdown)
- Optional: Retrospective summary
- Optional: Auto-generated improvement stories
