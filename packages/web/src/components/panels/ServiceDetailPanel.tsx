/**
 * Service Detail Panel
 *
 * Shows detailed view of a service when double-clicked:
 * - API: Shows endpoints
 * - Bot: Shows commands
 * - Web: Shows pages/components
 * - Database: Shows tables/schemas
 */

import React, { useState, useEffect } from "react";
import {
  X,
  Globe,
  Server,
  Database,
  Bot,
  Zap,
  FileCode,
  FolderTree,
  Terminal,
  Play,
  Square,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  ChevronRight,
  Search,
  Filter,
  Code,
  Route,
  Command,
  Layout,
  Table,
  Layers,
} from "lucide-react";
import "./ServiceDetailPanel.css";

// ============================================
// TYPES
// ============================================

export type ServiceType =
  | "api"
  | "web"
  | "bot"
  | "database"
  | "worker"
  | "cache"
  | "other";

interface Endpoint {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  description: string;
  handler?: string;
  file?: string;
}

interface BotCommand {
  name: string;
  description: string;
  usage?: string;
  file?: string;
  category?: string;
}

interface WebPage {
  path: string;
  name: string;
  component?: string;
  file?: string;
}

interface WebComponent {
  name: string;
  file?: string;
  props?: string[];
}

interface DatabaseTable {
  name: string;
  columns: number;
  rows?: number;
  file?: string;
}

interface ServiceDetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  serviceId: string;
  serviceName: string;
  serviceType: ServiceType;
  status?: "running" | "stopped" | "error";
  port?: number;
  onOpenFile?: (filePath: string) => void;
  onStartService?: () => void;
  onStopService?: () => void;
  onRestartService?: () => void;
}

// ============================================
// MOCK DATA (Replace with real API calls)
// ============================================

const MOCK_ENDPOINTS: Endpoint[] = [
  {
    method: "GET",
    path: "/api/users",
    description: "List all users",
    file: "routes/users.ts",
  },
  {
    method: "POST",
    path: "/api/users",
    description: "Create user",
    file: "routes/users.ts",
  },
  {
    method: "GET",
    path: "/api/users/:id",
    description: "Get user by ID",
    file: "routes/users.ts",
  },
  {
    method: "PUT",
    path: "/api/users/:id",
    description: "Update user",
    file: "routes/users.ts",
  },
  {
    method: "DELETE",
    path: "/api/users/:id",
    description: "Delete user",
    file: "routes/users.ts",
  },
  {
    method: "GET",
    path: "/api/projects",
    description: "List projects",
    file: "routes/projects.ts",
  },
  {
    method: "POST",
    path: "/api/projects",
    description: "Create project",
    file: "routes/projects.ts",
  },
  {
    method: "GET",
    path: "/api/health",
    description: "Health check",
    file: "routes/health.ts",
  },
];

const MOCK_COMMANDS: BotCommand[] = [
  {
    name: "/help",
    description: "Show help menu",
    category: "General",
    file: "commands/help.js",
  },
  {
    name: "/ping",
    description: "Check bot latency",
    category: "General",
    file: "commands/ping.js",
  },
  {
    name: "/play",
    description: "Play a song",
    usage: "/play <song>",
    category: "Music",
    file: "commands/music/play.js",
  },
  {
    name: "/queue",
    description: "Show music queue",
    category: "Music",
    file: "commands/music/queue.js",
  },
  {
    name: "/skip",
    description: "Skip current song",
    category: "Music",
    file: "commands/music/skip.js",
  },
  {
    name: "/ban",
    description: "Ban a user",
    usage: "/ban <user> [reason]",
    category: "Moderation",
    file: "commands/mod/ban.js",
  },
  {
    name: "/kick",
    description: "Kick a user",
    usage: "/kick <user> [reason]",
    category: "Moderation",
    file: "commands/mod/kick.js",
  },
  {
    name: "/mute",
    description: "Mute a user",
    usage: "/mute <user> <duration>",
    category: "Moderation",
    file: "commands/mod/mute.js",
  },
];

const MOCK_PAGES: WebPage[] = [
  {
    path: "/",
    name: "Landing Page",
    component: "Landing",
    file: "pages/Landing.tsx",
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: "Dashboard",
    file: "pages/Dashboard.tsx",
  },
  {
    path: "/signin",
    name: "Sign In",
    component: "SignIn",
    file: "pages/SignIn.tsx",
  },
  {
    path: "/admin",
    name: "Admin Panel",
    component: "AdminPanel",
    file: "pages/AdminPanel.tsx",
  },
  {
    path: "/canvas/:id",
    name: "Canvas View",
    component: "CanvasView",
    file: "pages/CanvasView.tsx",
  },
];

