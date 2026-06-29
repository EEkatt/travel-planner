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
| `architecture_agent` | Architecture Agent | Specialist | Propose MVP application architecture and implementation slices | `prompts/agents/architecture_agent.prompt.md` | `agents/architecture/architecture_agent.md` |
| `architecture_critic` | Architecture Critic Agent | Reviewer | Critique architecture proposals and force revisions | `prompts/agents/architecture_critic.prompt.md` | `agents/architecture/architecture_critic.md` |
| `quality_lead` | Quality Lead Agent | Coordinator | Own quality gates, testing strategy, risk-based QA priorities, and QA task decomposition | `prompts/agents/quality_lead.prompt.md` | `agents/testing/quality_lead.md` |
| `qa_engineer` | QA Engineer Agent | Specialist | Design and execute manual, exploratory, and acceptance tests | `prompts/agents/qa_engineer.prompt.md` | `agents/testing/qa_engineer.md` |
| `test_automation_engineer` | Test Automation Engineer Agent | Specialist | Design and implement automated test infrastructure and regression checks | `prompts/agents/test_automation_engineer.prompt.md` | `agents/testing/test_automation_engineer.md` |
| `code_quality_reviewer` | Code Quality Reviewer Agent | Reviewer | Review maintainability, structure, TypeScript quality, and testability | `prompts/agents/code_quality_reviewer.prompt.md` | `agents/testing/code_quality_reviewer.md` |
| `security_reviewer` | Security Reviewer Agent | Reviewer | Review privacy, security, logging, permissions, dependencies, and local data risks | `prompts/agents/security_reviewer.prompt.md` | `agents/testing/security_reviewer.md` |
| `release_qa` | Release QA Agent | Reviewer | Validate release candidates, smoke tests, regression evidence, and known issues | `prompts/agents/release_qa.prompt.md` | `agents/testing/release_qa.md` |

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
