# REVIEW: MAP-00 Scope By Requirements

Task ID: TASK-20260704-021
Reviewer: requirements_analyst
Date: 2026-07-04
Reviewed scope: `agent_workspace/reports/MAP-00-SCOPE-20260704.md`

## Recommendation

Accept MAP-00 for conversion into MAP-02 detailed requirements, with required tightening in MAP-02.

MAP-00 is ready enough to serve as the product boundary source for MAP-02 because it preserves the lead decisions: Georgia-only MVP, whole-country Georgia as an offline target rather than proof, gray no-day coordinate points, red numbered day route points, card-based route ordering, and Yandex Maps as a fallback. It also keeps offline map viewing separate from offline search, geocoding, routing, turn-by-turn navigation, traffic, and route optimization.

Do not treat MAP-00 as implementation approval. MAP-02 must translate MAP-00 into bounded, testable requirements and must preserve provider-proof gates before MAP-03 or implementation expands.

## Requirement-Readiness Findings

### Ready For MAP-02

- The MVP country boundary is explicit and testable: Georgia is the only MVP country, and any region/city fallback requires owner approval.
- Offline scope is mostly well bounded: the target is downloaded map viewing with saved points and planned order, not offline routing/search/geocoding/navigation.
- Point visibility rules are requirements-ready: coordinate-backed no-day points are gray pins; coordinate-backed day points are red route/day points; no-coordinate points remain in lists and do not render as pins.
- Route behavior is requirements-ready at the product level: selected-day mode shows numbered red points and a route/order line; card reordering changes numbering and redraws the line; pin dragging is outside MVP.
- Yandex Maps is correctly framed as point-level fallback, not the primary map experience.
- Failure states are broad enough to become acceptance criteria: no network, no results, provider failure, no coordinate, outside downloaded area, and handoff unavailable are all named.
- MAP-00 correctly rejects public Nominatim autocomplete as production proof and keeps autocomplete conditional on production provider terms.

### Needs Tightening In MAP-02

- Several statements still use user-facing capability language before provider proof, especially around triggering the Georgia map download and opening the downloaded area without network. MAP-02 should split these into product requirement, proof prerequisite, and acceptance condition.
- "Whole-country Georgia" is a target but not yet measurable. MAP-02 needs explicit acceptance placeholders for maximum pack size, download duration, storage budget, provider limits, and owner-approved fallback decision path.
- "Search online for concrete places, landmarks, or addresses" needs test fixtures and boundaries: example accepted queries, outside-Georgia behavior, empty results, provider timeout, quota failure, and manual fallback.
- "Route/order line" needs a precise non-routing definition. MAP-02 should say whether the MVP line is straight segment ordering by default unless provider-rendered route geometry is separately accepted.
- Card-based route ordering is accepted, but the reorder interaction is not pinned down. MAP-02 should require an accessible reorder mechanism and define persistence/order update expectations without prescribing drag-only behavior.
- The saved point model is close but incomplete for requirements: stable id, title, optional address/note, coordinates, day assignment, source, order index, and persistence expectations need to be formalized.
- "Outside MVP area" and "outside downloaded area" are distinct states and should remain separate in MAP-02 tests.
- External handoff needs clearer acceptance criteria for coordinate priority, address fallback, app unavailable, web fallback if approved, and copy/address display if deep link fails.

## Ambiguities For MAP-02

- Is saving an outside-Georgia search result blocked, warned, or allowed only as a manual non-map note?
- If whole-country Georgia is infeasible, who approves the fallback and what is the first fallback unit: one manually chosen area, regions, or cities?
- What are the maximum acceptable offline pack size and download time for the first MVP proof?
- Is one downloaded area per trip acceptable for MVP?
- Which Georgia area is the representative provider/device proof area before whole-country proof?
- Should online autocomplete be a Must if provider-approved, or a Should that can be dropped in favor of explicit search?
- In selected-day mode, should no-coordinate places appear inline in route order cards or in a separate "not shown on map" section while preserving order?
- When assigning a point to a day, is it always appended to the end by default, or can the user choose position during assignment?
- Are route lines straight planning lines for MVP, or can provider-rendered route geometry be used online if available without implying routing?
- Is copying address/coordinates an accepted Yandex Maps fallback, and is web handoff allowed if the native app is unavailable?
- What exact Russian UI terminology should distinguish downloaded map viewing from offline navigation/routing?

## Risks If MAP-03 Starts Before MAP-02

- Provider work may optimize for unsupported capabilities, such as offline routing, provider-native route geometry, or autocomplete, before the MVP contract says whether those are required.
- Engineering may treat "download Georgia map" as a committed implementation requirement instead of a provider-gated target, creating false schedule and acceptance expectations.
- Provider selection may bake in terms, attribution, API key, or storage assumptions before MAP-02 defines what data the product is allowed to store and display.
- Search/geocoding provider evaluation may miss required fallback fixtures: offline, no results, quota failure, timeout, outside Georgia, missing coordinates, and manual save.
- Offline proof may be measured against the wrong area if MAP-02 has not defined the representative Georgia test area, size budget, and owner fallback path.
- Route display implementation may accidentally become road-snapped routing or optimization if MAP-02 does not define the planning line as a non-navigation visualization.
- Yandex Maps handoff could become the primary experience if MAP-02 does not define in-app saved point and day-route context as the primary map behavior.

## Concrete MAP-02 Handoff Notes

- Write MAP-02 as numbered requirements with priorities and acceptance criteria, not as narrative scope.
- Separate every offline item into: product target, provider/device proof prerequisite, user-facing behavior, and acceptance test.
- Preserve Georgia-only scope in every geography and offline requirement; any non-Georgia behavior should be an explicit out-of-scope or blocked state.
- Add deterministic test fixtures for saved points:
  - no-day point with coordinates;
  - day-assigned point with coordinates;
  - day-assigned point without coordinates;
  - no-day point without coordinates;
  - outside-Georgia search result;
  - point with address but no coordinates;
  - point with neither address nor coordinates.
- Define map filters separately: all points, no-day points, and one selected day.
- Require selected-day numbering and route/order line to derive from the same card order source.
- Require reordering cards to update card order, pin numbering, route/order line, and persisted route order.
- Explicitly ban MVP copy and acceptance criteria that imply offline search, offline geocoding, offline routing, turn-by-turn navigation, traffic, travel-time estimation, route optimization, or guaranteed Yandex Maps availability.
- Define search as explicit online search by default; autocomplete should be conditional on production provider approval.
- Require manual text entry fallback for offline search, provider failure, no results, and missing coordinates.
- Require saved lists/details to remain the source of truth when map display, offline tiles, search, or external handoff fails.
- Define Yandex Maps handoff as a fallback action available only when coordinates or usable address exist, with coordinates preferred.
- Add provider-proof acceptance criteria for native iOS/Android development builds, offline pack inventory after restart, network-disabled reopen, saved point overlay, route/order overlay, pack deletion, measured pack size/duration, attribution, key model, and provider data retention.

## Lead Go/No-Go

Go for MAP-02 requirements drafting.

No-go for MAP-03 provider implementation or broad provider commitment until MAP-02 defines the acceptance criteria and proof matrix above.
