# MAP-03 Provider Discovery Security Review

Task ID: TASK-20260704-031
Role: security_reviewer
Date: 2026-07-04
Reviewed artifact: `agent_workspace/reports/MAP-03-PROVIDER-DISCOVERY-20260704.md`

## Recommendation

Recommendation: accept MAP-03 for discovery only; rework/proof is required before any production provider key, online search, autocomplete, offline pack, or provider-backed storage implementation.

MAP-03 is security-acceptable as a discovery document because it keeps renderer, tile/style, and search/geocoding decisions separate; rejects public OSM tiles for offline/prefetch; rejects public Nominatim for production autocomplete; and requires explicit legal, pricing, API key, attribution, storage, logging, and device proof before production acceptance.

It is not acceptable as production approval. The current app prototype still contains direct public Nominatim search and public OSM web tiles in `app/mobile/App.tsx`; those can remain prototype-only, but must be removed, disabled, or guarded from release/provider implementation paths before MAP-03 proceeds to production search/offline work.

## Context Read

- `agent_workspace/reports/MAP-03-PROVIDER-DISCOVERY-20260704.md`
- `agent_workspace/reports/MAP-02A-REQUIREMENTS-ADDENDUM-20260704.md`
- `agent_workspace/reports/MAP-02-REQUIREMENTS-20260704.md`
- `architecture/15_security_and_resilience.md`
- `app/mobile/AGENTS.md`
- `app/mobile/app.json`
- `app/mobile/package.json`
- `app/mobile/App.tsx`

External policy spot-checks used for this review:

- OSMF Nominatim Usage Policy: `https://operations.osmfoundation.org/policies/nominatim/`
- OSMF Tile Usage Policy: `https://operations.osmfoundation.org/policies/tiles/`
- Stadia Maps Terms of Service: `https://stadiamaps.com/terms-of-service/`
- MapTiler Cloud Terms: `https://www.maptiler.com/terms/cloud/`
- Mapbox Geocoding API docs: `https://docs.mapbox.com/api/search/geocoding/`

## Security Risks

1. Mobile API keys are extractable.
   - Any MapTiler/Stadia/Mapbox key shipped in React Native/native config must be treated as public unless restricted by provider controls.
   - Required controls: separate map/search keys where supported, package/bundle/origin/user-agent restrictions, request caps, billing caps, alerting, rotation without app update where possible, and incident runbook.

2. Existing prototype public provider calls can accidentally become production dependencies.
   - `app/mobile/App.tsx` calls `https://nominatim.openstreetmap.org/search?...q=...` for explicit search.
   - `app/mobile/App.tsx` loads `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png` through Leaflet on web.
   - These are not acceptable for production autocomplete or offline/prefetch. Public OSM tiles also cannot back download/offline features.

3. Provider SDKs and adapters may leak keys or private location data through logs.
   - MAP-03 requires logging redaction, but implementation must prove no keys, full URLs, queries, addresses, provider raw payloads, or precise coordinates are emitted to JS logs, native logs, crash reports, test artifacts, screenshots, CI output, or support diagnostics.

4. Provider result storage can create license and security exposure.
   - Saved normalized fields must remain limited to approved fields.
   - Raw provider payloads, full responses, request URLs, scoring/ranking metadata, and unapproved provider IDs must not be stored.
   - `providerPlaceId` and `providerAttribution` require terms/security approval before persistence.

5. Offline pack implementation can exceed provider permissions.
   - Whole-country Georgia can look like bulk download/export/prefetch under provider terms unless the selected plan/agreement expressly allows it.
   - Style JSON, glyphs, sprites, terrain, satellite layers, and attribution assets must be included in the terms review, not only vector tile endpoints.

6. Web map message handling is prototype-risky.
   - The current web prototype listens for `message` events and accepts any payload with `type = trip-map-click` without checking event origin/source. This should not be copied into a production map bridge without origin/source validation and schema validation.

## Privacy Risks

1. Search queries can reveal private travel intent.
   - Place queries, hotel addresses, home addresses, route plans, and notes can be sensitive even without accounts.
   - Public Nominatim specifically warns not to submit personal or confidential material. Production provider selection must document what user query data is shared and retained.

2. Coordinates and saved trip points are sensitive location data.
   - Manual map taps and saved search results can disclose where a user plans to stay, visit, or travel.
   - No private location logs or realistic private trip data should be used in fixtures, screenshots, proof logs, crash reports, or provider debugging tickets.

3. Autocomplete multiplies data sharing.
   - Per-keystroke autocomplete can send partial queries and more detailed behavioral traces than explicit submitted search.
   - Autocomplete must remain off until terms, cost, request-control, logging, and retention proof are accepted.