const MOCK_COMPONENTS: WebComponent[] = [
  { name: "Header", file: "components/Header.tsx", props: ["title", "onBack"] },
  {
    name: "SidePanel",
    file: "components/SidePanel.tsx",
    props: ["isOpen", "children"],
  },
  {
    name: "CommandPalette",
    file: "components/CommandPalette.tsx",
    props: ["isOpen", "onClose"],
  },
  {
    name: "CopilotChat",
    file: "components/CopilotChat.tsx",
    props: ["projectId"],
  },
];

const MOCK_TABLES: DatabaseTable[] = [
  { name: "users", columns: 8, rows: 156, file: "migrations/001_users.sql" },
  {
    name: "projects",
    columns: 12,
    rows: 45,
    file: "migrations/002_projects.sql",
  },
  { name: "nodes", columns: 15, rows: 234, file: "migrations/003_nodes.sql" },
  { name: "teams", columns: 6, rows: 12, file: "migrations/004_teams.sql" },
  {
    name: "audit_logs",
    columns: 10,
    rows: 1250,
    file: "migrations/005_audit.sql",
  },
];

// ============================================
// METHOD COLORS
// ============================================

const METHOD_COLORS: Record<string, string> = {
  GET: "#48bb78",
  POST: "#4299e1",
  PUT: "#ed8936",
  PATCH: "#9f7aea",
  DELETE: "#f56565",
};

// ============================================
// COMPONENT
// ============================================

