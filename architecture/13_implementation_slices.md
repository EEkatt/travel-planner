# Implementation Slices

## Status

Accepted by Architecture Critic in iteration 02. Ready for implementation planning.

## Goal

Split the React Native/Expo + TypeScript MVP into small slices that can be implemented and tested independently while preserving MVP scope.

## Slice Principles

- Each slice must leave the app runnable.
- Each slice must include tests or a concrete testable acceptance path.
- Must-have flows come before Should-have flows.
- Provider-dependent work starts behind interfaces.
- No backend, sync, collaboration, LLM, booking, automatic import, live flight tracking, route optimization, or own routing. Offline map download for the prepared trip area is in MVP scope.

## Gate 00 - Technical Decisions And Test Harness

Scope:

- choose the Expo-compatible SQLite package and migration approach;
- choose navigation library/structure for trip list, workspace tabs, modals, and detail screens;
- choose the unit/component/repository/E2E or smoke test stack;
- choose the MVP map display provider with offline map download support;
- choose or shortlist the MVP search/geocoding provider;
- update `architecture/12_decisions.md` with accepted choices or bounded fallback notes.

Gate 00 should be executed as separate bounded decision tasks, not as one large implementation task:

- `G00-01` - storage package, migration approach, and restart-read proof;
- `G00-02` - navigation structure proof for trip list, workspace tabs, modal/detail screens;
- `G00-03` - test stack and first runnable `typecheck`/unit/component/repository commands;
- `G00-04` - map provider implementation spike with offline prepared-area download proof;
- `G00-05` - place search/geocoding provider shortlist and manual fallback proof.

Each Gate 00 task must end with either an accepted decision, a rejected option with reason, or a bounded fallback note.

Out of scope:

- production feature UI;
- provider runtime switching;
- backend, sync, routing, booking, automatic import, or LLM.

Tests/checks:

- clean install migration proof and restart-read proof for local storage;
- navigation proof for `Today / Days / Map` plus one modal/detail route;
- pure domain test, React Native component test, and repository integration test can run locally;
- map adapter can render or be mocked with normalized pins;
- offline map provider can download and reopen a bounded region, or the provider is rejected for MVP;
- search provider can return normalized result fixtures and expose offline/error fallback.

Acceptance criteria:

- implementation dependencies are recorded as decisions before broad feature work;
- unresolved provider risk blocks broad map implementation because offline map is now a Must requirement;
- no user-facing feature is added by the gate.

## First-Release Scope Gate For Should Features

Apply this gate after Must flows are usable through trip creation, places/manual fallback, day planning, maps/navigation handoff, flights, housing, notes, and quick access.

Checklists:

- Include in first release only if simple local CRUD and quick access do not delay Must flow completion.
- If deferred, remove checklist entry points or show a non-broken deferred state; do not leave dead navigation.

Offline map and saved details:

- Include local readability of saved records and offline map download for the prepared trip area in first release.
- Defer offline search/geocoding, routing, sync, backup/export, or background workers unless the chosen provider supports them with minimal MVP complexity.

Reminders:

- Include in first release only after Must flow smoke testing and a notification adapter proof for permission, schedule, cancel, and denied state.
- Reminders must never block trip creation, day planning, places, flights, housing, notes, maps, or quick access.

## Slice 00 - App Foundation

Scope:

- create `src` structure;
- move static `App.tsx` screen into an app shell;
- add TypeScript path conventions if needed;
- add base navigation structure for trip list, trip workspace, modal/detail screens;
- add shared UI primitives for buttons, cards, empty states, form rows, and screen layout.

Out of scope:

- persistence;
- real map SDK;
- feature CRUD beyond mocked screens.

Tests:

- app renders without crashing;
- navigation shell can open trip workspace placeholder;
- shared UI snapshot/component tests for empty and error states if the chosen test stack is available.
- Russian UI string path exists for user-facing shell copy.

Acceptance criteria:

- Expo app starts;
- `Today / Days / Map` shell is reachable;
- no production feature depends on static hardcoded trip data except seed/dev fixtures.
- Gate 00 decisions are complete or explicitly accepted as deferred risks before this slice expands.

## Slice 01 - Domain Model And Pure Rules

