import React from "react";
import { PanelType, ActivityItem } from "../types";
import "../styles/SidePanel.css";

// Simplified node interface for panel display
interface PanelNode {
  id: string;
  name: string;
  label?: string;
  description?: string;
  type: string;
  status?: string;
  position?: { x: number; y: number };
  port?: number;
  aiAccuracy?: number;
  projectId?: string;
}

interface SidePanelProps {
  isOpen: boolean;
  type: PanelType | null;
  data?: any;
  onClose: () => void;

  // Node Editor specific
  selectedNode?: PanelNode | null;
  onNodeUpdate?: (nodeId: string, changes: Partial<PanelNode>) => void;
  onNodeStart?: (nodeId: string) => void;
  onNodeStop?: (nodeId: string) => void;
  onNodeRestart?: (nodeId: string) => void;
  onNodeRebuild?: (nodeId: string) => void;

  // Activity specific
  activities?: ActivityItem[];
}

export const SidePanel: React.FC<SidePanelProps> = ({
  isOpen,
  type,
  data,
  onClose,
  selectedNode,
  onNodeUpdate,
  onNodeStart,
  onNodeStop,
  onNodeRestart,
  onNodeRebuild,
  activities = [],
}) => {
  if (!isOpen || !type) return null;

  const renderContent = () => {
    switch (type) {
      case "node-editor":
        return (
          <NodeEditorPanel
            node={selectedNode}
            onUpdate={onNodeUpdate}
            onStart={onNodeStart}
            onStop={onNodeStop}
            onRestart={onNodeRestart}
            onRebuild={onNodeRebuild}
          />
        );
      case "activity":
        return <ActivityPanel activities={activities} />;
      case "search":
        return <SearchPanel />;
      case "questionnaire":
        return <QuestionnairePanel />;
      case "monitoring":
        return <MonitoringPanel />;
      case "settings":
        return <SettingsPanel />;
      case "documentation":
        return <DocumentationPanel />;
      case "agent-status":
        return <AgentStatusPanel />;
      case "deploy":
        return <DeployPanel />;
      case "file-explorer":
        return <FileExplorerPanel node={selectedNode} />;
      default:
        return <div className="panel-placeholder">Panel content goes here</div>;
    }
  };

  const getPanelTitle = () => {
    switch (type) {
      case "node-editor":
        return selectedNode?.name || "Node Editor";
      case "activity":
        return "Activity";
      case "search":
        return "Search";
      case "questionnaire":
        return "Questionnaire";
      case "monitoring":
        return "Monitoring";
      case "settings":
        return "Settings";
      case "documentation":
        return "Documentation";
      case "agent-status":
        return "Agent Status";
      case "deploy":
        return "Deploy";
      case "file-explorer":
        return "File Explorer";
      default:
        return "Panel";
    }
  };

  return (
    <div className={`side-panel ${isOpen ? "open" : ""}`}>
      <div className="panel-header">
        <h3 className="panel-title">{getPanelTitle()}</h3>
        <button className="panel-close-btn" onClick={onClose}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M12 4L4 12M4 4L12 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
      <div className="panel-content">{renderContent()}</div>
    </div>
  );
};

