/**
 * Docker Routes
 *
 * API endpoints for Docker container management
 * Integrates with port_allocations system for service discovery
 */

import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { getDatabase } from "../core/database.js";
import {
  dockerManager,
  DockerService,
  LogEntry,
  ResourceStats,
} from "../core/docker-manager.js";
import { logger } from "../utils/logger.js";
import * as path from "path";
import * as fs from "fs";

const router = express.Router();

// Project storage path
const PROJECTS_DIR = process.env.PROJECTS_DIR || "/app/projects";

// ============================================
// SERVICE DISCOVERY
// ============================================

/**
 * GET /api/docker/status
 * Check Docker availability
 */
router.get("/status", async (req: Request, res: Response) => {
  try {
    const dockerAvailable = await dockerManager.isAvailable();
    const composeAvailable = await dockerManager.isComposeAvailable();

    res.json({
      success: true,
      data: {
        docker: dockerAvailable,
        compose: composeAvailable,
        socketPath: process.env.DOCKER_HOST || "/var/run/docker.sock",
      },
    });
  } catch (error) {
    logger.error("Docker status check failed:", error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to check Docker status",
    });
  }
});

/**
 * GET /api/docker/services
 * List all Docker services (optionally filtered by project)
 */
router.get("/services", async (req: Request, res: Response) => {
  try {
    const { projectId } = req.query;

    let services: DockerService[];

    if (projectId) {
      services = await dockerManager.getProjectServices(projectId as string);
    } else {
      // Get all containers and map to services
      const containers = await dockerManager.listContainers();
      const db = getDatabase();

      services = containers.map((c) => {
        // Try to find matching port allocation
        const portAlloc = db
          .prepare(
            "SELECT * FROM port_allocations WHERE service_name = ? LIMIT 1"
          )
          .get(c.name) as any;

        return {
          id: c.id,
          name: c.name,
          displayName: c.name
            .split("-")
            .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" "),
          projectId: portAlloc?.project_id || "",
          type: detectServiceType(c.name, c.image),
          status: c.status,
          port: c.ports[0]?.hostPort,
          containerId: c.id,
          image: c.image,
        };
      });
    }

    // Get stats for running services
    const servicesWithStats = await Promise.all(
      services.map(async (s) => {
        if (s.status === "running" && s.containerId) {
          const stats = await dockerManager.getStats(s.name);
          return { ...s, stats };
        }
        return s;
      })
    );

    res.json({
      success: true,
      data: {
        services: servicesWithStats,
        count: services.length,
      },
    });
  } catch (error) {
    logger.error("Failed to list services:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to list services",
    });
  }
});

/**
 * GET /api/docker/services/:projectId
 * Get services for a specific project
 */
router.get("/services/:projectId", async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const services = await dockerManager.getProjectServices(projectId);

    // Get stats for running services
    const servicesWithStats = await Promise.all(
      services.map(async (s) => {
        if (s.status === "running") {
          const stats = await dockerManager.getStats(s.name);
          return { ...s, stats };
        }
        return s;
      })
    );

    res.json({
      success: true,
      data: {
        projectId,
        services: servicesWithStats,
        count: services.length,
      },
    });
  } catch (error) {
    logger.error(
      `Failed to get services for project ${req.params.projectId}:`,
      error
    );
    res.status(500).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to get project services",
    });
  }
});

// ============================================
// CONTAINER CONTROL
// ============================================

/**
 * POST /api/docker/service/:name/start
 * Start a service
 */
router.post("/service/:name/start", async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const { projectPath } = req.body;

    logger.info(`▶️ Starting service: ${name}`);

    const resolvedPath = projectPath || (await getProjectPath(name));
    const result = await dockerManager.startService(name, resolvedPath);

    if (result.success) {
      // Update port allocation status
      updatePortStatus(name, "in-use");
    }

    res.json({
      success: result.success,
      data: {
        service: name,
        action: "start",
        output: result.output,
      },
    });
  } catch (error) {
    logger.error(`Failed to start service ${req.params.name}:`, error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to start service",
    });
  }
});

