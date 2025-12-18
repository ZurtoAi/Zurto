import React, { useState } from "react";
import "../styles/ProjectWizard.css";

interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  stack: string[];
  defaultNodes: string[];
}

interface ProjectWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: (project: any) => void;
}

const templates: ProjectTemplate[] = [
  {
    id: "fullstack",
    name: "Full Stack Application",
    description: "React frontend with Node.js backend and database",
    icon: "🚀",
    stack: ["React", "Node.js", "PostgreSQL"],
    defaultNodes: ["Frontend", "API", "Database"],
  },
  {
    id: "microservices",
    name: "Microservices Architecture",
    description: "Multiple services with API gateway and message queue",
    icon: "🔧",
    stack: ["Node.js", "Docker", "Redis", "RabbitMQ"],
    defaultNodes: ["Gateway", "Auth Service", "User Service", "Message Queue"],
  },
  {
    id: "static",
    name: "Static Website",
    description: "Simple static site with CDN deployment",
    icon: "📄",
    stack: ["HTML", "CSS", "JavaScript"],
    defaultNodes: ["Static Site", "CDN"],
  },
  {
    id: "api",
    name: "REST API",
    description: "Backend API service with authentication",
    icon: "⚡",
    stack: ["Node.js", "Express", "JWT"],
    defaultNodes: ["API Server", "Auth Module", "Database"],
  },
  {
    id: "blank",
    name: "Blank Project",
    description: "Start from scratch with an empty canvas",
    icon: "✨",
    stack: [],
    defaultNodes: [],
  },
];

export const ProjectWizard: React.FC<ProjectWizardProps> = ({
  isOpen,
  onClose,
  onProjectCreated,
}) => {
  const [step, setStep] = useState(1);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [selectedTemplate, setSelectedTemplate] =
    useState<ProjectTemplate | null>(null);
  const [allocatedPort, setAllocatedPort] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTemplateSelect = (template: ProjectTemplate) => {
    setSelectedTemplate(template);
    setStep(2);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleCreate = async () => {
    if (!projectName.trim() || !selectedTemplate) {
      setError("Please fill in all required fields");
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      // 1. Allocate a port for the project
      const portResponse = await fetch("/api/ports/allocate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({
          projectId: `temp-${Date.now()}`,
          service: "main",
        }),
      });

      const portData = await portResponse.json();
      let port = 5000;

      if (portData.success) {
        port = portData.data.port;
        setAllocatedPort(port);
      }

      // 2. Create the project
      const projectResponse = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({
          name: projectName.trim(),
          description: projectDescription.trim(),
          template: selectedTemplate.id,
          port,
          stack: selectedTemplate.stack,
          nodes: selectedTemplate.defaultNodes.map((name, idx) => ({
            name,
            type: "server",
            x: 100 + (idx % 3) * 320,
            y: 100 + Math.floor(idx / 3) * 200,
          })),
        }),
      });

      const projectData = await projectResponse.json();

      if (projectData.success) {
        onProjectCreated(projectData.data);
        resetWizard();
        onClose();
      } else {
        setError(projectData.error || "Failed to create project");
      }
    } catch (err) {
      console.error("Project creation error:", err);
      setError("Network error. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const resetWizard = () => {
    setStep(1);
    setProjectName("");
    setProjectDescription("");
    setSelectedTemplate(null);
    setAllocatedPort(null);
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="wizard-overlay" onClick={onClose}>
      <div className="wizard-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="wizard-header">
          <div className="wizard-title">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            <span>Create New Project</span>
          </div>
          <button className="wizard-close" onClick={onClose}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress Steps */}
        <div className="wizard-steps">
          <div
            className={`wizard-step ${step >= 1 ? "active" : ""} ${step > 1 ? "completed" : ""}`}
          >
            <span className="step-number">1</span>
            <span className="step-label">Template</span>
          </div>
          <div className="step-connector" />
          <div
            className={`wizard-step ${step >= 2 ? "active" : ""} ${step > 2 ? "completed" : ""}`}
          >
            <span className="step-number">2</span>
            <span className="step-label">Details</span>
          </div>
          <div className="step-connector" />
          <div className={`wizard-step ${step >= 3 ? "active" : ""}`}>
            <span className="step-number">3</span>
            <span className="step-label">Review</span>
          </div>
        </div>

        {/* Content */}
        <div className="wizard-content">
          {/* Step 1: Template Selection */}
          {step === 1 && (
            <div className="template-grid">
              {templates.map((template) => (
                <button
                  key={template.id}
                  className={`template-card ${selectedTemplate?.id === template.id ? "selected" : ""}`}
                  onClick={() => handleTemplateSelect(template)}
                >
                  <span className="template-icon">{template.icon}</span>
                  <h3>{template.name}</h3>
                  <p>{template.description}</p>
                  {template.stack.length > 0 && (
                    <div className="template-stack">
                      {template.stack.map((tech) => (
                        <span key={tech} className="tech-tag">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Project Details */}
          {step === 2 && (
            <div className="details-form">
              <div className="form-group">
                <label htmlFor="projectName">Project Name *</label>
                <input
                  id="projectName"
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="My Awesome Project"
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label htmlFor="projectDescription">Description</label>
                <textarea
                  id="projectDescription"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="A brief description of your project..."
                  rows={3}
                />
              </div>
              <div className="selected-template">
                <span className="template-icon-small">
                  {selectedTemplate?.icon}
                </span>
                <div>
                  <strong>{selectedTemplate?.name}</strong>
                  <p>{selectedTemplate?.description}</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="review-summary">
              <div className="review-item">
                <span className="review-label">Project Name</span>
                <span className="review-value">{projectName}</span>
              </div>
              {projectDescription && (
                <div className="review-item">
                  <span className="review-label">Description</span>
                  <span className="review-value">{projectDescription}</span>
                </div>
              )}
              <div className="review-item">
                <span className="review-label">Template</span>
                <span className="review-value">
                  {selectedTemplate?.icon} {selectedTemplate?.name}
                </span>
              </div>
              {selectedTemplate && selectedTemplate.stack.length > 0 && (
                <div className="review-item">
                  <span className="review-label">Tech Stack</span>
                  <div className="review-stack">
                    {selectedTemplate.stack.map((tech) => (
                      <span key={tech} className="tech-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {selectedTemplate && selectedTemplate.defaultNodes.length > 0 && (
                <div className="review-item">
                  <span className="review-label">Initial Nodes</span>
                  <div className="review-nodes">
                    {selectedTemplate.defaultNodes.map((node) => (
                      <span key={node} className="node-tag">
                        {node}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {allocatedPort && (
                <div className="review-item">
                  <span className="review-label">Allocated Port</span>
                  <span className="review-value port">{allocatedPort}</span>
                </div>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="wizard-error">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4m0 4h.01" />
              </svg>
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="wizard-footer">
          {step > 1 && (
            <button
              className="wizard-btn secondary"
              onClick={handleBack}
              disabled={isCreating}
            >
              Back
            </button>
          )}
          <div className="footer-spacer" />
          {step < 3 ? (
            <button
              className="wizard-btn primary"
              onClick={() => setStep(step + 1)}
              disabled={step === 2 && !projectName.trim()}
            >
              Continue
            </button>
          ) : (
            <button
              className="wizard-btn primary create"
              onClick={handleCreate}
              disabled={isCreating}
            >
              {isCreating ? (
                <>
                  <span className="spinner" />
                  Creating...
                </>
              ) : (
                "Create Project"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
