/**
 * AI Chat Component
 * Uses Copilot Bridge for AI interactions
 */

import React, { useState, useRef, useEffect } from "react";
import { useCopilot, AIProvider } from "../services/copilot-bridge";
import "./AIChatPanel.css";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  provider?: AIProvider;
}

interface AIChatPanelProps {
  projectContext?: string;
  onCodeGenerated?: (code: string, language: string) => void;
  onArchitectureSuggested?: (nodes: unknown[]) => void;
}

export const AIChatPanel: React.FC<AIChatPanelProps> = ({
  projectContext,
  onCodeGenerated,
  onArchitectureSuggested,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"chat" | "code" | "architecture">("chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    chat,
    generateCode,
    analyzeArchitecture,
    isLoading,
    error,
    provider,
    setProvider,
  } = useCopilot();

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (
    role: "user" | "assistant",
    content: string,
    aiProvider?: AIProvider
  ) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      role,
      content,
      timestamp: new Date(),
      provider: aiProvider,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    addMessage("user", userMessage);

    try {
      switch (mode) {
        case "chat": {
          const response = await chat(userMessage, {
            context: projectContext ? { project: projectContext } : undefined,
          });
          addMessage("assistant", response.content, response.provider);
          break;
        }

        case "code": {
          // Parse language from input (e.g., "generate a react component for...")
          const language = detectLanguage(userMessage);
          const response = await generateCode({
            description: userMessage,
            language,
            context: projectContext,
          });
          const formattedResponse = `\`\`\`${response.language}\n${response.code}\n\`\`\`${response.explanation ? `\n\n${response.explanation}` : ""}`;
          addMessage("assistant", formattedResponse, response.provider);
          onCodeGenerated?.(response.code, response.language);
          break;
        }

        case "architecture": {
          const response = await analyzeArchitecture({
            projectDescription: userMessage,
          });
          const formattedResponse = formatArchitectureResponse(response);
          addMessage("assistant", formattedResponse, response.provider);
          onArchitectureSuggested?.(response.suggestedNodes);
          break;
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      addMessage("assistant", `❌ Error: ${errorMessage}`);
    }
  };

  const detectLanguage = (text: string): string => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes("react") || lowerText.includes("component"))
      return "tsx";
    if (lowerText.includes("python")) return "python";
    if (lowerText.includes("node") || lowerText.includes("express"))
      return "typescript";
    if (lowerText.includes("sql") || lowerText.includes("database"))
      return "sql";
    if (lowerText.includes("docker")) return "dockerfile";
    if (lowerText.includes("css") || lowerText.includes("style")) return "css";
    return "typescript";
  };

  const formatArchitectureResponse = (response: {
    suggestedNodes: Array<{
      name: string;
      type: string;
      description: string;
      connections: string[];
    }>;
    recommendations: string[];
  }): string => {
    let result = "## Suggested Architecture\n\n";

    result += "### Services\n";
    for (const node of response.suggestedNodes) {
      result += `- **${node.name}** (${node.type})\n`;
      result += `  ${node.description}\n`;
      if (node.connections.length > 0) {
        result += `  → Connects to: ${node.connections.join(", ")}\n`;
      }
    }

    if (response.recommendations.length > 0) {
      result += "\n### Recommendations\n";
      for (const rec of response.recommendations) {
        result += `- ${rec}\n`;
      }
    }

    return result;
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="ai-chat-panel">
      <div className="ai-chat-header">
        <div className="ai-chat-title">
          <span className="ai-icon">🤖</span>
          <h3>AI Assistant</h3>
          <span className={`provider-badge ${provider}`}>
            {provider === "copilot"
              ? "⚡ Copilot"
              : provider === "claude"
                ? "🧠 Claude"
                : "🔄 Auto"}
          </span>
        </div>
        <div className="ai-chat-controls">
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value as AIProvider)}
            className="provider-select"
          >
            <option value="auto">Auto</option>
            <option value="copilot">Copilot</option>
            <option value="claude">Claude</option>
          </select>
          <button onClick={clearChat} className="clear-btn" title="Clear chat">
            🗑️
          </button>
        </div>
      </div>

      <div className="ai-mode-tabs">
        <button
          className={`mode-tab ${mode === "chat" ? "active" : ""}`}
          onClick={() => setMode("chat")}
        >
          💬 Chat
        </button>
        <button
          className={`mode-tab ${mode === "code" ? "active" : ""}`}
          onClick={() => setMode("code")}
        >
          💻 Generate Code
        </button>
        <button
          className={`mode-tab ${mode === "architecture" ? "active" : ""}`}
          onClick={() => setMode("architecture")}
        >
          🏗️ Architecture
        </button>
      </div>

      <div className="ai-chat-messages">
        {messages.length === 0 && (
          <div className="ai-welcome">
            <div className="welcome-icon">
              {mode === "chat" ? "💬" : mode === "code" ? "💻" : "🏗️"}
            </div>
            <h4>
              {mode === "chat"
                ? "How can I help you?"
                : mode === "code"
                  ? "What code would you like me to generate?"
                  : "Describe your project for architecture analysis"}
            </h4>
            <p className="welcome-hint">
              {mode === "chat"
                ? "Ask me anything about your project"
                : mode === "code"
                  ? 'Try: "Create a React hook for dark mode"'
                  : 'Try: "E-commerce platform with microservices"'}
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={`ai-message ${message.role}`}>
            <div className="message-avatar">
              {message.role === "user" ? "👤" : "🤖"}
            </div>
            <div className="message-content">
              <div className="message-header">
                <span className="message-role">
                  {message.role === "user" ? "You" : "AI"}
                </span>
                {message.provider && (
                  <span className={`message-provider ${message.provider}`}>
                    via {message.provider}
                  </span>
                )}
                <span className="message-time">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <div className="message-text">
                <FormattedMessage content={message.content} />
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="ai-message assistant loading">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="ai-error">
            <span>⚠️</span> {error.message}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form className="ai-chat-input" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            mode === "chat"
              ? "Type your message..."
              : mode === "code"
                ? "Describe the code you need..."
                : "Describe your project..."
          }
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !input.trim()}>
          {isLoading ? (
            <span className="loading-spinner"></span>
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          )}
        </button>
      </form>
    </div>
  );
};

// Helper component for rendering formatted messages with code blocks
const FormattedMessage: React.FC<{ content: string }> = ({ content }) => {
  // Split by code blocks
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("```")) {
          // Extract language and code
          const match = part.match(/```(\w*)\n?([\s\S]*?)```/);
          if (match) {
            const [, language, code] = match;
            return (
              <div key={index} className="code-block">
                <div className="code-header">
                  <span className="code-language">{language || "code"}</span>
                  <button
                    className="copy-btn"
                    onClick={() => navigator.clipboard.writeText(code)}
                  >
                    📋 Copy
                  </button>
                </div>
                <pre>
                  <code>{code.trim()}</code>
                </pre>
              </div>
            );
          }
        }

        // Regular text with basic markdown
        return (
          <p key={index}>
            {part.split("\n").map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < part.split("\n").length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </>
  );
};

export default AIChatPanel;
