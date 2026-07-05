# MAP-04R Architecture Rework

Task ID: TASK-20260704-034
Role: architecture_agent
Date: 2026-07-04
Status: Ready for architecture_critic, code_quality_reviewer, and lead review

## Purpose

This rework replaces the blocked parts of `MAP-04-ARCHITECTURE-FRAMING-20260704.md` with implementation-planning contracts. It does not expand MVP scope and does not start implementation.

Binding guardrails:

- MVP geography remains Georgia only.
- MAP-02A is accepted input, not a blocker.
- Card order remains the source of truth for selected-day route order, pin labels, and planned-line sequence.
- Offline map means downloaded map viewing plus saved points/details in the downloaded area. It does not include offline search, offline geocoding, routing, navigation, optimization, traffic, ETA, or live rerouting.
- Whole-country Georgia offline viewing remains a target only until provider/device proof and owner thresholds are accepted.
- Provider-specific payloads, SDK objects, URLs, and raw responses stay behind adapters.
- Current `app/mobile/App.tsx` remains prototype context only. Its Leaflet iframe, public Nominatim call, web tile use, and simulated native map shapes are not proof of native/provider/offline behavior.

## Sources Read

- `agent_workspace/tasks/open/TASK-20260704-034-map-04r-architecture-rework.md`
- `agent_workspace/reports/MAP-04-ARCHITECTURE-FRAMING-20260704.md`
- `agent_workspace/reports/REVIEW-MAP-04-ARCHITECTURE-BY-CRITIC-20260704.md`
- `agent_workspace/reports/REVIEW-MAP-04-ARCHITECTURE-BY-CODE-QUALITY-20260704.md`
- `agent_workspace/reports/MAP-LEAD-DECISION-AFTER-REVIEWS-20260704.md`
- `agent_workspace/reports/MAP-02A-REQUIREMENTS-ADDENDUM-20260704.md`
- `agent_workspace/reports/MAP-03-PROVIDER-DISCOVERY-20260704.md`
- `architecture/11_architecture.md`
- `architecture/12_decisions.md`
- `architecture/13_implementation_slices.md`
- `app/mobile/App.tsx`
- `app/mobile/package.json`

## Architecture Decisions

1. `MapPoint` is not a new persisted canonical entity. It is renamed to `MapPointView` and derived from persisted `Place` plus optional `DayItem`.
2. `PlaceRepository` owns saved location records. `DayPlanRepository` owns day assignment and card order through `DayItem.sortOrder`.
3. Selected-day map cards, pin labels, and planned route line derive from the same ordered `DayItem` set. There is no separate `MapPointRepository` and no separate persisted `routeOrder` on `Place`.
4. Coordinate classification is one pure app-owned domain seam. Offline services consume its result and do not implement a competing country/coverage classifier.
5. Offline pack lifecycle, proof/acceptance state, provider inventory, and coordinate/camera coverage are separate contracts.
6. External map handoff is generic. Yandex-specific label, URL/deep-link construction, fallback behavior, and approval gates live in a provider policy/adapter.

## Review Blocker Resolution

| Review blocker | Resolution in this report |
| --- | --- |
| Geography seam split between domain/offline service | Defines one pure `classifyCoordinate(coordinates, downloadedArea?)` contract with reason codes and MAP-02A fixture outputs. |
| `MapPoint` conflicts with `Place` / `DayItem` | Makes `MapPointView` a derived projection; `PlaceRepository` owns saved places and `DayPlanRepository` owns day assignment/order. |
| Route-order edge cases underspecified | Adds transaction rules for create, assign, clear, reorder, delete day card, delete place target, no-coordinate cards, reload, and stale reorders. |
| Offline status mixes lifecycle and coverage | Splits lifecycle, proof state, inventory, and coverage classification. |
| Yandex naming leaks into generic architecture | Defines generic external map handoff with Yandex only as provider policy/adapter. |
| MAP-02A treated as missing | Treats MAP-02A as accepted input and embeds its fixtures, route-line model, proof expectations, and copy constraints. |
| Route-line tests depend on visuals | Adds `PlannedRouteLineSnapshot`/`MapRenderSnapshot` with day ID, included/excluded IDs, ordered coordinates, rendered flag, and stable test IDs. |
| Validation contracts too loose | Adds coordinate, country narrowing, route order, provider metadata, and raw provider payload rejection contracts. |

