/**
 * Code Generation Agent
 *
 * Uses Copilot Bridge to generate project code from planning documents
 * Creates actual source files in /data/teamName/projectName/ structure
 */

import { logger } from "../utils/logger.js";
import { getCopilotBridge } from "./copilot-bridge-client.js";
import * as fs from "fs";
import * as path from "path";

export interface CodeGenerationRequest {
  projectId: string;
  projectName: string;
  teamName?: string;
  projectPath?: string; // Use existing path if provided
  planningDocuments: Array<{
    filename: string;
    content: string;
    type: string;
  }>;
  suggestedNodes: Array<{
    name: string;
    type: string;
    description: string;
    techStack: string[];
    dependencies: string[];
  }>;
  projectStructure: {
    folders: string[];
    entryPoints: Record<string, string>;
  };
}

export interface GeneratedFile {
  path: string;
  content: string;
  type: "source" | "config" | "docker" | "docs" | "test";
  language?: string;
}

export interface CodeGenerationResult {
  success: boolean;
  projectPath: string;
  generatedFiles: GeneratedFile[];
  dockerCompose: string;
  nodeConfigs: Array<{
    nodeId: string;
    name: string;
    type: string;
    dockerfile: string;
    entryPoint: string;
    port?: number;
  }>;
  progressLog: string[]; // Log of progress messages for UI display
}

export class CodeGenerationAgent {
  private dataPath: string;
  private progressLog: string[] = [];

  constructor() {
    this.dataPath = process.env.DATA_PATH || "/app/data";
  }

  /**
   * Log progress message for UI display
   */
  private logProgress(message: string): void {
    const timestamp = new Date().toISOString().split("T")[1].split(".")[0];
    const logLine = `[${timestamp}] ${message}`;
    this.progressLog.push(logLine);
    logger.info(`[CodeGenerationAgent] ${message}`);
  }

