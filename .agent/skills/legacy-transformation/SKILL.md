---
description: Analyze legacy systems, extract business rules, and migrate to modern architectures.
---

# Legacy Transformation Skill

## Purpose
This skill guides you through the process of analyzing legacy applications (source code and documentation), extracting core business requirements, and planning/executing a migration to a modern stack (e.g., ASP.NET to Angular/Node.js).

## 1. Analysis Phase (Discovery)
- **Inventory**: List all legacy assets (files, database schemas, documentation).
- **Tech Stack Identification**: Determine frameworks, languages, and dependencies of the legacy system.
- **Dependency Mapping**: Visualize or list how components interact (DB calls, API endpoints, internal libraries).

### Actions:
- Use `list_dir` and `view_file_outline` to survey the codebase structure.
- Use `grep_search` to find database connection strings, API routes, and key business logic markers (e.g., "Calculate", "Process", "Validation").

## 2. Extraction Phase (Document-to-Knowledge)
- **Business Rule Extraction**: deriving logical rules from code.
    - *Example*: Converting a C# `if-else` block validation logic into a plain English requirement.
- **Data Modeling**: Map legacy database schemas to modern equivalents (e.g., SQL Server `DATETIME` to PostgreSQL `TIMESTAMPTZ`).

### Actions:
- Create a "Migration Map" artifact listing:
    - Legacy Component -> Modern Component
    - Legacy Data Type -> Modern Data Type
    - Business Rule -> Requirement Description

## 3. Migration Phase (Strategy)
- **Pattern Selection**:
    - **Strangler Fig**: Replace specific functionalities piece-by-piece.
    - **Vertical Slice**: Migrate a full feature implementation (frontend + backend + db) to prove the stack.
- **UI Modernization**:
    - Analyze legacy UI forms (ASP.NET WebForms, Windows Forms).
    - Map controls to modern Component Library equivalents (e.g., Material UI, PrimeNG).

### Actions:
- Generate modern code that replicates the legacy logic but uses best practices (clean architecture, separation of concerns).
- Preserve function parity: The new input/output must match the old system's behavior exactly (unless a bug is explicitly fixed).

## 4. Verification
- Compare legacy outputs with modern outputs.
- Ensure all extracted requirements are met in the new implementation.
