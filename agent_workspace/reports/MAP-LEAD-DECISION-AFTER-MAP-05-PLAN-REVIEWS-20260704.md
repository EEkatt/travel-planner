# Map Lead Decision After MAP-05 Plan Reviews

Date: 2026-07-04
Lead: lead
Status: MAP-05 plan needs focused rework before implementation

## Reviewed Artifacts

- `agent_workspace/reports/MAP-05-DOMAIN-MOCK-IMPLEMENTATION-PLAN-20260704.md`
- `agent_workspace/reports/REVIEW-MAP-05-PLAN-BY-CODE-QUALITY-20260704.md`
- `agent_workspace/reports/REVIEW-MAP-05-PLAN-BY-QA-20260704.md`

## Decision

Do not start the first code patch yet.

Code Quality accepts Slice 1 with constraints, but QA marks the plan as no-go until focused test coverage gaps are fixed.

## Accepted Constraints

The first implementation patch must:

- stay pure domain/mock/test;
- leave `app/mobile/App.tsx` untouched;
- add no production provider/native/offline dependencies;
- avoid real provider keys;
- avoid public Nominatim/OSM as production behavior;
- use bounded dev test tooling only if needed.

## Required MAP-05P Rework

The MAP-05 plan must be revised to:

1. Fix swapped-coordinate parser expectation.
2. Add explicit first-patch coverage for `map_no_day_empty`.
3. Add explicit first-patch coverage for `map_day_three_coordinate_points`.
4. Add copy-negative foundations for prohibited offline/navigation claims.

## Next Step

Start MAP-05P plan rework with `mobile_expo_engineer`.

After MAP-05P:

- QA re-review is required.
- Code Quality re-review is optional unless the patch scope changes.
