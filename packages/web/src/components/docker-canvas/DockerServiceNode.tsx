/**
 * Docker Service Node
 *
 * A ReactFlow node component for Docker services
 * Displays status, controls, and metrics for container management
 */

import React, { useState, useCallback, memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import {
  Globe,
  Server,
  Database,
  Zap,
  Cog,
  Network,
  Package,
  Play,
  Square,
  Loader,
  FileText,
  RefreshCw,
  RotateCcw,
  Terminal,
  Clock,
  Heart,
  AlertCircle,
  Circle,
  type LucideIcon,
} from "lucide-react";
import "./DockerServiceNode.css";

// ============================================
// TYPES
// ============================================

export type ServiceType =
  | "frontend"
  | "backend"
  | "database"
  | "cache"
  | "worker"
  | "gateway"
  | "other";

export type ServiceStatus =
  | "running"
  | "stopped"
  | "restarting"
  | "building"
  | "error"
  | "unknown";

export interface ServiceStats {
  cpuPercent: number;
  memoryUsage: number;
  memoryLimit: number;
  memoryPercent: number;
}

export interface DockerServiceNodeData {
  id: string;
  name: string;
  displayName: string;
  type: ServiceType;
  status: ServiceStatus;
  port?: number;
  containerId?: string;
  image?: string;
  uptime?: string;
  stats?: ServiceStats;
  health?: "healthy" | "unhealthy" | "starting" | "none";

  // Callbacks
  onStart?: (serviceId: string) => void;
  onStop?: (serviceId: string) => void;
  onRestart?: (serviceId: string) => void;
  onRebuild?: (serviceId: string) => void;
  onViewLogs?: (serviceId: string) => void;
  onOpenTerminal?: (serviceId: string) => void;
  onDoubleClick?: (serviceId: string, serviceName: string) => void;
}

// ============================================
// ICONS & COLORS
// ============================================

const SERVICE_ICONS: Record<ServiceType, LucideIcon> = {
  frontend: Globe,
  backend: Server,
  database: Database,
  cache: Zap,
  worker: Cog,
  gateway: Network,
  other: Package,
};

const SERVICE_COLORS: Record<ServiceType, string> = {
  frontend: "#61dafb",
  backend: "#68d391",
  database: "#9f7aea",
  cache: "#f6ad55",
  worker: "#fc8181",
  gateway: "#4fd1c5",
  other: "#a0aec0",
};

const STATUS_COLORS: Record<ServiceStatus, string> = {
  running: "#48bb78",
  stopped: "#718096",
  restarting: "#ed8936",
  building: "#4299e1",
  error: "#f56565",
  unknown: "#a0aec0",
};

const STATUS_LABELS: Record<ServiceStatus, string> = {
  running: "Running",
  stopped: "Stopped",
  restarting: "Restarting...",
  building: "Building...",
  error: "Error",
  unknown: "Unknown",
};

// ============================================
// COMPONENT
// ============================================

function DockerServiceNodeComponent({
  data,
  selected,
}: NodeProps<DockerServiceNodeData>) {
  const [isHovered, setIsHovered] = useState(false);
  const [isActioning, setIsActioning] = useState(false);

  const handleStart = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (data.onStart && !isActioning) {
        setIsActioning(true);
        data.onStart(data.id);
        setTimeout(() => setIsActioning(false), 2000);
      }
    },
    [data, isActioning]
  );

  const handleStop = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (data.onStop && !isActioning) {
        setIsActioning(true);
        data.onStop(data.id);
        setTimeout(() => setIsActioning(false), 2000);
      }
    },
    [data, isActioning]
  );

  const handleRestart = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (data.onRestart && !isActioning) {
        setIsActioning(true);
        data.onRestart(data.id);
        setTimeout(() => setIsActioning(false), 2000);
      }
    },
    [data, isActioning]
  );

  const handleRebuild = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (data.onRebuild && !isActioning) {
        setIsActioning(true);
        data.onRebuild(data.id);
        setTimeout(() => setIsActioning(false), 5000);
      }
    },
    [data, isActioning]
  );

  const handleViewLogs = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      data.onViewLogs?.(data.id);
    },
    [data]
  );

  const handleOpenTerminal = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      data.onOpenTerminal?.(data.id);
    },
    [data]
  );

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      console.log("🔵 Double-click on node:", data.id, data.displayName);
      if (data.onDoubleClick) {
        data.onDoubleClick(data.id, data.displayName);
      }
    },
    [data]
  );

  const isRunning = data.status === "running";
  const isBusy =
    data.status === "building" || data.status === "restarting" || isActioning;

  return (
    <div
      className={`docker-service-node ${selected ? "selected" : ""} ${isHovered ? "hovered" : ""}`}
      style={
        {
          borderColor: SERVICE_COLORS[data.type],
          "--node-accent-color": SERVICE_COLORS[data.type],
        } as React.CSSProperties
      }
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDoubleClick={handleDoubleClick}
      tabIndex={0}
      role="button"
      aria-label={`${data.displayName} service - double click to view details`}
    >
      {/* Connection handles */}
      <Handle type="target" position={Position.Left} className="node-handle" />
      <Handle type="source" position={Position.Right} className="node-handle" />

      {/* Header */}
      <div
        className="node-header"
        style={{ backgroundColor: SERVICE_COLORS[data.type] + "20" }}
      >
        <span className="node-icon">
          {React.createElement(SERVICE_ICONS[data.type], { size: 16 })}
        </span>
        <span className="node-name">{data.displayName}</span>

        {/* Quick action button */}
        <button
          className={`quick-action-btn ${isRunning ? "stop" : "start"}`}
          onClick={isRunning ? handleStop : handleStart}
          disabled={isBusy}
          title={isRunning ? "Stop" : "Start"}
        >
          {isBusy ? (
            <Loader size={12} className="spin" />
          ) : isRunning ? (
            <Square size={12} />
          ) : (
            <Play size={12} />
          )}
        </button>
      </div>

      {/* Status bar */}
      <div className="node-status">
        <span
          className="status-indicator"
          style={{ backgroundColor: STATUS_COLORS[data.status] }}
        />
        <span className="status-label">{STATUS_LABELS[data.status]}</span>
        {data.port && <span className="port-badge">:{data.port}</span>}
      </div>

      {/* Health indicator */}
      {data.health && data.health !== "none" && (
        <div className={`health-indicator ${data.health}`}>
          {data.health === "healthy" && (
            <Heart size={12} className="health-icon healthy" />
          )}
          {data.health === "unhealthy" && (
            <AlertCircle size={12} className="health-icon unhealthy" />
          )}
          {data.health === "starting" && (
            <Circle size={12} className="health-icon starting" />
          )}
          <span>{data.health}</span>
        </div>
      )}

      {/* Metrics (only when running) */}
      {isRunning && data.stats && (
        <div className="node-metrics">
          <div className="metric">
            <span className="metric-label">CPU</span>
            <div className="metric-bar">
              <div
                className="metric-fill cpu"
                style={{ width: `${Math.min(data.stats.cpuPercent, 100)}%` }}
              />
            </div>
            <span className="metric-value">
              {data.stats.cpuPercent.toFixed(0)}%
            </span>
          </div>
          <div className="metric">
            <span className="metric-label">MEM</span>
            <div className="metric-bar">
              <div
                className="metric-fill memory"
                style={{ width: `${Math.min(data.stats.memoryPercent, 100)}%` }}
              />
            </div>
            <span className="metric-value">
              {data.stats.memoryUsage.toFixed(0)}MB
            </span>
          </div>
        </div>
      )}

      {/* Uptime */}
      {isRunning && data.uptime && (
        <div className="node-uptime">
          <Clock size={12} />
          <span>{data.uptime}</span>
        </div>
      )}

      {/* Action buttons */}
      <div className="node-actions">
        <button
          className="action-btn logs"
          onClick={handleViewLogs}
          title="View Logs"
        >
          <FileText size={14} />
        </button>
        <button
          className="action-btn rebuild"
          onClick={handleRebuild}
          disabled={isBusy}
          title="Rebuild"
        >
          <RefreshCw size={14} />
        </button>
        <button
          className="action-btn restart"
          onClick={handleRestart}
          disabled={isBusy || !isRunning}
          title="Restart"
        >
          <RotateCcw size={14} />
        </button>
        <button
          className="action-btn terminal"
          onClick={handleOpenTerminal}
          title="Terminal"
        >
          <Terminal size={14} />
        </button>
      </div>

      {/* Image info (on hover) */}
      {isHovered && data.image && (
        <div className="node-image-info">
          <span title={data.image}>{data.image.slice(0, 30)}...</span>
        </div>
      )}

      {/* Double-click hint */}
      <div className="double-click-hint">Double-click to view files</div>
    </div>
  );
}

export const DockerServiceNode = memo(DockerServiceNodeComponent);
