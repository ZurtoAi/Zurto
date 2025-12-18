/**
 * Canvas View - Unified Docker-Integrated Canvas
 *
 * Main project view with:
 * - Docker service management (start/stop/restart/rebuild)
 * - Multi-level navigation (services → files)
 * - Source code editing
 * - Terminal/logs panel
 * - All existing features (Copilot, Deploy, Port Management, etc.)
 */

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Search, Terminal, Rocket, Command as CommandIcon } from "lucide-react";

// Layout Components
import { Header } from "../components/Header";
import { SidePanel } from "../components/SidePanel";

// New Canvas System
import { CanvasProvider, useCanvas } from "../context/CanvasContext";
import {
  MainCanvas,
  ServiceCanvas,
  CanvasNavigator,
} from "../components/docker-canvas";
import {
  SourceCodePanel,
  TerminalPanel,
  ServiceDetailPanel,
} from "../components/panels";
import { GlobalSearch } from "../components/search";
import { CommandPalette } from "../components/CommandPalette";

// Existing Feature Components
import { CopilotChat } from "../components/CopilotChat";
import { PortManagement } from "../components/PortManagement";
import { DeployModal } from "../components/DeployModal";
import { AIQuestionnaire } from "../components/AIQuestionnaire";
import { DeploymentProgressModal } from "../components/DeploymentProgressModal";
import { ConfirmationModal } from "../components/ConfirmationModal";
import { NotificationBell } from "../components/NotificationBell";
import {
  ObservabilityTab,
  LogsTab,
  ShareTab,
  SettingsTab,
} from "../components/TabContent";

// Hooks & Services
import { useDeployment } from "../hooks/useDeployment";
import { socketService } from "../services/socket";
import { projectsAPI, nodesAPI } from "../services/api";

// Types
import { PanelType, ActivityItem } from "../types";

// Styles
import "../styles/CanvasView.css";

// ============================================
// TYPES (Exported for other modules)
// ============================================

// Node relationship for connection lines (exported for use in project data)
export interface NodeConnection {
  id: string;
  sourceId: string;
  targetId: string;
  type:
    | "depends_on"
    | "child_of"
    | "connects_to"
    | "calls"
    | "generates"
    | "deploys"
    | "implements"
    | "references";
}

interface SelectedNodeForPanel {
  id: string;
  name: string;
  label: string;
  description?: string;
  type: string;
  status?: string;
  position: { x: number; y: number };
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// MAIN COMPONENT
// ============================================

const CanvasView: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  // ============================================
  // PROJECT STATE
  // ============================================
  const [projectName, setProjectName] = useState("Loading...");
  const [projectDescription, setProjectDescription] = useState("");
  const [isLoadingProject, setIsLoadingProject] = useState(true);

  // ============================================
  // UI STATE
  // ============================================
  const [activeTab, setActiveTab] = useState("architecture");
  const [activePanel, setActivePanel] = useState<PanelType | null>(null);
  const [selectedNode, setSelectedNode] = useState<SelectedNodeForPanel | null>(
    null
  );

  // Feature Panels
  const [showCopilot, setShowCopilot] = useState(false);
  const [showPortManagement, setShowPortManagement] = useState(false);
  const [showAIQuestionnaire, setShowAIQuestionnaire] = useState(false);

  // Service Detail Panel State
  const [showServiceDetail, setShowServiceDetail] = useState(false);
  const [serviceDetailData, setServiceDetailData] = useState<{
    serviceId: string;
    serviceName: string;
    serviceType:
      | "api"
      | "web"
      | "bot"
      | "database"
      | "worker"
      | "cache"
      | "other";
    status?: "running" | "stopped" | "error";
    port?: number;
  } | null>(null);

  // Deploy State
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [deployNode, setDeployNode] = useState<any>(null);
  const [showDeployConfirmation, setShowDeployConfirmation] = useState(false);
  const deployment = useDeployment();

  // Sync State
  const [isSyncing, setIsSyncing] = useState(false);

  // Activity Feed
  const [activities] = useState<ActivityItem[]>([
    {
      id: "1",
      type: "deployment",
      title: "Service Deployed",
      description: "Deployed via Docker",
      timestamp: new Date(Date.now() - 300000),
      nodeId: "1",
      nodeName: "Backend API",
      status: "success",
    },
  ]);

