# MAP-03 Provider Discovery Technical Review

Task ID: TASK-20260704-030
Role: technical_analyst
Date: 2026-07-04
Status: Complete
Recommendation: Accept for discovery and MAP-06 planning only; do not accept a production provider choice.

## Read-Only Context Reviewed

- `agent_workspace/reports/MAP-03-PROVIDER-DISCOVERY-20260704.md`
- `agent_workspace/reports/MAP-02A-REQUIREMENTS-ADDENDUM-20260704.md`
- `agent_workspace/reports/MAP-02-REQUIREMENTS-20260704.md`
- `agent_workspace/reports/GATE-00-MAP-PROVIDER-20260704.md`
- `app/mobile/package.json`
- `architecture/16_offline_map_provider_research.md`

## Recommendation

Accept MAP-03 as a provider-discovery artifact and allow it to proceed to security review and MAP-06 native/offline spike planning.

This is not acceptance of any production tile, style, search, autocomplete, offline-pack, API-key, storage, or attribution decision. MAP-03 is technically realistic because it keeps MapLibre as a renderer candidate, keeps tile/style/search providers separate, blocks public OSM tiles and public Nominatim for production misuse, and requires native development-build evidence before offline claims.

No rework is required before lead can use MAP-03 for planning. The follow-on MAP-06 task must be explicit enough that it cannot accidentally become a provider commitment or a web/Expo Go proof.

## Technical Feasibility Findings

1. MapLibre React Native is a plausible renderer spike path, not a provider. The current `app/mobile/package.json` baseline uses Expo `~56.0.12`, React Native `0.85.3`, and React `19.2.3`, which MAP-03 correctly treats as peer-level plausible against the referenced MapLibre v11/new-architecture requirements. That does not prove runtime compatibility.

2. Expo Go is not a valid proof vehicle. MAP-03 and Gate 00 correctly state that MapLibre/rnmapbox require native code and therefore a development build/custom dev client or native build path. The current app has no `expo-dev-client`, no map dependency, no MapLibre config plugin, and no native build proof.

3. Offline packs are technically plausible only after native proof. `OfflineManager.createPack`/`getPacks` fits the MVP shape for bounded region downloads, inventory, delete, restart, and network-disabled reopen. It does not by itself prove provider permission, whole-country feasibility, style dependency caching, attribution, or app overlay behavior.

4. MAP-03 correctly separates renderer, tile data, style, and search/geocoding. That separation is essential for MAP-04 and MAP-06 because selecting MapLibre does not answer offline tile legality, API-key exposure, geocoder result storage, autocomplete billing, or attribution.

5. The search/autocomplete stance is technically sound. Explicit submitted online search should be the first implementation mode. Autocomplete should remain disabled until terms, pricing, request controls, cancellation/debounce behavior, rate limits, key model, and result storage are accepted.

## Missing Proof Steps For MAP-06

MAP-03 has a good proof outline, but MAP-06 should turn these into executable gates:

1. Pin exact package versions and build path: MapLibre package version, Expo SDK, React Native, iOS/Android SDK/toolchain, whether EAS or local prebuild is used, and whether `expo-dev-client` is added.

2. Prove native startup on both platforms: iOS development build required; Android development build required or an explicit blocker. Web and Expo Go evidence must be rejected.

3. Verify style dependency caching offline: not only base vector/raster tiles, but style JSON, glyphs/fonts, sprites, attribution assets, and any terrain/satellite layers referenced by the selected style.

4. Prove network-disabled behavior after restart with evidence: download online, force quit, disable network, reopen, render the downloaded area, show pack inventory, and capture logs/screenshots that do not depend on live tile fetches.

5. Prove overlays offline: saved pins and selected-day planned order line must render over the downloaded map using MAP-02A fixtures, not only a blank/base map.

6. Measure bounds, zooms, bytes, duration, tile/pack counts if exposed, and storage delta before download, after download, after restart, after delete, and after delete plus restart.

