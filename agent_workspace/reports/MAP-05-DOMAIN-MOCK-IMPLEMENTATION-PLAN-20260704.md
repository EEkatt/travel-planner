# MAP-05 Domain/Mock Implementation Plan

Task ID: TASK-20260704-037
Role: mobile_expo_engineer
Date: 2026-07-04
Status: Ready for code_quality_reviewer, qa_engineer, and lead review

## Purpose

Prepare the first implementation slice for the map feature using the accepted MAP-02A and MAP-04R contracts, without starting provider-backed, native offline, or production provider work.

This is a planning/report-only artifact. No application code was edited.

## Context Read

- `agent_workspace/tasks/open/TASK-20260704-037-map-05-domain-mock-implementation-plan.md`
- `agent_workspace/reports/MAP-LEAD-DECISION-AFTER-MAP-04R-20260704.md`
- `agent_workspace/reports/MAP-04R-ARCHITECTURE-REWORK-20260704.md`
- `agent_workspace/reports/REVIEW-MAP-04R-BY-CRITIC-20260704.md`
- `agent_workspace/reports/REVIEW-MAP-04R-BY-CODE-QUALITY-20260704.md`
- `agent_workspace/reports/MAP-02A-REQUIREMENTS-ADDENDUM-20260704.md`
- `agent_workspace/reports/MAP-03-PROVIDER-DISCOVERY-20260704.md`
- `app/mobile/App.tsx`
- `app/mobile/package.json`
- `app/mobile/app.json`
- `app/mobile/tsconfig.json`
- `app/mobile/index.ts`
- `app/mobile/AGENTS.md`
- `app/mobile/CLAUDE.md`

## Current Mobile Baseline

- `app/mobile/App.tsx` is still a single-file prototype with inline map state, inline Russian copy, a web-only Leaflet iframe, public OSM tile URLs, and a public Nominatim fetch.
- `app/mobile/package.json` has Expo `~56.0.12`, React Native `0.85.3`, TypeScript `~6.0.3`, and no unit-test runner.
- The accepted MAP-04R direction is to add new `src/` modules and treat `App.tsx` as prototype context only, not as proof of native, provider, offline, or production behavior.

## Implementation Slice Plan

### Slice 1: Pure Domain, Fixtures, Selectors, And Mock Contracts

Recommended first patch scope. This slice is intentionally small enough for focused review and should not integrate real providers or refactor the full prototype UI.

Implement:

- app-owned map domain types: `Coordinates`, `Place`, `DayItem`, `MapPointView`, `MapCardView`, `MapPin`, `PlannedRouteLineSnapshot`, `MapRenderSnapshot`;
- coordinate parser/validator and `classifyCoordinate(coordinates, downloadedArea?)`;
- MAP-02A fixtures as typed seed data;
- pure selectors that derive cards, pins, and planned-line snapshots from `Place[]`, `DayItem[]`, and `MapMode`;
- mock adapter contracts for map display, place search, offline pack inventory/coverage, and external handoff;
- deterministic unit tests for classifier fixtures, selector fixtures, fewer-than-two route-line debug snapshots, no-coordinate route gaps, and target-missing day-card representation.

Do not modify `App.tsx` in this first patch unless reviewers explicitly ask for prototype wiring in the same change. Keeping Slice 1 pure reduces UI noise and makes the contracts reviewable.

### Slice 2: In-Memory Repository Commands

Implement after Slice 1 is accepted:

- `InMemoryPlaceRepository`;
- `InMemoryDayPlanRepository`;
- transaction-style command helpers for create, assign, clear, reorder, delete day card, delete place target, and reload snapshots;
- stale reorder rejection using loaded ordered IDs or a day revision;
- runtime rejection of raw provider payload fields at repository boundaries.

This can still avoid persistence. Restart persistence acceptance should remain a later stage.

### Slice 3: Web Prototype Mock Wiring

After domain and repository tests are accepted:

- move prototype seed state toward MAP-02A fixtures;
- have web prototype card/pin/line state come from selectors rather than independent inline arrays;
- replace public Nominatim behavior with `MockPlaceSearchAdapter`;
- keep the web map surface clearly labeled as prototype/mock behavior;
- do not add production provider dependencies, keys, MapLibre native packages, or offline pack code.

