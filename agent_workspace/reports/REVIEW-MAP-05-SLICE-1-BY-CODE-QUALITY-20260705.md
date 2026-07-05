# REVIEW: MAP-05 Slice 1 By Code Quality

Task ID: TASK-20260705-043
Reviewer: code_quality_reviewer
Date: 2026-07-05
Reviewed scope:

- `agent_workspace/reports/MAP-05-SLICE-1-IMPLEMENTATION-20260704.md`
- `agent_workspace/reports/MAP-LEAD-DECISION-GO-MAP-05-SLICE-1-20260704.md`
- `agent_workspace/reports/MAP-05P-DOMAIN-MOCK-IMPLEMENTATION-PLAN-REWORK-20260704.md`
- `agent_workspace/reports/REVIEW-MAP-05-PLAN-BY-CODE-QUALITY-20260704.md`
- `agent_workspace/reports/REVIEW-MAP-05P-BY-QA-20260704.md`
- `app/mobile/src/domain/map/`
- `app/mobile/src/services/`
- `app/mobile/package.json`

## Recommendation

Rework.

Slice 1 is correctly scoped as pure TypeScript domain/mock/test work in the new `src/domain/map` and `src/services` files, and the declared verification commands pass. However, it misses one MAP-05P acceptance condition that matters for data integrity: a day item whose target place is missing cannot produce a visible `missing_target` card. The current worktree also has `App.tsx` modifications outside the Slice 1 report, so the Slice 1 deliverable should be isolated or explicitly attributed before lead acceptance.

## Findings

### High: Missing day-item targets are dropped from cards

`buildMapViewSnapshot` derives `cards` only from `relevantPlaces`, and `relevantPlaces` is derived only from existing `Place` records. A `DayItem` that references a missing `placeId` is included in `plannedLine.excludedPointIds`, but it cannot appear as a visible `MapCardView.kind = 'missing_target'` card.

References:

- `app/mobile/src/domain/map/selectors.ts:87` excludes missing place targets from the planned line.
- `app/mobile/src/domain/map/selectors.ts:155` builds relevant rows from `tripPlaces` only.
- `app/mobile/src/domain/map/selectors.ts:166` maps only those places into cards.
- `app/mobile/src/domain/map/types.ts:75` defines `missing_target`, but `reason` only supports `missing_coordinates`.
- `app/mobile/src/domain/map/__tests__/mapDomain.test.ts:264` tests missing coordinates, not a missing day-item target.

Impact:

- Violates the MAP-05P requirement that target-missing day cards remain visible as `MapCardView.kind = 'missing_target'`.
- Later UI wiring would silently hide stale/broken day-plan rows even though the route-line debug snapshot knows they were excluded.
- Empty selected-day state can be misleading if the day contains only orphan day items.

Required fix:

- Add a selector path and fixture/test for an orphan `DayItem` whose `placeId` is absent from `places`.
- Preserve its `routeOrder`, expose it as a `missing_target` card, create no pin, create no route coordinate, and do not compact route orders.
- Extend the `MapCardView` reason union if needed, for example with `missing_place` or equivalent app-owned terminology.

### Medium: Current worktree cannot prove `App.tsx` is untouched by the Slice 1 deliverable

The Slice 1 implementation report does not list `app/mobile/App.tsx`, and the new domain/mock files do not import or depend on it. But the current worktree has a large `App.tsx` diff, including public provider URLs:

- `app/mobile/App.tsx:333` Nominatim search URL.
- `app/mobile/App.tsx:647` Leaflet CSS URL.
- `app/mobile/App.tsx:669` Leaflet JS URL.
- `app/mobile/App.tsx:675` OpenStreetMap tile URL.

Impact:

- These URLs are outside the reviewed Slice 1 `src/domain/map` and `src/services` implementation.
- Lead cannot treat the current working tree as a clean Slice 1-only patch unless `App.tsx` is confirmed as unrelated/pre-existing or removed from the Slice 1 review bundle.

Required fix:

- Keep `App.tsx` out of the Slice 1 deliverable, or document/prove that the existing `App.tsx` diff belongs to another approved task.
- Do not merge/accept MAP-05 Slice 1 together with those `App.tsx` changes under the Slice 1 approval.

### Medium: Mock adapter tests do not cover all MAP-05P boundary cases

`mapAdapters.ts` defines normalized result and handoff/coverage types, but the tests only exercise request creation, one success-shaped search response, display input, and inventory. MAP-05P explicitly asked for failed/empty/offline search query preservation, no partial saved point, offline lifecycle/proof/inventory/coverage separation, and generic external handoff results.

References:

- `app/mobile/src/services/mapAdapters.ts:23` defines offline/empty/failure search variants.
- `app/mobile/src/services/mapAdapters.ts:44` defines coverage separately.
- `app/mobile/src/services/mapAdapters.ts:53` defines handoff results.
- `app/mobile/src/domain/map/__tests__/mapDomain.test.ts:321` covers only a thin adapter boundary path.

Impact:

- The current contracts are mostly type-level for these cases, with limited executable proof.
- This is smaller than the MAP-05P first-patch acceptance checklist and leaves later adapter wiring easier to regress.

Required fix:

- Add pure tests for offline, empty, and failure search responses preserving the submitted query and returning no results.
- Add pure tests for offline coverage DTOs and generic handoff result shapes.
- Keep these as mock/domain tests only; do not add provider calls, URLs, SDK objects, keys, or native/offline dependencies.

## Scope Compliance Check

- `app/mobile/src/domain/map/`: in scope; pure TypeScript only.
- `app/mobile/src/services/mapAdapters.ts`: in scope; pure TypeScript only.
- `app/mobile/package.json`: in scope; added `test` and `test:map` scripts only, no production dependencies or dev dependencies.
- `app/mobile/package-lock.json`: no reviewed Slice 1 dependency change observed.
- Scoped search of `app/mobile/src/domain/map`, `app/mobile/src/services`, and `app/mobile/package.json` found no provider URLs, real keys, tile URLs, network calls, native map SDK imports, or offline SDK dependencies.
- `App.tsx`: current worktree is modified, but it is outside the Slice 1 report. Treat as an attribution/isolation blocker for Slice 1 acceptance, not as a finding against the new domain/mock modules themselves.

## Testability Notes

Passed verification:

- `npm run typecheck` passed.
- `npm run test` passed after allowing writes to `app/mobile/node_modules/.cache/mobile-map-tests`.
- `npm run test:map` passed after allowing writes to `app/mobile/node_modules/.cache/mobile-map-tests`.

Positive coverage:

- Invalid coordinate parsing and valid-range swapped-looking coordinate preservation.
- MAP-02A coordinate classification with and without `TBILISI_PROOF_AREA`.
- Main selector modes for all/no-day/day, including missing-coordinate route gaps and fewer-than-two route points.
- Copy term foundation with distinct approved/prohibited Russian terms.

Gaps:

- No executable orphan day-item / missing target card test.
- Clean three-coordinate route test does not assert the exact `orderedCoordinates` values required by MAP-05P.
- No executable search offline/empty/failure response tests.
- No executable external handoff result tests.

## Required Fixes

1. Implement and test visible `missing_target` cards for day items whose target place record is missing.
2. Expand mock adapter boundary tests for offline/empty/failure search, offline coverage, and external handoff result shapes.
3. Isolate or explicitly attribute the current `App.tsx` changes before lead accepts Slice 1 as scoped.

After those fixes, the slice should be eligible for code-quality acceptance without adding providers, native/offline dependencies, keys, URLs, UI wiring, persistence, or repository commands.
