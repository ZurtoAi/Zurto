/**
 * Service Canvas
 *
 * Level 1+ canvas showing file structure of a service
 * Uses folder and file nodes instead of Docker service nodes
 */

import React, { useState, useEffect, useCallback } from "react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  NodeTypes,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";

import { useCanvas } from "../../context/CanvasContext";
import { CanvasNavigator } from "./CanvasNavigator";
import "./ServiceCanvas.css";

// ============================================
// TYPES
// ============================================

interface FileNode {
  id: string;
  name: string;
  type: "folder" | "file";
  path: string;
  extension?: string;
  size?: number;
  children?: FileNode[];
}

interface NestedCanvasResponse {
  success: boolean;
  data: {
    nodeId: string;
    children: FileNode[];
    parentPath: string;
    level: number;
  };
}

interface FileNodeData {
  id: string;
  name: string;
  type: "folder" | "file";
  path: string;
  extension?: string;
  size?: number;
  onDoubleClick: (
    id: string,
    name: string,
    type: "folder" | "file",
    path: string
  ) => void;
  onSelect: (id: string, path: string) => void;
}

interface ServiceCanvasProps {
  serviceId: string;
  currentPath: string[];
}

// ============================================
// NODE COMPONENTS
// ============================================

function FolderNode({ data }: { data: FileNodeData }) {
  const handleDoubleClick = () => {
    data.onDoubleClick(data.id, data.name, "folder", data.path);
  };

  return (
    <div className="folder-node" onDoubleClick={handleDoubleClick}>
      <Handle type="target" position={Position.Top} />

      <div className="node-icon">📁</div>
      <div className="node-content">
        <span className="node-name">{data.name}</span>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

function FileNodeComponent({ data }: { data: FileNodeData }) {
  const handleClick = () => {
    data.onSelect(data.id, data.path);
  };

  const handleDoubleClick = () => {
    data.onDoubleClick(data.id, data.name, "file", data.path);
  };

  return (
    <div
      className="file-node"
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <Handle type="target" position={Position.Top} />

      <div className="node-icon">{getFileIcon(data.name, data.extension)}</div>
      <div className="node-content">
        <span className="node-name">{data.name}</span>
        {data.size && (
          <span className="node-size">{formatSize(data.size)}</span>
        )}
      </div>
    </div>
  );
}

const nodeTypes: NodeTypes = {
  folder: FolderNode,
  file: FileNodeComponent,
};

// ============================================
// HELPERS
// ============================================

function getFileIcon(name: string, extension?: string): string {
  const ext = extension || name.split(".").pop()?.toLowerCase() || "";
  const icons: Record<string, string> = {
    ts: "🔷",
    tsx: "⚛️",
    js: "📜",
    jsx: "⚛️",
    py: "🐍",
    go: "🔵",
    rs: "🦀",
    rb: "💎",
    html: "🌐",
    css: "🎨",
    scss: "💅",
    json: "📋",
    yaml: "📋",
    yml: "📋",
    md: "📝",
    txt: "📄",
    sql: "🗄️",
    csv: "📊",
    png: "🖼️",
    jpg: "🖼️",
    svg: "🎨",
    dockerfile: "🐳",
  };

  const lowerName = name.toLowerCase();
  if (lowerName === "dockerfile") return "🐳";
  if (lowerName.includes("docker-compose")) return "🐳";
  if (lowerName === "package.json") return "📦";
  if (lowerName === "tsconfig.json") return "🔷";

  return icons[ext] || "📄";
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function calculateLayout(files: FileNode[]): Node<FileNodeData>[] {
  const FOLDER_SPACING_X = 180;
  const FILE_SPACING_X = 160;
  const SPACING_Y = 100;
  const OFFSET_X = 50;
  const OFFSET_Y = 50;

  const folders = files.filter((f) => f.type === "folder");
  const fileItems = files.filter((f) => f.type === "file");

  const nodes: Node<FileNodeData>[] = [];

  // Layout folders in first row
  folders.forEach((folder, index) => {
    nodes.push({
      id: folder.id,
      type: "folder",
      position: {
        x: OFFSET_X + index * FOLDER_SPACING_X,
        y: OFFSET_Y,
      },
      data: {
        id: folder.id,
        name: folder.name,
        type: "folder",
        path: folder.path,
        onDoubleClick: () => {},
        onSelect: () => {},
      },
    });
  });

  // Layout files in subsequent rows
  const FILES_PER_ROW = 5;
  fileItems.forEach((file, index) => {
    const row = Math.floor(index / FILES_PER_ROW) + 1;
    const col = index % FILES_PER_ROW;

    nodes.push({
      id: file.id,
      type: "file",
      position: {
        x: OFFSET_X + col * FILE_SPACING_X,
        y: OFFSET_Y + row * SPACING_Y,
      },
      data: {
        id: file.id,
        name: file.name,
        type: "file",
        path: file.path,
        extension: file.extension,
        size: file.size,
        onDoubleClick: () => {},
        onSelect: () => {},
      },
    });
  });

  return nodes;
}

// ============================================
// COMPONENT
// ============================================

export function ServiceCanvas({ serviceId, currentPath }: ServiceCanvasProps) {
  const { state, navigateIntoFolder, selectFile } = useCanvas();
  const { currentServiceId, level } = state;
  const [files, setFiles] = useState<FileNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Fetch nested canvas data
  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "";
      // Use the last item in currentPath if available, otherwise serviceId
      const nodeId = currentPath.length > 0 ? currentPath.join("/") : serviceId;
      const response = await fetch(
        `${apiUrl}/api/nodes/${encodeURIComponent(nodeId)}/nested-canvas`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch files: ${response.statusText}`);
      }

      const data: NestedCanvasResponse = await response.json();

      if (data.success && data.data?.children) {
        setFiles(data.data.children);
        setError(null);
      } else {
        throw new Error("No files found");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch files");
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }, [serviceId, currentPath]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  // Navigation handlers
  const handleDoubleClick = useCallback(
    (id: string, name: string, type: "folder" | "file", path: string) => {
      if (type === "folder") {
        navigateIntoFolder(id, name);
      } else {
        // Open file in editor panel
        selectFile(id, path);
      }
    },
    [navigateIntoFolder, selectFile]
  );

  const handleSelect = useCallback(
    (id: string, path: string) => {
      selectFile(id, path);
    },
    [selectFile]
  );

  // Update nodes with callbacks
  useEffect(() => {
    const layoutNodes = calculateLayout(files);
    const nodesWithCallbacks = layoutNodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        onDoubleClick: handleDoubleClick,
        onSelect: handleSelect,
      },
    }));

    setNodes(nodesWithCallbacks);
    setEdges([]); // No edges in file view
  }, [files, handleDoubleClick, handleSelect, setNodes, setEdges]);

  if (loading) {
    return (
      <div className="service-canvas loading">
        <div className="spinner" />
        <span>Loading files...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="service-canvas error">
        <span className="error-icon">❌</span>
        <span>{error}</span>
        <button onClick={fetchFiles}>Retry</button>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="service-canvas empty">
        <span className="empty-icon">📂</span>
        <h3>Empty Folder</h3>
        <p>This folder contains no files.</p>
      </div>
    );
  }

  return (
    <div className="service-canvas">
      <CanvasNavigator />

      <div className="canvas-info">
        <span className="folder-count">
          📁 {files.filter((f) => f.type === "folder").length}
        </span>
        <span className="file-count">
          📄 {files.filter((f) => f.type === "file").length}
        </span>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.3}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      >
        <Controls position="bottom-right" />
        <Background color="#313244" gap={20} />
        <MiniMap
          nodeColor={(node) => {
            return node.type === "folder" ? "#f6ad55" : "#89b4fa";
          }}
          maskColor="rgba(30, 30, 46, 0.8)"
          style={{ background: "#1e1e2e" }}
        />
      </ReactFlow>
    </div>
  );
}
