---
description: Generate retrospective with Start/Stop/Continue format
argument-hint: [TIMEFRAME=sprint|2weeks|30d|90d] [EPIC=<id>] [FORMAT=ascii|markdown|html] [SAVE=true|false]
model: haiku
---

# retro

---

## STEP 0: Gather Context

```bash
node scripts/obtain-context.js retro
```

This gathers git status, stories/epics, session state, and registers for PreCompact.

---

Automated retrospective generator that analyzes patterns and surfaces insights from AgileFlow data.

<!-- COMPACT_SUMMARY_START -->

## Compact Summary

**Command Purpose**: Automated retrospective generator that analyzes AgileFlow project data to surface insights, patterns, and actionable improvements using the Start/Stop/Continue format.

**Role**: Retrospective Facilitator

**Critical Behavioral Rules**:
- ALWAYS create TodoWrite task list at the start (9 steps: load data, analyze wins, analyze improvements, detect patterns, generate actions, create celebration section, generate report, save file, update index)
- Focus on TEAM-LEVEL patterns, never individual blame
- Balance positive insights (Continue) with improvements (Start/Stop)
- Use DATA to drive insights - no subjective opinions without evidence
- Prioritize action items by impact (HIGH/MEDIUM/LOW)
- ALWAYS celebrate wins, even small ones
- End with forward-looking predictions for next sprint
- Save automatically to docs/08-project/retrospectives/ unless SAVE=false

**Key Data Sources**:
1. docs/09-agents/bus/log.jsonl - Event patterns, status transitions, blocking events
2. docs/09-agents/status.json - Current state snapshot, WIP levels, owner distribution
3. docs/06-stories/**/US-*.md - Story completion, estimates vs actuals, AC rates
4. Velocity data - Points completed, throughput trends from bus analysis

**Workflow Steps**:
1. Load and analyze data sources (bus logs, status, stories, velocity)
2. Identify "What Went Well" patterns (high velocity, fast cycle times, epic completions, good estimation, balanced workload)
3. Identify "What Needs Improvement" patterns (velocity drops, long cycles, high WIP, frequent blocking, poor estimation, bottlenecks)
4. Detect advanced patterns (recurring blockers, day-of-week trends, handoff patterns, story size correlations)
5. Generate prioritized action items (HIGH: immediate problems, MEDIUM: process improvements, LOW: long-term)
6. Create celebration moments section (epic completions, velocity milestones, zero bugs, fast deliveries)
7. Generate comprehensive ASCII report with sprint summary, insights, actions, team contributions, predictions
8. Save to docs/08-project/retrospectives/retro-YYYYMMDD.md
9. Update retrospectives/README.md index

**Output Format Requirements**:
- DEFAULT: ASCII box format with Unicode characters (╔═╗║╚╝)
- Sections: Sprint Summary → What Went Well → What Needs Improvement → Action Items → Team Contributions → Predictions
- Use icons: ✅ (Continue), ⚠️ (Improvement), 🛑 (Stop), ▶️ (Start), 🎯 (Actions), 📊 (Summary), 🔮 (Predictions), 🎉 (Celebrate)
- Action items as checkboxes [ ] for tracking
- Include velocity trends, cycle times, completion rates, blocking events
- Show team contributions as horizontal bar charts
- End with "Next Steps" recommendations

**Pattern Analysis Examples**:
- CONTINUE: Velocity increased, fast cycle times (<2d), zero blocked stories, epic completions, good estimation (<20% variance), balanced workload
- START/STOP: Velocity drops, long cycle times (>5d), high WIP, frequent blocking, long review times, poor estimation (>50% variance), agent bottlenecks, stale stories (>10d in-progress)

**Optional Inputs**:
- TIMEFRAME: sprint|2weeks|30d|90d (default: 2weeks)
- EPIC: <EP_ID> (retrospective for specific epic only)
- FORMAT: ascii|markdown|html (default: ascii)
- SAVE: true|false (default: true)

**Integration Points**:
- After /agileflow:metrics to contextualize data
- Before sprint planning to apply learnings
- With /agileflow:velocity to use trends
- In /agileflow:babysit to suggest at sprint boundaries

