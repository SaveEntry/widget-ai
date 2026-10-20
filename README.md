# Widget.ai

Widget.ai is an opt-in consumer research app for polls, surveys, and product feedback. Participation is optional. Eligible completed activities may award WidgetPoints under rules shown before a response is submitted.

This repository is the initial monorepo scaffold. It includes a React widget, a Java/Spring backend with PostgreSQL and Flyway, and an MCP adapter for ChatGPT. It is a development starting point, not a production-ready service or a published ChatGPT app.

## Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS
- Backend: Java 21, Spring Boot, Maven, Spring Data JPA
- Database: PostgreSQL, Flyway migrations
- ChatGPT connection: Spring AI MCP server using Streamable HTTP
- API reference: OpenAPI and Swagger UI
- Local database: Docker Compose

## Repository layout

```text
frontend/                  React app and ChatGPT widget UI
backend/                   Spring Boot API, data model, migrations
platform-adapters/chatgpt/  ChatGPT MCP tools and UI resource
docker/                    Container build files
docs/                      Architecture and development notes
```

## Local development

Requirements: Java 21, Maven, Node.js/npm, and Docker Desktop.

1. Copy `.env.example` to `.env` and change the local-only database password if needed.
2. Start PostgreSQL: `docker compose up -d postgres`.
3. Start the backend: `mvn -f backend/pom.xml spring-boot:run`.
4. Start the frontend in another terminal: `npm --prefix frontend install` then `npm --prefix frontend run dev`.
5. Open `http://localhost:5173`. Swagger UI is at `http://localhost:8080/swagger-ui.html`; health is at `http://localhost:8080/actuator/health`.

The initial MCP adapter is available at `http://localhost:8080/mcp`. The MCP `show_widgetai` tool returns an activity preview and links it to the versioned `ui://widget-ai/activity-v1.html` interface. Configure a supported private MCP app connection to test it inside ChatGPT.

## MVP boundaries

The first product milestone is polls, surveys, and product feedback. Advertising, paid ad views, location targeting, cash withdrawals, and real-money rewards are out of scope. Do not use prompt content for targeting. Users must be able to skip or close an activity. Never claim that Widget.ai is a native ChatGPT feature or that OpenAI has approved the app.

The schema is groundwork only. Authentication, consent records, campaign administration, server-side response validation, anti-abuse controls, privacy retention, and auditable reward issuance still need implementation before real participant data or points are accepted.

## Security and publishing

The MCP endpoint is configured for local development and has no authentication yet. Spring AI documents that HTTP MCP transports expose callable tools without authentication by default; do not expose this service to the public internet. Add authentication/authorization, rate limits, privacy and retention controls, HTTPS deployment, and operational monitoring before deployment. ChatGPT private testing and public app submission are separate steps; publication requires a separate review and is not guaranteed.

See [docs/architecture.md](docs/architecture.md) and [docs/next-steps.md](docs/next-steps.md).

