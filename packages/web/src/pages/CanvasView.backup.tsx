import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { ServiceNode, NodeData } from "../components/ServiceNode";
import { CanvasWrapper } from "../components/docker-canvas";
import {
  ContextMenu,
  getNodeContextMenuItems,
  getCanvasContextMenuItems,
} from "../components/ContextMenu";
import { SidePanel } from "../components/SidePanel";
import {
  ObservabilityTab,
  LogsTab,
  ShareTab,
  SettingsTab,
} from "../components/TabContent";
import { CopilotChat } from "../components/CopilotChat";
import { Questionnaire } from "../components/Questionnaire";
import { DeployModal } from "../components/DeployModal";
import { AIQuestionnaire } from "../components/AIQuestionnaire";
import {
  CollaborativeCursors,
  PresenceIndicator,
} from "../components/CollaborativeCursors";
import { PortManagement } from "../components/PortManagement";
import { NotificationBell } from "../components/NotificationBell";
import { DeploymentProgressModal } from "../components/DeploymentProgressModal";
import { ConfirmationModal } from "../components/ConfirmationModal";
import { useDeployment } from "../hooks/useDeployment";
import { PanelType, ContextMenuPosition, ActivityItem } from "../types";
import { socketService } from "../services/socket";
import { nodesAPI, projectsAPI, relationshipsAPI } from "../services/api";
import {
  adaptiveProjectQuestionnaire,
  onboardingQuestionnaire,
} from "../data/sampleQuestionnaires";
import {
  getProjectById,
  getChildNodes,
  getAllDescendants,
  getNodePath,
  isFolder,
} from "../data/projects";
import { ProjectNode } from "../data/projects/index";
import {
  calculateFlowLayout,
  calculateChildFlowLayout,
  defaultLayoutConfig,
  treeLayoutConfig,
} from "../utils/layoutEngine";
import {
  calculateRadialLayout,
  calculateChildRadialLayout,
  calculateSmartOrthogonalPath,
  defaultRadialConfig,
  childViewRadialConfig,
  isMainNode,
  getNodeDimensions,
} from "../utils/radialLayout";
import {
  calculateHierarchicalLayout,
  findBestConnectionPoint,
  calculateSmooth45DegreePath,
  getNodeBoundingBox,
  defaultHierarchicalConfig,
} from "../utils/hierarchicalLayout";
import "../styles/CanvasView.css";

// Type for selected node in panels (matches SidePanel's Node interface)
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

// Wrapper function to apply appropriate layout based on view state
// For existing projects with custom positions, preserves original layout
// For new projects (no positions), applies hierarchical or radial layout
function applyLayout(
  nodes: NodeData[],
  connections: NodeConnection[],
  canvasWidth: number,
  canvasHeight: number,
  isChildView: boolean = false,
  useTreeLayout: boolean = true
): NodeData[] {
  if (nodes.length === 0) return [];

  // Check if nodes already have meaningful positions (not all at 0,0)
  // If they do, preserve the existing layout
  const hasCustomPositions = nodes.some(
    (n) => (n.x !== 0 || n.y !== 0) && n.x !== undefined && n.y !== undefined
  );

  if (hasCustomPositions) {
    // Preserve existing layout - just return nodes as-is
    console.log(
      "📍 Using existing custom positions for",
      nodes.length,
      "nodes"
    );
    return nodes;
  }

  // Apply layout based on toggle
  if (useTreeLayout) {
    console.log(
      "🌲 Applying hierarchical/tree layout to",
      nodes.length,
      "nodes"
    );
    return calculateHierarchicalLayout(
      nodes,
      connections,
      canvasWidth,
      canvasHeight,
      defaultHierarchicalConfig
    );
  } else {
    console.log("🎯 Applying radial layout to", nodes.length, "nodes");
    // Use radial layout with canvas center as origin
    const config = isChildView ? childViewRadialConfig : defaultRadialConfig;
    return calculateRadialLayout(
      nodes,
      connections,
      canvasWidth,
      canvasHeight,
      config
    );
  }
}

