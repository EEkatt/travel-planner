# MAP-02A Requirements Addendum

Task ID: TASK-20260704-026
Role: requirements_analyst
Date: 2026-07-04
Status: Ready for quality_lead and lead review

## Purpose

This addendum tightens `MAP-02-REQUIREMENTS-20260704.md` after Quality Lead review. It does not change product scope.

Preserved guardrails:

- MVP geography remains Georgia only.
- Whole-country Georgia offline viewing remains the target, blocked on provider/device proof and owner thresholds.
- Offline map viewing remains separate from offline search, geocoding, routing, turn-by-turn navigation, optimization, traffic, ETA, and live rerouting.
- Card order remains the source of truth for selected-day route order, pin numbers, and planned line sequence.
- Saved cards/lists/details remain the source of truth when map, search, offline tiles, or external handoff fail.

## Addendum Policy For Downstream Work

MAP-03, MAP-04, MAP-07, and MAP-08 must treat this file as an addendum to MAP-02. Where MAP-02 has vague phrases, this file supplies either an objective condition or an explicit dependency gate. Provider-specific behavior may refine implementation details only after MAP-03/MAP-06 evidence and owner approval, without weakening these requirements.

## Canonical Test Geography

These coordinates are deterministic fixtures for requirements, architecture seams, automation, and QA. They are not a complete production border algorithm.

| Coordinate ID | Latitude | Longitude | Classification | Use |
| --- | ---: | ---: | --- | --- |
| `GE_TBILISI_NARIKALA` | 41.68860 | 44.80860 | Inside Georgia; inside `TBILISI_PROOF_AREA` | Search success and Day 1 route. |
| `GE_TBILISI_RIKE` | 41.69370 | 44.81060 | Inside Georgia; inside `TBILISI_PROOF_AREA` | No-day and map-tap success. |
| `GE_TBILISI_LIBERTY` | 41.69300 | 44.80150 | Inside Georgia; inside `TBILISI_PROOF_AREA` | Day route/reorder. |
| `GE_TBILISI_SULFUR_BATHS` | 41.68790 | 44.81120 | Inside Georgia; inside `TBILISI_PROOF_AREA` | Day route/reorder. |
| `GE_MTSKHETA_CATHEDRAL` | 41.84180 | 44.72100 | Inside Georgia; outside `TBILISI_PROOF_AREA` | Outside downloaded area while still in Georgia. |
| `GE_BATUMI_BOULEVARD` | 41.65090 | 41.63600 | Inside Georgia; outside `TBILISI_PROOF_AREA` | Outside downloaded area while still in Georgia. |
| `OUTSIDE_GE_YEREVAN_CASCADE` | 40.19040 | 44.51550 | Outside Georgia | Outside MVP country result/tap. |
| `OUTSIDE_GE_TRABZON_CENTER` | 41.00530 | 39.72640 | Outside Georgia | Secondary outside-country example. |

`TBILISI_PROOF_AREA` is the deterministic partial downloaded-area fixture for MAP-07/MAP-08 before whole-country Georgia proof is accepted:

- Bounding box: latitude `41.60..41.80`, longitude `44.65..44.90`.
- `insideDownloadedArea = true` only when a fixture explicitly sets `downloadAreaId = TBILISI_PROOF_AREA` and the coordinate falls inside that box.
- This proof area does not replace the product target of whole-country Georgia. It is only a test/proof area until MAP-03/MAP-06 prove and owner accepts whole-country Georgia.

Production country classification gate:

- MAP-04 must define one app-owned `classifyCoordinate(latitude, longitude, downloadedArea?)` seam returning `insideGeorgia`, `insideDownloadedArea`, and a reason code.
- Until a production border source is approved, MAP-07/MAP-08 must assert the fixture classifications above exactly.
- Outside-Georgia coordinates must not be silently saved as coordinate-backed trip-map points.

## Canonical Fixture Records

### Shared Days

| Day ID | Title |
| --- | --- |
| `day-1` | `Day 1` |
| `day-2` | `Day 2` |

