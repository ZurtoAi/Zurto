/**
 * Copilot Bridge - HTTP server for AI context injection
 */

import * as http from "http";
import * as vscode from "vscode";
import { ZurtoAPI } from "../api/ZurtoAPI";
import { Logger } from "../utils/Logger";

interface WorkspaceContext {
  workspace: {
    name: string;
    folders: string[];
    activeFile?: string;
    openFiles: string[];
  };
  git?: {
    branch?: string;
    remoteUrl?: string;
    uncommittedChanges: number;
  };
  project?: {
    type?: string;
    dependencies?: Record<string, string>;
  };
  selection?: {
    file: string;
    text: string;
    startLine: number;
    endLine: number;
  };
}

interface BridgeRequest {
  method: string;
  path: string;
  body?: unknown;
}

export class CopilotBridge {
  private server: http.Server | null = null;
  private port: number;
  private api: ZurtoAPI;
  private logger: Logger;
  private context: vscode.ExtensionContext;
  private isRunning = false;

  constructor(
    port: number,
    api: ZurtoAPI,
    logger: Logger,
    context: vscode.ExtensionContext
  ) {
    this.port = port;
    this.api = api;
    this.logger = logger;
    this.context = context;
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      this.logger.warn("Bridge already running");
      return;
    }

    return new Promise((resolve, reject) => {
      this.server = http.createServer((req, res) => {
        this.handleRequest(req, res);
      });

      this.server.on("error", (error: NodeJS.ErrnoException) => {
        if (error.code === "EADDRINUSE") {
          reject(new Error(`Port ${this.port} is already in use`));
        } else {
          reject(error);
        }
      });

      this.server.listen(this.port, "127.0.0.1", () => {
        this.isRunning = true;
        this.logger.info(
          `Copilot Bridge listening on http://127.0.0.1:${this.port}`
        );
        resolve();
      });
    });
  }

  async stop(): Promise<void> {
    if (!this.isRunning || !this.server) {
      return;
    }

    return new Promise((resolve) => {
      this.server!.close(() => {
        this.isRunning = false;
        this.server = null;
        this.logger.info("Copilot Bridge stopped");
        resolve();
      });
    });
  }

  private async handleRequest(
    req: http.IncomingMessage,
    res: http.ServerResponse
  ): Promise<void> {
    // CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    const url = new URL(req.url || "/", `http://127.0.0.1:${this.port}`);
    const path = url.pathname;

    this.logger.debug(`Bridge request: ${req.method} ${path}`);

    try {
      let body: unknown;
      if (req.method === "POST") {
        body = await this.parseBody(req);
      }

      const response = await this.routeRequest({
        method: req.method || "GET",
        path,
        body,
      });

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(response));
    } catch (error) {
      this.logger.error(`Bridge error: ${path}`, error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          error: error instanceof Error ? error.message : "Unknown error",
        })
      );
    }
  }

  private parseBody(req: http.IncomingMessage): Promise<unknown> {
    return new Promise((resolve, reject) => {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        try {
          resolve(body ? JSON.parse(body) : {});
        } catch {
          reject(new Error("Invalid JSON body"));
        }
      });
      req.on("error", reject);
    });
  }

  private async routeRequest(request: BridgeRequest): Promise<unknown> {
    switch (request.path) {
      case "/":
      case "/health":
        return this.handleHealth();

      case "/context":
        return this.handleGetContext();

      case "/inject":
        return this.handleInjectContext(
          request.body as Record<string, unknown>
        );

      case "/projects":
        return this.handleGetProjects();

      case "/tasks":
        if (request.method === "GET") {
          return this.handleGetTasks();
        } else {
          return this.handleCreateTask(request.body as Record<string, unknown>);
        }

      case "/questionnaire":
        return this.handleQuestionnaire(
          request.body as Record<string, unknown>
        );

      case "/questionnaire/generate":
        return this.handleGenerateQuestionnaire(
          request.body as Record<string, unknown>
        );

      case "/chat":
        return this.handleChat(request.body as Record<string, unknown>);

      case "/memory/search":
        return this.handleMemorySearch(request.body as { query: string });

      case "/memory":
        return this.handleMemoryStore(
          request.body as { content: string; category: string }
        );

      default:
        throw new Error(`Unknown endpoint: ${request.path}`);
    }
  }

  private handleHealth(): object {
    return {
      status: "ok",
      bridge: "running",
      port: this.port,
      timestamp: new Date().toISOString(),
    };
  }

  async getWorkspaceContext(): Promise<WorkspaceContext> {
    const context: WorkspaceContext = {
      workspace: {
        name: vscode.workspace.name || "Unknown",
        folders:
          vscode.workspace.workspaceFolders?.map((f) => f.uri.fsPath) || [],
        openFiles: vscode.window.tabGroups.all
          .flatMap((g) => g.tabs)
          .map((t) => (t.input as { uri?: vscode.Uri })?.uri?.fsPath)
          .filter((f): f is string => !!f),
      },
    };

    // Active file
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
      context.workspace.activeFile = activeEditor.document.uri.fsPath;

      // Selection
      if (!activeEditor.selection.isEmpty) {
        context.selection = {
          file: activeEditor.document.uri.fsPath,
          text: activeEditor.document.getText(activeEditor.selection),
          startLine: activeEditor.selection.start.line + 1,
          endLine: activeEditor.selection.end.line + 1,
        };
      }
    }

    // Git info
    const gitExtension = vscode.extensions.getExtension("vscode.git");
    if (gitExtension?.isActive) {
      try {
        const git = gitExtension.exports.getAPI(1);
        const repo = git.repositories[0];
        if (repo) {
          context.git = {
            branch: repo.state.HEAD?.name,
            remoteUrl: repo.state.remotes[0]?.fetchUrl,
            uncommittedChanges:
              repo.state.workingTreeChanges.length +
              repo.state.indexChanges.length,
          };
        }
      } catch (error) {
        this.logger.debug("Could not get git info", error);
      }
    }

    // Project info (package.json)
    try {
      const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
      if (workspaceFolder) {
        const packageJsonUri = vscode.Uri.joinPath(
          workspaceFolder.uri,
          "package.json"
        );
        const packageJsonContent = await vscode.workspace.fs.readFile(
          packageJsonUri
        );
        const packageJson = JSON.parse(packageJsonContent.toString());
        context.project = {
          type: packageJson.type || "commonjs",
          dependencies: {
            ...packageJson.dependencies,
            ...packageJson.devDependencies,
          },
        };
      }
    } catch {
      // No package.json
    }

    return context;
  }

  private async handleGetContext(): Promise<WorkspaceContext> {
    return this.getWorkspaceContext();
  }

  private async handleInjectContext(
    body: Record<string, unknown>
  ): Promise<object> {
    const context = await this.getWorkspaceContext();

    // Store in memory if requested
    if (body.storeMemory) {
      try {
        await this.api.storeMemory(
          JSON.stringify(context),
          "workspace-context"
        );
      } catch (error) {
        this.logger.error("Failed to store context in memory", error);
      }
    }

    return {
      success: true,
      context,
      injectedAt: new Date().toISOString(),
    };
  }

  private async handleGetProjects(): Promise<object> {
    const projects = await this.api.getProjects();
    return { success: true, data: projects };
  }

  private async handleGetTasks(): Promise<object> {
    const tasks = await this.api.getTasks();
    return { success: true, data: tasks };
  }

  private async handleCreateTask(
    body: Record<string, unknown>
  ): Promise<object> {
    const task = await this.api.createTask({
      title: body.title as string,
      description: body.description as string,
      projectId: body.projectId as string,
      priority: body.priority as "low" | "medium" | "high" | "critical",
    });
    return { success: true, data: task };
  }

  private async handleQuestionnaire(
    body: Record<string, unknown>
  ): Promise<object> {
    // Handle questionnaire response submission
    if (body.id && body.responses) {
      await this.api.submitQuestionnaireResponse(
        body.id as string,
        body.responses as Record<string, unknown>
      );
      return { success: true, message: "Response submitted" };
    }

    // If questions are provided directly, show them in panel (no AI generation)
    if (
      body.questions &&
      Array.isArray(body.questions) &&
      body.questions.length > 0
    ) {
      this.logger.info(
        `Displaying ${body.questions.length} provided questions`
      );

      // Show questionnaire panel with provided questions
      await vscode.commands.executeCommand("zurto.showQuestionnairePanel", {
        loading: false,
        questions: body.questions,
        projectDescription:
          (body.projectDescription as string) || "Project Setup",
        projectType: (body.projectType as string) || "Project",
      });

      return {
        success: true,
        questions: body.questions,
        provider: "provided",
      };
    }

    // If only projectDescription is provided (no questions), generate questionnaire
    if (body.projectDescription) {
      return this.handleGenerateQuestionnaire(body);
    }

    // Otherwise, list existing questionnaires
    const questionnaires = await this.api.getQuestionnaires();
    return { success: true, data: questionnaires };
  }

  private async handleGenerateQuestionnaire(
    body: Record<string, unknown>
  ): Promise<object> {
    const projectDescription = body.projectDescription as string;
    const projectType = body.projectType as string | undefined;
    const existingAnswers = body.existingAnswers as
      | Record<string, unknown>
      | undefined;

    this.logger.info(
      `Generating questionnaire for: ${projectDescription?.substring(
        0,
        100
      )}...`
    );

    // Generate questions using Copilot Chat API if available
    try {
      // Show questionnaire panel with loading state
      await vscode.commands.executeCommand("zurto.showQuestionnairePanel", {
        loading: true,
        projectDescription,
        projectType,
      });

      // Use Copilot to generate intelligent questions
      const systemPrompt = `You are a project planning assistant. Generate intelligent questions to help plan and scope a software project.

${projectType ? `Project type: ${projectType}` : ""}
${
  existingAnswers
    ? `Already answered:\n${JSON.stringify(existingAnswers, null, 2)}`
    : ""
}

Generate 5-10 relevant questions. Respond with a JSON array:
[
  {
    "id": "unique-id",
    "text": "Question text?",
    "type": "text|select|multiselect|boolean|number",
    "options": [{ "label": "Option A", "value": "a" }],
    "required": true,
    "followUp": ["question-id-if-yes"]
  }
]`;

      // Try to use VS Code Copilot language model API
      const questions = await this.generateQuestionsWithCopilot(
        systemPrompt,
        projectDescription
      );

      // Update questionnaire panel with generated questions
      await vscode.commands.executeCommand("zurto.showQuestionnairePanel", {
        loading: false,
        questions,
        projectDescription,
        projectType,
      });

      return {
        success: true,
        questions,
        provider: "copilot",
      };
    } catch (error) {
      this.logger.error("Failed to generate questionnaire", error);

      // Fallback: Generate basic questions
      const basicQuestions = this.generateBasicQuestions(
        projectDescription,
        projectType
      );

      await vscode.commands.executeCommand("zurto.showQuestionnairePanel", {
        loading: false,
        questions: basicQuestions,
        projectDescription,
        projectType,
      });

      return {
        success: true,
        questions: basicQuestions,
        provider: "fallback",
      };
    }
  }

  private async generateQuestionsWithCopilot(
    systemPrompt: string,
    projectDescription: string
  ): Promise<Array<Record<string, unknown>>> {
    // Try to access VS Code Language Model API (Copilot)
    const models = await vscode.lm.selectChatModels({ family: "copilot" });

    if (models.length === 0) {
      throw new Error("No Copilot language model available");
    }

    const model = models[0];
    const messages = [
      vscode.LanguageModelChatMessage.User(systemPrompt),
      vscode.LanguageModelChatMessage.User(projectDescription),
    ];

    const response = await model.sendRequest(messages, {});

    let content = "";
    for await (const chunk of response.text) {
      content += chunk;
    }

    // Parse JSON from response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Failed to parse questionnaire response");
    }

    return JSON.parse(jsonMatch[0]);
  }

  private generateBasicQuestions(
    projectDescription: string,
    projectType?: string
  ): Array<Record<string, unknown>> {
    const questions: Array<Record<string, unknown>> = [
      {
        id: "project-name",
        text: "What is the name of your project?",
        type: "text",
        required: true,
      },
      {
        id: "project-scope",
        text: "What is the main scope/goal of this project?",
        type: "text",
        required: true,
      },
      {
        id: "tech-stack",
        text: "What technologies/frameworks do you want to use?",
        type: "multiselect",
        options: [
          { label: "TypeScript", value: "typescript" },
          { label: "React", value: "react" },
          { label: "Node.js", value: "nodejs" },
          { label: "Python", value: "python" },
          { label: "Docker", value: "docker" },
        ],
        required: true,
      },
      {
        id: "timeline",
        text: "What is your expected timeline?",
        type: "select",
        options: [
          { label: "1 week", value: "1w" },
          { label: "2 weeks", value: "2w" },
          { label: "1 month", value: "1m" },
          { label: "3 months", value: "3m" },
          { label: "6+ months", value: "6m+" },
        ],
        required: false,
      },
      {
        id: "team-size",
        text: "How many people will work on this project?",
        type: "number",
        required: false,
      },
    ];

    return questions;
  }

  private async handleChat(body: Record<string, unknown>): Promise<object> {
    const messages = body.messages as Array<{ role: string; content: string }>;
    const temperature = (body.temperature as number) || 0.7;

    if (!messages || messages.length === 0) {
      return { success: false, error: "No messages provided" };
    }

    this.logger.info(`Chat request with ${messages.length} messages`);

    try {
      // Try to use VS Code Language Model API (Copilot)
      const models = await vscode.lm.selectChatModels({ family: "copilot" });

      if (models.length === 0) {
        throw new Error("No Copilot language model available");
      }

      const model = models[0];

      // Convert messages to VS Code format
      const lmMessages = messages.map((msg) => {
        if (msg.role === "system" || msg.role === "user") {
          return vscode.LanguageModelChatMessage.User(msg.content);
        } else {
          return vscode.LanguageModelChatMessage.Assistant(msg.content);
        }
      });

      const response = await model.sendRequest(lmMessages, {});

      let content = "";
      for await (const chunk of response.text) {
        content += chunk;
      }

      return {
        success: true,
        content,
        provider: "copilot",
        model: model.id,
      };
    } catch (error) {
      this.logger.error("Copilot chat failed", error);

      // Return error - frontend should fall back to backend API
      return {
        success: false,
        error: error instanceof Error ? error.message : "Chat failed",
        fallbackRequired: true,
      };
    }
  }

  private async handleMemorySearch(body: { query: string }): Promise<object> {
    const results = await this.api.searchMemory(body.query);
    return { success: true, data: results };
  }

  private async handleMemoryStore(body: {
    content: string;
    category: string;
  }): Promise<object> {
    await this.api.storeMemory(body.content, body.category);
    return { success: true, message: "Memory stored" };
  }
}
