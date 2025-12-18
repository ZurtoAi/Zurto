import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { socketService } from "../services/socket";
import { projectsAPI, nodesAPI, aiAPI } from "../services/api";
import { AIQuestionnaire } from "../components/AIQuestionnaire";
import "../styles/ProjectPicker.css";

const API_BASE = import.meta.env.VITE_API_URL || "";

interface Project {
  id: string;
  name: string;
  description?: string;
  nodeCount: number;
  status: "active" | "pending" | "archived";
  isDeployed: boolean;
  lastModified: string;
  creatorName?: string;
}

interface TeamMember {
  id: string;
  username: string;
  isTeamLeader: boolean;
  isAdmin: boolean;
  lastActiveAt?: string;
}

interface AuditLogEntry {
  id: string;
  action: string;
  username: string;
  resourceType: string;
  resourceId: string;
  timestamp: string;
  details?: Record<string, unknown>;
}

interface TeamStats {
  totalProjects: number;
  deployedProjects: number;
  teamMembers: number;
  totalNodes: number;
}

const ProjectPicker: React.FC = () => {
  const navigate = useNavigate();
  const { user, accessToken, isTeamLeader } = useAuth();

  // Data state
  const [projects, setProjects] = useState<Project[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [stats, setStats] = useState<TeamStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);

  // Search and filter
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"projects" | "team" | "activity">(
    "projects"
  );

  // Create project modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [newProjectId, setNewProjectId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Planning generation state
  const [isGeneratingPlanning, setIsGeneratingPlanning] = useState(false);
  const [planningError, setPlanningError] = useState<string | null>(null);
  const [pendingPlanningResult, setPendingPlanningResult] = useState<{
    projectPlan: any;
    questionsAndAnswers: any[];
    analysis: any;
  } | null>(null);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      if (!accessToken) return;

      try {
        setLoading(true);
        const headers = {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        };

        // Fetch projects
        const response = await projectsAPI.list();
        const projectsList =
          (response as any)?.projects ||
          (response as any)?.data ||
          response ||
          [];

        if (Array.isArray(projectsList)) {
          const transformedProjects: Project[] = projectsList.map(
            (proj: any) => ({
              id: proj.id,
              name: proj.name,
              description: proj.description,
              nodeCount: proj.nodes?.length || proj.nodeCount || 0,
              status: proj.status || "active",
              isDeployed: proj.isDeployed || false,
              lastModified:
                proj.updated_at || proj.updatedAt || new Date().toISOString(),
              creatorName: proj.creatorName,
            })
          );
          setProjects(transformedProjects);

          // Calculate stats
          setStats({
            totalProjects: transformedProjects.length,
            deployedProjects: transformedProjects.filter((p) => p.isDeployed)
              .length,
            teamMembers: teamMembers.length || 1,
            totalNodes: transformedProjects.reduce(
              (acc, p) => acc + p.nodeCount,
              0
            ),
          });
        }

        // Fetch team members (if team leader)
        if (isTeamLeader && user?.teamId) {
          try {
            const teamRes = await fetch(
              `${API_BASE}/api/auth/teams/${user.teamId}`,
              { headers }
            );
            if (teamRes.ok) {
              const teamData = await teamRes.json();
              if (teamData.success && teamData.data?.members) {
                setTeamMembers(teamData.data.members || []);
              }
            }
          } catch (err) {
            console.log("Could not fetch team members");
          }
        }

        // Fetch audit logs
        try {
          const auditRes = await fetch(
            `${API_BASE}/api/auth/audit-logs?limit=20`,
            { headers }
          );
          if (auditRes.ok) {
            const auditData = await auditRes.json();
            if (auditData.success) {
              setAuditLogs(auditData.data || []);
            }
          }
        } catch (err) {
          console.log("Could not fetch audit logs");
        }
      } catch (err: any) {
        console.error("Failed to fetch data:", err);
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accessToken, isTeamLeader, user?.teamId]);

  useEffect(() => {
    socketService
      .connect()
      .then(() => {
        setSocketConnected(true);
      })
      .catch((err) => {
        console.error("Socket connection failed:", err);
      });

    return () => {
      socketService.disconnect();
    };
  }, []);

  // Filter projects
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreateProject = () => {
    setShowCreateModal(true);
  };

  const handleSubmitCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    setIsCreating(true);
    try {
      const response = await projectsAPI.create(
        newProjectName,
        newProjectDesc || undefined
      );
      const createdProject = (response as any)?.data || response;

      if (createdProject && createdProject.id) {
        setNewProjectId(createdProject.id);
        setShowCreateModal(false);
        setShowQuestionnaire(true);

        const newProject: Project = {
          id: createdProject.id,
          name: newProjectName,
          description: newProjectDesc,
          nodeCount: 0,
          status: "active",
          isDeployed: false,
          lastModified: new Date().toISOString(),
        };
        setProjects([...projects, newProject]);
      }
    } catch (err) {
      console.error("Failed to create project:", err);
      const newProject: Project = {
        id: `proj-${Date.now()}`,
        name: newProjectName,
        description: newProjectDesc,
        nodeCount: 0,
        status: "active",
        isDeployed: false,
        lastModified: new Date().toISOString(),
      };
      setNewProjectId(newProject.id);
      setProjects([...projects, newProject]);
      setShowCreateModal(false);
      setShowQuestionnaire(true);
    } finally {
      setIsCreating(false);
    }
  };

  // Generate planning documents with retry support
  const generatePlanningDocuments = async (
    projectId: string,
    projectPlan: any,
    questionsAndAnswers: any[],
    analysis: any
  ) => {
    setIsGeneratingPlanning(true);
    setPlanningError(null);

    try {
      console.log("🚀 Generating planning documents...");
      const planningResult = await aiAPI.generatePlanning(
        projectId,
        projectPlan,
        questionsAndAnswers,
        analysis
      );

      console.log("✅ Planning documents generated:", planningResult);
      setIsGeneratingPlanning(false);
      setShowQuestionnaire(false);
      setPendingPlanningResult(null);
      navigate(`/canvas/${projectId}`);
      setNewProjectName("");
      setNewProjectDesc("");
      setNewProjectId(null);
    } catch (err: any) {
      console.error("❌ Failed to generate planning documents:", err);
      const errorMessage =
        err?.error || err?.message || "Failed to generate planning documents";
      setPlanningError(errorMessage);
      setIsGeneratingPlanning(false);
      // Store for retry
      setPendingPlanningResult({ projectPlan, questionsAndAnswers, analysis });
    }
  };

  // Retry planning generation
  const handleRetryPlanning = () => {
    if (pendingPlanningResult && newProjectId) {
      generatePlanningDocuments(
        newProjectId,
        pendingPlanningResult.projectPlan,
        pendingPlanningResult.questionsAndAnswers,
        pendingPlanningResult.analysis
      );
    }
  };

  // Skip planning and go to canvas
  const handleSkipPlanning = () => {
    setIsGeneratingPlanning(false);
    setPlanningError(null);
    setPendingPlanningResult(null);
    setShowQuestionnaire(false);
    if (newProjectId) {
      navigate(`/canvas/${newProjectId}`);
    }
    setNewProjectName("");
    setNewProjectDesc("");
    setNewProjectId(null);
  };

  const handleQuestionnaireComplete = async (result: {
    answers: Record<string, unknown>;
    projectPlan?: {
      summary: string;
      features: string[];
      architecture: string;
      techStack: string[];
      estimatedComplexity: "low" | "medium" | "high";
    };
    analysis?: {
      understanding: string;
      confidence: number;
    };
    questionsAndAnswers?: Array<{
      question: string;
      category: string;
      answer: unknown;
    }>;
  }) => {
    console.log("Questionnaire completed:", result);

    // Generate planning documents (creates 1 planning node + MD file children)
    if (result.projectPlan && newProjectId) {
      await generatePlanningDocuments(
        newProjectId,
        result.projectPlan,
        result.questionsAndAnswers || [],
        result.analysis
      );
    } else {
      // No project plan, just navigate
      setShowQuestionnaire(false);
      if (newProjectId) {
        navigate(`/canvas/${newProjectId}`);
      }
      setNewProjectName("");
      setNewProjectDesc("");
      setNewProjectId(null);
    }
  };

  const handleQuestionnaireClose = () => {
    setShowQuestionnaire(false);
    if (newProjectId) {
      navigate(`/canvas/${newProjectId}`);
    }
    setNewProjectName("");
    setNewProjectDesc("");
    setNewProjectId(null);
  };

  const handleSelectProject = (projectId: string) => {
    navigate(`/canvas/${projectId}`);
  };

  const handleDeleteProject = async (
    e: React.MouseEvent,
    projectId: string,
    projectName: string
  ) => {
    e.stopPropagation(); // Prevent card click

    if (
      !confirm(
        `Are you sure you want to delete "${projectName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await projectsAPI.delete(projectId);
      setProjects(projects.filter((p) => p.id !== projectId));
    } catch (err) {
      console.error("Failed to delete project:", err);
      alert("Failed to delete project. Please try again.");
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const formatAction = (action: string) => {
    return action.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="team-dashboard">
      <Header showBackButton={false} />

      <main className="dashboard-main">
        {/* Team Header */}
        <div className="team-header">
          <div className="team-info">
            <div className="team-avatar">
              <span>{user?.teamName?.[0] || "T"}</span>
            </div>
            <div className="team-details">
              <h1>{user?.teamName || "My Team"}</h1>
              <p className="team-subtitle">
                Welcome back, <strong>{user?.username}</strong>
                {isTeamLeader && (
                  <span className="leader-badge">Team Leader</span>
                )}
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="stats-row">
            <div className="stat-mini">
              <span className="stat-mini-value">
                {stats?.totalProjects || 0}
              </span>
              <span className="stat-mini-label">Projects</span>
            </div>
            <div className="stat-mini">
              <span className="stat-mini-value">
                {stats?.deployedProjects || 0}
              </span>
              <span className="stat-mini-label">Deployed</span>
            </div>
            <div className="stat-mini">
              <span className="stat-mini-value">{stats?.totalNodes || 0}</span>
              <span className="stat-mini-label">Nodes</span>
            </div>
            <div className="stat-mini">
              <span className="stat-mini-value">{stats?.teamMembers || 1}</span>
              <span className="stat-mini-label">Members</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="dashboard-tabs">
          <button
            className={`tab ${activeTab === "projects" ? "active" : ""}`}
            onClick={() => setActiveTab("projects")}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
            Projects
          </button>
          {isTeamLeader && (
            <button
              className={`tab ${activeTab === "team" ? "active" : ""}`}
              onClick={() => setActiveTab("team")}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Team
            </button>
          )}
          <button
            className={`tab ${activeTab === "activity" ? "active" : ""}`}
            onClick={() => setActiveTab("activity")}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            Activity
          </button>
        </div>

        {/* Content Area */}
        <div className="dashboard-content">
          {loading ? (
            <div className="loading-state">
              <div className="spinner" />
              <span>Loading...</span>
            </div>
          ) : error ? (
            <div className="error-state">
              <span className="error-icon">⚠️</span>
              <h2>Error loading data</h2>
              <p>{error}</p>
              <button
                className="btn-primary"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {/* Projects Tab */}
              {activeTab === "projects" && (
                <div className="projects-section">
                  <div className="section-toolbar">
                    <div className="search-box">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                      <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <select
                      className="filter-select"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="archived">Archived</option>
                    </select>
                    <button
                      className="btn-primary"
                      onClick={handleCreateProject}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      New Project
                    </button>
                  </div>

                  {filteredProjects.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">📁</div>
                      <h3>No projects yet</h3>
                      <p>Create your first project to get started</p>
                      <button
                        className="btn-primary-large"
                        onClick={handleCreateProject}
                      >
                        Create Project
                      </button>
                    </div>
                  ) : (
                    <div className="projects-grid">
                      {filteredProjects.map((project) => (
                        <div
                          key={project.id}
                          className={`project-card ${project.isDeployed ? "deployed" : ""}`}
                          onClick={() => handleSelectProject(project.id)}
                        >
                          <div className="project-card-header">
                            <div className="project-icon">
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                              </svg>
                            </div>
                            <div className="project-card-actions">
                              <button
                                className="delete-project-btn"
                                onClick={(e) =>
                                  handleDeleteProject(
                                    e,
                                    project.id,
                                    project.name
                                  )
                                }
                                title="Delete project"
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <polyline points="3 6 5 6 21 6" />
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                  <line x1="10" y1="11" x2="10" y2="17" />
                                  <line x1="14" y1="11" x2="14" y2="17" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          <div className="project-badges">
                            {project.isDeployed && (
                              <span className="badge deployed">✓ Deployed</span>
                            )}
                            <span className={`badge status-${project.status}`}>
                              {project.status}
                            </span>
                          </div>

                          <h3 className="project-name">{project.name}</h3>
                          {project.description && (
                            <p className="project-desc">
                              {project.description}
                            </p>
                          )}

                          <div className="project-stats">
                            <span className="stat">
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <circle cx="12" cy="12" r="3" />
                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                              </svg>
                              {project.nodeCount} nodes
                            </span>
                            <span className="stat">
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                              </svg>
                              {formatDate(project.lastModified)}
                            </span>
                          </div>
                        </div>
                      ))}

                      <button
                        className="create-card"
                        onClick={handleCreateProject}
                      >
                        <div className="create-icon">+</div>
                        <span>New Project</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Team Tab */}
              {activeTab === "team" && isTeamLeader && (
                <div className="team-section">
                  <div className="section-header">
                    <h2>Team Members</h2>
                    <span className="count">{teamMembers.length} members</span>
                  </div>

                  {teamMembers.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">👥</div>
                      <h3>No team members</h3>
                      <p>Contact an admin to add members to your team</p>
                    </div>
                  ) : (
                    <div className="members-list">
                      {teamMembers.map((member) => (
                        <div key={member.id} className="member-row">
                          <div className="member-avatar">
                            {member.username[0].toUpperCase()}
                          </div>
                          <div className="member-info">
                            <span className="member-name">
                              {member.username}
                            </span>
                            <span className="member-role">
                              {member.isAdmin && "Admin"}
                              {member.isTeamLeader &&
                                !member.isAdmin &&
                                "Team Leader"}
                              {!member.isAdmin &&
                                !member.isTeamLeader &&
                                "Member"}
                            </span>
                          </div>
                          <span className="member-activity">
                            {member.lastActiveAt
                              ? formatDate(member.lastActiveAt)
                              : "—"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Activity Tab */}
              {activeTab === "activity" && (
                <div className="activity-section">
                  <div className="section-header">
                    <h2>Recent Activity</h2>
                    <span className="count">{auditLogs.length} events</span>
                  </div>

                  {auditLogs.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">📊</div>
                      <h3>No activity yet</h3>
                      <p>Activity will appear here as you use Zurto</p>
                    </div>
                  ) : (
                    <div className="activity-list">
                      {auditLogs.map((log) => (
                        <div key={log.id} className="activity-row">
                          <div
                            className={`activity-icon ${log.action.split("_")[0]}`}
                          >
                            {log.action.includes("create") && "✨"}
                            {log.action.includes("update") && "✏️"}
                            {log.action.includes("delete") && "🗑️"}
                            {log.action.includes("login") && "🔑"}
                            {log.action.includes("deploy") && "🚀"}
                            {!log.action.match(
                              /create|update|delete|login|deploy/
                            ) && "📌"}
                          </div>
                          <div className="activity-info">
                            <span className="activity-text">
                              <strong>{log.username}</strong>{" "}
                              {formatAction(log.action).toLowerCase()}
                            </span>
                            <span className="activity-meta">
                              {log.resourceType}: {log.resourceId}
                            </span>
                          </div>
                          <span className="activity-time">
                            {formatDate(log.timestamp)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowCreateModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Project</h2>
              <button
                className="btn-close"
                onClick={() => setShowCreateModal(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmitCreateProject}>
              <div className="form-group">
                <label>Project Name *</label>
                <input
                  type="text"
                  placeholder="Enter project name..."
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  autoFocus
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  placeholder="Brief description..."
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isCreating || !newProjectName.trim()}
                >
                  {isCreating ? "Creating..." : "Create & Setup"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI-powered Questionnaire */}
      {showQuestionnaire && newProjectId && (
        <AIQuestionnaire
          projectId={newProjectId}
          projectName={newProjectName}
          initialDescription={newProjectDesc}
          isOpen={showQuestionnaire}
          onComplete={handleQuestionnaireComplete}
          onClose={handleQuestionnaireClose}
        />
      )}

      {/* Planning Generation Overlay */}
      {(isGeneratingPlanning || planningError) && (
        <div className="modal-overlay" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content planning-generation-modal">
            <div className="modal-header">
              <h2>
                {isGeneratingPlanning
                  ? "🤖 AI Generating Documents..."
                  : "❌ Generation Failed"}
              </h2>
            </div>
            <div className="planning-generation-content">
              {isGeneratingPlanning ? (
                <>
                  <div className="loading-spinner-large"></div>
                  <p className="generation-status">
                    Creating planning documents for{" "}
                    <strong>{newProjectName}</strong>
                  </p>
                  <p className="generation-details">
                    📄 README.md, ARCHITECTURE.md, DEPLOY.md, and more...
                  </p>
                  <p className="generation-note">
                    This may take a moment as the AI analyzes your requirements.
                  </p>
                </>
              ) : (
                <>
                  <div className="error-icon">⚠️</div>
                  <p className="error-message">{planningError}</p>
                  <p className="error-hint">
                    This may be due to a temporary API issue or the response
                    being too complex.
                  </p>
                  <div className="modal-actions">
                    <button
                      className="btn-secondary"
                      onClick={handleSkipPlanning}
                    >
                      Skip & Continue to Canvas
                    </button>
                    <button
                      className="btn-primary"
                      onClick={handleRetryPlanning}
                    >
                      🔄 Retry Generation
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectPicker;
