# Zurto

AI-powered task management system with component library and VS Code extension.

## Structure

```
Zurto/
├── packages/
│   ├── api/          # Backend API (Node.js/Express)
│   ├── web/          # Frontend Dashboard (React/Vite)
│   ├── ui/           # Component Library (zurto-ui on npm)
│   └── extension/    # VS Code Extension (zurto-copilot)
├── config/           # Caddy & shared configurations
├── docker/           # Docker-related files
└── docker-compose.yml
```

## Official Domains

- **https://zurto.app** - Main website
- **https://api.zurto.app** - API endpoints
- **https://ui.zurto.app** - UI documentation

## Quick Start

```bash
# Install all dependencies
npm install

# Start development
npm run dev:api    # Start API server
npm run dev:web    # Start web dashboard
npm run dev:ui     # Start UI docs

# Docker (production)
npm run docker:up
```

## Packages

| Package            | Description        | npm                                                                                        |
| ------------------ | ------------------ | ------------------------------------------------------------------------------------------ |
| `@zurto/api`       | Backend API server | -                                                                                          |
| `@zurto/web`       | React dashboard    | -                                                                                          |
| `@zurto/ui`        | Component library  | [zurto-ui](https://www.npmjs.com/package/zurto-ui)                                         |
| `@zurto/extension` | VS Code extension  | [zurto-copilot](https://marketplace.visualstudio.com/items?itemName=ZurtoAi.zurto-copilot) |

## Development

This is an npm workspaces monorepo. All packages share dependencies from the root.

```bash
# Run command in specific workspace
npm run build --workspace=@zurto/ui

# Run command in all workspaces
npm run build --workspaces

# Add dependency to specific package
npm install lodash --workspace=@zurto/api
```

## License

MIT © ZurtoAi
