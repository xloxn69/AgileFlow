# [STORY-042] Add Dark Mode Toggle to Settings

**Owner**: AG-UI
**Status**: TODO
**Epic**: [EPIC-005] User Experience Improvements
**Priority**: P2
**Estimate**: 5 story points

## User Story

As a user who works at night,
I want to toggle dark mode in the settings,
So that I can reduce eye strain and improve readability in low-light conditions.

## Acceptance Criteria

### AC1: Settings Toggle Available
**Given** I am on the settings page
**When** I navigate to the "Appearance" section
**Then** I should see a dark mode toggle switch

### AC2: Theme Switches Immediately
**Given** I am viewing the app in light mode
**When** I toggle dark mode on
**Then** the entire UI should switch to dark theme within 200ms

### AC3: Preference Persists
**Given** I have enabled dark mode
**When** I close and reopen the application
**Then** dark mode should still be active

### AC4: System Preference Detection
**Given** I have not set a preference
**When** the app loads for the first time
**Then** it should default to my system's dark mode preference

## Technical Notes

- Use CSS custom properties for theme colors
- Store preference in localStorage: `theme: 'light' | 'dark' | 'system'`
- Listen to `prefers-color-scheme` media query for system default
- Ensure all components support both themes
- Add transition animations for smooth mode switching

## Testing Strategy

- Test theme switching in all major browsers (Chrome, Firefox, Safari)
- Verify localStorage persistence across sessions
- Test system preference detection on different OS
- Validate WCAG contrast ratios in dark mode
- Test with keyboard navigation (accessibility)

## Definition of Done

- [ ] Dark mode toggle implemented in settings UI
- [ ] Theme preference stored in localStorage
- [ ] All components styled for dark mode
- [ ] System preference detection working
- [ ] Unit tests for theme switching logic
- [ ] E2E tests for toggle interaction
- [ ] Documentation updated with theme implementation details
- [ ] Deployed to staging and tested
- [ ] Accessibility audit passed (WCAG AA)
