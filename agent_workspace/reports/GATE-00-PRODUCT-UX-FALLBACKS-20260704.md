# Gate 00 Product And UX Fallbacks

Task ID: TASK-20260704-017
Agents: product_analyst, ux_analyst
Status: Ready For Review
Date: 2026-07-04

## Product Analyst Section

Summary:

Gate 00 product fallback expectations should stay manual-first and local-first. The MVP must preserve access to saved trip data and allow manual continuation when provider-dependent actions fail. It must not imply offline routing, live travel data, automatic import, or guaranteed external navigation.

Fallback behavior:

| Scenario | Product Expectation | Acceptance Criteria |
| --- | --- | --- |
| Offline map not downloaded | Saved trip lists/details remain usable; map shows preparation warning, not broken state. | User can open days, places, housing, flights, notes, and included checklists offline; map download is offered when online. |
| Offline map downloaded, no network | Downloaded area opens with saved coordinate-backed points. | Network-disabled state renders saved points in downloaded area; no offline routing/search promised. |
| Search/geocoding provider failure | Manual place entry is primary fallback. | Search error/offline/no-results allows saving title plus optional address/comment. |
| Map display provider failure | Lists and details remain source of truth. | Map failure does not block saved places/day plan. |
| Missing coordinates | Place remains useful but is excluded from map pins. | Place appears in plan/list with needs-location state; other pins still render. |
| External navigation unavailable | App keeps saved address/coordinates and explains handoff cannot open. | Missing target data disables action; provider/device failure shows retry/unavailable state without data loss. |
| Manual entry fallback | Manual save works without provider dependency. | User can save place, flight, housing, note, and day item with minimal useful fields. |
| Checklists deferred | No broken checklist entry points. | If deferred, quick access does not show dead navigation. |
| Reminders deferred or notifications denied | Core trip workflow unaffected. | No reminder promises if deferred; denied permission preserves in-app data if included later. |

First-release recommendation:

- Checklists can be first release only as simple local CRUD and quick access. If they delay Must flows, defer and remove checklist entry points.
- Reminders should be deferred unless Must flows are smoke-tested and a notification adapter proves permission, schedule, cancel, and denied states.

Owner questions:

1. Should checklists be included if limited to local CRUD and quick access only?
2. Are reminders acceptable to defer until after first real-trip MVP test?
3. Is one downloaded area per trip acceptable for MVP?
4. What Russian wording should distinguish saved offline details from missing downloaded map?

## UX Report Section

Summary:

The UX fallback baseline should be manual-first, local-first, and explicit about what is unavailable. Saved trip details remain the primary recovery path when network, map/search providers, coordinates, external navigation, checklists, or reminders are unavailable. The interface should never imply offline search, offline routing, route optimization, live updates, automatic import, or guaranteed external navigation in the MVP.

Changed Files:

- `agent_workspace/reports/GATE-00-PRODUCT-UX-FALLBACKS-20260704.md`

Recommended Main Screens:

- Main trip screen: keep the `Today / Days / Map` structure, with a visible saved-data/offline-map status near the trip header.
- Today screen: show the current or manually selected day, the nearest next item only when time data supports it, and a compact unavailable-state banner when online actions cannot run.
- Day screen: keep the ordered list as the source of truth; map context is secondary and must not hide items without coordinates.
- Map screen: show coordinate-backed points, downloaded-area status, and a list fallback for places that cannot appear on the map.
- Place and housing detail screens: keep address text visible even when external navigation is disabled.
- Add place flow: offer search first when available, but keep manual title/address entry always reachable.
- Checklists and reminders: show entry points only if included in the first release; otherwise no dead navigation or teaser that looks actionable.

Critical User Flows:

- Offline map not downloaded before travel: user sees a preparation warning, can still read saved days, places, housing, flights, notes, and included checklists, and can start or retry map download when online.
- Network unavailable after map download: user opens saved trip details and downloaded map area; search, geocoding, external navigation, and routing are not promised.
- Place search or geocoding provider failure: user can save a manual place with title and optional address/comment; the item appears in day plan and place lists immediately.
- Missing coordinates: user sees the place in lists and day plans with a clear "not shown on map yet" state; map renders all other valid points.
- External navigation unavailable: user sees the saved address/coordinates and a disabled or failed "open in maps" action with a concise reason and retry/copy-address fallback if available.
- Unknown trip dates or no matching today: user manually selects a day; the app must not show an empty "Today" as if the trip has no plan.
- Reminder permission denied or reminder feature deferred: event/flight/housing data stays visible; no user data is lost and the UI does not imply a scheduled system notification.

