/**
 * ZCodeEditor - Lightweight code editor with syntax highlighting
 */

import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  KeyboardEvent,
} from "react";
import styles from "./ZCodeEditor.module.css";

export type ZCodeEditorProps = {
  /** Code value */
  value: string;
  /** Called when code changes */
  onChange?: (value: string) => void;
  /** Programming language for syntax highlighting */
  language?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Read-only mode */
  readOnly?: boolean;
  /** Show line numbers */
  showLineNumbers?: boolean;
  /** Tab size (spaces) */
  tabSize?: number;
  /** Minimum height */
  minHeight?: string;
  /** Maximum height */
  maxHeight?: string;
  /** Additional class name */
  className?: string;
  /** Highlight specific lines */
  highlightLines?: number[];
  /** Wrap long lines */
  wordWrap?: boolean;
};

// Basic syntax highlighting patterns
const PATTERNS: Record<
  string,
  Array<{ pattern: RegExp; className: string }>
> = {
  javascript: [
    { pattern: /(\/\/.*$)/gm, className: styles.comment },
    { pattern: /(\/\*[\s\S]*?\*\/)/g, className: styles.comment },
    {
      pattern: /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g,
      className: styles.string,
    },
    {
      pattern:
        /\b(const|let|var|function|return|if|else|for|while|class|import|export|from|default|async|await|try|catch|throw|new|this|typeof|instanceof)\b/g,
      className: styles.keyword,
    },
    {
      pattern: /\b(true|false|null|undefined|NaN|Infinity)\b/g,
      className: styles.boolean,
    },
    { pattern: /\b(\d+\.?\d*)\b/g, className: styles.number },
    { pattern: /\b([A-Z][a-zA-Z0-9]*)\b/g, className: styles.className },
  ],
  typescript: [
    { pattern: /(\/\/.*$)/gm, className: styles.comment },
    { pattern: /(\/\*[\s\S]*?\*\/)/g, className: styles.comment },
    {
      pattern: /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g,
      className: styles.string,
    },
    {
      pattern:
        /\b(const|let|var|function|return|if|else|for|while|class|import|export|from|default|async|await|try|catch|throw|new|this|typeof|instanceof|type|interface|enum|implements|extends|public|private|protected|readonly)\b/g,
      className: styles.keyword,
    },
    {
      pattern: /\b(true|false|null|undefined|NaN|Infinity)\b/g,
      className: styles.boolean,
    },
    { pattern: /\b(\d+\.?\d*)\b/g, className: styles.number },
    { pattern: /\b([A-Z][a-zA-Z0-9]*)\b/g, className: styles.className },
    {
      pattern: /:\s*(string|number|boolean|any|void|never|unknown|object)\b/g,
      className: styles.type,
    },
  ],
  css: [
    { pattern: /(\/\*[\s\S]*?\*\/)/g, className: styles.comment },
    {
      pattern: /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g,
      className: styles.string,
    },
    { pattern: /(#[a-fA-F0-9]{3,8})\b/g, className: styles.color },
    {
      pattern: /\b(\d+\.?\d*(px|em|rem|%|vh|vw|deg|s|ms)?)\b/g,
      className: styles.number,
    },
    {
      pattern: /([.#]?[a-zA-Z_][a-zA-Z0-9_-]*)\s*(?=\{)/g,
      className: styles.selector,
    },
    {
      pattern:
        /\b(var|calc|rgb|rgba|hsl|hsla|url|linear-gradient|radial-gradient)\b/g,
      className: styles.function,
    },
  ],
  json: [
    { pattern: /("(?:[^"\\]|\\.)*")(?=\s*:)/g, className: styles.property },
    { pattern: /:\s*("(?:[^"\\]|\\.)*")/g, className: styles.string },
    { pattern: /\b(true|false|null)\b/g, className: styles.boolean },
    { pattern: /\b(-?\d+\.?\d*)\b/g, className: styles.number },
  ],
};

export function ZCodeEditor({
  value,
  onChange,
  language = "javascript",
  placeholder = "Enter code...",
  readOnly = false,
  showLineNumbers = true,
  tabSize = 2,
  minHeight = "200px",
  maxHeight = "500px",
  className,
  highlightLines = [],
  wordWrap = false,
}: ZCodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const lines = value.split("\n");

  // Syntax highlighting
  const highlightCode = useCallback(
    (code: string): string => {
      const patterns = PATTERNS[language] || PATTERNS.javascript;
      let highlighted = escapeHtml(code);

      patterns.forEach(({ pattern, className }) => {
        highlighted = highlighted.replace(pattern, (match) => {
          // Avoid double-wrapping
          if (match.includes("<span")) return match;
          return `<span class="${className}">${match}</span>`;
        });
      });

      return highlighted;
    },
    [language]
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (readOnly) return;

    const textarea = e.currentTarget;
    const { selectionStart, selectionEnd } = textarea;

    // Tab handling
    if (e.key === "Tab") {
      e.preventDefault();
      const spaces = " ".repeat(tabSize);

      if (e.shiftKey) {
        // Outdent
        const beforeCursor = value.substring(0, selectionStart);
        const lineStart = beforeCursor.lastIndexOf("\n") + 1;
        const lineContent = value.substring(lineStart, selectionStart);

        if (lineContent.startsWith(spaces)) {
          const newValue =
            value.substring(0, lineStart) +
            value.substring(lineStart + tabSize);
          onChange?.(newValue);

          requestAnimationFrame(() => {
            textarea.selectionStart = selectionStart - tabSize;
            textarea.selectionEnd = selectionEnd - tabSize;
          });
        }
      } else {
        // Indent
        const newValue =
          value.substring(0, selectionStart) +
          spaces +
          value.substring(selectionEnd);
        onChange?.(newValue);

        requestAnimationFrame(() => {
          textarea.selectionStart = selectionStart + tabSize;
          textarea.selectionEnd = selectionStart + tabSize;
        });
      }
    }

    // Enter - auto indent
    if (e.key === "Enter") {
      e.preventDefault();
      const beforeCursor = value.substring(0, selectionStart);
      const lineStart = beforeCursor.lastIndexOf("\n") + 1;
      const currentLine = beforeCursor.substring(lineStart);
      const indent = currentLine.match(/^\s*/)?.[0] || "";

      // Add extra indent after { or :
      const lastChar = beforeCursor.trim().slice(-1);
      const extraIndent = ["{", ":", "(", "["].includes(lastChar)
        ? " ".repeat(tabSize)
        : "";

      const newValue =
        value.substring(0, selectionStart) +
        "\n" +
        indent +
        extraIndent +
        value.substring(selectionEnd);
      onChange?.(newValue);

      requestAnimationFrame(() => {
        const newPos = selectionStart + 1 + indent.length + extraIndent.length;
        textarea.selectionStart = newPos;
        textarea.selectionEnd = newPos;
      });
    }

    // Bracket pairing
    const pairs: Record<string, string> = {
      "(": ")",
      "[": "]",
      "{": "}",
      '"': '"',
      "'": "'",
      "`": "`",
    };

    if (pairs[e.key]) {
      e.preventDefault();
      const pair = pairs[e.key];
      const selected = value.substring(selectionStart, selectionEnd);
      const newValue =
        value.substring(0, selectionStart) +
        e.key +
        selected +
        pair +
        value.substring(selectionEnd);
      onChange?.(newValue);

      requestAnimationFrame(() => {
        textarea.selectionStart = selectionStart + 1;
        textarea.selectionEnd = selectionEnd + 1;
      });
    }
  };

  // Sync scroll
  const handleScroll = () => {
    const textarea = textareaRef.current;
    const pre = textarea?.parentElement?.querySelector("pre");
    if (textarea && pre) {
      pre.scrollTop = textarea.scrollTop;
      pre.scrollLeft = textarea.scrollLeft;
    }
  };

  return (
    <div
      className={`${styles.container} ${isFocused ? styles.focused : ""} ${
        className || ""
      }`}
      style={{ minHeight, maxHeight }}
    >
      {showLineNumbers && (
        <div className={styles.lineNumbers} aria-hidden="true">
          {lines.map((_, index) => (
            <span
              key={index}
              className={`${styles.lineNumber} ${
                highlightLines.includes(index + 1) ? styles.highlighted : ""
              }`}
            >
              {index + 1}
            </span>
          ))}
        </div>
      )}

      <div className={styles.editor}>
        <pre
          className={`${styles.pre} ${wordWrap ? styles.wordWrap : ""}`}
          aria-hidden="true"
        >
          <code
            dangerouslySetInnerHTML={{
              __html:
                highlightCode(value) ||
                `<span class="${styles.placeholder}">${placeholder}</span>`,
            }}
          />
        </pre>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          readOnly={readOnly}
          placeholder={placeholder}
          className={`${styles.textarea} ${wordWrap ? styles.wordWrap : ""}`}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          aria-label="Code editor"
        />
      </div>
    </div>
  );
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export default ZCodeEditor;
