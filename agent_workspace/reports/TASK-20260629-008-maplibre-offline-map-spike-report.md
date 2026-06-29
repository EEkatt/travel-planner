# TASK-20260629-008 MapLibre Offline Map Spike Report

## Status

Ready for Lead review.

## Recommendation

Proceed with conditions.

`@maplibre/maplibre-react-native` is a practical MVP candidate for prepared trip area offline map download on iOS and Android, but it must be validated before broad map implementation. The hard condition is not the React Native baseline; the hard condition is the tile/style provider license, offline download allowance, storage limit, and account/key model.

Do not start broad map feature work until the implementation spike proves:

- Expo development build works on at least one iOS target and one Android target/emulator;
- `OfflineManager.createPack` can download a small bounded region;
- the same region opens with network disabled;
- saved trip points render on the downloaded map;
- the chosen provider explicitly allows the required offline cache/download behavior for the MVP use case.

Offline routing is not included in this recommendation.

## Sources Checked

- MapLibre React Native Getting Started: https://maplibre.org/maplibre-react-native/docs/setup/getting-started/
- MapLibre React Native Expo setup: https://maplibre.org/maplibre-react-native/docs/setup/expo/
- MapLibre React Native OfflineManager: https://maplibre.org/maplibre-react-native/docs/modules/offline-manager/
- npm package metadata checked on 2026-06-29 with `npm view @maplibre/maplibre-react-native version peerDependencies dependencies --json`
- Expo development builds: https://docs.expo.dev/develop/development-builds/introduction/
- Expo local debug builds: https://docs.expo.dev/guides/local-app-development/
- Expo custom native code: https://docs.expo.dev/workflow/customizing/
- MapTiler Cloud terms: https://www.maptiler.com/terms/cloud/
- MapTiler pricing: https://www.maptiler.com/cloud/pricing/
- Stadia Maps terms: https://stadiamaps.com/terms-of-service/

## Current App Baseline

`app/mobile/package.json` currently has:

- `expo`: `~56.0.12`
- `react`: `19.2.3`
- `react-native`: `0.85.3`
- no `expo-dev-client`;
- no map provider dependency;
- no native `ios/` or `android/` source is assumed in the architecture.

Current package metadata for `@maplibre/maplibre-react-native` is:

- latest package version checked: `11.3.6`;
- peer dependencies include `expo >=54.0.0`, `react >=19.1.0`, `react-native >=0.80.0`, and `@types/react >=19.1.0`.

This scaffold appears compatible at the peer-dependency level.

Important compatibility note: MapLibre React Native docs state that v11 supports only the new React Native architecture. The current Expo/RN baseline should be treated as compatible, but the spike must still verify runtime behavior after native build.

## Development Build Implications

MapLibre React Native cannot be used with Expo Go because it is not part of the Expo SDK. The app must use Expo development builds or another native build path.

Expected implications for `app/mobile`:

- add `@maplibre/maplibre-react-native`;
- add the MapLibre config plugin to `app.json`;
- add `expo-dev-client` if we want the normal Expo development-build workflow;
- rebuild the native app after dependency/config changes;
- use `npx expo run:ios` and `npx expo run:android` for local debug builds, or EAS development builds if local signing/device setup blocks the owner machine;
- do not expect the map to work in Expo Go after this choice.

The MapLibre Expo plugin is required especially for iOS setup, where it modifies the generated Podfile during prebuild. Android is still a native build path because the native library must be included in the app binary.

## OfflineManager Fit For MVP Requirement

`OfflineManager.createPack(options, progressListener, errorListener)` creates and registers an offline pack and downloads the resources needed to use a region offline.

The options include:

- map style;
- min/max zoom levels;
- bounds;
- metadata.

This directly matches the MVP concept of "download the prepared trip area before travel", with important limits:

- it is an offline map display pack, not route planning;
- route optimization and offline routing remain out of scope;
- the pack is only as useful as the selected style and tile source;
- provider terms and tile count limits must be known before release;
- download progress, retry, cancel/delete, and storage state are product requirements, not optional polish.

