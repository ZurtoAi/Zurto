/**
 * Radial Layout Engine - Center-out circular layout for circuit-board aesthetic
 * Positions nodes in a radial pattern with the root at center
 */

import { NodeData } from "../components/ServiceNode";
import { NodeConnection } from "../pages/CanvasView";

export interface RadialLayoutConfig {
  centerX: number;
  centerY: number;
  nodeWidth: number;
  nodeHeight: number;
  mainNodeWidth: number; // Larger width for main/server nodes
  mainNodeHeight: number; // Larger height for main/server nodes
  ringSpacing: number; // Distance between rings
  minAngle: number; // Minimum angle between nodes (in degrees)
  startAngle: number; // Starting angle (0 = right, 90 = bottom, etc.)
}

export const defaultRadialConfig: RadialLayoutConfig = {
  centerX: 0, // Will be set to canvas center
  centerY: 0,
  nodeWidth: 260,
  nodeHeight: 100,
  mainNodeWidth: 300,
  mainNodeHeight: 150,
  ringSpacing: 400, // Distance between depth rings - increased for more space
  minAngle: 50, // Minimum 50 degrees between nodes - increased for more spread
  startAngle: -90, // Start from top
};

// Child view config - for when drilling into a node to see its children
export const childViewRadialConfig: RadialLayoutConfig = {
  centerX: 0,
  centerY: 0,
  nodeWidth: 260,
  nodeHeight: 100,
  mainNodeWidth: 320,
  mainNodeHeight: 160,
  ringSpacing: 350, // Slightly less for child views
  minAngle: 40, // Allow more nodes per ring
  startAngle: -90,
};

/**
 * Calculate radial layout - nodes positioned in concentric rings from center
 * Perfect for visualizing project architecture radiating from a central hub
 */
export function calculateRadialLayout(
  nodes: NodeData[],
  connections: NodeConnection[],
  canvasWidth: number,
  canvasHeight: number,
  config: RadialLayoutConfig = defaultRadialConfig
): NodeData[] {
  if (nodes.length === 0) return [];

  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;

  // Find root node (no parent or the planning node)
  const rootNode = nodes.find(
    (n) => !n.parentId || (n.type === "utility" && n.utilityType === "planning")
  );
  if (!rootNode) {
    // Fallback: center all nodes evenly
    return distributeNodesInCircle(nodes, centerX, centerY, config);
  }

  // Build parent-child map
  const childrenMap = new Map<string, NodeData[]>();
  nodes.forEach((node) => {
    childrenMap.set(node.id, []);
  });

  nodes.forEach((node) => {
    if (node.parentId && childrenMap.has(node.parentId)) {
      childrenMap.get(node.parentId)!.push(node);
    }
  });

  // Calculate depths using BFS
  const depthMap = new Map<string, number>();
  const queue: { node: NodeData; depth: number }[] = [
    { node: rootNode, depth: 0 },
  ];
  depthMap.set(rootNode.id, 0);

  while (queue.length > 0) {
    const { node, depth } = queue.shift()!;
    const children = childrenMap.get(node.id) || [];

    children.forEach((child) => {
      if (!depthMap.has(child.id)) {
        depthMap.set(child.id, depth + 1);
        queue.push({ node: child, depth: depth + 1 });
      }
    });
  }

  // Assign depth 1 to orphaned nodes (connected but not in tree)
  nodes.forEach((node) => {
    if (!depthMap.has(node.id)) {
      depthMap.set(node.id, 1);
    }
  });

  // Group nodes by depth
  const depthGroups = new Map<number, NodeData[]>();
  nodes.forEach((node) => {
    const depth = depthMap.get(node.id) || 0;
    if (!depthGroups.has(depth)) {
      depthGroups.set(depth, []);
    }
    depthGroups.get(depth)!.push(node);
  });

  const result: NodeData[] = [];
  const maxDepth = Math.max(...Array.from(depthMap.values()));

  // Position each depth ring
  for (let depth = 0; depth <= maxDepth; depth++) {
    const nodesAtDepth = depthGroups.get(depth) || [];

    if (depth === 0) {
      // Root node at center
      nodesAtDepth.forEach((node) => {
        const width = isMainNode(node)
          ? config.mainNodeWidth
          : config.nodeWidth;
        const height = isMainNode(node)
          ? config.mainNodeHeight
          : config.nodeHeight;
        result.push({
          ...node,
          x: centerX - width / 2,
          y: centerY - height / 2,
        });
      });
    } else {
      // Distribute nodes around the ring
      const radius = depth * config.ringSpacing;
      const count = nodesAtDepth.length;

      // Calculate angle spread based on count
      const totalAngle = Math.min(360, count * config.minAngle);
      const startAngle = config.startAngle - totalAngle / 2;
      const angleStep = count > 1 ? totalAngle / (count - 1) : 0;

      // Sort nodes by their parent's position to maintain visual grouping
      const sortedNodes = sortNodesByParentAngle(
        nodesAtDepth,
        result,
        centerX,
        centerY
      );

      sortedNodes.forEach((node, index) => {
        const angle =
          count === 1 ? config.startAngle : startAngle + index * angleStep;

        const radians = (angle * Math.PI) / 180;
        const width = isMainNode(node)
          ? config.mainNodeWidth
          : config.nodeWidth;
        const height = isMainNode(node)
          ? config.mainNodeHeight
          : config.nodeHeight;

        // Position at angle on ring
        const x = centerX + radius * Math.cos(radians) - width / 2;
        const y = centerY + radius * Math.sin(radians) - height / 2;

        result.push({
          ...node,
          x,
          y,
        });
      });
    }
  }

  return result;
}

