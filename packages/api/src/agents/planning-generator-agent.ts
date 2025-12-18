/**
 * Planning Generator Agent
 *
 * Uses Copilot Bridge to generate comprehensive planning documents
 * Creates a Planning node with MD files (README, ARCHITECTURE, DEPLOY, etc.)
 * instead of individual feature nodes
 */

import { logger } from "../utils/logger.js";
import { getCopilotBridge } from "./copilot-bridge-client.js";

export interface ProjectPlanRequest {
  projectName: string;
  projectDescription: string;
  projectType?: string;
  questionsAndAnswers: Array<{
    question: string;
    category: string;
    answer: unknown;
  }>;
  analysis: {
    understanding: string;
    gaps: string[];
    confidence: number;
  };
  projectPlan: {
    summary: string;
    features: string[];
    architecture: string;
    techStack: string[];
    estimatedComplexity: "low" | "medium" | "high";
  };
}

export interface PlanningDocument {
  filename: string;
  content: string;
  type: "readme" | "architecture" | "deploy" | "api" | "database" | "structure";
}

export interface PlanningNodeOutput {
  planningNode: {
    name: string;
    type: "planning";
    description: string;
  };
  documents: PlanningDocument[];
  suggestedNodes: Array<{
    name: string;
    type:
      | "backend"
      | "frontend"
      | "database"
      | "api"
      | "discord-bot"
      | "utility";
    description: string;
    port?: number;
    techStack: string[];
    dependencies: string[];
  }>;
  projectStructure: {
    folders: string[];
    entryPoints: Record<string, string>;
  };
}

export class PlanningGeneratorAgent {
  /**
   * Generate complete planning documents from questionnaire analysis
   */
  async generatePlanningDocuments(
    request: ProjectPlanRequest
  ): Promise<PlanningNodeOutput> {
    logger.info(
      `[PlanningGeneratorAgent] Generating planning documents for: ${request.projectName}`
    );

    // Get fresh bridge connection
    const bridge = getCopilotBridge();
    if (!bridge) {
      throw new Error(
        "Copilot Bridge not connected. Please ensure VS Code is running with Copilot Bridge extension."
      );
    }

    // Verify bridge is available
    const isAvailable = await bridge.isAvailable();
    if (!isAvailable) {
      throw new Error(
        "Copilot Bridge not responding. Check VS Code and bridge status."
      );
    }

    logger.info(
      "[PlanningGeneratorAgent] Copilot Bridge connected successfully"
    );

    const systemPrompt = `You are an expert project architect. Generate CONCISE planning documentation for a software project.

Create these Markdown documents (keep each under 500 words):
1. **README.md** - Brief overview, tech stack, quick start
2. **ARCHITECTURE.md** - Simple component diagram, data flow
3. **DEPLOY.md** - Docker setup, essential env vars
4. **STRUCTURE.md** - Folder structure

IMPORTANT: Keep responses SHORT and focused. No verbose explanations.`;

    const userPrompt = `Create CONCISE planning docs for:

**Project:** ${request.projectName}
**Type:** ${request.projectType || "General"}
**Description:** ${request.projectDescription}

**Key Features:** ${request.projectPlan.features.slice(0, 5).join(", ")}
**Tech Stack:** ${request.projectPlan.techStack.join(", ")}
**Complexity:** ${request.projectPlan.estimatedComplexity}

Return ONLY this JSON (keep content SHORT - max 500 words per document):
{
  "planningNode": {
    "name": "${request.projectName} Planning",
    "type": "planning",
    "description": "Project planning documentation"
  },
  "documents": [
    {"filename": "README.md", "content": "# ${request.projectName}\\n\\n## Overview\\n...", "type": "readme"},
    {"filename": "ARCHITECTURE.md", "content": "# Architecture\\n\\n## Components\\n...", "type": "architecture"},
    {"filename": "DEPLOY.md", "content": "# Deployment\\n\\n## Docker\\n...", "type": "deploy"},
    {"filename": "STRUCTURE.md", "content": "# Structure\\n\\n## Folders\\n...", "type": "structure"}
  ],
  "suggestedNodes": [
    {"name": "Backend", "type": "backend", "description": "API server", "techStack": [], "dependencies": []},
    {"name": "Frontend", "type": "frontend", "description": "Web app", "techStack": [], "dependencies": ["backend"]}
  ],
  "projectStructure": {
    "folders": ["src", "public", "docker"],
    "entryPoints": {"main": "src/index.ts"}
  }
}

CRITICAL: Response MUST be under 4000 tokens. Be concise!`;

    try {
      const response = await bridge.chat([
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ]);

      const result = this.parsePlanningResponse(response);
      logger.info(
        `[PlanningGeneratorAgent] Generated ${result.documents.length} documents and ${result.suggestedNodes.length} suggested nodes`
      );
      return result;
    } catch (error) {
      logger.error(
        "[PlanningGeneratorAgent] Failed to generate planning documents:",
        error
      );
      throw error;
    }
  }

  /**
   * Parse planning response from Copilot
   */
  private parsePlanningResponse(response: string): PlanningNodeOutput {
    try {
      // Try to extract JSON object from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON object found in response");
      }

      const parsed = JSON.parse(jsonMatch[0]);

      // Validate required fields
      if (!parsed.planningNode || !parsed.documents) {
        throw new Error("Missing required fields in response");
      }

      // Normalize documents
      const documents: PlanningDocument[] = (parsed.documents || []).map(
        (doc: any) => ({
          filename: doc.filename || "UNKNOWN.md",
          content: doc.content || "",
          type: doc.type || "readme",
        })
      );

      // Normalize suggested nodes
      const suggestedNodes = (parsed.suggestedNodes || []).map((node: any) => ({
        name: node.name || "Unknown",
        type: node.type || "utility",
        description: node.description || "",
        port: node.port,
        techStack: node.techStack || [],
        dependencies: node.dependencies || [],
      }));

      // Normalize project structure
      const projectStructure = {
        folders: parsed.projectStructure?.folders || [],
        entryPoints: parsed.projectStructure?.entryPoints || {},
      };

      return {
        planningNode: {
          name: parsed.planningNode.name || "Project Planning",
          type: "planning",
          description:
            parsed.planningNode.description || "Project planning documentation",
        },
        documents,
        suggestedNodes,
        projectStructure,
      };
    } catch (error) {
      logger.error(
        "[PlanningGeneratorAgent] Failed to parse planning response:",
        error
      );
      logger.debug("Raw response:", response);
      throw new Error(`Failed to parse planning response: ${error}`);
    }
  }
}

export const planningGeneratorAgent = new PlanningGeneratorAgent();
