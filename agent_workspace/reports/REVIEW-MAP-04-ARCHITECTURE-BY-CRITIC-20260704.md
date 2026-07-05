# MAP-04 Architecture Critic Review

Task ID: TASK-20260704-032
Role: architecture_critic
Date: 2026-07-04
Status: Complete

## Recommendation

Recommendation: rework before MAP-05/MAP-07 implementation planning.

MAP-04 is directionally correct: it keeps provider payloads behind adapters, treats card order as the route-order authority, blocks native/offline claims behind MAP-03/MAP-06, and explicitly treats the current web prototype as non-proof. However, it is not yet tight enough for downstream implementation and automation. The rework should be bounded to architecture contract clarification, not new MVP scope.

## Blocking Issues

1. The required geography seam is incomplete.

   MAP-02A requires one app-owned `classifyCoordinate(latitude, longitude, downloadedArea?)` seam returning `insideGeorgia`, `insideDownloadedArea`, and a reason code (`MAP-02A` lines 45-49). MAP-04 names `geographyPolicy` and has `OfflinePackService.classifyCoordinates(...)`, but that method returns only downloaded-area state and does not include Georgia classification or a reason code (`MAP-04` lines 196-204). Failure ownership also splits outside-Georgia and outside-downloaded-area between domain and offline service (`MAP-04` lines 329-330), which risks duplicate classification logic.

   Required rework: define a single pure domain contract, e.g. `classifyCoordinate(coordinates, downloadedArea?): CoordinateClassification`, with fixture-backed outputs for MAP-02A coordinates. Provider country hints can be inputs, but they must not be the source of truth.

2. MAP-04 introduces `MapPoint`/`MapPointRepository` without reconciling them with the accepted `Place` and `DayItem` model.

   The baseline architecture has `Place` for saved locations and `DayItem` for ordered day plans (`architecture/11_architecture.md` lines 117-120, 137-159), with repositories named `PlaceRepository` and `DayPlanRepository` (`architecture/11_architecture.md` lines 167-178). MAP-04 proposes a separate canonical `MapPoint` and `MapPointRepository` (`MAP-04` lines 62-65, 91-130). That may be fine as a map-specific projection, but as written it looks like a second persisted entity that can bypass existing place/day-plan ownership.

   Required rework: explicitly decide whether `MapPoint` is a persisted canonical record replacing/extending `Place`, or a derived map projection over `Place` plus day assignment/order. If persisted, update the relationship to `DayItem` and existing repositories. If derived, rename it to a view/projection model and keep writes in the existing place/day-plan repositories.

3. Route-order write semantics are underspecified for assign/clear/delete/reorder edge cases.

   MAP-04 correctly states that card order drives pins and route line (`MAP-04` lines 286-318), and MAP-02A requires numbering gaps for no-coordinate cards (`MAP-02A` lines 99-102). But MAP-04 says reorder "compacts routeOrder deterministically" (`MAP-04` lines 310-318) without defining exactly when compaction is allowed. MAP-02A expects missing-coordinate records to retain route-order gaps in visible pins, while assign/clear flows have specific append/null behavior (`MAP-02A` lines 100-102).

   Required rework: define transaction rules for assign-to-day, clear-day, reorder-list, delete point, delete linked target, and no-coordinate cards. Make clear that route orders compact only across cards in the selected day, not across coordinate-backed pins, and that pin labels always use card `routeOrder`.

4. Offline pack state mixes proof state, inventory state, and UI state.

   `OfflinePackStatus` includes `downloaded` and `outside_downloaded_area` as peer statuses (`MAP-04` lines 180-185). MAP-02A and MAP-03 require `downloaded` to be accepted only after provider/device proof and owner thresholds (`MAP-02A` lines 192-210; `MAP-03` lines 201-215). `outside_downloaded_area` is a coordinate classification relative to a downloaded area, not the lifecycle state of a pack. Keeping these in one enum makes it easy for UI code to show "downloaded" without checking proof/area validity.

   Required rework: separate pack lifecycle (`not_downloaded`, `downloading`, `available`, `failed`, `deleting`), proof/acceptance state (`mock_only`, `proof_accepted`, `blocked`), and coordinate classification (`inside_downloaded_area`, `outside_downloaded_area`, `unknown`). Do not allow production copy to treat mock or unproven packs as downloaded.

5. Provider-specific naming leaks into generic architecture.

   MAP-04 has a generic `ExternalNavigationService`, but failure ownership and blockers name Yandex directly (`MAP-04` lines 333, 373). MAP-02A fixtures include Yandex handoff states, but MAP-04 should keep provider-specific handoff behavior behind an adapter/policy boundary until owner/security approval.

   Required rework: make the architecture generic for external map handoff and define a provider policy/config layer for Yandex-specific labels, targets, fallbacks, and approval gates.

