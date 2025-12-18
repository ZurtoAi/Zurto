import React from "react";
import {
  MoreVertical,
  Edit2,
  Copy,
  Trash2,
  Box,
  Clock,
  Users,
  Rocket,
  Server,
  Globe,
  Code,
  Database,
  Cpu,
  MemoryStick,
} from "lucide-react";
import "../styles/ProjectCard.css";

// Framework icons mapping
const frameworkIcons: Record<string, { icon: string; color: string }> = {
  react: { icon: "⚛️", color: "#61DAFB" },
  vue: { icon: "🟢", color: "#42B883" },
  angular: { icon: "🔴", color: "#DD0031" },
  next: { icon: "▲", color: "#000000" },
  express: { icon: "🚀", color: "#68A063" },
  nest: { icon: "🐱", color: "#E0234E" },
  python: { icon: "🐍", color: "#3776AB" },
  node: { icon: "🟩", color: "#339933" },
  discord: { icon: "🤖", color: "#5865F2" },
  postgres: { icon: "🐘", color: "#336791" },
  mongodb: { icon: "🍃", color: "#47A248" },
};

interface ProjectCardProps {
  id: string;
  name: string;
  nodeCount: number;
  status: "active" | "inactive" | "archived";
  lastModified: string;
  description?: string;
  teamName?: string;
  // New enhanced properties
  framework?: string;
  lastDeploy?: string;
  cpuUsage?: number;
  memoryUsage?: number;
  port?: number;
  uptime?: string;
  thumbnail?: string;
  onClick?: () => void;
  onDelete?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  name,
  nodeCount,
  status,
  lastModified,
  description,
  teamName,
  framework,
  lastDeploy,
  cpuUsage,
  memoryUsage,
  port,
  uptime,
  thumbnail,
  onClick,
  onDelete,
}) => {
  const [showMenu, setShowMenu] = React.useState(false);

  // Detect framework from project name if not specified
  const detectFramework = (projectName: string): string | null => {
    const name = projectName.toLowerCase();
    if (name.includes("react") || name.includes("vite")) return "react";
    if (name.includes("vue")) return "vue";
    if (name.includes("angular")) return "angular";
    if (name.includes("next")) return "next";
    if (name.includes("express") || name.includes("api")) return "express";
    if (name.includes("nest")) return "nest";
    if (name.includes("discord") || name.includes("bot")) return "discord";
    if (name.includes("python")) return "python";
    return null;
  };

  const detectedFramework = framework || detectFramework(name);
  const frameworkInfo = detectedFramework
    ? frameworkIcons[detectedFramework]
    : null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "#10b981";
      case "inactive":
        return "#6b7280";
      case "archived":
        return "#8b5cf6";
      default:
        return "#6b7280";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="project-card" onClick={onClick}>
      {/* Mini Preview Thumbnail */}
      <div className="project-thumbnail">
        {thumbnail ? (
          <img src={thumbnail} alt={`${name} preview`} />
        ) : (
          <div className="thumbnail-placeholder">
            <Code size={24} />
          </div>
        )}
        {frameworkInfo && (
          <div
            className="framework-badge"
            style={{ backgroundColor: frameworkInfo.color }}
            title={detectedFramework || ""}
          >
            <span>{frameworkInfo.icon}</span>
          </div>
        )}
        {status === "active" && (
          <div className="live-indicator">
            <span className="live-dot"></span>
            LIVE
          </div>
        )}
      </div>

      <div className="project-card-header">
        <h3 className="project-name">{name}</h3>
        <div className="project-menu">
          <button
            className="menu-button"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            title="More options"
          >
            <MoreVertical size={16} />
          </button>
          {showMenu && (
            <div className="card-menu-dropdown">
              <button className="card-menu-item">
                <Edit2 size={14} />
                Edit
              </button>
              <button className="card-menu-item">
                <Copy size={14} />
                Duplicate
              </button>
              <button
                className="card-menu-item danger"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.();
                  setShowMenu(false);
                }}
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="project-card-body">
        {description && <p className="project-description">{description}</p>}

        <div className="project-meta">
          <div
            className="status-badge"
            style={{ borderColor: getStatusColor(status) }}
          >
            <span
              className="status-dot"
              style={{ backgroundColor: getStatusColor(status) }}
            ></span>
            <span className="status-text">{status}</span>
          </div>

          {teamName && (
            <div className="team-badge">
              <Users size={12} />
              <span className="team-name">{teamName}</span>
            </div>
          )}
        </div>

        <div className="project-stats">
          <div className="stat">
            <Box size={14} />
            <span className="stat-value">{nodeCount}</span>
            <span className="stat-label">nodes</span>
          </div>
          {port && (
            <div className="stat">
              <Server size={14} />
              <span className="stat-value">:{port}</span>
            </div>
          )}
          {cpuUsage !== undefined && (
            <div className="stat resource">
              <Cpu size={14} />
              <span className="stat-value">{cpuUsage}%</span>
            </div>
          )}
          {memoryUsage !== undefined && (
            <div className="stat resource">
              <MemoryStick size={14} />
              <span className="stat-value">{memoryUsage}%</span>
            </div>
          )}
        </div>
      </div>

      <div className="project-card-footer">
        <div className="footer-left">
          <Clock size={12} />
          <span className="last-modified">
            Updated {formatDate(lastModified)}
          </span>
        </div>
        {lastDeploy && (
          <div className="footer-right">
            <Rocket size={12} />
            <span className="last-deploy">
              Deployed {formatDate(lastDeploy)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
