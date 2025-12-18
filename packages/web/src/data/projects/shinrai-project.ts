// Shinrai.lol-V2 Project Import
// Imported from: C:\Users\leogr\Desktop\Workspace\Shinrai.lol-V2
// Team: LeeLoo | User: LeeLoo
// Progress: ~35%

import { ProjectNode, ProjectData } from "./index";
import { NodeConnection } from "../../pages/CanvasView";

// =============================================================================
// SHINRAI.LOL-V2 PROJECT NODES
// =============================================================================

// Main Planning Hub Node
const planningNode: ProjectNode = {
  id: "shinrai-planning",
  label: "Shinrai.lol V2",
  type: "utility",
  utilityType: "planning",
  status: "running",
  description:
    "Gaming community website with Discord integration and e-commerce",
  x: 0,
  y: 0,
  metadata: {
    createdAt: new Date("2024-06-01"),
    updatedAt: new Date(),
    createdBy: "LeeLoo",
    tags: ["gaming", "discord", "e-commerce", "community"],
    version: "2.0.0",
    documentation:
      "Full-stack gaming community platform with Discord bot integration",
  },
};

// =============================================================================
// BACKEND SERVER NODE & CHILDREN
// =============================================================================

const backendNode: ProjectNode = {
  id: "shinrai-backend",
  label: "Backend API",
  type: "server",
  serverType: "backend",
  status: "running",
  description: "Express.js REST API with TypeScript",
  port: 3002,
  uptime: "2d 14h",
  lastBuild: "3 hours ago",
  cpuUsage: 12,
  memoryUsage: 45,
  isDeployed: true,
  deployUrl: "https://api.shinrai.lol",
  lastDeployed: "3 hours ago",
  x: 0,
  y: 0,
  parentId: "shinrai-planning",
  children: [
    "shinrai-backend-routes",
    "shinrai-backend-middleware",
    "shinrai-backend-services",
    "shinrai-backend-database",
    "shinrai-backend-controllers",
    "shinrai-backend-config",
  ],
  metadata: {
    createdAt: new Date("2024-06-01"),
    updatedAt: new Date(),
    tags: ["express", "typescript", "api", "rest"],
  },
};

// Backend Child Nodes - Routes
const backendRoutesNode: ProjectNode = {
  id: "shinrai-backend-routes",
  label: "Routes",
  type: "file",
  fileName: "routes/",
  status: "running",
  description: "API route handlers",
  x: 0,
  y: 0,
  parentId: "shinrai-backend",
  children: [
    "route-admin",
    "route-auth",
    "route-discord-admin",
    "route-discord",
    "route-emails",
    "route-orders",
    "route-payments",
    "route-products",
    "route-stats",
    "route-subscriptions",
    "route-supplier",
    "route-tickets",
    "route-upload",
    "route-users",
    "route-vouches",
  ],
};

