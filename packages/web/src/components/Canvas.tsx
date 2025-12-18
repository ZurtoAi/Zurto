import React, { useCallback, useMemo, useEffect, useState } from "react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Connection,
  addEdge,
  MiniMap,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import { useNodes as useNodesData } from "../hooks/useNodes";
import { relationshipsAPI } from "../services/api";
import "../styles/Canvas.css";

interface CanvasProps {
  projectId: string | null;
}

export const Canvas: React.FC<CanvasProps> = ({ projectId }) => {
  const { nodes: nodeData, createNode, updateNode } = useNodesData(projectId);
  const [relationships, setRelationships] = useState<any[]>([]);
  const [loadingRelationships, setLoadingRelationships] = useState(false);

  // Convert data nodes to React Flow nodes
  const initialNodes: Node[] = useMemo(
    () =>
      nodeData.map((node) => ({
        id: node.id,
        data: { label: node.name },
        position: { x: node.position_x || 0, y: node.position_y || 0 },
        type: "default",
        draggable: true,
        selectable: true,
      })),
    [nodeData]
  );

  // Convert relationships to React Flow edges
  const initialEdges: Edge[] = useMemo(
    () =>
      relationships.map((rel) => ({
        id: rel.id,
        source: rel.source_node_id,
        target: rel.target_node_id,
        label: rel.relationship_type,
        markerEnd: { type: MarkerType.ArrowClosed },
      })),
    [relationships]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Fetch relationships
  useEffect(() => {
    if (!projectId) return;

    const fetchRelationships = async () => {
      try {
        setLoadingRelationships(true);
        const response = await relationshipsAPI.list(projectId);
        setRelationships(response.data || []);
      } catch (error) {
        console.error("Error fetching relationships:", error);
      } finally {
        setLoadingRelationships(false);
      }
    };

    fetchRelationships();
  }, [projectId]);

  // Handle node position changes
  const handleNodeDragStop = useCallback(
    (event: React.MouseEvent, node: Node) => {
      if (projectId) {
        updateNode(node.id, {
          position_x: node.position.x,
          position_y: node.position.y,
        }).catch(console.error);
      }
    },
    [projectId, updateNode]
  );

  // Handle new connections
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds));

      // Save relationship to backend
      if (projectId && connection.source && connection.target) {
        relationshipsAPI
          .create(projectId, connection.source, connection.target, "dependency")
          .catch(console.error);
      }
    },
    [setEdges, projectId]
  );

  // Update nodes when initialNodes changes
  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  // Update edges when initialEdges changes
  useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  if (!projectId) {
    return (
      <div className="canvas-placeholder">
        <p>Select a project to view its canvas</p>
      </div>
    );
  }

  return (
    <div className="canvas-container">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={handleNodeDragStop}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
      {loadingRelationships && (
        <div className="canvas-loading">Loading relationships...</div>
      )}
    </div>
  );
};

export default Canvas;
