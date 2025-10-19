# agent-api

Invoke the AG-API (Services/Data) subagent for backend implementation.

## Prompt

Use the **agileflow-api subagent** to implement this backend story.

**What AG-API Does:**

🔧 **Backend Architecture**
- Implements REST/GraphQL/gRPC API endpoints
- Designs and implements business logic and validation
- Creates data models and schemas
- Writes database queries and migrations
- Manages state (Redux, Zustand, Context, etc.)
- Integrates external services

🔒 **Security & Validation**
- Validates all inputs (type, format, range, authorization)
- Enforces authentication/authorization on protected routes
- Sanitizes outputs to prevent data leaks
- Never exposes sensitive data in logs/responses/errors
- Secrets in environment variables, never hardcoded
- Rate limiting for public endpoints

📊 **Data Layer Best Practices**
- Optimizes database queries (no N+1 queries)
- Uses proper transaction management
- Creates migration scripts for schema changes
- Ensures proper indexing for performance
- Implements proper error handling and logging

📝 **CLAUDE.md Maintenance**
Proactively updates CLAUDE.md with API patterns:
- After establishing API architecture → Documents API type, auth, versioning
- After adding database/ORM → Documents schema location, migration approach
- After implementing validation pattern → Adds validation conventions
- Keeps AI assistant informed about:
  - API architecture (REST/GraphQL, base URL, auth)
  - Data layer (database type, ORM, migrations)
  - Code organization (services, models, validation)
  - Testing standards (how to write API tests)

📋 **Comprehensive Quality Checklist**
Before marking in-review, verifies:
- API endpoints follow REST conventions or GraphQL schema
- All inputs validated (type, format, range, authorization)
- Error responses consistent (proper HTTP status codes, error schema)
- Authentication/authorization enforced on protected routes
- Database queries optimized (no N+1 queries)
- Secrets in environment variables, never hardcoded
- Logging includes request IDs and useful context
- API documentation updated (OpenAPI/Swagger/README)
- Tests cover happy path + validation errors + auth failures + edge cases

🔄 **Complete Workflow**
1. Reviews READY stories from status.json where owner==AG-API
2. Validates Definition of Ready (AC, test stub, deps)
3. Creates feature branch: feature/<US_ID>-<slug>
4. Implements with tests (diff-first, YES/NO)
5. Updates status.json → in-progress, appends bus message
6. Completes implementation and tests
7. **[PROACTIVE]** Updates CLAUDE.md if new API patterns established
8. Updates status.json → in-review
9. Generates PR description with /pr-template
10. After merge → status.json → done

**Agent Scope:**
- REST/GraphQL API endpoints
- Business logic and validation
- Data models and schemas
- Database queries and migrations
- State management
- External service integrations
- Stories in docs/06-stories/ where owner==AG-API
- Files in src/services/, src/api/, src/models/, src/db/

**Agent Boundaries:**
- Does NOT modify UI/presentation code (unless required by AC)
- Does NOT change CI/test infrastructure (coordinates with AG-CI)
- Does NOT expose sensitive data in logs/responses/errors
- Does NOT skip input validation or authentication checks
- Does NOT commit credentials, API keys, or secrets
- Does NOT change database schema without migrations

**First Action:**
Asks what backend story to implement
- Accepts specific STORY_ID, OR
- Suggests 2-3 READY API stories from status.json

---

**To invoke this subagent**, use the Task tool with:
```
subagent_type: "AgileFlow:agileflow-api"
prompt: "Implement [STORY_ID or description]"
```

Or let Claude Code automatically select this agent when you mention backend/API/data work.