Scope:

- define TypeScript domain types for `Trip`, `TripDay`, `Place`, `DayItem`, `Flight`, `Housing`, `Note`, `Checklist`, `ChecklistItem`, and `Reminder`;
- add domain command input types;
- implement pure rules for trip mode, generated days, selected today, next item, ordering, and minimal validation.

Out of scope:

- database;
- UI forms;
- provider calls.

Tests:

- trip mode for unknown dates, before trip, during trip, after trip;
- generated day list from date range;
- manual day behavior when dates are missing;
- next item selected only from future timed items;
- untimed items preserve manual order without false "next" claims;
- validation allows incomplete but useful records.
- `DayItem.kind` validation rejects invalid `targetId` combinations, especially `manual` with a target and object-backed items without a target.

Acceptance criteria:

- domain tests pass without React Native or Expo runtime;
- domain models do not import provider, storage, or UI code.

## Slice 02 - Local Persistence And Repositories

Scope:

- choose Expo-compatible SQLite package after a short spike;
- add schema and migrations;
- implement repositories for trips, places, days/day items, flights, housing, notes, and checklists;
- add local ID generation and timestamps;
- add seed/dev reset only for development.

Out of scope:

- sync;
- backup/export;
- encryption beyond platform defaults;
- attachments.

Tests:

- migration initializes empty database;
- create/read/update/delete trip;
- create related child records by `tripId`;
- preserve day item order;
- day item create/link/unlink/relink/delete behavior is explicit and tested;
- object target deletion keeps a readable day item snapshot and disables target actions;
- stale/fallback display survives app restart;
- app can restart and read saved data.
- sensitive booking references, contacts, notes, and full flight details are not emitted in repository logs/errors.

Acceptance criteria:

- user-created trip persists after app reload;
- repository tests cover each MVP entity;
- no feature code issues raw SQL directly.

## Slice 03 - Trip Creation And Trip Workspace

Scope:

- trip list or last-trip landing;
- create/edit trip title and optional dates;
- open trip workspace;
- wire `Today / Days / Map` tabs to local trip data;
- show planning/in-trip mode and empty states.

Out of scope:

- place search;
- real map display;
- flights/housing/notes CRUD.

Tests:

- create trip with title only;
- create trip with dates;
- opening trip shows generated days when dates exist;
- unknown dates show manual day selection empty state;
- UI copy does not promise outside-MVP features.

Acceptance criteria:

- user can create a trip and reopen it;
- empty trip shows clear next actions;
- trip shell contains quick access placeholders without broken navigation.

## Slice 04 - Day Planning And Quick Manual Edits

Scope:

- create/select trip days;
- add manual day item;
- link/unlink day items to place, flight, housing, note, and checklist item targets when those features exist;
- show denormalized fallback display for missing targets;
- edit title, time, note;
- reorder and remove day items;
- show current/selected day list;
- derive and highlight next item when reliable.

Out of scope:

- route optimization;
- travel time estimation;
- collaborative editing/history.

Tests:

- add item to day;
- edit time/note/title;
- reorder items and persist order;
- remove item;
- link object-backed item and reload;
- unlink target while preserving readable display;
- deleted target shows stale/unlinked state without losing day order;
- next item logic matches domain tests in UI;
- quick edit returns to day plan after save.

Acceptance criteria:

- day plan survives app reload;
- manual order remains the source of truth;
- manual events work without any target object;
- no UI labels imply optimized routes.

## Slice 05 - Places Manual Entry And Lists

Scope:

- add place manually with title and optional address/comment;
- list trip places;
- attach place to a day item;
- show missing-coordinate state;
- place detail screen.

Out of scope:

- search/geocoding provider;
- map pins;
- external navigation.

Tests:

- save place with title only;
- save place with address/comment;
- place without coordinates appears in lists and day plan;
- attach existing place to day item;
- deleting a place leaves linked day items readable as unlinked snapshots;
- validation blocks empty title.

Acceptance criteria:

- manual place creation works without network;
- lack of coordinates does not break day plan or place list.

## Slice 06 - External Navigation Handoff

Scope:

- implement `ExternalNavigationService` using React Native/Expo linking APIs;
- build navigation targets from place or housing coordinates/address;
- add "open in maps" action with unavailable state when target lacks coordinates and address.

