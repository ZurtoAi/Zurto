import React, { useState, useEffect } from "react";
import { projectsAPI } from "../services/api";
import "../styles/TabContent.css";

interface TabContentProps {
  projectId?: string;
  projectName?: string;
}

// ============================================
// OBSERVABILITY TAB
// ============================================
export const ObservabilityTab: React.FC<TabContentProps> = ({ projectId }) => {
  const [metrics, setMetrics] = useState({
    uptime: "99.9%",
    avgLatency: "42ms",
    errorRate: "0.02%",
    cpuUsage: 23,
    memoryUsage: 45,
    requests: 15234,
  });

  const [isLive, setIsLive] = useState(true);

  // Simulated live metrics updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        cpuUsage: Math.max(
          5,
          Math.min(95, prev.cpuUsage + (Math.random() - 0.5) * 10)
        ),
        memoryUsage: Math.max(
          10,
          Math.min(90, prev.memoryUsage + (Math.random() - 0.5) * 5)
        ),
        requests: prev.requests + Math.floor(Math.random() * 50),
        avgLatency: `${Math.max(10, Math.min(200, parseInt(prev.avgLatency) + Math.floor((Math.random() - 0.5) * 20)))}ms`,
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <div className="tab-content observability-tab">
      <div className="tab-header">
        <h2>
          📊 Observability{" "}
          {isLive && <span className="live-badge">● Live</span>}
        </h2>
        <div className="tab-header-actions">
          <p>Monitor your project's health and performance</p>
          <button
            className={`live-toggle ${isLive ? "active" : ""}`}
            onClick={() => setIsLive(!isLive)}
          >
            {isLive ? "⏸️ Pause" : "▶️ Resume"}
          </button>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">⏱️</div>
          <div className="metric-info">
            <span className="metric-value">{metrics.uptime}</span>
            <span className="metric-label">Uptime</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⚡</div>
          <div className="metric-info">
            <span className="metric-value">{metrics.avgLatency}</span>
            <span className="metric-label">Avg Latency</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⚠️</div>
          <div className="metric-info">
            <span className="metric-value">{metrics.errorRate}</span>
            <span className="metric-label">Error Rate</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📈</div>
          <div className="metric-info">
            <span className="metric-value">
              {metrics.requests.toLocaleString()}
            </span>
            <span className="metric-label">Requests (24h)</span>
          </div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-card">
          <h3>CPU Usage</h3>
          <div className="usage-bar">
            <div
              className="usage-fill cpu"
              style={{ width: `${metrics.cpuUsage}%` }}
            />
            <span className="usage-text">{metrics.cpuUsage}%</span>
          </div>
        </div>

        <div className="chart-card">
          <h3>Memory Usage</h3>
          <div className="usage-bar">
            <div
              className="usage-fill memory"
              style={{ width: `${metrics.memoryUsage}%` }}
            />
            <span className="usage-text">{metrics.memoryUsage}%</span>
          </div>
        </div>
      </div>

      <div className="services-status">
        <h3>Service Health</h3>
        <div className="service-list">
          <div className="service-item healthy">
            <span className="status-dot"></span>
            <span className="service-name">API Server</span>
            <span className="service-status">Healthy</span>
          </div>
          <div className="service-item healthy">
            <span className="status-dot"></span>
            <span className="service-name">Database</span>
            <span className="service-status">Healthy</span>
          </div>
          <div className="service-item healthy">
            <span className="status-dot"></span>
            <span className="service-name">Redis Cache</span>
            <span className="service-status">Healthy</span>
          </div>
          <div className="service-item warning">
            <span className="status-dot"></span>
            <span className="service-name">Discord Bot</span>
            <span className="service-status">Degraded</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// LOGS TAB
