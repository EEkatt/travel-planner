# Gate 00 Test Harness

Task ID: TASK-20260704-014
From: test_automation_engineer
To: lead
Status: Ready For Review
Date: 2026-07-04

## Summary

Gate 00 test harness should start with the existing Expo/TypeScript baseline and add the smallest deterministic Jest-based stack before app feature work expands.

Current `app/mobile` has no `src/` or tests yet. `npm run typecheck` exists and passes.

## Proposed Scripts

```json
{
  "typecheck": "tsc --noEmit",
  "test": "jest --runInBand",
  "test:watch": "jest --watch",
  "test:domain": "jest src/domain",
  "test:components": "jest src --testPathPattern='(screens|components|features)'",
  "test:repositories": "jest src/storage",
  "test:e2e": "maestro test .maestro/smoke-create-trip.yml"
}
```

Add `lint` only after lint tooling is selected.

## Recommended Tooling

- Jest, `jest-expo`, `@types/jest`.
- `@testing-library/react-native` for component tests.
- Avoid `react-test-renderer` for React 19+.
- Maestro for release smoke/E2E after stable app IDs/builds/selectors.
- Repository contract tests first; concrete SQLite integration tests after SQLite package/migration API are chosen.

## First Domain Test Path

`app/mobile/src/domain/__tests__/tripDateRules-test.ts`

Coverage:

- unknown dates produce manual day selection;
- generated days are inclusive for known range;
- fixed current date selects matching trip day;
- before/during/after trip modes are explicit;
- no `Date.now()` dependency inside assertions.

## CI Gate Recommendations

- Merge gate now: `npm ci` and `npm run typecheck`.
- After harness setup: add deterministic Jest run.
- Add lint only after lint tooling is configured.
- Keep Maestro out of normal merge gates until simulator/device build stability is proven.
- Release gate later: build smoke plus Maestro smoke.
- Add privacy/log negative tests before MVP RC.

## Coverage Gaps

- No domain model/rules files.
- No Jest config.
- No component tests.
- No repository/storage decision.
- No smoke/E2E flow.
- CI quality gates are documented but not implemented.