### Shared Seed Points

All records belong to `trip-georgia-001` unless a fixture says the trip is empty.

| Point ID | Title | Address | Source | Coordinates | Country | Day ID | Route Order | Expected base behavior |
| --- | --- | --- | --- | --- | --- | --- | ---: | --- |
| `pt-noday-rike` | `Rike Park` | `Rike Park, Tbilisi, Georgia` | `manual_map_tap` | `41.69370, 44.81060` | `GE` | `null` | `null` | Gray unnumbered pin in `All` and `No day`; no route line. |
| `pt-noday-text` | `Cafe idea without location` | `null` | `manual_text` | `null` | `null` | `null` | `null` | Card/list only; never a pin. |
| `pt-day1-narikala` | `Narikala Fortress` | `Narikala Fortress, Tbilisi, Georgia` | `search_result` | `41.68860, 44.80860` | `GE` | `day-1` | 1 | Red pin in `All`; numbered red pin `1` in `Day 1`. |
| `pt-day1-no-coord` | `Dinner reservation` | `Old Tbilisi, address to confirm` | `manual_text` | `null` | `GE` | `day-1` | 2 | Ordered card at position 2; no pin; creates visible pin-number gap. |
| `pt-day1-liberty` | `Freedom Square` | `Freedom Square, Tbilisi, Georgia` | `manual_map_tap` | `41.69300, 44.80150` | `GE` | `day-1` | 3 | Numbered red pin `3`; route line uses it after order 1. |
| `pt-day1-baths` | `Sulfur Baths` | `Abanotubani, Tbilisi, Georgia` | `manual_map_tap` | `41.68790, 44.81120` | `GE` | `day-1` | 4 | Numbered red pin `4`; route line sequence after order 3. |
| `pt-day2-mtskheta` | `Svetitskhoveli Cathedral` | `Mtskheta, Georgia` | `search_result` | `41.84180, 44.72100` | `GE` | `day-2` | 1 | Red pin in `All`; selected Day 2 pin `1`; outside `TBILISI_PROOF_AREA`. |
| `pt-address-no-coord` | `Hotel address only` | `Rustaveli Avenue, Tbilisi, Georgia` | `manual_text` | `null` | `GE` | `null` | `null` | Card/list with address; no map pin. |
| `pt-title-only` | `Souvenir shop idea` | `null` | `manual_text` | `null` | `null` | `null` | `null` | Card/list only; Yandex target action disabled. |

### Provider Mock States

| Provider State ID | Network | Provider Response | Expected normalized output |
| --- | --- | --- | --- |
| `provider-online-narikala-success` | `online` | One result: title `Narikala Fortress`, address `Tbilisi, Georgia`, coordinates `41.68860,44.80860`, country `GE`, provider place ID `mock-ge-narikala` | Result may be saved as `source = search_result` with normalized title/address/coordinates only; raw payload not saved. |
| `provider-online-yerevan-success` | `online` | One result: title `Cascade Complex`, address `Yerevan, Armenia`, coordinates `40.19040,44.51550`, country `AM` | Must classify as outside Georgia; no coordinate-backed save by default. |
| `provider-online-empty` | `online` | Empty success result array for query `Atlantis Tbilisi` | No-results state; query preserved; no point saved. |
| `provider-timeout` | `online` | Timeout after app threshold | Provider-failure state; retry and manual add available; no point saved. |
| `provider-quota-error` | `online` | Quota/API error | Provider-failure state; retry and manual add available; no point saved. |
| `provider-malformed` | `online` | Missing required result title or invalid coordinate shape | Provider-failure state; no partial point saved automatically. |
| `provider-offline` | `offline` | No request sent | Offline-search state; manual add available. |
| `map-provider-init-failure` | `online` or `offline` | Tile/style/SDK initialization fails | Map-unavailable state; cards/lists remain readable. |

## Deterministic Fixture Matrix

