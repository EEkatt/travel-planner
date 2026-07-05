# Task: MAP-05 Domain/Mock Implementation Plan

Task ID: TASK-20260704-037
Status: Done
Priority: High
Created: 2026-07-04
Created By: lead
Assigned To: mobile_expo_engineer

## Objective

Prepare the first implementation slice for the map feature using accepted MAP-02A/MAP-04R contracts, without provider-backed/native/offline claims.

## Editable Files

- `agent_workspace/reports/MAP-05-DOMAIN-MOCK-IMPLEMENTATION-PLAN-20260704.md`

## Read-Only Context

- `agent_workspace/reports/MAP-LEAD-DECISION-AFTER-MAP-04R-20260704.md`
- `agent_workspace/reports/MAP-04R-ARCHITECTURE-REWORK-20260704.md`
- `agent_workspace/reports/REVIEW-MAP-04R-BY-CRITIC-20260704.md`
- `agent_workspace/reports/REVIEW-MAP-04R-BY-CODE-QUALITY-20260704.md`
- `agent_workspace/reports/MAP-02A-REQUIREMENTS-ADDENDUM-20260704.md`
- `agent_workspace/reports/MAP-03-PROVIDER-DISCOVERY-20260704.md`
- `app/mobile/App.tsx`
- `app/mobile/package.json`
- `app/mobile/`

## Do Not Edit

- `app/`
- `architecture/`
- `requirements/`
- `product/`
- `testing/`

## Required Output

- Implementation slice plan.
- Proposed file/module list.
- Domain/mock contracts to implement first.
- Test plan and commands to run.
- Web prototype update plan.
- Risks and blockers.
- Explicit non-goals.

## Quality Bar

- Do not edit code in this task.
- Do not introduce real provider keys.
- Do not add production provider dependencies.
- Do not rely on public Nominatim/OSM tiles as production behavior.
- Keep provider-backed/native/offline work blocked.
- Make the first implementation slice small enough for review.

## Stopping Condition

Stop when code_quality_reviewer, qa_engineer, and lead can review whether MAP-05 implementation should start.

## Execution Result

Done. Report: `agent_workspace/reports/MAP-05-DOMAIN-MOCK-IMPLEMENTATION-PLAN-20260704.md`.

Recommendation: first patch should add pure TypeScript domain models, MAP-02A fixtures, coordinate classification, selectors, mock adapter contracts, and deterministic unit tests under `app/mobile/src/`; keep `App.tsx`, repositories, provider/native/offline work, keys, and production dependencies out of the first patch.
