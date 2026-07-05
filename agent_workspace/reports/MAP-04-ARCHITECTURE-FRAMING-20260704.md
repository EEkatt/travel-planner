# MAP-04 Architecture Framing

Task ID: TASK-20260704-028
Role: architecture_agent
Date: 2026-07-04
Status: Ready for architecture_critic and code_quality_reviewer review

## Scope And Recommendation

This report frames the Georgia MVP map architecture. It is not a production architecture sign-off and must not be used to start MAP-05 implementation until MAP-02A is complete and the relevant MAP-03/MAP-04 reviews are accepted.

Recommendation: proceed with reviewer critique of these module boundaries, domain contracts, adapter interfaces, test seams, and implementation slices. Keep implementation blocked behind MAP-02A fixture/geography clarification, MAP-03 provider discovery, MAP-06 native/offline proof acceptance, and MAP-09 security/provider data review.

## Sources Read

- `agent_workspace/tasks/open/TASK-20260704-028-map-04-architecture-framing.md`
- `agent_workspace/reports/MAP-02-REQUIREMENTS-20260704.md`
- `agent_workspace/reports/REVIEW-MAP-02-REQUIREMENTS-BY-QUALITY-20260704.md`
- `agent_workspace/reports/MAP-LEAD-DECISION-AFTER-MAP-02-QUALITY-20260704.md`
- `agent_workspace/reports/MAP-00-SCOPE-20260704.md`
- `agent_workspace/reports/MAP-01-UX-20260704.md`
- `architecture/11_architecture.md`
- `architecture/12_decisions.md`
- `architecture/13_implementation_slices.md`
- `app/mobile/App.tsx`
- `app/mobile/package.json`

## Hard Architecture Guardrails

- MVP geography is Georgia only. Architecture must expose one app-owned geography predicate and must not silently make global coordinate-backed saves.
- Provider-specific payloads stay behind adapters. Domain records may store only approved normalized fields and optional approved provider references.
- Card order is the selected-day route-order source of truth. Pins and route lines are derived from card order, never from map-rendered marker order.
- The selected-day line is planned order/context only. No offline routing, geocoding, navigation, optimization, traffic, travel time, ETA, or live rerouting is implied.
- Saved cards/lists/details remain authoritative when map rendering, search, offline tiles, or external handoff fail.
- Current `app/mobile/App.tsx` is prototype context only. Web Leaflet, public Nominatim, iframe map clicks, and simulated native map shapes are not proof of native SDK behavior, provider terms, offline packs, offline reopen, or persistence.

## Proposed Modules And Boundaries

Recommended map-specific shape inside the existing layered architecture:

```text
src/
  features/
    mapTrip/
      MapScreen.tsx
      MapStatusHeader.tsx
      MapModeSelector.tsx
      MapCanvasHost.tsx
      MapPointCards.tsx
      MapSearchPanel.tsx
      MapTapSaveSheet.tsx
      mapViewModel.ts
      mapFailureState.ts
  domain/
    map/
      mapPoint.ts
      mapMode.ts
      mapSelectors.ts
      routeOrder.ts
      geographyPolicy.ts
      offlineArea.ts
  data/
    repositories/
      MapPointRepository.ts
      OfflinePackRepository.ts
  services/
    mapDisplay/
      MapDisplayAdapter.tsx
      MapLibreMapDisplayAdapter.tsx
      MockMapDisplayAdapter.tsx
    offlineMap/
      OfflinePackService.ts
      OfflinePackProviderAdapter.ts
      MockOfflinePackProviderAdapter.ts
    placeSearch/
      PlaceSearchAdapter.ts
      MockPlaceSearchAdapter.ts
    externalNavigation/
      ExternalNavigationService.ts
```

Boundary rules:

- `domain/map` owns pure types and rules: filtering, card order, pin labels, route-line coordinate sequence, Georgia classification, downloaded-area classification inputs, and copy-safe capability flags.
- `features/mapTrip` owns UI state composition and failure-state presentation. It receives domain view models and typed adapter errors, but does not parse provider payloads.
- `services/mapDisplay` owns SDK-specific map components and event translation. It receives normalized pins/lines/areas and emits normalized map events such as `MapTap`.
- `services/offlineMap` owns provider pack lifecycle and translates provider pack inventory into app-owned status.
- `services/placeSearch` owns online search/geocoding calls and result normalization. It never saves records directly.
- `data/repositories` own app persistence. They persist canonical records and app-owned pack metadata, not raw provider responses.

