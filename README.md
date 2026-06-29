# PROJECT

Рабочая директория для разработки приложения и последующей настройки мультиагентной системы разработки.

## Структура проекта

- `product/` - vision, product brief, personas, user journey.
- `research/` - market research и feature matrix конкурентов.
- `requirements/` - user stories, use cases, требования, MVP и backlog.
- `architecture/` - архитектура и архитектурные решения.
- `testing/` - требования к качеству, стратегия тестирования, инженерная зрелость, security, CI gates и каталог тестов.
- `project/` - roadmap и проектное планирование.
- `process/` - принципы, Definition of Done, change log и glossary.
- `agents/` - описание агентской системы и инструкции агентов.
- `agent_workspace/` - файловая рабочая зона для задач, сообщений, отчетов и ревью агентов.
- `docs/` - исходные и стабильные проектные документы раннего этапа.
- `specs/` - спецификации MVP и разработки.
- `prompts/` - системные и агентские промпты.
- `skills/` - локальные скиллы проекта.
- `app/` - исходный код приложения, когда начнется реализация.

## Ключевые документы

- `product/00_vision.md` - долгосрочная цель проекта.
- `product/01_product_brief.md` - описание продукта, ценности и аудитории.
- `research/02_market_research.md` - исследование рынка.
- `requirements/08_mvp.md` - состав MVP.
- `architecture/11_architecture.md` - архитектурная рамка.
- `architecture/15_security_and_resilience.md` - базовые правила безопасности и устойчивости MVP.
- `testing/01_quality_requirements.md` - требования к качеству и quality gates.
- `testing/02_test_strategy.md` - стратегия тестирования MVP.
- `testing/03_test_inventory.md` - каталог нужных тестов приложения.
- `testing/04_code_quality_requirements.md` - требования к качеству кода.
- `testing/05_project_structure_quality.md` - требования к структуре проекта.
- `testing/06_security_quality_requirements.md` - требования к безопасности и приватности.
- `testing/07_test_policy.md` - политика тестирования изменений.
- `testing/08_release_quality_checklist.md` - релизный чеклист качества.
- `testing/09_ci_quality_gates.md` - CI quality gates.
- `agents/15_agent_workflow.md` - workflow агентов.
- `process/glossary.md` - словарь терминов.

## Ближайший порядок работы

1. Запустить Market Research Agent на `research/`.
2. Запустить Product Analyst Agent на `product/` и `requirements/`.
3. Уточнить MVP в `requirements/08_mvp.md`.
4. Запустить Technical Analyst Agent на `architecture/`.
5. Синхронизировать стабильные решения в `docs/` и `specs/`.
