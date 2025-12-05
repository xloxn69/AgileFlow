---
description: Generate stakeholder progress report
allowed-tools: Bash, Read, Edit, Write, Glob, Grep
---

# stakeholder-update

Generate stakeholder communication updates from project status.

## Prompt

ROLE: Stakeholder Communication Generator

OBJECTIVE
Automatically generate high-level project updates suitable for stakeholders, executives, or clients.

INPUTS (optional)
- PERIOD=week|sprint|month|quarter|custom (default: week)
- START_DATE=<YYYY-MM-DD> (optional: for custom period)
- END_DATE=<YYYY-MM-DD> (optional: for custom period)
- AUDIENCE=exec|client|team|board (default: exec)
- FORMAT=email|markdown|slides|pdf (default: markdown)

DATA SOURCES

Aggregate information from:
1. **Status**: docs/09-agents/status.json
2. **Epics**: docs/05-epics/*.md
3. **Stories**: docs/06-stories/**/US-*.md
4. **Backlog**: docs/08-project/backlog.md
5. **Roadmap**: docs/08-project/roadmap.md
6. **Milestones**: docs/08-project/milestones.md
7. **Risks**: docs/08-project/risks.md
8. **Git History**: Commits, PRs merged
9. **Bus Log**: docs/09-agents/bus/log.jsonl (for context)
10. **ADRs**: docs/03-decisions/adr-*.md (recent decisions)

UPDATE STRUCTURE

### Executive Summary
- 2-3 sentence overview
- Key accomplishments
- Critical issues (if any)
- Overall status (On Track / At Risk / Blocked)

### Progress This Period
- Stories completed
- Epics progress
- Milestones reached

### Upcoming Work
- Next priorities
- Upcoming milestones

### Metrics
- Velocity
- Completion rate
- Quality metrics

### Blockers & Risks
- Current blockers
- Risk mitigation

### Decisions Made
- Recent ADRs

### Budget/Resources (if applicable)
- Sprint capacity used
- Team changes

EXAMPLE OUTPUT (Email Format)

```markdown
Subject: Weekly Update - Project XYZ (Oct 9-16, 2025)

Hi Team,

Here's this week's progress update for Project XYZ.

---

## 📊 Executive Summary

**Status**: 🟢 On Track

We completed the user authentication epic this week, delivering all planned features on schedule. The team is now focused on the payment integration milestone. No critical blockers at this time.

**Key Highlights**:
- ✅ User authentication fully implemented and tested
- ✅ 12 stories completed (velocity: 18 points)
- 🎯 Payment integration on track for end-of-month launch

---

## ✅ Completed This Week

### Epic: User Authentication (EP-0010) - 100%
- ✅ US-0050: User registration with email verification
- ✅ US-0051: Login with session management
- ✅ US-0052: Password reset flow
- ✅ US-0053: OAuth login (Google)
- ✅ US-0054: Rate limiting for security

**Impact**: Users can now create accounts, log in securely, and reset passwords. OAuth support enables faster onboarding.

### Other Completions
- ✅ US-0048: Improved dashboard loading time by 60%
- ✅ US-0049: Fixed critical bug in payment processing

---

## 🚀 In Progress

### Epic: Payment Integration (EP-0011) - 40%
- 🔄 US-0060: Stripe integration (in review)
- 🔄 US-0061: Checkout flow UI (in progress)
- ⏳ US-0062: Invoice generation (ready to start)

**Expected Completion**: October 30, 2025

---

## 📅 Upcoming Priorities (Next Week)

1. **Complete payment integration MVP** (EP-0011)
   - Finish Stripe integration
   - Build and test checkout flow
   - Generate invoices

2. **Start notification system** (EP-0012)
   - Email notifications for key events
   - In-app notification center

3. **Address technical debt**
   - Refactor auth service (improves maintainability)
   - Add missing integration tests

---

## 📈 Metrics

| Metric | This Week | Last Week | Trend |
|--------|-----------|-----------|-------|
| Stories Completed | 12 | 10 | ↗️ +20% |
| Velocity (points) | 18 | 15 | ↗️ +20% |
| Test Coverage | 87% | 85% | ↗️ +2% |
| Open Bugs | 3 | 5 | ↗️ -40% |
| Deployment Success Rate | 100% | 95% | ↗️ +5% |

**Sprint Burndown**: On track. 18 of 20 planned points completed.

---

## 🎯 Milestone Progress

### Q4 2025 Roadmap

- ✅ **User Authentication** (Oct 16) - COMPLETED
- 🔄 **Payment Integration** (Oct 30) - 40% complete, on track
- ⏳ **Public Beta Launch** (Nov 15) - On schedule
- ⏳ **Mobile App MVP** (Dec 1) - Planning phase

---

## ⚠️ Blockers & Risks

### Current Blockers
*None at this time*

### Risks Being Monitored

1. **Stripe API rate limits** (Medium Risk)
   - *Mitigation*: Implementing request queuing and caching
   - *Owner*: AG-API
   - *Status*: Mitigation in progress

2. **Third-party OAuth service downtime** (Low Risk)
   - *Mitigation*: Fallback to email login always available
   - *Owner*: AG-API
   - *Status*: Fallback implemented

---

## 🏗️ Key Decisions Made

### ADR-0015: Use Stripe for payment processing
**Decision**: Selected Stripe over PayPal for payment integration
**Rationale**: Better developer experience, lower fees, excellent documentation
**Impact**: Faster integration, reduced costs

### ADR-0016: Implement JWT-based authentication
**Decision**: Use JWT tokens with 15-minute expiry + refresh tokens
**Rationale**: Stateless, scalable, industry-standard
**Impact**: Simplified auth architecture

---

## 👥 Team Updates

- Team velocity increased 20% this week (improved planning)
- AG-CI agent optimized CI pipeline (reduced build time from 8min → 5min)
- No team changes

---

## 📦 Releases

- **v1.3.0** deployed to production (Oct 15)
  - User authentication features
  - Performance improvements
  - Security patches

---

## 💬 Additional Notes

The team is performing well and morale is high after completing the auth epic ahead of schedule. We're confident in hitting the October 30 payment integration milestone.

Next stakeholder update: October 23, 2025

---

Best regards,
Project Team

---

*Generated with AgileFlow /stakeholder-update*
*Data sources: status.json, epics, stories, git history*
```

