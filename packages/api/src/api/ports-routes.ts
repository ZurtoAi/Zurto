import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { getDatabase } from "../core/database.js";
import { logger } from "../utils/logger.js";

const router = express.Router();

// Port allocation configuration
const PORT_CONFIG = {
  projectMin: parseInt(process.env.PROJECT_PORT_MIN || "5000", 10),
  projectMax: parseInt(process.env.PROJECT_PORT_MAX || "5500", 10),
  portsPerProject: parseInt(process.env.PORTS_PER_PROJECT || "5", 10),
  reservedPorts: [3000, 5173, 80, 443, 2019, 3306, 8000, 8080, 8443], // Zurto system ports
};

interface PortAllocation {
  id: string;
  projectId: string;
  port: number;
  serviceName: string;
  serviceType: "frontend" | "backend" | "database" | "cache" | "other";
  status: "allocated" | "in-use" | "released";
  createdAt: string;
  updatedAt: string;
}

/**
 * Initialize ports table if not exists
 */
function ensurePortsTable() {
  const db = getDatabase();
  db.exec(`
    CREATE TABLE IF NOT EXISTS port_allocations (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      port INTEGER NOT NULL UNIQUE,
      service_name TEXT NOT NULL,
      service_type TEXT DEFAULT 'other',
      status TEXT DEFAULT 'allocated',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );
    
    CREATE INDEX IF NOT EXISTS idx_ports_project ON port_allocations(project_id);
    CREATE INDEX IF NOT EXISTS idx_ports_status ON port_allocations(status);
  `);
}

// Ensure table exists on module load
try {
  ensurePortsTable();
  logger.info("✅ Port allocations table ready");
} catch (error) {
  logger.warn("⚠️ Port table init deferred (database may not be ready yet)");
}

/**
 * GET /api/ports
 * List all port allocations
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    ensurePortsTable();
    const db = getDatabase();
    const { projectId, status } = req.query;

    let query = "SELECT * FROM port_allocations WHERE 1=1";
    const params: any[] = [];

    if (projectId) {
      query += " AND project_id = ?";
      params.push(projectId);
    }

    if (status) {
      query += " AND status = ?";
      params.push(status);
    }

    query += " ORDER BY port ASC";

    const allocations = db.prepare(query).all(...params);

    res.json({
      success: true,
      data: {
        allocations,
        config: {
          projectRange: `${PORT_CONFIG.projectMin}-${PORT_CONFIG.projectMax}`,
          portsPerProject: PORT_CONFIG.portsPerProject,
          reservedPorts: PORT_CONFIG.reservedPorts,
        },
      },
    });
  } catch (error) {
    logger.error("❌ Failed to list ports:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to list ports",
    });
  }
});

/**
 * GET /api/ports/available
 * Get next available ports for a project
 */
router.get("/available", async (req: Request, res: Response) => {
  try {
    ensurePortsTable();
    const db = getDatabase();
    const count =
      parseInt(req.query.count as string) || PORT_CONFIG.portsPerProject;

    // Get all allocated ports
    const allocated = db
      .prepare("SELECT port FROM port_allocations WHERE status != 'released'")
      .all()
      .map((row: any) => row.port);

    const allUsedPorts = new Set([...allocated, ...PORT_CONFIG.reservedPorts]);

    // Find available ports
    const available: number[] = [];
    for (
      let port = PORT_CONFIG.projectMin;
      port <= PORT_CONFIG.projectMax && available.length < count;
      port++
    ) {
      if (!allUsedPorts.has(port)) {
        available.push(port);
      }
    }

    res.json({
      success: true,
      data: {
        available,
        requestedCount: count,
        foundCount: available.length,
        range: `${PORT_CONFIG.projectMin}-${PORT_CONFIG.projectMax}`,
      },
    });
  } catch (error) {
    logger.error("❌ Failed to find available ports:", error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to find available ports",
    });
  }
});

/**
 * POST /api/ports/allocate
 * Allocate ports for a project
 */
