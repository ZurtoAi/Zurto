/**
 * Dashboard Webview Panel
 * Overview of projects, tasks, and system status
 */

import * as vscode from "vscode";
import { ZurtoAPI, Project, Task } from "../api/ZurtoAPI";
import { Logger } from "../utils/Logger";

export class DashboardPanel {
  public static currentPanel: DashboardPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private _disposables: vscode.Disposable[] = [];
  private projects: Project[] = [];
  private tasks: Task[] = [];
  private bridgeStatus: { running: boolean; port: number } = {
    running: false,
    port: 8787,
  };

  private constructor(
    panel: vscode.WebviewPanel,
    private extensionUri: vscode.Uri,
    private api: ZurtoAPI,
    private logger: Logger
  ) {
    this._panel = panel;

    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    this._panel.webview.onDidReceiveMessage(
      async (message) => {
        await this.handleMessage(message);
      },
      null,
      this._disposables
    );
  }

  public static async createOrShow(
    extensionUri: vscode.Uri,
    api: ZurtoAPI,
    logger: Logger
  ): Promise<DashboardPanel> {
    const column = vscode.ViewColumn.One;

    if (DashboardPanel.currentPanel) {
      DashboardPanel.currentPanel._panel.reveal(column);
      await DashboardPanel.currentPanel.refresh();
      return DashboardPanel.currentPanel;
    }

    const panel = vscode.window.createWebviewPanel(
      "zurtoDashboard",
      "Zurto Dashboard",
      column,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      }
    );

    DashboardPanel.currentPanel = new DashboardPanel(
      panel,
      extensionUri,
      api,
      logger
    );

