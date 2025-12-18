// Zurto V3 - Core Type Definitions

// ============================================
// NODE TYPES
// ============================================

export type NodeType =
  | "planning"
  | "backend"
  | "frontend"
  | "database"
  | "cache"
  | "worker"
  | "integration"
  | "utility"
  | "service"
  | "discord"
  | "gateway"
  | "scheduler";

export type NodeStatus =
  | "running"
  | "stopped"
  | "error"
  | "starting"
  | "stopping"
  | "building"
  | "deploying";

export type RelationshipType =
  | "child_of"
  | "depends_on"
  | "calls"
  | "connects_to"
  | "hosts";

export interface Node {
  id: string;
  projectId: string;

  // Identity
  name: string;
  label: string;
  description?: string;
  type: NodeType;

  // Position on canvas
  position: { x: number; y: number };

  // Status (for runnable nodes)
  status?: NodeStatus;
  port?: number;

  // Parent/child relationships
  parentId?: string;
  children?: Node[];

  // File association (for file nodes inside workspace)
  fileName?: string;
  fileExtension?: string;
  filePath?: string;

  // Code (after build)
  code?: string;
  language?: string;

  // Planning-specific
  aiAccuracy?: number;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastDeployedAt?: Date;
}

export interface NodeRelationship {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  type: RelationshipType;
  style?: "solid" | "dashed" | "dotted";
  color?: string;
}

// ============================================
// PROJECT TYPES
// ============================================

export type ProjectStatus =
  | "planning"
  | "building"
  | "running"
  | "paused"
  | "error";

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;

  // Port allocation
  portBase: number;
  domain?: string;

  // AI Accuracy
  aiAccuracy: number;

  // Nodes
  nodes: Node[];
  relationships: NodeRelationship[];

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// QUESTIONNAIRE TYPES
// ============================================

export type QuestionType =
  | "text"
  | "textarea"
  | "radio"
  | "checkbox"
  | "select"
  | "number"
  | "date"
  | "file";

export interface Question {
  id: string;
  question: string;
  type: QuestionType;
  options?: string[];
  required: boolean;
  helpText?: string;
  importance: number; // 1-10
  category?: string;
}

export interface Questionnaire {
  id: string;
  projectId: string;
  title: string;
  description: string;
  questions: Question[];
  answers: Record<string, any>;
  status: "draft" | "active" | "completed" | "archived";
  completionPercentage: number;
  generatedBy?: "user" | "ai";
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// CONTEXT MENU TYPES
// ============================================

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: string;
  action: () => void;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
  shortcut?: string;
}

export interface ContextMenuPosition {
  x: number;
  y: number;
}

// ============================================
// PANEL TYPES
// ============================================

export type PanelType =
  | "search"
  | "questionnaire"
  | "monitoring"
  | "settings"
  | "documentation"
  | "agent-status"
  | "deploy"
  | "node-editor"
  | "activity"
  | "file-explorer";

export interface PanelState {
  isOpen: boolean;
  type: PanelType | null;
  data?: any;
}

// ============================================
// ACTIVITY TYPES
// ============================================

export type ActivityType =
  | "deployment"
  | "build"
  | "error"
  | "status_change"
  | "code_update"
  | "agent_action";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: Date;
  nodeId?: string;
  nodeName?: string;
  status?: "success" | "error" | "pending" | "in_progress";
}

// ============================================
// BUILD TYPES
// ============================================

export interface BuildProgress {
  projectId: string;
  nodeId: string;
  nodeName: string;
  stage: "pending" | "building" | "deploying" | "complete" | "error";
  progress: number; // 0-100
  message: string;
  error?: string;
}

// ============================================
// SOCKET EVENT TYPES
// ============================================

export interface SocketEvents {
  // Client -> Server
  "node:update": { nodeId: string; changes: Partial<Node> };
  "node:start": { nodeId: string };
  "node:stop": { nodeId: string };
  "node:restart": { nodeId: string };
  "node:rebuild": { nodeId: string };
  "code:save-draft": { nodeId: string; code: string };
  "project:build": { projectId: string };
  "questionnaire:answer": {
    questionnaireId: string;
    answers: Record<string, any>;
  };

  // Server -> Client
  "node:updated": Node;
  "node:status-changed": { nodeId: string; status: NodeStatus };
  "build:progress": BuildProgress;
  "code:deployed": { nodeId: string; code: string };
  "questionnaire:ready": Questionnaire;
  "error:deployment-failed": { nodeId: string; error: string };
}
