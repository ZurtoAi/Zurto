import Anthropic from "@anthropic-ai/sdk";
import { logger } from "../utils/logger.js";

/**
 * Claude AI Agent Client
 * Handles all interactions with Claude AI for questionnaire analysis and recommendations
 */

export class ClaudeAgent {
  private client: Anthropic;
  private model: string = "claude-3-5-sonnet-20241022";
  private isMockMode: boolean = false;

  constructor(apiKey?: string) {
    const key =
      apiKey || process.env.CLAUDE_API_KEY || "sk-test-key-development";
    // Enable mock mode if no real API key is provided
    if (!apiKey && !process.env.CLAUDE_API_KEY) {
      this.isMockMode = true;
      logger.warn("⚠️ Using MOCK MODE - no CLAUDE_API_KEY provided");
      logger.info(
        "💡 Set CLAUDE_API_KEY in .env to enable real AI functionality"
      );
    } else if (key === "sk-test-key-development" || key === "") {
      this.isMockMode = true;
      logger.warn("⚠️ Using MOCK MODE - test API key detected");
    }
    this.client = new Anthropic({ apiKey: key || "sk-placeholder" });
    logger.info(
      `✅ Claude AI client initialized with model: ${this.model}${this.isMockMode ? " (MOCK MODE)" : ""}`
    );
  }

  /**
   * Check if running in mock mode (no real API key)
   */
  isInMockMode(): boolean {
    return this.isMockMode;
  }

  /**
   * Analyze questionnaire responses and generate insights
   */
  async analyzeQuestionnaire(responses: {
    projectName: string;
    answers: Record<string, unknown>;
    questions: Record<string, string>;
  }): Promise<{
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
  }> {
    try {
      logger.info(
        `🧠 Analyzing questionnaire for project: ${responses.projectName}`
      );

      const prompt = this.buildAnalysisPrompt(responses);

      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 2000,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      const analysisText =
        response.content[0].type === "text" ? response.content[0].text : "";

      // Parse the AI response to extract structured data
      const parsed = this.parseAnalysisResponse(analysisText);

      logger.info(
        `✅ Questionnaire analysis complete - Complexity: ${parsed.estimatedComplexity}`
      );

      return parsed;
    } catch (error) {
      logger.error("❌ Failed to analyze questionnaire:", error);
      throw new Error(`Questionnaire analysis failed: ${error}`);
    }
  }

