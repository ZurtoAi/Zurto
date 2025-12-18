/**
 * File Sync Routes
 *
 * API endpoints for syncing project files with canvas nodes
 * and retrieving source code for node viewing
 */

import { Router, Request, Response } from "express";
import { getFromStore } from "../core/database.js";
import { logger } from "../utils/logger.js";
import { fileSyncAgent } from "../agents/file-sync-agent.js";
import * as path from "path";
import * as fs from "fs";

const router = Router();

/**
 * GET /api/projects/:projectId/file-tree
 * Get the file tree for a project
 */
router.get(
  "/projects/:projectId/file-tree",
  async (req: Request, res: Response) => {
    try {
      const { projectId } = req.params;
      const projects = getFromStore("projects") as any[];

      // Get project
      const project = projects.find((p: any) => p.id === projectId);

      if (!project) {
        return res.status(404).json({
          success: false,
          error: "Project not found",
        });
      }

      // Determine project path
      const metadata =
        typeof project.metadata === "string"
          ? JSON.parse(project.metadata)
          : project.metadata || {};

      let projectPath = metadata.projectPath;
      if (!projectPath) {
        const teamName = metadata.teamName || "default";
        const sanitizedName = project.name
          .toLowerCase()
          .replace(/[^a-z0-9-]/g, "-");
        projectPath = path.join("/app/data/projects", teamName, sanitizedName);
      }

      // Check if project folder exists
      if (!fs.existsSync(projectPath)) {
        return res.status(404).json({
          success: false,
          error: "Project folder not found",
          projectPath,
        });
      }

      const fileTree = await fileSyncAgent.getFileTree(projectPath);

      res.json({
        success: true,
        data: {
          projectId,
          projectPath,
          fileTree,
        },
      });
    } catch (error) {
      logger.error("Error getting file tree:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get file tree",
      });
    }
  }
);

/**
 * POST /api/projects/:projectId/sync-files
 * Sync file structure to canvas nodes
 */
router.post(
  "/projects/:projectId/sync-files",
  async (req: Request, res: Response) => {
    try {
      const { projectId } = req.params;
      const {
        createServices = true,
        createFiles = true,
        maxDepth = 2,
      } = req.body;

      const projects = getFromStore("projects") as any[];

      // Get project
      const project = projects.find((p: any) => p.id === projectId);

      if (!project) {
        return res.status(404).json({
          success: false,
          error: "Project not found",
        });
      }

      // Determine project path
      const metadata =
        typeof project.metadata === "string"
          ? JSON.parse(project.metadata)
          : project.metadata || {};

      let projectPath = metadata.projectPath;
      if (!projectPath) {
        const teamName = metadata.teamName || "default";
        const sanitizedName = project.name
          .toLowerCase()
          .replace(/[^a-z0-9-]/g, "-");
        projectPath = path.join("/app/data/projects", teamName, sanitizedName);
      }

      // Check if project folder exists
      if (!fs.existsSync(projectPath)) {
        return res.status(404).json({
          success: false,
          error: "Project folder not found. Generate code first.",
          projectPath,
        });
      }

      logger.info(
        `🔄 Syncing files for project ${projectId} from ${projectPath}`
      );

      const result = await fileSyncAgent.syncToCanvas(projectId, projectPath, {
        createServices,
        createFiles,
        maxDepth,
      });

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error("Error syncing files:", error);
      res.status(500).json({
        success: false,
        error: "Failed to sync files",
      });
    }
  }
);

/**
 * GET /api/nodes/:nodeId/nested-canvas
 * Get nested canvas nodes for a service (file tree as nodes for double-click view)
 */
router.get(
  "/nodes/:nodeId/nested-canvas",
  async (req: Request, res: Response) => {
    try {
      const { nodeId } = req.params;

      const canvasData = fileSyncAgent.getNestedCanvasNodes(nodeId);

      res.json({
        success: true,
        data: {
          nodeId,
          nodes: canvasData.nodes,
          relationships: canvasData.relationships,
        },
      });
    } catch (error) {
      logger.error("Error getting nested canvas:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get nested canvas",
      });
    }
  }
);

/**
 * GET /api/nodes/:nodeId/source
 * Get source code for a node
 */
