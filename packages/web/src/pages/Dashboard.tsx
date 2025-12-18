import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Header } from "../components/Header";
import ProjectCard from "../components/ProjectCard";
import { socketService } from "../services/socket";
import { projectsAPI, portsAPI, nodesAPI } from "../services/api";
import { AIQuestionnaire } from "../components/AIQuestionnaire";
import { VisualSketch } from "../components/VisualSketch";
import {
  FolderKanban,
  Network,
  Plug,
  Clock,
  Container,
  Cpu,
  MemoryStick,
  HardDrive,
  Activity,
  Rocket,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Globe,
  Zap,
  Terminal,
  TrendingUp,
  Server,
  Search,
  Filter,
  Users,
  UserPlus,
  LayoutGrid,
  List,
  Trash2,
  FolderPlus,
  Copy,
  MoreHorizontal,
  CheckSquare,
  Square,
  FileCode,
  Layers,
  X,
  Plus,
} from "lucide-react";
import "../styles/Dashboard.css";

interface Project {
  id: string;
  name: string;
  nodeCount: number;
  status: "active" | "inactive" | "archived";
  lastModified: string;
  description?: string;
  teamName?: string;
  // Enhanced project info
  port?: number;
  uptime?: string;
  lastBuild?: string;
  cpuUsage?: number;
  memoryUsage?: number;
}

interface DashboardStats {
  totalProjects: number;
  totalNodes: number;
  allocatedPorts: number;
  uptime: string;
}

const Dashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [dataSource, setDataSource] = useState<"api" | "local">("api");
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalNodes: 0,
    allocatedPorts: 0,
    uptime: "99.9%",
  });

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive" | "archived"
  >("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Bulk Actions State
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Team Members State
  const [showTeamPanel, setShowTeamPanel] = useState(false);
  const [teamMembers] = useState([
    { id: "1", name: "You", role: "Owner", avatar: "👤", status: "online" },
    {
      id: "2",
      name: "John Doe",
      role: "Developer",
      avatar: "👨‍💻",
      status: "online",
    },
    {
      id: "3",
      name: "Jane Smith",
      role: "Designer",
      avatar: "👩‍🎨",
      status: "away",
    },
    {
      id: "4",
      name: "Mike Wilson",
      role: "DevOps",
      avatar: "🧑‍💼",
      status: "offline",
    },
  ]);

  // Project Templates State
  const [showTemplates, setShowTemplates] = useState(false);
  const templates = [
    {
      id: "react-vite",
      name: "React + Vite",
      icon: "⚛️",
      description: "Modern React setup with Vite bundler",
    },
    {
      id: "next-app",
      name: "Next.js App",
      icon: "▲",
      description: "Full-stack React framework",
    },
    {
      id: "express-api",
      name: "Express API",
      icon: "🚀",
      description: "Node.js REST API boilerplate",
    },
    {
      id: "discord-bot",
      name: "Discord Bot",
      icon: "🤖",
      description: "Discord.js bot template",
    },
    {
      id: "fullstack",
      name: "Full Stack",
      icon: "📦",
      description: "React + Express + PostgreSQL",
    },
  ];

  // Filtered projects
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Bulk selection handlers
  const toggleProjectSelection = (projectId: string) => {
    setSelectedProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    );
  };

  const selectAllProjects = () => {
    if (selectedProjects.length === filteredProjects.length) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(filteredProjects.map((p) => p.id));
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedProjects.length} project(s)?`)) return;
    // Delete logic here
    setProjects((prev) => prev.filter((p) => !selectedProjects.includes(p.id)));
    setSelectedProjects([]);
  };

  const handleBulkArchive = async () => {
    setProjects((prev) =>
      prev.map((p) =>
        selectedProjects.includes(p.id)
          ? { ...p, status: "archived" as const }
          : p
      )
    );
    setSelectedProjects([]);
  };

  // Create project modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [showVisualSketch, setShowVisualSketch] = useState(false);
  const [projectPlan, setProjectPlan] = useState<
    | {
        summary: string;
        features: string[];
        architecture: string;
        techStack: string[];
        estimatedComplexity: "low" | "medium" | "high";
      }
    | undefined
  >(undefined);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [newProjectId, setNewProjectId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/signin");
    }
  }, [isAuthenticated, navigate]);

  // Transform API response to display format
  const transformApiProjects = (apiProjects: any[]): Project[] => {
    return apiProjects.map((proj) => ({
      id: proj.id,
      name: proj.name,
      nodeCount: proj.nodes?.length || proj.nodeCount || 0,
      status: proj.status || "active",
      lastModified: proj.updatedAt || new Date().toISOString(),
      description: proj.description,
      teamName: proj.teamName || user?.teamId || "My Team",
      port: proj.port || 3000,
      uptime: proj.uptime || "99.9%",
      lastBuild: proj.lastBuild || proj.updatedAt,
      cpuUsage: proj.cpuUsage || 15,
      memoryUsage: proj.memoryUsage || 35,
    }));
  };

  // Fetch projects - API only
  const fetchProjects = useCallback(async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch from API only
      const response = (await projectsAPI.list()) as any;
      const projectsList =
        response?.projects || response?.data || response || [];

      if (Array.isArray(projectsList) && projectsList.length > 0) {
        setProjects(transformApiProjects(projectsList));
        setDataSource("api");

        // Calculate stats
        const totalNodes = projectsList.reduce(
          (acc: number, p: any) => acc + (p.nodes?.length || p.nodeCount || 0),
          0
        );

        setStats((prev) => ({
          ...prev,
          totalProjects: projectsList.length,
          totalNodes,
        }));

        console.log("✅ Loaded", projectsList.length, "projects from API");
      } else {
        setError("No projects available");
      }

      // Fetch port allocations
      try {
        const portsResponse = (await portsAPI.list()) as any;
        const allocations = portsResponse?.data?.allocations || [];
        setStats((prev) => ({
          ...prev,
          allocatedPorts: allocations.length,
        }));
      } catch (portErr) {
        console.warn("Could not fetch ports:", portErr);
      }
    } catch (err: any) {
      console.error("❌ Failed to fetch projects from API:", err.message);
      setError("Failed to load projects from API");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    // Initialize Socket.io
    socketService
      .connect()
      .then(() => {
        setSocketConnected(true);
        console.log("✅ Socket.io connected");
      })
      .catch((err) => {
        console.error("❌ Socket.io connection failed:", err);
      });

    return () => {
      socketService.disconnect();
    };
  }, []);

  const handleCreateProject = () => {
    setShowCreateModal(true);
  };

  const handleSubmitCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    setIsCreating(true);
    try {
      // Call API to create project
      const response = await projectsAPI.create(
        newProjectName,
        newProjectDesc || undefined
      );

      const createdProject = response?.data || response;

      if (createdProject && createdProject.id) {
        setNewProjectId(createdProject.id);
        setShowCreateModal(false);
        setShowQuestionnaire(true);

        // Also add to local state for immediate display
        const newProject: Project = {
          id: createdProject.id,
          name: newProjectName,
          nodeCount: 0,
          status: "active",
          lastModified: new Date().toISOString(),
          description: newProjectDesc,
        };
        setProjects([...projects, newProject]);
      }
    } catch (err) {
      console.error("Failed to create project:", err);
      // Fallback: create locally
      const newProject: Project = {
        id: `proj-${Date.now()}`,
        name: newProjectName,
        nodeCount: 0,
        status: "active",
        lastModified: new Date().toISOString(),
        description: newProjectDesc,
      };
      setNewProjectId(newProject.id);
      setProjects([...projects, newProject]);
      setShowCreateModal(false);
      setShowQuestionnaire(true);
    } finally {
      setIsCreating(false);
    }
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
  }) => {
    console.log("Questionnaire completed:", result);
    setShowQuestionnaire(false);

    // Store project plan for visual sketch
    if (result.projectPlan) {
      setProjectPlan(result.projectPlan);
      setShowVisualSketch(true);
    }

    // If AI generated a project plan with features, we can create nodes
    if (result.projectPlan?.features && newProjectId) {
      try {
        // Create nodes from features
        for (const feature of result.projectPlan.features) {
          await nodesAPI.create(
            newProjectId,
            feature,
            "feature",
            `Feature: ${feature}`
          );
        }
        console.log(
          `Created ${result.projectPlan.features.length} nodes from AI project plan`
        );
      } catch (err) {
        console.error("Failed to create feature nodes:", err);
      }
    }
  };

  const handleQuestionnaireClose = () => {
    setShowQuestionnaire(false);
    // Still navigate to canvas even if questionnaire is skipped
    if (newProjectId) {
      navigate(`/canvas/${newProjectId}`);
    }
    setNewProjectName("");
    setNewProjectDesc("");
    setNewProjectId(null);
  };

  const handleVisualSketchClose = () => {
    setShowVisualSketch(false);
    setProjectPlan(undefined);
    // Navigate to canvas after viewing the sketch
    if (newProjectId) {
      navigate(`/canvas/${newProjectId}`);
    }
    setNewProjectName("");
    setNewProjectDesc("");
    setNewProjectId(null);
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  const handleProjectClick = (projectId: string) => {
    console.log("Opening project:", projectId);
    navigate(`/canvas/${projectId}`);
  };

  return (
    <div className="dashboard-page">
      {/* Animated Background */}
      <div className="dashboard-background">
        <div className="grid-overlay" />
        <div className="glow-orb glow-orb-1" />
        <div className="glow-orb glow-orb-2" />
        <div className="glow-orb glow-orb-3" />
      </div>

      <Header showBackButton={false} />

      <main className="dashboard-content">
        {/* Status Bar */}
        <div className="status-bar">
          <div className="status-left">
            <span className={`source-badge ${dataSource}`}>
              {dataSource === "api" ? "🌐 API" : "📁 Local"}
            </span>
            <span
              className={`socket-indicator ${socketConnected ? "connected" : "disconnected"}`}
            >
              <span className="socket-dot" />
              {socketConnected ? "Live" : "Offline"}
            </span>
          </div>
          <div className="status-right">
            {loading && <span className="loading-indicator">Syncing...</span>}
            <button
              className="btn-refresh"
              onClick={() => fetchProjects()}
              disabled={loading}
            >
              ↻ Refresh
            </button>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="stats-dashboard">
          <div className="stat-card">
            <div className="stat-icon projects">
              <FolderKanban size={22} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.totalProjects}</span>
              <span className="stat-label">Projects</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon nodes">
              <Network size={22} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.totalNodes}</span>
              <span className="stat-label">Total Nodes</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon ports">
              <Plug size={22} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.allocatedPorts}</span>
              <span className="stat-label">Ports Active</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon uptime">
              <Clock size={22} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.uptime}</span>
              <span className="stat-label">Uptime</span>
            </div>
          </div>
        </div>

        {/* System Overview Widgets */}
        <div className="widgets-grid">
          {/* Container Status */}
          <div className="widget-card containers-widget">
            <div className="widget-header">
              <div className="widget-title">
                <Container size={18} />
                <span>Containers</span>
              </div>
              <span className="widget-badge running">3 Running</span>
            </div>
            <div className="container-list">
              <div className="container-item running">
                <div className="container-info">
                  <span className="container-dot"></span>
                  <span className="container-name">zurto-v3-api</span>
                </div>
                <span className="container-port">:3000</span>
              </div>
              <div className="container-item running">
                <div className="container-info">
                  <span className="container-dot"></span>
                  <span className="container-name">zurto-v3-web</span>
                </div>
                <span className="container-port">:5173</span>
              </div>
              <div className="container-item running">
                <div className="container-info">
                  <span className="container-dot"></span>
                  <span className="container-name">zurto-v3-caddy</span>
                </div>
                <span className="container-port">:80</span>
              </div>
            </div>
          </div>

          {/* Resource Usage */}
          <div className="widget-card resources-widget">
            <div className="widget-header">
              <div className="widget-title">
                <Activity size={18} />
                <span>Resources</span>
              </div>
              <span className="widget-badge healthy">Healthy</span>
            </div>
            <div className="resource-metrics">
              <div className="resource-metric">
                <div className="metric-header">
                  <Cpu size={14} />
                  <span>CPU</span>
                  <span className="metric-value">23%</span>
                </div>
                <div className="metric-bar">
                  <div className="metric-fill" style={{ width: "23%" }}></div>
                </div>
              </div>
              <div className="resource-metric">
                <div className="metric-header">
                  <MemoryStick size={14} />
                  <span>Memory</span>
                  <span className="metric-value">4.2GB</span>
                </div>
                <div className="metric-bar">
                  <div className="metric-fill" style={{ width: "42%" }}></div>
                </div>
              </div>
              <div className="resource-metric">
                <div className="metric-header">
                  <HardDrive size={14} />
                  <span>Disk</span>
                  <span className="metric-value">128GB</span>
                </div>
                <div className="metric-bar">
                  <div className="metric-fill" style={{ width: "25%" }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Deployments */}
          <div className="widget-card deployments-widget">
            <div className="widget-header">
              <div className="widget-title">
                <Rocket size={18} />
                <span>Deployments</span>
              </div>
              <span className="widget-link">View All</span>
            </div>
            <div className="deployment-list">
              <div className="deployment-item">
                <CheckCircle2 size={16} className="success" />
                <div className="deployment-info">
                  <span className="deployment-name">zurto-web</span>
                  <span className="deployment-time">2 min ago</span>
                </div>
              </div>
              <div className="deployment-item">
                <CheckCircle2 size={16} className="success" />
                <div className="deployment-info">
                  <span className="deployment-name">zurto-api</span>
                  <span className="deployment-time">5 min ago</span>
                </div>
              </div>
              <div className="deployment-item">
                <AlertCircle size={16} className="warning" />
                <div className="deployment-info">
                  <span className="deployment-name">discord-bot</span>
                  <span className="deployment-time">15 min ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="widget-card quick-actions-widget">
            <div className="widget-header">
              <div className="widget-title">
                <Zap size={18} />
                <span>Quick Actions</span>
              </div>
            </div>
            <div className="quick-actions-grid">
              <button className="quick-action">
                <Terminal size={18} />
                <span>Terminal</span>
              </button>
              <button className="quick-action">
                <Globe size={18} />
                <span>Domains</span>
              </button>
              <button className="quick-action">
                <Server size={18} />
                <span>Servers</span>
              </button>
              <button className="quick-action">
                <TrendingUp size={18} />
                <span>Analytics</span>
              </button>
            </div>
          </div>
        </div>

        {/* Action Bar with Search/Filter */}
        <div className="action-bar enhanced">
          <div className="action-bar-left">
            <h2 className="section-title">Your Projects</h2>
            <span className="project-count">({filteredProjects.length})</span>
          </div>

          <div className="action-bar-center">
            {/* Search */}
            <div className="search-box">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter Dropdown */}
            <div className="filter-dropdown">
              <button className="filter-btn">
                <Filter size={16} />
                <span>
                  {statusFilter === "all" ? "All Status" : statusFilter}
                </span>
              </button>
              <div className="filter-menu">
                {["all", "active", "inactive", "archived"].map((status) => (
                  <button
                    key={status}
                    className={statusFilter === status ? "active" : ""}
                    onClick={() =>
                      setStatusFilter(status as typeof statusFilter)
                    }
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="view-toggle">
              <button
                className={viewMode === "grid" ? "active" : ""}
                onClick={() => setViewMode("grid")}
                title="Grid View"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                className={viewMode === "list" ? "active" : ""}
                onClick={() => setViewMode("list")}
                title="List View"
              >
                <List size={16} />
              </button>
            </div>
          </div>

          <div className="action-bar-right">
            {/* Team Panel Toggle */}
            <button
              className={`btn-icon ${showTeamPanel ? "active" : ""}`}
              onClick={() => setShowTeamPanel(!showTeamPanel)}
              title="Team Members"
            >
              <Users size={18} />
            </button>

            {/* Templates Button */}
            <button
              className="btn-secondary"
              onClick={() => setShowTemplates(true)}
              title="Project Templates"
            >
              <Layers size={16} />
              <span>Templates</span>
            </button>

            {/* New Project */}
            <button className="btn-primary" onClick={handleCreateProject}>
              <Plus size={16} />
              <span>New Project</span>
            </button>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedProjects.length > 0 && (
          <div className="bulk-actions-bar">
            <div className="bulk-info">
              <button className="select-all-btn" onClick={selectAllProjects}>
                {selectedProjects.length === filteredProjects.length ? (
                  <CheckSquare size={16} />
                ) : (
                  <Square size={16} />
                )}
              </button>
              <span>{selectedProjects.length} selected</span>
            </div>
            <div className="bulk-buttons">
              <button
                className="bulk-btn"
                onClick={() => setSelectedProjects([])}
              >
                Clear Selection
              </button>
              <button className="bulk-btn duplicate">
                <Copy size={14} />
                Duplicate
              </button>
              <button className="bulk-btn archive" onClick={handleBulkArchive}>
                <FolderPlus size={14} />
                Archive
              </button>
              <button className="bulk-btn delete" onClick={handleBulkDelete}>
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>
        )}

        {/* Projects Grid */}
        <div
          className={`projects-container ${showTeamPanel ? "with-panel" : ""}`}
        >
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading projects from API...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <div className="error-icon">
                <AlertCircle size={48} />
              </div>
              <h2>Error loading projects</h2>
              <p>{error}</p>
              <button className="btn-retry" onClick={() => fetchProjects()}>
                Retry
              </button>
            </div>
          ) : filteredProjects.length > 0 ? (
            <div
              className={`projects-grid ${viewMode === "list" ? "list-view" : ""}`}
            >
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className={`project-card-wrapper ${selectedProjects.includes(project.id) ? "selected" : ""}`}
                >
                  {selectedProjects.length > 0 || showBulkActions ? (
                    <button
                      className="select-checkbox"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleProjectSelection(project.id);
                      }}
                    >
                      {selectedProjects.includes(project.id) ? (
                        <CheckSquare size={18} />
                      ) : (
                        <Square size={18} />
                      )}
                    </button>
                  ) : null}
                  <ProjectCard
                    {...project}
                    onClick={() => handleProjectClick(project.id)}
                    onDelete={() => handleDeleteProject(project.id)}
                  />
                </div>
              ))}
            </div>
          ) : searchQuery || statusFilter !== "all" ? (
            <div className="empty-state">
              <div className="empty-icon">
                <Search size={48} />
              </div>
              <h2>No matching projects</h2>
              <p>Try adjusting your search or filter criteria</p>
              <button
                className="btn-secondary"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <FolderKanban size={48} />
              </div>
              <h2>No projects found</h2>
              <p>No projects available from the API</p>
              <button className="btn-primary" onClick={handleCreateProject}>
                Create Your First Project
              </button>
            </div>
          )}

          {/* Team Members Panel */}
          {showTeamPanel && (
            <div className="team-panel">
              <div className="team-panel-header">
                <h3>
                  <Users size={18} />
                  Team Members
                </h3>
                <button
                  className="btn-icon"
                  onClick={() => setShowTeamPanel(false)}
                >
                  <X size={16} />
                </button>
              </div>
              <div className="team-list">
                {teamMembers.map((member) => (
                  <div key={member.id} className="team-member">
                    <div className="member-avatar">{member.avatar}</div>
                    <div className="member-info">
                      <span className="member-name">{member.name}</span>
                      <span className="member-role">{member.role}</span>
                    </div>
                    <div className={`member-status ${member.status}`}></div>
                  </div>
                ))}
              </div>
              <button className="btn-add-member">
                <UserPlus size={16} />
                Invite Member
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Project Templates Modal */}
      {showTemplates && (
        <div className="modal-overlay" onClick={() => setShowTemplates(false)}>
          <div
            className="modal-content templates-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>
                <Layers size={20} />
                Project Templates
              </h2>
              <button
                className="btn-close"
                onClick={() => setShowTemplates(false)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="templates-grid">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="template-card"
                  onClick={() => {
                    setNewProjectName(`My ${template.name} Project`);
                    setNewProjectDesc(template.description);
                    setShowTemplates(false);
                    setShowCreateModal(true);
                  }}
                >
                  <div className="template-icon">{template.icon}</div>
                  <div className="template-info">
                    <h4>{template.name}</h4>
                    <p>{template.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="templates-footer">
              <button
                className="btn-secondary"
                onClick={() => setShowTemplates(false)}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={() => {
                  setShowTemplates(false);
                  handleCreateProject();
                }}
              >
                <Plus size={16} />
                Blank Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="modal-content create-project-modal"
            onClick={(e) => e.stopPropagation()}
          >
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
                <label htmlFor="projectName">Project Name *</label>
                <input
                  type="text"
                  id="projectName"
                  placeholder="Enter project name..."
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  autoFocus
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="projectDesc">Description</label>
                <textarea
                  id="projectDesc"
                  placeholder="Brief description of your project..."
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

      {/* Project Setup Questionnaire - AI-powered dynamic questions */}
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

      {/* Visual Sketch - Architecture Diagram after questionnaire */}
      <VisualSketch
        isOpen={showVisualSketch}
        onClose={handleVisualSketchClose}
        projectPlan={projectPlan}
        projectName={newProjectName || "New Project"}
      />
    </div>
  );
};

export default Dashboard;
