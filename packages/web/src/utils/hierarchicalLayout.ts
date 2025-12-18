/**
 * Hierarchical Layout Engine - Circuit Board Aesthetic
 *
 * Features:
 * - Center-out hierarchical layout with strict rules
 * - Full bounding box collision detection (not just center points)
 * - Configurable node spacing and layer distances
 * - 45-degree angle path calculations for connections
 * - Automatic node repositioning to prevent overlaps
 * - Circuit-board style connections with minimal turns
 */

import { NodeData } from "../components/ServiceNode";
import { NodeConnection } from "../pages/CanvasView";

export interface HierarchicalLayoutConfig {
  centerX: number;
  centerY: number;
  nodeWidth: number;
  nodeHeight: number;
  layerDistance: number; // Vertical distance between hierarchy layers
  nodeSpacing: number; // Horizontal spacing between nodes in same layer
  minNodeSeparation: number; // Minimum distance between node edges
  angleBias: number; // Bias toward 45 degrees (0-1, 1 = prefer 45 degrees)
}

export const defaultHierarchicalConfig: HierarchicalLayoutConfig = {
  centerX: 0,
  centerY: 0,
  nodeWidth: 260,
  nodeHeight: 100,
  layerDistance: 250, // Distance between hierarchy layers
  nodeSpacing: 300, // Horizontal space per node
  minNodeSeparation: 40, // Minimum gap between node edges
  angleBias: 0.8, // Strong preference for 45-degree angles
};

// Bounding box for collision detection
export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Connection point on node edge
export interface ConnectionPoint {
  x: number;
  y: number;
  side: "top" | "bottom" | "left" | "right";
}

/**
 * Get node bounding box accounting for full dimensions
 */
export function getNodeBoundingBox(
  node: NodeData,
  width: number,
  height: number
): BoundingBox {
  return {
    x: node.x - width / 2,
    y: node.y - height / 2,
    width,
    height,
  };
}

/**
 * Check if two bounding boxes collide (with optional padding)
 */
export function checkBoundingBoxCollision(
  box1: BoundingBox,
  box2: BoundingBox,
  padding: number = 0
): boolean {
  const x1Min = box1.x - padding;
  const x1Max = box1.x + box1.width + padding;
  const y1Min = box1.y - padding;
  const y1Max = box1.y + box1.height + padding;

  const x2Min = box2.x - padding;
  const x2Max = box2.x + box2.width + padding;
  const y2Min = box2.y - padding;
  const y2Max = box2.y + box2.height + padding;

  return !(x1Max < x2Min || x2Max < x1Min || y1Max < y2Min || y2Max < y1Min);
}

/**
 * Find the best connection point on a node edge for a given target
 * Prefers the side facing the target
 */
