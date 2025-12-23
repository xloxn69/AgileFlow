---
description: Track velocity and forecast sprint capacity
model: haiku
---

# velocity

Track team velocity, calculate trends, and forecast completion dates.

---

## STEP 0: Gather Context

```bash
node .agileflow/scripts/obtain-context.js velocity
```

This gathers git status, stories/epics, session state, and registers for PreCompact.

---

<!-- COMPACT_SUMMARY_START -->
## Compact Summary

**Purpose**: Velocity Analyst & Forecaster - Calculate team velocity, identify trends, and forecast epic/milestone completion dates

**Role**: Velocity Analyst responsible for tracking story completion velocity and predicting delivery timelines

**Critical Rules**:
- MUST parse bus/log.jsonl for "done" status changes
- MUST match stories to estimates from frontmatter
- MUST calculate over at least 3 time periods (for reliability)
- MUST warn if sample size too small (<5 stories)
- MUST exclude outliers (stories >3x avg) from velocity calc
- MUST account for holidays/time off in forecasts
- MUST update forecast confidence based on variance
- Save velocity history to docs/08-project/velocity/

**Inputs** (optional):
- PERIOD=week|sprint|month|all (default: sprint - last 2 weeks)
- FORECAST=<EPIC_ID or milestone> (predict completion date)
- FORMAT=report|chart|json (default: report)

**Data Sources**:
1. docs/09-agents/status.json - Current story state
2. docs/09-agents/bus/log.jsonl - Historical status changes
3. docs/06-stories/**/US-*.md - Story estimates and metadata
4. docs/05-epics/*.md - Epic definitions
5. docs/08-project/milestones.md - Milestone targets

**Velocity Calculation**:
```
Velocity = Total points completed / Number of time periods
```

Parse bus/log.jsonl for status changes to "done":
```json
{"ts":"2025-10-10T10:00:00Z","type":"status","story":"US-0030","status":"done"}
```

For each story, get estimate from frontmatter:
```yaml
estimate: 1.5d
```

Convert to points (1d = 1 point) and sum by time period.

**Forecasting Algorithm**:
```
Days to complete = (Remaining points / Velocity) * 7
Completion date = Today + Days to complete
Confidence = 100% - (Velocity std dev / Velocity avg) * 100
```

**Report Sections**:
1. Current Velocity (average, trend, last sprint, best/worst)
2. Historical Velocity (chart, weekly breakdown, insights)
3. Velocity by Owner (points/week, utilization, trends)
4. Forecast: Epic Completion (stories, remaining, forecast date, confidence)
5. Risk Analysis (velocity risks, schedule risks)
6. Capacity Planning (current capacity, recommendations)
7. Velocity Goals (current, target, action items)

**Output Formats**:
- report: Full markdown velocity report with charts
- chart: ASCII art velocity chart
- json: Machine-readable velocity data

**Workflow**:
1. Parse bus/log.jsonl for "done" status changes
2. Match stories to estimates from frontmatter
3. Group completions by time period (week/sprint)
4. Calculate velocity stats (avg, trend, std dev)
5. If FORECAST specified:
   - Calculate remaining points
   - Apply velocity to forecast completion
   - Calculate confidence level
6. Render report/chart
7. Suggest actions based on findings

**Output Files**:
- Velocity report: docs/08-project/velocity/velocity-YYYYMMDD.md
- Optional: Update stakeholder dashboard

**Success Criteria**:
- Velocity calculated from at least 3 time periods
- Trend analysis completed
- Forecast provided (if requested)
- Risk analysis included
- Actionable recommendations provided
- Report saved to velocity directory

<!-- COMPACT_SUMMARY_END -->

## Prompt

ROLE: Velocity Analyst & Forecaster

OBJECTIVE
Calculate team velocity from completed stories, identify trends, and forecast epic/milestone completion dates.

CONTEXT

Live repository state:
- Current branch: !`git branch --show-current`
- Commits this week: !`git log --since="7 days ago" --oneline | wc -l`
- Bus log activity: !`tail -5 docs/09-agents/bus/log.jsonl 2>/dev/null || echo "No bus log found"`
- Stories completed recently: !`grep -c '"status":"done"' docs/09-agents/status.json 2>/dev/null || echo "0"`

INPUTS (optional)
- PERIOD=week|sprint|month|all (default: sprint - last 2 weeks)
- FORECAST=<EPIC_ID or milestone> (predict completion date)
- FORMAT=report|chart|json (default: report)

DATA SOURCES

1. **Story Completion Data**
   - docs/09-agents/status.json (current state)
   - docs/09-agents/bus/log.jsonl (historical status changes)
   - docs/06-stories/**/US-*.md (story estimates and metadata)

