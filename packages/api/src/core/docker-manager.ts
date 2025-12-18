/**
 * Docker Manager
 *
 * Manages Docker containers for Zurto projects
 * Uses Docker socket for container control
 */

import { exec, spawn } from "child_process";
import { promisify } from "util";
import { logger } from "../utils/logger.js";
import { getDatabase } from "./database.js";
import * as fs from "fs";
import * as path from "path";

const execAsync = promisify(exec);

// ============================================
// TYPES
// ============================================

export interface DockerService {
  id: string;
  name: string;
  displayName: string;
  projectId: string;
  type:
    | "frontend"
    | "backend"
    | "database"
    | "cache"
    | "worker"
    | "gateway"
    | "other";
  status: DockerStatus;
  port?: number;
  containerId?: string;
  image?: string;
  health?: "healthy" | "unhealthy" | "starting" | "none";
  uptime?: string;
  createdAt?: string;
  sourcePath?: string;
  dockerfilePath?: string;
}

export type DockerStatus =
  | "running"
  | "stopped"
  | "restarting"
  | "paused"
  | "exited"
  | "dead"
  | "building"
  | "created"
  | "unknown";

export interface ResourceStats {
  cpuPercent: number;
  memoryUsage: number; // in MB
  memoryLimit: number; // in MB
  memoryPercent: number;
  networkRx: number; // bytes
  networkTx: number; // bytes
  blockRead: number;
  blockWrite: number;
}

export interface ContainerInfo {
  id: string;
  name: string;
  image: string;
  status: DockerStatus;
  state: string;
  ports: Array<{ containerPort: number; hostPort: number; protocol: string }>;
  created: string;
  labels: Record<string, string>;
}

export interface BuildProgress {
  stream?: string;
  status?: string;
  progress?: string;
  error?: string;
}

export interface LogEntry {
  timestamp: string;
  stream: "stdout" | "stderr";
  message: string;
}

// ============================================
// DOCKER MANAGER CLASS
// ============================================

export class DockerManager {
  private static instance: DockerManager;
  private dockerAvailable: boolean | null = null;

  private constructor() {}

  static getInstance(): DockerManager {
    if (!DockerManager.instance) {
      DockerManager.instance = new DockerManager();
    }
    return DockerManager.instance;
  }

  // ============================================
  // DOCKER AVAILABILITY
  // ============================================

  /**
   * Check if Docker CLI is available
   */
  async isAvailable(): Promise<boolean> {
    if (this.dockerAvailable !== null) {
      return this.dockerAvailable;
    }

    try {
      await execAsync("docker --version", { timeout: 5000 });
      this.dockerAvailable = true;
      logger.info("✅ Docker CLI available");
      return true;
    } catch {
      this.dockerAvailable = false;
      logger.warn("⚠️ Docker CLI not available");
      return false;
    }
  }