| Fixture ID | Seed records and state | Expected outputs |
| --- | --- | --- |
| `map_empty_trip` | `trip-georgia-empty`; no points; network `online`; provider map available; mode `All`; download status `not_downloaded` | Empty trip map/list state appears; zero pins; zero route lines; actions include add place and explicit online search; user can continue to day/cards surfaces. |
| `map_online_ready_basic` | Points `pt-noday-rike`, `pt-day1-narikala`, `pt-day1-liberty`; network `online`; provider map available; mode `All`; download status `not_downloaded` | Map surface initializes without error; pan and zoom controls/gestures remain available; pins and cards reflect the same three coordinate-backed records; selecting a pin or card keeps the same point ID in focus; switching to `Day 1` shows only Day 1 pins and planned line. |
| `map_all_mixed_points` | Points `pt-noday-rike`, `pt-noday-text`, `pt-day1-narikala`, `pt-day1-no-coord`, `pt-day1-liberty`, `pt-day2-mtskheta`; mode `All`; network `online` | Pins: `pt-noday-rike` gray, `pt-day1-narikala` red, `pt-day1-liberty` red, `pt-day2-mtskheta` red; no route line; no pin numbering requirement; no-coordinate records visible in cards only. |
| `map_no_day_mixed` | Points `pt-noday-rike`, `pt-noday-text`, `pt-address-no-coord`, `pt-day1-narikala`; mode `No day`; network `online` | One gray pin for `pt-noday-rike`; no red pins; no route line; no-coordinate no-day cards visible with add/edit location action when coordinate editing is implemented, otherwise dependency-gated. |
| `map_no_day_empty` | Points `pt-day1-narikala`, `pt-day1-liberty`, `pt-day2-mtskheta`; mode `No day`; network `online` | Empty no-day state; zero pins; zero route lines; actions include add no-day place and switch to `All`; search action available only online. |
| `map_day_empty` | Points `pt-noday-rike`, `pt-day2-mtskheta`; selected `day-1`; network `online` | Empty selected-day state; zero pins; zero route lines; action adds a place to `day-1`; user can switch filters or open day plan. |
| `map_day_three_coordinate_points` | Points `pt-day1-narikala` routeOrder 1, `pt-day1-liberty` routeOrder 2, `pt-day1-baths` routeOrder 3; selected `day-1`; network `online` | Red numbered pins `1`, `2`, `3`; card order `[pt-day1-narikala, pt-day1-liberty, pt-day1-baths]`; app-owned route-line model `[(41.68860,44.80860),(41.69300,44.80150),(41.68790,44.81120)]`; no no-day pins. |
| `map_day_order_with_missing_coordinate` | Points `pt-day1-narikala` order 1, `pt-day1-no-coord` order 2, `pt-day1-liberty` order 3, `pt-day1-baths` order 4; selected `day-1` | Cards show orders `1..4`; visible pins are `1`, `3`, `4`; no pin `2`; route-line model `[(41.68860,44.80860),(41.69300,44.80150),(41.68790,44.81120)]`; routeOrder values are not renumbered around missing coordinates. |
| `map_reorder_day_cards` | Initial `day-1` order: `pt-day1-narikala` 1, `pt-day1-liberty` 2, `pt-day1-baths` 3; action moves `pt-day1-liberty` to first; network `online` | Final order: `pt-day1-liberty` 1, `pt-day1-narikala` 2, `pt-day1-baths` 3; pins renumber to `1,2,3`; route-line model `[(41.69300,44.80150),(41.68860,44.80860),(41.68790,44.81120)]`; selected `day-1` remains active. |
| `map_assign_clear_day` | Initial: `pt-noday-rike` no-day, `pt-day1-narikala` order 1, `pt-day1-liberty` order 2; action assign `pt-noday-rike` to `day-1` | After assign: `pt-noday-rike.dayId = day-1`, `routeOrder = 3`, red numbered pin `3`, removed from `No day`; after clear: `dayId = null`, `routeOrder = null`, gray pin in `All`/`No day`, removed from Day 1 route line. |
| `point_address_no_coordinates` | Point `pt-address-no-coord`; any relevant mode | Card/list remains visible; no pin; Yandex target may use address only if MAP-03/MAP-09 and owner approve address handoff; otherwise saved address remains readable. |
| `point_no_address_no_coordinates` | Point `pt-title-only`; any relevant mode | Card/list remains visible; no pin; `Open in Yandex Maps` disabled/unavailable with add address/location guidance. |
| `map_tap_success_georgia_no_day` | Network `online`; provider map available; tap `GE_TBILISI_RIKE`; save title `Rike Park View`, day choice `No day` | Created point: deterministic test ID `pt-created-tap-noday-rike`, title `Rike Park View`, `source = manual_map_tap`, coordinates `41.69370,44.81060`, `countryCode = GE`, `dayId = null`, `routeOrder = null`; gray pin in `All` and `No day`; card visible. |
| `map_tap_success_georgia_day` | Network `online`; selected `day-1`; existing Day 1 orders 1 and 2; tap `GE_TBILISI_SULFUR_BATHS`; save title `Sulfur Baths`, day choice `Day 1` | Created point: deterministic test ID `pt-created-tap-day1-baths`, title `Sulfur Baths`, `source = manual_map_tap`, coordinates `41.68790,44.81120`, `countryCode = GE`, `dayId = day-1`, `routeOrder = 3`; red numbered pin `3`; route-line model appends coordinate after existing orders. |
| `map_search_online_success_georgia` | Provider state `provider-online-narikala-success`; query `Narikala Fortress`; save to `day-1` with existing orders 1 and 2 | Created point: deterministic test ID `pt-created-search-narikala`, title `Narikala Fortress`, address `Tbilisi, Georgia`, `source = search_result`, coordinates `41.68860,44.80860`, `countryCode = GE`, `dayId = day-1`, `routeOrder = 3`, `providerPlaceId = mock-ge-narikala` only if terms/security approve; no raw provider payload saved. |
| `map_search_outside_georgia_result` | Provider state `provider-online-yerevan-success`; query `Cascade Complex`; selected result coordinates `40.19040,44.51550` | Outside-Georgia warning; no coordinate-backed point saved by default; options are search again or manual note-only save with `coordinates = null` only if owner policy allows it. |
| `map_tap_outside_georgia` | Network `online`; tap `OUTSIDE_GE_YEREVAN_CASCADE`; provider map available | Outside MVP/Georgia state; no coordinate-backed point and no temporary persisted pin; manual note-only save is owner-policy-gated. |
| `map_tap_outside_downloaded_area_offline` | Network `offline`; `downloadStatus = downloaded`; `downloadAreaId = TBILISI_PROOF_AREA`; tap `GE_MTSKHETA_CATHEDRAL` | Classification `insideGeorgia = true`, `insideDownloadedArea = false`; outside-downloaded-area warning; return-to-downloaded-area action when map bounds are known; saved cards/lists readable; no offline search/geocoding/routing copy. |
| `map_outside_downloaded_area_inside_georgia` | Network `offline`; downloaded `TBILISI_PROOF_AREA`; current map center `GE_BATUMI_BOULEVARD` | State is `outside_downloaded_area`, not outside Georgia; cards/lists readable; no claim that whole-country Georgia is downloaded unless MAP-03/MAP-06 proof accepted whole-country pack. |
| `map_search_no_results` | Provider state `provider-online-empty`; query `Atlantis Tbilisi` | No-results state; query preserved exactly; refine search and add manually available; no point saved. |
| `map_search_provider_failure` | Provider state one of `provider-timeout`, `provider-quota-error`, `provider-malformed`; query preserved | Provider-failure state; retry available while online; add manually available; no point saved automatically. |
| `map_search_offline` | Provider state `provider-offline`; query `Narikala Fortress` | Search disabled or offline-search state appears; no request sent; add manually available; no offline search/geocoding promise. |
| `map_provider_failure` | Provider state `map-provider-init-failure`; seed points `pt-noday-rike`, `pt-day1-narikala`, `pt-day1-no-coord` | Map-unavailable state; retry map shown only if failure is retryable and provider/network state allows; all cards/lists remain readable; no saved data deleted. |
| `map_offline_downloaded` | Network `offline`; provider proof accepted for `TBILISI_PROOF_AREA`; download status `downloaded`; seed Day 1 coordinate points in proof area | Downloaded map opens after app restart with network disabled; saved pins render; selected-day planned line renders for at least two coordinate-backed points; search/geocoding/routing/navigation actions absent or clearly unavailable; copy limited to offline map viewing. |
| `map_offline_not_downloaded` | Network `offline`; download status `not_downloaded`; saved points exist | Offline-not-downloaded state; saved cards/lists/details readable; download/retry deferred until online; no working search/geocode/routing promise. |
| `yandex_missing_target` | Point `pt-title-only`; network any | External map action disabled/unavailable; guidance asks user to add address or location; point details remain readable. |
| `yandex_handoff_failure` | Point `pt-day1-narikala`; deep link/app open returns failure | Handoff-failure state; saved address and coordinates remain readable; web fallback/copy fallback only if owner approves; no guaranteed Yandex wording. |
| `copy_negative_assertions` | Render map/offline/search/route/handoff states in Russian UI | Approved terms present where relevant; prohibited terms absent, except in explicit educational/QA text outside production UI. |

