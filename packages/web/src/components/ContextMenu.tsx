import React from "react";
import { ContextMenuItem, ContextMenuPosition } from "../types";
import "../styles/ContextMenu.css";

interface ContextMenuProps {
  position: ContextMenuPosition;
  items: ContextMenuItem[];
  onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  position,
  items,
  onClose,
}) => {
  // Close on click outside
  React.useEffect(() => {
    const handleClickOutside = () => onClose();
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return (
    <div
      className="context-menu"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {items.map((item, index) => {
        if (item.divider) {
          return (
            <div key={`divider-${index}`} className="context-menu-divider" />
          );
        }

        return (
          <button
            key={item.id}
            className={`context-menu-item ${item.disabled ? "disabled" : ""} ${item.danger ? "danger" : ""}`}
            onClick={() => {
              if (!item.disabled) {
                item.action();
                onClose();
              }
            }}
            disabled={item.disabled}
          >
            {item.icon && <span className="menu-item-icon">{item.icon}</span>}
            <span className="menu-item-label">{item.label}</span>
            {item.shortcut && (
              <span className="menu-item-shortcut">{item.shortcut}</span>
            )}
          </button>
        );
      })}
    </div>
  );
};

// Helper to generate context menu items for different node types
export const getNodeContextMenuItems = (
  nodeType: string,
  nodeStatus: string | undefined,
  callbacks: {
    onViewDetails: () => void;
    onEditCode?: () => void;
    onStart?: () => void;
    onStop?: () => void;
    onRestart?: () => void;
    onRebuild?: () => void;
    onViewLogs?: () => void;
    onDuplicate: () => void;
    onDelete: () => void;
    onEnterWorkspace?: () => void;
    onDeploy?: () => void;
    onUndeploy?: () => void;
    isDeployed?: boolean;
  }
): ContextMenuItem[] => {
  const items: ContextMenuItem[] = [];

  // Common: View Details
  items.push({
    id: "view-details",
    label: "View Details",
    icon: "👁",
    action: callbacks.onViewDetails,
  });

  // Enter Workspace (for nodes with children)
  if (callbacks.onEnterWorkspace) {
    items.push({
      id: "enter-workspace",
      label: "Enter Workspace",
      icon: "📂",
      action: callbacks.onEnterWorkspace,
      shortcut: "Double-click",
    });
  }

  // Edit Code (for code nodes)
  if (callbacks.onEditCode) {
    items.push({
      id: "edit-code",
      label: "Edit Code",
      icon: "✏️",
      action: callbacks.onEditCode,
    });
  }

  // View Logs (for running nodes)
  if (callbacks.onViewLogs && nodeStatus) {
    items.push({
      id: "view-logs",
      label: "View Logs",
      icon: "📋",
      action: callbacks.onViewLogs,
    });
  }

  // Divider before deployment
  items.push({
    id: "divider-deploy",
    label: "",
    action: () => {},
    divider: true,
  });

  // Deploy/Undeploy (for deployable nodes - servers)
  if (callbacks.onDeploy && nodeType === "server") {
    if (callbacks.isDeployed) {
      items.push({
        id: "undeploy",
        label: "Undeploy",
        icon: "⏹️",
        action: callbacks.onUndeploy || (() => {}),
        danger: true,
      });
      items.push({
        id: "redeploy",
        label: "Redeploy",
        icon: "🔄",
        action: callbacks.onDeploy,
      });
    } else {
      items.push({
        id: "deploy",
        label: "Deploy",
        icon: "🚀",
        action: callbacks.onDeploy,
      });
    }
  }

  // Divider before operations
  items.push({ id: "divider-1", label: "", action: () => {}, divider: true });

  // Start/Stop/Restart (for runnable nodes)
  if (nodeStatus) {
    if (nodeStatus === "stopped" || nodeStatus === "error") {
      items.push({
        id: "start",
        label: "Start",
        icon: "▶️",
        action: callbacks.onStart || (() => {}),
      });
    }

    if (nodeStatus === "running") {
      items.push({
        id: "stop",
        label: "Stop",
        icon: "⏹️",
        action: callbacks.onStop || (() => {}),
      });

      items.push({
        id: "restart",
        label: "Restart",
        icon: "🔄",
        action: callbacks.onRestart || (() => {}),
      });
    }

    if (callbacks.onRebuild) {
      items.push({
        id: "rebuild",
        label: "Rebuild & Restart",
        icon: "🔨",
        action: callbacks.onRebuild,
      });
    }
  }

  // Divider before danger zone
  items.push({ id: "divider-2", label: "", action: () => {}, divider: true });

  // Duplicate
  items.push({
    id: "duplicate",
    label: "Duplicate",
    icon: "📋",
    action: callbacks.onDuplicate,
  });

  // Delete (danger)
  items.push({
    id: "delete",
    label: "Delete",
    icon: "🗑️",
    action: callbacks.onDelete,
    danger: true,
  });

  return items;
};

// Canvas context menu (right-click on empty area)
export const getCanvasContextMenuItems = (callbacks: {
  onAddNode: (type: string) => void;
  onPaste?: () => void;
  onSelectAll?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFitView?: () => void;
}): ContextMenuItem[] => {
  return [
    {
      id: "add-backend",
      label: "Add Backend Node",
      icon: "⚙️",
      action: () => callbacks.onAddNode("backend"),
    },
    {
      id: "add-frontend",
      label: "Add Frontend Node",
      icon: "🌐",
      action: () => callbacks.onAddNode("frontend"),
    },
    {
      id: "add-database",
      label: "Add Database Node",
      icon: "💾",
      action: () => callbacks.onAddNode("database"),
    },
    {
      id: "add-worker",
      label: "Add Worker Node",
      icon: "👷",
      action: () => callbacks.onAddNode("worker"),
    },
    {
      id: "add-integration",
      label: "Add Integration Node",
      icon: "🔗",
      action: () => callbacks.onAddNode("integration"),
    },
    { id: "divider-1", label: "", action: () => {}, divider: true },
    {
      id: "paste",
      label: "Paste",
      icon: "📋",
      action: callbacks.onPaste || (() => {}),
      disabled: !callbacks.onPaste,
      shortcut: "Ctrl+V",
    },
    {
      id: "select-all",
      label: "Select All",
      icon: "☐",
      action: callbacks.onSelectAll || (() => {}),
      shortcut: "Ctrl+A",
    },
    { id: "divider-2", label: "", action: () => {}, divider: true },
    {
      id: "zoom-in",
      label: "Zoom In",
      icon: "🔍",
      action: callbacks.onZoomIn || (() => {}),
      shortcut: "Ctrl++",
    },
    {
      id: "zoom-out",
      label: "Zoom Out",
      icon: "🔍",
      action: callbacks.onZoomOut || (() => {}),
      shortcut: "Ctrl+-",
    },
    {
      id: "fit-view",
      label: "Fit to View",
      icon: "⊞",
      action: callbacks.onFitView || (() => {}),
    },
  ];
};
