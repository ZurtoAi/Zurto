import React, { useState } from "react";
import { useProjects } from "../hooks/useProjects";
import "../styles/ProjectsList.css";

interface ProjectsListProps {
  onSelectProject: (projectId: string) => void;
  selectedProjectId: string | null;
}

export const ProjectsList: React.FC<ProjectsListProps> = ({
  onSelectProject,
  selectedProjectId,
}) => {
  const { projects, loading, error, createProject, deleteProject } =
    useProjects();
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    try {
      await createProject(newProjectName, newProjectDesc);
      setNewProjectName("");
      setNewProjectDesc("");
      setIsCreating(false);
    } catch (err) {
      console.error("Failed to create project:", err);
    }
  };

  const handleDeleteProject = async (
    e: React.MouseEvent,
    projectId: string
  ) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject(projectId);
        if (selectedProjectId === projectId) {
          onSelectProject("");
        }
      } catch (err) {
        console.error("Failed to delete project:", err);
      }
    }
  };

  return (
    <div className="projects-list">
      <div className="projects-header">
        <h2>Projects</h2>
        <button
          className="btn-create"
          onClick={() => setIsCreating(!isCreating)}
        >
          {isCreating ? "✕" : "+ New"}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {isCreating && (
        <form className="project-form" onSubmit={handleCreateProject}>
          <input
            type="text"
            placeholder="Project name"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            autoFocus
          />
          <textarea
            placeholder="Description (optional)"
            value={newProjectDesc}
            onChange={(e) => setNewProjectDesc(e.target.value)}
            rows={2}
          />
          <div className="form-buttons">
            <button type="submit" className="btn-submit">
              Create
            </button>
            <button
              type="button"
              className="btn-cancel"
              onClick={() => {
                setIsCreating(false);
                setNewProjectName("");
                setNewProjectDesc("");
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading && <div className="loading">Loading projects...</div>}

      <div className="projects-container">
        {projects.length === 0 ? (
          <div className="no-projects">
            No projects yet. Create one to start!
          </div>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className={`project-item ${
                selectedProjectId === project.id ? "active" : ""
              }`}
              onClick={() => onSelectProject(project.id)}
            >
              <div className="project-info">
                <h3>{project.name}</h3>
                {project.description && (
                  <p className="description">{project.description}</p>
                )}
                <span className="status">{project.status}</span>
              </div>
              <button
                className="btn-delete"
                onClick={(e) => handleDeleteProject(e, project.id)}
                title="Delete project"
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectsList;
