# MAP-03 Provider Discovery

Task ID: TASK-20260704-027
Role: map_provider_engineer
Date: 2026-07-04
Status: Ready for technical_analyst and security_reviewer review
Recommendation: Accepted for discovery only; blocked for production provider acceptance.

## Scope And Guardrails

This report frames provider options for Georgia offline map viewing, online search, optional autocomplete, attribution, API key handling, and proof evidence. It does not select or implement a production provider.

Guardrails inherited from MAP-02/MAP-02 quality review:

- MVP geography is Georgia only.
- Offline means downloaded map viewing, saved points, saved details, zoom/pan inside downloaded area, and selected-day planned order line only.
- Do not promise offline search, offline geocoding, offline routing, navigation, optimization, traffic, ETA, or live rerouting.
- Whole-country Georgia offline support is a target, not an accepted claim, until provider/device proof and owner thresholds exist.
- Public Nominatim must not be used for production autocomplete.
- Saved app cards/lists/details remain source of truth when map/search/provider/handoff fails.

## Read-Only Context Read

- `agent_workspace/reports/MAP-02-REQUIREMENTS-20260704.md`
- `agent_workspace/reports/REVIEW-MAP-02-REQUIREMENTS-BY-QUALITY-20260704.md`
- `agent_workspace/reports/MAP-LEAD-DECISION-AFTER-MAP-02-QUALITY-20260704.md`
- `agent_workspace/reports/GATE-00-MAP-PROVIDER-20260704.md`
- `architecture/16_offline_map_provider_research.md`
- `architecture/15_security_and_resilience.md`
- `app/mobile/package.json`

## Source Baseline

Source links checked on 2026-07-04. These are discovery inputs, not legal approval.

- MapLibre React Native getting started: https://maplibre.org/maplibre-react-native/docs/setup/getting-started/
- MapLibre React Native Expo setup: https://maplibre.org/maplibre-react-native/docs/setup/expo/
- MapLibre React Native OfflineManager: https://maplibre.org/maplibre-react-native/docs/modules/offline-manager/
- MapTiler Cloud terms: https://www.maptiler.com/terms/cloud/
- MapTiler pricing: https://www.maptiler.com/cloud/pricing/
- MapTiler geocoding API: https://docs.maptiler.com/cloud/api/geocoding/
- MapTiler API key docs: https://docs.maptiler.com/cloud/api/authentication-key/
- Stadia Maps terms: https://stadiamaps.com/terms-of-service/
- Stadia Maps authentication: https://docs.stadiamaps.com/authentication/
- Stadia Maps attribution: https://docs.stadiamaps.com/attribution/
- Mapbox iOS offline maps docs: https://docs.mapbox.com/ios/maps/guides/offline/
- Mapbox Geocoding API docs: https://docs.mapbox.com/api/search/geocoding/
- rnmapbox install docs: https://rnmapbox.github.io/docs/install
- rnmapbox OfflineManager docs: https://github.com/rnmapbox/maps/blob/main/docs/OfflineManager.md
- OSMF Nominatim policy: https://operations.osmfoundation.org/policies/nominatim/
- OSMF tile usage policy: https://operations.osmfoundation.org/policies/tiles/

## Provider Candidate Matrix

