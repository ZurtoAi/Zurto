import express, { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../utils/logger.js";
import {
  getFromStore,
  addToStore,
  updateInStore,
  removeFromStore,
  getStore,
} from "../core/database.js";

const router: Router = express.Router();

// ============================================
// TYPES
// ============================================
interface User {
  id: string;
  username: string;
  teamId: string;
  teamToken: string;
  adminToken?: string;
  isAdmin: boolean;
  isTeamLeader: boolean;
  createdAt: string;
  updatedAt: string;
  lastActiveAt?: string;
}

interface Team {
  id: string;
  name: string;
  slug: string;
  description?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

interface Project {
  id: string;
  name: string;
  description?: string;
  teamId: string;
  status: string;
  isDeployed: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface AuditLog {
  id: string;
  teamId: string;
  userId: string;
  username: string;
  action: string;
  resourceType: string;
  resourceId: string;
  details: Record<string, unknown>;
  timestamp: string;
}

// Helper to decode token
function decodeToken(token: string): any {
  try {
    return JSON.parse(Buffer.from(token, "base64").toString());
  } catch {
    return null;
  }
}

// Helper to verify admin
function verifyAdmin(authHeader: string | undefined): User | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.split(" ")[1];
  const payload = decodeToken(token);
  if (!payload || Date.now() > payload.exp) {
    return null;
  }
  const users = getFromStore("users") as User[];
  return users.find((u) => u.id === payload.userId && u.isAdmin) || null;
}

// Helper to add audit log
function addAuditLog(
  teamId: string,
  userId: string,
  username: string,
  action: string,
  resourceType: string,
  resourceId: string,
  details: Record<string, unknown> = {}
) {
  const log: AuditLog = {
    id: uuidv4(),
    teamId,
    userId,
    username,
    action,
    resourceType,
    resourceId,
    details,
    timestamp: new Date().toISOString(),
  };
  addToStore("audit_logs", log);
}

// ============================================
// ADMIN DASHBOARD STATS
// ============================================
router.get("/stats", (req: Request, res: Response) => {
  try {
    const adminUser = verifyAdmin(req.headers.authorization);
    if (!adminUser) {
      return res
        .status(403)
        .json({ success: false, error: "Admin access required" });
    }

    const store = getStore();
    const users = store.users as User[];
    const teams = store.teams as Team[];
    const projects = store.projects as Project[];
    const auditLogs = store.audit_logs as AuditLog[];

    // Calculate stats
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const activeUsersLast24h = users.filter(
      (u) => u.lastActiveAt && new Date(u.lastActiveAt) > last24h
    ).length;

    const loginsLast24h = auditLogs.filter(
      (l) => l.action === "login" && new Date(l.timestamp) > last24h
    ).length;

    const projectsCreatedLast7d = projects.filter(
      (p) => new Date(p.createdAt) > last7d
    ).length;

    res.status(200).json({
      success: true,
      data: {
        totalUsers: users.length,
        totalTeams: teams.length,
        totalProjects: projects.length,
        totalAdmins: users.filter((u) => u.isAdmin).length,
        activeUsersLast24h,
        loginsLast24h,
        projectsCreatedLast7d,
        deployedProjects: projects.filter((p) => p.isDeployed).length,
        auditLogsCount: auditLogs.length,
      },
    });
  } catch (error) {
    logger.error("Admin stats error:", error);
    res.status(500).json({ success: false, error: "Failed to get stats" });
  }
});

// ============================================
// GET ALL TEAMS (with full details)
// ============================================
router.get("/teams", (req: Request, res: Response) => {
  try {
    const adminUser = verifyAdmin(req.headers.authorization);
    if (!adminUser) {
      return res
        .status(403)
        .json({ success: false, error: "Admin access required" });
    }

    const teams = getFromStore("teams") as Team[];
    const users = getFromStore("users") as User[];
    const projects = getFromStore("projects") as Project[];

    const teamsWithDetails = teams.map((team) => {
      const teamMembers = users.filter((u) => u.teamId === team.id);
      const teamProjects = projects.filter((p) => p.teamId === team.id);
      const owner = users.find((u) => u.id === team.ownerId);

      return {
        ...team,
        ownerName: owner?.username || "Unknown",
        memberCount: teamMembers.length,
        projectCount: teamProjects.length,
        members: teamMembers.map((m) => ({
          id: m.id,
          username: m.username,
          isAdmin: m.isAdmin,
          isTeamLeader: m.isTeamLeader,
          lastActiveAt: m.lastActiveAt,
        })),
      };
    });

    res.status(200).json({
      success: true,
      data: teamsWithDetails,
    });
  } catch (error) {
    logger.error("Admin get teams error:", error);
    res.status(500).json({ success: false, error: "Failed to get teams" });
  }
});

// ============================================
// DELETE TEAM
// ============================================
router.delete("/teams/:teamId", (req: Request, res: Response) => {
  try {
    const adminUser = verifyAdmin(req.headers.authorization);
    if (!adminUser) {
      return res
        .status(403)
        .json({ success: false, error: "Admin access required" });
    }

    const { teamId } = req.params;

    // Check if team has members
    const users = getFromStore("users") as User[];
    const teamMembers = users.filter((u) => u.teamId === teamId);

    if (teamMembers.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Cannot delete team with ${teamMembers.length} members. Remove members first.`,
      });
    }

    const deletedTeam = removeFromStore("teams", teamId);
    if (!deletedTeam) {
      return res.status(404).json({ success: false, error: "Team not found" });
    }

    addAuditLog(
      adminUser.teamId,
      adminUser.id,
      adminUser.username,
      "delete_team",
      "team",
      teamId,
      {
        deletedTeamName: (deletedTeam as Team).name,
      }
    );

    res.status(200).json({
      success: true,
      message: "Team deleted",
    });
  } catch (error) {
    logger.error("Admin delete team error:", error);
    res.status(500).json({ success: false, error: "Failed to delete team" });
  }
});

// ============================================
// GET ALL USERS (with tokens for admin)
// ============================================
router.get("/users", (req: Request, res: Response) => {
  try {
    const adminUser = verifyAdmin(req.headers.authorization);
    if (!adminUser) {
      return res
        .status(403)
        .json({ success: false, error: "Admin access required" });
    }

    const users = getFromStore("users") as User[];
    const teams = getFromStore("teams") as Team[];

    const usersWithDetails = users.map((user) => {
      const team = teams.find((t) => t.id === user.teamId);
      return {
        id: user.id,
        username: user.username,
        teamId: user.teamId,
        teamName: team?.name || "Unknown",
        teamToken: user.teamToken,
        adminToken: user.adminToken || null,
        isAdmin: user.isAdmin,
        isTeamLeader: user.isTeamLeader,
        createdAt: user.createdAt,
        lastActiveAt: user.lastActiveAt,
      };
    });

    res.status(200).json({
      success: true,
      data: usersWithDetails,
    });
  } catch (error) {
    logger.error("Admin get users error:", error);
    res.status(500).json({ success: false, error: "Failed to get users" });
  }
});

// ============================================
// GET ALL PROJECTS
// ============================================
router.get("/projects", (req: Request, res: Response) => {
  try {
    const adminUser = verifyAdmin(req.headers.authorization);
    if (!adminUser) {
      return res
        .status(403)
        .json({ success: false, error: "Admin access required" });
    }

    const projects = getFromStore("projects") as Project[];
    const teams = getFromStore("teams") as Team[];
    const users = getFromStore("users") as User[];
    const nodes = getFromStore("nodes") as any[];

    const projectsWithDetails = projects.map((project) => {
      const team = teams.find((t) => t.id === project.teamId);
      const creator = users.find((u) => u.id === project.createdBy);
      const projectNodes = nodes.filter((n) => n.project_id === project.id);

      return {
        ...project,
        teamName: team?.name || "Unknown",
        creatorName: creator?.username || "Unknown",
        nodeCount: projectNodes.length,
      };
    });

    res.status(200).json({
      success: true,
      data: projectsWithDetails,
    });
  } catch (error) {
    logger.error("Admin get projects error:", error);
    res.status(500).json({ success: false, error: "Failed to get projects" });
  }
});

// ============================================
// DELETE PROJECT
// ============================================
router.delete("/projects/:projectId", (req: Request, res: Response) => {
  try {
    const adminUser = verifyAdmin(req.headers.authorization);
    if (!adminUser) {
      return res
        .status(403)
        .json({ success: false, error: "Admin access required" });
    }

    const { projectId } = req.params;

    // Delete project nodes and relationships
    const store = getStore();
    store.nodes = (store.nodes as any[]).filter(
      (n) => n.project_id !== projectId
    );
    store.node_relationships = (store.node_relationships as any[]).filter(
      (r) => r.project_id !== projectId
    );

    const deletedProject = removeFromStore("projects", projectId);
    if (!deletedProject) {
      return res
        .status(404)
        .json({ success: false, error: "Project not found" });
    }

    addAuditLog(
      adminUser.teamId,
      adminUser.id,
      adminUser.username,
      "delete_project",
      "project",
      projectId,
      {
        deletedProjectName: (deletedProject as Project).name,
      }
    );

    res.status(200).json({
      success: true,
      message: "Project and all associated data deleted",
    });
  } catch (error) {
    logger.error("Admin delete project error:", error);
    res.status(500).json({ success: false, error: "Failed to delete project" });
  }
});

// ============================================
// TRANSFER PROJECT TO DIFFERENT TEAM
// ============================================
router.post("/projects/:projectId/transfer", (req: Request, res: Response) => {
  try {
    const adminUser = verifyAdmin(req.headers.authorization);
    if (!adminUser) {
      return res
        .status(403)
        .json({ success: false, error: "Admin access required" });
    }

    const { projectId } = req.params;
    const { newTeamId } = req.body;

    if (!newTeamId) {
      return res
        .status(400)
        .json({ success: false, error: "New team ID required" });
    }

    // Verify new team exists
    const teams = getFromStore("teams") as Team[];
    const newTeam = teams.find((t) => t.id === newTeamId);
    if (!newTeam) {
      return res
        .status(404)
        .json({ success: false, error: "Target team not found" });
    }

    const updatedProject = updateInStore("projects", projectId, {
      teamId: newTeamId,
      updatedAt: new Date().toISOString(),
    });

    if (!updatedProject) {
      return res
        .status(404)
        .json({ success: false, error: "Project not found" });
    }

    addAuditLog(
      adminUser.teamId,
      adminUser.id,
      adminUser.username,
      "transfer_project",
      "project",
      projectId,
      {
        newTeamId,
        newTeamName: newTeam.name,
      }
    );

    res.status(200).json({
      success: true,
      data: updatedProject,
    });
  } catch (error) {
    logger.error("Admin transfer project error:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to transfer project" });
  }
});

// ============================================
// GET AUDIT LOGS (filtered)
// ============================================
router.get("/audit-logs", (req: Request, res: Response) => {
  try {
    const adminUser = verifyAdmin(req.headers.authorization);
    if (!adminUser) {
      return res
        .status(403)
        .json({ success: false, error: "Admin access required" });
    }

    const {
      teamId,
      userId,
      action,
      resourceType,
      limit = 100,
      offset = 0,
    } = req.query;
    let logs = getFromStore("audit_logs") as AuditLog[];

    // Apply filters
    if (teamId) logs = logs.filter((l) => l.teamId === teamId);
    if (userId) logs = logs.filter((l) => l.userId === userId);
    if (action) logs = logs.filter((l) => l.action === action);
    if (resourceType)
      logs = logs.filter((l) => l.resourceType === resourceType);

    // Sort by timestamp desc
    logs = logs.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    const total = logs.length;
    const paginatedLogs = logs.slice(
      Number(offset),
      Number(offset) + Number(limit)
    );

    res.status(200).json({
      success: true,
      data: paginatedLogs,
      pagination: {
        total,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: Number(offset) + paginatedLogs.length < total,
      },
    });
  } catch (error) {
    logger.error("Admin get audit logs error:", error);
    res.status(500).json({ success: false, error: "Failed to get audit logs" });
  }
});

// ============================================
// SYSTEM SETTINGS
// ============================================
router.get("/settings", (req: Request, res: Response) => {
  try {
    const adminUser = verifyAdmin(req.headers.authorization);
    if (!adminUser) {
      return res
        .status(403)
        .json({ success: false, error: "Admin access required" });
    }

    // Return system settings (could be stored in database later)
    res.status(200).json({
      success: true,
      data: {
        allowPublicRegistration: false,
        requireAdminApproval: true,
        maxProjectsPerTeam: 50,
        maxUsersPerTeam: 100,
        auditLogRetentionDays: 90,
        sessionTimeoutMinutes: 1440, // 24 hours
        version: "3.0.0",
        environment: process.env.NODE_ENV || "development",
      },
    });
  } catch (error) {
    logger.error("Admin get settings error:", error);
    res.status(500).json({ success: false, error: "Failed to get settings" });
  }
});

// ============================================
// MAKE USER TEAM LEADER
// ============================================
router.post(
  "/users/:userId/make-team-leader",
  (req: Request, res: Response) => {
    try {
      const adminUser = verifyAdmin(req.headers.authorization);
      if (!adminUser) {
        return res
          .status(403)
          .json({ success: false, error: "Admin access required" });
      }

      const { userId } = req.params;

      const users = getFromStore("users") as User[];
      const targetUser = users.find((u) => u.id === userId);

      if (!targetUser) {
        return res
          .status(404)
          .json({ success: false, error: "User not found" });
      }

      // Remove team leader status from current team leader
      const currentLeaders = users.filter(
        (u) => u.teamId === targetUser.teamId && u.isTeamLeader
      );
      currentLeaders.forEach((leader) => {
        updateInStore("users", leader.id, { isTeamLeader: false });
      });

      // Make target user team leader
      const updatedUser = updateInStore("users", userId, {
        isTeamLeader: true,
        updatedAt: new Date().toISOString(),
      });

      // Update team owner
      updateInStore("teams", targetUser.teamId, {
        ownerId: userId,
        updatedAt: new Date().toISOString(),
      });

      addAuditLog(
        adminUser.teamId,
        adminUser.id,
        adminUser.username,
        "make_team_leader",
        "user",
        userId,
        {
          newLeaderUsername: targetUser.username,
          teamId: targetUser.teamId,
        }
      );

      res.status(200).json({
        success: true,
        data: updatedUser,
      });
    } catch (error) {
      logger.error("Admin make team leader error:", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to update team leader" });
    }
  }
);

// ============================================
// REGENERATE ADMIN TOKEN
// ============================================
router.post(
  "/users/:userId/regenerate-admin-token",
  (req: Request, res: Response) => {
    try {
      const adminUser = verifyAdmin(req.headers.authorization);
      if (!adminUser) {
        return res
          .status(403)
          .json({ success: false, error: "Admin access required" });
      }

      const { userId } = req.params;

      const users = getFromStore("users") as User[];
      const targetUser = users.find((u) => u.id === userId);

      if (!targetUser) {
        return res
          .status(404)
          .json({ success: false, error: "User not found" });
      }

      if (!targetUser.isAdmin) {
        return res
          .status(400)
          .json({ success: false, error: "User is not an admin" });
      }

      const newAdminToken = `ADMIN-${uuidv4().substring(0, 12).toUpperCase()}`;
      updateInStore("users", userId, {
        adminToken: newAdminToken,
        updatedAt: new Date().toISOString(),
      });

      addAuditLog(
        adminUser.teamId,
        adminUser.id,
        adminUser.username,
        "regenerate_admin_token",
        "user",
        userId,
        {
          targetUsername: targetUser.username,
        }
      );

      res.status(200).json({
        success: true,
        data: {
          userId,
          username: targetUser.username,
          newAdminToken,
        },
      });
    } catch (error) {
      logger.error("Admin regenerate admin token error:", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to regenerate admin token" });
    }
  }
);

export default router;