// Node Editor Panel
const NodeEditorPanel: React.FC<{
  node?: PanelNode | null;
  onUpdate?: (nodeId: string, changes: Partial<PanelNode>) => void;
  onStart?: (nodeId: string) => void;
  onStop?: (nodeId: string) => void;
  onRestart?: (nodeId: string) => void;
  onRebuild?: (nodeId: string) => void;
}> = ({ node, onUpdate, onStart, onStop, onRestart, onRebuild }) => {
  if (!node) return <div className="panel-empty">No node selected</div>;

  const [name, setName] = React.useState(node.name);
  const [description, setDescription] = React.useState(node.description || "");
  const [codeContent, setCodeContent] = React.useState("");
  const [selectedFile, setSelectedFile] = React.useState<string | null>(null);
  const [hasChanges, setHasChanges] = React.useState(false);
  const [lineCount, setLineCount] = React.useState(1);

  // Mock file tree for demo - will be replaced with API calls
  const mockFileTree =
    node.type === "planning" || node.type === "feature"
      ? [
          { name: "src/", type: "folder", path: "/src" },
          { name: "index.ts", type: "file", path: "/src/index.ts" },
          { name: "api.ts", type: "file", path: "/src/api.ts" },
          { name: "package.json", type: "file", path: "/package.json" },
          { name: "README.md", type: "file", path: "/README.md" },
        ]
      : [];

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setCodeContent(newContent);
    setHasChanges(true);
    setLineCount(newContent.split("\n").length || 1);
  };

  const handleFileSelect = (filePath: string) => {
    setSelectedFile(filePath);
    // Mock loading file content
    setCodeContent(
      `// File: ${filePath}\n// Content would be loaded from API\n\nexport function example() {\n  console.log('Hello from ${filePath}');\n}`
    );
    setLineCount(6);
    setHasChanges(false);
  };

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(node.id, { name, description });
    }
  };

  const handleSaveCode = () => {
    // Would save to API
    console.log("Saving code:", { file: selectedFile, content: codeContent });
    setHasChanges(false);
  };

  return (
    <div className="node-editor">
      {/* Status Section (for runnable nodes) */}
      {node.status && (
        <div className="editor-section">
          <label className="section-label">Status</label>
          <div className={`status-badge status-${node.status}`}>
            <span className="status-dot"></span>
            <span className="status-text">{node.status}</span>
          </div>
          <div className="status-actions">
            {node.status === "stopped" && (
              <button
                className="action-btn success"
                onClick={() => onStart?.(node.id)}
              >
                ▶️ Start
              </button>
            )}
            {node.status === "running" && (
              <>
                <button
                  className="action-btn danger"
                  onClick={() => onStop?.(node.id)}
                >
                  ⏹️ Stop
                </button>
                <button
                  className="action-btn warning"
                  onClick={() => onRestart?.(node.id)}
                >
                  🔄 Restart
                </button>
              </>
            )}
            <button
              className="action-btn primary"
              onClick={() => onRebuild?.(node.id)}
            >
              🔨 Rebuild
            </button>
          </div>
        </div>
      )}

      {/* Name */}
      <div className="editor-section">
        <label className="section-label">Name</label>
        <input
          type="text"
          className="editor-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Description */}
      <div className="editor-section">
        <label className="section-label">Description</label>
        <textarea
          className="editor-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      {/* Type */}
      <div className="editor-section">
        <label className="section-label">Type</label>
        <div className="readonly-value">{node.type}</div>
      </div>

      {/* Port (if applicable) */}
      {node.port && (
        <div className="editor-section">
          <label className="section-label">Port</label>
          <div className="readonly-value">{node.port}</div>
        </div>
      )}

      {/* AI Accuracy (for planning nodes) */}
      {typeof node.aiAccuracy === "number" && (
        <div className="editor-section">
          <label className="section-label">AI Accuracy</label>
          <div className="accuracy-display">
            <div className="accuracy-bar">
              <div
                className="accuracy-fill"
                style={{ width: `${node.aiAccuracy}%` }}
              ></div>
            </div>
            <span className="accuracy-value">{node.aiAccuracy}%</span>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="editor-actions">
        <button className="save-btn" onClick={handleSave}>
          Save Changes
        </button>
      </div>

      {/* File Tree Section - Show for planning/feature nodes */}
      {mockFileTree.length > 0 && (
        <div className="file-tree-section">
          <div className="file-tree-header">
            <h4>📁 Project Files</h4>
          </div>
          <div className="file-tree-container">
            {mockFileTree.map((item, index) => (
              <div
                key={index}
                className={`file-tree-item ${item.type === "folder" ? "folder" : ""} ${selectedFile === item.path ? "active" : ""}`}
                onClick={() =>
                  item.type === "file" && handleFileSelect(item.path)
                }
              >
                <span
                  className={`file-tree-icon ${item.type === "folder" ? "folder-icon" : "file-icon"}`}
                >
                  {item.type === "folder" ? "📂" : "📄"}
                </span>
                <span className="file-tree-name">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Code Editor Section */}
      {selectedFile && (
        <div className="code-editor-section">
          <div className="code-editor-header">
            <h4>✏️ Code Editor</h4>
            <div className="file-path-badge">
              <svg viewBox="0 0 16 16" fill="currentColor">
                <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z" />
              </svg>
              {selectedFile}
            </div>
          </div>

          <div className="code-editor-toolbar">
            <button className="toolbar-btn" title="Undo">
              <svg viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z" />
                <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z" />
              </svg>
            </button>
            <button className="toolbar-btn" title="Redo">
              <svg viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z" />
                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966a.25.25 0 0 1 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
              </svg>
            </button>
            <div className="toolbar-divider"></div>
            <button className="toolbar-btn" title="Format">
              <svg viewBox="0 0 16 16" fill="currentColor">
                <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z" />
                <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5L9.5 0zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z" />
              </svg>
            </button>
            <button className="toolbar-btn" title="Copy All">
              <svg viewBox="0 0 16 16" fill="currentColor">
                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
              </svg>
            </button>
          </div>

          <div className="code-editor-wrapper">
            <div className="line-numbers">
              {Array.from({ length: lineCount }, (_, i) => (
                <div key={i + 1} className="line-number">
                  {i + 1}
                </div>
              ))}
            </div>
            <textarea
              className="code-textarea"
              value={codeContent}
              onChange={handleCodeChange}
              placeholder="// Select a file to edit..."
              spellCheck={false}
            />
          </div>

          <div className="code-editor-footer">
            <div className="code-stats">
              <span className="code-stat">Lines: {lineCount}</span>
              <span className="code-stat">Chars: {codeContent.length}</span>
              {hasChanges && (
                <span className="code-stat" style={{ color: "#f59e0b" }}>
                  ● Modified
                </span>
              )}
            </div>
            <button
              className="save-btn"
              onClick={handleSaveCode}
              disabled={!hasChanges}
            >
              <svg viewBox="0 0 16 16" fill="currentColor">
                <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z" />
              </svg>
              Save File
            </button>
          </div>
        </div>
      )}

      {/* No file selected placeholder */}
      {mockFileTree.length > 0 && !selectedFile && (
        <div className="no-code-content">
          <svg viewBox="0 0 16 16" fill="currentColor">
            <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z" />
            <path d="M4.5 12.5A.5.5 0 0 1 5 12h3a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zm0-2A.5.5 0 0 1 5 10h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zm1.639-3.708 1.33.886 1.854-1.855a.25.25 0 0 1 .289-.047l1.888.974V8.5a.5.5 0 0 1-.5.5H5a.5.5 0 0 1-.5-.5V8s1.54-1.274 1.639-1.208zM6.25 6a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5z" />
          </svg>
          <p>Select a file from the tree above to view and edit code</p>
        </div>
      )}
    </div>
  );
};

// Activity Panel
const ActivityPanel: React.FC<{ activities: ActivityItem[] }> = ({
  activities,
}) => {
  return (
    <div className="activity-list">
      {activities.length === 0 ? (
        <div className="panel-empty">No recent activity</div>
      ) : (
        activities.map((activity) => (
          <div
            key={activity.id}
            className={`activity-item status-${activity.status}`}
          >
            <div className="activity-icon">
              {activity.type === "deployment" && "🚀"}
              {activity.type === "build" && "🔨"}
              {activity.type === "error" && "❌"}
              {activity.type === "status_change" && "🔄"}
              {activity.type === "code_update" && "💾"}
              {activity.type === "agent_action" && "🤖"}
            </div>
            <div className="activity-content">
              <div className="activity-title">{activity.title}</div>
              <div className="activity-description">{activity.description}</div>
              {activity.nodeName && (
                <div className="activity-node">{activity.nodeName}</div>
              )}
              <div className="activity-time">
                {new Date(activity.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

// Search Panel
const SearchPanel: React.FC = () => {
  const [query, setQuery] = React.useState("");

  return (
    <div className="search-panel">
      <div className="search-input-wrapper">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="search-icon"
        >
          <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M11 11L14 14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <input
          type="text"
          className="search-input"
          placeholder="Search nodes, code, files..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </div>
      <div className="search-results">
        {query ? (
          <div className="panel-empty">No results for "{query}"</div>
        ) : (
          <div className="search-hint">Type to search across your project</div>
        )}
      </div>
    </div>
  );
};

// Questionnaire Panel - Connected to API
const QuestionnairePanel: React.FC = () => {
  const [questionnaires, setQuestionnaires] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = React.useState<
    string | null
  >(null);

  React.useEffect(() => {
    const fetchQuestionnaires = async () => {
      try {
        setLoading(true);
        // Try to fetch from API
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || "https://api.zurto.app"}/api/questionnaires`
        );
        if (response.ok) {
          const data = await response.json();
          setQuestionnaires(data.questionnaires || data.data || []);
        } else {
          // Use mock data if API fails
          setQuestionnaires([
            {
              id: "project-setup",
              name: "Project Setup",
              completion: 87,
              questionCount: 10,
            },
            {
              id: "tech-stack",
              name: "Technology Stack",
              completion: 45,
              questionCount: 8,
            },
            {
              id: "deployment",
              name: "Deployment Config",
              completion: 0,
              questionCount: 5,
            },
          ]);
        }
      } catch (err) {
        console.log("Using mock questionnaire data");
        setQuestionnaires([
          {
            id: "project-setup",
            name: "Project Setup",
            completion: 87,
            questionCount: 10,
          },
          {
            id: "tech-stack",
            name: "Technology Stack",
            completion: 45,
            questionCount: 8,
          },
          {
            id: "deployment",
            name: "Deployment Config",
            completion: 0,
            questionCount: 5,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionnaires();
  }, []);

  if (loading) {
    return (
      <div className="questionnaire-panel">
        <div className="questionnaire-loading">Loading questionnaires...</div>
      </div>
    );
  }

  return (
    <div className="questionnaire-panel">
      <div className="questionnaire-header">
        <h4>AI Questionnaires</h4>
        <span className="questionnaire-count">
          {questionnaires.length} active
        </span>
      </div>

      <p className="questionnaire-description">
        Answer these questions to help the AI understand your project
        requirements.
      </p>

      <div className="questionnaire-list">
        {questionnaires.map((q) => (
          <div
            key={q.id}
            className={`questionnaire-item ${selectedQuestionnaire === q.id ? "selected" : ""}`}
            onClick={() => setSelectedQuestionnaire(q.id)}
          >
            <div className="q-header">
              <span className="q-name">{q.name}</span>
              <span
                className={`q-badge ${q.completion === 100 ? "complete" : q.completion > 0 ? "in-progress" : "not-started"}`}
              >
                {q.completion === 100
                  ? "✓ Complete"
                  : q.completion > 0
                    ? `${q.completion}%`
                    : "Not Started"}
              </span>
            </div>
            <div className="q-progress">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${q.completion}%` }}
                ></div>
              </div>
            </div>
            <div className="q-meta">
              <span>{q.questionCount || 10} questions</span>
              {q.completion > 0 && q.completion < 100 && (
                <button className="q-continue-btn">Continue →</button>
              )}
              {q.completion === 0 && (
                <button className="q-start-btn">Start →</button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="questionnaire-actions">
        <button
          className="refresh-btn"
          onClick={() => window.location.reload()}
        >
          🔄 Refresh
        </button>
      </div>
    </div>
  );
};

// Monitoring Panel
const MonitoringPanel: React.FC = () => {
  return (
    <div className="monitoring-panel">
      <div className="metric-card">
        <div className="metric-label">CPU Usage</div>
        <div className="metric-value">23%</div>
        <div className="metric-bar">
          <div className="metric-fill" style={{ width: "23%" }}></div>
        </div>
      </div>
      <div className="metric-card">
        <div className="metric-label">Memory</div>
        <div className="metric-value">512 MB</div>
        <div className="metric-bar">
          <div className="metric-fill" style={{ width: "45%" }}></div>
        </div>
      </div>
      <div className="metric-card">
        <div className="metric-label">Active Containers</div>
        <div className="metric-value">4 / 6</div>
      </div>
      <div className="metric-card">
        <div className="metric-label">Network</div>
        <div className="metric-value">1.2 MB/s</div>
      </div>
    </div>
  );
};

// Settings Panel
const SettingsPanel: React.FC = () => {
  const [notifications, setNotifications] = React.useState({
    emailAlerts: true,
    discordNotifications: true,
    slackNotifications: false,
    deploymentAlerts: true,
    errorAlerts: true,
    weeklyReports: false,
  });

  const [projectDefaults, setProjectDefaults] = React.useState({
    defaultLayout: "center-out",
    autoSave: true,
    gridSize: 20,
    snapToGrid: true,
    showConnections: true,
    showMinimap: false,
  });

  const [teamAccess, setTeamAccess] = React.useState([
    { userId: "leo", role: "owner", canEdit: true, canDeploy: true },
    { userId: "leeloo", role: "admin", canEdit: true, canDeploy: true },
    { userId: "guest", role: "viewer", canEdit: false, canDeploy: false },
  ]);

  return (
    <div className="settings-panel">
      {/* Notification Preferences */}
      <div className="settings-section">
        <h4>🔔 Notification Preferences</h4>
        <div className="settings-toggles">
          <label className="toggle-item">
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
            <span>Email Alerts</span>
          </label>
          <label className="toggle-item">
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
            <span>Discord Notifications</span>
          </label>
          <label className="toggle-item">
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
            <span>Deployment Alerts</span>
          </label>
          <label className="toggle-item">
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
            <span>Error Alerts</span>
          </label>
        </div>
      </div>

      {/* Project Defaults */}
      <div className="settings-section">
        <h4>📐 Project Defaults</h4>
        <div className="settings-field">
          <label>Default Layout</label>
          <select
            value={projectDefaults.defaultLayout}
            onChange={(e) =>
              setProjectDefaults({
                ...projectDefaults,
                defaultLayout: e.target.value,
              })
            }
          >
            <option value="center-out">Center Out</option>
            <option value="grid">Grid</option>
            <option value="tree">Tree</option>
            <option value="free">Free Form</option>
          </select>
        </div>
        <div className="settings-field">
          <label>Grid Size</label>
          <input
            type="number"
            value={projectDefaults.gridSize}
            onChange={(e) =>
              setProjectDefaults({
                ...projectDefaults,
                gridSize: Number(e.target.value),
              })
            }
            min="10"
            max="50"
          />
        </div>
        <div className="settings-toggles">
          <label className="toggle-item">
            <input
              type="checkbox"
              checked={projectDefaults.autoSave}
              onChange={(e) =>
                setProjectDefaults({
                  ...projectDefaults,
                  autoSave: e.target.checked,
                })
              }
            />
            <span>Auto Save</span>
          </label>
          <label className="toggle-item">
            <input
              type="checkbox"
              checked={projectDefaults.snapToGrid}
              onChange={(e) =>
                setProjectDefaults({
                  ...projectDefaults,
                  snapToGrid: e.target.checked,
                })
              }
            />
            <span>Snap to Grid</span>
          </label>
          <label className="toggle-item">
            <input
              type="checkbox"
              checked={projectDefaults.showConnections}
              onChange={(e) =>
                setProjectDefaults({
                  ...projectDefaults,
                  showConnections: e.target.checked,
                })
              }
            />
            <span>Show Connections</span>
          </label>
        </div>
      </div>

      {/* Team Access */}
      <div className="settings-section">
        <h4>👥 Team Access</h4>
        <div className="team-access-list">
          {teamAccess.map((member) => (
            <div key={member.userId} className="team-member">
              <div className="member-info">
                <span className="member-name">{member.userId}</span>
                <span className={`member-role ${member.role}`}>
                  {member.role}
                </span>
              </div>
              <div className="member-permissions">
                <label>
                  <input
                    type="checkbox"
                    checked={member.canEdit}
                    disabled={member.role === "owner"}
                  />
                  <span>Edit</span>
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={member.canDeploy}
                    disabled={member.role === "owner"}
                  />
                  <span>Deploy</span>
                </label>
              </div>
            </div>
          ))}
        </div>
        <button className="add-member-btn">+ Invite Team Member</button>
      </div>

      {/* Environment Variables */}
      <div className="settings-section">
        <h4>🔐 Environment Variables</h4>
        <div className="env-var">
          <span className="env-key">NODE_ENV</span>
          <span className="env-value">production</span>
        </div>
        <div className="env-var">
          <span className="env-key">PORT</span>
          <span className="env-value">3000</span>
        </div>
        <button className="add-env-btn">+ Add Variable</button>
      </div>

      {/* Domain */}
      <div className="settings-section">
        <h4>🌐 Domain</h4>
        <input
          type="text"
          className="settings-input"
          placeholder="your-project.zurto.dev"
        />
      </div>
    </div>
  );
};

// Documentation Panel
const DocumentationPanel: React.FC = () => {
  return (
    <div className="documentation-panel">
      <div className="doc-item">
        <span className="doc-icon">📄</span>
        <span className="doc-name">README.md</span>
      </div>
      <div className="doc-item">
        <span className="doc-icon">📋</span>
        <span className="doc-name">Architecture.md</span>
      </div>
      <div className="doc-item">
        <span className="doc-icon">🔧</span>
        <span className="doc-name">Setup Guide.md</span>
      </div>
      <div className="doc-item">
        <span className="doc-icon">📡</span>
        <span className="doc-name">API Reference.md</span>
      </div>
      <button className="add-doc-btn">+ Add Documentation</button>
    </div>
  );
};

// Agent Status Panel
const AgentStatusPanel: React.FC = () => {
  return (
    <div className="agent-status-panel">
      <div className="agent-status-header">
        <span className="agent-status-dot active"></span>
        <span className="agent-status-text">Agent Active</span>
      </div>
      <div className="agent-current-task">
        <div className="task-label">Current Task</div>
        <div className="task-description">Generating backend API routes...</div>
        <div className="task-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: "65%" }}></div>
          </div>
          <span className="progress-text">65%</span>
        </div>
      </div>
      <div className="agent-history">
        <div className="history-item completed">
          ✓ Project structure generated
        </div>
        <div className="history-item completed">✓ Database schema created</div>
        <div className="history-item in-progress">→ Generating API routes</div>
        <div className="history-item pending">○ Frontend components</div>
      </div>
    </div>
  );
};

// Deploy Panel
const DeployPanel: React.FC = () => {
  return (
    <div className="deploy-panel">
      <div className="deploy-status">
        <div className="deploy-status-icon">🚀</div>
        <div className="deploy-status-text">Ready to Deploy</div>
      </div>
      <div className="deploy-options">
        <label className="deploy-option">
          <input type="checkbox" defaultChecked />
          <span>Run tests before deploy</span>
        </label>
        <label className="deploy-option">
          <input type="checkbox" defaultChecked />
          <span>Backup database</span>
        </label>
        <label className="deploy-option">
          <input type="checkbox" />
          <span>Force rebuild all containers</span>
        </label>
      </div>
      <button className="deploy-btn">🚀 Deploy Project</button>
      <div className="last-deploy">Last deployed: 2 hours ago</div>
    </div>
  );
};

// File Explorer Panel - shows file tree for generated projects
interface FileNode {
  name: string;
  path: string;
  type: "file" | "directory";
  children?: FileNode[];
}

const FileExplorerPanel: React.FC<{ node?: PanelNode | null }> = ({ node }) => {
  const [fileTree, setFileTree] = React.useState<FileNode[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedFile, setSelectedFile] = React.useState<string | null>(null);
  const [fileContent, setFileContent] = React.useState<string>("");
  const [fileLanguage, setFileLanguage] = React.useState<string>("plaintext");
  const [expandedDirs, setExpandedDirs] = React.useState<Set<string>>(
    new Set()
  );

  React.useEffect(() => {
    if (!node?.projectId) {
      setError("No project selected");
      setLoading(false);
      return;
    }

    const fetchFileTree = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/ai/project-files/${node.projectId}`);
        const data = await response.json();

        if (data.success) {
          setFileTree(data.data.fileTree || []);
          setError(null);
        } else {
          setError(data.error || "Failed to load file tree");
        }
      } catch (err) {
        setError("Failed to connect to server");
      } finally {
        setLoading(false);
      }
    };

    fetchFileTree();
  }, [node?.projectId]);

  const handleFileClick = async (filePath: string) => {
    if (!node?.projectId) return;

    try {
      setSelectedFile(filePath);
      const response = await fetch(
        `/api/ai/project-file/${node.projectId}?filePath=${encodeURIComponent(filePath)}`
      );
      const data = await response.json();

      if (data.success) {
        setFileContent(data.data.content);
        setFileLanguage(data.data.language || "plaintext");
      } else {
        setFileContent(`Error: ${data.error}`);
      }
    } catch {
      setFileContent("Error loading file");
    }
  };

  const toggleDir = (path: string) => {
    setExpandedDirs((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const getFileIcon = (name: string, isDir: boolean): string => {
    if (isDir) return "📁";
    const ext = name.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "ts":
      case "tsx":
        return "📘";
      case "js":
      case "jsx":
        return "📙";
      case "json":
        return "📋";
      case "md":
        return "📝";
      case "yml":
      case "yaml":
        return "⚙️";
      case "dockerfile":
        return "🐳";
      case "css":
      case "scss":
        return "🎨";
      case "html":
        return "🌐";
      default:
        return "📄";
    }
  };

  const renderFileTree = (
    nodes: FileNode[],
    depth: number = 0
  ): React.ReactNode => {
    return nodes.map((node) => {
      const isDir = node.type === "directory";
      const isExpanded = expandedDirs.has(node.path);
      const isSelected = selectedFile === node.path;

      return (
        <div key={node.path}>
          <div
            className={`file-tree-item ${isSelected ? "selected" : ""}`}
            style={{ paddingLeft: `${depth * 16 + 8}px` }}
            onClick={() => {
              if (isDir) {
                toggleDir(node.path);
              } else {
                handleFileClick(node.path);
              }
            }}
          >
            {isDir && (
              <span className="tree-arrow">{isExpanded ? "▼" : "▶"}</span>
            )}
            <span className="file-icon">{getFileIcon(node.name, isDir)}</span>
            <span className="file-name">{node.name}</span>
          </div>
          {isDir && isExpanded && node.children && (
            <div className="file-tree-children">
              {renderFileTree(node.children, depth + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  if (!node) {
    return <div className="panel-empty">No node selected</div>;
  }

  if (loading) {
    return (
      <div className="file-explorer-loading">
        <div className="loading-spinner">⏳</div>
        <div>Loading files...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="file-explorer-error">
        <div className="error-icon">⚠️</div>
        <div>{error}</div>
        <div className="error-hint">
          Make sure code has been generated for this project using the AI
          pipeline.
        </div>
      </div>
    );
  }

  return (
    <div className="file-explorer-panel">
      <div className="file-explorer-header">
        <span className="node-type-badge">{node.type}</span>
        <span className="node-name">{node.name}</span>
      </div>

      <div className="file-explorer-container">
        <div className="file-tree-pane">
          {fileTree.length > 0 ? (
            renderFileTree(fileTree)
          ) : (
            <div className="file-tree-empty">
              No files generated yet. Run the code generation pipeline first.
            </div>
          )}
        </div>

        {selectedFile && (
          <div className="file-content-pane">
            <div className="file-content-header">
              <span className="file-path">{selectedFile}</span>
              <span className="file-language">{fileLanguage}</span>
            </div>
            <div className="file-content-editor">
              <pre className="code-block">
                <code>{fileContent}</code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidePanel;
