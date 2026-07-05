# MAP-05P Domain/Mock Implementation Plan Rework

Task ID: TASK-20260704-040
Role: mobile_expo_engineer
Date: 2026-07-04
Status: Ready for QA re-review

## Purpose

Revise the MAP-05 first implementation slice so QA can re-review for go/no-go before code starts.

This is a planning/report-only rework. No implementation has started.

## Context Read

- `agent_workspace/tasks/open/TASK-20260704-040-map-05p-plan-rework.md`
- `agent_workspace/reports/MAP-05-DOMAIN-MOCK-IMPLEMENTATION-PLAN-20260704.md`
- `agent_workspace/reports/REVIEW-MAP-05-PLAN-BY-CODE-QUALITY-20260704.md`
- `agent_workspace/reports/REVIEW-MAP-05-PLAN-BY-QA-20260704.md`
- `agent_workspace/reports/MAP-LEAD-DECISION-AFTER-MAP-05-PLAN-REVIEWS-20260704.md`
- `agent_workspace/reports/MAP-02A-REQUIREMENTS-ADDENDUM-20260704.md`
- `agent_workspace/reports/MAP-04R-ARCHITECTURE-REWORK-20260704.md`
- `app/mobile/package.json`

## QA Blocker Resolution

| QA no-go item | MAP-05P correction |
| --- | --- |
| Swapped-coordinate parser expectation was wrong/ambiguous. | Slice 1 parser tests must not reject valid-range swapped-looking coordinates solely because they look swapped. The parser preserves latitude/longitude order; classifier/save validation handles outside-Georgia blocking. |
| `map_no_day_empty` was not explicit. | Slice 1 selector tests must include the exact `map_no_day_empty` fixture and expected empty no-day outputs. |
| `map_day_three_coordinate_points` was not explicit. | Slice 1 selector tests must include the clean three-coordinate selected-day baseline before missing-coordinate gap tests. |
| Copy-negative foundations were deferred too late. | Slice 1 must add app-owned copy term fixtures or a pure test helper for MAP-02A approved/prohibited Russian terms, plus a foundation test proving the denylist is available and distinct from approved terms. |

## Revised Slice 1 Patch Scope

The first implementation patch remains small and pure. It may add only:

- pure TypeScript map domain models under `app/mobile/src/domain/map` and `app/mobile/src/domain/models`;
- `parseCoordinates`, coordinate validation, precision normalization, and `classifyCoordinate(coordinates, downloadedArea?)`;
- MAP-02A fixture constants, seed records, expected selector snapshots, `TBILISI_PROOF_AREA`, and Russian copy term fixtures;
- pure selectors for `All`, `No day`, and selected-day map modes;
- `MapCardView` as a real union that can represent `kind = 'missing_target'`;
- `PlannedRouteLineSnapshot` with `rendered`, `includedPointIds`, `excludedPointIds`, and `orderedCoordinates`;
- mock contracts/adapters for map display, submitted-search-only place search, offline pack lifecycle/proof/inventory/coverage, and generic external handoff;
- pure unit tests for classifier, selector snapshots, mock adapter DTO boundaries, and copy-negative foundations;
- dev-only test tooling in `app/mobile/package.json` and `package-lock.json` only if needed for the test runner.

The first patch must not include repository transactions, persistence, route-order command implementation, feature screen wiring, component tests, provider-backed search, native map/offline SDKs, public provider calls, keys, or production release copy changes.

## Swapped-Coordinate Correction

Replace the MAP-05 parser expectation:

- Do not test that `parseCoordinates` rejects a value only because it appears to be latitude/longitude swapped when both numbers are within valid coordinate ranges.
- Do test that `parseCoordinates` rejects missing fields, non-object input, non-number values, `NaN`, infinities, latitude outside `-90..90`, and longitude outside `-180..180`.
- Do test that `parseCoordinates` preserves field order exactly for valid-range swapped-looking input.
- Do test that `classifyCoordinate` receives the preserved coordinate and classifies it normally. If the preserved coordinate is outside Georgia, save validation must block coordinate-backed save by classification, not by parser guesswork.
- Do not silently swap latitude and longitude anywhere in Slice 1.