    await DashboardPanel.currentPanel.refresh();
    return DashboardPanel.currentPanel;
  }

  public setBridgeStatus(running: boolean, port: number): void {
    this.bridgeStatus = { running, port };
    this.updateContent();
  }

  private async refresh(): Promise<void> {
    try {
      [this.projects, this.tasks] = await Promise.all([
        this.api.getProjects(),
        this.api.getTasks(),
      ]);
    } catch (error) {
      this.logger.error("Failed to fetch dashboard data", error);
      this.projects = [];
      this.tasks = [];
    }
    this.updateContent();
  }

  private updateContent(): void {
    this._panel.webview.html = this.getWebviewContent();
  }

  private async handleMessage(message: any): Promise<void> {
    switch (message.type) {
      case "refresh":
        await this.refresh();
        break;
      case "openProject":
        vscode.commands.executeCommand("zurto.openProject", message.id);
        break;
      case "openTask":
        vscode.commands.executeCommand("zurto.openTask", message.id);
        break;
      case "newTask":
        vscode.commands.executeCommand("zurto.createTask");
        break;
    }
  }

  private getWebviewContent(): string {
    const tasksByStatus = {
      pending: this.tasks.filter((t) => t.status === "pending"),
      "in-progress": this.tasks.filter((t) => t.status === "in-progress"),
      completed: this.tasks.filter((t) => t.status === "completed"),
      blocked: this.tasks.filter((t) => t.status === "blocked"),
    };

    const activeProjects = this.projects.filter((p) => p.status === "active");

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Zurto Dashboard</title>
  <style>
    :root {
      --z-primary: #df3e53;
      --z-success: #22c55e;
      --z-warning: #eab308;
      --z-danger: #ef4444;
      --z-bg-primary: #0a0a0a;
      --z-bg-secondary: #111111;
      --z-bg-tertiary: #1a1a1a;
      --z-text-primary: #ffffff;
      --z-text-secondary: #a0a0a0;
      --z-border: #2a2a2a;
      --z-radius: 8px;
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: var(--z-bg-primary);
      color: var(--z-text-primary);
      padding: 24px;
      line-height: 1.6;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    
    .header h1 {
      font-size: 24px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .header h1 .logo {
      color: var(--z-primary);
    }
    
    .btn {
      padding: 8px 16px;
      border-radius: var(--z-radius);
      border: none;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: opacity 0.2s;
    }
    
    .btn:hover {
      opacity: 0.9;
    }
    
    .btn-primary {
      background: var(--z-primary);
      color: white;
    }
    
    .btn-ghost {
      background: transparent;
      border: 1px solid var(--z-border);
      color: var(--z-text-primary);
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    
    .stat-card {
      background: var(--z-bg-secondary);
      border: 1px solid var(--z-border);
      border-radius: var(--z-radius);
      padding: 20px;
    }
    
    .stat-card .label {
      color: var(--z-text-secondary);
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .stat-card .value {
      font-size: 32px;
      font-weight: 600;
      margin: 4px 0;
    }
    
    .stat-card .change {
      font-size: 12px;
    }
    
    .stat-card .change.positive {
      color: var(--z-success);
    }
    
    .stat-card .change.negative {
      color: var(--z-danger);
    }
    
    .section {
      margin-bottom: 24px;
    }
    
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    
    .section-title {
      font-size: 16px;
      font-weight: 600;
    }
    
    .card {
      background: var(--z-bg-secondary);
      border: 1px solid var(--z-border);
      border-radius: var(--z-radius);
      padding: 16px;
      cursor: pointer;
      transition: border-color 0.2s;
    }
    
    .card:hover {
      border-color: var(--z-primary);
    }
    
    .card + .card {
      margin-top: 8px;
    }
    
    .card-title {
      font-weight: 500;
      margin-bottom: 4px;
    }
    
    .card-meta {
      font-size: 12px;
      color: var(--z-text-secondary);
    }
    
    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 500;
    }
    
    .badge-pending {
      background: rgba(234, 179, 8, 0.2);
      color: var(--z-warning);
    }
    
    .badge-in-progress {
      background: rgba(59, 130, 246, 0.2);
      color: #3b82f6;
    }
    
    .badge-completed {
      background: rgba(34, 197, 94, 0.2);
      color: var(--z-success);
    }
    
    .badge-blocked {
      background: rgba(239, 68, 68, 0.2);
      color: var(--z-danger);
    }
    
    .bridge-status {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background: var(--z-bg-secondary);
      border: 1px solid var(--z-border);
      border-radius: var(--z-radius);
      margin-bottom: 24px;
    }
    
    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
    
    .status-dot.active {
      background: var(--z-success);
      box-shadow: 0 0 8px var(--z-success);
    }
    
    .status-dot.inactive {
      background: var(--z-danger);
    }
    
    .tasks-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
    }
    
    .task-column {
      background: var(--z-bg-tertiary);
      border-radius: var(--z-radius);
      padding: 12px;
    }
    
    .column-header {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--z-text-secondary);
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .column-count {
      background: var(--z-bg-secondary);
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 11px;
    }
    
    .task-item {
      background: var(--z-bg-secondary);
      border: 1px solid var(--z-border);
      border-radius: 6px;
      padding: 12px;
      margin-bottom: 8px;
      cursor: pointer;
    }
    
    .task-item:hover {
      border-color: var(--z-primary);
    }
    
    .task-title {
      font-size: 13px;
      font-weight: 500;
      margin-bottom: 4px;
    }
    
    .task-priority {
      font-size: 11px;
      color: var(--z-text-secondary);
    }
    
    .priority-high {
      color: var(--z-danger);
    }
    
    .priority-medium {
      color: var(--z-warning);
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>
      <span class="logo">⚡</span>
      Zurto Dashboard
    </h1>
    <div>
      <button class="btn btn-ghost" onclick="refresh()">↻ Refresh</button>
      <button class="btn btn-primary" onclick="newTask()">+ New Task</button>
    </div>
  </div>
  
  <div class="bridge-status">
    <div class="status-dot ${
      this.bridgeStatus.running ? "active" : "inactive"
    }"></div>
    <span>Copilot Bridge: ${
      this.bridgeStatus.running
        ? `Running on port ${this.bridgeStatus.port}`
        : "Not Running"
    }</span>
  </div>
  
  <div class="stats-grid">
    <div class="stat-card">
      <div class="label">Active Projects</div>
      <div class="value">${activeProjects.length}</div>
      <div class="change positive">↑ Active</div>
    </div>
    <div class="stat-card">
      <div class="label">Total Tasks</div>
      <div class="value">${this.tasks.length}</div>
    </div>
    <div class="stat-card">
      <div class="label">In Progress</div>
      <div class="value">${tasksByStatus["in-progress"].length}</div>
    </div>
    <div class="stat-card">
      <div class="label">Completed</div>
      <div class="value">${tasksByStatus.completed.length}</div>
      <div class="change positive">✓ Done</div>
    </div>
  </div>
  
  <div class="section">
    <div class="section-header">
      <span class="section-title">Tasks by Status</span>
    </div>
    <div class="tasks-grid">
      ${this.renderTaskColumn("pending", "⏳ Pending", tasksByStatus.pending)}
      ${this.renderTaskColumn(
        "in-progress",
        "🔄 In Progress",
        tasksByStatus["in-progress"]
      )}
      ${this.renderTaskColumn("blocked", "🚫 Blocked", tasksByStatus.blocked)}
      ${this.renderTaskColumn(
        "completed",
        "✅ Completed",
        tasksByStatus.completed.slice(0, 5)
      )}
    </div>
  </div>
  
  <div class="section">
    <div class="section-header">
      <span class="section-title">Active Projects</span>
    </div>
    ${activeProjects
      .map(
        (p) => `
      <div class="card" onclick="openProject('${p.id}')">
        <div class="card-title">${p.name}</div>
        <div class="card-meta">${p.description || "No description"}</div>
      </div>
    `
      )
      .join("")}
  </div>
  
  <script>
    const vscode = acquireVsCodeApi();
    
    function refresh() {
      vscode.postMessage({ type: 'refresh' });
    }
    
    function newTask() {
      vscode.postMessage({ type: 'newTask' });
    }
    
    function openProject(id) {
      vscode.postMessage({ type: 'openProject', id });
    }
    
    function openTask(id) {
      vscode.postMessage({ type: 'openTask', id });
    }
  </script>
</body>
</html>`;
  }

  private renderTaskColumn(
    status: string,
    label: string,
    tasks: Task[]
  ): string {
    return `
      <div class="task-column">
        <div class="column-header">
          ${label}
          <span class="column-count">${tasks.length}</span>
        </div>
        ${tasks
          .map(
            (t) => `
          <div class="task-item" onclick="openTask('${t.id}')">
            <div class="task-title">${t.title}</div>
            <div class="task-priority ${
              t.priority === "high"
                ? "priority-high"
                : t.priority === "medium"
                ? "priority-medium"
                : ""
            }">${t.priority}</div>
          </div>
        `
          )
          .join("")}
      </div>
    `;
  }

  public dispose(): void {
    DashboardPanel.currentPanel = undefined;
    this._panel.dispose();
    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }
}
