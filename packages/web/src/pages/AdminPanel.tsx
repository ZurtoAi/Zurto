import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  UsersRound,
  FolderKanban,
  ScrollText,
  Bot,
  Server,
  Globe,
  Flag,
  LogOut,
  Key,
  Shield,
  ChevronRight,
  Activity,
  Database,
  HardDrive,
  Cpu,
  MemoryStick,
  Network,
  Container,
  RefreshCw,
  Square,
  Terminal,
  CreditCard,
  Gauge,
  ArchiveRestore,
  Webhook,
  KeyRound,
  Plus,
  Trash2,
  Edit,
  Copy,
  Check,
  AlertCircle,
  Loader2,
  Clock,
  DollarSign,
  Download,
  Eye,
  EyeOff,
} from "lucide-react";
import "../styles/AdminPanel.css";

const API_BASE = import.meta.env.VITE_API_URL || "";

// Types
interface Team {
  id: string;
  name: string;
  slug: string;
  description?: string;
  ownerId: string;
  ownerName: string;
  memberCount: number;
  projectCount: number;
  createdAt: string;
}

interface User {
  id: string;
  username: string;
  teamId: string;
  teamName: string;
  teamToken: string;
  adminToken: string | null;
  isAdmin: boolean;
  isTeamLeader: boolean;
  createdAt: string;
  lastActiveAt?: string;
}

interface Project {
  id: string;
  name: string;
  description?: string;
  teamId: string;
  teamName: string;
  status: string;
  isDeployed: boolean;
  createdAt: string;
  creatorName: string;
  nodeCount: number;
}

interface AuditLog {
  id: string;
  teamId: string;
  userId: string;
  username: string;
  action: string;
  resourceType: string;
  resourceId: string;
  details: Record<string, unknown>;
  timestamp: string;
}

interface Stats {
  totalUsers: number;
  totalTeams: number;
  totalProjects: number;
  totalAdmins: number;
  activeUsersLast24h: number;
  loginsLast24h: number;
  projectsCreatedLast7d: number;
  deployedProjects: number;
}

type Tab =
  | "overview"
  | "teams"
  | "users"
  | "projects"
  | "audit"
  | "discord-bot"
  | "containers"
  | "domains"
  | "feature-flags"
  | "billing"
  | "rate-limiting"
  | "backups"
  | "api-keys"
  | "webhooks";

