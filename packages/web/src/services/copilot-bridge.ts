/**
 * Copilot Bridge - AI Abstraction Layer
 *
 * Provides a unified interface for AI operations with:
 * - VS Code Extension Bridge on port 8787 (primary)
 * - GitHub Copilot as the primary provider (when available)
 * - Claude AI as fallback (via Zurto backend)
 * - Extensible for future providers
 */

import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://api.zurto.app";
const EXTENSION_BRIDGE_URL =
  import.meta.env.VITE_EXTENSION_BRIDGE_URL || "http://127.0.0.1:8787";

// ============================================================================
// Types & Interfaces
// ============================================================================

export type AIProvider = "copilot" | "claude" | "backend" | "auto";

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIRequestOptions {
  provider?: AIProvider;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  context?: Record<string, unknown>;
}

export interface AIResponse {
  content: string;
  provider: AIProvider;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  metadata?: Record<string, unknown>;
}

export interface CodeGenerationRequest {
  description: string;
  language: string;
  framework?: string;
  dependencies?: string[];
  context?: string;
}

export interface CodeGenerationResponse {
  code: string;
  language: string;
  explanation?: string;
  provider: AIProvider;
}

export interface ArchitectureAnalysisRequest {
  projectDescription: string;
  existingNodes?: Array<{
    name: string;
    type: string;
    description?: string;
  }>;
  constraints?: string[];
}

export interface ArchitectureAnalysisResponse {
  suggestedNodes: Array<{
    name: string;
    type: string;
    description: string;
    connections: string[];
  }>;
  recommendations: string[];
  provider: AIProvider;
}

export interface QuestionnaireGenerationRequest {
  projectDescription: string;
  projectType?: string;
  existingAnswers?: Record<string, unknown>;
}

export interface QuestionnaireGenerationResponse {
  questions: Array<{
    id: string;
    text: string;
    type: "text" | "select" | "multiselect" | "boolean" | "number";
    options?: Array<{ label: string; value: string }>;
    required?: boolean;
    followUp?: string[];
  }>;
  provider: AIProvider;
}

// ============================================================================
// Provider Detection
// ============================================================================

/**
 * Check if VS Code Extension Bridge is available on port 8787
 * Note: Only works in local development - production sites cannot access localhost
 */
export const isExtensionBridgeAvailable = async (): Promise<boolean> => {
  // Skip bridge check on production domains - browsers block localhost access from HTTPS
  if (typeof window !== "undefined") {
    const isProduction = window.location.protocol === "https:";
    const isProductionDomain = window.location.hostname.endsWith("zurto.app");
    if (isProduction || isProductionDomain) {
      console.log(
        "[CopilotBridge] Skipping extension bridge on production domain"
      );
      return false;
    }
  }

  try {
    const response = await fetch(`${EXTENSION_BRIDGE_URL}/health`, {
      method: "GET",
      signal: AbortSignal.timeout(2000), // 2 second timeout
    });
    const data = await response.json();
    if (data.status === "ok" && data.bridge === "running") {
      console.log(
        "[CopilotBridge] VS Code Extension Bridge available on port 8787"
      );
      return true;
    }
    return false;
  } catch {
    console.log("[CopilotBridge] Extension bridge not available");
    return false;
  }
};

/**
 * Check if GitHub Copilot is available in the current environment
 * This would be true when running inside VS Code with Copilot extension
 */
export const isCopilotAvailable = (): boolean => {
  // Check for VS Code API presence (when running as webview)
  if (typeof window !== "undefined") {
    // @ts-expect-error - VS Code API may not be typed
    const vscode = window.acquireVsCodeApi?.();
    if (vscode) {
      console.log("[CopilotBridge] VS Code API detected");
      return true;
    }

    // Check for Copilot Chat API (future integration)
    // @ts-expect-error - Copilot API may not be typed
    if (window.github?.copilot) {
      console.log("[CopilotBridge] GitHub Copilot API detected");
      return true;
    }

    // Check if we're in a VS Code webview context
    // @ts-expect-error - Check for VS Code webview context
    if (window.vscodeWebviewApi || window.__vscode__) {
      console.log("[CopilotBridge] VS Code webview context detected");
      return true;
    }
  }

  return false;
};

/**
 * Check if fallback API is available via backend
 */
