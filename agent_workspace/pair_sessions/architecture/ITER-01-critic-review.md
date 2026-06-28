# ITER-01 Architecture Critic Review

Iteration: 01
Agent: architecture_critic
Date: 2026-06-28
Verdict: Needs Rework

## Summary

The proposal is directionally sound: local-first Expo/React Native, manual data entry, provider adapters, external map handoff, and no backend/sync/LLM/booking/live flight tracking/route optimization are the right MVP boundaries.

However, it is not yet implementation-ready. The architecture leaves several first-slice decisions too open, treats `Should` items inconsistently, and under-specifies the hardest local-first boundary: how ordered day items safely reference places, flights, housing, notes, checklists, and manual events. These gaps can cause hidden rework once persistence and UI slices start.

## Blocking Issues

1. `Should` scope is not consistently gated before implementation.
   - Impact: Checklists, saved offline behavior, and reminders are all `Should` in requirements/MVP, but the proposed slice order includes checklists and offline behavior as normal slices and only marks reminders as conditional. This can silently expand the first release and blur what is required before Must flows are validated.
   - Suggested fix: Add an explicit first-release scope gate in `architecture/13_implementation_slices.md` and `architecture/12_decisions.md`: Must-only baseline first; checklists/offline/reminders enter only after owner decision or after Must flows are usable. If checklists remain in first release because quick access references them, state the minimum shell/placeholder behavior when deferred.

2. Provider/storage decisions are identified but not bounded enough to unblock early slices.
   - Impact: SQLite package, migrations, navigation, map display, search/geocoding, and tests are listed as decisions needed, but there is no bounded spike output or acceptance criteria. Implementation can start with incompatible dependencies or defer risk until broad feature work has already depended on them.
   - Suggested fix: Add a narrow "technical spike / decision gate" before Slice 00 or as part of Slice 00 with concrete outputs: chosen Expo-compatible SQLite library and migration approach; navigation stack; unit/component test runner; map/search provider shortlist with API key/cost/native compatibility notes; explicit decision record updates. Keep the spike time-boxed and avoid building product UI during it.

3. `DayItem` polymorphic references are under-specified.
   - Impact: The proposal says `DayItem.kind` plus optional `targetId` can reference place, flight, housing, note, checklist item, or manual event. Without explicit target integrity rules, delete behavior, display fallback, and ordering semantics per kind, repositories and UI can diverge. This is especially risky for local SQLite because cross-table polymorphic foreign keys are not naturally enforced.
   - Suggested fix: Define `DayItem.kind` enum, allowed `targetId` semantics, denormalized display fields, delete behavior for each target type, and tests. For MVP, keep manual events as first-class `DayItem` records with no separate target. For object-backed items, specify whether deletion is guarded, unlinks the item, or leaves a stale readable snapshot.

4. Offline saved-detail boundary is conceptually right but operationally vague.
   - Impact: The proposal says saved details remain readable offline, but the architecture does not define the minimum offline set, network status behavior, or how map tiles are handled when the map provider cannot render without network. This can lead to UI promising "saved/offline" while core screens still show broken map/search states.
   - Suggested fix: Clarify that offline MVP means local database reads for the active/current trip and saved text details; map rendering is best-effort and must degrade to lists when tiles/provider calls are unavailable. Add tests for offline app open, saved trip read, and unavailable online-only actions.

## Non-Blocking Issues

1. The proposal mentions `data interfaces`, but the directory plan only shows repositories under `data/repositories`.
   - Impact: Dependency direction can become muddy if feature code imports concrete SQLite repositories directly.
   - Suggested fix: Make repository contracts explicit, either in `domain/repositories` or `data/repositories/contracts`, and keep concrete SQLite adapters separate.

2. ID strategy is "stable and sync-ready" but not concrete.
   - Impact: Later sync-readiness is a valid future-proofing constraint, but vague ID generation can create migration churn.
   - Suggested fix: Decide on local UUID/ULID-style IDs and document that no sync protocol is built in MVP.

3. Privacy is acknowledged only in hardening.
   - Impact: Booking references, contacts, and notes are sensitive. Waiting until hardening can miss logs introduced in repositories/adapters.
   - Suggested fix: Add a privacy/logging test or review point to persistence and adapter slices, not only final hardening.

4. Russian UI is mentioned in App Shell, but tests mostly focus on mechanics.
   - Impact: NFR-006 requires Russian UI for MVP scenarios.
   - Suggested fix: Add a lightweight UI string check to slice acceptance criteria for user-facing MVP screens.

## Scope Creep Risks

1. Reminders can become a notification subsystem before core planning is proven. Keep them behind an owner decision and do not wire notification permissions in early app boot.
2. "Own route lines unless drawn only as simple visual order" risks user interpretation as routing. If included, wording and tests must ensure it is only a visual sequence, not a route.
3. "Future sync-ready" data modeling can turn into building sync constraints now. Limit it to stable IDs, timestamps, and clear repository boundaries.
4. Map/search provider abstraction can become over-engineered. Keep one concrete provider adapter plus minimal interfaces; do not design a multi-provider runtime system for MVP.

## Missing Tests

1. Repository tests for polymorphic `DayItem` targets: create/link/unlink/delete behavior for place, flight, housing, note, checklist item, and manual event.
2. Offline degradation tests: app opens saved active trip with mocked no network; lists/details render; search/geocoding actions expose manual fallback; map screen falls back cleanly when provider/tile access is unavailable.
3. Decision-spike acceptance tests/checks: SQLite migration runs on clean install and app restart; navigation works in Expo; chosen test stack can run pure domain and React Native component tests.
4. Privacy tests/reviews: booking references, contacts, notes, and flight details are not emitted in logs or adapter error payloads.
5. UI copy tests or checklist: no wording implies offline maps, live flight tracking, route optimization, booking import, or AI-generated plans.
6. Date/time edge cases for `Today`: timezone/local clock boundary, trip start/end dates, unknown dates, and manually selected day persistence.

## Suggested Revisions

1. Revise the implementation slices to add an explicit technical decision gate before broad feature work.
2. Add a clear first-release scope gate for `Should` features: checklists, cached saved details, and reminders.
3. Expand the domain model section for `DayItem` target semantics and deletion behavior.
4. Clarify offline saved-detail behavior as local text/detail readability with graceful map/search/navigation degradation.
5. Move privacy/logging checks earlier into persistence and adapter slices.
6. Keep the MVP architecture accepted in principle after these revisions; no need to reject the whole direction.

## Verdict

Needs Rework
