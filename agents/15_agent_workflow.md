# Agent Workflow

## Status

Draft

## Goal

Describe project agents, their responsibilities, inputs, outputs, and interaction order.

All agent prompts and agent skills must be written in English.

The only exception: Lead Agent communicates with the project owner in Russian by default, unless the owner asks otherwise.

## Agents

### Lead Agent

Main role:

- communicates with the project owner in Russian;
- launches other agents when a task requires delegation;
- assigns narrow tasks with explicit editable files;
- reviews agent outputs against the task and Definition of Done;
- asks agents to rework their output when it is incomplete, vague, unsupported, or inconsistent;
- collects agent results into a clear decision package for the owner;
- synchronizes `product/`, `research/`, `requirements/`, `architecture/`, `docs/`, and `specs/`.

Decision authority:

- Lead Agent can recommend and coordinate.
- The project owner makes final product and architecture decisions.
- Lead Agent must escalate unresolved tradeoffs to the owner.

### Product Analyst Agent

Main role:

- clarifies problem, audience, value proposition, MVP, personas, user journey, and user stories.

### Market Research Agent

Main role:

- researches competitors;
- fills the feature matrix;
- separates facts from assumptions;
- highlights differentiation opportunities.

### UX Analyst Agent

Main role:

- describes user journeys;
- proposes screen structure;
- identifies UX risks.

### Requirements Analyst Agent

Main role:

- converts product ideas and scenarios into testable requirements;
- maintains MVP scope and requirement priorities.

### Technical Analyst Agent

Main role:

- analyzes technical options;
- prepares recommendations for architecture decisions;
- compares mobile stack, maps, storage, notifications, offline mode, and future LLM integration.

### Mobile Expo Engineer Agent

Main role:

- implements and validates the Expo/React Native mobile foundation;
- runs bounded implementation spikes for navigation, storage, test harness integration, and development builds;
- keeps `app/mobile` runnable after every change;
- reports exact commands, results, risks, and follow-up decisions.

### Map Provider Engineer Agent

Main role:

- validates map SDKs and tile/style providers for the MVP;
- proves or rejects offline prepared-area map downloads on iOS and Android;
- checks attribution, API key model, pricing, offline limits, storage size, and Expo development build constraints;
- keeps map/search provider code behind adapters and does not expand into routing or optimization.

### Map Feature Review Rule

For the map feature, no workstream is accepted without independent review:

- Product scope: reviewed by Requirements Analyst or Lead Agent.
- UX flows: reviewed by QA Engineer.
- Requirements: reviewed by Quality Lead.
- Provider decisions: reviewed by Technical Analyst and Security Reviewer.
- Architecture changes: reviewed by Architecture Critic or Code Quality Reviewer.
- Implementation: reviewed by Code Quality Reviewer and tested by QA Engineer.
- Test changes: reviewed by Quality Lead.
- Security: accepted before any production provider/API-key decision.

## Delegation Protocol

Lead Agent can launch sub-agents for well-scoped tasks.

Every delegated task must include:

- agent role;
- concrete objective;
- editable files;
- read-only context files;
- expected output format;
- quality bar;
- deadline or stopping condition.

Lead Agent must not ask two agents to edit the same file at the same time unless the task is explicitly read-only.

## Review Protocol

When an agent returns a result, Lead Agent checks:

- Did the agent edit only allowed files?
- Did the agent answer the assigned task?
- Are facts separated from assumptions?
- Are sources provided when research was required?
- Are open questions explicit?
- Are recommendations actionable?
- Are changes consistent with project vision and MVP?

Lead Agent can respond with:

- `Accepted` - result is good enough to integrate.
- `Needs Rework` - agent must revise specific issues.
- `Rejected` - result is not useful or violates constraints.

## Rework Protocol

When requesting rework, Lead Agent must provide:

- what is wrong;
- what files to revise;
- what must remain unchanged;
- what exact output is expected.

## Interaction Order

1. Product Analyst clarifies vision and product brief.
2. Market Research Agent researches competitors.
3. UX Analyst describes user journey and key screens.
4. Requirements Analyst creates requirements and MVP scope.
5. Technical Analyst prepares technical options.
6. Architecture Agent and Architecture Critic refine architecture and implementation slices.
7. Mobile Expo Engineer runs bounded app foundation spikes.
8. Map Provider Engineer runs bounded map/search provider spikes.
9. Quality Lead, Test Automation Engineer, QA Engineer, Code Quality Reviewer, Security Reviewer, and Release QA cover quality work according to task scope.
10. Lead Agent collects results and presents decisions to the project owner.

## Output Format

```text
Summary:

Changed Files:

Findings:

Open Questions:

Risks:

Recommendations:
```
