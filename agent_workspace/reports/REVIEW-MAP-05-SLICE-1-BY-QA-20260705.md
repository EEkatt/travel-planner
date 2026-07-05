# REVIEW: MAP-05 Slice 1 By QA

Task ID: TASK-20260705-044
Reviewer: qa_engineer
Date: 2026-07-05
Reviewed artifact: `agent_workspace/reports/MAP-05-SLICE-1-IMPLEMENTATION-20260704.md`

## Recommendation

Rework before QA acceptance.

MAP-05 Slice 1 is correctly bounded as pure TypeScript domain/mock/test work and the declared verification commands pass. The parser, classifier, selectors, route-line snapshots, and copy-term exports are present. However, MAP-05P made several Slice 1 tests and mock-boundary assertions mandatory, and the current test coverage is incomplete for those conditions. This is not a reject: the implementation shape is close, but QA should not accept it until the missing MAP-05P acceptance evidence is added.

## Context Read

- `agent_workspace/tasks/open/TASK-20260705-044-map-05-slice-1-qa-review.md`
- `agent_workspace/reports/MAP-05-SLICE-1-IMPLEMENTATION-20260704.md`
- `agent_workspace/reports/MAP-05P-DOMAIN-MOCK-IMPLEMENTATION-PLAN-REWORK-20260704.md`
- `agent_workspace/reports/REVIEW-MAP-05P-BY-QA-20260704.md`
- `agent_workspace/reports/MAP-02A-REQUIREMENTS-ADDENDUM-20260704.md`
- `app/mobile/src/domain/map/`
- `app/mobile/src/services/`
- `app/mobile/package.json`

## QA Acceptance Assessment

| Area | Assessment |
| --- | --- |
| Slice scope | Pass. The reviewed Slice 1 files are under `app/mobile/src/domain/map`, `app/mobile/src/services/mapAdapters.ts`, and `app/mobile/package.json`. No provider SDK, native offline package, key, public provider call, or production provider behavior was added in the reviewed Slice 1 code. |
| Parser | Pass with minor coverage gap. `parseCoordinates` rejects non-object, missing/non-number, NaN, infinity, and out-of-range values. It preserves valid-range swapped-looking input and does not silently swap latitude/longitude. |
| Classifier | Implementation pass; test coverage partial. MAP-02A Georgia/outside-Georgia fixtures are covered without downloaded area. Tbilisi and inside-Georgia/outside-downloaded fixtures are covered with `TBILISI_PROOF_AREA`, but outside-Georgia fixtures are not explicitly asserted with `TBILISI_PROOF_AREA` even though MAP-05P requires them to remain `outside_georgia`. |
| Required selector snapshots | Mostly implemented, partially asserted. Tests cover `map_empty_trip`, `map_all_mixed_points`, `map_no_day_mixed`, `map_no_day_empty`, `map_day_empty`, `map_day_three_coordinate_points`, `map_day_order_with_missing_coordinate`, `map_reorder_day_cards`, and fewer-than-two route points. Several MAP-05P-required exact assertions are missing from tests. |
| Route-line observability | Implementation present. `PlannedRouteLineSnapshot` exposes `rendered`, included/excluded point IDs, ordered coordinates, and test ID. Tests do not assert all required ordered-coordinate snapshots. |
| Missing-target cards | Pass. No-coordinate day cards can be represented as `MapCardView.kind = 'missing_target'`, remain visible, create no pin, and are excluded from planned-line coordinates. |
| Mock adapter boundaries | Rework required. Types and a few helpers exist, but tests do not cover required failed/empty/offline search states, no partial saved point behavior, offline coverage separation, or generic external handoff opened/unsupported/failed results. |
| Copy foundations | Rework required. Prohibited MAP-02A terms are exported and tested. Approved terms are exported and distinct, but the approved fixture does not include the MAP-02A approved terms expected by MAP-05P for online-search-unavailable-offline, external handoff, saved-data availability, outside Georgia, outside downloaded area, planned line, and offline map viewing. |
| MVP expansion / claims | Pass for reviewed Slice 1 files. No provider/native/offline implementation, route optimization, navigation, traffic, ETA, offline search/geocoding/routing, whole-country offline proof, or guaranteed external handoff was added. |

## Tests And Command Evidence Reviewed

Implementation report evidence reviewed:

- `npm run typecheck`: reported passed.
- `npm run test`: reported passed, 15 domain/mock/copy cases.
- `npm run test:map`: reported passed, same cases.

Commands executed from `app/mobile` during QA:

```text
npm run typecheck
```

Result: passed.

```text
npm run test
```

First attempt was blocked by the read-only sandbox because the script writes compiled JS into `node_modules/.cache/mobile-map-tests`. Rerun with approval passed all 15 tests.

```text
npm run test:map
```

Rerun with approval passed all 15 tests.

## Coverage Gaps

- `classifyCoordinate(..., TBILISI_PROOF_AREA)` does not explicitly test `OUTSIDE_GE_YEREVAN_CASCADE` and `OUTSIDE_GE_TRABZON_CENTER` remain `insideGeorgia=false`, `insideDownloadedArea=false`, `reason=outside_georgia`.
- `map_no_day_empty` test does not assert the exact mode, seed point IDs, expected actions, or online-search conditionality required by MAP-05P.
- `map_day_three_coordinate_points` test does not assert selected day mode, absence of no-day pins, or the exact ordered coordinates.
- `map_day_order_with_missing_coordinate` test does not assert exact included point IDs and ordered coordinates.
- Fewer-than-two route-point test does not assert `excludedPointIds`, `orderedCoordinates`, and test ID remain observable when `rendered=false`.
- Mock adapter tests do not cover failed, empty, and offline search responses preserving query state and creating no partial saved point.
- Mock adapter tests do not cover offline lifecycle, proof, inventory, and coverage as separate boundaries.
- Mock adapter tests do not cover generic external handoff results: `opened`, `unsupported`, and `failed`, or non-mutation of saved data.
- Copy foundation tests do not prove the MAP-02A approved Russian terms are exported, only that the currently exported approved/prohibited arrays are distinct.

## Required Fixes

1. Add the missing MAP-05P assertions to `app/mobile/src/domain/map/__tests__/mapDomain.test.ts` for classifier downloaded-area outside-Georgia cases, explicit selector fixture details, route-line ordered coordinates, and non-rendered route-line observability.
2. Expand mock adapter contracts/helpers and tests so failed/empty/offline search, offline coverage separation, and external handoff opened/unsupported/failed outcomes are proven at the DTO boundary with no raw provider payloads, URLs, keys, SDK objects, private traces, or provider internals.
3. Replace or expand `APPROVED_RUSSIAN_MAP_TERMS` so the fixture includes the MAP-02A approved terms required by MAP-05P, including examples for planned selected-day line, offline map viewing, saved-data availability, online-search-unavailable-offline, outside Georgia, outside downloaded area, and external handoff.

## QA Decision

MAP-05 Slice 1 should not be accepted yet. Lead can send it back for focused rework on tests/mock-boundary/copy-foundation evidence without changing the pure TypeScript scope or expanding into UI, provider, native, offline, repository, or persistence work.
