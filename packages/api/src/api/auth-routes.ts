import express, { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../utils/logger.js";
import {
  addToStore,
  getFromStore,
  updateInStore,
  removeFromStore,
} from "../core/database.js";

const router: Router = express.Router();

// ============================================
// TOKEN MANAGEMENT
// ============================================
const ACCESS_TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
const REFRESH_TOKEN_EXPIRY = 30 * 24 * 60 * 60 * 1000; // 30 days

interface TokenPayload {
  userId: string;
  username: string;
  teamId: string;
  isAdmin: boolean;
  isTeamLeader: boolean;
  exp: number;
}

interface RefreshToken {
  id: string;
  token: string;
  userId: string;
  expiresAt: string;
  createdAt: string;
}

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

function generateToken(
  payload: Omit<TokenPayload, "exp">,
  expiryMs: number
): string {
  const tokenPayload: TokenPayload = {
    ...payload,
    exp: Date.now() + expiryMs,
  };
  return Buffer.from(JSON.stringify(tokenPayload)).toString("base64");
}

function decodeToken(token: string): TokenPayload | null {
  try {
    const payload = JSON.parse(Buffer.from(token, "base64").toString());
    return payload as TokenPayload;
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const payload = decodeToken(token);
  if (!payload) return true;
  return Date.now() > payload.exp;
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
// LOGIN (username + teamToken)
// ============================================
router.post("/login", (req: Request, res: Response) => {
  try {
    const { username, teamToken } = req.body;

    if (!username || !teamToken) {
      return res.status(400).json({
        success: false,
        error: "Username and team token required",
      });
    }

    const users = getFromStore("users") as User[];
    const user = users.find(
      (u) =>
        u.username.toLowerCase() === username.toLowerCase() &&
        u.teamToken === teamToken
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid username or team token",
      });
    }

    const teams = getFromStore("teams") as Team[];
    const team = teams.find((t) => t.id === user.teamId);

    // Update last active
    updateInStore("users", user.id, { lastActiveAt: new Date().toISOString() });

    // Generate tokens
    const tokenPayload = {
      userId: user.id,
      username: user.username,
      teamId: user.teamId,
      isAdmin: user.isAdmin,
      isTeamLeader: user.isTeamLeader,
    };

    const accessToken = generateToken(tokenPayload, ACCESS_TOKEN_EXPIRY);
    const refreshToken = uuidv4();

    // Store refresh token
    const refreshTokenData: RefreshToken = {
      id: uuidv4(),
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY).toISOString(),
      createdAt: new Date().toISOString(),
    };
    addToStore("refresh_tokens", refreshTokenData);

    // Audit log
    addAuditLog(user.teamId, user.id, user.username, "login", "user", user.id, {
      ip: req.ip,
    });

    logger.info(`✅ User logged in: ${user.username}`);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          teamId: user.teamId,
          teamName: team?.name,
          isAdmin: user.isAdmin,
          isTeamLeader: user.isTeamLeader,
        },
        accessToken,
        refreshToken,
        expiresIn: ACCESS_TOKEN_EXPIRY / 1000,
      },
    });
  } catch (error) {
    logger.error("Login error:", error);
    res.status(500).json({ success: false, error: "Login failed" });
  }
});

// ============================================
// ADMIN LOGIN (adminToken verification)
// ============================================
router.post("/admin/verify", (req: Request, res: Response) => {
  try {
    const { adminToken } = req.body;
    const authHeader = req.headers.authorization;

    if (!adminToken) {
      return res.status(400).json({
        success: false,
        error: "Admin token required",
      });
    }

    // Get current user from access token
    let currentUserId: string | null = null;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const payload = decodeToken(token);
      if (payload && !isTokenExpired(token)) {
        currentUserId = payload.userId;
      }
    }

    const users = getFromStore("users") as User[];
    const adminUser = users.find((u) => u.adminToken === adminToken);

    if (!adminUser) {
      return res.status(401).json({
        success: false,
        error: "Invalid admin token",
      });
    }

    // Verify the admin token belongs to current user if logged in
    if (currentUserId && adminUser.id !== currentUserId) {
      return res.status(403).json({
        success: false,
        error: "Admin token does not match logged in user",
      });
    }

    // Audit log
    addAuditLog(
      adminUser.teamId,
      adminUser.id,
      adminUser.username,
      "admin_login",
      "admin",
      "admin-panel",
      {}
    );

    logger.info(`🛡️ Admin verified: ${adminUser.username}`);

    res.status(200).json({
      success: true,
      data: {
        verified: true,
        username: adminUser.username,
      },
    });
  } catch (error) {
    logger.error("Admin verify error:", error);
    res
      .status(500)
      .json({ success: false, error: "Admin verification failed" });
  }
});