  /**
   * Generate project planning tasks based on analysis
   */
  async generateTasks(analysisResult: {
    insights: string;
    recommendations: string[];
    techStack: Record<string, string[]>;
    estimatedComplexity: string;
  }): Promise<
    Array<{
      title: string;
      description: string;
      priority: "critical" | "high" | "medium" | "low";
      estimatedHours: number;
      category: string;
    }>
  > {
    try {
      logger.info(
        `📋 Generating planning tasks from analysis (Complexity: ${analysisResult.estimatedComplexity})`
      );

      const prompt = `
Based on this project analysis, generate a comprehensive list of planning tasks:

Insights: ${analysisResult.insights}
Recommendations: ${analysisResult.recommendations.join(", ")}
Tech Stack: ${JSON.stringify(analysisResult.techStack)}
Complexity: ${analysisResult.estimatedComplexity}

Generate a JSON array of tasks with this structure:
{
  "tasks": [
    {
      "title": "Task title",
      "description": "Detailed description",
      "priority": "critical|high|medium|low",
      "estimatedHours": number,
      "category": "setup|development|testing|deployment|documentation"
    }
  ]
}

Generate 8-12 relevant tasks based on complexity and tech stack.
`;

      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 2500,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      const tasksText =
        response.content[0].type === "text" ? response.content[0].text : "";

      // Extract JSON from response
      const jsonMatch = tasksText.match(/\{[\s\S]*"tasks"[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Failed to parse tasks from AI response");
      }

      const parsed = JSON.parse(jsonMatch[0]);

      logger.info(
        `✅ Generated ${parsed.tasks.length} planning tasks for project`
      );

      return parsed.tasks;
    } catch (error) {
      logger.error("❌ Failed to generate tasks:", error);
      throw new Error(`Task generation failed: ${error}`);
    }
  }

  /**
   * Get real-time suggestions for project setup
   */
  async getSuggestions(context: {
    projectName: string;
    projectType: string;
    complexity: string;
    currentTechStack: string[];
  }): Promise<string[]> {
    try {
      logger.info(
        `💡 Generating suggestions for ${context.projectName} (${context.projectType})`
      );

      const prompt = `
As a senior software architect, provide 5-7 actionable suggestions for setting up this project:

Project: ${context.projectName}
Type: ${context.projectType}
Complexity: ${context.complexity}
Current Tech Stack: ${context.currentTechStack.join(", ")}

Respond with a JSON array of strings:
["suggestion 1", "suggestion 2", ...]

Focus on best practices, architecture patterns, and implementation strategies.
`;

      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 1500,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      const suggestionsText =
        response.content[0].type === "text" ? response.content[0].text : "";

      // Extract JSON array
      const jsonMatch = suggestionsText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error("Failed to parse suggestions from AI response");
      }

      const suggestions = JSON.parse(jsonMatch[0]);

      logger.info(`✅ Generated ${suggestions.length} suggestions`);

      return suggestions;
    } catch (error) {
      logger.error("❌ Failed to generate suggestions:", error);
      throw new Error(`Suggestion generation failed: ${error}`);
    }
  }

  /**
   * Build the prompt for questionnaire analysis
   */
  private buildAnalysisPrompt(responses: {
    projectName: string;
    answers: Record<string, unknown>;
    questions: Record<string, string>;
  }): string {
    const answersText = Object.entries(responses.answers)
      .map(
        ([key, value]) =>
          `Q: ${responses.questions[key] || key}\nA: ${JSON.stringify(value)}`
      )
      .join("\n\n");

    return `
Analyze this project questionnaire and provide strategic insights:

PROJECT: ${responses.projectName}

QUESTIONNAIRE RESPONSES:
${answersText}

Provide your analysis in the following JSON format:
{
  "insights": "2-3 sentence summary of key findings",
  "recommendations": ["recommendation 1", "recommendation 2", ...],
  "techStack": {
    "frontend": ["tech1", "tech2"],
    "backend": ["tech1", "tech2"],
    "database": ["tech1"],
    "deployment": ["service1", "service2"]
  },
  "estimatedComplexity": "low|medium|high",
  "confidenceScore": 0.0-1.0
}

Base your analysis on industry best practices and the specific requirements indicated in the responses.
`;
  }

  /**
   * Parse the AI analysis response
   */
  private parseAnalysisResponse(text: string): {
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
  } {
    // Extract JSON from response text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      logger.warn("Could not find JSON in AI response, using defaults");
      return {
        insights: "Unable to parse analysis",
        recommendations: [],
        techStack: {},
        estimatedComplexity: "medium",
        confidenceScore: 0,
      };
    }

    try {
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      logger.warn("Failed to parse JSON response:", error);
      return {
        insights: "Unable to parse analysis",
        recommendations: [],
        techStack: {},
        estimatedComplexity: "medium",
        confidenceScore: 0,
      };
    }
  }

  /**
   * General purpose AI query method for flexible interactions
   */
  async ask(params: {
    prompt: string;
    systemContext?: string;
    maxTokens?: number;
  }): Promise<{
    text: string;
    usage?: { inputTokens: number; outputTokens: number };
  }> {
    try {
      logger.info(`🤖 Claude ask: "${params.prompt.substring(0, 50)}..."`);

      const messages: { role: "user" | "assistant"; content: string }[] = [];

      // If there's a system context, add it as an initial user message with context
      if (params.systemContext) {
        messages.push({
          role: "user",
          content: `${params.systemContext}\n\n${params.prompt}`,
        });
      } else {
        messages.push({
          role: "user",
          content: params.prompt,
        });
      }

      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: params.maxTokens || 1000,
        messages,
      });

      const text =
        response.content[0].type === "text" ? response.content[0].text : "";

      logger.info(`✅ Claude response received (${text.length} chars)`);

