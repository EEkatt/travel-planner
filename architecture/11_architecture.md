# Architecture

## Status

Draft. Cross-platform MVP direction is selected for implementation planning.

## Product Architecture

Центральная сущность продукта - `Trip`.

Связанные сущности:

- `Place`;
- `DayPlan`;
- `RoutePoint`;
- `Flight`;
- `HotelBooking`;
- `Note`;
- `Checklist`;
- `Reminder`;
- `Attachment` later;
- `Expense` later.

## Proposed MVP Direction

Recommended MVP shape: cross-platform mobile-first local-first application with an optional future sync/backend boundary.

The MVP should optimize for:

- fast access on a phone during a trip;
- reliable manual entry with incomplete data;
- saved trip details that remain readable with weak or absent network;
- map display and external navigation handoff without own routing;
- no dependency on LLM, automatic import, live flight data, collaboration, or full offline maps.

## Mobile Stack Options

| Option | Strengths | Weaknesses | MVP fit |
| --- | --- | --- | --- |
| Swift/iOS | Best native iPhone UX, local storage, Apple MapKit, local notifications, Keychain, background behavior, and App Store path. Smallest runtime stack for iOS-only personal MVP. | iOS-only; later Android/web requires another client or rewrite. Requires Apple development workflow. | Rejected as default because Android support should remain reachable without rewriting the whole product. |
| React Native/Expo | Faster cross-platform iteration, strong ecosystem, Expo local notifications, broad UI/community support, easier later Android path than Swift. | Native map/search/storage edges still need careful testing; offline persistence and migrations require chosen libraries; advanced native behavior may need custom dev client or ejecting. | Selected default: build and test first on computer/iPhone-focused layouts, while keeping Android reachable from the same codebase. |
| Flutter | Good cross-platform UI consistency, local SQLite support, mature mobile app tooling. | Dart/Flutter stack choice is heavier if the team is not already using it; native maps/search plugins add dependency risk; web/PWA output is not the same as a web product. | Viable, but not clearly better than React Native/Expo unless team already prefers Flutter. |
| PWA/mobile-first web | Fast prototype and easiest desktop planning later; deployable without app stores; good for CRUD and responsive UI. | Mobile offline, notifications, background behavior, and native map handoff are more constrained and vary by platform/browser; app-like travel reliability is weaker. | Good prototype path, weaker first product if the main scenario is phone use during travel. |

Recommendation: use React Native/Expo with TypeScript as the default MVP stack. Validate the first layouts against iPhone 14 Pro Max dimensions, but keep Android support reachable from the same codebase.

## Map Provider Options

MVP needs three map capabilities:

- search or geocoding for adding places;
- display saved coordinates on a trip/day map;
- external navigation handoff to installed map apps.

The MVP does not need own routing, route optimization, live traffic, or offline maps.

| Option | Strengths | Weaknesses | MVP fit |
| --- | --- | --- | --- |
| Apple MapKit | Strong iOS-native fit, good user experience on iPhone, MapKit/MapKit JS ecosystem, natural Apple Maps handoff. Avoids adding a third-party map SDK for an iOS MVP. | iOS-centric; less useful for Android; coverage/search quality varies by region; owner must accept Apple ecosystem dependency. | Not the default for cross-platform MVP. Useful as an external handoff target on iOS. |
| Google Maps Platform | Broad coverage and familiar UX; strong Places and Maps products; easy external handoff to Google Maps URLs/apps. | Usage-priced APIs and billing setup; provider lock-in risk; Places/search can become a material cost if usage grows. | Good candidate when search quality matters more than minimizing vendor/cost exposure. |
| Mapbox | Strong custom maps and SDKs; cross-platform options; flexible visual styling. | Usage-priced; search/geocoding and map display are separate product decisions; unnecessary complexity if MVP only needs simple pins and handoff. | Viable for custom map-heavy future, not the leanest MVP default. |
| Yandex Maps | Strong regional relevance for Russia/CIS users; useful external handoff where Yandex Maps is common. | Commercial/API constraints and regional availability must be checked for intended market; less universal if product later targets global travel. | Consider as external handoff option and maybe search provider for Russia/CIS-focused use. |
| OpenStreetMap/Leaflet | Open data ecosystem; low vendor lock-in for web display; useful for a later web prototype. | Public OSM tile service is not a production app tile backend and is not for bulk/offline use; mobile SDK/search/geocoding require additional providers or self-hosting. | Good data/source option, but not a complete low-effort MVP map stack by itself. |