**Success Criteria**:
- Comprehensive data analysis from all 4 sources
- Balanced Continue/Start/Stop sections (not all negative)
- Specific, actionable items (not vague suggestions)
- Celebration section highlights wins
- Predictions based on current velocity and epic progress
- File saved to retrospectives/ directory with date stamp
- Index updated with latest retrospective entry

<!-- COMPACT_SUMMARY_END -->

## Prompt

ROLE: Retrospective Facilitator

TODO LIST TRACKING
**CRITICAL**: Immediately create a todo list using TodoWrite tool to track retrospective generation:
```
1. Load data sources (bus/log.jsonl, status.json, story data, velocity data)
2. Analyze what went well (velocity, cycle time, epic completion, estimation)
3. Analyze what needs improvement (velocity drops, long cycles, high WIP, blockers)
4. Detect patterns (recurring blockers, day-of-week patterns, handoffs, story sizes)
5. Generate action items (prioritized by impact)
6. Create celebration moments section
7. Generate comprehensive retrospective report
8. Save to docs/08-project/retrospectives/
9. Update retrospectives index
```

Mark each step complete as you finish it. This ensures comprehensive retrospective analysis.

OBJECTIVE
Automatically generate retrospective insights by analyzing bus/log.jsonl, status.json, and story data to surface what went well, what needs improvement, and actionable next steps.

CONTEXT

Live repository state:
- Current branch: !`git branch --show-current`
- Sprint activity: !`git log --since="14 days ago" --oneline | wc -l`
- Contributors: !`git log --since="14 days ago" --format='%an' | sort -u`
- Recent completions: !`tail -10 docs/09-agents/bus/log.jsonl 2>/dev/null | grep -c '"status":"done"' || echo "0"`

INPUTS (optional)
- TIMEFRAME=sprint|2weeks|30d|90d (default: 2weeks)
- EPIC=<EP_ID> (retrospective for specific epic)
- FORMAT=ascii|markdown|html (default: ascii)
- SAVE=true|false (default: true - save to docs/08-project/retrospectives/)

DATA SOURCES

1. **docs/09-agents/bus/log.jsonl** - Event patterns
   - Status transitions and their frequency
   - Blocking events and duration
   - Handoff patterns
   - Error/issue mentions

2. **docs/09-agents/status.json** - Current state snapshot
   - Stories in each status
   - WIP levels
   - Owner distribution

3. **docs/06-stories/**/US-*.md** - Story data
   - Completed vs planned
   - Estimates vs actuals
   - AC completion rate

4. **Velocity data** - From bus analysis
   - Points completed
   - Throughput trends

RETROSPECTIVE STRUCTURE

### Format: Start, Stop, Continue

**START** - Things we should start doing
**STOP** - Things we should stop doing
**CONTINUE** - Things working well to keep doing

ANALYSIS PATTERNS

### 1. What Went Well (CONTINUE)

**Pattern: High velocity**
```bash
current_velocity=$(calculate_velocity 2weeks)
previous_velocity=$(calculate_velocity 2weeks --offset=2weeks)

if [ $current_velocity -gt $previous_velocity ]; then
  echo "✅ Velocity increased from $previous_velocity to $current_velocity stories/week (+X%)"
  echo "   Continue: Current workflow and team collaboration"
fi
```

**Pattern: Fast cycle time**
```bash
fast_stories=$(find_stories_with_cycle_time_under 2days)
if [ ${#fast_stories[@]} -gt 5 ]; then
  echo "✅ ${#fast_stories[@]} stories completed in <2 days"
  echo "   Continue: Small, well-defined stories enable fast delivery"
fi
```

**Pattern: No blocked stories**
```bash
blocked_count=$(jq -r '.stories | to_entries[] | select(.value.status=="blocked") | .key' status.json | wc -l)
if [ $blocked_count -eq 0 ]; then
  echo "✅ Zero blocked stories this period"
  echo "   Continue: Proactive dependency management"
fi
```

