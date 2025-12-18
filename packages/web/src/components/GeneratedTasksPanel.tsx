import React, { useState } from "react";
import { aiAPI } from "../services/api";
import "../styles/GeneratedTasksPanel.css";

interface GeneratedTask {
  title: string;
  description: string;
  priority: "critical" | "high" | "medium" | "low";
  estimatedHours: number;
  category: string;
  dependencies?: string[];
  assignee?: string;
}

interface GeneratedTasksPanelProps {
  projectId: string;
  onTasksGenerated?: () => void;
}

export const GeneratedTasksPanel: React.FC<GeneratedTasksPanelProps> = ({
  projectId,
  onTasksGenerated,
}) => {
  const [tasks, setTasks] = useState<GeneratedTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await aiAPI.generateTasks(projectId);
      setTasks(data.data.tasks || []);
      setGenerated(true);
      onTasksGenerated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate tasks");
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "#e74c3c";
      case "high":
        return "#e67e22";
      case "medium":
        return "#f39c12";
      case "low":
        return "#27ae60";
      default:
        return "#95a5a6";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "setup":
        return "⚙️";
      case "development":
        return "👨‍💻";
      case "testing":
        return "🧪";
      case "deployment":
        return "🚀";
      case "documentation":
        return "📚";
      default:
        return "📝";
    }
  };

  return (
    <div className="generated-tasks-panel">
      <div className="tasks-header">
        <h3>📋 AI-Generated Planning Tasks</h3>
        <button
          className="generate-btn"
          onClick={generateTasks}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Tasks"}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {!generated && !loading && (
        <div className="empty-state">
          <p>Generate AI-powered tasks based on your project analysis.</p>
          <p className="hint">
            Tasks will be automatically added to your planning canvas.
          </p>
        </div>
      )}

      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>AI is generating your project tasks...</p>
        </div>
      )}

      {generated && tasks.length > 0 && (
        <div className="tasks-grid">
          <div className="tasks-summary">
            <div className="summary-stat">
              <span className="stat-value">{tasks.length}</span>
              <span className="stat-label">Tasks</span>
            </div>
            <div className="summary-stat">
              <span className="stat-value">
                {tasks.reduce((sum, t) => sum + t.estimatedHours, 0)}h
              </span>
              <span className="stat-label">Estimated</span>
            </div>
            <div className="summary-stat">
              <span className="stat-value">
                {Math.ceil(
                  tasks.reduce((sum, t) => sum + t.estimatedHours, 0) / 8
                )}
                d
              </span>
              <span className="stat-label">Duration</span>
            </div>
          </div>

          <div className="tasks-list">
            {tasks.map((task, idx) => (
              <div key={idx} className="task-item">
                <div className="task-top">
                  <div className="task-title-section">
                    <span className="category-icon">
                      {getCategoryIcon(task.category)}
                    </span>
                    <h4>{task.title}</h4>
                  </div>
                  <span
                    className={`priority-badge priority-${task.priority}`}
                    style={{
                      backgroundColor: getPriorityColor(task.priority),
                    }}
                  >
                    {task.priority.toUpperCase()}
                  </span>
                </div>

                <p className="task-description">{task.description}</p>

                <div className="task-details">
                  <div className="detail-item">
                    <span className="label">Category:</span>
                    <span className="value">{task.category}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Est. Hours:</span>
                    <span className="value">{task.estimatedHours}h</span>
                  </div>
                  {task.dependencies && task.dependencies.length > 0 && (
                    <div className="detail-item full-width">
                      <span className="label">Dependencies:</span>
                      <div className="dependencies">
                        {task.dependencies.map((dep, depIdx) => (
                          <span key={depIdx} className="dependency-tag">
                            {dep}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneratedTasksPanel;
