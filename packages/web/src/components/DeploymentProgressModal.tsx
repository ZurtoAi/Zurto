import React, { useEffect, useRef, useMemo } from "react";
import "./DeploymentProgressModal.css";

export interface DeploymentStep {
  id: string;
  name: string;
  status: "pending" | "running" | "completed" | "failed" | "skipped";
  progress?: number;
  message?: string;
  files?: string[];
  startedAt?: string;
  completedAt?: string;
  error?: string;
}

export interface FileActivity {
  path: string;
  action: "created" | "modified" | "deleted";
  timestamp: string;
}

export interface DeploymentProgressModalProps {
  isOpen: boolean;
  steps: DeploymentStep[];
  currentStep: string | null;
  files: FileActivity[];
  error: string | null;
  isComplete: boolean;
  onClose: () => void;
  onRetry: () => void;
  onCancel: () => void;
}

export const DeploymentProgressModal: React.FC<
  DeploymentProgressModalProps
> = ({
  isOpen,
  steps,
  currentStep,
  files,
  error,
  isComplete,
  onClose,
  onRetry,
  onCancel,
}) => {
  const fileListRef = useRef<HTMLDivElement>(null);

  // Auto-scroll file list
  useEffect(() => {
    if (fileListRef.current) {
      fileListRef.current.scrollTop = fileListRef.current.scrollHeight;
    }
  }, [files]);

  // Calculate current step index and get previous/next steps
  const { currentIndex, prevStep, currentStepData, nextStep } = useMemo(() => {
    const idx = steps.findIndex((s) => s.id === currentStep);
    return {
      currentIndex: idx,
      prevStep: idx > 0 ? steps[idx - 1] : null,
      currentStepData: idx >= 0 ? steps[idx] : null,
      nextStep: idx < steps.length - 1 ? steps[idx + 1] : null,
    };
  }, [steps, currentStep]);

  if (!isOpen) return null;

  const getStepIcon = (status: DeploymentStep["status"]) => {
    switch (status) {
      case "completed":
        return "✓";
      case "running":
        return "●";
      case "failed":
        return "✕";
      case "skipped":
        return "○";
      default:
        return "○";
    }
  };

  const hasFailed = steps.some((s) => s.status === "failed");
  const isDeploying = steps.some((s) => s.status === "running");
  const completedCount = steps.filter(
    (s) => s.status === "completed" || s.status === "skipped"
  ).length;

  return (
    <div className="deployment-modal-overlay">
      <div className="deployment-modal carousel-style">
        {/* Carousel Progress Display */}
        <div className="carousel-container">
          {/* Previous Step (faint) */}
          <div className="carousel-step prev-step">
            {prevStep ? (
              <>
                <span className="carousel-icon completed">
                  {getStepIcon(prevStep.status)}
                </span>
                <span className="carousel-name">{prevStep.name}</span>
              </>
            ) : (
              <span className="carousel-placeholder"></span>
            )}
          </div>

          {/* Current Step (prominent) */}
          <div
            className={`carousel-step current-step ${currentStepData?.status || ""}`}
          >
            {currentStepData ? (
              <>
                <div className="current-step-icon-wrapper">
                  <span className={`carousel-icon ${currentStepData.status}`}>
                    {currentStepData.status === "running" ? (
                      <span className="spinner"></span>
                    ) : (
                      getStepIcon(currentStepData.status)
                    )}
                  </span>
                </div>
                <div className="current-step-info">
                  <span className="carousel-name">{currentStepData.name}</span>
                  {currentStepData.message && (
                    <span className="carousel-message">
                      {currentStepData.message}
                    </span>
                  )}
                  {currentStepData.progress !== undefined &&
                    currentStepData.status === "running" && (
                      <div className="carousel-progress">
                        <div
                          className="carousel-progress-bar"
                          style={{ width: `${currentStepData.progress}%` }}
                        />
                      </div>
                    )}
                </div>
              </>
            ) : isComplete ? (
              <>
                <div className="current-step-icon-wrapper">
                  <span className="carousel-icon completed success-icon">
                    ✓
                  </span>
                </div>
                <div className="current-step-info">
                  <span className="carousel-name">Deployment Complete!</span>
                  <span className="carousel-message">
                    Your project is now running
                  </span>
                </div>
              </>
            ) : (
              <span className="carousel-placeholder">Starting...</span>
            )}
          </div>

          {/* Next Step (faint) */}
          <div className="carousel-step next-step">
            {nextStep && !isComplete ? (
              <>
                <span className="carousel-icon pending">
                  {getStepIcon(nextStep.status)}
                </span>
                <span className="carousel-name">{nextStep.name}</span>
              </>
            ) : (
              <span className="carousel-placeholder"></span>
            )}
          </div>
        </div>

        {/* Step Counter */}
        <div className="step-counter">
          <span className="step-current">{completedCount}</span>
          <span className="step-divider">/</span>
          <span className="step-total">{steps.length}</span>
          <span className="step-label">steps</span>
        </div>

        {/* Dots indicator */}
        <div className="step-dots">
          {steps.map((step, idx) => (
            <div
              key={step.id}
              className={`step-dot ${step.status} ${currentStep === step.id ? "active" : ""}`}
            />
          ))}
        </div>

        {/* Live File Activity (compact) */}
        {files.length > 0 && (
          <div className="live-files-compact" ref={fileListRef}>
            {files.slice(-5).map((file, idx) => (
              <div key={idx} className={`file-item-compact ${file.action}`}>
                <span className="file-action-icon">
                  {file.action === "created" && "+"}
                  {file.action === "modified" && "~"}
                  {file.action === "deleted" && "-"}
                </span>
                <span className="file-path-compact">{file.path}</span>
              </div>
            ))}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="deployment-error-compact">
            <span className="error-icon">⚠</span>
            <span className="error-text">{error}</span>
          </div>
        )}

        {/* Actions */}
        <div className="deployment-actions-compact">
          {isDeploying ? (
            <button className="btn-cancel-compact" onClick={onCancel}>
              Cancel
            </button>
          ) : hasFailed ? (
            <>
              <button className="btn-secondary-compact" onClick={onClose}>
                Close
              </button>
              <button className="btn-retry-compact" onClick={onRetry}>
                Retry
              </button>
            </>
          ) : isComplete ? (
            <button className="btn-primary-compact" onClick={onClose}>
              Done
            </button>
          ) : (
            <button className="btn-secondary-compact" onClick={onClose}>
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeploymentProgressModal;