### Slice 4: Component Failure-State Tests

Once the prototype uses mocks:

- add component-level tests for map provider failure, search failure, offline-not-downloaded, outside downloaded area, no-coordinate cards, and handoff failure;
- assert saved cards/lists/details remain visible;
- add Russian copy negative scans for prohibited terms.

## Proposed File And Module List

### First Patch Files

- `app/mobile/src/domain/map/coordinates.ts`
  - `Coordinates`, `parseCoordinates`, precision normalization, range/finite validation.
- `app/mobile/src/domain/map/coordinateClassification.ts`
  - `DownloadedArea`, `CoordinateClassification`, `classifyCoordinate`.
  - Uses MAP-02A deterministic fixture geography only; not a production border source.
- `app/mobile/src/domain/map/mapModels.ts`
  - `MapMode`, `MapPointView`, `MapCardView`, `MapPin`, `PlannedRouteLineSnapshot`, `MapRenderSnapshot`.
- `app/mobile/src/domain/map/mapSelectors.ts`
  - `selectMapPointViews`, `selectMapRenderSnapshot`, route-line debug snapshot derivation.
- `app/mobile/src/domain/models/Place.ts`
  - `Place`, `ApprovedProviderRef`, allowed source values.
- `app/mobile/src/domain/models/DayItem.ts`
  - `DayItem`, `PositiveInteger`, selected-day card/order model.
- `app/mobile/src/domain/map/mapFixtures.ts`
  - MAP-02A coordinate constants, `TBILISI_PROOF_AREA`, shared days, seed places/day items, fixture builders.
- `app/mobile/src/services/mapDisplay/MapDisplayAdapter.ts`
  - normalized map display props and `MapProviderFailure`.
- `app/mobile/src/services/mapDisplay/MockMapDisplayAdapter.ts`
  - mock-only display model/event sink; no SDK objects.
- `app/mobile/src/services/placeSearch/PlaceSearchAdapter.ts`
  - submitted-search-only contract with `autocomplete: false`.
- `app/mobile/src/services/placeSearch/MockPlaceSearchAdapter.ts`
  - MAP-02A provider mock states.
- `app/mobile/src/services/offlineMap/OfflinePackContracts.ts`
  - lifecycle, proof state, inventory, coverage contracts.
- `app/mobile/src/services/offlineMap/MockOfflinePackProviderAdapter.ts`
  - mock inventory for `TBILISI_PROOF_AREA`.
- `app/mobile/src/services/externalMapHandoff/ExternalMapHandoffService.ts`
  - generic target/result/policy contracts.
- `app/mobile/src/services/externalMapHandoff/MockExternalMapHandoffService.ts`
  - mock opened/unsupported/failed outcomes.
- `app/mobile/src/domain/map/__tests__/coordinateClassification.test.ts`
- `app/mobile/src/domain/map/__tests__/mapSelectors.test.ts`
- `app/mobile/src/services/__tests__/mockAdapterContracts.test.ts`
- `app/mobile/package.json`
  - add test scripts and dev-only test tooling if accepted.
- `app/mobile/package-lock.json`
  - update only if dev test dependencies are added.

### Later Files

- `app/mobile/src/data/repositories/PlaceRepository.ts`
- `app/mobile/src/data/repositories/DayPlanRepository.ts`
- `app/mobile/src/data/repositories/InMemoryPlaceRepository.ts`
- `app/mobile/src/data/repositories/InMemoryDayPlanRepository.ts`
- `app/mobile/src/data/repositories/__tests__/dayPlanTransactions.test.ts`
- `app/mobile/src/features/maps/mapViewModel.ts`
- `app/mobile/src/features/maps/MapScreen.tsx`
- `app/mobile/src/features/maps/MapCanvasHost.tsx`
- `app/mobile/src/features/maps/MapPointCards.tsx`
- `app/mobile/src/features/maps/MapSearchPanel.tsx`
- `app/mobile/src/features/maps/MapFailureState.tsx`

## Domain And Mock Contracts To Implement First

### Coordinates And Classification

