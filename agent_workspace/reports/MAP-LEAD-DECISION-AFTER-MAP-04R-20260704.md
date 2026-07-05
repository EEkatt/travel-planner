# Map Lead Decision After MAP-04R Reviews

Date: 2026-07-04
Lead: lead
Status: Go for MAP-05 domain/mock implementation planning

## Reviewed Artifacts

- `agent_workspace/reports/MAP-04R-ARCHITECTURE-REWORK-20260704.md`
- `agent_workspace/reports/REVIEW-MAP-04R-BY-CRITIC-20260704.md`
- `agent_workspace/reports/REVIEW-MAP-04R-BY-CODE-QUALITY-20260704.md`
- `agent_workspace/reports/MAP-02A-REQUIREMENTS-ADDENDUM-20260704.md`
- `agent_workspace/reports/MAP-03-PROVIDER-DISCOVERY-20260704.md`

## Decision

Accept MAP-04R for MAP-05 domain/mock implementation planning.

Both architecture critic and code quality reviewer confirmed the original MAP-04 blockers are resolved. No remaining blocking architecture issues prevent domain/mock implementation planning.

## Allowed Now

MAP-05 may implement or plan:

- pure domain contracts;
- MAP-02A fixtures;
- coordinate classification;
- `Place` / `DayItem`-backed map projections;
- route-order command semantics;
- route-line observable selector/debug model;
- mock map/search/offline/external-handoff adapters;
- web prototype behavior using mocks and accepted fixtures;
- deterministic tests where tooling already supports them.

## Still Blocked

Do not implement or claim:

- production provider selection;
- real provider keys;
- autocomplete;
- public Nominatim as production search;
- public OSM tiles as production/offline tiles;
- whole-country Georgia offline support;
- native/offline release readiness;
- offline search/geocoding/routing/navigation;
- route optimization, traffic, ETA, or live rerouting.

## MAP-05 Carry-Forward Notes

- Target-missing day-card snapshots need a representable card view.
- Fewer-than-two-point route-line cases still need selector/debug observability even when no drawable line is rendered.
- Current web prototype is allowed as prototype context only; it must not become proof of native/offline/provider behavior.

## Next Step

Start MAP-05 domain/mock implementation planning with `mobile_expo_engineer`.

Reviewers after MAP-05:

- `code_quality_reviewer`;
- `qa_engineer`;
- lead.