router.post("/allocate", async (req: Request, res: Response) => {
  try {
    ensurePortsTable();
    const db = getDatabase();
    const { projectId, services } = req.body;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        error: "Missing projectId",
      });
    }

    // Check project exists
    const project = db
      .prepare("SELECT id FROM projects WHERE id = ?")
      .get(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: "Project not found",
      });
    }

    // Check current allocation count for project
    const currentCount = db
      .prepare(
        "SELECT COUNT(*) as count FROM port_allocations WHERE project_id = ? AND status != 'released'"
      )
      .get(projectId) as { count: number };

    if (currentCount.count >= PORT_CONFIG.portsPerProject) {
      return res.status(400).json({
        success: false,
        error: `Project already has maximum ${PORT_CONFIG.portsPerProject} ports allocated`,
      });
    }

    // Get available ports
    const allocated = db
      .prepare("SELECT port FROM port_allocations WHERE status != 'released'")
      .all()
      .map((row: any) => row.port);

    const allUsedPorts = new Set([...allocated, ...PORT_CONFIG.reservedPorts]);

    // Default services if not provided
    const servicesToAllocate = services || [
      { name: "frontend", type: "frontend" },
      { name: "backend", type: "backend" },
    ];

    const allocations: PortAllocation[] = [];
    const remainingSlots = PORT_CONFIG.portsPerProject - currentCount.count;
    const toAllocate = servicesToAllocate.slice(0, remainingSlots);

    const insertStmt = db.prepare(`
      INSERT INTO port_allocations (id, project_id, port, service_name, service_type, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 'allocated', ?, ?)
    `);

    let nextPort = PORT_CONFIG.projectMin;
    for (const service of toAllocate) {
      // Find next available port
      while (allUsedPorts.has(nextPort) && nextPort <= PORT_CONFIG.projectMax) {
        nextPort++;
      }

      if (nextPort > PORT_CONFIG.projectMax) {
        break; // No more ports available
      }

      const now = new Date().toISOString();
      const allocation: PortAllocation = {
        id: uuidv4(),
        projectId,
        port: nextPort,
        serviceName: service.name,
        serviceType: service.type || "other",
        status: "allocated",
        createdAt: now,
        updatedAt: now,
      };

      insertStmt.run(
        allocation.id,
        allocation.projectId,
        allocation.port,
        allocation.serviceName,
        allocation.serviceType,
        allocation.createdAt,
        allocation.updatedAt
      );

      allocations.push(allocation);
      allUsedPorts.add(nextPort);
      nextPort++;
    }

    logger.info(
      `✅ Allocated ${allocations.length} ports for project ${projectId}`
    );

    res.json({
      success: true,
      data: {
        projectId,
        allocations,
        totalAllocated: currentCount.count + allocations.length,
        maxAllowed: PORT_CONFIG.portsPerProject,
      },
    });
  } catch (error) {
    logger.error("❌ Failed to allocate ports:", error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to allocate ports",
    });
  }
});

/**
 * POST /api/ports/:id/release
 * Release a port allocation
 */
router.post("/:id/release", async (req: Request, res: Response) => {
  try {
    ensurePortsTable();
    const db = getDatabase();
    const { id } = req.params;

    const allocation = db
      .prepare("SELECT * FROM port_allocations WHERE id = ?")
      .get(id);
    if (!allocation) {
      return res.status(404).json({
        success: false,
        error: "Port allocation not found",
      });
    }

    const now = new Date().toISOString();
    db.prepare(
      "UPDATE port_allocations SET status = 'released', updated_at = ? WHERE id = ?"
    ).run(now, id);

    logger.info(`✅ Released port allocation ${id}`);

    res.json({
      success: true,
      message: "Port released successfully",
    });
  } catch (error) {
    logger.error("❌ Failed to release port:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to release port",
    });
  }
});

/**
 * DELETE /api/ports/:id
 * Delete a port allocation permanently
 */
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    ensurePortsTable();
    const db = getDatabase();
    const { id } = req.params;

    const result = db
      .prepare("DELETE FROM port_allocations WHERE id = ?")
      .run(id);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        error: "Port allocation not found",
      });
    }

    logger.info(`✅ Deleted port allocation ${id}`);

    res.json({
      success: true,
      message: "Port allocation deleted",
    });
  } catch (error) {
    logger.error("❌ Failed to delete port:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete port",
    });
  }
});

/**
 * GET /api/ports/project/:projectId
 * Get all ports for a specific project
 */
router.get("/project/:projectId", async (req: Request, res: Response) => {
  try {
    ensurePortsTable();
    const db = getDatabase();
    const { projectId } = req.params;

    const allocations = db
      .prepare(
        "SELECT * FROM port_allocations WHERE project_id = ? ORDER BY port ASC"
      )
      .all(projectId);

    res.json({
      success: true,
      data: {
        projectId,
        allocations,
        count: allocations.length,
        maxAllowed: PORT_CONFIG.portsPerProject,
      },
    });
  } catch (error) {
    logger.error("❌ Failed to get project ports:", error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to get project ports",
    });
  }
});

export default router;
