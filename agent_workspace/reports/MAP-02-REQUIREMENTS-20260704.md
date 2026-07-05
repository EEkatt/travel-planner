# MAP-02 Detailed Map Requirements

Task ID: TASK-20260704-024
Role: requirements_analyst
Date: 2026-07-04
Status: Ready for quality_lead and lead review

## Sources Read

- `agent_workspace/tasks/open/TASK-20260704-024-map-02-requirements.md`
- `agent_workspace/reports/MAP-LEAD-ORCHESTRATION-20260704.md`
- `agent_workspace/reports/MAP-LEAD-REVIEW-20260704.md`
- `agent_workspace/reports/MAP-00-SCOPE-20260704.md`
- `agent_workspace/reports/MAP-01-UX-20260704.md`
- `agent_workspace/reports/REVIEW-MAP-00-SCOPE-BY-REQUIREMENTS-20260704.md`
- `agent_workspace/reports/REVIEW-MAP-01-UX-BY-QA-20260704.md`
- `agent_workspace/reports/REVIEW-MAP-01-UX-BY-PRODUCT-20260704.md`
- `requirements/11_map_requirements.md`
- `requirements/07_requirements.md`
- `requirements/08_mvp.md`

## Requirement Policy

- MVP geography is Georgia only.
- Whole-country offline Georgia is a product target that requires provider/device proof; it is not accepted proof or a release claim by itself.
- The MVP must not promise offline search, offline geocoding, offline routing, turn-by-turn navigation, route optimization, traffic, travel time, live rerouting, or guaranteed Yandex Maps availability.
- A selected-day route line is planned order/context unless a later provider-rendered routing scope is separately accepted.
- Card order is the source of truth for selected-day route order, visible pin numbers, and route line sequence.
- Saved cards/lists/details remain the source of truth when map, search, offline tiles, or external handoff fail.

## Canonical Point Data Fields

Each saved trip point used by map requirements must expose these canonical fields to UI and tests:

| Field | Required | Definition |
| --- | --- | --- |
| `id` | Must | Stable app-owned identifier. |
| `title` | Must | User-visible point name. |
| `address` | Optional | User-visible address or provider-normalized address. |
| `note` | Optional | User-entered note/comment. |
| `coordinates` | Nullable | `{ latitude, longitude }` when known; `null` for manual text/no-coordinate points. |
| `countryCode` | Nullable | Normalized country code when known; Georgia points use `GE`. |
| `dayId` | Nullable | `null` means no-day; otherwise exactly one trip day. |
| `routeOrder` | Nullable | Integer position within `dayId`; required only for day-assigned points. |
| `source` | Must | One of `search_result`, `manual_map_tap`, `manual_text`. |
| `provider` | Optional | Provider name/key for normalized saved result metadata only. |
| `providerPlaceId` | Optional | Provider result identifier only if terms/security approve storage. |
| `providerAttribution` | Optional | Attribution text or token required for display, if terms require it. |
| `createdAt` / `updatedAt` | Should | Required once persistence/restart behavior is implemented. |

Raw provider responses, full request logs, private user location logs, API keys, and provider-specific payloads are not canonical point fields unless MAP-03/MAP-09 explicitly approve them.

## Numbered Prioritized Requirements

### MAP-REQ-001: All-Points Map Mode

Priority: Must

The map must provide an `All` mode for the current Georgia trip.

Requirements:

1. `All` mode shows every saved coordinate-backed point for the current trip.
2. Coordinate-backed no-day points render as neutral gray pins.
3. Coordinate-backed day-assigned points render as red pins.
4. No route line is shown in `All` mode.
5. No pin numbering is shown in `All` mode unless forced by provider label mechanics; if labels are unavoidable, copy must not imply route order.
6. Saved no-coordinate points remain visible in cards/lists under a `not shown on map yet` state.

Acceptance criteria:

Given the `map_all_mixed_points` fixture,
When the user opens the map in `All` mode,
Then all coordinate-backed trip points render as pins,
And no-day pins are gray,
And day-assigned pins are red,
And no route line is rendered,
And no-coordinate points are present in cards/lists and absent from the map canvas.

### MAP-REQ-002: No-Day Map Mode

Priority: Must

The map must provide a `No day` mode for unscheduled saved places.

Requirements:

1. `No day` mode shows only points where `dayId = null`.
2. Coordinate-backed no-day points render as gray pins.
3. No-day pins are unnumbered and not connected by a route line.
4. No-coordinate no-day points remain visible in cards/lists with an add-location/edit-address action.
5. If no no-day points exist, the screen shows an empty state with add-place/manual entry and online search when online.

Acceptance criteria:

Given the `map_no_day_mixed` fixture,
When the user selects `No day`,
Then only no-day coordinate-backed points render,
And every rendered pin is gray,
And no route line or route numbering appears,
And no-coordinate no-day points remain in the card list.

Given the `map_no_day_empty` fixture,
When the user selects `No day`,
Then the no-day empty state appears,
And the user can add a no-day place,
And the user can switch back to `All`.

### MAP-REQ-003: Selected-Day Route Mode

Priority: Must

The map must provide a selected-day mode for exactly one trip day at a time.

Requirements:

1. Selected-day mode shows only points where `dayId` equals the selected day.
2. Coordinate-backed selected-day points render as red pins.
3. Visible pin numbers equal the point's card `routeOrder`; numbers are not recomputed from coordinate-backed points only.
4. No-coordinate day points remain in the ordered cards with their `routeOrder` and `not shown on map yet` state.
5. The route line connects only coordinate-backed points in ascending card `routeOrder`, skipping no-coordinate points without changing card order or pin numbers.
6. The route line is a planned order/context line, not a promise of road-snapped routing, navigation, optimization, travel time, or traffic.
7. If a selected day has fewer than two coordinate-backed points, no route line is drawn; cards still show the day order.

Acceptance criteria:

Given the `map_day_three_coordinate_points` fixture,
When the user selects Day 1,
Then only Day 1 coordinate-backed points render as red numbered pins,
And pin numbers match card route order,
And the route line connects the points in card order.

Given the `map_day_order_with_missing_coordinate` fixture,
When the user selects Day 1,
Then the no-coordinate card remains in its ordered position,
And visible pin numbers preserve card positions with a gap for the no-coordinate point,
And the route line connects coordinate-backed points in ascending card order only.

### MAP-REQ-004: Map-Tap Point Creation

Priority: Must

The user must be able to create a point from a map tap/click when coordinates are available inside supported Georgia scope.

Requirements:

1. A tap inside Georgia with captured coordinates opens a save sheet/panel.
2. The save sheet requires `title` and allows optional `address`, optional `note`, and `dayId` choice.
3. Saving as no-day creates `source = manual_map_tap`, `coordinates` set, `dayId = null`, and `routeOrder = null`.
4. Saving to a day creates `source = manual_map_tap`, `coordinates` set, `dayId` set, and appends to the end of that day's card order unless a later approved UX lets the user choose a position.
5. Taps outside Georgia do not silently create coordinate-backed map points.
6. If coordinates cannot be captured, manual text entry remains available.

Acceptance criteria:

Given online map mode inside Georgia,
When the user taps the map, enters a title, chooses `No day`, and saves,
Then a new point exists with source `manual_map_tap`, coordinates, no day, no route order,
And it appears as a gray pin in `All` and `No day`.

Given online selected-day mode inside Georgia,
When the user taps the map, enters a title, chooses Day 1, and saves,
Then the point is appended to Day 1 card order,
And it appears as a red numbered pin in Day 1 using its appended route order.

### MAP-REQ-005: Online Search Point Creation

Priority: Must

The user must be able to add concrete places or landmarks from explicit online search when a production provider is available.

Requirements:

1. MVP search is online-only and triggered by explicit user submission.
2. Autocomplete/suggestions are optional and allowed only after MAP-03 accepts provider terms, limits, pricing, attribution, and key model.
3. Results show enough normalized context to choose the right place: title plus address/description when available.
4. Saving a result requires `title` and day/no-day choice.
5. Saved search results use `source = search_result`.
6. Provider-normalized coordinates are saved only when available and allowed by provider terms.
7. Public Nominatim must not be used for production autocomplete.

Acceptance criteria:

Given online search with provider results for `Narikala Fortress`,
When the user submits the query, selects the Georgia result, chooses Day 1, and saves,
Then a point exists with source `search_result`, normalized title/address, coordinates when provided, `dayId = Day 1`,
And it appears in Day 1 cards and map according to coordinate availability.

Given online search without approved autocomplete,
When the user types a query,
Then no production autocomplete is required,
And explicit submitted search remains available.

### MAP-REQ-006: Assign Day / Clear Day

Priority: Must

The user must be able to assign a saved point to one day and clear the assignment later.

Requirements:

1. Assigning a no-day point to a day sets `dayId` and appends the point to the end of that day's route order by default.
2. Clearing a day sets `dayId = null` and `routeOrder = null`.
3. Clearing a point from a day compacts the remaining day route orders to a deterministic sequence with no duplicate positions.
4. Day assignment works for coordinate-backed and no-coordinate points.
5. Coordinate-backed points change filter membership and color after assignment/clear.
6. No-coordinate points change card/list membership but remain off the map.

Acceptance criteria:

Given the `map_assign_clear_day` fixture,
When the user assigns a coordinate-backed no-day point to Day 1,
Then it leaves `No day`, appears in Day 1, becomes red, and receives the last route order.

Given the same point assigned to Day 1,
When the user clears the day,
Then it returns to `No day`, becomes gray in map modes where visible, and is removed from the Day 1 route line.

### MAP-REQ-007: Card Reorder

Priority: Must

Selected-day card order must be the single editing source for route order.

Requirements:

1. Reordering is available only in selected-day mode.
2. Reorder controls may be explicit move buttons, an accessible drag pattern, or both.
3. Dragging map pins is not an MVP route-order editing mechanism.
4. After reorder, the card list, `routeOrder` values, visible pin numbers, and route line sequence all update from the same ordered list.
5. Reorder persists after leaving and returning to the day; once persistence exists, it must persist after app restart.
6. Reordering a no-coordinate card changes its card position and may create visible pin-number gaps, but never creates a map pin without coordinates.

Acceptance criteria:

Given the `map_reorder_day_cards` fixture,
When the user moves the middle card to the first position,
Then the card order changes immediately,
And `routeOrder` values are updated deterministically,
And visible pin numbers match the updated card route orders,
And the route line sequence follows the updated card order,
And the user remains in the selected-day filter.

### MAP-REQ-008: No-Coordinate Points

Priority: Must

Saved points without coordinates must remain usable and visible in lists/cards.

Requirements:

1. A point with `coordinates = null` never renders as a map pin.
2. No-coordinate points remain visible in relevant `All`, `No day`, and selected-day cards/lists.
3. No-coordinate cards show a `not shown on map yet` state.
4. No-coordinate points can be assigned to a day and reordered within that day's card order.
5. Actions to add/edit location or address are available where supported by the current UX.
6. Missing coordinates must not crash map rendering or route-line generation.

Acceptance criteria:

Given the `point_address_no_coordinates` fixture,
When the user opens any relevant map mode,
Then the point appears in cards/lists,
And no pin is rendered for it,
And an add-location/edit-address action is available.

Given the `point_no_address_no_coordinates` fixture,
When the user opens the point card,
Then the card remains readable,
And map and Yandex handoff actions that require a target are unavailable or guided.

### MAP-REQ-009: Offline Downloaded Map

Priority: Must target, blocked on provider/device proof

The product target is offline viewing of a previously downloaded Georgia map area with saved points and planned order context.

