/**
 * Projects Tree View Provider
 */

import * as vscode from "vscode";
import { ZurtoAPI, Project } from "../api/ZurtoAPI";
import { Logger } from "../utils/Logger";

export class ProjectItem extends vscode.TreeItem {
  constructor(
    public readonly project: Project,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(project.name, collapsibleState);

    this.tooltip = project.description || project.name;
    this.description = project.status;
    this.contextValue = "project";

    // Icon based on status
    this.iconPath = new vscode.ThemeIcon(
      project.status === "active"
        ? "folder-opened"
        : project.status === "completed"
        ? "check"
        : "archive"
    );
  }
}

export class ProjectsProvider implements vscode.TreeDataProvider<ProjectItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<
    ProjectItem | undefined | null | void
  >();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  private projects: Project[] = [];

  constructor(private api: ZurtoAPI, private logger: Logger) {}

  async refresh(): Promise<void> {
    try {
      this.projects = await this.api.getProjects();
      this._onDidChangeTreeData.fire();
    } catch (error) {
      this.logger.error("Failed to fetch projects", error);
      this.projects = [];
      this._onDidChangeTreeData.fire();
    }
  }

  getTreeItem(element: ProjectItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: ProjectItem): Promise<ProjectItem[]> {
    if (element) {
      return []; // No children for projects
    }

    if (this.projects.length === 0) {
      await this.refresh();
    }

    return this.projects.map(
      (project) =>
        new ProjectItem(project, vscode.TreeItemCollapsibleState.None)
    );
  }
}
