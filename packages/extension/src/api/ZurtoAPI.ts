/**
 * Zurto API Client
 */

import { Logger } from "../utils/Logger";

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: "active" | "archived" | "completed";
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "pending" | "in-progress" | "completed" | "blocked";
  priority: "low" | "medium" | "high" | "critical";
  projectId?: string;
  assignee?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Questionnaire {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  status: "draft" | "active" | "completed";
  createdAt: string;
}

export interface Question {
  id: string;
  type:
    | "text"
    | "textarea"
    | "select"
    | "multiselect"
    | "radio"
    | "checkbox"
    | "boolean"
    | "number";
  question: string;
  description?: string;
  options?: string[];
  required?: boolean;
  defaultValue?: unknown;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  projectId?: string;
  priority?: Task["priority"];
}

export class ZurtoAPI {
  private baseUrl: string;
  private token: string;
  private logger: Logger;

  constructor(baseUrl: string, token: string, logger: Logger) {
    this.baseUrl = baseUrl;
    this.token = token;
    this.logger = logger;
  }

  updateConfig(baseUrl: string, token: string): void {
    this.baseUrl = baseUrl;
    this.token = token;
    this.logger.debug("API config updated", { baseUrl });
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;

    this.logger.debug(`API ${method} ${path}`);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: this.token ? `Bearer ${this.token}` : "",
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      this.logger.error(`API request failed: ${method} ${path}`, error);
      throw error;
    }
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    const response = await this.request<{ data: Project[] }>(
      "GET",
      "/api/projects"
    );
    return response.data || [];
  }

  async getProject(id: string): Promise<Project> {
    const response = await this.request<{ data: Project }>(
      "GET",
      `/api/projects/${id}`
    );
    return response.data;
  }

  async createProject(input: CreateProjectInput): Promise<Project> {
    const response = await this.request<{ data: Project }>(
      "POST",
      "/api/projects",
      input
    );
    return response.data;
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const response = await this.request<{ data: Project }>(
      "PATCH",
      `/api/projects/${id}`,
      updates
    );
    return response.data;
  }

  // Tasks
  async getTasks(projectId?: string): Promise<Task[]> {
    const path = projectId ? `/api/tasks?projectId=${projectId}` : "/api/tasks";
    const response = await this.request<{ data: Task[] }>("GET", path);
    return response.data || [];
  }

  async getTask(id: string): Promise<Task> {
    const response = await this.request<{ data: Task }>(
      "GET",
      `/api/tasks/${id}`
    );
    return response.data;
  }

  async createTask(input: CreateTaskInput): Promise<Task> {
    const response = await this.request<{ data: Task }>(
      "POST",
      "/api/tasks",
      input
    );
    return response.data;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    const response = await this.request<{ data: Task }>(
      "PATCH",
      `/api/tasks/${id}`,
      updates
    );
    return response.data;
  }

  // Questionnaires
  async getQuestionnaires(): Promise<Questionnaire[]> {
    const response = await this.request<{ data: Questionnaire[] }>(
      "GET",
      "/api/questionnaires"
    );
    return response.data || [];
  }

  async getQuestionnaire(id: string): Promise<Questionnaire> {
    const response = await this.request<{ data: Questionnaire }>(
      "GET",
      `/api/questionnaires/${id}`
    );
    return response.data;
  }

  async submitQuestionnaireResponse(
    id: string,
    responses: Record<string, unknown>
  ): Promise<void> {
    await this.request("POST", `/api/questionnaires/${id}/responses`, {
      responses,
    });
  }

  // AI Memory
  async searchMemory(query: string): Promise<unknown[]> {
    const response = await this.request<{ data: unknown[] }>(
      "GET",
      `/api/ai/memory/search?q=${encodeURIComponent(query)}`
    );
    return response.data || [];
  }

  async storeMemory(content: string, category: string): Promise<void> {
    await this.request("POST", "/api/ai/memory", { content, category });
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await this.request("GET", "/health");
      return true;
    } catch {
      return false;
    }
  }
}
