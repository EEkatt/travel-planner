# REVIEW: MAP-05 Plan By QA

Task ID: TASK-20260704-039
Reviewer: qa_engineer
Date: 2026-07-04
Reviewed artifact: `agent_workspace/reports/MAP-05-DOMAIN-MOCK-IMPLEMENTATION-PLAN-20260704.md`

## Recommendation

Rework MAP-05 before the first implementation patch starts.

The plan is directionally correct and keeps the MVP boundary: pure TypeScript domain, MAP-02A fixtures, selectors, and mock contracts before provider-backed or UI wiring work. However, it is not QA-ready as written because several first-patch test obligations are incomplete or ambiguous, and one coordinate-parser test expectation conflicts with MAP-04R.

Go/no-go for implementation: No-go as written. Go after MAP-05 is amended with the required first-patch test cases below. This should be a bounded plan/test rework, not a scope expansion.

## Context Read

- `agent_workspace/tasks/open/TASK-20260704-039-map-05-plan-qa-review.md`
- `agent_workspace/reports/MAP-05-DOMAIN-MOCK-IMPLEMENTATION-PLAN-20260704.md`
- `agent_workspace/reports/MAP-02A-REQUIREMENTS-ADDENDUM-20260704.md`
- `agent_workspace/reports/REVIEW-MAP-02A-BY-QUALITY-20260704.md`
- `agent_workspace/reports/MAP-04R-ARCHITECTURE-REWORK-20260704.md`
- `app/mobile/package.json`
- `app/mobile/App.tsx`
- `app/mobile/app.json`
- `app/mobile/tsconfig.json`
- `app/mobile/index.ts`
- `app/mobile/AGENTS.md`
- `app/mobile/CLAUDE.md`
- `testing/07_test_policy.md`

## Fixture And Test Coverage Assessment

MAP-02A fixture inclusion: mostly sufficient. MAP-05 includes coordinate constants, `TBILISI_PROOF_AREA`, shared days, seed places/day items, provider mock states, and fixture builders. This is enough to build deterministic selector and classifier tests if the implementation keeps the exact MAP-02A IDs, coordinates, day IDs, source values, and expected classifications.

Selector coverage: needs rework. MAP-05 covers `All`, `No day`, selected-day missing-coordinate, target-missing, reorder-as-input, empty trip, empty day, and fewer-than-two route-line snapshots. It should also require explicit first-patch tests for `map_no_day_empty` and `map_day_three_coordinate_points` so the no-day empty state and the clean all-coordinate selected-day baseline are not inferred only from adjacent cases.

Coordinate coverage: mostly sufficient, with one correction required. Tests must assert all MAP-02A coordinate fixtures with and without `TBILISI_PROOF_AREA`, including inside Georgia/outside downloaded area and outside Georgia. The parser test must not reject valid-range swapped coordinates solely because they look swapped; MAP-04R says valid-range swapped examples classify normally and must not be silently swapped. The test should prove the parser preserves latitude/longitude order, then classification blocks coordinate-backed save if outside Georgia.

Missing-coordinate behavior: sufficient in direction. The first patch must preserve visible day cards with `coordinates = null`, pin-number gaps, route-line exclusion, and `excludedPointIds`.

Route-order commands: not first-patch ready. MAP-05 defers in-memory repository commands to Slice 2, which is acceptable only if the first patch does not claim command-level readiness. The first patch can test pure reordered input snapshots, but assign, clear, reorder command validation, stale reorder rejection, delete day card, delete place target, and reload behavior remain no-go until Slice 2.

Outside-area classification: sufficient for first patch if the classifier is clearly documented as fixture-only/non-production and tests cover both `GE_MTSKHETA_CATHEDRAL` and `GE_BATUMI_BOULEVARD` as inside Georgia but outside `TBILISI_PROOF_AREA`.

Copy-negative foundations: insufficient. MAP-05 defers copy scans to component tests, but the first patch should at least add app-owned approved/prohibited Russian term fixtures or a small test helper so later UI copy scans cannot drift from MAP-02A.

## QA Risks Before Implementation

1. Coordinate validation regression risk: rejecting valid-range swapped inputs in `parseCoordinates` would contradict MAP-04R and hide the required "do not silently swap" behavior.
2. Selector confidence risk: without `map_no_day_empty` and `map_day_three_coordinate_points`, QA cannot distinguish empty-filter behavior from mixed-filter behavior or verify the clean selected-day route baseline.
3. Route-order command risk: first patch tests do not cover mutating command semantics. This is acceptable only if Slice 1 stays pure and does not expose assign/clear/reorder/delete behavior.
4. Copy drift risk: without first-patch copy term fixtures, later Russian UI tests may implement a different denylist than MAP-02A.
5. Dependency-change risk: adding Vitest changes the mobile package. Per test policy, the patch needs `npm run typecheck`, `npm run test`, and `npm run test:map`; package-lock changes should be reviewed as dev-test tooling only.

## Required Test Cases For First Patch

- `parseCoordinates` rejects missing fields, non-object inputs, non-number values, `NaN`, infinities, and out-of-range latitude/longitude.
- `parseCoordinates` preserves latitude/longitude order for valid-range swapped-looking examples; classification/save validation, not parsing, handles outside-Georgia blocking.
- `classifyCoordinate` asserts every MAP-02A coordinate fixture with no downloaded area and with `TBILISI_PROOF_AREA`.
- `map_empty_trip`, `map_all_mixed_points`, `map_no_day_mixed`, `map_no_day_empty`, `map_day_empty`, `map_day_three_coordinate_points`, and `map_day_order_with_missing_coordinate` selector snapshots.
- Selected-day fewer-than-two coordinate cases expose `PlannedRouteLineSnapshot` with `rendered=false`, `includedPointIds`, `excludedPointIds`, and `orderedCoordinates`.
- `map_reorder_day_cards` as a pure reordered input snapshot only, with explicit note that command validation is Slice 2.
- Target-missing day-card snapshot remains visible as `kind = 'missing_target'`, creates no pin or route-line point, and does not compact order.
- Mock search, offline pack, map display, and handoff adapters return normalized DTOs only and omit raw provider payloads, SDK objects, URLs, keys, private traces, and provider inventory internals.
- Copy-negative foundation test or fixture asserts MAP-02A prohibited Russian terms are available to later UI scans and are not confused with approved terms.

## Go / No-Go

First implementation patch: No-go as written.

Go after MAP-05 is amended to include the test cases above and to correct the swapped-coordinate parser expectation. The first patch should remain pure domain/mock work and should not wire `App.tsx`, add production providers, add native/offline packages, claim whole-country offline readiness, or implement route-order repository commands unless the Slice 2 command tests are included in the same patch.
