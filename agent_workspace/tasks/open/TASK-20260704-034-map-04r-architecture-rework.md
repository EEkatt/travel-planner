# Task: MAP-04R Architecture Rework

Task ID: TASK-20260704-034
Status: Done
Priority: High
Created: 2026-07-04
Created By: lead
Assigned To: architecture_agent

## Objective

Revise the MAP-04 architecture framing to resolve reviewer blockers before implementation planning.

## Editable Files

- `agent_workspace/reports/MAP-04R-ARCHITECTURE-REWORK-20260704.md`

## Read-Only Context

- `agent_workspace/reports/MAP-04-ARCHITECTURE-FRAMING-20260704.md`
- `agent_workspace/reports/REVIEW-MAP-04-ARCHITECTURE-BY-CRITIC-20260704.md`
- `agent_workspace/reports/REVIEW-MAP-04-ARCHITECTURE-BY-CODE-QUALITY-20260704.md`
- `agent_workspace/reports/MAP-LEAD-DECISION-AFTER-REVIEWS-20260704.md`
- `agent_workspace/reports/MAP-02A-REQUIREMENTS-ADDENDUM-20260704.md`
- `agent_workspace/reports/MAP-03-PROVIDER-DISCOVERY-20260704.md`
- `architecture/11_architecture.md`
- `architecture/12_decisions.md`
- `architecture/13_implementation_slices.md`
- `app/mobile/App.tsx`
- `app/mobile/package.json`

## Do Not Edit

- `app/`
- `architecture/`
- `requirements/`
- `product/`
- `testing/`

## Required Output

- Reworked architecture report.
- Single coordinate classification contract with reason codes and MAP-02A fixture outputs.
- Clear `MapPoint` / `Place` / `DayItem` ownership decision.
- Route-order transaction rules.
- Split offline lifecycle, proof state, inventory, and coverage classification contracts.
- Generic external map handoff boundary with Yandex as provider policy/fallback adapter.
- Route-line observable/test model.
- Validation contracts for coordinates, country narrowing, route order, provider metadata, and raw provider payload rejection.
- Updated implementation-planning readiness statement.

## Quality Bar

- Do not expand MVP.
- Keep provider-specific payloads behind adapters.
- Preserve card order as source of truth.
- Preserve Georgia-only MVP and provider-proof-gated offline map.
- Use MAP-02A as accepted input, not a blocker.
- Do not start code implementation.

## Stopping Condition

Stop when the report is ready for architecture_critic, code_quality_reviewer, and lead review.

## Execution Result

Done. Report: `agent_workspace/reports/MAP-04R-ARCHITECTURE-REWORK-20260704.md`.

Status: ready for architecture critic and code quality re-review.
