# Project Structure Quality

## Status

Draft

## Purpose

Define the expected project structure for the mobile application and prevent accidental architectural drift.

## Current Application Root

The mobile app lives in:

- `app/mobile/`

## Target Source Layout

When implementation expands beyond the prototype screen, prefer this layout:

```text
app/mobile/src/
  app/             app bootstrap, navigation, providers
  screens/         screen-level UI
  components/      reusable UI components
  features/        feature modules when a feature needs local structure
  domain/          domain models, rules, date logic, ordering logic
  storage/         local persistence adapters and migrations
  services/        external providers such as maps or search
  i18n/            user-visible strings and localization helpers
  test-utils/      fixtures, render helpers, mocks
```

Tests may live next to source files or in feature-level `__tests__/` folders. The chosen convention must stay consistent once selected.

## Boundary Rules

| ID | Rule | Reason |
| --- | --- | --- |
| PS-001 | UI components should not call raw storage APIs directly when a feature/domain boundary exists. | Keeps persistence testable and replaceable. |
| PS-002 | Screens may orchestrate UI state but should not own complex business rules. | Keeps behavior testable outside React. |
| PS-003 | External provider data must be adapted at service boundaries. | Avoids provider-specific shapes leaking through the app. |
| PS-004 | Offline behavior must be represented in domain/service state, not only in copy. | Makes offline behavior testable. |
| PS-005 | Test fixtures must not contain real personal data. | Protects privacy and prevents accidental leakage. |

## File Organization Rules

- Keep files small enough that one responsibility is visible.
- Prefer named exports for shared domain and utility code.
- Avoid circular imports.
- Avoid broad barrel exports until module boundaries are stable.
- Keep generated files, caches, and build output out of source folders.

## Growth Rules

- A feature can stay simple until it has enough code to justify a local module.
- Add abstractions only when they protect a real boundary or remove meaningful duplication.
- Document any deliberate structure exception in the implementation task or code review.

## Initial Architecture Fitness Checks

- UI code does not import map/search/storage provider internals directly once adapters exist.
- Domain logic has tests independent of React Native runtime.
- Offline behavior can be tested with mocked storage/network state.
- Project structure is reflected in developer documentation before release candidate.
