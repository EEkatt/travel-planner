# Offline Map Provider Research

## Status

Draft. Created during Gate 00 after owner made offline maps mandatory for MVP.

## Requirement

MVP must support:

- downloading a trip map area before travel;
- opening the downloaded map without internet;
- showing saved trip points on the offline map;
- working on iOS and Android;
- fitting React Native/Expo architecture if possible.

Offline routing is not automatically included.

## Key Finding

Real offline map download is a native map capability. It is not a simple Expo Go feature.

The MVP will likely require an Expo development build/custom dev client or a bare/native build path if we choose MapLibre or Mapbox.

## Option 1: MapLibre React Native

Source:

- https://maplibre.org/maplibre-react-native/
- https://maplibre.org/maplibre-react-native/docs/setup/getting-started/
- https://maplibre.org/maplibre-react-native/docs/setup/expo/
- https://maplibre.org/maplibre-react-native/docs/modules/offline-manager/

Relevant facts:

- MapLibre React Native is a React Native library for maps with MapLibre Native for Android and iOS.
- It supports Expo setup, but cannot be used with Expo Go.
- Expo setup requires installing `@maplibre/maplibre-react-native`, adding its config plugin, and rebuilding the app.
- It has `OfflineManager.createPack`, which downloads resources needed to use a region offline.
- Offline packs specify style, zoom levels, and bounds.

Pros:

- Open-source map rendering stack.
- iOS and Android support.
- Official docs include OfflineManager.
- Better long-term control than vendor-locked native Apple/Google maps.

Cons / risks:

- Not usable in Expo Go.
- Requires development build / native rebuild.
- Production tiles/style still need a provider such as MapTiler, Stadia, self-hosted tiles, or another tile source.
- Need to validate licensing, tile provider pricing, offline limits, storage size, and region download UX.

Assessment:

Best candidate for the current requirement if we want cross-platform offline map download.

## Option 2: rnmapbox/maps

Source:

- https://github.com/rnmapbox/maps
- https://github.com/rnmapbox/maps/blob/main/docs/OfflineManager.md
- https://github.com/rnmapbox/maps/blob/main/plugin/install.md

Relevant facts:

- `@rnmapbox/maps` is a React Native library using Mapbox Maps SDKs for iOS and Android.
- It includes an `OfflineManager`.
- `OfflineManager.createPack` downloads resources needed for a region offline.
- It is not available in Expo Go and needs a custom dev client.
- It requires a Mapbox access token.
- Offline tile limits and Mapbox terms must be respected.

Pros:

- Mature offline-region concept.
- Strong Mapbox SDK ecosystem.
- Clear offline pack API.

Cons / risks:

- Vendor dependency and pricing.
- Access tokens and terms.
- Not Expo Go.
- Need to check current Mapbox offline limits, pricing, and commercial constraints.

Assessment:

Strong technical candidate, but more vendor/cost lock-in than MapLibre.

## Option 3: react-native-maps with LocalTile

Source:

- https://docs.expo.dev/versions/latest/sdk/map-view/
- https://github.com/react-native-maps/react-native-maps

Relevant facts:

- `react-native-maps` is included in Expo Go.
- It uses Google Maps on Android and Apple Maps or Google Maps on iOS.
- It supports `LocalTile`, where tiles are stored locally with an XYZ tiling scheme and displayed as a tile overlay.
- On Android, `LocalTile` is still an overlay over original map tiles unless `mapType` is set to `none`.

Pros:

- Easier Expo Go compatibility for basic map display.
- LocalTile can display local tile files.

Cons / risks:

- It does not solve tile download/pack management by itself.
- We would need to build or integrate our own tile download/storage pipeline.
- Tile source licensing is a serious risk.
- More DIY than MapLibre/Mapbox offline packs.
- Less clean for "download this region" UX.

Assessment:

Useful fallback/prototype for local tile display, but not the best primary solution for robust offline map downloads.

## Expo Implication

Source:

- https://docs.expo.dev/develop/development-builds/introduction/
- https://docs.expo.dev/config-plugins/introduction/

Relevant facts:

- Expo Go includes a fixed set of native libraries.
- If a library needs native code that is not included in Expo Go, we need a development build.
- Config plugins can modify native projects during prebuild.

Implication:

If we choose MapLibre or rnmapbox, we should move from plain Expo Go testing to Expo development builds.

## Preliminary Recommendation

Recommended Gate 00 path:

1. Use MapLibre React Native as the primary offline-map spike candidate.
2. Validate development build setup.
3. Validate `OfflineManager.createPack` for a small bounded region.
4. Validate map opens offline and shows saved points.
5. Validate tile/style provider choice, pricing, licensing, and storage size.
6. Keep rnmapbox/maps as fallback if MapLibre integration fails.
7. Keep react-native-maps LocalTile only as a fallback/prototype path, not primary.

## Gate 00 Acceptance Criteria

Before broad map implementation:

- app can run in a development build with selected map library;
- user can trigger a small region download;
- progress/error state is visible;
- downloaded region opens with network disabled;
- saved points render on downloaded map;
- tile provider license/pricing is documented;
- no offline routing is promised unless proven.

## Open Questions

- Which tile/style provider should power MapLibre offline packs?
- Are MapTiler/Stadia/other providers acceptable for personal MVP cost and terms?
- Can we build and test iOS development builds locally without paid Apple Developer account at this stage?
- Do we need Android emulator validation immediately or after iOS/dev build proof?
