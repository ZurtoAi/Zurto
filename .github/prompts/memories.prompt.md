# Recent Memories & Learnings

> This file captures recent learnings, patterns discovered, and important context.
> Updated after significant work sessions.

---

## Recent Project Work

### Last Session Summary

- Task: Removed token rate limit information from COPILOT_AGENT_PROMPT.md
- Status: ✅ COMPLETE
- Files Modified: 2 sections removed (Rate Limiting ESSENTIAL, Rate Limiting Strategy)
- Impact: Prompt now focuses on core functionality without token constraints

---

## Code Patterns Discovered

### Rate Limiting System (Zurto/src/core/rate-limiter.ts)

- Input tokens: 25,000 per minute
- Output tokens: 8,000 per minute
- Requests: 50 per minute
- Auto-trim at 80% threshold
- Token calculation: 1 token ≈ 4 characters

### Prompt Management (Zurto/src/core/prompt-manager.ts)

- Reads from: `prompts/CORE_PROMPT.md` (project root)
- Database: Multi-team configuration in SQLite
- Features: Tool definitions, team-specific customization, history tracking

### Memory System (Zurto/src/core/ai-memory-v2.ts)

- Persistent storage for AI learnings
- Categories: code, conversation, decision, learning, error
- Search: Semantic via Zurto API
- Cleanup: Auto-expires old entries

---

## API Patterns

### Efficient Querying

- Always search before read (saves tokens)
- Use project summaries vs reading files
- Batch operations when possible
- Ask clarifying questions to reduce exploration

### Memory Management

- Store learnings after significant work
- Use memory search before re-learning
- Reference patterns from similar past work
- Clean up expired memories regularly

---

## Known Issues & Solutions

### If Rate Limited

- System auto-waits (don't panic)
- Use summaries instead of file reads
- Ask for specific file/area focus
- Resume after cooldown

### If Container Fails

- Check logs: `GET /api/docker/container/zurto-api/logs`
- Restart: `POST /api/system/services/zurto-api/restart`
- Verify: `GET /api/docker/containers`

---

## Session Continuity

### Information to Preserve

- Current project context
- Team preferences and patterns
- API version updates
- Tool availability changes
- Recent bug fixes and learnings

### When to Update This File

- After major bug fixes
- After discovering new patterns
- After system changes
- After learning team preferences
