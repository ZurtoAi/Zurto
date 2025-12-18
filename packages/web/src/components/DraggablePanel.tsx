import React, { useState, useRef, useEffect, useCallback } from "react";
import "../styles/DraggablePanel.css";

interface DraggablePanelProps {
  id: string; // Unique ID for position persistence
  title: string;
  icon?: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  defaultPosition?: { x: number; y: number };
  defaultSize?: { width: number; height: number };
  minWidth?: number;
  minHeight?: number;
  statusIndicator?: {
    status: "active" | "idle" | "loading" | "error";
    label?: string;
  };
  showMinimize?: boolean;
  className?: string;
}

interface PanelState {
  x: number;
  y: number;
  isMinimized: boolean;
  isCollapsed: boolean;
}

const STORAGE_KEY_PREFIX = "zurto-panel-state-";

export const DraggablePanel: React.FC<DraggablePanelProps> = ({
  id,
  title,
  icon,
  isOpen,
  onClose,
  children,
  defaultPosition = { x: window.innerWidth - 420, y: 80 },
  defaultSize = { width: 380, height: 500 },
  minWidth = 300,
  minHeight = 200,
  statusIndicator,
  showMinimize = true,
  className = "",
}) => {
  // Load saved state from localStorage
  const loadSavedState = (): PanelState => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PREFIX + id);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Failed to load panel state:", e);
    }
    return {
      x: defaultPosition.x,
      y: defaultPosition.y,
      isMinimized: false,
      isCollapsed: false,
    };
  };

  const [panelState, setPanelState] = useState<PanelState>(loadSavedState);
  const [isDragging, setIsDragging] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0, panelX: 0, panelY: 0 });

  // Save state to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + id, JSON.stringify(panelState));
    } catch (e) {
      console.warn("Failed to save panel state:", e);
    }
  }, [id, panelState]);

  // Handle drag start
  const handleDragStart = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest(".panel-actions")) return;

      setIsDragging(true);
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        panelX: panelState.x,
        panelY: panelState.y,
      };
      e.preventDefault();
    },
    [panelState.x, panelState.y]
  );

  // Handle drag move
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;

      let newX = dragStartRef.current.panelX + deltaX;
      let newY = dragStartRef.current.panelY + deltaY;

      // Keep within viewport bounds
      const panelWidth = panelRef.current?.offsetWidth || defaultSize.width;
      const panelHeight = panelRef.current?.offsetHeight || 40; // Header height when minimized

      newX = Math.max(0, Math.min(newX, window.innerWidth - panelWidth));
      newY = Math.max(0, Math.min(newY, window.innerHeight - panelHeight));

      setPanelState((prev) => ({ ...prev, x: newX, y: newY }));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, defaultSize.width]);

  // Toggle minimize
  const handleMinimize = () => {
    setPanelState((prev) => ({ ...prev, isMinimized: !prev.isMinimized }));
  };

  // Toggle collapse (just header visible)
  const handleCollapse = () => {
    setPanelState((prev) => ({ ...prev, isCollapsed: !prev.isCollapsed }));
  };

  if (!isOpen) return null;

  const { x, y, isMinimized, isCollapsed } = panelState;

  // Status indicator color
  const getStatusColor = () => {
    if (!statusIndicator) return "transparent";
    switch (statusIndicator.status) {
      case "active":
        return "#10b981";
      case "loading":
        return "#f59e0b";
      case "error":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  return (
    <div
      ref={panelRef}
      className={`draggable-panel ${isMinimized ? "minimized" : ""} ${isCollapsed ? "collapsed" : ""} ${isDragging ? "dragging" : ""} ${className}`}
      style={{
        left: x,
        top: y,
        width: isMinimized ? "auto" : defaultSize.width,
        minWidth: isMinimized ? 180 : minWidth,
        maxHeight: isCollapsed
          ? "auto"
          : isMinimized
            ? "auto"
            : defaultSize.height,
      }}
    >
      {/* Header - Always visible and draggable */}
      <div className="panel-header" onMouseDown={handleDragStart}>
        <div className="panel-header-left">
          {icon && <span className="panel-icon">{icon}</span>}
          <span className="panel-title">{title}</span>
          {statusIndicator && (
            <span
              className={`panel-status-dot ${statusIndicator.status}`}
              style={{ backgroundColor: getStatusColor() }}
              title={statusIndicator.label || statusIndicator.status}
            />
          )}
        </div>
        <div className="panel-actions">
          {showMinimize && (
            <>
              <button
                className="panel-action-btn"
                onClick={handleCollapse}
                title={isCollapsed ? "Expand" : "Collapse"}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  {isCollapsed ? (
                    <path d="M6 9l6 6 6-6" />
                  ) : (
                    <path d="M18 15l-6-6-6 6" />
                  )}
                </svg>
              </button>
              <button
                className="panel-action-btn"
                onClick={handleMinimize}
                title={isMinimized ? "Restore" : "Minimize"}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  {isMinimized ? (
                    <>
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M9 3v18" />
                    </>
                  ) : (
                    <path d="M4 14h16" />
                  )}
                </svg>
              </button>
            </>
          )}
          <button
            className="panel-action-btn close"
            onClick={onClose}
            title="Close"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Status bar when minimized */}
      {isMinimized && statusIndicator && (
        <div className="panel-minimized-status">
          <span className={`status-indicator ${statusIndicator.status}`}>
            {statusIndicator.label || statusIndicator.status}
          </span>
        </div>
      )}

      {/* Content - Hidden when minimized or collapsed */}
      {!isMinimized && !isCollapsed && (
        <div className="panel-content">{children}</div>
      )}
    </div>
  );
};

export default DraggablePanel;
