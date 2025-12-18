import React from "react";
import {
  Container,
  Server,
  Globe,
  Database,
  Zap,
  Cog,
  Radio,
  Bot,
  Clock,
  DoorOpen,
  Shield,
  Lock,
  Plug,
  ClipboardList,
  BookOpen,
  Link,
  Wrench,
  Package,
  Activity,
  Rocket,
  type LucideIcon,
} from "lucide-react";
import "../styles/ServiceNode.css";

// Unified icon info type - can be either a string or LucideIcon
type IconInfo = {
  icon: string | LucideIcon;
  color: string;
  label: string;
};

// Helper to render an icon (string or Lucide component)
function renderIcon(
  icon: string | LucideIcon,
  size: number = 14
): React.ReactNode {
  if (typeof icon === "string") {
    return <span>{icon}</span>;
  }
  return React.createElement(icon, { size });
}

// File extension to icon mapping
const FILE_ICONS: Record<
  string,
  { icon: string; color: string; label: string }
> = {
  // TypeScript
  ".ts": { icon: "TS", color: "#3178c6", label: "TypeScript" },
  ".tsx": { icon: "TSX", color: "#3178c6", label: "TypeScript React" },

  // JavaScript
  ".js": { icon: "JS", color: "#f7df1e", label: "JavaScript" },
  ".jsx": { icon: "JSX", color: "#61dafb", label: "React JSX" },
  ".mjs": { icon: "MJS", color: "#f7df1e", label: "ES Module" },
  ".cjs": { icon: "CJS", color: "#f7df1e", label: "CommonJS" },

  // Python
  ".py": { icon: "PY", color: "#3776ab", label: "Python" },
  ".pyw": { icon: "PY", color: "#3776ab", label: "Python" },
  ".pyx": { icon: "PYX", color: "#3776ab", label: "Cython" },

  // Web
  ".html": { icon: "HTML", color: "#e34c26", label: "HTML" },
  ".css": { icon: "CSS", color: "#264de4", label: "CSS" },
  ".scss": { icon: "SCSS", color: "#c6538c", label: "SCSS" },
  ".sass": { icon: "SASS", color: "#c6538c", label: "Sass" },
  ".less": { icon: "LESS", color: "#1d365d", label: "Less" },

  // Data/Config
  ".json": { icon: "{ }", color: "#cbcb41", label: "JSON" },
  ".yaml": { icon: "YML", color: "#cb171e", label: "YAML" },
  ".yml": { icon: "YML", color: "#cb171e", label: "YAML" },
  ".toml": { icon: "TOML", color: "#9c4121", label: "TOML" },
  ".xml": { icon: "XML", color: "#f16529", label: "XML" },
  ".env": { icon: "ENV", color: "#ecd53f", label: "Environment" },

  // Documentation
  ".md": { icon: "MD", color: "#083fa1", label: "Markdown" },
  ".mdx": { icon: "MDX", color: "#fcb32c", label: "MDX" },
  ".txt": { icon: "TXT", color: "#89632a", label: "Text" },
  ".rst": { icon: "RST", color: "#141414", label: "reStructuredText" },

  // Database
  ".sql": { icon: "SQL", color: "#e38c00", label: "SQL" },
  ".db": { icon: "DB", color: "#003b57", label: "Database" },
  ".sqlite": { icon: "SQL", color: "#003b57", label: "SQLite" },

  // Shell/Scripts
  ".sh": { icon: "SH", color: "#4eaa25", label: "Shell" },
  ".bash": { icon: "BASH", color: "#4eaa25", label: "Bash" },
  ".ps1": { icon: "PS", color: "#012456", label: "PowerShell" },
  ".bat": { icon: "BAT", color: "#c1f12e", label: "Batch" },

  // Docker/DevOps
  ".dockerfile": { icon: "🐳", color: "#2496ed", label: "Dockerfile" },
  ".docker": { icon: "🐳", color: "#2496ed", label: "Docker" },

  // Go
  ".go": { icon: "GO", color: "#00add8", label: "Go" },

  // Rust
  ".rs": { icon: "RS", color: "#dea584", label: "Rust" },

  // C/C++
  ".c": { icon: "C", color: "#555555", label: "C" },
  ".cpp": { icon: "C++", color: "#f34b7d", label: "C++" },
  ".h": { icon: "H", color: "#555555", label: "Header" },
  ".hpp": { icon: "H++", color: "#f34b7d", label: "C++ Header" },

  // Java/Kotlin
  ".java": { icon: "JAVA", color: "#b07219", label: "Java" },
  ".kt": { icon: "KT", color: "#7f52ff", label: "Kotlin" },

  // Ruby
  ".rb": { icon: "RB", color: "#cc342d", label: "Ruby" },

  // PHP
  ".php": { icon: "PHP", color: "#777bb4", label: "PHP" },

  // Swift
  ".swift": { icon: "SWIFT", color: "#f05138", label: "Swift" },

  // Images
  ".svg": { icon: "SVG", color: "#ffb13b", label: "SVG" },
  ".png": { icon: "IMG", color: "#a4c639", label: "PNG" },
  ".jpg": { icon: "IMG", color: "#a4c639", label: "JPEG" },
  ".jpeg": { icon: "IMG", color: "#a4c639", label: "JPEG" },
  ".gif": { icon: "GIF", color: "#a4c639", label: "GIF" },
  ".ico": { icon: "ICO", color: "#a4c639", label: "Icon" },

  // Package/Lock files
  "package.json": { icon: "NPM", color: "#cb3837", label: "NPM Package" },
  "package-lock.json": { icon: "NPM", color: "#cb3837", label: "NPM Lock" },
  "yarn.lock": { icon: "YARN", color: "#2c8ebb", label: "Yarn Lock" },
  "pnpm-lock.yaml": { icon: "PNPM", color: "#f69220", label: "PNPM Lock" },
  "requirements.txt": {
    icon: "PIP",
    color: "#3776ab",
    label: "Python Requirements",
  },
  Pipfile: { icon: "PIP", color: "#3776ab", label: "Pipfile" },
  "Cargo.toml": { icon: "🦀", color: "#dea584", label: "Cargo" },
  "go.mod": { icon: "GO", color: "#00add8", label: "Go Modules" },

  // Config files
  "tsconfig.json": { icon: "TS", color: "#3178c6", label: "TypeScript Config" },
  "vite.config.ts": { icon: "⚡", color: "#646cff", label: "Vite Config" },
  "webpack.config.js": {
    icon: "WP",
    color: "#8dd6f9",
    label: "Webpack Config",
  },
  ".gitignore": { icon: "GIT", color: "#f05032", label: "Git Ignore" },
  ".eslintrc": { icon: "ESL", color: "#4b32c3", label: "ESLint" },
  ".prettierrc": { icon: "PRT", color: "#f7b93e", label: "Prettier" },
  Dockerfile: { icon: "🐳", color: "#2496ed", label: "Dockerfile" },
  "docker-compose.yml": {
    icon: "🐳",
    color: "#2496ed",
    label: "Docker Compose",
  },
};

