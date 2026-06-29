# Test Inventory

## Status

Draft

## Purpose

Track required tests for the application and map them to requirements.

## Test Status Values

- `Needed` - test is required but not yet designed.
- `Designed` - test case is described.
- `Automated` - test is implemented in automated suite.
- `Manual` - test is covered by a manual check.
- `Blocked` - test is blocked by product, architecture, or tooling decision.

## MVP Test Inventory

| Test ID | Requirement | Test | Level | Status |
| --- | --- | --- | --- | --- |
| T-001 | FR-001 | Create trip with name and known dates; reopen trip and verify empty plan/map/details sections. | E2E | Needed |
| T-002 | FR-001 | Create trip with unknown dates and verify user can continue. | E2E | Needed |
| T-003 | FR-002 | Switch between Today, Days, and Map without losing entered data. | E2E | Needed |
| T-004 | FR-003 | Add place from search result and verify it appears in list and map when coordinates exist. | Integration/E2E | Needed |
| T-005 | FR-004 | Add manual place without network and verify it appears in plan as needing coordinate clarification. | Integration/E2E | Needed |
| T-006 | FR-005 | Map renders saved coordinate places and keeps non-coordinate places available in list. | Component/E2E | Needed |
| T-007 | FR-006 | External maps action is available with address or coordinates and unavailable with clear state when data is missing. | Integration | Needed |
| T-008 | FR-007 | Add, remove, and reorder day items; verify order persists after reopening. | E2E | Needed |
| T-009 | FR-009 | Current trip date opens the matching day; missing dates show a manual selection state. | Unit/Component | Needed |
| T-010 | FR-010 | Nearest future item is selected when times exist; manual order is shown when times are absent. | Unit/Component | Needed |
| T-011 | FR-011 | Save flight with required stable fields and optional text fields. | Integration/E2E | Needed |
| T-012 | FR-012 | Save housing with minimal data and optional booking/contact/notes fields. | Integration/E2E | Needed |
| T-013 | FR-013 | Store multiple housing objects without merging details. | Integration | Needed |
| T-014 | FR-014 | Create, edit, open, and delete notes for trip, day, and object contexts. | Integration/E2E | Needed |
| T-015 | FR-015 | Create checklist, toggle items, untoggle items, delete items, and verify persistence. | Integration/E2E | Needed |
| T-016 | FR-016 | Open housing, flights, notes, and checklist from main trip screen in one action. | E2E | Needed |
| T-017 | FR-017 | Edit time, note, order, and manual item from day screen and return to updated day plan. | E2E | Needed |
| T-018 | FR-018 | Disable network and open previously saved trip details. | E2E/Manual | Needed |
| T-019 | FR-020 | Download map area, disable network, and verify saved map and trip points open. | E2E/Manual | Blocked |
| T-020 | NFR-005 | Trigger errors and verify logs do not expose booking numbers, contacts, notes, or full flight details. | Manual/Automated | Needed |
| T-021 | NFR-006 | Verify main MVP UI texts are in Russian. | Manual/Component | Needed |
| T-022 | NFR-008 | Review UI copy for outside-MVP promises. | Manual | Needed |

## Blockers

- T-019 depends on selected map provider and confirmed offline map API.
- Automation tool selection is still open for mobile E2E tests.