export const ServiceDetailPanel: React.FC<ServiceDetailPanelProps> = ({
  isOpen,
  onClose,
  serviceId,
  serviceName,
  serviceType,
  status = "running",
  port,
  onOpenFile,
  onStartService,
  onStopService,
  onRestartService,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState<string>("all");
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setActiveSection("all");
    }
  }, [isOpen]);

  const handleCopyPath = (path: string) => {
    navigator.clipboard.writeText(path);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  const handleOpenFile = (file?: string) => {
    if (file && onOpenFile) {
      onOpenFile(file);
    }
  };

  const getServiceIcon = () => {
    switch (serviceType) {
      case "api":
        return <Server size={24} />;
      case "web":
        return <Globe size={24} />;
      case "bot":
        return <Bot size={24} />;
      case "database":
        return <Database size={24} />;
      case "worker":
        return <Zap size={24} />;
      default:
        return <Layers size={24} />;
    }
  };

  const renderAPIContent = () => {
    const filtered = MOCK_ENDPOINTS.filter(
      (e) =>
        e.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="service-detail-content">
        <div className="content-header">
          <Route size={18} />
          <span>API Endpoints</span>
          <span className="count">{filtered.length}</span>
        </div>
        <div className="endpoints-list">
          {filtered.map((endpoint, idx) => (
            <div
              key={idx}
              className="endpoint-item"
              onClick={() => handleOpenFile(endpoint.file)}
            >
              <span
                className="method-badge"
                style={{ background: METHOD_COLORS[endpoint.method] }}
              >
                {endpoint.method}
              </span>
              <span className="endpoint-path">{endpoint.path}</span>
              <span className="endpoint-desc">{endpoint.description}</span>
              <button
                className="copy-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyPath(endpoint.path);
                }}
              >
                {copiedPath === endpoint.path ? (
                  <Check size={14} />
                ) : (
                  <Copy size={14} />
                )}
              </button>
              <ChevronRight size={16} className="chevron" />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderBotContent = () => {
    const filtered = MOCK_COMMANDS.filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const categories = [...new Set(filtered.map((c) => c.category || "Other"))];

    return (
      <div className="service-detail-content">
        <div className="content-header">
          <Command size={18} />
          <span>Bot Commands</span>
          <span className="count">{filtered.length}</span>
        </div>
        {categories.map((category) => (
          <div key={category} className="command-category">
            <h4 className="category-title">{category}</h4>
            <div className="commands-list">
              {filtered
                .filter((c) => (c.category || "Other") === category)
                .map((cmd, idx) => (
                  <div
                    key={idx}
                    className="command-item"
                    onClick={() => handleOpenFile(cmd.file)}
                  >
                    <span className="command-name">{cmd.name}</span>
                    <span className="command-desc">{cmd.description}</span>
                    {cmd.usage && (
                      <span className="command-usage">{cmd.usage}</span>
                    )}
                    <ChevronRight size={16} className="chevron" />
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderWebContent = () => {
    const filteredPages = MOCK_PAGES.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.path.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredComponents = MOCK_COMPONENTS.filter((c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="service-detail-content">
        <div className="content-section">
          <div className="content-header">
            <Layout size={18} />
            <span>Pages</span>
            <span className="count">{filteredPages.length}</span>
          </div>
          <div className="pages-list">
            {filteredPages.map((page, idx) => (
              <div
                key={idx}
                className="page-item"
                onClick={() => handleOpenFile(page.file)}
              >
                <span className="page-path">{page.path}</span>
                <span className="page-name">{page.name}</span>
                <span className="page-component">
                  &lt;{page.component} /&gt;
                </span>
                <ChevronRight size={16} className="chevron" />
              </div>
            ))}
          </div>
        </div>

        <div className="content-section">
          <div className="content-header">
            <Code size={18} />
            <span>Components</span>
            <span className="count">{filteredComponents.length}</span>
          </div>
          <div className="components-list">
            {filteredComponents.map((comp, idx) => (
              <div
                key={idx}
                className="component-item"
                onClick={() => handleOpenFile(comp.file)}
              >
                <span className="component-name">&lt;{comp.name} /&gt;</span>
                {comp.props && (
                  <span className="component-props">
                    {comp.props.length} props
                  </span>
                )}
                <ChevronRight size={16} className="chevron" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderDatabaseContent = () => {
    const filtered = MOCK_TABLES.filter((t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="service-detail-content">
        <div className="content-header">
          <Table size={18} />
          <span>Tables</span>
          <span className="count">{filtered.length}</span>
        </div>
        <div className="tables-list">
          {filtered.map((table, idx) => (
            <div
              key={idx}
              className="table-item"
              onClick={() => handleOpenFile(table.file)}
            >
              <Database size={16} className="table-icon" />
              <span className="table-name">{table.name}</span>
              <span className="table-info">
                {table.columns} cols • {table.rows?.toLocaleString()} rows
              </span>
              <ChevronRight size={16} className="chevron" />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (serviceType) {
      case "api":
        return renderAPIContent();
      case "bot":
        return renderBotContent();
      case "web":
        return renderWebContent();
      case "database":
        return renderDatabaseContent();
      default:
        return (
          <div className="service-detail-content">
            <div className="empty-state">
              <FolderTree size={48} />
              <p>No detailed view available for this service type</p>
            </div>
          </div>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="service-detail-overlay" onClick={onClose}>
      <div
        className="service-detail-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="panel-header">
          <div className="service-info">
            <div className={`service-icon ${serviceType}`}>
              {getServiceIcon()}
            </div>
            <div className="service-meta">
              <h2>{serviceName}</h2>
              <div className="service-tags">
                <span className={`status-badge ${status}`}>{status}</span>
                {port && <span className="port-badge">:{port}</span>}
              </div>
            </div>
          </div>
          <div className="header-actions">
            {status === "running" ? (
              <>
                <button
                  className="action-btn"
                  onClick={onStopService}
                  title="Stop"
                >
                  <Square size={16} />
                </button>
                <button
                  className="action-btn"
                  onClick={onRestartService}
                  title="Restart"
                >
                  <RefreshCw size={16} />
                </button>
              </>
            ) : (
              <button
                className="action-btn primary"
                onClick={onStartService}
                title="Start"
              >
                <Play size={16} />
              </button>
            )}
            <button className="action-btn" title="Open Terminal">
              <Terminal size={16} />
            </button>
            <button className="close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="panel-search">
          <Search size={16} />
          <input
            type="text"
            placeholder={`Search ${serviceType === "api" ? "endpoints" : serviceType === "bot" ? "commands" : "files"}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </div>

        {/* Content */}
        <div className="panel-body">{renderContent()}</div>

        {/* Footer */}
        <div className="panel-footer">
          <span className="footer-hint">
            Click an item to open its source code
          </span>
          <button className="footer-btn" onClick={() => handleOpenFile("")}>
            <ExternalLink size={14} />
            Open in Editor
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPanel;
