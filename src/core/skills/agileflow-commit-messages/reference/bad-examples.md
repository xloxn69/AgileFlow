# Bad Commit Message Examples (and How to Fix Them)

## ❌ Too Vague

```
fix: fix bug
```

**Problem**: Doesn't explain what bug was fixed
**Better**:
```
fix(auth): prevent session timeout during active use

Fixed bug where user sessions expired after 30 minutes
even during active usage. Now sessions extend while user
is interacting with the application.

Fixes #456
```

## ❌ Wrong Tense

```
feat: added dark mode
```

**Problem**: Should be imperative mood ("add" not "added")
**Better**:
```
feat(ui): add dark mode toggle

Implemented dark mode with localStorage persistence
and system preference detection.

Closes #789
```

## ❌ Subject Too Long

```
feat: add a new user profile editing feature that allows users to update their name, email, and profile picture
```

**Problem**: Subject exceeds 50 characters, should be concise
**Better**:
```
feat(profile): add user profile editing

Users can now update their name, email, and profile
picture from the settings page. Changes are validated
server-side and saved to the database.

Closes #123
```

## ❌ No Type

```
update README
```

**Problem**: Missing type prefix
**Better**:
```
docs(readme): add API authentication examples

Added code examples showing how to authenticate API
requests using JWT tokens.
```

## ❌ Multiple Unrelated Changes

```
feat: add login and fix cart bug and update dependencies
```

**Problem**: Should be 3 separate commits
**Better**: Split into:
```
feat(auth): add user login functionality
```
```
fix(cart): resolve item duplication issue
```
```
chore(deps): update npm packages to latest versions
```

## ❌ Description of HOW Instead of WHY

```
fix: changed if statement to switch statement
```

**Problem**: Describes implementation detail, not the reason
**Better**:
```
refactor(validation): simplify input validation logic

Replaced nested if statements with switch statement
for better readability and easier maintenance. No
functional changes.
```

## ❌ Capitalized Subject

```
feat: Add Dark Mode Support
```

**Problem**: Subject should be lowercase
**Better**:
```
feat(ui): add dark mode support
```

## ❌ Period at End of Subject

```
fix: resolve login timeout issue.
```

**Problem**: Subject shouldn't end with period
**Better**:
```
fix(auth): resolve login timeout issue

Increased session timeout from 15 to 30 minutes to
prevent premature logouts during form filling.

Fixes #567
```

## ❌ No Context

```
fix: it works now
```

**Problem**: Completely uninformative
**Better**:
```
fix(payment): resolve Stripe webhook signature validation

Fixed HMAC signature verification by using raw request
body instead of parsed JSON. Webhooks now process correctly.

Fixes #890
```

## ❌ Missing Issue Reference

```
feat: add two-factor authentication

Implemented TOTP-based 2FA with QR code generation.
```

**Problem**: Should reference the issue/story
**Better**:
```
feat(auth): add two-factor authentication

Implemented TOTP-based 2FA with QR code generation
for enhanced account security.

Closes #234, STORY-042
```
