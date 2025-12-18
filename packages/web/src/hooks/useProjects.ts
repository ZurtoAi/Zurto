import { useState, useEffect, useCallback } from "react";
import { projectsAPI } from "../services/api";

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const response = await projectsAPI.list();
      setProjects(response.data || []);
      setError(null);
    } catch (err: any) {
      setError(err?.error || "Failed to fetch projects");
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createProject = useCallback(
    async (name: string, description?: string) => {
      try {
        setError(null);
        const response = await projectsAPI.create(name, description);
        const newProject = response.data;
        setProjects((prev) => [newProject, ...prev]);
        return newProject;
      } catch (err: any) {
        const errorMsg = err?.error || "Failed to create project";
        setError(errorMsg);
        throw err;
      }
    },
    []
  );

  const deleteProject = useCallback(async (id: string) => {
    try {
      setError(null);
      await projectsAPI.delete(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      const errorMsg = err?.error || "Failed to delete project";
      setError(errorMsg);
      throw err;
    }
  }, []);

  const updateProject = useCallback(
    async (id: string, data: Partial<Project>) => {
      try {
        setError(null);
        const response = await projectsAPI.update(id, data);
        setProjects((prev) =>
          prev.map((p) => (p.id === id ? response.data : p))
        );
        return response.data;
      } catch (err: any) {
        const errorMsg = err?.error || "Failed to update project";
        setError(errorMsg);
        throw err;
      }
    },
    []
  );

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    deleteProject,
    updateProject,
  };
};
