/**
 * Layout Engine - Center-out radial layout for circuit-board aesthetic
 * Provides hierarchical positioning radiating from center
 */

import dagre from "dagre";
import { NodeData } from "../components/ServiceNode";
import { NodeConnection } from "../pages/CanvasView";

// Layout configuration options
export interface LayoutConfig {
  direction: "TB" | "LR" | "BT" | "RL"; // Top-Bottom, Left-Right, etc.
  nodeWidth: number;
  nodeHeight: number;
  rankSeparation: number; // Spacing between depth levels
  nodeSeparation: number; // Spacing between nodes at same depth
  edgeSeparation: number; // Spacing between edges
  marginX: number;
  marginY: number;
  align?: "UL" | "UR" | "DL" | "DR"; // Alignment within rank
}

// Default layout configuration - center-out radial style
export const defaultLayoutConfig: LayoutConfig = {
  direction: "LR",
  nodeWidth: 260,
  nodeHeight: 90, // Actual rendered height with padding
  rankSeparation: 220, // More space between depth levels
  nodeSeparation: 80, // More vertical space between nodes
  edgeSeparation: 30,
  marginX: 120,
  marginY: 120,
  align: "UL",
};

// Tree layout config for child views - center-out style
export const treeLayoutConfig: LayoutConfig = {
  direction: "LR",
  nodeWidth: 260,
  nodeHeight: 90,
  rankSeparation: 200, // Generous horizontal spacing
  nodeSeparation: 70, // Generous vertical spacing
  edgeSeparation: 25,
  marginX: 100,
  marginY: 100,
  align: "UL",
};

/**
 * Calculate hierarchical flow layout using Dagre
 * Positions nodes in a visually pleasing flow from sources to targets
 */
export function calculateFlowLayout(
  nodes: NodeData[],
  connections: NodeConnection[],
  canvasWidth: number,
  canvasHeight: number,
  config: LayoutConfig = defaultLayoutConfig
): NodeData[] {
  if (nodes.length === 0) return [];
  if (nodes.length === 1) {
    // Single node - center it
    return [
      {
        ...nodes[0],
        x: canvasWidth / 2 - config.nodeWidth / 2,
        y: canvasHeight / 2 - config.nodeHeight / 2,
      },
    ];
  }

  // Create a new directed graph
  const g = new dagre.graphlib.Graph();

  // Set graph configuration
  g.setGraph({
    rankdir: config.direction,
    nodesep: config.nodeSeparation,
    ranksep: config.rankSeparation,
    edgesep: config.edgeSeparation,
    marginx: config.marginX,
    marginy: config.marginY,
    align: config.align,
  });

  // Default to assigning a new object as a label for each new edge
  g.setDefaultEdgeLabel(() => ({}));

  // Add nodes to the graph
  nodes.forEach((node) => {
    g.setNode(node.id, {
      width: config.nodeWidth,
      height: config.nodeHeight,
      label: node.label,
    });
  });

  // Add edges (connections) to the graph
  const nodeIds = new Set(nodes.map((n) => n.id));
  connections.forEach((conn) => {
    // Only add edges where both nodes exist in current view
    if (nodeIds.has(conn.sourceId) && nodeIds.has(conn.targetId)) {
      g.setEdge(conn.sourceId, conn.targetId);
    }
  });

  // Also add parent-child relationships as edges for better hierarchy
  nodes.forEach((node) => {
    if (node.parentId && nodeIds.has(node.parentId)) {
      // Add parent -> child edge if not already connected
      if (!g.hasEdge(node.parentId, node.id)) {
        g.setEdge(node.parentId, node.id);
      }
    }
  });

  // Run the layout algorithm
  dagre.layout(g);

  // Get the graph dimensions
  const graphWidth = g.graph().width || canvasWidth;
  const graphHeight = g.graph().height || canvasHeight;

  // Calculate offset to center the graph in the canvas
  const offsetX = Math.max(0, (canvasWidth - graphWidth) / 2);
  const offsetY = Math.max(0, (canvasHeight - graphHeight) / 2);

  // Extract positions from dagre and apply to nodes
  const layoutedNodes = nodes.map((node) => {
    const dagreNode = g.node(node.id);
    if (dagreNode) {
      return {
        ...node,
        // Dagre returns center coordinates, convert to top-left
        x: dagreNode.x - config.nodeWidth / 2 + offsetX,
        y: dagreNode.y - config.nodeHeight / 2 + offsetY,
      };
    }
    return node;
  });

  return layoutedNodes;
}

/**
 * Calculate layout for child view with parent node as root
 * Uses center-out radial positioning - parent at center, children spread outward
 */