| Candidate | Role | Offline map fit | Search/geocoding fit | Terms/key/attribution notes to verify | Discovery decision |
| --- | --- | --- | --- | --- | --- |
| MapLibre React Native + provider style/tiles | Renderer only | Strong renderer candidate. Docs say it wraps native Android/iOS MapLibre, requires RN >= 0.80 and new architecture from v11, cannot run in Expo Go, and exposes `OfflineManager.createPack`, `getPacks`, `deletePack`, and tile count limit controls. Current app package versions are Expo `~56.0.12`, RN `0.85.3`, React `19.2.3`, so package-level fit appears plausible. | None by itself. Requires a separate `PlaceSearchProvider`. | MapLibre docs explicitly require own production style/tiles or a provider such as Stadia/MapTiler. Tile host terms govern offline pack legality. | Accepted for discovery/spike renderer path only. Not a production provider by itself. |
| Stadia Maps with MapLibre | Tile/style provider plus optional search | Terms observed: bulk downloading is prohibited except small mobile offline cache, with a stated 100 MB cached-at-a-time per-device exception. This may be too small for whole-country Georgia or high zoom. Must measure. | Stadia offers geocoding/search docs including autocomplete in navigation, but storage rights require plan/permission review. Terms observed prohibit permanent geocoding result storage without an active Standard/Professional/Enterprise subscription with appropriate permissions. | Mobile apps use API keys. Docs warn mobile key security is tricky and recommend avoiding shipping keys where possible, secured long-term storage, rotation, and usage monitoring. Attribution must remain visible/prominent; standard maps attribution includes Stadia Maps, OpenMapTiles, and OpenStreetMap. | Plausible first tile/style candidate for small bounded proof because terms mention limited mobile offline caching. Blocked for whole-country Georgia until size proof and owner threshold. |
| MapTiler Cloud with MapLibre | Tile/style provider plus search | Terms observed allow temporary personal end-user device cache, but export usage and batch/excessive tile bulk download require custom agreement unless otherwise agreed. Intentional trip-area/offline-pack downloading is therefore a verification blocker for the selected plan/agreement. | Geocoding API supports `country`, `limit <= 10`, and `autocomplete` default true. Pricing page describes Search & Geocoding with autocomplete and session/request billing concepts. | Own API key required. Docs warn public requests expose keys and recommend a new protected key per application with origin or user-agent restrictions. MapTiler attribution is required while maps are displayed unless otherwise agreed. | Plausible, but blocked for offline pack use until MapTiler confirms the chosen plan/agreement permits prepared Georgia trip packs. |
| rnmapbox/maps + Mapbox | Renderer/SDK plus Mapbox tiles/styles/search | Technical fit: requires Mapbox token and custom native code, cannot run in Expo Go; OfflineManager exists. Mapbox offline docs say SDK supports downloading map data for specific regions/zoom levels and warns about storage, refresh, dynamic feature limits, user region management, and a 750 unique tile-pack cumulative limit. | Mapbox Geocoding supports autocomplete, `country`, `bbox`, `limit <= 10`; default geocoding rate limit observed as 1000 requests/minute. v6 Geocoding no longer provides POI data; POI search points to Search Box API. | Access token and Mapbox terms/pricing required. Temporary geocoding results are not cacheable; permanent storage requires a credit card on file or enterprise contract and `permanent=true`. Geocoding API responses may only be used with a Mapbox map. | Fallback candidate if MapLibre/provider path fails or owner accepts deeper Mapbox lock-in. Blocked for production until cost, token, offline, POI/search, and storage terms are reviewed. |
| react-native-maps + LocalTile + custom/self-hosted tiles | Renderer fallback/prototype | LocalTile can display local XYZ tiles, but does not solve legal tile acquisition, pack creation, updates, pack inventory, style/glyphs, or region download UX by itself. Android needs map type handling to avoid base map tiles under local tiles. | None by itself. | Requires a legally obtained tile package/source. Public OSM tiles are not viable for offline download. | Rejected as primary provider path for MVP offline packs; keep only as narrow prototype/fallback if native offline SDKs fail. |
| Public OSM `tile.openstreetmap.org` | Public raster tile server | Not acceptable. OSMF tile policy says offline use/download city or country/prefetch is not permitted on `tile.openstreetmap.org`; use self-hosted tiles or a provider that explicitly allows offline/prefetching. | None. | Requires attribution and identifiable User-Agent even for normal viewing; no SLA. | Rejected for offline maps and production prefetch. |
| Public Nominatim | Public geocoder | No offline map role. | Not acceptable for production autocomplete. OSMF Nominatim policy allows user-triggered moderate searches under limits, but explicitly forbids autocomplete implemented client-side using the public API. | Public service has limited capacity, requires identifiable User-Agent/Referer and attribution, and warns commercial apps about withdrawal risk. Do not send personal/confidential material. | Rejected for production autocomplete. Possible development/manual low-volume explicit-search reference only if deliberately approved; not a production provider. |
| Self-hosted OSM/OpenMapTiles/PMTiles-style pipeline | Tile/style/data pipeline | Could theoretically satisfy whole-country Georgia offline without third-party offline cache limits, but requires tile generation, licensing compliance, hosting/update pipeline, mobile package/loading proof, style/glyph/sprite handling, storage measurement, and operational ownership. | Separate search stack required, likely self-hosted Nominatim/Pelias/Photon or commercial API. | ODbL attribution/share-alike obligations and operational cost need review. No API key exposure for local packaged tiles, but data freshness and updates become app/operator responsibility. | Blocked as too large for first MVP unless hosted providers fail and owner accepts operations cost. |

