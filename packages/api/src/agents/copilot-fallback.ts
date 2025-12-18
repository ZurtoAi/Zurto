import { logger } from "../utils/logger.js";

/**
 * Copilot Fallback Service
 *
 * Provides fallback responses when VS Code Copilot is not available.
 * Real AI functionality is handled client-side via copilot-bridge.
 */

export interface FallbackResponse {
  text: string;
  metadata?: {
    isFallback: boolean;
    note: string;
  };
}

export class CopilotFallback {
  /**
   * Generate fallback suggestions for a project
   */
  async getSuggestions(params: {
    projectName: string;
    projectType: string;
    complexity: string;
    currentTechStack: string[];
  }): Promise<
    Array<{
      title: string;
      description: string;
      priority: string;
      category: string;
    }>
  > {
    logger.info(
      `[CopilotFallback] Generating suggestions for ${params.projectName}`
    );

    // Return template suggestions based on project type
    const suggestions = [
      {
        title: "Define Project Architecture",
        description: `Set up the core architecture for your ${params.projectType} project`,
        priority: "high",
        category: "architecture",
      },
      {
        title: "Create Component Structure",
        description: "Organize your components in a scalable folder structure",
        priority: "high",
        category: "structure",
      },
      {
        title: "Set Up Testing Framework",
        description:
          "Configure testing tools for unit, integration, and e2e tests",
        priority: "medium",
        category: "testing",
      },
      {
        title: "Configure CI/CD Pipeline",
        description: "Set up continuous integration and deployment workflows",
        priority: "medium",
        category: "devops",
      },
      {
        title: "Add Documentation",
        description: "Document your project's architecture and API endpoints",
        priority: "low",
        category: "documentation",
      },
    ];

    return suggestions;
  }

  /**
   * Generate fallback response for AI ask requests
   */
  async ask(params: {
    prompt: string;
    systemContext?: string;
    maxTokens?: number;
  }): Promise<FallbackResponse> {
    logger.info(`[CopilotFallback] Processing ask request`);

    const lowerPrompt = params.prompt.toLowerCase();

    // Suggest nodes
    if (
      lowerPrompt.includes("suggest") &&
      (lowerPrompt.includes("node") || lowerPrompt.includes("architecture"))
    ) {
      return {
        text: JSON.stringify([
          {
            name: "API Gateway",
            type: "service",
            description: "Entry point for all client requests",
          },
          {
            name: "Authentication Service",
            type: "service",
            description: "Handles user authentication and authorization",
          },
          {
            name: "Database Layer",
            type: "database",
            description: "Manages data persistence and queries",
          },
        ]),
        metadata: {
          isFallback: true,
          note: "For AI-powered suggestions, use VS Code with Copilot",
        },
      };
    }

    // Analyze architecture
    if (lowerPrompt.includes("analyze")) {
      return {
        text: `## Architecture Analysis

**Note:** This is a template analysis. For AI-powered insights, use VS Code with GitHub Copilot.

### Strengths
- Well-structured component organization
- Clear separation of concerns
- Scalable architecture patterns

### Recommendations
1. Consider adding caching layer for improved performance
2. Implement rate limiting for API endpoints
3. Add monitoring and logging infrastructure
4. Set up automated testing pipeline

### Next Steps
- Review current node relationships
- Identify potential bottlenecks
- Plan for scalability requirements`,
        metadata: {
          isFallback: true,
          note: "Use VS Code with Copilot for detailed analysis",
        },
      };
    }

    // Generate description
    if (
      lowerPrompt.includes("description") ||
      lowerPrompt.includes("generate")
    ) {
      return {
        text: "A well-structured component that handles core functionality with clean interfaces and proper error handling.",
        metadata: {
          isFallback: true,
          note: "For AI-generated content, use VS Code with Copilot",
        },
      };
    }

    // Suggest connections
    if (
      lowerPrompt.includes("connection") ||
      lowerPrompt.includes("relationship")
    ) {
      return {
        text: JSON.stringify([
          {
            sourceId: "node-1",
            targetId: "node-2",
            type: "depends_on",
            reason: "Standard dependency relationship",
          },
        ]),
        metadata: {
          isFallback: true,
          note: "For AI suggestions, use VS Code with Copilot",
        },
      };
    }

    // Default chat response
    return {
      text: `I'm the Zurto assistant running in fallback mode.

For full AI capabilities:
1. Open this project in **VS Code**
2. Ensure **GitHub Copilot** is installed and active
3. The copilot-bridge will automatically connect

In the meantime, I can help with:
- Project navigation
- Basic architecture templates
- Documentation references

How can I assist you?`,
      metadata: {
        isFallback: true,
        note: "Real AI via VS Code Copilot",
      },
    };
  }

  /**
   * Generate insights for a project
   */
  async generateInsights(project: {
    name: string;
    nodes?: any[];
    relationships?: any[];
  }): Promise<{
    summary: string;
    metrics: Record<string, number>;
    recommendations: string[];
  }> {
    logger.info(`[CopilotFallback] Generating insights for ${project.name}`);

    const nodeCount = project.nodes?.length || 0;
    const relationshipCount = project.relationships?.length || 0;

    return {
      summary: `Project "${project.name}" has ${nodeCount} nodes and ${relationshipCount} connections. For detailed AI analysis, use VS Code with Copilot.`,
      metrics: {
        totalNodes: nodeCount,
        totalConnections: relationshipCount,
        complexity: nodeCount > 10 ? 3 : nodeCount > 5 ? 2 : 1,
      },
      recommendations: [
        "Review node relationships for optimization",
        "Consider adding documentation nodes",
        "Evaluate architecture for scalability",
        "Use VS Code with Copilot for AI-powered suggestions",
      ],
    };
  }
}

// Export singleton
export const copilotFallback = new CopilotFallback();
