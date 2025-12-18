import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import * as fs from "fs";
import * as path from "path";
import { getDatabase } from "../core/database.js";
import { copilotFallback } from "../agents/copilot-fallback.js";
import { QuestionnaireAnalyzer } from "../agents/questionnaire-analyzer.js";
import { TaskGenerator } from "../agents/task-generator.js";
import { insightsEngine } from "../agents/insights-engine.js";
import { aiQuestionnaireAgent } from "../agents/ai-questionnaire-agent.js";
import {
  getCopilotBridge,
  getCopilotBridgeStatus,
} from "../agents/copilot-bridge-client.js";
import { logger } from "../utils/logger.js";
import { Project, QuestionnaireAnswer } from "../types/index.js";

const router = express.Router();

const questionnaireAnalyzer = new QuestionnaireAnalyzer();
const taskGenerator = new TaskGenerator();

// ============================================================================
// AI Chat & Status Endpoints (for copilot-bridge)
// ============================================================================

/**
 * GET /api/ai/status
 * Check AI service availability for copilot-bridge
 * Note: Real AI is handled client-side via VS Code Copilot
 */
router.get("/ai/status", async (req: Request, res: Response) => {
  try {
    // Check Copilot Bridge status
    const bridgeStatus = getCopilotBridgeStatus();
    const bridge = getCopilotBridge();

    // Do a live health check if we have a client
    let bridgeHealthy = false;
    if (bridge) {
      bridgeHealthy = await bridge.isAvailable();
    }

    res.json({
      success: true,
      copilot: {
        available: bridgeHealthy,
        note: bridgeHealthy
          ? "Connected to Copilot Bridge"
          : "Copilot Bridge not available - using fallback mode",
      },
      bridge: {
        ...bridgeStatus,
        healthy: bridgeHealthy,
      },
      features: [
        "chat",
        "analyze-questionnaire",
        "generate-tasks",
        "suggestions",
        "insights",
        "architecture-analysis",
      ],
      mode: bridgeHealthy ? "copilot-bridge" : "fallback",
    });
  } catch (error) {
    logger.error("❌ AI status check failed:", error);
    res.status(500).json({
      success: false,
      copilot: { available: false },
      error: "Failed to check AI status",
    });
  }
});

/**
 * GET /api/ai/bridge-status
 * Detailed Copilot Bridge connection status for debugging
 */