Requirements:

1. The UI may expose download status values: `not_downloaded`, `downloading`, `downloaded`, `failed`, `outside_downloaded_area`.
2. The `downloaded` state is valid only after MAP-03/MAP-06 provider/device proof accepts the selected provider path.
3. Offline downloaded map behavior is limited to map viewing, zoom/pan inside the downloaded area, saved point overlay, saved card/list access, and selected-day planned order line.
4. Offline downloaded mode must not expose or imply offline search, geocoding, routing, navigation, route optimization, traffic, travel time, or live rerouting.
5. Whole-country Georgia is the first target area; fallback to regions/cities or one chosen area requires owner approval.

Acceptance criteria:

Given the `map_offline_downloaded` fixture and accepted provider proof,
When network is unavailable and the user opens a downloaded Georgia area,
Then the downloaded map area opens,
And saved coordinate-backed points render,
And selected-day planned order line renders when at least two coordinate-backed day points exist,
And online-only actions such as search are unavailable with manual fallback,
And visible copy does not make prohibited offline/navigation claims.

### MAP-REQ-010: Offline Without Downloaded Map

Priority: Must

The app must degrade clearly when offline map data was not downloaded before network loss.

Requirements:

1. If network is unavailable and no downloaded map area exists, the map surface shows a not-downloaded offline state.
2. The app does not promise that the map can be downloaded while offline.
3. Saved cards, lists, addresses, notes, and day order remain readable.
4. Download/retry actions are disabled or deferred until online.
5. Manual text entry remains available for saving an idea without coordinates.

Acceptance criteria:

Given the `map_offline_not_downloaded` fixture,
When the user opens the map without network,
Then the offline-not-downloaded state appears,
And saved lists/details remain readable,
And the app does not show a working search/geocode/routing promise,
And download/retry is presented only as an online action.

### MAP-REQ-011: Search Offline, No Results, And Provider Failure

Priority: Must

Search failure states must be distinct and must preserve manual entry.

Requirements:

1. Search offline state appears when a user tries online search without network.
2. No-results state appears when the provider returns an empty successful response.
3. Provider-failure state appears for timeout, quota, API error, malformed provider response, or provider unavailable.
4. The original query remains visible after no-results or provider failure.
5. Retry is available for provider failure when online.
6. Add manually is available for offline, no-results, and provider-failure states.
7. No partial point is saved unless the user explicitly saves a manual entry or selected valid result.

Acceptance criteria:

Given the `map_search_offline` fixture,
When the user attempts search,
Then search is disabled or returns an offline state,
And add manually is available.

Given the `map_search_no_results` fixture,
When the provider returns no results,
Then the no-results state preserves the query,
And refine search and add manually are available.

Given the `map_search_provider_failure` fixture,
When the provider times out or returns quota/API failure,
Then retry and add manually are available,
And no provider result is saved automatically.

### MAP-REQ-012: Map Provider Failure

Priority: Must

Map rendering failure must not hide saved trip data.

Requirements:

1. Tile, style, SDK, attribution-blocking, or map initialization failure shows a map-unavailable state.
2. Retry map is available when meaningful.
3. Saved point cards/lists remain visible and are explicitly the source of truth.
4. Search/manual add surfaces remain available according to network/provider state.
5. The app does not crash or drop saved points when the map provider fails.

Acceptance criteria:

Given the `map_provider_failure` fixture,
When the map provider fails to initialize or load required tiles,
Then a map-unavailable state appears,
And saved cards/lists remain readable,
And retry map is available when applicable,
And no saved point data is deleted or hidden from lists.

### MAP-REQ-013: Outside Georgia

Priority: Must

MVP map behavior must not expand trip-map support outside Georgia.

Requirements:

1. Search results with coordinates outside Georgia are not silently saved as coordinate-backed trip-map points.
2. Map taps outside Georgia are not silently saved as coordinate-backed trip-map points.
3. Default behavior is to block coordinate-backed save and offer search again or manual note-only save with `coordinates = null`, pending owner decision.
4. Outside-Georgia manual note-only saves must not appear as pins or route-line points.
5. Copy must say outside MVP area or outside Georgia, not imply global map/offline support.

Acceptance criteria:

Given the `map_search_outside_georgia_result` fixture,
When the user selects an outside-Georgia result,
Then the app warns that the result is outside the Georgia MVP map,
And no coordinate-backed map point is saved by default,
And the user can search again or save a manual note-only item only if the product policy allows it.

Given the `map_tap_outside_georgia` fixture,
When the user taps outside Georgia,
Then no misleading pin is created,
And the user receives an outside-MVP-area state.

### MAP-REQ-014: Outside Downloaded Area

Priority: Must

Offline downloaded-map behavior must distinguish being outside the downloaded area from being outside Georgia.

Requirements:

1. When offline and the user pans/taps outside the downloaded area, the app shows an outside-downloaded-area state.
2. The state offers return-to-downloaded-area when map bounds are known.
3. Saved cards/lists/details remain usable.
4. The app must not promise that tiles, search, geocoding, or routing are available outside the downloaded area while offline.
5. If the outside-downloaded location is still inside Georgia, this remains a downloaded-area limitation, not a country-scope expansion.

Acceptance criteria:

Given the `map_tap_outside_downloaded_area_offline` fixture,
When the user pans or taps outside the downloaded pack while offline,
Then the outside-downloaded-area warning appears,
And return-to-downloaded-area is available when supported,
And saved cards/lists remain readable,
And no offline search/geocode/routing promise appears.

### MAP-REQ-015: Yandex Maps Missing Target / Handoff Failure

Priority: Must

Yandex Maps handoff is a point-level fallback only.

Requirements:

1. The Yandex Maps action appears only on point card/detail surfaces, not as the primary map experience.
2. If a point has coordinates, handoff uses coordinates as the preferred target.
3. If a point has no coordinates but has a usable address, handoff may use the address.
4. If a point has neither coordinates nor address, the action is disabled with guidance to add address/location.
5. If Yandex Maps app/deep link fails, the app shows a concise failure and keeps address/coordinates visible.
6. Web fallback, copy-address, or copy-coordinates behavior requires owner approval; until approved, display saved target data.
7. Copy must not promise guaranteed external navigation.

Acceptance criteria:

Given the `yandex_missing_target` fixture,
When the user opens the point card,
Then `Open in Yandex Maps` is disabled or unavailable,
And guidance to add address/location appears.

Given the `yandex_handoff_failure` fixture,
When the user taps `Open in Yandex Maps` and the handoff fails,
Then the app shows a handoff-failure state,
And the saved address/coordinates remain readable,
And the app does not present Yandex Maps as guaranteed.

## Deterministic Fixture List For MAP-07

