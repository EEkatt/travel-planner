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

## Peer Tasking

Architecture Agent and Architecture Critic Agent may create tasks for each other through files.

They must not execute peer-created tasks until Lead Agent reviews and approves them.

Task queues:

```text
agent_workspace/pair_sessions/architecture/tasks/proposed/
agent_workspace/pair_sessions/architecture/tasks/approved/
agent_workspace/pair_sessions/architecture/tasks/done/
agent_workspace/pair_sessions/architecture/tasks/rejected/
```

Messages:

```text
agent_workspace/pair_sessions/architecture/messages/
```

Lead reviews:

```text
agent_workspace/pair_sessions/architecture/reviews/
```

## Peer Task File Naming

Use:

```text
ITER-<NN>-TASK-from-<sender>-to-<receiver>-<short-topic>.md
```

Example:

```text
ITER-01-TASK-from-critic-to-architecture_agent-storage-boundary.md
```

## Peer Task Template

```md
# Peer Task: <Short Title>

Iteration: <NN>
From: architecture_agent | architecture_critic
To: architecture_agent | architecture_critic
Status: Proposed
Created: YYYY-MM-DD

## Context

Why this task is needed.

## Request

Concrete request.

## Input Files

- `path/to/file.md`

## Expected Output

- expected file or section updates;
- expected answer format.

## Acceptance Criteria

- specific criteria.

## Scope Boundaries

- what must not change;
- what must remain outside MVP.
```

## Lead Review Of Peer Tasks

Lead Agent reviews proposed peer tasks before execution.

Lead can:

- approve as-is by moving the task to `tasks/approved/`;
- edit the task and then approve it;
- reject it by moving the task to `tasks/rejected/`;
- split it into smaller tasks.

Lead review must check:

- task is narrow enough;
- task does not expand MVP;
- editable files are explicit;
- expected output is testable;
- task does not conflict with current iteration.

## Execution Rule

Agents only execute:

- Lead-created tasks;
- peer-created tasks that are in `tasks/approved/`.

Agents may create proposed tasks freely, but proposed tasks are not executable.

## Architecture Agent Writes

- `architecture/11_architecture.md`
- `architecture/12_decisions.md`
- `architecture/13_implementation_slices.md`
- `architecture/14_architecture_review_log.md`
- pair proposal files
- proposed peer task files for Architecture Critic Agent

## Architecture Critic Writes

- `architecture/14_architecture_review_log.md`
- pair review files
- proposed peer task files for Architecture Agent

## Lead Agent Responsibilities

- launch agents;
- pass Architect output to Critic;
- pass Critic review back to Architect;
- review, edit, approve, or reject peer-created tasks;
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
