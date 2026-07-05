# REVIEW: MAP-04 Architecture By Code Quality

Task ID: TASK-20260704-033
Reviewer: code_quality_reviewer
Date: 2026-07-04
Reviewed artifact: `agent_workspace/reports/MAP-04-ARCHITECTURE-FRAMING-20260704.md`

## Recommendation

Rework before MAP-05 implementation planning.

MAP-04 is directionally sound: it keeps provider payloads behind adapters, treats the current `app/mobile/App.tsx` as prototype-only, separates map display/search/offline pack concerns, and preserves card order as the intended route-order source of truth. It is not yet implementation-planning ready because several TypeScript/data seams are too loose to test safely and could let route order, coordinate validity, provider metadata, and offline coverage state drift during implementation.

This is not a rejection of the architecture direction. The rework should be narrow: tighten the canonical domain contracts and test hooks before engineers start building MAP-05 slices.

## Context Read

- `agent_workspace/tasks/open/TASK-20260704-033-map-04-code-quality-review.md`
- `agent_workspace/reports/MAP-04-ARCHITECTURE-FRAMING-20260704.md`
- `agent_workspace/reports/MAP-02A-REQUIREMENTS-ADDENDUM-20260704.md`
- `app/mobile/`
- `architecture/11_architecture.md`
- `testing/04_code_quality_requirements.md`
- `testing/05_project_structure_quality.md`
- `testing/07_test_policy.md`

## Blocking Issues

1. Geography classification seam does not satisfy MAP-02A.

MAP-02A requires one app-owned `classifyCoordinate(latitude, longitude, downloadedArea?)` seam returning `insideGeorgia`, `insideDownloadedArea`, and a reason code. MAP-04 describes geography ownership and adds `OfflinePackService.classifyCoordinates`, but that service only returns `inside_downloaded_area | outside_downloaded_area | unknown` and does not return Georgia classification or a reason code. This split makes outside-Georgia and outside-downloaded-area easy to confuse, especially offline.

Required rework: define a single pure domain result, for example `CoordinateClassification = { insideGeorgia: boolean; insideDownloadedArea: boolean | null; reason: ...; coordinateId?: fixture id }`, and make offline pack/service code consume it rather than owning a competing coordinate classifier.

2. Route-order ownership conflicts with the wider architecture.

MAP-04 puts `dayId` and `routeOrder` directly on `MapPoint`, and its repository flow writes route order through `MapPointRepository`. The base architecture already has `Place` and ordered `DayItem`/`DayPlanRepository` as the trip-day ordering model. Without an explicit decision, implementation can create two order sources: map points ordered one way and day cards/day plan items ordered another.

Required rework: state whether MAP-04 replaces, extends, or maps onto the existing `Place`/`DayItem` model. Define one authoritative write path for assign-day, clear-day, reorder, target deletion, and reload behavior. The route line, cards, and pin labels must derive from the same persisted order.

3. Route-line test model is under-specified.

MAP-02A requires route-line observability with selected `dayId`, included point IDs, excluded no-coordinate point IDs, ordered coordinates, and `planned_order` type. MAP-04's `RouteLine` only has `mode`, `pointIds`, and `coordinates`, and later moves exact test IDs/observability to a non-blocking automation decision. That is too vague for the route-order and missing-coordinate cases.

Required rework: promote route-line observability into the canonical render model before implementation planning. Include `dayId`, `includedPointIds`, `excludedPointIds`, and stable test IDs or a typed debug/test snapshot from the selector.

4. Offline pack status mixes lifecycle with coverage classification.

`OfflinePackStatus` includes `outside_downloaded_area`, but `outside_downloaded_area` is not a pack lifecycle state; it depends on a coordinate or camera position relative to known bounds. As written, `getStatus(tripId)` can report outside-area without a coordinate input, while `classifyCoordinates` separately reports coverage. This ambiguity is a data integrity risk for offline copy, retry controls, and saved-point behavior.

Required rework: separate pack lifecycle (`not_downloaded`, `downloading`, `downloaded`, `failed`, etc.) from coverage classification (`inside_downloaded_area`, `outside_downloaded_area`, `unknown`) and require the latter to include the coordinate/bounds source used.