/**
 * Distribute nodes evenly in a circle (fallback layout)
 */
function distributeNodesInCircle(
  nodes: NodeData[],
  centerX: number,
  centerY: number,
  config: RadialLayoutConfig
): NodeData[] {
  const count = nodes.length;
  if (count === 0) return [];

  if (count === 1) {
    const width = isMainNode(nodes[0])
      ? config.mainNodeWidth
      : config.nodeWidth;
    const height = isMainNode(nodes[0])
      ? config.mainNodeHeight
      : config.nodeHeight;
    return [
      {
        ...nodes[0],
        x: centerX - width / 2,
        y: centerY - height / 2,
      },
    ];
  }

  const radius = config.ringSpacing;
  const angleStep = 360 / count;

  return nodes.map((node, index) => {
    const angle = config.startAngle + index * angleStep;
    const radians = (angle * Math.PI) / 180;
    const width = isMainNode(node) ? config.mainNodeWidth : config.nodeWidth;
    const height = isMainNode(node) ? config.mainNodeHeight : config.nodeHeight;

    return {
      ...node,
      x: centerX + radius * Math.cos(radians) - width / 2,
      y: centerY + radius * Math.sin(radians) - height / 2,
    };
  });
}

/**
 * Sort nodes by their parent's angular position to keep groups together
 */
function sortNodesByParentAngle(
  nodes: NodeData[],
  positionedNodes: NodeData[],
  centerX: number,
  centerY: number
): NodeData[] {
  const posMap = new Map(positionedNodes.map((n) => [n.id, n]));

  return [...nodes].sort((a, b) => {
    const parentA = a.parentId ? posMap.get(a.parentId) : null;
    const parentB = b.parentId ? posMap.get(b.parentId) : null;

    if (!parentA && !parentB) return 0;
    if (!parentA) return -1;
    if (!parentB) return 1;

    const angleA = Math.atan2(
      parentA.y + 50 - centerY,
      parentA.x + 130 - centerX
    );
    const angleB = Math.atan2(
      parentB.y + 50 - centerY,
      parentB.x + 130 - centerX
    );

    return angleA - angleB;
  });
}

/**
 * Check if a node is a "main" node (server/service) that should be larger
 */
export function isMainNode(node: NodeData): boolean {
  return (
    node.type === "server" ||
    (node.type === "utility" && node.utilityType === "planning")
  );
}

/**
 * Get node dimensions based on type
 */
export function getNodeDimensions(
  node: NodeData,
  config: RadialLayoutConfig = defaultRadialConfig
): { width: number; height: number } {
  if (isMainNode(node)) {
    return { width: config.mainNodeWidth, height: config.mainNodeHeight };
  }
  return { width: config.nodeWidth, height: config.nodeHeight };
}

/**
 * Calculate 90-degree orthogonal connection path between two nodes
 * Creates circuit-board style connections
 */
