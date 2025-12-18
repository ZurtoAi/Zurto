import React, { useState, useEffect } from "react";
import { aiAPI } from "../services/api";
import "../styles/AIInsightsPanel.css";

interface Insight {
  id: string;
  type:
    | "best_practice"
    | "optimization"
    | "risk"
    | "opportunity"
    | "recommendation";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  actionItems: string[];
  relatedTechnologies?: string[];
  createdAt: string;
}

interface AIInsightsPanelProps {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({
  projectId,
  isOpen,
  onClose,
}) => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "insights" | "architecture" | "performance" | "testing" | "security"
  >("insights");

  useEffect(() => {
    if (isOpen && projectId) {
      loadInsights();
    }
  }, [isOpen, projectId]);

  const loadInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await aiAPI.getInsights(projectId);
      setInsights(data.data.insights || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load insights");
    } finally {
      setLoading(false);
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "#e74c3c";
      case "medium":
        return "#f39c12";
      case "low":
        return "#27ae60";
      default:
        return "#95a5a6";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "best_practice":
        return "💡";
      case "optimization":
        return "⚡";
      case "risk":
        return "⚠️";
      case "opportunity":
        return "🎯";
      case "recommendation":
        return "📌";
      default:
        return "📝";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="ai-insights-overlay" onClick={onClose}>
      <div className="ai-insights-panel" onClick={(e) => e.stopPropagation()}>
        <div className="ai-insights-header">
          <h2>🤖 AI Insights & Recommendations</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="ai-insights-tabs">
          <button
            className={`tab-btn ${activeTab === "insights" ? "active" : ""}`}
            onClick={() => setActiveTab("insights")}
          >
            Insights
          </button>
          <button
            className={`tab-btn ${activeTab === "architecture" ? "active" : ""}`}
            onClick={() => setActiveTab("architecture")}
          >
            Architecture
          </button>
          <button
            className={`tab-btn ${activeTab === "performance" ? "active" : ""}`}
            onClick={() => setActiveTab("performance")}
          >
            Performance
          </button>
          <button
            className={`tab-btn ${activeTab === "testing" ? "active" : ""}`}
            onClick={() => setActiveTab("testing")}
          >
            Testing
          </button>
          <button
            className={`tab-btn ${activeTab === "security" ? "active" : ""}`}
            onClick={() => setActiveTab("security")}
          >
            Security
          </button>
        </div>

        <div className="ai-insights-content">
          {loading && <div className="loading">Loading insights...</div>}
          {error && <div className="error">Error: {error}</div>}

          {activeTab === "insights" && (
            <div className="insights-list">
              {insights.length === 0 ? (
                <p className="empty">
                  No insights available yet. Run questionnaire analysis first.
                </p>
              ) : (
                insights.map((insight) => (
                  <div
                    key={insight.id}
                    className="insight-card"
                    style={{ borderLeftColor: getImpactColor(insight.impact) }}
                  >
                    <div className="insight-header">
                      <span className="insight-icon">
                        {getTypeIcon(insight.type)}
                      </span>
                      <h4>{insight.title}</h4>
                      <span
                        className={`impact-badge impact-${insight.impact}`}
                        style={{
                          backgroundColor: getImpactColor(insight.impact),
                        }}
                      >
                        {insight.impact.toUpperCase()}
                      </span>
                    </div>

                    <p className="insight-description">{insight.description}</p>

                    {insight.actionItems.length > 0 && (
                      <div className="action-items">
                        <strong>Action Items:</strong>
                        <ul>
                          {insight.actionItems.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {insight.relatedTechnologies &&
                      insight.relatedTechnologies.length > 0 && (
                        <div className="technologies">
                          {insight.relatedTechnologies.map((tech, idx) => (
                            <span key={idx} className="tech-badge">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "architecture" && (
            <ArchitectureTab projectId={projectId} />
          )}

          {activeTab === "performance" && (
            <PerformanceTab projectId={projectId} />
          )}

          {activeTab === "testing" && <TestingTab projectId={projectId} />}

          {activeTab === "security" && <SecurityTab projectId={projectId} />}
        </div>
      </div>
    </div>
  );
};

// Architecture Tab Component
const ArchitectureTab: React.FC<{ projectId: string }> = ({ projectId }) => {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadArchitecture();
  }, [projectId]);

  const loadArchitecture = async () => {
    setLoading(true);
    try {
      const data = await aiAPI.getArchitectureRecommendations(projectId);
      setRecommendations(data.data.recommendations || []);
    } catch (err) {
      console.error("Failed to load architecture recommendations");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="loading">Loading architecture recommendations...</div>
    );

  return (
    <div className="recommendations-list">
      {recommendations.length === 0 ? (
        <p className="empty">No architecture recommendations available.</p>
      ) : (
        recommendations.map((rec, idx) => (
          <div key={idx} className="recommendation-item">
            <span className="icon">🏗️</span>
            <p>{rec}</p>
          </div>
        ))
      )}
    </div>
  );
};

// Performance Tab Component
const PerformanceTab: React.FC<{ projectId: string }> = ({ projectId }) => {
  const [optimizations, setOptimizations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPerformance();
  }, [projectId]);

  const loadPerformance = async () => {
    setLoading(true);
    try {
      const data = await aiAPI.getPerformanceRecommendations(projectId);
      setOptimizations(data.data.optimizations || []);
    } catch (err) {
      console.error("Failed to load performance recommendations");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <div className="loading">Loading performance optimizations...</div>;

  return (
    <div className="recommendations-list">
      {optimizations.length === 0 ? (
        <p className="empty">No performance optimizations available.</p>
      ) : (
        optimizations.map((opt, idx) => (
          <div key={idx} className="recommendation-item">
            <span className="icon">⚡</span>
            <p>{opt}</p>
          </div>
        ))
      )}
    </div>
  );
};

// Testing Tab Component
const TestingTab: React.FC<{ projectId: string }> = ({ projectId }) => {
  const [strategy, setStrategy] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTestingStrategy();
  }, [projectId]);

  const loadTestingStrategy = async () => {
    setLoading(true);
    try {
      const data = await aiAPI.getTestingStrategy(projectId);
      setStrategy(data.data.strategy);
    } catch (err) {
      console.error("Failed to load testing strategy");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <div className="loading">Loading testing strategy...</div>;
  if (!strategy) return <p className="empty">No testing strategy available.</p>;

  return (
    <div className="testing-strategy">
      <div className="strategy-grid">
        <div
          className={`strategy-item ${strategy.unitTesting ? "enabled" : "disabled"}`}
        >
          <input type="checkbox" checked={strategy.unitTesting} readOnly />
          <label>Unit Testing</label>
        </div>
        <div
          className={`strategy-item ${strategy.integrationTesting ? "enabled" : "disabled"}`}
        >
          <input
            type="checkbox"
            checked={strategy.integrationTesting}
            readOnly
          />
          <label>Integration Testing</label>
        </div>
        <div
          className={`strategy-item ${strategy.e2eTesting ? "enabled" : "disabled"}`}
        >
          <input type="checkbox" checked={strategy.e2eTesting} readOnly />
          <label>E2E Testing</label>
        </div>
        <div
          className={`strategy-item ${strategy.performanceTesting ? "enabled" : "disabled"}`}
        >
          <input
            type="checkbox"
            checked={strategy.performanceTesting}
            readOnly
          />
          <label>Performance Testing</label>
        </div>
        <div
          className={`strategy-item ${strategy.securityTesting ? "enabled" : "disabled"}`}
        >
          <input type="checkbox" checked={strategy.securityTesting} readOnly />
          <label>Security Testing</label>
        </div>
      </div>

      <div className="recommendations">
        <strong>Recommendations:</strong>
        <ul>
          {strategy.recommendations.map((rec: string, idx: number) => (
            <li key={idx}>{rec}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Security Tab Component
const SecurityTab: React.FC<{ projectId: string }> = ({ projectId }) => {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSecurity();
  }, []);

  const loadSecurity = async () => {
    setLoading(true);
    try {
      const data = await aiAPI.getSecurityRecommendations();
      setRecommendations(data.data.recommendations || []);
    } catch (err) {
      console.error("Failed to load security recommendations");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <div className="loading">Loading security recommendations...</div>;

  return (
    <div className="recommendations-list">
      {recommendations.length === 0 ? (
        <p className="empty">No security recommendations available.</p>
      ) : (
        recommendations.map((rec, idx) => (
          <div key={idx} className="recommendation-item">
            <span className="icon">🔒</span>
            <p>{rec}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default AIInsightsPanel;
