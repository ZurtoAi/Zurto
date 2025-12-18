# Zurto External Agent - Persistent Memory Loader

> **FOR**: GitHub Copilot (Claude Haiku 4.5)  
> **LOCATION**: `.github/prompts/` (nested memory system)  
> **PURPOSE**: Load and maintain persistent context between sessions  
> **STATUS**: ✅ ENABLED

---

## 📋 Session Startup: Load These In Order

When starting a new Copilot session, reference these files (they auto-load as context):

1. **`identity.prompt.md`** ← Agent identity, capabilities, rules
2. **`apis.prompt.md`** ← Complete API reference and patterns
3. **`system-context.prompt.md`** ← Architecture, deployment, services
4. **`memories.prompt.md`** ← Recent learnings and discoveries
5. **`project-state.prompt.md`** ← Current project status and open work
6. **`tools-enabled.prompt.md`** ← Available tools and optimization rules

---

## 🔄 How This Works

### Session Start (You do this)

1. Open VS Code Copilot Chat
2. Ask me to load context from `.github/prompts/`
3. I read all 6 files and combine them as working context

### During Work (Automatic)

1. I reference the loaded context throughout the session
2. I don't repeat what's already in the prompts
3. I work efficiently using the provided context

### Session End (You do this)

1. Ask me to update the memory files with learnings
2. I modify the appropriate `.prompt.md` files
3. Context persists for next session

---

## ✅ What This Enables

- **Persistent Memory**: Knowledge survives between sessions
- **Efficient Context**: Pre-loaded instead of rebuilding each time
- **Modular Structure**: Easy to update specific areas
- **External Storage**: Not dependent on internal Zurto memory alone
- **Copilot-Native**: Works directly in VS Code Chat

---

## 📁 File Organization

```
.github/prompts/
├── test.prompt.md              ← THIS FILE (Loader & Index)
├── identity.prompt.md          ← Agent identity & capabilities
├── apis.prompt.md              ← API reference
├── system-context.prompt.md    ← Architecture overview
├── memories.prompt.md          ← Recent learnings
├── project-state.prompt.md     ← Current projects & tasks
└── tools-enabled.prompt.md     ← Tools configuration
```

---

## 🚀 To Test This Setup

Ask me:

> "Load context from .github/prompts/"

Or:

> "What's in my persistent memory?"

I'll read all files and show you what's loaded.

---

## 🔐 Important Notes

- These files are your **external memory** backup
- They complement the internal Zurto memory system
- Update them after significant work sessions
- Use version control (git) to track changes
- They're markdown files for easy reading/editing
