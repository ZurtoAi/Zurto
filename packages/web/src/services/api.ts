import axios, { AxiosInstance } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://api.zurto.app";

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    throw error.response?.data || { error: error.message };
  }
);

// Project APIs
export const projectsAPI = {
  list: () => api.get("/api/projects"),
  create: (name: string, description?: string) =>
    api.post("/api/projects", { name, description }),
  get: (id: string) => api.get(`/api/projects/${id}`),
  update: (id: string, data: any) => api.patch(`/api/projects/${id}`, data),
  delete: (id: string) => api.delete(`/api/projects/${id}`),
};

// Node APIs
export const nodesAPI = {
  list: (projectId: string) => api.get(`/api/projects/${projectId}/nodes`),
  create: (
    projectId: string,
    name: string,
    type: string,
    description?: string
  ) =>
    api.post(`/api/projects/${projectId}/nodes`, {
      name,
      type,
      description,
    }),
  get: (projectId: string, nodeId: string) =>
    api.get(`/api/projects/${projectId}/nodes/${nodeId}`),
  update: (projectId: string, nodeId: string, data: any) =>
    api.patch(`/api/projects/${projectId}/nodes/${nodeId}`, data),
  delete: (projectId: string, nodeId: string) =>
    api.delete(`/api/projects/${projectId}/nodes/${nodeId}`),
};

// Relationship APIs
export const relationshipsAPI = {
  list: (projectId: string) =>
    api.get(`/api/projects/${projectId}/relationships`),
  create: (
    projectId: string,
    sourceNodeId: string,
    targetNodeId: string,
    relationshipType: string
  ) =>
    api.post(`/api/projects/${projectId}/relationships`, {
      sourceNodeId,
      targetNodeId,
      relationshipType,
    }),
  delete: (projectId: string, relationshipId: string) =>
    api.delete(`/api/projects/${projectId}/relationships/${relationshipId}`),
};

// Copilot AI Bridge APIs
export const copilotAPI = {
  // Get Copilot status and available features
  status: () => api.get("/api/ai/copilot/status"),

  // Request node suggestions
  suggestNodes: (projectId: string, prompt?: string) =>
    api.post("/api/ai/copilot", {
      projectId,
      action: "suggest-nodes",
      prompt,
    }),

  // Analyze architecture
  analyzeArchitecture: (projectId: string, prompt?: string) =>
    api.post("/api/ai/copilot", {
      projectId,
      action: "analyze-architecture",
      prompt,
    }),

  // Generate description for a node
  generateDescription: (nodeName: string, nodeType: string) =>
    api.post("/api/ai/copilot", {
      action: "generate-description",
      context: { nodeName, nodeType },
    }),

  // Suggest connections between nodes
  suggestConnections: (projectId: string) =>
    api.post("/api/ai/copilot", {
      projectId,
      action: "suggest-connections",
    }),

  // General chat with project context
  chat: (projectId: string, prompt: string) =>
    api.post("/api/ai/copilot", {
      projectId,
      action: "chat",
      prompt,
    }),
};

// Questionnaire APIs
export const questionnairesAPI = {
  list: () => api.get("/api/questionnaires"),
  get: (id: string) => api.get(`/api/questionnaires/${id}`),
  create: (data: any) => api.post("/api/questionnaires", data),
  submitAnswer: (
    questionnaireId: string,
    data: {
      projectId: string;
      questionId: string;
      answer: unknown;
      metadata?: Record<string, unknown>;
    }
  ) => api.post(`/api/questionnaires/${questionnaireId}/answers`, data),
  getAnswers: (questionnaireId: string, projectId: string) =>
    api.get(`/api/questionnaires/${questionnaireId}/answers/${projectId}`),
};

// Type exports for frontend usage
export interface QuestionOption {
  id: string;
  label: string;
  value: string | number | boolean;
  nextQuestionId?: string;
  description?: string;
}

