/**
 * Domains Routes
 *
 * Manage custom domains and subdomain hosting
 * Format: {teamname}-{projectname}.host.zurto.app
 */

import express, { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../utils/logger.js";
import {
  getFromStore,
  addToStore,
  updateInStore,
  removeFromStore,
} from "../core/database.js";

const router: Router = express.Router();

// Types
interface Domain {
  id: string;
  teamId: string;
  projectId?: string;
  domain: string;
  subdomain?: string;
  type: "primary" | "subdomain" | "custom";
  status: "pending" | "verified" | "active" | "failed";
  sslEnabled: boolean;
  verificationToken?: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  username: string;
  teamId: string;
  isAdmin: boolean;
}

interface Team {
  id: string;
  name: string;
  slug: string;
}

interface Project {
  id: string;
  name: string;
  teamId: string;
}

// Helper to decode token
function decodeToken(token: string): any {
  try {
    return JSON.parse(Buffer.from(token, "base64").toString());
  } catch {
    return null;
  }
}

// Helper to get user from auth header
function getUserFromAuth(authHeader: string | undefined): User | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.split(" ")[1];
  const payload = decodeToken(token);
  if (!payload || Date.now() > payload.exp) {
    return null;
  }
  const users = getFromStore("users") as User[];
  return users.find((u) => u.id === payload.userId) || null;
}

// Generate subdomain from team and project name
function generateSubdomain(teamName: string, projectName: string): string {
  const cleanTeam = teamName.toLowerCase().replace(/[^a-z0-9]/g, "");
  const cleanProject = projectName.toLowerCase().replace(/[^a-z0-9]/g, "");
  return `${cleanTeam}-${cleanProject}`;
}

// ============================================
// GET /api/domains - List all domains for team
// ============================================
router.get("/", (req: Request, res: Response) => {
  try {
    const user = getUserFromAuth(req.headers.authorization);
    const teamId = user?.teamId || "default";

    const allDomains = getFromStore("domains") as Domain[];
    const domains = allDomains.filter((d) => d.teamId === teamId);

    // Sort by createdAt descending
    domains.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    res.json({
      success: true,
      data: {
        domains,
        hosting: {
          baseUrl: "host.zurto.app",
          format: "{teamname}-{projectname}",
        },
      },
    });
  } catch (error: any) {
    logger.error("Error fetching domains:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch domains",
    });
  }
});

// ============================================
// POST /api/domains/subdomain - Create subdomain
// ============================================
router.post("/subdomain", (req: Request, res: Response) => {
  try {
    const user = getUserFromAuth(req.headers.authorization);
    const teamId = user?.teamId || "default";
    const { projectId, subdomain: customSubdomain } = req.body;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        error: "projectId is required",
      });
    }

    // Get project info
    const projects = getFromStore("projects") as Project[];
    const project = projects.find((p) => p.id === projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: "Project not found",
      });
    }

    // Get team info
    const teams = getFromStore("teams") as Team[];
    const team = teams.find((t) => t.id === teamId);
    const teamName = team?.name || teamId;

    // Generate subdomain
    const subdomain =
      customSubdomain || generateSubdomain(teamName, project.name);
    const fullDomain = `${subdomain}.host.zurto.app`;

    // Check if subdomain already exists
    const domains = getFromStore("domains") as Domain[];
    const existing = domains.find((d) => d.domain === fullDomain);

    if (existing) {
      return res.status(409).json({
        success: false,
        error: "Subdomain already exists",
        data: { existingDomain: fullDomain },
      });
    }

    // Create domain record
    const now = new Date().toISOString();
    const newDomain: Domain = {
      id: uuidv4(),
      teamId,
      projectId,
      domain: fullDomain,
      subdomain,
      type: "subdomain",
      status: "active",
      sslEnabled: true,
      createdAt: now,
      updatedAt: now,
    };

    addToStore("domains", newDomain);
    logger.info(`Created subdomain: ${fullDomain} for project ${projectId}`);

    res.json({
      success: true,
      data: {
        id: newDomain.id,
        domain: fullDomain,
        subdomain,
        type: "subdomain",
        status: "active",
        sslEnabled: true,
        url: `https://${fullDomain}`,
      },
    });
  } catch (error: any) {
    logger.error("Error creating subdomain:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to create subdomain",
    });
  }
});

