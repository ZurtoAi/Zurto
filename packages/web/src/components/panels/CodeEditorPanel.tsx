/**
 * Enhanced Code Editor Panel
 *
 * Features:
 * - Syntax highlighting with Prism.js
 * - Line numbers
 * - Save (Ctrl+S)
 * - Copy, Download
 * - Fullscreen mode
 * - Split view
 * - Format code
 * - Search/Replace
 */

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import {
  X,
  Save,
  Copy,
  Download,
  Maximize2,
  Minimize2,
  Search,
  Replace,
  Code2,
  FileCode,
  ChevronDown,
  Check,
  AlertCircle,
  Loader2,
  Columns,
  Wand2,
  RefreshCw,
} from "lucide-react";
import "./CodeEditorPanel.css";

// ============================================
// TYPES
// ============================================

interface CodeEditorPanelProps {
  fileId: string;
  filePath: string;
  onSave?: (content: string) => Promise<void>;
  onClose: () => void;
  initialContent?: string;
  readOnly?: boolean;
}

// ============================================
// LANGUAGE DETECTION
// ============================================

const EXTENSION_TO_LANGUAGE: Record<string, { name: string; prism: string }> = {
  // JavaScript/TypeScript
  js: { name: "JavaScript", prism: "javascript" },
  jsx: { name: "JSX", prism: "jsx" },
  ts: { name: "TypeScript", prism: "typescript" },
  tsx: { name: "TSX", prism: "tsx" },
  mjs: { name: "JavaScript", prism: "javascript" },
  cjs: { name: "JavaScript", prism: "javascript" },

  // Web
  html: { name: "HTML", prism: "html" },
  htm: { name: "HTML", prism: "html" },
  css: { name: "CSS", prism: "css" },
  scss: { name: "SCSS", prism: "scss" },
  sass: { name: "Sass", prism: "sass" },
  less: { name: "Less", prism: "less" },

  // Data formats
  json: { name: "JSON", prism: "json" },
  yaml: { name: "YAML", prism: "yaml" },
  yml: { name: "YAML", prism: "yaml" },
  xml: { name: "XML", prism: "xml" },
  toml: { name: "TOML", prism: "toml" },

  // Config
  md: { name: "Markdown", prism: "markdown" },
  mdx: { name: "MDX", prism: "markdown" },
  env: { name: "Environment", prism: "bash" },

  // Docker
  dockerfile: { name: "Dockerfile", prism: "docker" },

  // Python
  py: { name: "Python", prism: "python" },

  // Shell
  sh: { name: "Shell", prism: "bash" },
  bash: { name: "Bash", prism: "bash" },
  zsh: { name: "Zsh", prism: "bash" },
  ps1: { name: "PowerShell", prism: "powershell" },

  // Other
  sql: { name: "SQL", prism: "sql" },
  graphql: { name: "GraphQL", prism: "graphql" },
  gql: { name: "GraphQL", prism: "graphql" },
  rs: { name: "Rust", prism: "rust" },
  go: { name: "Go", prism: "go" },
  java: { name: "Java", prism: "java" },
  c: { name: "C", prism: "c" },
  cpp: { name: "C++", prism: "cpp" },
};

function detectLanguage(filePath: string): { name: string; prism: string } {
  const fileName = filePath.split("/").pop() || "";
  const extension = fileName.split(".").pop()?.toLowerCase() || "";

  if (fileName.toLowerCase() === "dockerfile")
    return { name: "Dockerfile", prism: "docker" };
  if (fileName.toLowerCase() === "caddyfile")
    return { name: "Caddyfile", prism: "nginx" };
  if (fileName.toLowerCase().startsWith(".env"))
    return { name: "Environment", prism: "bash" };

  return (
    EXTENSION_TO_LANGUAGE[extension] || {
      name: "Plain Text",
      prism: "plaintext",
    }
  );
}

// ============================================
// SYNTAX HIGHLIGHTING
// ============================================

// Token types for syntax highlighting
type TokenType =
  | "keyword"
  | "string"
  | "comment"
  | "number"
  | "operator"
  | "function"
  | "class"
  | "variable"
  | "punctuation";

interface Token {
  type: TokenType | "plain";
  content: string;
}