      return {
        text,
        usage: {
          inputTokens: response.usage?.input_tokens || 0,
          outputTokens: response.usage?.output_tokens || 0,
        },
      };
    } catch (error) {
      logger.error("❌ Claude ask failed:", error);
      throw new Error(`AI query failed: ${error}`);
    }
  }

  /**
   * Multi-turn chat method for conversation-style interactions
   * Used by copilot-bridge for chat functionality
   */
  async chat(params: {
    messages: { role: "user" | "assistant"; content: string }[];
    maxTokens?: number;
    temperature?: number;
  }): Promise<{
    text: string;
    usage?: { inputTokens: number; outputTokens: number };
  }> {
    try {
      const lastMessage = params.messages[params.messages.length - 1];
      logger.info(
        `💬 Claude chat: "${lastMessage?.content?.substring(0, 50) || ""}..."`
      );

      // Return mock response in mock mode
      if (this.isMockMode) {
        logger.info("🎭 Returning mock response (no API key configured)");
        const mockText = this.generateMockResponse(
          lastMessage?.content || "",
          params.messages
        );
        return {
          text: mockText,
          usage: {
            inputTokens: 100,
            outputTokens: mockText.length,
          },
        };
      }

      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: params.maxTokens || 2048,
        messages: params.messages,
      });

      const text =
        response.content[0].type === "text" ? response.content[0].text : "";

      logger.info(`✅ Claude chat response received (${text.length} chars)`);

      return {
        text,
        usage: {
          inputTokens: response.usage?.input_tokens || 0,
          outputTokens: response.usage?.output_tokens || 0,
        },
      };
    } catch (error) {
      logger.error("❌ Claude chat failed:", error);
      throw new Error(`AI chat failed: ${error}`);
    }
  }

  /**
   * Generate intelligent mock responses for testing without API key
   */
  private generateMockResponse(
    userMessage: string,
    messages: { role: string; content: string }[]
  ): string {
    const lowerMsg = userMessage.toLowerCase();

    // Greeting responses
    if (
      lowerMsg.includes("hello") ||
      lowerMsg.includes("hi") ||
      lowerMsg.includes("greeting")
    ) {
      return `Hello! I'm Claude, the AI assistant for Zurto V3. I'm running in **mock mode** because no API key is configured. To enable real AI functionality, set CLAUDE_API_KEY in your .env file.

How can I help you with your project today?`;
    }

    // Project-related responses
    if (lowerMsg.includes("project")) {
      return `I can help you with project-related tasks! In Zurto V3, I can:

1. **Analyze questionnaire responses** to understand your project requirements
2. **Generate task recommendations** based on your tech stack and goals
3. **Provide architecture suggestions** for your application
4. **Answer questions** about your project structure

Note: I'm currently in mock mode. Set CLAUDE_API_KEY for full AI capabilities.`;
    }

    // Architecture suggestions
    if (
      lowerMsg.includes("architecture") ||
      lowerMsg.includes("structure") ||
      lowerMsg.includes("suggest")
    ) {
      return `Here's a recommended architecture for a modern web application:

**Frontend:**
- React 18 with TypeScript
- State management: Zustand or Context API
- Styling: TailwindCSS

**Backend:**
- Node.js with Express or Fastify
- TypeScript for type safety
- RESTful API design

**Database:**
- PostgreSQL for relational data
- Redis for caching

**Infrastructure:**
- Docker for containerization
- Docker Compose for local development
- Caddy for reverse proxy with auto-SSL

This is a mock response. Configure CLAUDE_API_KEY for personalized recommendations.`;
    }

    // Multi-turn context awareness
    const hasContext = messages.length > 2;
    if (hasContext) {
      return `I understand we've been discussing this topic. Based on our conversation, I can provide more context.

This is a mock response demonstrating multi-turn conversation capability. The AI maintains context across messages to provide relevant responses.

**Mock Mode Active**: Set CLAUDE_API_KEY in your .env file for real AI conversations.`;
    }

    // Default response
    return `Thank you for your message! I'm Claude, the AI assistant integrated with Zurto V3.

**Current Status**: Mock Mode (no API key configured)

I can help with:
- Project planning and analysis
- Architecture recommendations
- Task generation
- Code suggestions

To enable full AI capabilities, add your Anthropic API key to the .env file:
\`CLAUDE_API_KEY=sk-ant-xxx...\`

What would you like to know about?`;
  }
}

// Export singleton instance
export const claudeAgent = new ClaudeAgent();
