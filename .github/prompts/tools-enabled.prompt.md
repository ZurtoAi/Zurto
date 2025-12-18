# Tools Enabled Configuration

> Current tool availability and configuration for Copilot agent
> Updated when tools are added, removed, or reconfigured

---

## Available Tools

### ✅ ENABLED (Full Access)

**File Operations**

- read_file - Read file contents
- write_file - Create/update files
- delete_file - Remove files
- list_directory - List folder contents
- search_files - Find files by pattern

**Project Management**

- summarize_project - Get project overview
- create_project - Scaffold new project
- list_projects - Get project list
- update_project - Modify project

**Tasks**

- create_task - Create task
- list_tasks - Get task list
- update_task - Modify task
- search_tasks - Find tasks

**Memory**

- memory_search - Search past learnings
- memory_store - Save learning
- memory_update - Modify memory
- memory_cleanup - Remove expired

**Docker & System**

- list_containers - Get running containers
- container_logs - View container logs
- restart_service - Restart services
- health_check - System health

**Planning**

- create_board - Kanban board
- create_card - Add card
- move_card - Organize work

**Discord**

- send_message - Post to Discord
- send_embed - Send formatted embed
- log_action - Activity logging

---

## ❌ DISABLED (Not Available)

- query_database - Direct database access (use API only)
- (Web-only features - questionnaires, rendering)

---

## Optimization Rules

### Smart Tool Usage

1. **Search first**: Use search_files before read_file
2. **Summarize first**: Use summarize_project before reading individual files
3. **Batch operations**: Group related file writes
4. **Check memory**: Load context before re-analyzing
5. **Ask for clarity**: Reduces exploration token usage

### Rate-Conscious Patterns

- List directory (~50-150 tokens) - usually free
- Search files (~100-200 tokens) - cheap exploration
- Summarize project (~400-600 tokens) - good overview
- Read file 1KB (~200-250 tokens) - targeted reads only
- Avoid: Multiple sequential file reads

---

## Error Handling

### Tool Failures

- Tool errors are logged to memory automatically
- Retry logic: Check memory for similar issues
- If persistent: Report to Discord with details

### Rate Limiting

- If approaching limit: Switch to lighter operations
- If hard limit: System auto-waits
- Memory is preserved during waits

---

## Configuration Reference

For detailed tool definitions, see:

- `Zurto/src/core/prompt-manager.ts` (DEFAULT_TOOLS array)
- `/api/tasks` endpoint (task management)
- `/api/ai/memory` endpoint (memory system)
