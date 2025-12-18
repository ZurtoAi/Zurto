import express, { Express, Request, Response, NextFunction } from "express";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { initializeDatabase } from "./core/database.js";
import { logger } from "./utils/logger.js";
import {
  rateLimiter,
  securityHeaders,
  sanitizeInput,
  requestLogger,
} from "./middleware/security.js";
import projectsRoutes from "./api/projects-routes.js";
import nodesRoutes from "./api/nodes-routes.js";
import relationshipsRoutes from "./api/relationships-routes.js";
import questionnairesRoutes from "./api/questionnaires-routes.js";
import aiRoutes from "./api/ai-routes.js";
import authRoutes from "./api/auth-routes.js";
import portsRoutes from "./api/ports-routes.js";
import adminRoutes from "./api/admin-routes.js";
import fileSyncRoutes from "./api/file-sync-routes.js";
import dockerRoutes from "./api/docker-routes.js";
import domainsRoutes from "./api/domains-routes.js";

dotenv.config();

const app: Express = express();
const server = http.createServer(app);
// Socket.IO CORS - allow multiple origins
const socketAllowedOrigins = [
  process.env.CLIENT_URL || "https://zurto.app",
  "https://zurto.app",
  "https://www.zurto.app",
  "https://api.zurto.app",
];

const io = new Server(server, {
  cors: {
    origin: socketAllowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// CORS must be FIRST to ensure headers are sent even on rate limit/error
try {
  // CORS configuration - allow multiple origins for development and production
  const allowedOrigins = [
    process.env.CLIENT_URL || "https://zurto.app",
    "https://zurto.app",
    "https://www.zurto.app",
    "https://api.zurto.app",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, etc.)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
          callback(null, origin);
        } else {
          logger.warn(`CORS blocked origin: ${origin}`);
          callback(null, false);
        }
      },
      methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
  logger.info("✅ CORS middleware loaded");
} catch (error) {
  logger.error("❌ CORS middleware error:", error);
  throw error;
}

// Security middleware
try {
  app.use(securityHeaders);
  logger.info("✅ Security headers middleware loaded");
  app.use(rateLimiter);
  logger.info("✅ Rate limiter middleware loaded");
  app.use(requestLogger);
  logger.info("✅ Request logger middleware loaded");
} catch (error) {
  logger.error("❌ Security middleware error:", error);
}

// Middleware
try {
  app.use(express.json({ limit: "10mb" }));
  logger.info("✅ JSON middleware loaded");
  app.use(sanitizeInput);
  logger.info("✅ Input sanitization middleware loaded");
} catch (error) {
  logger.error("❌ Middleware error:", error);
  throw error;
}

// Initialize database
(async () => {
  try {
    await initializeDatabase();
    logger.info("✅ Database initialized");
  } catch (error) {
    logger.error("❌ Database init error:", error);
    throw error;
  }
})();

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});
logger.info("✅ Health endpoint registered");

// API Routes
try {
  app.use("/api/auth", authRoutes);
  logger.info("✅ Auth routes loaded");
  app.use("/api/admin", adminRoutes);
  logger.info("✅ Admin routes loaded");
  app.use("/api/projects", projectsRoutes);
  logger.info("✅ Projects routes loaded");
  // Mount nodes routes under projects with projectId parameter
  app.use("/api/projects/:projectId/nodes", nodesRoutes);
  logger.info("✅ Nodes routes loaded");
  // Mount relationships routes under projects with projectId parameter
  app.use("/api/projects/:projectId/relationships", relationshipsRoutes);
  logger.info("✅ Relationships routes loaded");
  app.use("/api/questionnaires", questionnairesRoutes);
  logger.info("✅ Questionnaires routes loaded");
  app.use("/api", aiRoutes);
  logger.info("✅ AI routes loaded");
  app.use("/api/ports", portsRoutes);
  logger.info("✅ Ports routes loaded");
  app.use("/api", fileSyncRoutes);
  logger.info("✅ File Sync routes loaded");
  app.use("/api/docker", dockerRoutes);
  logger.info("✅ Docker routes loaded");
  app.use("/api/domains", domainsRoutes);
  logger.info("✅ Domains routes loaded");
} catch (error) {
  logger.error("❌ Route loading error:", error);
  throw error;
}

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
    path: req.path,
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error("Server error:", err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
});

