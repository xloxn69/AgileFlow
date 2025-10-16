# auto-story

Automatically generate user stories from product artifacts like PRDs, mockups, or API docs.

## Prompt

ROLE: Story Generator

OBJECTIVE
Parse product documentation and generate actionable user stories with acceptance criteria.

INPUTS
- SOURCE=<file path or URL> (required: PRD, mockup, API spec, etc.)
- EPIC=<EP_ID> (optional: associate stories with existing epic)
- OWNER=<AG_ID> (optional: default owner for stories)
- AUTO_CREATE=yes|no (default: no, show preview first)

SUPPORTED SOURCES

### 1. Product Requirements Document (PRD)
Formats: .md, .docx, .pdf, .txt

Parse for:
- User personas
- Feature descriptions
- Success criteria
- Edge cases
- Non-functional requirements

### 2. UI Mockups/Designs
Formats: Figma URL, .png/.jpg (with OCR), design spec .md

Extract:
- Screens and components
- User interactions
- Navigation flows
- Form fields and validation

### 3. API Documentation
Formats: OpenAPI/Swagger JSON, .md

Extract:
- Endpoints (method + path)
- Request/response schemas
- Authentication requirements
- Error cases

### 4. User Flow Diagrams
Formats: Mermaid .mmd, PlantUML, .png (with OCR)

Extract:
- Steps in user journey
- Decision points
- Alternative paths

PARSING WORKFLOW

1. Read source file/URL
2. Identify document type
3. Extract features/requirements
4. Group related requirements
5. Generate stories with AC
6. Show preview (diff-first)
7. Create files (if approved)

EXAMPLE: PRD → Stories

**Input PRD**:
```markdown
# User Authentication Feature

## Overview
Allow users to register, log in, and manage their accounts.

## Requirements
- Users can register with email and password
- Email verification required before login
- Users can log in with verified email
- Users can reset forgotten password via email
- Session expires after 24 hours
- Support OAuth login with Google and GitHub

## Non-functional
- Login must complete in <500ms
- Password must be hashed with bcrypt
- Rate limit: 5 login attempts per minute
```

**Generated Stories**:

```markdown
---
story_id: US-0050
epic: EP-0010
title: User registration with email verification
owner: AG-API
status: ready
estimate: 1.5d
dependencies: []
---

# US-0050: User registration with email verification

## Description
As a new user, I want to register with my email and password so that I can create an account.

## Acceptance Criteria
- **Given** I am on the registration page
  **When** I enter a valid email and password (min 8 chars, 1 uppercase, 1 number)
  **Then** my account is created and a verification email is sent

- **Given** I receive the verification email
  **When** I click the verification link
  **Then** my email is marked as verified and I can log in

- **Given** I try to log in with an unverified email
  **When** I submit credentials
  **Then** I see an error: "Please verify your email first"

## Technical Notes
- Password hashing: bcrypt with 12 rounds
- Verification token: UUID v4, expires after 24 hours
- Email service: Use existing EmailService

## Testing Strategy
- Unit tests for registration logic
- Integration test for verification flow
- Security test: reject weak passwords

---

# US-0051: User login with session management

[Similar structure...]

---

# US-0052: Password reset flow

[Similar structure...]

---

# US-0053: OAuth login (Google)

[Similar structure...]

---

# US-0054: Rate limiting for login attempts

[Similar structure...]
```

EXAMPLE: API Spec → Stories

**Input OpenAPI**:
```yaml
paths:
  /api/users:
    post:
      summary: Create user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                name: { type: string }
                email: { type: string, format: email }
      responses:
        201: { description: User created }
        400: { description: Invalid input }
```

**Generated Story**:
```markdown
---
story_id: US-0060
title: Implement POST /api/users endpoint
owner: AG-API
estimate: 0.5d
---

# US-0060: Implement POST /api/users endpoint

## Acceptance Criteria
- **Given** a valid request body with name and email
  **When** POST /api/users is called
  **Then** a user is created and returns 201 with user object

- **Given** an invalid email format
  **When** POST /api/users is called
  **Then** returns 400 with error: "Invalid email format"

- **Given** a missing required field
  **When** POST /api/users is called
  **Then** returns 400 with error: "Field 'name' is required"

## Technical Notes
- Validate email format using regex or validator library
- Check for duplicate email (return 409 Conflict)
```

