# Feature Matrix

## Status

Updated 2026-06-28.

## Legend

- Yes: confirmed from public product/source pages.
- Partial: feature exists only in a narrower form or through a related workflow.
- Later: intentionally out of MVP.
- No/Not core: not a visible core capability for this product category.
- Assumed: reasonable inference from available public sources; needs validation.
- Unknown: not confirmed in this research pass.

## Matrix

| Feature | Our App MVP | TripIt | Wanderlog | Google Travel/Maps | Roadtrippers | Polarsteps | Flighty | Яндекс Путешествия |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Create trip | Yes | Yes | Yes | Partial | Yes | Yes | No/Not core | Partial |
| Add places to map | Yes | Partial | Yes | Yes | Yes | Partial | No/Not core | Partial |
| Day-by-day route | Yes | Partial | Yes | Partial | Yes | Partial | No/Not core | No/Not core |
| Manual flight entry | Yes | Assumed | Partial | Partial | No/Not core | No/Not core | Yes | Partial |
| Automatic flight import | Later | Yes | Yes | Partial | No/Not core | No/Not core | Yes Pro | Partial |
| Flight tracking | Later | Yes Pro | Yes | Partial | No/Not core | No/Not core | Yes | Partial |
| Manual hotel entry | Yes | Assumed | Yes | Partial | Partial | No/Not core | No/Not core | Partial |
| Notes | Yes | Partial | Yes | Partial | Partial | Yes | No/Not core | No/Not core |
| Checklists | Yes | Unknown | Yes | No/Not core | Unknown | No/Not core | No/Not core | No/Not core |
| Offline access | Cached trip data only | Unknown | Yes | Yes maps | Assumed paid/partial | Yes tracking | Partial | Unknown |
| Collaboration | Later | Partial sharing | Yes | Partial sharing | Partial sharing | Partial sharing | Flight sharing | No/Not core |
| LLM assistant | Later | No/Not core | Yes | Partial ecosystem | Partial/AI route tools | No/Not core | No/Not core | No/Not core |
| Booking/search marketplace | No | No/Not core | Partial | Yes | Partial | No/Not core | No/Not core | Yes |
| Travel journal/history | Later | Partial | Partial | Partial timeline | Partial | Yes | Flight stats | Partial |
| Pricing/platform limitations | TBD | Pro $49/year | Free + paid Pro visible publicly | Google ecosystem; offline map limits vary | Road-trip focused; paid tiers visible publicly | Free app with monetization around books/extras assumed | Apple platforms; Pro for advanced import/tracking | Yandex ecosystem and supported markets |

## Feature Matrix Updates

- Added automatic flight import, booking/search marketplace, and travel journal/history because they explain why some competitors are adjacent rather than direct MVP targets.
- Marked the app's offline scope as cached trip data only, not full offline maps or navigation.
- Marked collaboration and LLM as Later to match `requirements/08_mvp.md`.
- Used Assumed/Unknown where public sources did not confirm exact manual entry or offline behavior.

## Confirmed Findings

- Wanderlog is the broadest direct feature competitor: itinerary, map, reservations, lodging, checklists, collaboration, offline access, flight status, AI, and route optimization are all public-facing claims.
- TripIt and Flighty set high expectations for flight organization/tracking, but their strongest features are outside the current MVP.
- Google Maps is essential for maps, places, and offline navigation, but it is not a dedicated personal trip workspace.
- Roadtrippers is strong for road-trip routing and stop discovery, not a general flight/hotel/note/checklist planner.
- Polarsteps is strongest for tracking, journaling, and reliving trips, not operational pre-trip planning.
- Yandex Travel is a booking ecosystem for hotels, flights, trains, tours, and business travel, not a neutral manual planner.

## Assumptions

- Manual TripIt and Yandex Travel arbitrary-entry depth needs further verification through product testing or help docs.
- Roadtrippers offline and collaboration depth may depend on subscription tier and region.
- Google Travel/Maps can cover fragments of trip planning, but the user experience remains spread across Travel, Maps, Gmail, and My Maps.

## MVP Recommendations

1. Keep MVP scope centered on create trip, map places, day plan, manual flight/hotel entry, notes, checklists, and basic reminders.
2. Add only a lightweight offline promise: trip details available without network. Do not promise offline maps or routing.
3. Build quick manual entry flows before any import automation.
4. Add external map handoff for navigation instead of implementing native routing.
5. Defer flight tracking, automatic import, real-time collaboration, route optimization, travel journaling, booking, and LLM.

## Risks

- A broad checklist can make MVP look competitive on paper but slow in practice; entry speed should be treated as a core quality attribute.
- Competitors already own specialized domains, so MVP should integrate around them instead of replacing them.
- Ambiguous offline wording can create expectations the app cannot meet in the first version.