// ============================================
// TOKEN REFRESH
// ============================================
router.post("/refresh", (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: "Refresh token required",
      });
    }

    const refreshTokens = getFromStore("refresh_tokens") as RefreshToken[];
    const storedToken = refreshTokens.find((t) => t.token === refreshToken);

    if (!storedToken) {
      return res.status(401).json({
        success: false,
        error: "Invalid refresh token",
      });
    }

    if (new Date(storedToken.expiresAt) < new Date()) {
      return res.status(401).json({
        success: false,
        error: "Refresh token expired",
      });
    }

    const users = getFromStore("users") as User[];
    const user = users.find((u) => u.id === storedToken.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "User not found",
      });
    }

    const tokenPayload = {
      userId: user.id,
      username: user.username,
      teamId: user.teamId,
      isAdmin: user.isAdmin,
      isTeamLeader: user.isTeamLeader,
    };

    const newAccessToken = generateToken(tokenPayload, ACCESS_TOKEN_EXPIRY);

    res.status(200).json({
      success: true,
      data: {
        accessToken: newAccessToken,
        expiresIn: ACCESS_TOKEN_EXPIRY / 1000,
      },
    });
  } catch (error) {
    logger.error("Refresh error:", error);
    res.status(500).json({ success: false, error: "Token refresh failed" });
  }
});

// ============================================
// LOGOUT
// ============================================
router.post("/logout", (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      removeFromStore("refresh_tokens", refreshToken);
    }

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    logger.error("Logout error:", error);
    res.status(500).json({ success: false, error: "Logout failed" });
  }
});

// ============================================
// VERIFY TOKEN
// ============================================
router.get("/verify", (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    if (isTokenExpired(token)) {
      return res.status(401).json({
        success: false,
        error: "Token expired",
        code: "TOKEN_EXPIRED",
      });
    }

    const payload = decodeToken(token);

    res.status(200).json({
      success: true,
      data: {
        userId: payload?.userId,
        username: payload?.username,
        teamId: payload?.teamId,
        isAdmin: payload?.isAdmin,
        isTeamLeader: payload?.isTeamLeader,
        expiresAt: payload?.exp,
      },
    });
  } catch (error) {
    logger.error("Verify error:", error);
    res
      .status(500)
      .json({ success: false, error: "Token verification failed" });
  }
});

// ============================================
// GET CURRENT USER
// ============================================
router.get("/me", (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];
    if (isTokenExpired(token)) {
      return res.status(401).json({ success: false, error: "Token expired" });
    }

    const payload = decodeToken(token);
    if (!payload) {
      return res.status(401).json({ success: false, error: "Invalid token" });
    }

    const users = getFromStore("users") as User[];
    const user = users.find((u) => u.id === payload.userId);

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const teams = getFromStore("teams") as Team[];
    const team = teams.find((t) => t.id === user.teamId);

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        teamId: user.teamId,
        teamName: team?.name,
        teamToken: user.teamToken,
        adminToken: user.adminToken,
        isAdmin: user.isAdmin,
        isTeamLeader: user.isTeamLeader,
        createdAt: user.createdAt,
        lastActiveAt: user.lastActiveAt,
      },
    });
  } catch (error) {
    logger.error("Get me error:", error);
    res.status(500).json({ success: false, error: "Failed to get user" });
  }
});

// ============================================
// GET ALL TEAMS (admin only)
// ============================================
router.get("/teams", (req: Request, res: Response) => {
  try {
    const teams = getFromStore("teams") as Team[];
    const users = getFromStore("users") as User[];
    const projects = getFromStore("projects") as any[];

    const teamsWithStats = teams.map((team) => ({
      ...team,
      memberCount: users.filter((u) => u.teamId === team.id).length,
      projectCount: projects.filter((p) => p.teamId === team.id).length,
    }));

    res.status(200).json({
      success: true,
      data: teamsWithStats,
    });
  } catch (error) {
    logger.error("Get teams error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch teams" });
  }
});

// ============================================
// GET TEAM BY ID
// ============================================
router.get("/teams/:teamId", (req: Request, res: Response) => {
  try {
    const { teamId } = req.params;
    const teams = getFromStore("teams") as Team[];
    const team = teams.find((t) => t.id === teamId);

    if (!team) {
      return res.status(404).json({ success: false, error: "Team not found" });
    }

    const users = getFromStore("users") as User[];
    const teamMembers = users.filter((u) => u.teamId === teamId);

    res.status(200).json({
      success: true,
      data: {
        ...team,
        members: teamMembers.map((u) => ({
          id: u.id,
          username: u.username,
          isAdmin: u.isAdmin,
          isTeamLeader: u.isTeamLeader,
          createdAt: u.createdAt,
          lastActiveAt: u.lastActiveAt,
        })),
      },
    });
  } catch (error) {
    logger.error("Get team error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch team" });
  }
});

