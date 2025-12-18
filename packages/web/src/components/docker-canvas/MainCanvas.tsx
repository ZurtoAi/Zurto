/**
 * Main Canvas
 *
 * Level 0 canvas showing Docker services for a project
 * Integrates with docker-routes API for real-time status
 */

import React, { useState, useEffect, useCallback, useMemo } from "react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  NodeTypes,
  Connection,
  addEdge,
} from "reactflow";
import "reactflow/dist/style.css";

import {
  DockerServiceNode,
  DockerServiceNodeData,
  ServiceType,
  ServiceStatus,
} from "./DockerServiceNode";
import { useCanvas } from "../../context/CanvasContext";
import { CanvasNavigator } from "./CanvasNavigator";
import "./MainCanvas.css";

// ============================================
// CONSTANTS
// ============================================

// Service folder types that are runnable (have Docker services)
// Matches STANDARD_FOLDERS from deploy-agent.ts
const RUNNABLE_SERVICE_TYPES: ServiceType[] = [
  "frontend", // web/
  "backend", // api/
  "worker", // bot/, worker/
  "database", // database/
  "cache",
  "gateway",
];

// Filter function to only show runnable services
function isRunnableService(service: {
  type: ServiceType;
  name: string;
}): boolean {
  // Check if type is runnable
  if (RUNNABLE_SERVICE_TYPES.includes(service.type)) {
    return true;
  }
  // Also filter out docs folder explicitly by name
  if (
    service.name.toLowerCase().includes("docs") ||
    service.name.toLowerCase().includes("documentation")
  ) {
    return false;
  }
  return service.type !== "other"; // Show most types except explicitly non-runnable
}

// ============================================
// TYPES
// ============================================

interface DockerService {
  id: string;
  name: string;
  displayName: string;
  projectId: string;
  type: ServiceType;
  status: ServiceStatus;
  port?: number;
  containerId?: string;
  image?: string;
  stats?: {
    cpuPercent: number;
    memoryUsage: number;
    memoryLimit: number;
    memoryPercent: number;
  };
}

interface MainCanvasProps {
  projectId: string;
}

// ============================================
// NODE TYPES REGISTRATION
// ============================================

const nodeTypes: NodeTypes = {
  dockerService: DockerServiceNode,
};

// ============================================
// LAYOUT HELPER
// ============================================

function calculateLayout(
  services: DockerService[]
): Node<DockerServiceNodeData>[] {
  const GRID_SPACING_X = 320;
  const GRID_SPACING_Y = 280;
  const COLS = 3;
  const OFFSET_X = 50;
  const OFFSET_Y = 50;

  return services.map((service, index) => {
    const col = index % COLS;
    const row = Math.floor(index / COLS);

    return {
      id: service.id,
      type: "dockerService",
      position: {
        x: OFFSET_X + col * GRID_SPACING_X,
        y: OFFSET_Y + row * GRID_SPACING_Y,
      },
      data: {
        id: service.id,
        name: service.name,
        displayName: service.displayName,
        type: service.type,
        status: service.status,
        port: service.port,
        containerId: service.containerId,
        image: service.image,
        stats: service.stats,
      },
    };
  });
}

function createEdges(services: DockerService[]): Edge[] {
  const edges: Edge[] = [];

  // Create logical connections based on service types
  const frontends = services.filter((s) => s.type === "frontend");
  const backends = services.filter((s) => s.type === "backend");
  const databases = services.filter((s) => s.type === "database");
  const caches = services.filter((s) => s.type === "cache");
  const gateways = services.filter((s) => s.type === "gateway");

  // Gateway → Frontend
  for (const gateway of gateways) {
    for (const frontend of frontends) {
      edges.push({
        id: `${gateway.id}-${frontend.id}`,
        source: gateway.id,
        target: frontend.id,
        animated: true,
        style: { stroke: "#4fd1c5" },
      });
    }
  }

  // Frontend → Backend
  for (const frontend of frontends) {
    for (const backend of backends) {
      edges.push({
        id: `${frontend.id}-${backend.id}`,
        source: frontend.id,
        target: backend.id,
        animated: true,
        style: { stroke: "#61dafb" },
      });
    }
  }

  // Backend → Database
  for (const backend of backends) {
    for (const database of databases) {
      edges.push({
        id: `${backend.id}-${database.id}`,
        source: backend.id,
        target: database.id,
        animated: true,
        style: { stroke: "#68d391" },
      });
    }
  }

  // Backend → Cache
  for (const backend of backends) {
    for (const cache of caches) {
      edges.push({
        id: `${backend.id}-${cache.id}`,
        source: backend.id,
        target: cache.id,
        animated: true,
        style: { stroke: "#f6ad55" },
      });
    }
  }

  return edges;
}

// ============================================
// COMPONENT
// ============================================