export function findBestConnectionPoint(
  fromBox: BoundingBox,
  toBox: BoundingBox,
  prefer45Degree: boolean = true
): { from: ConnectionPoint; to: ConnectionPoint } {
  const fromCenterX = fromBox.x + fromBox.width / 2;
  const fromCenterY = fromBox.y + fromBox.height / 2;
  const toCenterX = toBox.x + toBox.width / 2;
  const toCenterY = toBox.y + toBox.height / 2;

  const dx = toCenterX - fromCenterX;
  const dy = toCenterY - fromCenterY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance === 0) {
    return {
      from: {
        x: fromCenterX,
        y: fromCenterY + fromBox.height / 2,
        side: "bottom",
      },
      to: { x: toCenterX, y: toBox.y, side: "top" },
    };
  }

  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  // Normalize angle to 0-360
  const normalizedAngle = (angle + 360) % 360;

  // Determine from side (based on direction away from target)
  let fromSide: "top" | "bottom" | "left" | "right";
  let fromX = fromCenterX;
  let fromY = fromCenterY;

  if (prefer45Degree) {
    // Snap to 45-degree angles
    const snappedAngle = Math.round(normalizedAngle / 45) * 45;

    if (snappedAngle === 0 || snappedAngle === 360) {
      fromSide = "right";
      fromX = fromBox.x + fromBox.width;
      fromY = fromCenterY;
    } else if (snappedAngle === 45) {
      fromSide = "right";
      fromX = fromBox.x + fromBox.width;
      fromY = fromBox.y + fromBox.height;
    } else if (snappedAngle === 90) {
      fromSide = "bottom";
      fromX = fromCenterX;
      fromY = fromBox.y + fromBox.height;
    } else if (snappedAngle === 135) {
      fromSide = "left";
      fromX = fromBox.x;
      fromY = fromBox.y + fromBox.height;
    } else if (snappedAngle === 180) {
      fromSide = "left";
      fromX = fromBox.x;
      fromY = fromCenterY;
    } else if (snappedAngle === 225) {
      fromSide = "left";
      fromX = fromBox.x;
      fromY = fromBox.y;
    } else if (snappedAngle === 270) {
      fromSide = "top";
      fromX = fromCenterX;
      fromY = fromBox.y;
    } else {
      // 315
      fromSide = "right";
      fromX = fromBox.x + fromBox.width;
      fromY = fromBox.y;
    }
  } else {
    // Use cardinal directions
    if (normalizedAngle < 45 || normalizedAngle >= 315) {
      fromSide = "right";
      fromX = fromBox.x + fromBox.width;
    } else if (normalizedAngle < 135) {
      fromSide = "bottom";
      fromY = fromBox.y + fromBox.height;
    } else if (normalizedAngle < 225) {
      fromSide = "left";
      fromX = fromBox.x;
    } else {
      fromSide = "top";
      fromY = fromBox.y;
    }
  }

  // Determine to side (opposite direction)
  const oppositeAngle = (normalizedAngle + 180) % 360;
  let toSide: "top" | "bottom" | "left" | "right";
  let toX = toCenterX;
  let toY = toCenterY;

  if (prefer45Degree) {
    const snappedAngle = Math.round(oppositeAngle / 45) * 45;

    if (snappedAngle === 0 || snappedAngle === 360) {
      toSide = "right";
      toX = toBox.x + toBox.width;
      toY = toCenterY;
    } else if (snappedAngle === 45) {
      toSide = "right";
      toX = toBox.x + toBox.width;
      toY = toBox.y + toBox.height;
    } else if (snappedAngle === 90) {
      toSide = "bottom";
      toX = toCenterX;
      toY = toBox.y + toBox.height;
    } else if (snappedAngle === 135) {
      toSide = "left";
      toX = toBox.x;
      toY = toBox.y + toBox.height;
    } else if (snappedAngle === 180) {
      toSide = "left";
      toX = toBox.x;
      toY = toCenterY;
    } else if (snappedAngle === 225) {
      toSide = "left";
      toX = toBox.x;
      toY = toBox.y;
    } else if (snappedAngle === 270) {
      toSide = "top";
      toX = toCenterX;
      toY = toBox.y;
    } else {
      // 315
      toSide = "right";
      toX = toBox.x + toBox.width;
      toY = toBox.y;
    }
  } else {
    if (oppositeAngle < 45 || oppositeAngle >= 315) {
      toSide = "right";
      toX = toBox.x + toBox.width;
    } else if (oppositeAngle < 135) {
      toSide = "bottom";
      toY = toBox.y + toBox.height;
    } else if (oppositeAngle < 225) {
      toSide = "left";
      toX = toBox.x;
    } else {
      toSide = "top";
      toY = toBox.y;
    }
  }

  return {
    from: { x: fromX, y: fromY, side: fromSide },
    to: { x: toX, y: toY, side: toSide },
  };
}

/**
 * Calculate smooth path with 45-degree and 90-degree angles
 * Uses orthogonal routing with 45-degree preference
 */
