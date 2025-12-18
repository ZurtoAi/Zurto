/**
 * Canvas Wrapper
 *
 * Main wrapper component that orchestrates the canvas system
 * Handles level navigation, panels, and layout
 */

import React from "react";
import { CanvasProvider, useCanvas } from "../../context/CanvasContext";
import { MainCanvas } from "./MainCanvas";
import { ServiceCanvas } from "./ServiceCanvas";
import { SourceCodePanel } from "../panels/SourceCodePanel";
import { TerminalPanel } from "../panels/TerminalPanel";
import { GlobalSearch } from "../search/GlobalSearch";
import "./CanvasWrapper.css";

interface CanvasWrapperProps {
  projectId: string;
}

function CanvasContent({ projectId }: CanvasWrapperProps) {
  const {
    state,
    closeFile,
    toggleLogsPanel,
    toggleTerminalPanel,
    toggleSearchPanel,
  } = useCanvas();

  const {
    level,
    currentServiceId,
    currentPath,
    selectedFileId,
    selectedFilePath,
    logsPanelOpen,
    terminalPanelOpen,
    searchPanelOpen,
    terminalServiceId,
    breadcrumb,
  } = state;

  // Get service name from breadcrumb
  const currentServiceName =
    breadcrumb.find((b) => b.type === "service" && b.id === currentServiceId)
      ?.name || "";

  const terminalServiceName =
    breadcrumb.find((b) => b.type === "service" && b.id === terminalServiceId)
      ?.name || "";

  return (
    <div className="canvas-wrapper">
      {/* Search Panel (Left Sidebar) */}
      {searchPanelOpen && (
        <div className="search-sidebar">
          <GlobalSearch projectId={projectId} />
        </div>
      )}

      {/* Main Canvas Area */}
      <div className="canvas-main">
        {level === 0 ? (
          <MainCanvas projectId={projectId} />
        ) : (
          <ServiceCanvas
            serviceId={currentServiceId || ""}
            currentPath={currentPath}
          />
        )}
      </div>

      {/* Right Panel (Source Code / Logs / Terminal) */}
      {(selectedFileId || logsPanelOpen || terminalPanelOpen) && (
        <div className="right-panel">
          {selectedFileId && selectedFilePath && (
            <SourceCodePanel
              fileId={selectedFileId}
              filePath={selectedFilePath}
              onClose={closeFile}
            />
          )}

          {terminalPanelOpen && terminalServiceId && (
            <TerminalPanel
              serviceId={terminalServiceId}
              serviceName={terminalServiceName}
            />
          )}
        </div>
      )}

      {/* Floating Action Bar */}
      <div className="floating-actions">
        <button
          className={`action-btn ${searchPanelOpen ? "active" : ""}`}
          onClick={() => toggleSearchPanel()}
          title="Search (Ctrl+Shift+F)"
        >
          🔍
        </button>

        <button
          className={`action-btn ${terminalPanelOpen ? "active" : ""}`}
          onClick={() => {
            if (currentServiceId) {
              toggleTerminalPanel(currentServiceId);
            }
          }}
          title="Terminal"
          disabled={!currentServiceId}
        >
          🖥️
        </button>
      </div>

      {/* Keyboard Shortcuts Handler */}
      <KeyboardShortcuts />
    </div>
  );
}

function KeyboardShortcuts() {
  const { state, toggleSearchPanel, navigateBack } = useCanvas();
  const { level } = state;

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+F = Search
      if (e.ctrlKey && e.shiftKey && e.key === "F") {
        e.preventDefault();
        toggleSearchPanel();
      }

      // Backspace/Alt+Left = Back
      if (
        (e.key === "Backspace" && !isInputFocused()) ||
        (e.altKey && e.key === "ArrowLeft")
      ) {
        if (level > 0) {
          e.preventDefault();
          navigateBack();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSearchPanel, navigateBack, level]);

  return null;
}

function isInputFocused(): boolean {
  const active = document.activeElement;
  return (
    active?.tagName === "INPUT" ||
    active?.tagName === "TEXTAREA" ||
    (active as HTMLElement)?.contentEditable === "true"
  );
}

export function CanvasWrapper({ projectId }: CanvasWrapperProps) {
  return (
    <CanvasProvider>
      <CanvasContent projectId={projectId} />
    </CanvasProvider>
  );
}
