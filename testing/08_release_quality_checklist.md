# Release Quality Checklist

## Status

Draft

## Purpose

Define the checklist required before an MVP release candidate is accepted.

## Release Candidate Metadata

For every release candidate, record:

- date;
- build identifier;
- platform or platforms checked;
- commit or revision;
- tester;
- known limitations.

## Checklist

| ID | Check | Status |
| --- | --- | --- |
| RQ-001 | Typecheck passes. | Not Started |
| RQ-002 | Lint/static checks pass once configured. | Not Started |
| RQ-003 | Unit tests pass once configured. | Not Started |
| RQ-004 | Component/integration tests pass once configured. | Not Started |
| RQ-005 | E2E smoke or documented manual smoke passes for primary journey. | Not Started |
| RQ-006 | Must requirements have mapped coverage in `03_test_inventory.md`. | Not Started |
| RQ-007 | Offline saved-trip access is verified. | Not Started |
| RQ-008 | Privacy/logging check is completed. | Not Started |
| RQ-009 | UI does not promise outside-MVP functionality. | Not Started |
| RQ-010 | Russian UI baseline is checked for MVP flows. | Not Started |
| RQ-011 | Accessibility baseline is checked for primary controls. | Not Started |
| RQ-012 | Dependency changes are reviewed. | Not Started |
| RQ-013 | Known issues are documented with severity and decision. | Not Started |

## Manual Smoke Scenario

1. Open the app.
2. Create or open a trip.
3. Add a place.
4. Assign a place or event to a day.
5. Open Today or a selected day.
6. Add housing.
7. Add flight.
8. Add note.
9. Add checklist item if checklists are enabled.
10. Reopen the app and verify saved data is still present.
11. Simulate offline state and verify saved trip details are readable.

## Release Blockers

- Critical issue is open.
- High issue affects a Must requirement without accepted workaround.
- Saved trip details are not readable offline.
- Known privacy leak exists in logs, screenshots, reports, or fixtures.
- UI promises outside-MVP functionality.