export function calculateOrthogonalPath(
  sourceNode: NodeData,
  targetNode: NodeData,
  config: RadialLayoutConfig = defaultRadialConfig
): string {
  const srcDim = getNodeDimensions(sourceNode, config);
  const tgtDim = getNodeDimensions(targetNode, config);

  // Get node centers
  const srcCenterX = sourceNode.x + srcDim.width / 2;
  const srcCenterY = sourceNode.y + srcDim.height / 2;
  const tgtCenterX = targetNode.x + tgtDim.width / 2;
  const tgtCenterY = targetNode.y + tgtDim.height / 2;

  // Determine best exit/entry points based on relative positions
  const dx = tgtCenterX - srcCenterX;
  const dy = tgtCenterY - srcCenterY;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);

  let sx: number, sy: number, tx: number, ty: number;

  // Determine exit point from source
  if (absDx > absDy) {
    // Horizontal dominant - exit from left/right
    if (dx > 0) {
      // Target is to the right
      sx = sourceNode.x + srcDim.width;
      sy = srcCenterY;
      tx = targetNode.x;
      ty = tgtCenterY;
    } else {
      // Target is to the left
      sx = sourceNode.x;
      sy = srcCenterY;
      tx = targetNode.x + tgtDim.width;
      ty = tgtCenterY;
    }
  } else {
    // Vertical dominant - exit from top/bottom
    if (dy > 0) {
      // Target is below
      sx = srcCenterX;
      sy = sourceNode.y + srcDim.height;
      tx = tgtCenterX;
      ty = targetNode.y;
    } else {
      // Target is above
      sx = srcCenterX;
      sy = sourceNode.y;
      tx = tgtCenterX;
      ty = targetNode.y + tgtDim.height;
    }
  }

  // Create orthogonal path with one bend
  // Determine if we need horizontal-then-vertical or vertical-then-horizontal
  const midX = (sx + tx) / 2;
  const midY = (sy + ty) / 2;

  if (absDx > absDy) {
    // Horizontal-first: go horizontal to midpoint, then vertical
    return `M ${sx} ${sy} L ${midX} ${sy} L ${midX} ${ty} L ${tx} ${ty}`;
  } else {
    // Vertical-first: go vertical to midpoint, then horizontal
    return `M ${sx} ${sy} L ${sx} ${midY} L ${tx} ${midY} L ${tx} ${ty}`;
  }
}

/**
 * Calculate smart orthogonal path that avoids overlapping
 * Uses step routing for cleaner circuit-board look
 */
export function calculateSmartOrthogonalPath(
  sourceNode: NodeData,
  targetNode: NodeData,
  allNodes: NodeData[],
  config: RadialLayoutConfig = defaultRadialConfig
): {
  path: string;
  startPoint: { x: number; y: number };
  endPoint: { x: number; y: number };
} {
  const srcDim = getNodeDimensions(sourceNode, config);
  const tgtDim = getNodeDimensions(targetNode, config);

  // Get node centers
  const srcCenterX = sourceNode.x + srcDim.width / 2;
  const srcCenterY = sourceNode.y + srcDim.height / 2;
  const tgtCenterX = targetNode.x + tgtDim.width / 2;
  const tgtCenterY = targetNode.y + tgtDim.height / 2;

  const dx = tgtCenterX - srcCenterX;
  const dy = tgtCenterY - srcCenterY;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);

  // Spacing for the "step" in the connection
  const stepOffset = 40;

  let sx: number, sy: number, tx: number, ty: number;
  let path: string;

  // Four quadrant handling for clean circuit paths
  if (dx >= 0 && absDx >= absDy) {
    // Target is to the RIGHT (primary horizontal)
    sx = sourceNode.x + srcDim.width;
    sy = srcCenterY;
    tx = targetNode.x;
    ty = tgtCenterY;

    const bendX = sx + stepOffset;
    path = `M ${sx} ${sy} L ${bendX} ${sy} L ${bendX} ${ty} L ${tx} ${ty}`;
  } else if (dx < 0 && absDx >= absDy) {
    // Target is to the LEFT (primary horizontal)
    sx = sourceNode.x;
    sy = srcCenterY;
    tx = targetNode.x + tgtDim.width;
    ty = tgtCenterY;

    const bendX = sx - stepOffset;
    path = `M ${sx} ${sy} L ${bendX} ${sy} L ${bendX} ${ty} L ${tx} ${ty}`;
  } else if (dy >= 0) {
    // Target is BELOW (primary vertical)
    sx = srcCenterX;
    sy = sourceNode.y + srcDim.height;
    tx = tgtCenterX;
    ty = targetNode.y;

    const bendY = sy + stepOffset;
    path = `M ${sx} ${sy} L ${sx} ${bendY} L ${tx} ${bendY} L ${tx} ${ty}`;
  } else {
    // Target is ABOVE (primary vertical)
    sx = srcCenterX;
    sy = sourceNode.y;
    tx = tgtCenterX;
    ty = targetNode.y + tgtDim.height;

    const bendY = sy - stepOffset;
    path = `M ${sx} ${sy} L ${sx} ${bendY} L ${tx} ${bendY} L ${tx} ${ty}`;
  }

  return {
    path,
    startPoint: { x: sx, y: sy },
    endPoint: { x: tx, y: ty },
  };
}