// Individual route files
const routeFiles: ProjectNode[] = [
  {
    id: "route-admin",
    label: "admin.routes.ts",
    type: "file",
    fileName: "admin.routes.ts",
    parentId: "shinrai-backend-routes",
    x: 0,
    y: 0,
  },
  {
    id: "route-auth",
    label: "auth.routes.ts",
    type: "file",
    fileName: "auth.routes.ts",
    parentId: "shinrai-backend-routes",
    x: 0,
    y: 0,
  },
  {
    id: "route-discord-admin",
    label: "discord-admin.routes.ts",
    type: "file",
    fileName: "discord-admin.routes.ts",
    parentId: "shinrai-backend-routes",
    x: 0,
    y: 0,
  },
  {
    id: "route-discord",
    label: "discord.routes.ts",
    type: "file",
    fileName: "discord.routes.ts",
    parentId: "shinrai-backend-routes",
    x: 0,
    y: 0,
  },
  {
    id: "route-emails",
    label: "emails.routes.ts",
    type: "file",
    fileName: "emails.routes.ts",
    parentId: "shinrai-backend-routes",
    x: 0,
    y: 0,
  },
  {
    id: "route-orders",
    label: "orders.routes.ts",
    type: "file",
    fileName: "orders.routes.ts",
    parentId: "shinrai-backend-routes",
    x: 0,
    y: 0,
  },
  {
    id: "route-payments",
    label: "payments.routes.ts",
    type: "file",
    fileName: "payments.routes.ts",
    parentId: "shinrai-backend-routes",
    x: 0,
    y: 0,
  },
  {
    id: "route-products",
    label: "products.routes.ts",
    type: "file",
    fileName: "products.routes.ts",
    parentId: "shinrai-backend-routes",
    x: 0,
    y: 0,
  },
  {
    id: "route-stats",
    label: "stats.routes.ts",
    type: "file",
    fileName: "stats.routes.ts",
    parentId: "shinrai-backend-routes",
    x: 0,
    y: 0,
  },
  {
    id: "route-subscriptions",
    label: "subscriptions.routes.ts",
    type: "file",
    fileName: "subscriptions.routes.ts",
    parentId: "shinrai-backend-routes",
    x: 0,
    y: 0,
  },
  {
    id: "route-supplier",
    label: "supplier.routes.ts",
    type: "file",
    fileName: "supplier.routes.ts",
    parentId: "shinrai-backend-routes",
    x: 0,
    y: 0,
  },
  {
    id: "route-tickets",
    label: "tickets.routes.ts",
    type: "file",
    fileName: "tickets.routes.ts",
    parentId: "shinrai-backend-routes",
    x: 0,
    y: 0,
  },
  {
    id: "route-upload",
    label: "upload.routes.ts",
    type: "file",
    fileName: "upload.routes.ts",
    parentId: "shinrai-backend-routes",
    x: 0,
    y: 0,
  },
  {
    id: "route-users",
    label: "users.routes.ts",
    type: "file",
    fileName: "users.routes.ts",
    parentId: "shinrai-backend-routes",
    x: 0,
    y: 0,
  },
  {
    id: "route-vouches",
    label: "vouches.routes.ts",
    type: "file",
    fileName: "vouches.routes.ts",
    parentId: "shinrai-backend-routes",
    x: 0,
    y: 0,
  },
];

// Backend Child Nodes - Middleware
const backendMiddlewareNode: ProjectNode = {
  id: "shinrai-backend-middleware",
  label: "Middleware",
  type: "file",
  fileName: "middleware/",
  status: "running",
  description: "Express middleware functions",
  x: 0,
  y: 0,
  parentId: "shinrai-backend",
  children: ["mw-apikey", "mw-auth", "mw-error", "mw-ratelimit"],
};

const middlewareFiles: ProjectNode[] = [
  {
    id: "mw-apikey",
    label: "apiKey.ts",
    type: "file",
    fileName: "apiKey.ts",
    parentId: "shinrai-backend-middleware",
    x: 0,
    y: 0,
  },
  {
    id: "mw-auth",
    label: "auth.ts",
    type: "file",
    fileName: "auth.ts",
    parentId: "shinrai-backend-middleware",
    x: 0,
    y: 0,
  },
  {
    id: "mw-error",
    label: "error.ts",
    type: "file",
    fileName: "error.ts",
    parentId: "shinrai-backend-middleware",
    x: 0,
    y: 0,
  },
  {
    id: "mw-ratelimit",
    label: "rateLimit.ts",
    type: "file",
    fileName: "rateLimit.ts",
    parentId: "shinrai-backend-middleware",
    x: 0,
    y: 0,
  },
];

// Backend Child Nodes - Services
const backendServicesNode: ProjectNode = {
  id: "shinrai-backend-services",
  label: "Services",
  type: "file",
  fileName: "services/",
  status: "running",
  description: "Business logic services",
  x: 0,
  y: 0,
  parentId: "shinrai-backend",
  children: ["svc-auth", "svc-discord", "svc-websocket"],
};

const serviceFiles: ProjectNode[] = [
  {
    id: "svc-auth",
    label: "auth.service.ts",
    type: "file",
    fileName: "auth.service.ts",
    parentId: "shinrai-backend-services",
    x: 0,
    y: 0,
  },
  {
    id: "svc-discord",
    label: "discord.service.ts",
    type: "file",
    fileName: "discord.service.ts",
    parentId: "shinrai-backend-services",
    x: 0,
    y: 0,
  },
  {
    id: "svc-websocket",
    label: "websocket.service.ts",
    type: "file",
    fileName: "websocket.service.ts",
    parentId: "shinrai-backend-services",
    x: 0,
    y: 0,
  },
];

