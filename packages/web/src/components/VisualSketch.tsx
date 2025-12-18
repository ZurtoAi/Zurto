/**
 * Visual Sketch Component
 *
 * Interactive architecture/flow diagram for project visualization
 * Features:
 * - On-demand generation with "Generate Sketch" button
 * - Hand-drawn aesthetic with digital precision
 * - Interactive nodes with tooltips
 * - Zoomable/pannable canvas
 * - AI-powered diagram generation
 */

import React, { useState, useCallback, useMemo } from "react";
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  ConnectionMode,
  useNodesState,
  useEdgesState,
  MarkerType,
  Panel,
} from "reactflow";
import {
  Globe,
  Server,
  Database,
  Bot,
  Users,
  ArrowRight,
  Layers,
  Zap,
  Cloud,
  Lock,
  X,
  Download,
  Maximize2,
  Minimize2,
  Wand2,
  RefreshCw,
  Loader2,
  Sparkles,
} from "lucide-react";
import "reactflow/dist/style.css";
import "./VisualSketch.css";

// Custom Node Component for Sketch-style rendering
interface SketchNodeData {
  label: string;
  icon: string;
  description: string;
  tech?: string[];
  color?: string;
}

function SketchNode({ data }: { data: SketchNodeData }) {
  const iconMap: Record<string, React.ReactNode> = {
    web: <Globe size={20} />,
    api: <Server size={20} />,
    database: <Database size={20} />,
    bot: <Bot size={20} />,
    users: <Users size={20} />,
    auth: <Lock size={20} />,
    cloud: <Cloud size={20} />,
    worker: <Zap size={20} />,
    layers: <Layers size={20} />,
  };

  return (
    <div
      className="sketch-node"
      style={{ borderColor: data.color || "#df3e53" }}
    >
      <div
        className="sketch-node-icon"
        style={{ background: data.color || "#df3e53" }}
      >
        {iconMap[data.icon] || <Layers size={20} />}
      </div>
      <div className="sketch-node-content">
        <span className="sketch-node-label">{data.label}</span>
        <span className="sketch-node-desc">{data.description}</span>
        {data.tech && data.tech.length > 0 && (
          <div className="sketch-node-tech">
            {data.tech.map((t) => (
              <span key={t} className="tech-tag">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const nodeTypes = {
  sketch: SketchNode,
};

// Types
interface VisualSketchProps {
  isOpen: boolean;
  onClose: () => void;
  projectPlan?: {
    summary: string;
    features: string[];
    architecture: string;
    techStack: string[];
    estimatedComplexity: "low" | "medium" | "high";
  };
  projectName: string;
}

// Generate nodes from project plan
function generateNodesFromPlan(
  projectPlan?: VisualSketchProps["projectPlan"]
): { nodes: Node[]; edges: Edge[] } {
  // Default nodes if no plan provided
  const defaultNodes: Node[] = [
    {
      id: "users",
      type: "sketch",
      position: { x: 100, y: 50 },
      data: {
        label: "Users",
        icon: "users",
        description: "End users accessing the application",
        color: "#48bb78",
      },
    },
    {
      id: "web",
      type: "sketch",
      position: { x: 100, y: 200 },
      data: {
        label: "Frontend",
        icon: "web",
        description: "React web application",
        tech: ["React", "Vite", "TypeScript"],
        color: "#5865f2",
      },
    },
    {
      id: "api",
      type: "sketch",
      position: { x: 350, y: 200 },
      data: {
        label: "API Server",
        icon: "api",
        description: "Express.js REST API",
        tech: ["Node.js", "Express", "TypeScript"],
        color: "#df3e53",
      },
    },
    {
      id: "auth",
      type: "sketch",
      position: { x: 350, y: 350 },
      data: {
        label: "Authentication",
        icon: "auth",
        description: "JWT-based authentication",
        tech: ["JWT", "bcrypt"],
        color: "#ecc94b",
      },
    },
    {
      id: "database",
      type: "sketch",
      position: { x: 600, y: 200 },
      data: {
        label: "Database",
        icon: "database",
        description: "Data persistence layer",
        tech: ["PostgreSQL", "Prisma"],
        color: "#48bb78",
      },
    },
  ];

  const defaultEdges: Edge[] = [
    {
      id: "users-web",
      source: "users",
      target: "web",
      animated: true,
      style: { stroke: "#5865f2", strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#5865f2" },
    },
    {
      id: "web-api",
      source: "web",
      target: "api",
      animated: true,
      style: { stroke: "#df3e53", strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#df3e53" },
      label: "REST API",
      labelStyle: { fill: "rgba(255,255,255,0.7)", fontSize: 11 },
    },
    {
      id: "api-auth",
      source: "api",
      target: "auth",
      style: { stroke: "#ecc94b", strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#ecc94b" },
    },
    {
      id: "api-db",
      source: "api",
      target: "database",
      animated: true,
      style: { stroke: "#48bb78", strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#48bb78" },
      label: "Queries",
      labelStyle: { fill: "rgba(255,255,255,0.7)", fontSize: 11 },
    },
  ];

  // If we have a project plan, we could generate more dynamic nodes
  if (projectPlan) {
    // Add additional nodes based on features
    let yOffset = 500;
    projectPlan.features.forEach((feature, idx) => {
      defaultNodes.push({
        id: `feature-${idx}`,
        type: "sketch",
        position: { x: 100 + idx * 200, y: yOffset },
        data: {
          label: feature.split(" ").slice(0, 3).join(" "),
          icon: "layers",
          description: feature,
          color: idx % 2 === 0 ? "#875df6" : "#5865f2",
        },
      });
    });
  }

  return { nodes: defaultNodes, edges: defaultEdges };
}

export function VisualSketch({
  isOpen,
  onClose,
  projectPlan,
  projectName,
}: VisualSketchProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate nodes and edges
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => generateNodesFromPlan(projectPlan),
    [projectPlan]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const handleExport = useCallback(() => {
    // Export as PNG would go here
    console.log("Exporting diagram...");
  }, []);

  // Generate sketch handler
  const handleGenerateSketch = useCallback(async () => {
    setIsGenerating(true);

    // Simulate AI generation delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Reset nodes with generated data
    const { nodes: newNodes, edges: newEdges } =
      generateNodesFromPlan(projectPlan);
    setNodes(newNodes);
    setEdges(newEdges);

    setIsGenerating(false);
    setIsGenerated(true);
  }, [projectPlan, setNodes, setEdges]);

  // Regenerate sketch
  const handleRegenerateSketch = useCallback(async () => {
    setIsGenerating(true);

    // Simulate regeneration
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const { nodes: newNodes, edges: newEdges } =
      generateNodesFromPlan(projectPlan);
    setNodes(newNodes);
    setEdges(newEdges);

    setIsGenerating(false);
  }, [projectPlan, setNodes, setEdges]);

  if (!isOpen) return null;

  return (
    <div
      className={`visual-sketch-overlay ${isFullscreen ? "fullscreen" : ""}`}
      onClick={onClose}
    >
      <div className="visual-sketch-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sketch-header">
          <div className="sketch-title">
            <Layers size={20} />
            <span>Architecture Diagram</span>
            <span className="project-badge">{projectName}</span>
          </div>
          <div className="sketch-actions">
            {isGenerated && (
              <>
                <button
                  className="sketch-action-btn"
                  onClick={handleRegenerateSketch}
                  disabled={isGenerating}
                  title="Regenerate Diagram"
                >
                  {isGenerating ? (
                    <Loader2 size={16} className="spin-icon" />
                  ) : (
                    <RefreshCw size={16} />
                  )}
                </button>
                <button
                  className="sketch-action-btn"
                  onClick={handleExport}
                  title="Export as PNG"
                >
                  <Download size={16} />
                </button>
              </>
            )}
            <button
              className="sketch-action-btn"
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <button className="sketch-close-btn" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Project Info */}
        {projectPlan && (
          <div className="sketch-info-bar">
            <div className="info-item">
              <span className="info-label">Summary:</span>
              <span className="info-value">{projectPlan.summary}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Complexity:</span>
              <span
                className={`complexity-badge ${projectPlan.estimatedComplexity}`}
              >
                {projectPlan.estimatedComplexity}
              </span>
            </div>
          </div>
        )}

        {/* ReactFlow Canvas */}
        <div className="sketch-canvas">
          {!isGenerated ? (
            /* Generate Sketch Prompt */
            <div className="generate-prompt">
              <div className="generate-prompt-content">
                <div className="generate-icon">
                  <Sparkles size={48} />
                </div>
                <h3>Generate Architecture Diagram</h3>
                <p>
                  Create an AI-powered visual representation of your project's
                  architecture based on the questionnaire responses.
                </p>
                <button
                  className="generate-btn"
                  onClick={handleGenerateSketch}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 size={18} className="spin-icon" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 size={18} />
                      Generate Sketch
                    </>
                  )}
                </button>
                <span className="generate-hint">
                  This will analyze your project and create an interactive
                  diagram
                </span>
              </div>
            </div>
          ) : (
            /* ReactFlow Diagram */
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              connectionMode={ConnectionMode.Loose}
              fitView
              fitViewOptions={{ padding: 0.2 }}
              minZoom={0.3}
              maxZoom={2}
              defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
            >
              <Background
                variant={BackgroundVariant.Dots}
                gap={20}
                size={1}
                color="rgba(255,255,255,0.08)"
              />
              <Controls showInteractive={false} className="sketch-controls" />
              <MiniMap
                nodeColor={(node) => node.data?.color || "#df3e53"}
                maskColor="rgba(0,0,0,0.8)"
                className="sketch-minimap"
              />

              {/* Legend Panel */}
              <Panel position="bottom-left" className="sketch-legend">
                <div className="legend-title">Legend</div>
                <div className="legend-items">
                  <div className="legend-item">
                    <span
                      className="legend-color"
                      style={{ background: "#5865f2" }}
                    ></span>
                    <span>Frontend</span>
                  </div>
                  <div className="legend-item">
                    <span
                      className="legend-color"
                      style={{ background: "#df3e53" }}
                    ></span>
                    <span>Backend</span>
                  </div>
                  <div className="legend-item">
                    <span
                      className="legend-color"
                      style={{ background: "#48bb78" }}
                    ></span>
                    <span>Database</span>
                  </div>
                  <div className="legend-item">
                    <span
                      className="legend-color"
                      style={{ background: "#ecc94b" }}
                    ></span>
                    <span>Auth/Security</span>
                  </div>
                </div>
              </Panel>
            </ReactFlow>
          )}
        </div>

        {/* Tech Stack Footer */}
        {projectPlan?.techStack && (
          <div className="sketch-footer">
            <span className="tech-label">Tech Stack:</span>
            <div className="tech-tags">
              {projectPlan.techStack.map((tech) => (
                <span key={tech} className="tech-tag">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VisualSketch;
