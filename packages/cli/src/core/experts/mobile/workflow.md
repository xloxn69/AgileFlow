# Mobile Expert - Complete Workflow

**Purpose**: End-to-end workflow for implementing mobile features with expertise-first approach.

## The Three-Step Workflow

```
Plan (with Expertise) → Build (Execute) → Self-Improve (Update Expertise)
```

---

## Step 1: Plan (with Expertise)

### 1.1 Load Expertise First
```
Read: packages/cli/src/core/experts/mobile/expertise.yaml
```

Parse and internalize:
- Known file locations (screens, components, navigation, services)
- React Native vs Flutter patterns
- Navigation conventions
- Native module patterns
- Performance targets

### 1.2 Validate Expertise Against Codebase

Before planning, verify expertise is current:
```bash
# Check key directories exist
ls src/mobile/screens/
ls src/mobile/components/
ls src/mobile/navigation/
```

Note any discrepancies for later update.

### 1.3 Create Detailed Plan

With expertise loaded, create implementation plan:

1. **Identify affected files** (from expertise, not searching)
2. **Determine patterns to use** (from patterns section)
3. **List specific changes needed**
4. **Note any gaps** in expertise that need exploration

Example Plan:
```markdown
## Implementation Plan: Add Profile Screen

### Files to Create/Modify (from expertise):
- Create: src/mobile/screens/ProfileScreen.tsx
- Modify: src/mobile/navigation/MainNavigator.tsx (add route)
- Create: src/mobile/components/ProfileCard.tsx

### Patterns to Use:
- Screen component pattern (from expertise)
- Stack navigation registration (from expertise)
- Platform-agnostic component (from conventions)

### Implementation Steps:
1. Create ProfileScreen with standard screen structure
2. Add ProfileCard reusable component
3. Register in MainNavigator
4. Add navigation params types
5. Test on iOS and Android
```

---

## Step 2: Build (Execute Plan)

### 2.1 Execute Implementation

Follow the plan exactly:
- Use file paths from expertise
- Apply patterns from expertise
- Follow conventions from expertise

### 2.2 Handle Discoveries

If you discover something not in expertise:
```markdown
## Discovery Log
- Found: src/mobile/utils/gestures.ts (not in expertise)
- Pattern: useNavigation hook preferred over navigation prop
- Convention: Screens export default, components named export
```

### 2.3 Test Implementation

Per expertise conventions:
- Test on real iOS device
- Test on real Android device
- Verify navigation flows
- Check performance targets

### 2.4 Capture Changes

Document what was actually changed:
```markdown
## Changes Made
- Created: src/mobile/screens/ProfileScreen.tsx
- Created: src/mobile/components/ProfileCard.tsx
- Modified: src/mobile/navigation/MainNavigator.tsx
- Modified: src/mobile/navigation/types.ts (added ProfileParams)
```

---

## Step 3: Self-Improve (Update Expertise)

### 3.1 Load Current Expertise
```
Read: packages/cli/src/core/experts/mobile/expertise.yaml
```

### 3.2 Identify Updates Needed

Compare discoveries with current expertise:
- New files not documented?
- New patterns discovered?
- Conventions that need updating?
- Performance insights gained?

### 3.3 Update Expertise File

Add learning entry:
```yaml
learnings:
  - date: 2025-12-16
    insight: "ProfileScreen requires ProfileParams in RootStackParamList"
    files_affected:
      - src/mobile/screens/ProfileScreen.tsx
      - src/mobile/navigation/types.ts
    context: "US-0090: Add profile screen"
```

Update `last_updated` date.

Add any new patterns discovered:
```yaml
patterns:
  - name: Screen Params Pattern
    description: "All screen params must be typed in RootStackParamList"
    location: src/mobile/navigation/types.ts
```

### 3.4 Validate Update

Ensure expertise.yaml:
- Is valid YAML
- Reflects current codebase state
- Stays under ~200 lines

---

## Quick Reference

### Before ANY Mobile Work
```
1. Read expertise.yaml
2. Validate against codebase
3. Plan with expertise knowledge
```

### After ANY Mobile Work
```
1. Document what was learned
2. Update expertise.yaml
3. Validate the update
```

### Key Files (from expertise)
- Screens: `src/mobile/screens/`
- Components: `src/mobile/components/`
- Navigation: `src/mobile/navigation/`
- Services: `src/mobile/services/`
- Native: `ios/`, `android/`

### Key Conventions (from expertise)
- Test on real devices (not just simulators)
- Use platform-agnostic code first
- Abstract native modules through services
- Handle safe area insets
- Minimum touch target: 44x44 points

---

## Example: Complete Feature Implementation

**Task**: Implement biometric login

### Plan Phase
```markdown
From expertise:
- Services location: src/mobile/services/
- Native modules need abstraction layer
- Must test on both platforms

Plan:
1. Create BiometricService.ts in services/
2. Add native setup for iOS (Face ID) and Android (Fingerprint)
3. Integrate with login screen
4. Test on both platforms
```

### Build Phase
```markdown
Created:
- src/mobile/services/BiometricService.ts
- Updated ios/Podfile (react-native-biometrics)
- Updated android/app/build.gradle

Tested:
- ✅ iOS Face ID working
- ✅ Android fingerprint working
```

### Self-Improve Phase
```yaml
learnings:
  - date: 2025-12-16
    insight: "Biometric auth requires react-native-biometrics and native setup"
    files_affected:
      - src/mobile/services/BiometricService.ts
      - ios/Podfile
      - android/app/build.gradle
    context: "US-0091: Biometric login"

# Updated files section:
native_modules:
  - path: src/mobile/services/BiometricService.ts
    purpose: "Face ID / Touch ID authentication wrapper"
```

---

This workflow ensures the agent learns from every task and becomes faster over time.