  /**
   * Generate complete project code from planning documents
   */
  async generateProjectCode(
    request: CodeGenerationRequest
  ): Promise<CodeGenerationResult> {
    // Reset progress log for this run
    this.progressLog = [];

    try {
      this.logProgress(
        `🚀 Starting code generation for: ${request.projectName}`
      );

      // Get fresh bridge connection
      const bridge = getCopilotBridge();
      if (!bridge) {
        this.logProgress(
          "⚠️ Copilot Bridge not available, using boilerplate fallback"
        );
      } else {
        // Check if bridge is healthy
        const isAvailable = await bridge.isAvailable();
        if (!isAvailable) {
          this.logProgress(
            "⚠️ Copilot Bridge not responding, using boilerplate fallback"
          );
        } else {
          this.logProgress("✅ Copilot Bridge connected successfully");
        }
      }

      // Use existing project path or create new one
      const teamName = request.teamName || "default";
      const projectPath =
        request.projectPath ||
        path.join(
          this.dataPath,
          "projects",
          teamName,
          this.sanitizeName(request.projectName)
        );

      logger.info(`[CodeGenerationAgent] Using project path: ${projectPath}`);

      // Ensure directories exist
      await this.ensureDirectories(
        projectPath,
        request.projectStructure.folders
      );

      // Generate code for each node type
      const generatedFiles: GeneratedFile[] = [];
      const nodeConfigs: CodeGenerationResult["nodeConfigs"] = [];

      // If no suggested nodes, analyze planning docs to determine what to build
      let nodesToGenerate = request.suggestedNodes || [];
      if (
        nodesToGenerate.length === 0 &&
        request.planningDocuments.length > 0
      ) {
        this.logProgress("📋 Analyzing planning documents to extract nodes...");
        nodesToGenerate = await this.analyzeDocsForNodes(
          request.planningDocuments
        );
        this.logProgress(
          `📦 Found ${nodesToGenerate.length} node(s) to generate: ${nodesToGenerate.map((n) => n.name).join(", ")}`
        );
      }

      // Generate code for each suggested node
      for (let i = 0; i < nodesToGenerate.length; i++) {
        const node = nodesToGenerate[i];
        this.logProgress(
          `\n🔧 [${i + 1}/${nodesToGenerate.length}] Generating code for node: ${node.name}`
        );

        const nodeFiles = await this.generateNodeCodeOneByOne(
          request,
          node,
          projectPath
        );
        generatedFiles.push(...nodeFiles);

        // Generate Dockerfile for this node
        this.logProgress(`🐳 Generating Dockerfile for ${node.name}`);
        const dockerfile = await this.generateDockerfile(node);
        const dockerfilePath = path.join(
          projectPath,
          "docker",
          `Dockerfile.${this.sanitizeName(node.name)}`
        );
        await this.writeFile(dockerfilePath, dockerfile);
        generatedFiles.push({
          path: dockerfilePath,
          content: dockerfile,
          type: "docker",
        });

        nodeConfigs.push({
          nodeId: this.sanitizeName(node.name),
          name: node.name,
          type: node.type,
          dockerfile: `docker/Dockerfile.${this.sanitizeName(node.name)}`,
          entryPoint:
            request.projectStructure.entryPoints[node.type] ||
            `${node.type}/src/index.ts`,
          port: this.assignPort(node.type, nodeConfigs.length),
        });
      }

      // Generate docker-compose.yml
      const dockerCompose = await this.generateDockerCompose(
        request,
        nodeConfigs
      );
      const dockerComposePath = path.join(projectPath, "docker-compose.yml");
      await this.writeFile(dockerComposePath, dockerCompose);
      generatedFiles.push({
        path: dockerComposePath,
        content: dockerCompose,
        type: "docker",
      });

      // Copy planning documents to docs folder
      for (const doc of request.planningDocuments) {
        const docPath = path.join(projectPath, "docs", doc.filename);
        await this.writeFile(docPath, doc.content);
        generatedFiles.push({
          path: docPath,
          content: doc.content,
          type: "docs",
        });
      }

      // Generate root README.md
      this.logProgress("📄 Generating project README.md");
      const readme = this.generateRootReadme(request, nodeConfigs);
      const readmePath = path.join(projectPath, "README.md");
      await this.writeFile(readmePath, readme);
      generatedFiles.push({
        path: readmePath,
        content: readme,
        type: "docs",
      });

      // Generate .env.example
      this.logProgress("⚙️ Generating .env.example");
      const envExample = this.generateEnvExample(request, nodeConfigs);
      const envPath = path.join(projectPath, ".env.example");
      await this.writeFile(envPath, envExample);
      generatedFiles.push({
        path: envPath,
        content: envExample,
        type: "config",
      });

      this.logProgress(
        `\n✅ Code generation complete! Generated ${generatedFiles.length} files`
      );

      // Strip content from files to avoid serialization issues - only return paths
      const strippedFiles = generatedFiles.map((f) => ({
        path: f.path,
        type: f.type,
        language: f.language,
      }));

      return {
        success: true,
        projectPath,
        generatedFiles: strippedFiles as GeneratedFile[],
        dockerCompose,
        nodeConfigs,
        progressLog: this.progressLog,
      };
    } catch (error) {
      // Safely extract error message to avoid serialization issues
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "string"
            ? error
            : "Code generation failed";
      this.logProgress(`❌ Error: ${errorMessage}`);
      throw new Error(errorMessage);
    }
  }

