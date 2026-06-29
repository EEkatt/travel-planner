# Security Quality Requirements

## Status

Draft

## Purpose

Define baseline security and privacy requirements for the MVP.

## Sensitive Data

Treat the following as sensitive:

- booking numbers;
- housing contacts;
- private notes;
- full addresses;
- full flight details;
- trip dates when combined with identifiable personal context;
- location history or saved map areas.

## Security Principles

- Collect and store only data needed for the MVP scenario.
- Keep personal trip data local unless a specific feature requires network transfer.
- Do not log sensitive data in plain text.
- Do not include real personal data in fixtures, screenshots, reports, or test snapshots.
- Degrade safely when permissions, network, notifications, or map services fail.

## Local Storage Requirements

| ID | Requirement | Gate |
| --- | --- | --- |
| SEC-001 | Local data model must distinguish user content from technical metadata. | Review |
| SEC-002 | Storage reads and writes must have data-loss tests for critical trip details. | Test |
| SEC-003 | Migration strategy must exist before changing persisted schema after real data exists. | Review/Test |
| SEC-004 | Failed writes must not silently discard user input. | Test |

## Permissions

- Request only permissions needed for the current user action.
- Explain denied or unavailable permissions through actionable UI.
- Do not make notification or location permissions mandatory for basic trip reading.

## External Integrations

- External maps handoff must pass only the minimum needed address or coordinates.
- Search/map provider responses must be treated as untrusted external input.
- Provider failures must not corrupt saved user data.
- API keys or secrets must not be committed to the repository.

## Dependency Security

- Dependencies must be added deliberately and reviewed for maintenance, platform support, and security exposure.
- Native dependencies require extra review because they affect mobile build and permissions.
- Dependency audit or equivalent review is required before release candidate.

## Security Test Ideas

- Verify logs do not expose sensitive fields during create, edit, delete, offline, and error flows.
- Verify fake sensitive data in test fixtures never appears in production logs.
- Verify denied permissions do not block reading saved trip details.
- Verify external maps action is unavailable when data is insufficient.
- Verify provider failure keeps saved trip data intact.