export const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const { user, accessToken, isAdmin } = useAuth();

  // Admin authentication state
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [adminToken, setAdminToken] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Data state
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newTeamId, setNewTeamId] = useState("");
  const [makeNewUserAdmin, setMakeNewUserAdmin] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDescription, setNewTeamDescription] = useState("");

  // Token display
  const [showTokens, setShowTokens] = useState<Record<string, boolean>>({});

  // Check stored admin session
  useEffect(() => {
    const adminSession = sessionStorage.getItem("adminAuth");
    if (adminSession === "true") {
      setIsAdminAuth(true);
    }
  }, []);

  // Load data when authenticated
  useEffect(() => {
    if (isAdminAuth) {
      loadData();
    }
  }, [isAdminAuth, activeTab]);

  // Admin authentication handler
  const handleAdminAuth = async () => {
    setIsAuthenticating(true);
    setAuthError(null);

    try {
      const response = await fetch(`${API_BASE}/api/auth/admin/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ adminToken }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsAdminAuth(true);
        sessionStorage.setItem("adminAuth", "true");
      } else {
        setAuthError(data.error || "Invalid admin token");
      }
    } catch (err) {
      setAuthError("Authentication failed");
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Load data based on active tab
  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      };

      // Always load stats for overview
      if (activeTab === "overview") {
        const statsRes = await fetch(`${API_BASE}/api/admin/stats`, {
          headers,
        });
        const statsData = await statsRes.json();
        if (statsData.success) {
          setStats(statsData.data);
        }
      }

      if (activeTab === "teams" || activeTab === "overview") {
        const teamsRes = await fetch(`${API_BASE}/api/admin/teams`, {
          headers,
        });
        const teamsData = await teamsRes.json();
        if (teamsData.success) {
          setTeams(teamsData.data || []);
        }
      }

      if (activeTab === "users" || activeTab === "overview") {
        const usersRes = await fetch(`${API_BASE}/api/admin/users`, {
          headers,
        });
        const usersData = await usersRes.json();
        if (usersData.success) {
          setUsers(usersData.data || []);
        }
      }

      if (activeTab === "projects") {
        const projectsRes = await fetch(`${API_BASE}/api/admin/projects`, {
          headers,
        });
        const projectsData = await projectsRes.json();
        if (projectsData.success) {
          setProjects(projectsData.data || []);
        }
      }

      if (activeTab === "audit") {
        const auditRes = await fetch(
          `${API_BASE}/api/admin/audit-logs?limit=100`,
          { headers }
        );
        const auditData = await auditRes.json();
        if (auditData.success) {
          setAuditLogs(auditData.data || []);
        }
      }
    } catch (err) {
      setError("Failed to load data");
      console.error("Admin data load error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Create user
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newTeamId) return;

    try {
      const response = await fetch(`${API_BASE}/api/auth/users`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: newUsername,
          teamId: newTeamId,
          makeAdmin: makeNewUserAdmin,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setShowCreateUserModal(false);
        setNewUsername("");
        setNewTeamId("");
        setMakeNewUserAdmin(false);
        loadData();
        alert(
          `User created!\n\nUsername: ${data.data.username}\nTeam Token: ${data.data.teamToken}${data.data.adminToken ? `\nAdmin Token: ${data.data.adminToken}` : ""}`
        );
      } else {
        alert(data.error || "Failed to create user");
      }
    } catch (err) {
      alert("Failed to create user");
    }
  };

  // Create team
  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName) return;

    try {
      const response = await fetch(`${API_BASE}/api/auth/teams`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newTeamName,
          description: newTeamDescription,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setShowCreateTeamModal(false);
        setNewTeamName("");
        setNewTeamDescription("");
        loadData();
      } else {
        alert(data.error || "Failed to create team");
      }
    } catch (err) {
      alert("Failed to create team");
    }
  };

  // Delete user
  const handleDeleteUser = async (userId: string, username: string) => {
    if (!confirm(`Are you sure you want to delete user "${username}"?`)) return;

    try {
      const response = await fetch(`${API_BASE}/api/auth/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        loadData();
      } else {
        alert(data.error || "Failed to delete user");
      }
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  // Regenerate team token
  const handleRegenerateTeamToken = async (userId: string) => {
    if (!confirm("Regenerate team token? The old token will stop working."))
      return;

    try {
      const response = await fetch(
        `${API_BASE}/api/auth/users/${userId}/regenerate-team-token`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        alert(`New Team Token: ${data.data.newTeamToken}`);
        loadData();
      } else {
        alert(data.error || "Failed to regenerate token");
      }
    } catch (err) {
      alert("Failed to regenerate token");
    }
  };

  // Make admin
  const handleMakeAdmin = async (userId: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/users/${userId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ makeAdmin: true }),
      });

      const data = await response.json();
      if (data.success) {
        alert(`Admin Token: ${data.data.adminToken}`);
        loadData();
      } else {
        alert(data.error || "Failed to make admin");
      }
    } catch (err) {
      alert("Failed to make admin");
    }
  };

  // Remove admin
  const handleRemoveAdmin = async (userId: string) => {
    if (!confirm("Remove admin privileges?")) return;

    try {
      const response = await fetch(`${API_BASE}/api/auth/users/${userId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ removeAdmin: true }),
      });

      if (response.ok) {
        loadData();
      }
    } catch (err) {
      alert("Failed to remove admin");
    }
  };

  // Toggle token visibility
  const toggleTokenVisibility = (userId: string) => {
    setShowTokens((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Format action for audit logs
  const formatAction = (action: string) => {
    return action.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Render admin login
  if (!isAdminAuth) {
    return (
      <div className="admin-auth-container">
        <div className="admin-auth-card">
          <div className="admin-auth-header">
            <div className="admin-logo">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <h1>Admin Access</h1>
            <p>Enter your admin token to continue</p>
            {user && (
              <p className="logged-in-as">
                Logged in as: <strong>{user.username}</strong>
              </p>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAdminAuth();
            }}
          >
            <div className="admin-auth-field">
              <label>Admin Token</label>
              <input
                type="password"
                value={adminToken}
                onChange={(e) => setAdminToken(e.target.value)}
                placeholder="ADMIN-XXXX-XXXX"
                autoFocus
              />
            </div>

            {authError && (
              <div className="admin-auth-error">
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
                {authError}
              </div>
            )}

            <button
              type="submit"
              className="admin-auth-button"
              disabled={!adminToken || isAuthenticating}
            >
              {isAuthenticating ? "Verifying..." : "Access Admin Panel"}
            </button>
          </form>

          <button
            className="admin-auth-back"
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-brand">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>Admin Panel</span>
          </div>
          <button
            className="admin-logout"
            onClick={() => {
              sessionStorage.removeItem("adminAuth");
              setIsAdminAuth(false);
            }}
            title="Exit Admin Mode"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>

        <nav className="admin-nav">
          {/* Core Management */}
          <div className="nav-section-label">Management</div>

          <button
            className={`admin-nav-item ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <LayoutDashboard size={18} />
            <span>Overview</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === "teams" ? "active" : ""}`}
            onClick={() => setActiveTab("teams")}
          >
            <UsersRound size={18} />
            <span>Teams</span>
            <span className="nav-badge">{teams.length}</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            <Users size={18} />
            <span>Users</span>
            <span className="nav-badge">{users.length}</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === "projects" ? "active" : ""}`}
            onClick={() => setActiveTab("projects")}
          >
            <FolderKanban size={18} />
            <span>Projects</span>
            <span className="nav-badge">{projects.length}</span>
          </button>

          {/* Infrastructure */}
          <div className="nav-section-label">Infrastructure</div>

          <button
            className={`admin-nav-item ${activeTab === "containers" ? "active" : ""}`}
            onClick={() => setActiveTab("containers")}
          >
            <Container size={18} />
            <span>Containers</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === "domains" ? "active" : ""}`}
            onClick={() => setActiveTab("domains")}
          >
            <Globe size={18} />
            <span>Domains</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === "backups" ? "active" : ""}`}
            onClick={() => setActiveTab("backups")}
          >
            <ArchiveRestore size={18} />
            <span>Backups</span>
          </button>

          {/* Integrations */}
          <div className="nav-section-label">Integrations</div>

          <button
            className={`admin-nav-item ${activeTab === "discord-bot" ? "active" : ""}`}
            onClick={() => setActiveTab("discord-bot")}
          >
            <Bot size={18} />
            <span>Discord Bot</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === "webhooks" ? "active" : ""}`}
            onClick={() => setActiveTab("webhooks")}
          >
            <Webhook size={18} />
            <span>Webhooks</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === "api-keys" ? "active" : ""}`}
            onClick={() => setActiveTab("api-keys")}
          >
            <KeyRound size={18} />
            <span>API Keys</span>
          </button>

          {/* Configuration */}
          <div className="nav-section-label">Configuration</div>

          <button
            className={`admin-nav-item ${activeTab === "billing" ? "active" : ""}`}
            onClick={() => setActiveTab("billing")}
          >
            <CreditCard size={18} />
            <span>Billing</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === "rate-limiting" ? "active" : ""}`}
            onClick={() => setActiveTab("rate-limiting")}
          >
            <Gauge size={18} />
            <span>Rate Limiting</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === "feature-flags" ? "active" : ""}`}
            onClick={() => setActiveTab("feature-flags")}
          >
            <Flag size={18} />
            <span>Feature Flags</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === "audit" ? "active" : ""}`}
            onClick={() => setActiveTab("audit")}
          >
            <ScrollText size={18} />
            <span>Audit Logs</span>
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <span className="admin-user-name">{user?.username}</span>
            <span className="admin-user-role">Administrator</span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin-main">
        <header className="admin-header">
          <h1>
            {activeTab === "overview" && "Dashboard Overview"}
            {activeTab === "teams" && "Team Management"}
            {activeTab === "users" && "User Management"}
            {activeTab === "projects" && "Project Management"}
            {activeTab === "containers" && "Container Management"}
            {activeTab === "domains" && "Domain Management"}
            {activeTab === "discord-bot" && "Discord Bot"}
            {activeTab === "feature-flags" && "Feature Flags"}
            {activeTab === "audit" && "Audit Logs"}
            {activeTab === "billing" && "Billing & Subscriptions"}
            {activeTab === "rate-limiting" && "Rate Limiting"}
            {activeTab === "backups" && "Backup & Restore"}
            {activeTab === "api-keys" && "API Keys"}
            {activeTab === "webhooks" && "Webhooks"}
          </h1>
          <div className="admin-header-actions">
            {activeTab === "teams" && (
              <button
                className="btn-primary"
                onClick={() => setShowCreateTeamModal(true)}
              >
                + New Team
              </button>
            )}
            {activeTab === "users" && (
              <button
                className="btn-primary"
                onClick={() => setShowCreateUserModal(true)}
              >
                + New User
              </button>
            )}
            <button className="btn-secondary" onClick={loadData}>
              Refresh
            </button>
          </div>
        </header>

        <div className="admin-content">
          {isLoading ? (
            <div className="admin-loading">Loading...</div>
          ) : error ? (
            <div className="admin-error">{error}</div>
          ) : (
            <>
              {/* Overview Tab */}
              {activeTab === "overview" && stats && (
                <div className="admin-overview">
                  <div className="stats-grid">
                    <div className="stat-card">
                      <div className="stat-icon users">👥</div>
                      <div className="stat-info">
                        <span className="stat-value">{stats.totalUsers}</span>
                        <span className="stat-label">Total Users</span>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon teams">
                        <UsersRound size={20} />
                      </div>
                      <div className="stat-info">
                        <span className="stat-value">{stats.totalTeams}</span>
                        <span className="stat-label">Teams</span>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon projects">
                        <FolderKanban size={20} />
                      </div>
                      <div className="stat-info">
                        <span className="stat-value">
                          {stats.totalProjects}
                        </span>
                        <span className="stat-label">Projects</span>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon admins">
                        <Shield size={20} />
                      </div>
                      <div className="stat-info">
                        <span className="stat-value">{stats.totalAdmins}</span>
                        <span className="stat-label">Admins</span>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon active">
                        <Activity size={20} />
                      </div>
                      <div className="stat-info">
                        <span className="stat-value">
                          {stats.activeUsersLast24h}
                        </span>
                        <span className="stat-label">Active (24h)</span>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon logins">
                        <Key size={20} />
                      </div>
                      <div className="stat-info">
                        <span className="stat-value">
                          {stats.loginsLast24h}
                        </span>
                        <span className="stat-label">Logins (24h)</span>
                      </div>
                    </div>
                  </div>

                  <div className="overview-sections">
                    <div className="overview-section">
                      <h3>Recent Users</h3>
                      <div className="mini-table">
                        {users.slice(0, 5).map((u) => (
                          <div key={u.id} className="mini-row">
                            <span className="user-name">{u.username}</span>
                            <span className="user-team">{u.teamName}</span>
                            {u.isAdmin && (
                              <span className="badge admin">Admin</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="overview-section">
                      <h3>Teams</h3>
                      <div className="mini-table">
                        {teams.slice(0, 5).map((t) => (
                          <div key={t.id} className="mini-row">
                            <span className="team-name">{t.name}</span>
                            <span className="team-stats">
                              {t.memberCount} members · {t.projectCount}{" "}
                              projects
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Teams Tab */}
              {activeTab === "teams" && (
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Owner</th>
                        <th>Members</th>
                        <th>Projects</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teams.map((team) => (
                        <tr key={team.id}>
                          <td>
                            <div className="team-cell">
                              <strong>{team.name}</strong>
                              <span className="team-slug">{team.slug}</span>
                            </div>
                          </td>
                          <td>{team.ownerName}</td>
                          <td>{team.memberCount}</td>
                          <td>{team.projectCount}</td>
                          <td>{formatDate(team.createdAt)}</td>
                          <td>
                            <div className="action-buttons">
                              <button className="btn-sm btn-secondary">
                                View
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Users Tab */}
              {activeTab === "users" && (
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Username</th>
                        <th>Team</th>
                        <th>Team Token</th>
                        <th>Admin Token</th>
                        <th>Role</th>
                        <th>Last Active</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id}>
                          <td>
                            <strong>{u.username}</strong>
                          </td>
                          <td>{u.teamName}</td>
                          <td>
                            <div className="token-cell">
                              <code
                                className={showTokens[u.id] ? "" : "hidden"}
                              >
                                {showTokens[u.id]
                                  ? u.teamToken
                                  : "••••••••••••"}
                              </code>
                              <button
                                className="btn-icon"
                                onClick={() => toggleTokenVisibility(u.id)}
                              >
                                {showTokens[u.id] ? (
                                  <EyeOff size={14} />
                                ) : (
                                  <Eye size={14} />
                                )}
                              </button>
                              <button
                                className="btn-icon"
                                onClick={() =>
                                  navigator.clipboard.writeText(u.teamToken)
                                }
                              >
                                <Copy size={14} />
                              </button>
                            </div>
                          </td>
                          <td>
                            {u.adminToken ? (
                              <div className="token-cell">
                                <code
                                  className={
                                    showTokens[`admin-${u.id}`] ? "" : "hidden"
                                  }
                                >
                                  {showTokens[`admin-${u.id}`]
                                    ? u.adminToken
                                    : "••••••••••••"}
                                </code>
                                <button
                                  className="btn-icon"
                                  onClick={() =>
                                    toggleTokenVisibility(`admin-${u.id}`)
                                  }
                                >
                                  {showTokens[`admin-${u.id}`] ? (
                                    <EyeOff size={14} />
                                  ) : (
                                    <Eye size={14} />
                                  )}
                                </button>
                                <button
                                  className="btn-icon"
                                  onClick={() =>
                                    navigator.clipboard.writeText(u.adminToken!)
                                  }
                                >
                                  <Copy size={14} />
                                </button>
                              </div>
                            ) : (
                              <span className="no-token">—</span>
                            )}
                          </td>
                          <td>
                            <div className="role-badges">
                              {u.isAdmin && (
                                <span className="badge admin">Admin</span>
                              )}
                              {u.isTeamLeader && (
                                <span className="badge leader">Leader</span>
                              )}
                              {!u.isAdmin && !u.isTeamLeader && (
                                <span className="badge member">Member</span>
                              )}
                            </div>
                          </td>
                          <td>
                            {u.lastActiveAt
                              ? formatDate(u.lastActiveAt)
                              : "Never"}
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="btn-sm btn-secondary"
                                onClick={() => handleRegenerateTeamToken(u.id)}
                              >
                                <RefreshCw size={12} /> Token
                              </button>
                              {!u.isAdmin && (
                                <button
                                  className="btn-sm btn-secondary"
                                  onClick={() => handleMakeAdmin(u.id)}
                                >
                                  Make Admin
                                </button>
                              )}
                              {u.isAdmin && u.id !== user?.id && (
                                <button
                                  className="btn-sm btn-warning"
                                  onClick={() => handleRemoveAdmin(u.id)}
                                >
                                  Remove Admin
                                </button>
                              )}
                              {u.id !== user?.id && (
                                <button
                                  className="btn-sm btn-danger"
                                  onClick={() =>
                                    handleDeleteUser(u.id, u.username)
                                  }
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Projects Tab */}
              {activeTab === "projects" && (
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Team</th>
                        <th>Status</th>
                        <th>Deployed</th>
                        <th>Nodes</th>
                        <th>Created By</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map((p) => (
                        <tr key={p.id}>
                          <td>
                            <div className="project-cell">
                              <strong>{p.name}</strong>
                              {p.description && (
                                <span className="project-desc">
                                  {p.description.substring(0, 50)}...
                                </span>
                              )}
                            </div>
                          </td>
                          <td>{p.teamName}</td>
                          <td>
                            <span className={`status-badge ${p.status}`}>
                              {p.status}
                            </span>
                          </td>
                          <td>
                            {p.isDeployed ? (
                              <span className="deployed-yes">✅ Yes</span>
                            ) : (
                              <span className="deployed-no">⏳ No</span>
                            )}
                          </td>
                          <td>{p.nodeCount}</td>
                          <td>{p.creatorName}</td>
                          <td>{formatDate(p.createdAt)}</td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="btn-sm btn-secondary"
                                onClick={() => navigate(`/canvas/${p.id}`)}
                              >
                                Open
                              </button>
                              <button className="btn-sm btn-danger">
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Audit Logs Tab */}
              {activeTab === "audit" && (
                <div className="admin-table-container">
                  <table className="admin-table audit-table">
                    <thead>
                      <tr>
                        <th>Time</th>
                        <th>User</th>
                        <th>Action</th>
                        <th>Resource</th>
                        <th>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLogs.map((log) => (
                        <tr key={log.id}>
                          <td className="timestamp">
                            {formatDate(log.timestamp)}
                          </td>
                          <td>{log.username}</td>
                          <td>
                            <span
                              className={`action-badge ${log.action.split("_")[0]}`}
                            >
                              {formatAction(log.action)}
                            </span>
                          </td>
                          <td>
                            <span className="resource-type">
                              {log.resourceType}
                            </span>
                            <code className="resource-id">
                              {log.resourceId}
                            </code>
                          </td>
                          <td>
                            <code className="details">
                              {JSON.stringify(log.details)}
                            </code>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Containers Tab */}
              {activeTab === "containers" && (
                <div className="admin-containers">
                  <div className="container-grid">
                    <div className="container-card running">
                      <div className="container-header">
                        <Container size={20} />
                        <span className="container-name">zurto-v3-api</span>
                        <span className="container-status">Running</span>
                      </div>
                      <div className="container-stats">
                        <div className="stat">
                          <Cpu size={14} />
                          <span>2.3%</span>
                        </div>
                        <div className="stat">
                          <MemoryStick size={14} />
                          <span>128MB</span>
                        </div>
                        <div className="stat">
                          <Network size={14} />
                          <span>:3000</span>
                        </div>
                      </div>
                      <div className="container-actions">
                        <button className="btn-icon" title="Restart">
                          <RefreshCw size={14} />
                        </button>
                        <button className="btn-icon" title="Stop">
                          <Square size={14} />
                        </button>
                        <button className="btn-icon" title="Logs">
                          <ScrollText size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="container-card running">
                      <div className="container-header">
                        <Container size={20} />
                        <span className="container-name">zurto-v3-web</span>
                        <span className="container-status">Running</span>
                      </div>
                      <div className="container-stats">
                        <div className="stat">
                          <Cpu size={14} />
                          <span>1.1%</span>
                        </div>
                        <div className="stat">
                          <MemoryStick size={14} />
                          <span>64MB</span>
                        </div>
                        <div className="stat">
                          <Network size={14} />
                          <span>:5173</span>
                        </div>
                      </div>
                      <div className="container-actions">
                        <button className="btn-icon" title="Restart">
                          <RefreshCw size={14} />
                        </button>
                        <button className="btn-icon" title="Stop">
                          <Square size={14} />
                        </button>
                        <button className="btn-icon" title="Logs">
                          <ScrollText size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="container-card running">
                      <div className="container-header">
                        <Container size={20} />
                        <span className="container-name">zurto-v3-caddy</span>
                        <span className="container-status">Running</span>
                      </div>
                      <div className="container-stats">
                        <div className="stat">
                          <Cpu size={14} />
                          <span>0.5%</span>
                        </div>
                        <div className="stat">
                          <MemoryStick size={14} />
                          <span>32MB</span>
                        </div>
                        <div className="stat">
                          <Network size={14} />
                          <span>:80/:443</span>
                        </div>
                      </div>
                      <div className="container-actions">
                        <button className="btn-icon" title="Restart">
                          <RefreshCw size={14} />
                        </button>
                        <button className="btn-icon" title="Stop">
                          <Square size={14} />
                        </button>
                        <button className="btn-icon" title="Logs">
                          <ScrollText size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="resource-overview">
                    <h3>System Resources</h3>
                    <div className="resource-bars">
                      <div className="resource-bar">
                        <div className="resource-label">
                          <Cpu size={16} />
                          <span>CPU Usage</span>
                          <span className="resource-value">23%</span>
                        </div>
                        <div className="bar-track">
                          <div
                            className="bar-fill"
                            style={{ width: "23%" }}
                          ></div>
                        </div>
                      </div>
                      <div className="resource-bar">
                        <div className="resource-label">
                          <MemoryStick size={16} />
                          <span>Memory</span>
                          <span className="resource-value">4.2GB / 16GB</span>
                        </div>
                        <div className="bar-track">
                          <div
                            className="bar-fill"
                            style={{ width: "26%" }}
                          ></div>
                        </div>
                      </div>
                      <div className="resource-bar">
                        <div className="resource-label">
                          <HardDrive size={16} />
                          <span>Disk</span>
                          <span className="resource-value">128GB / 500GB</span>
                        </div>
                        <div className="bar-track">
                          <div
                            className="bar-fill"
                            style={{ width: "25%" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Domains Tab */}
              {activeTab === "domains" && (
                <div className="admin-domains">
                  <div className="domain-list">
                    <div className="domain-card">
                      <div className="domain-info">
                        <Globe size={18} />
                        <div className="domain-details">
                          <span className="domain-name">zurto.app</span>
                          <span className="domain-type">Primary</span>
                        </div>
                      </div>
                      <div className="domain-status verified">
                        <Shield size={14} />
                        <span>Verified</span>
                      </div>
                    </div>

                    <div className="domain-card">
                      <div className="domain-info">
                        <Globe size={18} />
                        <div className="domain-details">
                          <span className="domain-name">api.zurto.app</span>
                          <span className="domain-type">API Subdomain</span>
                        </div>
                      </div>
                      <div className="domain-status verified">
                        <Shield size={14} />
                        <span>Verified</span>
                      </div>
                    </div>

                    <div className="domain-card">
                      <div className="domain-info">
                        <Globe size={18} />
                        <div className="domain-details">
                          <span className="domain-name">host.zurto.app</span>
                          <span className="domain-type">Hosting Subdomain</span>
                        </div>
                      </div>
                      <div className="domain-status verified">
                        <Shield size={14} />
                        <span>Verified</span>
                      </div>
                    </div>
                  </div>

                  <div className="add-domain-section">
                    <h3>Add Custom Domain</h3>
                    <div className="add-domain-form">
                      <input type="text" placeholder="Enter domain name..." />
                      <button className="btn-primary">Add Domain</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Discord Bot Tab */}
              {activeTab === "discord-bot" && (
                <div className="admin-discord-bot">
                  <div className="bot-status-card">
                    <div className="bot-header">
                      <Bot size={24} />
                      <div className="bot-info">
                        <h3>Zurto Agent Bot</h3>
                        <span className="bot-status online">Online</span>
                      </div>
                      <button className="btn-restart-bot">
                        <RefreshCw size={14} />
                        Restart Bot
                      </button>
                    </div>
                    <div className="bot-stats">
                      <div className="bot-stat">
                        <span className="stat-value">12</span>
                        <span className="stat-label">Servers</span>
                      </div>
                      <div className="bot-stat">
                        <span className="stat-value">156</span>
                        <span className="stat-label">Users</span>
                      </div>
                      <div className="bot-stat">
                        <span className="stat-value">1,247</span>
                        <span className="stat-label">Commands (24h)</span>
                      </div>
                    </div>
                  </div>

                  {/* Webhook Configuration */}
                  <div className="config-section">
                    <h4 className="section-header">
                      <Webhook size={18} />
                      Webhook Configuration
                    </h4>
                    <div className="webhook-config">
                      <div className="form-group">
                        <label>Changelog Webhook URL</label>
                        <input
                          type="text"
                          placeholder="https://discord.com/api/webhooks/..."
                          defaultValue="https://discord.com/api/webhooks/1446108010861826270/cNrUPHyk..."
                        />
                        <span className="form-hint">
                          Used for deployment and change notifications
                        </span>
                      </div>
                      <div className="form-group">
                        <label>Alert Webhook URL</label>
                        <input
                          type="text"
                          placeholder="https://discord.com/api/webhooks/..."
                        />
                        <span className="form-hint">
                          Used for error and warning alerts
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Terminal Log Forwarding */}
                  <div className="config-section">
                    <h4 className="section-header">
                      <Terminal size={18} />
                      Terminal Log Forwarding
                    </h4>
                    <div className="log-forwarding-list">
                      <div className="log-forward-item">
                        <div className="forward-service">
                          <Container size={16} />
                          <span>zurto-api</span>
                        </div>
                        <div className="forward-channel">
                          <span>#api-logs</span>
                        </div>
                        <label className="toggle-switch">
                          <input type="checkbox" defaultChecked />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                      <div className="log-forward-item">
                        <div className="forward-service">
                          <Container size={16} />
                          <span>zurto-web</span>
                        </div>
                        <div className="forward-channel">
                          <span>#web-logs</span>
                        </div>
                        <label className="toggle-switch">
                          <input type="checkbox" defaultChecked />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                      <div className="log-forward-item">
                        <div className="forward-service">
                          <Container size={16} />
                          <span>discord-bot</span>
                        </div>
                        <div className="forward-channel">
                          <span>#bot-logs</span>
                        </div>
                        <label className="toggle-switch">
                          <input type="checkbox" />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                    <button className="btn-add-forward">
                      <Plus size={14} />
                      Add Log Forward
                    </button>
                  </div>

                  {/* Auto Deployment Embeds */}
                  <div className="config-section">
                    <h4 className="section-header">
                      <Activity size={18} />
                      Deployment Status Embeds
                    </h4>
                    <div className="embed-settings">
                      <div className="embed-option">
                        <div className="option-info">
                          <span className="option-label">
                            Auto-post deployment status
                          </span>
                          <span className="option-hint">
                            Post embed when deployment starts/completes
                          </span>
                        </div>
                        <label className="toggle-switch">
                          <input type="checkbox" defaultChecked />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                      <div className="embed-option">
                        <div className="option-info">
                          <span className="option-label">
                            Include build logs
                          </span>
                          <span className="option-hint">
                            Attach build output to deployment embed
                          </span>
                        </div>
                        <label className="toggle-switch">
                          <input type="checkbox" defaultChecked />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                      <div className="embed-option">
                        <div className="option-info">
                          <span className="option-label">Error alerts</span>
                          <span className="option-hint">
                            Notify on deployment failures
                          </span>
                        </div>
                        <label className="toggle-switch">
                          <input type="checkbox" defaultChecked />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                      <div className="embed-option">
                        <div className="option-info">
                          <span className="option-label">
                            Live updating embeds
                          </span>
                          <span className="option-hint">
                            Update embed in real-time during deployment
                          </span>
                        </div>
                        <label className="toggle-switch">
                          <input type="checkbox" />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="bot-features-grid">
                    <div className="bot-feature-card">
                      <div className="feature-header">
                        <UsersRound size={18} />
                        <span>Team Management</span>
                      </div>
                      <p>
                        Manage teams, roles, and permissions via Discord
                        commands
                      </p>
                      <div className="feature-status enabled">Enabled</div>
                    </div>

                    <div className="bot-feature-card">
                      <div className="feature-header">
                        <Terminal size={18} />
                        <span>Terminal Logs</span>
                      </div>
                      <p>Stream container logs directly to Discord channels</p>
                      <div className="feature-status enabled">Enabled</div>
                    </div>

                    <div className="bot-feature-card">
                      <div className="feature-header">
                        <Activity size={18} />
                        <span>Live Embeds</span>
                      </div>
                      <p>Auto-updating status embeds for deployments</p>
                      <div className="feature-status enabled">Enabled</div>
                    </div>

                    <div className="bot-feature-card">
                      <div className="feature-header">
                        <Server size={18} />
                        <span>Server Structure</span>
                      </div>
                      <p>Auto-create channels and categories for projects</p>
                      <div className="feature-status enabled">Enabled</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Feature Flags Tab */}
              {activeTab === "feature-flags" && (
                <div className="admin-feature-flags">
                  <div className="flags-list">
                    <div className="flag-item">
                      <div className="flag-info">
                        <Flag size={16} />
                        <div className="flag-details">
                          <span className="flag-name">visual-sketch</span>
                          <span className="flag-description">
                            Enable visual sketch/diagram feature
                          </span>
                        </div>
                      </div>
                      <label className="toggle-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="flag-item">
                      <div className="flag-info">
                        <Flag size={16} />
                        <div className="flag-details">
                          <span className="flag-name">subdomain-hosting</span>
                          <span className="flag-description">
                            Allow projects to have subdomains
                          </span>
                        </div>
                      </div>
                      <label className="toggle-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="flag-item">
                      <div className="flag-info">
                        <Flag size={16} />
                        <div className="flag-details">
                          <span className="flag-name">ai-agent-chat</span>
                          <span className="flag-description">
                            AI-powered chat assistance
                          </span>
                        </div>
                      </div>
                      <label className="toggle-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="flag-item">
                      <div className="flag-info">
                        <Flag size={16} />
                        <div className="flag-details">
                          <span className="flag-name">resource-monitoring</span>
                          <span className="flag-description">
                            Real-time container resource graphs
                          </span>
                        </div>
                      </div>
                      <label className="toggle-switch">
                        <input type="checkbox" />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="flag-item">
                      <div className="flag-info">
                        <Flag size={16} />
                        <div className="flag-details">
                          <span className="flag-name">billing-module</span>
                          <span className="flag-description">
                            Enable billing and usage tracking
                          </span>
                        </div>
                      </div>
                      <label className="toggle-switch">
                        <input type="checkbox" />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Billing Tab */}
              {activeTab === "billing" && (
                <div className="admin-billing">
                  <div className="billing-overview">
                    <div className="billing-card">
                      <div className="billing-card-header">
                        <CreditCard size={20} />
                        <span>Current Plan</span>
                      </div>
                      <div className="billing-plan">
                        <span className="plan-name">Team Pro</span>
                        <span className="plan-price">$49/month</span>
                      </div>
                      <div className="billing-usage">
                        <div className="usage-item">
                          <span>Projects</span>
                          <span>12 / 25</span>
                        </div>
                        <div className="usage-item">
                          <span>Team Members</span>
                          <span>8 / 15</span>
                        </div>
                        <div className="usage-item">
                          <span>Storage</span>
                          <span>4.2 GB / 10 GB</span>
                        </div>
                      </div>
                      <button className="btn-primary">Upgrade Plan</button>
                    </div>

                    <div className="billing-card">
                      <div className="billing-card-header">
                        <DollarSign size={20} />
                        <span>Billing History</span>
                      </div>
                      <div className="billing-history">
                        <div className="history-item">
                          <span className="date">Jan 1, 2025</span>
                          <span className="amount">$49.00</span>
                          <span className="status paid">Paid</span>
                        </div>
                        <div className="history-item">
                          <span className="date">Dec 1, 2024</span>
                          <span className="amount">$49.00</span>
                          <span className="status paid">Paid</span>
                        </div>
                        <div className="history-item">
                          <span className="date">Nov 1, 2024</span>
                          <span className="amount">$49.00</span>
                          <span className="status paid">Paid</span>
                        </div>
                      </div>
                      <button className="btn-secondary">
                        <Download size={14} />
                        Download Invoices
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Rate Limiting Tab */}
              {activeTab === "rate-limiting" && (
                <div className="admin-rate-limiting">
                  <div className="rate-limit-header">
                    <p>
                      Configure API rate limits for different endpoints and user
                      tiers.
                    </p>
                  </div>
                  <div className="rate-limits-grid">
                    <div className="rate-limit-card">
                      <div className="rate-limit-header">
                        <Gauge size={18} />
                        <span>Standard Users</span>
                      </div>
                      <div className="rate-limit-values">
                        <div className="limit-item">
                          <span>API Requests</span>
                          <input type="number" defaultValue={1000} />
                          <span>/ hour</span>
                        </div>
                        <div className="limit-item">
                          <span>Deployments</span>
                          <input type="number" defaultValue={10} />
                          <span>/ day</span>
                        </div>
                        <div className="limit-item">
                          <span>Webhooks</span>
                          <input type="number" defaultValue={100} />
                          <span>/ hour</span>
                        </div>
                      </div>
                    </div>

                    <div className="rate-limit-card">
                      <div className="rate-limit-header">
                        <Gauge size={18} />
                        <span>Pro Users</span>
                      </div>
                      <div className="rate-limit-values">
                        <div className="limit-item">
                          <span>API Requests</span>
                          <input type="number" defaultValue={10000} />
                          <span>/ hour</span>
                        </div>
                        <div className="limit-item">
                          <span>Deployments</span>
                          <input type="number" defaultValue={100} />
                          <span>/ day</span>
                        </div>
                        <div className="limit-item">
                          <span>Webhooks</span>
                          <input type="number" defaultValue={1000} />
                          <span>/ hour</span>
                        </div>
                      </div>
                    </div>

                    <div className="rate-limit-card">
                      <div className="rate-limit-header">
                        <Gauge size={18} />
                        <span>Admin Users</span>
                      </div>
                      <div className="rate-limit-values">
                        <div className="limit-item">
                          <span>API Requests</span>
                          <input type="number" defaultValue={999999} />
                          <span>/ hour</span>
                        </div>
                        <div className="limit-item">
                          <span>Deployments</span>
                          <input type="number" defaultValue={999} />
                          <span>/ day</span>
                        </div>
                        <div className="limit-item">
                          <span>Webhooks</span>
                          <input type="number" defaultValue={99999} />
                          <span>/ hour</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="rate-limit-actions">
                    <button className="btn-primary">Save Changes</button>
                  </div>
                </div>
              )}

              {/* Backups Tab */}
              {activeTab === "backups" && (
                <div className="admin-backups">
                  <div className="backup-actions-bar">
                    <button className="btn-primary">
                      <Plus size={16} />
                      Create Backup
                    </button>
                    <button className="btn-secondary">
                      <ArchiveRestore size={16} />
                      Restore from File
                    </button>
                  </div>

                  <div className="backups-list">
                    <div className="backup-item">
                      <div className="backup-info">
                        <Database size={18} />
                        <div className="backup-details">
                          <span className="backup-name">
                            Full Backup - 2025-01-05
                          </span>
                          <span className="backup-size">
                            245 MB • 3 teams, 156 projects
                          </span>
                        </div>
                      </div>
                      <div className="backup-actions">
                        <button className="btn-icon" title="Download">
                          <Download size={14} />
                        </button>
                        <button className="btn-icon" title="Restore">
                          <ArchiveRestore size={14} />
                        </button>
                        <button className="btn-icon danger" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="backup-item">
                      <div className="backup-info">
                        <Database size={18} />
                        <div className="backup-details">
                          <span className="backup-name">
                            Full Backup - 2025-01-01
                          </span>
                          <span className="backup-size">
                            238 MB • 3 teams, 152 projects
                          </span>
                        </div>
                      </div>
                      <div className="backup-actions">
                        <button className="btn-icon" title="Download">
                          <Download size={14} />
                        </button>
                        <button className="btn-icon" title="Restore">
                          <ArchiveRestore size={14} />
                        </button>
                        <button className="btn-icon danger" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="backup-item">
                      <div className="backup-info">
                        <Database size={18} />
                        <div className="backup-details">
                          <span className="backup-name">
                            Full Backup - 2024-12-28
                          </span>
                          <span className="backup-size">
                            230 MB • 3 teams, 148 projects
                          </span>
                        </div>
                      </div>
                      <div className="backup-actions">
                        <button className="btn-icon" title="Download">
                          <Download size={14} />
                        </button>
                        <button className="btn-icon" title="Restore">
                          <ArchiveRestore size={14} />
                        </button>
                        <button className="btn-icon danger" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="backup-schedule">
                    <h3>Automatic Backups</h3>
                    <div className="schedule-settings">
                      <label className="toggle-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="toggle-slider"></span>
                      </label>
                      <span>Enable automatic backups</span>
                      <select defaultValue="daily">
                        <option value="hourly">Every Hour</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* API Keys Tab */}
              {activeTab === "api-keys" && (
                <div className="admin-api-keys">
                  <div className="api-keys-header">
                    <p>
                      Manage API keys for programmatic access to Zurto APIs.
                    </p>
                    <button className="btn-primary">
                      <Plus size={16} />
                      Generate New Key
                    </button>
                  </div>

                  <div className="api-keys-list">
                    <div className="api-key-item">
                      <div className="api-key-info">
                        <KeyRound size={18} />
                        <div className="api-key-details">
                          <span className="api-key-name">
                            Production API Key
                          </span>
                          <code className="api-key-value">
                            zk_prod_••••••••••••7f3a
                          </code>
                        </div>
                      </div>
                      <div className="api-key-meta">
                        <span className="key-scope">Full Access</span>
                        <span className="key-created">
                          Created Dec 15, 2024
                        </span>
                        <span className="key-usage">1,247 calls today</span>
                      </div>
                      <div className="api-key-actions">
                        <button className="btn-icon" title="Reveal">
                          <Key size={14} />
                        </button>
                        <button className="btn-icon" title="Copy">
                          <Copy size={14} />
                        </button>
                        <button className="btn-icon danger" title="Revoke">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="api-key-item">
                      <div className="api-key-info">
                        <KeyRound size={18} />
                        <div className="api-key-details">
                          <span className="api-key-name">
                            CI/CD Integration
                          </span>
                          <code className="api-key-value">
                            zk_cicd_••••••••••••2b1e
                          </code>
                        </div>
                      </div>
                      <div className="api-key-meta">
                        <span className="key-scope">Deploy Only</span>
                        <span className="key-created">Created Jan 2, 2025</span>
                        <span className="key-usage">89 calls today</span>
                      </div>
                      <div className="api-key-actions">
                        <button className="btn-icon" title="Reveal">
                          <Key size={14} />
                        </button>
                        <button className="btn-icon" title="Copy">
                          <Copy size={14} />
                        </button>
                        <button className="btn-icon danger" title="Revoke">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Webhooks Tab */}
              {activeTab === "webhooks" && (
                <div className="admin-webhooks">
                  <div className="webhooks-header">
                    <p>
                      Configure webhook endpoints to receive real-time events.
                    </p>
                    <button className="btn-primary">
                      <Plus size={16} />
                      Add Webhook
                    </button>
                  </div>

                  <div className="webhooks-list">
                    <div className="webhook-item">
                      <div className="webhook-info">
                        <Webhook size={18} />
                        <div className="webhook-details">
                          <span className="webhook-name">
                            Discord Notifications
                          </span>
                          <code className="webhook-url">
                            https://discord.com/api/webhooks/...
                          </code>
                        </div>
                      </div>
                      <div className="webhook-events">
                        <span className="event-tag">deployment.success</span>
                        <span className="event-tag">deployment.failed</span>
                        <span className="event-tag">project.created</span>
                      </div>
                      <div className="webhook-status">
                        <span className="status-badge active">Active</span>
                        <span className="last-triggered">
                          Last: 2 hours ago
                        </span>
                      </div>
                      <div className="webhook-actions">
                        <button className="btn-icon" title="Test">
                          <Activity size={14} />
                        </button>
                        <button className="btn-icon" title="Edit">
                          <Edit size={14} />
                        </button>
                        <button className="btn-icon danger" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="webhook-item">
                      <div className="webhook-info">
                        <Webhook size={18} />
                        <div className="webhook-details">
                          <span className="webhook-name">Slack Alerts</span>
                          <code className="webhook-url">
                            https://hooks.slack.com/services/...
                          </code>
                        </div>
                      </div>
                      <div className="webhook-events">
                        <span className="event-tag">deployment.failed</span>
                        <span className="event-tag">container.error</span>
                      </div>
                      <div className="webhook-status">
                        <span className="status-badge active">Active</span>
                        <span className="last-triggered">Last: 5 days ago</span>
                      </div>
                      <div className="webhook-actions">
                        <button className="btn-icon" title="Test">
                          <Activity size={14} />
                        </button>
                        <button className="btn-icon" title="Edit">
                          <Edit size={14} />
                        </button>
                        <button className="btn-icon danger" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="webhook-events-legend">
                    <h4>Available Events</h4>
                    <div className="events-grid">
                      <div className="event-type">
                        <span className="event-name">deployment.success</span>
                        <span className="event-desc">
                          Triggered when a deployment completes successfully
                        </span>
                      </div>
                      <div className="event-type">
                        <span className="event-name">deployment.failed</span>
                        <span className="event-desc">
                          Triggered when a deployment fails
                        </span>
                      </div>
                      <div className="event-type">
                        <span className="event-name">project.created</span>
                        <span className="event-desc">
                          Triggered when a new project is created
                        </span>
                      </div>
                      <div className="event-type">
                        <span className="event-name">container.error</span>
                        <span className="event-desc">
                          Triggered when a container encounters an error
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Create User Modal */}
      {showCreateUserModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowCreateUserModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create New User</h2>
            <form onSubmit={handleCreateUser}>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                />
              </div>
              <div className="form-group">
                <label>Team</label>
                <select
                  value={newTeamId}
                  onChange={(e) => setNewTeamId(e.target.value)}
                  required
                >
                  <option value="">Select a team</option>
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={makeNewUserAdmin}
                    onChange={(e) => setMakeNewUserAdmin(e.target.checked)}
                  />
                  Make Admin
                </label>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowCreateUserModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Team Modal */}
      {showCreateTeamModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowCreateTeamModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Team</h2>
            <form onSubmit={handleCreateTeam}>
              <div className="form-group">
                <label>Team Name</label>
                <input
                  type="text"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="Enter team name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description (optional)</label>
                <textarea
                  value={newTeamDescription}
                  onChange={(e) => setNewTeamDescription(e.target.value)}
                  placeholder="Enter team description"
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowCreateTeamModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
