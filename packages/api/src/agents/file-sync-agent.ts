/**
 * File Sync Agent
 *
 * Automatically syncs project workspace files with canvas nodes
 * Creates nodes from file structure without AI
 * Provides file content for source code viewing
 */

import { logger } from "../utils/logger.js";
import {
  getFromStore,
  addToStore,
  updateInStore,
  removeFromStore,
  saveNow,
} from "../core/database.js";
import { v4 as uuidv4 } from "uuid";
import * as fs from "fs";
import * as path from "path";

export interface FileNode {
  id: string;
  name: string;
  path: string;
  relativePath: string;
  type: "file" | "folder" | "service";
  nodeType: string; // component, page, hook, service, config, etc.
  language?: string;
  size?: number;
  children?: FileNode[];
  parentId?: string;
}

export interface SyncResult {
  success: boolean;
  projectId: string;
  nodesCreated: number;
  nodesUpdated: number;
  nodesRemoved: number;
  relationships: number;
  fileTree: FileNode;
}

export interface FileContent {
  path: string;
  content: string;
  language: string;
  size: number;
  lastModified: string;
}

// File extensions to language mapping
const LANGUAGE_MAP: Record<string, string> = {
  ".ts": "typescript",
  ".tsx": "typescript",
  ".js": "javascript",
  ".jsx": "javascript",
  ".py": "python",
  ".json": "json",
  ".css": "css",
  ".scss": "scss",
  ".html": "html",
  ".md": "markdown",
  ".yml": "yaml",
  ".yaml": "yaml",
  ".sql": "sql",
  ".sh": "shell",
  ".dockerfile": "dockerfile",
  ".env": "env",
};

// Folders to skip during sync
const SKIP_FOLDERS = [
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  "__pycache__",
  ".venv",
  "venv",
  ".cache",
  "coverage",
];

// File patterns to skip
const SKIP_FILES = [".DS_Store", "Thumbs.db", ".gitkeep"];

export class FileSyncAgent {
  private dataPath: string;

  constructor() {
    this.dataPath = process.env.DATA_PATH || "/app/data";
  }

  /**
   * Get the file tree for a project
   */
  async getFileTree(projectPath: string): Promise<FileNode> {
    const projectName = path.basename(projectPath);

    const rootNode: FileNode = {
      id: uuidv4(),
      name: projectName,
      path: projectPath,
      relativePath: "",
      type: "folder",
      nodeType: "project",
      children: [],
    };

    await this.scanDirectory(projectPath, rootNode, "");
    return rootNode;
  }

