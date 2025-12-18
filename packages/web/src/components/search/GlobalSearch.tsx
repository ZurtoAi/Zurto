/**
 * Global Search
 *
 * Search across all files in all services
 */

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useCanvas } from "../../context/CanvasContext";
import "./GlobalSearch.css";

interface SearchResult {
  id: string;
  path: string;
  fileName: string;
  serviceId: string;
  serviceName: string;
  matches: {
    line: number;
    content: string;
    highlight: [number, number][];
  }[];
}

interface GlobalSearchProps {
  projectId: string;
}

export function GlobalSearch({ projectId }: GlobalSearchProps) {
  const { toggleSearchPanel, selectFile, navigateToService } = useCanvas();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchType, setSearchType] = useState<"content" | "filename">(
    "content"
  );
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [regex, setRegex] = useState(false);
  const [expandedResults, setExpandedResults] = useState<Set<string>>(
    new Set()
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Search function
  const search = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const apiUrl = import.meta.env.VITE_API_URL || "";
        const params = new URLSearchParams({
          q: searchQuery,
          type: searchType,
          caseSensitive: String(caseSensitive),
          regex: String(regex),
          projectId,
        });

        const response = await fetch(`${apiUrl}/api/search?${params}`);

        if (!response.ok) {
          throw new Error(`Search failed: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.success && data.data?.results) {
          setResults(data.data.results);
        } else {
          setResults([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Search failed");
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [projectId, searchType, caseSensitive, regex]
  );

  // Debounced search
  const handleQueryChange = useCallback(
    (value: string) => {
      setQuery(value);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        search(value);
      }, 300);
    },
    [search]
  );

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Toggle expanded result
  const toggleExpanded = (resultId: string) => {
    setExpandedResults((prev) => {
      const next = new Set(prev);
      if (next.has(resultId)) {
        next.delete(resultId);
      } else {
        next.add(resultId);
      }
      return next;
    });
  };

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    // Navigate to service then select file
    navigateToService(result.serviceId, result.serviceName);
    selectFile(result.id, result.path);
  };

  // Handle match click
  const handleMatchClick = (result: SearchResult, line: number) => {
    navigateToService(result.serviceId, result.serviceName);
    selectFile(result.id, result.path);
    // TODO: Jump to specific line in editor
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        toggleSearchPanel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSearchPanel]);

  const totalMatches = results.reduce((sum, r) => sum + r.matches.length, 0);

  return (
    <div className="global-search">
      <div className="search-header">
        <div className="header-title">
          <span className="search-icon">🔍</span>
          <span>Global Search</span>
        </div>
        <button
          className="close-btn"
          onClick={() => toggleSearchPanel()}
          title="Close (Esc)"
        >
          ✕
        </button>
      </div>

      <div className="search-input-container">
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder="Search files..."
        />
        {loading && <span className="loading-indicator">⏳</span>}
      </div>

      <div className="search-options">
        <div className="option-group">
          <button
            className={`option-btn ${searchType === "content" ? "active" : ""}`}
            onClick={() => setSearchType("content")}
          >
            Content
          </button>
          <button
            className={`option-btn ${searchType === "filename" ? "active" : ""}`}
            onClick={() => setSearchType("filename")}
          >
            Filename
          </button>
        </div>

        <div className="option-group">
          <label className="checkbox-option">
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
            />
            <span>Aa</span>
          </label>
          <label className="checkbox-option">
            <input
              type="checkbox"
              checked={regex}
              onChange={(e) => setRegex(e.target.checked)}
            />
            <span>.*</span>
          </label>
        </div>
      </div>

      {error && (
        <div className="search-error">
          <span>❌ {error}</span>
        </div>
      )}

      {query && !loading && (
        <div className="search-stats">
          {results.length > 0 ? (
            <span>
              {totalMatches} match{totalMatches !== 1 ? "es" : ""} in{" "}
              {results.length} file{results.length !== 1 ? "s" : ""}
            </span>
          ) : (
            <span>No results found</span>
          )}
        </div>
      )}

      <div className="search-results">
        {results.map((result) => (
          <div key={result.id} className="search-result">
            <div
              className="result-header"
              onClick={() => toggleExpanded(result.id)}
            >
              <span className="expand-icon">
                {expandedResults.has(result.id) ? "▼" : "▶"}
              </span>
              <span className="file-icon">{getFileIcon(result.fileName)}</span>
              <span className="file-name">{result.fileName}</span>
              <span className="file-path">{result.path}</span>
              <span className="match-count">{result.matches.length}</span>
            </div>

            {expandedResults.has(result.id) && (
              <div className="result-matches">
                {result.matches.map((match, index) => (
                  <div
                    key={index}
                    className="match-line"
                    onClick={() => handleMatchClick(result, match.line)}
                  >
                    <span className="line-number">{match.line}</span>
                    <span className="line-content">
                      {highlightContent(match.content, match.highlight)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function getFileIcon(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  const icons: Record<string, string> = {
    ts: "🔷",
    tsx: "⚛️",
    js: "📜",
    jsx: "⚛️",
    py: "🐍",
    go: "🔵",
    html: "🌐",
    css: "🎨",
    json: "📋",
    yaml: "📋",
    md: "📝",
  };
  return icons[ext] || "📄";
}

function highlightContent(
  content: string,
  highlights: [number, number][]
): React.ReactNode {
  if (!highlights || highlights.length === 0) {
    return content;
  }

  const parts: React.ReactNode[] = [];
  let lastEnd = 0;

  for (const [start, end] of highlights) {
    if (start > lastEnd) {
      parts.push(content.slice(lastEnd, start));
    }
    parts.push(
      <mark key={start} className="highlight">
        {content.slice(start, end)}
      </mark>
    );
    lastEnd = end;
  }

  if (lastEnd < content.length) {
    parts.push(content.slice(lastEnd));
  }

  return parts;
}