## Online Map Readiness Acceptance Criteria

Given `map_online_ready_basic`,
When the user opens the Map tab while online and the provider map is available,
Then the map initializes without a map-unavailable state,
And pan and zoom are usable,
And rendered pins and visible cards refer to the same saved point IDs,
And changing from `All` to `Day 1` updates pins, card membership, and planned-line model from the same source records,
And no offline-download, routing, navigation, optimization, traffic, or travel-time claim is shown.

## Empty-State Acceptance Criteria

### Empty Trip

Given `map_empty_trip`,
When the user opens the Map tab in `All` mode,
Then the map/list surface shows an empty trip state,
And no pins, pin numbers, or route lines are rendered,
And the user can start by adding a place manually or through explicit online search when online,
And saved day/list navigation remains available.

### Empty No-Day

Given `map_no_day_empty`,
When the user selects `No day`,
Then the no-day empty state appears,
And no pins or route lines are rendered,
And the user can add a no-day place,
And the user can switch back to `All`,
And online search appears only when network and provider state allow online search.

### Empty Selected Day

Given `map_day_empty`,
When the user selects `Day 1`,
Then the selected-day empty state appears,
And no pins, pin numbers, or route lines are rendered,
And the primary add action defaults the day choice to `Day 1`,
And the user can switch filters or open the day plan.

