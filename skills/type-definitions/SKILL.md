# type-definitions

Generate TypeScript interfaces and types from descriptions.

## Activation Keywords
- "TypeScript", "types", "@interface", "type definition", "interface definition"

## When to Use
- Creating TypeScript interfaces for data structures
- Defining function signatures
- Type-safe API request/response types

## What This Does
Generates TypeScript/TypeScript-compatible types including:
- **Interfaces** for data structures
- **Type aliases** for unions and primitives
- **Enums** for fixed sets of values
- **Generic types** for reusable patterns
- **JSDoc comments** for IDE intellisense
- **Type guards** for runtime validation

Includes proper typing with optionals, required fields, and readonly modifiers.

## Output
TypeScript code ready to add to types/ directory

## Example Activation
User: "Create types for User and LoginRequest"
Skill: Generates:
```typescript
/** User account information */
export interface User {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

/** Login request payload */
export interface LoginRequest {
  email: string;
  password: string;
}

/** Login response payload */
export interface LoginResponse {
  token: string;
  expiresIn: number;
  user: Omit<User, 'passwordHash'>;
}

/** Authentication error response */
export interface AuthError {
  code: 'INVALID_CREDENTIALS' | 'USER_NOT_FOUND' | 'RATE_LIMITED';
  message: string;
  retryAfter?: number;
}
```
