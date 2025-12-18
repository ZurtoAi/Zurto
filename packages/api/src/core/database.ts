import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { logger } from "../utils/logger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "../../data");
const DB_FILE = path.join(DATA_DIR, "zurto-data.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// ============================================
// NEW ZURTO V3 DATABASE SCHEMA
// ============================================

// User interface - core user entity
interface User {
  id: string;
  username: string;
  teamId: string;
  teamToken: string; // Token used for login (username + teamToken)
  adminToken?: string; // If set, user is admin and can access admin panel
  isAdmin: boolean;
  isTeamLeader: boolean;
  createdAt: string;
  updatedAt: string;
  lastActiveAt?: string;
}

// Team interface
interface Team {
  id: string;
  name: string;
  slug: string;
  description?: string;
  ownerId: string; // User ID of team leader
  createdAt: string;
  updatedAt: string;
}

// Audit log for tracking all changes
interface AuditLog {
  id: string;
  teamId: string;
  userId: string;
  username: string;
  action: string; // 'create_project' | 'edit_node' | 'deploy' | 'login' | etc
  resourceType: string; // 'project' | 'node' | 'user' | 'team' | etc
  resourceId: string;
  details: Record<string, unknown>;
  timestamp: string;
}

// Project with team ownership
interface Project {
  id: string;
  name: string;
  description?: string;
  teamId: string;
  status: "active" | "archived" | "maintenance";
  isDeployed: boolean; // Whether project code has been deployed
  createdAt: string;
  updatedAt: string;
  createdBy: string; // User ID
}

// Data store structure
interface DataStore {
  // Core entities
  users: User[];
  teams: Team[];
  projects: Project[];

  // Nodes & relationships
  nodes: unknown[];
  node_relationships: unknown[];

  // Questionnaires
  questionnaires: unknown[];
  questions: unknown[];
  answers: unknown[];
  questionnaire_sessions: unknown[];

  // Deployments & code
  code_versions: unknown[];
  port_allocations: unknown[];
  domain_assignments: unknown[];
  build_history: unknown[];

  // Planning
  planning_node_contents: unknown[];

  // Audit & logging
  audit_logs: AuditLog[];

  // Auth tokens
  refresh_tokens: unknown[];

  // Domains & hosting
  domains: unknown[];

  // Legacy (to be removed)
  activity_log: unknown[];
  team_members: unknown[];
  team_invitations: unknown[];
}

// Default empty store
const defaultStore: DataStore = {
  // Core entities
  users: [],
  teams: [],
  projects: [],

  // Nodes & relationships
  nodes: [],
  node_relationships: [],

  // Questionnaires
  questionnaires: [],
  questions: [],
  answers: [],
  questionnaire_sessions: [],

  // Deployments & code
  code_versions: [],
  port_allocations: [],
  domain_assignments: [],
  build_history: [],

  // Planning
  planning_node_contents: [],

  // Audit & logging
  audit_logs: [],

  // Auth tokens
  refresh_tokens: [],

  // Domains & hosting
  domains: [],

  // Legacy (to be removed)
  activity_log: [],
  team_members: [],
  team_invitations: [],
};

// In-memory store (loaded from file)
let store: DataStore = { ...defaultStore };

// Load store from file
function loadStore(): DataStore {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      const parsed = JSON.parse(data);
      logger.info(
        `📂 Loaded ${Object.keys(parsed).length} tables from ${DB_FILE}`
      );
      return { ...defaultStore, ...parsed };
    }
  } catch (error) {
    logger.warn("⚠️ Failed to load database file, starting fresh:", error);
  }
  return { ...defaultStore };
}

// Save store to file (debounced)
let saveTimeout: NodeJS.Timeout | null = null;
const SAVE_DELAY = 1000; // 1 second debounce

function scheduleSave(): void {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }
  saveTimeout = setTimeout(() => {
    saveStore();
  }, SAVE_DELAY);
}

function saveStore(): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(store, null, 2), "utf-8");
    logger.debug(`💾 Database saved to ${DB_FILE}`);
  } catch (error) {
    logger.error("❌ Failed to save database:", error);
  }
}

// Force save (for shutdown)
function forceSave(): void {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
    saveTimeout = null;
  }
  saveStore();
}

