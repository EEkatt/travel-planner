# Map Lead Decision: Go For MAP-05 Slice 1

Date: 2026-07-04
Lead: lead
Status: Go for first code implementation slice

## Inputs

- `agent_workspace/reports/MAP-05P-DOMAIN-MOCK-IMPLEMENTATION-PLAN-REWORK-20260704.md`
- `agent_workspace/reports/REVIEW-MAP-05P-BY-QA-20260704.md`
- `agent_workspace/reports/REVIEW-MAP-05-PLAN-BY-CODE-QUALITY-20260704.md`

## Decision

Start MAP-05 Slice 1 implementation.

Scope is limited to pure TypeScript domain/mock/test work under `app/mobile/src/`, plus bounded dev-only test tooling if required.

## Allowed Files

- `app/mobile/src/domain/map/`
- `app/mobile/src/services/`
- `app/mobile/src/**/__tests__/`
- `app/mobile/package.json`
- `app/mobile/package-lock.json`
- implementation report under `agent_workspace/reports/`

## Do Not Edit

- `app/mobile/App.tsx`
- native app config except package scripts/devDependencies if needed
- provider/native/offline SDK setup
- production provider URLs/keys
- requirements/product/architecture/testing docs

## Required Verification

From `app/mobile`:

- `npm run typecheck`
- `npm run test`
- `npm run test:map`

If test tooling installation is blocked, report exact blocker and keep package changes dev-test-only.

## Non-Goals

- no UI wiring;
- no provider-backed search;
- no public Nominatim/OSM production path;
- no native/offline map proof;
- no whole-country Georgia claim;
- no offline search/geocoding/routing/navigation;
- no route optimization, traffic, ETA, or live rerouting.