  /**
   * Check if Docker Compose is available
   */
  async isComposeAvailable(): Promise<boolean> {
    try {
      await execAsync("docker compose version", { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  // ============================================
  // SERVICE DISCOVERY
  // ============================================

  /**
   * List all containers (optionally filtered by project)
   */
  async listContainers(projectId?: string): Promise<ContainerInfo[]> {
    if (!(await this.isAvailable())) {
      return [];
    }

    try {
      // Get all containers with labels
      const { stdout } = await execAsync(`docker ps -a --format '{{json .}}'`, {
        timeout: 30000,
      });

      const lines = stdout.trim().split("\n").filter(Boolean);
      const containers: ContainerInfo[] = [];

      for (const line of lines) {
        try {
          const data = JSON.parse(line);

          // Parse ports
          const ports: ContainerInfo["ports"] = [];
          const portsStr = data.Ports || "";
          const portMatches = portsStr.matchAll(/(\d+)->(\d+)\/(\w+)/g);
          for (const match of portMatches) {
            ports.push({
              hostPort: parseInt(match[1]),
              containerPort: parseInt(match[2]),
              protocol: match[3],
            });
          }

          // Map status
          let status: DockerStatus = "unknown";
          const stateStr = (data.State || "").toLowerCase();
          if (stateStr === "running") status = "running";
          else if (stateStr === "exited") status = "exited";
          else if (stateStr === "paused") status = "paused";
          else if (stateStr === "restarting") status = "restarting";
          else if (stateStr === "dead") status = "dead";
          else if (stateStr === "created") status = "created";

          containers.push({
            id: data.ID,
            name: data.Names,
            image: data.Image,
            status,
            state: data.State,
            ports,
            created: data.CreatedAt,
            labels: {}, // Would need inspect for full labels
          });
        } catch {
          // Skip malformed lines
        }
      }

      // Filter by project if specified
      if (projectId) {
        // Get project name to filter containers
        const db = getDatabase();
        const project = db
          .prepare("SELECT name FROM projects WHERE id = ?")
          .get(projectId) as { name: string } | undefined;
        if (project) {
          const projectSlug = project.name.toLowerCase().replace(/\s+/g, "-");
          return containers.filter(
            (c) =>
              c.name.toLowerCase().includes(projectSlug) ||
              c.labels["com.zurto.project"] === projectId
          );
        }
      }

      return containers;
    } catch (error) {
      logger.error("Failed to list containers:", error);
      return [];
    }
  }

  /**
   * Get services from docker-compose.yml for a project
   */
  async getComposeServices(projectPath: string): Promise<DockerService[]> {
    const composePath = path.join(projectPath, "docker-compose.yml");

    if (!fs.existsSync(composePath)) {
      return [];
    }

    try {
      // Parse docker-compose.yml to get service definitions
      const composeContent = fs.readFileSync(composePath, "utf-8");
      const services: DockerService[] = [];

      // Simple YAML parsing for services
      const servicesMatch = composeContent.match(
        /services:\s*\n([\s\S]*?)(?=\n\w|$)/
      );
      if (servicesMatch) {
        const servicesBlock = servicesMatch[1];
        const serviceNames = servicesBlock.match(/^\s{2}(\w[\w-]*):/gm);

        if (serviceNames) {
          for (const match of serviceNames) {
            const name = match.trim().replace(":", "");

            // Detect service type from name
            let type: DockerService["type"] = "other";
            if (
              name.includes("frontend") ||
              name.includes("web") ||
              name.includes("client")
            ) {
              type = "frontend";
            } else if (
              name.includes("backend") ||
              name.includes("api") ||
              name.includes("server")
            ) {
              type = "backend";
            } else if (
              name.includes("db") ||
              name.includes("database") ||
              name.includes("postgres") ||
              name.includes("mysql") ||
              name.includes("mongo")
            ) {
              type = "database";
            } else if (
              name.includes("redis") ||
              name.includes("cache") ||
              name.includes("memcache")
            ) {
              type = "cache";
            } else if (name.includes("worker") || name.includes("queue")) {
              type = "worker";
            } else if (
              name.includes("gateway") ||
              name.includes("proxy") ||
              name.includes("nginx") ||
              name.includes("caddy")
            ) {
              type = "gateway";
            }

            // Get port from port_allocations
            const db = getDatabase();
            const portAlloc = db
              .prepare(
                "SELECT port FROM port_allocations WHERE service_name = ? AND status != 'released'"
              )
              .get(name) as { port: number } | undefined;

            services.push({
              id: name,
              name,
              displayName: this.formatServiceName(name),
              projectId: "", // Will be filled by caller
              type,
              status: "unknown",
              port: portAlloc?.port,
            });
          }
        }
      }

      return services;
    } catch (error) {
      logger.error("Failed to parse docker-compose.yml:", error);
      return [];
    }
  }

  /**
   * Get all services for a project (from DB + Docker)
   */
  async getProjectServices(projectId: string): Promise<DockerService[]> {
    const db = getDatabase();

    // Get project info
    const project = db
      .prepare("SELECT * FROM projects WHERE id = ?")
      .get(projectId) as any;
    if (!project) {
      return [];
    }

    // Get nodes that are services
    const nodes = db
      .prepare(
        `
      SELECT * FROM nodes 
      WHERE project_id = ? 
      AND type IN ('frontend', 'backend', 'database', 'worker', 'gateway', 'service')
    `
      )
      .all(projectId) as any[];

    // Get port allocations
    const portAllocations = db
      .prepare("SELECT * FROM port_allocations WHERE project_id = ?")
      .all(projectId) as any[];

    const portMap = new Map(portAllocations.map((p) => [p.service_name, p]));

    // Get container statuses
    const containers = await this.listContainers(projectId);
    const containerMap = new Map(containers.map((c) => [c.name, c]));

    // Build service list
    const services: DockerService[] = [];

    for (const node of nodes) {
      const serviceName = node.name.toLowerCase().replace(/\s+/g, "-");
      const container = containerMap.get(serviceName);
      const portAlloc = portMap.get(serviceName);

      services.push({
        id: node.id,
        name: serviceName,
        displayName: node.name,
        projectId,
        type: node.type,
        status: container?.status || "stopped",
        port: portAlloc?.port || node.port,
        containerId: container?.id,
        image: container?.image,
        sourcePath: node.source_path,
      });
    }

    return services;
  }

  // ============================================
  // CONTAINER CONTROL
  // ============================================

  /**
   * Start a container
   */
  async startService(
    serviceName: string,
    projectPath?: string
  ): Promise<{ success: boolean; output: string }> {
    if (!(await this.isAvailable())) {
      return { success: false, output: "Docker not available" };
    }

    try {
      if (
        projectPath &&
        fs.existsSync(path.join(projectPath, "docker-compose.yml"))
      ) {
        // Use docker compose
        const { stdout, stderr } = await execAsync(
          `docker compose -f "${path.join(projectPath, "docker-compose.yml")}" start ${serviceName}`,
          { cwd: projectPath, timeout: 60000 }
        );
        logger.info(`✅ Started service: ${serviceName}`);
        return { success: true, output: stdout + stderr };
      } else {
        // Direct container start
        const { stdout, stderr } = await execAsync(
          `docker start ${serviceName}`,
          { timeout: 30000 }
        );
        logger.info(`✅ Started container: ${serviceName}`);
        return { success: true, output: stdout + stderr };
      }
    } catch (error: any) {
      logger.error(`Failed to start ${serviceName}:`, error);
      return { success: false, output: error.stderr || error.message };
    }
  }

  /**
   * Stop a container
   */
  async stopService(
    serviceName: string,
    projectPath?: string
  ): Promise<{ success: boolean; output: string }> {
    if (!(await this.isAvailable())) {
      return { success: false, output: "Docker not available" };
    }

    try {
      if (
        projectPath &&
        fs.existsSync(path.join(projectPath, "docker-compose.yml"))
      ) {
        const { stdout, stderr } = await execAsync(
          `docker compose -f "${path.join(projectPath, "docker-compose.yml")}" stop ${serviceName}`,
          { cwd: projectPath, timeout: 60000 }
        );
        logger.info(`✅ Stopped service: ${serviceName}`);
        return { success: true, output: stdout + stderr };
      } else {
        const { stdout, stderr } = await execAsync(
          `docker stop ${serviceName}`,
          { timeout: 30000 }
        );
        logger.info(`✅ Stopped container: ${serviceName}`);
        return { success: true, output: stdout + stderr };
      }
    } catch (error: any) {
      logger.error(`Failed to stop ${serviceName}:`, error);
      return { success: false, output: error.stderr || error.message };
    }
  }

  /**
   * Restart a container
   */
  async restartService(
    serviceName: string,
    projectPath?: string
  ): Promise<{ success: boolean; output: string }> {
    if (!(await this.isAvailable())) {
      return { success: false, output: "Docker not available" };
    }

    try {
      if (
        projectPath &&
        fs.existsSync(path.join(projectPath, "docker-compose.yml"))
      ) {
        const { stdout, stderr } = await execAsync(
          `docker compose -f "${path.join(projectPath, "docker-compose.yml")}" restart ${serviceName}`,
          { cwd: projectPath, timeout: 120000 }
        );
        logger.info(`✅ Restarted service: ${serviceName}`);
        return { success: true, output: stdout + stderr };
      } else {
        const { stdout, stderr } = await execAsync(
          `docker restart ${serviceName}`,
          { timeout: 60000 }
        );
        logger.info(`✅ Restarted container: ${serviceName}`);
        return { success: true, output: stdout + stderr };
      }
    } catch (error: any) {
      logger.error(`Failed to restart ${serviceName}:`, error);
      return { success: false, output: error.stderr || error.message };
    }
  }

  /**
   * Rebuild and restart a service
   */
  async rebuildService(
    serviceName: string,
    projectPath: string,
    noCache: boolean = true
  ): Promise<{ success: boolean; output: string }> {
    if (!(await this.isAvailable())) {
      return { success: false, output: "Docker not available" };
    }

    const composePath = path.join(projectPath, "docker-compose.yml");
    if (!fs.existsSync(composePath)) {
      return { success: false, output: "docker-compose.yml not found" };
    }

    try {
      let output = "";

      // Build
      const cacheFlag = noCache ? "--no-cache" : "";
      logger.info(`🔨 Building ${serviceName}...`);
      const { stdout: buildOut, stderr: buildErr } = await execAsync(
        `docker compose -f "${composePath}" build ${cacheFlag} ${serviceName}`,
        { cwd: projectPath, timeout: 600000 } // 10 min for builds
      );
      output += buildOut + buildErr;

      // Recreate and start
      logger.info(`🚀 Starting ${serviceName}...`);
      const { stdout: upOut, stderr: upErr } = await execAsync(
        `docker compose -f "${composePath}" up -d --force-recreate ${serviceName}`,
        { cwd: projectPath, timeout: 120000 }
      );
      output += upOut + upErr;

      logger.info(`✅ Rebuilt and started: ${serviceName}`);
      return { success: true, output };
    } catch (error: any) {
      logger.error(`Failed to rebuild ${serviceName}:`, error);
      return { success: false, output: error.stderr || error.message };
    }
  }

  // ============================================
  // LOGS & STATS
  // ============================================

  /**
   * Get container logs
   */
  async getLogs(
    serviceName: string,
    projectPath?: string,
    tail: number = 100
  ): Promise<{ success: boolean; logs: LogEntry[] }> {
    if (!(await this.isAvailable())) {
      return { success: false, logs: [] };
    }

    try {
      let command: string;

      if (
        projectPath &&
        fs.existsSync(path.join(projectPath, "docker-compose.yml"))
      ) {
        command = `docker compose -f "${path.join(projectPath, "docker-compose.yml")}" logs --tail ${tail} --timestamps ${serviceName}`;
      } else {
        command = `docker logs --tail ${tail} --timestamps ${serviceName}`;
      }

      const { stdout, stderr } = await execAsync(command, {
        timeout: 30000,
        maxBuffer: 10 * 1024 * 1024, // 10MB
      });

      const allOutput = stdout + stderr;
      const logs: LogEntry[] = [];

      for (const line of allOutput.split("\n")) {
        if (!line.trim()) continue;

        // Parse timestamp and message
        const match = line.match(
          /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z?)\s*(.*)/
        );
        if (match) {
          logs.push({
            timestamp: match[1],
            stream: line.includes("stderr") ? "stderr" : "stdout",
            message: match[2],
          });
        } else {
          logs.push({
            timestamp: new Date().toISOString(),
            stream: "stdout",
            message: line,
          });
        }
      }

      return { success: true, logs };
    } catch (error: any) {
      logger.error(`Failed to get logs for ${serviceName}:`, error);
      return { success: false, logs: [] };
    }
  }

  /**
   * Get real-time container stats
   */
  async getStats(serviceName: string): Promise<ResourceStats | null> {
    if (!(await this.isAvailable())) {
      return null;
    }

    try {
      const { stdout } = await execAsync(
        `docker stats ${serviceName} --no-stream --format "{{json .}}"`,
        { timeout: 10000 }
      );

      const data = JSON.parse(stdout.trim());

      // Parse CPU percentage
      const cpuPercent =
        parseFloat((data.CPUPerc || "0%").replace("%", "")) || 0;

      // Parse memory (e.g., "123MiB / 2GiB")
      const memMatch = (data.MemUsage || "").match(
        /([\d.]+)([A-Za-z]+)\s*\/\s*([\d.]+)([A-Za-z]+)/
      );
      let memoryUsage = 0;
      let memoryLimit = 0;

      if (memMatch) {
        memoryUsage = this.parseMemory(parseFloat(memMatch[1]), memMatch[2]);
        memoryLimit = this.parseMemory(parseFloat(memMatch[3]), memMatch[4]);
      }

      const memoryPercent =
        parseFloat((data.MemPerc || "0%").replace("%", "")) || 0;

      // Parse network I/O
      const netMatch = (data.NetIO || "").match(
        /([\d.]+)([A-Za-z]+)\s*\/\s*([\d.]+)([A-Za-z]+)/
      );
      let networkRx = 0;
      let networkTx = 0;

      if (netMatch) {
        networkRx = this.parseBytes(parseFloat(netMatch[1]), netMatch[2]);
        networkTx = this.parseBytes(parseFloat(netMatch[3]), netMatch[4]);
      }

      // Parse block I/O
      const blockMatch = (data.BlockIO || "").match(
        /([\d.]+)([A-Za-z]+)\s*\/\s*([\d.]+)([A-Za-z]+)/
      );
      let blockRead = 0;
      let blockWrite = 0;

      if (blockMatch) {
        blockRead = this.parseBytes(parseFloat(blockMatch[1]), blockMatch[2]);
        blockWrite = this.parseBytes(parseFloat(blockMatch[3]), blockMatch[4]);
      }

      return {
        cpuPercent,
        memoryUsage,
        memoryLimit,
        memoryPercent,
        networkRx,
        networkTx,
        blockRead,
        blockWrite,
      };
    } catch (error) {
      // Container might not be running
      return null;
    }
  }

  /**
   * Stream logs in real-time (returns child process)
   */
  streamLogs(
    serviceName: string,
    projectPath?: string,
    onLog?: (entry: LogEntry) => void
  ): { kill: () => void } | null {
    let command: string;
    let args: string[];

    if (
      projectPath &&
      fs.existsSync(path.join(projectPath, "docker-compose.yml"))
    ) {
      command = "docker";
      args = [
        "compose",
        "-f",
        path.join(projectPath, "docker-compose.yml"),
        "logs",
        "-f",
        "--timestamps",
        serviceName,
      ];
    } else {
      command = "docker";
      args = ["logs", "-f", "--timestamps", serviceName];
    }

    const proc = spawn(command, args);

    const handleOutput = (data: Buffer, stream: "stdout" | "stderr") => {
      const lines = data.toString().split("\n");
      for (const line of lines) {
        if (!line.trim()) continue;
        const match = line.match(
          /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z?)\s*(.*)/
        );
        if (match && onLog) {
          onLog({
            timestamp: match[1],
            stream,
            message: match[2],
          });
        } else if (onLog) {
          onLog({
            timestamp: new Date().toISOString(),
            stream,
            message: line,
          });
        }
      }
    };

    proc.stdout.on("data", (data) => handleOutput(data, "stdout"));
    proc.stderr.on("data", (data) => handleOutput(data, "stderr"));

    return {
      kill: () => proc.kill(),
    };
  }

  // ============================================
  // DOCKERFILE GENERATION
  // ============================================

  /**
   * Generate a Dockerfile for a service type
   */
  generateDockerfile(
    type: DockerService["type"],
    options: {
      nodeVersion?: string;
      pythonVersion?: string;
      port?: number;
      entryPoint?: string;
      buildCommand?: string;
      installCommand?: string;
    } = {}
  ): string {
    const nodeVersion = options.nodeVersion || "20-alpine";
    const pythonVersion = options.pythonVersion || "3.11-slim";
    const port = options.port || 3000;

    switch (type) {
      case "frontend":
        return `# Frontend Dockerfile
FROM node:${nodeVersion} AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN ${options.buildCommand || "npm run build"}

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf 2>/dev/null || true

EXPOSE ${port}
CMD ["nginx", "-g", "daemon off;"]
`;

      case "backend":
        return `# Backend Dockerfile
FROM node:${nodeVersion}

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN ${options.installCommand || "npm ci --only=production"}

# Copy source
COPY . .

# Build if TypeScript
RUN npm run build 2>/dev/null || true

EXPOSE ${port}

CMD ["node", "${options.entryPoint || "dist/index.js"}"]
`;

      case "database":
        return `# Database Dockerfile (PostgreSQL)
FROM postgres:15-alpine

ENV POSTGRES_DB=zurto
ENV POSTGRES_USER=zurto
ENV POSTGRES_PASSWORD=zurto_secret

COPY init.sql /docker-entrypoint-initdb.d/ 2>/dev/null || true

EXPOSE 5432
`;

      case "cache":
        return `# Cache Dockerfile (Redis)
FROM redis:7-alpine

COPY redis.conf /usr/local/etc/redis/redis.conf 2>/dev/null || true

EXPOSE 6379

CMD ["redis-server"]
`;

      case "worker":
        return `# Worker Dockerfile
FROM node:${nodeVersion}

WORKDIR /app

COPY package*.json ./
RUN ${options.installCommand || "npm ci --only=production"}

COPY . .
RUN npm run build 2>/dev/null || true

CMD ["node", "${options.entryPoint || "dist/worker.js"}"]
`;

      case "gateway":
        return `# Gateway Dockerfile (Caddy)
FROM caddy:2-alpine

COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 80 443

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]
`;

      default:
        return `# Generic Service Dockerfile
FROM node:${nodeVersion}

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build 2>/dev/null || true

EXPOSE ${port}

CMD ["npm", "start"]
`;
    }
  }

  /**
   * Generate docker-compose.yml for a project
   */
  generateDockerCompose(
    projectName: string,
    services: Array<{
      name: string;
      type: DockerService["type"];
      port?: number;
      envVars?: Record<string, string>;
      volumes?: string[];
      dependsOn?: string[];
    }>
  ): string {
    const projectSlug = projectName.toLowerCase().replace(/\s+/g, "-");

    let compose = `version: "3.8"

services:
`;

    for (const service of services) {
      const serviceName = service.name.toLowerCase().replace(/\s+/g, "-");

      compose += `  ${serviceName}:
    build:
      context: ./${serviceName}
      dockerfile: Dockerfile
    container_name: ${projectSlug}-${serviceName}
    restart: unless-stopped
`;

      if (service.port) {
        compose += `    ports:
      - "${service.port}:${service.port}"
`;
      }

      if (service.envVars && Object.keys(service.envVars).length > 0) {
        compose += `    environment:
`;
        for (const [key, value] of Object.entries(service.envVars)) {
          compose += `      - ${key}=${value}
`;
        }
      }

      if (service.volumes && service.volumes.length > 0) {
        compose += `    volumes:
`;
        for (const vol of service.volumes) {
          compose += `      - ${vol}
`;
        }
      }

      if (service.dependsOn && service.dependsOn.length > 0) {
        compose += `    depends_on:
`;
        for (const dep of service.dependsOn) {
          compose += `      - ${dep}
`;
        }
      }

      compose += `    labels:
      - "com.zurto.project=${projectSlug}"
      - "com.zurto.service=${serviceName}"

`;
    }

    compose += `networks:
  default:
    name: ${projectSlug}-network

volumes:
  ${projectSlug}-data:
`;

    return compose;
  }

  // ============================================
  // HELPERS
  // ============================================

  private formatServiceName(name: string): string {
    return name
      .split(/[-_]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  private parseMemory(value: number, unit: string): number {
    switch (unit.toLowerCase()) {
      case "b":
        return value / (1024 * 1024);
      case "kib":
      case "kb":
        return value / 1024;
      case "mib":
      case "mb":
        return value;
      case "gib":
      case "gb":
        return value * 1024;
      default:
        return value;
    }
  }

  private parseBytes(value: number, unit: string): number {
    switch (unit.toLowerCase()) {
      case "b":
        return value;
      case "kib":
      case "kb":
        return value * 1024;
      case "mib":
      case "mb":
        return value * 1024 * 1024;
      case "gib":
      case "gb":
        return value * 1024 * 1024 * 1024;
      default:
        return value;
    }
  }
}

// Export singleton
export const dockerManager = DockerManager.getInstance();