Recommendation: for React Native/Expo MVP, use a map implementation that can run on both iOS and Android, keep provider-specific calls behind `MapViewProvider` and `PlaceSearchProvider` interfaces, and start with external navigation handoff. Final map/search provider choice remains a follow-up spike because pricing, coverage, and SDK constraints matter.

## Storage And Sync

Recommended MVP direction: local-first.

Local-first means the app's source of truth for the first implementation is an on-device database, not a remote API. The app should read and write trip data locally first, and future sync should be added as an explicit capability after the manual MVP is validated.

Suggested local model:

- `Trip` owns related trip entities through stable local IDs.
- `Place` stores user-entered name/address/comment plus optional coordinates and provider metadata.
- `DayPlan` and `RoutePoint` store manual ordering, optional times, and references to places/events.
- `Flight`, `HotelBooking`, `Note`, and `Checklist` are editable manually and tolerate incomplete fields.
- `Reminder` stores intended reminder time and target entity even if system notification permission is not available.

Suggested local storage:

- React Native/Expo: SQLite-backed storage with explicit migrations or another Expo-compatible local database selected during implementation spike.
- Sensitive small secrets, if any, should use platform secure storage. Avoid passport data in early versions.

## Cached Saved Details

Cached saved details should be treated as a core local-read capability, not as full offline mode.

Recommended first implementation:

- all text data for the current trip is readable offline after it has been saved locally;
- trips, days, places, flights, housing, notes, and checklists open without network;
- saved coordinates remain available and can be shown if the map SDK has already cached tiles, but the product must not promise offline map tiles or offline routing;
- place search, geocoding, map tile loading, and external navigation are clearly online-dependent when the network is unavailable;
- failed online enrichment must not block manual place creation.

This satisfies the saved-detail value without introducing tile caching, route engines, or a sync conflict system.

## Backend Direction

Do not build a backend for the MVP critical path unless owner scope changes require account login, multi-device sync, shared trips, or server-side LLM.

Recommended staging:

1. MVP: local database, local export/backup consideration, no account.
2. Post-MVP backup: manual export/import or iCloud/device backup path, depending on chosen platform.
3. Post-MVP sync: small API with authenticated `Trip` sync, conflict strategy, and server-side encrypted-at-rest storage.
4. Collaboration: separate product/architecture decision after personal trip use is validated.

A personal server can be a later sync/LLM host, but should not be introduced before there is a concrete sync or AI need.

## Notifications And Reminders

Recommendation: reminders should not be a first implementation blocker. They can be included only after Must MVP flows work if local notifications are cheap in the chosen stack.

Implementation direction:

- Store reminder records in the local database as user data.
- Schedule local system notifications on-device when permission is granted.
- Show reminder state in-app even when notification permission is denied.
- Avoid server push, queues, worker infrastructure, and external notification providers for MVP.
- Do not implement flight live alerts, gate changes, delay tracking, or email/calendar import.

## Future LLM Integration

LLM is outside MVP and must not be required to create, edit, read, or navigate a trip.

Future fit:

- add an `Assistant` module/service later that reads explicit user-selected trip context;
- keep domain commands deterministic: create suggestion drafts, never silently mutate trips;
- require user confirmation before generated places, day plans, notes, or checklists are saved;
- run LLM calls through a server-side boundary if API keys, billing, prompt logging, or provider switching are needed;
- redact or avoid sending booking numbers, private notes, contacts, and sensitive details unless explicitly approved by the user.

## Architectural Constraints

- Mobile-first usage is the primary MVP scenario.
- Trip data model must not depend on a map provider, LLM provider, booking provider, or flight provider.
- Manual entry must work when place search/geocoding fails.
- External maps provide navigation; MVP does not own routing.
- Saved details can work offline; offline maps and routing are Later.
- Backend, sync, collaboration, and LLM are future capabilities, not MVP prerequisites.
- Important product/technical decisions remain Proposed until owner approval.
