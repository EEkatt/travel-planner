# MAP-05 Slice 2 Code Quality Review

Date: 2026-07-05
Role: code_quality_reviewer
Task: TASK-20260705-049

## Recommendation

Accept.

Slice 2 is within the approved prototype boundary. I found no blocking maintainability, TypeScript safety, UI scope, or provider-boundary issues that should stop lead acceptance.

## Findings

No required rework findings.

Non-blocking notes:

- `app/mobile/App.tsx:112` keeps the Georgia suggestion fixtures local to `App.tsx`, which is acceptable for this narrow prototype slice. If this grows beyond the current six deterministic suggestions, move the list behind the existing map-domain boundary to avoid further growth of the already large app entry file.
- `app/mobile/App.tsx:812` duplicates Georgia bounds already represented by `classifyCoordinate` in `app/mobile/src/domain/map/coordinates.ts:53`. This is acceptable for the UI prototype, but a next slice should prefer the domain helper so country-scope behavior has one source of truth.
- The web preview still loads Leaflet and OpenStreetMap tiles from public URLs in `app/mobile/App.tsx:685`, `app/mobile/App.tsx:707`, and `app/mobile/App.tsx:714`. This matches the implementation report's stated existing iframe/tile prototype and is not used for autocomplete, but it remains online map display only.

## Scope Compliance Check

- One add-place flow: Pass. `app/mobile/App.tsx:530` exposes a single `Добавить место` panel containing the input, day picker, suggestions, map-tap coordinate state, manual text fallback, and one save action.
- No required Find/search submit before suggestions: Pass. Suggestions are derived directly from `addQuery` in `app/mobile/App.tsx:315` through `app/mobile/App.tsx:328`; there is no `Find`/`Найти` button in the add-place flow.
- Local Georgia suggestions only: Pass. The fixture records in `app/mobile/App.tsx:112` through `app/mobile/App.tsx:161` all carry `countryCode: 'GE'`, and the UI labels them as prototype/local Georgia suggestions in `app/mobile/App.tsx:558` through `app/mobile/App.tsx:584`.
- Suggested place, map tap, and manual text save path: Pass. `saveAddPlace` uses one path in `app/mobile/App.tsx:387` through `app/mobile/App.tsx:421` for selected suggestions, Georgia map-tap coordinates, outside-Georgia fallback to text-only, and manual text.
- Outside-Georgia coordinate handling: Pass. `draftCoordinateInsideGeorgia` gates coordinate persistence in `app/mobile/App.tsx:332` and `app/mobile/App.tsx:392` through `app/mobile/App.tsx:414`, with visible warning copy at `app/mobile/App.tsx:595` through `app/mobile/App.tsx:597`.
- Provider/autocomplete boundary: Pass. I found no Nominatim/public-provider autocomplete usage and no provider keys. `app/mobile/package.json:5` through `app/mobile/package.json:15` adds no provider, native map, or offline SDK dependencies.
- Existing domain boundary: Pass. The accepted domain files under `app/mobile/src/domain/map/` remain provider-normalized and tested; the adapter contract test asserts autocomplete is disabled and provider internals do not leak at `app/mobile/src/domain/map/__tests__/mapDomain.test.ts:427` through `app/mobile/src/domain/map/__tests__/mapDomain.test.ts:494`.

## Testability Notes

- `npm run typecheck` passed from `app/mobile`.
- `npm run test` passed after escalation because the sandbox blocked writes to `app/mobile/node_modules/.cache/mobile-map-tests`.
- `npm run test:map` passed after the same cache-write escalation.
- The current tests cover the domain/map selector and provider-boundary contracts, but not the `App.tsx` add-place UI interactions. That is acceptable for this prototype slice; a future UI test harness would be useful before expanding this flow.

## Required Fixes

None.
