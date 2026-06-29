# Code Quality Requirements

## Status

Draft

## Purpose

Define engineering quality requirements for application code so the project stays maintainable as MVP scope grows.

## Core Rules

- TypeScript must be used for application code.
- Type safety is required at domain and integration boundaries.
- Business logic must be testable without rendering the mobile UI.
- Code must prefer explicit data models over loosely shaped objects.
- Errors must be handled deliberately and surfaced through predictable user-facing states.
- Sensitive trip data must not be logged in plain text.
- Dead code, unused exports, and speculative abstractions must be removed before merge.

## TypeScript Standards

| ID | Requirement | Gate |
| --- | --- | --- |
| CQ-001 | `tsc --noEmit` or equivalent typecheck passes before release. | CI |
| CQ-002 | Avoid `any`; if unavoidable, keep it local and document why. | Review |
| CQ-003 | Domain entities use named types/interfaces. | Review |
| CQ-004 | External provider responses are mapped into internal domain models before use. | Review/Test |
| CQ-005 | Date/time logic is isolated and covered by tests. | Unit tests |

## React Native Standards

| ID | Requirement | Gate |
| --- | --- | --- |
| CQ-006 | Screens compose smaller components when a screen becomes hard to scan. | Review |
| CQ-007 | Components do not perform unrelated storage, network, and formatting work inline. | Review |
| CQ-008 | User-visible text is centralized enough to support Russian UI review. | Review/Test |
| CQ-009 | Touch targets and primary controls have accessible labels where needed. | Review/Test |
| CQ-010 | Loading, empty, error, offline, and success states are represented deliberately. | Review/Test |

## Error Handling

- Expected failures must produce typed or structured results where practical.
- Network-required actions must distinguish offline, timeout, invalid input, and provider failure when the user action differs.
- Data loss risks must be treated as high severity.
- Errors shown to the user must explain the next available step.

## Logging

- Logs must not include booking numbers, contacts, private notes, full addresses, or full flight details unless explicitly protected and justified.
- Debug logs must be removable or disabled for production builds.
- Error logs should use stable error codes or categories where useful.

## Review Checklist

- Is the code easy to test without the full app running?
- Are domain rules separated from presentation details?
- Are dates, ordering, offline state, and persistence boundaries covered?
- Are names clear enough to understand without reading unrelated files?
- Is there any sensitive data in logs, test snapshots, fixtures, or error messages?
