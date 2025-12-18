import React, { useState } from "react";
import { useProjects } from "../hooks/useProjects";
import { useQuestionnaire } from "../hooks/useQuestionnaire";
import Questionnaire from "./Questionnaire";
import { AIInsightsPanel } from "./AIInsightsPanel";
import { GeneratedTasksPanel } from "./GeneratedTasksPanel";
import { SuggestionsNotification } from "./SuggestionsNotification";
import { adaptiveProjectQuestionnaire } from "../data/sampleQuestionnaires";
import api, { aiAPI } from "../services/api";
import "../styles/ProjectsList.css";

interface ProjectsListProps {
  onSelectProject: (projectId: string) => void;
  selectedProjectId: string | null;
}

export const ProjectsListWithQuestionnaire: React.FC<ProjectsListProps> = ({
  onSelectProject,
  selectedProjectId,
}) => {
  const { projects, loading, error, createProject, deleteProject } =
    useProjects();
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [newProjectId, setNewProjectId] = useState<string | null>(null);
  const [showInsights, setShowInsights] = useState(false);
  const [showTasks, setShowTasks] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const questionnaireHook = useQuestionnaire();

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    try {
      const project = await createProject(newProjectName, newProjectDesc);
      setNewProjectName("");
      setNewProjectDesc("");
      setIsCreating(false);

      // Set up questionnaire
      setNewProjectId(project.id);
      setShowQuestionnaire(true);
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

  const handleQuestionnaireComplete = async (
    answers: Record<string, unknown>
  ) => {
    if (!newProjectId) return;

    try {
      // Submit all answers
      for (const [questionId, answer] of Object.entries(answers)) {
        await questionnaireHook.submitAnswer(questionId, answer, newProjectId);
      }

      setShowQuestionnaire(false);
      questionnaireHook.resetQuestionnaire();

      // Start AI analysis after questionnaire
      await analyzeProjectQuestionnaire(newProjectId);
      onSelectProject(newProjectId);
      setNewProjectId(null);
    } catch (err) {
      console.error("Failed to submit questionnaire:", err);
    }
  };

  const analyzeProjectQuestionnaire = async (projectId: string) => {
    try {
      setIsAnalyzing(true);

      // Get analysis from AI
      const response = await aiAPI.analyzeQuestionnaire(
        projectId,
        adaptiveProjectQuestionnaire.id
      );
      const analysis = response.data || response;

      // Show insights panel with analysis results
      setShowInsights(true);

      // Add suggestion notifications
      if (analysis.suggestions && analysis.suggestions.length > 0) {
        const newSuggestions = analysis.suggestions.map(
          (s: any, idx: number) => ({
            id: `suggestion-${Date.now()}-${idx}`,
            type: s.type || "insight",
            title: s.title,
            description: s.description,
            action: s.action,
          })
        );
        setSuggestions(newSuggestions);
      }
    } catch (err) {
      console.error("Failed to analyze questionnaire:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleTasksGenerated = () => {
    // Trigger parent component to refresh canvas with new nodes
    // This will be called from GeneratedTasksPanel after tasks are generated
    setShowInsights(false);
    setShowTasks(false);

    // Add a suggestion notification about tasks being ready
    setSuggestions([
      {
        id: `suggestion-tasks-ready`,
        type: "insight",
        title: "Tasks Generated",
        description:
          "AI-generated planning tasks are ready. Check the canvas for new nodes.",
        action: "View Canvas",
      },
    ]);
  };

  const handleDismissSuggestion = (id: string) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <>
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

        {isCreating && (
          <form className="project-create-form" onSubmit={handleCreateProject}>
            <input
              type="text"
              placeholder="Project name..."
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              disabled={loading}
              autoFocus
            />
            <textarea
              placeholder="Description (optional)..."
              value={newProjectDesc}
              onChange={(e) => setNewProjectDesc(e.target.value)}
              disabled={loading}
              rows={2}
            />
            <button type="submit" disabled={loading || !newProjectName.trim()}>
              {loading ? "Creating..." : "Create"}
            </button>
          </form>
        )}

        <div className="projects-items">
          {error && <div className="error-message">{error}</div>}

          {loading && projects.length === 0 ? (
            <div className="empty-state">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="empty-state">
              No projects yet. Create one to get started!
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
                  {project.description && <p>{project.description}</p>}
                  <small>{project.status}</small>
                </div>
                <button
                  className="btn-delete"
                  onClick={(e) => handleDeleteProject(e, project.id)}
                  title="Delete project"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {showQuestionnaire && newProjectId && (
        <Questionnaire
          questionnaireId={adaptiveProjectQuestionnaire.id}
          projectId={newProjectId}
          questions={adaptiveProjectQuestionnaire.questions}
          isOpen={showQuestionnaire}
          onComplete={handleQuestionnaireComplete}
          onClose={() => {
            setShowQuestionnaire(false);
            setNewProjectId(null);
            questionnaireHook.resetQuestionnaire();
          }}
        />
      )}

      {selectedProjectId && (
        <>
          <AIInsightsPanel
            projectId={selectedProjectId}
            isOpen={showInsights}
            onClose={() => setShowInsights(false)}
          />

          <GeneratedTasksPanel
            projectId={selectedProjectId}
            onTasksGenerated={handleTasksGenerated}
          />
        </>
      )}

      <SuggestionsNotification
        suggestions={suggestions}
        onDismiss={handleDismissSuggestion}
        autoHideDelay={5000}
      />
    </>
  );
};

export default ProjectsListWithQuestionnaire;
