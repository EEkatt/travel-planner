# Market Research

## Status

Updated 2026-06-28.

## Goal

Понять рынок travel planning приложений, сильные и слабые стороны аналогов, а также функции, которые стоит взять в MVP или отложить.

## Scope

Проверены продукты: TripIt, Wanderlog, Google Travel/Maps, Roadtrippers, Polarsteps, Flighty, Яндекс Путешествия.

## Sources

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

## Competitor Summaries

### TripIt

Confirmed facts:

- TripIt Pro is positioned around travel alerts and trip execution; official pricing page says Pro costs $49/year.
- Pro features include seat tracker, fare tracker, check-in reminders, reward point tracking, automatic sharing with an "Inner Circle", country-specific travel information, passport renewal reminders, documents, real-time flight alerts, alternate flights, airport departure timing, risk alerts, airport maps, terminal/gate reminders, connection guidance, and baggage claim info.
- TripIt is strongest as a travel organizer for booked reservations and live travel disruption support, not as a map-first day planner.

Assumptions:

- Manual trip editing is likely supported, but this pass did not confirm exact manual entry depth from an official help page.
- TripIt is less aligned with this app's MVP because its strongest value appears after bookings exist and during flight disruption handling.

MVP implication:

- Copy the idea of one trip timeline with compact flight/hotel cards.
- Do not copy Pro-style flight tracking, fare tracking, seat tracking, reward tracking, or risk alerts into MVP.

### Wanderlog

Confirmed facts:

- Wanderlog markets itself as one app for itineraries, maps, bookings, and trip planning.
- It supports map view, itinerary, reservations, lodging, packing checklists, budgeting, travel guides, collaboration, flight status, AI assistant, route optimization, and offline access.
- Wanderlog says places added to a trip appear on the map and routes can be exported to Google Maps.
- Wanderlog says offline access lets users download trip plans for access without an internet connection.
- Wanderlog says collaboration works in real time.

Assumptions:

- Wanderlog is the closest direct competitor for the planned MVP because it combines map, itinerary, reservations, checklists, and collaboration.
- Its breadth may make a simpler personal/family MVP attractive if the app is faster to enter arbitrary travel data manually.

MVP implication:

- Keep map plus day plan as the central MVP workflow.
- Include simple checklists and notes because Wanderlog demonstrates they are expected in a modern trip planner.
- Keep collaboration, route optimization, automatic Gmail scanning, AI assistant, budgeting, and flight status outside MVP unless validated by first users.

### Google Travel / Google Maps

Confirmed facts:

- Google Travel exposes travel search surfaces including Explore, Flights, Hotels, Vacation rentals, Flight Deals, tracked flight prices, and tracked hotel prices.
- Google Maps supports offline map downloads, with limitations by country/region; offline mode can guide driving routes when the route is inside the downloaded area, but offline transit, bicycling, and walking directions are unavailable.
- Google Maps can show recent custom maps made in Google My Maps, and editing custom maps happens in My Maps.

Assumptions:

- Google is a strong adjacent tool rather than a direct all-in-one itinerary competitor: it is excellent for maps, places, navigation, and travel search, but less tailored to manual personal trip context, notes, checklists, and arbitrary booking records.
- Users will continue relying on Google Maps for navigation even if this app owns the planning layer.

MVP implication:

- Integrate with external navigation rather than trying to replace it.
- Provide place storage, daily grouping, and trip context that Google Maps does not make central.
- Treat offline as "trip details available offline" before attempting full offline routing.

### Roadtrippers

Confirmed facts:

- Roadtrippers is focused on road trip planning and discovery.
- Public descriptions emphasize route planning, points of interest, route distance/time/fuel estimates, route-adjacent discovery, and syncing planned trips to mobile apps.
- Roadtrippers is strongest for car-based trips, especially in markets where its POI database is deep.

Assumptions:

- Roadtrippers is adjacent, not a core direct competitor for city trips, flights, hotels, notes, and checklists.
- Its route optimization and fuel-cost depth are not required for this project's first personal travel MVP.

MVP implication:

- Use Roadtrippers as inspiration for route visibility and stop ordering.
- Avoid road-trip-specific features such as fuel cost, RV constraints, and route-adjacent attraction discovery in MVP.

### Polarsteps

Confirmed facts:

- Polarsteps positions itself around planning, tracking, and reliving trips.
- It claims 20M+ travelers and a 4.8 rating count on its homepage.
- Product areas include itinerary builder, trip overview, personalized travel tips, automatic trip tracking, step-by-step updates, offline tracking, and battery-efficient tracking.

Assumptions:

- Polarsteps is more post-trip memory/travel journal and live route tracking than pre-trip operational planner.
- The "relive" and sharing layer is valuable later, but it does not solve the MVP's core problem of reducing scattered planning context.

MVP implication:

- Do not add automatic route tracking or social trip journal features to MVP.
- Consider a later lightweight trip history after the core planner works in a real trip.

### Flighty

Confirmed facts:

- Flighty is a flight tracking application for iOS and macOS.
- Public descriptions list flight tracking, delay information, lifetime flight statistics, and sharing flights with friends.
- Flighty Pro includes importing flights from emails, calendars, and TripIt, and has advanced delay and aircraft tracking features.

Assumptions:

- Flighty is best treated as a premium specialist, not a product to match feature-for-feature.
- Users who need elite flight tracking may already use Flighty; this app should only store enough flight information to support the trip plan in MVP.

MVP implication:

- Manual flight entry should include only stable fields needed in the trip timeline: airline, flight number, dates/times, airports, terminal/gate as optional text, booking reference/notes.
- Live tracking, aircraft history, delay prediction, and friend flight sharing should remain out of MVP.

### Яндекс Путешествия

Confirmed facts:

- Яндекс Путешествия offers hotel booking, flights, rail tickets, tours, and business travel surfaces.
- The Yandex Travel homepage emphasizes booking hotels on the site and in the app, partner hotel inventory, payment options, reviews, support, discounts, and Plus cashback.
- It is a booking ecosystem rather than a neutral manual trip-planning workspace.

Assumptions:

- Yandex Travel is important for Russian-speaking users as a source of bookings, but it does not appear to be a flexible planner for manually combining arbitrary tickets, hotels, places, notes, and checklists from any source.

MVP implication:

- Do not compete on ticket or hotel purchase.
- Make manual entry from any source easy, including bookings bought through Yandex Travel.

## Confirmed Findings

- The market already has strong specialized products for flights, maps/navigation, road trips, booking, and trip journaling.
- The closest direct competitor is Wanderlog because it combines itinerary, map, reservations, lodging, checklists, collaboration, offline access, route optimization, flight status, and AI.
- Flight tracking is a deep specialist domain; TripIt Pro and Flighty show that high-quality flight alerts require a scope well beyond the current MVP.
- Offline support matters, but competitors split it into different meanings: Google Maps offline navigation, Wanderlog offline trip plan access, Polarsteps offline tracking.
- Booking ecosystems such as Yandex Travel and Google Travel are not neutral personal planning spaces; they are strong for search/purchase and weaker as arbitrary data containers.

## Assumptions

- The first users value "all my plan in one place" more than automated import, live flight operations, or collaborative editing.
- Manual entry quality is a defensible MVP focus because bookings and ideas can come from any source.
- A simple, reliable mobile trip view can beat broader competitors for personal/family use if it is faster to use during the trip.

## MVP Recommendations

1. Build a map-first trip workspace with day-by-day plan as the primary experience.
   Action: make every place, hotel, and activity optionally assignable to a day and visible on the map.

2. Keep manual flight and hotel entry in MVP, but limit fields to trip-useful data.
   Action: support flight number, airports, dates/times, booking reference, terminal/gate free text, hotel address, check-in/out, confirmation, and notes.

3. Add notes and checklists as first-class but simple objects.
   Action: allow notes/checklists at trip level and day/place level; avoid templates and AI-generated packing until later.

4. Implement external navigation handoff instead of native routing.
   Action: add "open in maps" links for places and day routes; postpone custom route optimization.

5. Treat offline MVP as cached trip details, not offline maps or routing.
   Action: cache trip plan, places, flight/hotel details, notes, and checklists locally; document that navigation still uses external maps.

6. Keep collaboration out of MVP unless family/friend testing shows planning handoff is blocked.
   Action: start with share/export or read-only trip summary later before real-time editing.

7. Keep LLM out of MVP.
   Action: collect structured trip data first so a future assistant has useful context.

## Differentiation Opportunities

- A simpler personal/family planner that accepts manual data from any source without pushing booking, social publishing, or subscriptions.
- Central mobile trip screen combining map, current day, flight/hotel essentials, notes, and checklists.
- Later LLM assistant grounded in the user's actual trip data, not a generic travel chatbot.

## Risks

- Wanderlog already covers much of the planned long-term surface, so the MVP must be narrower and easier rather than broader.
- If manual entry is slow, the product loses against email import and ecosystem apps.
- Offline expectations can become expensive if users expect full offline maps/navigation instead of cached trip data.
- Flight tracking can consume large scope while adding little MVP value for users who only need itinerary structure.