Fallback Behavior Table:

| Scenario | User-facing state | Primary action | Manual/local fallback | Testable UX expectation |
| --- | --- | --- | --- | --- |
| Offline map not downloaded | "Offline map is not downloaded for this trip." | Download when online | Continue with saved lists and details | Saved trip details are readable; UI does not claim map works offline. |
| Network lost with downloaded map | "Offline map is available. Online actions may not work." | Open downloaded map | Use saved day/place/housing/flight/note details | Downloaded area and saved points open without network. |
| Map display provider unavailable | "Map is temporarily unavailable." | Retry map load | Show day/place list and saved details | List remains usable; app does not crash or hide itinerary items. |
| Search/geocoding provider failure | "Search is unavailable. Add the place manually." | Retry search | Save title plus optional address/comment | Manual place can be saved and assigned to a day without coordinates. |
| Place has no coordinates | "Not shown on map yet." | Add or edit address/details | Keep item in list/day plan | Missing-coordinate item remains visible; other pins still render. |
| External navigation unavailable | "Navigation cannot be opened from this device right now." | Retry open in maps | Show/copy address or coordinates where available | Action failure is visible; saved address remains accessible. |
| Place/housing lacks address and coordinates | "Navigation needs an address or coordinates." | Edit item | Read saved notes/details | Navigation action is disabled until usable target data exists. |
| Current day cannot be inferred | "Choose a day to view your plan." | Select day manually | Show all days/manual plan | `Today` fallback is not a misleading empty state. |
| Reminder permission denied | "System notifications are off." | Open system settings or continue | Keep reminder/event visible in app | Denial does not delete the reminder intent or source item. |
| Checklist deferred | No checklist entry point | None | Use notes/manual day items | UI has no broken checklist link in quick access. |

UX Copy Principles For Unavailable And Offline States:

- Say what is available first: saved details, downloaded map, manual entry, readable address.
- Name the unavailable capability narrowly: search, map loading, offline map, external navigation, system notification.
- Give one next action: retry, download map, add manually, edit address, choose day, continue with saved details.
- Avoid broad offline claims. Use "saved details" and "downloaded map area" instead of "works offline."
- Avoid route language unless a real external navigation handoff succeeds. Do not use "route," "optimize," or "navigate offline" for MVP in-app map states.
- Keep copy short enough for a stressed mobile context; one sentence plus one action is the default.
- Write states so QA can assert them by trigger: no network, provider error, missing coordinates, no address, linking failure, notification denied.

First-Release Scope Recommendation For Checklists And Reminders:

- Checklists should remain `Should` and enter the first release only if simple local CRUD plus quick access is complete after Must flows are stable. If deferred, remove checklist quick-access entry points; do not show disabled navigation that looks like a broken feature.
- Reminders should remain deferred behind the first-release scope gate unless notification permission, schedule, cancel, denied-state handling, and local persistence are proven without delaying Must flows. The main screen's nearest-next-item behavior is the MVP fallback for reminders.
- Neither checklists nor reminders should be required for trip creation, day planning, places, maps, housing, flights, notes, offline saved details, or external navigation handoff.

UX Risks:

- Overstating offline support could make users expect offline search, geocoding, routing, or external navigation.
- A map-led error state could hide the reliable fallback: the saved day plan and manual list.
- Missing-coordinate places may feel lost unless they remain visible in the plan and are clearly marked as map-limited.
- Disabled navigation without an address/coordinate explanation will look like a defect rather than a data requirement.
- Keeping deferred checklist/reminder entry points visible can create perceived broken functionality.
- Long fallback copy will be hard to use during travel; states need to be short, specific, and action-led.

Open Questions:

- Product owner: Should the offline-map warning appear persistently before travel until a map is downloaded, or only when the user opens the map/offline status?
- Product owner: Is copying an address an accepted MVP fallback when external navigation cannot open, or should the fallback only show the address?
- Technical architect: Can the selected provider distinguish "map unavailable" from "offline map not downloaded" so the UX can show different states?
- Technical architect: Can downloaded map status be checked locally at app start without network?
- Product owner and technical architect: Should reminders be explicitly out of first release until notification adapter proof is complete?
- QA owner: Which failure fixtures should be mandatory in Gate 00 tests: no network, provider timeout, empty search result, missing coordinates, linking failure, and notification denied?
