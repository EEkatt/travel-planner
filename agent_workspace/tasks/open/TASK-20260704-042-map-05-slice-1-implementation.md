# Task: MAP-05 Slice 1 Implementation

Task ID: TASK-20260704-042
Status: Done
Priority: High
Created: 2026-07-04
Created By: lead
Assigned To: mobile_expo_engineer

## Objective

Implement the first map feature code slice: pure TypeScript domain models, MAP-02A fixtures, coordinate classification, selectors, mock adapter contracts, and deterministic unit tests.

## Editable Files

- `app/mobile/src/domain/map/`
- `app/mobile/src/services/`
- `app/mobile/src/**/__tests__/`
- `app/mobile/package.json`
- `app/mobile/package-lock.json`
- `agent_workspace/reports/MAP-05-SLICE-1-IMPLEMENTATION-20260704.md`

## Read-Only Context

- `agent_workspace/reports/MAP-LEAD-DECISION-GO-MAP-05-SLICE-1-20260704.md`
- `agent_workspace/reports/MAP-05P-DOMAIN-MOCK-IMPLEMENTATION-PLAN-REWORK-20260704.md`
- `agent_workspace/reports/REVIEW-MAP-05P-BY-QA-20260704.md`
- `agent_workspace/reports/REVIEW-MAP-05-PLAN-BY-CODE-QUALITY-20260704.md`
- `agent_workspace/reports/MAP-04R-ARCHITECTURE-REWORK-20260704.md`
- `agent_workspace/reports/MAP-02A-REQUIREMENTS-ADDENDUM-20260704.md`
- `app/mobile/package.json`

## Do Not Edit

- `app/mobile/App.tsx`
- `app/mobile/app.json`
- provider/native/offline setup files
- `requirements/`
- `product/`
- `architecture/`
- `testing/`

## Required Output

- Implemented Slice 1 code.
- Deterministic tests for parser/classifier/selectors/mock boundaries/copy terms.
- Updated package scripts/devDependencies only if needed for test runner.
- Implementation report with changed files, commands run, results, and limitations.

## Required Tests

- Coordinate parser validation and swapped-looking preservation.
- `classifyCoordinate` for all MAP-02A coordinate fixtures, with and without `TBILISI_PROOF_AREA`.
- Selector snapshots:
  - `map_empty_trip`;
  - `map_all_mixed_points`;
  - `map_no_day_mixed`;
  - `map_no_day_empty`;
  - `map_day_empty`;
  - `map_day_three_coordinate_points`;
  - `map_day_order_with_missing_coordinate`;
  - `map_reorder_day_cards` as reordered input.
- Missing-coordinate route behavior.
- Fewer-than-two-point route-line snapshot.
- Target-missing day card view.
- Mock adapter DTO boundaries.
- Russian copy-positive/prohibited term foundations.

## Verification Commands

Run from `app/mobile`:

- `npm run typecheck`
- `npm run test`
- `npm run test:map`

## Quality Bar

- Keep `App.tsx` untouched.
- Keep the patch pure domain/mock/test.
- No real provider keys.
- No production provider dependencies.
- No native/offline map SDK.
- No public Nominatim/OSM production behavior.
- No release-facing offline claims.

## Stopping Condition

Stop when Slice 1 is implemented, verified, and ready for code_quality_reviewer and qa_engineer review.

## Execution Result

Done. Report: `agent_workspace/reports/MAP-05-SLICE-1-IMPLEMENTATION-20260704.md`.

Verification:

- `npm run typecheck` passed.
- `npm run test` passed.
- `npm run test:map` passed.

Status: ready for code quality and QA review.
