# Test Strategy

## Status

Draft

## Purpose

Describe the testing approach for the MVP mobile application and the agent workflow around quality.

## Test Levels

| Level | Goal | Owner | Candidate tools |
| --- | --- | --- | --- |
| Static checks | Catch type, lint, formatting, and dependency issues early. | Test Automation Agent | TypeScript, ESLint, Expo checks. |
| Unit tests | Verify pure logic: dates, current day selection, next item selection, validation, persistence adapters. | Test Automation Agent | Jest or Vitest, React Native Testing Library where useful. |
| Component tests | Verify screens and components render states correctly. | Test Automation Agent | React Native Testing Library. |
| Integration tests | Verify feature flows across storage, navigation, and service boundaries. | Test Automation Agent | Jest/RNTL with mocked storage and providers. |
| Mobile E2E tests | Verify critical user journeys on a real or simulated mobile app. | QA Engineer Agent | Maestro or Detox. |
| Exploratory testing | Find UX, resilience, and edge-case risks not captured by scripted tests. | QA Engineer Agent | Session-based manual testing. |
| Security/privacy checks | Verify logs, diagnostics, and local data handling. | Quality Lead Agent with Architecture Agent. | Manual review, targeted tests. |

## Initial Test Pyramid

- Many unit tests for date logic, validation, ordering, and persistence boundaries.
- Focused component tests for empty, error, offline, and normal states.
- A small number of E2E tests for the core MVP journey.
- Manual exploratory testing for mobile ergonomics and map/offline behavior until tooling is stable.

## Critical MVP Journeys

1. Create a trip with name and optional dates.
2. Add a place through search or manual entry.
3. Assign places and events to a day and preserve manual order.
4. Open current or selected day and see the next relevant item.
5. Add and open housing details.
6. Add and open flight details.
7. Add, edit, and delete notes.
8. Add and use checklist items if checklists remain in scope.
9. Open a place or housing address in an external maps app when data is sufficient.
10. Open previously saved current trip details without network.
11. Download and open the prepared offline map area, with saved points visible, after the map provider spike is accepted.

## Test Data Principles

- Use fake but realistic travel data.
- Do not use real booking numbers, phone numbers, personal addresses, or private notes.
- Keep reusable fixtures close to tests once test infrastructure exists.
- Include incomplete data cases, because incomplete manual entry is part of the MVP value.

## Automation Priorities

1. Static checks and typecheck script.
2. Unit tests for core domain logic.
3. Component tests for trip screen states.
4. E2E smoke test for the primary journey.
5. Regression suite mapped to Must requirements.

## Release Criteria

- All Must MVP requirements have mapped tests or documented manual checks.
- Critical MVP journeys pass on supported platforms.
- Offline access to saved current trip details is verified.
- No known critical data loss, crash, or privacy issue remains open.
- Known limitations are documented and do not contradict MVP scope.
