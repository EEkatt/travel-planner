# REVIEW: MAP-02 Requirements By Quality

Task ID: TASK-20260704-025
Reviewer: quality_lead
Date: 2026-07-04
Reviewed artifact: `agent_workspace/reports/MAP-02-REQUIREMENTS-20260704.md`

## Recommendation

Accept MAP-02 as the requirements baseline for starting MAP-03 provider discovery and MAP-04 architecture framing, with required tightening before any provider commitment, architecture sign-off, implementation, native/offline spike acceptance, MAP-07 automation, or MAP-08 QA execution.

This is not a clean implementation go. MAP-02 is good enough to keep the work moving because it preserves the core product guardrails: Georgia-only MVP, whole-country Georgia offline as a provider/device-proof-gated target, explicit separation of offline map viewing from offline routing/search/geocoding/navigation, card order as the source of truth for selected-day numbering and route line, and fixture/proof thinking for later QA.

The lead should treat the gate as:

- Go for MAP-03/MAP-04 discovery/design work using MAP-02 as the baseline.
- No-go for provider selection, offline-map release claims, MAP-05 implementation, MAP-06 proof acceptance, MAP-07 automation, or MAP-08 QA until the gaps below are closed or explicitly accepted as follow-up inputs.

## Context Read

- `agent_workspace/tasks/open/TASK-20260704-025-map-02-quality-review.md`
- `agent_workspace/reports/MAP-02-REQUIREMENTS-20260704.md`
- `agent_workspace/reports/MAP-LEAD-REVIEW-20260704.md`
- `agent_workspace/reports/MAP-00-SCOPE-20260704.md`
- `agent_workspace/reports/MAP-01-UX-20260704.md`
- `agent_workspace/reports/REVIEW-MAP-00-SCOPE-BY-REQUIREMENTS-20260704.md`
- `agent_workspace/reports/REVIEW-MAP-01-UX-BY-QA-20260704.md`
- `agent_workspace/reports/REVIEW-MAP-01-UX-BY-PRODUCT-20260704.md`
- `requirements/11_map_requirements.md`
- `requirements/07_requirements.md`
- `requirements/08_mvp.md`

## Quality Gate Assessment

| Gate | Assessment | Decision |
| --- | --- | --- |
| Georgia-only MVP preserved | MAP-REQ-013 blocks silent outside-Georgia coordinate-backed saves, and offline fallback remains Georgia-only/owner-approved. | Pass |
| Whole-country offline Georgia provider-proof gated | MAP-REQ-009 and the proof matrix correctly require MAP-03/MAP-06 evidence before accepting `downloaded` or whole-country claims. | Pass |
| Offline map viewing separated from routing/search/geocoding/navigation | MAP-REQ-009/010/011 and copy-negative assertions explicitly ban offline search, geocoding, routing, navigation, optimization, traffic, travel time, and live rerouting claims. | Pass |
| Card order is selected-day source of truth | MAP-REQ-003 and MAP-REQ-007 correctly tie card order, routeOrder, pin numbers, and route line sequence together, including no-coordinate gaps. | Pass |
| Saved cards/lists remain source of truth on failures | Covered across no-coordinate, offline-not-downloaded, provider failure, search failure, and Yandex handoff failure requirements. | Pass |
| Every accepted requirement is testable | Mostly pass, but several clauses still use conditional wording that needs definitions: `where supported`, `when meaningful`, `usable address`, `provider label mechanics`, and `supported Georgia scope`. | Conditional pass |
| Fixtures/proof are enough for MAP-07/MAP-08 | Fixture names and primary assertions are good, but exact deterministic records, coordinates, provider mocks, expected state transitions, and proof artifact formats are not yet specified. | Conditional pass |

## Requirement Coverage Gaps

1. Empty trip and empty selected-day behavior are under-specified as requirements.
   MAP-02 includes `map_day_empty` in the fixture list, but there is no corresponding numbered requirement or Given/When/Then acceptance group. Empty trip map is also not represented, although MAP-01 and QA review called it out. Add explicit acceptance for empty trip, empty no-day, and empty day route states.

2. Basic online map readiness is implicit rather than separately testable.
   MAP-02 covers filters and failure states, but it does not separately assert that the normal online map opens, zooms, pans, and keeps cards/lists synchronized. This matters for MAP-04 architecture and MAP-07 smoke coverage.

3. Successful map-tap creation lacks a named deterministic fixture.
   MAP-REQ-004 has acceptance criteria, but the fixture list only includes outside-Georgia and outside-downloaded tap failures. Add a success fixture with a concrete Georgia coordinate, selected day/no-day choice, expected created fields, and expected map/list membership.

4. Geography predicates need a shared definition.
   Requirements say inside/outside Georgia and inside/outside downloaded area, but do not define the boundary source, coordinate examples, or tolerance. MAP-03/MAP-04 need one canonical predicate or fixture-level coordinates so provider, architecture, and tests do not implement different country/download checks.

5. Provider proof lacks pass/fail thresholds.
   The proof matrix correctly requires pack size, download duration, storage, limits, restart persistence, and offline reopen evidence. It does not define acceptable pack size/download duration or who must approve the threshold. Those are listed as open owner decisions, so MAP-03 can start research but cannot produce an accept decision until the thresholds are supplied.

