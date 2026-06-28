# ITER-02 Architecture Proposal

Iteration: 02
Agent: architecture_agent
Date: 2026-06-28

## Summary

This revision keeps the iteration 01 local-first React Native/Expo + TypeScript direction and tightens the implementation boundaries requested by Architecture Critic and approved by Lead.

The MVP remains manual, local-first, and provider-bounded. Backend, sync, collaboration, LLM, booking, automatic import, live flight tracking, route optimization, own routing, and full offline maps remain outside MVP.

## Architecture Proposal

The app remains a trip workspace with `Today / Days / Map`, local repositories as the source of truth, deterministic domain rules, and thin provider adapters for map display, place search/geocoding, external navigation, and optional local notifications.

Iteration 02 adds two gates before optional scope can expand:

- A technical decision gate for SQLite/migrations, navigation, test stack, map provider, and search/geocoding provider.
- A first-release scope gate for `Should` features: checklists, cached saved details, and reminders.

## How It Works

Must flows are implemented first: create trip, open workspace, add places through search or manual fallback, plan days, view maps for coordinate-backed items, hand off to external maps, manually store flights/housing/notes, and reopen saved data.

`Should` features enter only after the Must workflow is usable and the scope gate accepts them. Cached saved details, if included, mean local readability of already saved text/details, not offline maps, offline search, offline routing, sync, or backup.

## Modules

The existing module boundaries remain:

- `app`: boot, dependency injection, navigation, top-level providers.
- `features`: trip workspace, today, days, places, maps, flights, housing, notes, optional checklists, optional reminders.
- `domain`: typed models and pure rules.
- `data`: repository contracts, SQLite adapters, migrations.
- `services`: map/search/navigation/notifications/network/clock adapters.
- `shared`: UI, forms, errors, i18n, testing helpers.

`DayItem` is now explicitly bounded:

- `manual` items have no `targetId`.
- `place`, `flight`, `housing`, `note`, and optional `checklistItem` items reference a target object.
- Object-backed items store denormalized display fields so day plans stay readable if the target is deleted or unavailable.
- Target deletion/unlinking leaves a readable unlinked snapshot instead of silently removing the day plan item.

## Data Flow

Write/read flows remain repository-driven. Provider-specific data stays behind adapters. Offline reads come from local repositories; online-only actions expose unavailable/retry/manual fallback states.

## Implementation Slices

`architecture/13_implementation_slices.md` now includes:

- `Gate 00 - Technical Decisions And Test Harness`;
- first-release scope gate for checklists, cached saved details, and reminders;
- added DayItem linking/unlinking/stale-display tests in domain, persistence, day planning, places, flights, housing, notes, and checklists;
- offline degradation tests for saved reads, map fallback, search/manual fallback, and external navigation unavailable states.

## Testing Strategy

The test strategy now explicitly covers:

- decision-gate proofs for storage, migrations, navigation, test stack, map adapter, and search adapter;
- domain tests for valid `DayItem.kind`/`targetId` combinations;
- repository tests for linking, unlinking, ordering, target deletion, stale display fallback, and restart reads;
- component/adapter tests for unavailable map/search/navigation states;
- privacy/logging checks before final hardening.

## Decisions Needed

Still proposed:

- exact SQLite package and migration helper;
- navigation stack;
- unit/component/repository/E2E test stack;
- MVP map display provider;
- MVP search/geocoding provider;
- whether checklists are first release or deferred;
- whether cached saved-detail verification is first release or deferred;
- whether reminders are first release or deferred.

## Risks

- Optional reminders can still distract from Must flows, so they remain behind the scope gate.
- Offline wording can overpromise, so UI copy must say saved details are readable, not that maps/navigation work offline.
- Polymorphic day item references require disciplined repository tests because SQLite cannot enforce cross-table targets directly.
- Provider choices can create Expo or cost risk, so the technical gate must finish before broad feature implementation.

## Critic Feedback Addressed

- Added first-release scope gates for `Should` features.
- Added bounded technical decision gate/spike criteria.
- Defined `DayItem.kind`, target semantics, fallback display, deletion/unlink behavior, and tests.
- Clarified offline saved-detail behavior and degradation rules for map/search/navigation.
- Updated implementation slices and review log.
