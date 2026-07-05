# MAP-05 Slice 1 Rework

Date: 2026-07-05
Status: Ready for re-review

## Reason

Code Quality and QA requested focused rework before accepting MAP-05 Slice 1.

## Rework Completed

- Added visible `missing_target` card support for orphan `DayItem` records whose target place is missing.
- Extended `MapCardView.reason` with `missing_place`.
- Added exact classifier assertion that outside-Georgia coordinates remain outside Georgia even when `TBILISI_PROOF_AREA` is supplied.
- Expanded selector assertions for:
  - `map_no_day_empty` mode/actions/search conditionality;
  - `map_day_three_coordinate_points` exact mode, no no-day pins, and ordered coordinates;
  - `map_day_order_with_missing_coordinate` included IDs and ordered coordinates;
  - fewer-than-two route-line observability;
  - orphan day item missing target card.
- Expanded mock adapter helpers/tests for:
  - empty search;
  - offline search;
  - failure search;
  - query preservation;
  - no partial saved point;
  - offline coverage DTO;
  - generic external handoff opened/unsupported/failed results.
- Expanded approved Russian copy term fixtures with MAP-02A-approved categories.
- Updated tests to use a TypeScript assertion function for correct union narrowing.

## App.tsx Attribution

`app/mobile/App.tsx` remains modified in the worktree from the earlier prototype map work. It was not edited as part of MAP-05 Slice 1 or this rework and is not part of this Slice 1 acceptance bundle.

## Verification

Run from `app/mobile`:

```text
npm run typecheck
```

Result: passed.

```text
npm run test
```

Result: passed. 16 tests.

```text
npm run test:map
```

Result: passed. 16 tests.

## Still Out Of Scope

- `App.tsx` wiring.
- UI/component tests.
- repository transactions/persistence.
- provider-backed search.
- native/offline map SDKs.
- real keys.
- production provider URLs.
- whole-country Georgia offline claims.
- offline search/geocoding/routing/navigation.