## Updated Module Shape

The MAP-04 module direction remains valid with these ownership corrections:

```text
src/
  features/
    maps/
      MapScreen.tsx
      MapCanvasHost.tsx
      MapPointCards.tsx
      MapSearchPanel.tsx
      MapFailureState.tsx
      mapViewModel.ts
  domain/
    map/
      coordinateClassification.ts
      mapSelectors.ts
      mapRenderModels.ts
      offlineCoverage.ts
    models/
      Place.ts
      DayItem.ts
  data/
    repositories/
      PlaceRepository.ts
      DayPlanRepository.ts
      OfflinePackRepository.ts
  services/
    mapDisplay/
      MapDisplayAdapter.tsx
      MockMapDisplayAdapter.tsx
      MapLibreMapDisplayAdapter.tsx
    offlineMap/
      OfflinePackService.ts
      OfflinePackProviderAdapter.ts
      MockOfflinePackProviderAdapter.ts
    placeSearch/
      PlaceSearchAdapter.ts
      MockPlaceSearchAdapter.ts
    externalMapHandoff/
      ExternalMapHandoffService.ts
      ExternalMapProviderPolicy.ts
      YandexExternalMapAdapter.ts
```

Rules:

- `domain/map` is pure TypeScript and imports no React Native, Expo, SDK, storage, or provider code.
- `features/maps` composes repositories, selectors, adapter results, and Russian copy keys. It does not parse provider payloads.
- `services/mapDisplay` receives normalized render models and emits normalized events.
- `services/placeSearch` receives explicit submitted search requests and returns normalized results/failures.
- `services/offlineMap` translates provider pack APIs to app-owned lifecycle/inventory contracts.
- `services/externalMapHandoff` owns provider-specific URL/deep-link behavior behind generic service results.

## Place / DayItem / MapPointView Ownership

Persisted location data:

```ts
type Place = {
  id: string;
  tripId: string;
  title: string;
  address?: string;
  comment?: string;
  coordinates: Coordinates | null;
  countryCode: 'GE' | null;
  source: 'search_result' | 'manual_map_tap' | 'manual_text';
  providerRef?: ApprovedProviderRef;
  createdAt: string;
  updatedAt: string;
};
```

Persisted selected-day ordering:

```ts
type DayItem = {
  id: string;
  tripId: string;
  dayId: string;
  kind: 'manual' | 'place' | 'flight' | 'housing' | 'note' | 'checklistItem';
  targetId?: string;
  displayTitle: string;
  displaySubtitle?: string;
  sortOrder: PositiveInteger;
  isTargetMissing?: boolean;
};
```

Derived map projection:

```ts
type MapPointView = {
  pointId: string;        // Place.id for place-backed map points
  placeId: string;
  dayItemId: string | null;
  tripId: string;
  title: string;
  address?: string;
  coordinates: Coordinates | null;
  countryCode: 'GE' | null;
  source: Place['source'];
  dayId: string | null;
  routeOrder: PositiveInteger | null; // DayItem.sortOrder when dayId exists
  providerRef?: ApprovedProviderRef;
};
```

Fixture mapping:

- MAP-02A point IDs map to `Place.id`.
- MAP-02A `dayId` and `routeOrder` map to an optional `DayItem(kind='place', targetId=Place.id, sortOrder=routeOrder)`.
- No-day records have a `Place` and no map assignment `DayItem`.
- No-coordinate day records are still `Place` records with `coordinates = null` and a `DayItem` when assigned to a day.
- Target-missing `DayItem` snapshots remain part of the day plan, but they are not a coordinate-backed `MapPointView` until relinked to an existing `Place`.

This preserves the baseline architecture: `PlaceRepository` and `DayPlanRepository` are the only write paths for saved places and day order.

## Coordinate Classification Contract

`classifyCoordinate` is the only app-owned geography and downloaded-area predicate.

```ts
type CoordinateClassificationReason =
  | 'invalid_coordinate'
  | 'outside_georgia'
  | 'inside_georgia_download_area_unknown'
  | 'inside_georgia_inside_downloaded_area'
  | 'inside_georgia_outside_downloaded_area';

type DownloadedArea = {
  areaId: string;
  countryCode: 'GE';
  bounds: GeoBounds;
  source: 'fixture' | 'provider_inventory';
};

type CoordinateClassification = {
  insideGeorgia: boolean;
  insideDownloadedArea: boolean | null;
  reason: CoordinateClassificationReason;
  downloadedAreaId?: string;
};

function classifyCoordinate(
  coordinates: unknown,
  downloadedArea?: DownloadedArea,
): CoordinateClassification;
```

