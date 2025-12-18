# GitHub Copilot Agent Instructions - Zurto Project

> **PURPOSE**: Autonomous AI agent configuration for developing the Zurto project. This agent follows the Zurto workflow: planning → questionnaire → autonomous execution → documentation.
>
> **SCOPE**: Zurto is a TypeScript/Node.js + React system that provides task management, AI memory, Discord integration, and multi-team support.
>
> **LOCATION**: `.github/copilot-instructions.md` (loaded automatically by VS Code Copilot)

---

## 🎯 Core Operating Rules

### **CRITICAL: Always Follow These Rules**

1. **🐳 Always Run Servers on Docker**

   - Never run servers directly in terminal with `npm run dev` or `node`
   - Always use: `docker compose up -d [service-name]`
   - Always check status with: `docker compose ps`
   - Rebuild when needed: `docker compose build --no-cache [service-name]`

2. **🌐 Always Use Official Domains (Never Localhost)**

   - **CRITICAL**: Never reference localhost in documentation, commands, or tests
   - Production URLs:
     - `https://ui.zurto.app` - Zurto UI documentation
     - `https://api.zurto.app` - Zurto API
     - `https://zurto.app` - Main website
   - Development: Only use localhost for local dev servers, never document it
   - In docs/READMEs: Always show official domain, never localhost ports
   - Testing: Use `Invoke-WebRequest -Uri "https://ui.zurto.app"` not localhost
   - Exception: Docker internal networking can use service names

3. **❓ Always Ask Questions When Unsure**

   - If requirements are unclear → ASK
   - If multiple approaches exist → ASK which to use
   - If breaking changes needed → ASK for confirmation
   - If user intent is ambiguous → ASK for clarification
   - Better to ask than to assume incorrectly

4. **🔀 Never Overlap Terminal Operations**

   - Long-running servers (Docker, dev servers) → Run in dedicated terminal
   - One-off commands (testing, building) → Run in separate terminal
   - Never chain server start with other commands
   - Example: ❌ `docker compose up -d; npm test` → ✅ Run separately

5. **💻 Always Use PowerShell Commands (Windows)**

   - ✅ Use: `Invoke-WebRequest`, `Invoke-RestMethod`
   - ❌ Never: `curl`, `wget`, `bash` commands
   - ✅ Chain with semicolons: `cd Zurto-V3; docker compose ps`
   - ✅ Full URIs: `Invoke-WebRequest -Uri "https://api.zurto.app/api/health" -Method GET`
   - ✅ Prevent hangs: Always include `-UseBasicParsing` for web requests

6. **📄 Minimal Documentation Strategy**

   - **ONE README per project** - Keep updated throughout work
   - **ONE GUIDE** - Technical implementation guide, update continuously
   - **ONE TODO** - Task tracking file, mark completed items
   - ❌ Never create: `GUIDE_V2.md`, `README_NEW.md`, `FEATURE_X_DOCS.md`
   - ✅ Always: Update existing docs in place
   - 📁 **Docs Location**: Always in project root (e.g., `Zurto-V3/README.md`, not nested)

7. **🤖 Autonomous Workflow**

   - **Phase 1**: User describes feature/project
   - **Phase 2**: Agent asks all necessary questions (planning)
   - **Phase 3**: User answers questionnaire
   - **Phase 4**: Agent works fully autonomously (no interruptions)
   - **Phase 5**: Agent reports completion + updates docs
   - Follow Zurto's own task management patterns

8. **📋 Questionnaires via VS Code Extension Bridge**
   - **ALWAYS send questionnaires through the Copilot Bridge** on port 8787
   - Bridge Endpoint: `POST http://127.0.0.1:8787/questionnaire`
   - When needing user input for planning:
     ```powershell
     # Send questionnaire to VS Code Extension Panel
     Invoke-RestMethod -Uri "http://127.0.0.1:8787/questionnaire" -Method POST -ContentType "application/json" -Body (@{
       projectDescription = "Description of what you need"
       projectType = "TypeScript React Project"
       questions = @(
         @{ id = "q1"; text = "What is the main goal?"; type = "text"; required = $true }
         @{ id = "q2"; text = "What framework?"; type = "select"; options = @(@{label="React";value="react"},@{label="Vue";value="vue"}) }
       )
     } | ConvertTo-Json -Depth 5)
     ```
   - Questionnaires appear in the VS Code Zurto Questionnaire Panel
   - User can answer directly in VS Code UI instead of chat
   - Responses are sent back through the bridge to the agent
   - Fallback: If bridge unavailable, use traditional chat-based questions

