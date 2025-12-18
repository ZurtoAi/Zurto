/**
 * AI Questionnaire Agent
 *
 * Uses Copilot Bridge to generate intelligent, project-specific questionnaires
 * Implements multi-round questioning with follow-up questions based on answers
 */

import { logger } from "../utils/logger.js";
import { getCopilotBridge } from "./copilot-bridge-client.js";

export interface QuestionnaireQuestion {
  id: string;
  category: string;
  question: string;
  type: "text" | "select" | "multiselect" | "boolean" | "number";
  options?: string[];
  required: boolean;
  placeholder?: string;
  hint?: string;
  followUpContext?: string; // Context for generating follow-up questions
}

export interface GenerateQuestionsRequest {
  projectDescription: string;
  projectName?: string;
  projectType?: string;
}

export interface AnalyzeAnswersRequest {
  projectDescription: string;
  projectName?: string;
  projectType?: string;
  questions: QuestionnaireQuestion[];
  answers: Record<string, unknown>;
  round?: number; // Current follow-up round (1-3)
}

export interface AnalysisResult {
  needsMoreQuestions: boolean;
  followUpQuestions: QuestionnaireQuestion[];
  analysis: {
    understanding: string;
    gaps: string[];
    confidence: number; // 0-100
  };
  readyToProceed: boolean;
  projectPlan?: {
    summary: string;
    features: string[];
    architecture: string;
    techStack: string[];
    estimatedComplexity: "low" | "medium" | "high";
  };
}