// Backend Child Nodes - Database
const backendDatabaseNode: ProjectNode = {
  id: "shinrai-backend-database",
  label: "Database",
  type: "server",
  serverType: "database",
  status: "running",
  description: "Database schema and migrations",
  port: 5432,
  uptime: "5d 2h",
  lastBuild: "1 week ago",
  cpuUsage: 8,
  memoryUsage: 62,
  x: 0,
  y: 0,
  parentId: "shinrai-backend",
  children: ["db-schema", "db-migrations"],
};

const databaseFiles: ProjectNode[] = [
  {
    id: "db-schema",
    label: "schema.sql",
    type: "file",
    fileName: "schema.sql",
    parentId: "shinrai-backend-database",
    x: 0,
    y: 0,
  },
  {
    id: "db-migrations",
    label: "migrations/",
    type: "file",
    fileName: "migrations/",
    parentId: "shinrai-backend-database",
    x: 0,
    y: 0,
  },
];

// Backend Child Nodes - Controllers & Config
const backendControllersNode: ProjectNode = {
  id: "shinrai-backend-controllers",
  label: "Controllers",
  type: "file",
  fileName: "controllers/",
  status: "stopped",
  description: "Request handlers",
  x: 0,
  y: 0,
  parentId: "shinrai-backend",
};

const backendConfigNode: ProjectNode = {
  id: "shinrai-backend-config",
  label: "Config",
  type: "file",
  fileName: "config/",
  status: "running",
  description: "Configuration files",
  x: 0,
  y: 0,
  parentId: "shinrai-backend",
  children: ["cfg-database", "cfg-index"],
};

const configFiles: ProjectNode[] = [
  {
    id: "cfg-database",
    label: "database.ts",
    type: "file",
    fileName: "database.ts",
    parentId: "shinrai-backend-config",
    x: 0,
    y: 0,
  },
  {
    id: "cfg-index",
    label: "index.ts",
    type: "file",
    fileName: "index.ts",
    parentId: "shinrai-backend-config",
    x: 0,
    y: 0,
  },
];

// =============================================================================
// FRONTEND SERVER NODE & CHILDREN
// =============================================================================

const frontendNode: ProjectNode = {
  id: "shinrai-frontend",
  label: "Frontend",
  type: "server",
  serverType: "frontend",
  status: "running",
  description: "React + Vite + TailwindCSS frontend",
  port: 5173,
  uptime: "1d 8h",
  lastBuild: "45 minutes ago",
  cpuUsage: 5,
  memoryUsage: 28,
  isDeployed: true,
  deployUrl: "https://shinrai.lol",
  lastDeployed: "45 minutes ago",
  x: 0,
  y: 0,
  parentId: "shinrai-planning",
  children: [
    "shinrai-frontend-pages",
    "shinrai-frontend-components",
    "shinrai-frontend-hooks",
    "shinrai-frontend-contexts",
    "shinrai-frontend-styles",
    "shinrai-frontend-utils",
  ],
  metadata: {
    createdAt: new Date("2024-06-01"),
    updatedAt: new Date(),
    tags: ["react", "vite", "tailwind", "typescript"],
  },
};

// Frontend Child Nodes - Pages
const frontendPagesNode: ProjectNode = {
  id: "shinrai-frontend-pages",
  label: "Pages",
  type: "file",
  fileName: "pages/",
  status: "running",
  description: "Page components",
  x: 0,
  y: 0,
  parentId: "shinrai-frontend",
  children: [
    "page-home",
    "page-login",
    "page-products",
    "page-product-detail",
    "page-vouches",
    "page-admin",
    "page-dashboard",
    "page-supplier",
    "page-auth-success",
    "page-terms",
    "page-privacy",
  ],
};