/**
 * Calculate child view radial layout
 * Parent node at center, children radiate outward
 * Ideal for drilling into a service to see its internal structure
 */
export function calculateChildRadialLayout(
  parentNode: NodeData,
  childNodes: NodeData[],
  canvasWidth: number,
  canvasHeight: number,
  config: RadialLayoutConfig = childViewRadialConfig
): NodeData[] {
  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;

  const result: NodeData[] = [];

  // Position parent at center with isViewParent flag
  const parentWidth = config.mainNodeWidth;
  const parentHeight = config.mainNodeHeight;
  result.push({
    ...parentNode,
    x: centerX - parentWidth / 2,
    y: centerY - parentHeight / 2,
    isViewParent: true,
  });

  if (childNodes.length === 0) {
    return result;
  }

  // Build depth map for multi-level children
  const depthMap = new Map<string, number>();
  const childrenMap = new Map<string, NodeData[]>();

  // Initialize maps
  childNodes.forEach((node) => {
    childrenMap.set(node.id, []);
  });

  // Build children relationships
  childNodes.forEach((node) => {
    if (node.parentId === parentNode.id) {
      // Direct child of parent
      depthMap.set(node.id, 1);
    } else if (childrenMap.has(node.parentId!)) {
      // Nested child
      childrenMap.get(node.parentId!)!.push(node);
    }
  });

  // Calculate depths for nested children using BFS
  const queue = childNodes.filter((n) => depthMap.has(n.id));
  while (queue.length > 0) {
    const node = queue.shift()!;
    const depth = depthMap.get(node.id) || 1;
    const children = childrenMap.get(node.id) || [];

    children.forEach((child) => {
      if (!depthMap.has(child.id)) {
        depthMap.set(child.id, depth + 1);
        queue.push(child);
      }
    });
  }

  // Assign default depth to any unassigned nodes
  childNodes.forEach((node) => {
    if (!depthMap.has(node.id)) {
      depthMap.set(node.id, 1);
    }
  });

  // Group nodes by depth
  const depthGroups = new Map<number, NodeData[]>();
  childNodes.forEach((node) => {
    const depth = depthMap.get(node.id) || 1;
    if (!depthGroups.has(depth)) {
      depthGroups.set(depth, []);
    }
    depthGroups.get(depth)!.push(node);
  });

  const maxDepth = Math.max(...Array.from(depthMap.values()));

  // Position each depth ring
  for (let depth = 1; depth <= maxDepth; depth++) {
    const nodesAtDepth = depthGroups.get(depth) || [];
    const count = nodesAtDepth.length;

    if (count === 0) continue;

    const radius = depth * config.ringSpacing;

    // Calculate even distribution around the circle
    const angleStep = 360 / count;
    const startAngle = config.startAngle;

    // Sort nodes to group by parent position
    const sortedNodes = sortNodesByParentAngle(
      nodesAtDepth,
      result,
      centerX,
      centerY
    );

    sortedNodes.forEach((node, index) => {
      const angle = startAngle + index * angleStep;
      const radians = (angle * Math.PI) / 180;

      const width = isMainNode(node) ? config.mainNodeWidth : config.nodeWidth;
      const height = isMainNode(node)
        ? config.mainNodeHeight
        : config.nodeHeight;

      const x = centerX + radius * Math.cos(radians) - width / 2;
      const y = centerY + radius * Math.sin(radians) - height / 2;

      result.push({
        ...node,
        x,
        y,
        isViewParent: false,
      });
    });
  }

  return result;
}