// Main node types (servers/services) with Lucide icons
const SERVER_TYPES: Record<
  string,
  { icon: LucideIcon; color: string; label: string }
> = {
  backend: { icon: Server, color: "#10b981", label: "Backend Server" },
  frontend: { icon: Globe, color: "#3b82f6", label: "Frontend Server" },
  database: { icon: Database, color: "#f59e0b", label: "Database" },
  redis: { icon: Zap, color: "#dc2626", label: "Redis Cache" },
  worker: { icon: Cog, color: "#8b5cf6", label: "Worker" },
  api: { icon: Radio, color: "#06b6d4", label: "API Server" },
  discord: { icon: Bot, color: "#5865f2", label: "Discord Bot" },
  scheduler: { icon: Clock, color: "#ec4899", label: "Scheduler" },
  gateway: { icon: DoorOpen, color: "#6366f1", label: "Gateway" },
  nginx: { icon: Shield, color: "#009639", label: "Nginx" },
  caddy: { icon: Lock, color: "#22d3ee", label: "Caddy" },
  websocket: { icon: Plug, color: "#7c3aed", label: "WebSocket" },
};

// Planning/utility node types with Lucide icons
const UTILITY_TYPES: Record<
  string,
  { icon: LucideIcon; color: string; label: string }
> = {
  planning: { icon: ClipboardList, color: "#5865f2", label: "Planning" },
  documentation: { icon: BookOpen, color: "#3b82f6", label: "Documentation" },
  integration: { icon: Link, color: "#8b5cf6", label: "Integration" },
  utility: { icon: Wrench, color: "#6b7280", label: "Utility" },
  library: { icon: Package, color: "#f97316", label: "Library" },
  service: { icon: Activity, color: "#14b8a6", label: "Service" },
};

export interface NodeData {
  id: string;
  label: string;
  type:
    | "server"
    | "file"
    | "utility"
    | "planning"
    | "backend"
    | "frontend"
    | "database"
    | "api"
    | "discord-bot";

  // Parent node ID for hierarchy
  parentId?: string;

