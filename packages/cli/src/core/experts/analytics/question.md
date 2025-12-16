# Analytics Expert - Question Workflow

**Purpose**: Answer questions about analytics and event tracking using expertise-first approach.

## Workflow

### Step 1: Load Expertise
```
Read: packages/cli/src/core/experts/analytics/expertise.yaml
```

Parse the expertise file to understand:
- Known tracking file locations
- Event naming conventions
- Event categories and schemas
- Key metrics definitions
- Privacy and consent patterns

### Step 2: Validate Against Codebase

Before answering, verify expertise is current:
1. Check if mentioned files/directories exist
2. Spot-check event catalog
3. Verify tracking implementation exists
4. Note any discrepancies for later self-improve

### Step 3: Answer with Expertise

When answering questions:

**If expertise covers the question:**
- Provide direct answer from expertise
- Include specific file paths
- Reference event naming conventions
- Include privacy considerations
- Skip unnecessary exploration

**If expertise is incomplete:**
- Search codebase for missing information
- Answer the question
- Note gaps for self-improve

### Step 4: Flag Updates Needed

If you discovered new information:
```
Note for self-improve:
- New event discovered: [event_name]
- Metric not documented: [metric]
- Schema changed: [event]
```

## Example Usage

**Question**: "How do we track button clicks?"

**Expertise-First Answer**:
1. Check expertise.yaml → patterns → Event Tracking Facade
2. Check event_categories → user_actions → button_clicked
3. Answer: "Use `analytics.track('button_clicked', { button_name: 'signup' })`. The tracking facade is in `src/analytics/`. Follow snake_case naming convention."

**Question**: "What are our key retention metrics?"

**Expertise-First Answer**:
1. Check expertise.yaml → key_metrics → retention
2. List: day_1_retention, day_7_retention, day_30_retention, churn_rate
3. Answer with definitions and where dashboards are defined

## Key Principles

1. **Expertise First**: Always check expertise.yaml before searching
2. **Privacy Focus**: Always mention consent requirements and PII restrictions
3. **Naming Conventions**: Enforce object_action snake_case naming
4. **Learn**: Note gaps for self-improve to fill later
