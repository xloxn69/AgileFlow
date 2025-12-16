---
description: Plan, build, and improve UI feature with expertise-driven workflow
argument-hint: <UI feature description>
variables:
  EXPERTISE_FILE: packages/cli/src/core/experts/ui/expertise.yaml
---

# UI Expert: Plan → Build → Self-Improve

You are executing a complete UI feature implementation with automatic knowledge capture. This workflow ensures you leverage existing UI expertise, execute efficiently, and capture learnings for future tasks.

## CRITICAL: Three-Step Workflow

**You MUST follow this exact sequence. Do not skip steps.**

---

## Step 1: PLAN (Expertise-Informed)

### 1.1 Load Your Expertise
Read your expertise file at `{{EXPERTISE_FILE}}` FIRST.

Extract from it:
- Component file locations
- Component registry (existing components, their variants, props)
- Styling approach (Tailwind config, theme)
- UI patterns (forms, modals, tables)
- Accessibility conventions
- Recent learnings that might apply

### 1.2 Validate Against Codebase
Before planning, verify your expertise is accurate:

```bash
# Check component files exist
ls -la src/components/ components/ui/ app/components/ 2>/dev/null || true

# Check for recent UI changes
git log --oneline -5 -- "**/*component*" "**/*.tsx" "**/*.css" 2>/dev/null || true
```

Note any discrepancies between expertise and actual state.

### 1.3 Create Implementation Plan
Based on validated expertise, create a specific plan:

```markdown
## UI Implementation Plan

### Components to Create/Modify
1. [ComponentName] - [purpose]
   - Props: [list of props]
   - Variants: [if applicable]
   - Uses: [existing components it composes]

### Files to Create/Modify
- [component file path]
- [styles file if separate]
- [types file if needed]
- [story/test file if applicable]

### Pattern to Follow
[Reference specific pattern from expertise - e.g., "Use Card composition pattern from ProfileCard"]

### Existing Components to Use
- [Button variant=X]
- [Input with validation]
- [etc.]

### Accessibility Requirements
- [ ] Keyboard navigation
- [ ] ARIA labels
- [ ] Focus management
- [ ] Screen reader support

### Validation
- [ ] Component renders correctly
- [ ] All variants work
- [ ] Responsive behavior correct
- [ ] Accessibility passes
```

**Output**: A detailed plan with exact file paths and specific changes.

---

## Step 2: BUILD (Execute Plan)

### 2.1 Pre-Build Verification
Before making changes:
- Ensure referenced components exist
- Verify design tokens/theme values available
- Check for naming conflicts

### 2.2 Execute the Plan
Follow your implementation plan:

**Create component file:**
```typescript
// Follow component pattern from expertise
// Use consistent prop naming
// Apply proper TypeScript types
// Use Tailwind classes from theme
```

**Style considerations:**
- Use existing design tokens
- Follow responsive patterns from expertise
- Maintain dark mode support if applicable

### 2.3 Capture Changes
After building, document what changed:

```bash
# Capture the diff for self-improve
git diff --name-only | grep -E "(component|\.tsx|\.css|tailwind)"
git diff HEAD
```

### 2.4 Validate Build
Verify the implementation:
- Component renders without errors
- Props work as expected
- Styling looks correct
- Responsive at all breakpoints
- Accessibility requirements met

**Output**: Working UI component(s) with captured diff.

**On Failure**: Stop and report the error. Do NOT proceed to self-improve.

---

## Step 3: SELF-IMPROVE (Update Expertise)

**ONLY run this step if Step 2 succeeded.**

### 3.1 Analyze What Changed
Review the git diff and identify:
- New components added
- New variants on existing components
- New props added
- New composition patterns
- New styling patterns

### 3.2 Update Expertise File
Read and update `{{EXPERTISE_FILE}}`:

**Update `files` section if:**
```yaml
files:
  components:
    - path: path/to/new/Component.tsx
      purpose: "New component for [feature]"
```

**Update `relationships` (component registry) if:**
```yaml
relationships:
  - component: NewComponent
    location: src/components/ui/new-component.tsx
    props: [prop1, prop2, onAction]
    variants: [default, compact, expanded]
    composition: [Card, Button, Icon]
```

**Update `patterns` section if:**
New pattern discovered or confirmed.

**Update `conventions` section if:**
New naming or styling conventions applied.

### 3.3 Add Learnings Entry
**ALWAYS** add a new learnings entry:

```yaml
learnings:
  - date: 2025-12-16
    insight: "Added [component] for [purpose]"
    files_affected:
      - path/to/Component.tsx
      - path/to/styles.css
    context: "Feature: {{argument}}"
```

### 3.4 Validate Updated Expertise
Before saving:
- [ ] All file paths exist
- [ ] Component registry matches exports
- [ ] `last_updated` is current
- [ ] No duplicate component entries
- [ ] File stays focused (<200 lines)

### 3.5 Save Expertise
Write the updated expertise.yaml file.

---

## UI-Specific Error Handling

### If Component Won't Render
- Check import paths
- Verify props match types
- Check for missing context providers

### If Styling Broken
- Verify Tailwind classes exist in config
- Check for CSS specificity issues
- Verify theme tokens are defined

### If Accessibility Fails
- Add missing ARIA attributes
- Verify keyboard handlers
- Check focus management

---

## Example Usage

**Request**: "Add a sessions list component showing active user sessions"

**Step 1 Output** (Plan):
```markdown
## UI Implementation Plan

### Components to Create/Modify
1. SessionList - Display list of user sessions
   - Props: [sessions, onRevoke, isLoading]
   - Variants: [default, compact]
   - Uses: [Card, Badge, Button, Table]

### Files to Create/Modify
- src/components/sessions/SessionList.tsx
- src/components/sessions/SessionItem.tsx

### Pattern to Follow
Using Table pattern from UserList component
Using Badge for session status (active, expired)

### Existing Components to Use
- Card for container
- Badge variant="success" for active, variant="destructive" for expired
- Button variant="ghost" for revoke action
- Table components for layout
```

**Step 2 Output** (Build):
- Created SessionList.tsx with Table layout
- Created SessionItem.tsx for individual rows
- Used existing Badge and Button components
- Diff: 2 files created

**Step 3 Output** (Self-Improve):
- Added SessionList to component registry
- Added SessionItem to component registry
- Added learning: "Added SessionList using Table composition pattern"

---

## Feature Request

{{argument}}