## Tile / Style Provider Findings

MapLibre itself is a renderer and SDK wrapper. Production use needs a real style and tile source. MapLibre docs mention demo tiles for development and state that production should use a user's own style/tiles or a provider such as Stadia Maps or MapTiler.

### MapLibre Demo Tiles

Use only for smoke testing. They are not a production provider decision.

### MapTiler

MapTiler is a plausible style/tile provider, but its terms require careful review before using offline packs as the release path.

Facts from MapTiler terms/pricing:

- usage requires the customer's own API key;
- free plan usage is limited and tied to non-commercial use or research/development for commercial products;
- storing request results in a temporary personal cache for a single end-user is permitted;
- export usage and bulk downloading require custom agreement unless otherwise allowed;
- pricing/plan limits are part of the license boundary.

Release-blocking risk:

- A "download trip area" feature may be interpreted as bulk downloading/export depending on size, zoom levels, duration, and plan. We need written/clear plan terms that allow the exact offline pack behavior before choosing MapTiler for production MVP.

### Stadia Maps

Stadia Maps is a plausible MapLibre provider and its terms are more explicit about limited mobile offline caching.

Facts from Stadia Maps terms:

- free tier is for non-commercial/evaluation/personal use cases, while commercial products require an active paid subscription;
- terms prohibit bulk downloading except for caching small amounts of data for offline use in a mobile application, not to exceed 100 MB cached at a time per device;
- proxying/caching is otherwise restricted;
- usage limits can trigger charge, suspension, or termination.

Release-blocking risk:

- 100 MB per device may be enough for a small city/day plan but may not be enough for large trips, high zoom levels, or satellite/topographic maps. The spike must measure real pack sizes for representative trips.

### Self-Hosted / Own Tiles

This is the strongest control path for future scale, but it is probably not the fastest MVP path.

Risks:

- tile generation/hosting pipeline;
- storage and bandwidth;
- data licensing;
- style maintenance;
- offline pack compatibility;
- operational burden.

Use as a future fallback if commercial providers block the feature.

## Expected Dependency And Config Changes

For the implementation spike only:

```sh
cd /Users/ekattt/Documents/PROJECT/app/mobile
npx expo install @maplibre/maplibre-react-native expo-dev-client
```

Expected `app.json` change:

```json
{
  "expo": {
    "plugins": ["@maplibre/maplibre-react-native"]
  }
}
```

If the project later adds other plugins, this must be merged into the existing `plugins` array rather than replacing it.

Expected native build commands:

```sh
cd /Users/ekattt/Documents/PROJECT/app/mobile
npx expo run:ios
npx expo run:android
```

After native builds exist and only JS/TS changes are being made:

```sh
cd /Users/ekattt/Documents/PROJECT/app/mobile
npx expo start
```

If local iOS device signing blocks testing, use an iOS simulator first. If physical iPhone testing is required and local signing is blocked, use an EAS development build as the fallback path.

## Minimum Implementation Spike

Do not implement full trip map UX in the spike.

Create the smallest proof that answers the risk:

1. Install MapLibre and `expo-dev-client`.
2. Add the MapLibre config plugin.
3. Build locally for iOS and Android.
4. Render a simple MapLibre map with a development style.
5. Add two hardcoded saved trip points inside a small test bounding box.
6. Add a temporary developer-only button: "Download test area".
7. Call `OfflineManager.createPack` with:
   - a small bounding box;
   - min zoom low enough for small size;
   - max zoom limited initially, for example 14 or 15;
   - explicit metadata with test pack name and provider.
8. Show progress, complete, and error state.
9. Kill network for the device/simulator.
10. Reopen the app and verify the downloaded map area and points render.
11. Measure pack size and download duration.
12. Delete the pack and verify storage cleanup.

## Exact Local Spike Commands

These are proposed commands for the implementation task, not commands executed by this analysis task:

```sh
cd /Users/ekattt/Documents/PROJECT/app/mobile
npx expo install @maplibre/maplibre-react-native expo-dev-client
npx expo run:ios
npx expo run:android
```

If CocoaPods installation is needed after prebuild:

```sh
cd /Users/ekattt/Documents/PROJECT/app/mobile
npx pod-install
```

If native directories become stale during the spike:

```sh
cd /Users/ekattt/Documents/PROJECT/app/mobile
npx expo prebuild --clean
npx expo run:ios
npx expo run:android
```

Provider test command pattern after a provider key is chosen:

```sh
cd /Users/ekattt/Documents/PROJECT/app/mobile
EXPO_PUBLIC_MAP_STYLE_URL="https://example.com/style.json?key=REPLACE_ME" npx expo start
```

The actual API key must not be committed.

## Spike Acceptance Criteria

Implementation spike is accepted only if all are true:

- iOS development build succeeds;
- Android development build succeeds or a specific Android blocker is documented with version/log details;
- app renders a MapLibre map in the development build;
- app does not claim support in Expo Go;
- app can create a small offline pack using `OfflineManager.createPack`;
- progress and error callbacks are visible in the test UI or logs;
- app can list existing packs after restart with `OfflineManager.getPacks`;
- network-disabled test shows downloaded map content for the same bounded region;
- saved trip points render on top of the offline map;
- storage size is measured for at least one small test region;
- provider style/tile terms are documented for the tested provider;
- offline routing is absent from UI and docs unless separately proven later.

## Blocking Risks Before Broad Map Implementation

- Provider terms do not allow the required offline region download behavior.
- Provider offline cache limit is too small for realistic trip areas.
- Offline pack size is too large for mobile storage at needed zoom levels.
- iOS build requires signing/setup that cannot be handled in the owner's workflow.
- Android build fails under Expo 56 / RN 0.85.3 / MapLibre 11.x.
- MapLibre new architecture behavior is unstable in this scaffold.
- Offline pack can download but cannot reliably render after app restart or network loss.
- Pack lifecycle cannot support delete/retry/update without user-visible corruption.
- API keys cannot be protected sufficiently for the selected provider's terms.
- Attribution/legal notices cannot be displayed in the map UI according to provider requirements.

## Fallback Criteria

Switch from MapLibre to `@rnmapbox/maps` if:

- MapLibre development builds fail on iOS or Android after reasonable version/config attempts;
- MapLibre offline packs are unstable after restart/network-off tests;
- a Mapbox plan is acceptable and explicitly permits the required offline use;
- the team accepts Mapbox account/token/pricing/vendor lock-in.

Switch to `react-native-maps` with local tiles only if:

- MapLibre and Mapbox are blocked;
- the MVP can accept a more custom tile pipeline;
- the team has a legal tile source that permits local storage;
- the team accepts building download/storage/update logic itself.

Switch away from React Native/Expo only if:

- neither MapLibre nor Mapbox can satisfy the offline map requirement under development builds;
- local tile pipeline is not feasible;
- the owner confirms that offline map download remains a non-negotiable MVP requirement.

## Open Questions For Lead / Owner

- Is a 100 MB per-device offline cache limit acceptable for the first personal MVP if using Stadia Maps?
- Is a paid map provider subscription acceptable before public launch if free/personal terms are insufficient?
- Which first test region should represent a real trip: Tbilisi, wider Georgia, or a smaller city/day area?
- Should MVP allow multiple downloaded areas per trip or one prepared area per trip?
- What is the maximum acceptable offline map download size on the owner's iPhone?
- Should the first spike prioritize iOS physical device, iOS simulator, or Android emulator after the first successful native build?

## Final Technical Position

MapLibre React Native remains the recommended first spike path. It aligns with the cross-platform offline-map requirement better than `react-native-maps` and has less vendor lock-in than Mapbox. The recommendation is conditional because map provider terms, offline limits, and real pack size are release-blocking facts.
