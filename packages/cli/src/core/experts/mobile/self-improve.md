# Mobile Expert - Self-Improve Workflow

**Purpose**: Automatically update expertise.yaml after completing mobile development work.

## When to Run

Run this workflow after:
- Implementing a new mobile feature
- Adding new screens or components
- Integrating new native modules
- Changing navigation structure
- Discovering new patterns or conventions

## Workflow

### Step 1: Load Current Expertise
```
Read: packages/cli/src/core/experts/mobile/expertise.yaml
```

### Step 2: Analyze Changes Made

Review what was just implemented:
1. What new files were created?
2. What existing files were modified?
3. What patterns were used?
4. What conventions were followed or established?
5. What was learned during implementation?

### Step 3: Generate Diff

Identify what's new or changed:
- New directories or files not in expertise
- New patterns discovered
- Convention changes
- Relationship changes
- Performance insights

### Step 4: Update Expertise

Add a new learning entry:
```yaml
learnings:
  - date: YYYY-MM-DD
    insight: "Brief description of what was learned"
    files_affected:
      - path/to/file1
      - path/to/file2
    context: "Story or task context"
```

Update other sections if needed:
- Add new file locations to `files:`
- Add new patterns to `patterns:`
- Update conventions if they changed
- Add new relationships discovered

### Step 5: Validate Update

Ensure the expertise file:
- Is valid YAML
- Has updated `last_updated` date
- Doesn't exceed ~200 lines (split if too large)
- Accurately reflects current codebase state

## Learning Categories

### File Discoveries
```yaml
learnings:
  - date: 2025-12-16
    insight: "Found gesture handling utilities in src/mobile/utils/gestures.ts"
    files_affected: [src/mobile/utils/gestures.ts]
    context: "US-0050: Implement swipe-to-delete"
```

### Pattern Learnings
```yaml
learnings:
  - date: 2025-12-16
    insight: "Bottom sheet pattern uses @gorhom/bottom-sheet library"
    files_affected: [src/mobile/components/BottomSheet.tsx]
    context: "US-0051: Add action sheet component"
```

### Convention Updates
```yaml
learnings:
  - date: 2025-12-16
    insight: "Navigation params must be typed in RootStackParamList"
    files_affected: [src/mobile/navigation/types.ts]
    context: "US-0052: Fix navigation type safety"
```

### Performance Insights
```yaml
learnings:
  - date: 2025-12-16
    insight: "FlatList with getItemLayout improves scroll performance 40%"
    files_affected: [src/mobile/components/ItemList.tsx]
    context: "US-0053: Optimize long list rendering"
```

## Example Update

Before work:
```yaml
files:
  react_native:
    - path: src/mobile/screens/
      purpose: "Screen components"
```

After implementing biometric auth:
```yaml
files:
  react_native:
    - path: src/mobile/screens/
      purpose: "Screen components"
  native_modules:
    - path: src/mobile/services/BiometricService.ts
      purpose: "Face ID / Touch ID authentication wrapper"

learnings:
  - date: 2025-12-16
    insight: "Biometric auth requires react-native-biometrics and iOS/Android native setup"
    files_affected:
      - src/mobile/services/BiometricService.ts
      - ios/Podfile
      - android/app/build.gradle
    context: "US-0054: Add biometric login"
```

## Key Principles

1. **Incremental Updates**: Small, frequent updates beat large rewrites
2. **Specific Context**: Always include story/task context
3. **Actionable Insights**: Learnings should help future work
4. **File References**: Link insights to specific files
5. **Date Everything**: Always include date for tracking
