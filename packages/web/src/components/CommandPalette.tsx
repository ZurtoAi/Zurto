/**
 * Command Palette
 *
 * Universal command bar for:
 * - Navigation between services/files
 * - Running commands (deploy, restart, etc.)
 * - Quick actions
 * - API endpoint discovery
 *
 * Triggered by Ctrl+K or Ctrl+P
 */

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Search,
  Terminal,
  Rocket,
  Server,
  Globe,
  Code,
  Settings,
  FileCode,
  Folder,
  Play,
  Square,
  RefreshCw,
  ExternalLink,
  Zap,
  Database,
  Bot,
  ChevronRight,
  Command as CommandIcon,
} from "lucide-react";
import "./CommandPalette.css";

// Command Types
interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  category: "navigation" | "action" | "service" | "file" | "api" | "settings";
  shortcut?: string;
  action: () => void;
  keywords?: string[];
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
  currentServiceId?: string;
  onNavigateToService?: (serviceId: string) => void;
  onOpenFile?: (path: string, serviceId: string) => void;
  onDeploy?: () => void;
  onRestartService?: (serviceId: string) => void;
  onOpenTerminal?: (serviceId: string) => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  projectId,
  currentServiceId,
  onNavigateToService,
  onOpenFile,
  onDeploy,
  onRestartService,
  onOpenTerminal,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mode, setMode] = useState<"commands" | "files" | "api">("commands");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Define available commands
  const allCommands: CommandItem[] = [
    // Navigation commands
    {
      id: "nav-dashboard",
      label: "Go to Dashboard",
      description: "Return to project dashboard",
      icon: <Folder size={16} />,
      category: "navigation",
      shortcut: "Alt+D",
      action: () => {
        window.location.href = "/dashboard";
        onClose();
      },
      keywords: ["home", "projects", "back"],
    },
    {
      id: "nav-admin",
      label: "Admin Panel",
      description: "Open admin panel",
      icon: <Settings size={16} />,
      category: "navigation",
      action: () => {
        window.location.href = "/admin";
        onClose();
      },
      keywords: ["settings", "admin", "manage"],
    },

    // Action commands
    {
      id: "action-deploy",
      label: "Deploy Project",
      description: "Deploy current project to production",
      icon: <Rocket size={16} />,
      category: "action",
      shortcut: "Ctrl+Shift+D",
      action: () => {
        onDeploy?.();
        onClose();
      },
      keywords: ["publish", "build", "release"],
    },
    {
      id: "action-terminal",
      label: "Open Terminal",
      description: "Open terminal for current service",
      icon: <Terminal size={16} />,
      category: "action",
      shortcut: "Ctrl+`",
      action: () => {
        if (currentServiceId) {
          onOpenTerminal?.(currentServiceId);
        }
        onClose();
      },
      keywords: ["console", "shell", "cli"],
    },

    // Service commands
    {
      id: "service-api",
      label: "API Service",
      description: "Navigate to api/ folder",
      icon: <Server size={16} />,
      category: "service",
      action: () => {
        onNavigateToService?.("api");
        onClose();
      },
      keywords: ["backend", "server", "express"],
    },
    {
      id: "service-web",
      label: "Web Service",
      description: "Navigate to web/ folder",
      icon: <Globe size={16} />,
      category: "service",
      action: () => {
        onNavigateToService?.("web");
        onClose();
      },
      keywords: ["frontend", "react", "ui"],
    },
    {
      id: "service-bot",
      label: "Bot Service",
      description: "Navigate to bot/ folder",
      icon: <Bot size={16} />,
      category: "service",
      action: () => {
        onNavigateToService?.("bot");
        onClose();
      },
      keywords: ["discord", "automation"],
    },
    {
      id: "service-database",
      label: "Database Service",
      description: "Navigate to database/ folder",
      icon: <Database size={16} />,
      category: "service",
      action: () => {
        onNavigateToService?.("database");
        onClose();
      },
      keywords: ["mysql", "postgres", "sql"],
    },

    // API endpoint commands
    {
      id: "api-health",
      label: "GET /api/health",
      description: "Check API health status",
      icon: <Zap size={16} />,
      category: "api",
      action: () => {
        window.open(
          `${import.meta.env.VITE_API_URL || ""}/api/health`,
          "_blank"
        );
        onClose();
      },
      keywords: ["ping", "status", "check"],
    },
    {
      id: "api-projects",
      label: "GET /api/projects",
      description: "List all projects",
      icon: <Code size={16} />,
      category: "api",
      action: () => {
        window.open(
          `${import.meta.env.VITE_API_URL || ""}/api/projects`,
          "_blank"
        );
        onClose();
      },
      keywords: ["list", "all"],
    },
  ];

  // Filter commands based on query
  const filteredCommands = allCommands.filter((cmd) => {
    if (!query) return true;
    const searchLower = query.toLowerCase();
    return (
      cmd.label.toLowerCase().includes(searchLower) ||
      cmd.description?.toLowerCase().includes(searchLower) ||
      cmd.keywords?.some((k) => k.toLowerCase().includes(searchLower))
    );
  });

  // Group commands by category
  const groupedCommands = filteredCommands.reduce(
    (acc, cmd) => {
      if (!acc[cmd.category]) {
        acc[cmd.category] = [];
      }
      acc[cmd.category].push(cmd);
      return acc;
    },
    {} as Record<string, CommandItem[]>
  );

  const categoryLabels: Record<string, string> = {
    navigation: "Navigation",
    action: "Actions",
    service: "Services",
    file: "Files",
    api: "API Endpoints",
    settings: "Settings",
  };

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          Math.min(prev + 1, filteredCommands.length - 1)
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && filteredCommands[selectedIndex]) {
        e.preventDefault();
        filteredCommands[selectedIndex].action();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    },
    [filteredCommands, selectedIndex, onClose]
  );

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Scroll selected item into view
  useEffect(() => {
    const selectedItem = listRef.current?.querySelector(
      `[data-index="${selectedIndex}"]`
    );
    selectedItem?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  if (!isOpen) return null;

  let flatIndex = 0;

  return (
    <div className="command-palette-overlay" onClick={onClose}>
      <div
        className="command-palette"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input */}
        <div className="command-input-wrapper">
          <CommandIcon size={16} className="command-icon" />
          <input
            ref={inputRef}
            type="text"
            className="command-input"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <kbd className="command-kbd">ESC</kbd>
        </div>

        {/* Mode Tabs */}
        <div className="command-modes">
          <button
            className={`mode-tab ${mode === "commands" ? "active" : ""}`}
            onClick={() => setMode("commands")}
          >
            <CommandIcon size={14} />
            Commands
          </button>
          <button
            className={`mode-tab ${mode === "files" ? "active" : ""}`}
            onClick={() => setMode("files")}
          >
            <FileCode size={14} />
            Files
          </button>
          <button
            className={`mode-tab ${mode === "api" ? "active" : ""}`}
            onClick={() => setMode("api")}
          >
            <Zap size={14} />
            API
          </button>
        </div>

        {/* Results */}
        <div className="command-results" ref={listRef}>
          {filteredCommands.length === 0 ? (
            <div className="command-empty">
              <Search size={24} />
              <span>No commands found</span>
            </div>
          ) : (
            Object.entries(groupedCommands).map(([category, commands]) => (
              <div key={category} className="command-group">
                <div className="command-group-label">
                  {categoryLabels[category] || category}
                </div>
                {commands.map((cmd) => {
                  const isSelected = flatIndex === selectedIndex;
                  const currentIndex = flatIndex;
                  flatIndex++;
                  return (
                    <div
                      key={cmd.id}
                      data-index={currentIndex}
                      className={`command-item ${isSelected ? "selected" : ""}`}
                      onClick={() => cmd.action()}
                      onMouseEnter={() => setSelectedIndex(currentIndex)}
                    >
                      <div className="command-item-icon">{cmd.icon}</div>
                      <div className="command-item-content">
                        <span className="command-item-label">{cmd.label}</span>
                        {cmd.description && (
                          <span className="command-item-desc">
                            {cmd.description}
                          </span>
                        )}
                      </div>
                      {cmd.shortcut && (
                        <kbd className="command-shortcut">{cmd.shortcut}</kbd>
                      )}
                      <ChevronRight size={14} className="command-arrow" />
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="command-footer">
          <div className="command-hint">
            <kbd>↑↓</kbd> navigate
            <kbd>↵</kbd> select
            <kbd>esc</kbd> close
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommandPalette;
