# Task: MAP-05P Plan Rework

Task ID: TASK-20260704-040
Status: Done
Priority: High
Created: 2026-07-04
Created By: lead
Assigned To: mobile_expo_engineer

## Objective

Revise the MAP-05 implementation plan to address QA no-go blockers before code starts.

## Editable Files

- `agent_workspace/reports/MAP-05P-DOMAIN-MOCK-IMPLEMENTATION-PLAN-REWORK-20260704.md`

## Read-Only Context

- `agent_workspace/reports/MAP-05-DOMAIN-MOCK-IMPLEMENTATION-PLAN-20260704.md`
- `agent_workspace/reports/REVIEW-MAP-05-PLAN-BY-CODE-QUALITY-20260704.md`
- `agent_workspace/reports/REVIEW-MAP-05-PLAN-BY-QA-20260704.md`
- `agent_workspace/reports/MAP-LEAD-DECISION-AFTER-MAP-05-PLAN-REVIEWS-20260704.md`
- `agent_workspace/reports/MAP-02A-REQUIREMENTS-ADDENDUM-20260704.md`
- `agent_workspace/reports/MAP-04R-ARCHITECTURE-REWORK-20260704.md`
- `app/mobile/package.json`

## Do Not Edit

- `app/`
- `architecture/`
- `requirements/`
- `product/`
- `testing/`

## Required Output

- Revised Slice 1 patch scope.
- Explicit correction for swapped-coordinate parser expectation.
- Explicit first-patch tests for:
  - `map_no_day_empty`;
  - `map_day_three_coordinate_points`;
  - copy-negative foundations.
- Updated test command plan.
- Confirmation that `App.tsx`, provider/native/offline dependencies, real keys, and production provider behavior remain out of scope.

## Quality Bar

- Keep the patch small.
- Do not expand MVP.
- Do not start implementation.
- Make QA re-review straightforward.

## Stopping Condition

Stop when QA can re-review the plan for go/no-go.

## Execution Result

Done. Report: `agent_workspace/reports/MAP-05P-DOMAIN-MOCK-IMPLEMENTATION-PLAN-REWORK-20260704.md`.

Status: ready for QA re-review.
