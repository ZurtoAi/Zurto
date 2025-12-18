/**
 * Canvas Navigator
 *
 * Breadcrumb navigation for multi-level canvas
 * Shows current path and allows navigation back
 */

import React from "react";
import { useCanvas, BreadcrumbItem } from "../../context/CanvasContext";
import "./CanvasNavigator.css";

export function CanvasNavigator() {
  const { state, navigateBack, navigateToBreadcrumb } = useCanvas();
  const { breadcrumb, level } = state;

  if (level === 0) {
    return (
      <div className="canvas-navigator">
        <div className="navigator-path">
          <span className="path-icon">🏠</span>
          <span className="path-label">Services Overview</span>
        </div>
      </div>
    );
  }

  return (
    <div className="canvas-navigator">
      <button className="nav-back-btn" onClick={navigateBack} title="Go back">
        <span className="back-icon">←</span>
        <span className="back-label">Back</span>
      </button>

      <div className="navigator-breadcrumb">
        <button
          className="breadcrumb-item home"
          onClick={() => navigateToBreadcrumb(0)}
          title="Back to services"
        >
          <span className="item-icon">🏠</span>
        </button>

        {breadcrumb.map((item: BreadcrumbItem, index: number) => (
          <React.Fragment key={item.id}>
            <span className="breadcrumb-separator">/</span>
            <button
              className={`breadcrumb-item ${index === breadcrumb.length - 1 ? "current" : ""}`}
              onClick={() => navigateToBreadcrumb(index)}
              title={item.name}
            >
              <span className="item-icon">{getItemIcon(item)}</span>
              <span className="item-name">{truncateName(item.name)}</span>
            </button>
          </React.Fragment>
        ))}
      </div>

      <div className="navigator-level">Level {level}</div>
    </div>
  );
}

function getItemIcon(item: BreadcrumbItem): string {
  switch (item.type) {
    case "service":
      return "📦";
    case "folder":
      return "📁";
    case "main":
      return "🏠";
    default:
      return "📄";
  }
}

function getFileIcon(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  const icons: Record<string, string> = {
    // Languages
    ts: "🔷",
    tsx: "⚛️",
    js: "📜",
    jsx: "⚛️",
    py: "🐍",
    go: "🔵",
    rs: "🦀",
    rb: "💎",
    php: "🐘",
    java: "☕",
    kt: "🅺",
    swift: "🍎",
    cs: "🎯",
    cpp: "➕",
    c: "🔤",
    h: "📋",

    // Web
    html: "🌐",
    css: "🎨",
    scss: "💅",
    less: "💅",
    svg: "🎨",

    // Config
    json: "📋",
    yaml: "📋",
    yml: "📋",
    toml: "📋",
    xml: "📋",
    env: "🔐",
    ini: "⚙️",

    // Docs
    md: "📝",
    txt: "📄",
    rst: "📝",

    // Data
    sql: "🗄️",
    csv: "📊",

    // Build
    dockerfile: "🐳",
    makefile: "🔧",

    // Images
    png: "🖼️",
    jpg: "🖼️",
    jpeg: "🖼️",
    gif: "🖼️",
    webp: "🖼️",
    ico: "🖼️",
  };

  // Check for special files
  const lowerName = name.toLowerCase();
  if (lowerName === "dockerfile") return "🐳";
  if (lowerName.includes("docker-compose")) return "🐳";
  if (lowerName === "package.json") return "📦";
  if (lowerName === "tsconfig.json") return "🔷";
  if (lowerName === "readme.md") return "📖";
  if (lowerName === ".gitignore") return "🙈";
  if (lowerName === ".env" || lowerName.startsWith(".env.")) return "🔐";

  return icons[ext] || "📄";
}

function truncateName(name: string, maxLength = 20): string {
  if (name.length <= maxLength) return name;
  return name.slice(0, maxLength - 3) + "...";
}
