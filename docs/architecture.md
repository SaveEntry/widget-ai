# Architecture

Widget.ai keeps product logic in the Spring backend. The web frontend and ChatGPT adapter are clients of the same service layer; ChatGPT-specific MCP types should stay in `platform-adapters/chatgpt`.

```text
React web client ── REST/OpenAPI ─┐
                                 ├── Spring Boot service ── PostgreSQL
ChatGPT ── MCP Streamable HTTP ──┘
```

## First domain model

The first Flyway migration lays out users, platform connections, sponsors, campaigns, activities, interactions, responses, and points transactions. Activity types are constrained to `POLL`, `SURVEY`, and `PRODUCT_FEEDBACK`. A points transaction is an immutable ledger entry; future balance views should be derived from ledger entries rather than edited in place.

No sample user identity, real campaign, or reward is seeded. This avoids making a demo flow look like a production identity or payout. The initial MCP tool returns a clearly labeled sample activity for checking the widget shell only.

## ChatGPT interface

The Spring AI MCP server uses Streamable HTTP. Its `show_widgetai` tool references a versioned UI resource. The widget UI is served from the backend's static resources and can call the MCP host's `window.openai` bridge when available. The tool is a preview only; it does not submit answers, persist survey data, or issue points.

The MCP server transport itself does not authenticate requests. For local development, bind the backend to localhost. Before any remote deployment, protect the MCP and REST endpoints with an explicit identity and authorization layer.