- `parseCoordinates(input)` is the only creator for coordinate values accepted from untrusted inputs.
- Reject missing fields, non-number values, `NaN`, infinities, latitude outside `-90..90`, and longitude outside `-180..180`.
- Do not silently swap latitude and longitude.
- `classifyCoordinate(coordinates, downloadedArea?)` returns:
  - `invalid_coordinate`;
  - `outside_georgia`;
  - `inside_georgia_download_area_unknown`;
  - `inside_georgia_inside_downloaded_area`;
  - `inside_georgia_outside_downloaded_area`.
- First implementation may use a documented deterministic Georgia fixture/bounds predicate sufficient for MAP-02A tests only. It must be named/commented as non-production and blocked on a later approved border/source.
- `TBILISI_PROOF_AREA` is bounds `lat 41.60..41.80`, `lon 44.65..44.90`.

### Place, DayItem, And Map Views

- `Place` owns saved location data.
- `DayItem` owns selected-day assignment and `sortOrder`.
- `MapPointView` is derived and never persisted.
- Add `MapCardView` to handle the code-quality carry-forward issue:
  - `kind: 'place'` for a normal place-backed card;
  - `kind: 'missing_target'` for a readable day-card snapshot whose `Place` was deleted or unavailable.
- Missing-target cards must not create pins, route-line points, or automatic order compaction.

### Selectors

- `All` mode:
  - cards include all place-backed views;
  - coordinate-backed no-day pins are gray;
  - coordinate-backed day-assigned pins are red;
  - no route line or route-number labels.
- `No day` mode:
  - cards include no-day views;
  - pins include only no-day coordinate-backed places in gray;
  - no route line.
- Selected-day mode:
  - cards are ordered by `DayItem.sortOrder`;
  - red pins include only coordinate-backed place cards;
  - pin labels use the card `sortOrder`, not the coordinate index;
  - no-coordinate cards remain visible and create label gaps;
  - missing-target cards remain visible but are excluded from pins and planned line.
- For selected-day mode, always expose a selector/debug `PlannedRouteLineSnapshot`.
  - `rendered=true` only when at least two coordinate-backed cards exist.
  - `includedPointIds`, `excludedPointIds`, and `orderedCoordinates` are present even when `rendered=false`.

### Mock Adapters

- Mock map display receives only `MapPin[]`, `PlannedRouteLineSnapshot | null`, downloaded-area metadata, and normalized tap/failure events.
- Mock search supports explicit submitted search only and sets `autocomplete: false`.
- Mock offline inventory may expose `not_downloaded`, `available + mock_only`, and `available + proof_accepted` for `fixture_tbilisi_proof_area`, but release copy must not claim whole-country or production offline readiness.
- Mock handoff is generic; Yandex-specific URL construction stays out of the first implementation slice.
- All mocks must reject or omit raw provider payloads, SDK objects, provider request URLs, API keys, private traces, and provider inventory internals.

## Test Plan

### Test Tooling

The mobile package currently has only `typecheck`. Add dev-only unit test tooling in the first implementation patch unless reviewers prefer a separate tooling patch.

Recommended:

- add `vitest` as a dev dependency;
- add scripts:
  - `"test": "vitest run"`;
  - `"test:watch": "vitest"`;
  - `"test:map": "vitest run src/domain/map src/services"`.

This adds no production provider dependency and keeps the first tests pure TypeScript.

### Unit Tests Required In Slice 1

- Coordinate parser rejects invalid, missing, non-finite, out-of-range, and swapped-valid-range examples.
- Classifier asserts every MAP-02A coordinate fixture:
  - without downloaded-area input;
  - with `TBILISI_PROOF_AREA`.
- Selector fixtures:
  - `map_empty_trip`;
  - `map_all_mixed_points`;
  - `map_no_day_mixed`;
  - `map_day_empty`;
  - `map_day_order_with_missing_coordinate`;
  - `map_reorder_day_cards` as a pure reordered input snapshot;
  - fewer-than-two coordinate selected-day cases with `rendered=false` but included/excluded IDs exposed.
- Target-missing day-card snapshot:
  - visible as `MapCardView.kind = 'missing_target'`;
  - excluded from pins and route line;
  - no automatic compaction.