const pageFiles: ProjectNode[] = [
  {
    id: "page-home",
    label: "HomePage.tsx",
    type: "file",
    fileName: "HomePage.tsx",
    parentId: "shinrai-frontend-pages",
    x: 0,
    y: 0,
  },
  {
    id: "page-login",
    label: "LoginPage.tsx",
    type: "file",
    fileName: "LoginPage.tsx",
    parentId: "shinrai-frontend-pages",
    x: 0,
    y: 0,
  },
  {
    id: "page-products",
    label: "ProductsPage.tsx",
    type: "file",
    fileName: "ProductsPage.tsx",
    parentId: "shinrai-frontend-pages",
    x: 0,
    y: 0,
  },
  {
    id: "page-product-detail",
    label: "ProductDetailPage.tsx",
    type: "file",
    fileName: "ProductDetailPage.tsx",
    parentId: "shinrai-frontend-pages",
    x: 0,
    y: 0,
  },
  {
    id: "page-vouches",
    label: "VouchesPage.tsx",
    type: "file",
    fileName: "VouchesPage.tsx",
    parentId: "shinrai-frontend-pages",
    x: 0,
    y: 0,
  },
  {
    id: "page-admin",
    label: "admin/",
    type: "file",
    fileName: "admin/",
    parentId: "shinrai-frontend-pages",
    x: 0,
    y: 0,
  },
  {
    id: "page-dashboard",
    label: "dashboard/",
    type: "file",
    fileName: "dashboard/",
    parentId: "shinrai-frontend-pages",
    x: 0,
    y: 0,
  },
  {
    id: "page-supplier",
    label: "supplier/",
    type: "file",
    fileName: "supplier/",
    parentId: "shinrai-frontend-pages",
    x: 0,
    y: 0,
  },
  {
    id: "page-auth-success",
    label: "AuthSuccessPage.tsx",
    type: "file",
    fileName: "AuthSuccessPage.tsx",
    parentId: "shinrai-frontend-pages",
    x: 0,
    y: 0,
  },
  {
    id: "page-terms",
    label: "TermsPage.tsx",
    type: "file",
    fileName: "TermsPage.tsx",
    parentId: "shinrai-frontend-pages",
    x: 0,
    y: 0,
  },
  {
    id: "page-privacy",
    label: "PrivacyPage.tsx",
    type: "file",
    fileName: "PrivacyPage.tsx",
    parentId: "shinrai-frontend-pages",
    x: 0,
    y: 0,
  },
];

// Frontend Child Nodes - Components
const frontendComponentsNode: ProjectNode = {
  id: "shinrai-frontend-components",
  label: "Components",
  type: "file",
  fileName: "components/",
  status: "running",
  description: "Reusable UI components",
  x: 0,
  y: 0,
  parentId: "shinrai-frontend",
  children: [
    "comp-admin",
    "comp-cart",
    "comp-checkout",
    "comp-common",
    "comp-dashboard",
    "comp-discord",
    "comp-layout",
    "comp-shop",
    "comp-ui",
  ],
};

const componentFolders: ProjectNode[] = [
  {
    id: "comp-admin",
    label: "admin/",
    type: "file",
    fileName: "admin/",
    parentId: "shinrai-frontend-components",
    x: 0,
    y: 0,
  },
  {
    id: "comp-cart",
    label: "CartSidebar.tsx",
    type: "file",
    fileName: "CartSidebar.tsx",
    parentId: "shinrai-frontend-components",
    x: 0,
    y: 0,
  },
  {
    id: "comp-checkout",
    label: "checkout/",
    type: "file",
    fileName: "checkout/",
    parentId: "shinrai-frontend-components",
    x: 0,
    y: 0,
  },
  {
    id: "comp-common",
    label: "common/",
    type: "file",
    fileName: "common/",
    parentId: "shinrai-frontend-components",
    x: 0,
    y: 0,
  },
  {
    id: "comp-dashboard",
    label: "dashboard/",
    type: "file",
    fileName: "dashboard/",
    parentId: "shinrai-frontend-components",
    x: 0,
    y: 0,
  },
  {
    id: "comp-discord",
    label: "discord/",
    type: "file",
    fileName: "discord/",
    parentId: "shinrai-frontend-components",
    x: 0,
    y: 0,
  },
  {
    id: "comp-layout",
    label: "layout/",
    type: "file",
    fileName: "layout/",
    parentId: "shinrai-frontend-components",
    x: 0,
    y: 0,
  },
  {
    id: "comp-shop",
    label: "shop/",
    type: "file",
    fileName: "shop/",
    parentId: "shinrai-frontend-components",
    x: 0,
    y: 0,
  },
  {
    id: "comp-ui",
    label: "ui/",
    type: "file",
    fileName: "ui/",
    parentId: "shinrai-frontend-components",
    x: 0,
    y: 0,
  },
];

