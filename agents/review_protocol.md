# Agent Review Protocol

## Purpose

Define how Lead Agent reviews specialist agent outputs.

## Review Statuses

- `Accepted` - result can be used.
- `Needs Rework` - result needs specific revisions.
- `Rejected` - result violates scope or does not answer the task.

## Review Checklist

Lead Agent checks:

- Did the agent stay within editable files?
- Did the agent use read-only context correctly?
- Did the agent avoid protected files?
- Did the result answer the objective?
- Are facts separated from assumptions?
- Are sources provided when research was required?
- Are open questions explicit?
- Are recommendations actionable?
- Is MVP scope preserved?
- Is the output consistent with project principles?

## Review File Location

Reviews are stored in:

```text
agent_workspace/reports/
```

## Review File Naming

Use:

```text
REVIEW-<task_id>-by-lead.md
```

## Review Template

```md
# Review: <Task Title>

Task ID: <task_id>
Reviewer: lead
Status: Accepted | Needs Rework | Rejected
Date: YYYY-MM-DD

## Summary

Short review summary.

## Scope Check

- Editable files respected: Yes/No
- Protected files untouched: Yes/No
- Required output provided: Yes/No

## Findings

Review findings.

## Required Rework

Only if status is `Needs Rework`.

## Decision

What happens next.
```

## Rework Quality

Rework requests must be specific. Lead Agent must not send vague feedback like "improve this" without examples or acceptance criteria.