export function calculateChildFlowLayout(
  parentNode: NodeData,
  childNodes: NodeData[],
  canvasWidth: number,
  canvasHeight: number,
  config: LayoutConfig = treeLayoutConfig
): NodeData[] {
  if (childNodes.length === 0) {
    // Just the parent, centered
    return [
      {
        ...parentNode,
        x: canvasWidth / 2 - config.nodeWidth / 2,
        y: canvasHeight / 2 - config.nodeHeight / 2,
        isViewParent: true,
      },
    ];
  }

  // Build depth map for center-out layout
  const depthMap = new Map<string, number>();
  const childrenMap = new Map<string, NodeData[]>();

  // Initialize maps
  depthMap.set(parentNode.id, 0);
  childrenMap.set(parentNode.id, []);

  childNodes.forEach((node) => {
    childrenMap.set(node.id, []);
  });

  // Build children relationships
  childNodes.forEach((node) => {
    const parent = node.parentId || parentNode.id;
    if (childrenMap.has(parent)) {
      childrenMap.get(parent)!.push(node);
    } else if (node.parentId === parentNode.id) {
      childrenMap.get(parentNode.id)!.push(node);
    }
  });

  // Calculate depths using BFS
  const queue: string[] = [parentNode.id];
  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    const depth = depthMap.get(nodeId) || 0;
    const children = childrenMap.get(nodeId) || [];

    children.forEach((child) => {
      if (!depthMap.has(child.id)) {
        depthMap.set(child.id, depth + 1);
        queue.push(child.id);
      }
    });
  }

  // Assign depth to any orphaned nodes
  childNodes.forEach((node) => {
    if (!depthMap.has(node.id)) {
      depthMap.set(node.id, 1);
    }
  });

  // Group nodes by depth
  const depthGroups = new Map<number, NodeData[]>();
  depthGroups.set(0, [parentNode]);

  childNodes.forEach((node) => {
    const depth = depthMap.get(node.id) || 1;
    if (!depthGroups.has(depth)) {
      depthGroups.set(depth, []);
    }
    depthGroups.get(depth)!.push(node);
  });

  // Calculate positions - center-out style
  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;
  const result: NodeData[] = [];

  // Position parent at center
  result.push({
    ...parentNode,
    x: centerX - config.nodeWidth / 2,
    y: centerY - config.nodeHeight / 2,
    isViewParent: true,
  });

  // Position children in radial layers
  const maxDepth = Math.max(...Array.from(depthMap.values()));

  for (let depth = 1; depth <= maxDepth; depth++) {
    const nodesAtDepth = depthGroups.get(depth) || [];
    const count = nodesAtDepth.length;

    if (count === 0) continue;

    // Horizontal offset from center (increases with depth)
    const xOffset = depth * config.rankSeparation;

    // Calculate vertical spread
    const totalHeight =
      count * config.nodeHeight + (count - 1) * config.nodeSeparation;
    const startY = centerY - totalHeight / 2;

    nodesAtDepth.forEach((node, index) => {
      result.push({
        ...node,
        x: centerX + xOffset - config.nodeWidth / 2,
        y: startY + index * (config.nodeHeight + config.nodeSeparation),
        isViewParent: false,
      });
    });
  }

  return result;
}

/**
 * Identify source nodes (nodes with no incoming edges)
 * These are the "start" nodes in the flow
 */
export function findSourceNodes(
  nodes: NodeData[],
  connections: NodeConnection[]
): NodeData[] {
  const nodeIds = new Set(nodes.map((n) => n.id));
  const hasIncoming = new Set<string>();

  connections.forEach((conn) => {
    if (nodeIds.has(conn.sourceId) && nodeIds.has(conn.targetId)) {
      hasIncoming.add(conn.targetId);
    }
  });

  // Also consider parent-child: children have "incoming" from parent
  nodes.forEach((node) => {
    if (node.parentId && nodeIds.has(node.parentId)) {
      hasIncoming.add(node.id);
    }
  });

  return nodes.filter((n) => !hasIncoming.has(n.id));
}

/**
 * Identify sink nodes (nodes with no outgoing edges)
 * These are the "end" nodes in the flow
 */
export function findSinkNodes(
  nodes: NodeData[],
  connections: NodeConnection[]
): NodeData[] {
  const nodeIds = new Set(nodes.map((n) => n.id));
  const hasOutgoing = new Set<string>();

  connections.forEach((conn) => {
    if (nodeIds.has(conn.sourceId) && nodeIds.has(conn.targetId)) {
      hasOutgoing.add(conn.sourceId);
    }
  });

  // Also consider parent-child: parents have "outgoing" to children
  nodes.forEach((node) => {
    if (node.parentId && nodeIds.has(node.parentId)) {
      hasOutgoing.add(node.parentId);
    }
  });

  return nodes.filter((n) => !hasOutgoing.has(n.id));
}

/**
 * Get layout edge data for rendering connection lines
 * Returns the control points for bezier curves
 */
export function getLayoutEdges(
  nodes: NodeData[],
  connections: NodeConnection[],
  config: LayoutConfig = defaultLayoutConfig
): Array<{
  id: string;
  sourceId: string;
  targetId: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  type: NodeConnection["type"];
}> {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const edges: Array<{
    id: string;
    sourceId: string;
    targetId: string;
    sourceX: number;
    sourceY: number;
    targetX: number;
    targetY: number;
    type: NodeConnection["type"];
  }> = [];

  connections.forEach((conn) => {
    const source = nodeMap.get(conn.sourceId);
    const target = nodeMap.get(conn.targetId);

    if (source && target) {
      // For LR layout, connect right edge of source to left edge of target
      edges.push({
        id: conn.id,
        sourceId: conn.sourceId,
        targetId: conn.targetId,
        sourceX: source.x + config.nodeWidth,
        sourceY: source.y + config.nodeHeight / 2,
        targetX: target.x,
        targetY: target.y + config.nodeHeight / 2,
        type: conn.type,
      });
    }
  });

  return edges;
}
