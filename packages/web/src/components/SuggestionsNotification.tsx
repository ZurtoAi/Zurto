import React, { useState, useEffect } from "react";
import "../styles/SuggestionsNotification.css";

interface Suggestion {
  id: string;
  type: "insight" | "architecture" | "performance" | "security" | "testing";
  title: string;
  description: string;
  action?: string;
  timestamp?: Date;
}

interface SuggestionsNotificationProps {
  suggestions: Suggestion[];
  onDismiss: (id: string) => void;
  autoHideDelay?: number; // milliseconds, default 5000
}

export const SuggestionsNotification: React.FC<
  SuggestionsNotificationProps
> = ({ suggestions, onDismiss, autoHideDelay = 5000 }) => {
  const [visibleSuggestions, setVisibleSuggestions] =
    useState<Suggestion[]>(suggestions);
  const [timers, setTimers] = useState<
    Map<string, ReturnType<typeof setTimeout>>
  >(new Map());

  useEffect(() => {
    // Update visible suggestions and set up timers
    setVisibleSuggestions(suggestions);

    suggestions.forEach((suggestion) => {
      const existingTimer = timers.get(suggestion.id);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      const timer = setTimeout(() => {
        handleDismiss(suggestion.id);
      }, autoHideDelay);

      setTimers((prev) => new Map(prev).set(suggestion.id, timer));
    });

    return () => {
      // Cleanup timers on unmount
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [suggestions, autoHideDelay]);

  const handleDismiss = (id: string) => {
    setVisibleSuggestions((prev) => prev.filter((s) => s.id !== id));
    const timer = timers.get(id);
    if (timer) {
      clearTimeout(timer);
      setTimers((prev) => {
        const newTimers = new Map(prev);
        newTimers.delete(id);
        return newTimers;
      });
    }
    onDismiss(id);
  };

  const getTypeIcon = (type: string): string => {
    const icons: { [key: string]: string } = {
      insight: "💡",
      architecture: "🏗️",
      performance: "⚡",
      security: "🔒",
      testing: "🧪",
    };
    return icons[type] || "📌";
  };

  const getTypeColor = (type: string): string => {
    const colors: { [key: string]: string } = {
      insight: "#3498db",
      architecture: "#9b59b6",
      performance: "#f39c12",
      security: "#e74c3c",
      testing: "#1abc9c",
    };
    return colors[type] || "#34495e";
  };

  if (visibleSuggestions.length === 0) {
    return null;
  }

  return (
    <div className="suggestions-container">
      {visibleSuggestions.map((suggestion) => (
        <div
          key={suggestion.id}
          className="suggestion-toast"
          style={{
            borderLeftColor: getTypeColor(suggestion.type),
            animation: "slideInRight 0.3s ease-out",
          }}
        >
          <div className="suggestion-header">
            <span className="suggestion-icon">
              {getTypeIcon(suggestion.type)}
            </span>
            <div className="suggestion-title-section">
              <h4 className="suggestion-title">{suggestion.title}</h4>
              <span
                className="suggestion-type-tag"
                style={{ backgroundColor: getTypeColor(suggestion.type) }}
              >
                {suggestion.type}
              </span>
            </div>
            <button
              className="suggestion-close-btn"
              onClick={() => handleDismiss(suggestion.id)}
              aria-label="Dismiss suggestion"
            >
              ✕
            </button>
          </div>

          <p className="suggestion-description">{suggestion.description}</p>

          {suggestion.action && (
            <button className="suggestion-action-btn">
              {suggestion.action}
            </button>
          )}

          <div className="suggestion-progress">
            <div
              className="progress-bar"
              style={{
                animation: `progressBar ${autoHideDelay}ms linear forwards`,
                backgroundColor: getTypeColor(suggestion.type),
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SuggestionsNotification;
