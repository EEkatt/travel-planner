# ITER-02 Architecture Critic Review

Iteration: 02
Agent: architecture_critic
Date: 2026-06-28
Verdict: Accepted

## Summary

Iteration 02 resolves the iteration 01 blockers sufficiently for implementation planning. The architecture now has a bounded technical decision gate, a first-release gate for `Should` features, explicit `DayItem` target semantics, and a realistic offline saved-detail boundary.

The proposal still leaves normal implementation decisions open, especially concrete provider choices and exact first-release inclusion of checklists/offline verification/reminders. Those are now correctly isolated as gates rather than hidden assumptions in feature slices.

## Blocking Issues

None.

Iteration 01 blocker status:

1. `Should` scope gating: resolved. `architecture/12_decisions.md` and `architecture/13_implementation_slices.md` now gate checklists, cached saved details, and reminders after Must flows are usable.
2. Provider/storage decision bounds: resolved. `Gate 00 - Technical Decisions And Test Harness` defines concrete outputs for SQLite/migrations, navigation, test stack, map provider, and search/geocoding provider before broad feature work.
3. `DayItem` polymorphic references: resolved. `architecture/11_architecture.md` now defines allowed `kind` values, `targetId` rules, denormalized display fields, deletion/unlink behavior, stale snapshots, and repository tests.
4. Offline saved-detail boundary: resolved. The docs now define offline behavior as local readability of saved records with degraded map/search/navigation states, not offline maps/search/routing.

## Non-Blocking Issues

1. `architecture/11_architecture.md` and `architecture/13_implementation_slices.md` still show status text as iteration 01/draft even though they contain iteration 02 changes.
   - Impact: This can confuse future reviewers about which version is current.
   - Suggested fix: In the next Architecture Agent housekeeping pass, update status labels to reflect iteration 02 or remove iteration-specific status wording.

2. `DayItem` deletion behavior allows either clearing `targetId` or marking missing "according to repository implementation."
   - Impact: Implementation teams could choose inconsistent behavior across repositories if not settled during Slice 02.
   - Suggested fix: Treat this as a Slice 02 repository acceptance detail: choose one persisted representation for stale links and test it consistently.

3. Local ID strategy remains described as stable/sync-ready but not yet concrete.
   - Impact: Minor migration churn is possible if ID generation is chosen late.
   - Suggested fix: Decide UUID/ULID-style local IDs during Gate 00 or Slice 01 without adding sync protocol scope.

## Scope Creep Risks

1. Checklists remain both referenced by a Must quick-access requirement and gated as `Should`. The current fallback rule is acceptable, but implementation must avoid dead quick-access navigation if checklists are deferred.
2. Saved-detail offline verification should stay limited to already saved local records and UI unavailable states. Do not introduce tile caching, backup/export, background workers, or provider-specific offline SDKs.
3. Map "visual order" lines, if ever used, must not imply routing, ETA, travel time, or optimization.
4. Gate 00 should produce one MVP provider path plus fallbacks, not a multi-provider runtime framework.

## Missing Tests

No blocking missing tests remain at architecture-review level.

Non-blocking test refinements for implementation:

1. Add a repository test that asserts the single chosen persisted representation for stale `DayItem` target links.
2. Add a Gate 00 check for local ID generation shape and collision assumptions.
3. Keep the Russian UI string check in early feature slices, not only final hardening.

## Suggested Revisions

No rework task is needed before implementation planning.

Suggested housekeeping for Architecture Agent when convenient:

1. Update document status labels from iteration 01/draft to current iteration status.
2. During Gate 00 or Slice 02, choose the exact stale-link persistence representation and local ID strategy.

## Verdict

Accepted
