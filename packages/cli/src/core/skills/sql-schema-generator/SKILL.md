---
name: sql-schema-generator
description: Generate SQL schemas with migrations and database table definitions
---

# sql-schema-generator

Generate SQL schemas with migrations.

## Activation Keywords
- "SQL", "schema", "database design", "CREATE TABLE", "migration"

## When to Use
- Designing database schemas
- Creating migrations for new features
- Defining table structures and relationships

## What This Does
Generates SQL DDL statements including:
- **CREATE TABLE** statements with data types
- **Indexes** for performance
- **Foreign keys** for relationships
- **Constraints** (NOT NULL, UNIQUE, CHECK)
- **Default values** where applicable
- **Comments** explaining purpose

Also generates:
- **Migration files** (with up/down versions)
- **Rollback procedures**
- **Data migration scripts** if needed

Coordinates with agileflow-database agent.

## Output
SQL migration files in migrations/ directory

## Example Activation
User: "Create users and sessions tables"
Skill: Generates:
```sql
-- Migration: 2025-10-28_create_users_table

-- UP: Create tables
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  INDEX idx_email (email),
  INDEX idx_created_at (created_at)
);

CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  token VARCHAR(500) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_expires_at (expires_at)
);

-- DOWN: Drop tables (for rollback)
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS users;
```
