# Map Requirements

## Status

Draft. Updated from owner feedback on 2026-07-04.

## Purpose

Define the expected map behavior for MVP before implementing real provider integrations.

The map is a core trip workspace. The product direction is to reduce the need to use external maps during travel, while keeping external map handoff as a fallback until native navigation/routing capabilities are proven.

## Product Goal

The user plans a trip in advance, searches for places in Russian, saves places and day routes, downloads Georgia as the first MVP offline map area before travel, and can later open the map offline to see the terrain, saved points, and previously calculated day route context.

## MVP Geography

MVP offline map geography:

- Georgia.
- The first MVP target is the whole country map of Georgia, downloaded before the trip.
- If whole-country offline map size, provider terms, or device storage make this impractical, the fallback is one or more Georgia regions/cities chosen before the trip. This fallback requires owner approval.

Out of MVP geography:

- worldwide offline map packs;
- automatic offline area selection for arbitrary countries;
- multiple-country offline trips.

## Map Modes

### Online Mode

Online mode is used while planning or when the device has network access.

Required behavior:

- Search for Georgian cities, places, landmarks, and addresses by Russian query text.
- Scope search and suggestions to Georgia for MVP unless the owner explicitly expands geography.
- Show suggestions while the user types if the selected production provider supports autocomplete under acceptable terms.
- Add a search result as a trip point.
- Add a point manually from the map.
- Save a point with or without assigning it to a day.
- Change the day assignment later.
- Show all saved points on the map.
- Show points by selected day.
- Show points without a day as a separate category.
- Calculate the selected day route through a routing provider/engine using the ordered day points.
- Allow zoom and pan.
- Open a saved point/address in an external map app when possible.
- External map handoff should be a fallback, not the primary target experience.

### Offline Mode

Offline mode is used during the trip when network is weak or unavailable.

Required behavior:

- Open a previously downloaded map area.
- Show saved terrain/map tiles for that area.
- Show saved points that were added before going offline.
- Show points by selected day.
- Show points without a day.
- Show the previously calculated route geometry between saved points for a day when it was calculated and cached before going offline.
- Allow zoom and pan inside the downloaded area.
- Keep saved lists/details readable even if map tiles outside the downloaded area are unavailable.

Not required in MVP offline mode:

- Offline place search.
- Offline geocoding.
- Offline route calculation.
- Offline turn-by-turn navigation.
- Offline route optimization.
- Live traffic or travel-time estimation.

Important boundary:

- MVP offline map should help the user orient and follow the previously saved day route visually.
- MVP route display must use route geometry calculated by a routing provider/engine, not a straight line between pins.
- MVP does not guarantee turn-by-turn navigation, live rerouting, offline route calculation, route optimization, traffic, or travel-time estimation unless a provider later proves this capability and the owner explicitly accepts the scope increase.

## Points

Each map point must support:

- stable id;
- title;
- optional address;
- optional note/comment;
- coordinates when known;
- day assignment: `no day` or one trip day;
- source: search result, manual map click, or manual text entry;
- created/updated timestamps later when persistence exists.

Behavior:

- A point may initially belong to no day.
- A point without a day is visible on the map if it has coordinates.
- A point without a day uses a neutral color.
- A point without coordinates is still saved and visible in lists, but not shown as a pin.
- A day-assigned point appears in day filters and can be part of the calculated day route display when it has coordinates.
- Reassigning a point to a day changes its color/category and route inclusion.

Day assignment states:

- `no day`: the point is saved but not in a route plan yet.
- `in day plan`: the point belongs to a selected trip day and can appear in that day's route/order.

## Visual Rules

- Points not in a day plan use a neutral color, preferably gray.
- Points included in a day plan/route use the route color, preferably red.
- The map must support viewing:
  - all points;
  - only no-day points;
  - points for a selected day.
- The selected day route is shown using calculated route geometry from the routing layer.
- Points in the selected day route are numbered according to their order.
- The route line is not turn-by-turn navigation and must not imply live guidance, route optimization, traffic, ETA, or rerouting.
- UI copy must not imply offline route calculation unless a provider later proves that capability.
- A straight line between pins is not an acceptable successful route. It may appear only as an explicitly labeled fallback/error state after routing failure, and it must never be labeled as a calculated route.

## Day Route Ordering

Route order is changed outside the map, not by dragging pins on the map.

Required behavior:

- When the user selects a day, the map shows that day's numbered points.
- Below the map, the app shows place cards for that day.
- Place cards can be reordered.
- Reordering cards changes point numbering on the map.
- Reordering cards invalidates the current calculated route for that day.
- When online, the app recalculates the route through the routing provider/engine using the new card order.
- Reordering cards changes point numbering immediately and redraws the route only after valid route geometry is available.
- Place cards can later contain short descriptions, notes, time, address, and actions.

Rationale:

- Reordering cards is expected to be clearer and more controllable on mobile than dragging map pins.
- The map remains a visual context; the list/card stack remains the editing surface.