## Renderer, Tile, And Style Distinction

These must not be conflated in architecture, QA, or owner decisions.

| Layer | What it does | Examples | MAP-03 implication |
| --- | --- | --- | --- |
| Renderer / SDK | Native map component that draws tiles, symbols, overlays, gestures, camera, and offline pack APIs. | MapLibre React Native, rnmapbox/maps, react-native-maps. | Selecting a renderer does not grant legal tile access or search. MapLibre remains the best discovery renderer path. |
| Tile data | Actual map data fetched or downloaded: vector tiles, raster tiles, glyphs, sprites, terrain, satellite imagery. | Stadia tiles, MapTiler tiles, Mapbox tiles, self-hosted OpenMapTiles, OSM public tiles. | Offline legality, pack size, cache limits, attribution, and freshness belong here. Whole-country Georgia proof is mostly a tile-data question. |
| Style | JSON/rules/assets that tell the renderer how to display vector tile layers and labels. | MapLibre style JSON, Stadia styles, MapTiler styles, Mapbox styles. | A style may reference tile sources, glyphs, sprites, and imagery with separate URLs and attribution. Offline proof must confirm all style dependencies are cached. |
| Search/geocoding | Online text query/autocomplete to candidate places and coordinates. | MapTiler Geocoding, Stadia Geocoding, Mapbox Geocoding/Search Box, self-hosted Nominatim/Pelias. | Search is online-only for MVP. Storage rights for normalized selected results are separate from tile rights. |

## Search, Geocoding, And Autocomplete Options

Baseline product policy:

- Explicit submitted online search is required when a production provider is available.
- Autocomplete is optional and must remain off unless provider terms, pricing, limits, attribution, and key model are accepted.
- Offline search/geocoding is out of MVP scope.
- Provider result save must normalize only approved fields: title, address/description, coordinates if allowed, country code, provider key/name, provider place ID only if terms/security approve.
- Raw provider payloads, private location logs, API keys, and full request logs are not approved canonical fields.

Options:

| Option | Discovery notes | Constraints |
| --- | --- | --- |
| MapTiler Geocoding | Supports country filtering, result limit up to 10, and autocomplete toggle/default true. Search & Geocoding appears on pricing page. | Must confirm plan quotas/cost, Georgia coverage quality, whether selected normalized result storage is allowed, attribution requirements for search-only displays, and mobile key restriction model. |
| Stadia Geocoding/Search | Docs expose geocoding/search categories and autocomplete-specific docs navigation. Terms mention permanent geocoding result storage requires active Standard/Professional/Enterprise subscription with appropriate permissions. | Must confirm selected plan, autocomplete pricing/limits, Georgia POI coverage, permanent storage of saved selected fields, and whether place IDs/attributions may be stored. |
| Mapbox Geocoding/Search Box | Geocoding supports country/bbox/limit/autocomplete and rate limit docs; v6 Geocoding does not provide POI data, so POI search likely requires Search Box. | Mapbox lock-in: geocoding responses may only be used with a Mapbox map. Temporary results are not cacheable; permanent storage has account/contract requirements. Autocomplete can bill per keystroke. |
| Public Nominatim | Can be useful to understand OSM search behavior manually or in very limited non-production explicit search experiments. | Not production autocomplete. Public policy forbids autocomplete via the API, limits public service traffic, and warns commercial apps about withdrawal risk. |
| Self-hosted Nominatim/Pelias/Photon | Could avoid public API usage limits and permit offline/controlled search only if built and operated. | Out of MVP unless owner accepts infrastructure, data updates, relevance tuning, ODbL/compliance, storage footprint, and mobile/offline search scope expansion. |

Autocomplete decision for first implementation gate:

- Default to explicit submitted search only.
- Add debounce/minimum-character autocomplete only after provider acceptance and quota budget.
- For any provider with autocomplete enabled by default, adapter must explicitly set `autocomplete=false` for submitted-search mode if supported.
- Autocomplete test fixtures must count requests and enforce cancellation/debounce behavior before release.

## Terms, Limits, API Key, And Attribution Questions To Verify

These questions block production acceptance. They are intentionally phrased as verification items, not settled conclusions.

Tile/style/offline:

1. Does the chosen provider and plan explicitly allow user-triggered trip-area offline downloads through a native offline pack API?
2. Is whole-country Georgia allowed, or is it considered bulk download/export/prefetch beyond the plan?
3. Are there per-device cache limits, tile count limits, region limits, monthly tile/session quotas, or retention limits?
4. Are glyphs, sprites, terrain, satellite layers, and style JSON covered by the same offline/cache permission?
5. Can downloaded packs persist across app restart and remain available with network disabled?
6. Can packs be deleted/cleaned up without violating cache/update terms?
7. Is there a required refresh/update interval or stale-data disclaimer?

Search/geocoding:

1. Are explicit submitted search and autocomplete both permitted from a mobile client?
2. What are the exact request quotas/rate limits and overage costs for search and autocomplete?
3. Does autocomplete bill or count per keystroke/request/session?
4. Can results be filtered to Georgia (`GE`) and/or a Georgia bbox?
5. Does provider coverage include Georgia landmarks/POIs relevant to travel, not only addresses?
6. May the app store selected normalized title/address/coordinates/country/provider/place ID indefinitely?
7. Are raw responses, provider place IDs, and attribution tokens allowed or disallowed in local storage?
8. What attribution is required when a saved provider result appears later offline or without a map?

API key/security:

1. Does the provider support public mobile keys, app/user-agent restrictions, package/bundle restrictions, short-lived tokens, or server-issued scoped tokens?
2. Can keys be rotated without app update?
3. Can separate keys be used for maps and search?
4. What monitoring, caps, alerts, and abuse response are available?
5. Are API keys ever logged by SDKs, error handlers, native crash logs, or request traces?
6. Is using a proxy allowed, required, or prohibited by provider terms?

Attribution:

1. Exact attribution text and links for online map, offline map, search result list, and saved point detail.
2. Whether attribution must be visible on the map at all times or can move to an about/legal surface in certain offline/error states.
3. Whether provider-supplied automatic attribution from SDK/style is enough in React Native.
4. Whether multiple attributions are needed for provider, OpenMapTiles, OpenStreetMap, Stamen, satellite imagery, or other data sources.

## Georgia Offline Proof Plan

No whole-country Georgia claim is accepted until measured proof exists and owner thresholds are recorded.

Phase 0: Owner thresholds before acceptance

- Owner defines max acceptable whole-country Georgia pack size.
- Owner defines max acceptable download duration on representative network.
- Owner defines max storage footprint after install plus downloaded map.
- Owner defines whether fallback can be one area per trip, city packs, or regional packs.
- Owner defines representative device classes and minimum supported OS/device storage.

Phase 1: Small bounded technical smoke

- Renderer: MapLibre React Native in Expo development build, not Expo Go.
- Provider: one candidate style/tile provider with test/development key placeholder only.
- Area: small Tbilisi/Narikala bounded box, low-to-moderate zoom range.
- Evidence: iOS build, Android build or explicit blocker, render screenshot, progress logs, pack inventory via `getPacks`, restart, airplane/network-disabled reopen, saved pins overlay, planned straight line overlay, delete/cleanup.

Phase 2: Representative trip-area proof

- Area: owner-approved realistic Georgia trip area, e.g. Tbilisi plus Mtskheta or a bounded route corridor.
- Measure pack size, download duration, failure behavior, storage after cleanup, restart inventory, offline pan/zoom boundaries.
- Verify attribution remains visible and not occluded online/offline.
- Verify no offline search/geocoding/routing/navigation copy appears.

Phase 3: Whole-country Georgia feasibility test

- Area: provider-recommended Georgia bounds/polygon, not ad hoc guesswork.
- Zooms: define minimum usable zoom range for travel planning and point context before test.
- Measure exact downloaded bytes, tile count/pack count if exposed, elapsed download time, retry behavior, storage pressure, and offline render quality.
- Test after app restart with network disabled.
- Validate saved points and selected-day planned line over downloaded map.
- Compare measured size/duration against owner thresholds.

Phase 4: Fallback proof if whole-country fails

- Document blocker: legal limit, provider quota, size, time, storage, SDK failure, or UX risk.
- Propose fallback packs: one manually chosen area per trip, city packs, or region packs.
- Repeat Phase 2 evidence for fallback.
- Owner must explicitly accept fallback before implementation copy says downloaded map is available.

Required proof artifacts:

- Provider and plan/agreement identifier without real secret values.
- Style URL shape with secrets redacted.
- Device/platform/build details.
- Bounds/polygon and zoom range.
- Pack progress/status logs with private data sanitized.
- Final pack size and duration.
- `getPacks`/inventory evidence before and after restart.
- Network-disabled reopen evidence.
- Online and offline screenshots showing attribution, saved pins, planned line, and error/outside-area states.
- Cleanup/delete evidence.
- Copy-negative scan result.

## Evidence Required Before Provider Acceptance

Provider acceptance requires all of the following:

| Evidence | Required before |
| --- | --- |
| Provider terms/legal review for offline packs, caching, bulk download, export, attribution, key use, storage of geocoding results, and commercial/personal use mode. | Any production provider selection. |
| Pricing and quota budget for maps, offline downloads, geocoding, autocomplete, overages, and account limits. | Enabling provider in release builds. |
| Security review of mobile key model, restrictions, rotation, abuse monitoring, logging redaction, and no real keys committed. | Any provider key integration. |
| Native iOS and Android development-build proof, because Expo Go/web proof is insufficient. | Offline map implementation sign-off. |
| Measured Georgia offline pack size, duration, storage, restart persistence, and network-disabled reopen. | Any `downloaded` or whole-country Georgia claim. |
| Attribution verification online/offline and in saved search result surfaces. | Provider UI acceptance. |
| Search result normalization and storage policy, including provider place ID decision. | Saving online search results. |
| Autocomplete request-control proof and pricing/terms approval. | Shipping autocomplete. |
| Error-state fixtures for offline, no-results, quota/API failure, malformed response, map provider failure, outside Georgia, outside downloaded area. | QA automation and release QA. |

## Risks And Owner Decisions

Risks:

- Stadia's observed 100 MB per-device mobile offline cache exception may be too small for whole-country Georgia.
- MapTiler's observed terms make prepared trip pack downloading a custom-agreement verification blocker.
- Mapbox may solve offline technically but increases vendor lock-in, token exposure, and search/storage constraints.
- Public OSM tiles and public Nominatim are not viable production offline/autocomplete foundations.
- Whole-country Georgia may exceed storage, download duration, provider limits, or acceptable user experience at useful zooms.
- API keys in mobile apps are extractable unless the provider supports suitable restrictions/rotation/monitoring.
- Search coverage for Georgia travel POIs may vary by provider and must be tested with known landmarks in Georgian/Russian/English where relevant.
- Attribution may be easy online but fail offline if style/provider attribution is not cached or visible.
- Provider result storage rights may differ between map tiles, search, autocomplete, geocoding, and place details.
- Native development builds can fail independently of provider terms because current app has no map dependency, no Expo dev client, and no config plugin.

Owner decisions:

1. Accept explicit submitted search without autocomplete for first release if autocomplete remains blocked?
2. Choose acceptable max whole-country Georgia pack size and download duration.
3. Decide fallback order if whole-country Georgia fails: one selected area, city packs, or region packs.
4. Select representative proof areas and zoom ranges.
5. Decide whether a paid provider plan is acceptable for private MVP and which budget cap applies.
6. Decide whether selected provider place IDs may be stored after security/legal review.
7. Decide whether Yandex Maps fallback may include web fallback, copy address, or copy coordinates.
8. Decide exact Russian UI terms for downloaded map viewing and planned order line before QA copy assertions.

## Recommendation

Recommendation: accepted for discovery only.

Use MapLibre React Native as the primary renderer path for MAP-04 architecture framing and MAP-06 bounded native/offline proof planning. Keep tile/style provider selection separate from renderer selection.

Shortlist for proof planning:

1. Stadia Maps first for a small bounded proof because terms observed explicitly mention limited mobile offline caching, while treating the 100 MB per-device cache limit as a likely whole-country blocker until measured.
2. MapTiler second if owner is willing to seek written/plan confirmation that intentional prepared trip-area offline packs are allowed.
3. rnmapbox/Mapbox as fallback if MapLibre plus independent tile provider fails and owner accepts Mapbox lock-in and storage/search constraints.

Rejected for production provider acceptance:

- Public OSM tiles for offline/prefetch.
- Public Nominatim for production autocomplete.
- react-native-maps LocalTile as the primary offline download solution.

Blocked before production acceptance:

- Whole-country Georgia offline support.
- Autocomplete.
- Provider-normalized result storage beyond minimal selected fields.
- Real API key integration.
- Any UI copy implying offline search, offline geocoding, offline routing, navigation, optimization, traffic, ETA, or live rerouting.