// Frontend Child Nodes - Hooks, Contexts, Styles, Utils
const frontendHooksNode: ProjectNode = {
  id: "shinrai-frontend-hooks",
  label: "Hooks",
  type: "file",
  fileName: "hooks/",
  status: "running",
  description: "Custom React hooks",
  x: 0,
  y: 0,
  parentId: "shinrai-frontend",
};

const frontendContextsNode: ProjectNode = {
  id: "shinrai-frontend-contexts",
  label: "Contexts",
  type: "file",
  fileName: "contexts/",
  status: "running",
  description: "React context providers",
  x: 0,
  y: 0,
  parentId: "shinrai-frontend",
};

const frontendStylesNode: ProjectNode = {
  id: "shinrai-frontend-styles",
  label: "Styles",
  type: "file",
  fileName: "styles/",
  status: "running",
  description: "Global styles and Tailwind config",
  x: 0,
  y: 0,
  parentId: "shinrai-frontend",
};

const frontendUtilsNode: ProjectNode = {
  id: "shinrai-frontend-utils",
  label: "Utils",
  type: "file",
  fileName: "utils/",
  status: "running",
  description: "Utility functions",
  x: 0,
  y: 0,
  parentId: "shinrai-frontend",
};

// =============================================================================
// DISCORD BOT SERVER NODE & CHILDREN
// =============================================================================

const discordBotNode: ProjectNode = {
  id: "shinrai-discord-bot",
  label: "Discord Bot",
  type: "server",
  serverType: "discord",
  status: "stopped",
  description: "Discord.js bot with slash commands",
  port: undefined,
  uptime: undefined,
  lastBuild: "2 days ago",
  cpuUsage: 0,
  memoryUsage: 0,
  x: 0,
  y: 0,
  parentId: "shinrai-planning",
  children: [
    "shinrai-bot-commands",
    "shinrai-bot-events",
    "shinrai-bot-services",
    "shinrai-bot-api",
    "shinrai-bot-config",
  ],
  metadata: {
    createdAt: new Date("2024-06-01"),
    updatedAt: new Date(),
    tags: ["discord.js", "bot", "slash-commands", "typescript"],
  },
};

// Discord Bot Child Nodes - Commands
const botCommandsNode: ProjectNode = {
  id: "shinrai-bot-commands",
  label: "Commands",
  type: "file",
  fileName: "commands/",
  status: "running",
  description: "Slash command handlers",
  x: 0,
  y: 0,
  parentId: "shinrai-discord-bot",
  children: ["cmd-admin", "cmd-customer", "cmd-supplier", "cmd-utility"],
};

const commandFolders: ProjectNode[] = [
  {
    id: "cmd-admin",
    label: "admin/",
    type: "file",
    fileName: "admin/",
    parentId: "shinrai-bot-commands",
    x: 0,
    y: 0,
  },
  {
    id: "cmd-customer",
    label: "customer/",
    type: "file",
    fileName: "customer/",
    parentId: "shinrai-bot-commands",
    x: 0,
    y: 0,
  },
  {
    id: "cmd-supplier",
    label: "supplier/",
    type: "file",
    fileName: "supplier/",
    parentId: "shinrai-bot-commands",
    x: 0,
    y: 0,
  },
  {
    id: "cmd-utility",
    label: "utility/",
    type: "file",
    fileName: "utility/",
    parentId: "shinrai-bot-commands",
    x: 0,
    y: 0,
  },
];

// Discord Bot Child Nodes - Events
const botEventsNode: ProjectNode = {
  id: "shinrai-bot-events",
  label: "Events",
  type: "file",
  fileName: "events/",
  status: "running",
  description: "Discord event handlers",
  x: 0,
  y: 0,
  parentId: "shinrai-discord-bot",
  children: [
    "evt-ready",
    "evt-interaction",
    "evt-message",
    "evt-member-add",
    "evt-member-remove",
  ],
};

