/**
 * @zurto/ui - Official UI component library for Zurto
 *
 * Modern React components with dark theme and glassmorphism effects
 *
 * @see https://ui.zurto.app
 * @license MIT
 */

// Design tokens (CSS)
import "./tokens/colors.css";
import "./tokens/typography.css";
import "./tokens/spacing.css";
import "./tokens/shadows.css";
import "./tokens/animations.css";
import "./tokens/radius.css";
import "./tokens/z-index.css";
import "./tokens/breakpoints.css";

// Provider
export {
  ZProvider,
  useZTheme,
  type ZProviderProps,
  type ZTheme,
} from "./components/ZProvider";

// Core Components
export * from "./components/core";

// Layout Components
export * from "./components/layout";

// Navigation Components
export * from "./components/navigation";

// Feedback Components
export * from "./components/feedback";

// Data Display Components
export * from "./components/data-display";

// Form Components
export * from "./components/forms";

// Advanced Components
export * from "./components/advanced";

// Utilities
export { cn } from "./utils/cn";
export {
  useFocusTrap,
  useRestoreFocus,
  useArrowNavigation,
} from "./utils/a11y";

// Version
export const VERSION = "1.0.0";