---

---

## 🎯 Zurto Project Overview

### Autonomous Agent Workflow

**How Zurto Agent Works**:

1. **Planning Phase**: User describes what they want (feature, bug fix, refactoring)
2. **Questionnaire Phase**: Agent asks ALL clarifying questions upfront:
   - What files need modification?
   - Which approach to use (if multiple options)?
   - What should the behavior be?
   - Any breaking changes acceptable?
   - Testing requirements?
3. **Answer Collection**: User answers all questions in one go
4. **Autonomous Execution**: Agent works WITHOUT interruption:
   - Reads necessary files
   - Implements changes
   - Tests functionality
   - Updates documentation
   - Verifies everything works
5. **Completion Report**: Agent reports what was done + next steps

**Key Principle**: Ask everything upfront, then work autonomously. Never interrupt user mid-work to ask questions.

### What is Zurto?

Zurto is a comprehensive task management and AI memory system built with:

- **Backend**: TypeScript/Node.js (Express-based API)
- **Frontend**: React/Vite (modern SPA)
- **Database**: SQLite (multi-team support)
- **AI Integration**: Claude AI agents with persistent memory
- **Automation**: Discord bot integration, planning boards, workflow management
- **Port**: 3002 (development), containerized via Docker

### Core System Components

| Component          | Path                         | Purpose                             |
| ------------------ | ---------------------------- | ----------------------------------- |
| **Task API**       | `src/api/task-api.ts`        | Core task management endpoints      |
| **AI Memory**      | `src/core/ai-memory-v2.ts`   | Semantic memory storage & retrieval |
| **Planning Board** | `src/core/planning-board.ts` | Kanban-style project management     |
| **Discord Bot**    | `discord-bot/index.js`       | Event handling & messaging          |
| **React Client**   | `client/src/`                | Dashboard UI (Vite)                 |
| **Multi-Team DB**  | `src/core/multi-team-db.ts`  | Team-scoped data isolation          |

### Key Features

✅ **Task Management**: Create, track, organize, and complete tasks  
✅ **AI Memory**: Persistent semantic memory for learning patterns  
✅ **Planning Boards**: Visual Kanban boards for workflow organization  
✅ **Discord Integration**: Real-time notifications & bot commands  
✅ **Multi-Team Support**: Isolated data per team/organization  
✅ **Thinking Streams**: AI reasoning captured & stored  
✅ **Auto-Persistence**: Memory & state auto-save mechanisms

---

## 🗂️ Zurto Project Structure

