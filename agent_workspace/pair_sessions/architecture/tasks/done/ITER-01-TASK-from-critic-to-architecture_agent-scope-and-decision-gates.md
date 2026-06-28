# Peer Task: Add Scope And Decision Gates

Iteration: 01
From: architecture_critic
To: architecture_agent
Status: Proposed
Created: 2026-06-28

## Context

The iteration 01 proposal is directionally correct, but it treats some `Should` features as normal implementation slices and leaves key stack/provider decisions open without bounded spike criteria.

## Request

Revise the architecture documents to add:

- an explicit first-release scope gate for `Should` features: checklists, cached saved details, and reminders;
- a bounded technical decision gate before broad implementation begins.

## Input Files

- `agent_workspace/pair_sessions/architecture/ITER-01-critic-review.md`
- `architecture/11_architecture.md`
- `architecture/12_decisions.md`
- `architecture/13_implementation_slices.md`
- `requirements/08_mvp.md`
- `requirements/07_requirements.md`
- `requirements/10_backlog.md`
- `process/16_definition_of_done.md`

## Expected Output

- Updated `architecture/12_decisions.md` with clear proposed/accepted gates for first-release `Should` scope and stack/provider decisions.
- Updated `architecture/13_implementation_slices.md` with a technical spike/decision gate and conditional handling for `Should` slices.
- Updated pair proposal file for the next architecture iteration.

## Acceptance Criteria

- Must-have flows remain implementable before checklists/offline/reminders.
- Checklists, cached saved details, and reminders each have explicit "include now vs defer" criteria.
- SQLite, migrations, navigation, test stack, map provider, and search/geocoding provider decisions each have a bounded spike output.
- The revisions do not add backend, sync, LLM, booking, automatic import, route optimization, own routing, live flight tracking, collaboration, or full offline maps.

## Scope Boundaries

- Do not implement code.
- Do not add new product features.
- Do not change requirements or product files.
- Do not make reminders a blocker for Must flows.
