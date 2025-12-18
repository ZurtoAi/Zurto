/**
 * Zurto VS Code Extension - Main Entry Point
 */

import * as vscode from "vscode";
import { CopilotBridge } from "./bridge/CopilotBridge";
import { ProjectsProvider } from "./providers/ProjectsProvider";
import { TasksProvider } from "./providers/TasksProvider";
import { QuestionnairesProvider } from "./providers/QuestionnairesProvider";
import { BridgeProvider } from "./providers/BridgeProvider";
import { QuestionnairePanel } from "./panels/QuestionnairePanel";
import { DashboardPanel } from "./panels/DashboardPanel";
import { Logger } from "./utils/Logger";
import { ZurtoAPI } from "./api/ZurtoAPI";

let bridge: CopilotBridge | undefined;
let logger: Logger;
let api: ZurtoAPI;

export async function activate(context: vscode.ExtensionContext) {
  // Initialize logger
  const config = vscode.workspace.getConfiguration("zurto");
  const logLevel = config.get<string>("logLevel", "info") as
    | "debug"
    | "info"
    | "warn"
    | "error";
  logger = new Logger(logLevel);
  logger.info("Zurto extension activating...");

  // Initialize API client
  const apiUrl = config.get<string>("apiUrl", "https://api.zurto.app");
  const teamToken = config.get<string>("teamToken", "");
  api = new ZurtoAPI(apiUrl, teamToken, logger);

  // Initialize providers
  const projectsProvider = new ProjectsProvider(api, logger);
  const tasksProvider = new TasksProvider(api, logger);
  const questionnairesProvider = new QuestionnairesProvider(api, logger);
  const bridgeProvider = new BridgeProvider(logger);

  // Register tree views
  vscode.window.registerTreeDataProvider("zurto.projects", projectsProvider);
  vscode.window.registerTreeDataProvider("zurto.tasks", tasksProvider);
  vscode.window.registerTreeDataProvider(
    "zurto.questionnaires",
    questionnairesProvider
  );
  vscode.window.registerTreeDataProvider("zurto.bridge", bridgeProvider);

  // Initialize Copilot Bridge
  const bridgePort = config.get<number>("bridgePort", 8787);
  bridge = new CopilotBridge(bridgePort, api, logger, context);

  // Register commands
  const commands = [
    vscode.commands.registerCommand("zurto.startBridge", async () => {
      try {
        await bridge?.start();
        bridgeProvider.setBridgeStatus(true, bridgePort);
        vscode.window.showInformationMessage(
          `Zurto Bridge started on port ${bridgePort}`
        );
      } catch (error) {
        logger.error("Failed to start bridge", error);
        vscode.window.showErrorMessage(`Failed to start bridge: ${error}`);
      }
    }),

    vscode.commands.registerCommand("zurto.stopBridge", async () => {
      try {
        await bridge?.stop();
        bridgeProvider.setBridgeStatus(false);
        vscode.window.showInformationMessage("Zurto Bridge stopped");
      } catch (error) {
        logger.error("Failed to stop bridge", error);
        vscode.window.showErrorMessage(`Failed to stop bridge: ${error}`);
      }
    }),

    vscode.commands.registerCommand("zurto.showQuestionnaire", () => {
      QuestionnairePanel.createOrShow(context.extensionUri, api, logger);
    }),

    vscode.commands.registerCommand(
      "zurto.showQuestionnairePanel",
      async (data?: {
        loading?: boolean;
        questions?: unknown[];
        projectDescription?: string;
        projectType?: string;
      }) => {
        const panel = await QuestionnairePanel.createOrShow(
          context.extensionUri,
          api,
          logger
        );
        if (data) {
          panel.updateWithData(data);
        }
      }
    ),

    vscode.commands.registerCommand("zurto.showDashboard", () => {
      DashboardPanel.createOrShow(context.extensionUri, api, logger);
    }),

    vscode.commands.registerCommand("zurto.createProject", async () => {
      const name = await vscode.window.showInputBox({
        prompt: "Enter project name",
        placeHolder: "My New Project",
      });

      if (name) {
        try {
          await api.createProject({ name });
          projectsProvider.refresh();
          vscode.window.showInformationMessage(`Project "${name}" created`);
        } catch (error) {
          logger.error("Failed to create project", error);
          vscode.window.showErrorMessage(`Failed to create project: ${error}`);
        }
      }
    }),

    vscode.commands.registerCommand("zurto.syncProjects", async () => {
      try {
        await projectsProvider.refresh();
        await tasksProvider.refresh();
        vscode.window.showInformationMessage("Projects synced");
      } catch (error) {
        logger.error("Failed to sync projects", error);
        vscode.window.showErrorMessage(`Failed to sync: ${error}`);
      }
    }),

    vscode.commands.registerCommand("zurto.injectContext", async () => {
      try {
        const context = await bridge?.getWorkspaceContext();
        if (context) {
          await vscode.env.clipboard.writeText(
            JSON.stringify(context, null, 2)
          );
          vscode.window.showInformationMessage("Context copied to clipboard");
        }
      } catch (error) {
        logger.error("Failed to get context", error);
        vscode.window.showErrorMessage(`Failed to get context: ${error}`);
      }
    }),

    vscode.commands.registerCommand("zurto.showLogs", () => {
      logger.showOutput();
    }),
  ];

  context.subscriptions.push(...commands);

  // Auto-start bridge if configured
  const autoStart = config.get<boolean>("autoStartBridge", true);
  if (autoStart) {
    try {
      await bridge.start();
      bridgeProvider.setBridgeStatus(true, bridgePort);
      logger.info(`Copilot Bridge started on port ${bridgePort}`);
    } catch (error) {
      logger.error("Failed to auto-start bridge", error);
    }
  }

  // Configuration change listener
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration("zurto")) {
        const newConfig = vscode.workspace.getConfiguration("zurto");

        // Update logger level
        if (e.affectsConfiguration("zurto.logLevel")) {
          logger.setLevel(newConfig.get<string>("logLevel", "info"));
        }

        // Update API URL/token
        if (
          e.affectsConfiguration("zurto.apiUrl") ||
          e.affectsConfiguration("zurto.teamToken")
        ) {
          api.updateConfig(
            newConfig.get<string>("apiUrl", "https://api.zurto.app"),
            newConfig.get<string>("teamToken", "")
          );
        }
      }
    })
  );

  logger.info("Zurto extension activated");
}

export async function deactivate() {
  if (bridge) {
    await bridge.stop();
  }
  logger?.info("Zurto extension deactivated");
}