Concrete first-patch expectation:

```ts
parseCoordinates({ latitude: 44.8086, longitude: 41.6886 })
```

is valid coordinate shape because both fields are finite and in range. The returned value must remain `{ latitude: 44.8086, longitude: 41.6886 }`; it must not become Narikala. The classifier then treats that preserved point according to the app-owned geography predicate.

## Explicit First-Patch Tests

### Coordinate Parser And Classifier

- `parseCoordinates` rejects missing fields, non-object inputs, non-number values, `NaN`, infinities, and out-of-range latitude/longitude.
- `parseCoordinates` preserves latitude/longitude order for valid-range swapped-looking examples.
- `classifyCoordinate` asserts every MAP-02A coordinate fixture with no downloaded area:
  - all Georgia fixtures return `insideGeorgia=true`, `insideDownloadedArea=null`, `reason=inside_georgia_download_area_unknown`;
  - `OUTSIDE_GE_YEREVAN_CASCADE` and `OUTSIDE_GE_TRABZON_CENTER` return `insideGeorgia=false`, `insideDownloadedArea=false`, `reason=outside_georgia`.
- `classifyCoordinate` asserts every MAP-02A coordinate fixture with `TBILISI_PROOF_AREA`:
  - Tbilisi fixtures return `inside_georgia_inside_downloaded_area`;
  - `GE_MTSKHETA_CATHEDRAL` and `GE_BATUMI_BOULEVARD` return `inside_georgia_outside_downloaded_area`;
  - outside-Georgia fixtures remain `outside_georgia`.

### Required Selector Snapshots

Slice 1 selector tests must include these fixture IDs explicitly:

- `map_empty_trip`;
- `map_all_mixed_points`;
- `map_no_day_mixed`;
- `map_no_day_empty`;
- `map_day_empty`;
- `map_day_three_coordinate_points`;
- `map_day_order_with_missing_coordinate`;
- `map_reorder_day_cards` as a pure reordered input snapshot only.

`map_no_day_empty` expected assertions:

- mode is `No day`;
- seed points are `pt-day1-narikala`, `pt-day1-liberty`, and `pt-day2-mtskheta`;
- cards contain no no-day records;
- pins are empty;
- `plannedLine` is `null`;
- empty-state metadata or selector result marks the no-day view as empty;
- expected actions include add no-day place and switch to `All`;
- online search availability remains conditional on online/provider state and is not an offline-search promise.

`map_day_three_coordinate_points` expected assertions:

- selected day is `day-1`;
- cards are ordered `[pt-day1-narikala, pt-day1-liberty, pt-day1-baths]`;
- pins are red and labeled `1`, `2`, `3`;
- no no-day pin is present;
- `plannedLine.rendered = true`;
- `includedPointIds = [pt-day1-narikala, pt-day1-liberty, pt-day1-baths]`;
- `excludedPointIds = []`;
- `orderedCoordinates = [(41.68860,44.80860),(41.69300,44.80150),(41.68790,44.81120)]`.

`map_day_order_with_missing_coordinate` remains required:

- cards show orders `1..4`;
- visible pins are labeled `1`, `3`, `4`;
- no pin `2` exists;
- `pt-day1-no-coord` remains visible as a card;
- `excludedPointIds = [pt-day1-no-coord]`;
- route-line coordinates are Narikala, Liberty, Baths in card order;
- route orders are not renumbered around missing coordinates.

Fewer-than-two selected-day coordinate cases remain required:

- expose a selector/debug `PlannedRouteLineSnapshot`;
- set `rendered=false`;
- include `includedPointIds`, `excludedPointIds`, and `orderedCoordinates` even when no drawable line is passed to the map adapter.

Target-missing day-card tests remain required:

- missing target is visible as `MapCardView.kind = 'missing_target'`;
- it creates no pin;
- it creates no route-line coordinate;
- it does not trigger automatic order compaction.

### Mock Adapter Boundary Tests