  // View state (for canvas navigation)
  isViewParent?: boolean;

  // For server nodes
  serverType?: keyof typeof SERVER_TYPES;
  status?: "running" | "stopped" | "error" | "starting" | "stopping";

  // Enhanced server metrics
  port?: number;
  cpuUsage?: number; // percentage 0-100
  memoryUsage?: number; // percentage 0-100
  uptime?: string; // e.g., "2d 5h", "15m"
  lastBuild?: string; // e.g., "2 hours ago"

  // For file nodes
  fileName?: string;
  fileExtension?: string;

  // For utility nodes
  utilityType?: keyof typeof UTILITY_TYPES;

  // AI Accuracy (for planning nodes)
  aiAccuracy?: number;

  // Deployment state
  isDeployed?: boolean;
  deployUrl?: string;
  lastDeployed?: string; // e.g., "2 hours ago"

  // Common
  lastUpdate?: string;
  description?: string;
  x: number;
  y: number;
}

interface ServiceNodeProps {
  node: NodeData;
  onMouseDown: (nodeId: string, e: React.MouseEvent) => void;
  onDoubleClick?: (nodeId: string) => void;
  onContextMenu?: (nodeId: string, e: React.MouseEvent) => void;
}

// Helper to get file icon info
function getFileIcon(
  fileName: string,
  extension?: string
): { icon: string; color: string; label: string } {
  // Check full filename first (for special files like package.json)
  if (FILE_ICONS[fileName]) {
    return FILE_ICONS[fileName];
  }

  // Check extension
  const ext = extension || fileName.substring(fileName.lastIndexOf("."));
  if (FILE_ICONS[ext]) {
    return FILE_ICONS[ext];
  }

  // Default file icon
  return { icon: "FILE", color: "#6b7280", label: "File" };
}