// Helper to get table name from SQL
function getTableFromSQL(sql: string): keyof DataStore | null {
  const tableMatch = sql.match(/(?:FROM|INTO|UPDATE)\s+(\w+)/i);
  if (tableMatch) {
    const tableName = tableMatch[1].toLowerCase();
    // Map SQL table names to store keys
    const tableMap: Record<string, keyof DataStore> = {
      projects: "projects",
      nodes: "nodes",
      node_relationships: "node_relationships",
      users: "users",
      teams: "teams",
      team_members: "team_members",
      team_invitations: "team_invitations",
      questionnaires: "questionnaires",
      questions: "questions",
      answers: "answers",
      questionnaire_sessions: "questionnaire_sessions",
      audit_logs: "audit_logs",
      code_versions: "code_versions",
      port_allocations: "port_allocations",
      domain_assignments: "domain_assignments",
      domains: "domains",
      build_history: "build_history",
      planning_node_contents: "planning_node_contents",
      refresh_tokens: "refresh_tokens",
      activity_log: "activity_log",
    };
    return tableMap[tableName] || null;
  }
  return null;
}

// Database mock object matching better-sqlite3 interface
class MockDatabase {
  prepare(sql: string) {
    const tableName = getTableFromSQL(sql);
    const sqlUpper = sql.toUpperCase();

    return {
      run: (...params: unknown[]) => {
        logger.debug(`Execute: ${sql.substring(0, 80)}...`);

        if (!tableName) {
          logger.warn(`Could not determine table from SQL: ${sql}`);
          return { changes: 0, lastID: 0 };
        }

        // Handle INSERT
        if (sqlUpper.startsWith("INSERT")) {
          // Parse column names from SQL
          const columnMatch = sql.match(/\(([^)]+)\)\s*VALUES/i);
          if (columnMatch) {
            const columns = columnMatch[1].split(",").map((c) => c.trim());
            const newItem: Record<string, unknown> = {};

            columns.forEach((col, idx) => {
              // Map snake_case to camelCase for common fields
              const fieldMap: Record<string, string> = {
                project_id: "project_id",
                created_at: "createdAt",
                updated_at: "updatedAt",
                created_by: "createdBy",
                team_id: "teamId",
                port_range_start: "port_range_start",
              };
              const fieldName = fieldMap[col] || col;
              newItem[fieldName] = params[idx];
            });

            (store[tableName] as any[]).push(newItem);
            scheduleSave();
            logger.debug(`Inserted into ${tableName}:`, newItem);
            return { changes: 1, lastID: (store[tableName] as any[]).length };
          }
        }

        // Handle UPDATE
        if (sqlUpper.startsWith("UPDATE")) {
          const whereMatch = sql.match(/WHERE\s+(\w+)\s*=\s*\?/i);
          if (whereMatch) {
            const whereField = whereMatch[1];
            const whereValue = params[params.length - 1]; // Last param is usually WHERE value

            const items = store[tableName] as any[];
            const index = items.findIndex(
              (item) =>
                item[whereField] === whereValue || item.id === whereValue
            );

            if (index !== -1) {
              // Parse SET clause
              const setMatch = sql.match(/SET\s+(.+?)\s+WHERE/i);
              if (setMatch) {
                const setParts = setMatch[1].split(",");
                setParts.forEach((part, idx) => {
                  const fieldMatch = part.trim().match(/(\w+)\s*=/);
                  if (fieldMatch) {
                    items[index][fieldMatch[1]] = params[idx];
                  }
                });
              }
              scheduleSave();
              return { changes: 1 };
            }
          }
          return { changes: 0 };
        }

        // Handle DELETE
        if (sqlUpper.startsWith("DELETE")) {
          const whereMatch = sql.match(/WHERE\s+(\w+)\s*=\s*\?/i);
          if (whereMatch) {
            const whereField = whereMatch[1];
            const whereValue = params[0];

            const items = store[tableName] as any[];
            const index = items.findIndex(
              (item) =>
                item[whereField] === whereValue || item.id === whereValue
            );

            if (index !== -1) {
              items.splice(index, 1);
              scheduleSave();
              return { changes: 1 };
            }
          }
          return { changes: 0 };
        }

        return { changes: 1, lastID: 1 };
      },

      all: (...params: unknown[]) => {
        logger.debug(`Query all: ${sql.substring(0, 80)}...`);

        if (!tableName) return [];
        const items = store[tableName] as any[];

        // Handle WHERE clause
        const whereMatch = sql.match(/WHERE\s+(\w+)\s*=\s*\?/i);
        if (whereMatch && params.length > 0) {
          const whereField = whereMatch[1];
          const whereValue = params[0];
          return items.filter(
            (item) => item[whereField] === whereValue || item.id === whereValue
          );
        }

        return items;
      },

      get: (...params: unknown[]) => {
        logger.debug(`Query one: ${sql.substring(0, 80)}...`);

        if (!tableName) return undefined;
        const items = store[tableName] as any[];

        // Handle WHERE clause
        const whereMatch = sql.match(/WHERE\s+(\w+)\s*=\s*\?/i);
        if (whereMatch && params.length > 0) {
          const whereField = whereMatch[1];
          const whereValue = params[0];
          return items.find(
            (item) => item[whereField] === whereValue || item.id === whereValue
          );
        }

        // No WHERE clause - return first item
        return items[0];
      },
    };
  }

  pragma(pragma: string) {
    logger.debug(`Pragma: ${pragma}`);
  }

  exec(sql: string) {
    logger.debug(`Exec: ${sql.substring(0, 50)}...`);
  }

  close() {
    logger.info("Database connection closed");
  }
}

