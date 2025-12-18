import { claudeAgent } from "./claude-agent.js";
import { logger } from "../utils/logger.js";

/**
 * Task Generator
 * Converts AI recommendations into actionable planning tasks
 */

export interface GeneratedTask {
  title: string;
  description: string;
  priority: "critical" | "high" | "medium" | "low";
  estimatedHours: number;
  category:
    | "setup"
    | "development"
    | "testing"
    | "deployment"
    | "documentation";
  assignee?: string;
  dependencies?: string[];
}

export class TaskGenerator {
  /**
   * Generate tasks from AI analysis
   */
  async generateTasksFromAnalysis(analysis: {
    insights: string;
    recommendations: string[];
    techStack: Record<string, string[]>;
    estimatedComplexity: string;
    projectName: string;
  }): Promise<GeneratedTask[]> {
    try {
      logger.info(
        `📋 Generating planning tasks for project: ${analysis.projectName}`
      );

      // Get AI-generated tasks
      const aiTasks = await claudeAgent.generateTasks(analysis);

      // Convert to internal task format
      const tasks = this.enrichTasks(aiTasks, analysis);

      logger.info(`✅ Generated ${tasks.length} planning tasks`);

      return tasks;
    } catch (error) {
      logger.error("❌ Failed to generate tasks:", error);
      throw error;
    }
  }

  /**
   * Enrich AI-generated tasks with additional data
   */
  private enrichTasks(
    aiTasks: Array<{
      title: string;
      description: string;
      priority: string;
      estimatedHours: number;
      category: string;
    }>,
    analysis: {
      estimatedComplexity: string;
      techStack: Record<string, string[]>;
    }
  ): GeneratedTask[] {
    return aiTasks.map((task, index) => ({
      ...task,
      priority:
        (task.priority as "critical" | "high" | "medium" | "low") || "medium",
      category: (task.category as GeneratedTask["category"]) || "development",
      dependencies: this.calculateDependencies(
        task,
        index,
        aiTasks,
        analysis.estimatedComplexity
      ),
    }));
  }

  /**
   * Calculate task dependencies based on category and complexity
   */
  private calculateDependencies(
    task: {
      title: string;
      category: string;
    },
    index: number,
    allTasks: Array<{
      title: string;
      category: string;
    }>,
    complexity: string
  ): string[] {
    const dependencies: string[] = [];

    // Setup tasks must complete before development
    if (task.category === "development") {
      const setupTasks = allTasks
        .filter((t) => t.category === "setup")
        .slice(0, index);
      if (setupTasks.length > 0) {
        dependencies.push(setupTasks[setupTasks.length - 1].title);
      }
    }

    // Development before testing
    if (task.category === "testing") {
      const devTasks = allTasks
        .filter((t) => t.category === "development")
        .slice(0, index);
      if (devTasks.length > 0) {
        dependencies.push(devTasks[devTasks.length - 1].title);
      }
    }

    // Testing before deployment
    if (task.category === "deployment") {
      const testTasks = allTasks
        .filter((t) => t.category === "testing")
        .slice(0, index);
      if (testTasks.length > 0) {
        dependencies.push(testTasks[testTasks.length - 1].title);
      }
    }

    return dependencies;
  }

