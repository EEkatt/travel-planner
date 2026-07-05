# REVIEW: MAP-01 UX By QA

Task ID: TASK-20260704-022
Reviewer: qa_engineer
Date: 2026-07-04
Reviewed Artifact: `agent_workspace/reports/MAP-01-UX-20260704.md`
Recommendation: Accept for MAP-02 with required additions in MAP-02/MAP-07

## Read-Only Context Checked

- `agent_workspace/reports/MAP-01-UX-20260704.md`
- `agent_workspace/reports/MAP-00-SCOPE-20260704.md`
- `agent_workspace/reports/MAP-LEAD-ORCHESTRATION-20260704.md`
- `requirements/11_map_requirements.md`
- `requirements/06_use_cases.md`
- `requirements/08_mvp.md`
- `app/mobile/App.tsx`

## Lead Decision Summary

MAP-01 provides enough UX coverage to unblock MAP-02 detailed requirements. It preserves the Georgia MVP boundary, card-based day route ordering, gray no-day points, red day route points, selected-day numbering, and the critical distinction between a planned order line and real navigation/routing.

Do not treat MAP-01 as implementation-ready by itself. MAP-02 must turn the UX model into testable acceptance criteria with deterministic fixture names, data shapes, state transitions, and provider-failure contracts. MAP-07 must then convert those fixtures into automated coverage and manual provider/device checks.

## QA Coverage Assessment

Covered well:

- Map modes and filters: all points, no-day points, and one selected day are separated clearly.
- Day route display: selected day pins are numbered, red, and connected by a route/order line.
- Card-based ordering: MAP-01 states that route cards below the map are the editing source, and reordering updates card order, pin numbers, and route line sequence.
- No-coordinate handling: no-coordinate places stay visible in cards/lists and are excluded from pins and route lines.
- Search creation: explicit online search, provider caveats, no-results fallback, provider-failure fallback, and manual entry remain available.
- Map-tap creation: captured coordinates, title, day/no-day choice, and source are included.
- Offline framing: saved details/lists remain available; offline map viewing is separated from offline search, geocoding, routing, optimization, and turn-by-turn navigation.
- Yandex Maps fallback: point-level only, coordinates preferred, missing target disabled, handoff failure preserves address/coordinates.

Partially covered and needs MAP-02 precision:

- Empty states are listed, but expected card/list/map contents, enabled actions, and exact filter behavior need fixture-backed acceptance criteria.
- Offline states are conceptually covered, but MAP-02 needs separate assertions for offline downloaded, offline not downloaded, search offline, outside downloaded area, and map provider failure.
- Outside-area behavior is covered, but acceptance must define how outside Georgia, outside downloaded area, and valid Georgia-but-not-downloaded states differ.
- Provider failures are covered at UX level, but timeout, quota/API error, empty results, bad result without coordinates, and map tile/SDK failure need separate fixtures.
- Reorder behavior is correctly described, but MAP-02 needs persistence expectations, undo/cancel behavior if any, accessibility mechanism, and behavior when the reordered day contains no-coordinate cards.
- Copy constraints are strong, but MAP-02/MAP-07 need explicit negative assertions that UI text does not claim navigation, routing, optimization, traffic, travel time, offline geocoding, or offline search.

## Required State Check

| Required state | MAP-01 status | QA note |
| --- | --- | --- |
| Empty | Covered | Split into empty trip, empty no-day filter, and empty day route fixtures. |
| Offline | Covered | Needs fixture separation for downloaded map, no downloaded map, and search attempted offline. |
| No results | Covered | Require query preservation, refine action, and manual add path. |
| Provider failure | Covered | Split search timeout/quota/API failure from map provider failure. |
| Map failure | Covered | Must assert cards/lists remain visible and become source of truth. |
| Outside area | Covered | Needs decision-backed rules for outside Georgia versus outside downloaded pack. |
| No-coordinate | Covered | Must test visible cards/list retention across all filters and day assignment. |
| Yandex handoff failure | Covered | Needs fixture for app unavailable/deep-link failure and address/coordinates still readable. |

## Missing Acceptance Criteria And Fixtures

MAP-02 should add these as named acceptance cases:

1. `map_all_mixed_points`: coordinate-backed no-day, Day 1, Day 2, and no-coordinate points. Assert all coordinate-backed points render, no route line appears, no-coordinate cards remain visible, and no-day pins are gray.
2. `map_no_day_empty`: no no-day points. Assert empty state, add no-day place action, search online action when online, and switch-to-all fallback.
3. `map_day_empty`: selected day has no places. Assert empty map/list state, add-to-this-day action, and open day plan fallback.
4. `map_day_order_with_missing_coordinate`: selected day contains at least three coordinate-backed points and one no-coordinate point. Assert card order is canonical, pin numbers skip only non-rendered no-coordinate items or follow the product-approved numbering rule, and the route line uses only coordinate-backed points in card order.
5. `map_reorder_day_cards`: move a middle card to first. Assert card order, pin numbers, route line sequence, selected filter, and persisted route order all update from the same ordered list.
6. `map_assign_clear_day`: assign a no-day point to a day, then clear it. Assert color/category, filter membership, route inclusion, and order append/removal behavior.
7. `map_search_no_results`: provider returns empty list. Assert query remains visible, no-results copy appears, refine search and add manually are available.
8. `map_search_provider_failure`: timeout/quota/API error. Assert retry is available, manual add is available, and no partial result is saved.
9. `map_search_offline`: no network before search. Assert search is disabled or returns offline state and manual text save remains available.
10. `map_tap_outside_georgia`: tap/search result outside MVP country. Assert warning, no misleading pin is silently created, and manual note-only save follows product policy.
11. `map_tap_outside_downloaded_area_offline`: offline tap/pan outside downloaded pack. Assert boundary warning, return-to-area action, and saved details remain usable.
12. `map_provider_failure`: tile/SDK failure. Assert map unavailable state, retry map action, and cards/lists remain visible.
13. `map_offline_downloaded`: network unavailable with downloaded Georgia area. Assert saved points and selected-day planned line render, online actions are unavailable, and copy does not imply routing/navigation.
14. `map_offline_not_downloaded`: network unavailable without pack. Assert missing offline map state, retry/download only when online, and saved lists/details remain readable.
15. `yandex_missing_target`: point has neither address nor coordinates. Assert external maps action is disabled with add-location/address guidance.
16. `yandex_handoff_failure`: coordinates/address exist but Yandex Maps cannot open. Assert concise failure, retry/open-web only if approved, and address/coordinates remain readable.
17. `copy_negative_assertions`: scan visible map/offline/route copy for prohibited claims: offline search, offline geocoding, offline routing, turn-by-turn navigation, route optimization, traffic, travel time, guaranteed external navigation.

## Defect Risks For Implementation

- Numbering risk: current prototype-style behavior can number pins in `All` or `No day`, which may imply route order. MAP-02 should reserve numbered route pins for selected day mode unless a provider forces labels, and then copy must prevent route interpretation.
- Route-line risk: a straight or provider-rendered line may look like road-snapped navigation. Visual style and copy must consistently say planned order/context.
- Source-of-truth risk: if map state owns ordering separately from cards, reorders can desynchronize card order, pin numbers, and route line.
- Missing-coordinate risk: no-coordinate day places may disappear from map-only assertions unless card/list visibility is a required invariant.
- Offline-copy risk: short labels such as "offline route" or "route day" can accidentally promise routing. Use "planned order" or "day plan line" in acceptance copy.
- Provider-state risk: search provider failure, map provider failure, and offline map-not-downloaded can collapse into one generic error, hiding the right fallback action.
- Outside-area risk: outside Georgia, outside downloaded area while offline, and point outside Georgia from search need distinct handling to avoid silently saving invalid MVP pins.
- Yandex fallback risk: external handoff can become the primary CTA if card actions are not prioritized around in-app saved map/list context.
- Accessibility risk: drag-only card reorder may be hard to use on mobile and difficult to automate. Require explicit move controls or a proven accessible drag pattern.
- Persistence risk: route order, day assignment, coordinates, and source fields can pass UI tests in memory but fail after restart once persistence exists.

## MAP-02 Handoff Notes

- Convert MAP-01 flows into requirement IDs with Given/When/Then acceptance criteria and named fixtures.
- Define canonical data fields for map points: id, title, address, note, coordinates nullable, day assignment, route order per day, source, and provider-normalized saved fields.
- Specify whether selected-day numbering ignores no-coordinate cards or leaves visible gaps; QA needs one rule before tests.
- Specify outside-area policy: block outside-Georgia coordinates, warn before save, or save as manual note only. The default in MAP-01 is warning and no silent pin creation.
- Separate online search, autocomplete, map tiles/SDK, offline pack inventory, and external handoff as independent failure surfaces.
- Add copy-level acceptance criteria that prohibit navigation/routing/optimization/travel-time promises unless later provider proof expands scope.
- State that `app/mobile/App.tsx` is prototype evidence only; it is not proof of native offline behavior, provider terms, persistence, or app restart behavior.

## MAP-07 Handoff Notes

- Build fixture-driven tests around the named cases above before relying on provider integration tests.
- Add component/integration assertions for filter membership, colors, pin numbering, card ordering, route-line point sequence, and no-coordinate card visibility.
- Add deterministic mocks for search empty response, timeout, quota/API error, malformed result without coordinates, offline network state, map provider failure, and Yandex deep-link failure.
- Add negative text assertions for prohibited route/offline claims.
- Add manual/device test plan items for offline pack download, app restart, network-disabled reopen, downloaded-area boundary behavior, attribution, and native iOS/Android map rendering once MAP-03/MAP-06 provide a provider path.

## Final Recommendation

Accept MAP-01 for MAP-02 requirements work. Rework is not required at the UX-report level because the required states and core interaction rules are present. MAP-02 must not proceed to implementation handoff until the missing fixture set, explicit state assertions, reorder persistence expectations, outside-area policy, and copy-negative assertions are added.