  /**
   * Generate code for a specific node
   */
  private async generateNodeCode(
    request: CodeGenerationRequest,
    node: {
      name: string;
      type: string;
      description: string;
      techStack: string[];
      dependencies: string[];
    },
    projectPath: string
  ): Promise<GeneratedFile[]> {
    const systemPrompt = `You are an expert code generator. Generate production-ready source code for a ${node.type} service.

The code should be:
- Clean, well-organized, and follow best practices
- Include proper error handling
- Have TypeScript types where applicable
- Be ready to run in a Docker container
- Follow the tech stack specified

Tech Stack: ${node.techStack.join(", ")}
Description: ${node.description}`;

    const planningContext = request.planningDocuments
      .map((d) => `### ${d.filename}\n${d.content.substring(0, 2000)}`)
      .join("\n\n");

    const userPrompt = `Generate the source code files for a ${node.type} service named "${node.name}".

Project Context:
${planningContext}

Generate a JSON response with this structure:
{
  "files": [
    {
      "path": "src/index.ts",
      "content": "// Full file content here...",
      "language": "typescript"
    },
    {
      "path": "src/api/routes.ts",
      "content": "// Routes implementation...",
      "language": "typescript"
    },
    {
      "path": "package.json",
      "content": "{ ... }",
      "language": "json"
    },
    {
      "path": "tsconfig.json",
      "content": "{ ... }",
      "language": "json"
    }
  ]
}

Include all necessary files for a working ${node.type} service.
Return ONLY the JSON object.`;

    try {
      // Get fresh bridge connection for each node
      const bridge = getCopilotBridge();
      if (!bridge) {
        throw new Error("Copilot Bridge not connected");
      }

      // Verify bridge is available
      const isAvailable = await bridge.isAvailable();
      if (!isAvailable) {
        throw new Error("Copilot Bridge not responding");
      }

      const response = await bridge.chat([
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ]);

      const parsed = this.parseCodeResponse(response);
      const files: GeneratedFile[] = [];

      // Write files to disk
      for (const file of parsed.files) {
        const fullPath = path.join(
          projectPath,
          this.sanitizeName(node.name),
          file.path
        );
        await this.writeFile(fullPath, file.content);
        files.push({
          path: fullPath,
          content: file.content,
          type: "source",
          language: file.language,
        });
      }

      return files;
    } catch (error) {
      logger.error(
        `[CodeGenerationAgent] Failed to generate code for ${node.name}:`,
        error
      );
      // Return minimal boilerplate on error
      return this.generateBoilerplate(node, projectPath);
    }
  }

  /**
   * Generate code for a node ONE FILE AT A TIME
   * This prevents token limit issues and allows progress tracking
   */
  private async generateNodeCodeOneByOne(
    request: CodeGenerationRequest,
    node: {
      name: string;
      type: string;
      description: string;
      techStack: string[];
      dependencies: string[];
    },
    projectPath: string
  ): Promise<GeneratedFile[]> {
    const files: GeneratedFile[] = [];

    try {
      // Get fresh bridge connection
      const bridge = getCopilotBridge();
      if (!bridge || !(await bridge.isAvailable())) {
        this.logProgress(
          `⚠️ Copilot Bridge not available, using boilerplate for ${node.name}`
        );
        return this.generateBoilerplate(node, projectPath);
      }

      // Step 1: Get file manifest (list of files needed)
      this.logProgress(`📋 Getting file manifest for ${node.name}...`);

      const planningContext = request.planningDocuments
        .map((d) => `### ${d.filename}\n${d.content.substring(0, 3000)}`)
        .join("\n\n");

      const manifestPrompt = `You are planning the file structure for a ${node.type} service named "${node.name}".

Tech Stack: ${node.techStack.join(", ")}
Description: ${node.description}

Project Context:
${planningContext}

List ALL files needed for this service. Return a JSON object:
{
  "files": [
    { "path": "package.json", "description": "Dependencies and scripts", "language": "json" },
    { "path": "tsconfig.json", "description": "TypeScript configuration", "language": "json" },
    { "path": "src/index.ts", "description": "Main entry point", "language": "typescript" },
    { "path": "src/app.ts", "description": "Express app setup", "language": "typescript" }
  ]
}

Include all necessary files for a production-ready ${node.type} service.
Return ONLY the JSON object.`;

      const manifestResponse = await bridge.chat([
        {
          role: "system",
          content: "You are a software architect. Output only valid JSON.",
        },
        { role: "user", content: manifestPrompt },
      ]);

      let fileManifest: Array<{
        path: string;
        description: string;
        language: string;
      }> = [];
      try {
        const parsed = JSON.parse(
          manifestResponse.match(/\{[\s\S]*\}/)?.[0] || "{}"
        );
        fileManifest = parsed.files || [];
      } catch {
        // Fallback manifest for common service structure
        fileManifest = this.getDefaultFileManifest(node);
      }

      if (fileManifest.length === 0) {
        fileManifest = this.getDefaultFileManifest(node);
      }

      this.logProgress(
        `📁 Found ${fileManifest.length} files to generate for ${node.name}`
      );

      // Step 2: Generate each file one at a time
      for (let i = 0; i < fileManifest.length; i++) {
        const fileSpec = fileManifest[i];
        this.logProgress(
          `   📄 [${i + 1}/${fileManifest.length}] Generating: ${fileSpec.path}`
        );

        try {
          const fileContent = await this.generateSingleFile(
            bridge,
            node,
            fileSpec,
            planningContext,
            files // Pass already generated files for context
          );

          const fullPath = path.join(
            projectPath,
            this.sanitizeName(node.name),
            fileSpec.path
          );
          await this.writeFile(fullPath, fileContent);
          files.push({
            path: fullPath,
            content: fileContent,
            type: "source",
            language: fileSpec.language,
          });
        } catch (fileError) {
          const errorMsg =
            fileError instanceof Error ? fileError.message : "Unknown error";
          this.logProgress(
            `   ⚠️ Failed to generate ${fileSpec.path}: ${errorMsg}`
          );
          // Continue with other files
        }
      }

      this.logProgress(
        `✅ Generated ${files.length}/${fileManifest.length} files for ${node.name}`
      );
      return files;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      this.logProgress(
        `❌ Node generation failed for ${node.name}: ${errorMsg}`
      );
      return this.generateBoilerplate(node, projectPath);
    }
  }