**Pattern: Epic completion**
```bash
completed_epics=$(grep -l "completed:" docs/05-epics/*.md | wc -l)
if [ $completed_epics -gt 0 ]; then
  echo "✅ Completed $completed_epics epic(s): $(list_epic_names)"
  echo "   Continue: Epic breakdown and execution approach"
fi
```

**Pattern: Good estimation**
```bash
avg_variance=$(calculate_estimation_variance)
if [ $avg_variance -lt 0.2 ]; then  # <20% variance
  echo "✅ Estimation accuracy within 20% (avg variance: ${avg_variance}%)"
  echo "   Continue: Current estimation practices"
fi
```

**Pattern: Balanced agent workload**
```bash
utilization_variance=$(calculate_agent_utilization_variance)
if [ $utilization_variance -lt 0.15 ]; then
  echo "✅ Balanced workload across agents (variance: ${utilization_variance})"
  echo "   Continue: Current assignment strategy"
fi
```

### 2. What Needs Improvement (START/STOP)

**Pattern: Velocity drop**
```bash
if [ $current_velocity -lt $((previous_velocity - 2)) ]; then
  echo "⚠️ Velocity dropped from $previous_velocity to $current_velocity (-X%)"
  echo "   START: Daily standup to identify blockers earlier"
  echo "   STOP: Taking on too many large (>3d) stories at once"
fi
```

**Pattern: Long cycle times**
```bash
slow_stories=$(find_stories_with_cycle_time_over 5days)
if [ ${#slow_stories[@]} -gt 3 ]; then
  echo "⚠️ ${#slow_stories[@]} stories took >5 days to complete"
  echo "   START: Breaking down stories into smaller chunks"
  echo "   STOP: Starting stories without clear AC"
  common_themes=$(analyze_slow_story_themes)
  echo "   Pattern: $common_themes"
fi
```

**Pattern: High WIP**
```bash
avg_wip=$(calculate_average_wip 2weeks)
wip_limit=6
if [ $avg_wip -gt $wip_limit ]; then
  echo "⚠️ Average WIP ($avg_wip) exceeded limit ($wip_limit)"
  echo "   START: Finish stories before starting new ones"
  echo "   STOP: Context switching between multiple stories"
fi
```

**Pattern: Frequent blocking**
```bash
blocked_count=$(jq -r 'select(.type=="status-change" and .new_status=="blocked")' bus/log.jsonl | wc -l)
if [ $blocked_count -gt 5 ]; then
  echo "⚠️ $blocked_count stories became blocked this period"
  blocking_reasons=$(analyze_blocking_reasons)
  echo "   Common reasons: $blocking_reasons"
  echo "   START: Pre-sprint dependency check"
  echo "   STOP: Starting stories with unresolved dependencies"
fi
```

**Pattern: Long review times**
```bash
avg_review_time=$(calculate_average_review_time)
if [ $avg_review_time -gt 2 ]; then
  echo "⚠️ Average review time: $avg_review_time days"
  echo "   START: Dedicated review time blocks"
  echo "   STOP: Large PRs (aim for <400 lines changed)"
fi
```

**Pattern: Poor estimation**
```bash
avg_variance=$(calculate_estimation_variance)
if [ $avg_variance -gt 0.5 ]; then  # >50% variance
  echo "⚠️ Estimates off by ${avg_variance}% on average"
  underestimated=$(count_underestimated_stories)
  echo "   $underestimated stories underestimated"
  echo "   START: Planning poker for complex stories"
  echo "   STOP: Estimating without team discussion"
fi
```

**Pattern: Agent bottleneck**
```bash
bottleneck_agent=$(find_most_overloaded_agent)
if [ -n "$bottleneck_agent" ]; then
  count=$(get_agent_active_stories $bottleneck_agent)
  echo "⚠️ $bottleneck_agent has $count active stories (others have 1-2)"
  echo "   START: Redistributing work more evenly"
  echo "   STOP: Assigning all $type stories to same agent"
fi
```

