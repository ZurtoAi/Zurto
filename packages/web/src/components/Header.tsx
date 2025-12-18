import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  ChevronLeft,
  ChevronDown,
  RefreshCw,
  Bell,
  User,
  Settings,
  BookOpen,
  Shield,
  LogOut,
  Zap,
} from "lucide-react";
import "../styles/Header.css";

interface HeaderProps {
  projectName?: string;
  environment?: string;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  showBackButton?: boolean;
  onSyncClick?: () => void;
  isSyncing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  projectName,
  environment = "production",
  activeTab = "architecture",
  onTabChange,
  showBackButton = false,
  onSyncClick,
  isSyncing = false,
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showEnvDropdown, setShowEnvDropdown] = useState(false);

  // Get user display info
  const userDisplayName = user?.username || "Guest";
  const userInitial = userDisplayName.charAt(0).toUpperCase();
  const userEmail = user?.teamId ? `${user.username}@team-${user.teamId}` : "";

  const tabs = ["architecture", "observability", "logs", "settings", "share"];
  const environments = ["production", "staging", "development"];

  const handleBackClick = () => {
    navigate("/dashboard");
  };

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <header className="railway-header">
      {/* Top Bar */}
      <div className="header-top">
        {/* Left Section: Logo / Back + Project Info */}
        <div className="header-left">
          {showBackButton ? (
            <button className="back-button" onClick={handleBackClick}>
              <ChevronLeft size={16} />
            </button>
          ) : (
            <div
              className="logo-section"
              onClick={() => navigate("/dashboard")}
            >
              <span className="logo">
                <Zap size={18} />
              </span>
              <span className="logo-text">Zurto</span>
            </div>
          )}

          {/* Project Dropdown */}
          {projectName && (
            <>
              <span className="header-divider">/</span>
              <div className="project-dropdown">
                <button className="dropdown-trigger">
                  <span className="project-name">{projectName}</span>
                  <ChevronDown size={12} />
                </button>
              </div>

              {/* Environment Dropdown */}
              <span className="header-divider">/</span>
              <div className="env-dropdown">
                <button
                  className="dropdown-trigger env-trigger"
                  onClick={() => setShowEnvDropdown(!showEnvDropdown)}
                >
                  <span className={`env-dot env-${environment}`}></span>
                  <span className="env-name">{environment}</span>
                  <ChevronDown size={12} />
                </button>
                {showEnvDropdown && (
                  <div className="dropdown-menu">
                    {environments.map((env) => (
                      <button
                        key={env}
                        className={`dropdown-item ${env === environment ? "active" : ""}`}
                        onClick={() => setShowEnvDropdown(false)}
                      >
                        <span className={`env-dot env-${env}`}></span>
                        {env}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Center Section: Navigation Tabs */}
        {projectName && (
          <nav className="header-tabs">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`header-tab ${activeTab === tab ? "active" : ""}`}
                onClick={() => onTabChange?.(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        )}

        {/* Right Section: Tools + User */}
        <div className="header-right">
          {/* Sync Button (only on canvas view) */}
          {projectName && (
            <button
              className={`sync-button ${isSyncing ? "syncing" : ""}`}
              onClick={onSyncClick}
              title="Save changes"
              disabled={isSyncing}
            >
              <RefreshCw size={16} className={isSyncing ? "spin" : ""} />
              <span>{isSyncing ? "Saving..." : "Sync"}</span>
            </button>
          )}

          {/* Notifications */}
          <button className="header-icon-btn" title="Notifications">
            <Bell size={18} />
            <span className="notification-dot"></span>
          </button>

          {/* User Menu */}
          <div className="user-menu">
            <button
              className="user-avatar-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="avatar">
                <span>{userInitial}</span>
              </div>
            </button>

            {showUserMenu && (
              <div className="user-menu-dropdown">
                <div className="user-info">
                  <div className="user-name">{userDisplayName}</div>
                  {userEmail && <div className="user-email">{userEmail}</div>}
                </div>
                <div className="menu-divider"></div>
                <a href="#profile" className="menu-item">
                  <User size={14} /> Profile
                </a>
                <a href="#settings" className="menu-item">
                  <Settings size={14} /> Settings
                </a>
                <a href="#docs" className="menu-item">
                  <BookOpen size={14} /> Documentation
                </a>
                {user?.isAdmin && (
                  <>
                    <div className="menu-divider"></div>
                    <Link
                      to="/admin"
                      className="menu-item admin-link"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Shield size={14} /> Admin Panel
                    </Link>
                  </>
                )}
                <div className="menu-divider"></div>
                <button onClick={handleLogout} className="menu-item logout">
                  <LogOut size={14} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