## Successful Georgia Map-Tap Acceptance Criteria

Given `map_tap_success_georgia_no_day`,
When the user taps inside Georgia, enters `Rike Park View`, chooses `No day`, and saves,
Then the app creates exactly `pt-created-tap-noday-rike`,
And the point has `source = manual_map_tap`, coordinates `41.69370,44.81060`, `countryCode = GE`, `dayId = null`, and `routeOrder = null`,
And it appears as a gray unnumbered pin in `All` and `No day`,
And it does not appear in selected-day route lines.

Given `map_tap_success_georgia_day`,
When the user taps inside Georgia, enters `Sulfur Baths`, chooses `Day 1`, and saves,
Then the app creates exactly `pt-created-tap-day1-baths`,
And the point has `source = manual_map_tap`, coordinates `41.68790,44.81120`, `countryCode = GE`, `dayId = day-1`, and the next route order for Day 1,
And it appears as a red numbered Day 1 pin using that appended route order,
And the selected-day planned line sequence includes the new point after the previous last coordinate-backed Day 1 point.

## Outside Georgia And Outside Downloaded Area Acceptance

Outside Georgia:

- Example coordinates: `OUTSIDE_GE_YEREVAN_CASCADE` (`40.19040,44.51550`) and `OUTSIDE_GE_TRABZON_CENTER` (`41.00530,39.72640`).
- Expected classification: `insideGeorgia = false`, `insideDownloadedArea = false`.
- Expected behavior: no silent coordinate-backed save, no persisted pin, no route-line inclusion, and copy names the result as outside the Georgia MVP map.