const eventFiles: ProjectNode[] = [
  {
    id: "evt-ready",
    label: "ready.ts",
    type: "file",
    fileName: "ready.ts",
    parentId: "shinrai-bot-events",
    x: 0,
    y: 0,
  },
  {
    id: "evt-interaction",
    label: "interactionCreate.ts",
    type: "file",
    fileName: "interactionCreate.ts",
    parentId: "shinrai-bot-events",
    x: 0,
    y: 0,
  },
  {
    id: "evt-message",
    label: "messageCreate.ts",
    type: "file",
    fileName: "messageCreate.ts",
    parentId: "shinrai-bot-events",
    x: 0,
    y: 0,
  },
  {
    id: "evt-member-add",
    label: "guildMemberAdd.ts",
    type: "file",
    fileName: "guildMemberAdd.ts",
    parentId: "shinrai-bot-events",
    x: 0,
    y: 0,
  },
  {
    id: "evt-member-remove",
    label: "guildMemberRemove.ts",
    type: "file",
    fileName: "guildMemberRemove.ts",
    parentId: "shinrai-bot-events",
    x: 0,
    y: 0,
  },
];

// Discord Bot Child Nodes - Services, API, Config
const botServicesNode: ProjectNode = {
  id: "shinrai-bot-services",
  label: "Services",
  type: "file",
  fileName: "services/",
  status: "running",
  description: "Bot business logic",
  x: 0,
  y: 0,
  parentId: "shinrai-discord-bot",
};

const botApiNode: ProjectNode = {
  id: "shinrai-bot-api",
  label: "API Client",
  type: "file",
  fileName: "api/",
  status: "running",
  description: "Backend API integration",
  x: 0,
  y: 0,
  parentId: "shinrai-discord-bot",
};

const botConfigNode: ProjectNode = {
  id: "shinrai-bot-config",
  label: "Config",
  type: "file",
  fileName: "config/",
  status: "running",
  description: "Bot configuration",
  x: 0,
  y: 0,
  parentId: "shinrai-discord-bot",
};

// =============================================================================
// DOCUMENTATION NODE
// =============================================================================

const docsNode: ProjectNode = {
  id: "shinrai-docs",
  label: "Documentation",
  type: "utility",
  utilityType: "logging",
  status: "running",
  description: "Project documentation and guides",
  x: 0,
  y: 0,
  parentId: "shinrai-planning",
  children: ["doc-api", "doc-readme", "doc-setup"],
  metadata: {
    createdAt: new Date("2024-06-01"),
    updatedAt: new Date(),
    tags: ["docs", "api", "markdown"],
  },
};

const docFiles: ProjectNode[] = [
  {
    id: "doc-api",
    label: "API.md",
    type: "file",
    fileName: "API.md",
    parentId: "shinrai-docs",
    x: 0,
    y: 0,
  },
  {
    id: "doc-readme",
    label: "README.md",
    type: "file",
    fileName: "README.md",
    parentId: "shinrai-docs",
    x: 0,
    y: 0,
  },
  {
    id: "doc-setup",
    label: "SETUP.md",
    type: "file",
    fileName: "SETUP.md",
    parentId: "shinrai-docs",
    x: 0,
    y: 0,
  },
];

// =============================================================================
// ALL NODES COMBINED
// =============================================================================

export const shinraiNodes: ProjectNode[] = [
  // Main hub
  planningNode,

  // Backend server and children
  backendNode,
  backendRoutesNode,
  ...routeFiles,
  backendMiddlewareNode,
  ...middlewareFiles,
  backendServicesNode,
  ...serviceFiles,
  backendDatabaseNode,
  ...databaseFiles,
  backendControllersNode,
  backendConfigNode,
  ...configFiles,

  // Frontend server and children
  frontendNode,
  frontendPagesNode,
  ...pageFiles,
  frontendComponentsNode,
  ...componentFolders,
  frontendHooksNode,
  frontendContextsNode,
  frontendStylesNode,
  frontendUtilsNode,

  // Discord bot server and children
  discordBotNode,
  botCommandsNode,
  ...commandFolders,
  botEventsNode,
  ...eventFiles,
  botServicesNode,
  botApiNode,
  botConfigNode,

  // Documentation
  docsNode,
  ...docFiles,
];

