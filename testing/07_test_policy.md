# Test Policy

## Status

Draft

## Purpose

Define which tests are expected for different kinds of changes.

## General Rule

Every meaningful behavior change must be covered by either an automated test, a documented manual check, or an explicit risk acceptance by the Lead Agent.

## Required Tests By Change Type

| Change type | Required checks |
| --- | --- |
| Domain logic | Unit tests for normal, boundary, and invalid states. |
| Date/current-day/next-item logic | Unit tests with fixed dates and time zones. |
| Persistence/storage | Integration tests for create, update, delete, reopen, and failed write behavior. |
| Offline behavior | Integration or E2E tests with simulated offline state. |
| Screen UI | Component tests for normal, empty, error, loading, and offline states where practical. |
| User journey | E2E or manual acceptance test mapped to requirement. |
| External provider integration | Contract-style tests with mocked provider responses and failures. |
| Security/privacy change | Privacy/logging review and targeted negative tests. |
| Dependency change | Build check, dependency review, and smoke test. |

## Regression Policy

- Must requirements need regression coverage before MVP release candidate.
- High-risk flows require repeatable test cases even if automation is not ready.
- Manual regression evidence must include date, platform, build, scenario, and result.
- Bugs fixed after QA must include a regression test or documented reason why automation is not practical.

## Test Data Policy

- Use fake but realistic data.
- Include incomplete records.
- Include offline and provider failure cases.
- Do not use real bookings, real contacts, private addresses, private notes, or personal travel plans.

## Severity Levels

| Severity | Meaning |
| --- | --- |
| Critical | Data loss, privacy leak, crash on core journey, or inability to open saved trip details. |
| High | Must requirement blocked or major offline/resilience failure. |
| Medium | Important scenario degraded but workaround exists. |
| Low | Minor UI, copy, or edge-case issue. |

## Exit Criteria For Feature QA

- Acceptance criteria are covered.
- Main happy path passes.
- At least one incomplete-data case is checked when relevant.
- Error or offline state is checked when relevant.
- No Critical or High issue remains without explicit acceptance.
