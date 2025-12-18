/**
 * Questionnaires Tree View Provider
 */

import * as vscode from "vscode";
import { ZurtoAPI, Questionnaire } from "../api/ZurtoAPI";
import { Logger } from "../utils/Logger";

export class QuestionnaireItem extends vscode.TreeItem {
  constructor(
    public readonly questionnaire: Questionnaire,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(questionnaire.title, collapsibleState);

    this.tooltip = questionnaire.description || questionnaire.title;
    this.description = `${questionnaire.questions.length} questions • ${questionnaire.status}`;
    this.contextValue = "questionnaire";

    // Icon based on status
    const iconMap: Record<string, string> = {
      draft: "edit",
      active: "play",
      completed: "check-all",
    };
    this.iconPath = new vscode.ThemeIcon(
      iconMap[questionnaire.status] || "note"
    );

    // Command to open questionnaire
    this.command = {
      command: "zurto.showQuestionnaire",
      title: "Open Questionnaire",
      arguments: [questionnaire.id],
    };
  }
}

export class QuestionnairesProvider
  implements vscode.TreeDataProvider<QuestionnaireItem>
{
  private _onDidChangeTreeData = new vscode.EventEmitter<
    QuestionnaireItem | undefined | null | void
  >();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  private questionnaires: Questionnaire[] = [];

  constructor(private api: ZurtoAPI, private logger: Logger) {}

  async refresh(): Promise<void> {
    try {
      this.questionnaires = await this.api.getQuestionnaires();
      this._onDidChangeTreeData.fire();
    } catch (error) {
      this.logger.error("Failed to fetch questionnaires", error);
      this.questionnaires = [];
      this._onDidChangeTreeData.fire();
    }
  }

  getTreeItem(element: QuestionnaireItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: QuestionnaireItem): Promise<QuestionnaireItem[]> {
    if (element) {
      return []; // No children
    }

    if (this.questionnaires.length === 0) {
      await this.refresh();
    }

    return this.questionnaires.map(
      (q) => new QuestionnaireItem(q, vscode.TreeItemCollapsibleState.None)
    );
  }
}
