# Quick Start: Using the External Zurto Agent

> **For GitHub Copilot users** - Everything you need to work with the external Zurto agent

---

## ⚡ Rate Limit Quick Reference

**Budget: 25,000 input tokens per minute**

### Token Costs (What Matters for YOU)

- **Big file read** (10KB) = ~2,000 tokens (AVOID!)
- **Small file read** (1KB) = ~250 tokens (acceptable)
- **Project summary** = ~500 tokens (RECOMMENDED)
- **Search files** = ~150 tokens (use first!)
- **Create/update task** = ~100-150 tokens (cheap)

### Smart Rule

✅ **Search → Summarize → Read ONE file → Make changes**  
❌ **Read 5 files to understand → Waste 10,000 tokens**

### If "Rate Limited"

1. Agent waits 60 seconds automatically ✅
2. Continues with lighter operations
3. May ask: "What specific file/area should I focus on?"

---

## 📖 Documentation Map

### 1. **Main Agent Configuration**

📄 `/.github/COPILOT_AGENT_PROMPT.md`

- **Read this first** for agent identity, capabilities, rules
- How to work efficiently (rate limits, memory usage)
- Complete tool list and initialization checklist
- **Section: "Rate Limiting Strategy"** for detailed token info

### 2. **API Reference**

📄 `/Zurto/docs/API_REFERENCE.md`

- All 50+ endpoints with parameters and response formats
- **NEW: Token cost table** for each endpoint
- Quick lookup when you need specific endpoint info
- Error codes and what they mean

### 3. **Internal Rules & Patterns**

📄 `/Zurto/docs/INTERNAL_RULES.md`

- Coding conventions and style guidelines
- Common patterns used in Zurto codebase
- Workflow examples for typical tasks
- Performance optimization tips

---

## 🚀 How to Use the Agent

### Basic Pattern

```
1. Ask your question/request in GitHub Copilot Chat
2. Agent reads COPILOT_AGENT_PROMPT.md for instructions
3. Agent checks memory for prior context
4. Agent executes task using Zurto API (respecting rate limits)
5. Agent stores learning in memory
6. Agent returns results
```

### Example Request

**You say:**

> "Add a task for fixing the auth flow, make it high priority, and track it on the planning board"

**Agent does:**

1. ✅ Check memory: `GET /api/ai/memory/search?query=auth flow fixes`
2. ✅ Create task: `POST /api/tasks`
3. ✅ Get default board: `GET /api/planning/boards`
4. ✅ Add to board: `POST /api/planning/boards/default/cards`
5. ✅ Store in memory: `POST /api/ai/memory` (category: conversation)
6. ✅ Return: Task ID, board link, status
7. ✅ Log to Discord (optional, if significant)

---

## 🧠 Key Concepts

### Rate Limiting

- **Budget**: 25,000 tokens per minute
- **Smart usage**: Use `summarize_project` first (~500 tokens)
- **Never**: Read 5+ files sequentially
- **If limited**: Wait 60 seconds, ask for clarification

### Memory System

- **Before acting**: Check memory for context
- **After acting**: Store what you learned
- **Categories**: code, conversation, decision, learning, error
- **Search**: `GET /api/ai/memory/search?query=your_search`

### Tool Priority

1. **summarize_project** → Get full context (FIRST!)
2. **list_directory** → See folder contents
3. **search_files** → Find by pattern
4. **read_file** → Read specific file (LAST RESORT)

---

## 📝 Example Workflows

### Workflow 1: Fix a Bug

```
You: "Fix the TOTP verification bug in auth-routes.ts"

Agent:
  1. Searches memory for "TOTP bug" + "auth issues"
  2. Gets project summary of Zurto
  3. Reads auth-routes.ts (specific section)
  4. Identifies the bug
  5. Makes fix
  6. Stores memory: category=code, importance=8
  7. Logs to Discord: "🐛 Bug fixed: TOTP verification"

Result: Bug fixed, documented, logged
```

### Workflow 2: Create Feature

```
You: "Add a new endpoint to create bulk tasks"

Agent:
  1. Searches memory for "bulk operations" + "task patterns"
  2. Summarizes Zurto project
  3. Reads task-api.ts (task endpoint section)
  4. Reads task-manager.ts (bulk method if exists)
  5. Implements endpoint
  6. Tests with example requests
  7. Stores memory: category=code, importance=7

Result: Feature implemented, tested, documented
```

### Workflow 3: System Investigation

```
You: "Why is the Docker container crashing?"

Agent:
  1. Gets container status: GET /api/system/services
  2. Reads logs: GET /api/docker/container/zurto-api/logs
  3. Searches memory for "crash patterns"
  4. Identifies issue (e.g., out of memory)
  5. Suggests fix or restarts service
  6. Stores in memory: category=error, importance=6
  7. Logs findings to Discord

Result: Issue identified and resolved
```

---

## 🔧 Common Commands

### Task Management

```
"Create task: improve error logging"
→ POST /api/tasks with title, description, priority

"Show me pending tasks"
→ GET /api/tasks?status=not-started

"Move task #123 to planning board"
→ Add to kanban board via POST /api/planning/boards/cards

"Mark task complete"
→ PATCH /api/tasks/:id with status=completed
```

### Project Work

```
"Summarize the Zurto project"
→ Uses summarize_project tool

"Add a commit to track changes"
→ POST /api/projects/:id/commits

"List all project versions"
→ GET /api/projects/:id/versions
```

### System Management

