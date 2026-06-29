# Decisions

## Status

Living decision log. Accepted decisions are binding until superseded. Proposed decisions require Gate 00 proof, owner approval, or implementation validation before broad dependent work starts.

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

Status: Accepted

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

Status: Accepted

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

Status: Accepted

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

Status: Accepted

Context:

Checklists and reminders are `Should` items. Cached saved details and offline map download are now `Must` items after owner clarification. Must flows must remain implementable and testable before optional scope expands the release.

Decision:

Use a first-release scope gate after Must flows are usable:

- Checklists include now only if simple local CRUD and quick access fit without delaying trip creation, places, maps, day planning, flights, housing, and notes. If deferred, quick access must hide or show a non-broken placeholder rather than a dead entry point.
- Saved details are in MVP as local readability for already saved data.
- Offline map download for the prepared trip area is in MVP and must be decided during Gate 00.
- Reminders include now only if local notification scheduling is technically simple, permission handling is clear, and no Must flow depends on it. Otherwise store no reminder UI in first release and defer the slice.

Consequences:

Must-have flows can be completed first. `Should` features require an explicit owner/lead decision before becoming release blockers.

Links:

- `requirements/07_requirements.md`
- `requirements/08_mvp.md`
- `architecture/13_implementation_slices.md`

## 2026-06-28 - Provider Boundaries For Map, Search, Navigation, Notifications

Status: Accepted

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

MVP requirements need external map handoff and offline map download for the prepared trip area. They still exclude route optimization and own routing unless the chosen provider supports offline routing with minimal MVP complexity and explicit approval.

Decision:

Implement "open in maps" using coordinates or address text. Do not calculate routes, optimize order, estimate travel time, or provide offline navigation in the MVP unless separately approved after provider validation.

Consequences:

The app focuses on planning context and avoids a large routing domain. Users keep using their preferred navigation app for actual navigation.

Links:

- `requirements/07_requirements.md`
- `requirements/08_mvp.md`
- `architecture/11_architecture.md`

## 2026-06-28 - Cached Saved Details Boundary

Status: Superseded

Context:

Users need access to critical saved details during weak network conditions. This decision originally kept offline maps outside MVP.

Decision:

Superseded by the owner decision that offline map download for the prepared trip area is mandatory in MVP.

First-release include criteria:

- Include only if it can be verified through local database reads, network-off app open, and UI unavailable states for online-only actions.
- Defer if it requires tile caching, background sync, export/backup, provider-specific offline SDKs, or new data ownership beyond the local repositories.

Consequences:

This decision is retained for history only. Current direction is captured in `2026-06-28 - Offline Map Download Is MVP Scope`.

Links:

- `architecture/11_architecture.md`
- `requirements/08_mvp.md`

## 2026-06-28 - Offline Map Download Is MVP Scope

Status: Accepted

Context:

The project owner clarified that the map must work during travel without internet. During trip preparation, the user should be able to download the required map area. Saved trip details, bookings, flights, notes, contacts, and map context must remain usable offline.

Decision:

Offline map download for the prepared trip area is a Must MVP capability. Gate 00 must choose a map provider and implementation path that supports offline map download on iOS and Android within the React Native/Expo architecture, or explicitly document why the chosen stack must change.

Offline routing is not automatically included. If the chosen provider supports offline routing with reasonable MVP complexity, it can be proposed separately. Otherwise the MVP must clearly distinguish offline map viewing from offline navigation/routing.

Consequences:

Map provider selection is now a blocking foundation decision. The app can no longer rely on best-effort cached provider tiles or list-only fallback as the primary offline map story. Offline map storage size, licensing, API keys, provider terms, and Expo compatibility must be checked before broad map implementation.

Links:

- `requirements/07_requirements.md`
- `requirements/08_mvp.md`
- `architecture/11_architecture.md`
- `architecture/13_implementation_slices.md`
- `architecture/16_offline_map_provider_research.md`

## 2026-06-29 - MapLibre Offline Map Spike Path

Status: Accepted

Context:

Offline map download for the prepared trip area is a Must MVP capability. Current research found that MapLibre React Native supports Expo setup but not Expo Go, has an `OfflineManager.createPack` API for bounded offline regions, and appears compatible with the current Expo 56 / React Native 0.85 baseline at the peer-dependency level.

Decision:

Use MapLibre React Native as the first implementation spike path for offline map display and saved trip points. The spike must use Expo development builds, not Expo Go. Do not start broad map implementation until provider licensing/offline limits, pack size, iOS build, Android build, network-off rendering, and saved point rendering are proven.

This accepts the spike path, not the final production provider.

Consequences:

The app likely needs `@maplibre/maplibre-react-native`, the MapLibre Expo config plugin, and `expo-dev-client`. Tile/style provider selection becomes a release-blocking decision. Offline routing remains out of MVP unless separately proven and approved.

Links:

- `architecture/16_offline_map_provider_research.md`
- `agent_workspace/reports/TASK-20260629-008-maplibre-offline-map-spike-report.md`

## 2026-06-28 - Today Is Derived Locally

Status: Accepted

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