2. **Epic/Milestone Data**
   - docs/05-epics/*.md (epic definitions)
   - docs/08-project/milestones.md (milestone targets)

VELOCITY CALCULATION

### Story Points Completed
Parse bus/log.jsonl for status changes to "done":
```json
{"ts":"2025-10-10T10:00:00Z","type":"status","story":"US-0030","status":"done"}
{"ts":"2025-10-11T14:30:00Z","type":"status","story":"US-0031","status":"done"}
```

For each story, get estimate from story file frontmatter:
```yaml
estimate: 1.5d
```

Convert to points (1d = 1 point) and sum by time period.

### Velocity Calculation
```
Velocity = Total points completed / Number of time periods
```

Example:
- Week 1: 8 points
- Week 2: 10 points
- Week 3: 7 points
- **Average velocity**: (8+10+7)/3 = **8.3 points/week**

VELOCITY REPORT

```markdown
# Velocity Report

**Generated**: 2025-10-17 14:30
**Period**: Last 4 sprints (8 weeks)
**Team**: AG-UI, AG-API, AG-CI, AG-DEVOPS

---

## 📊 Current Velocity

**Average**: 8.3 points/week
**Trend**: ↗️ +15% (improving)
**Last sprint**: 10 points
**Best sprint**: 12 points (Week of 2025-09-15)
**Worst sprint**: 5 points (Week of 2025-09-01)

---

## 📈 Historical Velocity

```
Points
 12 │           ●
 11 │         ╱
 10 │   ●   ●     ●
  9 │  ╱ ╲ ╱
  8 │ ●   ●
  7 │               ●
  6 │              ╱
  5 │    ●       ●
  4 │   ╱
  3 │
    └────────────────────
     W1 W2 W3 W4 W5 W6 W7 W8

Trend line: ─── (moving average)
Actual: ● ─ ●
```

**Weekly Breakdown**:
| Week | Points | Stories | Avg Size | Notes |
|------|--------|---------|----------|-------|
| 2025-10-14 | 10 | 6 | 1.7d | ↗️ +25% |
| 2025-10-07 | 8  | 5 | 1.6d | ↗️ +14% |
| 2025-09-30 | 7  | 4 | 1.8d | ↘️ -30% |
| 2025-09-23 | 10 | 7 | 1.4d | ↗️ +100% |
| 2025-09-16 | 5  | 3 | 1.7d | ↘️ -50% |
| 2025-09-09 | 10 | 6 | 1.7d | - |

**Insights**:
- Velocity is trending upward (+15% over 6 weeks)
- Best performance when story size ≤1.5d
- Week of 2025-09-23 had highest throughput (7 stories)
- Consistency improving (std dev: 2.1 → 1.8)

---

## 👥 Velocity by Owner

| Owner | Points/Week | Stories/Week | Utilization | Trend |
|-------|-------------|--------------|-------------|-------|
| AG-UI | 3.2 | 2.1 | 80% | ↗️ +10% |
| AG-API | 4.1 | 2.8 | 85% | ↗️ +20% |
| AG-CI | 0.8 | 0.6 | 40% | → Stable |
| AG-DEVOPS | 0.2 | 0.2 | 10% | 🆕 New |

**Observations**:
- AG-API is the team workhorse (4.1 pts/wk)
- AG-CI underutilized (consider more stories)
- AG-DEVOPS just started (too early for trends)

---

## 🎯 Forecast: Epic Completion

### EP-0010: User Authentication
- **Stories**: 12 total
- **Completed**: 8 (66%)
- **Remaining**: 4 stories, 6 points
- **At current velocity** (8.3 pts/wk): **< 1 week**
- **Forecast completion**: **2025-10-24** (7 days)
- **Confidence**: High (85%)

### EP-0011: Payment Integration
- **Stories**: 8 total
- **Completed**: 2 (25%)
- **Remaining**: 6 stories, 9 points
- **At current velocity** (8.3 pts/wk): **~1.1 weeks**
- **Forecast completion**: **2025-10-28** (11 days)
- **Confidence**: Medium (70%)

### Milestone: Public Beta Launch
- **Target date**: 2025-11-15
- **Total remaining**: 15 stories, 24 points
- **Weeks needed**: 24/8.3 = **2.9 weeks**
- **Forecast completion**: **2025-11-07** (21 days)
- **Status**: ✅ **On track** (8 days buffer)
- **Risk level**: Low

---

## ⚠️ Risk Analysis

### Velocity Risks
1. **AG-API dependency**: 50% of points from one agent
   - *Mitigation*: Cross-train, pair programming
2. **Story size variance**: Some 2d stories slow velocity
   - *Mitigation*: Split stories >1.5d
3. **Seasonal slowdown**: Historical dip in Week 5
   - *Mitigation*: Add buffer to forecasts

### Schedule Risks
- EP-0011 blocking Milestone: Public Beta
- If velocity drops 20% → Beta delayed to 2025-11-12
- If AG-API unavailable → 50% velocity loss

---

## 📅 Capacity Planning

**Current Capacity**: 8.3 points/week (4 agents)

**Recommendations**:
1. **This Sprint** (2 weeks):
   - Plan: 16-18 points (2x velocity)
   - Buffer: Keep 2-3 ready stories
   - Focus: Complete EP-0010

2. **Next Sprint**:
   - Plan: 16-20 points
   - Priority: EP-0011 (Beta blocker)
   - Consider: Add stories for AG-CI (underutilized)

3. **Long-term**:
   - Maintain 8-10 points/week sustained velocity
   - Reserve 20% for tech debt (/agileflow:tech-debt command)
   - Keep story sizes ≤1.5d for predictability

---

## 🎯 Velocity Goals

**Current**: 8.3 points/week
**Target**: 10 points/week (by end of quarter)
**Stretch**: 12 points/week

**Action Items**:
- [ ] Split 2 large stories (US-0050, US-0051)
- [ ] Assign 2 more stories to AG-CI
- [ ] Review blockers (US-0041)
- [ ] Celebrate hitting 10 pts/wk milestone! 🎉

---

## 📊 Export Options

Save this report?
- `docs/08-project/velocity/velocity-2025-10-17.md`
- Update velocity dashboard
- Add to stakeholder update
```

FORECASTING ALGORITHM

### Simple Linear Forecast
```
Days to complete = (Remaining points / Velocity) * 7
Completion date = Today + Days to complete
```

### Confidence Calculation
```
Confidence = 100% - (Velocity std dev / Velocity avg) * 100

High confidence: >80% (stable velocity)
Medium: 60-80% (some variance)
Low: <60% (high variance, unreliable)
```

### Monte Carlo Simulation (optional, advanced)
Run 1000 simulations with velocity variance:
```
For each simulation:
  - Sample velocity from normal distribution (mean, std dev)
  - Calculate completion date
  - Record result

Forecast:
  - P50 (median): 50% chance of completing by this date
  - P80: 80% chance
  - P90: 90% chance (conservative estimate)
```

VELOCITY CHART (ASCII Art)

```
Velocity Trend (8 weeks)

Points/Week
 12 ┤           ●●●
 11 ┤         ●
 10 ┤   ●●  ●
  9 ┤  ●  ●
  8 ┤ ●            ← Current (8.3 avg)
  7 ┤               ●
  6 ┤              ●
  5 ┤    ●       ●
  4 ┤   ●
  3 ┤
    └─────────────────────────────────────
     W1  W2  W3  W4  W5  W6  W7  W8

Legend:
  ● Actual velocity
  ─ Trend line (moving average)
  ↗️ Trend: +15% over period
```

VELOCITY BY STORY SIZE

```
Velocity by Story Size

Size    | Count | Avg Days | Success Rate
--------|-------|----------|-------------
≤0.5d   |   8   |   0.4d   | 100% ✅
0.5-1d  |  12   |   0.9d   |  92% ✅
1-1.5d  |  10   |   1.3d   |  80% ⚠️
1.5-2d  |   6   |   2.1d   |  67% ⚠️
>2d     |   3   |   3.5d   |  33% 🔴

**Insight**: Stories ≤1d complete faster and more reliably.
**Recommendation**: Split stories >1.5d into smaller increments.
```

JSON OUTPUT (for tooling)

```json
{
  "generated": "2025-10-17T14:30:00Z",
  "period": "8 weeks",
  "velocity": {
    "current": 8.3,
    "trend": "+15%",
    "last_sprint": 10,
    "best": 12,
    "worst": 5,
    "std_dev": 2.1
  },
  "by_owner": {
    "AG-UI": 3.2,
    "AG-API": 4.1,
    "AG-CI": 0.8,
    "AG-DEVOPS": 0.2
  },
  "forecasts": [
    {
      "epic": "EP-0010",
      "remaining_points": 6,
      "weeks_needed": 0.7,
      "completion_date": "2025-10-24",
      "confidence": 85
    }
  ],
  "risks": [
    {
      "type": "dependency",
      "description": "50% of points from AG-API",
      "severity": "medium"
    }
  ]
}
```

WORKFLOW

1. Parse bus/log.jsonl for "done" status changes
2. Match stories to estimates from frontmatter
3. Group completions by time period (week/sprint)
4. Calculate velocity stats (avg, trend, std dev)
5. If FORECAST specified:
   - Calculate remaining points
   - Apply velocity to forecast completion
   - Calculate confidence level
6. Render report/chart
7. Suggest actions based on findings

INTEGRATION

- Save velocity history to docs/08-project/velocity/
- Update /agileflow:stakeholder-update with velocity data
- Alert if velocity drops >20% from average
- Suggest sprint planning capacity based on velocity

RULES
- Always calculate over at least 3 time periods (for reliability)
- Warn if sample size too small (<5 stories)
- Exclude outliers (stories >3x avg) from velocity calc
- Account for holidays/time off in forecasts
- Update forecast confidence based on variance

OUTPUT
- Velocity report (markdown/chart/json)
- Trend analysis
- Forecasts for epics/milestones
- Risk analysis
- Action items