  /**
   * Generate a single file content
   */
  private async generateSingleFile(
    bridge: any,
    node: {
      name: string;
      type: string;
      techStack: string[];
      description: string;
    },
    fileSpec: { path: string; description: string; language: string },
    planningContext: string,
    existingFiles: GeneratedFile[]
  ): Promise<string> {
    // Include context from already generated files (limited)
    const existingFilesContext = existingFiles
      .slice(-5) // Last 5 files for context
      .map((f) => `// ${f.path}\n${f.content?.substring(0, 500) || ""}`)
      .join("\n\n");

    const prompt = `Generate the complete content for file: ${fileSpec.path}

This is for a ${node.type} service named "${node.name}".
Tech Stack: ${node.techStack.join(", ")}
File purpose: ${fileSpec.description}
Language: ${fileSpec.language}

${existingFilesContext ? `\nAlready generated files for reference:\n${existingFilesContext}` : ""}

${planningContext ? `\nProject context:\n${planningContext.substring(0, 2000)}` : ""}

Requirements:
- Generate complete, production-ready code
- Include proper imports/exports
- Add helpful comments
- Follow best practices for ${fileSpec.language}

Return ONLY the file content, no markdown code blocks, no explanations.`;

    const response = await bridge.chat([
      {
        role: "system",
        content: `You are an expert ${fileSpec.language} developer. Output only the raw file content.`,
      },
      { role: "user", content: prompt },
    ]);

    // Clean up response (remove markdown code blocks if present)
    let content = response.trim();
    if (content.startsWith("```")) {
      content = content.replace(/^```\w*\n?/, "").replace(/\n?```$/, "");
    }

    return content;
  }

