import { QuestionnaireAnswer, Node, CreateNodeInput } from "../types/index.js";
import { claudeAgent } from "./claude-agent.js";
import { logger } from "../utils/logger.js";

/**
 * Questionnaire Analysis Engine
 * Converts questionnaire responses into structured project insights
 */

export class QuestionnaireAnalyzer {
  /**
   * Analyze all questionnaire responses for a project
   */
  async analyzeProjectResponses(
    projectName: string,
    projectId: string,
    answers: QuestionnaireAnswer[]
  ): Promise<{
    insights: string;
    recommendations: string[];
    techStack: {
      frontend?: string[];
      backend?: string[];
      database?: string[];
      deployment?: string[];
    };
    estimatedComplexity: "low" | "medium" | "high";
    confidenceScore: number;
    suggestedNodes: CreateNodeInput[];
  }> {
    try {
      logger.info(
        `📊 Analyzing ${answers.length} questionnaire responses for project: ${projectName}`
      );

      // Convert answers to a structured format
      const answersMap = this.convertAnswersToMap(answers);

      // Get AI analysis
      const analysis = await claudeAgent.analyzeQuestionnaire({
        projectName,
        answers: answersMap,
        questions: this.getQuestionLabels(answers),
      });

      // Generate suggested nodes based on tech stack
      const suggestedNodes = this.generateNodesFromTechStack(
        analysis.techStack
      );

      logger.info(
        `✅ Analysis complete - Found ${suggestedNodes.length} suggested components`
      );

      return {
        ...analysis,
        suggestedNodes,
      };
    } catch (error) {
      logger.error("❌ Failed to analyze project responses:", error);
      throw error;
    }
  }

  /**
   * Convert questionnaire answers to structured map
   */
  private convertAnswersToMap(
    answers: QuestionnaireAnswer[]
  ): Record<string, unknown> {
    const map: Record<string, unknown> = {};
    answers.forEach((answer) => {
      map[answer.questionId] = answer.answer;
    });
    return map;
  }

  /**
   * Extract question labels from answers (simplified - would need actual questions)
   */
  private getQuestionLabels(
    answers: QuestionnaireAnswer[]
  ): Record<string, string> {
    const labels: Record<string, string> = {
      q_focus: "What is your main focus?",
      q_framework: "Preferred frontend framework?",
      q_language: "Preferred backend language?",
      q_database: "Preferred database?",
      q_team: "Team size?",
      q_experience: "Years of experience?",
      q_description: "Describe your project",
    };
    return labels;
  }

  /**
   * Generate suggested nodes from tech stack
   */
  private generateNodesFromTechStack(techStack: {
    frontend?: string[];
    backend?: string[];
    database?: string[];
    deployment?: string[];
  }): CreateNodeInput[] {
    const nodes: CreateNodeInput[] = [];

    // Frontend node
    if (techStack.frontend && techStack.frontend.length > 0) {
      nodes.push({
        name: `Frontend (${techStack.frontend[0]})`,
        type: "frontend",
        description: `Frontend application using ${techStack.frontend.join(", ")}`,
        language: techStack.frontend[0].toLowerCase(),
      });
    }

    // Backend node
    if (techStack.backend && techStack.backend.length > 0) {
      nodes.push({
        name: `Backend (${techStack.backend[0]})`,
        type: "backend",
        description: `Backend API using ${techStack.backend.join(", ")}`,
        language: techStack.backend[0].toLowerCase(),
      });
    }

    // Database node
    if (techStack.database && techStack.database.length > 0) {
      nodes.push({
        name: `Database (${techStack.database[0]})`,
        type: "database",
        description: `${techStack.database[0]} database instance`,
      });
    }

    // Deployment node
    if (techStack.deployment && techStack.deployment.length > 0) {
      nodes.push({
        name: `Deployment (${techStack.deployment[0]})`,
        type: "service",
        description: `Deploy to ${techStack.deployment.join(", ")}`,
      });
    }

    logger.info(`📦 Generated ${nodes.length} suggested nodes from tech stack`);

    return nodes;
  }

  /**
   * Extract project metadata from answers
   */
  extractProjectMetadata(
    answers: QuestionnaireAnswer[]
  ): Record<string, unknown> {
    const metadata: Record<string, unknown> = {
      analyzedAt: new Date().toISOString(),
      totalQuestions: answers.length,
    };

    // Extract key information from specific questions
    answers.forEach((answer) => {
      switch (answer.questionId) {
        case "q_team":
          metadata.teamSize = answer.answer;
          break;
        case "q_experience":
          metadata.teamExperience = answer.answer;
          break;
        case "q_complexity":
          metadata.projectComplexity = answer.answer;
          break;
        case "q_timeline":
          metadata.timeline = answer.answer;
          break;
        case "q_budget":
          metadata.budget = answer.answer;
          break;
      }
    });

    return metadata;
  }
}

// Export singleton instance
export const questionnaireAnalyzer = new QuestionnaireAnalyzer();