let db: MockDatabase | null = null;

export async function initializeDatabase(): Promise<MockDatabase> {
  try {
    // Load existing data from file
    store = loadStore();

    db = new MockDatabase();
    logger.info(`📦 Database initialized (file-persistent)`);
    logger.info(`📁 Database path: ${DB_FILE}`);

    // Force reseed if:
    // 1. No projects exist, OR
    // 2. No users exist (migrating to new schema), OR
    // 3. audit_logs doesn't exist (old schema)
    const needsReseed =
      store.projects.length === 0 ||
      !store.users ||
      store.users.length === 0 ||
      !store.audit_logs;

    if (needsReseed) {
      logger.info("🔄 Database needs initialization/migration - reseeding...");
      try {
        const { seedDatabase } = await import("./seed-data.js");
        seedDatabase();
        forceSave(); // Save seeded data immediately
      } catch (seedError) {
        logger.warn("⚠️ Failed to seed database:", seedError);
      }
    } else {
      logger.info(
        `📊 Loaded ${store.projects.length} projects, ${store.nodes.length} nodes, ${store.users.length} users`
      );
    }

    // Handle graceful shutdown
    process.on("SIGINT", () => {
      logger.info("Saving database before shutdown...");
      forceSave();
      process.exit(0);
    });

    process.on("SIGTERM", () => {
      logger.info("Saving database before shutdown...");
      forceSave();
      process.exit(0);
    });

    logger.info("✅ Database ready (persistent storage enabled)");
    return db;
  } catch (error) {
    logger.error("❌ Failed to initialize database:", error);
    throw error;
  }
}

export function getDatabase(): MockDatabase {
  if (!db) {
    throw new Error(
      "Database not initialized. Call initializeDatabase() first."
    );
  }
  return db;
}

export function closeDatabase(): void {
  if (db) {
    forceSave(); // Save before closing
    db.close();
    db = null;
  }
}

// Utility functions for persistent operations
export function addToStore(table: keyof DataStore, item: any) {
  (store[table] as any[]).push(item);
  scheduleSave();
}

export function getFromStore(table: keyof DataStore): any[] {
  return store[table] as any[];
}

export function updateInStore(
  table: keyof DataStore,
  id: string,
  updates: Partial<unknown>
) {
  const items = store[table] as any[];
  const index = items.findIndex((item: any) => item.id === id);
  if (index !== -1) {
    items[index] = { ...items[index], ...updates };
    scheduleSave();
    return items[index];
  }
  return null;
}

export function removeFromStore(table: keyof DataStore, id: string) {
  const items = store[table] as any[];
  const index = items.findIndex((item: any) => item.id === id);
  if (index !== -1) {
    const removed = items.splice(index, 1)[0];
    scheduleSave();
    return removed;
  }
  return null;
}

export function clearStore(table: keyof DataStore) {
  store[table] = [];
  scheduleSave();
}

export function getStore() {
  return store;
}

// Force immediate save (for critical operations)
export function saveNow(): void {
  forceSave();
}
