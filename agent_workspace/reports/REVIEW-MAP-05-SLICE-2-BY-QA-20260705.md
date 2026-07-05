# MAP-05 Slice 2 QA Review

Date: 2026-07-05
Role: qa_engineer
Task: TASK-20260705-050
Recommendation: Accept

## QA Acceptance Assessment

MAP-05 Slice 2 passes QA for the owner feedback covered by this task.

- Duplicate map add/search surfaces are removed or merged in the mobile map screen. `App.tsx` exposes one visible `Добавить место` panel with one input, one day picker, one suggestion list, coordinate preview, clear-coordinate action, and one save action.
- Suggestions are local Georgia fixtures and update from React state while typing. The fixture list is in `App.tsx` and every suggestion has `countryCode: 'GE'`.
- There is no `Find`/`Найти` button dependency for suggestions. Static search found no old `Find`, `Найти`, `Search place online`, or `Add point by click` map UI in `App.tsx`.
- No production autocomplete/provider claim was found in the implemented map screen. The visible copy says suggestions come only from local Georgia fixtures and that production autocomplete, offline search, and routing are not connected.
- Map tap and manual fallback remain in the same add-place flow. Web map clicks post `trip-map-click` into the same `draftCoordinates` state, native map taps set the same draft state, and saving uses one `saveAddPlace` path for suggestions, map taps, and manual text-only entries.
- Outside-Georgia map-tap coordinates are not saved as coordinate-backed points. The save path only keeps tapped coordinates when `isInsideGeorgiaCoordinate` passes; otherwise the item is saved as text-only with no pin.

## Evidence Reviewed

- `agent_workspace/tasks/open/TASK-20260705-050-map-05-slice-2-qa-review.md`
- `agent_workspace/reports/MAP-05-SLICE-2-IMPLEMENTATION-20260705.md`
- `agent_workspace/reports/MAP-05-SLICE-2-UX-20260705.md`
- `requirements/11_map_requirements.md`
- `app/mobile/App.tsx`
- `app/mobile/package.json`

Key implementation references:

- `app/mobile/App.tsx:112` local `georgiaPlaceSuggestions` fixtures with `countryCode: 'GE'`.
- `app/mobile/App.tsx:315` derives `shownSuggestions` from `addQuery` without a submit/search action.
- `app/mobile/App.tsx:341` receives web map taps into the same add-place draft state.
- `app/mobile/App.tsx:375` receives native map taps into the same add-place draft state.
- `app/mobile/App.tsx:387` uses one save path for suggestion, map-tap, and manual-text entries.
- `app/mobile/App.tsx:530` renders the single `Добавить место` panel.
- `app/mobile/App.tsx:621` contains the prototype-boundary copy for local fixtures and no connected production autocomplete/offline search/routing.
- `app/mobile/App.tsx:812` bounds-checks tapped coordinates against the Georgia MVP area.

## Commands Reviewed/Executed

- Reviewed implementation-reported command evidence: `npm run typecheck`, `npm run test`, and `npm run test:map` were reported as passing in `MAP-05-SLICE-2-IMPLEMENTATION-20260705.md`.
- Executed `npm run typecheck` from `app/mobile`: passed.
- Executed `npm run test` from `app/mobile`: first run failed under read-only sandbox because TypeScript could not write compiled test output to `node_modules/.cache/mobile-map-tests`; rerun with write approval passed.
- Executed `npm run test:map` from `app/mobile` with write approval for the same cache output: passed.
- Executed targeted static searches for removed/prohibited UI and claims:
  - `rg -n "Find|Найти|Search place online|Add point by click|Добавить точку|Поиск" app/mobile/App.tsx`
  - `rg -n "Find|Найти|Search place|Search all|Autocomplete|autocomplete|Nominatim|provider|Powered by|offline search|offline-search|offline geocoding|offline routing|route optimization|traffic|ETA|live rerouting|Всемир|worldwide|map provider|провайдер|автокомплит|поиск|маршрутизац|трафик|ETA" app/mobile/App.tsx app/mobile/src agent_workspace/reports/MAP-05-SLICE-2-IMPLEMENTATION-20260705.md agent_workspace/reports/MAP-05-SLICE-2-UX-20260705.md requirements/11_map_requirements.md`

## Coverage Gaps

- I did not run an interactive Expo web/mobile session or capture a viewport screenshot, so narrow-screen visual overlap and actual tap UX were assessed from code structure only.
- Existing automated tests exercise the domain/map mock contracts, not the new `App.tsx` add-place UI interactions directly.
- The add-place panel is always visible rather than opened from a compact button/sheet, so the UX default of preselecting the currently filtered day on open is not directly represented. Users can still manually choose `Без дня`, `День 1`, `День 2`, or `День 3` before saving.

## Required Fixes

None for MAP-05 Slice 2 QA acceptance.

## Final Recommendation

Accept Slice 2. The implementation satisfies the owner feedback gate: one add-place flow, local Georgia suggestions while typing, no Find dependency, no production autocomplete/provider claim, and same-flow map tap/manual fallback.
