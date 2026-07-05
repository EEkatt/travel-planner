# MAP-05 Slice 1 Implementation

Date: 2026-07-05
Owner: mobile_expo_engineer
Status: Ready for code quality and QA review

## Summary

Implemented the first map feature code slice as pure TypeScript domain/mock/test work.

The slice does not wire UI, does not edit `App.tsx`, does not add provider/native/offline dependencies, does not introduce real keys, and does not claim production/offline map support.

## Changed Files

- `app/mobile/package.json`
- `app/mobile/src/domain/map/types.ts`
- `app/mobile/src/domain/map/coordinates.ts`
- `app/mobile/src/domain/map/fixtures.ts`
- `app/mobile/src/domain/map/selectors.ts`
- `app/mobile/src/domain/map/copyTerms.ts`
- `app/mobile/src/domain/map/index.ts`
- `app/mobile/src/domain/map/__tests__/mapDomain.test.ts`
- `app/mobile/src/services/mapAdapters.ts`

## Implemented

- Coordinate parser with strict range validation.
- Swapped-looking coordinate preservation: valid latitude/longitude ranges are preserved and never silently swapped.
- App-owned `classifyCoordinate` for Georgia and `TBILISI_PROOF_AREA` fixture coverage.
- MAP-02A fixture constants and seed records.
- Pure map selectors for:
  - all points;
  - no-day;
  - selected day;
  - empty trip;
  - empty no-day;
  - empty selected day;
  - missing-coordinate cards;
  - planned route-line snapshots;
  - reordered input snapshots.
- Route-line observable model:
  - `rendered`;
  - included point IDs;
  - excluded point IDs;
  - ordered coordinates;
  - test ID.
- Mock adapter contracts for:
  - map display;
  - submitted-search-only place search;
  - offline lifecycle/proof/inventory/coverage;
  - generic external handoff.
- Russian approved/prohibited map copy term foundations.
- Node/TypeScript test scripts:
  - `npm run test`;
  - `npm run test:map`.

## Verification

Run from `app/mobile`:

```text
npm run typecheck
```

Result: passed.

```text
npm run test
```

Result: passed. Covered 15 domain/mock/copy cases.

```text
npm run test:map
```

Result: passed. Covered the same MAP Slice 1 cases.

The test scripts compile TypeScript test files into `node_modules/.cache/mobile-map-tests` and execute the compiled JS with Node. No new dependencies were added.

## Limitations / Non-Goals

- No `App.tsx` wiring.
- No UI/component tests.
- No repository transactions or persistence.
- No provider-backed search.
- No MapLibre/native/offline SDK.
- No public Nominatim/OSM production behavior.
- No real API keys.
- No production provider selection.
- No whole-country Georgia offline proof.
- No offline search/geocoding/routing/navigation.
- No route optimization, traffic, ETA, or live rerouting.

## Review Request

Ready for:

- `code_quality_reviewer`;
- `qa_engineer`;
- lead review.
