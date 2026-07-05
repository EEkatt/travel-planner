# Gate 00 Map Provider And Offline Map Path

Task ID: TASK-20260704-013
From: map_provider_engineer
To: lead
Status: Ready For Review
Date: 2026-07-04

## Summary

Gate status: accepted for a bounded MapLibre React Native spike. Blocked for broad/production map implementation until native offline-pack proof, provider plan approval, offline size measurement, and API key/attribution handling are confirmed.

## Provider Candidate

Renderer: MapLibre React Native.

Tile/style provider remains separate from renderer.

- MapLibre demo tiles: development smoke only.
- Stadia Maps: first real provider candidate if owner accepts explicit 100 MB per-device offline cache ceiling.
- MapTiler: secondary candidate, blocked until prepared-area download is confirmed as allowed by selected plan/agreement.

Search/geocoding:

- Keep behind `PlaceSearchProvider`.
- Shortlist MapTiler Geocoding first for online place search.
- Stadia Geocoding only if selected plan permits persistent storage of selected geocoding results.
- Manual entry is mandatory offline/error/no-results fallback.

## Results

Current app has Expo `~56.0.12`, React `19.2.3`, React Native `0.85.3`, no `expo-dev-client`, no map provider dependency, and no MapLibre config plugin.

MapLibre docs support Expo setup but not Expo Go. `OfflineManager.createPack` fits the MVP technical shape for bounded region downloads, but no runtime proof has been performed in this app yet.

## Sources

- https://maplibre.org/maplibre-react-native/docs/setup/getting-started/
- https://maplibre.org/maplibre-react-native/docs/setup/expo/
- https://maplibre.org/maplibre-react-native/docs/modules/offline-manager/
- https://www.maptiler.com/terms/cloud/
- https://www.maptiler.com/cloud/pricing/
- https://docs.maptiler.com/cloud/api/geocoding/
- https://docs.maptiler.com/cloud/api/authentication-key/
- https://stadiamaps.com/terms-of-service/
- https://stadiamaps.com/pricing/
- https://docs.stadiamaps.com/authentication/
- https://docs.stadiamaps.com/attribution/

## Accepted Spike Criteria

- iOS development build succeeds.
- Android development build succeeds or blocker is logged.
- MapLibre map renders in development build.
- User-triggered small bounded pack download works.
- Progress/error states are visible.
- `OfflineManager.getPacks` works after restart.
- Network-disabled app reopen renders downloaded area.
- Saved trip points render over offline map.
- Pack size and download duration are measured.
- Pack delete/cleanup works.
- UI/docs do not promise offline routing.

## Risks

- Provider terms may reject prepared-area downloads as bulk download.
- Stadia 100 MB per-device offline cap may be too small.
- MapTiler temporary-cache allowance may not cover intentional trip packs.
- Native development builds may fail or require signing/tooling setup.
- API keys in mobile apps can be extracted; restrictions and monitoring are required.
- Search/geocoding storage rights may differ from tile rights.
- Attribution must remain visible online and offline.

## Decision Recommendation

Proceed with MapLibre React Native as Gate 00 implementation spike path.

Do not accept production tile/style provider yet. Production provider selection is blocked pending provider-plan confirmation and measured offline pack size.