7. Exercise failure and recovery states: quota/API failure, interrupted download, retry/resume behavior if supported, deletion failure, malformed style/provider response, outside downloaded area, and offline-not-downloaded.

8. Run copy-negative checks against offline/search/route UI states so the spike does not introduce offline search, geocoding, routing, navigation, optimization, traffic, ETA, or live rerouting claims.

## Candidate-Provider Concerns

Stadia Maps: Suitable only for a small bounded proof unless plan/legal review accepts larger downloads. The observed 100 MB per-device offline cache exception is a likely blocker for useful whole-country Georgia coverage or high zooms.

MapTiler Cloud: Plausible for MapLibre rendering and online geocoding, but intentional trip-area offline packs may fall into export/bulk-download/custom-agreement territory. MAP-06 should not use it as proof of product viability without plan-specific permission.

Mapbox/rnmapbox: Strong offline SDK fallback, but it changes the lock-in and legal model. Search/geocoding constraints are materially different, especially POI search, response storage, token handling, and Mapbox-map coupling.

react-native-maps LocalTile: Reasonable for a narrow local-tile display prototype only. It does not solve pack creation, tile legality, updates, inventory, glyphs/sprites/style dependencies, or download UX.

Public OSM tiles and public Nominatim: Correctly rejected for production offline/prefetch and production autocomplete. They should not be used to blur proof evidence for a production provider.

Self-hosted OSM/OpenMapTiles/PMTiles-style path: Technically possible but operationally large. It should remain a fallback only if hosted providers fail and ownership accepts tile generation, hosting/update pipeline, ODbL/compliance, and separate search infrastructure.

## Risks For MAP-06 Native/Offline Spike

- Native build risk is real: config plugin, CocoaPods/Gradle, new React Native architecture, Expo SDK compatibility, and local/EAS signing/tooling can fail before map logic is tested.
- A successful render does not prove offline. MAP-06 must distinguish online render, pack download, restart persistence, and network-disabled reopen.
- Provider style URLs can reference remote resources that are not cached by the pack, causing missing labels/icons or failed offline render.
- Whole-country Georgia can fail due to provider terms, provider cache limits, tile count limits, storage footprint, download time, device pressure, or unacceptable zoom compromises.
- API keys in mobile apps are extractable. MAP-06 should use development keys only and avoid committing secrets while preserving the evidence needed for MAP-09/security review.
- Search coverage for Georgia POIs and multilingual queries may be uneven by provider. This is separate from map tile success.
- Attribution can regress offline or under overlays. Screenshots must prove required attribution remains visible and not occluded.

## Recommended Next Technical Tasks

1. Create MAP-06 as a bounded native/offline spike with explicit non-goals: no production provider acceptance, no real committed keys, no autocomplete, no offline search/geocoding/routing.

2. Add a MAP-06 build-prep checklist covering `expo-dev-client`, MapLibre dependency/config plugin, prebuild/EAS path, iOS and Android target versions, and rollback-safe dependency changes.

3. Define owner thresholds before whole-country proof: max pack size, max duration, max storage footprint, representative devices, minimum zoom range, and acceptable fallback model.

4. Select one small proof provider/plan for development evidence only, with provider name/SKU documented and secrets redacted.

5. Build a proof harness or screen that can show pack progress, `getPacks` inventory, delete/cleanup, online/offline attribution, saved fixture pins, selected-day planned line, and outside-downloaded-area state.

6. Keep `PlaceSearchProvider` planning separate from offline map proof. For MAP-06, search can stay mocked unless the task explicitly includes online search-provider evidence.

7. Prepare MAP-09/security inputs in parallel: key restriction model, rotation approach, logging redaction, provider request diagnostics, allowed stored fields, and attribution surfaces.

## Lead Decision

MAP-03 can proceed to security review acceptance and MAP-06 planning as a discovery artifact.

The lead should not approve a production provider, whole-country Georgia claim, autocomplete, provider-result storage policy, or release UI copy from MAP-03 alone.