6. MAP-04 acknowledges MAP-02A as incomplete even though MAP-02A is now available.

   MAP-04 says MAP-02A must define fixture records, classification examples, proof artifacts, and Russian copy (`MAP-04` lines 367-368). The reviewed MAP-02A file already supplies these contracts (`MAP-02A` lines 24-49, 60-120, 192-237). Leaving this as a blocker makes the dependency graph stale and can cause downstream agents to wait on work that is already done.

   Required rework: replace the stale MAP-02A blocker with explicit incorporation of MAP-02A fixture IDs, classification outputs, copy terms, and proof artifacts into MAP-04 contracts.

## Non-Blocking Issues

- `MapProviderFailure` lacks retryability, provider/adapter stage, and whether attribution failure is blocking or display-only (`MAP-04` lines 169-174). This can be refined before component implementation.
- `NormalizedPlaceSearchResult.countryCode` is `string | null` while the save model only accepts `'GE' | null` (`MAP-04` lines 239-248, 103-119). Keep provider country values normalized but force save decisions through the app classifier.
- `providerAttribution` on `MapPin` and `MapPoint` is allowed only conditionally (`MAP-04` lines 135-142), but MAP-03 requires attribution behavior for saved search result surfaces to be verified (`MAP-03` lines 138-143, 201-215). The architecture should say how attribution is displayed when saved details are shown offline without a map.
- The module proposal uses `mapTrip`, while existing architecture uses broader `places`, `maps`, and `days` features. Naming is not a blocker, but ownership should be aligned so map work does not duplicate place/day flows.
- `MapTap` allows `coordinates: null` (`MAP-04` lines 165-167) but does not define what causes a null tap or how UI handles it.

## Scope Creep Risks

- `OfflineAreaDescriptor.scope = 'owner_approved_georgia_area'` can become arbitrary region/city-pack product work unless tied to explicit owner fallback decisions from MAP-02A (`MAP-02A` lines 212-223).
- Search adapter language includes geocoding and reverse-geocoding notes (`MAP-04` lines 227-273). Reverse geocoding should stay out of MVP unless separately approved.
- A future provider-rendered geometry option is left open (`MAP-04` line 374). This risks routing-like behavior. First implementation should use only straight app-owned planned-order geometry.
- Autocomplete is correctly gated, but any selected provider with autocomplete enabled by default must explicitly disable it in submitted-search mode, per MAP-03 (`MAP-03` lines 97-102).
- Self-hosted tile/search pipelines and provider runtime switching should remain out of MVP unless hosted providers fail and owner accepts the operational scope.

## Missing Tests And Test Seams

- Add pure tests for the single coordinate classifier using every MAP-02A coordinate fixture, including `TBILISI_PROOF_AREA` inside/outside cases.
- Add selector tests using MAP-02A fixture IDs for all/no-day/day modes, visible pin labels `1,3,4`, route-line coordinates, fewer-than-two route-line null, and no renumbering around no-coordinate cards.
- Add repository transaction tests for assign day append, clear day nulls route order, reorder by card IDs, delete point, and reload persistence.
- Add contract tests that assert adapters never emit SDK objects/raw provider payloads into domain records or logs.
- Add component tests for map provider failure, search failure, offline-not-downloaded, outside Georgia, outside downloaded area, and handoff failure with saved cards/details still visible.
- Define route-line and pin-label test IDs or structured debug models so MAP-07/MAP-08 do not depend only on visual map assertions.
- Define native/offline proof handoff fields for MAP-06: device/build IDs, pack inventory IDs, bounds, zoom range, size, duration, restart inventory, network-disabled reopen, overlay proof, attribution, and cleanup.

## Suggested Revisions

1. Replace `OfflinePackService.classifyCoordinates` with a domain-owned `classifyCoordinate` contract returning:

   ```ts
   type CoordinateClassification = {
     insideGeorgia: boolean;
     insideDownloadedArea: boolean;
     reason:
       | 'inside_georgia_inside_downloaded_area'
       | 'inside_georgia_outside_downloaded_area'
       | 'inside_georgia_download_area_unknown'
       | 'outside_georgia'
       | 'invalid_coordinate';
   };
   ```

2. Recast `MapPoint` as either the canonical replacement for `Place` or as `MapPointView`. Do not leave both as independent persisted concepts.

3. Split offline map contracts into `OfflinePackLifecycle`, `OfflinePackProofState`, `OfflinePackInventory`, and `CoordinateClassification`.

4. Add a compact route-order contract table covering assign, clear, reorder, delete, missing coordinates, and card/pin/line derivation.

5. Replace Yandex-specific architecture language with generic external handoff contracts plus provider-specific policy/adapters.

6. Update MAP-04 blockers to consume MAP-02A rather than waiting on it.

7. State explicitly that MAP-04 can approve domain/mock implementation slices, but cannot approve provider-backed native/offline implementation until MAP-03/MAP-06/MAP-09 and owner thresholds are accepted.

## Decision Readiness

Lead can decide from this review that MAP-04 should be reworked before implementation planning. The rework is bounded and should not expand MVP scope.