```
Zurto/
├── src/
│   ├── index.ts              # Entry point
│   ├── main.ts               # Server setup
│   ├── start.ts              # Service initialization
│   ├── api/                  # Route handlers
│   │   ├── task-api.ts       # Task CRUD endpoints
│   │   ├── ai-routes.ts      # AI/memory endpoints
│   │   ├── system-routes.ts  # System health/status
│   │   ├── planning-routes.ts # Planning board endpoints
│   │   ├── team-admin-routes.ts # Multi-team management
│   │   └── ...
│   ├── core/                 # Core business logic
│   │   ├── ai-memory-v2.ts   # Semantic memory engine
│   │   ├── database.ts       # SQLite wrapper
│   │   ├── multi-team-db.ts  # Team isolation
│   │   ├── planning-board.ts # Kanban board logic
│   │   ├── ai-thinking.ts    # Thinking/reasoning capture
│   │   ├── ai-stats.ts       # Analytics
│   │   └── ...
│   ├── agents/               # AI agents
│   │   ├── claude-agent.ts   # Claude integration
│   │   ├── tool-executor.ts  # Tool execution
│   │   └── system-prompt-builder.ts
│   └── integrations/         # External services
│       └── discord.ts
├── client/                   # React frontend
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── components/       # React components
│   │   ├── hooks/            # Custom hooks
│   │   ├── pages/            # Page components
│   │   └── utils/            # Utilities
│   ├── vite.config.js
│   └── package.json
├── discord-bot/              # Discord bot service
│   ├── index.js
│   ├── core/
│   │   ├── commands.js
│   │   ├── embeds.js
│   │   └── ...
│   └── package.json
├── data/                     # Local data storage
│   ├── tasks.json
│   ├── ai-memory.json
│   ├── questionnaires.json
│   └── metrics/
├── public/                   # Static assets
│   ├── dashboard.html
│   └── dashboard.js
├── prompts/                  # AI system prompts
│   ├── CORE_PROMPT.md
│   ├── ZURTO_SYSTEM_PROMPT.md
│   └── COPILOT_AGENT_BINDING.md
├── docs/                     # Documentation
│   └── API_REFERENCE.md
└── Dockerfile, docker-compose.yml, package.json
```

### Key Files for Development

**Backend Core**:

- `src/api/task-api.ts` - Main task management API
- `src/core/ai-memory-v2.ts` - AI learning & memory system
- `src/core/database.ts` - Data persistence layer
- `src/agents/claude-agent.ts` - AI agent integration

**Frontend**:

- `client/src/App.jsx` - Main React app
- `client/src/components/` - Reusable UI components
- `client/src/hooks/` - Custom React hooks

**Configuration**:

- `package.json` - Dependencies & scripts
- `tsconfig.json` - TypeScript configuration
- `.env.example` - Environment variables template
- `docker-compose.yml` - Container orchestration

---

## 🚀 Getting Started with Zurto Development

### Prerequisites

- Node.js 18+
- npm/yarn
- Docker & Docker Compose (for containerized development)
- Git
- Environment variables configured (copy `.env.example` to `.env`)

### Running Zurto (Docker-Only)

```powershell
# ALWAYS use Docker for running services
cd Zurto-V3

# Start all services
docker compose up -d

# Start specific service
docker compose up -d zurto-api
docker compose up -d zurto-web

# Check service status
docker compose ps

# View logs (dedicated terminal)
docker compose logs -f zurto-api

# Stop services
docker compose down

# Rebuild after changes
docker compose build --no-cache zurto-api; docker compose up -d zurto-api
```

### PowerShell Command Reference (Windows)

```powershell
# API Testing (Use Invoke-WebRequest, NOT curl) - Always use official domain
Invoke-WebRequest -Uri "https://api.zurto.app/api/health" -Method GET -UseBasicParsing

# POST with JSON body
$body = @{
    title = "Test Task"
    status = "pending"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://api.zurto.app/api/tasks" -Method POST -Body $body -ContentType "application/json"

# GET with query params
Invoke-RestMethod -Uri "https://api.zurto.app/api/tasks?status=pending" -Method GET

# Chain commands (use semicolon)
cd Zurto-V3; docker compose ps

# File operations
Get-Content README.md | Select-String "keyword"
Copy-Item source.txt destination.txt
Remove-Item old-file.txt
```

### Build Commands (For Development Only)

```powershell
# Install dependencies (when not using Docker)
npm install

# Lint & format
npm run lint
npm run format

# Run tests
npm test
```

### Configuration

**Environment Variables** (`.env`):

```env
# Server
NODE_ENV=development
API_PORT=3002
API_HOST=localhost

# Database
DB_PATH=./data/zurto.db

# AI/Claude
CLAUDE_API_KEY=sk-...
CLAUDE_MODEL=claude-3-5-sonnet-20241022

# Discord
DISCORD_TOKEN=...
DISCORD_CHANNEL_ID=...

# Multi-team
TEAM_ID=default
```

