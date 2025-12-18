import React, { useState, useEffect } from "react";
import { DraggablePanel } from "./DraggablePanel";
import "../styles/PortManagement.css";

interface PortAllocation {
  id: string;
  port: number;
  projectId: string;
  projectName: string;
  service: string;
  status: "active" | "inactive" | "reserved";
  allocatedAt: string;
}

interface PortManagementProps {
  projectId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const PortManagement: React.FC<PortManagementProps> = ({
  projectId,
  isOpen,
  onClose,
}) => {
  const [ports, setPorts] = useState<PortAllocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");

  // Port range configuration
  const PORT_RANGE = { min: 5000, max: 5500 };

  // Fetch ports from API
  const fetchPorts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const url = projectId
        ? `/api/ports?projectId=${projectId}`
        : "/api/ports";
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        const portData = data.data || [];
        // Ensure portData is always an array
        setPorts(Array.isArray(portData) ? portData : []);
      } else {
        setError(data.error || "Failed to fetch ports");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Port fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchPorts();
    }
  }, [isOpen, projectId]);

  // Filter ports
  const filteredPorts = ports.filter((port) => {
    if (filter === "all") return true;
    return port.status === filter;
  });

  // Calculate usage stats
  const totalPorts = PORT_RANGE.max - PORT_RANGE.min;
  const usedPorts = ports.filter((p) => p.status === "active").length;
  const availablePorts = totalPorts - usedPorts;
  const usagePercent = Math.round((usedPorts / totalPorts) * 100);

  // Port icon for the panel
  const portIcon = (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );

  // Status indicator based on port usage
  const getStatusIndicator = (): {
    status: "active" | "idle" | "loading" | "error";
    label?: string;
  } => {
    if (isLoading) return { status: "loading", label: "Loading" };
    if (error) return { status: "error", label: "Error" };
    if (usagePercent > 80)
      return { status: "error", label: `${usagePercent}% used` };
    if (usagePercent > 50)
      return { status: "active", label: `${usagePercent}% used` };
    return { status: "idle", label: `${usagePercent}% used` };
  };

  return (
    <DraggablePanel
      id="port-management"
      title="Port Management"
      icon={portIcon}
      isOpen={isOpen}
      onClose={onClose}
      defaultPosition={{ x: 120, y: 120 }}
      defaultSize={{ width: 400, height: 500 }}
      statusIndicator={getStatusIndicator()}
      showMinimize
    >
      <div className="port-management-content">
        {/* Stats Cards */}
        <div className="port-stats-grid">
          <div className="stat-card">
            <div className="stat-icon active">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <div className="stat-info">
              <span className="stat-number">{usedPorts}</span>
              <span className="stat-label">Active Ports</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon available">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v8m-4-4h8" />
              </svg>
            </div>
            <div className="stat-info">
              <span className="stat-number">{availablePorts}</span>
              <span className="stat-label">Available</span>
            </div>
          </div>
        </div>

        {/* Usage Progress */}
        <div className="port-usage-section">
          <div className="usage-header">
            <span className="usage-title">Port Range Usage</span>
            <span className="usage-range">
              {PORT_RANGE.min} - {PORT_RANGE.max}
            </span>
          </div>
          <div className="usage-bar-container">
            <div
              className="usage-bar-fill"
              style={{
                width: `${usagePercent}%`,
                background:
                  usagePercent > 80
                    ? "#ef4444"
                    : usagePercent > 50
                      ? "#f59e0b"
                      : "#10b981",
              }}
            />
          </div>
          <div className="usage-details">
            <span>{usedPorts} in use</span>
            <span>{usagePercent}%</span>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="port-filter-tabs">
          <button
            className={`filter-tab ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All ({ports.length})
          </button>
          <button
            className={`filter-tab ${filter === "active" ? "active" : ""}`}
            onClick={() => setFilter("active")}
          >
            Active ({ports.filter((p) => p.status === "active").length})
          </button>
          <button
            className={`filter-tab ${filter === "inactive" ? "active" : ""}`}
            onClick={() => setFilter("inactive")}
          >
            Inactive ({ports.filter((p) => p.status === "inactive").length})
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="port-error-message">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4m0 4h.01" />
            </svg>
            <span>{error}</span>
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        {/* Port list */}
        <div className="port-list-container">
          {isLoading ? (
            <div className="port-loading-state">
              <div className="loading-spinner" />
              <span>Loading ports...</span>
            </div>
          ) : filteredPorts.length === 0 ? (
            <div className="port-empty-state">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12h8" />
              </svg>
              <p>No {filter !== "all" ? filter : ""} ports allocated</p>
            </div>
          ) : (
            <div className="port-items">
              {filteredPorts.map((port) => (
                <div
                  key={port.id}
                  className={`port-item-card status-${port.status}`}
                >
                  <div className="port-item-main">
                    <span className={`port-status-dot ${port.status}`}>
                      {port.status === "active" ? "●" : "○"}
                    </span>
                    <span className="port-number-display">{port.port}</span>
                    <span className="port-service-name">{port.service}</span>
                  </div>
                  <div className="port-item-meta">
                    <span className="port-project-name">
                      {port.projectName}
                    </span>
                    <span className="port-date">
                      {new Date(port.allocatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Refresh button */}
        <div className="port-footer">
          <button
            className="refresh-btn"
            onClick={fetchPorts}
            disabled={isLoading}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M23 4v6h-6M1 20v-6h6" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>
    </DraggablePanel>
  );
};
