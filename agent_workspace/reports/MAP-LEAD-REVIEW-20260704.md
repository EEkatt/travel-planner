# Map Feature Lead Review

Date: 2026-07-04
Lead: lead
Status: MAP-00 and MAP-01 accepted for MAP-02

## Reviewed Artifacts

- `agent_workspace/reports/MAP-LEAD-ORCHESTRATION-20260704.md`
- `agent_workspace/reports/MAP-00-SCOPE-20260704.md`
- `agent_workspace/reports/MAP-01-UX-20260704.md`
- `agent_workspace/reports/REVIEW-MAP-00-SCOPE-BY-REQUIREMENTS-20260704.md`
- `agent_workspace/reports/REVIEW-MAP-01-UX-BY-QA-20260704.md`
- `agent_workspace/reports/REVIEW-MAP-01-UX-BY-PRODUCT-20260704.md`

## Decision

Accept MAP-00-SCOPE and MAP-01-UX as the baseline for MAP-02 detailed requirements.

No rework is required for the MAP-00 or MAP-01 reports before MAP-02 starts. The independent reviewers agree that the work preserves the owner's intent and keeps unproven provider/offline capabilities gated.

## Accepted Baseline

- MVP geography remains Georgia only.
- Whole-country offline Georgia remains a product target, not a proven release commitment.
- Any fallback to Georgia regions/cities requires owner approval.
- No-day points are neutral gray.
- Day-assigned route points are red.
- Selected-day map mode shows numbered points and a planned order line.
- Route order is edited through cards below the map, not by dragging map pins.
- Reordering cards updates card order, pin numbers, and planned order line sequence.
- Online search is for concrete places/landmarks.
- Autocomplete/suggestions are conditional on production provider approval.
- Manual add remains available when search is offline, empty, failing, or unavailable.
- Yandex Maps handoff is a point-level fallback only.
- Saved cards/lists remain the source of truth when map/search/provider/handoff fails.

## Hard Guardrails For MAP-02

MAP-02 must not convert target behavior into implementation proof. It must split offline map items into:

- product target;
- provider/device proof prerequisite;
- user-facing behavior;
- acceptance test.

MAP-02 must explicitly ban MVP claims for:

- offline search;
- offline geocoding;
- offline routing;
- turn-by-turn navigation;
- route optimization;
- traffic;
- travel-time estimation;
- guaranteed Yandex Maps availability.

MAP-02 must treat the current web prototype as prototype evidence only. It is not proof of native map SDK behavior, offline pack download, offline reopen, provider terms, or restart persistence.

## Required MAP-02 Content

- Numbered, prioritized map requirements.
- Given/When/Then acceptance criteria.
- Separate acceptance groups for:
  - all-points map mode;
  - no-day map mode;
  - selected-day route mode;
  - map-tap point creation;
  - online search point creation;
  - assign day / clear day;
  - card reorder;
  - no-coordinate points;
  - offline downloaded map;
  - offline without downloaded map;
  - search offline/no-results/provider failure;
  - map provider failure;
  - outside Georgia;
  - outside downloaded area;
  - Yandex Maps missing target/handoff failure.
- Canonical point fields:
  - stable id;
  - title;
  - optional address;
  - optional note;
  - nullable coordinates;
  - day assignment;
  - per-day route order;
  - source;
  - provider-normalized saved fields where allowed.
- Rule for selected-day numbering when no-coordinate items are in the ordered card list.
- Rule for outside-Georgia results: block, warn, or save as manual note only.
- Rule for outside downloaded area while offline.
- Card reorder persistence expectations.
- Copy-negative assertions that reject misleading map/offline/navigation wording.

## Required Fixture Set

MAP-02/MAP-07 must define deterministic fixtures for:

- coordinate-backed no-day point;
- coordinate-backed day point;
- day point without coordinates;
- no-day point without coordinates;
- selected day with at least three coordinate-backed points;
- selected day with mixed coordinate and no-coordinate points;
- point with address but no coordinates;
- point with neither address nor coordinates;
- outside-Georgia search result;
- outside-downloaded-area offline state;
- search empty result;
- search timeout/quota/API failure;
- map provider/tile/SDK failure;
- Yandex Maps unavailable/deep-link failure.

## Blocked Work

Do not start MAP-03 provider decision, MAP-05 implementation, MAP-06 native/offline spike, MAP-07 automation, MAP-08 QA, or MAP-09 security as production work until MAP-02 has been completed and reviewed.

Provider research can prepare questions, but it must not commit provider choice, terms interpretation, offline pack claims, or app implementation scope before MAP-02 acceptance.

## Next Task

Start MAP-02 detailed requirements with `requirements_analyst`.

Expected output:

- `agent_workspace/reports/MAP-02-REQUIREMENTS-20260704.md`

Reviewers:

- `quality_lead`
- `lead`

## Lead Result

Go for MAP-02.

No-go for provider commitment or code implementation until MAP-02 is accepted.