- Search mock returns normalized DTOs only and forces `autocomplete: false`.
- Failed/empty/offline search preserves query state and creates no partial saved point.
- Offline mock exposes lifecycle, proof state, inventory, and coverage separately.
- Map display mock accepts app-owned pins and line snapshots only.
- Handoff mock returns generic opened/unsupported/failed results and does not mutate saved data.
- Mock outputs omit raw provider payloads, SDK objects, provider request URLs, API keys, private traces, and provider inventory internals.

### Copy-Negative Foundations

Slice 1 must not wait for component UI scans to establish copy policy data. Add either:

- `app/mobile/src/domain/map/mapCopyTerms.ts`, or
- a MAP-02A fixture module that exports copy term fixtures.

The exported fixtures must include:

- approved Russian terms for planned selected-day line, offline map viewing, saved-data availability, online-search-unavailable-offline, outside Georgia, outside downloaded area, and external handoff;
- prohibited Russian terms for offline search, offline geocoding, offline routing, turn-by-turn navigation, route optimization, traffic, ETA/travel time, live rerouting, global/offline-everywhere claims, and guaranteed Yandex opening.

First-patch foundation tests must assert:

- prohibited terms are exported for later UI scans;
- approved and prohibited sets are distinct;
- prohibited terms are not accidentally treated as approved terms;
- the fixture includes at least these prohibited examples from MAP-02A: `офлайн-поиск`, `офлайн-геокодинг`, `офлайн-маршрут`, `навигация`, `оптимальный маршрут`, `пробки`, `ETA`, `перестроение маршрута`, `работает везде`, `Яндекс Карты всегда откроются`.

This is only a copy-scan foundation. It does not require component rendering or production UI text changes in Slice 1.

## Updated Test Command Plan

`app/mobile/package.json` currently has `typecheck` and no test runner. The first implementation patch may add dev-only Vitest tooling and scripts:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:map": "vitest run src/domain/map src/services"
  },
  "devDependencies": {
    "vitest": "<accepted current compatible version>"
  }
}
```

Required verification commands for the first implementation patch, from `app/mobile`:

```sh
npm run typecheck
npm run test
npm run test:map
```

If Vitest or lockfile installation cannot run in the implementation environment, the patch must report that explicitly and still keep any package changes dev-test-only. Do not substitute Expo/native test harnesses, React Native Testing Library, Playwright, provider SDKs, or native offline packages in Slice 1.

`npm run web` is not part of Slice 1 verification. It remains a later web-prototype wiring smoke command only after selectors are connected to a UI slice.

## Explicit Out Of Scope

The following remain out of scope for the first implementation patch:

- editing `app/mobile/App.tsx`;
- feature screen wiring or replacing prototype map/search behavior;
- repository commands for assign, clear, reorder, delete day card, delete place target, stale reorder rejection, reload, or persistence;
- component tests and UI copy scans against rendered screens;
- provider-backed search, map display, native offline packs, or production adapter behavior;
- adding MapLibre, provider SDKs, native/offline dependencies, Expo development-build proof code, or production provider packages;
- real API keys, public provider request URLs, tile URLs, deep links, Yandex URL construction, or provider-specific production behavior;
- whole-country Georgia offline claims or release copy saying downloaded/offline readiness without MAP-03/MAP-06/MAP-09 proof and owner threshold acceptance;
- web fallback, copy-address fallback, or copy-coordinate fallback for external handoff unless later owner/security approval allows it.

## QA Re-Review Checklist

QA can re-review MAP-05P against this checklist:

- Slice 1 is still pure domain/mock/test and small enough for focused review.
- Swapped-coordinate parser behavior now matches MAP-04R.
- `map_no_day_empty` is an explicit first-patch selector test.
- `map_day_three_coordinate_points` is an explicit first-patch selector test.
- Copy-negative foundations are required in Slice 1 without expanding into UI implementation.
- Test commands are explicit and bounded to TypeScript unit tests.
- `App.tsx`, provider/native/offline dependencies, real keys, and production provider behavior remain out of scope.

## Recommendation

Go for QA re-review of the revised Slice 1 plan.

Do not start implementation until QA records go/no-go on this MAP-05P rework.