## 📡 Zurto API Reference

### Core Endpoints (Organized by Function)

**Tasks** (Core functionality):

```
GET    /api/tasks                  → List all tasks
POST   /api/tasks                  → Create new task
GET    /api/tasks/:id              → Get task details
PATCH  /api/tasks/:id              → Update task
DELETE /api/tasks/:id              → Delete task
GET    /api/tasks/:id/subtasks     → Get subtasks
GET    /api/search?q=TEXT          → Search tasks by keyword
GET    /api/stats                  → Task statistics
```

**AI Memory** (Learning & persistence):

```
GET    /api/ai/memory              → Get all memories
POST   /api/ai/memory              → Store new memory
GET    /api/ai/memory/search?q=X   → Semantic search memories
GET    /api/ai/memory/:id          → Get specific memory
PUT    /api/ai/memory/:id          → Update memory
DELETE /api/ai/memory/:id          → Delete memory
GET    /api/ai/memory/stats        → Memory statistics
GET    /api/ai/memory/cleanup      → Cleanup expired entries
```

**Planning Boards** (Kanban/visual management):

```
GET    /api/planning/boards        → List all boards
POST   /api/planning/boards        → Create board
GET    /api/planning/boards/:id    → Get board details
POST   /api/planning/boards/:id/cards    → Add card
PATCH  /api/planning/boards/:id/cards/:cardId → Move card
```

**Projects** (Higher-level tracking):

```
GET    /api/projects               → List projects
POST   /api/projects               → Create project
GET    /api/projects/:id           → Get project details
PATCH  /api/projects/:id           → Update project
POST   /api/projects/:id/commits   → Record commit
```

**AI & Agents** (Thinking & reasoning):

```
GET    /api/ai/thinking/stream?requestId=X  → Stream thinking
GET    /api/ai/thinking/active              → Active sessions
GET    /api/ai/thinking/history             → Recent sessions
POST   /api/ai/agents/execute               → Execute agent task
```

**System** (Health & status):

```
GET    /health                     → Quick health check
GET    /api/system/health          → Detailed health
GET    /api/system/services        → List services
POST   /api/system/services/:name/restart   → Restart service
```

**Team Admin** (Multi-team support):

```
GET    /api/team/users             → List team users
POST   /api/team/users             → Add user to team
PATCH  /api/team/users/:id         → Update user
DELETE /api/team/users/:id         → Remove user
GET    /api/team/settings          → Team settings
```

### API Response Format

Standard response wrapper:

```json
{
  "success": true,
  "data": {
    /* endpoint-specific data */
  },
  "error": null,
  "meta": {
    "timestamp": "2025-12-05T10:30:00Z",
    "requestId": "req-123"
  }
}
```

### Common Patterns

**Pagination**:

```
GET /api/tasks?limit=10&offset=20
GET /api/ai/memory?page=1&perPage=50
```

**Filtering**:

```
GET /api/tasks?status=pending&priority=high
GET /api/ai/memory?category=code&tags=bug-fix
```

**Sorting**:

```
GET /api/tasks?sort=createdAt&order=desc
GET /api/ai/memory?sort=importance&order=desc
```

## 🧠 AI Memory System (aiMemoryV2)

### Understanding the Memory System

Zurto includes a sophisticated AI memory system (`src/core/ai-memory-v2.ts`) that persists learnings between sessions:

**Memory Categories**:

- `code` - Code changes, implementations, architectural decisions
- `conversation` - User preferences, communication patterns, requirements
- `decision` - Architecture choices, design decisions, trade-offs
- `learning` - Discovered patterns, codebase conventions, best practices
- `error` - Bugs encountered, solutions applied, workarounds

**Memory Storage**:

- SQLite database: `data/ai-memory.json`
- Semantic search via embeddings
- Auto-cleanup of expired entries (>30 days)
- Importance scoring (1-10)

### Working with Memory

**Search for relevant context**:

```
GET /api/ai/memory/search?q=typescript+patterns&limit=10
GET /api/ai/memory/search?q=react+hooks&category=learning
```

