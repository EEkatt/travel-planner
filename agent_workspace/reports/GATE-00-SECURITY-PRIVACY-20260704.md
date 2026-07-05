# Gate 00 Security And Privacy Review

Task ID: TASK-20260704-016
From: security_reviewer
To: lead
Status: Ready For Review
Date: 2026-07-04

## Summary

Gate 00 security posture is acceptable for a local-first MVP only after listed blockers are closed.

The current app has no backend, accounts, analytics, crash reporting, map/search SDK, storage SDK, notification package, permission request, or committed API key in app source/config.

Main blockers:

- realistic-looking demo travel data;
- unresolved map/tile/search provider terms and key handling;
- dependency audit item in Expo tooling.

## Findings

- MUST FIX: `app/mobile/App.tsx` contains realistic-looking sensitive travel data: booking-like reference, flight number, airport/time details, named trip/location examples.
- PASS: no app-source console logging found.
- PASS: no committed API key/secret found in app/mobile source/config scan.
- PASS: `app/mobile/app.json` does not declare location or notification permissions.
- BLOCKER: MapLibre is spike path only. Production tile/style provider, offline cache terms, API key restrictions, pricing/quota, attribution, and offline pack size are not approved.
- BLOCKER: Search/geocoding provider is not selected. Query/address sharing, trust boundaries, quota/cost, and logging rules remain unresolved.
- REVIEW REQUIRED: `npm audit --omit=dev` reports moderate vulnerabilities through Expo tooling; do not run `npm audit fix --force` because it would downgrade Expo. Check Expo 56 patch path or document residual risk before RC.

## Required Fixes

- Replace realistic demo data in `app/mobile/App.tsx` with clearly synthetic impossible placeholders before merging/releasing any prototype artifact.
- Choose and document production tile/style provider terms before broad map implementation.
- Choose and document search/geocoding provider privacy behavior before implementing place search.
- Define API key rules: no service secrets in client; public mobile keys only if provider supports restrictions; rotate exposed dev keys.
- Add logging guardrails/tests before repositories/adapters emit errors.
- Re-run dependency audit after non-breaking Expo patch update attempt; document or resolve advisory before release candidate.

## Recommendations

- Keep app-level database encryption out of first private MVP unless threat model changes.
- Use SecureStore only for future secrets/tokens, not ordinary trip records.
- Keep notification/location permissions optional and action-triggered.
- Add a privacy fixture policy: all fixtures/screenshots use impossible placeholders, not realistic booking numbers, contacts, addresses, flight numbers, or private notes.
