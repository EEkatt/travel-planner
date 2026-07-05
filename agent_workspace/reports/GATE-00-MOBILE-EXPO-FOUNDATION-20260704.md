# Gate 00 Mobile Expo Foundation

Task ID: TASK-20260704-012
From: mobile_expo_engineer
To: lead
Status: Ready For Review
Date: 2026-07-04

## Summary

`app/mobile` is a runnable Expo/React Native TypeScript scaffold, but still a static single-screen proof. Gate 00 is not complete for storage, navigation, test harness, or development-build validation.

`npm run typecheck` passes.

## Current Foundation

- Expo `~56.0.12`, React `19.2.3`, React Native `0.85.3`, TypeScript `~6.0.3`.
- `tsconfig.json` extends `expo/tsconfig.base` with `strict: true`.
- `index.ts` registers single `App` component.
- `App.tsx` is static hardcoded trip UI; no real navigation, persistence, repositories, adapters, or state restoration.
- `app.json` has no plugins or development-build/native provider config.
- No `src/` architecture yet.
- No storage, navigation, map, dev-client, lint, or test dependency.
- Static fixture content includes booking-like and flight-like values; these must be replaced with impossible placeholders before release/prototype sharing.

## Commands Run

- `npm run typecheck`
- `npm ls --depth=0`
- local reads/searches for Expo bundled metadata and project context.

## Results

- `npm run typecheck`: passed.
- Installed top-level packages are only Expo baseline packages.
- Local Expo metadata includes `expo-sqlite`, `expo-dev-client`, `expo-router`, and `expo-linking` compatible with SDK 56, but they are not installed in the app.

## Storage Proof Plan

1. Add `src/data/storage` only after G00-01 approval.
2. Use `expo-sqlite` with explicit ordered migrations and schema/version table.
3. Start with `trips(id, title, created_at, updated_at)`.
4. Keep raw SQL inside storage/repository boundary.
5. Prove clean install migration, write, read, restart, and read again.
6. Verify migration rerun is idempotent and errors are sanitized.

## Navigation Proof Plan

1. Add `src/app/AppRoot.tsx`.
2. Add typed root stack: trip list, trip workspace, modal/detail.
3. Add workspace tabs: `Today`, `Days`, `Map`.
4. Use placeholders/dev fixtures only.
5. Keep provider/domain/storage code out of navigation components.
6. Acceptance: app opens trip list, workspace, switches tabs, opens/closes one modal/detail, and `typecheck` passes.

## Development Build Blockers

- `expo-dev-client` is not installed.
- MapLibre is not installed/configured.
- No native development build has been generated or validated.
- iOS signing/simulator availability unknown.
- Android emulator/build availability unknown.
- Tile/style provider, API key model, pricing, attribution, offline terms, cache limits unresolved.
- Offline pack size and restart/network-off rendering unmeasured.

## Recommended Next Step

Run bounded Gate 00 follow-ups in order:

1. G00-01 storage restart-read proof.
2. G00-02 navigation proof.
3. G00-03 test harness selection.
4. MapLibre development-build/offline-pack spike after provider/device constraints are approved.
