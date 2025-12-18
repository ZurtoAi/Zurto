/**
 * Copilot Questionnaire Generator
 *
 * Uses copilot-bridge to generate AI-powered questionnaires
 * Falls back to static questions if Copilot is unavailable
 */

import { logger } from "../utils/logger.js";
import { getCopilotBridge } from "./copilot-bridge-client.js";

export interface QuestionnaireQuestion {
  id: string;
  category: string;
  question: string;
  type: "text" | "select" | "multiselect" | "boolean";
  options?: string[];
  required: boolean;
  placeholder?: string;
  hint?: string;
}

export interface GenerateQuestionsRequest {
  projectDescription: string;
  projectName?: string;
  projectType?: string;
}

export class CopilotQuestionnaireGenerator {
  /**
   * Generate questionnaire questions using Copilot
   */
  async generateQuestions(
    request: GenerateQuestionsRequest
  ): Promise<QuestionnaireQuestion[]> {
    logger.info(`[CopilotQuestionnaire] Generating questions for project`);

    // Try Copilot first - get fresh connection
    const bridge = getCopilotBridge();
    if (bridge) {
      try {
        // Check if bridge is available
        const isAvailable = await bridge.isAvailable();
        if (isAvailable) {
          logger.info(
            "[CopilotQuestionnaire] Attempting to generate with Copilot Bridge"
          );
          return await this.generateWithCopilot(request, bridge);
        } else {
          logger.warn("[CopilotQuestionnaire] Copilot Bridge not responding");
        }
      } catch (error) {
        logger.warn(
          "[CopilotQuestionnaire] Copilot generation failed, using fallback:",
          error
        );
      }
    } else {
      logger.info(
        "[CopilotQuestionnaire] Copilot Bridge not available, using fallback questions"
      );
    }

    // Fallback to static questions
    const defaultQuestions = this.getDefaultQuestions(request);
    logger.info(
      `[CopilotQuestionnaire] Returning ${defaultQuestions.length} default questions`
    );
    return defaultQuestions;
  }

  /**
   * Generate questions using Copilot via copilot-bridge
   */
  private async generateWithCopilot(
    request: GenerateQuestionsRequest,
    bridge: ReturnType<typeof getCopilotBridge>
  ): Promise<QuestionnaireQuestion[]> {
    if (!bridge) {
      throw new Error("Copilot Bridge not initialized");
    }

    const prompt = `Based on the following project description, generate 5-7 detailed questionnaire questions to help structure the project better.

Project Name: ${request.projectName || "Unnamed Project"}
Project Type: ${request.projectType || "General"}
Description: ${request.projectDescription}

Return ONLY a valid JSON array (no markdown, no code blocks) with this structure:
[
  {
    "id": "q1",
    "category": "requirements",
    "question": "What is your primary objective?",
    "type": "text",
    "required": true,
    "placeholder": "e.g., Build a real-time chat application",
    "hint": "Be specific about the main goal"
  }
]

Question types must be: "text", "select", "multiselect", or "boolean"
Categories should include: requirements, architecture, team, timeline, scope, technology
Make questions specific to the project description.
Return valid JSON only - no extra text.`;

    const message = await bridge.chat([
      {
        role: "system",
        content:
          "You are a project planning expert. Generate detailed questionnaires to help structure projects.",
      },
      {
        role: "user",
        content: prompt,
      },
    ]);

    // Parse the response
    try {
      // Try to extract JSON from the response
      const jsonMatch = message.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error("No JSON array found in response");
      }

      const questions = JSON.parse(jsonMatch[0]) as QuestionnaireQuestion[];

      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error("Invalid questions format");
      }

      logger.info(
        `[CopilotQuestionnaire] Generated ${questions.length} questions with Copilot`
      );
      return questions;
    } catch (error) {
      logger.error(
        "[CopilotQuestionnaire] Failed to parse Copilot response:",
        error
      );
      throw new Error(`Failed to parse questionnaire: ${error}`);
    }
  }

  /**
   * Get default fallback questions
   */
  private getDefaultQuestions(
    request: GenerateQuestionsRequest
  ): QuestionnaireQuestion[] {
    logger.info("[CopilotQuestionnaire] Using default fallback questions");

    return [
      {
        id: "q1",
        category: "requirements",
        question: "What is your primary objective for this project?",
        type: "text",
        required: true,
        placeholder: "Describe the main goal",
        hint: "Be specific about what you want to achieve",
      },
      {
        id: "q2",
        category: "scope",
        question: "How many team members will be working on this?",
        type: "select",
        options: [
          "1 (Solo project)",
          "2-5 (Small team)",
          "5-10 (Medium team)",
          "10+ (Large team)",
        ],
        required: true,
        hint: "This helps determine architecture complexity",
      },
      {
        id: "q3",
        category: "timeline",
        question: "What is your target timeline?",
        type: "select",
        options: [
          "MVP in 2-4 weeks",
          "MVP in 1-3 months",
          "MVP in 3-6 months",
          "6+ months (Long-term)",
        ],
        required: true,
        hint: "Affects feature scope and architecture decisions",
      },
      {
        id: "q4",
        category: "technology",
        question: "Do you have any technology preferences?",
        type: "multiselect",
        options: [
          "React/Vue/Angular",
          "Node.js",
          "Python",
          "Java",
          "Go",
          "Rust",
          "Database: PostgreSQL",
          "Database: MongoDB",
          "Cloud: AWS",
          "Cloud: GCP",
          "Cloud: Azure",
        ],
        required: false,
        hint: "Select technologies you'd like to use",
      },
      {
        id: "q5",
        category: "requirements",
        question: "Does your project require real-time features?",
        type: "boolean",
        required: true,
        hint: "e.g., WebSockets, live updates, collaborative editing",
      },
      {
        id: "q6",
        category: "architecture",
        question: "Do you need scalability planning from day 1?",
        type: "boolean",
        required: true,
        hint: "Consider if you expect rapid growth or high traffic",
      },
      {
        id: "q7",
        category: "requirements",
        question: "What is your primary challenge?",
        type: "select",
        options: [
          "Architecture design",
          "Frontend development",
          "Backend development",
          "Database design",
          "DevOps/Deployment",
          "Team coordination",
          "Technology selection",
          "Performance optimization",
        ],
        required: true,
        hint: "This helps prioritize recommendations",
      },
    ];
  }
}

// Export singleton instance
export const copilotQuestionnaireGenerator =
  new CopilotQuestionnaireGenerator();
