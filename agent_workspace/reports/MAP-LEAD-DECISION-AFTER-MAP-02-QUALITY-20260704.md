# Map Lead Decision After MAP-02 Quality Review

Date: 2026-07-04
Lead: lead
Status: Conditional go for MAP-02A, MAP-03 discovery, and MAP-04 framing

## Inputs

- `agent_workspace/reports/MAP-02-REQUIREMENTS-20260704.md`
- `agent_workspace/reports/REVIEW-MAP-02-REQUIREMENTS-BY-QUALITY-20260704.md`

## Decision

Accept MAP-02 conditionally as the baseline for limited downstream discovery and design.

Start:

- MAP-02A requirements addendum;
- MAP-03 provider discovery;
- MAP-04 architecture framing.

Do not start production implementation, provider commitment, native/offline proof acceptance, test automation execution, or QA execution until MAP-02A is complete and the relevant MAP-03/MAP-04 reports are reviewed.

## Required MAP-02A Fixes

- Add exact deterministic fixture records.
- Add empty trip and empty selected-day acceptance.
- Add successful Georgia map-tap fixtures.
- Define Georgia/downloaded-area classification with example coordinates or a shared predicate.
- Define provider proof artifact expectations.
- Gate offline pack thresholds behind owner decisions where values are unknown.
- Replace vague clauses such as `where supported`, `when meaningful`, `usable address`, and `supported Georgia scope`.
- Add approved Russian copy terms for planned order, offline map viewing, and external handoff.

## MAP-03 Scope

MAP-03 may research provider candidates, terms, API key model, attribution, offline pack constraints, search/autocomplete constraints, and proof plan.

MAP-03 must not select a provider as accepted for production until MAP-02A and owner threshold decisions are available.

## MAP-04 Scope

MAP-04 may frame module boundaries, interfaces, point data model, route-order model, provider adapters, offline pack service boundaries, search adapter, and test seams.

MAP-04 must not be signed off for implementation until architecture review and MAP-02A are complete.

## Blocked

- MAP-05 implementation.
- MAP-06 native/offline spike acceptance.
- MAP-07 automation.
- MAP-08 QA.
- MAP-09 production security sign-off.

## Lead Result

Proceed with controlled discovery/design, not implementation.