// Socket.io connection
const activeUsers = new Map<
  string,
  { id: string; name: string; projectId: string | null; joinedAt: Date }
>();

io.on("connection", (socket) => {
  logger.info(`✅ Client connected: ${socket.id}`);

  // Track user joining
  socket.on(
    "user:join",
    (data: { userId: string; name: string; projectId?: string }) => {
      activeUsers.set(socket.id, {
        id: data.userId,
        name: data.name,
        projectId: data.projectId || null,
        joinedAt: new Date(),
      });
      // Notify all clients about new user
      io.emit("user:joined", {
        socketId: socket.id,
        userId: data.userId,
        name: data.name,
        projectId: data.projectId,
        activeUsers: Array.from(activeUsers.values()),
      });
      logger.info(`👤 User joined: ${data.name} (${data.userId})`);
    }
  );

  // User leaving project
  socket.on("user:leave", () => {
    const user = activeUsers.get(socket.id);
    if (user) {
      activeUsers.delete(socket.id);
      io.emit("user:left", {
        socketId: socket.id,
        userId: user.id,
        name: user.name,
        activeUsers: Array.from(activeUsers.values()),
      });
      logger.info(`👤 User left: ${user.name}`);
    }
  });

  // User cursor/selection updates (for collaborative editing)
  socket.on(
    "user:cursor",
    (data: { x: number; y: number; projectId: string }) => {
      socket.broadcast.emit("user:cursor", { socketId: socket.id, ...data });
    }
  );

  // Node update event
  socket.on("node:update", (data) => {
    logger.debug("Node update event:", data);
    // Broadcast to all connected clients
    socket.broadcast.emit("node:updated", data);
  });

  // Node creation event
  socket.on("node:create", (data) => {
    logger.debug("Node creation event:", data);
    socket.broadcast.emit("node:created", data);
  });

  // Node deletion event
  socket.on("node:delete", (data: { nodeId: string; projectId: string }) => {
    logger.debug("Node deletion event:", data);
    socket.broadcast.emit("node:deleted", data);
  });

  // Node position update (for drag operations)
  socket.on(
    "node:move",
    (data: { nodeId: string; x: number; y: number; projectId: string }) => {
      socket.broadcast.emit("node:moved", data);
    }
  );

  // Relationship events
  socket.on(
    "relationship:create",
    (data: {
      sourceId: string;
      targetId: string;
      type: string;
      projectId: string;
    }) => {
      logger.debug("Relationship creation:", data);
      socket.broadcast.emit("relationship:created", data);
    }
  );

  socket.on(
    "relationship:delete",
    (data: { relationshipId: string; projectId: string }) => {
      logger.debug("Relationship deletion:", data);
      socket.broadcast.emit("relationship:deleted", data);
    }
  );

  // Build progress event
  socket.on("build:progress", (data) => {
    logger.debug("Build progress:", data);
    io.emit("build:progress", data);
  });

  // Project sync request
  socket.on("project:sync", (data: { projectId: string }) => {
    logger.debug("Project sync request:", data);
    io.emit("project:sync", data);
  });

  // Error handling
  socket.on("error", (error) => {
    logger.error(`Socket error for ${socket.id}:`, error);
  });

  // Disconnection
  socket.on("disconnect", () => {
    const user = activeUsers.get(socket.id);
    if (user) {
      activeUsers.delete(socket.id);
      io.emit("user:left", {
        socketId: socket.id,
        userId: user.id,
        name: user.name,
        activeUsers: Array.from(activeUsers.values()),
      });
    }
    logger.info(`❌ Client disconnected: ${socket.id}`);
  });
});

logger.info("✅ Socket.io connection handler setup");

// Start server
const PORT = parseInt(process.env.API_PORT || "3000", 10);
const HOST = process.env.HOST || "0.0.0.0";
try {
  server.listen(PORT, HOST, () => {
    logger.info(`🚀 Zurto V3 API running on http://${HOST}:${PORT}`);
    logger.info(`📡 Socket.io ready for real-time communication`);
    logger.info(`✅ Server listening on ${HOST}:${PORT}`);
  });
  logger.info("✅ Server.listen() called");
} catch (error) {
  logger.error("❌ Server startup error:", error);
  throw error;
}

export { app, io };
