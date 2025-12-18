/**
 * Questionnaire Webview Panel
 * Interactive questionnaire display and response collection
 */

import * as vscode from "vscode";
import { ZurtoAPI, Questionnaire, Question } from "../api/ZurtoAPI";
import { Logger } from "../utils/Logger";

export class QuestionnairePanel {
  public static currentPanel: QuestionnairePanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private _disposables: vscode.Disposable[] = [];
  private questionnaire: Questionnaire | null = null;

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
    logger: Logger,
    questionnaireId?: string
  ): Promise<QuestionnairePanel> {
    const column = vscode.ViewColumn.One;

    if (QuestionnairePanel.currentPanel) {
      QuestionnairePanel.currentPanel._panel.reveal(column);
      if (questionnaireId) {
        await QuestionnairePanel.currentPanel.loadQuestionnaire(
          questionnaireId
        );
      }
      return QuestionnairePanel.currentPanel;
    }

    const panel = vscode.window.createWebviewPanel(
      "zurtoQuestionnaire",
      "Zurto Questionnaire",
      column,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      }
    );

    QuestionnairePanel.currentPanel = new QuestionnairePanel(
      panel,
      extensionUri,
      api,
      logger
    );

    if (questionnaireId) {
      await QuestionnairePanel.currentPanel.loadQuestionnaire(questionnaireId);
    } else {
      QuestionnairePanel.currentPanel.showEmptyState();
    }

    return QuestionnairePanel.currentPanel;
  }

  private async loadQuestionnaire(id: string): Promise<void> {
    try {
      this.questionnaire = await this.api.getQuestionnaire(id);
      this._panel.title = this.questionnaire.title;
      this._panel.webview.html = this.getWebviewContent();
    } catch (error) {
      this.logger.error("Failed to load questionnaire", error);
      vscode.window.showErrorMessage("Failed to load questionnaire");
    }
  }

  private showEmptyState(): void {
    this._panel.webview.html = this.getEmptyStateContent();
  }

  /**
   * Update the panel with dynamic data (from bridge/API)
   */
  public updateWithData(data: {
    loading?: boolean;
    questions?: unknown[];
    projectDescription?: string;
    projectType?: string;
  }): void {
    if (data.loading) {
      this._panel.webview.html = this.getLoadingContent(
        data.projectDescription || "Generating questionnaire..."
      );
      return;
    }

    if (data.questions && data.questions.length > 0) {
      // Create a temporary questionnaire from the questions
      this.questionnaire = {
        id: `generated-${Date.now()}`,
        title: data.projectType
          ? `${data.projectType} Project Setup`
          : "Project Setup",
        description:
          data.projectDescription ||
          "Answer these questions to set up your project",
        questions: data.questions as Question[],
        status: "draft" as const,
        createdAt: new Date().toISOString(),
      };
      this._panel.title = this.questionnaire?.title || "Questionnaire";
      this._panel.webview.html = this.getWebviewContent();
    }
  }

  private getLoadingContent(message: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Loading...</title>
  <style>
    body {
      font-family: var(--vscode-font-family);
      background: var(--vscode-editor-background);
      color: var(--vscode-editor-foreground);
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      flex-direction: column;
      gap: 20px;
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid var(--vscode-editor-foreground);
      border-top-color: #df3e53;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .message {
      font-size: 14px;
      color: var(--vscode-descriptionForeground);
      text-align: center;
      max-width: 300px;
    }
  </style>
</head>
<body>
  <div class="spinner"></div>
  <div class="message">${message}</div>
</body>
</html>`;
  }

  private async handleMessage(message: any): Promise<void> {
    switch (message.type) {
      case "submit":
        await this.handleSubmit(message.responses);
        break;
      case "save":
        await this.handleSave(message.responses);
        break;
      case "close":
        this._panel.dispose();
        break;
    }
  }

  private async handleSubmit(responses: Record<string, any>): Promise<void> {
    if (!this.questionnaire) return;

    try {
      await this.api.submitQuestionnaireResponse(
        this.questionnaire.id,
        responses
      );
      vscode.window.showInformationMessage(
        "Questionnaire submitted successfully!"
      );
      this._panel.dispose();
    } catch (error) {
      this.logger.error("Failed to submit questionnaire", error);
      vscode.window.showErrorMessage("Failed to submit questionnaire");
    }
  }

  private async handleSave(responses: Record<string, any>): Promise<void> {
    vscode.window.showInformationMessage("Draft saved");
  }

  private getWebviewContent(): string {
    if (!this.questionnaire) return this.getEmptyStateContent();

    const questionsHtml = this.questionnaire.questions
      .map((q, idx) => this.renderQuestion(q, idx))
      .join("\n");

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.questionnaire.title}</title>
  <style>
    :root {
      --z-primary: #df3e53;
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
      margin-bottom: 32px;
    }
    
    .header h1 {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    
    .header p {
      color: var(--z-text-secondary);
    }
    
    .question {
      background: var(--z-bg-secondary);
      border: 1px solid var(--z-border);
      border-radius: var(--z-radius);
      padding: 20px;
      margin-bottom: 16px;
    }
    
    .question-label {
      font-weight: 500;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .question-label .number {
      background: var(--z-primary);
      color: white;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
    }
    
    .question-label .required {
      color: var(--z-primary);
    }
    
    .question-description {
      color: var(--z-text-secondary);
      font-size: 14px;
      margin-bottom: 12px;
    }
    
    input[type="text"],
    textarea,
    select {
      width: 100%;
      background: var(--z-bg-tertiary);
      border: 1px solid var(--z-border);
      border-radius: var(--z-radius);
      padding: 10px 14px;
      color: var(--z-text-primary);
      font-size: 14px;
    }
    
    input:focus,
    textarea:focus,
    select:focus {
      outline: none;
      border-color: var(--z-primary);
    }
    
    textarea {
      min-height: 100px;
      resize: vertical;
    }
    
    .radio-group,
    .checkbox-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .radio-option,
    .checkbox-option {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }
    
    .actions {
      display: flex;
      gap: 12px;
      margin-top: 24px;
    }
    
    button {
      padding: 10px 20px;
      border-radius: var(--z-radius);
      border: none;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: opacity 0.2s;
    }
    
    button:hover {
      opacity: 0.9;
    }
    
    .btn-primary {
      background: var(--z-primary);
      color: white;
    }
    
    .btn-secondary {
      background: var(--z-bg-tertiary);
      border: 1px solid var(--z-border);
      color: var(--z-text-primary);
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${this.questionnaire.title}</h1>
    <p>${this.questionnaire.description || ""}</p>
  </div>
  
  <form id="questionnaire-form">
    ${questionsHtml}
    
    <div class="actions">
      <button type="submit" class="btn-primary">Submit</button>
      <button type="button" class="btn-secondary" onclick="saveDraft()">Save Draft</button>
    </div>
  </form>
  
  <script>
    const vscode = acquireVsCodeApi();
    
    document.getElementById('questionnaire-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const responses = {};
      for (const [key, value] of formData.entries()) {
        responses[key] = value;
      }
      vscode.postMessage({ type: 'submit', responses });
    });
    
    function saveDraft() {
      const formData = new FormData(document.getElementById('questionnaire-form'));
      const responses = {};
      for (const [key, value] of formData.entries()) {
        responses[key] = value;
      }
      vscode.postMessage({ type: 'save', responses });
    }
  </script>
</body>
</html>`;
  }

  /**
   * Helper to get option value - handles both string and {label, value} formats
   */
  private getOptionValue(option: unknown): string {
    if (typeof option === "string") return option;
    if (option && typeof option === "object") {
      const opt = option as { value?: string; label?: string };
      return opt.value || opt.label || String(option);
    }
    return String(option);
  }

  /**
   * Helper to get option label - handles both string and {label, value} formats
   */
  private getOptionLabel(option: unknown): string {
    if (typeof option === "string") return option;
    if (option && typeof option === "object") {
      const opt = option as { value?: string; label?: string };
      return opt.label || opt.value || String(option);
    }
    return String(option);
  }

  private renderQuestion(question: Question, index: number): string {
    const required = question.required ? '<span class="required">*</span>' : "";
    const description = question.description
      ? `<div class="question-description">${question.description}</div>`
      : "";

    // Support both 'question' and 'text' properties for the label
    const questionText =
      question.question ||
      (question as unknown as { text?: string }).text ||
      "Question";

    let input = "";
    switch (question.type) {
      case "text":
        input = `<input type="text" name="${question.id}" ${
          question.required ? "required" : ""
        }>`;
        break;
      case "textarea":
        input = `<textarea name="${question.id}" ${
          question.required ? "required" : ""
        }></textarea>`;
        break;
      case "select":
        const selectOptions = question.options
          ?.map(
            (o) =>
              `<option value="${this.getOptionValue(o)}">${this.getOptionLabel(
                o
              )}</option>`
          )
          .join("");
        input = `<select name="${question.id}" ${
          question.required ? "required" : ""
        }>
          <option value="">Select...</option>
          ${selectOptions}
        </select>`;
        break;
      case "radio":
        input = `<div class="radio-group">
          ${question.options
            ?.map(
              (o) => `
            <label class="radio-option">
              <input type="radio" name="${
                question.id
              }" value="${this.getOptionValue(o)}" ${
                question.required ? "required" : ""
              }>
              ${this.getOptionLabel(o)}
            </label>
          `
            )
            .join("")}
        </div>`;
        break;
      case "checkbox":
        input = `<div class="checkbox-group">
          ${question.options
            ?.map(
              (o) => `
            <label class="checkbox-option">
              <input type="checkbox" name="${
                question.id
              }" value="${this.getOptionValue(o)}">
              ${this.getOptionLabel(o)}
            </label>
          `
            )
            .join("")}
        </div>`;
        break;
      default:
        input = `<input type="text" name="${question.id}">`;
    }

    return `
      <div class="question">
        <div class="question-label">
          <span class="number">${index + 1}</span>
          ${questionText}
          ${required}
        </div>
        ${description}
        ${input}
      </div>
    `;
  }

  private getEmptyStateContent(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Questionnaire</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      background: #0a0a0a;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      text-align: center;
    }
    .empty {
      color: #a0a0a0;
    }
    h2 {
      margin-bottom: 8px;
    }
  </style>
</head>
<body>
  <div class="empty">
    <h2>No Questionnaire Selected</h2>
    <p>Select a questionnaire from the sidebar to get started.</p>
  </div>
</body>
</html>`;
  }

  public dispose(): void {
    QuestionnairePanel.currentPanel = undefined;
    this._panel.dispose();
    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }
}
