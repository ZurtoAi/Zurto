import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { getDatabase } from "../core/database.js";
import { logger } from "../utils/logger.js";
import { ApiResponse } from "../types/index.js";

interface NodeRelationship {
  id: string;
  project_id: string;
  source_node_id: string;
  target_node_id: string;
  relationship_type: string;
  created_at: string;
}

interface CreateRelationshipInput {
  sourceNodeId: string;
  targetNodeId: string;
  relationshipType: string;
}

const router = Router({ mergeParams: true });

// GET /api/projects/:projectId/relationships - List all relationships
router.get(
  "/",
  (
    req: Request<{ projectId: string }>,
    res: Response<ApiResponse<NodeRelationship[]>>
  ) => {
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

      const relationships = db
        .prepare(
          "SELECT * FROM node_relationships WHERE project_id = ? ORDER BY created_at DESC"
        )
        .all(projectId) as NodeRelationship[];

      res.json({
        success: true,
        data: relationships,
        meta: {
          timestamp: new Date().toISOString(),
          pagination: {
            page: 1,
            limit: relationships.length,
            total: relationships.length,
          },
        },
      });
    } catch (error) {
      logger.error("Error fetching relationships:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch relationships",
      });
    }
  }
);

// POST /api/projects/:projectId/relationships - Create relationship
router.post(
  "/",
  (
    req: Request<{ projectId: string }, {}, CreateRelationshipInput>,
    res: Response<ApiResponse<NodeRelationship>>
  ) => {
    try {
      const { projectId } = req.params;
      const { sourceNodeId, targetNodeId, relationshipType } = req.body;

      if (!sourceNodeId || !targetNodeId || !relationshipType) {
        res.status(400).json({
          success: false,
          error:
            "Missing required fields: sourceNodeId, targetNodeId, relationshipType",
        });
        return;
      }

      const validTypes = [
        "dependency",
        "blocks",
        "triggers",
        "precedes",
        "conditional",
        "depends_on",
        "child_of",
        "connects_to",
        "calls",
        "generates",
        "deploys",
        "implements",
        "references",
      ];
      if (!validTypes.includes(relationshipType)) {
        res.status(400).json({
          success: false,
          error: `Invalid relationship type. Must be one of: ${validTypes.join(", ")}`,
        });
        return;
      }

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

      // Verify both nodes exist and belong to project
      const sourceNode = db
        .prepare("SELECT id FROM nodes WHERE id = ? AND project_id = ?")
        .get(sourceNodeId, projectId);
      const targetNode = db
        .prepare("SELECT id FROM nodes WHERE id = ? AND project_id = ?")
        .get(targetNodeId, projectId);

      if (!sourceNode || !targetNode) {
        res.status(404).json({
          success: false,
          error: "One or both nodes not found in project",
        });
        return;
      }

      // Check for duplicate relationship
      const existing = db
        .prepare(
          "SELECT id FROM node_relationships WHERE project_id = ? AND source_node_id = ? AND target_node_id = ?"
        )
        .get(projectId, sourceNodeId, targetNodeId);

      if (existing) {
        res.status(400).json({
          success: false,
          error: "Relationship already exists between these nodes",
        });
        return;
      }

      const id = uuidv4();
      const now = new Date().toISOString();

      db.prepare(
        `INSERT INTO node_relationships (id, project_id, source_node_id, target_node_id, relationship_type, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`
      ).run(id, projectId, sourceNodeId, targetNodeId, relationshipType, now);

      const relationship = db
        .prepare("SELECT * FROM node_relationships WHERE id = ?")
        .get(id) as NodeRelationship;

      logger.info(
        `✅ Relationship created: ${sourceNodeId} -> ${targetNodeId} (${relationshipType})`
      );

      res.status(201).json({
        success: true,
        data: relationship,
        meta: {
          timestamp: now,
        },
      });
    } catch (error) {
      logger.error("Error creating relationship:", error);
      res.status(500).json({
        success: false,
        error: "Failed to create relationship",
      });
    }
  }
);

// GET /api/projects/:projectId/relationships/:relationshipId - Get relationship details
router.get(
  "/:relationshipId",
  (
    req: Request<{ projectId: string; relationshipId: string }>,
    res: Response<ApiResponse<NodeRelationship>>
  ) => {
    try {
      const { projectId, relationshipId } = req.params;
      const db = getDatabase();

      const relationship = db
        .prepare(
          "SELECT * FROM node_relationships WHERE id = ? AND project_id = ?"
        )
        .get(relationshipId, projectId) as NodeRelationship | undefined;

      if (!relationship) {
        res.status(404).json({
          success: false,
          error: "Relationship not found",
        });
        return;
      }

      res.json({
        success: true,
        data: relationship,
        meta: {
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      logger.error("Error fetching relationship:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch relationship",
      });
    }
  }
);

// DELETE /api/projects/:projectId/relationships/:relationshipId - Delete relationship
router.delete(
  "/:relationshipId",
  (
    req: Request<{ projectId: string; relationshipId: string }>,
    res: Response<ApiResponse>
  ) => {
    try {
      const { projectId, relationshipId } = req.params;
      const db = getDatabase();

      const relationship = db
        .prepare(
          "SELECT id FROM node_relationships WHERE id = ? AND project_id = ?"
        )
        .get(relationshipId, projectId);

      if (!relationship) {
        res.status(404).json({
          success: false,
          error: "Relationship not found",
        });
        return;
      }

      db.prepare("DELETE FROM node_relationships WHERE id = ?").run(
        relationshipId
      );

      logger.info(`✅ Relationship deleted: ${relationshipId}`);

      res.json({
        success: true,
        message: "Relationship deleted successfully",
        meta: {
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      logger.error("Error deleting relationship:", error);
      res.status(500).json({
        success: false,
        error: "Failed to delete relationship",
      });
    }
  }
);

export default router;