4. Offline packs can reveal trip areas.
   - Downloaded area IDs, bounds, tile inventory, pack names, and progress logs can disclose itinerary geography.
   - Proof artifacts must use deterministic public fixture areas or sanitized bounds, not private user trip plans.

5. Attribution and saved result display have privacy/legal overlap.
   - If provider attribution must be displayed with saved search results offline, the app must store only the minimum attribution token/text needed and avoid retaining raw provider metadata.

## Required Fixes And Proof Before Implementation

Required before any real provider key integration:

- No real API keys committed in repo, app config, fixtures, screenshots, logs, or reports.
- Document chosen provider key model: public mobile key versus server-issued token/proxy, restrictions available, rotation path, caps, monitoring, and abuse response.
- Prove release builds and CI logs redact keys, request URLs, queries, coordinates, addresses, provider payloads, and native SDK diagnostics.
- Use placeholder keys only in discovery/spike code and ensure placeholders cannot call production services.

Required before production online search:

- Remove or hard-disable public Nominatim from production paths. It may be used only for deliberately approved low-volume manual/reference testing, not autocomplete and not default production search.
- Document provider terms for explicit search, result display, result storage, attribution, provider retention/data sharing, quotas, overages, and commercial/private MVP mode.
- Implement a search adapter that sends only explicit submitted queries by default and sets provider autocomplete off where supported.
- Add request/response normalization proof showing only title, address/description, coordinates if allowed, country code, provider key/name, approved provider place ID, and approved attribution are persisted.
- Add tests/proof for outside-Georgia results, malformed responses, quota errors, timeout, offline state, and no-results without saving partial provider data.

Required before autocomplete:

- Written provider approval or accepted plan terms for autocomplete from mobile clients.
- Request-control proof: minimum characters, debounce, cancellation, no stale result save, no per-keystroke logging, rate-limit handling, and budget guardrails.
- Product/security approval that autocomplete data sharing is acceptable for the MVP.

Required before offline map packs:

- Provider/legal confirmation that the selected plan permits user-triggered trip-area offline downloads and whether whole-country Georgia is allowed.
- Measured proof for pack size, tile count where exposed, duration, storage delta, restart persistence, network-disabled reopen, overlays, attribution, and cleanup/delete.
- Proof that public OSM tiles are not used for offline download, prefetch, or background cache warming.
- Proof that style dependencies are covered: style JSON, tiles, glyphs, sprites, fonts, terrain/satellite layers, attribution assets, and cache retention/update rules.
- Owner thresholds for maximum pack size, download duration, and storage footprint.

Required before provider-backed proof artifacts are accepted:

- Sanitized logs only: no private addresses, realistic private trip names, precise private coordinates, raw provider payloads, API keys, full URLs, or provider account identifiers beyond approved plan/SKU names.
- Use MAP-02A deterministic Georgia fixtures or synthetic public landmarks for screenshots and logs.
- Include attribution screenshots for online, offline, saved search result, provider error, and outside-downloaded-area states.

Required before copying current prototype behavior into production:

- Replace global `postMessage` handling with origin/source/schema validation or a native map bridge.
- Add Georgia classification before saving coordinate-backed map taps/search results.
- Avoid displaying or logging full tapped coordinates except where explicitly needed for user confirmation.

## Open Legal / Provider / Security Questions

1. Which provider plan/SKU will be used for a private MVP, and does it explicitly permit mobile offline packs for Georgia trip areas?
2. Does the selected provider permit whole-country Georgia offline download, or only smaller user-selected areas?
3. Are selected normalized geocoding fields allowed to be stored indefinitely on device? Are provider place IDs allowed?
4. What attribution is required for saved provider search results shown later offline or without a visible map?
5. What query, IP/device, account, and location data does the provider retain, for how long, and under what privacy/DPA terms?
6. Does the provider support mobile key restrictions strong enough for an extractable client key, or is a proxy/server-issued token required?
7. Can map and search keys be separated, capped, monitored, and rotated independently?
8. Is autocomplete acceptable for MVP privacy, or should the first release stay explicit-submit only?
9. Can provider support/debug workflows be completed without sending private trip logs or screenshots?
10. Does the app need local database encryption before real personal travel data is used, or is device-level protection still the accepted MVP boundary?

## Decision Summary For Lead

MAP-03 is acceptable as discovery-only security framing. It should not be treated as approval to implement a provider, commit keys, ship public Nominatim/OSM production paths, enable autocomplete, store provider IDs/payloads, or claim offline Georgia support.

Production implementation should remain blocked until the required proof above is produced and reviewed by security/legal/provider owners.
