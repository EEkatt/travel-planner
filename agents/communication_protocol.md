# Agent Communication Protocol

## Purpose

Define how agents communicate with each other through files.

## Language

- Internal agent communication must be in English.
- Owner-facing Lead Agent summaries must be in Russian.

## Communication Rules

- Agents communicate through task files, message files, and report files.
- Agents must not silently change another agent's scope.
- Agents must not edit files outside their assigned editable files.
- If an agent needs input from another agent, it writes a question message.
- If a decision affects product scope, architecture, or process, Lead Agent must review it.

## Message Location

Messages can be placed in:

- `agent_workspace/messages/`
- `agent_workspace/inbox/<target_agent_id>/`

## Message File Naming

Use:

```text
YYYYMMDD-HHMM-from-<sender>-to-<receiver>-<short-topic>.md
```

Example:

```text
20260628-1430-from-lead-to-market_research-competitor-scope.md
```

## Message Template

```md
# Message: <Short Title>

From: <agent_id>
To: <agent_id>
Date: YYYY-MM-DD
Status: Open
Related Task: <task_id or none>

## Context

Why this message exists.

## Question Or Request

What the sender needs.

## Expected Response

What kind of answer is expected.

## Deadline Or Stopping Condition

When the target agent should stop or respond.
```

## Response Template

```md
# Response: <Short Title>

From: <agent_id>
To: <agent_id>
Date: YYYY-MM-DD
Status: Answered
Related Message: <message filename>

## Answer

The answer.

## Assumptions

Explicit assumptions.

## Open Questions

Remaining questions.

## Recommended Next Step

Actionable next step.
```

## Escalation Rules

Escalate to Lead Agent when:

- two agents disagree;
- a decision changes MVP scope;
- a decision affects architecture;
- a task requires editing files outside the current agent scope;
- the agent lacks enough information to proceed.