EXAMPLE: Mockup → Stories

**Input**: Screenshot of login form

**OCR/Analysis**:
- Text input: Email
- Text input: Password (masked)
- Checkbox: Remember me
- Button: Log In
- Link: Forgot password?
- Link: Sign up

**Generated Stories**:
```markdown
US-0070: Build login form UI component
US-0071: Implement "Remember me" functionality
US-0072: Create "Forgot password" flow
US-0073: Add "Sign up" registration link
```

STORY GENERATION RULES

### Good Story Characteristics (INVEST)
- **Independent**: Can be completed without dependencies
- **Negotiable**: Details can be adjusted
- **Valuable**: Delivers user-facing value
- **Estimable**: Can be sized (0.5-2 days)
- **Small**: Completable in 1 sprint
- **Testable**: Has clear acceptance criteria

### Acceptance Criteria Format
Always use Given/When/Then:
```markdown
- **Given** [precondition/context]
  **When** [action/trigger]
  **Then** [expected outcome]
```

### Estimates
- 0.5d: Simple CRUD, basic UI component
- 1d: Standard feature with validation and tests
- 1.5d: Complex logic or integration
- 2d: Significant refactor or architecture change

> If estimate >2d, suggest breaking into smaller stories

STORY GROUPING

Related stories are grouped into epics:
```
PRD: "User Authentication Feature"
→ Epic: EP-0010 "User Authentication"
  → US-0050: Registration
  → US-0051: Login
  → US-0052: Password reset
  → US-0053: OAuth (Google)
  → US-0054: OAuth (GitHub)
  → US-0055: Rate limiting
  → US-0056: Session management
```

OUTPUT PREVIEW

Before creating, show summary:
```markdown
# Story Generation Preview

**Source**: docs/requirements/auth-prd.md
**Epic**: EP-0010 (User Authentication)
**Stories to Create**: 7

## Summary
1. US-0050: User registration (1.5d, AG-API)
2. US-0051: User login (1d, AG-API)
3. US-0052: Password reset (1d, AG-API)
4. US-0053: OAuth Google (1.5d, AG-API)
5. US-0054: OAuth GitHub (1.5d, AG-API)
6. US-0055: Rate limiting (0.5d, AG-CI)
7. US-0056: Session management (1d, AG-API)

**Total Estimate**: 8.5 days
**Owners**: AG-API (6), AG-CI (1)

---

Preview of US-0050:
[Show first story in full]

---

Create these stories? (YES/NO)
```

ACTIONS (after approval)

1. Create epic (if EPIC not provided):
   - docs/05-epics/EP-XXXX.md

2. Create stories:
   - docs/06-stories/EP-XXXX/US-XXXX-<slug>.md (one per story)

3. Create test stubs:
   - docs/07-testing/test-cases/US-XXXX.md (one per story)

4. Update status.json:
   - Add all stories with status=ready

5. Append to bus:
   - {"type":"assign","story":"US-XXXX","owner":"AG-API"} for each

INTEGRATION

- Link back to source: Add "Source: <path or URL>" in story frontmatter
- Update source doc with story IDs (if editable markdown)
- Suggest running /readme-sync on docs/06-stories/

LIMITATIONS & WARNINGS

- **Review Generated Stories**: AI may misinterpret requirements
- **Add Context**: Stories may need technical details added manually
- **Dependencies**: Manually add dependencies between stories
- **Estimates**: Validate estimates based on team velocity

RULES
- Always preview before creating
- Generate 3-8 stories per epic (break down further if needed)
- Every story gets test stub
- Use consistent ID numbering
- Link stories to source document
- Diff-first, YES/NO for all file operations

OUTPUT
- Story generation preview
- Epic file (if created)
- Story files (multiple)
- Test stub files (multiple)
- Updated status.json
