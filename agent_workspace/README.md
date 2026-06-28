# Agent Workspace

## Purpose

This directory is the file-based workspace for the multi-agent system.

Agents communicate through tasks, messages, reports, and reviews.

## Structure

- `inbox/` - incoming messages or tasks for each agent.
- `outbox/` - outgoing messages from each agent.
- `messages/` - shared cross-agent messages.
- `tasks/open/` - tasks not started yet.
- `tasks/in_progress/` - tasks currently in progress.
- `tasks/review/` - tasks waiting for Lead Agent review.
- `tasks/done/` - accepted completed tasks.
- `tasks/rejected/` - rejected tasks.
- `reports/` - agent reports and Lead Agent reviews.
- `decisions/` - proposed decisions before they are copied to stable decision docs.

## Rules

- Internal files are written in English.
- Lead Agent summarizes results to the owner in Russian.
- Do not edit another agent's active task unless Lead Agent asks for it.
- Do not overwrite reports. Create a new report version if needed.
