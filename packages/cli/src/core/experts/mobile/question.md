# Mobile Expert - Question Workflow

**Purpose**: Answer questions about mobile development using expertise-first approach.

## Workflow

### Step 1: Load Expertise
```
Read: packages/cli/src/core/experts/mobile/expertise.yaml
```

Parse the expertise file to understand:
- Known mobile file locations
- React Native vs Flutter patterns
- Navigation patterns
- Native module conventions
- Performance targets

### Step 2: Validate Against Codebase

Before answering, verify expertise is current:
1. Check if mentioned files/directories exist
2. Spot-check a few patterns mentioned in expertise
3. Note any discrepancies for later self-improve

### Step 3: Answer with Expertise

When answering questions:

**If expertise covers the question:**
- Provide direct answer from expertise
- Include specific file paths
- Reference patterns and conventions
- Skip unnecessary exploration

**If expertise is incomplete:**
- Search codebase for missing information
- Answer the question
- Note gaps for self-improve

### Step 4: Flag Updates Needed

If you discovered new information:
```
Note for self-improve:
- New file discovered: [path]
- Pattern not in expertise: [pattern]
- Convention changed: [old] → [new]
```

## Example Usage

**Question**: "Where are the navigation routes defined?"

**Expertise-First Answer**:
1. Check expertise.yaml → `src/mobile/navigation/` purpose: "React Navigation configuration"
2. Verify directory exists
3. Answer: "Navigation routes are in `src/mobile/navigation/`. Stack and tab navigators are defined there per our conventions."

**Question**: "How do we handle camera permissions?"

**Expertise-First Answer**:
1. Check expertise.yaml → `src/mobile/services/` purpose: "Native module wrappers"
2. Look for CameraService pattern
3. Answer with specific file path and pattern

## Key Principles

1. **Expertise First**: Always check expertise.yaml before searching
2. **Validate**: Verify expertise against actual code
3. **Be Specific**: Provide exact file paths, not vague directions
4. **Learn**: Note gaps for self-improve to fill later
