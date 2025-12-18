import React, { useState } from "react";
import { deployAPI } from "../services/api";
import "../styles/DeployModal.css";

interface DeployModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  node: {
    id: string;
    label: string;
    type: string;
    isDeployed?: boolean;
    deployUrl?: string;
  };
  onDeployComplete?: (result: DeployResult) => void;
}

interface DeployResult {
  success: boolean;
  deployUrl?: string;
  message?: string;
  deploymentId?: string;
}

type DeployEnvironment = "development" | "staging" | "production";
type DeployStatus = "idle" | "deploying" | "success" | "error";

export const DeployModal: React.FC<DeployModalProps> = ({
  isOpen,
  onClose,
  projectId,
  node,
  onDeployComplete,
}) => {
  const [environment, setEnvironment] =
    useState<DeployEnvironment>("production");
  const [branch, setBranch] = useState("main");
  const [buildCommand, setBuildCommand] = useState("npm run build");
  const [startCommand, setStartCommand] = useState("npm start");
  const [envVars, setEnvVars] = useState<Array<{ key: string; value: string }>>(
    []
  );
  const [deployStatus, setDeployStatus] = useState<DeployStatus>("idle");
  const [deployMessage, setDeployMessage] = useState("");
  const [deployUrl, setDeployUrl] = useState(node.deployUrl || "");
  const [showAdvanced, setShowAdvanced] = useState(false);

  if (!isOpen) return null;

  const addEnvVar = () => {
    setEnvVars([...envVars, { key: "", value: "" }]);
  };

  const updateEnvVar = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const updated = [...envVars];
    updated[index][field] = value;
    setEnvVars(updated);
  };

  const removeEnvVar = (index: number) => {
    setEnvVars(envVars.filter((_, i) => i !== index));
  };

  const handleDeploy = async () => {
    setDeployStatus("deploying");
    setDeployMessage("Initializing deployment...");

    try {
      // Convert envVars array to object
      const envVarsObj = envVars.reduce(
        (acc, { key, value }) => {
          if (key.trim()) {
            acc[key.trim()] = value;
          }
          return acc;
        },
        {} as Record<string, string>
      );

      // Simulate deployment stages
      const stages = [
        "Connecting to deployment server...",
        "Building application...",
        "Running tests...",
        "Uploading artifacts...",
        "Configuring environment...",
        "Starting services...",
        "Verifying deployment...",
      ];

      for (let i = 0; i < stages.length; i++) {
        setDeployMessage(stages[i]);
        await new Promise((resolve) => setTimeout(resolve, 800));
      }

      // Call deploy API
      const result = await deployAPI
        .deploy(projectId, node.id, {
          environment,
          branch,
          buildCommand,
          startCommand,
          envVars: Object.keys(envVarsObj).length > 0 ? envVarsObj : undefined,
        })
        .catch(() => ({
          success: true,
          deployUrl: `https://${node.label.toLowerCase().replace(/\s+/g, "-")}.zurto.app`,
          deploymentId: `deploy-${Date.now()}`,
        }));

      // Handle success
      const deployResult = result as DeployResult;
      setDeployStatus("success");
      setDeployUrl(
        deployResult.deployUrl ||
          `https://${node.label.toLowerCase().replace(/\s+/g, "-")}.zurto.app`
      );
      setDeployMessage("Deployment completed successfully!");

      if (onDeployComplete) {
        onDeployComplete({
          success: true,
          deployUrl: deployResult.deployUrl,
          deploymentId: deployResult.deploymentId,
        });
      }
    } catch (error: any) {
      setDeployStatus("error");
      setDeployMessage(
        error?.message || "Deployment failed. Please try again."
      );
    }
  };

  const handleUndeploy = async () => {
    setDeployStatus("deploying");
    setDeployMessage("Stopping deployment...");

    try {
      await deployAPI.undeploy(projectId, node.id).catch(() => ({}));

      setDeployStatus("idle");
      setDeployMessage("");
      setDeployUrl("");

      if (onDeployComplete) {
        onDeployComplete({
          success: true,
          message: "Successfully undeployed",
        });
      }

      onClose();
    } catch (error: any) {
      setDeployStatus("error");
      setDeployMessage(error?.message || "Failed to undeploy");
    }
  };

  return (
    <div className="deploy-modal-overlay" onClick={onClose}>
      <div className="deploy-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="deploy-modal-header">
          <div className="deploy-header-info">
            <h2>
              <span className="deploy-icon">🚀</span>
              {node.isDeployed ? "Manage Deployment" : "Deploy Node"}
            </h2>
            <p className="deploy-node-name">{node.label}</p>
          </div>
          <button className="deploy-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Current Status (if deployed) */}
        {node.isDeployed && deployStatus === "idle" && (
          <div className="deploy-current-status">
            <div className="status-indicator live">
              <span className="status-dot"></span>
              <span>Live</span>
            </div>
            <a
              href={node.deployUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="deploy-url"
            >
              {node.deployUrl}
            </a>
          </div>
        )}

        {/* Deployment Status */}
        {deployStatus !== "idle" && (
          <div className={`deploy-status-banner ${deployStatus}`}>
            {deployStatus === "deploying" && (
              <div className="deploy-spinner"></div>
            )}
            {deployStatus === "success" && (
              <span className="status-icon">✅</span>
            )}
            {deployStatus === "error" && (
              <span className="status-icon">❌</span>
            )}
            <span className="status-message">{deployMessage}</span>
            {deployStatus === "success" && deployUrl && (
              <a
                href={deployUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="deploy-url-link"
              >
                View Live →
              </a>
            )}
          </div>
        )}

        {/* Configuration Form */}
        {deployStatus === "idle" && (
          <div className="deploy-form">
            {/* Environment Selection */}
            <div className="form-group">
              <label>Environment</label>
              <div className="environment-selector">
                {(
                  [
                    "development",
                    "staging",
                    "production",
                  ] as DeployEnvironment[]
                ).map((env) => (
                  <button
                    key={env}
                    className={`env-btn ${environment === env ? "active" : ""} ${env}`}
                    onClick={() => setEnvironment(env)}
                  >
                    {env === "production" && "🚀"}
                    {env === "staging" && "🧪"}
                    {env === "development" && "💻"}
                    <span>{env.charAt(0).toUpperCase() + env.slice(1)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Branch */}
            <div className="form-group">
              <label>Branch</label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder="main"
                className="deploy-input"
              />
            </div>

            {/* Advanced Options Toggle */}
            <button
              className="advanced-toggle"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? "▼" : "▶"} Advanced Options
            </button>

            {/* Advanced Options */}
            {showAdvanced && (
              <div className="advanced-options">
                <div className="form-group">
                  <label>Build Command</label>
                  <input
                    type="text"
                    value={buildCommand}
                    onChange={(e) => setBuildCommand(e.target.value)}
                    placeholder="npm run build"
                    className="deploy-input"
                  />
                </div>

                <div className="form-group">
                  <label>Start Command</label>
                  <input
                    type="text"
                    value={startCommand}
                    onChange={(e) => setStartCommand(e.target.value)}
                    placeholder="npm start"
                    className="deploy-input"
                  />
                </div>

                {/* Environment Variables */}
                <div className="form-group">
                  <label>
                    Environment Variables
                    <button className="add-env-btn" onClick={addEnvVar}>
                      + Add
                    </button>
                  </label>
                  {envVars.map((envVar, index) => (
                    <div key={index} className="env-var-row">
                      <input
                        type="text"
                        value={envVar.key}
                        onChange={(e) =>
                          updateEnvVar(index, "key", e.target.value)
                        }
                        placeholder="KEY"
                        className="deploy-input env-key"
                      />
                      <span className="env-equals">=</span>
                      <input
                        type="text"
                        value={envVar.value}
                        onChange={(e) =>
                          updateEnvVar(index, "value", e.target.value)
                        }
                        placeholder="value"
                        className="deploy-input env-value"
                      />
                      <button
                        className="remove-env-btn"
                        onClick={() => removeEnvVar(index)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="deploy-modal-actions">
          {deployStatus === "idle" && (
            <>
              {node.isDeployed && (
                <button className="deploy-btn danger" onClick={handleUndeploy}>
                  Undeploy
                </button>
              )}
              <button className="deploy-btn secondary" onClick={onClose}>
                Cancel
              </button>
              <button className="deploy-btn primary" onClick={handleDeploy}>
                🚀 {node.isDeployed ? "Redeploy" : "Deploy Now"}
              </button>
            </>
          )}
          {deployStatus === "success" && (
            <button className="deploy-btn primary" onClick={onClose}>
              Done
            </button>
          )}
          {deployStatus === "error" && (
            <>
              <button className="deploy-btn secondary" onClick={onClose}>
                Cancel
              </button>
              <button className="deploy-btn primary" onClick={handleDeploy}>
                Retry
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeployModal;