Rules:

- The classifier first validates coordinate shape and finite ranges.
- Provider country hints may be passed to save validation, but they are not the source of truth for `insideGeorgia`.
- `insideDownloadedArea = null` only when coordinates are valid, inside Georgia, and no downloaded-area input is known.
- Outside-Georgia always returns `insideDownloadedArea = false`.
- Offline pack services consume this result for camera/tap/point coverage. They do not own a separate `classifyCoordinates` method.
- Production country classification must later use an approved border/source. Until then, MAP-07/MAP-08 assert MAP-02A fixture outputs exactly.

### MAP-02A Fixture Outputs

With no downloaded-area input:

| Coordinate ID | Expected classification |
| --- | --- |
| `GE_TBILISI_NARIKALA` | `insideGeorgia=true`, `insideDownloadedArea=null`, `reason=inside_georgia_download_area_unknown` |
| `GE_TBILISI_RIKE` | `insideGeorgia=true`, `insideDownloadedArea=null`, `reason=inside_georgia_download_area_unknown` |
| `GE_TBILISI_LIBERTY` | `insideGeorgia=true`, `insideDownloadedArea=null`, `reason=inside_georgia_download_area_unknown` |
| `GE_TBILISI_SULFUR_BATHS` | `insideGeorgia=true`, `insideDownloadedArea=null`, `reason=inside_georgia_download_area_unknown` |
| `GE_MTSKHETA_CATHEDRAL` | `insideGeorgia=true`, `insideDownloadedArea=null`, `reason=inside_georgia_download_area_unknown` |
| `GE_BATUMI_BOULEVARD` | `insideGeorgia=true`, `insideDownloadedArea=null`, `reason=inside_georgia_download_area_unknown` |
| `OUTSIDE_GE_YEREVAN_CASCADE` | `insideGeorgia=false`, `insideDownloadedArea=false`, `reason=outside_georgia` |
| `OUTSIDE_GE_TRABZON_CENTER` | `insideGeorgia=false`, `insideDownloadedArea=false`, `reason=outside_georgia` |

With `downloadedArea.areaId = TBILISI_PROOF_AREA`, latitude `41.60..41.80`, longitude `44.65..44.90`:

| Coordinate ID | Expected classification |
| --- | --- |
| `GE_TBILISI_NARIKALA` | `insideGeorgia=true`, `insideDownloadedArea=true`, `reason=inside_georgia_inside_downloaded_area` |
| `GE_TBILISI_RIKE` | `insideGeorgia=true`, `insideDownloadedArea=true`, `reason=inside_georgia_inside_downloaded_area` |
| `GE_TBILISI_LIBERTY` | `insideGeorgia=true`, `insideDownloadedArea=true`, `reason=inside_georgia_inside_downloaded_area` |
| `GE_TBILISI_SULFUR_BATHS` | `insideGeorgia=true`, `insideDownloadedArea=true`, `reason=inside_georgia_inside_downloaded_area` |
| `GE_MTSKHETA_CATHEDRAL` | `insideGeorgia=true`, `insideDownloadedArea=false`, `reason=inside_georgia_outside_downloaded_area` |
| `GE_BATUMI_BOULEVARD` | `insideGeorgia=true`, `insideDownloadedArea=false`, `reason=inside_georgia_outside_downloaded_area` |
| `OUTSIDE_GE_YEREVAN_CASCADE` | `insideGeorgia=false`, `insideDownloadedArea=false`, `reason=outside_georgia` |
| `OUTSIDE_GE_TRABZON_CENTER` | `insideGeorgia=false`, `insideDownloadedArea=false`, `reason=outside_georgia` |

Invalid coordinate examples, including non-finite numbers, missing fields, latitude outside `-90..90`, or longitude outside `-180..180`, return `insideGeorgia=false`, `insideDownloadedArea=false`, `reason=invalid_coordinate`.

## Route-Order Transaction Rules

Route order is stored as `DayItem.sortOrder` for selected-day cards. The rendered `routeOrder` is a map-facing alias of that value.