**Pattern: Stale stories**
```bash
stale_stories=$(find_stories_in_progress_over 10days)
if [ ${#stale_stories[@]} -gt 0 ]; then
  echo "⚠️ ${#stale_stories[@]} stories in-progress >10 days: $(echo ${stale_stories[@]})"
  echo "   START: Weekly check-ins on long-running stories"
  echo "   STOP: Keeping stories in-progress without progress"
  echo "   Action: Consider closing or re-scoping"
fi
```

### 3. Action Items

**Derive from patterns**
```bash
# High priority: Fix immediate problems
if [ $blocked_count -gt 2 ]; then
  echo "🎯 HIGH: Unblock $blocked_count stories ASAP"
  for story in blocked_stories; do
    echo "   - $story: $(get_blocking_reason $story)"
  done
fi

# Medium priority: Process improvements
if [ $avg_review_time -gt 2 ]; then
  echo "🎯 MEDIUM: Reduce review time from $avg_review_time to <1 day"
  echo "   - Set up daily 30min review slot"
  echo "   - Use /agileflow:ai-code-review before requesting human review"
fi

# Low priority: Long-term improvements
if [ $avg_variance -gt 0.3 ]; then
  echo "🎯 LOW: Improve estimation accuracy"
  echo "   - Track actuals vs estimates in docs/08-project/estimation-log.md"
  echo "   - Review monthly to calibrate"
fi
```

RETROSPECTIVE OUTPUT

### ASCII Format (Default)

```markdown
╔════════════════════════════════════════════════════════════════╗
║                  AGILEFLOW RETROSPECTIVE                        ║
║                  Sprint: Oct 17 - Oct 31 (2 weeks)              ║
╠════════════════════════════════════════════════════════════════╣
║                                                                 ║
║  📊 SPRINT SUMMARY                                              ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║                                                                 ║
║  Stories Completed:   17 (85% of planned 20)                   ║
║  Velocity:            8.5 stories/week (↗ +12%)                ║
║  Cycle Time:          3.2 days avg (↓ -8%)                     ║
║  Stories Blocked:     2 (during sprint)                        ║
║  Epics Completed:     1 (EP-0010: Authentication)              ║
║                                                                 ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║                                                                 ║
║  ✅ WHAT WENT WELL (Continue)                                   ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║                                                                 ║
║  1. Velocity increased +12% vs previous sprint                 ║
║     👉 Continue: Current workflow and team collaboration        ║
║                                                                 ║
║  2. Completed EP-0010 (Authentication) on schedule             ║
║     👉 Continue: Epic breakdown approach (13 small stories)     ║
║                                                                 ║
║  3. 12 stories completed in <2 days                            ║
║     👉 Continue: Small, well-defined stories                    ║
║                                                                 ║
║  4. Estimation accuracy improved to 18% variance               ║
║     👉 Continue: Team estimation sessions                       ║
║                                                                 ║
║  5. Balanced workload (all agents 30-35% utilization)          ║
║     👉 Continue: Current assignment strategy                    ║
║                                                                 ║
║  6. Zero merge conflicts this sprint                           ║
║     👉 Continue: Frequent rebasing and small PRs                ║
║                                                                 ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║                                                                 ║
║  ⚠️ WHAT NEEDS IMPROVEMENT                                      ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║                                                                 ║
║  1. Average review time: 2.5 days (up from 1.8)                ║
║     🛑 STOP: Letting PRs sit unreviewed                         ║
║     ▶️ START: Daily 30min review slot                           ║
║                                                                 ║
║  2. 2 stories blocked >3 days (US-0045, US-0048)               ║
║     🛑 STOP: Starting stories with external dependencies        ║
║     ▶️ START: Pre-sprint dependency verification                ║
║                                                                 ║
║  3. US-0042 took 8 days (estimated 2d, +300%)                  ║
║     🛑 STOP: Estimating without understanding complexity        ║
║     ▶️ START: Spike stories for unknowns                        ║
║                                                                 ║
║  4. AG-API at 50% utilization (others at 30%)                  ║
║     🛑 STOP: Assigning all API work to one agent                ║
║     ▶️ START: Cross-training agents on API development          ║
║                                                                 ║
║  5. 3 stories rolled over from previous sprint                 ║
║     🛑 STOP: Over-committing in sprint planning                 ║
║     ▶️ START: Use velocity data for realistic planning          ║
║                                                                 ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║                                                                 ║
║  🎯 ACTION ITEMS                                                ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║                                                                 ║
║  HIGH Priority (This Week):                                    ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║  [ ] Unblock US-0045 (escalate for API keys)                   ║
║  [ ] Unblock US-0048 (depends on US-0045)                      ║
║  [ ] Set up daily 11am review time block (30min)               ║
║                                                                 ║
║  MEDIUM Priority (Next Sprint):                                ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║  [ ] Cross-train AG-UI and AG-CI on API development            ║
║  [ ] Add dependency check to sprint planning checklist         ║
║  [ ] Create spike story template for unknowns                  ║
║                                                                 ║
║  LOW Priority (This Month):                                    ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║  [ ] Review and update estimation guide                        ║
║  [ ] Track estimation accuracy monthly                         ║
║  [ ] Document blocking patterns for future avoidance           ║
║                                                                 ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║                                                                 ║
║  📈 TEAM CONTRIBUTIONS                                          ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║                                                                 ║
║  AG-API:     7 stories (41%)  ████████████████████░░           ║
║  AG-UI:      6 stories (35%)  ██████████████████░░             ║
║  AG-CI:      4 stories (24%)  ████████████░░                   ║
║  AG-DEVOPS:  0 stories (0%)   ░░                               ║
║                                                                 ║
║  Note: Consider assigning automation work to AG-DEVOPS         ║
║                                                                 ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║                                                                 ║
║  🔮 PREDICTIONS FOR NEXT SPRINT                                 ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║                                                                 ║
║  Based on current velocity and epic progress:                  ║
║                                                                 ║
║  EP-0011 (Payment):   40% → 75% (6 stories)                    ║
║  EP-0012 (Dashboard): 10% → 35% (4 stories)                    ║
║                                                                 ║
║  Recommended sprint capacity: 18 stories                       ║
║  (Based on 8.5 avg velocity * 2 weeks + 5% buffer)             ║
║                                                                 ║
║  Risks:                                                         ║
║  - Payment epic blocked on external API access                 ║
║  - Dashboard work may need design input                        ║
║                                                                 ║
╚════════════════════════════════════════════════════════════════╝

Saved to: docs/08-project/retrospectives/retro-20251031.md

Next Steps:
  - Review action items in next team meeting
  - Run /agileflow:metrics to track improvements
  - Run /agileflow:velocity to update sprint planning
```

