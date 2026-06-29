# Task: MapLibre Offline Map Spike

Task ID: TASK-20260629-008
Status: Done
Priority: High
Created: 2026-06-29
Created By: lead
Assigned To: technical_analyst

## Objective

Validate whether MapLibre React Native is a practical MVP map provider for cross-platform offline trip maps.

The MVP requirement is strict: the user must be able to download the prepared trip map area before travel and open that map without internet during the trip.

## Editable Files

- `architecture/12_decisions.md`
- `architecture/16_offline_map_provider_research.md`
- `agent_workspace/reports/TASK-20260629-008-maplibre-offline-map-spike-report.md`

## Read-Only Context

- `architecture/11_architecture.md`
- `architecture/13_implementation_slices.md`
- `architecture/15_security_and_resilience.md`
- `requirements/07_requirements.md`
- `requirements/08_mvp.md`
- `requirements/10_backlog.md`
- `app/mobile/AGENTS.md`
- `app/mobile/package.json`
- `app/mobile/app.json`

## Do Not Edit

- Product scope files outside the allowed editable files.
- App source code unless Lead explicitly approves implementation after this task.
- Git metadata.

## Required Work

Research and document:

- whether `@maplibre/maplibre-react-native` supports the current Expo/React Native baseline;
- exact development build implications for iOS and Android;
- whether `OfflineManager.createPack` can satisfy the prepared trip area download requirement;
- what tile/style provider is needed for a real offline pack;
- licensing, pricing, account/token, offline download, and storage risks for likely providers;
- minimum proof-of-concept steps for `app/mobile`;
- fallback criteria for switching to `@rnmapbox/maps` or `react-native-maps` with local tiles.

## Required Output

Create a report at:

- `agent_workspace/reports/TASK-20260629-008-maplibre-offline-map-spike-report.md`

The report must include:

- recommendation: proceed / proceed with conditions / reject;
- dependency and config changes expected for `app/mobile`;
- exact local commands for the implementation spike;
- acceptance criteria for the implementation spike;
- risks that would block broad map implementation;
- open questions for the owner or Lead.

Update:

- `architecture/16_offline_map_provider_research.md` with any corrected facts;
- `architecture/12_decisions.md` only if the recommendation is strong enough to record a decision or bounded fallback.

## Quality Bar

- Use current official docs or primary repository docs.
- Do not assume Expo Go support.
- Do not promise offline routing.
- Treat map tile licensing and offline download limits as release-blocking facts, not later polish.
- Keep the MVP focused on downloaded map display plus saved trip points.

## Stopping Condition

Stop when the report is ready for Lead review, or earlier if MapLibre is blocked by a hard compatibility/licensing issue.