  /**
   * Get default file manifest for common node types
   */
  private getDefaultFileManifest(node: {
    type: string;
    techStack: string[];
  }): Array<{ path: string; description: string; language: string }> {
    const isTypescript = node.techStack.some((t) =>
      ["typescript", "ts"].includes(t.toLowerCase())
    );
    const isReact = node.techStack.some((t) =>
      ["react", "vite"].includes(t.toLowerCase())
    );
    const ext = isTypescript ? "ts" : "js";
    const extx = isTypescript ? "tsx" : "jsx";

    if (node.type === "frontend" || isReact) {
      return [
        { path: "package.json", description: "Dependencies", language: "json" },
        {
          path: "tsconfig.json",
          description: "TypeScript config",
          language: "json",
        },
        {
          path: "vite.config.ts",
          description: "Vite config",
          language: "typescript",
        },
        { path: "index.html", description: "HTML entry", language: "html" },
        {
          path: `src/main.${extx}`,
          description: "React entry",
          language: "typescript",
        },
        {
          path: `src/App.${extx}`,
          description: "Main App component",
          language: "typescript",
        },
        {
          path: "src/index.css",
          description: "Global styles",
          language: "css",
        },
      ];
    }

    // Default backend
    return [
      { path: "package.json", description: "Dependencies", language: "json" },
      {
        path: "tsconfig.json",
        description: "TypeScript config",
        language: "json",
      },
      {
        path: `src/index.${ext}`,
        description: "Entry point",
        language: isTypescript ? "typescript" : "javascript",
      },
      {
        path: `src/app.${ext}`,
        description: "Express app",
        language: isTypescript ? "typescript" : "javascript",
      },
      {
        path: `src/routes/index.${ext}`,
        description: "API routes",
        language: isTypescript ? "typescript" : "javascript",
      },
    ];
  }

  /**
   * Generate Dockerfile for a node
   */
  private async generateDockerfile(node: {
    name: string;
    type: string;
    techStack: string[];
  }): Promise<string> {
    const isNode = node.techStack.some((t) =>
      ["node", "nodejs", "typescript", "express", "react", "vite"].includes(
        t.toLowerCase()
      )
    );

    const isPython = node.techStack.some((t) =>
      ["python", "flask", "fastapi", "django"].includes(t.toLowerCase())
    );

    if (isNode) {
      return `FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

${node.type === "frontend" ? "RUN npm run build" : ""}

EXPOSE ${this.getDefaultPort(node.type)}

CMD ["npm", "start"]
`;
    }

    if (isPython) {
      return `FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE ${this.getDefaultPort(node.type)}

CMD ["python", "main.py"]
`;
    }

    // Default Node.js Dockerfile
    return `FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE ${this.getDefaultPort(node.type)}

CMD ["npm", "start"]
`;
  }

  /**
   * Generate docker-compose.yml for the project
   */
  private async generateDockerCompose(
    request: CodeGenerationRequest,
    nodeConfigs: CodeGenerationResult["nodeConfigs"]
  ): Promise<string> {
    const services: string[] = [];

    for (const config of nodeConfigs) {
      services.push(`  ${config.nodeId}:
    build:
      context: .
      dockerfile: ${config.dockerfile}
    container_name: ${this.sanitizeName(request.projectName)}-${config.nodeId}
    ports:
      - "${config.port}:${config.port}"
    environment:
      - NODE_ENV=production
      - PORT=${config.port}
    networks:
      - ${this.sanitizeName(request.projectName)}-network
    restart: unless-stopped`);
    }

    return `version: '3.8'

services:
${services.join("\n\n")}

networks:
  ${this.sanitizeName(request.projectName)}-network:
    driver: bridge
`;
  }

  /**
   * Generate root README.md
   */
  private generateRootReadme(
    request: CodeGenerationRequest,
    nodeConfigs: CodeGenerationResult["nodeConfigs"]
  ): string {
    const nodesList = nodeConfigs
      .map((n) => `- **${n.name}** (${n.type}) - Port ${n.port}`)
      .join("\n");

    return `# ${request.projectName}

Generated by Zurto Code Generation Agent

## Services

${nodesList}

## Quick Start

\`\`\`bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop all services
docker compose down
\`\`\`

## Project Structure

\`\`\`
${request.projectStructure.folders.map((f) => f).join("\n")}
\`\`\`

## Documentation

See the \`docs/\` folder for detailed documentation:
${request.planningDocuments.map((d) => `- [${d.filename}](docs/${d.filename})`).join("\n")}

## License

MIT
`;
  }