// =============================================================================
// NODE CONNECTIONS
// =============================================================================

export const shinraiConnections: NodeConnection[] = [
  // Planning to main servers
  {
    id: "conn-1",
    sourceId: "shinrai-planning",
    targetId: "shinrai-backend",
    type: "depends_on",
  },
  {
    id: "conn-2",
    sourceId: "shinrai-planning",
    targetId: "shinrai-frontend",
    type: "depends_on",
  },
  {
    id: "conn-3",
    sourceId: "shinrai-planning",
    targetId: "shinrai-discord-bot",
    type: "depends_on",
  },
  {
    id: "conn-4",
    sourceId: "shinrai-planning",
    targetId: "shinrai-docs",
    type: "child_of",
  },

  // Frontend to Backend
  {
    id: "conn-5",
    sourceId: "shinrai-frontend",
    targetId: "shinrai-backend",
    type: "calls",
  },

  // Discord Bot to Backend
  {
    id: "conn-6",
    sourceId: "shinrai-discord-bot",
    targetId: "shinrai-backend",
    type: "calls",
  },

  // Backend internal connections
  {
    id: "conn-7",
    sourceId: "shinrai-backend",
    targetId: "shinrai-backend-routes",
    type: "child_of",
  },
  {
    id: "conn-8",
    sourceId: "shinrai-backend",
    targetId: "shinrai-backend-middleware",
    type: "child_of",
  },
  {
    id: "conn-9",
    sourceId: "shinrai-backend",
    targetId: "shinrai-backend-services",
    type: "child_of",
  },
  {
    id: "conn-10",
    sourceId: "shinrai-backend",
    targetId: "shinrai-backend-database",
    type: "child_of",
  },
  {
    id: "conn-11",
    sourceId: "shinrai-backend-routes",
    targetId: "shinrai-backend-services",
    type: "calls",
  },
  {
    id: "conn-12",
    sourceId: "shinrai-backend-services",
    targetId: "shinrai-backend-database",
    type: "calls",
  },
  {
    id: "conn-13",
    sourceId: "shinrai-backend-routes",
    targetId: "shinrai-backend-middleware",
    type: "depends_on",
  },

  // Frontend internal connections
  {
    id: "conn-14",
    sourceId: "shinrai-frontend",
    targetId: "shinrai-frontend-pages",
    type: "child_of",
  },
  {
    id: "conn-15",
    sourceId: "shinrai-frontend",
    targetId: "shinrai-frontend-components",
    type: "child_of",
  },
  {
    id: "conn-16",
    sourceId: "shinrai-frontend-pages",
    targetId: "shinrai-frontend-components",
    type: "calls",
  },
  {
    id: "conn-17",
    sourceId: "shinrai-frontend-pages",
    targetId: "shinrai-frontend-hooks",
    type: "calls",
  },
  {
    id: "conn-18",
    sourceId: "shinrai-frontend-components",
    targetId: "shinrai-frontend-contexts",
    type: "calls",
  },

  // Discord Bot internal connections
  {
    id: "conn-19",
    sourceId: "shinrai-discord-bot",
    targetId: "shinrai-bot-commands",
    type: "child_of",
  },
  {
    id: "conn-20",
    sourceId: "shinrai-discord-bot",
    targetId: "shinrai-bot-events",
    type: "child_of",
  },
  {
    id: "conn-21",
    sourceId: "shinrai-bot-events",
    targetId: "shinrai-bot-commands",
    type: "calls",
  },
  {
    id: "conn-22",
    sourceId: "shinrai-bot-commands",
    targetId: "shinrai-bot-services",
    type: "calls",
  },
  {
    id: "conn-23",
    sourceId: "shinrai-bot-services",
    targetId: "shinrai-bot-api",
    type: "calls",
  },
];

// =============================================================================
// COMPLETE PROJECT DATA
// =============================================================================

