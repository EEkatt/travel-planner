# REVIEW: MAP-02A Requirements Addendum By Quality

Task ID: TASK-20260704-029
Reviewer: quality_lead
Date: 2026-07-04
Reviewed artifact: `agent_workspace/reports/MAP-02A-REQUIREMENTS-ADDENDUM-20260704.md`

## Recommendation

Accept MAP-02A.

MAP-02A is sufficient for the lead to accept the requirements addendum. It closes the MAP-02 Quality Lead gaps at the requirements/testability level, preserves the Georgia-only MVP boundary, keeps offline map viewing separate from offline search/geocoding/routing/navigation, and leaves provider/offline acceptance blocked on proof artifacts and owner thresholds.

This is not a provider, architecture, implementation, or offline release approval. It is an acceptance of the addendum as the controlling clarification layer for MAP-03, MAP-04, MAP-07, and MAP-08.

## Context Read

- `agent_workspace/tasks/open/TASK-20260704-029-map-02a-quality-review.md`
- `agent_workspace/reports/MAP-02A-REQUIREMENTS-ADDENDUM-20260704.md`
- `agent_workspace/reports/MAP-02-REQUIREMENTS-20260704.md`
- `agent_workspace/reports/REVIEW-MAP-02-REQUIREMENTS-BY-QUALITY-20260704.md`
- `agent_workspace/reports/MAP-LEAD-DECISION-AFTER-MAP-02-QUALITY-20260704.md`

## Gap Closure Assessment

| MAP-02 Quality gap | MAP-02A assessment | Decision |
| --- | --- | --- |
| Exact deterministic fixture records missing | Adds canonical days, point IDs, titles, coordinates, country/day/order fields, source values, provider mock states, fixture IDs, and expected outputs. | Closed |
| Empty trip and empty selected-day behavior under-specified | Adds `map_empty_trip`, `map_no_day_empty`, `map_day_empty`, and explicit empty-state acceptance criteria. | Closed |
| Basic online map readiness implicit | Adds `map_online_ready_basic` with initialization, pan/zoom, pin/card synchronization, filter transition, and prohibited-claim assertions. | Closed |
| Successful Georgia map tap lacked fixture | Adds no-day and Day 1 successful tap fixtures with exact coordinates, created IDs, source, country, day, route order, pin color, and route-line expectations. | Closed |
| Geography/download predicates undefined | Adds canonical coordinates, `TBILISI_PROOF_AREA` bounding box, fixture classifications, outside-Georgia examples, inside-Georgia/outside-downloaded examples, and a required MAP-04 classification seam. | Closed for test fixtures; production border source remains a downstream architecture/provider dependency |
| Provider proof artifact expectations too loose | Adds concrete proof artifact IDs and evidence requirements for terms, native render, pack download, restart inventory, network-disabled reopen, overlays, attribution, cleanup, key/privacy/logging, and search normalization. | Closed |
| Owner thresholds missing | Converts unknown pack size, duration, storage, proof-area, one-area-per-trip, and fallback-model values into explicit owner blockers. | Closed as gated decisions |
| Vague clauses remained test-hostile | Replaces `where supported`, `when meaningful`, `usable address`, `supported Georgia scope`, provider label mechanics, persistence restart, outside-Georgia note-only save, return-to-downloaded-area, and autocomplete with objective conditions or gates. | Closed |
| Route-line observability missing | Requires an app-owned planned-line model/test hook with day ID, included/excluded point IDs, coordinates, and `planned_order` line type. | Closed |
| Russian copy allow/deny missing | Adds approved Russian terms and prohibited terms for offline/search/route/navigation/traffic/ETA/global/Yandex guarantee claims. | Closed |
| Reorder automation path missing | Requires deterministic move controls or documented accessible drag pattern with stable labels/test IDs. | Closed |

## Review Focus Results