export const isFallbackAvailable = async (): Promise<boolean> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/ai/status`);
    return response.data?.success ?? false;
  } catch {
    return false;
  }
};

/**
 * Get the best available provider
 */
export const getBestProvider = async (): Promise<AIProvider> => {
  // First priority: VS Code Extension Bridge on port 8787
  if (await isExtensionBridgeAvailable()) {
    return "copilot";
  }

  // Second priority: Direct Copilot when in VS Code context
  if (isCopilotAvailable()) {
    return "copilot";
  }

  // Fallback to backend
  return "auto";
};

// ============================================================================
// Core AI Bridge
// ============================================================================

class CopilotBridge {
  private currentProvider: AIProvider = "auto";
  private extensionBridgeAvailable: boolean = false;
  private providerStatus: Record<AIProvider, boolean> = {
    copilot: false,
    claude: false,
    backend: true,
    auto: true,
  };

  constructor() {
    this.initializeProviders();
  }

  private async initializeProviders(): Promise<void> {
    // Check extension bridge first (highest priority)
    this.extensionBridgeAvailable = await isExtensionBridgeAvailable();
    this.providerStatus.copilot =
      this.extensionBridgeAvailable || isCopilotAvailable();
    this.providerStatus.claude = await isFallbackAvailable();
    this.currentProvider = await getBestProvider();

    console.log("[CopilotBridge] Initialized with providers:", {
      extensionBridge: this.extensionBridgeAvailable,
      copilot: this.providerStatus.copilot,
      fallback: this.providerStatus.claude,
      current: this.currentProvider,
    });
  }

  /**
   * Check if extension bridge is available
   */
  isExtensionBridgeConnected(): boolean {
    return this.extensionBridgeAvailable;
  }

  /**
   * Set the preferred provider
   */
  setProvider(provider: AIProvider): void {
    this.currentProvider = provider;
  }

  /**
   * Get current provider status
   */
  getProviderStatus(): Record<AIProvider, boolean> {
    return { ...this.providerStatus };
  }

  /**
   * Send a chat message and get a response
   */
  async chat(
    messages: AIMessage[],
    options: AIRequestOptions = {}
  ): Promise<AIResponse> {
    // Try extension bridge first, then VS Code API, then backend
    try {
      if (this.extensionBridgeAvailable) {
        return await this.chatWithExtensionBridge(messages, options);
      }
      return await this.chatWithCopilot(messages, options);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error("[CopilotBridge] Copilot failed:", errorMsg);
      throw new Error(
        `GitHub Copilot is required for AI operations. Make sure you have VS Code with GitHub Copilot Chat extension enabled. Error: ${errorMsg}`
      );
    }
  }

  /**
   * Chat with VS Code Extension Bridge (HTTP on port 8787)
   */
  private async chatWithExtensionBridge(
    messages: AIMessage[],
    options: AIRequestOptions
  ): Promise<AIResponse> {
    try {
      const response = await fetch(`${EXTENSION_BRIDGE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages,
          options: {
            temperature: options.temperature ?? 0.7,
            maxTokens: options.maxTokens ?? 2048,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Extension bridge error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      return {
        content: data.content || "",
        provider: "copilot",
        usage: data.usage,
        metadata: { ...data.metadata, source: "extension-bridge" },
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error("[CopilotBridge] Extension bridge failed:", errorMsg);
      // Fallback to backend API
      return this.chatWithBackendAPI(messages, options);
    }
  }

  /**
   * Chat with GitHub Copilot (VS Code integration)
   */
  private async chatWithCopilot(
    messages: AIMessage[],
    options: AIRequestOptions
  ): Promise<AIResponse> {
    // Try VS Code webview API first (if running in VS Code)
    // @ts-expect-error - VS Code API may not be typed
    const vscode = window.acquireVsCodeApi?.();

    if (vscode) {
      // Running in VS Code webview
      return this.chatWithVsCodeCopilot(vscode, messages, options);
    }

    // Running in browser - use backend API
    return this.chatWithBackendAPI(messages, options);
  }

  /**
   * Chat with Copilot via VS Code webview
   */
  private chatWithVsCodeCopilot(
    vscode: any,
    messages: AIMessage[],
    options: AIRequestOptions
  ): Promise<AIResponse> {
    return new Promise((resolve, reject) => {
      const requestId = `copilot-${Date.now()}`;

      // Listen for response from VS Code extension
      const handleMessage = (event: MessageEvent) => {
        if (event.data.requestId === requestId) {
          window.removeEventListener("message", handleMessage);

          if (event.data.error) {
            reject(new Error(event.data.error));
          } else {
            resolve({
              content: event.data.content,
              provider: "copilot",
              usage: event.data.usage,
              metadata: event.data.metadata,
            });
          }
        }
      };

      window.addEventListener("message", handleMessage);

      // Send request to VS Code extension
      vscode.postMessage({
        type: "copilot-chat",
        requestId,
        messages,
        options: {
          temperature: options.temperature ?? 0.7,
          maxTokens: options.maxTokens ?? 2048,
        },
      });

      // Timeout after 30 seconds
      setTimeout(() => {
        window.removeEventListener("message", handleMessage);
        reject(new Error("Copilot request timeout"));
      }, 30000);
    });
  }

  /**
   * Chat with backend API (for browser environments)
   */
  private async chatWithBackendAPI(
    messages: AIMessage[],
    options: AIRequestOptions
  ): Promise<AIResponse> {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

      const response = await fetch(`${apiUrl}/api/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages,
          options: {
            temperature: options.temperature ?? 0.7,
            maxTokens: options.maxTokens ?? 2048,
          },
        }),
      });

      if (!response.ok) {
        if (response.status === 501) {
          throw new Error(
            "Backend AI endpoint is deprecated. Please enable VS Code GitHub Copilot Chat extension for AI features."
          );
        }
        throw new Error(
          `Backend API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      if (!data.success && data.error) {
        throw new Error(data.error);
      }

      return {
        content: data.data?.content || data.content || "",
        provider: "backend",
        usage: data.data?.usage || data.usage,
        metadata: data.data?.metadata || data.metadata,
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      throw new Error(`Backend API failed: ${errorMsg}`);
    }
  }

  /**
   * Chat with Claude via Zurto backend
   */
  /**
   * Generate code based on description
   */
  async generateCode(
    request: CodeGenerationRequest,
    options: AIRequestOptions = {}
  ): Promise<CodeGenerationResponse> {
    const systemPrompt = `You are an expert code generator. Generate clean, production-ready code based on the user's requirements.
    
Language: ${request.language}
${request.framework ? `Framework: ${request.framework}` : ""}
${request.dependencies?.length ? `Dependencies: ${request.dependencies.join(", ")}` : ""}
${request.context ? `Context: ${request.context}` : ""}

Respond with:
1. The complete code (in a code block)
2. A brief explanation of the implementation`;

    const response = await this.chat(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: request.description },
      ],
      options
    );

    // Parse code from response
    const codeMatch = response.content.match(/```[\w]*\n([\s\S]*?)```/);
    const code = codeMatch ? codeMatch[1].trim() : response.content;

    // Extract explanation (text outside code blocks)
    const explanation = response.content.replace(/```[\s\S]*?```/g, "").trim();

    return {
      code,
      language: request.language,
      explanation: explanation || undefined,
      provider: response.provider,
    };
  }

  /**
   * Analyze project and suggest architecture
   */
  async analyzeArchitecture(
    request: ArchitectureAnalysisRequest,
    options: AIRequestOptions = {}
  ): Promise<ArchitectureAnalysisResponse> {
    const systemPrompt = `You are an expert software architect. Analyze the project description and suggest a modular architecture with clear service boundaries.

${request.existingNodes?.length ? `Existing services:\n${request.existingNodes.map((n) => `- ${n.name} (${n.type}): ${n.description || "No description"}`).join("\n")}` : ""}
${request.constraints?.length ? `Constraints:\n${request.constraints.map((c) => `- ${c}`).join("\n")}` : ""}

Respond with a JSON object containing:
{
  "suggestedNodes": [
    { "name": "...", "type": "service|database|frontend|api|queue|cache", "description": "...", "connections": ["other-node-name"] }
  ],
  "recommendations": ["recommendation 1", "recommendation 2"]
}`;

    const response = await this.chat(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: request.projectDescription },
      ],
      { ...options, temperature: 0.5 }
    );

    // Parse JSON from response
    const jsonMatch = response.content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse architecture response");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      suggestedNodes: parsed.suggestedNodes || [],
      recommendations: parsed.recommendations || [],
      provider: response.provider,
    };
  }

  /**
   * Generate questionnaire through VS Code Extension Bridge
   * This sends the questionnaire to the extension for display in the VS Code panel
   */
  private async generateQuestionnaireWithExtensionBridge(
    request: QuestionnaireGenerationRequest
  ): Promise<QuestionnaireGenerationResponse> {
    const response = await fetch(`${EXTENSION_BRIDGE_URL}/questionnaire`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectDescription: request.projectDescription,
        projectType: request.projectType,
        existingAnswers: request.existingAnswers,
        timestamp: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(30000), // 30 second timeout for AI generation
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Extension bridge error: ${response.status}`
      );
    }

    const data = await response.json();
    console.log(
      "[CopilotBridge] Questionnaire generated via Extension Bridge",
      data
    );

    return {
      questions: data.questions || [],
      provider: "copilot" as AIProvider,
    };
  }

  /**
   * Generate questionnaire for project planning
   * Prioritizes VS Code Extension Bridge for direct display in the extension panel
   */
  async generateQuestionnaire(
    request: QuestionnaireGenerationRequest,
    options: AIRequestOptions = {}
  ): Promise<QuestionnaireGenerationResponse> {
    // Try Extension Bridge first - displays questionnaire in VS Code panel
    if (this.extensionBridgeAvailable) {
      try {
        console.log(
          "[CopilotBridge] Sending questionnaire to Extension Bridge..."
        );
        return await this.generateQuestionnaireWithExtensionBridge(request);
      } catch (error) {
        console.warn(
          "[CopilotBridge] Extension bridge questionnaire failed, falling back:",
          error
        );
        // Fall through to standard generation
      }
    }

    // Fallback: Generate via AI chat
    const systemPrompt = `You are a project planning assistant. Generate intelligent questions to help plan and scope a software project.

${request.projectType ? `Project type: ${request.projectType}` : ""}
${request.existingAnswers ? `Already answered:\n${JSON.stringify(request.existingAnswers, null, 2)}` : ""}

Generate 5-10 relevant questions. Respond with a JSON array:
[
  {
    "id": "unique-id",
    "text": "Question text?",
    "type": "text|select|multiselect|boolean|number",
    "options": [{ "label": "Option A", "value": "a" }], // for select/multiselect
    "required": true,
    "followUp": ["question-id-if-yes"] // optional
  }
]`;

    const response = await this.chat(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: request.projectDescription },
      ],
      { ...options, temperature: 0.6 }
    );

    // Parse JSON from response
    const jsonMatch = response.content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Failed to parse questionnaire response");
    }

    const questions = JSON.parse(jsonMatch[0]);

    return {
      questions,
      provider: response.provider,
    };
  }

  /**
   * Stream chat responses (for real-time UI updates)
   */
  async *streamChat(
    messages: AIMessage[],
    options: AIRequestOptions = {}
  ): AsyncGenerator<string> {
    const provider = options.provider || this.currentProvider;

    // For now, streaming is only supported via Claude backend
    if (provider !== "copilot" && this.providerStatus.claude) {
      const response = await fetch(`${API_BASE_URL}/api/ai/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages,
          temperature: options.temperature ?? 0.7,
          maxTokens: options.maxTokens ?? 2048,
          stream: true,
        }),
      });

      if (!response.body) {
        throw new Error("Streaming not supported");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk
          .split("\n")
          .filter((line) => line.startsWith("data: "));

        for (const line of lines) {
          const data = line.slice(6);
          if (data === "[DONE]") break;

          try {
            const parsed = JSON.parse(data);
            if (parsed.content) {
              yield parsed.content;
            }
          } catch {
            // Skip invalid JSON
          }
        }
      }
    } else {
      // Fall back to non-streaming
      const response = await this.chat(messages, options);
      yield response.content;
    }
  }
}

