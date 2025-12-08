---
name: agileflow-acceptance-criteria
description: Generates detailed Given/When/Then acceptance criteria when user describes feature behavior or requirements. Enhances user stories with testable scenarios.
---

# AgileFlow Acceptance Criteria

Automatically generates detailed, testable acceptance criteria in Given/When/Then (Gherkin) format from feature discussions and requirements.

## When to Use

This skill activates when:
- User describes how a feature should behave
- Discussing user workflows or interactions
- Keywords: "acceptance criteria", "test scenarios", "should work like"
- Creating or reviewing user stories
- User describes "when user does X, then Y should happen"

## What This Does

1. Extracts feature behavior from user discussions
2. Identifies different scenarios (happy path, errors, edge cases)
3. Generates criteria in Given/When/Then format
4. Ensures criteria are specific, testable, and independent
5. Enhances story's AC section

## Instructions

1. **Listen for behavior descriptions**: User explains "when X happens, Y should occur"

2. **Extract scenarios**:
   - Happy path (normal use)
   - Error cases (what goes wrong)
   - Edge cases (boundary conditions)
   - Permission-based scenarios

3. **Generate criteria**:
   - One AC per distinct scenario
   - Clear, unambiguous language
   - Make it testable (observable outcome)
   - Include edge cases

4. **Add to story**: If working on a story, enhance its AC section

## Given/When/Then Format

```markdown
### AC#: [Criterion Name]
**Given** [initial context or precondition]
**When** [user action or trigger event]
**Then** [expected outcome or system behavior]
```

**Given** (Precondition):
- User's current state, system state, data that exists, permissions/roles
- Example: "Given I am logged in as an admin"

**When** (Action):
- What the user does, event that occurs, API call made
- Example: "When I click the 'Add to Cart' button"

**Then** (Outcome):
- What the user sees, system state changes, data modifications, error messages
- Example: "Then the item is added to my cart"

## Common Patterns

**Happy Path**:
```markdown
### AC1: Successful Login
**Given** I am on the login page
**When** I enter valid credentials and click "Login"
**Then** I am redirected to my dashboard
**And** I see a welcome message with my name
```

**Error Handling**:
```markdown
### AC2: Invalid Password
**Given** I am on the login page
**When** I enter a valid email but incorrect password
**Then** I see an error message "Invalid credentials"
**And** I remain on the login page
```

**Edge Cases**:
```markdown
### AC3: Account Locked After Failed Attempts
**Given** I have failed to login 4 times
**When** I attempt to login with incorrect password again
**Then** my account is locked for 30 minutes
**And** an email is sent to my registered address
```

**Permission-Based**:
```markdown
### AC4: Admin-Only Feature Access
**Given** I am logged in as a regular user
**When** I try to access the admin dashboard
**Then** I see a 403 Forbidden error
```

**Form Validation**:
```markdown
### AC1: Email Format Validation
**Given** I am filling out the registration form
**When** I enter an invalid email format (missing @)
**Then** I see an error "Please enter a valid email address"
**And** the submit button remains disabled
```

## Multiple Conditions

Use **And** for additional conditions:
```markdown
**Given** I am logged in
**And** I have items in my cart
**When** I click "Checkout"
**Then** I am redirected to payment page
**And** I see my cart summary
```

Use **But** for contrasting outcomes:
```markdown
**Given** I am on the search page
**When** I search for "nonexistent product"
**Then** I see "No results found" message
**But** I see suggested categories
```

## Quality Checklist

Good acceptance criteria are:
- [ ] **Specific**: Clearly describes one scenario
- [ ] **Testable**: Can be verified with a test
- [ ] **Independent**: Doesn't depend on order of execution
- [ ] **Unambiguous**: Only one interpretation possible
- [ ] **Complete**: Covers happy path, errors, and edge cases
- [ ] **User-focused**: Written from user's perspective
- [ ] **3-7 criteria per story**: Enough coverage, not excessive

## Integration

- **agileflow-story-writer**: Automatically enhances story AC sections
- **agileflow-sprint-planner**: Helps estimate story complexity from AC count
- **agileflow-tech-debt**: Identifies missing test coverage from AC

## Notes

- Aim for 3-7 acceptance criteria per story
- Too few = incomplete requirements
- Too many = story should be split
- Cover at least one error case per story
- Include accessibility criteria when relevant
- Consider mobile vs desktop differences
- Think about internationalization if applicable