Outside downloaded area but inside Georgia:

- Example coordinates: `GE_MTSKHETA_CATHEDRAL` (`41.84180,44.72100`) and `GE_BATUMI_BOULEVARD` (`41.65090,41.63600`) when the downloaded fixture area is `TBILISI_PROOF_AREA`.
- Expected classification: `insideGeorgia = true`, `insideDownloadedArea = false`.
- Expected behavior: outside-downloaded-area state, return-to-downloaded-area when bounds are known, saved details remain readable, and no offline tile/search/geocode/routing promise outside the downloaded area.

## Provider Proof Artifact Expectations For MAP-03/MAP-06

MAP-03 may research candidate providers and proof plans. MAP-06 may execute native/device proof. No provider/offline claim is accepted until the following artifacts exist and are reviewed.

| Artifact ID | Required evidence | Pass/fail dependency |
| --- | --- | --- |
| `proof-provider-terms` | Provider name/version, plan/SKU, terms links or excerpts, offline/cache rules, search/autocomplete rules, attribution rules, pricing/rate limits, API key model, data retention allowance for selected normalized results. | MAP-03/MAP-09 review required before production use. |
| `proof-native-render-ios` | iOS development build identifier, device/simulator model and OS, provider SDK/package versions, screenshot or video of Georgia map render, logs showing successful initialization. | Required; Expo Go/web does not satisfy. |
| `proof-native-render-android` | Android development build identifier, device/emulator model and OS, provider SDK/package versions, screenshot or video of Georgia map render, logs showing successful initialization or documented blocker. | Required or blocker must be explicit. |
| `proof-pack-download` | Area ID, bounds/geometry, zoom/style scope, start/end timestamps, measured download duration, downloaded byte size, on-device storage delta before/after, progress/error-state screenshots or logs. | Owner thresholds for size/duration/storage must be answered before accept/reject. |
| `proof-pack-inventory-restart` | Pack inventory before restart, after app restart, and after device/network state change using `getPacks` or equivalent; screenshots/logs with pack IDs. | Must survive restart for `downloaded` state. |
| `proof-network-disabled-reopen` | Steps: download while online, force quit, disable Wi-Fi/cellular, reopen app, open map area; screenshots/video of offline map render and logs proving no network tile fetch dependency. | Required before offline downloaded map viewing claim. |
| `proof-offline-overlays` | Network-disabled evidence that saved pins and selected-day planned line render over downloaded map using MAP-02A fixture points. | Must show overlays, not only base tiles. |
| `proof-attribution` | Online/offline screenshots showing required attribution placement and text; notes for dark/light map if applicable. | Required before release UI acceptance. |
| `proof-cleanup-delete` | Pack delete/cleanup steps, storage before/after, pack inventory after delete and restart, failure handling evidence. | Required to avoid unbounded storage. |
| `proof-key-privacy-logging` | Key restriction model, logs redacted of API keys/private location traces, diagnostic fields list, provider request logging policy. | MAP-09/security gate. |
| `proof-search-normalization` | Search query fixture, normalized output fields, failure/error payload classes, proof that raw provider payload is not saved unless approved. | Required for online search provider acceptance. |

Whole-country Georgia remains a target, not accepted proof, until `proof-pack-download`, `proof-pack-inventory-restart`, `proof-network-disabled-reopen`, `proof-offline-overlays`, `proof-attribution`, and `proof-cleanup-delete` are produced for whole-country Georgia or an owner-approved Georgia fallback.

## Owner Threshold Questions Blocking Acceptance

These require owner decisions before MAP-03 can accept a provider path or MAP-06 can accept offline proof:

1. Maximum whole-country Georgia offline pack size in MB/GB.
2. Maximum acceptable download duration on a representative mobile connection.
3. Maximum acceptable storage footprint after download, including cache/index overhead and cleanup expectations.
4. Representative proof area for first MAP-06 device proof: whole-country Georgia, `TBILISI_PROOF_AREA`, or another owner-approved Georgia area.
5. Whether one downloaded area per trip is acceptable for MVP if whole-country Georgia is impractical.
6. If whole-country Georgia fails thresholds, which fallback model is approved first: regions, cities, or one manually chosen Georgia area per trip.

Until these are answered, provider discovery can continue, but provider acceptance and offline-map release claims are blocked.

## Russian Copy Terms

Approved Russian terms for production UI copy:

| Concept | Approved terms |
| --- | --- |
| Planned selected-day line | `порядок дня`, `плановый порядок`, `линия порядка точек`, `показывает порядок мест` |
| Offline map viewing | `офлайн-карта`, `карта загружена`, `загруженная область карты`, `можно смотреть карту и сохраненные места без интернета` |
| Saved data still works | `сохраненные места доступны`, `список поездки доступен`, `заметки и адреса сохранены` |
| Online search unavailable offline | `поиск доступен только онлайн`, `добавьте место вручную` |
| Outside Georgia | `это место вне карты Грузии в MVP`, `вне поддерживаемой области Грузии` |
| Outside downloaded area | `вне загруженной области`, `вернуться к загруженной области` |
| External handoff | `открыть в Яндекс Картах`, `не удалось открыть Яндекс Карты`, `адрес и координаты сохранены` |

Prohibited Russian terms for MVP production UI copy unless a later owner-approved scope change and provider proof explicitly allow them:

| Prohibited term | Reason |
| --- | --- |
| `офлайн-поиск` | Offline search is out of scope. |
| `офлайн-геокодинг` | Offline geocoding is out of scope. |
| `офлайн-маршрут` / `маршрут офлайн` | Offline routing is out of scope. |
| `навигация` / `ведение по маршруту` / `пошаговая навигация` | Turn-by-turn navigation is out of scope. |
| `оптимальный маршрут` / `оптимизация маршрута` | Route optimization is out of scope. |
| `пробки` / `трафик` | Traffic is out of scope. |
| `время в пути` / `ETA` / `прибытие через` | Travel time/ETA is out of scope. |
| `перестроение маршрута` | Live rerouting is out of scope. |
| `работает везде` / `любая страна` / `весь мир офлайн` | MVP is Georgia only. |
| `Яндекс Карты всегда откроются` | External handoff cannot be guaranteed. |

Copy objective condition:

- MAP-07 copy scans must fail if prohibited terms appear in user-visible map, offline, search, route, or handoff states.
- Approved terms are allowed, but UI does not have to use every approved term.

## Replacement For Vague Clauses

| Vague clause in MAP-02 | Replacement condition or gate |
| --- | --- |
| `where supported` for add/edit location or address | A control is test-required only after MAP-04 defines the edit-location capability and MAP-05 implements it. Before that, the objective requirement is that no-coordinate records remain visible and do not render pins. |
| `when meaningful` for retry map | Retry is shown only when the failure class is retryable: transient network, timeout, tile/style load failure, or SDK initialization failure after dependencies are present. Retry is not required for missing provider credentials, unsupported platform, blocked terms, or offline not-downloaded state; those show the specific blocking state instead. |
| `usable address` for Yandex handoff | A usable address is a non-empty saved address string with at least one non-whitespace character after trimming and an owner-approved Yandex address handoff policy. Coordinates take priority when present. If address handoff is not approved, display address only. |
| `supported Georgia scope` | For MAP-07/MAP-08 fixtures, supported Georgia means `insideGeorgia = true` per the canonical fixture table. For production, MAP-04 must route all checks through the app-owned geography classification seam backed by an approved border/provider source. |
| `provider label mechanics` | If a provider forces marker labels in `All` or `No day`, labels must not equal routeOrder and UI copy must not call them route numbers. MAP-07 should assert no app-owned route number labels in these modes. |
| `once persistence exists` for reorder restart | Two stages are required: in-memory acceptance before persistence implementation, and restart persistence acceptance only after MAP-04/MAP-05 define storage. MAP-07 must label tests by stage. |
| `manual note-only save if product allows it` | Default is blocked for coordinate-backed save. Manual note-only outside-Georgia save remains owner-policy-gated; until decided, tests assert no coordinate-backed save and no pin. |
| `return-to-downloaded-area when supported` | Required when downloaded area bounds are known in app state. If provider does not expose bounds, MAP-03/MAP-04 must record that blocker and provide an alternate visible outside-area recovery action. |
| `autocomplete allowed if provider permits` | Explicit search submission is the MVP requirement. Autocomplete is disabled unless MAP-03 proves terms/limits/pricing/key model and owner/security accept it. |