router.get("/nodes/:nodeId/source", async (req: Request, res: Response) => {
  try {
    const { nodeId } = req.params;
    const nodes = getFromStore("nodes") as any[];

    // Get node
    const node = nodes.find((n: any) => n.id === nodeId);

    if (!node) {
      return res.status(404).json({
        success: false,
        error: "Node not found",
      });
    }

    const config =
      typeof node.config === "string"
        ? JSON.parse(node.config)
        : node.config || {};

    if (!config.filePath) {
      return res.status(400).json({
        success: false,
        error: "Node is not synced from a file",
      });
    }

    const content = await fileSyncAgent.getFileContent(config.filePath);

    if (!content) {
      return res.status(404).json({
        success: false,
        error: "File not found",
      });
    }

    res.json({
      success: true,
      data: {
        nodeId,
        nodeName: node.name,
        nodeType: node.type,
        ...content,
      },
    });
  } catch (error) {
    logger.error("Error getting node source:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get source code",
    });
  }
});

/**
 * GET /api/nodes/:nodeId/files
 * Get all source files for a node (folder/service)
 */
router.get("/nodes/:nodeId/files", async (req: Request, res: Response) => {
  try {
    const { nodeId } = req.params;
    const nodes = getFromStore("nodes") as any[];

    // Get node
    const node = nodes.find((n: any) => n.id === nodeId);

    if (!node) {
      return res.status(404).json({
        success: false,
        error: "Node not found",
      });
    }

    const files = await fileSyncAgent.getNodeSourceFiles(nodeId);

    res.json({
      success: true,
      data: {
        nodeId,
        nodeName: node.name,
        nodeType: node.type,
        fileCount: files.length,
        files: files.map((f) => ({
          path: f.path,
          language: f.language,
          size: f.size,
          // Don't include full content in list view
        })),
      },
    });
  } catch (error) {
    logger.error("Error getting node files:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get node files",
    });
  }
});

/**
 * GET /api/nodes/:nodeId/children
 * Get child nodes for hierarchical view
 */
router.get("/nodes/:nodeId/children", async (req: Request, res: Response) => {
  try {
    const { nodeId } = req.params;
    const nodes = getFromStore("nodes") as any[];

    // Get node
    const node = nodes.find((n: any) => n.id === nodeId);

    if (!node) {
      return res.status(404).json({
        success: false,
        error: "Node not found",
      });
    }

    const children = await fileSyncAgent.getChildNodes(node.project_id, nodeId);

    // Enhance children with file info
    const enhancedChildren = children.map((child) => {
      const config =
        typeof child.config === "string"
          ? JSON.parse(child.config)
          : child.config || {};
      return {
        id: child.id,
        name: child.name,
        type: child.type,
        description: child.description,
        status: child.status,
        language: child.language,
        position_x: child.position_x,
        position_y: child.position_y,
        fileType: config.fileType,
        relativePath: config.relativePath,
        isFile: config.fileType === "file",
        hasSource: !!config.filePath,
      };
    });

    res.json({
      success: true,
      data: {
        nodeId,
        nodeName: node.name,
        children: enhancedChildren,
      },
    });
  } catch (error) {
    logger.error("Error getting child nodes:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get child nodes",
    });
  }
});

/**
 * GET /api/files/read
 * Read a file directly by path (for development/debugging)
 */
router.get("/files/read", async (req: Request, res: Response) => {
  try {
    const filePath = req.query.path as string;

    if (!filePath) {
      return res.status(400).json({
        success: false,
        error: "File path required",
      });
    }

    // Security: Only allow reading from /app/data/projects
    if (!filePath.startsWith("/app/data/projects")) {
      return res.status(403).json({
        success: false,
        error: "Access denied - can only read project files",
      });
    }

    const content = await fileSyncAgent.getFileContent(filePath);

    if (!content) {
      return res.status(404).json({
        success: false,
        error: "File not found",
      });
    }

    res.json({
      success: true,
      data: content,
    });
  } catch (error) {
    logger.error("Error reading file:", error);
    res.status(500).json({
      success: false,
      error: "Failed to read file",
    });
  }
});

/**
 * POST /api/files/write
 * Write content to a file (for editing)
 */
router.post("/files/write", async (req: Request, res: Response) => {
  try {
    const { path: filePath, content } = req.body;

    if (!filePath || content === undefined) {
      return res.status(400).json({
        success: false,
        error: "File path and content required",
      });
    }

    // Security: Only allow writing to /app/data/projects
    if (!filePath.startsWith("/app/data/projects")) {
      return res.status(403).json({
        success: false,
        error: "Access denied - can only write to project files",
      });
    }

    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, content, "utf-8");

    logger.info(`📝 File written: ${filePath}`);

    res.json({
      success: true,
      data: {
        path: filePath,
        size: content.length,
        writtenAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error("Error writing file:", error);
    res.status(500).json({
      success: false,
      error: "Failed to write file",
    });
  }
});

export default router;