| Fixture ID | Required data/state | Primary assertions |
| --- | --- | --- |
| `point_no_day_coordinates` | One no-day point in Georgia with coordinates. | Gray pin in `All`/`No day`; no route order. |
| `point_day_coordinates` | One Day 1 point in Georgia with coordinates and route order. | Red pin in `All`; numbered red pin in Day 1. |
| `point_day_no_coordinates` | One Day 1 point with `coordinates = null`. | Visible card; no pin; keeps route order. |
| `point_no_day_no_coordinates` | One no-day point with `coordinates = null`. | Visible card/list; no pin. |
| `point_address_no_coordinates` | Address present, coordinates null. | Visible target data; not shown on map. |
| `point_no_address_no_coordinates` | Title only, no address, no coordinates. | Visible card; external map action disabled. |
| `map_all_mixed_points` | No-day coordinate point, Day 1 coordinate point, Day 2 coordinate point, no-coordinate points. | All coordinate pins render; colors by assignment; no route line. |
| `map_no_day_mixed` | At least one no-day coordinate point and one no-day no-coordinate point. | Gray no-day pins plus no-coordinate card. |
| `map_no_day_empty` | Trip has points but none with `dayId = null`. | Empty no-day state and add/switch actions. |
| `map_day_empty` | Selected day has no points. | Empty day state with add-to-day action. |
| `map_day_three_coordinate_points` | Selected day has three coordinate-backed points with orders 1, 2, 3. | Pins 1, 2, 3 and line sequence 1 -> 2 -> 3. |
| `map_day_order_with_missing_coordinate` | Selected day orders 1 coordinate, 2 no-coordinate, 3 coordinate, 4 coordinate. | Cards 1-4; visible pins 1, 3, 4; line 1 -> 3 -> 4. |
| `map_reorder_day_cards` | Selected day has at least three cards; middle card movable to first. | Card order, route orders, pin numbers, line sequence update. |
| `map_assign_clear_day` | Coordinate-backed no-day point and Day 1 route. | Assign appends; clear removes and returns to no-day. |
| `map_search_online_success_georgia` | Provider returns Georgia result for a concrete landmark. | Search result saves normalized fields and chosen day/no-day state. |
| `map_search_outside_georgia_result` | Provider returns result outside Georgia. | Outside-MVP warning; no coordinate-backed save by default. |
| `map_search_no_results` | Provider returns empty successful response. | Query preserved; refine and add manually available. |
| `map_search_provider_failure` | Timeout, quota, API error, or malformed response. | Retry/manual add; no auto-save. |
| `map_search_offline` | Network unavailable before search. | Offline search state; manual save available. |
| `map_provider_failure` | Tile/style/SDK initialization failure. | Map unavailable; cards/lists remain source of truth. |
| `map_offline_downloaded` | Network unavailable; accepted downloaded Georgia area exists. | Offline map viewing, saved points, planned line; no forbidden claims. |
| `map_offline_not_downloaded` | Network unavailable; no downloaded map. | Not-downloaded state; saved lists readable. |
| `map_tap_outside_georgia` | Tap/click outside Georgia. | No silent coordinate-backed point; warning. |
| `map_tap_outside_downloaded_area_offline` | Offline pan/tap outside downloaded pack. | Boundary warning and saved details available. |
| `map_outside_downloaded_area_inside_georgia` | Offline position inside Georgia but outside downloaded area. | Download-area limitation, not country expansion. |
| `yandex_missing_target` | Point has no address and no coordinates. | Handoff disabled with add target guidance. |
| `yandex_handoff_failure` | Point has target but deep link/app open fails. | Failure state; target remains readable. |
| `copy_negative_assertions` | Rendered copy from map/offline/search/route states. | Prohibited claims are absent. |

## Copy-Negative Assertions

MAP-07 must scan visible map, offline, route, search, and handoff copy for misleading claims. The following assertions are required:

1. No visible copy says or implies `offline search`.
2. No visible copy says or implies `offline geocoding`.
3. No visible copy says or implies `offline routing`.
4. No visible copy says or implies `turn-by-turn navigation`.
5. No visible copy says or implies `route optimization` or `optimized route`.
6. No visible copy says or implies live `traffic`, `travel time`, ETA, or live rerouting.
7. No visible copy says or implies Yandex Maps or any external map is guaranteed to open.
8. Downloaded map copy is limited to map viewing, saved points, saved details, zoom/pan inside downloaded area, and planned order context.
9. Selected-day line copy uses `planned order`, `day order`, or equivalent wording; it does not call the line navigation/routing unless later scope is approved.
10. Outside-area copy does not imply global or multi-country offline map support.

## Provider-Proof Matrix For MAP-03