export interface Question {
  id: string;
  title: string;
  description?: string;
  type:
    | "text"
    | "textarea"
    | "select"
    | "multiselect"
    | "radio"
    | "checkbox"
    | "number"
    | "email"
    | "url"
    | "date"
    | "boolean";
  required: boolean;
  placeholder?: string;
  options?: QuestionOption[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
  metadata?: Record<string, any>;
  branches?: {
    [key: string]: string;
  };
}

export interface Questionnaire {
  id: string;
  name: string;
  description: string;
  questions: Question[];
  triggerEvent: "project:created" | "project:updated" | "manual";
  createdAt: string;
  updatedAt: string;
}

export interface QuestionnaireAnswer {
  id: string;
  questionnaireId: string;
  projectId: string;
  questionId: string;
  answer: string | number | boolean | string[];
  metadata: Record<string, any>;
  answeredAt: string;
}

// AI APIs
export const aiAPI = {
  // Generic chat endpoint for AI interactions
  post: (path: string, data: any) =>
    api.post(`/api/ai${path.startsWith("/") ? path : "/" + path}`, data),

  analyzeQuestionnaire: (projectId: string, questionnaireId: string) =>
    api.post("/api/ai/analyze-questionnaire", {
      projectId,
      questionnaireId,
    }),
  generateTasks: (projectId: string) =>
    api.post("/api/ai/generate-tasks", {
      projectId,
    }),
  getSuggestions: (projectId: string) =>
    api.post("/api/ai/suggestions", {
      projectId,
    }),
  getInsights: (projectId: string) =>
    api.post("/api/ai/insights", {
      projectId,
    }),
  getArchitectureRecommendations: (projectId: string) =>
    api.get(`/api/ai/insights/architecture?projectId=${projectId}`),
  getPerformanceRecommendations: (projectId: string) =>
    api.get(`/api/ai/insights/performance?projectId=${projectId}`),
  getSecurityRecommendations: () => api.get("/api/ai/insights/security"),
  getTestingStrategy: (projectId: string) =>
    api.get(`/api/ai/insights/testing?projectId=${projectId}`),
  // AI-powered questionnaire generation
  generateQuestionnaire: (projectDescription: string, projectType?: string) =>
    api.post("/api/ai/generate-questionnaire", {
      projectDescription,
      projectType,
    }),
  // Analyze questionnaire answers with AI
  analyzeAnswers: (
    questionnaireId: string,
    projectId: string,
    answers: Record<string, unknown>
  ) =>
    api.post("/api/ai/analyze-answers", {
      questionnaireId,
      projectId,
      answers,
    }),
  // Generate planning documents from questionnaire analysis
  generatePlanning: (
    projectId: string,
    projectPlan: {
      summary: string;
      features: string[];
      architecture: string;
      techStack: string[];
      estimatedComplexity: "low" | "medium" | "high";
    },
    questionsAndAnswers?: Array<{
      question: string;
      category: string;
      answer: unknown;
    }>,
    analysis?: {
      understanding: string;
      gaps?: string[];
      confidence: number;
    }
  ) =>
    api.post("/api/ai/generate-planning", {
      projectId,
      projectPlan,
      questionsAndAnswers,
      analysis: analysis
        ? {
            ...analysis,
            gaps: analysis.gaps || [],
          }
        : undefined,
    }),
  // Generate project code from planning documents
  generateCode: (projectId: string) =>
    api.post("/api/ai/generate-code", { projectId }),
  // Deploy all nodes for a project
  deployProject: (
    projectId: string,
    environment?: "development" | "staging" | "production"
  ) => api.post("/api/ai/deploy-project", { projectId, environment }),
  // Stop all containers for a project
  stopProject: (projectId: string) =>
    api.post("/api/ai/stop-project", { projectId }),
  // Get file tree for a generated project
  getProjectFiles: (projectId: string) =>
    api.get(`/api/ai/project-files/${projectId}`),
  // Read a specific file from the generated project
  readProjectFile: (projectId: string, filePath: string) =>
    api.get(
      `/api/ai/project-file/${projectId}?filePath=${encodeURIComponent(filePath)}`
    ),
};

// Deploy API - One-click deployment system
export const deployAPI = {
  // Get deployment status for a node
  getStatus: (projectId: string, nodeId: string) =>
    api.get(`/api/deploy/${projectId}/${nodeId}/status`),

  // Get all deployments for a project
  listDeployments: (projectId: string) => api.get(`/api/deploy/${projectId}`),

  // Start a deployment
  deploy: (
    projectId: string,
    nodeId: string,
    options?: {
      environment?: "development" | "staging" | "production";
      branch?: string;
      buildCommand?: string;
      startCommand?: string;
      envVars?: Record<string, string>;
    }
  ) => api.post(`/api/deploy/${projectId}/${nodeId}`, options || {}),

  // Rollback to previous deployment
  rollback: (projectId: string, nodeId: string, deploymentId?: string) =>
    api.post(`/api/deploy/${projectId}/${nodeId}/rollback`, { deploymentId }),

  // Stop/undeploy a node
  undeploy: (projectId: string, nodeId: string) =>
    api.delete(`/api/deploy/${projectId}/${nodeId}`),

  // Get deployment logs
  getLogs: (projectId: string, nodeId: string, lines?: number) =>
    api.get(
      `/api/deploy/${projectId}/${nodeId}/logs${lines ? `?lines=${lines}` : ""}`
    ),

  // Get deployment history
  getHistory: (projectId: string, nodeId: string) =>
    api.get(`/api/deploy/${projectId}/${nodeId}/history`),

  // Update deployment configuration
  updateConfig: (
    projectId: string,
    nodeId: string,
    config: {
      domain?: string;
      ssl?: boolean;
      envVars?: Record<string, string>;
      scaling?: { min: number; max: number };
    }
  ) => api.patch(`/api/deploy/${projectId}/${nodeId}/config`, config),
};

// Ports API
export const portsAPI = {
  list: (projectId?: string) => {
    const params = projectId ? `?projectId=${projectId}` : "";
    return api.get(`/api/ports${params}`);
  },
  getAvailable: (count?: number) => {
    const params = count ? `?count=${count}` : "";
    return api.get(`/api/ports/available${params}`);
  },
  allocate: (
    projectId: string,
    services?: Array<{ name: string; type: string }>
  ) => api.post("/api/ports/allocate", { projectId, services }),
  release: (portId: string) => api.post(`/api/ports/${portId}/release`),
  delete: (portId: string) => api.delete(`/api/ports/${portId}`),
  getProjectPorts: (projectId: string) =>
    api.get(`/api/ports/project/${projectId}`),
};

// Health check
export const systemAPI = {
  health: () => api.get("/health"),
};

export default api;
