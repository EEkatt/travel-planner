# REVIEW: MAP-04R Architecture Rework By Code Quality

Task ID: TASK-20260704-036
Reviewer: code_quality_reviewer
Date: 2026-07-04
Reviewed artifact: `agent_workspace/reports/MAP-04R-ARCHITECTURE-REWORK-20260704.md`

## Recommendation

Accept MAP-04R for MAP-05 domain/mock implementation planning.

MAP-04R resolves the prior MAP-04 code-quality blockers at the architecture-contract level. It gives MAP-05 enough specificity to plan pure TypeScript domain work, repository command contracts, selector snapshots, mock map/search/offline/handoff adapters, and component failure-state tests without treating the current prototype as implementation proof.

This is not approval for provider-backed native/offline implementation or release claims. Those remain blocked behind MAP-03 provider terms/discovery, MAP-06 native/offline proof, MAP-09/security approval, and owner thresholds for whole-country Georgia or an approved Georgia fallback.

## Context Read

- `agent_workspace/tasks/open/TASK-20260704-036-map-04r-code-quality-review.md`
- `agent_workspace/reports/MAP-04R-ARCHITECTURE-REWORK-20260704.md`
- `agent_workspace/reports/MAP-04-ARCHITECTURE-FRAMING-20260704.md`
- `agent_workspace/reports/REVIEW-MAP-04-ARCHITECTURE-BY-CODE-QUALITY-20260704.md`
- `agent_workspace/reports/REVIEW-MAP-04-ARCHITECTURE-BY-CRITIC-20260704.md`
- `agent_workspace/reports/MAP-02A-REQUIREMENTS-ADDENDUM-20260704.md`
- `app/mobile/`

## Blocking Issues

None for MAP-05 domain/mock implementation planning.

The rework is specific enough for the next planning step. Remaining provider/native/offline release blockers are explicitly preserved in MAP-04R rather than hidden as implementation details.

## Maintainability Findings

- The module shape is maintainable and consistent with the desired layered split: pure `domain/map`, repository-owned persistence, feature-level composition/copy, and provider-facing services behind adapters.
- Recasting `MapPoint` as `MapPointView` is the right correction. Persisted saved locations stay in `Place`, day assignment/order stays in `DayItem`, and writes stay in `PlaceRepository` / `DayPlanRepository`.
- The current `app/mobile/App.tsx` remains a 1429-line prototype with inline state, public Nominatim search, Leaflet iframe rendering, and simulated native map shapes. MAP-04R correctly treats this as prototype-only; MAP-05 should create `src/` modules and avoid extending the prototype as the domain boundary.
- The external map handoff boundary is now generic, with Yandex isolated as a provider policy/adapter. That is sufficient to avoid feature code constructing provider URLs directly.

## Type And Data Model Concerns

- Route-order integrity is materially improved: `DayItem.sortOrder` is the only persisted selected-day order, writes are transactional, stale reorders are rejected, and UI forms cannot submit arbitrary `routeOrder`.
- Coordinate and country validation contracts are specific enough for implementation: constructor/parser ownership, finite/range checks, no silent lat/lon swap, classifier-owned Georgia decision, and provider-country hints treated as non-authoritative.
- Provider metadata is appropriately allowlisted through `ApprovedProviderRef` / `ApprovedOfflineProviderRef`, with raw provider payload rejection called out at repository, DTO, and logging boundaries.
- One MAP-05 design detail should be resolved while coding, not as MAP-04R rework: `MapRenderSnapshot.cards: MapPointView[]` cannot naturally represent target-missing `DayItem` snapshots, while the delete-target rule says those snapshots remain readable and preserve order. Prefer a map card view union or separate day-card snapshot so stale/missing target cards remain visible without being treated as coordinate-backed map points.
- Another small implementation detail: when fewer than two coordinate-backed selected-day cards exist, tests still need included/excluded IDs even if the drawable line is `null`. MAP-05 should keep a selector/debug snapshot available even when the render adapter receives no line.

## Testability Notes

- The route-line observable model is now testable: it includes `dayId`, `lineType`, `rendered`, included point IDs, excluded no-coordinate point IDs, ordered coordinates, and stable `testId` fields.
- MAP-02A fixture outputs are embedded for the coordinate classifier with and without `TBILISI_PROOF_AREA`, giving deterministic tests for inside Georgia, outside Georgia, outside downloaded area, and invalid coordinates.
- Repository transaction tests are now plannable for create, assign, clear, reorder, delete day card, delete place target, no-coordinate card order, stale reorder rejection, and reload persistence.
- Offline state is split into lifecycle, proof state, inventory, and coordinate coverage. This prevents UI tests from treating provider inventory as accepted downloaded-map proof.
- Adapter contract tests have clear targets: no SDK objects, raw provider payloads, API keys, provider URLs, inventory internals, or private location traces crossing into domain, repositories, UI logs, or tests.

## Go / No-Go For MAP-05

Go for MAP-05 planning limited to domain/mock implementation:

- `Place` / `DayItem` backed map projections.
- `classifyCoordinate` and MAP-02A fixtures.
- Route-order repository commands and validation.
- Map selector snapshots and mock display adapter.
- Normalized search, offline inventory/coverage, and external handoff contracts.
- Component tests that keep saved cards/lists/details visible through provider/search/offline/handoff failures.

No-go for provider-backed map/offline/search implementation or release claims until the preserved MAP-03, MAP-06, MAP-09, and owner-threshold gates are accepted.

## Lead Decision

Lead can treat MAP-04R as implementation-planning ready for MAP-05 domain/mock slices. The remaining notes should be carried into MAP-05 task acceptance criteria rather than forcing another architecture rework.
