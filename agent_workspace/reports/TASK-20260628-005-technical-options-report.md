# Technical Options Report

Task ID: TASK-20260628-005
Agent: technical_analyst
Date: 2026-06-28

## Summary

Compared MVP options for mobile stack, maps, local storage/cache, backend direction, reminders, and future LLM integration. Recommendation is a local-first iPhone MVP using Swift/iOS and Apple MapKit if the first validation is iPhone-first. React Native/Expo remains the fallback if early Android support is required. Backend, sync, collaboration, server push, own routing, full offline maps, and LLM should stay out of the MVP critical path.

## Changed Files

- `architecture/11_architecture.md`
- `architecture/12_decisions.md`
- `agent_workspace/reports/TASK-20260628-005-technical-options-report.md`

## Sources Checked

- Apple MapKit documentation and resources: https://developer.apple.com/maps/
- Apple Map Links documentation: https://developer.apple.com/library/archive/featuredarticles/iPhoneURLScheme_Reference/MapLinks/MapLinks.html
- Expo Notifications documentation: https://docs.expo.dev/versions/latest/sdk/notifications/
- Google Maps Platform pricing: https://developers.google.com/maps/billing-and-pricing/pricing
- Google Maps Platform Places usage and billing: https://developers.google.com/maps/documentation/places/web-service/usage-and-billing
- Mapbox pricing: https://www.mapbox.com/pricing
- OpenStreetMap tile usage policy: https://operations.osmfoundation.org/policies/tiles/
- Yandex Maps API documentation/pricing entry points: https://yandex.com/dev/maps/ and https://yandex.ru/dev/maps/

## Options Compared

### Mobile Stack

| Option | Pros | Cons | Recommendation |
| --- | --- | --- | --- |
| Swift/iOS | Best fit for iPhone-first mobile UX, local persistence, local notifications, Apple MapKit, Keychain, and low runtime complexity. | iOS-only; later Android/web needs another client or rewrite. | Proposed default if first real user is on iPhone. |
| React Native/Expo | Faster cross-platform path, large ecosystem, Expo supports local notifications, easier later Android support. | More dependency choices; native map/storage edges still need testing; advanced native needs custom dev client/eject risk. | Fallback if Android is a near-term requirement. |
| Flutter | Strong cross-platform mobile UI and SQLite options. | Heavier stack if team is not already invested; plugin dependency risk for maps/search/native features. | Viable but not clearly superior for this MVP. |
| PWA/mobile-first web | Fast CRUD prototype, easy desktop planning later, no app store. | Weaker native mobile reliability; offline, notifications, and app handoff vary by platform/browser. | Good prototype/web-later path, not best first product for trip-time mobile use. |

### Maps

| Option | Pros | Cons | Recommendation |
| --- | --- | --- | --- |
| Apple MapKit | Native iOS fit, simple app integration, natural Apple Maps handoff. | iOS-centric; coverage/search quality can vary by region. | Proposed default for Swift/iOS MVP. |
| Google Maps | Strong global coverage and Places; familiar handoff. | Usage-priced; billing setup; lock-in and cost risk. | Keep as approved fallback if MapKit search is inadequate. |
| Mapbox | Flexible SDKs and custom maps. | Usage-priced; more map-product decisions than MVP needs. | Defer unless custom map experience becomes strategic. |
| Yandex Maps | Strong for Russia/CIS scenarios and handoff. | Commercial/API constraints and global fit need target-market validation. | Consider handoff option; provider use needs approval. |
| OpenStreetMap/Leaflet | Open data ecosystem, good for web display. | Public OSM tiles are not a production app tile backend or offline cache source; search/geocoding still need providers. | Useful reference/data option, not complete low-effort MVP stack alone. |

## Recommended Direction

Proposed MVP architecture:

- Swift/iOS local-first app if iPhone-first validation is acceptable.
- Apple MapKit for map display and place search in the first implementation.
- External map handoff instead of own routing.
- On-device database as the first source of truth.
- Saved trip text/details readable offline after saving.
- No backend on the critical path.
- Reminders stored locally; local system notifications only after Must flows are stable.
- LLM as Later assistant module/service, never required for core trip workflows.

## Tradeoffs

- Swift/iOS gives the simplest high-quality iPhone MVP, but postpones Android.
- React Native/Expo reduces future cross-platform rewrite risk, but increases dependency and native-edge complexity now.
- Apple MapKit reduces paid-provider setup for an iOS MVP, but may need replacement or augmentation if target-region search quality is weak.
- Local-first improves travel reliability and reduces backend scope, but postpones account login, multi-device sync, shared trips, and server backup.
- Cached saved details solve the highest-value weak-network case, but must be described honestly: no offline maps or routing.
- Local notifications are reasonable, but reminders are `Should`; they should not delay trip creation, maps, day planning, flights, housing, and notes.
- LLM should fit behind a later assistant boundary because provider keys, billing, privacy, prompt logging, and hallucination control are separate risks.

## Architecture Decisions Added

All added decisions are `Proposed`, not final:

- MVP Mobile Stack Direction.
- MVP Map Provider Direction.
- Local-First MVP Storage.
- Cached Saved Details Boundary.
- Reminder Implementation Boundary.
- Future LLM Boundary.

## Open Questions

- Is the owner comfortable validating the first MVP on iPhone only?
- Which target travel regions must place search support well enough for the first real trip?
- Is iCloud/device backup sufficient initially, or is manual export/import required before sync?
- Should reminders be included in the first release after Must flows, or stay as immediate post-MVP?

## Risks

- Paid map/search providers can introduce cost and lock-in before product validation.
- PWA could underdeliver on the travel-time mobile reliability expected by the MVP.
- Backend-first implementation would add auth, hosting, sync, privacy, and failure modes too early.
- Overstating cached access could create false expectations for offline maps.
- Putting LLM into MVP would distract from validating manual trip aggregation and add privacy/billing complexity.

