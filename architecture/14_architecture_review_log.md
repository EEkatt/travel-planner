# Architecture Review Log

## Status

Architecture pair review accepted in iteration 02.

## Review Protocol

- Architecture Agent writes proposal files.
- Architecture Critic reviews proposal files and records findings here and in `agent_workspace/pair_sessions/architecture/ITER-01-critic-review.md`.
- Lead Agent decides whether another iteration is needed.

## Iteration 01 - Architecture Agent Proposal

Date: 2026-06-28

Files updated:

- `architecture/11_architecture.md`
- `architecture/12_decisions.md`
- `architecture/13_implementation_slices.md`
- `architecture/14_architecture_review_log.md`
- `agent_workspace/pair_sessions/architecture/ITER-01-architecture-proposal.md`

Summary:

The proposal defines a local-first React Native/Expo + TypeScript architecture for the MVP. It centers on a `Trip` workspace with `Today / Days / Map`, manual data entry, local persistence, provider boundaries for map/search/navigation/notifications, and testable implementation slices.

Scope check:

- Backend: outside MVP.
- Sync: outside MVP.
- Collaboration: outside MVP.
- LLM: outside MVP.
- Booking: outside MVP.
- Automatic import: outside MVP.
- Live flight tracking: outside MVP.
- Route optimization: outside MVP.
- Own routing: outside MVP.
- Full offline maps: outside MVP.

Open items for critic review:

- Are module boundaries clear enough for implementation?
- Are data entities sufficient without over-modeling MVP?
- Are implementation slices independently testable?
- Are provider decisions correctly marked `Proposed`?
- Does any wording accidentally expand MVP scope?

Critic verdict:

Needs Rework.

Findings:

Summary:

The iteration 01 proposal is directionally sound: local-first Expo/React Native, manual trip aggregation, provider adapters, external map handoff, and explicit exclusion of backend/sync/LLM/booking/live flight tracking/route optimization are aligned with MVP.

Blocking issues:

1. `Should` scope is not consistently gated before implementation. Checklists, cached saved details, and reminders need explicit include/defer criteria so the first release does not silently expand beyond Must flows.
2. Provider/storage decisions are listed but not bounded enough to unblock implementation. SQLite/migrations, navigation, test stack, map provider, and search/geocoding provider need a time-boxed decision spike with concrete outputs.
3. `DayItem` polymorphic references are under-specified. The architecture must define `kind`, `targetId`, display fallback, deletion/unlink behavior, and tests before persistence work starts.
4. Offline saved-detail behavior is conceptually correct but operationally vague. It must be defined as local readability of saved text/details with graceful degradation for map/search/navigation, not offline maps.

Non-blocking issues:

- Repository contracts should be explicit and separated from concrete SQLite adapters.
- ID strategy should be concrete enough for local stability without building sync.
- Privacy/logging checks should appear earlier than final hardening.
- Russian UI acceptance should be included in MVP screen slices.

Scope creep risks:

- Reminders can become a notification subsystem before core planning is proven.
- Visual order lines on maps can be mistaken for route building.
- Future sync-ready modeling can drift into sync design.
- Provider abstraction can become broader than a single MVP adapter requires.

Missing tests:

- Repository tests for `DayItem` target link/unlink/delete behavior.
- Offline degradation tests for saved trip details, manual fallback, and unavailable online-only actions.
- Decision-spike checks for SQLite migrations, navigation, and test stack viability.
- Privacy/logging checks for booking references, contacts, notes, and flight details.
- UI copy checks preventing offline maps/live tracking/route optimization/booking import/AI promises.
- Date/time edge cases for `Today`, including timezone/local clock boundaries.

Suggested revisions:

- Add explicit scope gates for checklists, cached saved details, and reminders.
- Add a technical decision gate before broad feature implementation.
- Tighten `DayItem` target semantics and delete behavior.
- Clarify offline saved-detail boundaries and degradation behavior.
- Move privacy/logging checks into persistence and adapter slices.

Proposed peer tasks created:

- `agent_workspace/pair_sessions/architecture/tasks/proposed/ITER-01-TASK-from-critic-to-architecture_agent-scope-and-decision-gates.md`
- `agent_workspace/pair_sessions/architecture/tasks/proposed/ITER-01-TASK-from-critic-to-architecture_agent-dayitem-and-offline-boundaries.md`

Architecture Agent response:

Iteration 02 rework completed.

Files updated:

- `architecture/11_architecture.md`
- `architecture/12_decisions.md`
- `architecture/13_implementation_slices.md`
- `architecture/14_architecture_review_log.md`
- `agent_workspace/pair_sessions/architecture/ITER-02-architecture-proposal.md`

Response summary:

- Added an explicit first-release scope gate for `Should` features: checklists, cached saved details, and reminders.
- Added a bounded technical decision gate for SQLite/migrations, navigation, test stack, map provider, and search/geocoding provider.
- Defined `DayItem.kind`, `targetId` semantics, denormalized display fallback, target deletion/unlink behavior, and repository test expectations.
- Clarified offline saved-detail behavior as local readability of saved records, with degraded map/search/navigation states and no offline maps/search/routing promise.
- Updated implementation slices and tests so Must flows remain buildable before optional scope.

Approved peer tasks completed:

- `agent_workspace/pair_sessions/architecture/tasks/done/ITER-01-TASK-from-critic-to-architecture_agent-scope-and-decision-gates.md`
- `agent_workspace/pair_sessions/architecture/tasks/done/ITER-01-TASK-from-critic-to-architecture_agent-dayitem-and-offline-boundaries.md`

## Iteration 02 - Architecture Critic Review

Date: 2026-06-28

Files reviewed:

- `agent_workspace/pair_sessions/architecture/ITER-01-critic-review.md`
- `agent_workspace/pair_sessions/architecture/ITER-02-architecture-proposal.md`
- `architecture/11_architecture.md`
- `architecture/12_decisions.md`
- `architecture/13_implementation_slices.md`
- `requirements/07_requirements.md`
- `requirements/08_mvp.md`
- `requirements/10_backlog.md`
- `process/16_definition_of_done.md`
- `app/mobile/App.tsx`
- `app/mobile/package.json`

Critic verdict:

Accepted.

Summary:

Iteration 02 resolves the iteration 01 blockers sufficiently for implementation planning. The architecture now has a bounded technical decision gate, a first-release gate for `Should` features, explicit `DayItem` target semantics, and a realistic offline saved-detail boundary.

Blocking issues:

None.

Iteration 01 blocker status:

1. `Should` scope gating: resolved. Checklists, cached saved details, and reminders are gated after Must flows are usable.
2. Provider/storage decision bounds: resolved. Gate 00 defines concrete outputs for SQLite/migrations, navigation, test stack, map provider, and search/geocoding provider before broad feature work.
3. `DayItem` polymorphic references: resolved. The architecture now defines allowed `kind` values, `targetId` rules, denormalized display fields, deletion/unlink behavior, stale snapshots, and repository tests.
4. Offline saved-detail boundary: resolved. Offline support is defined as local readability of saved records with degraded map/search/navigation states, not offline maps/search/routing.

Non-blocking issues:

- Some document status labels still say iteration 01/draft even though they contain iteration 02 revisions.
- `DayItem` stale-link persistence still needs one exact repository representation during Slice 02.
- Local ID strategy remains stable/sync-ready but not yet concrete.

Scope creep risks:

- If checklists are deferred, quick access must not expose dead navigation.
- Saved-detail offline verification must not expand into tile caching, backup/export, background workers, or provider-specific offline SDKs.
- Map visual order must not imply routing, ETA, travel time, or optimization.
- Gate 00 should produce one MVP provider path plus fallbacks, not a multi-provider runtime framework.

Missing tests:

No blocking missing tests remain at architecture-review level. Implementation should still add tests for the chosen stale `DayItem` persisted representation, local ID generation assumptions, and Russian UI strings.

Suggested revisions:

No rework task is needed before implementation planning. Housekeeping can update status labels and settle exact stale-link/ID details during Gate 00 or Slice 02.

Proposed peer tasks created:

None.
