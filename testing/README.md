# Testing

This directory contains the project quality and testing system.

## Purpose

Keep quality requirements, test strategy, test inventory, and QA agent outputs separate from product analytics and implementation code.

## Documents

- `01_quality_requirements.md` - product quality requirements and quality gates.
- `02_test_strategy.md` - testing levels, ownership, tools, and execution rules.
- `03_test_inventory.md` - living catalog of required tests for the application.
- `04_code_quality_requirements.md` - code quality, TypeScript, error handling, and logging requirements.
- `05_project_structure_quality.md` - source layout and architectural boundary rules.
- `06_security_quality_requirements.md` - privacy, local data, permissions, dependencies, and integration security.
- `07_test_policy.md` - required checks by change type and regression policy.
- `08_release_quality_checklist.md` - release candidate validation checklist.
- `09_ci_quality_gates.md` - automated quality gates expected in CI.

## Scope

Testing work covers:

- functional acceptance tests for MVP requirements;
- mobile UI and accessibility checks;
- offline and resilience behavior;
- data safety and privacy checks;
- regression testing before releases;
- automated test infrastructure recommendations.
- code quality and project structure requirements;
- security, privacy, and dependency quality requirements;
- CI and release quality gates.

## Ownership

Testing agents are described in `agents/testing/`.

The Lead Agent coordinates priorities and accepts testing outputs.
