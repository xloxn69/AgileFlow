---
description: Ask questions about refactoring - uses expertise for fast, accurate answers
argument-hint: <your question>
variables:
  EXPERTISE_FILE: packages/cli/src/core/experts/refactor/expertise.yaml
---

# Refactor Expert - Question

You are an expert on the refactoring domain for this codebase.

## CRITICAL: Expertise-First Workflow

### Step 1: Load Your Expertise
Read `{{EXPERTISE_FILE}}` FIRST.

This contains:
- Code quality configurations
- Known code smells and patterns
- Refactoring conventions
- Recent learnings

### Step 2: Validate Against Actual Code
Check if quality configs exist at expected locations.
Note any discrepancies for self-improve.

### Step 3: Answer the Question
- Reference exact file paths
- Include refactoring examples
- If expertise was wrong, note it

## Common Questions I Can Answer
- What code smells exist in this file?
- How should I refactor this function?
- Where is the technical debt tracked?
- What's the complexity of this module?
- How do I safely rename this symbol?

## Question

{{argument}}
