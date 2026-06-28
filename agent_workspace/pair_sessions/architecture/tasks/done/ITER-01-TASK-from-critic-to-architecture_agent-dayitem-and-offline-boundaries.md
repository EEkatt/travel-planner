# Peer Task: Tighten DayItem And Offline Boundaries

Iteration: 01
From: architecture_critic
To: architecture_agent
Status: Proposed
Created: 2026-06-28

## Context

The proposed `DayItem` model references heterogeneous targets through `kind` and optional `targetId`, but target integrity, delete behavior, and display fallback are not specified. Offline saved-detail behavior is also conceptually correct but lacks concrete degradation rules for map/search/navigation.

## Request

Revise the architecture to define:

- `DayItem.kind` values and target semantics;
- object deletion/unlink behavior for day items;
- denormalized display fallback rules for day plans;
- offline saved-detail boundaries and map/search/navigation degradation behavior;
- tests for these boundaries.

## Input Files

- `agent_workspace/pair_sessions/architecture/ITER-01-critic-review.md`
- `architecture/11_architecture.md`
- `architecture/13_implementation_slices.md`
- `requirements/06_use_cases.md`
- `requirements/07_requirements.md`
- `requirements/08_mvp.md`
- `product/04_user_journey.md`

## Expected Output

- Updated `architecture/11_architecture.md` domain/data-flow sections.
- Updated `architecture/13_implementation_slices.md` tests and acceptance criteria for day planning, persistence, maps, and offline behavior.
- Updated pair proposal file for the next architecture iteration.

## Acceptance Criteria

- Manual events can exist without a target object.
- Object-backed day items have explicit behavior when the referenced place/flight/housing/note/checklist item is deleted.
- Repository tests cover linking, unlinking, ordering, and stale/fallback display behavior.
- Offline mode is described as local readability of saved details, not offline maps/search/routing.
- Map/search/navigation unavailable states are testable.

## Scope Boundaries

- Do not implement code.
- Do not add full offline maps, offline routing, background sync, or provider-specific assumptions.
- Do not change product, requirements, or app files.
