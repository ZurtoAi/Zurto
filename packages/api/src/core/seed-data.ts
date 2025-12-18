import { v4 as uuidv4 } from "uuid";
import { getStore } from "./database.js";
import { logger } from "../utils/logger.js";

/**
 * Seed data for Zurto V3
 * Creates the initial admin user (LeeLoo), Management team, and sample project
 */

export function seedDatabase() {
  const store = getStore();

  // ============================================
  // WIPE ALL EXISTING DATA
  // ============================================
  store.users = [];
  store.teams = [];
  store.projects = [];
  store.nodes = [];
  store.node_relationships = [];
  store.audit_logs = [];
  store.refresh_tokens = [];
  store.team_members = [];
  store.team_invitations = [];

  logger.info("🗑️ Wiped all existing data");

  const now = new Date().toISOString();

  // ============================================
  // CREATE MANAGEMENT TEAM
  // ============================================
  const managementTeamId = "team-management";

  const managementTeam = {
    id: managementTeamId,
    name: "Management",
    slug: "management",
    description: "Main administration team for Zurto platform",
    ownerId: "user-leeloo",
    createdAt: now,
    updatedAt: now,
  };

  store.teams.push(managementTeam);
  logger.info("✅ Created Management team");

  // ============================================
  // CREATE LEELOO ADMIN USER
  // ============================================
  const leelooTeamToken = "MGMT-" + uuidv4().substring(0, 8).toUpperCase();
  const leelooAdminToken = "ADMIN-" + uuidv4().substring(0, 12).toUpperCase();

  const leelooUser = {
    id: "user-leeloo",
    username: "LeeLoo",
    teamId: managementTeamId,
    teamToken: leelooTeamToken,
    adminToken: leelooAdminToken,
    isAdmin: true,
    isTeamLeader: true,
    createdAt: now,
    updatedAt: now,
    lastActiveAt: now,
  };

  store.users.push(leelooUser);
  logger.info("✅ Created LeeLoo admin user");
  logger.info(`   📌 Username: LeeLoo`);
  logger.info(`   🔑 Team Token: ${leelooTeamToken}`);
  logger.info(`   🛡️ Admin Token: ${leelooAdminToken}`);

  // ============================================
  // SHINRAI.LOL-V2 PROJECT (attached to Management team)
  // ============================================
  const shinraiProjectId = "shinrai-lol-v2";

  const shinraiProject = {
    id: shinraiProjectId,
    name: "Shinrai.lol V2",
    description:
      "Gaming community website with Discord integration, e-commerce, and supplier management system",
    teamId: managementTeamId,
    status: "active" as const,
    isDeployed: false,
    createdAt: now,
    updatedAt: now,
    createdBy: "user-leeloo",
  };

  (store.projects as any[]).push(shinraiProject);
  logger.info(
    "✅ Created Shinrai.lol V2 project (attached to Management team)"
  );

  // ============================================
  // SHINRAI NODES (Main Docker containers only)
  // ============================================
  const shinraiNodes = [
    {
      id: "shinrai-planning",
      project_id: shinraiProjectId,
      label: "Shinrai.lol V2",
      type: "utility",
      utility_type: "planning",
      status: "running",
      description:
        "Gaming community website with Discord integration and e-commerce",
      port: null,
      isVisualOnly: false,
      created_at: now,
      updated_at: now,
    },
    {
      id: "shinrai-backend",
      project_id: shinraiProjectId,
      label: "Backend API",
      type: "server",
      server_type: "backend",
      status: "running",
      description: "Express.js REST API with TypeScript",
      port: 3002,
      isVisualOnly: false,
      created_at: now,
      updated_at: now,
    },
    {
      id: "shinrai-frontend",
      project_id: shinraiProjectId,
      label: "Frontend",
      type: "server",
      server_type: "web",
      status: "running",
      description: "React/Vite frontend application",
      port: 5173,
      isVisualOnly: false,
      created_at: now,
      updated_at: now,
    },
    {
      id: "shinrai-database",
      project_id: shinraiProjectId,
      label: "PostgreSQL Database",
      type: "server",
      server_type: "database",
      status: "running",
      description: "Primary data store",
      port: 5432,
      isVisualOnly: false,
      isSubNode: true,
      parentNodeId: "shinrai-backend",
      created_at: now,
      updated_at: now,
    },
    {
      id: "shinrai-discord",
      project_id: shinraiProjectId,
      label: "Discord Bot",
      type: "server",
      server_type: "bot",
      status: "running",
      description: "Discord integration and automation",
      port: null,
      isVisualOnly: false,
      created_at: now,
      updated_at: now,
    },
    {
      id: "shinrai-redis",
      project_id: shinraiProjectId,
      label: "Redis Cache",
      type: "server",
      server_type: "cache",
      status: "running",
      description: "Session and cache storage",
      port: 6379,
      isVisualOnly: false,
      isSubNode: true,
      parentNodeId: "shinrai-backend",
      created_at: now,
      updated_at: now,
    },
  ];

  store.nodes.push(...shinraiNodes);
  logger.info(`✅ Added ${shinraiNodes.length} Shinrai nodes`);

  // ============================================
  // NODE CONNECTIONS
  // ============================================
  const connections = [
    {
      id: uuidv4(),
      project_id: shinraiProjectId,
      source_node_id: "shinrai-planning",
      target_node_id: "shinrai-backend",
      relationship_type: "orchestrates",
      created_at: now,
    },
    {
      id: uuidv4(),
      project_id: shinraiProjectId,
      source_node_id: "shinrai-planning",
      target_node_id: "shinrai-frontend",
      relationship_type: "orchestrates",
      created_at: now,
    },
    {
      id: uuidv4(),
      project_id: shinraiProjectId,
      source_node_id: "shinrai-planning",
      target_node_id: "shinrai-discord",
      relationship_type: "orchestrates",
      created_at: now,
    },
    {
      id: uuidv4(),
      project_id: shinraiProjectId,
      source_node_id: "shinrai-backend",
      target_node_id: "shinrai-database",
      relationship_type: "connects_to",
      created_at: now,
    },
    {
      id: uuidv4(),
      project_id: shinraiProjectId,
      source_node_id: "shinrai-backend",
      target_node_id: "shinrai-redis",
      relationship_type: "connects_to",
      created_at: now,
    },
    {
      id: uuidv4(),
      project_id: shinraiProjectId,
      source_node_id: "shinrai-frontend",
      target_node_id: "shinrai-backend",
      relationship_type: "calls",
      created_at: now,
    },
  ];

  store.node_relationships.push(...connections);
  logger.info(`✅ Added ${connections.length} node connections`);

  // ============================================
  // INITIAL AUDIT LOG
  // ============================================
  const initialAuditLog = {
    id: uuidv4(),
    teamId: managementTeamId,
    userId: "user-leeloo",
    username: "LeeLoo",
    action: "system_init",
    resourceType: "system",
    resourceId: "zurto-v3",
    details: {
      message: "Zurto V3 system initialized",
      usersCreated: 1,
      teamsCreated: 1,
      projectsCreated: 1,
    },
    timestamp: now,
  };

  store.audit_logs.push(initialAuditLog);

  // ============================================
  // SUMMARY
  // ============================================
  logger.info("🌱 Database seeding complete!");
  logger.info("═══════════════════════════════════════");
  logger.info("📋 INITIAL CREDENTIALS:");
  logger.info(`   Username: LeeLoo`);
  logger.info(`   Team Token: ${leelooTeamToken}`);
  logger.info(`   Admin Token: ${leelooAdminToken}`);
  logger.info("═══════════════════════════════════════");
}