/**
 * POST /api/docker/service/:name/stop
 * Stop a service
 */
router.post("/service/:name/stop", async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const { projectPath } = req.body;

    logger.info(`⏹️ Stopping service: ${name}`);

    const resolvedPath = projectPath || (await getProjectPath(name));
    const result = await dockerManager.stopService(name, resolvedPath);

    if (result.success) {
      updatePortStatus(name, "allocated");
    }

    res.json({
      success: result.success,
      data: {
        service: name,
        action: "stop",
        output: result.output,
      },
    });
  } catch (error) {
    logger.error(`Failed to stop service ${req.params.name}:`, error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to stop service",
    });
  }
});

/**
 * POST /api/docker/service/:name/restart
 * Restart a service
 */
router.post("/service/:name/restart", async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const { projectPath } = req.body;

    logger.info(`🔄 Restarting service: ${name}`);

    const resolvedPath = projectPath || (await getProjectPath(name));
    const result = await dockerManager.restartService(name, resolvedPath);

    res.json({
      success: result.success,
      data: {
        service: name,
        action: "restart",
        output: result.output,
      },
    });
  } catch (error) {
    logger.error(`Failed to restart service ${req.params.name}:`, error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to restart service",
    });
  }
});

/**
 * POST /api/docker/service/:name/rebuild
 * Rebuild and restart a service
 */
router.post("/service/:name/rebuild", async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const { projectPath, noCache = true } = req.body;

    logger.info(`🔨 Rebuilding service: ${name} (noCache: ${noCache})`);

    const resolvedPath = projectPath || (await getProjectPath(name));

    if (!resolvedPath) {
      return res.status(400).json({
        success: false,
        error: "Project path not found for service",
      });
    }

    const result = await dockerManager.rebuildService(
      name,
      resolvedPath,
      noCache
    );

    res.json({
      success: result.success,
      data: {
        service: name,
        action: "rebuild",
        output: result.output,
      },
    });
  } catch (error) {
    logger.error(`Failed to rebuild service ${req.params.name}:`, error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to rebuild service",
    });
  }
});

// ============================================
// LOGS & STATS
// ============================================

/**
 * GET /api/docker/service/:name/logs
 * Get service logs
 */
router.get("/service/:name/logs", async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const tail = parseInt(req.query.tail as string) || 100;
    const projectPath = req.query.projectPath as string | undefined;

    const resolvedPath =
      projectPath || (await getProjectPath(name)) || undefined;
    const result = await dockerManager.getLogs(name, resolvedPath, tail);

    res.json({
      success: result.success,
      data: {
        service: name,
        logs: result.logs,
        count: result.logs.length,
      },
    });
  } catch (error) {
    logger.error(`Failed to get logs for ${req.params.name}:`, error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to get logs",
    });
  }
});

/**
 * GET /api/docker/service/:name/stats
 * Get service resource stats
 */
router.get("/service/:name/stats", async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const stats = await dockerManager.getStats(name);

    if (!stats) {
      return res.json({
        success: true,
        data: {
          service: name,
          stats: null,
          message: "Container not running or stats unavailable",
        },
      });
    }

    res.json({
      success: true,
      data: {
        service: name,
        stats,
      },
    });
  } catch (error) {
    logger.error(`Failed to get stats for ${req.params.name}:`, error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to get stats",
    });
  }
});

// ============================================
// PROJECT DEPLOYMENT
// ============================================

/**
 * POST /api/docker/project/:projectId/deploy
 * Deploy all services for a project
 */
