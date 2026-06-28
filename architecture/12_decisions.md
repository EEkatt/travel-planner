# Decisions

## Status

Draft

## Decision Format

```text
## YYYY-MM-DD - Title

Status: Proposed | Accepted | Rejected | Superseded

Context:

Decision:

Consequences:

Links:
```

## Decisions

Стабильные решения должны переноситься в `docs/07_decisions.md`.

## 2026-06-28 - MVP Mobile Stack Direction

Status: Accepted

Context:

The MVP is mobile-first and intended for real trip use. Candidate stacks are Swift/iOS, React Native/Expo, Flutter, and PWA/mobile-first web.

Decision:

Use React Native/Expo with TypeScript as the MVP mobile stack. Validate first on iPhone-oriented layouts, but keep Android support reachable from the same codebase. Do not choose Swift/iOS as the default because Android support should not require a full product rewrite. Do not choose PWA as the primary first product when reliable mobile app behavior, local storage, map handoff, and local notifications are important.

Consequences:

React Native/Expo increases the number of dependency choices compared with pure Swift, but avoids locking the first implementation to iOS. The first implementation can still be tested against iPhone 14 Pro Max dimensions while preserving a practical Android path.

Links:

- `architecture/11_architecture.md`
- `requirements/08_mvp.md`

## 2026-06-28 - MVP Map Provider Direction

Status: Proposed

Context:

The MVP needs place search/geocoding, map display for saved points, and external navigation handoff. It does not need own routing, route optimization, live traffic, or offline maps.

Decision:

Use a cross-platform map approach compatible with React Native/Expo. Keep map display, place search, and external navigation handoff behind provider interfaces. Do not make Apple MapKit the default because the MVP stack is no longer iOS-only. Select the concrete provider after an implementation spike.

Consequences:

This keeps the product model independent from a map provider and avoids committing to paid map/search infrastructure before testing. The tradeoff is that the first implementation needs a map provider spike before full map work begins.

Links:

- `architecture/11_architecture.md`
- `docs/09_open_questions.md#oq-008---карты`

## 2026-06-28 - Local-First MVP Storage

Status: Proposed

Context:

The MVP validates personal manual trip aggregation. Collaboration, multi-device sync, accounts, and automatic imports are outside MVP.

Decision:

Make the MVP local-first: the on-device database is the first source of truth. Do not put a backend on the critical path for creating, editing, or reading trip data.

Consequences:

This improves travel reliability and reduces infrastructure scope. Backup, multi-device sync, sharing, and conflict resolution become later decisions instead of hidden MVP complexity.

Links:

- `architecture/11_architecture.md`
- `requirements/07_requirements.md`

## 2026-06-28 - Cached Saved Details Boundary

Status: Proposed

Context:

Users need access to critical saved details during weak network conditions, but full offline maps and routing are explicitly outside MVP.

Decision:

Treat cached saved details as local readability of saved trip data: trip, days, places, flights, housing, notes, and checklists should remain readable offline after saving. Do not promise offline map tiles, offline geocoding, or offline route building in MVP.

Consequences:

This covers the highest-value travel failure mode without introducing a map tile cache, route engine, or complex sync layer.

Links:

- `architecture/11_architecture.md`
- `requirements/08_mvp.md`

## 2026-06-28 - Reminder Implementation Boundary

Status: Proposed

Context:

Basic reminders are valuable but marked `Should`, while core trip creation, map context, day planning, flights, housing, and notes are `Must`.

Decision:

Do not make reminders a first implementation blocker. Store reminder records locally and add local system notifications only after Must flows are stable and notification permission handling is straightforward in the chosen stack.

Consequences:

The app can preserve reminder intent as user data without adding server push, queues, worker infrastructure, or live flight alert complexity.

Links:

- `architecture/11_architecture.md`
- `requirements/10_backlog.md`

## 2026-06-28 - Future LLM Boundary

Status: Proposed

Context:

LLM recommendations, generated routes, and generated checklists are Later. The MVP must validate manual trip aggregation first.

Decision:

Keep LLM out of the MVP critical path. Future LLM integration should be added as a separate assistant module or server-side service that can suggest drafts using explicit user-selected trip context, with user confirmation before saving changes.

Consequences:

Core trip data remains deterministic and usable without AI. A later server boundary can protect provider keys, manage billing, redact sensitive context, and support provider switching.

Links:

- `architecture/11_architecture.md`
- `process/14_project_principles.md`
