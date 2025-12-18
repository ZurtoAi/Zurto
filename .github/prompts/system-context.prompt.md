# System Context: Zurto Architecture

> Overview of the Zurto system architecture and key projects

---

## Primary Projects

### Zurto/ (Main API + Agent System)

- **Language**: TypeScript/Node.js
- **Port**: 3002 (via docker-compose)
- **Key Files**: `src/api/task-api.ts`, `src/core/`, `src/agents/`
- **Features**: AI chat, memory system, task management, Docker control
- **Container**: `zurto-api`
- **Rebuild**: `docker compose up -d --build zurto-api`

### Discord-Website/ (Web Dashboard)

- **Language**: React/TypeScript
- **Contains**: Login, dashboard, project management UI
- **NOTE**: Web-facing only, use Zurto API for agent work

### Shinrai.lol-V2/ (Main Website)

- **GitHub**: `Qeewt/Shinrai.lol-V2`
- **Language**: React/TypeScript/Vite
- **Status**: Production portfolio site

### Portfolio/ (Personal Portfolio)

- **Type**: React/Vite project
- **Status**: Development

---

## Key Services

### Service Status Check

```
GET /api/system/services  → See all running services
GET /health               → Quick health check
GET /api/system/health    → Detailed health
```

### Container Management

```
GET /api/docker/containers        → List all
POST /api/docker/container/zurto-api/logs  → View logs
POST /api/system/services/zurto-api/restart → Restart
```

---

## Workspace Structure

```
C:\Users\leogr\Desktop\Workspace\
├── Zurto/                    ← Main API (port 3002)
├── Discord-Website/          ← Dashboard
├── Shinrai.lol-V2/           ← Portfolio (GitHub repo)
├── Portfolio/                ← Dev portfolio
├── .github/
│   ├── prompts/              ← THIS: Nested memory system
│   └── *.md                  ← Documentation
├── docker-compose.yml        ← Container orchestration
└── README.md
```

---

## Memory System

### Core: aiMemoryV2 (SQLite)

- **Location**: Zurto/src/core/ai-memory-v2.ts
- **Purpose**: Persistent memory for AI agent
- **Categories**: code, conversation, decision, learning, error
- **Cleanup**: Auto-expires old memories
- **Search**: Semantic search via `/api/ai/memory/search`

### External Memory

- **Location**: `.github/prompts/` (nested files)
- **Purpose**: Between-session context persistence
- **Scope**: APIs, patterns, project state, recent learnings
- **Update**: Manual after significant sessions

---

## Common Workflows

### Check System Health

```
1. GET /api/system/health
2. GET /api/docker/containers
3. GET /api/system/services
```

### Debug Service Issues

```
1. GET /api/docker/container/zurto-api/logs
2. POST /api/system/services/zurto-api/restart (if needed)
3. GET /api/docker/containers (verify)
```

### Update Project Code

```
1. Load memory: GET /api/ai/memory/search?query={project}
2. Get summary: summarize_project {name}
3. Read specific files (targeted, not exploratory)
4. Make changes
5. Store: POST /api/ai/memory (what was changed, why)
```