| Capability / claim | MAP-02 product requirement | Proof required before acceptance | Owner/review gate |
| --- | --- | --- | --- |
| Native map rendering | Show Georgia trip map in app. | iOS and Android development-build evidence; Expo Go/web prototype is not enough. | MAP-03/MAP-06, technical review. |
| Tile/style provider | Load map tiles/styles legally and reliably. | Terms, pricing, attribution, cache/offline rules, key model, failure behavior. | MAP-03, security review. |
| Whole-country Georgia offline map | Target a downloaded Georgia map before trip. | Pack size, download duration, device storage, provider limits, restart persistence, offline reopen. | Owner approval after MAP-03/MAP-06 evidence. |
| Region/city fallback | Allowed only if whole-country target is impractical. | Documented blocker and proposed Georgia fallback areas. | Owner approval required. |
| Offline pack inventory | Know whether map area is downloaded. | `getPacks` or equivalent survives app restart; failed/deleted states handled. | MAP-03/MAP-06. |
| Offline network-disabled reopen | Open downloaded area without network. | Device test with network disabled after app restart. | MAP-06 QA evidence. |
| Saved point overlay offline | Render saved pins over downloaded map. | Device test with network disabled and fixture points. | MAP-06/MAP-08. |
| Planned order line offline | Render selected-day planned line over downloaded map. | Device test with coordinate-backed ordered points; no routing claims. | MAP-06/MAP-08. |
| Pack delete/cleanup | Avoid unbounded storage growth. | Delete/cleanup behavior verified and error states defined. | MAP-03/MAP-06. |
| Search provider | Online concrete-place search. | Terms, quota, pricing, attribution, key model, normalized field storage, timeout/error behavior. | MAP-03/MAP-09. |
| Autocomplete | Optional suggestions while typing. | Production provider explicitly permits client-side autocomplete under accepted terms. | Owner and security/provider approval. |
| Provider result storage | Save normalized place fields. | Terms allow storing selected normalized title/address/coordinates/place ID; raw payload policy accepted. | MAP-03/MAP-09. |
| Offline search/geocoding/routing | Explicitly not promised for MVP. | Separate provider proof and owner-approved scope expansion if ever considered. | Future scope only. |
| Provider-rendered route geometry | Not required; route line is planned order by default. | If proposed, evidence that copy/terms do not imply navigation/optimization and owner accepts scope. | Future owner decision. |
| Yandex Maps handoff | Point-level fallback. | Deep-link behavior, failure detection, address/coordinate target rules, web/copy fallback decision. | MAP-03/MAP-09 plus owner decision. |
| Attribution | Provider attribution shown as required. | Required attribution text/location verified online/offline. | MAP-03/MAP-09. |
| API key privacy | No unsafe key or user data handling. | Mobile key model, restrictions, logging policy, no private data in diagnostics. | MAP-09. |

## Open Owner Decisions

1. If whole-country Georgia is too large, too slow, too expensive, or not allowed, which fallback should be approved first: regions, cities, or one manually chosen Georgia area per trip?
2. What maximum offline pack size and download duration are acceptable for the first MVP trip?
3. Is one downloaded area per trip acceptable for MVP?
4. Which representative Georgia area should MAP-03/MAP-06 use for first provider/device proof?
5. Should the offline-map preparation warning be persistent before travel until download succeeds, or only shown on the map/offline status surface?
6. Should outside-Georgia results be fully blocked, or is manual note-only save with `coordinates = null` acceptable?
7. Is explicit submitted search acceptable for first release if approved production autocomplete is unavailable?
8. Should Yandex Maps failure fallback include web fallback, copy address/coordinates, or only display saved target data?
9. Should MVP include coordinate editing for existing points, or only add/replace location through manual entry/search/map tap?
10. Should the selected-day route line remain a straight planning line by default, or can provider-rendered geometry be accepted later without navigation claims?
11. Which exact Russian UI terms should be used to distinguish downloaded map viewing from routing/navigation?

## Go / No-Go Notes

Go for quality_lead and lead review of MAP-02.

No-go for implementation or provider commitment until MAP-02 is accepted and MAP-03/MAP-06 provide provider/device proof for any offline download, offline reopen, native SDK behavior, storage limits, provider terms, attribution, API key model, and search/geocoding storage rights.
