/**
 * ZTerminal - Terminal/console emulator component
 */

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  KeyboardEvent,
} from "react";
import styles from "./ZTerminal.module.css";

export type TerminalLine = {
  id: string;
  type: "input" | "output" | "error" | "info" | "success";
  content: string;
  timestamp?: Date;
};

export type ZTerminalProps = {
  /** Terminal title */
  title?: string;
  /** Initial lines */
  initialLines?: TerminalLine[];
  /** Called when user submits command */
  onCommand?: (
    command: string
  ) => Promise<string | TerminalLine[]> | string | TerminalLine[];
  /** Command prompt string */
  prompt?: string;
  /** Welcome message */
  welcomeMessage?: string;
  /** Read-only mode (no input) */
  readOnly?: boolean;
  /** Height */
  height?: string;
  /** Additional class name */
  className?: string;
  /** Show timestamps */
  showTimestamps?: boolean;
  /** Max lines to keep in history */
  maxLines?: number;
};

let lineIdCounter = 0;
const generateLineId = () => `line-${Date.now()}-${lineIdCounter++}`;

export function ZTerminal({
  title = "Terminal",
  initialLines = [],
  onCommand,
  prompt = "$ ",
  welcomeMessage,
  readOnly = false,
  height = "400px",
  className,
  showTimestamps = false,
  maxLines = 1000,
}: ZTerminalProps) {
  const [lines, setLines] = useState<TerminalLine[]>(() => {
    const initial = [...initialLines];
    if (welcomeMessage) {
      initial.unshift({
        id: generateLineId(),
        type: "info",
        content: welcomeMessage,
        timestamp: new Date(),
      });
    }
    return initial;
  });
  const [inputValue, setInputValue] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines]);

  // Focus input on click
  const handleContainerClick = () => {
    if (!readOnly) {
      inputRef.current?.focus();
    }
  };

  const addLines = useCallback(
    (newLines: TerminalLine[]) => {
      setLines((prev) => {
        const combined = [...prev, ...newLines];
        return combined.slice(-maxLines);
      });
    },
    [maxLines]
  );

  const handleSubmit = useCallback(async () => {
    if (!inputValue.trim() || isProcessing) return;

    const command = inputValue.trim();
    setInputValue("");
    setHistoryIndex(-1);

    // Add to command history
    setCommandHistory((prev) => [command, ...prev].slice(0, 50));

    // Add input line
    const inputLine: TerminalLine = {
      id: generateLineId(),
      type: "input",
      content: `${prompt}${command}`,
      timestamp: new Date(),
    };
    addLines([inputLine]);

    // Process command
    if (onCommand) {
      setIsProcessing(true);
      try {
        const result = await onCommand(command);

        if (typeof result === "string") {
          addLines([
            {
              id: generateLineId(),
              type: "output",
              content: result,
              timestamp: new Date(),
            },
          ]);
        } else if (Array.isArray(result)) {
          addLines(
            result.map((line) => ({
              ...line,
              id: line.id || generateLineId(),
              timestamp: line.timestamp || new Date(),
            }))
          );
        }
      } catch (error) {
        addLines([
          {
            id: generateLineId(),
            type: "error",
            content: error instanceof Error ? error.message : String(error),
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsProcessing(false);
      }
    }
  }, [inputValue, isProcessing, prompt, onCommand, addLines]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "Enter":
        e.preventDefault();
        handleSubmit();
        break;

      case "ArrowUp":
        e.preventDefault();
        if (commandHistory.length > 0) {
          const newIndex = Math.min(
            historyIndex + 1,
            commandHistory.length - 1
          );
          setHistoryIndex(newIndex);
          setInputValue(commandHistory[newIndex]);
        }
        break;

      case "ArrowDown":
        e.preventDefault();
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          setInputValue(commandHistory[newIndex]);
        } else if (historyIndex === 0) {
          setHistoryIndex(-1);
          setInputValue("");
        }
        break;

      case "c":
        if (e.ctrlKey) {
          e.preventDefault();
          setInputValue("");
          addLines([
            {
              id: generateLineId(),
              type: "info",
              content: "^C",
              timestamp: new Date(),
            },
          ]);
        }
        break;

      case "l":
        if (e.ctrlKey) {
          e.preventDefault();
          setLines([]);
        }
        break;
    }
  };

  const formatTimestamp = (date: Date): string => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const clear = useCallback(() => {
    setLines([]);
  }, []);

  const write = useCallback(
    (content: string, type: TerminalLine["type"] = "output") => {
      addLines([
        {
          id: generateLineId(),
          type,
          content,
          timestamp: new Date(),
        },
      ]);
    },
    [addLines]
  );

  // Expose imperative methods
  useEffect(() => {
    const terminal = containerRef.current;
    if (terminal) {
      (
        terminal as unknown as {
          terminalAPI: {
            clear: () => void;
            write: (content: string, type?: TerminalLine["type"]) => void;
          };
        }
      ).terminalAPI = { clear, write };
    }
  }, [clear, write]);

  return (
    <div className={`${styles.terminal} ${className || ""}`} style={{ height }}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.buttons}>
          <span className={`${styles.button} ${styles.close}`} />
          <span className={`${styles.button} ${styles.minimize}`} />
          <span className={`${styles.button} ${styles.maximize}`} />
        </div>
        <span className={styles.title}>{title}</span>
        <div className={styles.actions}>
          <button
            type="button"
            onClick={clear}
            className={styles.actionButton}
            title="Clear terminal"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div
        ref={containerRef}
        className={styles.content}
        onClick={handleContainerClick}
      >
        {lines.map((line) => (
          <div key={line.id} className={`${styles.line} ${styles[line.type]}`}>
            {showTimestamps && line.timestamp && (
              <span className={styles.timestamp}>
                [{formatTimestamp(line.timestamp)}]
              </span>
            )}
            <span className={styles.lineContent}>{line.content}</span>
          </div>
        ))}

        {/* Input line */}
        {!readOnly && (
          <div className={styles.inputLine}>
            <span className={styles.prompt}>{prompt}</span>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className={styles.input}
              disabled={isProcessing}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              aria-label="Terminal input"
            />
            {isProcessing && <span className={styles.cursor}>▋</span>}
          </div>
        )}
      </div>
    </div>
  );
}

export default ZTerminal;
