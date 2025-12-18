/**
 * Terminal Panel
 *
 * Embedded terminal for Docker services
 * Uses WebSocket for real-time output streaming
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useCanvas } from "../../context/CanvasContext";
import {
  Monitor,
  ArrowDown,
  RefreshCw,
  Trash2,
  X,
  Loader2,
} from "lucide-react";
import "./TerminalPanel.css";

interface TerminalPanelProps {
  serviceId: string;
  serviceName: string;
}

interface LogEntry {
  timestamp: string;
  message: string;
  stream: "stdout" | "stderr";
}

export function TerminalPanel({ serviceId, serviceName }: TerminalPanelProps) {
  const { toggleTerminalPanel } = useCanvas();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [command, setCommand] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [filter, setFilter] = useState<"all" | "stdout" | "stderr">("all");
  const [tail, setTail] = useState(100);

  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch logs
  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "";
      const response = await fetch(
        `${apiUrl}/api/docker/service/${serviceName}/logs?tail=${tail}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch logs: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success && data.data?.logs) {
        // Parse log lines
        const logLines: LogEntry[] = data.data.logs
          .split("\n")
          .filter((line: string) => line.trim())
          .map((line: string, index: number) => ({
            timestamp: new Date().toISOString(),
            message: line,
            stream:
              line.includes("error") || line.includes("Error")
                ? "stderr"
                : "stdout",
          }));

        setLogs(logLines);
      }
    } catch (err) {
      console.error("Failed to fetch logs:", err);
      setLogs([
        {
          timestamp: new Date().toISOString(),
          message: `Error fetching logs: ${err instanceof Error ? err.message : "Unknown error"}`,
          stream: "stderr",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [serviceName, tail]);

  // Initial fetch
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Auto-refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, [fetchLogs]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (autoScroll && terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  // Handle command execution (placeholder)
  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    // Add command to log
    setLogs((prev) => [
      ...prev,
      {
        timestamp: new Date().toISOString(),
        message: `$ ${command}`,
        stream: "stdout",
      },
    ]);

    // Clear command
    setCommand("");

    // Note: Full command execution would require docker exec WebSocket
    // For now, just show a message
    setLogs((prev) => [
      ...prev,
      {
        timestamp: new Date().toISOString(),
        message:
          "Command execution requires WebSocket connection (coming soon)",
        stream: "stderr",
      },
    ]);
  };

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    if (filter === "all") return true;
    return log.stream === filter;
  });

  // Handle scroll to detect if user scrolled up
  const handleScroll = () => {
    if (terminalRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = terminalRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
      setAutoScroll(isAtBottom);
    }
  };

  return (
    <div className="terminal-panel">
      <div className="terminal-header">
        <div className="header-left">
          <Monitor size={16} className="terminal-icon" />
          <span className="terminal-title">{serviceName}</span>
          <span className="terminal-badge">Terminal</span>
        </div>

        <div className="header-center">
          <select
            className="filter-select"
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value as "all" | "stdout" | "stderr")
            }
          >
            <option value="all">All Logs</option>
            <option value="stdout">stdout</option>
            <option value="stderr">stderr</option>
          </select>

          <select
            className="tail-select"
            value={tail}
            onChange={(e) => setTail(Number(e.target.value))}
          >
            <option value={50}>Last 50</option>
            <option value={100}>Last 100</option>
            <option value={200}>Last 200</option>
            <option value={500}>Last 500</option>
          </select>
        </div>

        <div className="header-right">
          <button
            className={`auto-scroll-btn ${autoScroll ? "active" : ""}`}
            onClick={() => setAutoScroll(!autoScroll)}
            title="Auto-scroll"
          >
            <ArrowDown size={14} />
          </button>

          <button
            className="refresh-btn"
            onClick={fetchLogs}
            disabled={isLoading}
            title="Refresh"
          >
            {isLoading ? (
              <Loader2 size={14} className="spin" />
            ) : (
              <RefreshCw size={14} />
            )}
          </button>

          <button
            className="clear-btn"
            onClick={() => setLogs([])}
            title="Clear"
          >
            <Trash2 size={14} />
          </button>

          <button
            className="close-btn"
            onClick={() => toggleTerminalPanel()}
            title="Close"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      <div
        className="terminal-output"
        ref={terminalRef}
        onScroll={handleScroll}
      >
        {filteredLogs.length === 0 ? (
          <div className="empty-logs">
            <span>No logs available</span>
          </div>
        ) : (
          filteredLogs.map((log, index) => (
            <div key={index} className={`log-line ${log.stream}`}>
              <span className="log-message">{log.message}</span>
            </div>
          ))
        )}
      </div>

      <form className="terminal-input" onSubmit={handleCommand}>
        <span className="prompt">$</span>
        <input
          ref={inputRef}
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Enter command..."
          autoFocus
        />
        <button type="submit" disabled={!command.trim()}>
          Run
        </button>
      </form>
    </div>
  );
}
