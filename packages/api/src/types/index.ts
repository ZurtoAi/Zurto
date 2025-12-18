// Project types
export interface Project {
  id: string;
  name: string;
  description?: string;
  status: "planning" | "building" | "running" | "paused" | "stopped" | "error";
  port_range_start?: number;
  created_at: string;
  updated_at: string;
  created_by?: string;
  metadata?: Record<string, any>;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  status?: Project["status"];
}

// Node types
export type NodeType =
  | "planning"
  | "backend"
  | "frontend"
  | "database"
  | "cache"
  | "worker"
  | "cli"
  | "scheduler"
  | "queue"
  | "service"
  | "component"
  | "module"
  | "integration";

export type NodeStatus =
  | "planned"
  | "building"
  | "running"
  | "stopped"
  | "error"
  | "paused";

export interface Node {
  id: string;
  project_id: string;
  name: string;
  type: NodeType;
  description?: string;
  status: NodeStatus;
  position_x: number;
  position_y: number;
  port?: number;
  container_id?: string;
  language?: string;
  code?: string;
  config?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CreateNodeInput {
  name: string;
  type: NodeType;
  description?: string;
  position_x?: number;
  position_y?: number;
  language?: string;
}

export interface UpdateNodeInput {
  name?: string;
  description?: string;
  status?: NodeStatus;
  position_x?: number;
  position_y?: number;
  language?: string;
  code?: string;
  config?: Record<string, any>;
}

// Node relationship types
export interface NodeRelationship {
  id: string;
  project_id: string;
  source_node_id: string;
  target_node_id: string;
  relationship_type?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface CreateNodeRelationshipInput {
  source_node_id: string;
  target_node_id: string;
  relationship_type?: string;
}

// Old Questionnaire interface - REMOVED (duplicate with new interface below)

// Question types - Note: Modern Question interface is defined below
export interface Question {
  id: string;
  questionnaire_id: string;
  question_text: string;
  question_type?: "text" | "multiple_choice" | "yes_no" | "rating" | "open";
  order_index: number;
  is_required: boolean;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface CreateQuestionInput {
  question_text: string;
  question_type?: Question["question_type"];
  order_index: number;
  is_required?: boolean;
  metadata?: Record<string, any>;
}

// Answer types
export interface Answer {
  id: string;
  questionnaire_id: string;
  question_id: string;
  answer_value: string;
  answer_type?: string;
  answered_at: string;
}

export interface CreateAnswerInput {
  question_id: string;
  answer_value: string;
  answer_type?: string;
}

// Code version types
export interface CodeVersion {
  id: string;
  node_id: string;
  code: string;
  language: string;
  version_number: number;
  is_deployed: boolean;
  created_at: string;
}

export interface CreateCodeVersionInput {
  code: string;
  language: string;
}

// Port allocation types
export interface PortAllocation {
  id: string;
  project_id: string;
  node_id?: string;
  port: number;
  is_available: boolean;
  allocated_at: string;
}

// Domain assignment types
export interface DomainAssignment {
  id: string;
  project_id: string;
  node_id: string;
  domain: string;
  assigned_at: string;
}

export interface CreateDomainAssignmentInput {
  node_id: string;
  domain: string;
}

// Planning node contents types
export interface PlanningNodeContents {
  id: string;
  node_id: string;
  original_questionnaire?: Record<string, any>;
  user_answers?: Record<string, any>;
  ai_reasoning?: Record<string, any>;
  accuracy_score: number;
  change_log?: Array<{
    change: string;
    reason?: string;
    date: string;
    by?: string;
  }>;
  updated_at: string;
}

// Build history types
export type BuildStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "failed"
  | "paused";

export interface BuildHistory {
  id: string;
  project_id: string;
  build_number: number;
  status: BuildStatus;
  started_at?: string;
  completed_at?: string;
  error_message?: string;
  metadata?: Record<string, any>;
}

// Activity log types
export interface ActivityLog {
  id: string;
  project_id?: string;
  action: string;
  entity_type?: string;
  entity_id?: string;
  details?: Record<string, any>;
  created_at: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    timestamp: string;
    requestId?: string;
    pagination?: {
      page: number;
      limit: number;
      total: number;
    };
  };
}

export interface ApiError {
  success: false;
  error: string;
  message?: string;
  code?: string;
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}

// Socket.io event types
export interface SocketEvents {
  "node:update": Node;
  "node:create": Node;
  "node:delete": { nodeId: string; projectId: string };
  "node:status": { nodeId: string; status: NodeStatus };
  "build:start": { projectId: string };
  "build:progress": { projectId: string; message: string; progress: number };
  "build:complete": { projectId: string; success: boolean };
  "build:error": { projectId: string; error: string };
  "build:pause": { projectId: string; reason: string };
  "code:updated": { nodeId: string; language: string; version: number };
}

// Questionnaire types
export type QuestionType =
  | "text"
  | "textarea"
  | "select"
  | "multiselect"
  | "radio"
  | "checkbox"
  | "number"
  | "email"
  | "url"
  | "date"
  | "boolean";

export interface QuestionOption {
  id: string;
  label: string;
  value: string | number | boolean;
  nextQuestionId?: string; // For branching
  description?: string;
}

export interface Question {
  id: string;
  title: string;
  description?: string;
  type: QuestionType;
  required: boolean;
  placeholder?: string;
  options?: QuestionOption[]; // For select, radio, checkbox
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
  metadata?: Record<string, any>;
  branches?: {
    [key: string]: string; // answer value -> next question ID
  };
}

export interface Questionnaire {
  id: string;
  name: string;
  description?: string;
  questions: Question[];
  triggerEvent: "project:created" | "project:updated" | "manual";
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuestionnaireInput {
  name: string;
  description?: string;
  questions: Question[];
  triggerEvent?: "project:created" | "project:updated" | "manual";
}

export interface QuestionnaireAnswer {
  id: string;
  questionnaireId: string;
  projectId: string;
  questionId: string;
  answer: string | number | boolean | string[];
  metadata: Record<string, any>;
  answeredAt: string;
}

export interface QuestionnaireSession {
  id: string;
  questionnaireId: string;
  projectId: string;
  currentQuestionId: string;
  answers: QuestionnaireAnswer[];
  status: "in_progress" | "completed" | "abandoned";
  startedAt: string;
  completedAt?: string;
}
