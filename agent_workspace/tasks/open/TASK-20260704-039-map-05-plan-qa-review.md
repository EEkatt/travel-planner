# Task: MAP-05 Plan QA Review

Task ID: TASK-20260704-039
Status: Done
Priority: High
Created: 2026-07-04
Created By: lead
Assigned To: qa_engineer

## Objective

Review the MAP-05 domain/mock implementation plan for QA readiness before any code changes start.

## Editable Files

- `agent_workspace/reports/REVIEW-MAP-05-PLAN-BY-QA-20260704.md`

## Read-Only Context

- `agent_workspace/reports/MAP-05-DOMAIN-MOCK-IMPLEMENTATION-PLAN-20260704.md`
- `agent_workspace/reports/MAP-02A-REQUIREMENTS-ADDENDUM-20260704.md`
- `agent_workspace/reports/REVIEW-MAP-02A-BY-QUALITY-20260704.md`
- `agent_workspace/reports/MAP-04R-ARCHITECTURE-REWORK-20260704.md`
- `app/mobile/`

## Do Not Edit

- `app/`
- `architecture/`
- `requirements/`
- `product/`
- `testing/`

## Required Output

- Accept/rework/reject recommendation.
- Fixture/test coverage assessment.
- QA risks before implementation.
- Required test cases for first patch.
- Go/no-go for implementation.

## Quality Bar

- Verify MAP-02A fixtures are included.
- Verify all/no-day/day route selectors, missing-coordinate behavior, route-order commands, outside-area classification, and copy-negative foundations are covered.
- Do not expand MVP.

## Stopping Condition

Stop when lead can decide whether first implementation patch can start.

## Execution Result

Done. Report: `agent_workspace/reports/REVIEW-MAP-05-PLAN-BY-QA-20260704.md`.

Recommendation: rework/no-go as written. Required fixes: swapped-coordinate parser expectation, `map_no_day_empty`, `map_day_three_coordinate_points`, and copy-negative foundations.
