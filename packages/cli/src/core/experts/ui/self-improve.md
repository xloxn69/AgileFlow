---
description: Update UI expertise after making component/styling changes
argument-hint: [optional context about what changed]
variables:
  EXPERTISE_FILE: packages/cli/src/core/experts/ui/expertise.yaml
---

# UI Expert - Self-Improve

You are updating your mental model (expertise file) to reflect UI changes. This keeps your expertise accurate and useful for future tasks.

## CRITICAL: Self-Improve Workflow

### Step 1: Read Current Expertise
Load your expertise file at `{{EXPERTISE_FILE}}`.

Understand what you currently know about:
- Component file locations
- Component registry (variants, props)
- Styling patterns
- UI conventions

### Step 2: Analyze What Changed
Identify UI changes using:

**Check git diff for UI files:**
```bash
git diff HEAD~1 --name-only | grep -E "(components|styles|hooks|app.*page|tailwind)"
```

**Look for:**
- New components added
- Variants/props changed
- New patterns introduced
- Styling approach updated
- New hooks created

### Step 3: Update Expertise

**Update `files` section if:**
- New component directories added
- File structure reorganized
- New style files created

**Update `relationships` (component registry) if:**
- New components created
- Variants added to existing components
- Props changed
- Component composition changed

Example addition:
```yaml
relationships:
  - component: DataTable
    location: src/components/ui/data-table.tsx
    props: [columns, data, pagination, sorting]
    variants: []
    composition: [Table, TableHeader, TableBody, TableRow, TableCell]
```

**Update `patterns` section if:**
- New UI patterns introduced
- Existing patterns refined
- Better approaches discovered

**Update `conventions` section if:**
- Naming conventions changed
- New styling rules adopted
- Accessibility requirements updated

**ALWAYS add to `learnings` section:**
```yaml
learnings:
  - date: 2025-12-16
    insight: "Added DataTable component with sorting and pagination"
    files_affected:
      - src/components/ui/data-table.tsx
      - src/components/ui/data-table-pagination.tsx
    context: "US-0060 - Admin dashboard tables"
```

### Step 4: Validate Updated Model
After updating, verify:
1. All component file paths still exist
2. Component registry matches actual exports
3. Variants match what's in the code
4. Conventions reflect current practice

### Step 5: Write Updated Expertise
Save the updated expertise.yaml file with:
- Updated `last_updated` timestamp
- New/modified sections
- New learnings entry

## UI-Specific Rules

### DO:
- Track all reusable components
- Note component variants and props
- Record styling patterns
- Document accessibility approaches
- Update when design system changes

### DON'T:
- Store design tokens as hardcoded values
- Include one-off page-specific components
- Keep deprecated component references
- Document internal implementation details

## Quality Checklist

Before saving:
- [ ] `last_updated` is today's date
- [ ] All component file paths verified
- [ ] Component registry accurate
- [ ] New learnings entry added
- [ ] No references to deleted components
- [ ] Expertise stays focused (<200 lines)

## Context

{{argument}}