**Store new learning**:

```
POST /api/ai/memory
{
  "content": "Discovered that task validation logic uses zod in src/validation/task.ts",
  "category": "learning",
  "importance": 7,
  "tags": ["typescript", "validation", "zod"],
  "metadata": {
    "files": ["src/validation/task.ts"],
    "context": "Found while implementing new task endpoint"
  }
}
```

**Update existing memory**:

```
PUT /api/ai/memory/:id
{
  "importance": 9,
  "content": "Updated context about task validation..."
}
```

### External Memory System

Between-session context is stored in `.github/prompts/`:

1. `identity.prompt.md` - This agent's identity & capabilities
2. `apis.prompt.md` - API reference & patterns
3. `system-context.prompt.md` - Architecture overview
4. `memories.prompt.md` - Recent learnings & discoveries
5. `project-state.prompt.md` - Current project status
6. `tools-enabled.prompt.md` - Available tools & optimization

These files are loaded at session start and updated after significant work.

## 💻 Coding Patterns & Conventions

### TypeScript Backend (src/)

**File Structure**:

- API routes: `src/api/[feature]-routes.ts`
- Business logic: `src/core/[feature].ts`
- Type definitions: Inline or in `src/types/`
- Utils: `src/utils/[utility].ts`

**Import Patterns**:

```typescript
// API routes
import express from "express";
import { database } from "../core/database.ts";
import { aiMemory } from "../core/ai-memory-v2.ts";

// Core logic
import { logger } from "./logger.ts";
import { validateInput } from "../utils/validation.ts";
```

**API Endpoint Pattern**:

```typescript
router.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await database.getTasks(req.query);
    res.json({ success: true, data: tasks });
  } catch (error) {
    logger.error("Failed to fetch tasks", error);
    res.status(500).json({ success: false, error: error.message });
  }
});
```

**Middleware & Error Handling**:

- Use Express middleware for auth, logging
- Consistent error response format
- Always log errors before responding
- Validate input with zod or joi

### React Frontend (client/src/)

**Component Structure**:

```jsx
// File: components/TaskCard.jsx
export const TaskCard = ({ task, onUpdate }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleUpdate = async (data) => {
    setIsLoading(true);
    try {
      const result = await api.updateTask(task.id, data);
      onUpdate(result);
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return <div className="task-card">{/* JSX content */}</div>;
};
```

**Hooks Pattern**:

```jsx
// Custom hook for API calls
export const useTask = (taskId) => {
  const [task, setTask] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    api
      .getTask(taskId)
      .then(setTask)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [taskId]);

  return { task, loading, error };
};
```

**Styling**:

- Use CSS modules: `Component.module.css`
- Or inline Tailwind classes
- Keep component styles scoped
- Reference existing components for patterns

### Database (SQLite)

**Schema Pattern**:

```sql
-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  teamId TEXT NOT NULL
);

-- AI Memory table
CREATE TABLE IF NOT EXISTS ai_memory (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  category TEXT,
  importance INTEGER DEFAULT 5,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  expiresAt DATETIME,
  teamId TEXT NOT NULL
);
```

**Query Patterns**:

- Always include `teamId` for multi-team isolation
- Use prepared statements (sql.js or better-sqlite3)
- Implement proper indexing for performance
- Test queries before deployment

## 🔄 Development Workflow

### Before Starting Work

1. **Load Context**: Read `.github/prompts/` files to understand current state
2. **Check Tasks**: `GET /api/tasks?status=pending,in-progress` to see work items
3. **Search Memory**: `GET /api/ai/memory/search?q={topic}` for relevant patterns
4. **Review Recent Changes**: Check git log, PRs, recent commits
5. **Understand State**: Read relevant source files and understand architecture

### During Development

1. **Follow Conventions**: Use patterns from existing codebase
2. **Test Changes**: Test locally before committing
3. **Document**: Add comments for complex logic
4. **Log Learning**: Store discoveries in memory: `POST /api/ai/memory`
5. **Update Tasks**: Mark progress via `PATCH /api/tasks/{id}`

