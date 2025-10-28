# api-documentation-generator

Generate OpenAPI/Swagger snippets with proper schemas.

## Activation Keywords
- "API doc", "OpenAPI", "Swagger", "endpoint docs", "endpoint documentation"

## When to Use
- Documenting REST API endpoints
- Creating OpenAPI/Swagger specifications
- Need endpoint documentation with request/response examples

## What This Does
Generates OpenAPI 3.0 specification snippets including:
- **Endpoint path and method** (GET, POST, etc.)
- **Summary and description**
- **Request body** with schema and examples
- **Response schemas** (success and error cases)
- **Parameters** (query, path, header)
- **Authentication** requirements
- **Status codes** and descriptions

Coordinates with agileflow-documentation agent for full API docs.

## Output
OpenAPI YAML/JSON snippet ready for integration into spec

## Example Activation
User: "Document POST /api/auth/login endpoint"
Skill: Generates:
```yaml
/api/auth/login:
  post:
    summary: User login with email and password
    tags: [Authentication]
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              email:
                type: string
                format: email
              password:
                type: string
    responses:
      '200':
        description: Login successful
        content:
          application/json:
            schema:
              type: object
              properties:
                token:
                  type: string
      '401':
        description: Invalid credentials
```