export class AIQuestionnaireAgent {
  /**
   * Generate initial project-specific questions based on description
   */
  async generateQuestions(
    request: GenerateQuestionsRequest
  ): Promise<QuestionnaireQuestion[]> {
    logger.info(
      `[AIQuestionnaireAgent] Generating questions for: ${request.projectName || "Unnamed Project"}`
    );

    // Get fresh bridge connection
    const bridge = getCopilotBridge();
    if (!bridge) {
      logger.warn(
        "[AIQuestionnaireAgent] Copilot Bridge not available, cannot generate questions"
      );
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

    logger.info("[AIQuestionnaireAgent] Copilot Bridge connected successfully");

    const systemPrompt = `You are an expert project planning AI assistant, similar to how a senior developer or architect would interview a client about their project requirements.

Your job is to generate SPECIFIC, TARGETED questions based on the project description provided. 
DO NOT ask generic questions. 
Every question must be directly relevant to understanding THIS specific project better.

IMPORTANT CONTEXT - Zurto Hosting Platform:
- All projects will be deployed on the Zurto platform using Docker containers
- Ports are automatically assigned from our port allocation system (no need to ask about ports)
- Projects can be web apps, APIs, Discord bots, or other services
- Zurto handles SSL, domain routing, and container orchestration
- Don't ask about hosting/deployment infrastructure - focus on the application itself

Think about:
1. What details are missing from the description?
2. What ambiguities need clarification?
3. What technical decisions need to be made?
4. What constraints or requirements are unclear?
5. What would you need to know to start building this?

Generate questions that will help you fully understand the project scope, requirements, and implementation details.`;

    const userPrompt = `Analyze this project and generate 10-25 specific questions to gather the information needed to build it:

**Project Name:** ${request.projectName || "Unnamed Project"}
**Project Type:** ${request.projectType || "General"}
**Description:** ${request.projectDescription}

Generate questions that are SPECIFIC to this project description. For example:
- If they mention "real-time", ask about expected concurrent users
- If they mention "authentication", ask about OAuth providers or user types
- If they mention "dashboard", ask about specific metrics or data sources
- If they mention an API, ask about endpoints needed or third-party integrations

IMPORTANT: Use unique question IDs (q1, q2, q3, etc.) - these must be globally unique.

Return ONLY a valid JSON array with this exact structure (no markdown, no code blocks, no extra text):
[
  {
    "id": "q1",
    "category": "requirements",
    "question": "Your specific question here?",
    "type": "text",
    "required": true,
    "placeholder": "Example answer",
    "hint": "Why this matters",
    "followUpContext": "What aspect this question clarifies"
  },
  {
    "id": "q2",
    "category": "features",
    "question": "Which features should be included?",
    "type": "multiselect",
    "required": true,
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "hint": "Select all that apply"
  }
]

Question types and their requirements:
- "text": Free-form text input (no options needed)
- "number": Numeric input (no options needed)
- "boolean": Yes/No question (no options needed)
- "select": Single choice - MUST include "options" array with 3-6 string choices
- "multiselect": Multiple choice - MUST include "options" array with 4-8 string choices

Categories: "requirements", "features", "technical", "architecture", "integration", "users", "data", "security"

IMPORTANT: 
- For "select" and "multiselect" types, you MUST provide an "options" array with relevant choices.
- Generate between 10-25 questions to thoroughly understand the project.
- Don't ask about hosting/deployment - Zurto handles that automatically.

Remember: ONLY return the JSON array. No other text.`;

    try {
      const response = await bridge.chat([
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ]);

      const questions = this.parseQuestionsResponse(response);
      logger.info(
        `[AIQuestionnaireAgent] Generated ${questions.length} project-specific questions`
      );
      return questions;
    } catch (error) {
      logger.error(
        "[AIQuestionnaireAgent] Failed to generate questions:",
        error
      );
      throw error;
    }
  }

  /**
   * Analyze answers and determine if more questions are needed
   */
  async analyzeAnswers(
    request: AnalyzeAnswersRequest
  ): Promise<AnalysisResult> {
    logger.info(
      `[AIQuestionnaireAgent] Analyzing ${Object.keys(request.answers).length} answers`
    );

    // Get fresh bridge connection
    const bridge = getCopilotBridge();
    if (!bridge) {
      throw new Error("Copilot Bridge not connected");
    }

    // Verify bridge is available
    const isAvailable = await bridge.isAvailable();
    if (!isAvailable) {
      throw new Error("Copilot Bridge not responding");
    }

    const systemPrompt = `You are an expert project planning AI. Your job is to analyze the answers provided by the user and determine:

1. Do you have enough information to create a project plan?
2. Are there any gaps or ambiguities that need clarification?
3. Should you ask follow-up questions?

IMPORTANT CONTEXT - Zurto Hosting Platform:
- All projects will be deployed on the Zurto platform using Docker containers
- Ports are automatically assigned from our port allocation system
- Projects can be web apps, APIs, Discord bots, or other services
- Zurto handles SSL, domain routing, and container orchestration
- Don't ask about hosting/deployment infrastructure - focus on the application itself

Be thorough but efficient. Don't ask unnecessary questions, but ensure you have clarity on:
- Core features and functionality
- Technical requirements and constraints
- Integration needs
- User types and authentication
- Data storage and structure
- Performance and scalability requirements`;

    const questionsAndAnswers = request.questions.map((q) => ({
      question: q.question,
      category: q.category,
      answer: request.answers[q.id] ?? "Not answered",
    }));

    // Calculate the next round number for follow-up question IDs
    const currentRound = request.round || 1;
    const nextRound = currentRound + 1;

    const userPrompt = `Analyze these project requirements and answers:

**Project:** ${request.projectName || "Unnamed Project"}
**Type:** ${request.projectType || "General"}  
**Description:** ${request.projectDescription}

**Questions & Answers:**
${JSON.stringify(questionsAndAnswers, null, 2)}

Determine if you have enough information or need to ask follow-up questions.

Current round: ${currentRound}. Maximum allowed rounds is 3.
If you need follow-up questions, they will be round ${nextRound}.

Return ONLY a valid JSON object with this structure:
{
  "needsMoreQuestions": true/false,
  "followUpQuestions": [
    {
      "id": "fq_r${nextRound}_01",
      "category": "technical",
      "question": "Follow-up question based on their answers?",
      "type": "text",
      "required": true,
      "placeholder": "Example",
      "hint": "Why this matters"
    },
    {
      "id": "fq_r${nextRound}_02",
      "category": "features",
      "question": "Which additional features are needed?",
      "type": "multiselect",
      "required": true,
      "options": ["Feature A", "Feature B", "Feature C"],
      "hint": "Select all that apply"
    }
  ],
  "analysis": {
    "understanding": "Brief summary of what you understand about the project",
    "gaps": ["List of information gaps if any"],
    "confidence": 85
  },
  "readyToProceed": true/false,
  "projectPlan": {
    "summary": "Project summary if ready to proceed",
    "features": ["Feature 1", "Feature 2"],
    "architecture": "Brief architecture description",
    "techStack": ["Technology 1", "Technology 2"],
    "estimatedComplexity": "medium"
  }
}

Question types for followUpQuestions:
- "text": Free-form text input
- "number": Numeric input
- "boolean": Yes/No question
- "select": Single choice - MUST include "options" array with 3-6 choices
- "multiselect": Multiple choice - MUST include "options" array with 4-8 choices

CRITICAL ID RULES:
- Each question ID MUST be unique across ALL rounds
- Use format: "fq_r{round}_{number}" where round=${nextRound} for these follow-up questions
- Example IDs for this round: "fq_r${nextRound}_01", "fq_r${nextRound}_02", "fq_r${nextRound}_03"
- NEVER reuse IDs from previous rounds (round 1 used q1-q25, round ${currentRound} used fq_r${currentRound}_XX)

Rules:
- Set "needsMoreQuestions" to true ONLY if critical information is missing
- Set "readyToProceed" to true when you have enough to create the project
- Include "projectPlan" ONLY when "readyToProceed" is true
- "confidence" should be 0-100 (80+ means ready to proceed)
- Generate up to 20 follow-up questions if needed to fully understand the project
- For "select"/"multiselect" questions, ALWAYS include an "options" array
- If this is round 3, you MUST set readyToProceed to true (no more rounds allowed)

Return ONLY the JSON object. No other text.`;

    try {
      const response = await bridge.chat([
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ]);

      const result = this.parseAnalysisResponse(response);
      logger.info(
        `[AIQuestionnaireAgent] Analysis complete. Ready to proceed: ${result.readyToProceed}, Confidence: ${result.analysis.confidence}%`
      );
      return result;
    } catch (error) {
      logger.error("[AIQuestionnaireAgent] Failed to analyze answers:", error);
      throw error;
    }
  }

  /**
   * Parse questions response from Copilot
   */
  private parseQuestionsResponse(response: string): QuestionnaireQuestion[] {
    try {
      // Try to extract JSON array from response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error("No JSON array found in response");
      }

      const parsed = JSON.parse(jsonMatch[0]);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error("Invalid questions array");
      }

      // Validate and normalize each question
      return parsed.map((q: any, index: number) => ({
        id: q.id || `q${index + 1}`,
        category: q.category || "requirements",
        question: q.question,
        type: q.type || "text",
        options: q.options,
        required: q.required !== false,
        placeholder: q.placeholder || "",
        hint: q.hint || "",
        followUpContext: q.followUpContext,
      }));
    } catch (error) {
      logger.error("[AIQuestionnaireAgent] Failed to parse questions:", error);
      logger.debug("Raw response:", response);
      throw new Error(`Failed to parse questions: ${error}`);
    }
  }

  /**
   * Parse analysis response from Copilot
   */
  private parseAnalysisResponse(response: string): AnalysisResult {
    try {
      // Try to extract JSON object from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON object found in response");
      }

      const parsed = JSON.parse(jsonMatch[0]);

      // Normalize follow-up questions
      const followUpQuestions = (parsed.followUpQuestions || []).map(
        (q: any, index: number) => ({
          id: q.id || `fq${index + 1}`,
          category: q.category || "requirements",
          question: q.question,
          type: q.type || "text",
          options: q.options,
          required: q.required !== false,
          placeholder: q.placeholder || "",
          hint: q.hint || "",
        })
      );

      return {
        needsMoreQuestions: parsed.needsMoreQuestions === true,
        followUpQuestions,
        analysis: {
          understanding: parsed.analysis?.understanding || "",
          gaps: parsed.analysis?.gaps || [],
          confidence: parsed.analysis?.confidence || 0,
        },
        readyToProceed: parsed.readyToProceed === true,
        projectPlan: parsed.readyToProceed ? parsed.projectPlan : undefined,
      };
    } catch (error) {
      logger.error("[AIQuestionnaireAgent] Failed to parse analysis:", error);
      logger.debug("Raw response:", response);
      throw new Error(`Failed to parse analysis: ${error}`);
    }
  }
}

export const aiQuestionnaireAgent = new AIQuestionnaireAgent();