```
"Restart the Zurto API"
→ POST /api/system/services/zurto-api/restart

"Show system health"
→ GET /api/system/health

"What containers are running?"
→ GET /api/docker/containers
```

### Memory & Learning

```
"Store this pattern in memory"
→ POST /api/ai/memory (agent auto-stores significant work)

"What did we learn about authentication?"
→ GET /api/ai/memory/search?query=authentication

"Clean up old memories"
→ GET /api/ai/memory/cleanup (runs automatically)
```

---

## 🎯 Pro Tips

### Tip 1: Use Memory Effectively

**Before making code changes, ask:**

> "What coding rules should I follow for this project?"

Agent will search memory for relevant rules, then apply them.

### Tip 2: Summarize First

**Always start big requests with:**

> "Summarize the Zurto project for me"

This gives agent context without burning token budget.

### Tip 3: Be Specific

**Instead of:**

> "Tell me about the auth system"

**Say:**

> "What's the TOTP verification flow in auth-routes.ts?"

Agent gets specific and efficient.

### Tip 4: Use Batch Operations

**Instead of:**

> "Create 5 tasks one by one"

**Say:**

> "Create these 5 tasks and add them to the planning board in one operation"

Agent batches API calls together.

### Tip 5: Reference Memory

**After agent stores memories, you can say:**

> "Based on what we learned earlier about the architecture, implement feature X"

Agent recalls and applies prior learning.

---

## 🚨 Troubleshooting

### Problem: "Rate limited"

**Solution:**

```
1. Wait 60 seconds
2. Agent will use summarize_project instead of file reads
3. Ask for specific file/area to focus on
```

### Problem: "Can't find file"

**Solution:**

```
1. Ask: "Search for files with 'auth' in the name"
2. Agent will use search_files tool
3. Then read specific file found
```

### Problem: "Task not updating"

**Solution:**

```
1. Check auth: GET /api/auth/check
2. Verify session is valid
3. Try again with explicit task ID
```

### Problem: "Memory getting too large"

**Solution:**

```
1. Agent auto-cleans on schedule
2. Or manually: GET /api/ai/memory/cleanup
3. Check memory stats: GET /api/ai/memory/stats
```

---

## 📊 What the Agent Can Do

✅ **Full Capabilities:**

- Create, update, delete tasks and projects
- Read and write files in workspace
- Search and manage memory/knowledge
- Control Docker containers
- Manage planning boards (kanban)
- View real-time thinking streams
- Track project commits and versions
- Manage users and permissions
- Monitor system health
- Log significant actions to Discord

❌ **Cannot Do:**

- Fetch web AI system prompts (external-only)
- Access chat history from web UI
- Modify other users' sessions
- Run arbitrary commands (only through tools)
- Access external APIs directly (only Zurto API)

---

## 🔐 Security

### Session Token

- Automatically handled via TOTP verification
- Stored in httpOnly cookies (secure)
- 24-hour expiry or explicit logout
- Remember-me option available

### Permissions

- Agent operates with ADMIN access
- Bound to Zurto API only
- All actions logged to Discord
- Memory is searchable and auditable

### API Keys

- Internal API key for service-to-service calls
- X-API-Key or X-Internal-Key headers
- Protects against external tampering

---

## 📚 Reference Files

| File                    | Purpose           | When to Use                          |
| ----------------------- | ----------------- | ------------------------------------ |
| COPILOT_AGENT_PROMPT.md | Main instructions | Always (agent reads automatically)   |
| API_REFERENCE.md        | Endpoint details  | When you need specific endpoint info |
| INTERNAL_RULES.md       | Code conventions  | Before coding/changes                |
| QUICK_START.md          | This guide        | To understand workflows              |

---

## ⚡ Quick Commands Reference

```bash
# Create a task
"Create task: [title] with priority [high/medium/low]"

# Get status
"What's the status of [project/task]?"

# Fix something
"Fix the [bug/issue] in [file/component]"

# Add feature
"Add feature: [description]"

# Check memory
"What do we know about [topic]?"

# View logs
"Show me Docker logs for zurto-api"

# Restart service
"Restart the [service name]"

# List tasks
"Show me [pending/completed] tasks"

# Create project
"Create a new project called [name]"

# Track progress
"Update [task ID] status to [status]"
```

---

## 🎓 Learning Path

**Day 1: Basics**

1. Read COPILOT_AGENT_PROMPT.md
2. Try: "Create a task" + "Show me tasks"
3. Try: "What's the status?"

**Day 2: Intermediate**

1. Read API_REFERENCE.md (skim it)
2. Try: "Summarize the Zurto project"
3. Try: "Fix a bug in [file]"

**Day 3: Advanced**

1. Read INTERNAL_RULES.md
2. Try: "Remember this pattern"
3. Try: Complex multi-step workflows

**Day 4+: Expert**

- Use memory strategically
- Batch operations
- Optimize for token usage
- Help others learn

---

## 💡 Best Practices

1. **Be Clear**: Specify exactly what you want
2. **Be Patient**: Agent may ask clarifying questions
3. **Be Efficient**: Use summaries, not file reads
4. **Be Consistent**: Use same terminology for concepts
5. **Be Collaborative**: Share learnings back to team

---

## 🤝 Getting Help

**If agent seems confused:**

> "Let me clarify: [explain specifically]"

**If agent makes a mistake:**

> "That's not right. Let me explain what I meant..."

**If you want to teach agent:**

> "Remember: [important rule/pattern] for future reference"

Agent learns from your feedback!

---

_Ready to use external Zurto? Start with the main prompt file and begin asking questions. The agent will handle the rest!_
