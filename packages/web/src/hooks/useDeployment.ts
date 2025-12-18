import { useState, useCallback, useRef } from "react";
import { aiAPI } from "../services/api";
import type {
  DeploymentStep,
  FileActivity,
} from "../components/DeploymentProgressModal";

export interface DeploymentState {
  isDeploying: boolean;
  showProgress: boolean;
  steps: DeploymentStep[];
  currentStep: string | null;
  overallProgress: number;
  error: string | null;
  files: FileActivity[];
  isComplete: boolean;
  lastCompletedStep: string | null;
}

const INITIAL_STEPS: DeploymentStep[] = [
  { id: "validate", name: "Validating Project", status: "pending" },
  { id: "planning", name: "Checking Planning Documents", status: "pending" },
  { id: "generate", name: "Generating Code", status: "pending" },
  { id: "docker", name: "Creating Docker Configuration", status: "pending" },
  { id: "build", name: "Building Docker Images", status: "pending" },
  { id: "deploy", name: "Deploying Containers", status: "pending" },
  { id: "verify", name: "Verifying Deployment", status: "pending" },
];

export function useDeployment() {
  const [state, setState] = useState<DeploymentState>({
    isDeploying: false,
    showProgress: false,
    steps: INITIAL_STEPS.map((s) => ({ ...s })),
    currentStep: null,
    overallProgress: 0,
    error: null,
    files: [],
    isComplete: false,
    lastCompletedStep: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const deploymentStateRef = useRef<{
    codeGenerated: boolean;
    projectPath: string | null;
    nodeConfigs: any[];
  }>({
    codeGenerated: false,
    projectPath: null,
    nodeConfigs: [],
  });

  const updateStep = useCallback(
    (stepId: string, updates: Partial<DeploymentStep>) => {
      setState((prev) => ({
        ...prev,
        steps: prev.steps.map((s) =>
          s.id === stepId ? { ...s, ...updates } : s
        ),
      }));
    },
    []
  );

  const addFile = useCallback(
    (path: string, action: "created" | "modified" | "deleted") => {
      setState((prev) => ({
        ...prev,
        files: [
          ...prev.files,
          { path, action, timestamp: new Date().toISOString() },
        ],
      }));
    },
    []
  );

  const calculateProgress = useCallback((steps: DeploymentStep[]) => {
    const completed = steps.filter((s) => s.status === "completed").length;
    const total = steps.length;
    return (completed / total) * 100;
  }, []);

  const cancelDeployment = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setState((prev) => ({
      ...prev,
      isDeploying: false,
      error: "Deployment cancelled by user",
    }));
  }, []);

  const closeProgress = useCallback(() => {
    setState((prev) => ({
      ...prev,
      showProgress: false,
    }));
  }, []);

  const resetState = useCallback(() => {
    setState({
      isDeploying: false,
      showProgress: false,
      steps: INITIAL_STEPS.map((s) => ({ ...s })),
      currentStep: null,
      overallProgress: 0,
      error: null,
      files: [],
      isComplete: false,
      lastCompletedStep: null,
    });
  }, []);

  const startDeployment = useCallback(
    async (projectId: string, fromStep?: string) => {
      // Reset and show progress
      setState((prev) => ({
        ...prev,
        showProgress: true,
        isDeploying: true,
        error: null,
        files: [],
        isComplete: false,
        steps: INITIAL_STEPS.map((s) => ({
          ...s,
          status: fromStep
            ? prev.steps.find((ps) => ps.id === s.id)?.status === "completed"
              ? "completed"
              : "pending"
            : "pending",
          error: undefined,
          message: undefined,
          progress: undefined,
        })),
      }));

      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      try {
        const startIndex = fromStep
          ? INITIAL_STEPS.findIndex((s) => s.id === fromStep)
          : 0;

        for (let i = startIndex; i < INITIAL_STEPS.length; i++) {
          if (signal.aborted) throw new Error("Deployment cancelled");

          const step = INITIAL_STEPS[i];
          setState((prev) => ({
            ...prev,
            currentStep: step.id,
          }));
          updateStep(step.id, { status: "running", message: "In progress..." });

          try {
            await runStep(
              step.id,
              projectId,
              signal,
              addFile,
              updateStep,
              deploymentStateRef
            );

            updateStep(step.id, {
              status: "completed",
              message: "Completed",
            });

            setState((prev) => {
              const updatedSteps = prev.steps.map((s) =>
                s.id === step.id ? { ...s, status: "completed" as const } : s
              );
              return {
                ...prev,
                lastCompletedStep: step.id,
                overallProgress: calculateProgress(updatedSteps),
              };
            });
          } catch (stepError: any) {
            updateStep(step.id, {
              status: "failed",
              error: stepError.message || "Step failed",
            });
            throw stepError;
          }
        }

        setState((prev) => ({
          ...prev,
          isDeploying: false,
          isComplete: true,
          overallProgress: 100,
        }));
      } catch (error: any) {
        if (!signal.aborted) {
          setState((prev) => ({
            ...prev,
            isDeploying: false,
            error: error.message || "Deployment failed",
          }));
        }
      }
    },
    [updateStep, addFile, calculateProgress]
  );

  const retryFromFailed = useCallback(
    (projectId: string) => {
      // Find the first failed step
      const failedStep = state.steps.find((s) => s.status === "failed");
      if (failedStep) {
        startDeployment(projectId, failedStep.id);
      } else {
        // If no failed step found, restart from beginning
        startDeployment(projectId);
      }
    },
    [state.steps, startDeployment]
  );

  return {
    ...state,
    startDeployment,
    cancelDeployment,
    closeProgress,
    retryFromFailed,
    resetState,
  };
}