## Canonical Map Point Domain Model

The canonical point model should align to MAP-02 and stay app-owned:

```ts
type Coordinates = {
  latitude: number;
  longitude: number;
};

type MapPointSource = 'search_result' | 'manual_map_tap' | 'manual_text';

type MapPoint = {
  id: string;
  tripId: string;
  title: string;
  address?: string;
  note?: string;
  coordinates: Coordinates | null;
  countryCode: 'GE' | null;
  dayId: string | null;
  routeOrder: number | null;
  source: MapPointSource;
  provider?: string;
  providerPlaceId?: string;
  providerAttribution?: string;
  createdAt: string;
  updatedAt: string;
};
```

Constraints:

- `title` is required.
- `coordinates = null` means the point never renders as a pin or route-line coordinate.
- `countryCode = 'GE'` is the only accepted coordinate-backed MVP country state.
- `dayId = null` requires `routeOrder = null`.
- `dayId != null` requires deterministic `routeOrder`, including no-coordinate cards.
- `provider`, `providerPlaceId`, and `providerAttribution` are optional normalized metadata only when provider terms/security allow storage.
- Raw provider responses, request logs, API keys, user location logs, tile pack internals, and SDK objects are not domain fields.

Derived render models should be separate from persisted records:

```ts
type MapPin = {
  pointId: string;
  coordinates: Coordinates;
  color: 'gray' | 'red';
  label: string | null;
  title: string;
  attribution?: string;
};

type RouteLine = {
  mode: 'planned_order';
  pointIds: string[];
  coordinates: Coordinates[];
};
```

## Provider Adapter Interfaces

Map display should be a UI adapter boundary because native map SDKs usually expose components:

```ts
type MapDisplayProps = {
  pins: MapPin[];
  routeLine: RouteLine | null;
  offlineArea: OfflineAreaView | null;
  interactionMode: 'view' | 'tap_to_add';
  onTap: (event: MapTap) => void;
  onProviderFailure: (failure: MapProviderFailure) => void;
};

type MapTap = {
  coordinates: Coordinates | null;
};

type MapProviderFailure =
  | { kind: 'init_failed' }
  | { kind: 'style_failed' }
  | { kind: 'tile_failed' }
  | { kind: 'attribution_blocked' }
  | { kind: 'sdk_unavailable' };
```

Offline pack lifecycle should be a service over a provider adapter:

```ts
type OfflinePackStatus =
  | 'not_downloaded'
  | 'downloading'
  | 'downloaded'
  | 'failed'
  | 'outside_downloaded_area';

type OfflineAreaDescriptor = {
  id: string;
  tripId: string;
  countryCode: 'GE';
  bounds: GeoBounds;
  label: string;
  scope: 'whole_georgia' | 'owner_approved_georgia_area';
};

interface OfflinePackService {
  getStatus(tripId: string): Promise<OfflinePackStatus>;
  getInventory(tripId: string): Promise<OfflinePackInventory>;
  startDownload(area: OfflineAreaDescriptor): Promise<void>;
  observeProgress(tripId: string, listener: (progress: OfflinePackProgress) => void): () => void;
  cancelDownload(tripId: string): Promise<void>;
  deletePack(tripId: string): Promise<void>;
  classifyCoordinates(tripId: string, coordinates: Coordinates): Promise<'inside_downloaded_area' | 'outside_downloaded_area' | 'unknown'>;
}
```

Provider adapter notes:

- `OfflinePackService` does not own saved points, day order, search, geocoding, routing, or navigation.
- `downloaded` is valid only after accepted MAP-03/MAP-06 provider/device proof.
- Whole-country Georgia is the first target; region/city or one chosen area is allowed only as `owner_approved_georgia_area`.
- Pack inventory should be represented by app-owned metadata plus provider inventory IDs. Do not persist raw provider pack internals unless MAP-09 approves.

External navigation remains point-level fallback:

```ts
type ExternalNavigationTarget =
  | { kind: 'coordinates'; coordinates: Coordinates; title?: string }
  | { kind: 'address'; address: string; title?: string };

interface ExternalNavigationService {
  canOpen(target: ExternalNavigationTarget): Promise<boolean>;
  open(target: ExternalNavigationTarget): Promise<'opened' | 'failed' | 'unsupported'>;
}
```

## Search And Geocoding Adapter Boundary

Search is online-only and explicitly user-triggered for MVP:

```ts
type PlaceSearchRequest = {
  query: string;
  countryCode: 'GE';
  near?: Coordinates;
  limit: number;
};

type NormalizedPlaceSearchResult = {
  resultId: string;
  title: string;
  address?: string;
  coordinates: Coordinates | null;
  countryCode: string | null;
  provider: string;
  providerPlaceId?: string;
  providerAttribution?: string;
};

type PlaceSearchFailure =
  | { kind: 'offline' }
  | { kind: 'no_results'; query: string }
  | { kind: 'timeout'; retryable: true }
  | { kind: 'quota' }
  | { kind: 'api_error'; retryable: boolean }
  | { kind: 'malformed_response'; retryable: false };

interface PlaceSearchAdapter {
  search(request: PlaceSearchRequest): Promise<
    | { kind: 'success'; results: NormalizedPlaceSearchResult[] }
    | { kind: 'failure'; failure: PlaceSearchFailure }
  >;
}
```

Boundary rules:

- The adapter normalizes provider output and hides raw payloads.
- The feature saves a result only after user selection, day/no-day choice, and Georgia validation.
- Outside-Georgia results are not silently saved as coordinate-backed points. The default is block coordinate-backed save and offer search again or manual note-only save if MAP-02A/product policy allows it.
- Autocomplete/suggestions are not required and must remain absent unless MAP-03 approves provider terms, pricing, limits, attribution, and key model.
- Public Nominatim must not be used for production autocomplete.
- Reverse geocoding for map taps is not required for MVP. If added later, it must use this same adapter boundary and remain online-only unless separately approved.

## Route-Order And Route-Line Data Flow

Route order is a domain rule, not a map SDK rule:

```text
MapPointRepository
  -> load points for trip/day
  -> domain mapSelectors derive cards, pins, and routeLine
  -> MapScreen renders cards and passes pins/routeLine to MapDisplayAdapter
```

Selected-day derivation:

1. Load every point where `dayId = selectedDayId`.
2. Sort all cards by `routeOrder`, including no-coordinate points.
3. Build red pins only for cards with coordinates.
4. Pin label is the card `routeOrder`. Missing-coordinate cards create visible numbering gaps.
5. Build `RouteLine` from coordinate-backed cards in ascending `routeOrder`.
6. If fewer than two coordinate-backed cards exist, `routeLine = null`.

All-points derivation:

1. Load all trip points.
2. Render only coordinate-backed points.
3. Use gray for no-day and red for day-assigned.
4. Do not render route line.
5. Do not render route-order labels unless unavoidable by the provider; if unavoidable, labels must not be treated as route order.

No-day derivation:

1. Load points where `dayId = null`.
2. Render coordinate-backed points as gray pins.
3. Do not render route line or route-order labels.
4. Keep no-coordinate points visible in cards/lists.

Reorder write flow:

```text
Day card reorder control
  -> reorderDayPoints(dayId, orderedPointIds)
  -> repository transaction compacts routeOrder deterministically
  -> refreshed points
  -> same selector recalculates cards, pin labels, and routeLine
```

The map adapter never receives authority to change route order. Dragging pins is out of MVP.

## Failure-State Ownership

| Failure/state | Primary owner | Adapter responsibility | Data ownership rule |
| --- | --- | --- | --- |
| Map SDK/tile/style/attribution failure | `features/mapTrip` map canvas host | Return typed `MapProviderFailure` | Saved points/cards remain from repositories and stay visible |
| Offline pack not downloaded | `OfflinePackService` + map status header | Report inventory/status | Saved lists/details remain readable; no offline download promise while offline |
| Offline downloaded | `OfflinePackService` + map display adapter | Reopen accepted downloaded area and render normalized overlays | Valid only after MAP-03/MAP-06 proof; no offline search/routing claims |
| Outside downloaded area | `OfflinePackService` + geography policy | Classify against downloaded bounds if known | Do not confuse with outside Georgia; keep cards/details usable |
| Outside Georgia | `domain/map/geographyPolicy` + save flow | Provider only supplies normalized coordinates/country hints | No silent coordinate-backed save outside Georgia |
| Search offline/no results/provider failure | `MapSearchPanel` + `PlaceSearchAdapter` | Return typed `PlaceSearchFailure` | Query preserved; no partial point saved unless user manually saves |
| No-coordinate point | Domain selectors + cards | None | Never render pin; keep card/list route order |
| Yandex target missing/handoff failure | Point card/detail + `ExternalNavigationService` | Return `unsupported` or `failed` | Saved address/coordinates remain visible |
| Provider attribution missing/blocking | Map/search adapters + security review | Surface required attribution or blocking failure | Do not hide attribution requirements in domain records |

