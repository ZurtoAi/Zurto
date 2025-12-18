import { useState, useEffect, useCallback } from "react";
import { nodesAPI } from "../services/api";

export interface Node {
  id: string;
  project_id: string;
  name: string;
  type: string;
  description?: string;
  status: string;
  position_x: number;
  position_y: number;
  created_at: string;
  updated_at: string;
}

export const useNodes = (projectId: string | null) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNodes = useCallback(async () => {
    if (!projectId) return;

    try {
      setLoading(true);
      const response = await nodesAPI.list(projectId);
      setNodes(response.data || []);
      setError(null);
    } catch (err: any) {
      setError(err?.error || "Failed to fetch nodes");
      console.error("Error fetching nodes:", err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const createNode = useCallback(
    async (name: string, type: string, description?: string) => {
      if (!projectId) throw new Error("No project selected");

      try {
        setError(null);
        const response = await nodesAPI.create(
          projectId,
          name,
          type,
          description
        );
        const newNode = response.data;
        setNodes((prev) => [...prev, newNode]);
        return newNode;
      } catch (err: any) {
        const errorMsg = err?.error || "Failed to create node";
        setError(errorMsg);
        throw err;
      }
    },
    [projectId]
  );

  const deleteNode = useCallback(
    async (nodeId: string) => {
      if (!projectId) throw new Error("No project selected");

      try {
        setError(null);
        await nodesAPI.delete(projectId, nodeId);
        setNodes((prev) => prev.filter((n) => n.id !== nodeId));
      } catch (err: any) {
        const errorMsg = err?.error || "Failed to delete node";
        setError(errorMsg);
        throw err;
      }
    },
    [projectId]
  );

  const updateNode = useCallback(
    async (nodeId: string, data: Partial<Node>) => {
      if (!projectId) throw new Error("No project selected");

      try {
        setError(null);
        const response = await nodesAPI.update(projectId, nodeId, data);
        setNodes((prev) =>
          prev.map((n) => (n.id === nodeId ? response.data : n))
        );
        return response.data;
      } catch (err: any) {
        const errorMsg = err?.error || "Failed to update node";
        setError(errorMsg);
        throw err;
      }
    },
    [projectId]
  );

  useEffect(() => {
    fetchNodes();
  }, [fetchNodes]);

  return {
    nodes,
    loading,
    error,
    fetchNodes,
    createNode,
    deleteNode,
    updateNode,
  };
};