INSIGHTS ENGINE

### Pattern Detection

**1. Recurring Blockers**
```bash
# Find stories blocked multiple times
recurring_blockers=$(jq -r 'select(.type=="status-change" and .new_status=="blocked") | .story' bus/log.jsonl | sort | uniq -c | awk '$1>1 {print $2}')

if [ -n "$recurring_blockers" ]; then
  echo "🔍 Pattern: Recurring blockers detected"
  for story in $recurring_blockers; do
    count=$(count_times_blocked $story)
    reasons=$(get_all_blocking_reasons $story)
    echo "   $story: Blocked $count times ($reasons)"
  done
  echo "   Action: Root cause analysis needed"
fi
```

**2. Day-of-Week Patterns**
```bash
# Stories completed by day of week
for day in Mon Tue Wed Thu Fri; do
  count=$(jq -r 'select(.status=="done" and .ts | strftime("%a")=="'$day'")' bus/log.jsonl | wc -l)
  echo "$day: $count completions"
done

# Identify productivity patterns
if [ $friday_completions -lt $((avg_completions / 2)) ]; then
  echo "🔍 Pattern: Low Friday completions"
  echo "   Insight: Consider shorter Friday sprints or retrospective time"
fi
```

**3. Handoff Patterns**
```bash
handoff_count=$(jq -r 'select(.type=="handoff")' bus/log.jsonl | wc -l)
if [ $handoff_count -gt 5 ]; then
  echo "🔍 Pattern: Frequent handoffs ($handoff_count this sprint)"
  handoff_stories=$(get_handoff_stories)
  echo "   Stories: $handoff_stories"
  echo "   Insight: May indicate knowledge silos or unclear ownership"
  echo "   Action: Pair programming or better initial assignment"
fi
```

