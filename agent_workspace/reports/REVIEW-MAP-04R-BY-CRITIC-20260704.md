# REVIEW: MAP-04R By Architecture Critic

Task ID: TASK-20260704-035
Reviewer: architecture_critic
Date: 2026-07-04
Reviewed artifact: `agent_workspace/reports/MAP-04R-ARCHITECTURE-REWORK-20260704.md`

## Recommendation

Recommendation: accept MAP-04R for domain/mock implementation planning.

MAP-04R resolves the original MAP-04 architecture critic blockers at the contract level. It corrects the main ownership errors from MAP-04, consumes MAP-02A as an accepted input, and keeps provider-backed native/offline claims behind MAP-03, MAP-06, MAP-09, and owner threshold gates.

This is not a production provider/offline sign-off. It is sufficient for MAP-05 planning of pure domain seams, repositories, selector snapshots, mock adapters, and failure-state contracts.

## Context Read

- `agent_workspace/tasks/open/TASK-20260704-035-map-04r-critic-review.md`
- `agent_workspace/reports/MAP-04R-ARCHITECTURE-REWORK-20260704.md`
- `agent_workspace/reports/MAP-04-ARCHITECTURE-FRAMING-20260704.md`
- `agent_workspace/reports/REVIEW-MAP-04-ARCHITECTURE-BY-CRITIC-20260704.md`
- `agent_workspace/reports/REVIEW-MAP-04-ARCHITECTURE-BY-CODE-QUALITY-20260704.md`
- `agent_workspace/reports/MAP-02A-REQUIREMENTS-ADDENDUM-20260704.md`
- `agent_workspace/reports/MAP-03-PROVIDER-DISCOVERY-20260704.md`

## Blocker Resolution Assessment

| Original blocker | Assessment | Notes |
| --- | --- | --- |
| Single geography classification seam | Resolved | MAP-04R defines pure `domain/map/coordinateClassification.ts` ownership and a single `classifyCoordinate(coordinates, downloadedArea?)` result with `insideGeorgia`, `insideDownloadedArea`, and reason codes. Offline coverage consumes this result instead of owning a competing classifier. MAP-02A fixture outputs are embedded. |
| `MapPoint` conflict with `Place` / `DayItem` | Resolved | `MapPoint` is replaced by derived `MapPointView`. Persisted saved-location writes stay in `PlaceRepository`; selected-day assignment and ordering stay in `DayPlanRepository` through `DayItem.sortOrder`. |
| Route-order edge cases | Resolved | MAP-04R adds transaction rules for create, assign, clear, reorder, delete day card, delete place target, no-coordinate cards, reload, and stale reorders. The critical invariant is now explicit: cards, pin labels, and the planned line derive from the same ordered selected-day `DayItem` set, and compaction includes no-coordinate cards rather than coordinate-backed pins only. |
| Offline lifecycle/proof/coverage split | Resolved | MAP-04R separates `OfflinePackLifecycle`, `OfflinePackProofState`, `OfflinePackInventory`, and `OfflineCoverageState`. `outside_downloaded_area` is correctly modeled as coordinate/camera coverage, not pack lifecycle. Production copy is gated on `available + proof_accepted + expected Georgia area + accepted proof artifacts`. |
| Generic external handoff | Resolved | MAP-04R uses `ExternalMapHandoffService` and `ExternalMapProviderPolicy`, with Yandex isolated as one provider policy/adapter. Deep-link/web fallback behavior and owner/security approval remain outside domain records. |
| MAP-02A treated as missing | Resolved | MAP-04R treats MAP-02A as accepted input and incorporates its fixture IDs, coordinate classifications, selected-day route-line model, copy constraints, and provider/offline proof expectations. |
| Route-line observability and validation gaps from code-quality review | Resolved | MAP-04R promotes `PlannedRouteLineSnapshot` / `MapRenderSnapshot` into the selector contract and adds coordinate validation, country narrowing, route-order validation, provider metadata allowlisting, and raw provider payload rejection rules. |

## Remaining Blocking Issues

None for architecture-contract acceptance or MAP-05 domain/mock planning.

Provider-backed map rendering, real search, real API keys, native offline packs, whole-country Georgia download claims, provider result storage, attribution acceptance, and release UI copy that claims downloaded availability remain blocked exactly as MAP-04R states.

## Remaining Non-Blocking Issues

1. The delete-place-target path still delegates final stale `DayItem` policy to the base repository policy: `isTargetMissing` or cleared. This is acceptable for architecture review because MAP-04R preserves the key invariant that stale targets do not create pins, route-line points, or accidental compaction. MAP-05 should choose one exact repository behavior before writing transaction tests.

2. Production country classification is intentionally not solved. MAP-04R correctly uses MAP-02A fixtures until an approved border/source exists. The future production classifier source should be a tracked decision before release-quality geography validation.

3. Yandex policy values are correctly isolated, but address handoff, web fallback, copy-address, and copy-coordinate fallback still need explicit owner/security approval before UI implementation enables them.

4. `fixture_tbilisi_proof_area` is useful for MAP-07/MAP-08 and MAP-06 proof, but product copy must continue treating it as proof/test scope, not as fulfillment of whole-country Georgia offline viewing.

## Go / No-Go

Go for MAP-05 planning of:

- `Place` / `DayItem`-backed map projections;
- pure coordinate classifier and MAP-02A fixture tests;
- route-order repository command contracts;
- selector snapshots for cards, pins, and planned-order lines;
- mock map/search/offline/handoff adapters;
- failure-state UI contracts that preserve saved cards/lists/details.

No-go for:

- provider-backed native/offline implementation as release-ready architecture;
- real provider key integration;
- production provider selection;
- provider result storage beyond approved normalized metadata;
- whole-country Georgia offline claims;
- offline search, geocoding, routing, navigation, optimization, traffic, ETA, or live rerouting.

## Decision Readiness

Lead can decide that MAP-04R is architecturally acceptable for the next domain/mock implementation planning step. The remaining risks are downstream proof, owner, security, and provider acceptance gates, not unresolved MAP-04R architecture blockers.
