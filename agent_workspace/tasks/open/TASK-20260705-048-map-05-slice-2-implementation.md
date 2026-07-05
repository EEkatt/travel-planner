# Task: MAP-05 Slice 2 Implementation

Task ID: TASK-20260705-048
Status: Done
Priority: High
Created: 2026-07-05
Created By: lead
Assigned To: mobile_expo_engineer

## Objective

Implement the corrected one-flow map add-place prototype UX.

## Editable Files

- `app/mobile/App.tsx`
- `agent_workspace/reports/MAP-05-SLICE-2-IMPLEMENTATION-20260705.md`

## Read-Only Context

- `agent_workspace/reports/MAP-LEAD-INSTRUCTIONS-MAP-05-SLICE-2-20260705.md`
- `agent_workspace/reports/MAP-05-SLICE-2-UX-20260705.md`
- `agent_workspace/reports/MAP-LEAD-ACCEPTANCE-MAP-05-SLICE-1-20260705.md`
- `requirements/11_map_requirements.md`
- `app/mobile/src/domain/map/fixtures.ts`
- `app/mobile/package.json`

## Do Not Edit

- `app/mobile/src/domain/map/`
- `app/mobile/src/services/`
- provider/native/offline setup files
- `requirements/`
- `product/`
- `architecture/`
- `testing/`

## Required Output

- One unified `Add place` panel/flow in the map screen.
- Remove or merge the old separate search panel and map-click add panel.
- Typing shows local/mock Georgia suggestions without pressing `Find`.
- Suggestions are deterministic Georgia fixtures only.
- No Nominatim/public provider autocomplete.
- Day assignment is inside the same flow.
- Map tap/manual text fallback is inside the same flow.
- Save suggestion/no-day/day behavior works in prototype state.
- Implementation report with changed files, commands run, results, and limitations.

## Verification Commands

Run from `app/mobile`:

- `npm run typecheck`
- `npm run test`
- `npm run test:map`

## Quality Bar

- Keep the prototype honest: local/mock suggestions only.
- No provider key, native SDK, offline SDK, or production autocomplete.
- UI should not have two separate add/search places.
- Keep mobile layout compact and non-overlapping.

## Stopping Condition

Stop when implementation is ready for code_quality_reviewer and qa_engineer review.

## Execution Result

Done. Report: `agent_workspace/reports/MAP-05-SLICE-2-IMPLEMENTATION-20260705.md`.

Verification:

- `npm run typecheck` passed.
- `npm run test` passed.
- `npm run test:map` passed.

Status: ready for code quality and QA review.