All route-order writes run in a repository transaction and refresh from storage before selectors run.

| Operation | Transaction rule | Compaction rule | Expected map effect |
| --- | --- | --- | --- |
| Create no-day place | `PlaceRepository.createPlace(...)`; no `DayItem` created. | None. | Gray unnumbered pin if coordinates exist; no route line. |
| Create place for day | Create `Place`, then `DayPlanRepository.createPlaceItem(dayId, placeId, sortOrder=max+1)`. | No existing orders changed. | Red numbered pin if coordinates exist; no-coordinate card gets its appended number. |
| Assign existing place to day | Create or move the map assignment `DayItem`; append to destination day as `max(sortOrder)+1`. If moved from another day, old day is compacted after removing assignment. | Compact only the affected day card set, including no-coordinate cards. | Pin label uses new `sortOrder`; no-coordinate assignments can create visible pin-number gaps. |
| Clear day from place | Delete/unlink the place assignment `DayItem`; keep `Place`. | Compact remaining cards in that day across all remaining place-backed day cards, including no-coordinate cards. | Derived `dayId=null`, `routeOrder=null`; gray unnumbered pin if coordinates exist. |
| Reorder selected-day cards | `reorderDayPlaceItems(dayId, orderedDayItemIds)` must include exactly the current set of place-backed map card `DayItem.id` values for that day: no missing, extra, duplicate, negative, fractional, or zero positions. | Set `sortOrder = 1..n` across the submitted card order. Do not compact only coordinate-backed pins. | Cards, pin labels, and route-line sequence update from the same order. |
| Delete day card | Delete the selected `DayItem`; never delete its target `Place`. | Compact remaining cards in that day. | Place remains in all/no-day place lists according to its other assignment state; selected-day line refreshes. |
| Delete place target | Delete `Place` through `PlaceRepository`; linked `DayItem` snapshots remain readable and are marked `isTargetMissing` or cleared according to base repository policy. | Do not compact merely because the target is missing; the day-plan card still exists. Compact only if the stale `DayItem` is later deleted or reordered. | Target-specific map actions disabled. Missing target is excluded from pins and route line; saved day snapshot remains readable. |
| No-coordinate card | Store as `Place.coordinates=null`; if assigned, keep its `DayItem.sortOrder`. | Never renumber pins around it. | Card order shows the number; no pin; route line excludes it and visible pin labels skip that number. |
| Reload/persistence | Reload `Place` and `DayItem` from repositories, then derive `MapPointView`. | Stored `sortOrder` must already be contiguous for non-stale place-backed day cards after transaction writes. | Same cards, labels, and planned line after app restart. |

Concurrency/staleness rules:

- Reorder commands include the current day order revision or loaded ordered IDs. A stale reorder is rejected and must reload before retry.
- Assign/clear/delete commands are idempotent when repeated with the same target state.
- Repository code does not accept arbitrary `routeOrder` from UI forms; order is computed by transaction commands.

## Map Selectors And Render Models

Selectors derive map state from `Place[]`, `DayItem[]`, mode, selected day, and optional offline coverage:

```ts
type MapMode =
  | { kind: 'all' }
  | { kind: 'no_day' }
  | { kind: 'day'; dayId: string };

type MapPin = {
  testId: string;
  pointId: string;
  placeId: string;
  dayItemId: string | null;
  coordinates: Coordinates;
  color: 'gray' | 'red';
  label: string | null;
  title: string;
};

type PlannedRouteLineSnapshot = {
  testId: string;
  dayId: string;
  lineType: 'planned_order';
  rendered: boolean;
  includedPointIds: string[];
  excludedPointIds: string[];
  orderedCoordinates: Coordinates[];
};

type MapRenderSnapshot = {
  mode: MapMode;
  cards: MapPointView[];
  pins: MapPin[];
  plannedLine: PlannedRouteLineSnapshot | null;
};
```

Selector rules:

- `All`: cards include all trip `MapPointView` values; pins include only coordinate-backed places; day-assigned pins are red and no-day pins are gray; no route line; no app-owned route labels.
- `No day`: cards include no-day `MapPointView` values; pins include coordinate-backed no-day places in gray; no route line; no route labels.
- Selected day: cards include ordered place-backed `DayItem`s for the selected day; red pins include only coordinate-backed cards; pin label is `String(routeOrder)`; route line includes only coordinate-backed cards in ascending card order.
- If fewer than two coordinate-backed selected-day cards exist, `plannedLine.rendered=false` or `plannedLine=null` according to component needs, but the test snapshot must still expose included/excluded point IDs for selector tests.
- The map display adapter receives only `MapPin[]` and the app-owned `PlannedRouteLineSnapshot` data needed for drawing. It does not decide order.

For MAP-02A `map_day_order_with_missing_coordinate`, the selector output must include:

```json
{
  "dayId": "day-1",
  "lineType": "planned_order",
  "rendered": true,
  "includedPointIds": ["pt-day1-narikala", "pt-day1-liberty", "pt-day1-baths"],
  "excludedPointIds": ["pt-day1-no-coord"],
  "orderedCoordinates": [
    {"latitude": 41.6886, "longitude": 44.8086},
    {"latitude": 41.693, "longitude": 44.8015},
    {"latitude": 41.6879, "longitude": 44.8112}
  ]
}
```

## Offline Contracts

Offline status is split into four concepts.

### Pack Lifecycle

```ts
type OfflinePackLifecycle =
  | 'not_downloaded'
  | 'queued'
  | 'downloading'
  | 'available'
  | 'failed'
  | 'deleting';
```

`available` means the app has a local provider inventory entry for the pack. It does not by itself authorize production copy that says the map is downloaded.

### Proof State

```ts
type OfflinePackProofState =
  | 'mock_only'
  | 'proof_pending'
  | 'proof_accepted'
  | 'blocked';
```

Production copy may say the map is downloaded only when:

- `lifecycle = 'available'`;
- `proofState = 'proof_accepted'`;
- inventory is for the expected Georgia area;
- MAP-03/MAP-06/MAP-09 proof artifacts and owner thresholds are accepted.

Mock and unproven packs must use test/development copy only and must not claim offline downloaded availability in release UI.

### Inventory

```ts
type OfflinePackInventory = {
  tripId: string;
  areaId: string;
  countryCode: 'GE';
  scope: 'whole_georgia' | 'owner_approved_georgia_area' | 'fixture_tbilisi_proof_area';
  lifecycle: OfflinePackLifecycle;
  proofState: OfflinePackProofState;
  bounds: GeoBounds;
  zoomRange?: { minZoom: number; maxZoom: number };
  providerRef?: ApprovedOfflineProviderRef;
  byteSize?: number;
  storageDeltaBytes?: number;
  createdAt?: string;
  updatedAt?: string;
  lastInventoryVerifiedAt?: string;
  restartVerifiedAt?: string;
  networkDisabledReopenVerifiedAt?: string;
  attributionVerifiedAt?: string;
  cleanupVerifiedAt?: string;
  proofArtifactIds: string[];
};
```

Inventory storage is app-owned metadata plus approved provider inventory IDs. Raw provider pack internals and SDK objects are not persisted.

### Coverage Classification

Coverage for a tap, camera center, saved point, or selected-day line is always computed through `classifyCoordinate(coordinates, downloadedArea)`.

```ts
type OfflineCoverageState =
  | { kind: 'inside_downloaded_area'; classification: CoordinateClassification }
  | { kind: 'outside_downloaded_area'; classification: CoordinateClassification }
  | { kind: 'coverage_unknown'; classification: CoordinateClassification };
```

`outside_downloaded_area` is never a pack lifecycle state. It is a coordinate/camera classification relative to known downloaded bounds.

## Provider Adapter Contracts

### Map Display

```ts
type MapProviderFailure = {
  kind:
    | 'init_failed'
    | 'style_failed'
    | 'tile_failed'
    | 'attribution_blocked'
    | 'sdk_unavailable'
    | 'unsupported_platform';
  stage: 'startup' | 'style_load' | 'tile_load' | 'offline_reopen' | 'overlay_render';
  retryable: boolean;
  userAction: 'retry' | 'wait_for_online' | 'use_saved_list' | 'blocked';
};

type MapDisplayProps = {
  pins: MapPin[];
  plannedLine: PlannedRouteLineSnapshot | null;
  downloadedArea?: OfflinePackInventory;
  interactionMode: 'view' | 'tap_to_add';
  onTap: (event: { coordinates: Coordinates }) => void;
  onProviderFailure: (failure: MapProviderFailure) => void;
};
```

