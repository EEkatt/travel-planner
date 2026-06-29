# CI Quality Gates

## Status

Draft

## Purpose

Define automated gates that should run before merge and release.

## Initial CI Gates

| Gate | Command | Required before merge | Required before release |
| --- | --- | --- | --- |
| Install | `npm ci` in `app/mobile` | Yes | Yes |
| Typecheck | `npm run typecheck` | Yes | Yes |
| Lint | `npm run lint` | Yes once configured | Yes |
| Unit tests | `npm test` or equivalent | Yes once configured | Yes |
| Build smoke | Expo build/export command to be selected | No | Yes |
| Dependency audit | Tool to be selected | No | Yes |

## Required Scripts

The mobile app should eventually expose these scripts in `app/mobile/package.json`:

```json
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "lint": "<selected lint command>",
    "test": "<selected test command>",
    "test:watch": "<selected watch command>",
    "test:e2e": "<selected e2e command>"
  }
}
```

## Gate Policy

- Required gates must be deterministic.
- CI must not depend on real personal data or private local state.
- Tests that require real devices or external services may run in release validation instead of every merge.
- Failing required gates block release unless the Lead Agent records explicit risk acceptance.

## Future Gates

- Import boundary checks between UI, domain, storage, and services.
- Bundle size or startup performance budget.
- Accessibility checks where tooling supports it.
- Secret scanning.
- Dependency license and maintenance review.
