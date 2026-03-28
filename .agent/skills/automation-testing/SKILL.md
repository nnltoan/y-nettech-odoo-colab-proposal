---
description: Ensure functional parity and quality through End-to-End (E2E) and regression automation.
---

# Automation Testing Skill

## Purpose
This skill serves Round 3 of the competition (Migration Sprint + Automation Test). It focuses on ensuring that the migrated application matches the legacy application's functionality exactly through automated tests.

## 1. Test Strategy & Framework Setup
- **Framework Selection**: Primary recommendation: **Playwright** (fast, reliable, handles modern web apps). Alternative: Cypress.
- **Scope Definition**:
    - *Smoke Tests*: Critical paths (Login, Main Dashboard load).
    - *Functional Regression*: Detailed validation of business logic (Form submissions, Calculations).
    - *Visual Regression*: Pixel-perfect matching between design and implementation.

### Actions:
- Initialize Playwright/Cypress.
- Configure base URLs for Legacy (Reference) and Modern (Target) environments.

## 2. Test Case Parity
- **Traceability**: Link every test case to a specific Business Requirement ID or Legacy Screen ID.
- **Dual-Validation**:
    - Optional strategy: Run the SAME test payload against both Legacy API and Modern API and assert that responses are identical (where applicable).

## 3. Visual Regression Testing
- **Snapshots**: Capture screenshots of the new UI components.
- **Comparison**: Use tools like `playwright test --update-snapshots` or Percy/Applitools to detect unintended UI shifts.

## 4. Continuous Integration (CI)
- **Pipeline Integration**: Ensure tests run automatically on every commit/PR.
- **Reporting**: Generate HTML test reports to visualize pass/fail rates.

## 5. Deliverables for Round 3
- A comprehensive test suite covering the 10 migrated screens.
- A "Green" test report showing 100% pass rate for critical flows.
- Evidence of visual alignment with designs.