6. Yandex fallback policy remains intentionally open.
   MAP-REQ-015 correctly gates web fallback/copy-address/copy-coordinates behind owner approval. MAP-03/MAP-04 should not design these as committed behavior until the owner decision is recorded.

## Testability Gaps

- Replace conditional phrases with test conditions: `when meaningful`, `where supported`, `usable address`, and `supported Georgia scope` need concrete criteria or explicit owner/provider dependency notes.
- Define exact fixture records for MAP-07: point IDs, titles, day IDs, route orders, coordinates, missing-coordinate records, provider result payload shape after normalization, network state, and expected visible state.
- Define route-line observability for tests: expected ordered coordinate sequence or app-owned route-line model, so automation does not rely only on visual inspection.
- Define persistence/restart boundaries. MAP-REQ-007 says reorder persists after restart once persistence exists, and provider proof requires pack inventory after restart, but MAP-07/MAP-08 need separate in-memory versus persisted acceptance stages.
- Define a Russian copy allow/deny lexicon. Copy-negative assertions are strong, but MAP-07 needs exact prohibited phrases and approved alternatives for `planned order`, downloaded map viewing, and external handoff.
- Add accessibility test hooks for reorder. MAP-REQ-007 allows explicit move buttons or accessible drag, but MAP-07 needs a deterministic way to execute and assert reorder on mobile.

## Fixture And Proof Matrix Gaps

| Area | Current MAP-02 state | Gap to close |
| --- | --- | --- |
| Fixture names | Broad fixture list is present and aligned with prior QA/product reviews. | Add exact fixture data records and expected outputs. |
| Empty states | `map_no_day_empty` and `map_day_empty` exist; empty trip is missing. | Add empty trip fixture and requirement acceptance. |
| Map-tap success | Acceptance exists without named fixture. | Add `map_tap_success_georgia_no_day` and `map_tap_success_georgia_day` or one parameterized fixture. |
| Outside-area states | Outside Georgia and outside downloaded area are separated. | Add canonical coordinates/bounds to avoid inconsistent provider/test interpretations. |
| Search failures | Offline, no-results, timeout/quota/API/malformed response are covered. | Add normalized mock response/error shapes and expected no-auto-save assertions. |
| Offline proof | Matrix covers native render, pack inventory, offline reopen, overlays, line, cleanup, attribution, key privacy. | Add evidence format and pass/fail thresholds for size, duration, storage, restart, and network-disabled reopen. |
| Copy assertions | Negative claims list is strong. | Add approved positive wording, especially Russian wording, before UI copy QA. |

## Downstream Risks

MAP-03 provider risk:
Provider research may return evidence without a clear accept/reject result if owner thresholds for whole-country Georgia pack size, download duration, storage budget, and fallback area model are not decided first.

MAP-04 architecture risk:
Architecture may encode inconsistent predicates for Georgia boundary, downloaded-area boundary, route order, provider result storage, or Yandex target validity unless MAP-02 adds exact data contracts and test fixture shapes.

MAP-05 prototype risk:
Implementation could pass visible happy-path demos while missing empty states, restart persistence, deterministic map-tap success, and copy-negative assertions if those remain only narrative.

MAP-06 native/offline spike risk:
The spike may prove "a downloaded pack opens" but not prove restart inventory, network-disabled reopen, offline overlays, planned line rendering, attribution, cleanup, and whole-country feasibility against accepted thresholds.

MAP-07 automation risk:
Automation cannot be reliable from fixture names alone. It needs seeded records, provider mocks, expected route-line data, copy assertions, and deterministic reorder controls.

MAP-08 QA risk:
Manual QA may conflate outside Georgia, outside downloaded area inside Georgia, offline not downloaded, and provider failure unless each state has exact fixture data and expected UI behavior.

## Required Rework Before Commit-Level Downstream Work

1. Add an MAP-02 addendum or revision with exact deterministic fixture records, including empty trip, empty day, successful Georgia map tap, outside Georgia, and outside downloaded area coordinates.
2. Add explicit acceptance for empty trip and empty selected-day route states.
3. Define the shared geography/download-area predicate or provide fixture coordinates and expected classifications.
4. Resolve or gate provider pass/fail thresholds: max offline pack size, max download duration, acceptable storage footprint, representative proof area, and whether one downloaded area per trip is acceptable.
5. Replace vague test clauses with objective conditions or explicit dependency gates.
6. Define proof artifact expectations for MAP-03/MAP-06: device/platform, restart steps, network-disabled steps, screenshots/logs, pack inventory evidence, attribution evidence, and cleanup evidence.
7. Define copy-positive terms in Russian for planned order/offline map viewing/external handoff, alongside the existing negative assertions.

## Lead Go/No-Go

Go: Start MAP-03 provider discovery and MAP-04 architecture framing from MAP-02, limited to research, questions, interface design, and proof-plan preparation.

No-go: Do not commit a provider, accept whole-country offline Georgia, sign off MAP-04 architecture, start MAP-05 implementation as production work, accept MAP-06 native/offline proof, or build MAP-07/MAP-08 against this artifact until the required rework above is complete or explicitly accepted as separate follow-up tasks.

Final recommendation: Accept MAP-02 conditionally for discovery/design start; require focused rework before downstream commitment or execution gates.
