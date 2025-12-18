// Project folder structure for team-based project organization
// Each project is stored in its own folder structure based on team

import { NodeData } from "../../components/ServiceNode";
import { NodeConnection } from "../../pages/CanvasView";

export interface ProjectNode extends NodeData {
  parentId?: string;
  children?: string[];
  // Enhanced metrics (inherited from NodeData but listed for clarity)
  port?: number;
  cpuUsage?: number;
  memoryUsage?: number;
  uptime?: string;
  lastBuild?: string;
  metadata?: {
    createdAt: Date;
    updatedAt: Date;
    createdBy?: string;
    tags?: string[];
    version?: string;
    documentation?: string;
  };
}

export interface ProjectData {
  id: string;
  name: string;
  description?: string;
  teamId: string;
  nodes: ProjectNode[];
  connections: NodeConnection[];
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    lastOpenedAt?: Date;
    version: string;
    author?: string;
    tags?: string[];
  };
  settings?: {
    defaultLayout: "center-out" | "grid" | "tree" | "free";
    gridSize: number;
    snapToGrid: boolean;
    showConnections: boolean;
    showMinimap: boolean;
  };
}

export interface TeamProjects {
  teamId: string;
  teamName: string;
  projects: ProjectData[];
}

// Import real project data
import { shinraiProject } from "./shinrai-project";

// =============================================================================
// TEAM PROJECTS - REAL DATA
// =============================================================================

// LeeLoo's team with imported Shinrai project
export const teamProjects: TeamProjects[] = [
  {
    teamId: "leeloo-team",
    teamName: "LeeLoo",
    projects: [shinraiProject],
  },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export function getProjectsByTeam(teamId: string): ProjectData[] {
  const team = teamProjects.find((t) => t.teamId === teamId);
  return team?.projects || [];
}

export function getProject(
  teamId: string,
  projectId: string
): ProjectData | undefined {
  const projects = getProjectsByTeam(teamId);
  return projects.find((p) => p.id === projectId);
}

export function getProjectById(projectId: string): ProjectData | undefined {
  for (const team of teamProjects) {
    const project = team.projects.find((p) => p.id === projectId);
    if (project) return project;
  }
  return undefined;
}

export function getAllTeams(): { teamId: string; teamName: string }[] {
  return teamProjects.map((t) => ({
    teamId: t.teamId,
    teamName: t.teamName,
  }));
}

export function getAllProjects(): ProjectData[] {
  return teamProjects.flatMap((t) => t.projects);
}

// Re-export shinrai project helpers
export {
  shinraiProject,
  shinraiNodes,
  shinraiConnections,
  getNodesByDepth,
  getChildNodes,
  getAllDescendants,
  getChildNodesWithDepth,
  isFolder,
  getNodeDepth,
  getParentNode,
  getNodePath,
  getNodeConnections,
} from "./shinrai-project";