export const shinraiProject: ProjectData = {
  id: "shinrai-lol-v2",
  name: "Shinrai.lol V2",
  description:
    "Gaming community website with Discord integration, e-commerce, and supplier management system",
  teamId: "leeloo-team",
  nodes: shinraiNodes,
  connections: shinraiConnections,
  metadata: {
    createdAt: new Date("2024-06-01"),
    updatedAt: new Date(),
    lastOpenedAt: new Date(),
    version: "2.0.0-beta",
    author: "LeeLoo",
    tags: [
      "gaming",
      "discord",
      "e-commerce",
      "community",
      "react",
      "express",
      "typescript",
    ],
  },
  settings: {
    defaultLayout: "center-out",
    gridSize: 40,
    snapToGrid: true,
    showConnections: true,
    showMinimap: false,
  },
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get all nodes at a specific depth level
 */
export function getNodesByDepth(depth: number): ProjectNode[] {
  if (depth === 0) return [planningNode];
  if (depth === 1) return [backendNode, frontendNode, discordBotNode, docsNode];

  // Get all nodes with parents at depth-1
  const parentIds = getNodesByDepth(depth - 1).map((n) => n.id);
  return shinraiNodes.filter(
    (n) => n.parentId && parentIds.includes(n.parentId)
  );
}

/**
 * Get children of a specific node
 */
export function getChildNodes(nodeId: string): ProjectNode[] {
  return shinraiNodes.filter((n) => n.parentId === nodeId);
}

/**
 * Get ALL descendant nodes recursively (children, grandchildren, etc.)
 * This includes files within folders, subfolders, and all nested content
 */
export function getAllDescendants(nodeId: string): ProjectNode[] {
  const descendants: ProjectNode[] = [];
  const queue = [nodeId];

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const children = shinraiNodes.filter((n) => n.parentId === currentId);

    children.forEach((child) => {
      descendants.push(child);
      queue.push(child.id); // Add to queue to get its children too
    });
  }

  return descendants;
}

/**
 * Get children of a node with optional depth limit
 * depth = 1: direct children only
 * depth = 2: children and grandchildren
 * depth = -1: all descendants (infinite)
 */
export function getChildNodesWithDepth(
  nodeId: string,
  depth: number = 1
): ProjectNode[] {
  if (depth === 0) return [];

  const directChildren = shinraiNodes.filter((n) => n.parentId === nodeId);

  if (depth === 1) {
    return directChildren;
  }

  // Get deeper children
  const result = [...directChildren];
  directChildren.forEach((child) => {
    const grandchildren = getChildNodesWithDepth(
      child.id,
      depth === -1 ? -1 : depth - 1
    );
    result.push(...grandchildren);
  });

  return result;
}

/**
 * Check if a node is a folder (has children)
 */
export function isFolder(nodeId: string): boolean {
  return shinraiNodes.some((n) => n.parentId === nodeId);
}

/**
 * Get the depth level of a node (0 = root, 1 = first level, etc.)
 */
export function getNodeDepth(nodeId: string): number {
  let depth = 0;
  let current = shinraiNodes.find((n) => n.id === nodeId);

  while (current?.parentId) {
    depth++;
    current = shinraiNodes.find((n) => n.id === current!.parentId);
  }

  return depth;
}

/**
 * Get the parent node of a specific node
 */
export function getParentNode(nodeId: string): ProjectNode | undefined {
  const node = shinraiNodes.find((n) => n.id === nodeId);
  if (!node?.parentId) return undefined;
  return shinraiNodes.find((n) => n.id === node.parentId);
}

/**
 * Get the full path to a node (breadcrumb)
 */
export function getNodePath(nodeId: string): ProjectNode[] {
  const path: ProjectNode[] = [];
  let current = shinraiNodes.find((n) => n.id === nodeId);

  while (current) {
    path.unshift(current);
    current = current.parentId
      ? shinraiNodes.find((n) => n.id === current!.parentId)
      : undefined;
  }

  return path;
}

/**
 * Get connections for a specific node
 */
export function getNodeConnections(nodeId: string): NodeConnection[] {
  return shinraiConnections.filter(
    (c) => c.sourceId === nodeId || c.targetId === nodeId
  );
}