## Search

MVP search behavior:

- Search is online-only.
- Search supports Russian input and Russian result text where provider data allows it.
- Search is scoped to Georgia for MVP.
- Target UX: as the user types, suggestions appear.
- Provider constraint: autocomplete is only allowed if the selected production provider permits client-side suggestions under acceptable rate limits and terms.
- Prototype constraint: public Nominatim must not be used for autocomplete; it may only be used for deliberate low-volume searches.
- Results show title and address/description when available.
- User can add a result to the trip.
- User can choose `no day` or a specific day before saving.
- Provider failure, no results, or offline state must keep manual point entry available.

Search target:

- Search should support cities, addresses, concrete places, and landmarks, for example "Тбилиси", "Крепость Нарикала", or "Статуя Али и Нино".
- Generic category discovery such as "cafes nearby" or recommendation browsing is not the first MVP priority unless provider support is simple and does not delay concrete-place search.

Prototype provider note:

- The web prototype may use public Nominatim only for deliberate, low-volume, user-triggered searches.
- It must not implement autocomplete against public Nominatim.
- Production provider selection remains blocked until terms, pricing, attribution, storage rights, and API key model are accepted.

## Offline Download

Required behavior:

- User can see whether the trip map area is downloaded.
- User can trigger download of the Georgia map before the trip.
- Download has status: not downloaded, downloading, downloaded, failed.
- Downloaded map opens without network.
- Saved points render on the downloaded map.
- Previously calculated and cached day route geometry renders on the downloaded map when its input order still matches the saved day cards.
- App clearly explains when the user is outside the downloaded area.

Open implementation questions:

- Whether whole Georgia can be one offline pack or must be split into smaller packs.
- Maximum acceptable pack size.
- First representative test region inside Georgia for technical proof.
- Provider cache/offline limits.
- Whether provider terms allow storing calculated route geometry for offline display.

## Road-Routed Day Routes

Day route display must be based on route geometry from the routing layer, not a direct polyline between saved point coordinates.

Required behavior:

- The app keeps the card order as the source of truth for day point order.
- The routing layer receives coordinate-backed day points in card order and returns route geometry for the selected route profile.
- The default route profile must be owner-approved before production release, for example walking or driving.
- No-coordinate day cards remain in the day order but are excluded from routing requests and route geometry.
- Reordering cards changes point numbering immediately and marks the route as stale until a matching route geometry is available.
- When online, the user can calculate or refresh the route for the current day.
- When offline, the app does not calculate routes. It may show only a cached route geometry whose input hash matches the current day order and route profile.
- If no matching cached route exists offline, the app shows that the route must be calculated online.
- Provider failure must preserve cards, points, and order, and offer retry/manual fallback where appropriate.
- Straight-line fallback is allowed only as a clearly labeled degraded/error state and must not be used as the normal route display.

Route state values should include at least:

- not enough coordinate points;
- not calculated;
- calculating;
- ready;
- stale;
- failed;
- offline without cached route.

## Acceptance Criteria

MVP map is acceptable when:

- User can open the map and zoom/pan.
- User can search online and add a point from a result.
- User can add a point by clicking/tapping the map.
- User can save the point with `no day`.
- User can assign the point to a day.
- Points without a day and points in a day route have different colors.
- User can filter all points, no-day points, and points by day.
- Day filter shows numbered points and calculated route geometry for that day when routing has succeeded.
- User can reorder day place cards under the map, and the numbering updates immediately.
- After reorder, the existing route is marked stale and recalculated online before being shown as the current route.
- No-coordinate points remain available in a list.
- Saved points remain visible after app restart once persistence exists.
- Downloaded Georgia map opens without network once MapLibre/offline provider is implemented.
- Cached route geometry remains visible offline only when it matches the current day order and route profile.
- UI copy distinguishes offline map viewing from offline route calculation, navigation, routing, optimization, traffic, and ETA.

## External Map Fallback

Product direction:

- The app should eventually reduce the need to open external maps during the trip.
- In MVP, external maps remain a fallback for point-level navigation if native routing/navigation is not implemented.

Fallback behavior:

- A saved point can be opened in Yandex Maps when the app cannot provide enough navigation support.
- External handoff is not the main route planning experience.
- UI should avoid making the user feel forced to leave the app for basic orientation and saved route context.

## Current Prototype Scope

The current web prototype may include:

- OpenStreetMap/Leaflet online map;
- local/mock Georgia suggestions while production search is not connected;
- adding points from map click;
- day assignment;
- point colors;
- filters;
- mock route geometry that is explicitly marked as non-production;
- adding a point from search result;
- adding a point by clicking the map;
- selecting `no day` or a day before saving;
- visual distinction between no-day and route points.

The current web prototype does not prove:

- native iOS/Android map SDK behavior;
- offline tile download;
- offline map reopening;
- provider production terms;
- storage/persistence after app restart.
- production online search/autocomplete;
- production road-routed geometry;
- legal permission to cache route geometry offline.
