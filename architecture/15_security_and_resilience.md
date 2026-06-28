# Security And Resilience Baseline

## Status

Draft. Must be refined during Gate 00 and early implementation slices.

## Purpose

Define the minimum security and resilience expectations for the MVP before implementation grows.

The MVP is local-first and does not include accounts, backend sync, collaboration, payments, booking, automatic import, or LLM. This reduces the security surface, but local travel data can still be sensitive.

## Sensitive Data

MVP may store:

- trip names and dates;
- places and addresses;
- flight numbers, airports, dates and times;
- booking references;
- housing addresses, contacts, check-in/out notes;
- user notes;
- checklist items.

MVP must not store:

- passport data;
- payment card data;
- visa documents;
- high-risk identity documents;
- raw LLM prompts or external AI logs, because LLM is outside MVP.

## Security Principles

- Local-first by default.
- No backend on the MVP critical path.
- No accounts or remote user identity in MVP unless explicitly approved later.
- Do not log private travel data.
- Do not send trip data to external services except explicit map/search/navigation calls needed by the user.
- Do not store API keys in client code unless the chosen provider explicitly supports public mobile keys with restrictions.
- Do not introduce analytics that captures notes, booking references, addresses, or flight details.

## Local Storage

Minimum requirements:

- Store MVP data locally using the selected Gate 00 storage decision.
- Keep schema migrations explicit and tested.
- Avoid storing passport/payment data.
- If platform secure storage is added, use it only for secrets/tokens, not ordinary trip records.
- Treat device-level protection as the first MVP security boundary.

Open decision:

- Whether MVP needs application-level encryption for local database records. Default: no for first private MVP, unless threat model changes.

## Logging And Diagnostics

Allowed:

- generic error type;
- technical component name;
- non-sensitive status code;
- sanitized stack trace during development.

Not allowed:

- booking references;
- full addresses;
- contacts;
- user notes;
- checklist contents;
- full flight details;
- raw map/search query logs beyond what the provider receives by design.

## External Providers

Provider calls must be isolated behind adapters:

- map display;
- place search/geocoding;
- external navigation handoff;
- notifications, if included.

Provider risks to check in Gate 00:

- API key restrictions;
- pricing;
- terms of use;
- mobile SDK compatibility;
- offline behavior;
- what user data is sent to the provider.

## Resilience Principles

- Saved local data must remain readable after app restart.
- Failed provider calls must not block manual entry.
- Weak network must degrade to saved lists/details where possible.
- Missing coordinates must not break day plans.
- Missing target records must not destroy day item readability.
- Notification permission denial must not delete reminder intent.
- User-facing empty/error states must explain the next available action.

## Failure Modes And Expected Behavior

| Failure | Expected MVP behavior |
| --- | --- |
| No network during place search | User can add place manually by title/address text. |
| Map tiles or provider unavailable | Show saved place/day list and a clear unavailable map state. |
| External navigation unavailable | Show address/details and explain navigation cannot be opened. |
| App restart | Previously saved trip data is readable. |
| Migration failure | Do not silently corrupt data; show recoverable error during development and log sanitized error. |
| Deleted target object referenced by day item | Day item remains readable through denormalized snapshot and target action is disabled. |
| Notification permission denied | Reminder data remains visible in-app; no system notification is scheduled. |

## Minimum Tests

Gate 00:

- chosen test stack can run domain tests;
- chosen test stack can run React Native component tests;
- chosen storage spike can create schema, migrate, write, restart, and read.

Early slices:

- no private values in repository/adaptor errors;
- trip survives app reload;
- manual place works without network;
- day item stale target behavior is deterministic;
- map/search unavailable states are visible and do not crash the app;
- UI copy does not promise offline maps, route optimization, live flight tracking, booking import, collaboration, or LLM.

## Open Questions

- Is device-level protection enough for the private MVP?
- Do we need manual export/backup before real travel use?
- Which map/search provider sends what data during search/geocoding?
- Should crash reporting be disabled until sanitization rules are implemented?
