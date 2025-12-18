/**
 * Source Code Panel
 *
 * Editable code viewer with syntax highlighting
 * Uses Monaco Editor for a VS Code-like experience
 */

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useCanvas } from "../../context/CanvasContext";
import { Sparkles, Copy, Download, Save, X, Loader2 } from "lucide-react";
import "./SourceCodePanel.css";

// ============================================
// TYPES
// ============================================

interface SourceCodePanelProps {
  fileId: string;
  filePath: string;
  onSave?: (content: string) => Promise<void>;
  onClose: () => void;
}

interface FileContent {
  content: string;
  language: string;
  path: string;
  size: number;
  lastModified?: string;
}

// ============================================
// LANGUAGE DETECTION
// ============================================

const EXTENSION_TO_LANGUAGE: Record<string, string> = {
  // JavaScript/TypeScript
  js: "javascript",
  jsx: "javascript",
  ts: "typescript",
  tsx: "typescript",
  mjs: "javascript",
  cjs: "javascript",

  // Web
  html: "html",
  htm: "html",
  css: "css",
  scss: "scss",
  sass: "scss",
  less: "less",

  // Data formats
  json: "json",
  yaml: "yaml",
  yml: "yaml",
  xml: "xml",
  toml: "toml",

  // Config
  md: "markdown",
  mdx: "markdown",
  env: "plaintext",
  gitignore: "plaintext",
  dockerignore: "plaintext",

  // Docker
  dockerfile: "dockerfile",

  // Python
  py: "python",

  // Shell
  sh: "shell",
  bash: "shell",
  zsh: "shell",
  ps1: "powershell",

  // Other
  sql: "sql",
  graphql: "graphql",
  gql: "graphql",
  rs: "rust",
  go: "go",
  java: "java",
  c: "c",
  cpp: "cpp",
  h: "c",
  hpp: "cpp",
};

function detectLanguage(filePath: string): string {
  const fileName = filePath.split("/").pop() || "";
  const extension = fileName.split(".").pop()?.toLowerCase() || "";

  // Check for special files
  if (fileName.toLowerCase() === "dockerfile") return "dockerfile";
  if (fileName.toLowerCase() === "caddyfile") return "plaintext";
  if (fileName.toLowerCase().startsWith(".env")) return "plaintext";

  return EXTENSION_TO_LANGUAGE[extension] || "plaintext";
}

// ============================================
// SYNTAX HIGHLIGHTING (Simple fallback)
// ============================================

function highlightCode(code: string, language: string): string {
  // This is a simple fallback - Monaco Editor handles this better
  // Just escape HTML for safety
  return code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// ============================================
// COMPONENT
// ============================================

export function SourceCodePanel({
  fileId,
  filePath,
  onSave,
  onClose,
}: SourceCodePanelProps) {
  const [content, setContent] = useState<string>("");
  const [originalContent, setOriginalContent] = useState<string>("");
  const [language, setLanguage] = useState<string>("plaintext");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [lineNumbers, setLineNumbers] = useState<number[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  // Fetch file content
  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      setError(null);

      try {
        const apiUrl = import.meta.env.VITE_API_URL || "";
        const response = await fetch(`${apiUrl}/api/nodes/${fileId}/source`);

        if (!response.ok) {
          throw new Error(`Failed to load file: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.success && data.data) {
          setContent(data.data.content || "");
          setOriginalContent(data.data.content || "");
          setLanguage(data.data.language || detectLanguage(filePath));
        } else {
          throw new Error(data.error || "Failed to load file");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load file");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [fileId, filePath]);

  // Update line numbers
  useEffect(() => {
    const lines = content.split("\n");
    setLineNumbers(Array.from({ length: lines.length }, (_, i) => i + 1));
  }, [content]);

  // Sync scroll
  const handleScroll = useCallback((e: React.UIEvent<HTMLTextAreaElement>) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  }, []);

  // Handle content change
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newContent = e.target.value;
      setContent(newContent);
      setHasChanges(newContent !== originalContent);
    },
    [originalContent]
  );

  // Handle save
  const handleSave = useCallback(async () => {
    if (!onSave || !hasChanges) return;

    setSaving(true);
    try {
      await onSave(content);
      setOriginalContent(content);
      setHasChanges(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }, [content, hasChanges, onSave]);

  // Handle copy
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(content);
      // Could add a toast notification here
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [content]);

  // Handle download
  const handleDownload = useCallback(() => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filePath.split("/").pop() || "file.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [content, filePath]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave]);

  // Format code (basic prettification)
  const handleFormat = useCallback(() => {
    try {
      if (language === "json") {
        const parsed = JSON.parse(content);
        setContent(JSON.stringify(parsed, null, 2));
        setHasChanges(true);
      }
      // Add more formatters as needed
    } catch (err) {
      setError("Failed to format code");
    }
  }, [content, language]);

  const fileName = filePath.split("/").pop() || "Unknown file";

  return (
    <div className="source-code-panel">
      {/* Header */}
      <div className="panel-header">
        <div className="file-info">
          <span className="file-icon">📄</span>
          <span className="file-name" title={filePath}>
            {fileName}
          </span>
          <span className="file-language">{language}</span>
          {hasChanges && <span className="unsaved-indicator">●</span>}
        </div>

        <div className="header-actions">
          <button
            className="action-btn"
            onClick={handleFormat}
            title="Format (JSON only)"
            disabled={language !== "json"}
          >
            <Sparkles size={14} />
          </button>
          <button className="action-btn" onClick={handleCopy} title="Copy">
            <Copy size={14} />
          </button>
          <button
            className="action-btn"
            onClick={handleDownload}
            title="Download"
          >
            <Download size={14} />
          </button>
          {onSave && (
            <button
              className="action-btn save"
              onClick={handleSave}
              disabled={!hasChanges || saving}
              title="Save (Ctrl+S)"
            >
              {saving ? (
                <Loader2 size={14} className="spin" />
              ) : (
                <Save size={14} />
              )}
            </button>
          )}
          <button className="action-btn close" onClick={onClose} title="Close">
            <X size={14} />
          </button>
        </div>
      </div>

      {/* File path breadcrumb */}
      <div className="file-path-bar">
        <span className="path-text">{filePath}</span>
      </div>

      {/* Content area */}
      <div className="code-container">
        {loading && (
          <div className="loading-overlay">
            <div className="spinner" />
            <span>Loading file...</span>
          </div>
        )}

        {error && (
          <div className="error-overlay">
            <span className="error-icon">❌</span>
            <span>{error}</span>
            <button onClick={() => setError(null)}>Dismiss</button>
          </div>
        )}

        {!loading && !error && (
          <div className="editor-wrapper">
            {/* Line numbers */}
            <div className="line-numbers" ref={lineNumbersRef}>
              {lineNumbers.map((num) => (
                <div key={num} className="line-number">
                  {num}
                </div>
              ))}
            </div>

            {/* Textarea editor */}
            <textarea
              ref={textareaRef}
              className={`code-editor language-${language}`}
              value={content}
              onChange={handleChange}
              onScroll={handleScroll}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              data-gramm="false"
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="panel-footer">
        <span className="file-stats">
          {content.split("\n").length} lines • {content.length} characters
        </span>
        <span className="edit-hint">
          {hasChanges ? "Unsaved changes • Ctrl+S to save" : "No changes"}
        </span>
      </div>
    </div>
  );
}
