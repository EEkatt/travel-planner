# Gate 00 Technical Foundation Recommendations

Task ID: TASK-20260704-010
From: technical_analyst
To: lead
Status: Ready For Review
Date: 2026-07-04

## Summary

Gate 00 should accept the existing direction: React Native/Expo, local-first SQLite, provider adapters, external map handoff, and MapLibre as the first offline-map spike path.

It should not accept a production map/search provider yet. Tile/style provider terms, offline limits, API key restrictions, attribution, and pack size are still blocking facts.

Command run:

```sh
cd /Users/ekattt/Documents/PROJECT/app/mobile
npm run typecheck -- --pretty false
```

Result: passed.

## Recommendations

| Area | Recommendation | Status |
| --- | --- | --- |
| Storage | Use `expo-sqlite` with explicit SQL migrations, `PRAGMA user_version`, foreign keys, WAL, and repository interfaces. | Recommended |
| Navigation | Use React Navigation native stack + bottom tabs for `TripList -> TripWorkspace(Today/Days/Map) -> modal/detail`. | Recommended |
| Test harness | Add deterministic Jest/jest-expo path before broad app work. | Recommended |
| Map | Continue MapLibre React Native as bounded spike only. | Accepted for spike |
| Tile/style provider | Do not select production provider until terms/offline limits/pricing/key model are verified. | Blocked |
| Search/geocoding | Shortlist MapTiler first if aligned with map provider; Mapbox conditional fallback; manual fallback mandatory. | Recommended shortlist |
| Notifications | Defer reminders by default; use `expo-notifications` only if first-release scope gate includes reminders later. | Deferred |
| Expo build | Use development builds before map work; Expo Go is insufficient for MapLibre offline maps. | Required for map |

## Concrete Proof Criteria

Storage proof:

- migration initializes empty DB;
- `PRAGMA user_version` advances deterministically;
- foreign keys enabled;
- synthetic trip inserted, app restarted, trip read back;
- repository uses parameter binding;
- private travel data is not logged.

Navigation proof:

- trip list opens workspace;
- workspace has `Today`, `Days`, `Map`;
- one modal and one detail route work;
- route params are typed;
- no production feature data is hardcoded except sanitized dev fixtures.

Map proof:

- app runs in development build;
- MapLibre renders;
- `OfflineManager.createPack` downloads small bounded region;
- `OfflineManager.getPacks` works after restart;
- network-disabled map renders downloaded content;
- saved points render over downloaded map;
- pack size/download time measured;
- provider terms allow tested offline behavior.

## Open Questions

- Which representative offline map area should be measured first?
- What maximum offline map pack size is acceptable?
- Is a paid map/search provider plan acceptable before public launch?
- Is one offline area per trip enough for MVP?
- Is device-level protection enough for first private MVP?