// ============================================
// POST /api/domains/custom - Add custom domain
// ============================================
router.post("/custom", (req: Request, res: Response) => {
  try {
    const user = getUserFromAuth(req.headers.authorization);
    const teamId = user?.teamId || "default";
    const { domain, projectId } = req.body;

    if (!domain) {
      return res.status(400).json({
        success: false,
        error: "domain is required",
      });
    }

    // Validate domain format
    const domainRegex =
      /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domain)) {
      return res.status(400).json({
        success: false,
        error: "Invalid domain format",
      });
    }

    // Check if domain already exists
    const domains = getFromStore("domains") as Domain[];
    const existing = domains.find((d) => d.domain === domain);

    if (existing) {
      return res.status(409).json({
        success: false,
        error: "Domain already registered",
      });
    }

    // Create domain record (pending verification)
    const verificationToken = `zurto-verify-${uuidv4().substring(0, 12)}`;
    const now = new Date().toISOString();

    const newDomain: Domain = {
      id: uuidv4(),
      teamId,
      projectId: projectId || undefined,
      domain,
      type: "custom",
      status: "pending",
      sslEnabled: false,
      verificationToken,
      createdAt: now,
      updatedAt: now,
    };

    addToStore("domains", newDomain);
    logger.info(`Added custom domain: ${domain} (pending verification)`);

    res.json({
      success: true,
      data: {
        id: newDomain.id,
        domain,
        type: "custom",
        status: "pending",
        verification: {
          type: "DNS_TXT",
          name: "_zurto-verification",
          value: verificationToken,
          instructions:
            "Add a TXT record to your DNS with the above name and value",
        },
      },
    });
  } catch (error: any) {
    logger.error("Error adding custom domain:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to add custom domain",
    });
  }
});

// ============================================
// POST /api/domains/:id/verify - Verify domain
// ============================================
router.post("/:id/verify", (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const domains = getFromStore("domains") as Domain[];
    const domain = domains.find((d) => d.id === id);

    if (!domain) {
      return res.status(404).json({
        success: false,
        error: "Domain not found",
      });
    }

    // In production, this would check DNS records
    // For now, we'll simulate verification
    updateInStore("domains", id, {
      status: "verified",
      sslEnabled: true,
      updatedAt: new Date().toISOString(),
    });

    logger.info(`Verified domain: ${domain.domain}`);

    res.json({
      success: true,
      data: {
        id,
        domain: domain.domain,
        status: "verified",
        sslEnabled: true,
        message: "Domain verified successfully",
      },
    });
  } catch (error: any) {
    logger.error("Error verifying domain:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to verify domain",
    });
  }
});

// ============================================
// DELETE /api/domains/:id - Remove domain
// ============================================
router.delete("/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = getUserFromAuth(req.headers.authorization);
    const teamId = user?.teamId || "default";

    const domains = getFromStore("domains") as Domain[];
    const domain = domains.find((d) => d.id === id && d.teamId === teamId);

    if (!domain) {
      return res.status(404).json({
        success: false,
        error: "Domain not found",
      });
    }

    removeFromStore("domains", id);
    logger.info(`Removed domain: ${domain.domain}`);

    res.json({
      success: true,
      data: {
        message: "Domain removed successfully",
      },
    });
  } catch (error: any) {
    logger.error("Error removing domain:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to remove domain",
    });
  }
});

// ============================================
// GET /api/domains/available/:subdomain - Check availability
// ============================================
router.get("/available/:subdomain", (req: Request, res: Response) => {
  try {
    const { subdomain } = req.params;
    const fullDomain = `${subdomain}.host.zurto.app`;

    const domains = getFromStore("domains") as Domain[];
    const existing = domains.find((d) => d.domain === fullDomain);

    res.json({
      success: true,
      data: {
        subdomain,
        fullDomain,
        available: !existing,
      },
    });
  } catch (error: any) {
    logger.error("Error checking availability:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to check availability",
    });
  }
});

// ============================================
// GET /api/domains/:id - Get domain details
// ============================================
router.get("/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const domains = getFromStore("domains") as Domain[];
    const domain = domains.find((d) => d.id === id);

    if (!domain) {
      return res.status(404).json({
        success: false,
        error: "Domain not found",
      });
    }

    res.json({
      success: true,
      data: domain,
    });
  } catch (error: any) {
    logger.error("Error fetching domain:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch domain",
    });
  }
});

// ============================================
// PATCH /api/domains/:id - Update domain
// ============================================
router.patch("/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = getUserFromAuth(req.headers.authorization);
    const teamId = user?.teamId || "default";
    const { projectId, status } = req.body;

    const domains = getFromStore("domains") as Domain[];
    const domain = domains.find((d) => d.id === id && d.teamId === teamId);

    if (!domain) {
      return res.status(404).json({
        success: false,
        error: "Domain not found",
      });
    }

    const updates: Partial<Domain> = {
      updatedAt: new Date().toISOString(),
    };

    if (projectId !== undefined) {
      updates.projectId = projectId;
    }

    if (
      status &&
      ["pending", "verified", "active", "failed"].includes(status)
    ) {
      updates.status = status;
    }

    updateInStore("domains", id, updates);
    logger.info(`Updated domain: ${domain.domain}`);

    res.json({
      success: true,
      data: {
        ...domain,
        ...updates,
      },
    });
  } catch (error: any) {
    logger.error("Error updating domain:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to update domain",
    });
  }
});

export default router;
