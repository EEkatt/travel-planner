# Map Feature Lead Orchestration

Date: 2026-07-04
Owner: lead
Status: Ready for MAP-00 and MAP-01 execution

## Objective

Orchestrate the map feature workstream for the Georgia MVP so each specialist agent works on a bounded part of the feature and every output is independently reviewed before implementation expands.

## Preserved Product Decisions

- MVP country scope: Georgia.
- Offline target: whole-country Georgia map available before the trip.
- Fallback scope such as regions or cities is allowed only after owner approval.
- Point states:
  - point not assigned to any route day: neutral gray;
  - point assigned to a route day: red.
- Route ordering is edited through place cards below the map, not by dragging map pins.
- When a day is selected, the map shows numbered route points and a route line; reordering cards updates numbers and route line order.
- Search focuses on concrete places and landmarks, for example Narikala Fortress and Ali and Nino.
- Search suggestions/autocomplete are desired only with a production provider whose terms allow that usage.
- The app map should reduce need for external maps during travel.
- Yandex Maps handoff remains a fallback for a selected point.
- MVP must not promise offline search, offline geocoding, offline turn-by-turn navigation, traffic, route optimization, or full native/offline proof until provider and device evidence exist.

## Execution Plan

| ID | Workstream | Primary Agent | Reviewers | Output | Status |
| --- | --- | --- | --- | --- | --- |
| MAP-00-SCOPE | Product scope and MVP boundaries | product_analyst | requirements_analyst, lead | `agent_workspace/reports/MAP-00-SCOPE-20260704.md` | Start now |
| MAP-01-UX | UX model and screen behavior | ux_analyst | qa_engineer, product_analyst | `agent_workspace/reports/MAP-01-UX-20260704.md` | Start now |
| MAP-02-REQ | Detailed map requirements and acceptance criteria | requirements_analyst | quality_lead, lead | `agent_workspace/reports/MAP-02-REQUIREMENTS-20260704.md` | Blocked by MAP-00 and MAP-01 |
| MAP-03-PROVIDER | Map/search/offline provider decision | map_provider_engineer | technical_analyst, security_reviewer | `agent_workspace/reports/MAP-03-PROVIDER-20260704.md` | Blocked by accepted scope and UX |
| MAP-04-ARCH | Architecture and data boundaries | architecture_agent | architecture_critic, code_quality_reviewer | `agent_workspace/reports/MAP-04-ARCHITECTURE-20260704.md` | Blocked by accepted requirements |
| MAP-05-WEB-PROTOTYPE | Web prototype behavior update | mobile_expo_engineer | qa_engineer, code_quality_reviewer | implementation changes and report | Blocked by accepted behavior and edit approval |
| MAP-06-NATIVE-SPIKE | Native/offline map spike | map_provider_engineer, mobile_expo_engineer | technical_analyst, security_reviewer, qa_engineer | spike report and evidence | Blocked by provider terms, dev build prerequisites, and owner approval |
| MAP-07-TESTS | Test strategy and automated coverage | test_automation_engineer | quality_lead | `agent_workspace/reports/MAP-07-TESTS-20260704.md` | Blocked by stable interfaces/prototype |
| MAP-08-QA | QA validation | qa_engineer | quality_lead, lead | `agent_workspace/reports/MAP-08-QA-20260704.md` | Blocked by implementation |
| MAP-09-SECURITY | Privacy and provider-key review | security_reviewer | lead | `agent_workspace/reports/MAP-09-SECURITY-20260704.md` | Blocked by provider/API-key/offline choices |

## Start Instructions

Start only MAP-00-SCOPE and MAP-01-UX now. These are report-only tasks and must not edit application code.

MAP-00-SCOPE must produce a crisp product boundary for the map feature: what is in MVP, what is explicitly out, what is blocked on provider proof, and what owner decisions remain.

MAP-01-UX must produce the practical mobile interaction model: map filters, add point flow, search flow, day selection, numbered points, reorderable cards, empty/error/offline states, and Yandex Maps fallback.

## Review Rules

- Every output must be reviewed by at least one agent other than the author.
- The lead must reject outputs that expand MVP beyond Georgia without owner approval.
- The lead must reject outputs that treat public Nominatim as a production autocomplete solution.
- The lead must reject outputs that claim whole-country offline Georgia proof without measured provider/device evidence.
- The lead must reject implementation plans that make external maps the primary map experience.
- The lead must ensure requirements, provider feasibility, UX, implementation, and QA remain separate until their dependencies are met.

## Pass Criteria

- Georgia scope is preserved.
- Gray no-day points and red route points are preserved.
- Route ordering via cards is preserved.
- Day mode clearly updates point numbering and route line order.
- Search has production-provider caveats and user-visible failure states.
- Offline behavior is framed as a provider/device proof requirement, not as an already validated capability.
- Yandex Maps handoff is kept as fallback.
- QA/test criteria are included before engineering implementation begins.

## Rework Triggers

- Expands MVP to multiple countries or global offline maps.
- Promises offline routing, search, geocoding, traffic, or optimization without proof.
- Stores provider-specific raw responses in domain models.
- Omits no-network, no-results, no-coordinate, provider-failure, or outside-area states.
- Uses real API keys, private fixtures, or location logs in reports.
- Starts code implementation before scope and UX are reviewed.

## Immediate Tasks

- Create `TASK-20260704-019-map-00-scope.md` for product_analyst.
- Create `TASK-20260704-020-map-01-ux.md` for ux_analyst.
- Run both tasks in parallel.
- Review MAP-00 with requirements_analyst and lead.
- Review MAP-01 with qa_engineer and product_analyst.
