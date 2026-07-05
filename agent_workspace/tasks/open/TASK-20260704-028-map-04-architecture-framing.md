# Task: MAP-04 Architecture Framing

Task ID: TASK-20260704-028
Status: Done
Priority: High
Created: 2026-07-04
Created By: lead
Assigned To: architecture_agent

## Objective

Frame the map feature architecture for Georgia MVP: module boundaries, data model, provider adapters, offline pack service boundary, search adapter, route-order model, and test seams.

## Editable Files

- `agent_workspace/reports/MAP-04-ARCHITECTURE-FRAMING-20260704.md`

## Read-Only Context

- `agent_workspace/reports/MAP-02-REQUIREMENTS-20260704.md`
- `agent_workspace/reports/REVIEW-MAP-02-REQUIREMENTS-BY-QUALITY-20260704.md`
- `agent_workspace/reports/MAP-LEAD-DECISION-AFTER-MAP-02-QUALITY-20260704.md`
- `agent_workspace/reports/MAP-00-SCOPE-20260704.md`
- `agent_workspace/reports/MAP-01-UX-20260704.md`
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

- Architecture framing report.
- Proposed modules and boundaries.
- Canonical map point/domain model.
- Provider adapter interfaces.
- Offline pack service boundary.
- Search/geocoding adapter boundary.
- Route-order and route-line data flow.
- Failure-state ownership.
- Test seams and implementation slices.
- Open architecture decisions and blockers.

## Quality Bar

- Do not expand MVP beyond Georgia.
- Keep provider-specific data behind adapters.
- Keep card order as route-order source of truth.
- Keep current web prototype as non-proof of native/offline behavior.
- Do not sign off production architecture before MAP-02A and reviews.

## Stopping Condition

Stop when architecture_critic and code_quality_reviewer can review the framing.

## Execution Result

Done. Report: `agent_workspace/reports/MAP-04-ARCHITECTURE-FRAMING-20260704.md`.

Status: ready for architecture critic and code quality review.