export function calculateSmooth45DegreePath(
  from: ConnectionPoint,
  to: ConnectionPoint,
  padding: number = 20
): string {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < 10) {
    return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
  }

  // Calculate angle
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  const normalizedAngle = (angle + 360) % 360;

  // Check if we can go direct 45-degree angle
  const canGo45 = normalizedAngle % 45 === 0;

  if (
    canGo45 &&
    (normalizedAngle === 45 ||
      normalizedAngle === 135 ||
      normalizedAngle === 225 ||
      normalizedAngle === 315)
  ) {
    // Direct 45-degree path
    return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
  }

  // Use a combination of 45-degree and orthogonal segments
  // Strategy: go 45 degrees first, then orthogonal to target

  // Initial 45-degree segment length
  const step45 = Math.min(distance / 3, 100);

  // Calculate 45-degree direction
  const preferredAngle = Math.round(angle / 45) * 45;
  const rad45 = preferredAngle * (Math.PI / 180);

  const mid1X = from.x + Math.cos(rad45) * step45;
  const mid1Y = from.y + Math.sin(rad45) * step45;

  // Second segment: orthogonal to target
  const remainingDx = to.x - mid1X;
  const remainingDy = to.y - mid1Y;

  // Determine if we should go horizontal or vertical next
  if (Math.abs(remainingDx) > Math.abs(remainingDy)) {
    // Horizontal final segment
    const midY = mid1Y;
    return `M ${from.x} ${from.y} L ${mid1X} ${mid1Y} L ${to.x} ${midY} L ${to.x} ${to.y}`;
  } else {
    // Vertical final segment
    const midX = mid1X;
    return `M ${from.x} ${from.y} L ${mid1X} ${mid1Y} L ${midX} ${to.y} L ${to.x} ${to.y}`;
  }
}

/**
 * Calculate hierarchical center-out layout
 * Positions nodes in layers from center outward with collision detection
 */
