# Map Lead Instructions: MAP-05 Slice 2

Date: 2026-07-05
Lead: lead
Status: Ready to execute

## Goal

Fix the current map prototype UX and continue development by wiring the accepted map domain direction into a small UI/prototype slice.

Owner feedback to address:

- Two separate place-search/add surfaces are not acceptable.
- The user should not have to press `Find` before seeing place options.
- Suggestions should appear while typing.
- Suggestions/search must be scoped to the selected MVP country, Georgia.

## Product Boundary

This slice may improve the prototype UI, but must not claim production provider support.

Allowed:

- one unified `Add place` flow;
- local/mock Georgia suggestions while typing;
- explicit manual/map-tap fallback inside the same flow;
- assigning `No day` or a selected day before saving;
- keeping gray no-day and red day-route behavior;
- keeping existing online map prototype as prototype-only.

Blocked:

- production autocomplete provider;
- public Nominatim autocomplete;
- real provider keys;
- native/offline map SDK;
- offline search/geocoding/routing/navigation;
- whole-country Georgia offline proof;
- route optimization, traffic, ETA, live rerouting.

## Roles

| Role | Task | Output |
| --- | --- | --- |
| `lead` | Coordinate work, create tasks, enforce scope, review results, summarize owner-facing status. | Lead decision reports and go/no-go. |
| `ux_analyst` | Define the corrected one-flow add-place UX for map prototype. | `MAP-05-SLICE-2-UX-20260705.md` |
| `mobile_expo_engineer` | Implement the bounded prototype/UI correction after UX is ready. | Code changes plus `MAP-05-SLICE-2-IMPLEMENTATION-20260705.md` |
| `code_quality_reviewer` | Review implementation scope, maintainability, TypeScript safety, and provider-boundary compliance. | `REVIEW-MAP-05-SLICE-2-BY-CODE-QUALITY-20260705.md` |
| `qa_engineer` | Verify behavior against owner feedback and accepted requirements. | `REVIEW-MAP-05-SLICE-2-BY-QA-20260705.md` |

## Launch Order

1. Run `MAP-05-SLICE-2-UX` first.
2. Lead reviews the UX output.
3. If accepted, run `MAP-05-SLICE-2-IMPLEMENTATION`.
4. Run `code_quality_reviewer` and `qa_engineer` in parallel after implementation.
5. If either reviewer marks rework, create a focused rework task before accepting Slice 2.

## Implementation Constraints

The implementation task must:

- keep changes focused in `app/mobile/App.tsx` plus small helper modules only if needed;
- preserve existing accepted domain code under `app/mobile/src/domain/map/`;
- avoid production provider dependencies;
- avoid public Nominatim autocomplete;
- use local/mock Georgia place suggestions for typing UX;
- keep explicit search button optional or remove it if suggestions satisfy the prototype flow;
- make map tap/manual input part of the same add-place flow, not a separate competing search surface;
- run:
  - `npm run typecheck`;
  - `npm run test`;
  - `npm run test:map`;
  - `npm run web` only if visual smoke is needed and feasible.

## Lead Acceptance Criteria

Slice 2 is acceptable only if:

- there is one obvious add-place/search flow on the map screen;
- typing shows local/mock suggestions for Georgia places;
- suggestions are country-scoped to Georgia fixtures;
- user can save a suggested place as `No day` or selected day;
- user can still add from map tap/manual input from the same flow;
- no production provider/autocomplete claim is made;
- typecheck and existing map tests pass;
- QA and code quality accept the result.
