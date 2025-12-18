import { claudeAgent } from "./claude-agent.js";
import { logger } from "../utils/logger.js";

/**
 * AI Insights & Suggestions Engine
 * Provides real-time insights and personalized recommendations
 */

export interface Insight {
  id: string;
  type:
    | "best_practice"
    | "optimization"
    | "risk"
    | "opportunity"
    | "recommendation";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  actionItems: string[];
  relatedTechnologies?: string[];
  createdAt: string;
}

export class InsightsEngine {
  private insightHistory: Insight[] = [];

  /**
   * Generate insights from project context
   */
  async generateInsights(context: {
    projectName: string;
    projectType: string;
    complexity: string;
    techStack: string[];
    teamSize?: number;
    timeline?: string;
    budget?: string;
  }): Promise<Insight[]> {
    try {
      logger.info(
        `💡 Generating insights for ${context.projectName} (${context.projectType})`
      );

      // Get AI suggestions
      const suggestions = await claudeAgent.getSuggestions({
        projectName: context.projectName,
        projectType: context.projectType,
        complexity: context.complexity,
        currentTechStack: context.techStack,
      });

      // Convert suggestions to insights
      const insights = this.convertSuggestionsToInsights(
        suggestions,
        context.techStack
      );

      // Store in history
      this.insightHistory.push(...insights);

      logger.info(`✅ Generated ${insights.length} insights`);

      return insights;
    } catch (error) {
      logger.error("❌ Failed to generate insights:", error);
      // Return default insights on error
      return this.getDefaultInsights(context.techStack);
    }
  }

  /**
   * Get architecture recommendations
   */
  async getArchitectureRecommendations(techStack: {
    frontend?: string[];
    backend?: string[];
    database?: string[];
    deployment?: string[];
  }): Promise<string[]> {
    try {
      logger.info("🏗️ Generating architecture recommendations");

      const recommendations: string[] = [];

      // Frontend architecture
      if (techStack.frontend?.includes("React")) {
        recommendations.push(
          "Use functional components with React hooks for better performance"
        );
        recommendations.push(
          "Implement code splitting with React.lazy for faster initial load"
        );
        recommendations.push(
          "Use TypeScript for type safety in React components"
        );
      }

      // Backend architecture
      if (techStack.backend?.includes("Node.js")) {
        recommendations.push(
          "Implement request validation middleware at API layer"
        );
        recommendations.push("Use async/await for cleaner promise handling");
        recommendations.push("Implement proper error handling and logging");
      }

      if (techStack.backend?.includes("Python")) {
        recommendations.push(
          "Use type hints for better code documentation and IDE support"
        );
        recommendations.push(
          "Implement async functions with asyncio for I/O operations"
        );
        recommendations.push("Use FastAPI for high-performance REST APIs");
      }

      // Database architecture
      if (techStack.database?.includes("PostgreSQL")) {
        recommendations.push(
          "Use connection pooling (PgBouncer) for efficient connection management"
        );
        recommendations.push(
          "Implement proper indexing strategy for query optimization"
        );
        recommendations.push(
          "Use prepared statements to prevent SQL injection"
        );
      }

      if (techStack.database?.includes("MongoDB")) {
        recommendations.push(
          "Design schemas to avoid deep nesting for better query performance"
        );
        recommendations.push(
          "Implement proper indexing on frequently queried fields"
        );
        recommendations.push("Use transactions for multi-document consistency");
      }

      // Deployment architecture
      if (techStack.deployment?.includes("Docker")) {
        recommendations.push(
          "Use multi-stage builds to reduce final image size"
        );
        recommendations.push(
          "Implement health checks in Docker containers for better orchestration"
        );
        recommendations.push(
          "Use Docker compose for local development environment"
        );
      }

      logger.info(
        `✅ Generated ${recommendations.length} architecture recommendations`
      );

      return recommendations;
    } catch (error) {
      logger.error(
        "❌ Failed to generate architecture recommendations:",
        error
      );
      return [];
    }
  }

  /**
   * Get performance optimization suggestions
   */
  getPerformanceOptimizations(complexity: string): string[] {
    const optimizations: string[] = [];

    optimizations.push(
      "Implement caching strategy (Redis/Memcached) for frequently accessed data"
    );
    optimizations.push("Use CDN for static assets to reduce load time");
    optimizations.push("Implement database query optimization and indexing");

    if (complexity === "high") {
      optimizations.push(
        "Implement microservices architecture for scalability"
      );
      optimizations.push(
        "Use message queues (RabbitMQ/Kafka) for asynchronous processing"
      );
      optimizations.push(
        "Implement load balancing across multiple server instances"
      );
    }

    if (complexity === "medium") {
      optimizations.push("Use connection pooling for database connections");
      optimizations.push("Implement API rate limiting for resource protection");
    }

    return optimizations;
  }

  /**
   * Get security recommendations
   */
  getSecurityRecommendations(): string[] {
    return [
      "Implement HTTPS/TLS for all data in transit",
      "Use environment variables for sensitive configuration data",
      "Implement input validation and sanitization on all endpoints",
      "Use prepared statements to prevent SQL injection",
      "Implement rate limiting to prevent brute force attacks",
      "Use strong password hashing (bcrypt, Argon2) for user authentication",
      "Implement CORS properly to prevent unauthorized access",
      "Keep dependencies updated and monitor for security vulnerabilities",
      "Implement logging and monitoring for security events",
      "Conduct regular security audits and penetration testing",
    ];
  }