### After Completing Work

1. **Verify**: Test all changes thoroughly
2. **Store Memory**: Save learnings with `POST /api/ai/memory`
3. **Update Files**: Modify `.github/prompts/project-state.prompt.md`
4. **Rebuild**: `docker compose up -d --build zurto-api` if backend changed
5. **Commit**: Push changes to git with clear message

### Error Handling

1. **Log Error**: Store in memory with `category: "error"`
2. **Document**: Include reproduction steps and attempted fixes
3. **Alert**: If critical, log to Discord
4. **Solution**: Suggest resolution or next steps
5. **Learn**: Update memory system to prevent recurrence

### Deployment Workflow

```powershell
# 1. ALWAYS run in Docker (NEVER npm run dev)
cd Zurto-V3
docker compose ps  # Check current status

# 2. Rebuild service after code changes
docker compose build --no-cache zurto-api
docker compose up -d zurto-api

# 3. Verify (in separate terminal)
docker compose logs -f zurto-api

# 4. Test API (use Invoke-WebRequest)
Invoke-WebRequest -Uri "http://localhost:3000/health" -Method GET -UseBasicParsing

# 5. Update documentation (same files, never create new ones)
# Update: README.md, GUIDE.md, TODO.md in Zurto-V3/
```

### Discord Changelog Integration

**Purpose**: Send detailed changelog messages to Discord webhook for visibility across the team.

**Webhook URL**: `https://discord.com/api/webhooks/1446108010861826270/cNrUPHykHv0A-hHnBFSAoEGHEWgX9_ibFcCH7MngEKrTCE1sq4-1h7DuQ7NP-Z0PYrP-`

**Implementation**: After completing work or deployments, send changelog to Discord.

**Constraints**:

- Discord embed field values: Max 1024 characters
- Embed description: Max 4096 characters
- Total embeds per message: Max 10
- Message content: Max 2000 characters
- When content exceeds limits, split into multiple messages

**Changelog Message Format** (with emoji indicators):

```javascript
// Determine change type and emoji
const changeTypes = {
  feature: "✨ Feature",
  bugfix: "🐛 Bug Fix",
  improvement: "⚡ Improvement",
  refactor: "♻️ Refactor",
  docs: "📚 Docs",
  performance: "🚀 Performance",
  security: "🔒 Security",
  breaking: "⚠️ Breaking Change",
  deployment: "🚀 Deployment",
  database: "💾 Database",
  api: "📡 API",
};

// Structure for single embed
const embed = {
  title: "🔄 Zurto Changelog Update",
  description: "Summary of recent changes",
  color: 0x5865f2, // Discord blue
  fields: [
    {
      name: "✨ Features Added",
      value: "• Feature 1\n• Feature 2",
      inline: false,
    },
    {
      name: "🐛 Bugs Fixed",
      value: "• Fixed issue with X\n• Fixed issue with Y",
      inline: false,
    },
    {
      name: "⚡ Improvements",
      value: "• Improved performance\n• Better error handling",
      inline: false,
    },
    {
      name: "📝 Files Changed",
      value: "`src/api/task-api.ts`, `client/src/App.jsx`",
      inline: false,
    },
    {
      name: "👤 By",
      value: "Copilot Agent",
      inline: true,
    },
    {
      name: "⏰ Time",
      value: new Date().toISOString(),
      inline: true,
    },
  ],
  timestamp: new Date().toISOString(),
  footer: {
    text: "Zurto Project • Automated Changelog",
  },
};
```

**Message Splitting Logic**:

When changelog exceeds limits, split by:

1. Category (Features, Bugs, Improvements, etc.)
2. Then by sections within category if still too large
3. Send multiple embeds in sequence if needed
4. Use threading to group related messages

**Example: Sending Large Changelog**:

```javascript
async function sendChangelogToDiscord(changes) {
  const webhook =
    "https://discord.com/api/webhooks/1446108010861826270/cNrUPHykHv0A-hHnBFSAoEGHEWgX9_ibFcCH7MngEKrTCE1sq4-1h7DuQ7NP-Z0PYrP-";
  const embeds = [];
  let currentEmbed = {
    title: "🔄 Zurto Changelog",
    color: 0x5865f2,
    fields: [],
    timestamp: new Date().toISOString(),
  };

  for (const category in changes) {
    const items = changes[category];
    const itemText = items.map((i) => `• ${i}`).join("\n");

    // Check if adding this field would exceed limits
    const fieldSize = itemText.length + category.length;
    const currentSize = JSON.stringify(currentEmbed).length;

    if (currentSize + fieldSize > 5500) {
      // Start new embed if current is getting full
      embeds.push(currentEmbed);
      currentEmbed = {
        title: "🔄 Zurto Changelog (Continued)",
        color: 0x5865f2,
        fields: [],
        timestamp: new Date().toISOString(),
      };
    }

    currentEmbed.fields.push({
      name: category,
      value: itemText || "No changes",
      inline: false,
    });
  }

  // Add final embed
  if (currentEmbed.fields.length > 0) {
    embeds.push(currentEmbed);
  }

  // Send all embeds (max 10 per message)
  for (let i = 0; i < embeds.length; i += 10) {
    const batch = embeds.slice(i, i + 10);
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds: batch }),
    });
  }
}
```

**When to Send Changelog**:

- ✅ After completing feature implementation
- ✅ After deploying to production
- ✅ After major bug fixes
- ✅ After significant refactoring
- ✅ At end of development session (summary)
- ❌ After simple file reads
- ❌ After search operations
- ❌ For intermediate debugging steps

**Changelog Entry Template**:

```markdown
## Work Summary

### 📋 Changes Made

- [x] Feature/Fix 1: Brief description
- [x] Feature/Fix 2: Brief description
- [x] Refactoring: Description

### 📝 Files Modified

- `src/api/task-api.ts` - Added new endpoint
- `client/src/components/TaskCard.jsx` - Updated UI
- `Zurto/data/tasks.json` - Updated sample data

### 🧪 Testing

- Local testing: ✅ Passed
- Docker container: ✅ Running
- API health: ✅ Verified

### 📊 Stats

- Lines added: X
- Lines removed: Y
- Files changed: Z

### 🔗 Related

- Tasks completed: #123, #124
- Memory saved: Yes
- Next steps: [if any]
```

---

## 📡 API Quick Reference

### 🔌 Copilot Bridge API (VS Code Extension - Port 8787)

The Copilot Bridge runs inside VS Code and provides AI context injection:

```
GET    /health                     → Check bridge status
GET    /context                    → Get workspace context (files, git, selection)
POST   /chat                       → AI chat through Copilot
POST   /questionnaire              → Generate/submit questionnaires
POST   /questionnaire/generate     → Generate questions with AI
GET    /tasks                      → List tasks
POST   /tasks                      → Create task
GET    /projects                   → List projects
POST   /memory/search              → Search AI memory
POST   /memory                     → Store AI memory
POST   /inject                     → Inject context into AI
```

**Questionnaire Generation Example:**

```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:8787/questionnaire" -Method POST -ContentType "application/json" -Body (@{
  projectDescription = "Build a REST API with authentication"
  projectType = "TypeScript Node.js"
} | ConvertTo-Json)
```

**Chat Example:**

```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:8787/chat" -Method POST -ContentType "application/json" -Body (@{
  messages = @(
    @{ role = "user"; content = "Help me understand this codebase" }
  )
} | ConvertTo-Json -Depth 5)
```

### Core API Categories

**Tasks**

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

**Projects**

```
GET    /api/projects               → List all projects
POST   /api/projects/create        → Create project (scaffold)
GET    /api/projects/:id           → Get project details
PATCH  /api/projects/:id           → Update project
GET    /api/projects/:id/summary   → Project summary
POST   /api/projects/:id/commits   → Add commit
POST   /api/projects/:id/versions  → Create release version
```

**Memory**

