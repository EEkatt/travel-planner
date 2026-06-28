# Architecture

## Status

Draft. Iteration 01 architecture proposal for the React Native/Expo + TypeScript MVP.

## Summary

The MVP should be a local-first mobile app where a `Trip` is the user's single workspace for days, places, offline map context, flights, housing, notes, and optional checklists/reminders. The first implementation should not depend on a backend, sync, LLM, booking, automatic import, live flight tracking, route optimization, own routing, or collaboration. Offline map download for the prepared trip area is now a mandatory MVP capability.

The current `app/mobile/App.tsx` is a static Expo screen. The implementation architecture below turns it into a small, testable Expo application with explicit module boundaries, typed domain models, local persistence, provider adapters for map/search/navigation, and feature slices that can be built independently.

## How It Works End To End

1. The user opens the app and sees either the last opened trip or an empty trip list.
2. The user creates a trip with a title and optional start/end dates.
3. The trip opens into the main mobile structure: `Today`, `Days`, and `Map`.
4. The app derives the trip mode locally:
   - `Planning` when dates are unknown or the current date is outside the trip range;
   - `InTrip` when today's date is inside the trip range;
   - manual day selection remains available when automatic `Today` cannot be resolved.
5. The user adds places through a search provider when online, or saves a manual place with title/address/note when search fails or is not useful.
6. Saved places are stored locally. Places with coordinates appear on trip/day maps; places without coordinates remain visible in lists and show a "needs location" state.
7. The user builds each day by adding ordered plan items. A plan item is either a manual event with its own saved display fields or an object-backed reference to a place, flight, housing object, note, or checklist item when checklists are included.
8. The `Today` view selects the current or nearest relevant day and highlights the next future item only when item times allow a defensible choice. Without times, it uses manual order and does not pretend to know the next step.
9. The user can open a place or housing address in external maps. The app passes coordinates or a textual address to the device map URL. Navigation remains outside the app.
10. Flights and housing are entered manually as stable text records. No live status, gate automation, booking import, or disruption support exists in MVP.
11. Notes can belong to a trip, day, or object. Checklists are simple local lists only if they pass the first-release scope gate.
12. Saved trip text/details remain readable without network because they are stored on device. The prepared trip map area must be downloadable before travel and readable without network. Place search, geocoding, fresh map areas outside the downloaded region, and external navigation may require network or another installed app and must show clear degraded states.

## Architecture Proposal

Use a layered client architecture inside `app/mobile/src`:

```text
src/
  app/
    AppRoot.tsx
    navigation/
    providers/
  features/
    trips/
    today/
    days/
    places/
    maps/
    flights/
    housing/
    notes/
    checklists/
    reminders/
  domain/
    models/
    rules/
  data/
    repositories/
    storage/
    migrations/
    seed/
  services/
    map/
    placeSearch/
    externalNavigation/
    notifications/
    network/
    clock/
  shared/
    ui/
    forms/
    errors/
    i18n/
    testing/
```

The important rule is dependency direction:

```text
features -> domain -> data interfaces
features -> service interfaces
data adapters -> storage implementation
service adapters -> provider SDKs / Expo APIs
```

Domain models must not import React Native, Expo, map SDKs, notification SDKs, or storage libraries. Provider-specific code stays behind adapters.

## Modules

### App Shell

Ownership: application boot, navigation, dependency injection, error boundaries, app-level loading states.

Responsibilities:

- initialize local database and migrations;
- create repository and service instances;
- restore last selected trip;
- define navigation between trip list, trip shell, modals, and detail screens;
- provide Russian UI strings through a simple i18n boundary.

### Trip Workspace

Ownership: `Trip` lifecycle and main `Today / Days / Map` shell.

Responsibilities:

- create, edit, archive/delete trips;
- select active trip;
- expose fast access to housing, flights, notes, and checklists;
- show save/offline-readable status based on local persistence, not network.

### Domain Models And Rules

Ownership: typed app data and deterministic rules.

Core entities:

- `Trip`: `id`, `title`, optional `startDate`, optional `endDate`, `createdAt`, `updatedAt`.
- `TripDay`: `id`, `tripId`, `date`, `title`, `sortOrder`.
- `Place`: `id`, `tripId`, `title`, optional `address`, optional `comment`, optional `coordinates`, optional `providerRef`, `createdAt`, `updatedAt`.
- `DayItem`: `id`, `tripId`, `dayId`, `kind`, optional `targetId`, `displayTitle`, optional `displaySubtitle`, optional `time`, optional `note`, `sortOrder`, optional `isTargetMissing`.
- `Flight`: `id`, `tripId`, optional `flightNumber`, optional `departureDateTime`, optional `arrivalDateTime`, optional `departureAirport`, optional `arrivalAirport`, optional `terminal`, optional `gate`, optional `bookingReference`, optional `notes`.
- `Housing`: `id`, `tripId`, optional `title`, optional `address`, optional `coordinates`, optional `checkIn`, optional `checkOut`, optional `bookingReference`, optional `contacts`, optional `notes`.
- `Note`: `id`, `tripId`, `scope`, optional `scopeId`, `title`, `body`, `createdAt`, `updatedAt`.
- `Checklist`: `id`, `tripId`, optional `scope`, optional `scopeId`, `title`.
- `ChecklistItem`: `id`, `checklistId`, `title`, `isDone`, `sortOrder`.
- `Reminder`: `id`, `tripId`, `targetKind`, `targetId`, `scheduledAt`, `status`.

Rules:

- only `Trip.title` is required for trip creation;
- manual places can be saved without coordinates;
- flight and housing forms tolerate incomplete data;
- `Today` is a derived view, not a stored entity;
- next item is derived only from dated/timed day items;
- local IDs must be stable and sync-ready, even though sync is outside MVP.

`DayItem.kind` values:

- `manual`: standalone user-entered event. `targetId` must be empty. `displayTitle` is required.
- `place`: references `Place.id`.
- `flight`: references `Flight.id`.
- `housing`: references `Housing.id`.
- `note`: references `Note.id`.
- `checklistItem`: references `ChecklistItem.id` only when checklists are included in the first release.

Target semantics:

- Object-backed items must store `targetId` and denormalized display fields copied from the target at link time.
- Denormalized fields are the day plan fallback, not the source of truth while the target exists.
- When the target exists, the UI may refresh display from the target and update the snapshot during normal edits.
- When the target is missing, the day plan keeps the readable snapshot, marks the item as unlinked/missing, and disables target-specific actions.
- Manual events are first-class day items and do not need a separate target table.

Deletion and unlink behavior:

- Deleting a `DayItem` never deletes its target object.
- Deleting or unlinking a target object does not silently delete a day item; the day item remains as a readable snapshot with `targetId` cleared or marked missing according to repository implementation.
- Re-linking a stale item to a new target refreshes `kind`, `targetId`, and denormalized display fields.
- Repository tests must cover create, link, unlink, reorder, target deletion, stale display fallback, and reload behavior for each object-backed kind.

### Local Data Layer

Ownership: persistence, migrations, repository contracts, local query performance.

Recommended approach: SQLite-backed local storage with explicit migrations. The concrete Expo-compatible package is a Proposed decision because the current scaffold has no storage dependency yet.

Repository contracts:

- `TripRepository`
- `PlaceRepository`
- `DayPlanRepository`
- `FlightRepository`
- `HousingRepository`
- `NoteRepository`
- `ChecklistRepository`
- `ReminderRepository`

Repositories return domain objects and accept typed command inputs. UI components should not issue raw SQL or know table names.

### Places And Maps

Ownership: adding places, displaying saved coordinates, and external map handoff.

Interfaces:

```ts
interface PlaceSearchProvider {
  search(query: string, options?: { near?: Coordinates }): Promise<PlaceSearchResult[]>;
  resolve(result: PlaceSearchResult): Promise<ResolvedPlace>;
}

interface MapViewProvider {
  // implemented as UI adapter props/components, not a domain dependency
}

interface ExternalNavigationService {
  canOpen(target: NavigationTarget): Promise<boolean>;
  open(target: NavigationTarget): Promise<OpenNavigationResult>;
}
```

MVP behavior:

- search/geocoding failures do not block manual place creation;
- map display shows pins for saved coordinates;
- offline map display shows saved points inside the downloaded trip area;
- missing coordinates are visible in lists;
- external navigation uses coordinates when present, otherwise address text;
- when network or provider calls are unavailable, search shows manual-entry fallback, the downloaded offline map remains usable for its prepared area, and navigation shows an unavailable/retry state if the device cannot open the target;
- no in-app route calculation or optimization.

### Today And Day Planning

Ownership: day list, selected day, ordered plan items, quick edits, next item logic.

Responsibilities:

