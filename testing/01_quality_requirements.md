# Quality Requirements

## Status

Draft

## Purpose

Define what "good enough" means for the travel planning MVP before implementation and release.

## Quality Principles

- User-critical trip data must remain readable when the network is weak or unavailable.
- Manual input must tolerate incomplete data and let users save useful drafts.
- The mobile UI must support real trip usage: quick reading, quick edits, and no hidden desktop-only workflows.
- The product must not imply unsupported MVP features such as automatic import, live flight tracking, route optimization, booking, collaboration, LLM features, or offline routing without confirmed provider support.
- Personal travel data must not leak into logs, diagnostics, screenshots, or reports in open form.

## Quality Gates

| Gate | When | Required evidence |
| --- | --- | --- |
| QG-01 Requirements Testability | Before implementation of a feature | Requirement has acceptance criteria and at least one mapped test idea. |
| QG-02 Feature Ready For QA | Before manual QA | Feature has stable build, known scope, test data, and no blocking open questions. |
| QG-03 MVP Regression | Before MVP release candidate | Must requirements have regression coverage in `03_test_inventory.md`. |
| QG-04 Offline Safety | Before release candidate | Saved trip details are verified without network for current trip data. |
| QG-05 Privacy Check | Before release candidate | Logs and diagnostics are checked for booking numbers, contacts, notes, and full flight details. |

## Required Quality Attributes

| ID | Attribute | Requirement | Initial checks |
| --- | --- | --- | --- |
| QA-001 | Functional correctness | MVP flows match acceptance criteria in `requirements/07_requirements.md`. | Requirement-based manual and automated tests. |
| QA-002 | Mobile usability | Core flows work on phone-size screens without horizontal scrolling or unreadable controls. | UI walkthroughs on iOS, Android, and small viewport web if web is used for preview. |
| QA-003 | Offline resilience | Saved trip details remain available without network. | Offline mode checks for trip, days, places, flights, housing, notes, checklist, and map state. |
| QA-004 | Data integrity | User edits are saved, reopened, and not silently lost. | CRUD and persistence tests. |
| QA-005 | Privacy | Sensitive trip data is not exposed in plain diagnostic logs. | Log review and negative tests around error states. |
| QA-006 | Scope honesty | UI does not promise outside-MVP capabilities. | Copy and UX review against outside-MVP list. |
| QA-007 | Accessibility baseline | Primary controls are discoverable and usable with labels and readable contrast. | Accessibility labels, touch targets, and contrast checks. |

## Open Questions

- Which mobile test runner will be selected for end-to-end tests: Maestro, Detox, or another tool?
- Which map provider will be used, and how can offline map behavior be tested reliably?
- Which parts of the Expo app will be tested first with unit/component tests?
