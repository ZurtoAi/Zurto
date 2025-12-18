/**
 * Tasks Tree View Provider
 */

import * as vscode from "vscode";
import { ZurtoAPI, Task } from "../api/ZurtoAPI";
import { Logger } from "../utils/Logger";

export class TaskItem extends vscode.TreeItem {
  constructor(
    public readonly task: Task,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(task.title, collapsibleState);

    this.tooltip = task.description || task.title;
    this.description = `${task.priority} • ${task.status}`;
    this.contextValue = "task";

    // Icon based on status
    const iconMap: Record<string, string> = {
      pending: "circle-outline",
      "in-progress": "loading~spin",
      completed: "check",
      blocked: "error",
    };
    this.iconPath = new vscode.ThemeIcon(
      iconMap[task.status] || "circle-outline"
    );
  }
}

export class StatusGroup extends vscode.TreeItem {
  constructor(public readonly status: string, public readonly count: number) {
    super(
      `${status.charAt(0).toUpperCase() + status.slice(1)} (${count})`,
      vscode.TreeItemCollapsibleState.Expanded
    );

    this.contextValue = "status-group";
    this.iconPath = new vscode.ThemeIcon("folder");
  }
}

export class TasksProvider
  implements vscode.TreeDataProvider<TaskItem | StatusGroup>
{
  private _onDidChangeTreeData = new vscode.EventEmitter<
    TaskItem | StatusGroup | undefined | null | void
  >();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  private tasks: Task[] = [];

  constructor(private api: ZurtoAPI, private logger: Logger) {}

  async refresh(): Promise<void> {
    try {
      this.tasks = await this.api.getTasks();
      this._onDidChangeTreeData.fire();
    } catch (error) {
      this.logger.error("Failed to fetch tasks", error);
      this.tasks = [];
      this._onDidChangeTreeData.fire();
    }
  }

  getTreeItem(element: TaskItem | StatusGroup): vscode.TreeItem {
    return element;
  }

  async getChildren(
    element?: TaskItem | StatusGroup
  ): Promise<(TaskItem | StatusGroup)[]> {
    if (!element) {
      // Root level - show status groups
      if (this.tasks.length === 0) {
        await this.refresh();
      }

      const statuses = ["pending", "in-progress", "completed", "blocked"];
      return statuses
        .map((status) => {
          const count = this.tasks.filter((t) => t.status === status).length;
          if (count > 0) {
            return new StatusGroup(status, count);
          }
          return null;
        })
        .filter((g): g is StatusGroup => g !== null);
    }

    if (element instanceof StatusGroup) {
      // Show tasks in this status
      return this.tasks
        .filter((t) => t.status === element.status)
        .map(
          (task) => new TaskItem(task, vscode.TreeItemCollapsibleState.None)
        );
    }

    return [];
  }
}
