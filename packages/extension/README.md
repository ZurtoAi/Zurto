# Zurto VS Code Extension

Private VS Code extension for the Zurto ecosystem.

## Features

- **Copilot Bridge** - HTTP server on port 8787 for AI context injection
- **AI Questionnaires** - Interactive questionnaire system for AI-assisted planning
- **Project Management** - Create, sync, and manage Zurto projects
- **Task Tracking** - View and update tasks from VS Code
- **Context Injection** - Automatically provide workspace context to AI tools

## Installation

This is a private extension. Install from VSIX:

```bash
code --install-extension zurto-copilot-0.1.0.vsix
```

## Configuration

| Setting                  | Default                 | Description                     |
| ------------------------ | ----------------------- | ------------------------------- |
| `zurto.bridgePort`       | `8787`                  | Copilot Bridge HTTP server port |
| `zurto.apiUrl`           | `https://api.zurto.app` | Zurto API base URL              |
| `zurto.teamToken`        | `""`                    | Team authentication token       |
| `zurto.autoStartBridge`  | `true`                  | Auto-start bridge on activation |
| `zurto.contextInjection` | `true`                  | Enable context injection        |
| `zurto.logLevel`         | `info`                  | Logging level                   |

## Commands

| Command                       | Keybinding     | Description                  |
| ----------------------------- | -------------- | ---------------------------- |
| `Zurto: Start Copilot Bridge` | -              | Start the HTTP bridge server |
| `Zurto: Stop Copilot Bridge`  | -              | Stop the bridge server       |
| `Zurto: Open Questionnaire`   | `Ctrl+Shift+Q` | Open questionnaire panel     |
| `Zurto: Open Dashboard`       | `Ctrl+Shift+Z` | Open Zurto dashboard         |
| `Zurto: Create New Project`   | -              | Create a new project         |
| `Zurto: Sync Projects`        | -              | Sync with Zurto backend      |

## Copilot Bridge API

The bridge server exposes these endpoints:

```
GET  /health           - Health check
GET  /context          - Get current workspace context
POST /inject           - Inject context into AI
POST /questionnaire    - Submit questionnaire response
GET  /projects         - List projects
POST /tasks            - Create/update tasks
```

## Development

```bash
# Install dependencies
npm install

# Compile
npm run compile

# Watch mode
npm run watch

# Package
npm run package
```

## License

Private - Zurto Team Only