```
GET    /api/ai/memory              → Get all memories
POST   /api/ai/memory              → Store memory
GET    /api/ai/memory/search?q=X   → Search memories
PUT    /api/ai/memory/:id          → Update memory
DELETE /api/ai/memory/:id          → Delete memory
GET    /api/ai/memory/cleanup      → Clean expired
GET    /api/ai/memory/stats        → Memory statistics
```

**Workspace**

```
GET    /api/workspace/tree         → Full file tree
GET    /api/workspace/file?path=X  → Read file
POST   /api/workspace/file         → Write file
DELETE /api/workspace/file         → Delete file
GET    /api/workspace/search       → Search files
GET    /api/workspace/stats        → Workspace stats
```

**Docker & System**

```
GET    /api/system/services        → List services
POST   /api/system/services/:name/restart
GET    /api/docker/containers      → List containers
POST   /api/docker/container/:name/action
GET    /api/docker/container/:name/logs
```

**AI & Thinking**

```
GET    /api/ai/thinking/stream?requestId=X  → Stream thinking
GET    /api/ai/thinking/active              → Active sessions
GET    /api/ai/thinking/history             → Recent sessions
```

### Common API Patterns

**Create Task + Link to Board**

```
1. POST /api/tasks → Get task ID
2. POST /api/planning/boards/default/cards → Link to kanban
3. POST /api/ai/memory → Store context
```

**Project Work Session**

```
1. GET /api/ai/memory/search → Load context
2. summarize_project → Get overview
3. read_file → Examine code
4. write_file → Make changes
5. POST /api/ai/memory → Store changes
```

**Search Before Read**

```
Always search before read (saves tokens)
Use project summaries vs reading files
Batch operations when possible
Ask clarifying questions to reduce exploration
```

---

## 📚 Zurto Architecture Deep Dive

### Task Management System

**Flow**:

1. User creates task via UI or API
2. Task validated and stored in SQLite
3. Planning board updated automatically
4. Discord notification sent
5. Task tracked in memory for context

**Key Files**:

- `src/api/task-api.ts` - Endpoints
- `src/core/database.ts` - Persistence
- `client/src/pages/TasksList.jsx` - UI

**Task Properties**:

```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  status: "pending" | "in-progress" | "completed" | "blocked";
  priority: "low" | "medium" | "high" | "critical";
  assignee?: string;
  createdAt: Date;
  updatedAt: Date;
  teamId: string;
  tags?: string[];
}
```

### AI Memory System

**Architecture**:

1. All memories stored in SQLite: `data/ai-memory.json`
2. Semantic search via embeddings
3. Auto-categorization
4. Importance scoring
5. Expiration handling

**Lifecycle**:

1. New memory created via `POST /api/ai/memory`
2. Indexed for semantic search
3. Scored for importance
4. Retrieved via `GET /api/ai/memory/search`
5. Auto-cleaned after 30 days

**Use Cases**:

- Store bug fixes & solutions
- Document architectural decisions
- Remember user preferences
- Track learned patterns
- Capture errors for prevention

### Planning Board System

**Components**:

- Boards (collections)
- Columns (stages: Todo, In Progress, Done)
- Cards (task representations)
- Status tracking

**Features**:

- Drag-and-drop card movement
- Automatic status sync with tasks
- Team filtering
- Performance optimized

### Multi-Team Architecture

**Isolation**:

- All queries include `teamId` filter
- Separate data storage per team
- No cross-team data leakage
- Admin tools for team management

**Database Structure**:

```sql
-- Every table includes teamId
CREATE TABLE tasks (..., teamId TEXT NOT NULL);
CREATE TABLE ai_memory (..., teamId TEXT NOT NULL);
CREATE TABLE planning_boards (..., teamId TEXT NOT NULL);

-- Indexes for fast team queries
CREATE INDEX idx_tasks_teamId ON tasks(teamId);
CREATE INDEX idx_memory_teamId ON ai_memory(teamId);
```

---

_This configuration ensures all agent operations are traceable, controllable, and integrated with the Zurto ecosystem._