  /**
   * Generate .env.example
   */
  private generateEnvExample(
    request: CodeGenerationRequest,
    nodeConfigs: CodeGenerationResult["nodeConfigs"]
  ): string {
    const envVars: string[] = [
      "# Environment Configuration",
      `PROJECT_NAME=${request.projectName}`,
      "NODE_ENV=development",
      "",
      "# Service Ports",
    ];

    for (const config of nodeConfigs) {
      envVars.push(
        `${config.nodeId.toUpperCase().replace(/-/g, "_")}_PORT=${config.port}`
      );
    }

    envVars.push(
      "",
      "# Database (if applicable)",
      "DATABASE_URL=",
      "",
      "# API Keys",
      "API_KEY="
    );

    return envVars.join("\n");
  }

  /**
   * Generate boilerplate code on error
   */
  private async generateBoilerplate(
    node: { name: string; type: string },
    projectPath: string
  ): Promise<GeneratedFile[]> {
    const nodePath = path.join(projectPath, this.sanitizeName(node.name));
    const files: GeneratedFile[] = [];

    // Basic package.json
    const packageJson = {
      name: this.sanitizeName(node.name),
      version: "1.0.0",
      type: "module",
      scripts: {
        start: "node dist/index.js",
        dev: "tsx watch src/index.ts",
        build: "tsc",
      },
      dependencies: {
        express: "^4.18.2",
      },
      devDependencies: {
        "@types/express": "^4.17.21",
        "@types/node": "^20.10.0",
        typescript: "^5.3.0",
        tsx: "^4.6.0",
      },
    };

    await this.writeFile(
      path.join(nodePath, "package.json"),
      JSON.stringify(packageJson, null, 2)
    );
    files.push({
      path: path.join(nodePath, "package.json"),
      content: JSON.stringify(packageJson, null, 2),
      type: "config",
    });

    // Basic index.ts
    const indexTs = `import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: '${node.name}' });
});

app.listen(PORT, () => {
  console.log(\`${node.name} running on port \${PORT}\`);
});
`;

    await this.writeFile(path.join(nodePath, "src", "index.ts"), indexTs);
    files.push({
      path: path.join(nodePath, "src", "index.ts"),
      content: indexTs,
      type: "source",
      language: "typescript",
    });

    return files;
  }

