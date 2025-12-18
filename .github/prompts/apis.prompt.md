# Zurto APIs Reference

> Complete API reference for the Zurto system.
> Full documentation: See `COPILOT_AGENT_PROMPT.md` and `API_REFERENCE.md` in root `.github/`

---

## Core API Categories

### Tasks

```
GET    /api/tasks                  → List tasks
POST   /api/tasks                  → Create task
GET    /api/tasks/:id              → Get task details
PATCH  /api/tasks/:id              → Update task
DELETE /api/tasks/:id              → Delete task
GET    /api/tasks/:id/subtasks     → Get subtasks
GET    /api/stats                  → Task statistics
GET    /api/search?q=X             → Search tasks
```

### Projects

```
GET    /api/projects               → List all projects
POST   /api/projects/create        → Create project (scaffold)
GET    /api/projects/:id           → Get project details
PATCH  /api/projects/:id           → Update project
GET    /api/projects/:id/summary   → Project summary
POST   /api/projects/:id/commits   → Add commit
POST   /api/projects/:id/versions  → Create release version
```

### Memory

```
GET    /api/ai/memory              → Get all memories
POST   /api/ai/memory              → Store memory
GET    /api/ai/memory/search?q=X   → Search memories
PUT    /api/ai/memory/:id          → Update memory
DELETE /api/ai/memory/:id          → Delete memory
GET    /api/ai/memory/cleanup      → Clean expired
GET    /api/ai/memory/stats        → Memory statistics
```

### Workspace

```
GET    /api/workspace/tree         → Full file tree
GET    /api/workspace/file?path=X  → Read file
POST   /api/workspace/file         → Write file
DELETE /api/workspace/file         → Delete file
GET    /api/workspace/search       → Search files
GET    /api/workspace/stats        → Workspace stats
```

### Docker & System

```
GET    /api/system/services        → List services
POST   /api/system/services/:name/restart
GET    /api/docker/containers      → List containers
POST   /api/docker/container/:name/action
GET    /api/docker/container/:name/logs
```

### AI & Memory

```
GET    /api/ai/thinking/stream?requestId=X  → Stream thinking
GET    /api/ai/thinking/active              → Active sessions
GET    /api/ai/thinking/history             → Recent sessions
```

---

## Common Patterns

### Create Task + Link to Board

```
1. POST /api/tasks → Get task ID
2. POST /api/planning/boards/default/cards → Link to kanban
3. POST /api/ai/memory → Store context
```

### Project Work Session

```
1. GET /api/ai/memory/search → Load context
2. summarize_project → Get overview
3. read_file → Examine code
4. write_file → Make changes
5. POST /api/ai/memory → Store changes
```

### Search Before Read

```
1. search_files(pattern) → Find relevant files (~150 tokens)
2. read_file(specific) → Read only what's needed
→ Saves tokens vs exploring files
```
