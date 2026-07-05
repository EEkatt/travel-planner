# REVIEW: MAP-01 UX By Product

Task ID: TASK-20260704-023
Reviewer: product_analyst
Date: 2026-07-04
Reviewed artifact: `agent_workspace/reports/MAP-01-UX-20260704.md`
Recommendation: Accept for MAP-02 with guardrails

## Go/No-Go Recommendation

Accept MAP-01 as product-aligned input for MAP-02 requirements.

MAP-01 preserves the accepted MAP-00 product boundary: Georgia-only MVP, map as an in-app trip workspace, saved points and day route context as the core value, and Yandex Maps as a point-level fallback. It does not require rework before MAP-02.

MAP-02 must convert MAP-01 into testable requirements without turning target offline-map behavior into an implementation promise. The lead should treat provider/offline/search feasibility, outside-Georgia policy, and Yandex fallback details as unresolved decisions, not as UX defects.

## Product Alignment Findings

- MAP-01 correctly frames the map as a mobile trip workspace inside `Today / Days / Map`, not as a standalone navigation product.
- MAP-01 keeps MVP geography scoped to Georgia and explicitly calls whole-country offline Georgia a provider-dependent product target, with regional/city fallback requiring later approval.
- MAP-01 preserves the required point model:
  - no-day coordinate-backed points are gray;
  - day-assigned coordinate-backed points are red;
  - no-coordinate points remain visible in cards/lists and are not lost from the plan.
- MAP-01 preserves the required map modes:
  - all saved coordinate-backed points;
  - no-day points;
  - one selected day route.
- MAP-01 correctly reserves numbered pins and the route/order line for selected-day mode. It avoids implying order in `All` or `No day`.
- MAP-01 preserves card-based route ordering below the map. It explicitly rejects pin dragging as the MVP route-editing model.
- MAP-01 keeps online search focused on concrete places and landmarks. It allows suggestions/autocomplete only if the production provider permits it and rejects public Nominatim autocomplete.
- MAP-01 preserves manual add as the fallback when search is unavailable, offline, failing, or empty.
- MAP-01 keeps Yandex Maps as a selected-point fallback, not the primary map or route planning experience.
- MAP-01 explicitly avoids promises of offline search, offline geocoding, offline routing, route optimization, traffic, turn-by-turn navigation, and guaranteed native/offline provider readiness.

## MVP Creep Risks

- The header action `Download Georgia map` could read like a guaranteed MVP capability if MAP-02 does not mark it as blocked until provider/device proof exists.
- Offline state language such as downloaded/offline map available must be narrowed to saved map viewing, saved points, zoom/pan inside the downloaded area, and planned order visualization only.
- The selected-day route line may be misunderstood as road-snapped routing. MAP-02 should require copy and visual treatment that says planned order/context, not navigation.
- Search suggestions remain a creep vector. MAP-02 should specify explicit submitted search as acceptable for MVP when autocomplete is not approved.
- The outside-Georgia and outside-downloaded-area flows need tight requirements so the UX does not quietly expand to global trip maps or multi-country offline packs.
- Yandex Maps fallback could become too prominent during implementation. MAP-02 should keep it at point card/detail level and require in-app map/cards to remain useful when handoff fails.
- Reorder UX could creep into complex map gestures. MAP-02 should keep cards as the source of truth and allow only accessible card reorder controls or a proven card drag pattern.

## Owner-Facing Unresolved Decisions

- If whole-country Georgia is infeasible, which fallback scope is owner-approved first: regions, cities, or one manually chosen Georgia area per trip?
- What maximum offline pack size and download duration are acceptable for the first MVP trip?
- Is one downloaded area per trip acceptable for MVP?
- Which representative Georgia area should be used for first provider/device proof?
- Should outside-Georgia coordinates be blocked, allowed only as manual notes, or saved with a warning outside the MVP trip-map experience?
- Is explicit submitted search acceptable for first release if provider-approved autocomplete is not available?
- Should Yandex Maps failure fallback include web fallback, copy address/coordinates, or only display saved target data?
- Should MVP include coordinate editing for existing points, or only add/replace location through manual entry/search/map tap?
- Should the day route line be a straight planning line for MVP unless provider-rendered route geometry is separately proven and accepted?

## MAP-02 Handoff Notes

- Write requirements around `All`, `No day`, and selected-day filters as separate acceptance groups.
- Require gray no-day pins, red day-route pins, and numbering only in selected-day mode.
- Require the selected-day card order to be the single source for pin numbers and route/order line sequence.
- Require no-coordinate places to stay visible in cards/lists with a `not shown on map` state.
- Require manual add to remain available for offline, provider failure, no results, and unsupported/outside-area cases.
- Require copy constraints that ban `offline routing`, `offline search`, `offline geocoding`, `optimized route`, `traffic`, `travel time`, and `turn-by-turn navigation` unless later provider proof and owner approval change scope.
- Mark offline map download, offline reopen, pack inventory persistence, pack size, and provider terms as provider-proof dependencies, not completed product facts.
- Keep Yandex Maps requirements scoped to point-level handoff using coordinates first, then address, with graceful unavailable/missing-target states.
- Include fixtures for all critical states: empty trip, empty no-day filter, empty day route, offline with and without downloaded map, search offline/no-results/provider failure, map provider failure, outside Georgia, outside downloaded area, missing coordinates, and Yandex handoff failure.
- Block MAP-03 provider decisions from changing MAP-02 product scope without owner approval.

## Lead Decision Support

MAP-01 can proceed to MAP-02. No rework is needed before requirements drafting, provided MAP-02 carries forward the provider-proof blockers and does not convert the offline-map target into an unconditional release promise.
