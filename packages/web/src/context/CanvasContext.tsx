/**
 * Canvas Context
 *
 * Manages navigation state for the multi-level canvas system
 * Supports main canvas (Docker services) → nested canvas (file structure)
 */

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
} from "react";

// ============================================
// TYPES
// ============================================

export interface BreadcrumbItem {
  id: string;
  name: string;
  type: "main" | "service" | "folder";
  path?: string;
}

export interface CanvasState {
  // Navigation level (0 = main canvas, 1+ = nested)
  level: number;

  // Breadcrumb path for navigation
  breadcrumb: BreadcrumbItem[];

  // Current service being viewed (null on main canvas)
  currentServiceId: string | null;
  currentServiceName: string | null;

  // Current folder path within service (empty = root)
  currentPath: string[];

  // Currently selected file (for source code panel)
  selectedFileId: string | null;
  selectedFilePath: string | null;

  // Panel visibility
  sourceCodePanelOpen: boolean;
  logsPanelOpen: boolean;
  terminalPanelOpen: boolean;
  searchPanelOpen: boolean;

  // Active terminal service
  terminalServiceId: string | null;
}

type CanvasAction =
  | { type: "NAVIGATE_TO_SERVICE"; serviceId: string; serviceName: string }
  | { type: "NAVIGATE_INTO_FOLDER"; folderId: string; folderName: string }
  | { type: "NAVIGATE_BACK" }
  | { type: "NAVIGATE_TO_BREADCRUMB"; index: number }
  | { type: "NAVIGATE_TO_MAIN" }
  | { type: "SELECT_FILE"; fileId: string; filePath: string }
  | { type: "CLOSE_FILE" }
  | { type: "TOGGLE_LOGS_PANEL"; serviceId?: string }
  | { type: "TOGGLE_TERMINAL_PANEL"; serviceId?: string }
  | { type: "TOGGLE_SEARCH_PANEL" }
  | { type: "CLOSE_ALL_PANELS" };

interface CanvasContextValue {
  state: CanvasState;

  // Navigation actions
  navigateToService: (serviceId: string, serviceName: string) => void;
  navigateIntoFolder: (folderId: string, folderName: string) => void;
  navigateBack: () => void;
  navigateToBreadcrumb: (index: number) => void;
  navigateToMain: () => void;

  // File selection
  selectFile: (fileId: string, filePath: string) => void;
  closeFile: () => void;

  // Panel toggles
  toggleLogsPanel: (serviceId?: string) => void;
  toggleTerminalPanel: (serviceId?: string) => void;
  toggleSearchPanel: () => void;
  closeAllPanels: () => void;

  // Computed values
  isMainCanvas: boolean;
  isServiceCanvas: boolean;
  canNavigateBack: boolean;
  currentBreadcrumbPath: string;
}

// ============================================
// INITIAL STATE
// ============================================

const initialState: CanvasState = {
  level: 0,
  breadcrumb: [{ id: "main", name: "Services", type: "main" }],
  currentServiceId: null,
  currentServiceName: null,
  currentPath: [],
  selectedFileId: null,
  selectedFilePath: null,
  sourceCodePanelOpen: false,
  logsPanelOpen: false,
  terminalPanelOpen: false,
  searchPanelOpen: false,
  terminalServiceId: null,
};

// ============================================
// REDUCER
// ============================================