Out of scope:

- in-app routing;
- route optimization;
- offline navigation.

Tests:

- URL builder for coordinates;
- URL builder for address-only target;
- unavailable state when target has neither address nor coordinates;
- unavailable/retry state when device/provider cannot open the target;
- mocked Linking call on open.

Acceptance criteria:

- user can hand off a saved address/coordinate to external maps;
- app explains when navigation is unavailable.

## Slice 07 - Map Display Adapter

Scope:

- choose MVP map display provider with offline map download support after Gate 00 spike;
- implement trip map with all coordinate-backed places;
- implement day map/context with selected day's coordinate-backed items;
- implement downloaded area status for the prepared trip map;
- show list fallback for places without coordinates.

Out of scope:

- own route lines unless drawn only as simple visual order with no routing claim;
- offline routing unless provider support is explicitly accepted;
- traffic, travel times, optimization.

Tests:

- adapter receives only normalized coordinates and labels;
- downloaded map area can be represented in adapter state and tested with a mock provider;
- map screen handles zero pins;
- map screen handles mixed coordinate and non-coordinate places;
- map unavailable/provider failure falls back to saved list/detail access;
- provider adapter can be mocked in component tests.

Acceptance criteria:

- trip map shows saved coordinate-backed places;
- missing-coordinate places remain accessible outside the map;
- no domain code imports map SDK types.

## Slice 08 - Place Search And Geocoding

Scope:

- choose MVP search/geocoding provider after spike;
- implement `PlaceSearchProvider`;
- add search UI with loading, no results, error, and offline states;
- normalize selected search result into `Place`.

Out of scope:

- automatic recommendations;
- route generation;
- bulk imports.

Tests:

- search success saves normalized place;
- no-results state allows manual entry;
- provider error allows manual entry;
- offline state allows manual entry;
- provider failure does not remove already saved places or day items;
- provider metadata remains optional and isolated.

Acceptance criteria:

- user can add a place through search when provider works;
- user can always fall back to manual entry.

## Slice 09 - Flights

Scope:

- manual flight CRUD;
- stable text fields: flight number, departure/arrival date-time, airports, terminal/gate text, booking reference, notes;
- quick access from trip workspace;
- optional link to day item.

Out of scope:

- live status;
- delay/gate alerts;
- email/calendar/PDF import;
- airline APIs.

Tests:

- save incomplete but useful flight;
- edit optional fields;
- quick access opens flight list/detail;
- linked flight appears in day plan;
- deleting a flight leaves linked day items readable as unlinked snapshots;
- UI copy uses "entered details" rather than live status.

Acceptance criteria:

- user can manually store and reopen flight details;
- no code path calls live flight data providers.

## Slice 10 - Housing

Scope:

- manual housing CRUD;
- multiple housing records per trip;
- fields: title, address, coordinates if known, dates, booking reference, contacts, notes;
- quick access from trip workspace;
- external navigation handoff for address/coordinates;
- optional link to day item.

Out of scope:

- booking;
- price comparison;
- automatic import;
- availability checks.

Tests:

- save housing with title only or address only according to validation rule;
- save multiple housing records;
- quick access opens housing list/detail;
- external navigation uses address/coordinates;
- linked housing appears in day plan;
- deleting housing leaves linked day items readable as unlinked snapshots.

Acceptance criteria:

- multiple stays do not merge data;
- user can quickly find housing details from trip workspace.

## Slice 11 - Notes

Scope:

- create/edit/delete notes;
- support trip, day, place, flight, and housing scopes;
- quick access to trip notes;
- show contextual notes near target object.

Out of scope:

- rich text;
- attachments;
- AI note generation.

Tests:

- trip-level note CRUD;
- day-level note CRUD;
- object-level note CRUD;
- deleted target handling is explicit for scoped notes and linked day items;
- quick access opens notes.

Acceptance criteria:

- user can store travel details near the relevant context;
- notes persist and remain readable offline.

## Slice 12 - Checklists

Scope:

- conditional: simple checklist CRUD only if the first-release scope gate includes it;
- add/check/uncheck/delete checklist items;
- optional trip/day scope;
- quick access from trip workspace.