  /**
   * Recursively scan directory and build file tree
   */
  private async scanDirectory(
    dirPath: string,
    parentNode: FileNode,
    relativePath: string
  ): Promise<void> {
    try {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        // Skip ignored folders/files
        if (
          SKIP_FOLDERS.includes(entry.name) ||
          SKIP_FILES.includes(entry.name)
        ) {
          continue;
        }

        const fullPath = path.join(dirPath, entry.name);
        const relPath = relativePath
          ? `${relativePath}/${entry.name}`
          : entry.name;

        if (entry.isDirectory()) {
          const folderNode: FileNode = {
            id: uuidv4(),
            name: entry.name,
            path: fullPath,
            relativePath: relPath,
            type: this.detectServiceType(entry.name) ? "service" : "folder",
            nodeType: this.detectFolderNodeType(entry.name),
            parentId: parentNode.id,
            children: [],
          };

          parentNode.children = parentNode.children || [];
          parentNode.children.push(folderNode);

          // Recursively scan subdirectories
          await this.scanDirectory(fullPath, folderNode, relPath);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          const stats = fs.statSync(fullPath);

          const fileNode: FileNode = {
            id: uuidv4(),
            name: entry.name,
            path: fullPath,
            relativePath: relPath,
            type: "file",
            nodeType: this.detectFileNodeType(entry.name, relativePath),
            language: LANGUAGE_MAP[ext] || "text",
            size: stats.size,
            parentId: parentNode.id,
          };

          parentNode.children = parentNode.children || [];
          parentNode.children.push(fileNode);
        }
      }

      // Sort: folders first, then files, alphabetically
      if (parentNode.children) {
        parentNode.children.sort((a, b) => {
          if (a.type !== "file" && b.type === "file") return -1;
          if (a.type === "file" && b.type !== "file") return 1;
          return a.name.localeCompare(b.name);
        });
      }
    } catch (error) {
      logger.error(`Error scanning directory ${dirPath}:`, error);
    }
  }

  /**
   * Detect if folder is a service (backend, frontend, etc.)
   */
  private detectServiceType(name: string): boolean {
    const serviceNames = [
      "backend",
      "frontend",
      "api",
      "web",
      "server",
      "client",
      "worker",
      "bot",
      "discord-bot",
      "mobile",
    ];
    return serviceNames.includes(name.toLowerCase()) || name.includes("-");
  }

  /**
   * Detect folder node type based on name
   */
  private detectFolderNodeType(name: string): string {
    const lowerName = name.toLowerCase();

    // Service types
    if (["backend", "api", "server"].includes(lowerName)) return "backend";
    if (["frontend", "web", "client"].includes(lowerName)) return "frontend";
    if (["worker", "jobs", "queue"].includes(lowerName)) return "worker";
    if (["bot", "discord-bot"].includes(lowerName)) return "discord-bot";

    // Folder types
    if (["components", "component"].includes(lowerName)) return "components";
    if (["pages", "views", "screens"].includes(lowerName)) return "pages";
    if (["hooks"].includes(lowerName)) return "hooks";
    if (["services", "api"].includes(lowerName)) return "services";
    if (["utils", "helpers", "lib"].includes(lowerName)) return "utils";
    if (["styles", "css"].includes(lowerName)) return "styles";
    if (["tests", "__tests__", "test"].includes(lowerName)) return "tests";
    if (["config", "configs"].includes(lowerName)) return "config";
    if (["assets", "public", "static"].includes(lowerName)) return "assets";
    if (["types", "interfaces"].includes(lowerName)) return "types";
    if (["routes", "routing"].includes(lowerName)) return "routes";
    if (["middleware", "middlewares"].includes(lowerName)) return "middleware";
    if (["models", "entities"].includes(lowerName)) return "models";
    if (["controllers"].includes(lowerName)) return "controllers";
    if (["docs", "documentation"].includes(lowerName)) return "docs";
    if (["docker"].includes(lowerName)) return "docker";
    if (["src"].includes(lowerName)) return "source";

    return "folder";
  }

  /**
   * Detect file node type based on name and path
   */
  private detectFileNodeType(filename: string, relativePath: string): string {
    const lowerName = filename.toLowerCase();
    const lowerPath = relativePath.toLowerCase();

    // Config files
    if (
      lowerName.includes("config") ||
      lowerName === "package.json" ||
      lowerName === "tsconfig.json" ||
      lowerName.startsWith(".")
    ) {
      return "config";
    }

    // Entry points
    if (
      lowerName === "index.ts" ||
      lowerName === "index.js" ||
      lowerName === "main.ts" ||
      lowerName === "main.jsx" ||
      lowerName === "app.ts" ||
      lowerName === "app.jsx"
    ) {
      return "entry";
    }

    // Path-based detection
    if (lowerPath.includes("/components/")) return "component";
    if (lowerPath.includes("/pages/")) return "page";
    if (lowerPath.includes("/hooks/")) return "hook";
    if (lowerPath.includes("/services/")) return "service";
    if (lowerPath.includes("/utils/") || lowerPath.includes("/helpers/"))
      return "util";
    if (lowerPath.includes("/styles/")) return "style";
    if (lowerPath.includes("/tests/") || lowerPath.includes("/__tests__/"))
      return "test";
    if (lowerPath.includes("/routes/")) return "route";
    if (lowerPath.includes("/middleware/")) return "middleware";
    if (lowerPath.includes("/models/")) return "model";
    if (lowerPath.includes("/controllers/")) return "controller";
    if (lowerPath.includes("/docs/")) return "doc";

    // File extension based
    if (lowerName.endsWith(".css") || lowerName.endsWith(".scss"))
      return "style";
    if (lowerName.endsWith(".test.ts") || lowerName.endsWith(".spec.ts"))
      return "test";
    if (lowerName.endsWith(".md")) return "doc";
    if (lowerName === "dockerfile" || lowerName.startsWith("dockerfile."))
      return "docker";

    return "file";
  }

  /**
   * Clean up old synced nodes from before the auto-update system
   * Removes all old "module" type nodes created during file sync
   */
  private cleanupOldSyncedNodes(projectId: string): number {
    const allNodes = getFromStore("nodes") as any[];
    const allRelationships = getFromStore("node_relationships") as any[];

    let removed = 0;

    // Find all old "module" type nodes that were synced (have syncedFromFile: true)
    const oldNodes = allNodes.filter((n: any) => {
      if (n.type !== "module" || n.project_id !== projectId) return false;

      try {
        const cfg =
          typeof n.config === "string" ? JSON.parse(n.config) : n.config || {};
        return cfg.syncedFromFile === true;
      } catch {
        return false;
      }
    });

    logger.info(
      `[FileSyncAgent] Found ${oldNodes.length} old synced nodes to remove`
    );

    // Remove each old node and its relationships
    for (const node of oldNodes) {
      removeFromStore("nodes", node.id);

      // Remove all relationships connected to this node
      const relatedRels = allRelationships.filter(
        (r: any) => r.source_node_id === node.id || r.target_node_id === node.id
      );

      for (const rel of relatedRels) {
        removeFromStore("node_relationships", rel.id);
      }

      removed++;
    }

    return removed;
  }

  /**
   * Sync file structure to canvas nodes
   *
   * Creates only 1 service node per service folder
   * File tree is stored in metadata and accessed via double-click
   * Auto-updates file tree and removes old file nodes
   */
  async syncToCanvas(
    projectId: string,
    projectPath: string,
    options: {
      createServices?: boolean;
      createFiles?: boolean;
      maxDepth?: number;
    } = {}
  ): Promise<SyncResult> {
    logger.info(
      `[FileSyncAgent] Syncing project ${projectId} from ${projectPath}`
    );

    const fileTree = await this.getFileTree(projectPath);
    const allNodes = getFromStore("nodes") as any[];
    const allRelationships = getFromStore("node_relationships") as any[];

    let nodesCreated = 0;
    let nodesUpdated = 0;
    let nodesRemoved = 0;

    // First, clean up all old synced nodes from the previous sync system
    const oldNodesRemoved = this.cleanupOldSyncedNodes(projectId);
    nodesRemoved += oldNodesRemoved;

    // Get the service folder name (e.g., "portfolio-frontend" from path)
    const serviceName = path.basename(projectPath);
    const now = new Date().toISOString();

    // Check if service node already exists
    let serviceNode = allNodes.find(
      (n: any) => n.project_id === projectId && n.name === serviceName
    );

    const config = {
      syncedFromFile: true,
      filePath: projectPath,
      fileTree: fileTree, // Store entire file tree in metadata
      lastSynced: now,
    };

    // Get list of all file paths currently in the file tree
    const currentFilePaths = new Set<string>();
    const collectPaths = (node: FileNode) => {
      currentFilePaths.add(node.path);
      if (node.children) {
        node.children.forEach(collectPaths);
      }
    };
    collectPaths(fileTree);

    if (serviceNode) {
      // Update existing node with new file tree
      const oldConfig =
        typeof serviceNode.config === "string"
          ? JSON.parse(serviceNode.config)
          : serviceNode.config || {};
      const oldFileTree = oldConfig.fileTree;

      serviceNode.config = JSON.stringify(config);
      serviceNode.updated_at = now;
      nodesUpdated++;

      // Clean up old file nodes that no longer exist
      if (oldFileTree) {
        const oldFilePaths = new Set<string>();
        const collectOldPaths = (node: FileNode) => {
          oldFilePaths.add(node.path);
          if (node.children) {
            node.children.forEach(collectOldPaths);
          }
        };
        collectOldPaths(oldFileTree);

        // Find files that were deleted
        for (const oldPath of oldFilePaths) {
          if (!currentFilePaths.has(oldPath)) {
            // Find and remove old file nodes for deleted files
            const nodesToRemove = allNodes.filter((n: any) => {
              try {
                const cfg =
                  typeof n.config === "string"
                    ? JSON.parse(n.config)
                    : n.config || {};
                return cfg.filePath === oldPath && n.project_id === projectId;
              } catch {
                return false;
              }
            });

            for (const nodeToRemove of nodesToRemove) {
              removeFromStore("nodes", nodeToRemove.id);
              // Also remove relationships
              const relatedRels = allRelationships.filter(
                (r: any) =>
                  r.source_node_id === nodeToRemove.id ||
                  r.target_node_id === nodeToRemove.id
              );
              for (const rel of relatedRels) {
                removeFromStore("node_relationships", rel.id);
              }
              nodesRemoved++;
            }
          }
        }
      }
    } else {
      // Create single service node
      const nodeId = uuidv4();
      serviceNode = {
        id: nodeId,
        project_id: projectId,
        name: serviceName,
        type: "frontend", // Assuming frontend for now - can be parameterized
        description: `Service: ${serviceName}`,
        status: "running",
        position_x: 200,
        position_y: 200,
        language: null,
        config: JSON.stringify(config),
        created_at: now,
        updated_at: now,
      };

      addToStore("nodes", serviceNode);
      nodesCreated++;
    }

    // Force save to persist changes
    saveNow();

    logger.info(
      `[FileSyncAgent] Sync complete: ${nodesCreated} created, ${nodesUpdated} updated, ${nodesRemoved} removed. Service node: ${serviceName}`
    );

    return {
      success: true,
      projectId,
      nodesCreated,
      nodesUpdated,
      nodesRemoved,
      relationships: 0,
      fileTree,
    };
  }

  /**
   * Map our node types to database node types
   */
  private mapNodeTypeToDbType(nodeType: string, fileType: string): string {
    if (fileType === "service") {
      if (["backend", "api", "server"].includes(nodeType)) return "backend";
      if (["frontend", "web", "client"].includes(nodeType)) return "frontend";
      if (["worker"].includes(nodeType)) return "worker";
      return "service";
    }

    if (nodeType === "component") return "component";
    if (nodeType === "page") return "component";
    if (nodeType === "hook") return "module";
    if (nodeType === "service") return "service";
    if (nodeType === "config") return "module";
    if (nodeType === "route") return "module";
    if (nodeType === "middleware") return "module";
    if (nodeType === "model") return "module";

    return "module";
  }

  /**
   * Get file content for source code viewing
   */
  async getFileContent(filePath: string): Promise<FileContent | null> {
    try {
      if (!fs.existsSync(filePath)) {
        return null;
      }

      const stats = fs.statSync(filePath);
      const content = fs.readFileSync(filePath, "utf-8");
      const ext = path.extname(filePath).toLowerCase();

      return {
        path: filePath,
        content,
        language: LANGUAGE_MAP[ext] || "text",
        size: stats.size,
        lastModified: stats.mtime.toISOString(),
      };
    } catch (error) {
      logger.error(`Error reading file ${filePath}:`, error);
      return null;
    }
  }

  /**
   * Get all source files for a node (if it's a folder/service)
   */
  async getNodeSourceFiles(nodeId: string): Promise<FileContent[]> {
    const allNodes = getFromStore("nodes") as any[];
    const node = allNodes.find((n: any) => n.id === nodeId);

    if (!node) return [];

    const config =
      typeof node.config === "string" ? JSON.parse(node.config) : node.config;
    if (!config?.filePath) return [];

    const files: FileContent[] = [];
    const nodePath = config.filePath;

    // If it's a file, return just that file
    if (fs.existsSync(nodePath) && fs.statSync(nodePath).isFile()) {
      const content = await this.getFileContent(nodePath);
      if (content) files.push(content);
      return files;
    }

    // If it's a folder, get all source files
    if (fs.existsSync(nodePath) && fs.statSync(nodePath).isDirectory()) {
      await this.collectSourceFiles(nodePath, files);
    }

    return files;
  }

  /**
   * Recursively collect source files from a directory
   */
  private async collectSourceFiles(
    dirPath: string,
    files: FileContent[],
    maxFiles: number = 50
  ): Promise<void> {
    if (files.length >= maxFiles) return;

    try {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        if (files.length >= maxFiles) return;
        if (
          SKIP_FOLDERS.includes(entry.name) ||
          SKIP_FILES.includes(entry.name)
        )
          continue;

        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
          await this.collectSourceFiles(fullPath, files, maxFiles);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          // Only include source code files
          if (LANGUAGE_MAP[ext]) {
            const content = await this.getFileContent(fullPath);
            if (content) files.push(content);
          }
        }
      }
    } catch (error) {
      logger.error(`Error collecting files from ${dirPath}:`, error);
    }
  }

  /**
   * Get child nodes for a parent node (for hierarchical view)
   */
  async getChildNodes(projectId: string, parentNodeId: string): Promise<any[]> {
    const allNodes = getFromStore("nodes") as any[];
    const allRelationships = getFromStore("node_relationships") as any[];

    // Get relationships where this node is the source
    const childNodeIds = allRelationships
      .filter(
        (r: any) =>
          r.source_node_id === parentNodeId && r.project_id === projectId
      )
      .map((r: any) => r.target_node_id);

    // Get the actual child nodes
    const childNodes = allNodes.filter(
      (n: any) => childNodeIds.includes(n.id) && n.project_id === projectId
    );

    // Sort by name
    return childNodes.sort((a: any, b: any) =>
      (a.name || "").localeCompare(b.name || "")
    );
  }

  /**
   * Get nested canvas nodes for a service (for double-click view)
   * Returns the file tree as nodes with proper types (folder, component, page, etc.)
   */
  getNestedCanvasNodes(nodeId: string): {
    nodes: any[];
    relationships: any[];
  } {
    const allNodes = getFromStore("nodes") as any[];
    const node = allNodes.find((n: any) => n.id === nodeId);

    if (!node) {
      return { nodes: [], relationships: [] };
    }

    const config =
      typeof node.config === "string" ? JSON.parse(node.config) : node.config;
    const fileTree = config?.fileTree as FileNode;

    if (!fileTree) {
      return { nodes: [], relationships: [] };
    }

    const nodes: any[] = [];
    const relationships: any[] = [];
    let positionX = 100;
    let positionY = 100;

    // Recursive function to convert file tree to canvas nodes
    const processFileNode = (
      fileNode: FileNode,
      parentCanvasNodeId: string | null,
      depth: number,
      xPos: number,
      yPos: number
    ): string => {
      const canvasNodeId = uuidv4();

      // Determine node type based on file/folder properties
      let nodeType = fileNode.nodeType;
      if (fileNode.type === "folder") {
        nodeType = "folder";
      }

      // Create canvas node with proper styling info
      const canvasNode = {
        id: canvasNodeId,
        name: fileNode.name,
        type: nodeType, // folder, component, page, hook, service, style, doc, etc.
        description: fileNode.relativePath,
        isFile: fileNode.type === "file",
        language: fileNode.language,
        size: fileNode.size,
        position_x: xPos,
        position_y: yPos,
      };

      nodes.push(canvasNode);

      // Create relationship to parent
      if (parentCanvasNodeId) {
        relationships.push({
          id: uuidv4(),
          source_node_id: parentCanvasNodeId,
          target_node_id: canvasNodeId,
          type: "contains",
        });
      }

      // Process children
      if (fileNode.children && fileNode.children.length > 0) {
        let childX = xPos;
        let childY = yPos + 150;

        for (let i = 0; i < fileNode.children.length; i++) {
          const child = fileNode.children[i];
          processFileNode(child, canvasNodeId, depth + 1, childX, childY);
          childX += 250; // Horizontal spacing for siblings
        }
      }

      return canvasNodeId;
    };

    // Start with root
    const rootCanvasId = uuidv4();
    nodes.push({
      id: rootCanvasId,
      name: fileTree.name,
      type: "root",
      description: "Service root",
      isFile: false,
      position_x: 400,
      position_y: 50,
    });

    // Process all children of root
    if (fileTree.children && fileTree.children.length > 0) {
      let childX = 100;
      let childY = 250;

      for (const child of fileTree.children) {
        processFileNode(child, rootCanvasId, 0, childX, childY);
        childX += 300;
      }
    }

    return { nodes, relationships };
  }
}

// Export singleton instance
export const fileSyncAgent = new FileSyncAgent();