// ============================================
// CREATE TEAM (admin only)
// ============================================
router.post("/teams", (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const authHeader = req.headers.authorization;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, error: "Team name required" });
    }

    // Verify admin
    let adminUser: User | null = null;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const payload = decodeToken(token);
      if (payload && !isTokenExpired(token)) {
        const users = getFromStore("users") as User[];
        adminUser =
          users.find((u) => u.id === payload.userId && u.isAdmin) || null;
      }
    }

    if (!adminUser) {
      return res
        .status(403)
        .json({ success: false, error: "Admin access required" });
    }

    const team: Team = {
      id: "team-" + uuidv4().substring(0, 8),
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      description,
      ownerId: adminUser.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addToStore("teams", team);
    addAuditLog(
      adminUser.teamId,
      adminUser.id,
      adminUser.username,
      "create_team",
      "team",
      team.id,
      { teamName: name }
    );

    logger.info(`✅ Team created: ${team.name}`);

    res.status(201).json({
      success: true,
      data: team,
    });
  } catch (error) {
    logger.error("Create team error:", error);
    res.status(500).json({ success: false, error: "Failed to create team" });
  }
});

// ============================================
// CREATE USER (admin only)
// ============================================
router.post("/users", (req: Request, res: Response) => {
  try {
    const { username, teamId, makeAdmin } = req.body;
    const authHeader = req.headers.authorization;

    if (!username || !teamId) {
      return res
        .status(400)
        .json({ success: false, error: "Username and team ID required" });
    }

    // Verify admin
    let adminUser: User | null = null;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const payload = decodeToken(token);
      if (payload && !isTokenExpired(token)) {
        const users = getFromStore("users") as User[];
        adminUser =
          users.find((u) => u.id === payload.userId && u.isAdmin) || null;
      }
    }

    if (!adminUser) {
      return res
        .status(403)
        .json({ success: false, error: "Admin access required" });
    }

    // Verify team exists
    const teams = getFromStore("teams") as Team[];
    const team = teams.find((t) => t.id === teamId);
    if (!team) {
      return res.status(404).json({ success: false, error: "Team not found" });
    }

    // Check username uniqueness
    const existingUsers = getFromStore("users") as User[];
    if (
      existingUsers.find(
        (u) => u.username.toLowerCase() === username.toLowerCase()
      )
    ) {
      return res
        .status(400)
        .json({ success: false, error: "Username already exists" });
    }

    // Generate tokens
    const teamSlug = team.slug.toUpperCase().substring(0, 4);
    const teamToken = `${teamSlug}-${uuidv4().substring(0, 8).toUpperCase()}`;
    const adminToken = makeAdmin
      ? `ADMIN-${uuidv4().substring(0, 12).toUpperCase()}`
      : undefined;

    const newUser: User = {
      id: "user-" + uuidv4().substring(0, 8),
      username,
      teamId,
      teamToken,
      adminToken,
      isAdmin: !!makeAdmin,
      isTeamLeader: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addToStore("users", newUser);
    addAuditLog(
      adminUser.teamId,
      adminUser.id,
      adminUser.username,
      "create_user",
      "user",
      newUser.id,
      {
        newUsername: username,
        newTeamId: teamId,
        isAdmin: !!makeAdmin,
      }
    );

    logger.info(`✅ User created: ${username} (Team: ${team.name})`);

    res.status(201).json({
      success: true,
      data: {
        id: newUser.id,
        username: newUser.username,
        teamId: newUser.teamId,
        teamName: team.name,
        teamToken: newUser.teamToken,
        adminToken: newUser.adminToken,
        isAdmin: newUser.isAdmin,
      },
    });
  } catch (error) {
    logger.error("Create user error:", error);
    res.status(500).json({ success: false, error: "Failed to create user" });
  }
});

// ============================================
// GET ALL USERS (admin only)
// ============================================
router.get("/users", (req: Request, res: Response) => {
  try {
    const users = getFromStore("users") as User[];
    const teams = getFromStore("teams") as Team[];

    const usersWithTeams = users.map((user) => {
      const team = teams.find((t) => t.id === user.teamId);
      return {
        id: user.id,
        username: user.username,
        teamId: user.teamId,
        teamName: team?.name || "Unknown",
        teamToken: user.teamToken,
        adminToken: user.adminToken,
        isAdmin: user.isAdmin,
        isTeamLeader: user.isTeamLeader,
        createdAt: user.createdAt,
        lastActiveAt: user.lastActiveAt,
      };
    });

    res.status(200).json({
      success: true,
      data: usersWithTeams,
    });
  } catch (error) {
    logger.error("Get users error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch users" });
  }
});

