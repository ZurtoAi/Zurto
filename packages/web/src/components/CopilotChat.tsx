import React, { useState, useRef, useEffect, useCallback } from "react";
import { DraggablePanel } from "./DraggablePanel";
import { copilotBridge, AIMessage } from "../services/copilot-bridge";
import "../styles/CopilotChat.css";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

interface CopilotChatProps {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
  onAction?: (action: string, data: any) => void;
}

type ConnectionStatus = "idle" | "active" | "loading" | "error";

export const CopilotChat: React.FC<CopilotChatProps> = ({
  projectId,
  isOpen,
  onClose,
  onAction,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "system",
      content:
        "Hi! I'm Copilot, your AI assistant. I can help you with:\n\n• Suggesting node architecture\n• Analyzing project structure\n• Generating code templates\n• Managing project tasks\n• Creating questionnaires\n\nHow can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("idle");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Quick action buttons
  const quickActions = [
    { icon: "🔧", label: "Suggest Nodes", action: "suggest-nodes" },
    { icon: "📊", label: "Analyze", action: "analyze-architecture" },
    { icon: "📝", label: "Document", action: "generate-docs" },
    { icon: "❓", label: "Questionnaire", action: "create-questionnaire" },
  ];

  const handleQuickAction = async (action: string) => {
    const prompts: Record<string, string> = {
      "suggest-nodes": "Suggest architecture nodes for this project",
      "analyze-architecture":
        "Analyze the current project architecture and provide recommendations",
      "generate-docs": "Generate documentation for this project structure",
      "create-questionnaire":
        "Create a questionnaire to gather requirements for this project",
    };

    const prompt = prompts[action] || action;
    await sendMessage(prompt, action);
  };

  const sendMessage = useCallback(
    async (content: string, action?: string) => {
      if (!content.trim() || isLoading) return;

      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: content.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);
      setConnectionStatus("loading");

      // Add loading message
      const loadingId = `loading-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        {
          id: loadingId,
          role: "assistant",
          content: "",
          timestamp: new Date(),
          isLoading: true,
        },
      ]);

      try {
        // Build chat history for context - include recent messages
        const aiMessages: AIMessage[] = messages
          .filter((m) => !m.isLoading)
          .slice(-10)
          .map((m) => ({
            role: m.role,
            content: m.content,
          }));

        // Add the new user message
        aiMessages.push({ role: "user", content: content.trim() });

        // Use copilot-bridge for AI communication
        const aiResponse = await copilotBridge.chat(aiMessages, {
          context: {
            projectId,
            action,
          },
        });

        setConnectionStatus("active");

        // Remove loading message and add response
        setMessages((prev) => {
          const filtered = prev.filter((m) => m.id !== loadingId);
          return [
            ...filtered,
            {
              id: `assistant-${Date.now()}`,
              role: "assistant",
              content: aiResponse.content,
              timestamp: new Date(),
            },
          ];
        });

        // Handle specific actions that might return structured data
        if (action === "suggest-nodes" && onAction) {
          try {
            // Try to extract node suggestions from response
            const nodeMatch = aiResponse.content.match(
              /```json\n([\s\S]*?)\n```/
            );
            if (nodeMatch) {
              const suggestedNodes = JSON.parse(nodeMatch[1]);
              onAction("add-nodes", suggestedNodes);
            }
          } catch {
            // Response wasn't structured, that's okay
          }
        }

        // Handle questionnaire creation
        if (action === "create-questionnaire" && onAction) {
          onAction("open-questionnaire", {
            source: "copilot",
            content: aiResponse.content,
          });
        }
      } catch (error) {
        console.error("Copilot error:", error);
        setConnectionStatus("error");
        setMessages((prev) => {
          const filtered = prev.filter((m) => m.id !== loadingId);
          return [
            ...filtered,
            {
              id: `error-${Date.now()}`,
              role: "assistant",
              content:
                "Sorry, I encountered an error. Please check your connection and try again.",
              timestamp: new Date(),
            },
          ];
        });
      } finally {
        setIsLoading(false);
        // Reset to idle after a delay if not in error state
        setTimeout(() => {
          setConnectionStatus((prev) => (prev === "error" ? "error" : "idle"));
        }, 2000);
      }
    },
    [isLoading, messages, projectId, onAction]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  if (!isOpen) return null;

  const copilotIcon = (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );

  return (
    <DraggablePanel
      id="copilot-chat"
      title="Copilot AI"
      icon={copilotIcon}
      isOpen={isOpen}
      onClose={onClose}
      defaultPosition={{ x: window.innerWidth - 420, y: 80 }}
      defaultSize={{ width: 380, height: 520 }}
      statusIndicator={{
        status: connectionStatus,
        label:
          connectionStatus === "loading"
            ? "Thinking..."
            : connectionStatus === "active"
              ? "Connected"
              : connectionStatus === "error"
                ? "Error"
                : "Ready",
      }}
      showMinimize={true}
    >
      <div className="copilot-content">
        <div className="copilot-quick-actions">
          {quickActions.map((qa) => (
            <button
              key={qa.action}
              className="quick-action-btn"
              onClick={() => handleQuickAction(qa.action)}
              disabled={isLoading}
            >
              <span className="qa-icon">{qa.icon}</span>
              <span className="qa-label">{qa.label}</span>
            </button>
          ))}
        </div>

        <div className="copilot-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message message-${message.role}`}>
              {message.role === "assistant" && (
                <div className="message-avatar">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                  </svg>
                </div>
              )}
              <div className="message-content">
                {message.isLoading ? (
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                ) : (
                  <p>{message.content}</p>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form className="copilot-input" onSubmit={handleSubmit}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Copilot anything..."
            rows={1}
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !input.trim()}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 2L11 13" />
              <path d="M22 2L15 22l-4-9-9-4 20-7z" />
            </svg>
          </button>
        </form>
      </div>
    </DraggablePanel>
  );
};
