# Decisions

## Status

Draft. Iteration 01 architecture decisions.

## Decision Format

```text
## YYYY-MM-DD - Title

Status: Proposed | Accepted | Rejected | Superseded

Context:

Decision:

Consequences:

Links:
```

## 2026-06-28 - MVP Mobile Stack Direction

Status: Accepted

Context:

The MVP is mobile-first and intended for real trip use. Candidate stacks were Swift/iOS, React Native/Expo, Flutter, and PWA/mobile-first web. The current scaffold is already React Native/Expo with TypeScript.

Decision:

Use React Native/Expo with TypeScript as the MVP mobile stack. Validate first on phone-oriented layouts while keeping Android reachable from the same codebase.

Consequences:

The app can be built incrementally from the existing Expo scaffold. Native maps, local persistence, and notifications still require deliberate library choices and device testing.

Links:

- `architecture/11_architecture.md`
- `app/mobile/package.json`
- `requirements/08_mvp.md`

## 2026-06-28 - Local-First MVP Source Of Truth

Status: Proposed

Context:

The MVP validates personal manual trip aggregation. Backend, sync, collaboration, accounts, automatic import, and LLM are outside MVP.

Decision:

Make the on-device database the MVP source of truth. Creating, editing, and reading trips must not require a backend.

Consequences:

Saved trip details can remain readable without network and infrastructure scope stays small. Multi-device sync, backup, account login, sharing, and conflict resolution become explicit later decisions.

Links:

- `architecture/11_architecture.md`
- `requirements/07_requirements.md`
- `requirements/08_mvp.md`

## 2026-06-28 - SQLite-Backed Persistence

Status: Proposed

Context:

Trip data is relational enough to need stable IDs, scoped child records, ordered day items, migrations, and local queries. The current Expo scaffold has no persistence dependency.

Decision:

Use an Expo-compatible SQLite-backed local database with explicit migrations for MVP persistence. Keep raw storage access inside `data/storage` and expose repository interfaces to features.

Consequences:

The app gets durable local reads/writes and a future sync-ready data shape. The team must run a short implementation spike to choose the exact package and migration helper before persistence work starts.

Links:

- `architecture/11_architecture.md`
- `architecture/13_implementation_slices.md`

## 2026-06-28 - Technical Decision Gate Before Broad Feature Work

Status: Proposed

Context:

The first architecture review found that storage, migrations, navigation, tests, map display, and search/geocoding were named but not bounded enough to unblock implementation.

Decision:

Run a short decision gate before broad feature slices. The gate must produce accepted decisions or explicit defer/fallback notes for:

- SQLite package and migration approach: clean install migration, app restart read, typed repository test harness.
- Navigation: Expo-compatible stack, tab/modal support for `Today / Days / Map`, deep enough screen transitions for CRUD/detail flows.
- Test stack: pure TypeScript unit tests, React Native component tests, repository integration tests, and an E2E or scripted smoke path.
- Map provider: Expo compatibility, API key/cost notes, marker rendering for saved coordinates, mockable adapter.
- Search/geocoding provider: query/resolve capability, quota/cost notes, offline/error behavior, normalized result shape.

Consequences:

Implementation can start with known dependencies and test harnesses instead of spreading provisional choices through feature code. The gate must not build production UI beyond minimal proof checks.

Links:

- `architecture/13_implementation_slices.md`

## 2026-06-28 - First-Release Scope Gate For Should Features

Status: Proposed

Context:

Checklists, cached saved details, and reminders are `Should` items. They are valuable, but Must flows must remain implementable and testable before optional scope expands the release.

Decision:

Use a first-release scope gate after Must flows are usable:

- Checklists include now only if simple local CRUD and quick access fit without delaying trip creation, places, maps, day planning, flights, housing, and notes. If deferred, quick access must hide or show a non-broken placeholder rather than a dead entry point.
- Cached saved details include now only as verification of local readability for already saved data. It must not add offline maps, offline search, offline routing, sync, backup, or background workers.
- Reminders include now only if local notification scheduling is technically simple, permission handling is clear, and no Must flow depends on it. Otherwise store no reminder UI in first release and defer the slice.

Consequences:

Must-have flows can be completed first. `Should` features require an explicit owner/lead decision before becoming release blockers.

Links:

- `requirements/07_requirements.md`
- `requirements/08_mvp.md`
- `architecture/13_implementation_slices.md`

## 2026-06-28 - Provider Boundaries For Map, Search, Navigation, Notifications

Status: Proposed

Context:

The MVP needs place search/geocoding, map display for saved pins, external navigation handoff, and possibly local notifications. Provider costs and Expo compatibility still need validation.

Decision:

Hide provider-specific calls behind `PlaceSearchProvider`, map view adapter components, `ExternalNavigationService`, and `NotificationScheduler`. Domain models must not store provider-specific objects beyond optional provider references.

Consequences:

The app can start with one provider while preserving an escape path if pricing, coverage, or SDK constraints are poor. This adds a small adapter layer but prevents provider lock-in from spreading through feature code.

Links:

- `architecture/11_architecture.md`

## 2026-06-28 - External Map Handoff Instead Of Own Routing

Status: Accepted

Context:

MVP requirements explicitly need external map handoff and exclude route optimization, own routing, and full offline maps.

Decision:

Implement "open in maps" using coordinates or address text. Do not calculate routes, optimize order, estimate travel time, or provide offline navigation in the MVP.

Consequences:

The app focuses on planning context and avoids a large routing domain. Users keep using their preferred navigation app for actual navigation.

Links:

- `requirements/07_requirements.md`
- `requirements/08_mvp.md`
- `architecture/11_architecture.md`

## 2026-06-28 - Cached Saved Details Boundary

Status: Proposed

Context:

Users need access to critical saved details during weak network conditions, but full offline maps and routing are explicitly outside MVP.

Decision:

Treat offline support as local readability of saved trip data: trip, days, places, flights, housing, notes, and checklists should remain readable after saving. Do not promise offline map tiles, offline search/geocoding, or offline route building.

First-release include criteria:

- Include only if it can be verified through local database reads, network-off app open, and UI unavailable states for online-only actions.
- Defer if it requires tile caching, background sync, export/backup, provider-specific offline SDKs, or new data ownership beyond the local repositories.

Consequences:

This covers the highest-value travel failure mode without tile caching, route engines, or sync conflict handling. UI copy must say saved details are available, not that the whole app works offline.

Links:

- `architecture/11_architecture.md`
- `requirements/08_mvp.md`

## 2026-06-28 - Today Is Derived Locally

Status: Proposed

Context:

The app needs quick access to the current or nearest relevant day. Trips can have unknown dates or incomplete plans.

Decision:

Do not store a separate `Today` object. Derive `Today` from trip dates, selected date, and local clock. Derive `nextItem` only when timed day items make it reliable.

Consequences:

The UI avoids stale state and handles unknown dates with manual day selection. Domain tests must cover date boundaries, missing dates, empty days, and untimed day items.

Links:

- `architecture/11_architecture.md`
- `requirements/06_use_cases.md`

## 2026-06-28 - Manual Entry Tolerates Incomplete Data

Status: Accepted

Context:

MVP value depends on fast manual aggregation from arbitrary sources. Requirements state that places, flights, and housing should not require full structured data.

Decision:

Allow useful drafts: trip requires title; place requires title; housing requires title or address; flight can be saved with any practical stable identifier such as flight number plus date or a user-entered title. Optional fields can be completed later.

Consequences:

Forms need clear empty states and validation that prevents useless records without blocking partial but useful records.

Links:

- `requirements/07_requirements.md`
- `architecture/11_architecture.md`

## 2026-06-28 - Reminder Implementation Boundary

Status: Proposed

Context:

Basic reminders are `Should`, while trip creation, places, maps, day planning, flights, housing, notes, and quick access are `Must`.

Decision:

Do not make reminders a first implementation blocker. Store reminder intent locally only if reminders enter the first release. Schedule local notifications through an Expo-compatible adapter after Must flows are stable.

First-release include criteria:

- Include only after Must flows pass smoke testing and the notification adapter spike confirms permission, scheduling, cancellation, and denied-permission behavior.
- Defer if notification permissions, background behavior, platform differences, or UX copy create risk for the core trip workflow.

Consequences:

The app avoids server push and live alert infrastructure. Reminder work can be deferred without changing the core data model.

Links:

- `requirements/10_backlog.md`
- `architecture/13_implementation_slices.md`

## 2026-06-28 - Future LLM Boundary

Status: Proposed

Context:

LLM recommendations, generated routes, and generated checklists are Later. The MVP must validate manual trip aggregation first.

Decision:

Keep LLM out of the MVP. A future assistant should be a separate module or server-side service that suggests drafts from explicit user-selected trip context and requires confirmation before saving.

Consequences:

Core trip data remains deterministic and usable without AI. Sensitive travel details do not need to leave the device in MVP.

Links:

- `architecture/11_architecture.md`
- `process/14_project_principles.md`