// Simple tokenizer for common patterns
function tokenize(code: string, language: string): Token[][] {
  const lines = code.split("\n");

  // Keywords by language
  const KEYWORDS: Record<string, string[]> = {
    javascript: [
      "const",
      "let",
      "var",
      "function",
      "return",
      "if",
      "else",
      "for",
      "while",
      "switch",
      "case",
      "break",
      "continue",
      "import",
      "export",
      "from",
      "default",
      "class",
      "extends",
      "new",
      "this",
      "async",
      "await",
      "try",
      "catch",
      "throw",
      "typeof",
      "instanceof",
      "true",
      "false",
      "null",
      "undefined",
    ],
    typescript: [
      "const",
      "let",
      "var",
      "function",
      "return",
      "if",
      "else",
      "for",
      "while",
      "switch",
      "case",
      "break",
      "continue",
      "import",
      "export",
      "from",
      "default",
      "class",
      "extends",
      "new",
      "this",
      "async",
      "await",
      "try",
      "catch",
      "throw",
      "typeof",
      "instanceof",
      "true",
      "false",
      "null",
      "undefined",
      "interface",
      "type",
      "enum",
      "as",
      "implements",
      "public",
      "private",
      "protected",
      "readonly",
      "abstract",
    ],
    python: [
      "def",
      "class",
      "return",
      "if",
      "else",
      "elif",
      "for",
      "while",
      "import",
      "from",
      "as",
      "try",
      "except",
      "finally",
      "raise",
      "with",
      "lambda",
      "True",
      "False",
      "None",
      "and",
      "or",
      "not",
      "in",
      "is",
      "pass",
      "break",
      "continue",
      "yield",
      "async",
      "await",
    ],
    json: [],
    css: [],
    html: [],
  };

  const keywords = KEYWORDS[language] || KEYWORDS.javascript;

  return lines.map((line) => {
    const tokens: Token[] = [];
    let remaining = line;
    let i = 0;

    while (remaining.length > 0 && i < 10000) {
      i++;
      let matched = false;

      // Comments
      if (remaining.startsWith("//") || remaining.startsWith("#")) {
        tokens.push({ type: "comment", content: remaining });
        remaining = "";
        matched = true;
      }
      // Block comment start
      else if (remaining.startsWith("/*")) {
        const endIdx = remaining.indexOf("*/", 2);
        if (endIdx !== -1) {
          tokens.push({
            type: "comment",
            content: remaining.substring(0, endIdx + 2),
          });
          remaining = remaining.substring(endIdx + 2);
        } else {
          tokens.push({ type: "comment", content: remaining });
          remaining = "";
        }
        matched = true;
      }
      // Strings (double quotes)
      else if (remaining.startsWith('"')) {
        const endIdx = remaining.indexOf('"', 1);
        if (endIdx !== -1) {
          tokens.push({
            type: "string",
            content: remaining.substring(0, endIdx + 1),
          });
          remaining = remaining.substring(endIdx + 1);
        } else {
          tokens.push({ type: "string", content: remaining });
          remaining = "";
        }
        matched = true;
      }
      // Strings (single quotes)
      else if (remaining.startsWith("'")) {
        const endIdx = remaining.indexOf("'", 1);
        if (endIdx !== -1) {
          tokens.push({
            type: "string",
            content: remaining.substring(0, endIdx + 1),
          });
          remaining = remaining.substring(endIdx + 1);
        } else {
          tokens.push({ type: "string", content: remaining });
          remaining = "";
        }
        matched = true;
      }
      // Template literals
      else if (remaining.startsWith("`")) {
        const endIdx = remaining.indexOf("`", 1);
        if (endIdx !== -1) {
          tokens.push({
            type: "string",
            content: remaining.substring(0, endIdx + 1),
          });
          remaining = remaining.substring(endIdx + 1);
        } else {
          tokens.push({ type: "string", content: remaining });
          remaining = "";
        }
        matched = true;
      }
      // Numbers
      else if (/^[0-9]/.test(remaining)) {
        const match = remaining.match(/^[0-9]+(\.[0-9]+)?/);
        if (match) {
          tokens.push({ type: "number", content: match[0] });
          remaining = remaining.substring(match[0].length);
          matched = true;
        }
      }
      // Keywords & identifiers
      else if (/^[a-zA-Z_$]/.test(remaining)) {
        const match = remaining.match(/^[a-zA-Z_$][a-zA-Z0-9_$]*/);
        if (match) {
          const word = match[0];
          if (keywords.includes(word)) {
            tokens.push({ type: "keyword", content: word });
          } else if (remaining.substring(word.length).match(/^\s*\(/)) {
            tokens.push({ type: "function", content: word });
          } else if (/^[A-Z]/.test(word)) {
            tokens.push({ type: "class", content: word });
          } else {
            tokens.push({ type: "variable", content: word });
          }
          remaining = remaining.substring(word.length);
          matched = true;
        }
      }
      // Operators
      else if (/^[+\-*/%=<>!&|^~?:]+/.test(remaining)) {
        const match = remaining.match(/^[+\-*/%=<>!&|^~?:]+/);
        if (match) {
          tokens.push({ type: "operator", content: match[0] });
          remaining = remaining.substring(match[0].length);
          matched = true;
        }
      }
      // Punctuation
      else if (/^[{}[\](),;.]/.test(remaining)) {
        tokens.push({ type: "punctuation", content: remaining[0] });
        remaining = remaining.substring(1);
        matched = true;
      }
      // Whitespace
      else if (/^\s/.test(remaining)) {
        const match = remaining.match(/^\s+/);
        if (match) {
          tokens.push({ type: "plain", content: match[0] });
          remaining = remaining.substring(match[0].length);
          matched = true;
        }
      }

      if (!matched) {
        tokens.push({ type: "plain", content: remaining[0] });
        remaining = remaining.substring(1);
      }
    }

    return tokens;
  });
}

// Token colors
const TOKEN_COLORS: Record<TokenType | "plain", string> = {
  keyword: "#c678dd",
  string: "#98c379",
  comment: "#5c6370",
  number: "#d19a66",
  operator: "#56b6c2",
  function: "#61afef",
  class: "#e5c07b",
  variable: "#abb2bf",
  punctuation: "#abb2bf",
  plain: "#abb2bf",
};

// ============================================
// COMPONENT
// ============================================

export function CodeEditorPanel({
  fileId,
  filePath,
  onSave,
  onClose,
  initialContent = "",
  readOnly = false,
}: CodeEditorPanelProps) {
  const [content, setContent] = useState(initialContent);
  const [originalContent, setOriginalContent] = useState(initialContent);
  const [loading, setLoading] = useState(!initialContent);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [replaceQuery, setReplaceQuery] = useState("");
  const [splitView, setSplitView] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const language = useMemo(() => detectLanguage(filePath), [filePath]);
  const fileName = filePath.split("/").pop() || "Unknown file";

  // Fetch content if not provided
  useEffect(() => {
    if (initialContent) return;

    const fetchContent = async () => {
      setLoading(true);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "";
        const response = await fetch(`${apiUrl}/api/nodes/${fileId}/source`);
        if (!response.ok) throw new Error("Failed to load file");
        const data = await response.json();
        if (data.success && data.data) {
          setContent(data.data.content || "");
          setOriginalContent(data.data.content || "");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load file");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [fileId, initialContent]);

  // Tokenized content for syntax highlighting
  const highlightedLines = useMemo(() => {
    return tokenize(content, language.prism);
  }, [content, language.prism]);

  // Line count
  const lineCount = content.split("\n").length;

  // Sync scroll between textarea and highlight
  const handleScroll = useCallback(() => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
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
    if (!onSave || !hasChanges || readOnly) return;

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
  }, [content, hasChanges, onSave, readOnly]);

  // Handle copy
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [content, fileName]);

  // Handle format
  const handleFormat = useCallback(() => {
    try {
      if (language.prism === "json") {
        const parsed = JSON.parse(content);
        const formatted = JSON.stringify(parsed, null, 2);
        setContent(formatted);
        setHasChanges(formatted !== originalContent);
      }
    } catch (err) {
      setError("Failed to format: Invalid JSON");
    }
  }, [content, language.prism, originalContent]);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        setShowSearch(true);
      }
      if (e.key === "Escape") {
        if (showSearch) {
          setShowSearch(false);
        } else if (isFullscreen) {
          setIsFullscreen(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave, showSearch, isFullscreen]);

  // Search & Replace
  const handleSearch = useCallback(() => {
    if (!searchQuery || !textareaRef.current) return;
    const text = textareaRef.current.value;
    const index = text.indexOf(searchQuery);
    if (index !== -1) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(index, index + searchQuery.length);
    }
  }, [searchQuery]);

  const handleReplace = useCallback(() => {
    if (!searchQuery) return;
    setContent((prev) => prev.replace(searchQuery, replaceQuery));
    setHasChanges(true);
  }, [searchQuery, replaceQuery]);

  const handleReplaceAll = useCallback(() => {
    if (!searchQuery) return;
    setContent((prev) => prev.split(searchQuery).join(replaceQuery));
    setHasChanges(true);
  }, [searchQuery, replaceQuery]);

  return (
    <div
      ref={containerRef}
      className={`code-editor-panel ${isFullscreen ? "fullscreen" : ""}`}
    >
      {/* Header */}
      <div className="editor-header">
        <div className="file-info">
          <FileCode size={18} className="file-icon" />
          <span className="file-name" title={filePath}>
            {fileName}
          </span>
          <span className="language-badge">{language.name}</span>
          {hasChanges && <span className="unsaved-dot">●</span>}
        </div>

        <div className="header-actions">
          <button
            className="icon-btn"
            onClick={() => setShowSearch(!showSearch)}
            title="Search (Ctrl+F)"
          >
            <Search size={16} />
          </button>

          {language.prism === "json" && (
            <button
              className="icon-btn"
              onClick={handleFormat}
              title="Format JSON"
            >
              <Wand2 size={16} />
            </button>
          )}

          <button
            className="icon-btn"
            onClick={() => setSplitView(!splitView)}
            title="Split View"
          >
            <Columns size={16} />
          </button>

          <button className="icon-btn" onClick={handleCopy} title="Copy">
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>

          <button
            className="icon-btn"
            onClick={handleDownload}
            title="Download"
          >
            <Download size={16} />
          </button>

          <button
            className="icon-btn"
            onClick={toggleFullscreen}
            title="Fullscreen"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>

          {onSave && !readOnly && (
            <button
              className={`icon-btn save ${hasChanges ? "active" : ""}`}
              onClick={handleSave}
              disabled={!hasChanges || saving}
              title="Save (Ctrl+S)"
            >
              {saving ? (
                <Loader2 size={16} className="spin" />
              ) : (
                <Save size={16} />
              )}
            </button>
          )}

          <button className="icon-btn close" onClick={onClose} title="Close">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="search-bar">
          <div className="search-group">
            <Search size={14} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              autoFocus
            />
          </div>
          <div className="search-group">
            <Replace size={14} />
            <input
              type="text"
              placeholder="Replace..."
              value={replaceQuery}
              onChange={(e) => setReplaceQuery(e.target.value)}
            />
          </div>
          <button className="search-btn" onClick={handleReplace}>
            Replace
          </button>
          <button className="search-btn" onClick={handleReplaceAll}>
            Replace All
          </button>
          <button className="search-close" onClick={() => setShowSearch(false)}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* Path Bar */}
      <div className="path-bar">
        <span className="path">{filePath}</span>
      </div>

      {/* Editor Content */}
      <div className={`editor-content ${splitView ? "split" : ""}`}>
        {loading && (
          <div className="loading-overlay">
            <Loader2 size={32} className="spin" />
            <span>Loading file...</span>
          </div>
        )}

        {error && (
          <div className="error-overlay">
            <AlertCircle size={24} />
            <span>{error}</span>
            <button onClick={() => setError(null)}>Dismiss</button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="editor-wrapper">
              {/* Line Numbers */}
              <div className="line-numbers">
                {Array.from({ length: lineCount }, (_, i) => (
                  <div key={i} className="line-number">
                    {i + 1}
                  </div>
                ))}
              </div>

              {/* Highlighted Code (background layer) */}
              <div className="highlight-layer" ref={highlightRef}>
                <pre>
                  {highlightedLines.map((line, lineIdx) => (
                    <div key={lineIdx} className="code-line">
                      {line.map((token, tokenIdx) => (
                        <span
                          key={tokenIdx}
                          style={{ color: TOKEN_COLORS[token.type] }}
                        >
                          {token.content}
                        </span>
                      ))}
                      {line.length === 0 && "\n"}
                    </div>
                  ))}
                </pre>
              </div>

              {/* Textarea (foreground, transparent) */}
              <textarea
                ref={textareaRef}
                className="code-textarea"
                value={content}
                onChange={handleChange}
                onScroll={handleScroll}
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
                readOnly={readOnly}
              />
            </div>

            {/* Split View - Preview */}
            {splitView && (
              <div className="preview-pane">
                <div className="preview-header">
                  <span>Preview</span>
                </div>
                <div className="preview-content">
                  <pre>
                    {highlightedLines.map((line, lineIdx) => (
                      <div key={lineIdx} className="code-line">
                        {line.map((token, tokenIdx) => (
                          <span
                            key={tokenIdx}
                            style={{ color: TOKEN_COLORS[token.type] }}
                          >
                            {token.content}
                          </span>
                        ))}
                      </div>
                    ))}
                  </pre>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="editor-footer">
        <span className="stats">
          {lineCount} lines • {content.length} chars
        </span>
        <span className="status">
          {hasChanges ? "● Unsaved changes" : "✓ Saved"}
        </span>
        <span className="encoding">UTF-8</span>
      </div>
    </div>
  );
}

export default CodeEditorPanel;