Out of scope:

- templates;
- shared checklists;
- AI-generated packing lists.

Tests:

- create checklist;
- add item;
- toggle item;
- delete item;
- linked checklist item appears in day plan only when checklist feature is included;
- deleting a checklist item leaves linked day items readable as unlinked snapshots;
- state persists after reload.

Acceptance criteria:

- checklist behavior is useful without adding planning complexity;
- if deferred, quick access should not show a broken entry point.
- if included, checklist scope remains simple local CRUD only.

## Slice 13 - Offline Travel Behavior

Scope:

- ensure local reads work without network;
- ensure downloaded map region opens without network and shows saved points;
- add network status service for online-only actions;
- show clear copy for unavailable search/geocoding/external navigation conditions;
- verify app opens saved trip details after restart with network disabled.

Out of scope:

- offline geocoding;
- offline routing unless separately accepted after provider validation;
- sync conflict handling.

Tests:

- saved trip opens with mocked offline status;
- saved day, day items with stale display snapshots, places, flights, housing, notes, and included checklists render offline;
- downloaded map region opens with saved points using a mocked offline map provider;
- search action shows unavailable/manual fallback state;
- missing downloaded map region shows a preparation warning and keeps list/detail view available;
- external navigation unavailable state is shown without losing the saved address/coordinates;
- UI strings distinguish offline map viewing from offline routing/navigation.

Acceptance criteria:

- saved text details are readable without network;
- downloaded map area is readable without network;
- online-only capabilities are clearly separated.
- implementation does not claim offline search, offline routing, or provider-independent navigation unless separately accepted.

## Slice 14 - Basic Reminders

Scope:

- only if owner keeps reminders in first release;
- store reminder intent locally;
- request notification permission;
- schedule/cancel local notification through adapter;
- show permission denied state without deleting reminder data.

Out of scope:

- server push;
- live flight alerts;
- background sync;
- calendar integration.

Tests:

- create/edit/delete reminder record;
- mocked scheduler called when permission granted;
- permission denied state keeps reminder visible in app;
- cancellation removes scheduled notification through adapter.

Acceptance criteria:

- reminders do not block core trip workflows;
- unsupported notification state is understandable.

## Slice 15 - MVP Hardening

Scope:

- Russian UI pass for MVP screens;
- accessibility labels for critical actions;
- privacy-safe logging review;
- error and empty state review;
- smoke E2E path: create trip -> add place -> plan day -> add flight/housing/note/checklist -> reopen app -> open external maps mock.

Out of scope:

- new product features;
- visual redesign beyond usability fixes.

Tests:

- smoke E2E or scripted manual QA checklist;
- no sensitive booking/contact/note values in logs;
- core screens fit common mobile sizes;
- outside-MVP wording scan.

Acceptance criteria:

- MVP can be tested as one real trip workflow;
- Definition of Done is satisfied for implemented backlog items.

## Proposed Build Order

1. Gate 00 - Technical Decisions And Test Harness
2. Slice 00 - App Foundation
3. Slice 01 - Domain Model And Pure Rules
4. Slice 02 - Local Persistence And Repositories
5. Slice 03 - Trip Creation And Trip Workspace
6. Slice 04 - Day Planning And Quick Manual Edits
7. Slice 05 - Places Manual Entry And Lists
8. Slice 06 - External Navigation Handoff
9. Slice 07 - Map Display Adapter
10. Slice 08 - Place Search And Geocoding
11. Slice 09 - Flights
12. Slice 10 - Housing
13. Slice 11 - Notes
14. First-release scope gate for Should features
15. Slice 12 - Checklists, only if included by scope gate
16. Slice 13 - Offline Travel Behavior, including saved-detail readability and downloaded map area
17. Slice 14 - Basic Reminders, only if included by scope gate
18. Slice 15 - MVP Hardening

## Decisions Blocking Implementation

- SQLite package and migration helper.
- Test stack for unit/component/E2E tests.
- Navigation library.
- Map display provider.
- Place search/geocoding provider.
- Whether checklists are first release or immediately after Must flows.
- Offline map provider implementation proof and provider terms for prepared-area downloads.
- Whether reminders are first release or deferred.
