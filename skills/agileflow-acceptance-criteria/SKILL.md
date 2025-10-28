---
name: agileflow-acceptance-criteria
description: Generates detailed Given/When/Then acceptance criteria when user describes feature behavior or requirements. Enhances user stories with testable scenarios.
allowed-tools: Read, Write, Edit
---

# AgileFlow Acceptance Criteria

## Purpose

This skill automatically generates detailed, testable acceptance criteria in Given/When/Then (Gherkin) format from feature discussions and requirements.

## When This Skill Activates

Load this skill when:
- User describes how a feature should behave
- Discussing user workflows or interactions
- User mentions "acceptance criteria", "test scenarios", "should work like"
- Creating or reviewing user stories
- User describes "when user does X, then Y should happen"

## Given/When/Then Format

```markdown
### AC#: [Criterion Name]
**Given** [initial context or precondition]
**When** [user action or trigger event]
**Then** [expected outcome or system behavior]
```

## Components

### Given (Precondition)
The initial state before the action:
- User's current state
- System state
- Data that exists
- Permissions/roles

Examples:
- "Given I am logged in as an admin"
- "Given the shopping cart contains 3 items"
- "Given I am on the product details page"
- "Given dark mode is enabled"

### When (Action)
The trigger or user action:
- What the user does
- Event that occurs
- API call made

Examples:
- "When I click the 'Add to Cart' button"
- "When I submit the form"
- "When a new message arrives"
- "When the payment fails"

### Then (Outcome)
The expected result:
- What the user sees
- System state changes
- Data modifications
- Error messages
- Notifications

Examples:
- "Then the item is added to my cart"
- "Then I see a success message"
- "Then I am redirected to the dashboard"
- "Then an error message is displayed"

## Workflow

1. **Listen for behavior descriptions**: User explains "when X happens, Y should occur"

2. **Extract scenarios**:
   - Identify different paths (happy path, error cases, edge cases)
   - Note preconditions for each scenario
   - Capture expected outcomes

3. **Generate criteria**:
   - Create one AC per distinct scenario
   - Use clear, unambiguous language
   - Make it testable (observable outcome)
   - Include edge cases

4. **Add to story**: If working on a user story, enhance its AC section

## Types of Acceptance Criteria

### Happy Path
```markdown
### AC1: Successful Login
**Given** I am on the login page
**When** I enter valid credentials and click "Login"
**Then** I am redirected to my dashboard
**And** I see a welcome message with my name
```

### Error Handling
```markdown
### AC2: Invalid Password
**Given** I am on the login page
**When** I enter a valid email but incorrect password
**Then** I see an error message "Invalid credentials"
**And** I remain on the login page
**And** the password field is cleared
```

### Edge Cases
```markdown
### AC3: Account Locked After Failed Attempts
**Given** I have failed to login 4 times
**When** I attempt to login with incorrect password again
**Then** my account is locked for 30 minutes
**And** I see a message "Account locked. Try again in 30 minutes"
**And** an email is sent to my registered address
```

### Permission-Based
```markdown
### AC4: Admin-Only Feature Access
**Given** I am logged in as a regular user
**When** I try to access the admin dashboard
**Then** I see a 403 Forbidden error
**And** I am redirected to my user dashboard
```

## Quality Checklist

Good acceptance criteria are:
- [ ] **Specific**: Clearly describes one scenario
- [ ] **Testable**: Can be verified with a test
- [ ] **Independent**: Doesn't depend on order of execution
- [ ] **Unambiguous**: Only one interpretation possible
- [ ] **Complete**: Covers happy path, errors, and edge cases
- [ ] **User-focused**: Written from user's perspective

## Common Patterns

### Form Validation
```markdown
### AC1: Email Format Validation
**Given** I am filling out the registration form
**When** I enter an invalid email format (missing @)
**Then** I see an error "Please enter a valid email address"
**And** the submit button remains disabled
```

### State Transitions
```markdown
### AC2: Order Status Change
**Given** my order status is "Processing"
**When** the warehouse marks it as shipped
**Then** I see the status update to "Shipped"
**And** I receive an email with tracking information
```

### Permissions
```markdown
### AC3: File Edit Permission
**Given** I have "view-only" access to a document
**When** I try to edit the document
**Then** the edit button is disabled
**And** I see a tooltip "You need edit permissions"
```

### Responsive Behavior
```markdown
### AC4: Mobile Menu Toggle
**Given** I am viewing the site on a mobile device (width < 768px)
**When** I tap the menu icon
**Then** the navigation menu slides in from the left
**And** I can navigate to any section
```

## Integration with Other Skills

- **agileflow-story-writer**: Automatically enhances story AC sections
- **agileflow-sprint-planner**: Helps estimate story complexity from AC count
- **agileflow-tech-debt**: Identifies missing test coverage from AC

## Multiple Conditions (And/But)

Use **And** for additional conditions:
```markdown
**Given** I am logged in
**And** I have items in my cart
**When** I click "Checkout"
**Then** I am redirected to payment page
**And** I see my cart summary
**And** I see available payment methods
```

Use **But** for contrasting outcomes:
```markdown
**Given** I am on the search page
**When** I search for "nonexistent product"
**Then** I see "No results found" message
**But** I see suggested categories
**But** the search stays visible for retry
```

## Examples

See `examples/` directory for comprehensive AC sets across different feature types.

## Notes

- Aim for 3-7 acceptance criteria per story
- Too few = incomplete requirements
- Too many = story should be split
- Cover at least one error case per story
- Include accessibility criteria when relevant
- Consider mobile vs desktop differences
- Think about internationalization if applicable