router.post(
  "/project/:projectId/deploy",
  async (req: Request, res: Response) => {
    try {
      const { projectId } = req.params;
      const { environment = "development" } = req.body;

      const db = getDatabase();
      const project = db
        .prepare("SELECT * FROM projects WHERE id = ?")
        .get(projectId) as any;

      if (!project) {
        return res.status(404).json({
          success: false,
          error: "Project not found",
        });
      }

      const projectPath = path.join(
        PROJECTS_DIR,
        project.name.toLowerCase().replace(/\s+/g, "-")
      );

      if (!fs.existsSync(projectPath)) {
        return res.status(400).json({
          success: false,
          error: `Project directory not found: ${projectPath}`,
        });
      }

      const composePath = path.join(projectPath, "docker-compose.yml");
      if (!fs.existsSync(composePath)) {
        return res.status(400).json({
          success: false,
          error: "docker-compose.yml not found in project",
        });
      }

      logger.info(`🚀 Deploying project: ${project.name}`);

      // Build and start all services
      const { exec } = await import("child_process");
      const { promisify } = await import("util");
      const execAsync = promisify(exec);

      let output = "";

      // Build
      try {
        const { stdout, stderr } = await execAsync(
          `docker compose -f "${composePath}" build`,
          { cwd: projectPath, timeout: 600000 }
        );
        output += stdout + stderr;
      } catch (error: any) {
        output += error.stderr || error.message;
      }

      // Start
      try {
        const { stdout, stderr } = await execAsync(
          `docker compose -f "${composePath}" up -d`,
          { cwd: projectPath, timeout: 120000 }
        );
        output += stdout + stderr;
      } catch (error: any) {
        return res.status(500).json({
          success: false,
          error: "Failed to start services",
          output: error.stderr || error.message,
        });
      }

      // Update project status
      db.prepare(
        "UPDATE projects SET is_deployed = 1, updated_at = ? WHERE id = ?"
      ).run(new Date().toISOString(), projectId);

      // Update port allocations
      const portAllocations = db
        .prepare("SELECT * FROM port_allocations WHERE project_id = ?")
        .all(projectId) as any[];

      for (const alloc of portAllocations) {
        db.prepare(
          "UPDATE port_allocations SET status = 'in-use', updated_at = ? WHERE id = ?"
        ).run(new Date().toISOString(), alloc.id);
      }

      // Get deployed services
      const services = await dockerManager.getProjectServices(projectId);

      res.json({
        success: true,
        data: {
          projectId,
          projectName: project.name,
          environment,
          services,
          output,
          deployedAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      logger.error(`Failed to deploy project ${req.params.projectId}:`, error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to deploy project",
      });
    }
  }
);

/**
 * POST /api/docker/project/:projectId/stop
 * Stop all services for a project
 */
router.post("/project/:projectId/stop", async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;

    const db = getDatabase();
    const project = db
      .prepare("SELECT * FROM projects WHERE id = ?")
      .get(projectId) as any;

    if (!project) {
      return res.status(404).json({
        success: false,
        error: "Project not found",
      });
    }

    const projectPath = path.join(
      PROJECTS_DIR,
      project.name.toLowerCase().replace(/\s+/g, "-")
    );
    const composePath = path.join(projectPath, "docker-compose.yml");

    if (!fs.existsSync(composePath)) {
      return res.status(400).json({
        success: false,
        error: "docker-compose.yml not found",
      });
    }

    logger.info(`⏹️ Stopping project: ${project.name}`);

    const { exec } = await import("child_process");
    const { promisify } = await import("util");
    const execAsync = promisify(exec);

    const { stdout, stderr } = await execAsync(
      `docker compose -f "${composePath}" down`,
      { cwd: projectPath, timeout: 120000 }
    );

    // Update port allocations
    db.prepare(
      "UPDATE port_allocations SET status = 'allocated', updated_at = ? WHERE project_id = ?"
    ).run(new Date().toISOString(), projectId);

    res.json({
      success: true,
      data: {
        projectId,
        projectName: project.name,
        action: "stop",
        output: stdout + stderr,
      },
    });
  } catch (error) {
    logger.error(`Failed to stop project ${req.params.projectId}:`, error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to stop project",
    });
  }
});

