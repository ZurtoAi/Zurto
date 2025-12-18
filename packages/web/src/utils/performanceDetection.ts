/**
 * Performance Detection Utility
 * Detects GPU acceleration availability and adjusts visual quality accordingly
 */

export interface PerformanceCapabilities {
  hasGPUAcceleration: boolean;
  prefersReducedMotion: boolean;
  isLowEndDevice: boolean;
  recommendedQuality: "high" | "medium" | "low";
}

// Check if user prefers reduced motion
function checkReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Detect GPU acceleration capability
function detectGPUAcceleration(): boolean {
  if (typeof document === "undefined") return true;

  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    if (!gl) return false;

    // Check for hardware acceleration indicators
    const debugInfo = (gl as WebGLRenderingContext).getExtension(
      "WEBGL_debug_renderer_info"
    );
    if (debugInfo) {
      const renderer = (gl as WebGLRenderingContext).getParameter(
        debugInfo.UNMASKED_RENDERER_WEBGL
      );
      // Software renderers indicate no GPU acceleration
      const softwareRenderers = [
        "SwiftShader",
        "llvmpipe",
        "Software",
        "Microsoft Basic Render",
      ];
      if (
        softwareRenderers.some((sw) =>
          renderer.toLowerCase().includes(sw.toLowerCase())
        )
      ) {
        return false;
      }
    }

    return true;
  } catch {
    return true; // Assume GPU is available if detection fails
  }
}

// Check for low-end device indicators
function detectLowEndDevice(): boolean {
  if (typeof navigator === "undefined") return false;

  // Check hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 4;
  if (cores <= 2) return true;

  // Check device memory if available
  const memory = (navigator as unknown as { deviceMemory?: number })
    .deviceMemory;
  if (memory && memory <= 2) return true;

  // Check connection type for mobile data constraints
  const connection = (
    navigator as unknown as {
      connection?: { effectiveType?: string; saveData?: boolean };
    }
  ).connection;
  if (connection?.saveData) return true;
  if (
    connection?.effectiveType &&
    ["slow-2g", "2g"].includes(connection.effectiveType)
  ) {
    return true;
  }

  return false;
}

// Determine recommended quality level
function getRecommendedQuality(
  hasGPU: boolean,
  reducedMotion: boolean,
  lowEnd: boolean
): "high" | "medium" | "low" {
  if (reducedMotion || !hasGPU) return "low";
  if (lowEnd) return "medium";
  return "high";
}

// Main detection function
export function detectPerformanceCapabilities(): PerformanceCapabilities {
  const hasGPUAcceleration = detectGPUAcceleration();
  const prefersReducedMotion = checkReducedMotion();
  const isLowEndDevice = detectLowEndDevice();
  const recommendedQuality = getRecommendedQuality(
    hasGPUAcceleration,
    prefersReducedMotion,
    isLowEndDevice
  );

  return {
    hasGPUAcceleration,
    prefersReducedMotion,
    isLowEndDevice,
    recommendedQuality,
  };
}

// Apply performance class to document
export function applyPerformanceClass(): PerformanceCapabilities {
  const capabilities = detectPerformanceCapabilities();

  if (typeof document !== "undefined") {
    const root = document.documentElement;

    // Remove existing performance classes
    root.classList.remove("perf-high", "perf-medium", "perf-low");

    // Add appropriate class
    root.classList.add(`perf-${capabilities.recommendedQuality}`);

    // Set CSS custom properties for dynamic adjustments
    root.style.setProperty(
      "--blur-amount",
      capabilities.recommendedQuality === "high"
        ? "8px"
        : capabilities.recommendedQuality === "medium"
          ? "4px"
          : "0px"
    );
    root.style.setProperty(
      "--animation-duration",
      capabilities.recommendedQuality === "low" ? "0s" : "0.2s"
    );
    root.style.setProperty(
      "--transition-multiplier",
      capabilities.recommendedQuality === "low" ? "0" : "1"
    );
  }

  return capabilities;
}

// Listen for preference changes
export function watchPerformancePreferences(
  callback: (capabilities: PerformanceCapabilities) => void
): () => void {
  if (typeof window === "undefined") return () => {};

  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  const handler = () => {
    const capabilities = applyPerformanceClass();
    callback(capabilities);
  };

  mediaQuery.addEventListener("change", handler);

  return () => mediaQuery.removeEventListener("change", handler);
}