## Route-Line Observability For Tests

Automation must not rely only on visual inspection of a map canvas. MAP-04/MAP-05 should expose an app-owned planned-line model or test hook with:

- selected `dayId`;
- ordered point IDs included in the line;
- ordered coordinate sequence;
- excluded no-coordinate point IDs;
- line type `planned_order`, not `routing`.

For `map_day_order_with_missing_coordinate`, the expected line model is:

```json
{
  "dayId": "day-1",
  "lineType": "planned_order",
  "includedPointIds": ["pt-day1-narikala", "pt-day1-liberty", "pt-day1-baths"],
  "excludedPointIds": ["pt-day1-no-coord"],
  "coordinates": [
    {"latitude": 41.68860, "longitude": 44.80860},
    {"latitude": 41.69300, "longitude": 44.80150},
    {"latitude": 41.68790, "longitude": 44.81120}
  ]
}
```

## Reorder Test Hook Requirement

MAP-07 needs a deterministic reorder path. MAP-04/MAP-05 must provide at least one of:

- explicit move-up/move-down controls with stable accessibility labels containing the point title and direction;
- a documented accessible drag pattern with stable test IDs and deterministic post-drag order assertions.

Pin dragging remains outside MVP route-order editing.

## Closure Against Quality Lead Gaps

| Quality Lead gap | Addendum closure |
| --- | --- |
| Empty trip and empty selected-day behavior under-specified | Added `map_empty_trip`, explicit empty trip/no-day/selected-day acceptance. |
| Online map readiness implicit | Added `map_online_ready_basic` and online map readiness acceptance for initialization, pan/zoom, card/pin synchronization, and filter transition. |
| Successful map-tap lacks fixture | Added `map_tap_success_georgia_no_day` and `map_tap_success_georgia_day`. |
| Geography predicates undefined | Added canonical fixture classifications, `TBILISI_PROOF_AREA`, outside-country and outside-downloaded examples, and MAP-04 classification seam requirement. |
| Provider proof lacks thresholds | Added proof artifact expectations and explicit owner threshold blockers. |
| Vague test clauses | Replaced each named phrase with objective conditions or dependency gates. |
| Exact fixtures missing | Added seed points, provider states, fixture matrix, and expected route-line models. |
| Route-line observability missing | Added app-owned planned-line model/test hook expectation. |
| Persistence/restart boundaries unclear | Split in-memory and restart-persistence acceptance stages. |
| Russian copy allow/deny missing | Added approved and prohibited Russian terms. |
| Accessibility reorder hook missing | Added deterministic reorder test hook requirement. |

## Downstream Use

- MAP-03 should use provider states, proof artifacts, and owner threshold blockers to structure provider discovery.
- MAP-04 should use fixture records, geography classification seam, route-line model, provider adapter seams, and persistence-stage gates for architecture framing.
- MAP-07 should seed these exact records and assert expected visible states, copy scans, and route-line models.
- MAP-08 should use the same fixtures for manual QA, especially empty states, outside Georgia, outside downloaded area, offline downloaded/not-downloaded, and copy-negative checks.