The adapter may know provider SDK types internally. It must not emit SDK objects, raw provider payloads, API keys, provider request URLs, or provider inventory internals to domain, repositories, UI logs, or tests.

### Place Search

```ts
type PlaceSearchRequest = {
  query: string;
  countryCode: 'GE';
  near?: Coordinates;
  limit: PositiveInteger;
  autocomplete: false;
};

type NormalizedPlaceSearchResult = {
  resultId: string;
  title: string;
  address?: string;
  coordinates: Coordinates | null;
  providerCountryCode: string | null;
  providerRef?: ApprovedProviderRef;
};

type PlaceSearchFailure = {
  kind: 'offline' | 'no_results' | 'timeout' | 'quota' | 'api_error' | 'malformed_response';
  retryable: boolean;
  userAction: 'retry' | 'refine_query' | 'add_manually' | 'wait_for_online';
};
```

Search is explicit submitted search only for MVP. Autocomplete remains absent or forced off until MAP-03/MAP-09 and owner approval accept terms, quota, pricing, key model, and attribution.

## External Map Handoff Boundary

Domain and features call a generic handoff service:

```ts
type ExternalMapTarget =
  | { kind: 'coordinates'; coordinates: Coordinates; title?: string }
  | { kind: 'address'; address: string; title?: string };

type ExternalMapHandoffResult =
  | { kind: 'opened'; providerId: string }
  | { kind: 'unsupported'; providerId: string; reason: 'missing_target' | 'platform_unsupported' | 'policy_blocked' }
  | { kind: 'failed'; providerId: string; retryable: boolean };

type ExternalMapProviderPolicy = {
  providerId: string;
  displayName: string;
  approvedTargetKinds: Array<ExternalMapTarget['kind']>;
  approvedFallbacks: Array<'web' | 'copy_address' | 'copy_coordinates' | 'display_saved_target_only'>;
  requiresOwnerApprovalForAddress: boolean;
};
```

Yandex is one configured provider policy and adapter:

- `providerId = 'yandex_maps'`;
- Russian UI label may come from policy as `Открыть в Яндекс Картах`;
- deep-link/web URL construction stays in `YandexExternalMapAdapter`;
- web fallback, copy address, and copy coordinates are enabled only when owner/security approve them;
- failures never delete or mutate saved `Place`/`Housing` data;
- the UI must not claim that Yandex Maps always opens.

## Validation Contracts

### Coordinates

Only a coordinate parser/constructor can create `Coordinates`.

```ts
type Coordinates = {
  latitude: number;
  longitude: number;
};
```

Validation:

- reject missing/non-object input;
- reject non-number, `NaN`, `Infinity`, and `-Infinity`;
- require latitude in `-90..90`;
- require longitude in `-180..180`;
- normalize precision consistently for storage/test comparison;
- do not silently swap latitude/longitude. Swapped valid-range values classify normally, usually outside Georgia, and are blocked for coordinate-backed save if outside Georgia.

### Country Narrowing

Save commands use the classifier as authority:

- `Place.countryCode` can persist only `'GE'` or `null`.
- Provider `country`, `countryCode`, bbox, or locale fields are hints only.
- Search requests should ask providers for Georgia narrowing when supported, but selected results still pass through `classifyCoordinate`.
- If provider says `GE` but classifier says outside Georgia, block coordinate-backed save.
- If provider says non-GE but classifier says inside Georgia, save only after adapter normalization records the mismatch for diagnostics without storing raw payload; country remains `'GE'`.
- Outside-Georgia coordinate-backed save is blocked by default. Manual note-only save with `coordinates=null` remains owner-policy-gated.

### Route Order

`PositiveInteger` route/sort order validation:

- integer only;
- starts at `1`;
- no zero, negative, fractional, duplicate, or sparse values after repository write transactions;
- contiguous across selected-day map cards, including no-coordinate cards;
- pin labels derive from card `sortOrder`, not coordinate index.

### Provider Metadata

```ts
type ApprovedProviderRef = {
  providerId: string;
  providerVersion?: string;
  providerPlaceId?: string;
  attributionText?: string;
  attributionRequired: boolean;
  storagePolicyId: string;
};

type ApprovedOfflineProviderRef = {
  providerId: string;
  providerVersion?: string;
  providerPackId?: string;
  storagePolicyId: string;
};
```

