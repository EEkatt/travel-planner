# Market Research Report

Task ID: TASK-20260628-001
Agent: market_research
Date: 2026-06-28

## Summary

Updated market research for competing and adjacent travel planning apps and refreshed the feature matrix. The strongest direct competitor is Wanderlog. TripIt and Flighty are strong flight/travel-operations tools, Google Maps/Travel and Yandex Travel are ecosystem utilities, Roadtrippers is road-trip-specific, and Polarsteps is closer to tracking/journaling.

## Files Updated

- `research/02_market_research.md`
- `research/13_feature_matrix.md`

## Sources Checked

- TripIt: https://www.tripit.com/web/pro
- Wanderlog: https://wanderlog.com/
- Google Travel: https://www.google.com/travel/
- Google Maps offline maps: https://support.google.com/maps/answer/6291838
- Google My Maps in Google Maps: https://support.google.com/maps/answer/3045850
- Roadtrippers: https://roadtrippers.com/
- Roadtrippers overview: https://en.wikipedia.org/wiki/Roadtrippers
- Polarsteps: https://www.polarsteps.com/
- Flighty overview: https://en.wikipedia.org/wiki/Flighty
- Yandex Travel: https://travel.yandex.ru/

## Confirmed Findings

- Wanderlog publicly claims the broadest overlap with the planned long-term product: itinerary, map, reservations, lodging, packing checklists, budgeting, collaboration, flight status, AI, route optimization, and offline access.
- TripIt Pro is priced at $49/year and focuses on travel alerts, flight disruption support, seat/fare tracking, documents, risk alerts, and related trip execution features.
- Google Maps supports offline maps with limitations, including no offline transit, bicycling, or walking directions.
- Google Travel focuses on travel search surfaces such as Explore, Flights, Hotels, Vacation rentals, Flight Deals, and price tracking.
- Polarsteps is oriented around planning, automatic tracking, offline tracking, and reliving trips.
- Yandex Travel focuses on booking hotels, flights, rail tickets, tours, and business travel.

## Assumptions

- Manual entry depth in TripIt and Yandex Travel needs hands-on validation.
- Roadtrippers offline/collaboration behavior likely varies by plan and region.
- Google can cover fragments of the trip workflow, but not as one manual trip workspace.

## MVP Recommendations

1. Keep the MVP centered on trip creation, map places, day-by-day plan, manual flight/hotel entry, notes, checklists, and basic reminders.
2. Make manual entry fast and forgiving; this is the strongest justified wedge against booking ecosystems and automated-import products.
3. Use external map handoff for navigation instead of building route optimization or offline navigation.
4. Define offline MVP as cached trip details only.
5. Defer automatic import, flight tracking, real-time collaboration, route optimization, booking, travel journaling, and LLM until the core planner proves useful in a real trip.

## Risks

- Wanderlog already covers many long-term features, so the MVP must win on simplicity and speed rather than breadth.
- Flight tracking can create disproportionate scope because specialist products already invest deeply there.
- Overpromising offline support could create user disappointment if users expect full offline maps.
- Adding competitor parity features without validation would expand MVP beyond the stated project goal.
