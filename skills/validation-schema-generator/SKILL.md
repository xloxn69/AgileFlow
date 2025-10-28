# validation-schema-generator

Generate input validation schemas (Joi, Zod, Yup).

## Activation Keywords
- "validation", "schema", "joi", "zod", "yup", "validate input"

## When to Use
- Creating request body validation
- Form validation schemas
- Input sanitization and validation

## What This Does
Generates validation schemas for popular libraries:
- **Joi** (Node.js)
- **Zod** (TypeScript)
- **Yup** (React forms)
- **Pydantic** (Python)

Includes:
- **Required/optional fields**
- **Type validation** (string, number, email, etc.)
- **Length constraints** (min, max)
- **Pattern validation** (regex)
- **Custom validators**
- **Error messages** (user-friendly)
- **Transformation rules** (trim, lowercase, etc.)

## Output
Validation schema code ready for integration

## Example Activation
User: "Create Zod validation for login request"
Skill: Generates:
```typescript
import { z } from 'zod';

export const loginRequestSchema = z.object({
  email: z
    .string('Email is required')
    .email('Invalid email format')
    .toLowerCase()
    .trim(),
  password: z
    .string('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain uppercase')
    .regex(/[0-9]/, 'Password must contain number'),
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;

// Usage
const validateLogin = (data: unknown) => {
  return loginRequestSchema.parse(data);
};
```

Also generates Joi, Yup, Pydantic versions.