router.get("/ai/bridge-status", async (req: Request, res: Response) => {
  try {
    const bridgeStatus = getCopilotBridgeStatus();
    const bridge = getCopilotBridge();

    let healthCheck = { success: false, latency: 0, error: "" };

    if (bridge) {
      const start = Date.now();
      try {
        const available = await bridge.isAvailable();
        healthCheck = {
          success: available,
          latency: Date.now() - start,
          error: available ? "" : "Health check returned false",
        };
      } catch (error) {
        healthCheck = {
          success: false,
          latency: Date.now() - start,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    } else {
      healthCheck.error = "No bridge client available";
    }

    res.json({
      success: true,
      bridge: bridgeStatus,
      healthCheck,
      instructions: !bridgeStatus.hasToken
        ? [
            "1. Open VS Code with the copilot-bridge extension installed",
            "2. Run command: 'Copilot Bridge: Status'",
            "3. Copy the token from the output",
            "4. Set COPILOT_BRIDGE_TOKEN in docker-compose.yml or .env",
            "5. Restart the zurto-api container",
          ]
        : healthCheck.success
          ? ["✅ Copilot Bridge is connected and working!"]
          : [
              "Token is set but connection failed",
              "1. Make sure VS Code is running with Copilot Bridge extension",
              "2. Check the port matches COPILOT_BRIDGE_PORT (default: 50521)",
              "3. Verify the bridge is listening: Run 'Copilot Bridge: Status' in VS Code",
            ],
    });
  } catch (error) {
    logger.error("❌ Bridge status check failed:", error);
    res.status(500).json({
      success: false,
      error: "Failed to check bridge status",
    });
  }
});

/**
 * POST /api/ai/chat
 * AI chat endpoint that uses copilot-bridge when available
 * Falls back to static responses if Copilot Bridge is not available
 *
 * Request body can be:
 * 1. Messages format: { messages: [...] } - for general chat
 * 2. Generate questions: { projectDescription: "...", action: "generate-questions" }
 */
router.post("/ai/chat", async (req: Request, res: Response) => {
  try {
    const { messages, projectDescription, projectName, projectType, action } =
      req.body;

    // Handle questionnaire generation (explicit check for action)
    if (action === "generate-questions" && projectDescription) {
      logger.info(
        `📋 Generating AI questionnaire for: ${projectName || "Unnamed Project"}`
      );
      logger.info(`   Project Type: ${projectType}`);
      logger.info(`   Description: ${projectDescription.substring(0, 100)}...`);

      try {
        const questions = await aiQuestionnaireAgent.generateQuestions({
          projectDescription,
          projectName,
          projectType,
        });

        logger.info(
          `✅ [AIQuestionnaire] Generated ${questions.length} project-specific questions`
        );
        return res.json({
          success: true,
          data: {
            questions,
            content: JSON.stringify(questions),
            provider: "copilot-bridge",
          },
          metadata: {
            timestamp: new Date().toISOString(),
            mode: "ai-questionnaire",
          },
        });
      } catch (error) {
        logger.error("❌ AI Questionnaire generation failed:", error);
        return res.status(500).json({
          success: false,
          error: "Failed to generate questionnaire",
          message:
            error instanceof Error
              ? error.message
              : "Copilot Bridge connection required. Ensure VS Code is running with Copilot Bridge extension.",
        });
      }
    }

    // Handle answer analysis and follow-up questions
    if (action === "analyze-answers") {
      const { questions, answers, round } = req.body;

      logger.info(
        `🔍 Analyzing answers for: ${projectName || "Unnamed Project"} (Round ${round || 1})`
      );
      logger.info(`   Answers received: ${Object.keys(answers || {}).length}`);

      try {
        const result = await aiQuestionnaireAgent.analyzeAnswers({
          projectDescription,
          projectName,
          projectType,
          questions,
          answers,
          round: round || 1,
        });

        logger.info(
          `✅ [AIQuestionnaire] Analysis complete. Ready: ${result.readyToProceed}, Confidence: ${result.analysis.confidence}%`
        );

        return res.json({
          success: true,
          data: result,
          metadata: {
            timestamp: new Date().toISOString(),
            mode: "answer-analysis",
          },
        });
      } catch (error) {
        logger.error("❌ Answer analysis failed:", error);
        return res.status(500).json({
          success: false,
          error: "Failed to analyze answers",
          message: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    // Handle general chat messages
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Messages array or projectDescription is required",
      });
    }

    logger.info(`💬 AI Chat request received`);

    // Get last user message
    const lastMessage = messages[messages.length - 1];
    const userContent =
      typeof lastMessage.content === "string"
        ? lastMessage.content
        : lastMessage.content?.[0]?.text || "";

    // Generate fallback response
    let responseContent = generateFallbackResponse(userContent, {});

    res.json({
      success: true,
      data: {
        content: responseContent,
        provider: "fallback",
        note: "Using fallback responses. For advanced AI, use VS Code with copilot-bridge.",
      },
      metadata: {
        timestamp: new Date().toISOString(),
        mode: "fallback",
      },
    });
  } catch (error) {
    logger.error("❌ AI Chat endpoint error:", error);
    res.status(500).json({
      success: false,
      error: "AI Chat failed",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * Generate helpful fallback responses when Copilot is not available
 */
function generateFallbackResponse(
  userMessage: string,
  context?: { projectId?: string; action?: string }
): string {
  const lowerMsg = userMessage.toLowerCase();

  // Greeting responses
  if (
    lowerMsg.includes("hello") ||
    lowerMsg.includes("hi") ||
    lowerMsg.includes("hey")
  ) {
    return `Hello! I'm the Zurto AI assistant.

**Note:** For the best AI experience, open this project in VS Code with GitHub Copilot enabled. The copilot-bridge will automatically connect to Copilot for intelligent responses.

How can I help you with your project today?`;
  }

  // Project-related responses
  if (lowerMsg.includes("project") || lowerMsg.includes("help")) {
    return `I can help you with project-related tasks! In Zurto, you can:

1. **Create questionnaires** to gather project requirements
2. **Generate architecture diagrams** with the visual canvas
3. **Manage project nodes** and their relationships
4. **Track project progress** through the dashboard

**Tip:** For AI-powered suggestions, open this project in VS Code with GitHub Copilot.`;
  }

  // Architecture suggestions
  if (
    lowerMsg.includes("architecture") ||
    lowerMsg.includes("structure") ||
    lowerMsg.includes("suggest")
  ) {
    return `For architecture suggestions, I recommend:

1. Start with a **questionnaire** to define requirements
2. Use the **canvas view** to visualize components
3. Create **nodes** for each major component
4. Define **relationships** between nodes

**For AI-powered architecture analysis:** Use VS Code with GitHub Copilot enabled.`;
  }

  // Default response
  return `Thank you for your message!

I'm the Zurto assistant running in fallback mode. For full AI capabilities:

1. Open this project in **VS Code**
2. Ensure **GitHub Copilot** is installed and active
3. The copilot-bridge will automatically connect

In the meantime, I can help with basic project navigation and information.

What would you like to know?`;
}

/**
 * POST /api/ai/analyze-questionnaire
 * Analyze questionnaire responses and generate insights
 */
router.post(
  "/ai/analyze-questionnaire",
  async (req: Request, res: Response) => {
    try {
      const { projectId, questionnaireId } = req.body;

      if (!projectId || !questionnaireId) {
        return res.status(400).json({
          success: false,
          error: "Missing projectId or questionnaireId",
        });
      }

      logger.info(
        `🔍 Analyzing questionnaire ${questionnaireId} for project ${projectId}`
      );

      const db = getDatabase();

      // Get project
      const project = db
        .prepare("SELECT * FROM projects WHERE id = ?")
        .get(projectId) as Project | undefined;

      if (!project) {
        return res
          .status(404)
          .json({ success: false, error: "Project not found" });
      }

      // Get questionnaire
      const questionnaire = db
        .prepare("SELECT * FROM questionnaires WHERE id = ?")
        .get(questionnaireId) as any;

      if (!questionnaire) {
        return res
          .status(404)
          .json({ success: false, error: "Questionnaire not found" });
      }

      // Get answers
      const answers = db
        .prepare("SELECT * FROM answers WHERE questionnaire_id = ?")
        .all(questionnaireId) as QuestionnaireAnswer[];

      // Analyze
      const analysis = await questionnaireAnalyzer.analyzeProjectResponses(
        project.name,
        projectId,
        answers
      );

      logger.info(
        `✅ Analysis complete. Complexity: ${analysis.estimatedComplexity}`
      );

      // Store analysis in project metadata
      const updatedProject = {
        ...project,
        metadata: {
          ...project.metadata,
          aiAnalysis: analysis,
          analysisTimestamp: new Date().toISOString(),
        },
      };

      const now = new Date().toISOString();
      db.prepare(
        "UPDATE projects SET metadata = ?, updated_at = ? WHERE id = ?"
      ).run(JSON.stringify(updatedProject.metadata), now, projectId);

      res.json({
        success: true,
        data: {
          projectId,
          questionnaireId,
          analysis,
        },
      });
    } catch (error) {
      logger.error("❌ Questionnaire analysis failed:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Analysis failed",
      });
    }
  }
);

/**
 * POST /api/ai/generate-tasks
 * Generate planning tasks from analysis
 */
router.post("/ai/generate-tasks", async (req: Request, res: Response) => {
  try {
    const { projectId } = req.body;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        error: "Missing projectId",
      });
    }

    logger.info(`📋 Generating tasks for project ${projectId}`);

    const db = getDatabase();

    // Get project
    const project = db
      .prepare("SELECT * FROM projects WHERE id = ?")
      .get(projectId) as Project | undefined;

    if (!project) {
      return res
        .status(404)
        .json({ success: false, error: "Project not found" });
    }

    // Get stored analysis
    const metadata = (project.metadata as any) || {};
    const analysis = metadata.aiAnalysis;
    if (!analysis) {
      return res.status(400).json({
        success: false,
        error: "No analysis found. Run analyze-questionnaire first.",
      });
    }

    // Generate tasks
    const generatedTasks =
      await taskGenerator.generateTasksFromAnalysis(analysis);

    logger.info(`✅ Generated ${generatedTasks.length} tasks`);

    // Convert to nodes in planning board
    const createdNodes: string[] = [];
    const now = new Date().toISOString();

    for (const task of generatedTasks) {
      const nodeId = uuidv4();
      const nodeData = {
        title: task.title,
        description: task.description,
        priority: task.priority,
        estimatedHours: task.estimatedHours,
        category: task.category,
        dependencies: task.dependencies || [],
        status: "pending",
        createdAt: now,
      };

      db.prepare(
        `INSERT INTO nodes (id, project_id, label, data, position_x, position_y, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      ).run(
        nodeId,
        projectId,
        task.title,
        JSON.stringify(nodeData),
        Math.random() * 500,
        Math.random() * 500,
        now,
        now
      );

      createdNodes.push(nodeId);
    }

    // Store generated tasks in project
    const updatedMetadata = {
      ...metadata,
      generatedTasks,
      generatedTaskNodeIds: createdNodes,
      taskGenerationTimestamp: now,
    };

    db.prepare(
      "UPDATE projects SET metadata = ?, updated_at = ? WHERE id = ?"
    ).run(JSON.stringify(updatedMetadata), now, projectId);

    res.json({
      success: true,
      data: {
        projectId,
        tasksGenerated: generatedTasks.length,
        tasks: generatedTasks,
        nodeIds: createdNodes,
      },
    });
  } catch (error) {
    logger.error("❌ Task generation failed:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Task generation failed",
    });
  }
});

/**
 * POST /api/ai/suggestions
 * Get real-time suggestions for a project
 */
router.post("/ai/suggestions", async (req: Request, res: Response) => {
  try {
    const { projectId } = req.body;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        error: "Missing projectId",
      });
    }

    logger.info(`💡 Getting suggestions for project ${projectId}`);

    const db = getDatabase();

    // Get project
    const project = db
      .prepare("SELECT * FROM projects WHERE id = ?")
      .get(projectId) as Project | undefined;

    if (!project) {
      return res
        .status(404)
        .json({ success: false, error: "Project not found" });
    }

    const metadata = (project.metadata as any) || {};

    // Get suggestions from fallback service (real AI via VS Code Copilot)
    const suggestions = await copilotFallback.getSuggestions({
      projectName: project.name,
      projectType: metadata.projectType || "unknown",
      complexity: metadata.aiAnalysis?.estimatedComplexity || "medium",
      currentTechStack: metadata.aiAnalysis?.techStack || [],
    });

    logger.info(`✅ Generated ${suggestions.length} suggestions`);

    res.json({
      success: true,
      data: {
        projectId,
        suggestions,
        note: "For AI-powered suggestions, use VS Code with Copilot",
      },
    });
  } catch (error) {
    logger.error("❌ Failed to get suggestions:", error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to get suggestions",
    });
  }
});

/**
 * POST /api/ai/insights
 * Generate comprehensive insights from project context
 */
router.post("/ai/insights", async (req: Request, res: Response) => {
  try {
    const { projectId } = req.body;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        error: "Missing projectId",
      });
    }

    logger.info(`🔬 Generating insights for project ${projectId}`);

    const db = getDatabase();

    // Get project
    const project = db
      .prepare("SELECT * FROM projects WHERE id = ?")
      .get(projectId) as Project | undefined;

    if (!project) {
      return res
        .status(404)
        .json({ success: false, error: "Project not found" });
    }

    const metadata = (project.metadata as any) || {};
    const analysis = metadata.aiAnalysis;

    if (!analysis) {
      return res.status(400).json({
        success: false,
        error: "No analysis found. Run analyze-questionnaire first.",
      });
    }

    // Generate insights
    const insights = await insightsEngine.generateInsights({
      projectName: project.name,
      projectType: metadata.projectType || "general",
      complexity: analysis.estimatedComplexity || "medium",
      techStack: [
        ...(analysis.techStack?.frontend || []),
        ...(analysis.techStack?.backend || []),
        ...(analysis.techStack?.database || []),
      ],
    });

    logger.info(`✅ Generated ${insights.length} insights`);

    res.json({
      success: true,
      data: {
        projectId,
        insights,
      },
    });
  } catch (error) {
    logger.error("❌ Failed to generate insights:", error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to generate insights",
    });
  }
});

/**
 * GET /api/ai/insights/architecture
 * Get architecture recommendations
 */
router.get("/ai/insights/architecture", async (req: Request, res: Response) => {
  try {
    const { projectId } = req.query;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        error: "Missing projectId query parameter",
      });
    }

    logger.info(
      `🏗️ Getting architecture recommendations for project ${projectId}`
    );

    const db = getDatabase();

    // Get project
    const project = db
      .prepare("SELECT * FROM projects WHERE id = ?")
      .get(projectId as string) as Project | undefined;

    if (!project) {
      return res
        .status(404)
        .json({ success: false, error: "Project not found" });
    }

    const metadata = (project.metadata as any) || {};
    const analysis = metadata.aiAnalysis;

    if (!analysis) {
      return res.status(400).json({
        success: false,
        error: "No analysis found. Run analyze-questionnaire first.",
      });
    }

    // Get recommendations
    const recommendations = await insightsEngine.getArchitectureRecommendations(
      analysis.techStack
    );

    logger.info(
      `✅ Generated ${recommendations.length} architecture recommendations`
    );

    res.json({
      success: true,
      data: {
        projectId,
        recommendations,
      },
    });
  } catch (error) {
    logger.error("❌ Failed to get architecture recommendations:", error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to get recommendations",
    });
  }
});

/**
 * GET /api/ai/insights/performance
 * Get performance optimization suggestions
 */
router.get("/ai/insights/performance", async (req: Request, res: Response) => {
  try {
    const { projectId } = req.query;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        error: "Missing projectId query parameter",
      });
    }

    logger.info(`⚡ Getting performance suggestions for project ${projectId}`);

    const db = getDatabase();

    // Get project
    const project = db
      .prepare("SELECT * FROM projects WHERE id = ?")
      .get(projectId as string) as Project | undefined;

    if (!project) {
      return res
        .status(404)
        .json({ success: false, error: "Project not found" });
    }

    const metadata = (project.metadata as any) || {};
    const analysis = metadata.aiAnalysis;
    const complexity = analysis?.estimatedComplexity || "medium";

    // Get recommendations
    const optimizations =
      insightsEngine.getPerformanceOptimizations(complexity);

    logger.info(
      `✅ Generated ${optimizations.length} performance optimizations`
    );

    res.json({
      success: true,
      data: {
        projectId,
        complexity,
        optimizations,
      },
    });
  } catch (error) {
    logger.error("❌ Failed to get performance suggestions:", error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to get suggestions",
    });
  }
});

/**
 * GET /api/ai/insights/security
 * Get security recommendations
 */
router.get("/ai/insights/security", async (req: Request, res: Response) => {
  try {
    logger.info("🔒 Getting security recommendations");

    const recommendations = insightsEngine.getSecurityRecommendations();

    logger.info(
      `✅ Generated ${recommendations.length} security recommendations`
    );

    res.json({
      success: true,
      data: {
        recommendations,
      },
    });
  } catch (error) {
    logger.error("❌ Failed to get security recommendations:", error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to get recommendations",
    });
  }
});

/**
 * GET /api/ai/insights/testing
 * Get testing strategy recommendations
 */
router.get("/ai/insights/testing", async (req: Request, res: Response) => {
  try {
    const { projectId } = req.query;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        error: "Missing projectId query parameter",
      });
    }

    logger.info(`🧪 Getting testing strategy for project ${projectId}`);

    const db = getDatabase();

    // Get project
    const project = db
      .prepare("SELECT * FROM projects WHERE id = ?")
      .get(projectId as string) as Project | undefined;

    if (!project) {
      return res
        .status(404)
        .json({ success: false, error: "Project not found" });
    }

    const metadata = (project.metadata as any) || {};
    const analysis = metadata.aiAnalysis;
    const complexity = analysis?.estimatedComplexity || "medium";

    // Get testing strategy
    const strategy = insightsEngine.getTestingStrategy(complexity);

    logger.info(`✅ Generated testing strategy for ${complexity} complexity`);

    res.json({
      success: true,
      data: {
        projectId,
        complexity,
        strategy,
      },
    });
  } catch (error) {
    logger.error("❌ Failed to get testing strategy:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to get strategy",
    });
  }
});

/**
 * POST /api/ai/copilot
 * Copilot bridge for AI-assisted canvas operations
 */
router.post("/ai/copilot", async (req: Request, res: Response) => {
  try {
    const { projectId, action, context, prompt } = req.body;

    if (!action) {
      return res.status(400).json({
        success: false,
        error: "Missing action parameter",
      });
    }

    logger.info(`🤖 Copilot action: ${action} for project ${projectId}`);

    const db = getDatabase();
    let project = null;
    let nodes: any[] = [];
    let relationships: any[] = [];

    // Load project context if available
    if (projectId) {
      project = db
        .prepare("SELECT * FROM projects WHERE id = ?")
        .get(projectId);
      nodes = db
        .prepare("SELECT * FROM nodes WHERE project_id = ?")
        .all(projectId) as any[];
      relationships = db
        .prepare("SELECT * FROM relationships WHERE project_id = ?")
        .all(projectId) as any[];
    }

    let response: any = null;

    switch (action) {
      case "suggest-nodes":
        // Fallback suggestions (real AI via VS Code Copilot)
        response = await copilotFallback.ask({
          prompt:
            prompt ||
            "Suggest 3-5 additional nodes that would benefit this project architecture.",
          systemContext: `Project: ${project?.name || "Unknown"}. Current nodes: ${nodes.map((n) => n.label).join(", ") || "None"}.`,
          maxTokens: 1000,
        });
        break;

      case "analyze-architecture":
        // Fallback analysis (real AI via VS Code Copilot)
        response = await copilotFallback.ask({
          prompt:
            prompt ||
            "Analyze this project architecture and provide improvement suggestions.",
          systemContext: `Project: ${project?.name || "Unknown"}. Nodes: ${nodes.length}. Connections: ${relationships.length}.`,
          maxTokens: 2000,
        });
        break;

      case "generate-description":
        // Fallback description generation
        const { nodeName, nodeType } = context || {};
        response = await copilotFallback.ask({
          prompt: `Generate a brief description for a ${nodeType || "component"} named "${nodeName || "Service"}".`,
          systemContext: `Technical documentation context.`,
          maxTokens: 200,
        });
        break;

      case "suggest-connections":
        // Fallback connection suggestions
        response = await copilotFallback.ask({
          prompt: prompt || "Suggest logical connections between these nodes.",
          systemContext: `Nodes: ${JSON.stringify(nodes.map((n) => ({ id: n.id, label: n.label, type: n.type })))}`,
          maxTokens: 1000,
        });
        break;

      case "chat":
        // General chat with project context
        response = await copilotFallback.ask({
          prompt: prompt || "What can I help you with?",
          systemContext: `Zurto project manager. Project: ${project?.name || "Unknown"}. Nodes: ${nodes.length}.`,
          maxTokens: 2000,
        });
        break;

      default:
        return res.status(400).json({
          success: false,
          error: `Unknown action: ${action}`,
        });
    }

    logger.info(`✅ Copilot ${action} completed`);

    res.json({
      success: true,
      data: {
        action,
        projectId,
        response: response?.text || response?.content || response,
        usage: response?.usage,
      },
    });
  } catch (error) {
    logger.error("❌ Copilot error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Copilot request failed",
    });
  }
});

/**
 * GET /api/ai/copilot/status
 * Check Copilot availability
 */
router.get("/ai/copilot/status", async (req: Request, res: Response) => {
  try {
    const status = {
      available: true,
      model: "claude-3-5-sonnet-20241022",
      features: [
        "suggest-nodes",
        "analyze-architecture",
        "generate-description",
        "suggest-connections",
        "chat",
      ],
      rateLimits: {
        requestsPerMinute: 60,
        tokensPerMinute: 100000,
      },
    };

    res.json({
      success: true,
      data: status,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to get Copilot status",
    });
  }
});

/**
 * POST /api/ai/generate-planning
 * Generate comprehensive planning documents from questionnaire analysis
 * Creates a Planning node with MD files instead of individual feature nodes
 */
router.post("/ai/generate-planning", async (req: Request, res: Response) => {
  try {
    const { projectId, projectPlan, questionsAndAnswers, analysis } = req.body;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        error: "Missing projectId",
      });
    }

    logger.info(`📝 Generating planning documents for project ${projectId}`);

    const db = getDatabase();

    // Get project
    const project = db
      .prepare("SELECT * FROM projects WHERE id = ?")
      .get(projectId) as Project | undefined;

    if (!project) {
      return res
        .status(404)
        .json({ success: false, error: "Project not found" });
    }

    // Import the planning generator agent dynamically
    const { planningGeneratorAgent } =
      await import("../agents/planning-generator-agent.js");

    // Generate planning documents
    const planningOutput =
      await planningGeneratorAgent.generatePlanningDocuments({
        projectName: project.name,
        projectDescription: project.description || "",
        projectType: "general", // Project type not stored in DB, use general
        questionsAndAnswers: questionsAndAnswers || [],
        analysis: analysis || {
          understanding: "",
          gaps: [],
          confidence: 0,
        },
        projectPlan: projectPlan || {
          summary: "",
          features: [],
          architecture: "",
          techStack: [],
          estimatedComplexity: "medium",
        },
      });

    logger.info(
      `✅ Generated ${planningOutput.documents.length} documents and ${planningOutput.suggestedNodes.length} suggested nodes`
    );

    // Create actual project folder structure on disk
    const teamName = "default"; // TODO: Get from user/project context
    const sanitizedProjectName = project.name
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-");
    const projectPath = path.join(
      "/app/data/projects",
      teamName,
      sanitizedProjectName
    );
    const docsPath = path.join(projectPath, "docs");

    // Create folder structure
    try {
      fs.mkdirSync(projectPath, { recursive: true });
      fs.mkdirSync(docsPath, { recursive: true });

      // Create suggested folder structure from planning
      for (const folder of planningOutput.projectStructure.folders) {
        fs.mkdirSync(path.join(projectPath, folder), { recursive: true });
      }

      // Write all planning documents to disk
      for (const doc of planningOutput.documents) {
        const docFilePath = path.join(docsPath, doc.filename);
        fs.writeFileSync(docFilePath, doc.content, "utf-8");
        logger.info(`📄 Created: ${docFilePath}`);
      }

      logger.info(`📁 Created project folder structure at: ${projectPath}`);
    } catch (fsError) {
      logger.error("Failed to create project folders:", fsError);
      // Continue anyway - files will be stored in DB
    }

    const now = new Date().toISOString();

    // Create the planning node
    const planningNodeId = uuidv4();
    db.prepare(
      `INSERT INTO nodes (id, project_id, name, type, description, status, position_x, position_y, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      planningNodeId,
      projectId,
      planningOutput.planningNode.name,
      "planning",
      planningOutput.planningNode.description,
      "active",
      400, // Center position
      200,
      now,
      now
    );

    // Store planning documents as child nodes (files)
    const documentNodeIds: string[] = [];
    for (let i = 0; i < planningOutput.documents.length; i++) {
      const doc = planningOutput.documents[i];
      const docNodeId = uuidv4();

      db.prepare(
        `INSERT INTO nodes (id, project_id, parent_id, name, type, description, status, position_x, position_y, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).run(
        docNodeId,
        projectId,
        planningNodeId, // Parent is the planning node
        doc.filename,
        "file",
        doc.content.substring(0, 500) + "...", // Store preview in description
        "active",
        200 + i * 150, // Spread out horizontally
        350,
        now,
        now
      );

      // Store full content in planning_node_contents table
      db.prepare(
        `INSERT INTO planning_node_contents (id, node_id, filename, content, content_type, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).run(uuidv4(), docNodeId, doc.filename, doc.content, doc.type, now, now);

      // Create connection from planning node to document node
      const connectionId = uuidv4();
      db.prepare(
        `INSERT INTO node_relationships (id, project_id, source_node_id, target_node_id, relationship_type, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`
      ).run(
        connectionId,
        projectId,
        planningNodeId,
        docNodeId,
        "child_of",
        now
      );

      documentNodeIds.push(docNodeId);
    }

    // Update project metadata with planning info
    const updatedMetadata = {
      ...((project.metadata as object) || {}),
      planningNodeId,
      planningDocuments: documentNodeIds,
      suggestedNodes: planningOutput.suggestedNodes,
      projectStructure: planningOutput.projectStructure,
      planningGeneratedAt: now,
      projectPath, // Store actual project path on disk
      teamName,
    };

    db.prepare(
      "UPDATE projects SET metadata = ?, updated_at = ? WHERE id = ?"
    ).run(JSON.stringify(updatedMetadata), now, projectId);

    res.json({
      success: true,
      data: {
        projectId,
        planningNodeId,
        projectPath,
        documents: planningOutput.documents.map((d) => ({
          filename: d.filename,
          type: d.type,
        })),
        suggestedNodes: planningOutput.suggestedNodes,
        projectStructure: planningOutput.projectStructure,
      },
    });
  } catch (error) {
    logger.error("❌ Planning generation failed:", error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : "Planning generation failed",
    });
  }
});

/**
 * POST /api/ai/generate-code
 * Generate project code from planning documents
 * Creates actual source files in /data/projects/teamName/projectName/
 */
router.post("/ai/generate-code", async (req: Request, res: Response) => {
  try {
    const { projectId } = req.body;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        error: "Missing projectId",
      });
    }

    logger.info(`💻 Generating code for project ${projectId}`);

    const db = getDatabase();

    // Get project
    const project = db
      .prepare("SELECT * FROM projects WHERE id = ?")
      .get(projectId) as Project | undefined;

    if (!project) {
      return res
        .status(404)
        .json({ success: false, error: "Project not found" });
    }

    const metadata = (project.metadata as Record<string, any>) || {};

    let planningDocuments: Array<{
      filename: string;
      content: string;
      type: string;
    }> = [];

    // Try to get planning documents from database first
    if (metadata.planningNodeId) {
      const planningDocNodes = db
        .prepare("SELECT * FROM nodes WHERE parent_id = ?")
        .all(metadata.planningNodeId) as any[];

      if (planningDocNodes.length > 0) {
        const planningDocContents = db
          .prepare(
            `SELECT * FROM planning_node_contents WHERE node_id IN (${planningDocNodes.map(() => "?").join(",")})`
          )
          .all(...planningDocNodes.map((n) => n.id)) as any[];

        planningDocuments = planningDocContents.map((doc) => ({
          filename: doc.filename,
          content: doc.content,
          type: doc.content_type,
        }));
      }
    }

    // Fallback: Read planning documents from filesystem if DB is empty
    if (planningDocuments.length === 0) {
      // Determine project path - use stored path or construct it
      let projectPath = metadata.projectPath;
      if (!projectPath) {
        const teamName = metadata.teamName || "default";
        const sanitizedProjectName = project.name
          .toLowerCase()
          .replace(/[^a-z0-9-]/g, "-");
        projectPath = path.join(
          "/app/data/projects",
          teamName,
          sanitizedProjectName
        );
      }

      const docsPath = path.join(projectPath, "docs");
      logger.info(`📂 Looking for planning docs in: ${docsPath}`);

      try {
        if (fs.existsSync(docsPath)) {
          const mdFiles = fs
            .readdirSync(docsPath)
            .filter((f: string) => f.endsWith(".md"));
          logger.info(
            `📄 Found ${mdFiles.length} planning documents: ${mdFiles.join(", ")}`
          );

          for (const filename of mdFiles) {
            const filePath = path.join(docsPath, filename);
            const content = fs.readFileSync(filePath, "utf-8");
            planningDocuments.push({
              filename,
              content,
              type: "markdown",
            });
          }
        }
      } catch (fsError) {
        logger.error("Failed to read planning docs from filesystem:", fsError);
      }
    }

    // If still no planning documents, return error
    if (planningDocuments.length === 0) {
      return res.status(400).json({
        success: false,
        error:
          "No planning documents found. Run generate-planning first or add .md files to the docs folder.",
      });
    }

    logger.info(
      `✅ Loaded ${planningDocuments.length} planning documents for code generation`
    );

    // Import the code generation agent
    const { codeGenerationAgent } =
      await import("../agents/code-generation-agent.js");

    // Determine project path - use stored path or construct it
    let projectPath = metadata.projectPath;
    if (!projectPath) {
      const teamName = metadata.teamName || "default";
      const sanitizedProjectName = project.name
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "-");
      projectPath = path.join(
        "/app/data/projects",
        teamName,
        sanitizedProjectName
      );
    }

    logger.info(`📁 Using project path for code generation: ${projectPath}`);

    // Generate code
    const result = await codeGenerationAgent.generateProjectCode({
      projectId,
      projectName: project.name,
      teamName: metadata.teamName || "default",
      projectPath, // Pass existing path
      planningDocuments,
      suggestedNodes: metadata.suggestedNodes || [],
      projectStructure: metadata.projectStructure || {
        folders: [],
        entryPoints: {},
      },
    });

    const now = new Date().toISOString();

    // Update project metadata - only essential info (no node configs - handled separately)
    const updatedMetadata = {
      planningNodeId: metadata.planningNodeId,
      teamName: metadata.teamName || "default",
      codeGenerated: true,
      codeGeneratedAt: now,
      projectPath: result.projectPath,
    };

    db.prepare(
      "UPDATE projects SET metadata = ?, updated_at = ? WHERE id = ?"
    ).run(JSON.stringify(updatedMetadata), now, projectId);

    logger.info(
      `✅ Code generation complete: ${result.generatedFiles.length} files at ${result.projectPath}`
    );

    res.json({
      success: true,
      data: {
        projectId,
        projectPath: result.projectPath,
        files: result.generatedFiles.map((f) => f.path).slice(0, 100),
        generatedFiles: result.generatedFiles.length,
        progressLog: result.progressLog || [], // Include progress log for UI terminal display
      },
    });
  } catch (error) {
    // Safely extract error message - don't log entire error object
    let errorMessage = "Code generation failed";
    if (error instanceof Error) {
      errorMessage = error.message;
      logger.error(`❌ Code generation failed: ${error.message}`);
    } else if (typeof error === "string") {
      errorMessage = error;
      logger.error(`❌ Code generation failed: ${error}`);
    } else {
      logger.error("❌ Code generation failed with unknown error");
    }
    res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
});

/**
 * POST /api/ai/deploy-project
 * Deploy all nodes for a project using docker-compose
 */
router.post("/ai/deploy-project", async (req: Request, res: Response) => {
  try {
    const { projectId, environment } = req.body;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        error: "Missing projectId",
      });
    }

    logger.info(`🚀 Deploying project ${projectId}`);

    const db = getDatabase();

    // Get project
    const project = db
      .prepare("SELECT * FROM projects WHERE id = ?")
      .get(projectId) as Project | undefined;

    if (!project) {
      return res
        .status(404)
        .json({ success: false, error: "Project not found" });
    }

    const metadata = (project.metadata as Record<string, any>) || {};

    // Determine project path - use stored path or construct it
    let projectPath = metadata.projectPath;
    if (!projectPath) {
      const teamName = metadata.teamName || "default";
      const sanitizedProjectName = project.name
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "-");
      projectPath = path.join(
        "/app/data/projects",
        teamName,
        sanitizedProjectName
      );
    }

    // Check if project has code - either via flag or by checking filesystem
    let hasCode = metadata.codeGenerated === true;

    // Also check if project folder exists with source files
    if (!hasCode && projectPath) {
      try {
        if (fs.existsSync(projectPath)) {
          // Check for common code indicators
          const hasDockerCompose = fs.existsSync(
            path.join(projectPath, "docker-compose.yml")
          );
          const hasPackageJson = fs.existsSync(
            path.join(projectPath, "package.json")
          );
          const hasSrcFolder = fs.existsSync(path.join(projectPath, "src"));
          const hasBackendFolder = fs.existsSync(
            path.join(projectPath, "backend")
          );
          const hasFrontendFolder = fs.existsSync(
            path.join(projectPath, "frontend")
          );

          hasCode =
            hasDockerCompose ||
            hasPackageJson ||
            hasSrcFolder ||
            hasBackendFolder ||
            hasFrontendFolder;

          if (hasCode) {
            logger.info(`📁 Found existing code at: ${projectPath}`);
          }
        }
      } catch (fsError) {
        logger.warn("Failed to check filesystem for code:", fsError);
      }
    }

    if (!hasCode) {
      return res.status(400).json({
        success: false,
        error: "No code generated. Run generate-code first.",
      });
    }

    logger.info(`📁 Using project path for deployment: ${projectPath}`);

    // Get node configs from metadata
    let nodeConfigs = metadata.nodeConfigs || [];

    // If no node configs in metadata, try to get from generated nodes
    if (
      nodeConfigs.length === 0 &&
      metadata.generatedNodeIds &&
      metadata.generatedNodeIds.length > 0
    ) {
      const generatedNodes = db
        .prepare(
          "SELECT * FROM nodes WHERE id IN (" +
            metadata.generatedNodeIds.map(() => "?").join(",") +
            ")"
        )
        .all(...metadata.generatedNodeIds) as any[];

      for (const node of generatedNodes) {
        if (node && node.name) {
          nodeConfigs.push({
            nodeId: node.id,
            name: node.name,
            type: node.type || "service",
            dockerfile: `docker/Dockerfile.${node.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
            entryPoint: "src/index.ts",
          });
        }
      }
    }

    // If still no node configs, create default based on project structure
    if (nodeConfigs.length === 0) {
      logger.info(
        "No node configs found, checking project structure for services..."
      );

      // Check for common service folders
      const serviceFolders = [
        "backend",
        "frontend",
        "api",
        "web",
        "server",
        "client",
      ];
      for (const folder of serviceFolders) {
        const folderPath = path.join(projectPath, folder);
        if (fs.existsSync(folderPath)) {
          nodeConfigs.push({
            nodeId: folder,
            name: folder,
            type:
              folder === "frontend" || folder === "client" || folder === "web"
                ? "frontend"
                : "backend",
            dockerfile: `Dockerfile.${folder}`,
            entryPoint: `${folder}/src/index.ts`,
          });
        }
      }

      // If project has a single service structure (no subfolders)
      if (
        nodeConfigs.length === 0 &&
        fs.existsSync(path.join(projectPath, "package.json"))
      ) {
        nodeConfigs.push({
          nodeId: "main",
          name: project.name || "app",
          type: "backend",
          dockerfile: "Dockerfile",
          entryPoint: "src/index.ts",
        });
      }
    }

    // Import the deploy agent
    const { deployAgent } = await import("../agents/deploy-agent.js");

    // Deploy using docker-compose (simplified - no node creation)
    const result = await deployAgent.deployProject({
      projectId,
      projectName: project.name,
      projectPath: projectPath,
      nodeConfigs, // Still needed for docker-compose services
      environment: environment || "development",
    });

    const now = new Date().toISOString();

    // Update project metadata - simplified, no node creation
    const updatedMetadata = {
      planningNodeId: metadata.planningNodeId,
      teamName: metadata.teamName || "default",
      codeGenerated: metadata.codeGenerated,
      projectPath: projectPath,
      deployed: result.success,
      deployedAt: now,
      deployEnvironment: environment || "development",
    };

    db.prepare(
      "UPDATE projects SET status = ?, metadata = ?, updated_at = ? WHERE id = ?"
    ).run(
      result.success ? "running" : "error",
      JSON.stringify(updatedMetadata),
      now,
      projectId
    );

    logger.info(
      `🚀 Deployment ${result.success ? "successful" : "failed"} for ${project.name}`
    );

    res.json({
      success: result.success,
      data: {
        projectId,
        projectPath,
        deployed: result.success,
        services: result.nodes?.length || 0,
        output: result.dockerComposeOutput,
      },
    });
  } catch (error) {
    logger.error("❌ Deployment failed:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Deployment failed",
    });
  }
});

/**
 * POST /api/ai/stop-project
 * Stop all containers for a project
 */
router.post("/ai/stop-project", async (req: Request, res: Response) => {
  try {
    const { projectId } = req.body;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        error: "Missing projectId",
      });
    }

    const db = getDatabase();

    const project = db
      .prepare("SELECT * FROM projects WHERE id = ?")
      .get(projectId) as Project | undefined;

    if (!project) {
      return res
        .status(404)
        .json({ success: false, error: "Project not found" });
    }

    const metadata = (project.metadata as Record<string, any>) || {};

    if (!metadata.projectPath) {
      return res.status(400).json({
        success: false,
        error: "Project has no deployment path",
      });
    }

    const { deployAgent } = await import("../agents/deploy-agent.js");
    const result = await deployAgent.stopProject(metadata.projectPath);

    const now = new Date().toISOString();

    // Update project status
    db.prepare(
      "UPDATE projects SET status = ?, updated_at = ? WHERE id = ?"
    ).run("stopped", now, projectId);

    // Update all node statuses
    db.prepare(
      "UPDATE nodes SET status = ?, updated_at = ? WHERE project_id = ?"
    ).run("stopped", now, projectId);

    res.json({
      success: result.success,
      data: { output: result.output },
    });
  } catch (error) {
    logger.error("❌ Stop project failed:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Stop failed",
    });
  }
});

/**
 * GET /api/ai/project-files/:projectId
 * Get file tree for a generated project
 */
router.get(
  "/ai/project-files/:projectId",
  async (req: Request, res: Response) => {
    try {
      const { projectId } = req.params;

      const db = getDatabase();
      const project = db
        .prepare("SELECT * FROM projects WHERE id = ?")
        .get(projectId) as Project | undefined;

      if (!project) {
        return res
          .status(404)
          .json({ success: false, error: "Project not found" });
      }

      const metadata = (project.metadata as Record<string, any>) || {};

      if (!metadata.projectPath) {
        return res.status(400).json({
          success: false,
          error: "Project has no generated code path",
        });
      }

      const fs = await import("fs");
      const path = await import("path");

      interface FileNode {
        name: string;
        path: string;
        type: "file" | "directory";
        children?: FileNode[];
      }

      const buildFileTree = (
        dirPath: string,
        basePath: string = ""
      ): FileNode[] => {
        try {
          const items = fs.readdirSync(dirPath);
          const nodes: FileNode[] = [];

          for (const item of items) {
            // Skip node_modules and .git
            if (item === "node_modules" || item === ".git") continue;

            const fullPath = path.join(dirPath, item);
            const relativePath = basePath ? `${basePath}/${item}` : item;
            const stats = fs.statSync(fullPath);

            if (stats.isDirectory()) {
              nodes.push({
                name: item,
                path: relativePath,
                type: "directory",
                children: buildFileTree(fullPath, relativePath),
              });
            } else {
              nodes.push({
                name: item,
                path: relativePath,
                type: "file",
              });
            }
          }

          // Sort: directories first, then files
          return nodes.sort((a, b) => {
            if (a.type === b.type) return a.name.localeCompare(b.name);
            return a.type === "directory" ? -1 : 1;
          });
        } catch {
          return [];
        }
      };

      const fileTree = buildFileTree(metadata.projectPath);

      res.json({
        success: true,
        data: {
          projectPath: metadata.projectPath,
          fileTree,
        },
      });
    } catch (error) {
      logger.error("❌ Failed to get project files:", error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to get project files",
      });
    }
  }
);

/**
 * GET /api/ai/project-file/:projectId
 * Read a specific file from the generated project
 */
router.get(
  "/ai/project-file/:projectId",
  async (req: Request, res: Response) => {
    try {
      const { projectId } = req.params;
      const { filePath } = req.query;

      if (!filePath || typeof filePath !== "string") {
        return res.status(400).json({
          success: false,
          error: "Missing filePath query parameter",
        });
      }

      const db = getDatabase();
      const project = db
        .prepare("SELECT * FROM projects WHERE id = ?")
        .get(projectId) as Project | undefined;

      if (!project) {
        return res
          .status(404)
          .json({ success: false, error: "Project not found" });
      }

      const metadata = (project.metadata as Record<string, any>) || {};

      if (!metadata.projectPath) {
        return res.status(400).json({
          success: false,
          error: "Project has no generated code path",
        });
      }

      const fs = await import("fs");
      const path = await import("path");

      // Prevent directory traversal attacks
      const normalizedPath = path
        .normalize(filePath)
        .replace(/^(\.\.[\/\\])+/, "");
      const fullPath = path.join(metadata.projectPath, normalizedPath);

      // Ensure the path is within the project directory
      if (!fullPath.startsWith(metadata.projectPath)) {
        return res.status(403).json({
          success: false,
          error: "Access denied",
        });
      }

      if (!fs.existsSync(fullPath)) {
        return res.status(404).json({
          success: false,
          error: "File not found",
        });
      }

      const stats = fs.statSync(fullPath);
      if (stats.isDirectory()) {
        return res.status(400).json({
          success: false,
          error: "Path is a directory, not a file",
        });
      }

      const content = fs.readFileSync(fullPath, "utf-8");
      const ext = path.extname(fullPath).slice(1);

      // Determine language from extension
      const languageMap: Record<string, string> = {
        ts: "typescript",
        tsx: "typescriptreact",
        js: "javascript",
        jsx: "javascriptreact",
        json: "json",
        md: "markdown",
        yml: "yaml",
        yaml: "yaml",
        html: "html",
        css: "css",
        scss: "scss",
        py: "python",
        sh: "shellscript",
        dockerfile: "dockerfile",
        env: "dotenv",
      };

      res.json({
        success: true,
        data: {
          filePath: normalizedPath,
          content,
          language: languageMap[ext.toLowerCase()] || "plaintext",
          size: stats.size,
          modifiedAt: stats.mtime,
        },
      });
    } catch (error) {
      logger.error("❌ Failed to read project file:", error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to read project file",
      });
    }
  }
);

export default router;
