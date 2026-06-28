# Agent Registry

## Purpose

This file defines the initial agent system for the project.

All agent instructions, prompts, task briefs, and internal reports must be written in English.

Lead Agent communicates with the project owner in Russian by default.

## Agents

| Agent ID | Name | Type | Main Responsibility | Prompt | Instruction |
| --- | --- | --- | --- | --- | --- |
| `lead` | Lead Agent | Coordinator | Coordinate agents, review outputs, communicate with owner | `prompts/agents/lead_agent.prompt.md` | `agents/analytics/lead_agent.md` |
| `market_research` | Market Research Agent | Specialist | Research competitors and feature matrix | `prompts/agents/market_research_agent.prompt.md` | `agents/analytics/market_research_agent.md` |
| `product_analyst` | Product Analyst Agent | Specialist | Product clarity, MVP, personas, journey | `prompts/agents/product_analyst.prompt.md` | `agents/analytics/product_analyst.md` |
| `ux_analyst` | UX Analyst Agent | Specialist | User journeys, screens, UX risks | `prompts/agents/ux_analyst.prompt.md` | `agents/analytics/ux_analyst.md` |
| `requirements_analyst` | Requirements Analyst Agent | Specialist | Requirements, acceptance criteria, backlog | `prompts/agents/requirements_analyst.prompt.md` | `agents/analytics/requirements_analyst.md` |
| `technical_analyst` | Technical Analyst Agent | Specialist | Technical options and architecture recommendations | `prompts/agents/technical_analyst.prompt.md` | `agents/analytics/technical_analyst.md` |

## Authority Model

- Project owner makes final product and architecture decisions.
- Lead Agent coordinates work and proposes decisions.
- Specialist agents produce analysis and document updates within their allowed scope.
- Specialist agents may ask questions to other agents, but Lead Agent must review and route decisions.

## Workspace

Each agent has:

- inbox: `agent_workspace/inbox/<agent_id>/`
- outbox: `agent_workspace/outbox/<agent_id>/`

Task state folders:

- `agent_workspace/tasks/open/`
- `agent_workspace/tasks/in_progress/`
- `agent_workspace/tasks/review/`
- `agent_workspace/tasks/done/`
- `agent_workspace/tasks/rejected/`

Shared outputs:

- `agent_workspace/reports/`
- `agent_workspace/decisions/`
- `agent_workspace/messages/`