// ============================================
export const LogsTab: React.FC<TabContentProps> = ({ projectId }) => {
  const [logs, setLogs] = useState([
    {
      id: 1,
      timestamp: new Date(),
      level: "info",
      service: "api",
      message: "Server started on port 3000",
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 60000),
      level: "info",
      service: "api",
      message: "Connected to database",
    },
    {
      id: 3,
      timestamp: new Date(Date.now() - 120000),
      level: "warn",
      service: "discord",
      message: "Rate limit approaching",
    },
    {
      id: 4,
      timestamp: new Date(Date.now() - 180000),
      level: "info",
      service: "api",
      message: "Health check passed",
    },
    {
      id: 5,
      timestamp: new Date(Date.now() - 240000),
      level: "error",
      service: "cache",
      message: "Redis connection timeout",
    },
    {
      id: 6,
      timestamp: new Date(Date.now() - 300000),
      level: "info",
      service: "api",
      message: "User authenticated: leo",
    },
  ]);

  const [filter, setFilter] = useState({ level: "all", service: "all" });
  const [searchQuery, setSearchQuery] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);

  // Simulated real-time log streaming
  useEffect(() => {
    if (!isStreaming) return;

    const sampleMessages = [
      { level: "info", service: "api", message: "Request processed in 42ms" },
      { level: "info", service: "api", message: "Cache hit for user session" },
      {
        level: "warn",
        service: "discord",
        message: "High message queue depth",
      },
      { level: "info", service: "api", message: "Database query executed" },
      { level: "info", service: "cache", message: "Memory usage: 45%" },
      { level: "error", service: "api", message: "Failed to parse JSON body" },
      {
        level: "info",
        service: "discord",
        message: "Bot heartbeat acknowledged",
      },
      { level: "info", service: "api", message: "New websocket connection" },
    ];

    const interval = setInterval(() => {
      const randomLog =
        sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
      setLogs((prev) => [
        {
          id: Date.now(),
          timestamp: new Date(),
          ...randomLog,
        },
        ...prev.slice(0, 99),
      ]); // Keep max 100 logs
    }, 2000);

    return () => clearInterval(interval);
  }, [isStreaming]);

  const filteredLogs = logs.filter((log) => {
    if (filter.level !== "all" && log.level !== filter.level) return false;
    if (filter.service !== "all" && log.service !== filter.service)
      return false;
    if (
      searchQuery &&
      !log.message.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const handleDownload = () => {
    const logText = filteredLogs
      .map(
        (log) =>
          `[${log.timestamp.toISOString()}] [${log.level.toUpperCase()}] [${log.service}] ${log.message}`
      )
      .join("\n");

    const blob = new Blob([logText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `logs-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="tab-content logs-tab">
      <div className="tab-header">
        <h2>📋 Logs</h2>
        <p>
          View logs from all services{" "}
          {isStreaming && <span className="streaming-badge">● Live</span>}
        </p>
      </div>

      <div className="logs-toolbar">
        <input
          type="text"
          placeholder="Search logs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="logs-search"
        />
        <select
          value={filter.level}
          onChange={(e) => setFilter({ ...filter, level: e.target.value })}
          className="logs-filter"
        >
          <option value="all">All Levels</option>
          <option value="info">Info</option>
          <option value="warn">Warning</option>
          <option value="error">Error</option>
        </select>
        <select
          value={filter.service}
          onChange={(e) => setFilter({ ...filter, service: e.target.value })}
          className="logs-filter"
        >
          <option value="all">All Services</option>
          <option value="api">API</option>
          <option value="discord">Discord</option>
          <option value="cache">Cache</option>
        </select>
        <button
          className={`logs-btn ${isStreaming ? "active" : ""}`}
          onClick={() => setIsStreaming(!isStreaming)}
        >
          {isStreaming ? "⏸️ Pause" : "▶️ Stream"}
        </button>
        <button className="logs-btn" onClick={handleDownload}>
          📥 Download
        </button>
        <button className="logs-btn" onClick={handleClearLogs}>
          🗑️ Clear
        </button>
      </div>

      <div className="logs-container">
        {filteredLogs.length === 0 ? (
          <div className="logs-empty">
            <p>No logs to display</p>
            <button className="logs-btn" onClick={() => setIsStreaming(true)}>
              Start streaming logs
            </button>
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div key={log.id} className={`log-entry log-${log.level}`}>
              <span className="log-timestamp">
                {log.timestamp.toLocaleTimeString()}
              </span>
              <span className={`log-level ${log.level}`}>
                {log.level.toUpperCase()}
              </span>
              <span className="log-service">[{log.service}]</span>
              <span className="log-message">{log.message}</span>
            </div>
          ))
        )}
      </div>

      <div className="logs-footer">
        <span>
          Showing {filteredLogs.length} of {logs.length} logs
        </span>
        <label className="auto-scroll-toggle">
          <input
            type="checkbox"
            checked={autoScroll}
            onChange={(e) => setAutoScroll(e.target.checked)}
          />
          Auto-scroll
        </label>
      </div>
    </div>
  );
};

// ============================================
// SHARE TAB
// ============================================
export const ShareTab: React.FC<TabContentProps> = ({
  projectId,
  projectName,
}) => {
  const [exportFormat, setExportFormat] = useState("json");
  const [includeSecrets, setIncludeSecrets] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const showCopyFeedback = (message: string) => {
    setCopyFeedback(message);
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  const handleCopyProjectId = async () => {
    try {
      await navigator.clipboard.writeText(projectId || "no-project-id");
      showCopyFeedback("Project ID copied!");
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const handleCopyShareLink = async () => {
    try {
      const shareLink = `${window.location.origin}/project/${projectId}`;
      await navigator.clipboard.writeText(shareLink);
      showCopyFeedback("Share link copied!");
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const handleEmailExport = () => {
    const subject = encodeURIComponent(
      `Project Export: ${projectName || "Zurto Project"}`
    );
    const body = encodeURIComponent(
      `Check out this Zurto project:\n\nProject: ${projectName}\nID: ${projectId}\nLink: ${window.location.origin}/project/${projectId}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const handleExportConfig = () => {
    // Export project configuration
    const config = {
      projectId,
      projectName,
      exportedAt: new Date().toISOString(),
      format: exportFormat,
    };
    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectName || "project"}-config.${exportFormat}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportFull = async () => {
    // Export full project with nodes and connections
    try {
      const response = await projectsAPI.get(projectId || "");
      const data = response as any;
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${projectName || "project"}-full-export.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Check console for details.");
    }
  };

  return (
    <div className="tab-content share-tab">
      <div className="tab-header">
        <h2>📤 Share & Export</h2>
        <p>Export your project configuration and data</p>
      </div>

      <div className="share-section">
        <h3>📋 Export Configuration</h3>
        <p>Download project settings and configuration</p>
        <div className="export-options">
          <label className="radio-option">
            <input
              type="radio"
              name="format"
              value="json"
              checked={exportFormat === "json"}
              onChange={(e) => setExportFormat(e.target.value)}
            />
            <span>JSON</span>
          </label>
          <label className="radio-option">
            <input
              type="radio"
              name="format"
              value="yaml"
              checked={exportFormat === "yaml"}
              onChange={(e) => setExportFormat(e.target.value)}
            />
            <span>YAML</span>
          </label>
        </div>
        <button className="export-btn" onClick={handleExportConfig}>
          📥 Export Config
        </button>
      </div>

      <div className="share-section">
        <h3>📦 Full Project Export</h3>
        <p>
          Download complete project including nodes, connections, and metadata
        </p>
        <label className="checkbox-option">
          <input
            type="checkbox"
            checked={includeSecrets}
            onChange={(e) => setIncludeSecrets(e.target.checked)}
          />
          <span>Include environment variables (encrypted)</span>
        </label>
        <button className="export-btn primary" onClick={handleExportFull}>
          📦 Export Full Project
        </button>
      </div>

      <div className="share-section">
        <h3>🔗 Quick Actions</h3>
        {copyFeedback && <div className="copy-feedback">{copyFeedback}</div>}
        <div className="quick-actions">
          <button className="action-btn" onClick={handleCopyProjectId}>
            <span>📋</span> Copy Project ID
          </button>
          <button className="action-btn" onClick={handleCopyShareLink}>
            <span>🔗</span> Copy Share Link
          </button>
          <button className="action-btn" onClick={handleEmailExport}>
            <span>📧</span> Email Export
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SETTINGS TAB (Full Page Version)
// ============================================
export const SettingsTab: React.FC<TabContentProps> = ({
  projectId,
  projectName,
}) => {
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    discordNotifications: true,
    deploymentAlerts: true,
    errorAlerts: true,
  });

  const [projectSettings, setProjectSettings] = useState({
    name: projectName || "",
    description: "",
    visibility: "private",
    autoSave: true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Track changes
  useEffect(() => {
    setHasChanges(true);
  }, [projectSettings, notifications]);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      // Simulate API save (replace with actual API call)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Save to localStorage as fallback
      localStorage.setItem(
        `project-settings-${projectId}`,
        JSON.stringify({
          projectSettings,
          notifications,
          savedAt: new Date().toISOString(),
        })
      );

      setSaveMessage("Settings saved successfully!");
      setHasChanges(false);
    } catch (error) {
      setSaveMessage("Failed to save settings. Please try again.");
      console.error("Save failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleArchiveProject = () => {
    if (
      window.confirm(
        "Are you sure you want to archive this project? It will be hidden from your dashboard."
      )
    ) {
      // Implement archive logic
      console.log("Archiving project:", projectId);
    }
  };

  const handleDeleteProject = () => {
    if (
      window.confirm(
        "⚠️ Are you sure you want to DELETE this project? This action cannot be undone!"
      )
    ) {
      if (
        window.confirm(
          "This is your final warning. All data will be permanently lost. Continue?"
        )
      ) {
        // Implement delete logic
        console.log("Deleting project:", projectId);
      }
    }
  };

  return (
    <div className="tab-content settings-tab-full">
      <div className="tab-header">
        <h2>⚙️ Settings</h2>
        <p>Configure project settings and preferences</p>
      </div>

      <div className="settings-grid">
        <div className="settings-card">
          <h3>📝 Project Details</h3>
          <div className="form-group">
            <label>Project Name</label>
            <input
              type="text"
              value={projectSettings.name}
              onChange={(e) =>
                setProjectSettings({ ...projectSettings, name: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={projectSettings.description}
              onChange={(e) =>
                setProjectSettings({
                  ...projectSettings,
                  description: e.target.value,
                })
              }
              rows={3}
            />
          </div>
          <div className="form-group">
            <label>Visibility</label>
            <select
              value={projectSettings.visibility}
              onChange={(e) =>
                setProjectSettings({
                  ...projectSettings,
                  visibility: e.target.value,
                })
              }
            >
              <option value="private">Private</option>
              <option value="team">Team Only</option>
              <option value="public">Public</option>
            </select>
          </div>
        </div>

        <div className="settings-card">
          <h3>🔔 Notifications</h3>
          <div className="toggle-list">
            <label className="toggle-row">
              <span>Email Alerts</span>
              <input
                type="checkbox"
                checked={notifications.emailAlerts}
                onChange={(e) =>
                  setNotifications({
                    ...notifications,
                    emailAlerts: e.target.checked,
                  })
                }
              />
            </label>
            <label className="toggle-row">
              <span>Discord Notifications</span>
              <input
                type="checkbox"
                checked={notifications.discordNotifications}
                onChange={(e) =>
                  setNotifications({
                    ...notifications,
                    discordNotifications: e.target.checked,
                  })
                }
              />
            </label>
            <label className="toggle-row">
              <span>Deployment Alerts</span>
              <input
                type="checkbox"
                checked={notifications.deploymentAlerts}
                onChange={(e) =>
                  setNotifications({
                    ...notifications,
                    deploymentAlerts: e.target.checked,
                  })
                }
              />
            </label>
            <label className="toggle-row">
              <span>Error Alerts</span>
              <input
                type="checkbox"
                checked={notifications.errorAlerts}
                onChange={(e) =>
                  setNotifications({
                    ...notifications,
                    errorAlerts: e.target.checked,
                  })
                }
              />
            </label>
          </div>
        </div>

        <div className="settings-card">
          <h3>⚠️ Danger Zone</h3>
          <p className="danger-text">These actions are irreversible</p>
          <div className="danger-actions">
            <button className="danger-btn" onClick={handleArchiveProject}>
              Archive Project
            </button>
            <button className="danger-btn delete" onClick={handleDeleteProject}>
              Delete Project
            </button>
          </div>
        </div>
      </div>

      <div className="settings-footer">
        {saveMessage && (
          <span
            className={`save-message ${saveMessage.includes("success") ? "success" : "error"}`}
          >
            {saveMessage}
          </span>
        )}
        <button
          className={`save-btn ${hasChanges ? "has-changes" : ""}`}
          onClick={handleSaveSettings}
          disabled={isSaving}
        >
          {isSaving ? "💾 Saving..." : "💾 Save Changes"}
        </button>
      </div>
    </div>
  );
};
