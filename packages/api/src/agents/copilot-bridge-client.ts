/**
 * Copilot Bridge Client
 *
 * Communicates with the vscode-copilot-bridge VS Code extension
 * Provides OpenAI-compatible API access to GitHub Copilot from Node.js backend
 *
 * Requirements:
 * - VS Code running with copilot-bridge extension enabled
 * - COPILOT_BRIDGE_TOKEN environment variable set (from bridge.token in VS Code)
 * - COPILOT_BRIDGE_PORT environment variable (from "Copilot Bridge: Status" command)
 */

import { logger } from "../utils/logger.js";

export interface CopilotMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface CopilotBridgeConfig {
  baseUrl: string; // e.g., http://127.0.0.1:12345
  token: string; // Bearer token
  model?: string; // Defaults to available Copilot model
}

export interface CopilotBridgeStatus {
  available: boolean;
  host: string;
  port: string;
  hasToken: boolean;
  lastCheck: string;
  error?: string;
}

export class CopilotBridgeClient {
  private baseUrl: string;
  private token: string;
  private model: string = "claude-haiku-4.5"; // Default model
  private lastHealthCheck: Date | null = null;
  private isHealthy: boolean = false;

  constructor(config: CopilotBridgeConfig) {
    this.baseUrl = config.baseUrl;
    this.token = config.token;
    if (config.model) {
      this.model = config.model;
    }
  }

  /**
   * Check if copilot-bridge is available and healthy
   */
  async isAvailable(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(`${this.baseUrl}/health`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      this.isHealthy = response.ok;
      this.lastHealthCheck = new Date();
      return response.ok;
    } catch (error) {
      this.isHealthy = false;
      this.lastHealthCheck = new Date();
      logger.debug("[CopilotBridge] Health check failed:", error);
      return false;
    }
  }

  /**
   * Get detailed status information
   */
  getStatus(): { healthy: boolean; lastCheck: Date | null; baseUrl: string } {
    return {
      healthy: this.isHealthy,
      lastCheck: this.lastHealthCheck,
      baseUrl: this.baseUrl,
    };
  }

  /**
   * Send a chat message to Copilot via the bridge
   */
  async chat(messages: CopilotMessage[]): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          temperature: 0.7,
          max_tokens: 2048,
          stream: false,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Copilot Bridge authentication failed. Check token.");
        }
        const error = await response.text();
        throw new Error(`Copilot Bridge error: ${response.status} - ${error}`);
      }

      const data = (await response.json()) as {
        choices: Array<{ message: { content: string } }>;
      };

      if (!data.choices || data.choices.length === 0) {
        throw new Error("No response from Copilot");
      }

      return data.choices[0].message.content;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      logger.error("[CopilotBridge] Chat failed:", errorMsg);
      throw error;
    }
  }

  /**
   * Stream a chat message (SSE)
   */
  async chatStream(
    messages: CopilotMessage[],
    onChunk: (chunk: string) => void
  ): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          temperature: 0.7,
          max_tokens: 2048,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`Copilot Bridge error: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      let fullContent = "";
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data) as {
                choices: Array<{ delta: { content?: string } }>;
              };
              const content = parsed.choices[0]?.delta?.content || "";
              if (content) {
                fullContent += content;
                onChunk(content);
              }
            } catch {
              // Skip parse errors
            }
          }
        }
      }

      return fullContent;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      logger.error("[CopilotBridge] Stream failed:", errorMsg);
      throw error;
    }
  }
}

/**
 * Create a singleton instance of CopilotBridgeClient
 * This is called once at startup, but the client will check health on each request
 */
export function createCopilotBridgeClient(): CopilotBridgeClient | null {
  const port = process.env.COPILOT_BRIDGE_PORT || "50521";
  const token = process.env.COPILOT_BRIDGE_TOKEN;
  // Use host.docker.internal when running in Docker, otherwise localhost
  const host = process.env.COPILOT_BRIDGE_HOST || "host.docker.internal";

  if (!token) {
    logger.warn(
      "[CopilotBridge] COPILOT_BRIDGE_TOKEN not set. Set it in .env or docker-compose.yml"
    );
    logger.warn(
      "[CopilotBridge] Get token from VS Code: Run 'Copilot Bridge: Status' command"
    );
    return null;
  }

  logger.info(`[CopilotBridge] Connecting to http://${host}:${port}`);

  return new CopilotBridgeClient({
    baseUrl: `http://${host}:${port}`,
    token,
  });
}

/**
 * Get or create a fresh Copilot Bridge client
 * This allows reconnection if the initial connection failed
 */
export function getCopilotBridge(): CopilotBridgeClient | null {
  // If we have a client, return it
  if (copilotBridge) {
    return copilotBridge;
  }

  // Try to create a new one (in case env vars have changed)
  return createCopilotBridgeClient();
}

/**
 * Get Copilot Bridge status for debugging
 */
export function getCopilotBridgeStatus(): CopilotBridgeStatus {
  const port = process.env.COPILOT_BRIDGE_PORT || "50521";
  const token = process.env.COPILOT_BRIDGE_TOKEN;
  const host = process.env.COPILOT_BRIDGE_HOST || "host.docker.internal";

  const status: CopilotBridgeStatus = {
    available: false,
    host,
    port,
    hasToken: !!token,
    lastCheck: new Date().toISOString(),
  };

  if (!token) {
    status.error = "COPILOT_BRIDGE_TOKEN not set";
  } else if (copilotBridge) {
    const clientStatus = copilotBridge.getStatus();
    status.available = clientStatus.healthy;
  }

  return status;
}

export const copilotBridge = createCopilotBridgeClient();