Rules:

- Provider metadata persists only when MAP-03/MAP-09 approve the provider storage policy.
- `providerPlaceId` is omitted unless the selected provider terms/security review allow durable storage.
- Attribution fields are stored only when allowed and required to display saved provider-derived results later.
- Provider name/version and storage policy ID are enough for diagnostics; raw terms-sensitive payloads are not persisted.

### Raw Provider Payload Rejection

Repository command inputs and domain models must not include `rawPayload`, SDK objects, request URLs with secrets, tile internals, provider error bodies, or full request/response logs.

Contract tests must assert:

- provider adapters return normalized DTOs only;
- repositories reject unknown raw provider payload fields at runtime when accepting untrusted adapter DTOs;
- logs contain failure classes and sanitized IDs only;
- API keys and private location traces are never logged.

## Failure-State Ownership

| State | Owner | Contract |
| --- | --- | --- |
| Outside Georgia | `domain/map/coordinateClassification` plus save flow | Block coordinate-backed save; no persisted pin; saved manual note-only fallback remains owner-policy-gated. |
| Outside downloaded area | `domain/map/coordinateClassification` using known `DownloadedArea` | Keep saved cards/details readable; offer return-to-downloaded-area only when bounds are known. |
| Offline pack not downloaded | `OfflinePackService` lifecycle/inventory | Do not promise offline map; local saved details remain readable. |
| Offline pack available but unproven | `OfflinePackService` proof state | Development/test only; no release copy saying downloaded. |
| Map SDK/style/tile failure | `MapCanvasHost` through `MapProviderFailure` | Cards/lists/details remain visible from repositories. |
| Search no results/offline/provider failure | `MapSearchPanel` through `PlaceSearchFailure` | Preserve query; no partial point saved automatically; manual add remains available. |
| No-coordinate place | `mapSelectors` and cards | Card/list visible; no pin; route-line exclusion recorded in test snapshot. |
| External map handoff failure | `ExternalMapHandoffService` | Saved address/coordinates remain visible; provider fallback follows policy. |
| Attribution blocked/missing | Adapter plus security/provider review | Block provider surface or show required attribution; do not bury attribution duties in domain records. |

## Test Contracts

Required before MAP-05/MAP-07 planning can proceed:

- Pure classifier tests for every MAP-02A coordinate fixture with and without `TBILISI_PROOF_AREA`.
- Parser tests for invalid, non-finite, out-of-range, and swapped valid-range coordinates.
- Selector tests for `map_empty_trip`, `map_all_mixed_points`, `map_no_day_mixed`, `map_day_empty`, `map_day_order_with_missing_coordinate`, `map_reorder_day_cards`, and fewer-than-two coordinate route-line cases.
- Repository transaction tests for assign day, clear day, reorder, delete day card, delete place target, no-coordinate card order, stale reorder rejection, and reload persistence.
- Adapter contract tests proving map/search/offline/handoff adapters emit normalized DTOs only.
- Component tests proving provider failures do not remove saved cards/lists/details.
- Copy scans using MAP-02A Russian approved/prohibited terms for map, offline, search, route-line, and external handoff states.
- MAP-06 proof handoff fields: device/build IDs, provider SDK/package versions, pack inventory IDs, bounds, zoom range, size, duration, restart inventory, network-disabled reopen, overlays, attribution, cleanup, sanitized logs, and key/privacy logging evidence.

## Implementation-Planning Readiness

MAP-04R is ready for architecture_critic, code_quality_reviewer, and lead review.

If accepted, MAP-05 may plan domain/mock implementation slices for:

- `Place`/`DayItem`-backed map projections;
- coordinate classifier and MAP-02A fixtures;
- route-order repository commands;
- map selector snapshots and mock map adapter;
- normalized search/handoff/offline contracts without production provider claims.

Still blocked before provider-backed implementation or release claims:

- production map tile/style/search provider choice;
- provider metadata storage policy;
- real API key integration;
- native iOS/Android/offline proof in Expo development builds;
- whole-country Georgia offline acceptance;
- owner thresholds for pack size, duration, storage, proof area, and fallback model;
- MAP-09/security approval for keys, logging, attribution, provider retention, and provider IDs.

This rework resolves the MAP-04 blockers at the architecture-contract level without expanding MVP scope.