export const ServiceNode: React.FC<ServiceNodeProps> = ({
  node,
  onMouseDown,
  onDoubleClick,
  onContextMenu,
}) => {
  // Determine icon and color based on node type
  let iconInfo: IconInfo;
  let isServer = false;
  let showStatus = false;

  // Handle new direct node types (planning, backend, frontend, etc.)
  const directNodeTypes = [
    "planning",
    "backend",
    "frontend",
    "database",
    "api",
    "discord-bot",
  ];

  if (directNodeTypes.includes(node.type)) {
    // New direct node types from planning generation
    if (node.type === "planning") {
      iconInfo = UTILITY_TYPES.planning;
      showStatus = true;
    } else if (node.type === "backend") {
      iconInfo = SERVER_TYPES.backend;
      isServer = true;
      showStatus = true;
    } else if (node.type === "frontend") {
      iconInfo = SERVER_TYPES.frontend;
      isServer = true;
      showStatus = true;
    } else if (node.type === "database") {
      iconInfo = SERVER_TYPES.database;
      isServer = true;
      showStatus = true;
    } else if (node.type === "api") {
      iconInfo = SERVER_TYPES.api;
      isServer = true;
      showStatus = true;
    } else if (node.type === "discord-bot") {
      iconInfo = SERVER_TYPES.discord;
      isServer = true;
      showStatus = true;
    } else {
      iconInfo = { icon: Package, color: "#6b7280", label: "Node" };
    }
  } else if (node.type === "server" && node.serverType) {
    iconInfo = SERVER_TYPES[node.serverType] || SERVER_TYPES.backend;
    isServer = true;
    showStatus = true;
  } else if (node.type === "file" && node.fileName) {
    iconInfo = getFileIcon(node.fileName, node.fileExtension);
  } else if (node.type === "utility" && node.utilityType) {
    iconInfo = UTILITY_TYPES[node.utilityType] || UTILITY_TYPES.utility;
    showStatus = node.utilityType === "planning"; // Show AI accuracy for planning
  } else {
    iconInfo = { icon: Package, color: "#6b7280", label: "Node" };
  }

  const status = node.status || "stopped";

  // Check if this is a main node (server, planning, or generated type)
  const isMainNode =
    isServer ||
    node.type === "planning" ||
    (node.type === "utility" && node.utilityType === "planning");

  // Build class names
  const classNames = [
    "service-node",
    isMainNode ? "main-node" : "",
    isServer ? `node-${status}` : "",
    node.type === "planning" ||
    (node.type === "utility" && node.utilityType === "planning")
      ? "planning-node"
      : "",
    node.isViewParent ? "view-parent-node" : "",
    node.isDeployed ? "deployed-node" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={classNames}
      style={
        {
          "--node-accent": iconInfo.color,
        } as React.CSSProperties
      }
      onMouseDown={(e) => {
        e.stopPropagation();
        onMouseDown(node.id, e);
      }}
      onDoubleClick={() => onDoubleClick?.(node.id)}
      onContextMenu={(e) => onContextMenu?.(node.id, e)}
    >
      {/* Node Header */}
      <div className="node-header">
        <div
          className="node-icon"
          style={{
            background: `${iconInfo.color}20`,
            color: iconInfo.color,
          }}
        >
          {renderIcon(iconInfo.icon, 16)}
        </div>
        <div className="node-title">
          <h4 className="node-label">{node.label}</h4>
          <span className="node-type-label">{iconInfo.label}</span>
        </div>
        {/* Deployed Badge */}
        {node.isDeployed && (
          <div
            className="deployed-badge"
            title={
              node.deployUrl ? `Deployed to ${node.deployUrl}` : "Deployed"
            }
          >
            <span className="deployed-icon">
              <Rocket size={12} />
            </span>
            <span className="deployed-text">Live</span>
          </div>
        )}
      </div>

      {/* Server Status Indicator (for servers only) */}
      {isServer && showStatus && (
        <div className={`node-status status-${status}`}>
          <div className="status-indicator">
            <span className={`status-dot ${status}`}></span>
            <span className="status-label">
              {status === "running" && "Running"}
              {status === "stopped" && "Stopped"}
              {status === "error" && "Error"}
              {status === "starting" && "Starting..."}
              {status === "stopping" && "Stopping..."}
            </span>
          </div>
          {node.lastUpdate && (
            <span className="last-update">{node.lastUpdate}</span>
          )}
        </div>
      )}

      {/* Enhanced Server Metrics (for running servers) */}
      {isServer &&
        (node.port ||
          node.uptime ||
          node.lastBuild ||
          node.cpuUsage !== undefined) && (
          <div className="node-metrics">
            {node.port && (
              <div className="metric-item">
                <span className="metric-label">Port</span>
                <span className="metric-value">:{node.port}</span>
              </div>
            )}
            {node.uptime && status === "running" && (
              <div className="metric-item">
                <span className="metric-label">Uptime</span>
                <span className="metric-value">{node.uptime}</span>
              </div>
            )}
            {node.lastBuild && (
              <div className="metric-item">
                <span className="metric-label">Last Build</span>
                <span className="metric-value">{node.lastBuild}</span>
              </div>
            )}
            {(node.cpuUsage !== undefined || node.memoryUsage !== undefined) &&
              status === "running" && (
                <div className="metric-usage">
                  {node.cpuUsage !== undefined && (
                    <div className="usage-bar">
                      <span className="usage-label">CPU</span>
                      <div className="usage-track">
                        <div
                          className={`usage-fill ${node.cpuUsage > 80 ? "high" : node.cpuUsage > 50 ? "medium" : "low"}`}
                          style={{ width: `${node.cpuUsage}%` }}
                        />
                      </div>
                      <span className="usage-value">{node.cpuUsage}%</span>
                    </div>
                  )}
                  {node.memoryUsage !== undefined && (
                    <div className="usage-bar">
                      <span className="usage-label">MEM</span>
                      <div className="usage-track">
                        <div
                          className={`usage-fill ${node.memoryUsage > 80 ? "high" : node.memoryUsage > 50 ? "medium" : "low"}`}
                          style={{ width: `${node.memoryUsage}%` }}
                        />
                      </div>
                      <span className="usage-value">{node.memoryUsage}%</span>
                    </div>
                  )}
                </div>
              )}
          </div>
        )}

      {/* AI Accuracy (for planning nodes only) */}
      {node.type === "utility" &&
        node.utilityType === "planning" &&
        typeof node.aiAccuracy === "number" && (
          <div className="node-accuracy">
            <div className="accuracy-bar">
              <div
                className="accuracy-fill"
                style={{ width: `${node.aiAccuracy}%` }}
              ></div>
            </div>
            <span className="accuracy-label">
              AI Accuracy: {node.aiAccuracy}%
            </span>
          </div>
        )}

      {/* File info (for file nodes) */}
      {node.type === "file" && node.fileName && (
        <div className="node-file-info">
          <span className="file-name">{node.fileName}</span>
          {node.description && (
            <span className="file-description">{node.description}</span>
          )}
        </div>
      )}

      {/* Connection Ports */}
      <div className="node-ports">
        <div className="port port-in" title="Input"></div>
        <div className="port port-out" title="Output"></div>
      </div>
    </div>
  );
};

export { FILE_ICONS, SERVER_TYPES, UTILITY_TYPES, getFileIcon };
