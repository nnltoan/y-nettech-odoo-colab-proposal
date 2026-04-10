---
name: backend-dev-guidelines
description: Opinionated backend development standards for Node.js + Express + TypeScript microservices. Covers layered architecture, BaseController pattern, dependency injection.
---

# Backend Development Guidelines

## 3. Core Architecture Doctrine (Non-Negotiable)

### 1. Layered Architecture Is Mandatory
```text
Request → [Route] → [Controller] → [Service] → [Repository] → DB
```
- **Routes**: Define endpoints and middleware. No logic.
- **Controllers**: Parse input, call service, format response. No business logic.
- **Services**: Business logic, rules, orchestration. No HTTP knowledge.
- **Repositories**: Database access. No business logic.

### 2. Routes Only Route
Routes map URLs to Controller methods.
```typescript
// GOOD
router.get('/:id', UserController.getUser);

// BAD
router.get('/:id', async (req, res) => { ... });
```

### 3. Controllers Coordinate, Services Decide
Controllers validate input (Zod) and handle success/error responses.
Services perform the calculation or transaction.

### 4. All Controllers Extend `BaseController`
Standardize response format (`success`, `error`, pagination).

### 5. All Errors Go to Sentry
Global error handler middleware must catch and report exceptions.

## 4. Directory Structure (Canonical)
```text
/src
  /config         # Zod-validated env vars
  /controllers    # HTTP handlers
  /services       # Business logic
  /repositories   # Data access
  /models         # DB schema/types
  /middlewares    # Express middlewares
  /utils          # Shared utilities
  /app.ts         # App entry point
```