- generate trip days when trip dates exist;
- allow manual day creation/selection when dates are unknown;
- add/remove/reorder `DayItem` records;
- support quick edits for time, note, title, and order;
- compute `Today` and `NextItem` through pure domain functions.

### Flights And Housing

Ownership: manual stable records.

Responsibilities:

- create/edit/delete records;
- expose quick-access cards;
- allow linking records into day plans;
- pass housing address/coordinates to external navigation;
- never call live flight or booking APIs in MVP.

### Notes And Checklists

Ownership: lightweight contextual text and checklist data.

Responsibilities:

- trip/day/object scoped notes;
- optional simple checklists;
- local CRUD and quick access;
- no templates, AI generation, or document attachments in MVP.

### Reminders

Ownership: optional local reminder intent and local notification scheduling.

MVP boundary:

- reminders are `Should`, not first-slice blockers;
- store reminder records locally first;
- schedule local notifications only through an Expo-compatible adapter after Must flows are stable;
- no server push, live flight alerts, or background sync.

## Data Flow

Write flow:

```text
Screen/Form
  -> feature action/hook
  -> validation and domain command
  -> repository interface
  -> SQLite transaction
  -> repository query refresh
  -> screen state update
```

Read flow:

```text
Screen
  -> feature query/hook
  -> repository
  -> local database
  -> domain selectors
  -> view model
```

Place search flow:

```text
Add place screen
  -> PlaceSearchProvider.search(query)
  -> user selects result
  -> provider result normalized to Place
  -> PlaceRepository.save()
  -> map/day list refresh
```

Manual place fallback:

```text
Add place screen
  -> user enters title/address/comment
  -> PlaceRepository.save({ coordinates: null })
  -> item appears in lists
  -> map shows only other coordinate-backed places
```

External navigation flow:

```text
Place/Housing detail
  -> build NavigationTarget from coordinates or address
  -> ExternalNavigationService.open(target)
  -> Linking opens installed/browser map
```

Offline travel flow:

```text
App open
  -> local database initializes
  -> active trip is loaded locally
  -> saved text details are readable
  -> downloaded trip map area opens and shows saved points
  -> online-only actions show unavailable/retry states if network is absent
```

Offline boundary:

- Included: previously saved trips, days, day items, places, flights, housing, notes, and included checklists are readable from local storage.
- Included: downloaded offline map region for the prepared trip area, with saved points displayed.
- Unavailable offline unless the chosen provider supports it in MVP: new place search, geocoding, external navigation that requires network or another app response, routing, route optimization, live data, and sync.
- UI copy must distinguish "offline map available for downloaded area" from "offline routing/navigation".

## Testing Strategy

Use a small test pyramid:

- domain unit tests for date mode, next item, ordering, validation, and manual fallback behavior;
- repository integration tests against a test SQLite database or storage adapter;
- component tests for critical screens and empty/error states;
- adapter contract tests with mocked map/search/navigation/notification providers;
- E2E smoke tests after navigation and persistence exist.

Every implementation slice in `architecture/13_implementation_slices.md` has its own acceptance tests.

## Decisions Needed

Owner decisions that remain `Proposed`:

- concrete SQLite package and migration strategy for Expo;
- concrete map display provider;
- concrete place search/geocoding provider;
- whether checklists are included in first release or implemented after Must flows;
- whether local notifications are included in first release or deferred;
- minimum offline copy wording in UI: "saved details and downloaded map available offline" without promising offline routing.

## Risks

- Map/search provider selection can create cost, API key, and Expo compatibility risk. Keep adapters thin and spike before broad map work.
- Manual entry loses value if forms require too many fields. Keep save actions tolerant of incomplete data.
- Offline language can overpromise. UI and docs must distinguish offline map viewing from offline routing/navigation.
- Local-only MVP can lose data if the device is lost. Backup/export is post-MVP unless owner changes scope.
- Optional reminders can distract from Must flows. Implement only after core trip workspace is usable.

## Critic Feedback Addressed

Iteration 01 critic feedback addressed in iteration 02:

- added first-release scope gates for checklists, cached saved details, and reminders;
- added bounded technical decision gates for storage, migrations, navigation, test stack, map provider, and search/geocoding provider;
- defined `DayItem.kind`, `targetId`, display fallback, deletion/unlink behavior, and repository test expectations;
- clarified offline support as saved-detail readability with degraded map/search/navigation behavior.
