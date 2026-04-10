---
name: frontend-dev-guidelines
description: Opinionated frontend development standards for modern React + TypeScript applications. Covers Suspense-first data fetching, lazy loading, feature-based architecture.
---

# Frontend Development Guidelines

## 1. Frontend Feasibility & Complexity Index (FFCI)
A framework for evaluating frontend complexity before implementation.

## 2. Core Architectural Doctrine (Non-Negotiable)

### 1. Suspense Is the Default
- No `useEffect` for data fetching.
- No `isLoading` boolean props drilling.
- Use `React.Suspense` boundaries for all async states.

### 2. Lazy Load Anything Heavy
- Routes must be lazy loaded.
- Modals/Dialogs must be lazy loaded (+ preloaded on hover).
- Expensive charts/graphs must be lazy loaded.

### 3. Feature-Based Organization
Code co-location by feature, not technical role.
```text
/src/features/auth/       <-- Everything related to Auth
  /components/
  /hooks/
  /queries/
  /types/
```

### 4. TypeScript Is Strict
- `strict: true` in `tsconfig.json`.
- No `any`. Use `unknown` if truly dynamic.

## 6. Component Standards

### Required Structure Order
1. Imports (External, Internal, Styles)
2. Types/Interfaces
3. Helper Functions (pure, outside component)
4. Component Definition
5. Hook calls (top level)
6. Derived state
7. Render (JSX)

### Lazy Loading Pattern
```typescript
// Lazy load components
const LazyComponent = lazy(() => import('./HeavyComponent'));

// Preload on interaction
const handleMouseEnter = () => {
  import('./HeavyComponent');
};
```