function canvasReducer(state: CanvasState, action: CanvasAction): CanvasState {
  switch (action.type) {
    case "NAVIGATE_TO_SERVICE":
      return {
        ...state,
        level: 1,
        currentServiceId: action.serviceId,
        currentServiceName: action.serviceName,
        currentPath: [],
        breadcrumb: [
          { id: "main", name: "Services", type: "main" },
          { id: action.serviceId, name: action.serviceName, type: "service" },
        ],
        // Close file when navigating to new service
        selectedFileId: null,
        selectedFilePath: null,
        sourceCodePanelOpen: false,
      };

    case "NAVIGATE_INTO_FOLDER":
      return {
        ...state,
        level: state.level + 1,
        currentPath: [...state.currentPath, action.folderName],
        breadcrumb: [
          ...state.breadcrumb,
          {
            id: action.folderId,
            name: action.folderName,
            type: "folder",
            path: [...state.currentPath, action.folderName].join("/"),
          },
        ],
      };

    case "NAVIGATE_BACK":
      if (state.level <= 0) return state;

      if (state.level === 1) {
        // Go back to main canvas
        return {
          ...state,
          level: 0,
          currentServiceId: null,
          currentServiceName: null,
          currentPath: [],
          breadcrumb: [{ id: "main", name: "Services", type: "main" }],
          selectedFileId: null,
          selectedFilePath: null,
          sourceCodePanelOpen: false,
        };
      }

      // Go up one folder level
      const newPath = state.currentPath.slice(0, -1);
      return {
        ...state,
        level: state.level - 1,
        currentPath: newPath,
        breadcrumb: state.breadcrumb.slice(0, -1),
      };

    case "NAVIGATE_TO_BREADCRUMB":
      if (action.index === 0) {
        // Navigate to main
        return {
          ...state,
          level: 0,
          currentServiceId: null,
          currentServiceName: null,
          currentPath: [],
          breadcrumb: [{ id: "main", name: "Services", type: "main" }],
          selectedFileId: null,
          selectedFilePath: null,
          sourceCodePanelOpen: false,
        };
      }

      if (action.index === 1 && state.breadcrumb.length > 1) {
        // Navigate to service root
        const serviceItem = state.breadcrumb[1];
        return {
          ...state,
          level: 1,
          currentPath: [],
          breadcrumb: state.breadcrumb.slice(0, 2),
          selectedFileId: null,
          selectedFilePath: null,
          sourceCodePanelOpen: false,
        };
      }

      // Navigate to specific folder in path
      const targetIndex = action.index;
      const pathUpToTarget = state.breadcrumb
        .slice(2, targetIndex + 1)
        .map((b) => b.name);

      return {
        ...state,
        level: targetIndex,
        currentPath: pathUpToTarget,
        breadcrumb: state.breadcrumb.slice(0, targetIndex + 1),
      };

    case "NAVIGATE_TO_MAIN":
      return {
        ...initialState,
      };

    case "SELECT_FILE":
      return {
        ...state,
        selectedFileId: action.fileId,
        selectedFilePath: action.filePath,
        sourceCodePanelOpen: true,
      };

    case "CLOSE_FILE":
      return {
        ...state,
        selectedFileId: null,
        selectedFilePath: null,
        sourceCodePanelOpen: false,
      };

    case "TOGGLE_LOGS_PANEL":
      return {
        ...state,
        logsPanelOpen: !state.logsPanelOpen,
        // Close other panels when opening logs
        terminalPanelOpen: state.logsPanelOpen
          ? state.terminalPanelOpen
          : false,
      };

    case "TOGGLE_TERMINAL_PANEL":
      return {
        ...state,
        terminalPanelOpen: !state.terminalPanelOpen,
        terminalServiceId: action.serviceId || state.terminalServiceId,
        // Close other panels when opening terminal
        logsPanelOpen: state.terminalPanelOpen ? state.logsPanelOpen : false,
      };

    case "TOGGLE_SEARCH_PANEL":
      return {
        ...state,
        searchPanelOpen: !state.searchPanelOpen,
      };

    case "CLOSE_ALL_PANELS":
      return {
        ...state,
        sourceCodePanelOpen: false,
        logsPanelOpen: false,
        terminalPanelOpen: false,
        searchPanelOpen: false,
        selectedFileId: null,
        selectedFilePath: null,
      };

    default:
      return state;
  }
}

// ============================================
// CONTEXT
// ============================================

const CanvasContext = createContext<CanvasContextValue | null>(null);

// ============================================
// PROVIDER
// ============================================

interface CanvasProviderProps {
  children: ReactNode;
}

export function CanvasProvider({ children }: CanvasProviderProps) {
  const [state, dispatch] = useReducer(canvasReducer, initialState);

  // Navigation actions
  const navigateToService = useCallback(
    (serviceId: string, serviceName: string) => {
      dispatch({ type: "NAVIGATE_TO_SERVICE", serviceId, serviceName });
    },
    []
  );

  const navigateIntoFolder = useCallback(
    (folderId: string, folderName: string) => {
      dispatch({ type: "NAVIGATE_INTO_FOLDER", folderId, folderName });
    },
    []
  );

  const navigateBack = useCallback(() => {
    dispatch({ type: "NAVIGATE_BACK" });
  }, []);

  const navigateToBreadcrumb = useCallback((index: number) => {
    dispatch({ type: "NAVIGATE_TO_BREADCRUMB", index });
  }, []);

  const navigateToMain = useCallback(() => {
    dispatch({ type: "NAVIGATE_TO_MAIN" });
  }, []);

  // File selection
  const selectFile = useCallback((fileId: string, filePath: string) => {
    dispatch({ type: "SELECT_FILE", fileId, filePath });
  }, []);

  const closeFile = useCallback(() => {
    dispatch({ type: "CLOSE_FILE" });
  }, []);

  // Panel toggles
  const toggleLogsPanel = useCallback((serviceId?: string) => {
    dispatch({ type: "TOGGLE_LOGS_PANEL", serviceId });
  }, []);

  const toggleTerminalPanel = useCallback((serviceId?: string) => {
    dispatch({ type: "TOGGLE_TERMINAL_PANEL", serviceId });
  }, []);

  const toggleSearchPanel = useCallback(() => {
    dispatch({ type: "TOGGLE_SEARCH_PANEL" });
  }, []);

  const closeAllPanels = useCallback(() => {
    dispatch({ type: "CLOSE_ALL_PANELS" });
  }, []);

  // Computed values
  const isMainCanvas = state.level === 0;
  const isServiceCanvas = state.level > 0;
  const canNavigateBack = state.level > 0;
  const currentBreadcrumbPath = state.breadcrumb.map((b) => b.name).join(" / ");

  const value: CanvasContextValue = {
    state,
    navigateToService,
    navigateIntoFolder,
    navigateBack,
    navigateToBreadcrumb,
    navigateToMain,
    selectFile,
    closeFile,
    toggleLogsPanel,
    toggleTerminalPanel,
    toggleSearchPanel,
    closeAllPanels,
    isMainCanvas,
    isServiceCanvas,
    canNavigateBack,
    currentBreadcrumbPath,
  };

  return (
    <CanvasContext.Provider value={value}>{children}</CanvasContext.Provider>
  );
}

// ============================================
// HOOK
// ============================================

export function useCanvas(): CanvasContextValue {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error("useCanvas must be used within a CanvasProvider");
  }
  return context;
}

// Export for testing
export { CanvasContext, initialState };