  // ============================================
  // LOAD PROJECT
  // ============================================
  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) {
        navigate("/dashboard");
        return;
      }

      setIsLoadingProject(true);
      try {
        const response = await projectsAPI.get(projectId);
        const projectData = response?.data || response;
        if (projectData) {
          setProjectName(projectData.name || "Project");
          setProjectDescription(projectData.description || "");
        }
      } catch (err) {
        console.error("Failed to fetch project:", err);
        setProjectName("Project");
      } finally {
        setIsLoadingProject(false);
      }
    };

    fetchProject();
  }, [projectId, navigate]);

  // ============================================
  // SOCKET CONNECTION
  // ============================================
  useEffect(() => {
    socketService
      .connect()
      .then(() => {
        console.log("✅ Socket connected");
        if (projectId) {
          socketService.joinProject(
            "user-" + Date.now(),
            "Anonymous",
            projectId
          );
        }
      })
      .catch((err) => {
        console.error("❌ Socket connection failed:", err);
      });

    return () => {
      socketService.leaveProject();
      socketService.disconnect();
    };
  }, [projectId]);

  // ============================================
  // KEYBOARD SHORTCUTS
  // ============================================
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ⌘K or Ctrl+K for Copilot
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowCopilot((prev) => !prev);
      }
      // Escape to close panels
      if (e.key === "Escape") {
        setActivePanel(null);
        setShowCopilot(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // ============================================
  // SYNC HANDLER
  // ============================================
  const handleSync = useCallback(async () => {
    setIsSyncing(true);
    try {
      // Refresh project data
      if (projectId) {
        const response = await projectsAPI.get(projectId);
        const projectData = response?.data || response;
        if (projectData) {
          setProjectName(projectData.name || "Project");
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("✅ Sync complete");
    } catch (error) {
      console.error("Sync failed:", error);
    } finally {
      setIsSyncing(false);
    }
  }, [projectId]);

  // ============================================
  // NODE HANDLERS (for side panel)
  // ============================================
  const handleNodeUpdate = useCallback(
    (nodeId: string, changes: { name?: string; description?: string }) => {
      console.log(`Updated node ${nodeId}`, changes);
    },
    []
  );

  const handleNodeStart = useCallback((nodeId: string) => {
    console.log(`Starting node ${nodeId}`);
  }, []);

  const handleNodeStop = useCallback((nodeId: string) => {
    console.log(`Stopping node ${nodeId}`);
  }, []);

  const handleNodeRestart = useCallback((nodeId: string) => {
    console.log(`Restarting node ${nodeId}`);
  }, []);

  const handleNodeRebuild = useCallback((nodeId: string) => {
    console.log(`Rebuilding node ${nodeId}`);
  }, []);

  // Handler for opening service detail panel (double-click)
  const handleOpenServiceDetail = useCallback(
    (
      serviceId: string,
      serviceName: string,
      serviceType: string,
      status?: string,
      port?: number
    ) => {
      setServiceDetailData({
        serviceId,
        serviceName,
        serviceType: serviceType as
          | "api"
          | "web"
          | "bot"
          | "database"
          | "worker"
          | "cache"
          | "other",
        status: status as "running" | "stopped" | "error" | undefined,
        port,
      });
      setShowServiceDetail(true);
    },
    []
  );

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="canvas-view-page">
      {/* Background Effects */}
      <div className="canvas-glow-orb canvas-glow-orb-1" />
      <div className="canvas-glow-orb canvas-glow-orb-2" />

      {/* Header */}
      <Header
        projectName={projectName}
        environment="production"
        activeTab={activeTab}
        onTabChange={setActiveTab}
        showBackButton={true}
        onSyncClick={handleSync}
        isSyncing={isSyncing}
      />

      <div className="canvas-layout">
        {/* Left Sidebar */}
        <CanvasSidebar
          showCopilot={showCopilot}
          setShowCopilot={setShowCopilot}
          showPortManagement={showPortManagement}
          setShowPortManagement={setShowPortManagement}
          showAIQuestionnaire={showAIQuestionnaire}
          setShowAIQuestionnaire={setShowAIQuestionnaire}
        />

        {/* Copilot Chat Panel */}
        <CopilotChat
          projectId={projectId || ""}
          isOpen={showCopilot}
          onClose={() => setShowCopilot(false)}
          onAction={(action, data) => {
            console.log("Copilot action:", action, data);
          }}
        />

        {/* Port Management Modal */}
        <PortManagement
          projectId={projectId}
          isOpen={showPortManagement}
          onClose={() => setShowPortManagement(false)}
        />

        {/* Main Content Area */}
        <div className={`canvas-main ${activePanel ? "panel-open" : ""}`}>
          {/* Tab Content (non-architecture) */}
          {activeTab === "observability" && (
            <ObservabilityTab projectId={projectId} />
          )}
          {activeTab === "logs" && <LogsTab projectId={projectId} />}
          {activeTab === "settings" && (
            <SettingsTab projectId={projectId} projectName={projectName} />
          )}
          {activeTab === "share" && (
            <ShareTab projectId={projectId} projectName={projectName} />
          )}

          {/* Architecture Tab - Docker Canvas */}
          {activeTab === "architecture" && projectId && (
            <CanvasProvider>
              <DockerCanvasContent
                projectId={projectId}
                projectName={projectName}
                activities={activities}
                onShowDeployConfirmation={() => setShowDeployConfirmation(true)}
                isDeploying={deployment.isDeploying}
              />
            </CanvasProvider>
          )}
        </div>

        {/* Side Panel */}
        <SidePanel
          isOpen={!!activePanel}
          type={activePanel}
          onClose={() => setActivePanel(null)}
          selectedNode={selectedNode}
          onNodeUpdate={handleNodeUpdate}
          onNodeStart={handleNodeStart}
          onNodeStop={handleNodeStop}
          onNodeRestart={handleNodeRestart}
          onNodeRebuild={handleNodeRebuild}
          activities={activities}
        />
      </div>

      {/* AI Questionnaire */}
      <AIQuestionnaire
        projectId={projectId || "default"}
        projectName={projectName}
        isOpen={showAIQuestionnaire}
        onClose={() => setShowAIQuestionnaire(false)}
        onComplete={async (result) => {
          console.log("AI Analysis complete:", result);
          setShowAIQuestionnaire(false);
        }}
      />

      {/* Deploy Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeployConfirmation}
        title="Deploy Project"
        message="This will start the full deployment pipeline for your project."
        details={[
          "✓ Validate project structure",
          "✓ Build Docker containers",
          "✓ Deploy and start containers",
          "✓ Verify deployment health",
        ]}
        confirmText="Start Deployment"
        cancelText="Cancel"
        confirmVariant="primary"
        onConfirm={() => {
          setShowDeployConfirmation(false);
          if (projectId) {
            deployment.startDeployment(projectId);
          }
        }}
        onCancel={() => setShowDeployConfirmation(false)}
      />

      {/* Deployment Progress Modal */}
      <DeploymentProgressModal
        isOpen={deployment.showProgress}
        steps={deployment.steps}
        currentStep={deployment.currentStep}
        files={deployment.files}
        error={deployment.error}
        isComplete={deployment.isComplete}
        onClose={() => deployment.closeProgress()}
        onRetry={() => {
          if (projectId) {
            deployment.retryFromFailed(projectId);
          }
        }}
        onCancel={deployment.cancelDeployment}
      />

      {/* Service Detail Panel - Shows on double-click */}
      {serviceDetailData && (
        <ServiceDetailPanel
          isOpen={showServiceDetail}
          onClose={() => {
            setShowServiceDetail(false);
            setServiceDetailData(null);
          }}
          serviceId={serviceDetailData.serviceId}
          serviceName={serviceDetailData.serviceName}
          serviceType={serviceDetailData.serviceType}
          status={serviceDetailData.status}
          port={serviceDetailData.port}
          onStartService={() => handleNodeStart(serviceDetailData.serviceId)}
          onStopService={() => handleNodeStop(serviceDetailData.serviceId)}
          onRestartService={() =>
            handleNodeRestart(serviceDetailData.serviceId)
          }
        />
      )}
    </div>
  );
};

// ============================================
// SIDEBAR COMPONENT
// ============================================

interface CanvasSidebarProps {
  showCopilot: boolean;
  setShowCopilot: (show: boolean) => void;
  showPortManagement: boolean;
  setShowPortManagement: (show: boolean) => void;
  showAIQuestionnaire: boolean;
  setShowAIQuestionnaire: (show: boolean) => void;
}

function CanvasSidebar({
  showCopilot,
  setShowCopilot,
  showPortManagement,
  setShowPortManagement,
  showAIQuestionnaire,
  setShowAIQuestionnaire,
}: CanvasSidebarProps) {
  return (
    <aside className="canvas-sidebar">
      {/* Copilot AI Button */}
      <button
        className={`sidebar-btn ${showCopilot ? "active" : ""}`}
        title="Copilot AI (Ctrl+K)"
        onClick={() => setShowCopilot(!showCopilot)}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      </button>

      {/* Port Management Button */}
      <button
        className={`sidebar-btn ${showPortManagement ? "active" : ""}`}
        title="Port Management"
        onClick={() => setShowPortManagement(!showPortManagement)}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      </button>

      {/* AI Questionnaire Button */}
      <button
        className={`sidebar-btn ${showAIQuestionnaire ? "active" : ""}`}
        title="AI Project Analysis"
        onClick={() => setShowAIQuestionnaire(!showAIQuestionnaire)}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <path d="M12 17h.01" />
        </svg>
      </button>

      <div className="sidebar-divider" />
    </aside>
  );
}

// ============================================
// DOCKER CANVAS CONTENT
// ============================================

interface DockerCanvasContentProps {
  projectId: string;
  projectName: string;
  activities: ActivityItem[];
  onShowDeployConfirmation: () => void;
  isDeploying: boolean;
}

function DockerCanvasContent({
  projectId,
  projectName,
  activities,
  onShowDeployConfirmation,
  isDeploying,
}: DockerCanvasContentProps) {
  const {
    state,
    navigateBack,
    closeFile,
    toggleTerminalPanel,
    toggleSearchPanel,
    navigateToService,
  } = useCanvas();

  const {
    level,
    currentServiceId,
    currentPath,
    selectedFileId,
    selectedFilePath,
    terminalPanelOpen,
    searchPanelOpen,
    terminalServiceId,
    breadcrumb,
  } = state;

  // Command Palette State
  const [commandPaletteOpen, setCommandPaletteOpen] = React.useState(false);

  // Keyboard shortcut for command palette (Ctrl+K or Ctrl+P)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "p")) {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const terminalServiceName =
    breadcrumb.find((b) => b.type === "service" && b.id === terminalServiceId)
      ?.name || "";

  return (
    <>
      {/* Top Toolbar */}
      <div className="canvas-toolbar">
        <div className="toolbar-left">
          <CanvasNavigator />
        </div>
        <div className="toolbar-right">
          <NotificationBell activities={activities} />
        </div>
      </div>

      {/* Canvas Container with Panels */}
      <div className="docker-canvas-layout">
        {/* Search Panel (Left) */}
        {searchPanelOpen && (
          <div className="search-sidebar">
            <GlobalSearch projectId={projectId} />
          </div>
        )}

        {/* Main Canvas */}
        <div className="docker-canvas-main">
          {level === 0 ? (
            <MainCanvas projectId={projectId} />
          ) : (
            <ServiceCanvas
              serviceId={currentServiceId || ""}
              currentPath={currentPath}
            />
          )}
        </div>

        {/* Right Panel (Source Code / Terminal) */}
        {(selectedFileId || terminalPanelOpen) && (
          <div className="docker-right-panel">
            {selectedFileId && selectedFilePath && (
              <SourceCodePanel
                fileId={selectedFileId}
                filePath={selectedFilePath}
                onClose={closeFile}
              />
            )}

            {terminalPanelOpen && terminalServiceId && (
              <TerminalPanel
                serviceId={terminalServiceId}
                serviceName={terminalServiceName}
              />
            )}
          </div>
        )}
      </div>

      {/* Floating Actions */}
      <div className="floating-actions-bar">
        <button
          className={`floating-btn ${commandPaletteOpen ? "active" : ""}`}
          onClick={() => setCommandPaletteOpen(true)}
          title="Command Palette (Ctrl+K)"
        >
          <CommandIcon size={18} />
        </button>

        <button
          className={`floating-btn ${searchPanelOpen ? "active" : ""}`}
          onClick={() => toggleSearchPanel()}
          title="Search (Ctrl+Shift+F)"
        >
          <Search size={18} />
        </button>

        <button
          className={`floating-btn ${terminalPanelOpen ? "active" : ""}`}
          onClick={() => {
            if (currentServiceId) {
              toggleTerminalPanel(currentServiceId);
            }
          }}
          title="Terminal"
          disabled={!currentServiceId && level === 0}
        >
          <Terminal size={18} />
        </button>

        <div className="floating-divider" />

        <button
          className="floating-btn deploy-btn"
          onClick={onShowDeployConfirmation}
          title="Deploy Project"
          disabled={isDeploying}
        >
          <Rocket size={16} /> {isDeploying ? "Deploying..." : "Deploy"}
        </button>
      </div>

      {/* Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        projectId={projectId}
        currentServiceId={currentServiceId || undefined}
        onNavigateToService={(serviceId) => {
          navigateToService(serviceId, serviceId);
        }}
        onDeploy={onShowDeployConfirmation}
        onOpenTerminal={(serviceId) => toggleTerminalPanel(serviceId)}
      />

      {/* Keyboard Shortcuts */}
      <CanvasKeyboardShortcuts />
    </>
  );
}

// ============================================
// KEYBOARD SHORTCUTS
// ============================================

function CanvasKeyboardShortcuts() {
  const { state, toggleSearchPanel, navigateBack } = useCanvas();
  const { level } = state;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+F = Search
      if (e.ctrlKey && e.shiftKey && e.key === "F") {
        e.preventDefault();
        toggleSearchPanel();
      }

      // Alt+Left = Back
      if (e.altKey && e.key === "ArrowLeft" && level > 0) {
        e.preventDefault();
        navigateBack();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSearchPanel, navigateBack, level]);

  return null;
}

export default CanvasView;
