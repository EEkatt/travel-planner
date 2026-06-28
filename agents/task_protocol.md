# Agent Task Protocol

## Purpose

Define how tasks are created, assigned, executed, reviewed, and closed.

## Task States

- `open` - task is created but not started.
- `in_progress` - agent is working on it.
- `review` - agent submitted output and waits for Lead Agent review.
- `done` - Lead Agent accepted the result.
- `rejected` - Lead Agent rejected the result.

## Task File Naming

Use:

```text
TASK-YYYYMMDD-<number>-<short-name>.md
```

Example:

```text
TASK-20260628-001-market-research.md
```

## Task Template

```md
# Task: <Task Title>

Task ID: TASK-YYYYMMDD-001
Status: Open
Priority: High | Medium | Low
Created: YYYY-MM-DD
Created By: lead
Assigned To: <agent_id>

## Objective

Concrete objective.

## Editable Files

- `path/to/file.md`

## Read-Only Context

- `path/to/context.md`

## Do Not Edit

- `path/to/protected.md`

## Required Output

- expected file updates;
- report format;
- questions if blocked.

## Quality Bar

- criteria for acceptance.

## Stopping Condition

When the agent should stop.
```

## Work Report Template

When finished, the agent creates a report in `agent_workspace/reports/`:

```md
# Report: <Task Title>

Task ID: TASK-YYYYMMDD-001
From: <agent_id>
To: lead
Status: Ready For Review
Date: YYYY-MM-DD

## Summary

What was done.

## Changed Files

- `path/to/file.md`

## Findings

Key findings.

## Assumptions

Explicit assumptions.

## Open Questions

Questions that remain.

## Risks

Risks or weak assumptions.

## Recommendations

Actionable recommendations.
```

## State Transitions

1. Lead Agent creates task in `tasks/open/`.
2. Assigned agent moves or copies task to `tasks/in_progress/`.
3. Assigned agent updates allowed files.
4. Assigned agent creates report in `reports/`.
5. Assigned agent moves or copies task to `tasks/review/`.
6. Lead Agent reviews.
7. Lead Agent moves task to `tasks/done/` or `tasks/rejected/`.

## Rework

If Lead Agent marks a task as `Needs Rework`, it creates a new task or adds a rework section to the original task.

Rework request must include:

- what is wrong;
- what must be changed;
- what must remain unchanged;
- acceptance criteria.