- Deterministic fixtures are concrete enough for MAP-07/MAP-08 test design: yes. They include fixture IDs, seed records, provider states, expected created records, expected classifications, and route-line models.
- Empty states are covered: yes, for empty trip, empty no-day, and empty selected day.
- Map-tap success is covered: yes, for Georgia no-day and selected-day creation.
- Geography/download classifications are covered: yes for deterministic fixtures, with production classification delegated to a MAP-04 seam and approved source.
- Proof artifacts are covered: yes, with evidence requirements and pass/fail dependencies.
- Owner threshold blockers are covered: yes, and correctly block provider/offline acceptance rather than blocking MAP-02A acceptance.
- Russian copy terms are covered: yes, with positive and prohibited terms plus MAP-07 failure condition for prohibited production UI terms.
- Georgia-only MVP is preserved: yes. Outside-country coordinate-backed saves are blocked by default, and whole-country Georgia remains a target pending proof.
- Offline capability is not expanded: yes. Offline search, geocoding, routing, navigation, optimization, traffic, ETA, and rerouting remain explicitly out of scope.

## Remaining Testability Gaps

These are downstream implementation/proof dependencies, not MAP-02A rework blockers:

1. MAP-04 must define the production `classifyCoordinate(latitude, longitude, downloadedArea?)` seam and its approved border/download-area source. Until then, MAP-07/MAP-08 should assert only the MAP-02A fixture classifications.
2. MAP-04/MAP-05 must expose stable test hooks for planned-line state, point focus, filter mode, provider mock injection, network/download state, and reorder controls.
3. MAP-07 must convert MAP-02A fixtures into executable seed data and mocked provider states without changing IDs, coordinates, or expected classifications.
4. MAP-08 must still validate native/device proof artifacts manually for offline map claims; automation alone is not enough for downloaded-pack acceptance.
5. Provider timeout thresholds, retry timing, SDK failure taxonomy, and storage persistence boundaries still need architecture/implementation definitions, but MAP-02A correctly gates them rather than leaving them ambiguous.

## Remaining Owner-Decision Blockers

These remain blocking for provider acceptance, MAP-06 offline proof acceptance, and release claims:

1. Maximum acceptable whole-country Georgia offline pack size.
2. Maximum acceptable download duration on representative mobile network conditions.
3. Maximum acceptable on-device storage footprint, including cache/index overhead and cleanup expectations.
4. First MAP-06 proof area: whole-country Georgia, `TBILISI_PROOF_AREA`, or another owner-approved Georgia area.
5. Whether one downloaded area per trip is acceptable for MVP if whole-country Georgia is impractical.
6. Preferred fallback model if whole-country Georgia fails thresholds: regions, cities, or one manually chosen Georgia area per trip.
7. Owner policy for outside-Georgia manual note-only saves, Yandex address/web/copy fallback, and coordinate editing remains relevant, but MAP-02A provides safe defaults while undecided.

## Go / No-Go

MAP-02A acceptance: Go.

MAP-03 review acceptance: Go if MAP-03 uses MAP-02A proof artifacts and owner threshold blockers, and does not claim accepted production provider/offline capability before the required evidence and owner decisions exist.

MAP-04 review acceptance: Go if MAP-04 incorporates the MAP-02A fixture contracts, classification seam, provider adapter seams, route-line test hook, persistence-stage gates, and reorder test hook. No-go if it hardcodes broader geography, treats offline routing/search/geocoding as MVP, or omits the test seams required by MAP-02A.

MAP-07 automation: Go for test design and fixture implementation from MAP-02A. No-go for final automation acceptance until MAP-04/MAP-05 provide the required test hooks and stable seed/provider mock mechanisms.

MAP-08 QA: Go for manual QA planning from MAP-02A. No-go for offline downloaded-map QA pass until MAP-03/MAP-06 evidence exists for native render, download, restart inventory, network-disabled reopen, overlays, attribution, cleanup, and owner thresholds.

Final recommendation: Accept MAP-02A as the requirements addendum. Continue MAP-03 and MAP-04 reviews under the explicit gates above; keep implementation/offline release acceptance blocked until provider proof, architecture seams, executable tests, and owner decisions are complete.
