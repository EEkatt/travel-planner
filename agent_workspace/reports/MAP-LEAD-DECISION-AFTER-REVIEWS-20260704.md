# Map Lead Decision After MAP-02A / MAP-03 / MAP-04 Reviews

Date: 2026-07-04
Lead: lead
Status: MAP-02A accepted; MAP-03 accepted for discovery only; MAP-04 requires rework

## Reviewed Artifacts

- `agent_workspace/reports/MAP-02A-REQUIREMENTS-ADDENDUM-20260704.md`
- `agent_workspace/reports/REVIEW-MAP-02A-BY-QUALITY-20260704.md`
- `agent_workspace/reports/MAP-03-PROVIDER-DISCOVERY-20260704.md`
- `agent_workspace/reports/REVIEW-MAP-03-PROVIDER-BY-TECHNICAL-20260704.md`
- `agent_workspace/reports/REVIEW-MAP-03-PROVIDER-BY-SECURITY-20260704.md`
- `agent_workspace/reports/MAP-04-ARCHITECTURE-FRAMING-20260704.md`
- `agent_workspace/reports/REVIEW-MAP-04-ARCHITECTURE-BY-CRITIC-20260704.md`
- `agent_workspace/reports/REVIEW-MAP-04-ARCHITECTURE-BY-CODE-QUALITY-20260704.md`

## Decisions

### MAP-02A

Accepted.

Quality Lead confirmed MAP-02A closes the MAP-02 testability gaps at the requirements level. Remaining blockers are owner/provider/proof decisions, not MAP-02A rework blockers.

### MAP-03

Accepted for discovery and MAP-06 planning only.

Do not accept:

- production provider choice;
- whole-country Georgia offline claim;
- autocomplete;
- provider-result storage policy;
- provider key integration;
- release copy;
- production use of public Nominatim or public OSM web tiles.

MAP-03 can inform MAP-06 planning after architecture rework and owner thresholds.

### MAP-04

Needs rework before MAP-05 implementation planning or MAP-07 automation planning.

MAP-04 is directionally sound but not implementation-planning ready.

## MAP-04 Rework Scope

Create MAP-04R architecture rework with these required corrections:

1. Define one pure app-owned coordinate classification seam:
   - `insideGeorgia`;
   - `insideDownloadedArea`;
   - reason code;
   - MAP-02A fixture-backed outputs.
2. Resolve `MapPoint` versus existing `Place` / `DayItem` ownership:
   - decide whether `MapPoint` is persisted canonical model or derived projection;
   - define one authoritative write path.
3. Define route-order transaction semantics for:
   - assign day;
   - clear day;
   - reorder cards;
   - delete point;
   - no-coordinate cards;
   - reload/persistence.
4. Split offline concepts:
   - pack lifecycle;
   - proof/acceptance state;
   - coordinate/camera coverage classification.
5. Keep external map handoff generic:
   - no Yandex-specific leakage in domain/module boundaries;
   - Yandex remains a provider policy/fallback adapter.
6. Incorporate MAP-02A instead of treating it as missing:
   - fixture IDs;
   - coordinates/classifications;
   - proof artifact expectations;
   - Russian copy constraints.
7. Add route-line observability:
   - selected day;
   - included point IDs;
   - excluded no-coordinate point IDs;
   - ordered coordinates;
   - stable test/debug model.
8. Add validation contracts:
   - coordinates;
   - country narrowing;
   - routeOrder integer invariants;
   - provider metadata allowlist;
   - raw provider payload rejection.

## Blocked

Still blocked:

- MAP-05 implementation planning;
- MAP-06 native/offline spike execution;
- MAP-07 automation;
- MAP-08 QA execution;
- production provider/security sign-off.

## Next Step

Start MAP-04R architecture rework with `architecture_agent`.

Reviewers after rework:

- `architecture_critic`;
- `code_quality_reviewer`;
- lead.