// ============================================================================
// Singleton Export
// ============================================================================

export const copilotBridge = new CopilotBridge();

// ============================================================================
// React Hooks
// ============================================================================

import { useState, useCallback } from "react";

export interface UseCopilotReturn {
  chat: (message: string, options?: AIRequestOptions) => Promise<AIResponse>;
  generateCode: (
    request: CodeGenerationRequest
  ) => Promise<CodeGenerationResponse>;
  analyzeArchitecture: (
    request: ArchitectureAnalysisRequest
  ) => Promise<ArchitectureAnalysisResponse>;
  generateQuestionnaire: (
    request: QuestionnaireGenerationRequest
  ) => Promise<QuestionnaireGenerationResponse>;
  isLoading: boolean;
  error: Error | null;
  provider: AIProvider;
  setProvider: (provider: AIProvider) => void;
}

export function useCopilot(): UseCopilotReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [provider, setProviderState] = useState<AIProvider>("auto");

  const setProvider = useCallback((newProvider: AIProvider) => {
    setProviderState(newProvider);
    copilotBridge.setProvider(newProvider);
  }, []);

  const chat = useCallback(
    async (message: string, options?: AIRequestOptions) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await copilotBridge.chat(
          [{ role: "user", content: message }],
          options
        );
        return response;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const generateCode = useCallback(async (request: CodeGenerationRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      return await copilotBridge.generateCode(request);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const analyzeArchitecture = useCallback(
    async (request: ArchitectureAnalysisRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        return await copilotBridge.analyzeArchitecture(request);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const generateQuestionnaire = useCallback(
    async (request: QuestionnaireGenerationRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        return await copilotBridge.generateQuestionnaire(request);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    chat,
    generateCode,
    analyzeArchitecture,
    generateQuestionnaire,
    isLoading,
    error,
    provider,
    setProvider,
  };
}

export default copilotBridge;
