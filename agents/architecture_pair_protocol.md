# Architecture Pair Protocol

## Purpose

Define how Architecture Agent and Architecture Critic Agent work together.

## Agents

- `architecture_agent`
- `architecture_critic`
- `lead`

## Language

Internal agent work is in English.

Lead Agent summarizes the final result to the project owner in Russian.

## Max Iterations

The pair must stop after at most 10 iterations.

One iteration is:

1. Architecture Agent produces or revises proposal.
2. Architecture Critic reviews it.
3. Lead Agent decides whether another iteration is needed.

## Stop Conditions

Stop before 10 iterations if:

- Critic verdict is `Accepted`;
- remaining issues are non-blocking;
- Lead Agent decides the architecture is good enough for implementation planning;
- owner input is required.

## File-Based Communication

Pair session files live in:

```text
agent_workspace/pair_sessions/architecture/
```

Use file names:

```text
ITER-01-architecture-proposal.md
ITER-01-critic-review.md
ITER-02-architecture-proposal.md
ITER-02-critic-review.md
...
```

## Architecture Agent Writes

- `architecture/11_architecture.md`
- `architecture/12_decisions.md`
- `architecture/13_implementation_slices.md`
- `architecture/14_architecture_review_log.md`
- pair proposal files

## Architecture Critic Writes

- `architecture/14_architecture_review_log.md`
- pair review files

## Lead Agent Responsibilities

- launch agents;
- pass Architect output to Critic;
- pass Critic review back to Architect;
- stop at max 10 iterations;
- summarize final architecture to owner in Russian;
- create follow-up tasks for implementation.

## Quality Bar

Final architecture must:

- preserve MVP boundaries;
- explain how the app works;
- define modules and data flow;
- define implementation slices;
- define tests per slice;
- isolate provider-specific map/search/storage details;
- keep backend, sync, LLM, collaboration, booking, route optimization, and live flight tracking outside MVP.