const CanvasView: React.FC = () => {
  const { projectId, nodeId: parentNodeId } = useParams<{
    projectId: string;
    nodeId?: string;
  }>();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 1200, height: 800 });

  // API-loaded project data
  const [apiProject, setApiProject] = useState<any>(null);
  const [isLoadingProject, setIsLoadingProject] = useState(false);

  // Load project data from imported projects OR from API
  const localProject = useMemo(() => {
    return getProjectById(projectId || "shinrai-lol-v2");
  }, [projectId]);

  // Fetch project from API if not found locally
  useEffect(() => {
    const fetchProject = async () => {
      if (!localProject && projectId) {
        setIsLoadingProject(true);
        try {
          const response = await projectsAPI.get(projectId);
          const projectData = response?.data || response;
          if (projectData) {
            // Transform API project to local format
            setApiProject({
              id: projectData.id,
              name: projectData.name,
              description: projectData.description,
              teamId: "api",
              nodes: [], // Will be populated from nodes API
              connections: [],
              metadata: {
                createdAt: new Date(projectData.created_at),
                updatedAt: new Date(projectData.updated_at),
                version: "1.0.0",
              },
            });

            // Fetch nodes for this project
            try {
              const nodesResponse = await nodesAPI.list(projectId);
              const nodesData = nodesResponse?.data || nodesResponse || [];
              if (Array.isArray(nodesData)) {
                setApiProject((prev: any) => ({
                  ...prev,
                  nodes: nodesData.map((n: any) => ({
                    id: n.id,
                    label: n.name || n.label,
                    type: n.type || "server",
                    x: n.position?.x || 0,
                    y: n.position?.y || 0,
                    parentId: n.parent_id,
                    status: n.status || "stopped",
                    description: n.description,
                  })),
                }));
              }
            } catch (nodesErr) {
              console.log("No nodes found for project:", nodesErr);
            }
          }
        } catch (err) {
          console.error("Failed to fetch project from API:", err);
        } finally {
          setIsLoadingProject(false);
        }
      }
    };
    fetchProject();
  }, [localProject, projectId]);

  // Use local project if available, otherwise use API project
  const project = localProject || apiProject;

  const projectName =
    project?.name || (isLoadingProject ? "Loading..." : "New Project");

  // View state for same-page navigation (instead of URL-based)
  // Declared early because getDisplayNodes depends on it
  const [currentViewNodeId, setCurrentViewNodeId] = useState<string | null>(
    null
  );
  const [viewHistory, setViewHistory] = useState<string[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);

  // Get nodes to display based on current view level
  // When viewing a folder, shows ALL nested content (files, subfolders, their files, etc.)
  // On main canvas (root level), only show nodes without a parentId
  const getDisplayNodes = useCallback((): NodeData[] => {
    if (!project) return [];

    // Use state-based currentViewNodeId instead of URL param
    const viewNodeId = currentViewNodeId || parentNodeId;

    // If we have a viewNodeId, show ALL descendants recursively
    if (viewNodeId) {
      // Get all descendants (files, subfolders, nested files, etc.)
      const allDescendants = getAllDescendants(viewNodeId);

      // Include the parent node for context (as the root of the tree)
      const parentNode = project.nodes.find(
        (n: NodeData) => n.id === viewNodeId
      );
      if (parentNode) {
        return [
          { ...parentNode, isViewParent: true },
          ...allDescendants,
        ] as NodeData[];
      }
      return allDescendants as NodeData[];
    }

    // Root level view: Only show main server nodes (nodes without a parentId)
    // Child/leaf nodes are only visible when double-clicking into a parent node
    return project.nodes.filter((n: NodeData) => !n.parentId) as NodeData[];
  }, [project, parentNodeId, currentViewNodeId]);

  // Get connections for visible nodes
  const getDisplayConnections = useCallback((): NodeConnection[] => {
    if (!project) return [];

    const displayNodeIds = new Set(
      getDisplayNodes().map((n: NodeData) => n.id)
    );

    // Only show connections where both source and target are visible
    return project.connections.filter(
      (conn: NodeConnection) =>
        displayNodeIds.has(conn.sourceId) && displayNodeIds.has(conn.targetId)
    );
  }, [project, getDisplayNodes]);

  // Connections state
  const [connections, setConnections] = useState<NodeConnection[]>([]);

  // Update connections when display nodes change
  useEffect(() => {
    setConnections(getDisplayConnections());
  }, [getDisplayConnections]);

  // Canvas state - using refs for smooth dragging
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [apiNodes, setApiNodes] = useState<any[]>([]); // Nodes from API
  const [isLoadingApi, setIsLoadingApi] = useState(false);
  const [dataSource, setDataSource] = useState<"api" | "local">("local");
  const nodePositionsRef = useRef<Map<string, { x: number; y: number }>>(
    new Map()
  );

  // Fetch nodes from API
  const fetchNodesFromApi = useCallback(async () => {
    if (!projectId) return;

    setIsLoadingApi(true);
    try {
      const response = (await nodesAPI.list(projectId)) as any;
      const nodesList = response?.data || response || [];

      if (Array.isArray(nodesList) && nodesList.length > 0) {
        setApiNodes(nodesList);
        setDataSource("api");
        console.log("✅ Loaded", nodesList.length, "nodes from API");
      } else {
        console.log("ℹ️ No nodes from API, using local data");
        setDataSource("local");
      }
    } catch (error) {
      console.warn(
        "⚠️ Failed to fetch nodes from API, using local data:",
        error
      );
      setDataSource("local");
    } finally {
      setIsLoadingApi(false);
    }
  }, [projectId]);

  // Load nodes from API on mount
  useEffect(() => {
    fetchNodesFromApi();
  }, [fetchNodesFromApi]);

  // Pan and Zoom state
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const transformRef = useRef({ x: 0, y: 0, scale: 1 });
  const isPanningRef = useRef(false);
  const panStartRef = useRef({ x: 0, y: 0 });

  // Node drag state using refs for smooth performance
  const dragStateRef = useRef<{
    isDragging: boolean;
    nodeId: string | null;
    startX: number;
    startY: number;
    nodeStartX: number;
    nodeStartY: number;
  }>({
    isDragging: false,
    nodeId: null,
    startX: 0,
    startY: 0,
    nodeStartX: 0,
    nodeStartY: 0,
  });

  // Animation frame ref for smooth updates
  const animationFrameRef = useRef<number | null>(null);

  const [activeTab, setActiveTab] = useState("architecture");

  // Sync state
  const [isSyncing, setIsSyncing] = useState(false);

  // Drawing mode state
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [drawingPaths, setDrawingPaths] = useState<
    Array<{ id: string; points: { x: number; y: number }[]; color: string }>
  >(() => {
    // Load drawings from localStorage on initial render
    if (projectId) {
      const saved = localStorage.getItem(`zurto-drawings-${projectId}`);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return [];
        }
      }
    }
    return [];
  });
  const isDrawingRef = useRef(false);
  const currentPathRef = useRef<{ x: number; y: number }[]>([]);

  // Save drawings to localStorage when they change
  React.useEffect(() => {
    if (projectId) {
      if (drawingPaths.length > 0) {
        localStorage.setItem(
          `zurto-drawings-${projectId}`,
          JSON.stringify(drawingPaths)
        );
      } else {
        // Remove from localStorage when cleared
        localStorage.removeItem(`zurto-drawings-${projectId}`);
      }
    }
  }, [drawingPaths, projectId]);

  // Panel state
  const [activePanel, setActivePanel] = useState<PanelType | null>(null);
  const [selectedNode, setSelectedNode] = useState<SelectedNodeForPanel | null>(
    null
  );

  // Activity panel collapsed state
  const [activityCollapsed, setActivityCollapsed] = useState(false);

  // Tree layout toggle (for child views)
  const [useTreeLayout, setUseTreeLayout] = useState(true);

  // Copilot chat state
  const [showCopilot, setShowCopilot] = useState(false);

  // Port management state
  const [showPortManagement, setShowPortManagement] = useState(false);

  // Deploy modal state
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [deployNode, setDeployNode] = useState<NodeData | null>(null);

  // Deployment system with progress tracking
  const deployment = useDeployment();
  const [showDeployConfirmation, setShowDeployConfirmation] = useState(false);

  // Delete confirmation state
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    show: boolean;
    type: "connection" | "node";
    id: string;
    name?: string;
  }>({ show: false, type: "connection", id: "" });

  // AI Questionnaire state
  const [showAIQuestionnaire, setShowAIQuestionnaire] = useState(false);

  // Questionnaire state
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [questionnaireData, setQuestionnaireData] = useState<{
    id: string;
    questions: any[];
  } | null>(null);
  const [selectedQuestionnaireId, setSelectedQuestionnaireId] =
    useState("q-adaptive-project");

  // Available questionnaires
  const questionnairesAvailable = [
    {
      id: adaptiveProjectQuestionnaire.id,
      name: adaptiveProjectQuestionnaire.name,
      data: adaptiveProjectQuestionnaire,
    },
    {
      id: onboardingQuestionnaire.id,
      name: onboardingQuestionnaire.name,
      data: onboardingQuestionnaire,
    },
  ];

  // Connection creation state
  const [isCreatingConnection, setIsCreatingConnection] = useState(false);
  const [connectionStart, setConnectionStart] = useState<string | null>(null);
  const [pendingConnectionEnd, setPendingConnectionEnd] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // Hovered connection for highlighting
  const [hoveredConnection, setHoveredConnection] = useState<string | null>(
    null
  );

  // Context menu state
  const [contextMenu, setContextMenu] = useState<{
    show: boolean;
    position: ContextMenuPosition;
    nodeId: string | null;
  }>({
    show: false,
    position: { x: 0, y: 0 },
    nodeId: null,
  });

  // Activity feed state
  const [activities] = useState<ActivityItem[]>([
    {
      id: "1",
      type: "deployment",
      title: "Backend API Deployed",
      description: "Deployed via GitHub",
      timestamp: new Date(Date.now() - 300000),
      nodeId: "1",
      nodeName: "Backend API",
      status: "success",
    },
    {
      id: "2",
      type: "build",
      title: "PostgreSQL Build Complete",
      description: "Build completed successfully",
      timestamp: new Date(Date.now() - 7200000),
      nodeId: "2",
      nodeName: "PostgreSQL",
      status: "success",
    },
    {
      id: "3",
      type: "error",
      title: "Discord Bot Error",
      description: "Bot crashed - restarting",
      timestamp: new Date(Date.now() - 10800000),
      nodeId: "4",
      nodeName: "Discord Bot",
      status: "error",
    },
  ]);

  // Active users for multi-user collaboration
  const [activeUsers, setActiveUsers] = useState<
    Array<{ id: string; name: string; socketId: string }>
  >([]);
  const [userCursors, setUserCursors] = useState<
    Map<string, { x: number; y: number }>
  >(new Map());

  // Socket connection with real-time event handling
  useEffect(() => {
    socketService
      .connect()
      .then(() => {
        console.log("✅ Socket connected");

        // Join project for multi-user awareness
        if (projectId) {
          socketService.joinProject(
            "user-" + Date.now(),
            "Anonymous",
            projectId
          );
        }

        // Listen for node updates from other users
        socketService.on("node:updated", (data: any) => {
          if (data.projectId === projectId) {
            setNodes((prev) =>
              prev.map((n) => (n.id === data.nodeId ? { ...n, ...data } : n))
            );
          }
        });

        // Listen for node creation from other users
        socketService.on("node:created", (data: any) => {
          if (data.projectId === projectId) {
            const newNode: NodeData = {
              id: data.nodeId,
              label: data.label || data.name,
              type: data.type || "server",
              status: data.status || "stopped",
              x: data.x || canvasSize.width / 2,
              y: data.y || canvasSize.height / 2,
            };
            setNodes((prev) => {
              if (prev.some((n) => n.id === data.nodeId)) return prev;
              return [...prev, newNode];
            });
          }
        });

        // Listen for node deletion from other users
        socketService.on("node:deleted", (data: any) => {
          if (data.projectId === projectId) {
            setNodes((prev) => prev.filter((n) => n.id !== data.nodeId));
          }
        });

        // Listen for node position updates (real-time dragging)
        socketService.on("node:moved", (data: any) => {
          if (data.projectId === projectId) {
            setNodes((prev) =>
              prev.map((n) =>
                n.id === data.nodeId ? { ...n, x: data.x, y: data.y } : n
              )
            );
          }
        });

        // Listen for user presence events
        socketService.on("user:joined", (data: any) => {
          console.log("👤 User joined:", data.name);
          setActiveUsers(data.activeUsers || []);
        });

        socketService.on("user:left", (data: any) => {
          console.log("👤 User left:", data.name);
          setActiveUsers(data.activeUsers || []);
          // Remove cursor
          setUserCursors((prev) => {
            const updated = new Map(prev);
            updated.delete(data.socketId);
            return updated;
          });
        });

        // Listen for other users' cursors
        socketService.on("user:cursor", (data: any) => {
          if (data.projectId === projectId) {
            setUserCursors((prev) => {
              const updated = new Map(prev);
              updated.set(data.socketId, { x: data.x, y: data.y });
              return updated;
            });
          }
        });
      })
      .catch((err) => {
        console.error("❌ Socket connection failed:", err);
      });

    return () => {
      socketService.leaveProject();
      socketService.disconnect();
    };
  }, [projectId, canvasSize.width, canvasSize.height]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ⌘K or Ctrl+K for search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setActivePanel(activePanel === "search" ? null : "search");
      }
      // Escape to close panel
      if (e.key === "Escape") {
        setActivePanel(null);
        setContextMenu((prev) => ({ ...prev, show: false }));
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activePanel]);

  // ============================================
  // NODE ACTIONS
  // ============================================

  const handleNodeStart = useCallback((nodeId: string) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === nodeId ? { ...n, status: "running" } : n))
    );
    console.log(`Starting node ${nodeId}`);
  }, []);

  const handleNodeStop = useCallback((nodeId: string) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === nodeId ? { ...n, status: "stopped" } : n))
    );
    console.log(`Stopping node ${nodeId}`);
  }, []);

  const handleNodeRestart = useCallback((nodeId: string) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === nodeId ? { ...n, status: "running" } : n))
    );
    console.log(`Restarting node ${nodeId}`);
  }, []);

  const handleNodeRebuild = useCallback((nodeId: string) => {
    console.log(`Rebuilding node ${nodeId}`);
    // TODO: Trigger rebuild via API
  }, []);

  // Deploy handlers
  const handleDeploy = useCallback(
    (nodeId: string) => {
      const node = nodes.find((n) => n.id === nodeId);
      if (node) {
        setDeployNode(node);
        setShowDeployModal(true);
      }
    },
    [nodes]
  );

  const handleUndeploy = useCallback(
    (nodeId: string) => {
      const node = nodes.find((n) => n.id === nodeId);
      if (node) {
        // Open deploy modal with isDeployed context for undeploy
        setDeployNode(node);
        setShowDeployModal(true);
      }
    },
    [nodes]
  );

  const handleDeployComplete = useCallback(
    (nodeId: string, deployed: boolean) => {
      setNodes((prev) =>
        prev.map((n) => (n.id === nodeId ? { ...n, isDeployed: deployed } : n))
      );
      setShowDeployModal(false);
      setDeployNode(null);
    },
    []
  );

  const handleNodeUpdate = useCallback(
    (
      nodeId: string,
      changes: { name?: string; description?: string; label?: string }
    ) => {
      setNodes((prev) =>
        prev.map((n) =>
          n.id === nodeId
            ? {
                ...n,
                label: changes.name || changes.label || n.label,
                description: changes.description ?? n.description,
              }
            : n
        )
      );
      console.log(`Updated node ${nodeId}`, changes);
    },
    []
  );

  // Track which nodes are fading out/in during transition
  const [fadingOutNodes, setFadingOutNodes] = useState<Set<string>>(new Set());
  const [fadingInNodes, setFadingInNodes] = useState<Set<string>>(new Set());

  const handleEnterWorkspace = useCallback(
    (nodeId: string) => {
      // Check if this node has children (is a folder)
      const hasChildren = isFolder(nodeId);
      if (hasChildren) {
        // Find the clicked node and calculate where it is on screen
        const clickedNode = nodes.find((n) => n.id === nodeId);
        if (!clickedNode) return;

        // Store current transform and clicked node position for smooth transition
        const currentScale = transformRef.current.scale;
        const currentX = transformRef.current.x;
        const currentY = transformRef.current.y;

        // Calculate where the clicked node appears on screen currently
        const nodeScreenX = clickedNode.x * currentScale + currentX;
        const nodeScreenY = clickedNode.y * currentScale + currentY;

        // Start "power down" effect - all nodes except clicked one fade out
        setIsTransitioning(true);
        setFocusedNodeId(nodeId);

        // Mark all other nodes as fading out
        const otherNodeIds = nodes
          .filter((n) => n.id !== nodeId)
          .map((n) => n.id);
        setFadingOutNodes(new Set(otherNodeIds));

        // Phase 1: Other nodes fade out (400ms)
        setTimeout(() => {
          // Switch to new view
          setViewHistory((prev) => [...prev, currentViewNodeId || "root"]);
          setCurrentViewNodeId(nodeId);
          setFadingOutNodes(new Set());

          // Calculate new transform - use margin for better positioning
          const marginX = 80;
          const marginY = 80;

          // New transform that positions view nicely
          const newTransform = {
            x: marginX,
            y: marginY,
            scale: currentScale, // Preserve zoom level
          };
          transformRef.current = newTransform;
          setTransform(newTransform);
        }, 400);

        // Phase 2: New descendant nodes appear one by one (starts at 500ms)
        setTimeout(() => {
          setFocusedNodeId(null);
          // Get ALL descendants (files, subfolders, everything)
          const allDescendants = getAllDescendants(nodeId);
          // Stagger animation - limit to first 20 nodes for performance, then show rest
          const animateCount = Math.min(allDescendants.length, 20);

          allDescendants.slice(0, animateCount).forEach((descendant, index) => {
            setTimeout(() => {
              setFadingInNodes((prev) => new Set([...prev, descendant.id]));
            }, index * 50); // 50ms stagger for faster appearance
          });

          // Show remaining nodes immediately after animated ones
          if (allDescendants.length > animateCount) {
            setTimeout(() => {
              const remainingIds = allDescendants
                .slice(animateCount)
                .map((n) => n.id);
              setFadingInNodes((prev) => new Set([...prev, ...remainingIds]));
            }, animateCount * 50);
          }

          // End transition after all nodes have appeared
          setTimeout(
            () => {
              setIsTransitioning(false);
              setFadingInNodes(new Set());
            },
            animateCount * 50 + 300
          );
        }, 500);
      } else {
        // No children - open node details panel instead
        const node = nodes.find((n) => n.id === nodeId);
        if (node) {
          const nodeData: SelectedNodeForPanel = {
            id: node.id,
            name: node.label,
            label: node.label,
            description: node.description,
            type: node.type,
            status: node.status,
            position: { x: node.x, y: node.y },
            projectId: projectId || "",
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          setSelectedNode(nodeData);
          setActivePanel("node-editor");
        }
      }
    },
    [projectId, nodes, currentViewNodeId]
  );

  // Handle going back to previous view
  const handleGoBack = useCallback(() => {
    if (viewHistory.length === 0) return;

    // Preserve the current scale when going back
    const currentScale = transformRef.current.scale;

    setIsTransitioning(true);

    setTimeout(() => {
      const previousView = viewHistory[viewHistory.length - 1];
      setViewHistory((prev) => prev.slice(0, -1));
      setCurrentViewNodeId(previousView === "root" ? null : previousView);

      // Keep the zoom level but reset position to center
      const newTransform = { x: 0, y: 0, scale: currentScale };
      transformRef.current = newTransform;
      setTransform(newTransform);

      setTimeout(() => {
        setIsTransitioning(false);
      }, 100);
    }, 200);
  }, [viewHistory]);

  const handleViewLogs = useCallback((nodeId: string) => {
    console.log(`Viewing logs for node ${nodeId}`);
    setActiveTab("logs");
  }, []);

  const handleDuplicateNode = useCallback(
    async (nodeId: string) => {
      const nodeToDuplicate = nodes.find((n) => n.id === nodeId);
      if (nodeToDuplicate && projectId) {
        try {
          // Create via API
          const response = (await nodesAPI.create(
            projectId,
            `${nodeToDuplicate.label} (Copy)`,
            nodeToDuplicate.type || "server",
            nodeToDuplicate.description
          )) as any;

          const newNode: NodeData = {
            ...nodeToDuplicate,
            id: response.data?.id || `${Date.now()}`,
            label: `${nodeToDuplicate.label} (Copy)`,
            x: nodeToDuplicate.x + 50,
            y: nodeToDuplicate.y + 50,
          };
          setNodes((prev) => [...prev, newNode]);

          // Broadcast to other users
          socketService.sendNodeCreate(newNode.id, projectId, {
            label: newNode.label,
            type: newNode.type,
            x: newNode.x,
            y: newNode.y,
          });

          console.log("✅ Node duplicated:", newNode.label);
        } catch (error) {
          console.error("❌ Failed to duplicate node:", error);
          // Fallback to local-only
          const newNode: NodeData = {
            ...nodeToDuplicate,
            id: `${Date.now()}`,
            label: `${nodeToDuplicate.label} (Copy)`,
            x: nodeToDuplicate.x + 50,
            y: nodeToDuplicate.y + 50,
          };
          setNodes((prev) => [...prev, newNode]);
        }
      }
    },
    [nodes, projectId]
  );

  const handleDeleteNode = useCallback(
    async (nodeId: string) => {
      if (!projectId) return;

      try {
        await nodesAPI.delete(projectId, nodeId);
        console.log("✅ Node deleted:", nodeId);

        // Broadcast to other users
        socketService.sendNodeDelete(nodeId, projectId);
      } catch (error) {
        console.error("❌ Failed to delete node from API:", error);
      }

      // Update local state regardless
      setNodes((prev) => prev.filter((n) => n.id !== nodeId));
      setSelectedNode(null);
      setActivePanel(null);
    },
    [projectId]
  );

  // Create a new node
  const handleCreateNode = useCallback(async () => {
    if (!projectId) return;

    const nodeName = prompt("Enter node name:", "New Service");
    if (!nodeName) return;

    const nodeTypeInput =
      prompt("Enter node type (server, file, utility):", "server") || "server";
    const nodeType = (
      ["server", "file", "utility"].includes(nodeTypeInput)
        ? nodeTypeInput
        : "server"
    ) as "server" | "file" | "utility";

    try {
      const response = (await nodesAPI.create(
        projectId,
        nodeName,
        nodeType,
        `${nodeName} service`
      )) as any;

      // Add to local state with position in center of canvas
      const newNode: NodeData = {
        id: response.data?.id || `node-${Date.now()}`,
        label: nodeName,
        type: nodeType,
        status: "stopped",
        description: `${nodeName} service`,
        x: canvasSize.width / 2 - 140,
        y: canvasSize.height / 2 - 50,
      };

      setNodes((prev) => [...prev, newNode]);

      // Broadcast to other users
      socketService.sendNodeCreate(newNode.id, projectId, {
        label: newNode.label,
        type: newNode.type,
        status: newNode.status,
        x: newNode.x,
        y: newNode.y,
      });

      console.log("✅ Node created:", newNode.label);
    } catch (error) {
      console.error("❌ Failed to create node:", error);

      // Fallback to local-only
      const newNode: NodeData = {
        id: `node-${Date.now()}`,
        label: nodeName,
        type: nodeType,
        status: "stopped",
        description: `${nodeName} service`,
        x: canvasSize.width / 2 - 140,
        y: canvasSize.height / 2 - 50,
      };
      setNodes((prev) => [...prev, newNode]);
    }
  }, [projectId, canvasSize]);

  // ============================================
  // CONTEXT MENU
  // ============================================

  const handleNodeContextMenu = useCallback(
    (nodeId: string, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setContextMenu({
        show: true,
        position: { x: e.clientX, y: e.clientY },
        nodeId,
      });
    },
    []
  );

  const handleCanvasContextMenu = useCallback((e: React.MouseEvent) => {
    // Only show canvas context menu if not clicking on a node
    if ((e.target as HTMLElement).closest(".service-node")) return;

    e.preventDefault();
    setContextMenu({
      show: true,
      position: { x: e.clientX, y: e.clientY },
      nodeId: null, // null means canvas context menu
    });
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenu((prev) => ({ ...prev, show: false }));
  }, []);

  const getContextMenuItems = useCallback(() => {
    if (contextMenu.nodeId) {
      const node = nodes.find((n) => n.id === contextMenu.nodeId);
      if (!node) return [];

      return getNodeContextMenuItems(node.type, node.status, {
        onViewDetails: () => {
          const selectedNodeData: SelectedNodeForPanel = {
            id: node.id,
            name: node.label,
            label: node.label,
            description: node.description,
            type: node.type,
            status: node.status,
            position: { x: node.x, y: node.y },
            projectId: projectId || "",
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          setSelectedNode(selectedNodeData);
          setActivePanel("node-editor");
        },
        onEnterWorkspace:
          node.type === "server"
            ? () => handleEnterWorkspace(node.id)
            : undefined,
        onEditCode:
          node.type === "file" ? () => console.log("Edit code") : undefined,
        onStart:
          node.status === "stopped"
            ? () => handleNodeStart(node.id)
            : undefined,
        onStop:
          node.status === "running" ? () => handleNodeStop(node.id) : undefined,
        onRestart:
          node.status === "running"
            ? () => handleNodeRestart(node.id)
            : undefined,
        onRebuild: () => handleNodeRebuild(node.id),
        onViewLogs: node.status ? () => handleViewLogs(node.id) : undefined,
        onDuplicate: () => handleDuplicateNode(node.id),
        onDelete: () => handleDeleteNode(node.id),
        // Deploy handlers
        onDeploy:
          node.type === "server" ? () => handleDeploy(node.id) : undefined,
        onUndeploy:
          node.type === "server" && node.isDeployed
            ? () => handleUndeploy(node.id)
            : undefined,
        isDeployed: node.isDeployed,
      });
    } else {
      // Canvas context menu
      return getCanvasContextMenuItems({
        onAddNode: (type: string) => {
          const newNode: NodeData = {
            id: `${Date.now()}`,
            label: `New ${type}`,
            type: type as "server" | "file" | "utility",
            x: contextMenu.position.x - 100,
            y: contextMenu.position.y - 50,
          };
          setNodes((prev) => [...prev, newNode]);
        },
        onZoomIn: () => console.log("Zoom in"),
        onZoomOut: () => console.log("Zoom out"),
        onFitView: () => console.log("Fit view"),
        onSelectAll: () => console.log("Select all"),
      });
    }
  }, [
    contextMenu.nodeId,
    contextMenu.position,
    nodes,
    projectId,
    handleEnterWorkspace,
    handleNodeStart,
    handleNodeStop,
    handleNodeRestart,
    handleNodeRebuild,
    handleViewLogs,
    handleDuplicateNode,
    handleDeleteNode,
    handleDeploy,
    handleUndeploy,
  ]);

  // ============================================
  // TOOLBAR & PANEL HANDLERS
  // ============================================

  const handleToolClick = useCallback((tool: PanelType) => {
    setActivePanel((prev) => (prev === tool ? null : tool));
    setSelectedNode(null);
  }, []);

  // ============================================
  // SYNC FUNCTIONALITY
  // ============================================

  const handleSync = useCallback(async () => {
    setIsSyncing(true);

    try {
      // Collect current node positions
      const nodePositions = nodes.map((node) => ({
        id: node.id,
        x: node.x,
        y: node.y,
        // Include any other node data that should be saved
        label: node.label,
        type: node.type,
        status: node.status,
      }));

      // TODO: Save to API when backend endpoint is ready
      // await projectsAPI.saveNodePositions(projectId, nodePositions);

      console.log("Syncing node positions:", nodePositions);

      // For now, save to localStorage as a fallback
      const storageKey = `zurto-nodes-${projectId}-${currentViewNodeId || "root"}`;
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          positions: nodePositions,
          transform: transformRef.current,
          savedAt: new Date().toISOString(),
        })
      );

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      console.log("Sync complete!");
    } catch (error) {
      console.error("Sync failed:", error);
    } finally {
      setIsSyncing(false);
    }
  }, [nodes, projectId, currentViewNodeId]);

  // ============================================
  // CANVAS INITIALIZATION
  // ============================================

  // Get canvas size on mount and resize
  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setCanvasSize({ width: rect.width, height: rect.height });
      }
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, []);

  // Initialize nodes with flow layout from project data
  useEffect(() => {
    if (canvasSize.width > 0 && canvasSize.height > 0) {
      const displayNodes = getDisplayNodes();
      const displayConnections = getDisplayConnections();
      if (displayNodes.length > 0) {
        const isChildView = !!(currentViewNodeId || parentNodeId);
        const layoutedNodes = applyLayout(
          displayNodes,
          displayConnections,
          canvasSize.width,
          canvasSize.height,
          isChildView,
          useTreeLayout
        );
        setNodes(layoutedNodes);

        // Initialize position refs
        layoutedNodes.forEach((node) => {
          nodePositionsRef.current.set(node.id, { x: node.x, y: node.y });
        });
      }
    }
  }, [
    canvasSize,
    getDisplayNodes,
    getDisplayConnections,
    parentNodeId,
    currentViewNodeId,
    useTreeLayout,
  ]);

  // ============================================
  // SMOOTH DRAG HANDLERS (using refs for performance)
  // ============================================

  const handleNodeMouseDown = useCallback(
    (nodeId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      const node = nodes.find((n) => n.id === nodeId);
      if (!node) return;

      dragStateRef.current = {
        isDragging: true,
        nodeId,
        startX: e.clientX,
        startY: e.clientY,
        nodeStartX: node.x,
        nodeStartY: node.y,
      };

      e.preventDefault();
    },
    [nodes]
  );

  // Pan handler - start panning on canvas mousedown
  const handleCanvasPanStart = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Only pan if clicking on canvas background (not a node)
      if ((e.target as HTMLElement).closest(".service-node")) return;
      if (e.button !== 0) return; // Left click only

      isPanningRef.current = true;
      panStartRef.current = { x: e.clientX, y: e.clientY };
      e.preventDefault();
    },
    []
  );

  const handleCanvasMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Handle node dragging
      const dragState = dragStateRef.current;
      if (dragState.isDragging && dragState.nodeId) {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }

        animationFrameRef.current = requestAnimationFrame(() => {
          const scale = transformRef.current.scale;
          const deltaX = (e.clientX - dragState.startX) / scale;
          const deltaY = (e.clientY - dragState.startY) / scale;

          const newX = dragState.nodeStartX + deltaX;
          const newY = dragState.nodeStartY + deltaY;

          // Update DOM directly for smooth movement
          const nodeElement = document.querySelector(
            `[data-node-id="${dragState.nodeId}"]`
          ) as HTMLElement;
          if (nodeElement) {
            nodeElement.style.left = `${newX}px`;
            nodeElement.style.top = `${newY}px`;
          }

          // Update ref for connection recalculation
          nodePositionsRef.current.set(dragState.nodeId!, { x: newX, y: newY });

          // Update state for connections (batched)
          setNodes((prev) =>
            prev.map((n) =>
              n.id === dragState.nodeId ? { ...n, x: newX, y: newY } : n
            )
          );
        });
        return;
      }

      // Handle canvas panning
      if (isPanningRef.current) {
        const deltaX = e.clientX - panStartRef.current.x;
        const deltaY = e.clientY - panStartRef.current.y;

        const newTransform = {
          ...transformRef.current,
          x: transformRef.current.x + deltaX,
          y: transformRef.current.y + deltaY,
        };

        transformRef.current = newTransform;
        panStartRef.current = { x: e.clientX, y: e.clientY };

        // Apply transform directly to DOM for smoothness
        const transformLayer = document.querySelector(
          ".canvas-transform-layer"
        ) as HTMLElement;
        if (transformLayer) {
          transformLayer.style.transform = `translate(${newTransform.x}px, ${newTransform.y}px) scale(${newTransform.scale})`;
        }
      }
    },
    []
  );

  const handleCanvasMouseUp = useCallback(() => {
    // Finalize node drag
    const dragState = dragStateRef.current;
    if (dragState.isDragging && dragState.nodeId) {
      const pos = nodePositionsRef.current.get(dragState.nodeId);
      if (pos) {
        setNodes((prev) =>
          prev.map((n) =>
            n.id === dragState.nodeId ? { ...n, x: pos.x, y: pos.y } : n
          )
        );
      }
    }

    // Finalize pan
    if (isPanningRef.current) {
      setTransform({ ...transformRef.current });
    }

    dragStateRef.current = {
      isDragging: false,
      nodeId: null,
      startX: 0,
      startY: 0,
      nodeStartX: 0,
      nodeStartY: 0,
    };
    isPanningRef.current = false;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  // Zoom handler
  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();

    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.min(
      Math.max(transformRef.current.scale * delta, 0.25),
      3
    );

    // Zoom towards mouse position
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const scaleChange = newScale - transformRef.current.scale;
    const newX =
      transformRef.current.x -
      (mouseX - transformRef.current.x) *
        (scaleChange / transformRef.current.scale);
    const newY =
      transformRef.current.y -
      (mouseY - transformRef.current.y) *
        (scaleChange / transformRef.current.scale);

    const newTransform = { x: newX, y: newY, scale: newScale };
    transformRef.current = newTransform;
    setTransform(newTransform);

    // Apply immediately to DOM
    const transformLayer = document.querySelector(
      ".canvas-transform-layer"
    ) as HTMLElement;
    if (transformLayer) {
      transformLayer.style.transform = `translate(${newX}px, ${newY}px) scale(${newScale})`;
    }
  }, []);

  // Reset view to center
  const handleResetView = useCallback(() => {
    const newTransform = { x: 0, y: 0, scale: 1 };
    transformRef.current = newTransform;
    setTransform(newTransform);

    const transformLayer = document.querySelector(
      ".canvas-transform-layer"
    ) as HTMLElement;
    if (transformLayer) {
      transformLayer.style.transform = `translate(0px, 0px) scale(1)`;
    }
  }, []);

  // Re-apply automatic flow layout to all nodes
  const handleReLayout = useCallback(() => {
    if (canvasSize.width > 0 && canvasSize.height > 0) {
      const displayNodes = getDisplayNodes();
      const displayConnections = getDisplayConnections();
      if (displayNodes.length > 0) {
        const isChildView = !!(currentViewNodeId || parentNodeId);
        const layoutedNodes = applyLayout(
          displayNodes,
          displayConnections,
          canvasSize.width,
          canvasSize.height,
          isChildView,
          useTreeLayout
        );
        setNodes(layoutedNodes);

        // Update position refs
        layoutedNodes.forEach((node) => {
          nodePositionsRef.current.set(node.id, { x: node.x, y: node.y });
        });

        // Reset view to center
        const newTransform = { x: 0, y: 0, scale: 1 };
        transformRef.current = newTransform;
        setTransform(newTransform);

        const transformLayer = document.querySelector(
          ".canvas-transform-layer"
        ) as HTMLElement;
        if (transformLayer) {
          transformLayer.style.transform = `translate(0px, 0px) scale(1)`;
        }
      }
    }
  }, [
    canvasSize,
    getDisplayNodes,
    getDisplayConnections,
    currentViewNodeId,
    parentNodeId,
    useTreeLayout,
  ]);

  // Zoom in/out functions
  const handleZoomIn = useCallback(() => {
    const newScale = Math.min(transformRef.current.scale * 1.2, 3);
    const newTransform = { ...transformRef.current, scale: newScale };
    transformRef.current = newTransform;
    setTransform(newTransform);
  }, []);

  const handleZoomOut = useCallback(() => {
    const newScale = Math.max(transformRef.current.scale * 0.8, 0.25);
    const newTransform = { ...transformRef.current, scale: newScale };
    transformRef.current = newTransform;
    setTransform(newTransform);
  }, []);

  // ============================================
  // BEZIER CURVE CONNECTION LINES (Enhanced)
  // ============================================

  // Connection type labels
  const connectionLabels: Record<string, string> = {
    depends_on: "Depends On",
    child_of: "Child Of",
    connects_to: "Connects To",
    calls: "Calls",
    generates: "Generates",
    deploys: "Deploys",
    implements: "Implements",
    references: "References",
  };

  // Handle connection click to delete
  const handleConnectionClick = useCallback(
    (connectionId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      // Show confirmation modal instead of browser confirm()
      setDeleteConfirmation({
        show: true,
        type: "connection",
        id: connectionId,
      });
    },
    []
  );

  // Handle delete confirmation
  const handleDeleteConfirm = useCallback(() => {
    if (deleteConfirmation.type === "connection") {
      setConnections((prev) =>
        prev.filter((c) => c.id !== deleteConfirmation.id)
      );
      // Also update via API
      if (projectId) {
        relationshipsAPI
          .delete(projectId, deleteConfirmation.id)
          .catch(console.error);
      }
    }
    setDeleteConfirmation({ show: false, type: "connection", id: "" });
  }, [deleteConfirmation, projectId]);

  const renderConnectionLine = useCallback(
    (connection: NodeConnection) => {
      const sourceNode = nodes.find((n) => n.id === connection.sourceId);
      const targetNode = nodes.find((n) => n.id === connection.targetId);

      if (!sourceNode || !targetNode) return null;

      // Get bounding boxes for both nodes
      const sourceBox = getNodeBoundingBox(
        sourceNode,
        defaultHierarchicalConfig.nodeWidth,
        defaultHierarchicalConfig.nodeHeight
      );
      const targetBox = getNodeBoundingBox(
        targetNode,
        defaultHierarchicalConfig.nodeWidth,
        defaultHierarchicalConfig.nodeHeight
      );

      // Find optimal connection points with 45-degree preference
      const { from, to } = findBestConnectionPoint(sourceBox, targetBox, true);

      // Calculate smooth 45-degree path
      const pathD = calculateSmooth45DegreePath(from, to);

      const sx = from.x;
      const sy = from.y;
      const tx = to.x;
      const ty = to.y;

      // Color based on connection type
      const connectionColors: Record<string, string> = {
        depends_on: "#5865f2", // Blue
        child_of: "#10b981", // Green
        connects_to: "#f59e0b", // Amber
        calls: "#8b5cf6", // Purple
        generates: "#06b6d4", // Cyan - Planning generates code
        deploys: "#22c55e", // Bright green - Deploy connections
        implements: "#ec4899", // Pink - Implementation
        references: "#64748b", // Slate - References
      };

      const color = connectionColors[connection.type] || "#5865f2";
      const isHovered = hoveredConnection === connection.id;

      // Calculate midpoint for label
      const midX = (sx + tx) / 2;
      const midY = (sy + ty) / 2;

      return (
        <g
          key={connection.id}
          className={`connection-line ${isHovered ? "hovered" : ""}`}
          onMouseEnter={() => setHoveredConnection(connection.id)}
          onMouseLeave={() => setHoveredConnection(null)}
          onClick={(e) => handleConnectionClick(connection.id, e)}
          style={{ cursor: "pointer", pointerEvents: "stroke" }}
        >
          {/* Invisible wider path for easier hover/click */}
          <path
            d={pathD}
            fill="none"
            stroke="transparent"
            strokeWidth="20"
            style={{ pointerEvents: "stroke" }}
          />
          {/* Glow effect */}
          <path
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth={isHovered ? 10 : 6}
            strokeOpacity={isHovered ? 0.3 : 0.15}
            strokeLinecap="round"
            style={{ transition: "all 0.2s ease", pointerEvents: "none" }}
          />
          {/* Main line */}
          <path
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth={isHovered ? 3 : 2}
            strokeOpacity={isHovered ? 1 : 0.6}
            strokeLinecap="round"
            style={{ transition: "all 0.2s ease", pointerEvents: "none" }}
          />
          {/* Connection type indicators at ends */}
          <circle
            cx={sx}
            cy={sy}
            r={isHovered ? 6 : 4}
            fill={color}
            opacity={isHovered ? 1 : 0.8}
          >
            {!isHovered && (
              <animate
                attributeName="r"
                values="4;5;4"
                dur="2s"
                repeatCount="indefinite"
              />
            )}
          </circle>
          <circle
            cx={tx}
            cy={ty}
            r={isHovered ? 6 : 4}
            fill={color}
            opacity={isHovered ? 1 : 0.8}
          >
            {!isHovered && (
              <animate
                attributeName="r"
                values="4;5;4"
                dur="2s"
                repeatCount="indefinite"
                begin="1s"
              />
            )}
          </circle>
          {/* Arrow head at target */}
          <polygon
            points={`${tx - 8} ${ty - 5}, ${tx} ${ty}, ${tx - 8} ${ty + 5}`}
            fill={color}
            opacity={isHovered ? 1 : 0.7}
            style={{ transition: "opacity 0.2s ease" }}
          />
          {/* Animated flow dots */}
          <circle r={isHovered ? 5 : 4} fill={color} opacity={0.9}>
            <animateMotion
              dur={isHovered ? "2s" : "3s"}
              repeatCount="indefinite"
              path={pathD}
            />
          </circle>
          {/* Label on hover */}
          {isHovered && (
            <g className="connection-label">
              <rect
                x={midX - 45}
                y={midY - 12}
                width="90"
                height="24"
                rx="4"
                fill="rgba(15, 15, 22, 0.95)"
                stroke={color}
                strokeWidth="1"
              />
              <text
                x={midX}
                y={midY + 4}
                textAnchor="middle"
                fill="#fff"
                fontSize="11"
                fontWeight="500"
              >
                {connectionLabels[connection.type] || connection.type}
              </text>
            </g>
          )}
        </g>
      );
    },
    [nodes, hoveredConnection, handleConnectionClick]
  );

  // Render pending connection line (during creation)
  const renderPendingConnection = useCallback(() => {
    if (!isCreatingConnection || !connectionStart || !pendingConnectionEnd)
      return null;

    const sourceNode = nodes.find((n) => n.id === connectionStart);
    if (!sourceNode) return null;

    // Node dimensions (match layoutEngine)
    const nodeWidth = 260;
    const nodeHeight = 90;
    const sx = sourceNode.x + nodeWidth;
    const sy = sourceNode.y + nodeHeight / 2;
    const tx = pendingConnectionEnd.x;
    const ty = pendingConnectionEnd.y;

    const dx = tx - sx;
    const curvature = Math.min(Math.abs(dx) * 0.5, 100);
    const cx1 = sx + curvature;
    const cy1 = sy;
    const cx2 = tx - curvature;
    const cy2 = ty;

    return (
      <g className="pending-connection">
        <path
          d={`M ${sx} ${sy} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${tx} ${ty}`}
          fill="none"
          stroke="#df3e53"
          strokeWidth="2"
          strokeDasharray="8 4"
          strokeOpacity="0.8"
        />
        <circle cx={sx} cy={sy} r="6" fill="#df3e53" opacity="0.9" />
        <circle cx={tx} cy={ty} r="8" fill="#df3e53" opacity="0.5">
          <animate
            attributeName="r"
            values="8;12;8"
            dur="0.8s"
            repeatCount="indefinite"
          />
        </circle>
      </g>
    );
  }, [isCreatingConnection, connectionStart, pendingConnectionEnd, nodes]);

  // Render tree-style connection lines (circuit board aesthetic)
  const renderTreeConnectionLines = useCallback(() => {
    const isChildView = !!(currentViewNodeId || parentNodeId);
    if (!isChildView || !useTreeLayout || nodes.length < 2) return null;

    // Build a map of nodes for quick lookup
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));

    // Node dimensions (match layoutEngine)
    const nodeWidth = 260;
    const nodeHeight = 90;

    // Collect all parent-child connections to render
    const connections: Array<{
      parentNode: NodeData;
      childNode: NodeData;
      id: string;
    }> = [];

    nodes.forEach((node) => {
      if (node.parentId) {
        const parent = nodeMap.get(node.parentId);
        if (parent) {
          connections.push({
            parentNode: parent,
            childNode: node,
            id: `tree-${parent.id}-${node.id}`,
          });
        }
      }
    });

    if (connections.length === 0) return null;

    return (
      <g className="tree-connections">
        {connections.map(({ parentNode, childNode, id }) => {
          // Parent connection point (right edge, middle)
          const parentX = parentNode.x + nodeWidth;
          const parentY = parentNode.y + nodeHeight / 2;

          // Child connection point (left edge, middle)
          const childX = childNode.x;
          const childY = childNode.y + nodeHeight / 2;

          // Calculate circuit-board style path with 90-degree angles
          const midX = parentX + (childX - parentX) / 2;

          // Circuit trace path: horizontal -> vertical -> horizontal
          const pathD = `M ${parentX} ${parentY} 
                         H ${midX} 
                         V ${childY} 
                         H ${childX}`;

          // Determine color based on node type
          const isFolder = nodes.some((n) => n.parentId === childNode.id);
          const lineColor = isFolder ? "#5865f2" : "rgba(255, 255, 255, 0.25)";
          const glowColor = isFolder
            ? "rgba(88, 101, 242, 0.15)"
            : "rgba(255, 255, 255, 0.05)";

          return (
            <g key={id}>
              {/* Glow/shadow effect for depth */}
              <path
                d={pathD}
                fill="none"
                stroke={glowColor}
                strokeWidth="6"
                strokeLinecap="square"
                strokeLinejoin="miter"
              />
              {/* Main circuit trace */}
              <path
                d={pathD}
                fill="none"
                stroke={lineColor}
                strokeWidth="2"
                strokeLinecap="square"
                strokeLinejoin="miter"
                style={{
                  filter: isFolder
                    ? "drop-shadow(0 0 3px rgba(88, 101, 242, 0.4))"
                    : "none",
                }}
              />
              {/* Connection node dots */}
              <circle
                cx={midX}
                cy={childY}
                r="3"
                fill={lineColor}
                opacity="0.6"
              />
            </g>
          );
        })}
        {/* Connection dots at node edges */}
        {nodes.map((node) => {
          const hasChildren = nodes.some((n) => n.parentId === node.id);
          const hasParent = node.parentId && nodeMap.has(node.parentId);

          return (
            <g key={`dots-${node.id}`}>
              {/* Right dot (if has children) */}
              {hasChildren && (
                <circle
                  cx={node.x + nodeWidth}
                  cy={node.y + nodeHeight / 2}
                  r="4"
                  fill="#5865f2"
                  opacity="0.8"
                  style={{
                    filter: "drop-shadow(0 0 4px rgba(88, 101, 242, 0.6))",
                  }}
                />
              )}
              {/* Left dot (if has parent) */}
              {hasParent && (
                <circle
                  cx={node.x}
                  cy={node.y + nodeHeight / 2}
                  r="3"
                  fill="rgba(255, 255, 255, 0.4)"
                  opacity="0.8"
                />
              )}
            </g>
          );
        })}
      </g>
    );
  }, [nodes, currentViewNodeId, parentNodeId, useTreeLayout]);

  return (
    <div className="canvas-view-page">
      {/* Fixed Background Glow Orbs - Don't move with pan */}
      <div className="canvas-glow-orb canvas-glow-orb-1" />
      <div className="canvas-glow-orb canvas-glow-orb-2" />

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
        <aside className="canvas-sidebar">
          <button
            className="sidebar-btn"
            title="Center View"
            onClick={handleResetView}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
            </svg>
          </button>
          <button
            className="sidebar-btn"
            title="Zoom In"
            onClick={handleZoomIn}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3M11 8v6m-3-3h6" />
            </svg>
          </button>
          <button
            className="sidebar-btn"
            title="Zoom Out"
            onClick={handleZoomOut}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3M8 11h6" />
            </svg>
          </button>
          <button
            className="sidebar-btn"
            title="Zoom to Fit"
            onClick={handleResetView}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
            </svg>
          </button>

          {/* Auto-Layout Button */}
          <button
            className="sidebar-btn"
            title="Auto-Layout (Re-arrange nodes)"
            onClick={handleReLayout}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <path d="M10 6.5h4M10 17.5h4M6.5 10v4M17.5 10v4" />
            </svg>
          </button>

          <div className="sidebar-divider"></div>

          {/* Drawing Mode Button */}
          <button
            className={`sidebar-btn ${isDrawingMode ? "active" : ""}`}
            title={isDrawingMode ? "Exit Drawing Mode" : "Drawing Mode"}
            onClick={() => setIsDrawingMode(!isDrawingMode)}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m12 19 7-7 3 3-7 7-3-3z" />
              <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
              <path d="m2 2 7.586 7.586" />
              <circle cx="11" cy="11" r="2" />
            </svg>
          </button>

          {/* Clear Drawings Button (only show when there are drawings) */}
          {drawingPaths.length > 0 && (
            <button
              className="sidebar-btn"
              title="Clear Drawings"
              onClick={() => setDrawingPaths([])}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </button>
          )}

          <div className="sidebar-divider"></div>

          {/* Copilot AI Button - Combined AI Assistant */}
          <button
            className={`sidebar-btn ${showCopilot ? "active" : ""}`}
            title="Copilot AI Assistant"
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

          <div className="zoom-indicator">
            {Math.round(transform.scale * 100)}%
          </div>
        </aside>

        {/* Copilot Chat Panel */}
        <CopilotChat
          projectId={projectId || ""}
          isOpen={showCopilot}
          onClose={() => setShowCopilot(false)}
          onAction={(action, data) => {
            if (action === "add-nodes" && Array.isArray(data)) {
              // Add suggested nodes to canvas
              data.forEach((nodeData: any, idx: number) => {
                const newNode: NodeData = {
                  id: `suggested-${Date.now()}-${idx}`,
                  label: nodeData.name || "New Node",
                  type: nodeData.type || "server",
                  serverType: nodeData.serverType || "backend",
                  status: "stopped",
                  x: 200 + idx * 300,
                  y: 200,
                };
                setNodes((prev) => [...prev, newNode]);
              });
            }
            if (action === "open-questionnaire" && data?.content) {
              // Open questionnaire from Copilot
              setShowQuestionnaire(true);
            }
          }}
        />

        {/* Questionnaire Panel */}
        {questionnaireData && (
          <Questionnaire
            questionnaireId={questionnaireData.id}
            projectId={projectId || ""}
            questions={questionnaireData.questions}
            isOpen={showQuestionnaire}
            questionnaires={questionnairesAvailable}
            selectedQuestionnaireId={selectedQuestionnaireId}
            onQuestionnaireChange={(newId) => {
              const selected = questionnairesAvailable.find(
                (q) => q.id === newId
              );
              if (selected) {
                setSelectedQuestionnaireId(newId);
                setQuestionnaireData({
                  id: selected.data.id,
                  questions: selected.data.questions,
                });
              }
            }}
            onComplete={(answers) => {
              console.log("Questionnaire answers:", answers);
              setShowQuestionnaire(false);
              setQuestionnaireData(null);
            }}
            onClose={() => setShowQuestionnaire(false)}
          />
        )}

        {/* Port Management Modal */}
        <PortManagement
          projectId={projectId}
          isOpen={showPortManagement}
          onClose={() => setShowPortManagement(false)}
        />

        {/* Main Canvas Area - Shows different content based on active tab */}
        <div
          className={`canvas-main ${activePanel ? "panel-open" : ""} ${activityCollapsed ? "activity-collapsed" : ""}`}
        >
          {/* Tab Content Rendering */}
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

          {/* Architecture Tab (Canvas) - Only show when architecture is active */}
          {activeTab === "architecture" && (
            <>
              {/* Top Toolbar */}
              <div className="canvas-toolbar">
                <div className="toolbar-left">
                  {/* Breadcrumb navigation */}
                  <div className="breadcrumb-nav">
                    <button
                      className="breadcrumb-item"
                      onClick={() => {
                        // Reset to root view
                        setCurrentViewNodeId(null);
                        setViewHistory([]);
                        const newTransform = { x: 0, y: 0, scale: 1 };
                        transformRef.current = newTransform;
                        setTransform(newTransform);
                      }}
                    >
                      {projectName}
                    </button>
                    {(currentViewNodeId || parentNodeId) && (
                      <>
                        <span className="breadcrumb-separator">›</span>
                        <span className="breadcrumb-item current">
                          {nodes.find(
                            (n) => n.id === (currentViewNodeId || parentNodeId)
                          )?.label ||
                            currentViewNodeId ||
                            parentNodeId}
                        </span>
                      </>
                    )}
                  </div>
                  <span className="node-count">{nodes.length} nodes</span>
                  <span className="connection-count">
                    {connections.length} connections
                  </span>
                  {/* User presence indicator */}
                  <PresenceIndicator projectId={projectId || ""} />
                </div>
                <div className="toolbar-right">
                  {/* Notification Bell */}
                  <NotificationBell activities={activities} />

                  {/* Layout toggle - only in child view */}
                  {(currentViewNodeId || parentNodeId) && (
                    <button
                      className={`toolbar-btn layout-btn ${useTreeLayout ? "active" : ""}`}
                      onClick={() => setUseTreeLayout(!useTreeLayout)}
                      title={
                        useTreeLayout
                          ? "Switch to Radial Layout"
                          : "Switch to Tree Layout"
                      }
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {useTreeLayout ? (
                          <>
                            {/* Tree icon */}
                            <path d="M12 3v6" />
                            <path d="M12 9L6 15" />
                            <path d="M12 9l6 6" />
                            <circle cx="12" cy="3" r="2" />
                            <circle cx="6" cy="17" r="2" />
                            <circle cx="18" cy="17" r="2" />
                          </>
                        ) : (
                          <>
                            {/* Radial icon */}
                            <circle cx="12" cy="12" r="3" />
                            <circle cx="12" cy="4" r="2" />
                            <circle cx="18" cy="8" r="2" />
                            <circle cx="18" cy="16" r="2" />
                            <circle cx="12" cy="20" r="2" />
                            <circle cx="6" cy="16" r="2" />
                            <circle cx="6" cy="8" r="2" />
                          </>
                        )}
                      </svg>
                      {useTreeLayout ? "Tree" : "Radial"}
                    </button>
                  )}
                  {(currentViewNodeId || viewHistory.length > 0) && (
                    <button
                      className="toolbar-btn back-btn"
                      onClick={handleGoBack}
                      title="Back to Previous View"
                    >
                      <span>←</span> Back
                    </button>
                  )}
                  <button
                    className="toolbar-btn sync-btn"
                    onClick={handleSync}
                    title="Sync"
                  >
                    <span>⟳</span> Sync
                  </button>
                  {/* Node creation removed - only AI/system can create nodes */}
                </div>
              </div>

              {/* Canvas Container */}
              <div
                ref={canvasRef}
                className={`canvas-container ${isTransitioning ? "canvas-view-transitioning" : ""} ${isDrawingMode ? "drawing-mode" : ""}`}
                onMouseDown={isDrawingMode ? undefined : handleCanvasPanStart}
                onMouseMove={isDrawingMode ? undefined : handleCanvasMouseMove}
                onMouseUp={isDrawingMode ? undefined : handleCanvasMouseUp}
                onMouseLeave={isDrawingMode ? undefined : handleCanvasMouseUp}
                onWheel={handleWheel}
                onContextMenu={handleCanvasContextMenu}
                style={{
                  cursor: isDrawingMode
                    ? "crosshair"
                    : isPanningRef.current
                      ? "grabbing"
                      : "grab",
                }}
              >
                {/* Parallax background - moves at 30% rate of pan */}
                <div
                  className="canvas-parallax-bg"
                  style={{
                    transform: `translate(${transform.x * 0.3}px, ${transform.y * 0.3}px)`,
                  }}
                />
                {/* Fixed grid that doesn't pan - stays in place */}
                <div className="canvas-fixed-grid" />
                <div className="canvas-fixed-dots" />

                {/* SVG background - now moves with content */}
                <svg
                  className="canvas-background"
                  width="100%"
                  height="100%"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    pointerEvents: "none",
                    opacity: 0.5 /* Reduced since we have fixed grid */,
                  }}
                >
                  <defs>
                    <pattern
                      id="grid"
                      width="40"
                      height="40"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 40 0 L 0 0 0 40"
                        fill="none"
                        stroke="rgba(255,255,255,0.02)"
                        strokeWidth="0.5"
                      />
                    </pattern>
                    <pattern
                      id="dots"
                      width="40"
                      height="40"
                      patternUnits="userSpaceOnUse"
                    >
                      <circle
                        cx="20"
                        cy="20"
                        r="1"
                        fill="rgba(255,255,255,0.05)"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  <rect width="100%" height="100%" fill="url(#dots)" />
                </svg>

                {/* Drawing Mode Overlay */}
                {isDrawingMode && (
                  <svg
                    className="drawing-canvas"
                    width="100%"
                    height="100%"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      zIndex: 1000,
                      cursor: "crosshair",
                    }}
                    onMouseDown={(e) => {
                      if (!isDrawingMode) return;
                      isDrawingRef.current = true;
                      const rect = e.currentTarget.getBoundingClientRect();
                      const point = {
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top,
                      };
                      currentPathRef.current = [point];
                    }}
                    onMouseMove={(e) => {
                      if (!isDrawingRef.current) return;
                      const rect = e.currentTarget.getBoundingClientRect();
                      const point = {
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top,
                      };
                      currentPathRef.current.push(point);
                      // Force re-render for live drawing
                      setDrawingPaths((prev) => [...prev]);
                    }}
                    onMouseUp={() => {
                      if (
                        isDrawingRef.current &&
                        currentPathRef.current.length > 1
                      ) {
                        setDrawingPaths((prev) => [
                          ...prev,
                          {
                            id: `path-${Date.now()}`,
                            points: [...currentPathRef.current],
                            color: "#5865f2",
                          },
                        ]);
                      }
                      isDrawingRef.current = false;
                      currentPathRef.current = [];
                    }}
                    onMouseLeave={() => {
                      if (
                        isDrawingRef.current &&
                        currentPathRef.current.length > 1
                      ) {
                        setDrawingPaths((prev) => [
                          ...prev,
                          {
                            id: `path-${Date.now()}`,
                            points: [...currentPathRef.current],
                            color: "#5865f2",
                          },
                        ]);
                      }
                      isDrawingRef.current = false;
                      currentPathRef.current = [];
                    }}
                  >
                    {/* Existing drawings */}
                    {drawingPaths.map((path) => (
                      <path
                        key={path.id}
                        d={path.points
                          .map((p, i) =>
                            i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`
                          )
                          .join(" ")}
                        fill="none"
                        stroke={path.color}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{
                          filter:
                            "drop-shadow(0 0 4px rgba(88, 101, 242, 0.5))",
                        }}
                      />
                    ))}
                    {/* Current drawing path */}
                    {isDrawingRef.current &&
                      currentPathRef.current.length > 1 && (
                        <path
                          d={currentPathRef.current
                            .map((p, i) =>
                              i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`
                            )
                            .join(" ")}
                          fill="none"
                          stroke="#5865f2"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{
                            filter:
                              "drop-shadow(0 0 4px rgba(88, 101, 242, 0.5))",
                          }}
                        />
                      )}
                  </svg>
                )}

                {/* Persistent drawings layer (visible when not in drawing mode) */}
                {!isDrawingMode && drawingPaths.length > 0 && (
                  <svg
                    className="drawing-display"
                    width="100%"
                    height="100%"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      pointerEvents: "none",
                      zIndex: 5,
                    }}
                  >
                    {drawingPaths.map((path) => (
                      <path
                        key={path.id}
                        d={path.points
                          .map((p, i) =>
                            i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`
                          )
                          .join(" ")}
                        fill="none"
                        stroke={path.color}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0.6"
                        style={{
                          filter:
                            "drop-shadow(0 0 4px rgba(88, 101, 242, 0.3))",
                        }}
                      />
                    ))}
                  </svg>
                )}

                {/* Transform layer for pan/zoom */}
                <div
                  className="canvas-transform-layer"
                  style={{
                    transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                    transformOrigin: "0 0",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                  }}
                >
                  {/* SVG for connection lines */}
                  <svg
                    className="canvas-connections"
                    width="5000"
                    height="5000"
                    style={{
                      position: "absolute",
                      top: -2500,
                      left: -2500,
                      pointerEvents: "none",
                      overflow: "visible",
                    }}
                  >
                    <defs>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    {/* Offset connections to match coordinate system */}
                    <g transform="translate(2500, 2500)">
                      {connections.map(renderConnectionLine)}
                      {/* Pending connection while creating */}
                      {renderPendingConnection()}
                      {/* Tree layout connections */}
                      {renderTreeConnectionLines()}
                    </g>
                  </svg>

                  {/* Collaborative Cursors */}
                  <CollaborativeCursors
                    projectId={projectId || ""}
                    transform={transform}
                    canvasRef={canvasRef as React.RefObject<HTMLElement>}
                    enabled={true}
                  />

                  {/* Nodes Container */}
                  <div className="nodes-container">
                    {nodes.map((node) => {
                      const isFocused = focusedNodeId === node.id;
                      const isFadingOut = fadingOutNodes.has(node.id);
                      const isFadingIn =
                        !node.isViewParent &&
                        currentViewNodeId &&
                        !fadingInNodes.has(node.id) &&
                        isTransitioning;
                      const hasAppeared = fadingInNodes.has(node.id);

                      const nodeClasses = [
                        "node-wrapper",
                        isFocused ? "focused" : "",
                        node.isViewParent ? "view-parent" : "",
                        isFadingOut ? "fading-out" : "",
                        isFadingIn ? "hidden-for-fade" : "",
                        hasAppeared ? "fade-in" : "",
                      ]
                        .filter(Boolean)
                        .join(" ");

                      return (
                        <div
                          key={node.id}
                          data-node-id={node.id}
                          className={nodeClasses}
                          style={{
                            position: "absolute",
                            left: `${node.x}px`,
                            top: `${node.y}px`,
                            cursor: "pointer",
                            zIndex: isFocused
                              ? 100
                              : node.isViewParent
                                ? 50
                                : 10,
                          }}
                        >
                          <ServiceNode
                            node={node}
                            onMouseDown={(id, e) =>
                              handleNodeMouseDown(id, e as React.MouseEvent)
                            }
                            onDoubleClick={(id) => {
                              const clickedNode = nodes.find(
                                (n) => n.id === id
                              );
                              if (!clickedNode) return;

                              // If this is the view parent node, go back
                              if (clickedNode.isViewParent) {
                                handleGoBack();
                                return;
                              }

                              // Planning node - show file explorer with docs
                              if (
                                clickedNode.type === "planning" ||
                                (clickedNode.type === "utility" &&
                                  clickedNode.utilityType === "planning")
                              ) {
                                const nodeData: SelectedNodeForPanel = {
                                  id: clickedNode.id,
                                  name: clickedNode.label,
                                  label: clickedNode.label,
                                  description: clickedNode.description,
                                  type: clickedNode.type,
                                  status: clickedNode.status,
                                  position: {
                                    x: clickedNode.x,
                                    y: clickedNode.y,
                                  },
                                  projectId: projectId || "",
                                  createdAt: new Date(),
                                  updatedAt: new Date(),
                                };
                                setSelectedNode(nodeData);
                                setActivePanel("file-explorer");
                                return;
                              }

                              // Server nodes - enter their workspace
                              if (clickedNode.type === "server") {
                                handleEnterWorkspace(id);
                                return;
                              }

                              // Generated code nodes - show file explorer
                              const codeNodeTypes = [
                                "backend",
                                "frontend",
                                "database",
                                "api",
                                "discord-bot",
                              ];
                              if (codeNodeTypes.includes(clickedNode.type)) {
                                const nodeData: SelectedNodeForPanel = {
                                  id: clickedNode.id,
                                  name: clickedNode.label,
                                  label: clickedNode.label,
                                  description: clickedNode.description,
                                  type: clickedNode.type,
                                  status: clickedNode.status,
                                  position: {
                                    x: clickedNode.x,
                                    y: clickedNode.y,
                                  },
                                  projectId: projectId || "",
                                  createdAt: new Date(),
                                  updatedAt: new Date(),
                                };
                                setSelectedNode(nodeData);
                                setActivePanel("file-explorer");
                                return;
                              }

                              // Utility nodes with children - enter their workspace
                              if (clickedNode.type === "utility") {
                                const children = getChildNodes(id);
                                if (children.length > 0) {
                                  handleEnterWorkspace(id);
                                  return;
                                }
                              }

                              // File nodes - open in editor panel
                              const nodeData: SelectedNodeForPanel = {
                                id: clickedNode.id,
                                name: clickedNode.label,
                                label: clickedNode.label,
                                description: clickedNode.description,
                                type: clickedNode.type,
                                status: clickedNode.status,
                                position: {
                                  x: clickedNode.x,
                                  y: clickedNode.y,
                                },
                                projectId: projectId || "",
                                createdAt: new Date(),
                                updatedAt: new Date(),
                              };
                              setSelectedNode(nodeData);
                              setActivePanel("node-editor");
                            }}
                            onContextMenu={handleNodeContextMenu}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Floating Deploy Button */}
              <button
                className="floating-deploy-btn"
                onClick={() => {
                  if (!projectId) {
                    return;
                  }
                  // Show confirmation modal instead of browser confirm()
                  setShowDeployConfirmation(true);
                }}
                title="Deploy Project"
                disabled={deployment.isDeploying}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                  <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                  <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                  <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                </svg>
                <span>
                  {deployment.isDeploying ? "Deploying..." : "Deploy Project"}
                </span>
              </button>
            </>
          )}
        </div>

        {/* Side Panel (slides in from right) */}
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

      {/* Deploy Modal */}
      {showDeployModal && deployNode && (
        <DeployModal
          isOpen={showDeployModal}
          projectId={projectId || "default"}
          node={{
            id: deployNode.id,
            label: deployNode.label,
            type: deployNode.type,
            isDeployed: deployNode.isDeployed,
            deployUrl: deployNode.deployUrl,
          }}
          onClose={() => {
            setShowDeployModal(false);
            setDeployNode(null);
          }}
          onDeployComplete={(result) => {
            handleDeployComplete(deployNode.id, result.success);
          }}
        />
      )}

      {/* AI Questionnaire Panel */}
      <AIQuestionnaire
        projectId={projectId || "default"}
        projectName={projectName}
        isOpen={showAIQuestionnaire}
        onClose={() => setShowAIQuestionnaire(false)}
        onComplete={async (result) => {
          console.log("AI Analysis complete:", result);

          // Generate planning documents instead of feature nodes
          if (result.projectPlan && projectId) {
            try {
              console.log("🚀 Generating planning documents...");

              // Import aiAPI for the planning call
              const { aiAPI } = await import("../services/api");

              // Call the new planning generation endpoint
              const planningResult = await aiAPI.generatePlanning(
                projectId,
                result.projectPlan,
                result.questionsAndAnswers || [],
                result.analysis
              );

              console.log("✅ Planning documents generated:", planningResult);

              // Refresh nodes to show the new planning node
              if (projectId) {
                try {
                  const nodesResponse = await nodesAPI.list(projectId);
                  const nodesData = nodesResponse?.data || nodesResponse || [];
                  if (Array.isArray(nodesData)) {
                    const mappedNodes = nodesData.map((n: any) => ({
                      id: n.id,
                      label: n.name || n.label,
                      type: n.type || "server",
                      x: n.position?.x || n.position_x || 0,
                      y: n.position?.y || n.position_y || 0,
                      parentId: n.parent_id,
                      status: n.status || "stopped",
                      description: n.description,
                    }));
                    setNodes(mappedNodes);
                    console.log(
                      "📦 Loaded",
                      mappedNodes.length,
                      "nodes after planning generation"
                    );
                  }
                } catch (err) {
                  console.error("Failed to refresh nodes:", err);
                }
              }
            } catch (error) {
              console.error("❌ Failed to generate planning documents:", error);
              // Fallback: Create basic feature nodes if planning generation fails
              if (result.projectPlan?.features) {
                result.projectPlan.features.forEach(
                  (feature: string, index: number) => {
                    const newNode: NodeData = {
                      id: `ai-${Date.now()}-${index}`,
                      label: feature,
                      type: "utility",
                      description: `Feature: ${feature}`,
                      x: 200 + index * 250,
                      y: 200,
                    };
                    setNodes((prev) => [...prev, newNode]);
                  }
                );
              }
            }
          }
          setShowAIQuestionnaire(false);
        }}
      />

      {/* Context Menu */}
      {contextMenu.show && (
        <ContextMenu
          position={contextMenu.position}
          items={getContextMenuItems()}
          onClose={closeContextMenu}
        />
      )}

      {/* Deploy Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeployConfirmation}
        title="Deploy Project"
        message="This will start the full deployment pipeline for your project."
        details={[
          "✓ Validate project structure",
          "✓ Check planning documents",
          "✓ Generate code from plans",
          "✓ Create Docker configuration",
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
        onClose={() => {
          deployment.closeProgress();
          // Refresh nodes after deployment
          if (projectId) {
            nodesAPI
              .list(projectId)
              .then((response) => {
                const nodesData = response?.data || response || [];
                if (Array.isArray(nodesData)) {
                  const mappedNodes = nodesData.map((n: any) => ({
                    id: n.id,
                    label: n.name || n.label,
                    type: n.type || "server",
                    x: n.position?.x || n.position_x || 0,
                    y: n.position?.y || n.position_y || 0,
                    parentId: n.parent_id,
                    status: n.status || "stopped",
                    description: n.description,
                  }));
                  setNodes(mappedNodes);
                }
              })
              .catch(console.error);
          }
        }}
        onRetry={() => {
          if (projectId) {
            deployment.retryFromFailed(projectId);
          }
        }}
        onCancel={deployment.cancelDeployment}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteConfirmation.show}
        title={
          deleteConfirmation.type === "connection"
            ? "Delete Connection"
            : "Delete Node"
        }
        message={
          deleteConfirmation.type === "connection"
            ? "Are you sure you want to delete this connection?"
            : `Are you sure you want to delete "${deleteConfirmation.name}"?`
        }
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        icon="🗑️"
        onConfirm={handleDeleteConfirm}
        onCancel={() =>
          setDeleteConfirmation({ show: false, type: "connection", id: "" })
        }
      />
    </div>
  );
};

// Helper function to format time ago
function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default CanvasView;
