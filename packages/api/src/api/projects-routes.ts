import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { getDatabase } from "../core/database.js";
import { logger } from "../utils/logger.js";
import {
  Project,
  CreateProjectInput,
  UpdateProjectInput,
  ApiResponse,
} from "../types/index.js";

const router = Router();

// GET /api/projects - List all projects
router.get("/", (req: Request, res: Response<ApiResponse<Project[]>>) => {
  try {
    const db = getDatabase();
    const projects = db
      .prepare("SELECT * FROM projects ORDER BY created_at DESC")
      .all() as Project[];

    res.json({
      success: true,
      data: projects,
      meta: {
        timestamp: new Date().toISOString(),
        pagination: {
          page: 1,
          limit: projects.length,
          total: projects.length,
        },
      },
    });
  } catch (error) {
    logger.error("Error fetching projects:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch projects",
    });
  }
});

// POST /api/projects - Create new project
router.post(
  "/",
  (
    req: Request<{}, {}, CreateProjectInput>,
    res: Response<ApiResponse<Project>>
  ) => {
    try {
      const { name, description } = req.body;

      if (!name || name.trim() === "") {
        res.status(400).json({
          success: false,
          error: "Project name is required",
        });
        return;
      }

      const id = uuidv4();
      const now = new Date().toISOString();
      const port_range_start =
        Math.floor(Math.random() / 100) * 10 * 1000 + 3000; // Random port range start

      const db = getDatabase();
      db.prepare(
        `INSERT INTO projects (id, name, description, status, port_range_start, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).run(
        id,
        name,
        description || null,
        "planning",
        port_range_start,
        now,
        now
      );

      const project = db
        .prepare("SELECT * FROM projects WHERE id = ?")
        .get(id) as Project;

      logger.info(`✅ Project created: ${name} (${id})`);

      res.status(201).json({
        success: true,
        data: project,
        meta: {
          timestamp: now,
        },
      });
    } catch (error) {
      logger.error("Error creating project:", error);
      res.status(500).json({
        success: false,
        error: "Failed to create project",
      });
    }
  }
);

// GET /api/projects/:id - Get project details
router.get(
  "/:id",
  (req: Request<{ id: string }>, res: Response<ApiResponse<Project>>) => {
    try {
      const { id } = req.params;
      const db = getDatabase();
      const project = db
        .prepare("SELECT * FROM projects WHERE id = ?")
        .get(id) as Project | undefined;

      if (!project) {
        res.status(404).json({
          success: false,
          error: "Project not found",
        });
        return;
      }

      res.json({
        success: true,
        data: project,
        meta: {
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      logger.error("Error fetching project:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch project",
      });
    }
  }
);

// PATCH /api/projects/:id - Update project
router.patch(
  "/:id",
  (
    req: Request<{ id: string }, {}, UpdateProjectInput>,
    res: Response<ApiResponse<Project>>
  ) => {
    try {
      const { id } = req.params;
      const { name, description, status } = req.body;

      const db = getDatabase();
      const project = db
        .prepare("SELECT * FROM projects WHERE id = ?")
        .get(id) as Project | undefined;

      if (!project) {
        res.status(404).json({
          success: false,
          error: "Project not found",
        });
        return;
      }

      const now = new Date().toISOString();
      const updateName = name !== undefined ? name : project.name;
      const updateDescription =
        description !== undefined ? description : project.description;
      const updateStatus = status !== undefined ? status : project.status;

      db.prepare(
        `UPDATE projects SET name = ?, description = ?, status = ?, updated_at = ? WHERE id = ?`
      ).run(updateName, updateDescription || null, updateStatus, now, id);

      const updated = db
        .prepare("SELECT * FROM projects WHERE id = ?")
        .get(id) as Project;

      logger.info(`✅ Project updated: ${id}`);

      res.json({
        success: true,
        data: updated,
        meta: {
          timestamp: now,
        },
      });
    } catch (error) {
      logger.error("Error updating project:", error);
      res.status(500).json({
        success: false,
        error: "Failed to update project",
      });
    }
  }
);

// DELETE /api/projects/:id - Delete project
router.delete(
  "/:id",
  (req: Request<{ id: string }>, res: Response<ApiResponse>) => {
    try {
      const { id } = req.params;
      const db = getDatabase();
      const project = db
        .prepare("SELECT * FROM projects WHERE id = ?")
        .get(id) as Project | undefined;

      if (!project) {
        res.status(404).json({
          success: false,
          error: "Project not found",
        });
        return;
      }

      // Delete project (cascades to all related data)
      db.prepare("DELETE FROM projects WHERE id = ?").run(id);

      logger.info(`✅ Project deleted: ${id}`);

      res.json({
        success: true,
        message: "Project deleted successfully",
        meta: {
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      logger.error("Error deleting project:", error);
      res.status(500).json({
        success: false,
        error: "Failed to delete project",
      });
    }
  }
);

export default router;