export function MainCanvas({ projectId }: MainCanvasProps) {
  const { navigateToService, toggleLogsPanel, toggleTerminalPanel } =
    useCanvas();
  const [services, setServices] = useState<DockerService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Fetch services
  const fetchServices = useCallback(async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "";
      const response = await fetch(
        `${apiUrl}/api/docker/services/${projectId}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch services: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success && data.data?.services) {
        // Filter to only show runnable services (not docs, etc.)
        const runnableServices = data.data.services.filter(isRunnableService);
        setServices(runnableServices);
        setError(null);
      } else {
        throw new Error(data.error || "Failed to fetch services");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch services");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // Initial fetch
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Auto-refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(fetchServices, 10000);
    return () => clearInterval(interval);
  }, [fetchServices]);

  // Service action handlers
  const handleStart = useCallback(
    async (serviceId: string) => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "";
        const service = services.find((s) => s.id === serviceId);

        await fetch(`${apiUrl}/api/docker/service/${service?.name}/start`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        // Refresh services
        setTimeout(fetchServices, 1000);
      } catch (err) {
        console.error("Failed to start service:", err);
      }
    },
    [services, fetchServices]
  );

  const handleStop = useCallback(
    async (serviceId: string) => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "";
        const service = services.find((s) => s.id === serviceId);

        await fetch(`${apiUrl}/api/docker/service/${service?.name}/stop`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        setTimeout(fetchServices, 1000);
      } catch (err) {
        console.error("Failed to stop service:", err);
      }
    },
    [services, fetchServices]
  );

  const handleRestart = useCallback(
    async (serviceId: string) => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "";
        const service = services.find((s) => s.id === serviceId);

        await fetch(`${apiUrl}/api/docker/service/${service?.name}/restart`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        setTimeout(fetchServices, 2000);
      } catch (err) {
        console.error("Failed to restart service:", err);
      }
    },
    [services, fetchServices]
  );

  const handleRebuild = useCallback(
    async (serviceId: string) => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "";
        const service = services.find((s) => s.id === serviceId);

        await fetch(`${apiUrl}/api/docker/service/${service?.name}/rebuild`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ noCache: true }),
        });

        setTimeout(fetchServices, 5000);
      } catch (err) {
        console.error("Failed to rebuild service:", err);
      }
    },
    [services, fetchServices]
  );

  const handleViewLogs = useCallback(
    (serviceId: string) => {
      toggleLogsPanel(serviceId);
    },
    [toggleLogsPanel]
  );

  const handleOpenTerminal = useCallback(
    (serviceId: string) => {
      toggleTerminalPanel(serviceId);
    },
    [toggleTerminalPanel]
  );

  const handleDoubleClick = useCallback(
    (serviceId: string, serviceName: string) => {
      console.log("🟢 MainCanvas: handleDoubleClick triggered", {
        serviceId,
        serviceName,
      });
      navigateToService(serviceId, serviceName);
    },
    [navigateToService]
  );

  // Update nodes when services change
  useEffect(() => {
    console.log("🔄 Updating nodes with callbacks, services:", services.length);
    const nodesWithCallbacks = calculateLayout(services).map((node) => ({
      ...node,
      data: {
        ...node.data,
        onStart: handleStart,
        onStop: handleStop,
        onRestart: handleRestart,
        onRebuild: handleRebuild,
        onViewLogs: handleViewLogs,
        onOpenTerminal: handleOpenTerminal,
        onDoubleClick: handleDoubleClick,
      },
    }));

    setNodes(nodesWithCallbacks);
    setEdges(createEdges(services));
  }, [
    services,
    handleStart,
    handleStop,
    handleRestart,
    handleRebuild,
    handleViewLogs,
    handleOpenTerminal,
    handleDoubleClick,
    setNodes,
    setEdges,
  ]);

  // Handle edge connections
  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  if (loading) {
    return (
      <div className="main-canvas loading">
        <div className="spinner" />
        <span>Loading services...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-canvas error">
        <span className="error-icon">❌</span>
        <span>{error}</span>
        <button onClick={fetchServices}>Retry</button>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="main-canvas empty">
        <span className="empty-icon">📦</span>
        <h3>No Services Found</h3>
        <p>This project has no Docker services configured yet.</p>
        <button onClick={fetchServices}>Refresh</button>
      </div>
    );
  }

  return (
    <div className="main-canvas">
      <CanvasNavigator />

      <div className="canvas-toolbar">
        <button className="toolbar-btn" onClick={fetchServices} title="Refresh">
          🔄 Refresh
        </button>
        <span className="service-count">
          {services.filter((s) => s.status === "running").length}/
          {services.length} Running
        </span>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.3}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
      >
        <Controls position="bottom-right" />
        <Background color="#313244" gap={20} />
        <MiniMap
          nodeColor={(node) => {
            const data = node.data as DockerServiceNodeData;
            return data.status === "running" ? "#48bb78" : "#718096";
          }}
          maskColor="rgba(30, 30, 46, 0.8)"
          style={{ background: "#1e1e2e" }}
        />
      </ReactFlow>
    </div>
  );
}
