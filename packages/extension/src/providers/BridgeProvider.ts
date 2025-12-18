/**
 * Bridge Status Tree View Provider
 */

import * as vscode from "vscode";
import { Logger } from "../utils/Logger";

export class BridgeStatusItem extends vscode.TreeItem {
  constructor(label: string, description: string, icon: string) {
    super(label, vscode.TreeItemCollapsibleState.None);
    this.description = description;
    this.iconPath = new vscode.ThemeIcon(icon);
  }
}

export class BridgeProvider
  implements vscode.TreeDataProvider<BridgeStatusItem>
{
  private _onDidChangeTreeData = new vscode.EventEmitter<
    BridgeStatusItem | undefined | null | void
  >();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  private isRunning = false;
  private port = 8787;

  constructor(private logger: Logger) {}

  setBridgeStatus(running: boolean, port?: number): void {
    this.isRunning = running;
    if (port) {
      this.port = port;
    }
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: BridgeStatusItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: BridgeStatusItem): Promise<BridgeStatusItem[]> {
    if (element) {
      return [];
    }

    const items: BridgeStatusItem[] = [];

    // Status
    items.push(
      new BridgeStatusItem(
        "Status",
        this.isRunning ? "Running" : "Stopped",
        this.isRunning ? "debug-start" : "debug-stop"
      )
    );

    // Port
    items.push(new BridgeStatusItem("Port", this.port.toString(), "plug"));

    // URL
    if (this.isRunning) {
      items.push(
        new BridgeStatusItem("URL", `http://127.0.0.1:${this.port}`, "link")
      );
    }

    // Endpoints
    if (this.isRunning) {
      items.push(new BridgeStatusItem("Endpoints", "8 available", "list-flat"));
    }

    return items;
  }
}
