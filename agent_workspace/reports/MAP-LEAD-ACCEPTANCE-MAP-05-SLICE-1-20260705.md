# Map Lead Acceptance: MAP-05 Slice 1

Date: 2026-07-05
Lead: lead
Status: Accepted

## Decision

Accept MAP-05 Slice 1 after focused rework.

The accepted scope is pure TypeScript domain/mock/test work under:

- `app/mobile/src/domain/map/`
- `app/mobile/src/services/`
- `app/mobile/package.json`

`app/mobile/App.tsx` is explicitly excluded from this acceptance because it contains pre-existing prototype map work and was not changed for MAP-05 Slice 1.

## Accepted Capabilities

- Coordinate parsing and validation.
- Swapped-looking coordinate preservation.
- Georgia and `TBILISI_PROOF_AREA` classification fixtures.
- Map selector snapshots for all/no-day/day modes.
- Empty trip, empty no-day, and empty selected-day states.
- Missing-coordinate and missing-place card representation.
- Planned route-line observable snapshots.
- Reordered input snapshot behavior.
- Mock adapter DTO boundaries for map display, search, offline lifecycle/proof/inventory/coverage, and external handoff.
- Russian approved/prohibited copy term foundations.

## Verification

From `app/mobile`:

- `npm run typecheck` passed.
- `npm run test` passed, 16 tests.
- `npm run test:map` passed, 16 tests.

## Reviews

- Code Quality: accepted in `agent_workspace/reports/REVIEW-MAP-05-SLICE-1-REWORK-BY-CODE-QUALITY-20260705.md`.
- QA: accepted in `agent_workspace/reports/REVIEW-MAP-05-SLICE-1-REWORK-BY-QA-20260705.md`.

## Still Blocked / Not Accepted

- UI wiring in `App.tsx`.
- Repository transactions and persistence.
- Component/UI tests.
- Provider-backed search.
- Autocomplete.
- Native map/offline SDKs.
- Real provider keys.
- Public Nominatim/OSM production behavior.
- Whole-country Georgia offline proof.
- Offline search/geocoding/routing/navigation.
- Route optimization, traffic, ETA, or live rerouting.

## Recommended Next Step

Start the next slice only after owner/lead chooses scope:

1. MAP-05 Slice 2: repository/domain commands for assign/clear/reorder/delete/reload using the accepted domain model.
2. MAP-05 Slice 3: wire the current web prototype to the mock domain selectors without claiming provider/native/offline proof.
3. MAP-06 planning: native/offline spike preparation, still blocked from execution by provider/owner/security gates.