- Mock adapter contract tests:
  - search returns normalized DTOs only;
  - failed search preserves no partial saved point;
  - offline mock exposes lifecycle/proof/inventory separately;
  - handoff failures do not mutate saved data;
  - raw provider payload fields are absent from mock results.

### Commands To Run

From `app/mobile`:

```sh
npm run typecheck
npm run test
npm run test:map
```

For a later web-prototype wiring patch:

```sh
npm run web
```

Manual web smoke for that later patch:

- open Map tab;
- switch `All`, `No day`, and selected-day modes;
- verify cards, pin colors, pin labels, and route-line snapshot are consistent with selector output;
- verify search uses the mock adapter, not public Nominatim;
- verify no production offline/provider claims appear.

## Web Prototype Update Plan

The current web prototype should be updated only after Slice 1 domain tests pass.

1. Replace inline `initialMapPoints` with a fixture-to-view-model adapter based on MAP-02A `Place` and `DayItem` seeds.
2. Replace independent `filteredVisiblePoints` / `filteredHiddenPoints` derivation with `selectMapRenderSnapshot`.
3. Make pin labels in selected-day mode use `DayItem.sortOrder`, preserving no-coordinate gaps.
4. Show no-coordinate and target-missing cards from `MapCardView` without rendering pins.
5. Replace the public Nominatim fetch with `MockPlaceSearchAdapter`.
6. Keep the Leaflet iframe or simulated map as prototype-only rendering, but remove any dependency on public OSM/Nominatim as behavior proof.
7. Add a debug/test surface or component prop that exposes `PlannedRouteLineSnapshot` for automation without inspecting canvas pixels.
8. Keep copy constrained to MAP-02A approved/prohibited terms and explicitly avoid claims of offline search, routing, navigation, traffic, ETA, live rerouting, or whole-country offline readiness.

## Risks And Blockers

- The app has no current unit-test runner; adding one is necessary for deterministic domain tests unless reviewers accept typecheck-only first.
- `App.tsx` is large and currently mixes prototype UI, search, map rendering, and data state. Directly editing it in the first patch would make review noisy.
- The deterministic Georgia classifier for MAP-02A is not a production border algorithm. Production geography remains blocked until an approved border/source decision exists.
- Provider-backed native rendering and offline packs remain blocked by MAP-03/MAP-06/MAP-09 proof, security, attribution, key, and owner threshold decisions.
- Whole-country Georgia offline viewing remains a target, not an accepted implementation claim.
- External handoff address/web/copy fallbacks still require owner/security approval before production UI behavior.
- If reviewers require repository transaction tests in the first patch, scope will grow. Recommended sequencing is selectors first, then in-memory repositories.
- Existing workspace state includes unrelated modified/untracked files. Implementation should avoid reverting or mixing those changes.

## Explicit Non-Goals

- No code edits in this planning task.
- No real provider keys.
- No production provider dependencies.
- No MapLibre, rnmapbox, Mapbox, Stadia, MapTiler, native dev-client, or offline-pack integration in the first implementation slice.
- No public Nominatim as production search behavior.
- No public OSM tiles as production or offline behavior.
- No autocomplete.
- No offline search, offline geocoding, offline routing, turn-by-turn navigation, route optimization, traffic, ETA, or live rerouting.
- No production provider selection.
- No whole-country Georgia offline claim.
- No persisted `MapPoint` entity or separate `routeOrder` field on `Place`.
- No storage of raw provider payloads, SDK objects, request URLs with secrets, provider error bodies, or private location traces.
- No restart-persistence acceptance until repositories and storage are implemented in a later slice.

## Recommended First Patch Scope

Proceed with Slice 1 only:

- add pure TypeScript domain models, classifier, fixtures, selectors, and normalized mock adapter contracts under `app/mobile/src/`;
- add dev-only unit test tooling if accepted;
- add deterministic tests for MAP-02A classifier and selector snapshots;
- do not wire production providers;
- do not modify native configuration;
- avoid broad `App.tsx` refactoring until the contracts pass review.

This gives code_quality_reviewer a small, layered contract patch, gives qa_engineer deterministic fixture outputs to evaluate, and gives lead a clear checkpoint before any prototype UI wiring or repository transaction work starts.
