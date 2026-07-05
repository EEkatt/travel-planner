# REVIEW: MAP-05 Slice 1 Rework By Code Quality

Task ID: TASK-20260705-045
Reviewer: code_quality_reviewer
Date: 2026-07-05

## Recommendation

Accept MAP-05 Slice 1 for code quality.

The focused rework closes the prior code-quality blockers in the reviewed Slice 1 scope: `app/mobile/src/domain/map/`, `app/mobile/src/services/`, and `app/mobile/package.json`. Lead can accept this slice as pure domain/mock/test work, provided `app/mobile/App.tsx` remains explicitly outside the Slice 1 acceptance bundle as documented in the rework report.

## Closure Assessment

Prior finding 1, orphan day-item targets are dropped from cards: closed.

- `selectors.ts` now creates a `missing_target` card for selected-day `DayItem` records whose `placeId` is absent from the trip places, preserving `pointId`, `dayId`, and `routeOrder` with `reason: missing_place`.
- Missing or coordinate-less targets remain excluded from pins and route coordinates while staying observable in `plannedLine.excludedPointIds`.
- The test `orphan day item remains visible as a missing target card` asserts visible card order, `missing_place`, no orphan pin, and route-line exclusion.

Prior finding 2, mock adapter tests do not cover MAP-05P boundary cases: closed.

- `mapAdapters.ts` exposes app-owned DTO helpers for empty, offline, and failed search responses; offline inventory and coverage; map display input; and external handoff results.
- Tests assert empty/offline/failure search responses preserve query state, return no partial results, create no saved point, and expose no raw provider payload.
- Tests assert offline lifecycle/proof/inventory/coverage are separate boundaries and external handoff results cover `opened`, `unsupported`, and `failed`.

Prior finding 3, `App.tsx` attribution/isolation: closed for this review decision.

- The rework report explicitly states `app/mobile/App.tsx` is pre-existing prototype map work and is not part of MAP-05 Slice 1 or this rework.
- I did not count `App.tsx` toward Slice 1 acceptance. It remains a current-worktree scope caveat for lead/release hygiene, not a blocker against the reviewed domain/mock slice.

## Additional Rework Evidence

- The classifier test now asserts outside-Georgia fixtures remain `outside_georgia` even when `TBILISI_PROOF_AREA` is supplied.
- Selector tests now include exact assertions for no-day empty actions/search conditionality, selected-day mode, no no-day pins, ordered coordinates, missing-coordinate route gaps, and non-rendered route-line observability.
- Copy fixture tests now include MAP-02A-approved Russian map terms and keep approved/prohibited term sets distinct.

## Remaining Blockers

None for MAP-05 Slice 1 code quality.

## Scope Compliance Check

- `app/mobile/src/domain/map/`: pass. Pure TypeScript domain fixtures, parsing/classification, selectors, copy terms, and tests.
- `app/mobile/src/services/mapAdapters.ts`: pass. Mock/app-owned DTO boundary only; no provider implementation.
- `app/mobile/package.json`: pass. Test scripts only; no provider/native/offline dependency added.
- Provider/native/offline/key scan: pass for reviewed Slice 1 files. No provider URLs, real keys, network calls, tile URLs, native map SDK imports, offline SDK dependency, or production provider behavior found in the accepted scope.
- `app/mobile/App.tsx`: excluded. It is modified in the worktree and contains prototype provider/web-map behavior, but it is documented as pre-existing and not accepted under Slice 1.

## Verification

Commands run from `app/mobile`:

```text
npm run typecheck
```

Result: passed.

```text
npm run test
```

Result: passed, 16 tests.

```text
npm run test:map
```

Result: passed, 16 tests.
