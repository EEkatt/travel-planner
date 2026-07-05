# REVIEW: MAP-05P Plan Rework By QA

Task ID: TASK-20260704-041
Reviewer: qa_engineer
Date: 2026-07-04
Reviewed artifact: `agent_workspace/reports/MAP-05P-DOMAIN-MOCK-IMPLEMENTATION-PLAN-REWORK-20260704.md`

## Recommendation

Accept MAP-05P for Slice 1 implementation.

The prior QA no-go blockers from MAP-05 are resolved in the reworked plan. MAP-05P corrects the swapped-coordinate parser expectation, makes both missing selector fixtures explicit, moves copy-negative foundations into Slice 1, and keeps the first implementation patch bounded to pure TypeScript domain/mock/test work.

This is not approval to expand MVP scope. Slice 1 remains no-go for `App.tsx` wiring, repository transactions, persistence, provider-backed search, native map/offline SDKs, production keys, public provider calls, component tests, route optimization, navigation, traffic, ETA, offline search/geocoding/routing, or whole-country offline readiness claims.

## Context Read

- `agent_workspace/tasks/open/TASK-20260704-041-map-05p-qa-rereview.md`
- `agent_workspace/reports/MAP-05P-DOMAIN-MOCK-IMPLEMENTATION-PLAN-REWORK-20260704.md`
- `agent_workspace/reports/MAP-05-DOMAIN-MOCK-IMPLEMENTATION-PLAN-20260704.md`
- `agent_workspace/reports/REVIEW-MAP-05-PLAN-BY-QA-20260704.md`
- `agent_workspace/reports/REVIEW-MAP-05-PLAN-BY-CODE-QUALITY-20260704.md`
- `agent_workspace/reports/MAP-02A-REQUIREMENTS-ADDENDUM-20260704.md`

## QA Blocker Closure Assessment

| Prior QA blocker | Closure assessment |
| --- | --- |
| Swapped-coordinate parser expectation conflicted with MAP-04R. | Closed. MAP-05P now says valid-range swapped-looking coordinates must not be rejected solely for looking swapped, must preserve latitude/longitude order, and must not be silently swapped. It explicitly expects `parseCoordinates({ latitude: 44.8086, longitude: 41.6886 })` to remain that same coordinate object, with geography handled by classification/save validation rather than parser guessing. |
| `map_no_day_empty` was not an explicit first-patch selector test. | Closed. MAP-05P lists `map_no_day_empty` in required selector snapshots and adds concrete assertions for mode, seed points, empty cards/pins, `plannedLine = null`, empty-state metadata, actions, and online-search conditionality. |
| `map_day_three_coordinate_points` was not an explicit first-patch selector test. | Closed. MAP-05P lists `map_day_three_coordinate_points` in required selector snapshots and adds concrete assertions for selected day, card order, red labels `1`, `2`, `3`, no no-day pin, rendered planned line, included/excluded IDs, and ordered coordinates. |
| Copy-negative foundations were deferred too late. | Closed. MAP-05P requires Slice 1 to add app-owned approved/prohibited Russian term fixtures or a pure MAP-02A fixture helper, plus foundation tests proving prohibited terms are exported, distinct from approved terms, and not treated as approved. |
| Risk of MVP expansion in the rework. | Closed. MAP-05P keeps Slice 1 pure domain/mock/test, keeps UI wiring and component scans out of scope, and explicitly blocks providers, native/offline packages, production provider behavior, deep links, keys, and release-facing offline claims. |

## Remaining Required First-Patch Test Cases

These are implementation acceptance conditions for the first patch, not blockers to starting Slice 1:

- `parseCoordinates` rejects missing fields, non-object inputs, non-number values, `NaN`, infinities, and out-of-range latitude/longitude.
- `parseCoordinates` preserves latitude/longitude order for valid-range swapped-looking examples and never silently swaps values.
- `classifyCoordinate` covers every MAP-02A coordinate fixture with no downloaded area and with `TBILISI_PROOF_AREA`, including Tbilisi inside-area fixtures, Mtskheta/Batumi outside downloaded area, and Yerevan/Trabzon outside Georgia.
- Selector snapshots include `map_empty_trip`, `map_all_mixed_points`, `map_no_day_mixed`, `map_no_day_empty`, `map_day_empty`, `map_day_three_coordinate_points`, `map_day_order_with_missing_coordinate`, and `map_reorder_day_cards` as reordered input only.
- `map_no_day_empty` asserts empty no-day output explicitly: no no-day cards, no pins, no planned line, empty metadata, add no-day action, switch-to-All action, and no offline-search promise.
- `map_day_three_coordinate_points` asserts clean selected-day route output explicitly: cards `[pt-day1-narikala, pt-day1-liberty, pt-day1-baths]`, pins `1..3`, rendered planned line, no excluded IDs, and ordered coordinates Narikala, Liberty, Baths.
- Missing-coordinate selected-day tests preserve card orders `1..4`, visible pin labels `1`, `3`, `4`, no pin `2`, `pt-day1-no-coord` as a card, excluded ID tracking, and no route-order compaction.
- Fewer-than-two selected-day coordinate cases expose `PlannedRouteLineSnapshot` with `rendered=false`, `includedPointIds`, `excludedPointIds`, and `orderedCoordinates`.
- Target-missing day-card tests show `MapCardView.kind = 'missing_target'`, no pin, no route-line coordinate, and no automatic order compaction.
- Mock adapter tests prove normalized DTO boundaries for search, offline lifecycle/proof/inventory/coverage, map display inputs, and generic handoff results, with raw provider payloads, SDK objects, URLs, API keys, private traces, and provider internals omitted.
- Copy foundation tests assert approved/prohibited Russian term fixtures are available and distinct, including the MAP-02A prohibited examples `офлайн-поиск`, `офлайн-геокодинг`, `офлайн-маршрут`, `навигация`, `оптимальный маршрут`, `пробки`, `ETA`, `перестроение маршрута`, `работает везде`, and `Яндекс Карты всегда откроются`.
- Verification commands for the first implementation patch remain `npm run typecheck`, `npm run test`, and `npm run test:map` from `app/mobile`.

## Go / No-Go For Slice 1

Go for Slice 1 implementation only.

Lead can allow the first implementation patch to start if the implementer treats MAP-05P as the controlling Slice 1 contract and includes the required tests above in the first patch. Rework is not required before implementation starts.

No-go remains for Slice 2 repository commands, Slice 3 prototype wiring, component/UI copy scans, provider-backed behavior, native/offline packages, production provider selection, and release-facing offline claims in the first patch.