  /**
   * Get testing strategy recommendations
   */
  getTestingStrategy(complexity: string): {
    unitTesting: boolean;
    integrationTesting: boolean;
    e2eTesting: boolean;
    performanceTesting: boolean;
    securityTesting: boolean;
    recommendations: string[];
  } {
    if (complexity === "low") {
      return {
        unitTesting: true,
        integrationTesting: true,
        e2eTesting: false,
        performanceTesting: false,
        securityTesting: false,
        recommendations: [
          "Focus on unit tests for business logic",
          "Write integration tests for API endpoints",
          "Aim for >80% code coverage",
        ],
      };
    }

    if (complexity === "medium") {
      return {
        unitTesting: true,
        integrationTesting: true,
        e2eTesting: true,
        performanceTesting: true,
        securityTesting: false,
        recommendations: [
          "Maintain >85% code coverage with unit tests",
          "Write integration tests for all API integrations",
          "Use Selenium/Cypress for E2E testing",
          "Implement load testing for performance validation",
          "Set up automated testing in CI/CD pipeline",
        ],
      };
    }

    return {
      unitTesting: true,
      integrationTesting: true,
      e2eTesting: true,
      performanceTesting: true,
      securityTesting: true,
      recommendations: [
        "Maintain >90% code coverage across all services",
        "Implement comprehensive integration tests",
        "Use BDD approach for E2E testing",
        "Conduct load testing and stress testing",
        "Implement security testing in CI/CD",
        "Use chaos engineering for resilience testing",
        "Implement continuous monitoring and alerting",
      ],
    };
  }

  /**
   * Convert AI suggestions to structured insights
   */
  private convertSuggestionsToInsights(
    suggestions: string[],
    techStack: string[]
  ): Insight[] {
    return suggestions.map((suggestion, index) => ({
      id: `insight_${Date.now()}_${index}`,
      type: this.categorizeInsight(suggestion),
      title: suggestion.split(".")[0],
      description: suggestion,
      impact: this.assessImpact(suggestion),
      actionItems: this.extractActionItems(suggestion),
      relatedTechnologies: this.extractTechnologies(suggestion, techStack),
      createdAt: new Date().toISOString(),
    }));
  }

  /**
   * Categorize insight type
   */
  private categorizeInsight(suggestion: string): Insight["type"] {
    const lower = suggestion.toLowerCase();

    if (
      lower.includes("best practice") ||
      lower.includes("should") ||
      lower.includes("recommend")
    ) {
      return "best_practice";
    }
    if (
      lower.includes("optimize") ||
      lower.includes("improve") ||
      lower.includes("performance")
    ) {
      return "optimization";
    }
    if (
      lower.includes("risk") ||
      lower.includes("danger") ||
      lower.includes("avoid")
    ) {
      return "risk";
    }
    if (
      lower.includes("opportunity") ||
      lower.includes("consider") ||
      lower.includes("could")
    ) {
      return "opportunity";
    }

    return "recommendation";
  }

  /**
   * Assess impact level
   */
  private assessImpact(suggestion: string): "high" | "medium" | "low" {
    const lower = suggestion.toLowerCase();

    if (
      lower.includes("critical") ||
      lower.includes("must") ||
      lower.includes("important")
    ) {
      return "high";
    }
    if (
      lower.includes("should") ||
      lower.includes("recommend") ||
      lower.includes("consider")
    ) {
      return "medium";
    }

    return "low";
  }

  /**
   * Extract action items from suggestion
   */
  private extractActionItems(suggestion: string): string[] {
    const items: string[] = [];

    // Simple extraction - in production would be more sophisticated
    if (suggestion.includes("implement")) {
      items.push(`Implement: ${suggestion}`);
    }
    if (suggestion.includes("use")) {
      items.push(`Use: ${suggestion}`);
    }
    if (suggestion.includes("consider")) {
      items.push(`Consider: ${suggestion}`);
    }

    return items.length > 0 ? items : [suggestion];
  }

  /**
   * Extract related technologies from suggestion
   */
  private extractTechnologies(
    suggestion: string,
    availableTech: string[]
  ): string[] {
    const technologies: string[] = [];

    availableTech.forEach((tech) => {
      if (suggestion.toLowerCase().includes(tech.toLowerCase())) {
        technologies.push(tech);
      }
    });

    return technologies;
  }

  /**
   * Get default insights when AI fails
   */
  private getDefaultInsights(techStack: string[]): Insight[] {
    return [
      {
        id: `insight_default_1`,
        type: "best_practice",
        title: "Use Type Safety",
        description: "Implement TypeScript or similar for type safety",
        impact: "high",
        actionItems: ["Add TypeScript to project"],
        relatedTechnologies: ["TypeScript"],
        createdAt: new Date().toISOString(),
      },
      {
        id: `insight_default_2`,
        type: "optimization",
        title: "Implement Caching",
        description:
          "Use caching for frequently accessed data to improve performance",
        impact: "high",
        actionItems: ["Implement Redis caching layer"],
        relatedTechnologies: ["Redis"],
        createdAt: new Date().toISOString(),
      },
      {
        id: `insight_default_3`,
        type: "best_practice",
        title: "Write Tests",
        description: "Implement comprehensive testing strategy",
        impact: "high",
        actionItems: ["Write unit tests", "Write integration tests"],
        relatedTechnologies: ["Jest", "Mocha"],
        createdAt: new Date().toISOString(),
      },
    ];
  }

  /**
   * Get insight history
   */
  getInsightHistory(): Insight[] {
    return this.insightHistory;
  }
}

// Export singleton instance
export const insightsEngine = new InsightsEngine();