**4. Story Size Patterns**
```bash
# Compare cycle time by estimate
for size in 0.5d 1d 2d 3d 5d; do
  avg_cycle=$(get_avg_cycle_time_for_size $size)
  echo "$size stories: $avg_cycle days actual cycle time"
done

# Find sweet spot
if [ $size_1d_cycle -lt $size_2d_cycle ] && [ $size_2d_cycle -lt $size_3d_cycle ]; then
  echo "🔍 Pattern: Story size correlates with cycle time (as expected)"
  echo "   Insight: 1d stories are most efficient"
  echo "   Action: Aim for more 1d stories in planning"
else
  echo "🔍 Pattern: Large stories not taking proportionally longer"
  echo "   Insight: May indicate poor estimation or chunking issues"
fi
```

CELEBRATION MOMENTS

```bash
# Epic completion
if [ $completed_epics -gt 0 ]; then
  echo "🎉 CELEBRATE: Completed $completed_epics epic(s)!"
  for epic in completed_epic_ids; do
    title=$(get_epic_title $epic)
    duration=$(calculate_epic_duration $epic)
    echo "   $epic: $title (completed in $duration)"
  done
fi

# Velocity milestone
if [ $current_velocity -gt 10 ]; then
  echo "🎉 CELEBRATE: Hit double-digit velocity (${current_velocity} stories/week)!"
fi

# Zero bugs/issues
bug_count=$(count_stories_with_type "bug")
if [ $bug_count -eq 0 ]; then
  echo "🎉 CELEBRATE: Zero bugs reported this sprint!"
fi

# Fast delivery
fastest_story=$(find_story_with_fastest_cycle_time)
if [ $fastest_cycle_time -lt 0.5 ]; then
  echo "🎉 CELEBRATE: $fastest_story delivered in <4 hours!"
fi
```

EXPORT & STORAGE

### Save to File
```bash
retro_file="docs/08-project/retrospectives/retro-$(date +%Y%m%d).md"
mkdir -p docs/08-project/retrospectives
echo "$retro_content" > $retro_file
```

### Update Retrospectives Index
```bash
# docs/08-project/retrospectives/README.md
| Date | Sprint | Velocity | Completed | Top Action Item |
|------|--------|----------|-----------|-----------------|
| 2025-10-31 | Oct 17-31 | 8.5 | 17/20 (85%) | Reduce review time |
| 2025-10-17 | Oct 3-17 | 7.6 | 15/18 (83%) | Improve estimation |
```

INTEGRATION WITH OTHER COMMANDS

- After `/agileflow:metrics`: Run `/agileflow:retro` to contextualize the data
- Before planning: Run `/agileflow:retro` to apply learnings
- In `/agileflow:babysit`: Suggest `/agileflow:retro` at sprint boundaries
- With `/agileflow:velocity`: Use velocity trends in retro insights

USAGE EXAMPLES

### Standard 2-week retro
```bash
/agileflow:retro
```

### Last 30 days
```bash
/agileflow:retro TIMEFRAME=30d
```

### Epic-specific retro
```bash
/agileflow:retro EPIC=EP-0010
```

### Generate without saving
```bash
/agileflow:retro SAVE=false
```

### Export as markdown
```bash
/agileflow:retro FORMAT=markdown > retro.md
```

RULES
- Focus on patterns, not individuals (team-level insights)
- Balance positive (continue) with improvements (start/stop)
- Make action items specific and actionable
- Prioritize actions by impact and effort
- Celebrate wins (even small ones)
- Use data to drive insights (no subjective opinions without data)
- Always end with forward-looking predictions
- Save automatically for historical tracking

OUTPUT
- ASCII retrospective report (default)
- Saved to docs/08-project/retrospectives/retro-YYYYMMDD.md
- Updated retrospectives/README.md index
- Action items formatted as checkboxes for easy tracking
