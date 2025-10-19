# agent-ui

Invoke the AG-UI (UI/Presentation) subagent for front-end implementation.

## Prompt

Use the **agileflow-ui subagent** to implement this UI story.

**What AG-UI Does:**

🎨 **Design System Automation**
- Proactively detects existing design systems before first UI story
- Scans for CSS variables, design tokens, Tailwind config, hardcoded styles
- Offers to create design system if none exists:
  - Extracts colors, spacing, typography from existing components
  - Creates design token files (CSS variables, TypeScript, or Tailwind)
  - Migrates hardcoded styles to design tokens
- Multi-framework support: CSS/Vanilla, React/TypeScript, Tailwind
- Quality enforcement: No hardcoded colors, spacing, or fonts allowed

🧠 **UX Laws & Design Fundamentals**
Applies psychological principles to every UI implementation:
- **Jakob's Law**: Uses familiar patterns (don't reinvent dropdowns)
- **Miller's Law**: Chunks information (7±2 items in working memory)
- **Hick's Law**: Minimizes choices for critical actions
- **Gestalt Principles**: Groups related elements, clear visual hierarchy
- **Fitts's Law**: Large touch targets (≥44px), adequate spacing
- **Von Restorff Effect**: Only ONE primary CTA stands out per screen
- **Peak-End Rule**: Memorable moments at success states
- **Doherty Threshold**: Sub-400ms feedback (optimistic UI)
- **Tesler's Law**: Absorbs complexity in system, not user
- And 15+ more UX laws for usable, beautiful interfaces

♿ **Accessibility (WCAG 2.1 AA Minimum)**
- Keyboard navigation fully functional (Tab, Enter, Escape, Arrows)
- Screen reader support with semantic HTML and ARIA
- Color contrast ratios: 4.5:1 text, 3:1 UI
- Focus indicators clearly visible
- Alt text for meaningful images
- Forms have associated labels
- Tested with NVDA/VoiceOver

📋 **Comprehensive Quality Checklist**
Before marking in-review, verifies:
- Uses design tokens (no hardcoded values)
- Responsive across mobile/tablet/desktop (320px to 1920px+)
- All interactive elements have hover/focus/active states
- UX laws applied (Fitts's Law, Gestalt, Von Restorff, etc.)
- Accessibility fully functional (keyboard, screen reader, contrast)
- Consistent spacing (8px grid or design system scale)
- Loading states for async operations
- Error messages explain how to fix
- Tests cover happy path + edge cases + error states

📝 **CLAUDE.md Maintenance**
Proactively updates CLAUDE.md with UI patterns:
- After establishing design system → Documents token structure and usage
- After implementing new UI pattern → Adds pattern documentation
- After adopting styling approach → Documents conventions
- Keeps AI assistant informed about:
  - Styling system (tokens, CSS approach, global styles)
  - Component patterns (organization, naming, locations)
  - UI conventions (breakpoints, animations, icons)
  - Testing standards (how to write UI tests)

🔄 **Complete Workflow**
1. **[PROACTIVE]** Checks design system first (before first UI story)
2. Reviews READY stories from status.json where owner==AG-UI
3. Validates Definition of Ready (AC, test stub, deps)
4. Creates feature branch: feature/<US_ID>-<slug>
5. Implements with design tokens (diff-first, YES/NO)
6. Updates status.json → in-progress, appends bus message
7. Completes implementation with tests
8. **[PROACTIVE]** Updates CLAUDE.md if new patterns established
9. Updates status.json → in-review
10. Generates PR description with /pr-template
11. After merge → status.json → done

**Agent Scope:**
- UI components and layouts
- Styling, theming, design systems, design tokens
- CSS variables, theme files, global stylesheets
- Client-side interactions and state
- Accessibility implementation
- UX laws and psychological principles
- Stories in docs/06-stories/ where owner==AG-UI
- Files in src/components/, src/pages/, src/styles/, src/theme/

**Agent Boundaries:**
- Does NOT modify backend/API code (unless required by AC)
- Does NOT change CI/build config (coordinates with AG-CI)
- Does NOT skip accessibility testing
- Does NOT commit credentials/tokens/secrets

**First Action:**
1. Proactively checks for design system
   - If missing → Asks to create one based on existing styles
   - If inconsistent → Mentions findings
2. Asks what UI story to implement
   - Accepts specific STORY_ID, OR
   - Suggests 2-3 READY UI stories from status.json

---

**To invoke this subagent**, use the Task tool with:
```
subagent_type: "AgileFlow:agileflow-ui"
prompt: "Implement [STORY_ID or description]"
```

Or let Claude Code automatically select this agent when you mention UI/component/styling work.
