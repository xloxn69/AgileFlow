---
name: error-handler-template
description: Generate error handling boilerplate with custom error classes and try/catch patterns
---

# error-handler-template

Generate error handling boilerplate for different languages.

## Activation Keywords
- "error handling", "try catch", "error handler", "exception handling"

## When to Use
- Implementing error handling for new features
- Standardizing error responses across API
- Creating error logging patterns

## What This Does
Generates language-specific error handling code including:
- **Error classes** with custom fields
- **Try/catch patterns** for common scenarios
- **Error middleware** for API servers
- **Logging integration** for errors
- **User-friendly error messages**
- **HTTP status code mapping**
- **Stack trace and context capture**

Supports: JavaScript/TypeScript, Python, Java, Go, Rust

## Output
Error handling code ready to integrate

## Example Activation
User: "Create error handling for login endpoint"
Skill: Generates (TypeScript):
```typescript
// Custom error class
class AuthError extends Error {
  constructor(
    public code: string,
    public statusCode: number,
    message: string,
    public context?: Record<string, any>
  ) {
    super(message);
  }
}

// Try/catch pattern
async function login(email: string, password: string) {
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      throw new AuthError('USER_NOT_FOUND', 404, 'User not found', { email });
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      logger.warn('Invalid password attempt', { email });
      throw new AuthError(
        'INVALID_CREDENTIALS',
        401,
        'Invalid email or password'
      );
    }

    return generateToken(user);
  } catch (error) {
    if (error instanceof AuthError) {
      logger.error(error.message, { code: error.code, context: error.context });
      throw error;
    }
    // Handle unexpected errors
    logger.error('Unexpected error in login', { error });
    throw new AuthError('INTERNAL_ERROR', 500, 'Internal server error');
  }
}
```
