# Widget.ai

Widget.ai is an opt-in consumer research app for polls, surveys, and product feedback. Participation is optional. Eligible completed activities may award WidgetPoints under rules shown before a response is submitted.

This repository contains a working poll flow: a React app can create polls, accept one vote per browser identity, and show aggregate results. Polls and votes are stored by a Java/Spring API in PostgreSQL. The MCP adapter now loads active polls and accepts votes through an interactive ChatGPT-compatible UI resource. The MCP app still needs a remotely reachable, authenticated server connection before it can be added to ChatGPT. This is not a production-ready service or a published ChatGPT app.

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

The MCP adapter is available at `http://localhost:8080/mcp`. Its `show_widgetai` tool loads the latest active poll; the widget submits a selected response with `submit_widgetai_vote`. ChatGPT requires an HTTPS server URL that it can reach. Before exposing this local service, add authentication and authorization; the current MCP endpoint is unauthenticated.

## MVP boundaries

The first product milestone is polls, surveys, and product feedback. Advertising, paid ad views, location targeting, cash withdrawals, and real-money rewards are out of scope. Do not use prompt content for targeting. Users must be able to skip or close an activity. Never claim that Widget.ai is a native ChatGPT feature or that OpenAI has approved the app.

Polls are currently created by anyone using the web app. The browser stores a random voter ID in local storage to prevent repeat voting from that browser; this is not authentication and can be reset or bypassed. Add authenticated identity, consent and deletion flows, campaign administration, stronger anti-abuse controls, privacy retention, and auditable reward issuance before relying on real participant data or issuing points. No points are issued by the current poll flow.

## Security and publishing

The MCP endpoint is configured for local development and has no authentication yet. Spring AI documents that HTTP MCP transports expose callable tools without authentication by default; do not expose this service to the public internet. Add authentication/authorization, rate limits, privacy and retention controls, HTTPS deployment, and operational monitoring before deployment. ChatGPT private testing and public app submission are separate steps; publication requires a separate review and is not guaranteed.

See [docs/architecture.md](docs/architecture.md) and [docs/next-steps.md](docs/next-steps.md).