5. Coordinate and provider metadata types need validation contracts.

`Coordinates` is plain `{ latitude: number; longitude: number }`, and provider fields are optional strings. The framing says normalized fields only, but does not define a parse/validation boundary for finite ranges, swapped lat/lon, country-code mismatch, precision, provider ID retention approval, or attribution persistence requirements. Code quality requirements require explicit data models and typed external-provider mapping.

Required rework: define constructors/parsers or repository command inputs that reject invalid coordinates, outside-Georgia coordinate-backed saves, malformed provider results, and unapproved provider metadata before persistence.

## Maintainability Findings

- The proposed modules are a good starting structure and match the project direction toward layered `features`, `domain`, `data`, and `services`.
- The current `app/mobile/App.tsx` is a 1429-line prototype with inline Nominatim search, iframe Leaflet HTML, local state, and simulated native map shapes. MAP-04 correctly treats it as non-proof, but MAP-05 should not extend this file; it should create the proposed `src/` modules and retire prototype map logic behind mocks.
- Failure-state ownership is useful, but typed failures need retryability and user-action flags where MAP-02A requires different retry behavior. `MapProviderFailure` and `PlaceSearchFailure.quota` currently do not consistently expose retryability.
- Undefined architecture types such as `OfflineAreaView`, `GeoBounds`, `OfflinePackInventory`, and `OfflinePackProgress` are acceptable placeholders for a framing document only if MAP-04 rework names the minimum fields needed for tests and persistence.

## Type And Data Model Concerns

- `MapPoint.countryCode: 'GE' | null` is stricter than `NormalizedPlaceSearchResult.countryCode: string | null`; the save command must explicitly narrow provider country values and reject mismatches.
- `dayId != null` requiring `routeOrder` is correct, but the model should also require uniqueness and contiguity per `tripId + dayId`, define collision handling, and specify transaction behavior for concurrent or repeated reorder commands.
- `routeOrder` should be an integer domain type, not an arbitrary `number`; negative, fractional, zero, duplicate, and sparse values need explicit handling.
- Provider metadata needs an allowlist model, not just optional fields. At minimum, include provider name/version, approved storage fields, attribution requirement, and whether `providerPlaceId` may be persisted.
- Offline inventory metadata should be app-owned and minimal, but it still needs stable IDs, bounds, scope, provider pack IDs, status timestamps, byte/storage measurements where available, and deletion/restart semantics.

## Testability Notes

- MAP-04 names the right test categories: pure selector tests, repository transaction tests, adapter contract tests, component failure-state tests, copy scans, and native/offline proof.
- The selector tests cannot be implemented robustly until route-line observability includes excluded no-coordinate points and selected day ID.
- Repository tests need exact invariants for assign/clear/reorder compaction and reload behavior across the chosen `Place`/`DayItem`/`MapPoint` storage shape.
- Geography tests need the single MAP-02A seam result, including reason codes, so tests can distinguish outside Georgia from inside Georgia but outside downloaded area.
- Offline behavior should be tested as separate pack lifecycle plus coordinate/camera coverage state; copy-only offline status is not enough under project structure rule PS-004.
- Component tests should verify saved cards/lists remain visible when map/search/offline provider failures occur, matching MAP-02A and the base architecture's local-first rule.

## Non-Blocking Recommendations

1. Prefer explicit move-up/move-down reorder controls for the first testable implementation; drag can wait until accessibility and deterministic automation are defined.
2. Add a small fixture module generated from MAP-02A IDs and coordinates instead of hand-copying literals across tests.
3. Keep autocomplete absent in the initial adapter interface unless MAP-03/MAP-09 approve provider terms, quota, key model, and attribution.
4. Treat Yandex handoff as a separate service result with `unsupported`, `failed`, and approved fallback actions; do not let map point cards construct URLs directly.
5. Centralize Russian copy keys before implementing failure states, because MAP-02A has explicit banned-term assertions.

## Lead Decision

MAP-04 should be reworked, not rejected. Once the five blocking issues above are resolved, the framing should be strong enough for MAP-05 implementation planning while still keeping production provider/offline acceptance blocked behind MAP-03, MAP-06, MAP-09, and owner threshold decisions.
