# Review: MapLibre Offline Map Spike

Task ID: TASK-20260629-008
Reviewer: lead
Status: Accepted
Date: 2026-06-29

## Summary

Accepted.

The report answers the core Gate 00 question: MapLibre React Native is a reasonable first spike path for offline prepared-area maps on iOS and Android, but broad map implementation must remain blocked until native builds, network-off rendering, saved point rendering, provider license, offline limits, and storage size are proven.

## Strengths

- Correctly separates map renderer choice from tile/style provider choice.
- Correctly identifies that Expo Go is not sufficient for this requirement.
- Treats provider licensing, offline cache limits, attribution, and API key model as release-blocking.
- Keeps offline routing out of MVP unless separately proven.
- Provides concrete implementation spike commands and acceptance criteria.

## Required Follow-Up

- Run a bounded MapLibre implementation spike in `app/mobile`.
- Choose the first test region and provider candidate before broad map UX work.
- Record final provider decision only after the spike proves offline pack behavior.

## Lead Decision

Proceed with the MapLibre spike under the conditions documented in the report.
