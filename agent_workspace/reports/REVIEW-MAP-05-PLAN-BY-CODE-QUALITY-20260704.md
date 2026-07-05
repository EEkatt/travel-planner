# REVIEW: MAP-05 Plan By Code Quality

Task ID: TASK-20260704-038
Reviewer: code_quality_reviewer
Date: 2026-07-04
Reviewed artifact: `agent_workspace/reports/MAP-05-DOMAIN-MOCK-IMPLEMENTATION-PLAN-20260704.md`

## Recommendation

Accept MAP-05 for the first implementation patch, with explicit first-patch constraints.

The plan is aligned with MAP-04R and the lead decision after MAP-04R: it keeps provider/native/offline work blocked, treats `App.tsx` as prototype context, adds the missing-target day-card representation requested by the prior code-quality review, and keeps fewer-than-two route-line cases observable through selector snapshots.

This is not approval for UI rewiring, production provider selection, native map/offline packages, public Nominatim/OSM hardening, or release copy that claims downloaded/offline Georgia readiness.

## Context Read

- `agent_workspace/tasks/open/TASK-20260704-038-map-05-plan-code-quality-review.md`
- `agent_workspace/reports/MAP-05-DOMAIN-MOCK-IMPLEMENTATION-PLAN-20260704.md`
- `agent_workspace/reports/MAP-LEAD-DECISION-AFTER-MAP-04R-20260704.md`
- `agent_workspace/reports/MAP-04R-ARCHITECTURE-REWORK-20260704.md`
- `agent_workspace/reports/REVIEW-MAP-04R-BY-CODE-QUALITY-20260704.md`
- `agent_workspace/reports/MAP-02A-REQUIREMENTS-ADDENDUM-20260704.md`
- `app/mobile/package.json`
- `app/mobile/package-lock.json`
- project-owned files under `app/mobile/`, excluding generated `node_modules` and binary assets

## Patch-Scope Assessment

The proposed Slice 1 is small enough to start if it remains a pure domain/mock/test patch:

- Good scope: `src/domain/map`, `src/domain/models`, mock service contracts/adapters, deterministic fixtures, selector tests, and adapter contract tests.
- Good boundary: no `App.tsx` refactor, no feature screen composition, no repository transactions, no persistence, no native SDK, and no provider-backed network behavior.
- Acceptable tooling change: adding a dev-only TypeScript unit test runner and scripts is bounded because `app/mobile` currently has only `typecheck` and no test script.

The first patch is not small if it combines Slice 1 with any of Slice 2 or Slice 3. In particular, repository commands, prototype wiring, search UI changes, route-order UI behavior, or public Nominatim replacement should wait for later patches.

## App.tsx Decision

`App.tsx` should stay untouched in the first implementation patch.

Current `App.tsx` is still a single-file prototype with inline map state, Leaflet iframe HTML, public OSM tiles, public Nominatim fetch, simulated native map shapes, and filter-local numbering. Editing it in the first patch would mix contract validation with prototype behavior and make review noisy. MAP-05 should instead create new `src/` modules and prove them through tests.

## Maintainability And Testability Risks

- Slice 1 has many proposed files. That is acceptable only because the files are narrow, pure, and grouped by clear ownership. Avoid adding abstraction beyond the listed contracts.
- `MapCardView` must be implemented as a real union that can represent `missing_target` without pretending the missing target is a `Place` or coordinate-backed `MapPointView`.
- Coordinate classification must be explicitly documented as fixture/bounds logic, not a production Georgia border implementation.
- Selectors must use `DayItem.sortOrder` for selected-day cards, pin labels, and planned-line ordering. They must not renumber coordinate-backed pins around no-coordinate or missing-target cards.
- Mock adapters must return normalized DTOs only. No raw payloads, SDK objects, request URLs, API keys, provider inventory internals, or private traces should appear in domain objects, fixtures, logs, or tests.
- Test tooling must not pull in Expo/native test complexity for Slice 1. Keep tests as pure TypeScript unit tests.

## Test Tooling Assessment

Existing tooling:

- `npm run typecheck` exists and passes in `app/mobile`.
- There is no project test script in `app/mobile/package.json`.
- `package-lock.json` contains transitive Jest-related packages from Expo/React Native, but no direct runnable unit-test setup for this project.

Bounded change allowed:

- Add `vitest` as a dev dependency, plus `test`, `test:watch`, and `test:map` scripts.
- Update `package-lock.json` only as required by that dev dependency.
- Do not add React Native Testing Library, Jest presets, Expo test harnesses, Playwright, native SDKs, or provider packages in the first patch.

Required first-patch verification commands:

```sh
npm run typecheck
npm run test
npm run test:map
```

## Required Constraints For First Implementation Patch

The first implementation patch must:

- Leave `app/mobile/App.tsx` unchanged.
- Add only pure TypeScript domain, fixture, selector, mock contract, mock adapter, and unit-test files under `app/mobile/src`.
- Add no production dependencies.
- Add no native/provider/offline SDK dependencies.
- Add no public provider calls, tile URLs, API keys, deep links, or provider-specific URL construction.
- Keep search as a submitted-search mock contract with `autocomplete: false`.
- Keep offline behavior as mock lifecycle/proof/inventory/coverage contracts only.
- Use MAP-02A fixtures exactly for coordinate and selector tests.
- Include tests for invalid coordinates, fixture classification, selector modes, missing-coordinate route gaps, fewer-than-two route-line snapshots, missing-target cards, and raw-provider-payload absence from mock results.
- Preserve the later-slice boundary for repositories, prototype wiring, component tests, persistence, and native/offline proof.

## Go / No-Go

Go for implementation of Slice 1 only, under the constraints above.

No-go for implementing Slice 2, Slice 3, provider-backed search/map/offline behavior, `App.tsx` rewiring, native dependencies, or release-facing offline claims in the first patch.

Lead can let the first implementation patch start if the implementer accepts these constraints and treats the MAP-05 plan as a scoped contract test slice, not as UI integration work.
