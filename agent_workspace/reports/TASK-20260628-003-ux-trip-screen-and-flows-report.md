# UX Trip Screen And Flows Report

Task ID: TASK-20260628-003
Agent: ux_analyst
Date: 2026-06-28

## Summary

Defined the MVP mobile trip screen and critical travel-time flows. The recommendation is a simple hybrid main trip screen centered on "Today / Days / Map", with one-tap access to the information travelers need under time pressure.

## Changed Files

- `product/04_user_journey.md`
- `requirements/06_use_cases.md`
- `agent_workspace/reports/TASK-20260628-003-ux-trip-screen-and-flows-report.md`

## Recommended Main Screens

- Main trip screen: hybrid "Today / Days / Map".
- Before-trip mode: days, missing plan details, manual additions, and map context.
- During-trip mode: current day, nearest next item, compact map, and one-tap actions.
- Detail screens: place, housing, flight, note, checklist.
- Add flow: simple type picker for place, event, flight, housing, note, or checklist item.

## Critical User Flows

- Create trip with minimal required fields.
- Add places through search or manual text entry.
- Assign places and events to days.
- Add housing and flights manually with stable fields only.
- Open current day during travel.
- Open external navigation from a place or housing address.
- Access housing, flights, notes, and checklists in one tap.
- Read saved trip details with weak internet if caching is implemented.
- Make quick manual edits during travel.

## One-Tap Travel Access

During travel, the main trip screen should provide one-tap access to:

- today's plan;
- nearest next item;
- external navigation for a place or housing address;
- housing details;
- flight details;
- trip/day notes;
- checklist;
- saved offline details if caching is part of the MVP implementation.

## UX Risks

- A dashboard with too many blocks can recreate the search problem the product is meant to solve.
- A map-first screen can hide the next practical action.
- A list-only day plan can remove useful geographic context.
- Heavy mandatory fields can make manual entry slower than notes.
- Broad offline wording can create expectations for offline maps and routing.
- Automatic "Today" behavior needs a clear fallback when dates are missing or plans are incomplete.

## Open Questions

- Confirm the hybrid "Today / Days / Map" screen as the MVP structure.
- Decide whether the map is always visible or collapsed by default during travel.
- Decide whether automatic "Today" mode is required in MVP.
- Define the minimum offline cache scope: current trip, current day, or selected critical details.
- Confirm whether basic reminders are still needed if the main screen highlights the next item.
- Finalize required fields for manual flight and housing entry.