UI copy should be owned by the feature/i18n layer, not by providers. Typed failures should map to reviewed Russian copy after MAP-02A defines positive/negative wording.

## Test Seams

Required seams before implementation:

- Pure domain tests for `mapSelectors`: all/no-day/day modes, no-coordinate gaps, fewer-than-two route line, reorder compaction, outside-Georgia classification using MAP-02A fixtures.
- Repository tests for route-order transactions: assign day appends, clear day nulls order and compacts remaining day, reorder persists and reloads, no-coordinate cards keep order.
- Adapter contract tests with mocks: map display receives normalized pins/lines only; search returns normalized results/failures; offline pack service returns statuses/progress/inventory without SDK payload leakage.
- Component tests for failure ownership: provider failure leaves cards visible; search failures preserve query and manual add; offline-not-downloaded leaves saved details visible; outside-area states do not save coordinate-backed points.
- Copy assertion tests for banned claims once MAP-02A supplies Russian wording.
- Native/offline proof tests remain MAP-06 work: iOS/Android development build, provider pack download, pack inventory after restart, network-disabled reopen, overlay pins, planned line, attribution, cleanup, measured pack size/duration.

The current web prototype can support behavioral discussion only. It should not be counted as passing any native/offline/provider contract test.

## Proposed Implementation Slices For Map Work

These are refinements to guide future tasks, not edits to `architecture/13_implementation_slices.md`:

1. Map domain contract slice: add `MapPoint`, `MapMode`, geography policy, route-order selectors, route-line view model, and fixture-backed pure tests.
2. Map repository route-order slice: persist point/day assignment/order, implement assign/clear/reorder transactions, and test reload behavior.
3. Mocked map UI slice: render `All`, `No day`, and selected-day modes with a mock adapter, no provider SDK, and component tests for cards/pins/line state.
4. Search adapter slice: implement online explicit search through a mocked/provider adapter, normalize selected results, block outside-Georgia coordinate saves, and preserve manual fallback.
5. Offline pack boundary slice: implement app-owned status/inventory/progress contracts with a mock provider; no `downloaded` acceptance until native proof.
6. Native provider proof slice: MapLibre or selected provider in Expo development builds, measured on device/emulator per MAP-03/MAP-06 proof requirements.
7. Failure and copy hardening slice: map provider failure, search failures, outside Georgia, outside downloaded area, Yandex handoff failure, attribution, and copy-negative assertions.

## Open Architecture Decisions And Blockers

Blocking before production architecture sign-off:

- MAP-02A must define deterministic fixture records, empty trip/day acceptance, successful Georgia map-tap fixtures, Georgia/downloaded-area classification examples or shared predicate, proof artifact expectations, and approved Russian copy terms.
- MAP-03 must identify acceptable map tile/style/offline provider terms, pricing, attribution, API key model, cache/offline limits, search/geocoding terms, and normalized storage rights.
- MAP-06 must prove native/offline behavior in Expo development builds; Expo Go/web prototype is not enough.
- MAP-09/security review must approve API key handling, provider data retention, logging, attribution, and any provider IDs stored locally.
- Owner must decide acceptable offline pack size/download duration/storage footprint, representative Georgia proof area, fallback area model if whole-country Georgia fails, and whether one downloaded area per trip is acceptable.
- Owner/product must decide whether outside-Georgia results may be saved as manual note-only items with `coordinates = null`.
- Owner/product must decide Yandex fallback behavior beyond app handoff: web fallback, copy address/coordinates, or display saved target only.
- Architecture review must decide whether selected-day line remains straight app-owned planned geometry by default or whether provider-rendered geometry can be added later as a separate non-navigation scope.

Non-blocking but important before automation:

- Define exact test IDs and route-line observability so MAP-07 does not rely only on visual map assertions.
- Decide accessible reorder control pattern. Explicit move up/down buttons are the simplest deterministic test seam; drag can be added only if accessible and testable.
- Decide whether coordinate editing for existing points is MVP or deferred.

## Review Handoff

This framing is ready for `architecture_critic` and `code_quality_reviewer` to review for boundary correctness, provider leakage risk, route-order consistency, failure-state ownership, testability, and implementation-slice readiness. It intentionally does not sign off implementation or provider choice.