// ============================================
// DOCKERFILE GENERATION
// ============================================

/**
 * POST /api/docker/generate/dockerfile
 * Generate a Dockerfile for a service type
 */
router.post("/generate/dockerfile", async (req: Request, res: Response) => {
  try {
    const { type, options = {} } = req.body;

    if (!type) {
      return res.status(400).json({
        success: false,
        error: "Service type is required",
      });
    }

    const dockerfile = dockerManager.generateDockerfile(type, options);

    res.json({
      success: true,
      data: {
        type,
        dockerfile,
      },
    });
  } catch (error) {
    logger.error("Failed to generate Dockerfile:", error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to generate Dockerfile",
    });
  }
});

/**
 * POST /api/docker/generate/compose
 * Generate a docker-compose.yml for a project
 */
router.post("/generate/compose", async (req: Request, res: Response) => {
  try {
    const { projectName, services } = req.body;

    if (!projectName || !services) {
      return res.status(400).json({
        success: false,
        error: "Project name and services array required",
      });
    }

    const compose = dockerManager.generateDockerCompose(projectName, services);

    res.json({
      success: true,
      data: {
        projectName,
        compose,
      },
    });
  } catch (error) {
    logger.error("Failed to generate docker-compose:", error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to generate docker-compose",
    });
  }
});

// ============================================
// HELPERS
// ============================================

function detectServiceType(name: string, image: string): DockerService["type"] {
  const combined = (name + image).toLowerCase();

  if (
    combined.includes("frontend") ||
    combined.includes("web") ||
    combined.includes("client") ||
    combined.includes("nginx")
  ) {
    return "frontend";
  }
  if (
    combined.includes("backend") ||
    combined.includes("api") ||
    combined.includes("server")
  ) {
    return "backend";
  }
  if (
    combined.includes("postgres") ||
    combined.includes("mysql") ||
    combined.includes("mongo") ||
    combined.includes("database")
  ) {
    return "database";
  }
  if (
    combined.includes("redis") ||
    combined.includes("cache") ||
    combined.includes("memcache")
  ) {
    return "cache";
  }
  if (
    combined.includes("worker") ||
    combined.includes("queue") ||
    combined.includes("celery")
  ) {
    return "worker";
  }
  if (
    combined.includes("gateway") ||
    combined.includes("proxy") ||
    combined.includes("caddy") ||
    combined.includes("traefik")
  ) {
    return "gateway";
  }

  return "other";
}

async function getProjectPath(serviceName: string): Promise<string | null> {
  const db = getDatabase();

  // Try to find from port allocations
  const portAlloc = db
    .prepare(
      "SELECT project_id FROM port_allocations WHERE service_name = ? LIMIT 1"
    )
    .get(serviceName) as { project_id: string } | undefined;

  if (portAlloc) {
    const project = db
      .prepare("SELECT name FROM projects WHERE id = ?")
      .get(portAlloc.project_id) as { name: string } | undefined;
    if (project) {
      return path.join(
        PROJECTS_DIR,
        project.name.toLowerCase().replace(/\s+/g, "-")
      );
    }
  }

  // Try to find from service name pattern (project-service)
  const parts = serviceName.split("-");
  if (parts.length >= 2) {
    const potentialPath = path.join(PROJECTS_DIR, parts[0]);
    if (fs.existsSync(potentialPath)) {
      return potentialPath;
    }
  }

  return null;
}

function updatePortStatus(
  serviceName: string,
  status: "allocated" | "in-use" | "released"
) {
  try {
    const db = getDatabase();
    db.prepare(
      "UPDATE port_allocations SET status = ?, updated_at = ? WHERE service_name = ?"
    ).run(status, new Date().toISOString(), serviceName);
  } catch (error) {
    logger.warn(`Failed to update port status for ${serviceName}:`, error);
  }
}

export default router;