  /**
   * Create tasks optimized for low complexity projects
   */
  createLowComplexityTasks(
    techStack: Record<string, string[]>
  ): GeneratedTask[] {
    const tasks: GeneratedTask[] = [
      {
        title: "Project Setup & Configuration",
        description:
          "Initialize project repository and development environment",
        priority: "critical",
        estimatedHours: 2,
        category: "setup",
      },
      {
        title: "Basic Frontend Scaffolding",
        description: `Set up basic frontend structure with ${(techStack.frontend || [])[0] || "React"}`,
        priority: "high",
        estimatedHours: 4,
        category: "development",
        dependencies: ["Project Setup & Configuration"],
      },
      {
        title: "API Endpoint Development",
        description: `Create core API endpoints using ${(techStack.backend || [])[0] || "Node.js"}`,
        priority: "high",
        estimatedHours: 6,
        category: "development",
        dependencies: ["Project Setup & Configuration"],
      },
      {
        title: "Database Schema Design",
        description: `Design and implement ${(techStack.database || [])[0] || "database"} schema`,
        priority: "high",
        estimatedHours: 4,
        category: "development",
      },
      {
        title: "Local Testing & Debugging",
        description: "Comprehensive local testing of all components",
        priority: "high",
        estimatedHours: 4,
        category: "testing",
        dependencies: [
          "API Endpoint Development",
          "Basic Frontend Scaffolding",
        ],
      },
      {
        title: "Deployment Documentation",
        description: "Document deployment procedure and architecture",
        priority: "medium",
        estimatedHours: 2,
        category: "documentation",
      },
    ];

    return tasks;
  }

  /**
   * Create tasks optimized for medium complexity projects
   */
  createMediumComplexityTasks(
    techStack: Record<string, string[]>
  ): GeneratedTask[] {
    const tasks: GeneratedTask[] = [
      {
        title: "Project Architecture Planning",
        description: "Design detailed architecture and component structure",
        priority: "critical",
        estimatedHours: 4,
        category: "setup",
      },
      {
        title: "Development Environment Setup",
        description: "Set up Docker, CI/CD, and development tools",
        priority: "critical",
        estimatedHours: 6,
        category: "setup",
        dependencies: ["Project Architecture Planning"],
      },
      {
        title: "Frontend Component Library",
        description: `Build reusable component library with ${(techStack.frontend || [])[0] || "React"}`,
        priority: "high",
        estimatedHours: 12,
        category: "development",
        dependencies: ["Development Environment Setup"],
      },
      {
        title: "Backend API Architecture",
        description: `Design and implement RESTful API with ${(techStack.backend || [])[0] || "Node.js"}`,
        priority: "high",
        estimatedHours: 16,
        category: "development",
        dependencies: ["Development Environment Setup"],
      },
      {
        title: "Database Design & Migration",
        description: `Design and optimize ${(techStack.database || [])[0] || "database"} schema`,
        priority: "high",
        estimatedHours: 8,
        category: "development",
        dependencies: ["Backend API Architecture"],
      },
      {
        title: "API Integration Testing",
        description: "Test all API endpoints with comprehensive test suite",
        priority: "high",
        estimatedHours: 8,
        category: "testing",
        dependencies: ["Backend API Architecture"],
      },
      {
        title: "Frontend UI Testing",
        description: "Test all UI components and user flows",
        priority: "high",
        estimatedHours: 8,
        category: "testing",
        dependencies: ["Frontend Component Library"],
      },
      {
        title: "Performance Optimization",
        description: "Profile and optimize application performance",
        priority: "medium",
        estimatedHours: 6,
        category: "testing",
        dependencies: ["API Integration Testing", "Frontend UI Testing"],
      },
      {
        title: "Security Audit & Hardening",
        description: "Conduct security review and implement hardening measures",
        priority: "high",
        estimatedHours: 6,
        category: "development",
      },
      {
        title: "Documentation & API Docs",
        description: "Write comprehensive documentation and API specifications",
        priority: "medium",
        estimatedHours: 6,
        category: "documentation",
      },
      {
        title: "Staging Deployment",
        description: `Deploy to staging environment and verify against ${(techStack.deployment || [])[0] || "target platform"}`,
        priority: "high",
        estimatedHours: 4,
        category: "deployment",
        dependencies: [
          "Performance Optimization",
          "Security Audit & Hardening",
        ],
      },
      {
        title: "Production Deployment",
        description: "Final production deployment and monitoring setup",
        priority: "critical",
        estimatedHours: 4,
        category: "deployment",
        dependencies: ["Staging Deployment"],
      },
    ];

    return tasks;
  }

