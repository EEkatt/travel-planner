# REVIEW: MAP-05 Slice 1 Rework By QA

Task ID: TASK-20260705-046
Reviewer: qa_engineer
Date: 2026-07-05
Reviewed artifact: `agent_workspace/reports/MAP-05-SLICE-1-REWORK-20260705.md`

## Recommendation

Accept MAP-05 Slice 1 after rework.

The prior QA gaps are closed for the Slice 1 acceptance scope. The implementation remains bounded to pure TypeScript domain, mock adapter contracts, copy fixtures, and test tooling. No provider SDK, native offline dependency, public provider URL, API key, route optimization, navigation, traffic, ETA claim, offline search/geocoding/routing implementation, repository persistence, or UI wiring was added in the reviewed Slice 1 files.

## Context Read

- `agent_workspace/tasks/open/TASK-20260705-046-map-05-slice-1-qa-rereview.md`
- `agent_workspace/reports/MAP-05-SLICE-1-REWORK-20260705.md`
- `agent_workspace/reports/REVIEW-MAP-05-SLICE-1-BY-QA-20260705.md`
- `agent_workspace/reports/MAP-05P-DOMAIN-MOCK-IMPLEMENTATION-PLAN-REWORK-20260704.md`
- `app/mobile/src/domain/map/`
- `app/mobile/src/services/`
- `app/mobile/package.json`

## Closure Assessment For Prior QA Gaps

| Prior QA gap | Re-review assessment |
| --- | --- |
| Outside-Georgia fixtures were not asserted with `TBILISI_PROOF_AREA`. | Closed. `app/mobile/src/domain/map/__tests__/mapDomain.test.ts` asserts both outside-Georgia fixtures remain `insideGeorgia=false`, `insideDownloadedArea=false`, and `reason=outside_georgia` when the Tbilisi proof area is provided. |
| `map_no_day_empty` lacked exact selector assertions. | Closed. The test now asserts no-day mode, no cards, no pins, no planned line, empty no-day state, online actions including `search_online`, and offline actions excluding online search. |
| `map_day_three_coordinate_points` lacked selected-day baseline assertions. | Closed. The test now asserts selected day mode, ordered cards, red numbered pins, no no-day pin, rendered planned line, included IDs, empty excluded IDs, and exact ordered coordinates. |
| `map_day_order_with_missing_coordinate` lacked exact included IDs and coordinates. | Closed. The test now asserts card order with the missing-coordinate card visible, pin label gap `1,3,4`, excluded ID, included IDs, and ordered coordinates without route-order compaction. |
| Fewer-than-two route-line observability was incomplete. | Closed. The test now asserts `rendered=false`, included IDs, excluded IDs, ordered coordinates, and stable `testId` for a non-rendered line snapshot. |
| Missing-target day item coverage needed to stay visible. | Closed. Orphan day items now produce `MapCardView.kind = missing_target` with `reason=missing_place`, create no pin, and remain observable in `excludedPointIds`. |
| Mock adapter failed/empty/offline search boundaries were incomplete. | Closed. Mock tests cover empty, offline, timeout, quota, and malformed failure responses; each preserves query state, returns no partial results, creates no saved point, and exposes no raw provider payload. Submitted search still forces `autocomplete: false`. |
| Offline mock boundary separation was incomplete. | Closed for Slice 1. The adapter exposes typed lifecycle/proof/inventory fields and a separate coverage DTO, with tests asserting lifecycle, proof state, null provider pack internals, and classification-backed coverage. |
| Generic external handoff outcomes were missing. | Closed. Tests cover generic `opened`, `unsupported`, and `failed` results without provider-specific deep links or saved-data mutation. |
| Copy-term foundations lacked MAP-02A approved fixtures. | Closed. `APPROVED_RUSSIAN_MAP_TERMS` now includes fixtures for planned selected-day line, offline map viewing, saved-data availability, online-search-unavailable-offline, outside Georgia, outside downloaded area, and external handoff. Prohibited fixtures remain exported and distinct. |

## Remaining Coverage Gaps

No blocking Slice 1 coverage gaps remain.

Residual out-of-scope areas remain for later slices: `App.tsx` wiring, component/UI tests, rendered UI copy scans, repository transactions/persistence, provider-backed search, native/offline SDK behavior, production provider URLs/keys, and real offline map proof.

## Command Evidence Reviewed And Executed

Reviewed implementation report evidence:

- `npm run typecheck`: reported passed.
- `npm run test`: reported passed, 16 tests.
- `npm run test:map`: reported passed, 16 tests.

Executed from `app/mobile` during QA re-review:

```text
npm run typecheck
```

Result: passed.

```text
npm run test
```

Initial sandbox attempt failed because the test script writes compiled JS into `node_modules/.cache/mobile-map-tests`. Rerun with approval passed all 16 tests.

```text
npm run test:map
```

Initial sandbox attempt failed for the same read-only cache write. Rerun with approval passed all 16 tests.

Additional scope scan:

```text
rg -n "maplibre|MapLibre|yandex|Yandex|apiKey|api_key|tileUrl|tileURL|deep link|deeplink|offline search|offline geocoding|offline routing|turn-by-turn|ETA|traffic|route optimization" app/mobile/src/domain/map app/mobile/src/services app/mobile/package.json
```

Result: no scope-expansion hits except fixture coordinate names containing `GE_MTSKHETA_CATHEDRAL` and the expected prohibited `ETA` copy fixture/test.

## QA Decision

MAP-05 Slice 1 passes QA for the reworked domain/mock/test scope. Lead can accept this slice and keep UI wiring, provider/native behavior, persistence, and production copy validation in later slices.
