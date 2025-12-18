import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { getDatabase } from "../core/database.js";
import { logger } from "../utils/logger.js";
import {
  Node,
  CreateNodeInput,
  UpdateNodeInput,
  ApiResponse,
} from "../types/index.js";

const router = Router({ mergeParams: true });

// GET /api/projects/:projectId/nodes - List all nodes in project
router.get(
  "/",
  (req: Request<{ projectId: string }>, res: Response<ApiResponse<Node[]>>) => {
    try {
      const { projectId } = req.params;
      const db = getDatabase();

      // Verify project exists
      const project = db
        .prepare("SELECT id FROM projects WHERE id = ?")
        .get(projectId);
      if (!project) {
        res.status(404).json({
          success: false,
          error: "Project not found",
        });
        return;
      }

      const nodes = db
        .prepare(
          "SELECT * FROM nodes WHERE project_id = ? ORDER BY created_at DESC"
        )
        .all(projectId) as Node[];

      res.json({
        success: true,
        data: nodes,
        meta: {
          timestamp: new Date().toISOString(),
          pagination: {
            page: 1,
            limit: nodes.length,
            total: nodes.length,
          },
        },
      });
    } catch (error) {
      logger.error("Error fetching nodes:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch nodes",
      });
    }
  }
);

// POST /api/projects/:projectId/nodes - Create new node
router.post(
  "/",
  (
    req: Request<{ projectId: string }, {}, CreateNodeInput>,
    res: Response<ApiResponse<Node>>
  ) => {
    try {
      const { projectId } = req.params;
      const { name, type, description } = req.body;

      if (!name || name.trim() === "") {
        res.status(400).json({
          success: false,
          error: "Node name is required",
        });
        return;
      }

      if (!type) {
        res.status(400).json({
          success: false,
          error: "Invalid node type",
        });
        return;
      }

      const db = getDatabase();
      const project = db
        .prepare("SELECT id FROM projects WHERE id = ?")
        .get(projectId);
      if (!project) {
        res.status(404).json({
          success: false,
          error: "Project not found",
        });
        return;
      }

      const id = uuidv4();
      const now = new Date().toISOString();

      db.prepare(
        `INSERT INTO nodes (id, project_id, name, type, description, position_x, position_y, status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).run(
        id,
        projectId,
        name,
        type,
        description || null,
        0,
        0,
        "planned",
        now,
        now
      );

      const node = db
        .prepare("SELECT * FROM nodes WHERE id = ?")
        .get(id) as Node;

      logger.info(`✅ Node created: ${name} (${id}) in project ${projectId}`);

      res.status(201).json({
        success: true,
        data: node,
        meta: {
          timestamp: now,
        },
      });
    } catch (error) {
      logger.error("Error creating node:", error);
      res.status(500).json({
        success: false,
        error: "Failed to create node",
      });
    }
  }
);

// GET /api/projects/:projectId/nodes/:nodeId - Get node details
router.get(
  "/:nodeId",
  (
    req: Request<{ projectId: string; nodeId: string }>,
    res: Response<ApiResponse<Node>>
  ) => {
    try {
      const { projectId, nodeId } = req.params;
      const db = getDatabase();

      const node = db
        .prepare("SELECT * FROM nodes WHERE id = ? AND project_id = ?")
        .get(nodeId, projectId) as Node | undefined;

      if (!node) {
        res.status(404).json({
          success: false,
          error: "Node not found",
        });
        return;
      }

      res.json({
        success: true,
        data: node,
        meta: {
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      logger.error("Error fetching node:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch node",
      });
    }
  }
);

// PATCH /api/projects/:projectId/nodes/:nodeId - Update node
router.patch(
  "/:nodeId",
  (
    req: Request<{ projectId: string; nodeId: string }, {}, UpdateNodeInput>,
    res: Response<ApiResponse<Node>>
  ) => {
    try {
      const { projectId, nodeId } = req.params;
      const { name, description, status, position_x, position_y } = req.body;

      const db = getDatabase();
      const node = db
        .prepare("SELECT * FROM nodes WHERE id = ? AND project_id = ?")
        .get(nodeId, projectId) as Node | undefined;

      if (!node) {
        res.status(404).json({
          success: false,
          error: "Node not found",
        });
        return;
      }

      const now = new Date().toISOString();
      const updates: Record<string, unknown> = {};

      if (name !== undefined) updates.name = name;
      if (description !== undefined) updates.description = description;
      if (status !== undefined) updates.status = status;
      if (position_x !== undefined) updates.position_x = position_x;
      if (position_y !== undefined) updates.position_y = position_y;

      const setClause = Object.keys(updates)
        .map((key) => `${key} = ?`)
        .join(", ");
      const values = [...Object.values(updates), now, nodeId, projectId];

      db.prepare(
        `UPDATE nodes SET ${setClause}, updated_at = ? WHERE id = ? AND project_id = ?`
      ).run(...values);

      const updated = db
        .prepare("SELECT * FROM nodes WHERE id = ?")
        .get(nodeId) as Node;

      logger.info(`✅ Node updated: ${nodeId}`);

      res.json({
        success: true,
        data: updated,
        meta: {
          timestamp: now,
        },
      });
    } catch (error) {
      logger.error("Error updating node:", error);
      res.status(500).json({
        success: false,
        error: "Failed to update node",
      });
    }
  }
);

// DELETE /api/projects/:projectId/nodes/:nodeId - Delete node
router.delete(
  "/:nodeId",
  (
    req: Request<{ projectId: string; nodeId: string }>,
    res: Response<ApiResponse>
  ) => {
    try {
      const { projectId, nodeId } = req.params;
      const db = getDatabase();

      const node = db
        .prepare("SELECT id FROM nodes WHERE id = ? AND project_id = ?")
        .get(nodeId, projectId);

      if (!node) {
        res.status(404).json({
          success: false,
          error: "Node not found",
        });
        return;
      }

      // Delete node (cascades to relationships)
      db.prepare("DELETE FROM nodes WHERE id = ?").run(nodeId);

      logger.info(`✅ Node deleted: ${nodeId}`);

      res.json({
        success: true,
        message: "Node deleted successfully",
        meta: {
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      logger.error("Error deleting node:", error);
      res.status(500).json({
        success: false,
        error: "Failed to delete node",
      });
    }
  }
);

export default router;