  /**
   * Parse code generation response
   */
  private parseCodeResponse(response: string): {
    files: Array<{ path: string; content: string; language?: string }>;
  } {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }
      return JSON.parse(jsonMatch[0]);
    } catch {
      return { files: [] };
    }
  }

  /**
   * Ensure directories exist
   */
  private async ensureDirectories(
    basePath: string,
    folders: string[]
  ): Promise<void> {
    // Create base path
    await fs.promises.mkdir(basePath, { recursive: true });

    // Create standard folders
    const standardFolders = ["docker", "docs", "config", "scripts"];
    for (const folder of [...standardFolders, ...folders]) {
      const fullPath = path.join(basePath, folder);
      await fs.promises.mkdir(fullPath, { recursive: true });
    }
  }

  /**
   * Write file to disk
   */
  private async writeFile(filePath: string, content: string): Promise<void> {
    const dir = path.dirname(filePath);
    await fs.promises.mkdir(dir, { recursive: true });
    await fs.promises.writeFile(filePath, content, "utf-8");
  }

  /**
   * Sanitize name for file/folder use
   */
  private sanitizeName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  /**
   * Get default port for node type
   */
  private getDefaultPort(type: string): number {
    const portMap: Record<string, number> = {
      backend: 3000,
      frontend: 5173,
      api: 3001,
      database: 5432,
      cache: 6379,
      "discord-bot": 3100,
    };
    return portMap[type] || 3000;
  }

  /**
   * Assign port for node
   */
  private assignPort(type: string, index: number): number {
    const basePort = this.getDefaultPort(type);
    return basePort + index * 10;
  }

  /**
   * Analyze planning documents to extract suggested nodes/services
   */
  private async analyzeDocsForNodes(
    planningDocuments: Array<{
      filename: string;
      content: string;
      type: string;
    }>
  ): Promise<
    Array<{
      name: string;
      type: string;
      description: string;
      techStack: string[];
      dependencies: string[];
    }>
  > {
    // Combine all doc content for analysis
    const allDocsContent = planningDocuments
      .map((d) => `=== ${d.filename} ===\n${d.content}`)
      .join("\n\n");

    // Try to use Copilot to analyze (get fresh connection)
    const bridge = getCopilotBridge();
    if (bridge && (await bridge.isAvailable())) {
      try {
        logger.info(
          "[CodeGenerationAgent] Using Copilot Bridge to analyze docs"
        );
        const response = await bridge.chat([
          {
            role: "system",
            content: `You are an expert software architect. Analyze project documentation and extract the services/components that need to be built.
            
Return a JSON array of services with this structure:
{
  "nodes": [
    {
      "name": "Backend API",
      "type": "backend",
      "description": "Express.js REST API server",
      "techStack": ["typescript", "express", "prisma"],
      "dependencies": ["database"]
    }
  ]
}

Valid types: backend, frontend, api, database, discord-bot, worker, cache
Only return the JSON, no other text.`,
          },
          {
            role: "user",
            content: `Analyze this project documentation and extract the services/components to build:\n\n${allDocsContent.substring(0, 8000)}`,
          },
        ]);

        const parsed = JSON.parse(response.match(/\{[\s\S]*\}/)?.[0] || "{}");
        if (
          parsed.nodes &&
          Array.isArray(parsed.nodes) &&
          parsed.nodes.length > 0
        ) {
          logger.info(
            `[CodeGenerationAgent] AI extracted ${parsed.nodes.length} nodes from docs`
          );
          return parsed.nodes;
        }
      } catch (error) {
        logger.warn(
          "[CodeGenerationAgent] AI analysis failed, using keyword extraction:",
          error
        );
      }
    }

    // Fallback: Simple keyword-based extraction
    const nodes: Array<{
      name: string;
      type: string;
      description: string;
      techStack: string[];
      dependencies: string[];
    }> = [];

    const lowerContent = allDocsContent.toLowerCase();

    // Check for backend indicators
    if (
      lowerContent.includes("backend") ||
      lowerContent.includes("api") ||
      lowerContent.includes("server") ||
      lowerContent.includes("express") ||
      lowerContent.includes("rest")
    ) {
      nodes.push({
        name: "Backend",
        type: "backend",
        description: "Main backend API service",
        techStack: ["typescript", "express", "node.js"],
        dependencies: [],
      });
    }

    // Check for frontend indicators
    if (
      lowerContent.includes("frontend") ||
      lowerContent.includes("react") ||
      lowerContent.includes("vue") ||
      lowerContent.includes("web app") ||
      lowerContent.includes("ui") ||
      lowerContent.includes("client")
    ) {
      nodes.push({
        name: "Frontend",
        type: "frontend",
        description: "Web frontend application",
        techStack: ["typescript", "react", "vite"],
        dependencies: ["backend"],
      });
    }

    // Check for database indicators
    if (
      lowerContent.includes("database") ||
      lowerContent.includes("postgres") ||
      lowerContent.includes("mysql") ||
      lowerContent.includes("mongodb") ||
      lowerContent.includes("sqlite")
    ) {
      nodes.push({
        name: "Database",
        type: "database",
        description: "Database service",
        techStack: ["postgres"],
        dependencies: [],
      });
    }

    // Check for Discord bot indicators
    if (lowerContent.includes("discord") || lowerContent.includes("bot")) {
      nodes.push({
        name: "Discord Bot",
        type: "discord-bot",
        description: "Discord bot service",
        techStack: ["typescript", "discord.js"],
        dependencies: ["backend"],
      });
    }

    // If nothing found, create a basic backend
    if (nodes.length === 0) {
      nodes.push({
        name: "App",
        type: "backend",
        description: "Main application service",
        techStack: ["typescript", "node.js"],
        dependencies: [],
      });
    }

    logger.info(
      `[CodeGenerationAgent] Keyword extraction found ${nodes.length} nodes`
    );
    return nodes;
  }
}

export const codeGenerationAgent = new CodeGenerationAgent();