  /**
   * Create tasks optimized for high complexity projects
   */
  createHighComplexityTasks(
    techStack: Record<string, string[]>
  ): GeneratedTask[] {
    const tasks: GeneratedTask[] = [
      {
        title: "Enterprise Architecture Design",
        description: "Design scalable, enterprise-grade architecture",
        priority: "critical",
        estimatedHours: 8,
        category: "setup",
      },
      {
        title: "Infrastructure as Code Setup",
        description:
          "Set up IaC with Terraform/CloudFormation and container orchestration",
        priority: "critical",
        estimatedHours: 12,
        category: "setup",
        dependencies: ["Enterprise Architecture Design"],
      },
      {
        title: "CI/CD Pipeline Implementation",
        description: "Implement comprehensive CI/CD with automated testing",
        priority: "critical",
        estimatedHours: 10,
        category: "setup",
        dependencies: ["Infrastructure as Code Setup"],
      },
      {
        title: "Microservices Architecture",
        description: `Design and implement microservices using ${(techStack.backend || [])[0] || "Node.js"}`,
        priority: "critical",
        estimatedHours: 24,
        category: "development",
        dependencies: ["Enterprise Architecture Design"],
      },
      {
        title: "Advanced Frontend Architecture",
        description: `Build scalable frontend with ${(techStack.frontend || [])[0] || "React"}, state management`,
        priority: "high",
        estimatedHours: 20,
        category: "development",
        dependencies: ["Enterprise Architecture Design"],
      },
      {
        title: "Database Optimization & Sharding",
        description: `Advanced ${(techStack.database || [])[0] || "database"} design with sharding and replication`,
        priority: "high",
        estimatedHours: 16,
        category: "development",
        dependencies: ["Microservices Architecture"],
      },
      {
        title: "Caching Layer Implementation",
        description: "Implement Redis/Memcached caching strategy",
        priority: "high",
        estimatedHours: 8,
        category: "development",
        dependencies: ["Database Optimization & Sharding"],
      },
      {
        title: "Message Queue System",
        description: "Implement RabbitMQ/Kafka for asynchronous processing",
        priority: "high",
        estimatedHours: 10,
        category: "development",
        dependencies: ["Microservices Architecture"],
      },
      {
        title: "Comprehensive Integration Testing",
        description: "Test all microservices and integrations",
        priority: "high",
        estimatedHours: 16,
        category: "testing",
        dependencies: ["Microservices Architecture"],
      },
      {
        title: "Performance & Load Testing",
        description: "Conduct load testing and optimize for scale",
        priority: "high",
        estimatedHours: 12,
        category: "testing",
        dependencies: ["Comprehensive Integration Testing"],
      },
      {
        title: "Security & Compliance Audit",
        description: "Enterprise security audit and compliance verification",
        priority: "critical",
        estimatedHours: 12,
        category: "testing",
      },
      {
        title: "Monitoring & Observability",
        description: "Implement comprehensive monitoring, logging, and tracing",
        priority: "high",
        estimatedHours: 8,
        category: "development",
      },
      {
        title: "Disaster Recovery Planning",
        description: "Design and test disaster recovery procedures",
        priority: "high",
        estimatedHours: 6,
        category: "testing",
      },
      {
        title: "Enterprise Documentation",
        description: "Write enterprise-grade documentation and runbooks",
        priority: "high",
        estimatedHours: 12,
        category: "documentation",
      },
      {
        title: "Staging Environment Validation",
        description: "Full staging environment deployment and validation",
        priority: "critical",
        estimatedHours: 8,
        category: "deployment",
        dependencies: [
          "Security & Compliance Audit",
          "Monitoring & Observability",
        ],
      },
      {
        title: "Gradual Production Rollout",
        description: "Phased production rollout with canary deployments",
        priority: "critical",
        estimatedHours: 6,
        category: "deployment",
        dependencies: ["Staging Environment Validation"],
      },
    ];

    return tasks;
  }
}

// Export singleton instance
export const taskGenerator = new TaskGenerator();