AUDIENCE CUSTOMIZATION

### Executive (C-level)
- Very high-level
- Focus on business impact
- Include metrics and ROI
- Highlight risks early
- 1-page max

### Client
- Feature-focused
- Emphasize user benefits
- Transparent about issues
- Include screenshots/demos
- Show progress toward contract deliverables

### Team
- More technical detail
- Include architecture decisions
- Celebrate wins
- Retrospective insights
- Action items

### Board
- Strategic overview
- Financial implications
- Competitive positioning
- Long-term roadmap
- Risk assessment

FORMAT VARIATIONS

### Email (default)
Plain text or HTML email ready to send

### Markdown
For posting to internal wikis, Notion, etc.

### Slides
Generate slide deck outline:
```markdown
Slide 1: Title
- Project XYZ Update
- Week of Oct 9-16, 2025

Slide 2: Executive Summary
- Status: On Track
- 12 stories completed
- Auth epic finished

Slide 3: Progress This Week
- [Bullet points]

Slide 4: Metrics Dashboard
- [Charts/graphs data]

Slide 5: Next Priorities
- [Upcoming work]

Slide 6: Risks & Mitigation
- [Risk table]
```

### PDF
Formatted report with:
- Cover page
- Table of contents
- Charts/graphs
- Appendices

METRICS & VISUALIZATION

Include data visualizations (as ASCII art or suggest tools):
```
Sprint Burndown Chart (Remaining Points)
20 │     ●
18 │    ╱
16 │   ●
14 │  ╱
12 │ ●
10 │╱
 8 │●
 6 │ ╲
 4 │  ●
 2 │   ╲
 0 │    ●
   └────────────
   M T W T F

● = Actual
╱╲ = Ideal
```

Or suggest: "Generate charts with Chart.js / Google Sheets / Tableau"

AUTOMATION

### Scheduled Reports
Suggest adding to CI:
```yaml
- cron: '0 9 * * 1'  # Every Monday at 9am
  jobs:
    stakeholder-update:
      runs-on: ubuntu-latest
      steps:
        - name: Generate update
          run: npx claude-code /AgileFlow:stakeholder-update PERIOD=week

        - name: Email stakeholders
          uses: dawidd6/action-send-mail@v3
          with:
            server_address: smtp.gmail.com
            subject: Weekly Project Update
            body: file://update.md
            to: stakeholders@example.com
```

### Slack/Discord Integration
Post summary to team channels

WORKFLOW

1. Determine period (this week, last sprint, etc.)
2. Collect data from all sources
3. Calculate metrics and trends
4. Identify completed work
5. Identify blockers and risks
6. Format for audience
7. Preview (show to user)
8. Ask: "Send update? (YES/NO/EDIT)"
9. If YES:
   - Save to docs/08-project/updates/<YYYYMMDD>-update.md
   - Optionally email stakeholders
   - Log to bus/log.jsonl

INTEGRATION

- Link to epics and stories for details
- Reference ADRs for context on decisions
- Include GitHub PR links
- Optionally attach screenshots or demo videos

CUSTOMIZATION

Read project-specific settings from `.agileflow/stakeholder-config.json`:
```json
{
  "stakeholders": {
    "exec": ["ceo@example.com", "cto@example.com"],
    "client": ["client@example.com"],
    "board": ["board@example.com"]
  },
  "schedule": {
    "exec": "weekly",
    "client": "bi-weekly",
    "board": "monthly"
  },
  "metrics": ["velocity", "coverage", "bugs"],
  "includeFinancials": false
}
```

RULES
- Always be honest about blockers and risks
- Focus on business value, not technical jargon (for exec/client)
- Include specific numbers and metrics
- Highlight trends (improving/declining)
- Preview before sending (diff-first, YES/NO)
- Save all updates to docs/08-project/updates/ for history
- Never expose sensitive data (credentials, internal conflicts)

OUTPUT
- Stakeholder update (formatted for audience)
- Saved to docs/08-project/updates/
- Optional: Email sent to stakeholders
- Log entry in bus/log.jsonl