// ============================================
// UPDATE USER (admin only)
// ============================================
router.patch("/users/:userId", (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { username, teamId, makeAdmin, removeAdmin } = req.body;
    const authHeader = req.headers.authorization;

    // Verify admin
    let adminUser: User | null = null;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const payload = decodeToken(token);
      if (payload && !isTokenExpired(token)) {
        const users = getFromStore("users") as User[];
        adminUser =
          users.find((u) => u.id === payload.userId && u.isAdmin) || null;
      }
    }

    if (!adminUser) {
      return res
        .status(403)
        .json({ success: false, error: "Admin access required" });
    }

    const updates: Partial<User> = { updatedAt: new Date().toISOString() };
    if (username) updates.username = username;
    if (teamId) updates.teamId = teamId;
    if (makeAdmin) {
      updates.isAdmin = true;
      updates.adminToken = `ADMIN-${uuidv4().substring(0, 12).toUpperCase()}`;
    }
    if (removeAdmin) {
      updates.isAdmin = false;
      updates.adminToken = undefined;
    }

    const updatedUser = updateInStore("users", userId, updates);

    if (!updatedUser) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    addAuditLog(
      adminUser.teamId,
      adminUser.id,
      adminUser.username,
      "update_user",
      "user",
      userId,
      updates
    );

    res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    logger.error("Update user error:", error);
    res.status(500).json({ success: false, error: "Failed to update user" });
  }
});

// ============================================
// DELETE USER (admin only)
// ============================================
router.delete("/users/:userId", (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const authHeader = req.headers.authorization;

    // Verify admin
    let adminUser: User | null = null;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const payload = decodeToken(token);
      if (payload && !isTokenExpired(token)) {
        const users = getFromStore("users") as User[];
        adminUser =
          users.find((u) => u.id === payload.userId && u.isAdmin) || null;
      }
    }

    if (!adminUser) {
      return res
        .status(403)
        .json({ success: false, error: "Admin access required" });
    }

    // Prevent self-deletion
    if (adminUser.id === userId) {
      return res
        .status(400)
        .json({ success: false, error: "Cannot delete yourself" });
    }

    const deletedUser = removeFromStore("users", userId);

    if (!deletedUser) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    addAuditLog(
      adminUser.teamId,
      adminUser.id,
      adminUser.username,
      "delete_user",
      "user",
      userId,
      {
        deletedUsername: (deletedUser as User).username,
      }
    );

    res.status(200).json({
      success: true,
      message: "User deleted",
    });
  } catch (error) {
    logger.error("Delete user error:", error);
    res.status(500).json({ success: false, error: "Failed to delete user" });
  }
});

// ============================================
// GET AUDIT LOGS
// ============================================
router.get("/audit-logs", (req: Request, res: Response) => {
  try {
    const { teamId, limit = 100, action, resourceType } = req.query;
    let logs = getFromStore("audit_logs") as AuditLog[];

    if (teamId) {
      logs = logs.filter((l) => l.teamId === teamId);
    }
    if (action) {
      logs = logs.filter((l) => l.action === action);
    }
    if (resourceType) {
      logs = logs.filter((l) => l.resourceType === resourceType);
    }

    // Sort by timestamp desc and limit
    logs = logs
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, Number(limit));

    res.status(200).json({
      success: true,
      data: logs,
    });
  } catch (error) {
    logger.error("Get audit logs error:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch audit logs" });
  }
});

// ============================================
// REGENERATE TEAM TOKEN (admin only)
// ============================================
router.post(
  "/users/:userId/regenerate-team-token",
  (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const authHeader = req.headers.authorization;

      // Verify admin
      let adminUser: User | null = null;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        const payload = decodeToken(token);
        if (payload && !isTokenExpired(token)) {
          const users = getFromStore("users") as User[];
          adminUser =
            users.find((u) => u.id === payload.userId && u.isAdmin) || null;
        }
      }

      if (!adminUser) {
        return res
          .status(403)
          .json({ success: false, error: "Admin access required" });
      }

      const users = getFromStore("users") as User[];
      const user = users.find((u) => u.id === userId);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, error: "User not found" });
      }

      const teams = getFromStore("teams") as Team[];
      const team = teams.find((t) => t.id === user.teamId);
      const teamSlug = team?.slug.toUpperCase().substring(0, 4) || "TEAM";
      const newTeamToken = `${teamSlug}-${uuidv4().substring(0, 8).toUpperCase()}`;

      updateInStore("users", userId, {
        teamToken: newTeamToken,
        updatedAt: new Date().toISOString(),
      });

      addAuditLog(
        adminUser.teamId,
        adminUser.id,
        adminUser.username,
        "regenerate_team_token",
        "user",
        userId,
        {
          targetUsername: user.username,
        }
      );

      res.status(200).json({
        success: true,
        data: {
          userId,
          username: user.username,
          newTeamToken,
        },
      });
    } catch (error) {
      logger.error("Regenerate team token error:", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to regenerate token" });
    }
  }
);

export default router;