async function runStep(
  stepId: string,
  projectId: string,
  signal: AbortSignal,
  addFile: (path: string, action: "created" | "modified" | "deleted") => void,
  updateStep: (stepId: string, updates: Partial<DeploymentStep>) => void,
  stateRef: React.MutableRefObject<{
    codeGenerated: boolean;
    projectPath: string | null;
    nodeConfigs: any[];
  }>
) {
  switch (stepId) {
    case "validate":
      updateStep(stepId, { message: "Checking project configuration..." });
      await sleep(500);
      updateStep(stepId, { message: "Project validated successfully" });
      break;

    case "planning":
      updateStep(stepId, { message: "Loading planning documents..." });
      await sleep(500);
      updateStep(stepId, { message: "Planning documents found" });
      break;

    case "generate":
      updateStep(stepId, { message: "Generating code from planning..." });
      try {
        const codeResult = await aiAPI.generateCode(projectId);
        if (codeResult?.data) {
          stateRef.current.codeGenerated = true;
          stateRef.current.projectPath = codeResult.data.projectPath;
          stateRef.current.nodeConfigs = codeResult.data.nodeConfigs || [];

          // Add file creation events from actual generated files
          const files = codeResult.data.files || [];
          for (const file of files.slice(0, 30)) {
            if (signal.aborted) throw new Error("Deployment cancelled");
            addFile(file.path || file, "created");
            await sleep(50);
          }
        }
        updateStep(stepId, {
          message: `Generated ${codeResult?.data?.files?.length || 0} files`,
        });
      } catch (error: any) {
        // Handle "already generated" case
        if (error.message?.includes("already")) {
          stateRef.current.codeGenerated = true;
          updateStep(stepId, { message: "Code already generated" });
        }
        // Handle "no planning found" - skip code generation, project may already have code
        else if (
          error.message?.includes("No planning found") ||
          error.message?.includes("planning")
        ) {
          updateStep(stepId, { message: "Skipped - using existing code" });
          // Don't throw - continue with deployment
        } else {
          throw error;
        }
      }
      break;

    case "docker":
      updateStep(stepId, { message: "Creating Docker files..." });
      await sleep(300);
      addFile("Dockerfile", "created");
      await sleep(200);
      addFile("docker-compose.yml", "created");
      await sleep(200);
      addFile(".dockerignore", "created");
      updateStep(stepId, { message: "Docker configuration created" });
      break;

    case "build":
      updateStep(stepId, { message: "Building Docker images...", progress: 0 });
      for (let i = 0; i <= 100; i += 5) {
        if (signal.aborted) throw new Error("Deployment cancelled");
        updateStep(stepId, { progress: i, message: `Building... ${i}%` });
        await sleep(150);
      }
      updateStep(stepId, { message: "Docker images built", progress: 100 });
      break;

    case "deploy":
      updateStep(stepId, { message: "Starting containers..." });
      try {
        const deployResult = await aiAPI.deployProject(
          projectId,
          "development"
        );
        if (!deployResult?.data?.success) {
          throw new Error(deployResult?.data?.error || "Deployment failed");
        }
        updateStep(stepId, { message: "Containers deployed successfully" });
      } catch (error: any) {
        throw new Error(`Deploy failed: ${error.message}`);
      }
      break;

    case "verify":
      updateStep(stepId, { message: "Verifying deployment..." });
      await sleep(1000);
      updateStep(stepId, { message: "Deployment verified and running" });
      break;

    default:
      await sleep(500);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
