# ITER-01 Architecture Proposal

Iteration: 01
Agent: architecture_agent
Date: 2026-06-28
Status: Proposed for critic review

## Summary

This iteration proposes a local-first React Native/Expo + TypeScript MVP architecture for the travel planning app. The architecture keeps the MVP focused on manual trip aggregation, `Today / Days / Map`, local saved details, day planning, map context, external navigation handoff, manual flights, manual housing, notes, and optional checklists/reminders.

The current app scaffold is a static Expo screen. The proposed implementation turns it into a modular client app with typed domain models, local repositories, provider adapters, and independently testable slices.

## Architecture Proposal

Use a layered client architecture:

```text
features -> domain -> repository interfaces
features -> service interfaces
data adapters -> local storage
service adapters -> Expo/provider SDKs
```

Primary directories:

```text
src/app
src/features
src/domain
src/data
src/services
src/shared
```

The MVP source of truth is local device storage, preferably SQLite with explicit migrations after an implementation spike. Provider-specific map, place search, external navigation, and notification code stays behind interfaces.

## How It Works

1. User creates a trip with title and optional dates.
2. App opens the trip workspace with `Today`, `Days`, and `Map`.
3. `Today` is derived from trip dates and local clock; unknown dates fall back to manual day selection.
4. User adds places through search or manual entry.
5. Places with coordinates appear on maps; places without coordinates remain visible in lists and day plans.
6. User manually orders day items and can quickly edit time, note, title, or order.
7. App highlights a next item only when timed day items make it reliable.
8. User opens coordinates or address text in external maps for navigation.
9. Flights and housing are manually entered stable records.
10. Notes and optional checklists remain local and context-scoped.
11. Saved trip details remain readable without network because they are local records.

## Modules

- App Shell: boot, navigation, dependency injection, error boundaries.
- Trip Workspace: trip lifecycle and `Today / Days / Map` shell.
- Domain Models And Rules: typed entities, validation, today/next-item rules.
- Local Data Layer: migrations, repositories, local transactions.
- Places And Maps: manual/search place creation, map display, external handoff.
- Today And Day Planning: days, ordered plan items, quick edits.
- Flights: manual stable flight details only.
- Housing: manual stays, multiple housing objects, external handoff.
- Notes And Checklists: lightweight contextual data.
- Reminders: optional local reminder intent and local notification adapter.

## Data Flow

Write flow:

```text
Screen/Form -> feature action -> domain command -> repository -> SQLite transaction -> query refresh -> view model
```

Read flow:

```text
Screen -> feature query -> repository -> local database -> domain selectors -> view model
```

Provider flow:

```text
Feature UI -> provider interface -> provider adapter -> normalized domain object/result
```

## Implementation Slices

Full slice details are in `architecture/13_implementation_slices.md`.

Proposed order:

1. App Foundation
2. Domain Model And Pure Rules
3. Local Persistence And Repositories
4. Trip Creation And Trip Workspace
5. Day Planning And Quick Manual Edits
6. Places Manual Entry And Lists
7. External Navigation Handoff
8. Map Display Adapter
9. Place Search And Geocoding
10. Flights
11. Housing
12. Notes
13. Checklists
14. Saved Details Offline Behavior
15. Basic Reminders, only if still in first release
16. MVP Hardening

## Testing Strategy

- Domain unit tests for date mode, today selection, next item, validation, and ordering.
- Repository integration tests for migrations, persistence, relationships, ordering, and restart reads.
- Component tests for critical screens, empty states, and offline/online-only states.
- Adapter contract tests for map/search/navigation/notification services using mocks.
- E2E smoke test for the full MVP path after navigation and persistence exist.

## Decisions Needed

Proposed owner decisions:

- SQLite package and migration helper.
- Navigation library.
- Unit/component/E2E test stack.
- Map display provider.
- Place search/geocoding provider.
- Whether checklists are included in first release.
- Whether basic reminders are included in first release.
- Exact UI wording for saved offline details.

## Risks

- Provider choice can create cost and Expo compatibility risk.
- Manual forms can become too heavy and undermine the MVP.
- Offline wording can accidentally imply offline maps or routing.
- Local-only MVP lacks multi-device backup.
- Reminders can distract from Must flows.

## Critic Feedback Addressed

No critic feedback exists yet for iteration 01.

## Files Updated

- `architecture/11_architecture.md`
- `architecture/12_decisions.md`
- `architecture/13_implementation_slices.md`
- `architecture/14_architecture_review_log.md`
- `agent_workspace/pair_sessions/architecture/ITER-01-architecture-proposal.md`