export function calculateHierarchicalLayout(
  nodes: NodeData[],
  connections: NodeConnection[],
  canvasWidth: number,
  canvasHeight: number,
  config: HierarchicalLayoutConfig = defaultHierarchicalConfig
): NodeData[] {
  if (nodes.length === 0) return [];

  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;

  // Find root node - prefer planning node, then any node without parent
  let rootNode = nodes.find(
    (n) => n.type === "utility" && n.utilityType === "planning"
  );

  if (!rootNode) {
    rootNode = nodes.find((n) => !n.parentId);
  }

  if (!rootNode) {
    // Fallback: use first node as root
    rootNode = nodes[0];
  }

  if (!rootNode) {
    return nodes; // Return unchanged if still no root found
  }

  // Build parent-child relationships from BOTH parentId AND connections
  const childrenMap = new Map<string, NodeData[]>();
  nodes.forEach((node) => {
    childrenMap.set(node.id, []);
  });

  // First, add children based on parentId
  nodes.forEach((node) => {
    if (node.parentId && childrenMap.has(node.parentId)) {
      childrenMap.get(node.parentId)!.push(node);
    }
  });

  // Also use connections to establish hierarchy for nodes without parentId
  // "child_of" and "depends_on" connections indicate parent-child relationships
  connections.forEach((conn) => {
    const sourceNode = nodes.find((n) => n.id === conn.sourceId);
    const targetNode = nodes.find((n) => n.id === conn.targetId);

    if (sourceNode && targetNode) {
      // For "child_of": source is child of target
      // For "depends_on": source depends on target (target is higher in hierarchy)
      // For "connects_to": bidirectional, but we treat source as lower level
      if (conn.type === "child_of" || conn.type === "depends_on") {
        // Only add if not already a parent-child via parentId
        if (!sourceNode.parentId) {
          const targetChildren = childrenMap.get(conn.targetId) || [];
          if (!targetChildren.find((c) => c.id === conn.sourceId)) {
            targetChildren.push(sourceNode);
            childrenMap.set(conn.targetId, targetChildren);
          }
        }
      }
    }
  });

  // Sort children by connection count (more connections = earlier in layout)
  nodes.forEach((nodeId) => {
    const children = childrenMap.get(nodeId.id) || [];
    children.sort((a, b) => {
      const aConnections = connections.filter(
        (c) => c.sourceId === a.id || c.targetId === a.id
      ).length;
      const bConnections = connections.filter(
        (c) => c.sourceId === b.id || c.targetId === b.id
      ).length;
      return bConnections - aConnections;
    });
  });

  // Assign hierarchy levels using BFS from root
  const levelMap = new Map<string, number>();
  const queue: { node: NodeData; level: number }[] = [
    { node: rootNode, level: 0 },
  ];
  levelMap.set(rootNode.id, 0);

  // DEBUG: Log hierarchical layout execution
  console.log(
    "🎯 Hierarchical Layout Applied: root=",
    rootNode.label,
    "nodes=",
    nodes.length,
    "canvas=",
    canvasWidth,
    "x",
    canvasHeight
  );

  while (queue.length > 0) {
    const { node, level } = queue.shift()!;
    const children = childrenMap.get(node.id) || [];

    children.forEach((child) => {
      if (!levelMap.has(child.id)) {
        levelMap.set(child.id, level + 1);
        queue.push({ node: child, level: level + 1 });
      }
    });
  }

  // Handle orphan nodes (not connected to root tree) - assign them to level 1
  let orphanLevel = 1;
  nodes.forEach((node) => {
    if (!levelMap.has(node.id)) {
      levelMap.set(node.id, orphanLevel);
      // Increment orphan level to spread them out
      orphanLevel = Math.min(orphanLevel + 1, 3);
    }
  });

  // Group nodes by level
  const levels = new Map<number, NodeData[]>();
  nodes.forEach((node) => {
    const level = levelMap.get(node.id) ?? 1;
    if (!levels.has(level)) {
      levels.set(level, []);
    }
    levels.get(level)!.push(node);
  });

  // Position nodes with collision avoidance
  const positionedNodes = new Map<string, NodeData>();
  const usedBoundingBoxes: BoundingBox[] = [];

  // Place root at center-top (not center-center, to allow hierarchy below)
  const rootPositioned = {
    ...rootNode,
    x: centerX,
    y: 150, // Place root near top
  };
  positionedNodes.set(rootNode.id, rootPositioned);
  usedBoundingBoxes.push(
    getNodeBoundingBox(rootPositioned, config.nodeWidth, config.nodeHeight)
  );

  // Place nodes level by level, left to right
  const maxLevel = Math.max(...Array.from(levels.keys()));

  for (let level = 1; level <= maxLevel; level++) {
    const nodesInLevel = levels.get(level) || [];
    if (nodesInLevel.length === 0) continue;

    const yPosition = 150 + level * config.layerDistance;

    // Calculate total width needed for this level
    const totalWidth = nodesInLevel.length * config.nodeSpacing;
    let startX = centerX - totalWidth / 2 + config.nodeSpacing / 2;

    nodesInLevel.forEach((node, index) => {
      // Skip if already positioned (root)
      if (positionedNodes.has(node.id)) return;

      let xPosition = startX + index * config.nodeSpacing;

      // Check for collisions and adjust
      let collision = true;
      let adjustmentAttempts = 0;
      const maxAdjustments = 20;

      while (collision && adjustmentAttempts < maxAdjustments) {
        const nodeBBox = getNodeBoundingBox(
          { ...node, x: xPosition, y: yPosition },
          config.nodeWidth,
          config.nodeHeight
        );

        collision = usedBoundingBoxes.some((bbox) =>
          checkBoundingBoxCollision(nodeBBox, bbox, config.minNodeSeparation)
        );

        if (collision) {
          // Move right to avoid collision
          xPosition += config.minNodeSeparation + config.nodeWidth;
          adjustmentAttempts++;
        }
      }

      const positionedNode = {
        ...node,
        x: xPosition,
        y: yPosition,
      };

      positionedNodes.set(node.id, positionedNode);
      usedBoundingBoxes.push(
        getNodeBoundingBox(positionedNode, config.nodeWidth, config.nodeHeight)
      );
    });
  }

  // Debug: Log level distribution
  console.log(
    "📊 Level distribution:",
    Array.from(levels.entries())
      .map(([l, n]) => `L${l}:${n.length}`)
      .join(", ")
  );

  return Array.from(positionedNodes.values());
}

export default {
  calculateHierarchicalLayout,
  findBestConnectionPoint,
  calculateSmooth45DegreePath,
  getNodeBoundingBox,
  checkBoundingBoxCollision,
};
