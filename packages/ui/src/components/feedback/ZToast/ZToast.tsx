import {
  HTMLAttributes,
  forwardRef,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from "react";
import { cn } from "@/utils/cn";
import styles from "./ZToast.module.css";

export type ZToastVariant =
  | "default"
  | "success"
  | "error"
  | "warning"
  | "info";
export type ZToastPosition =
  | "top-right"
  | "top-left"
  | "top-center"
  | "bottom-right"
  | "bottom-left"
  | "bottom-center";

export interface ZToastProps extends HTMLAttributes<HTMLDivElement> {
  /** Toast variant */
  variant?: ZToastVariant;
  /** Title text */
  title?: ReactNode;
  /** Description text */
  description?: ReactNode;
  /** Custom icon */
  icon?: ReactNode;
  /** Show close button */
  closable?: boolean;
  /** Auto dismiss duration (ms), 0 to disable */
  duration?: number;
  /** On close callback */
  onClose?: () => void;
  /** Action button */
  action?: ReactNode;
}

const SuccessIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const ErrorIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M15 9l-6 6M9 9l6 6" />
  </svg>
);

const WarningIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <path d="M12 9v4M12 17h.01" />
  </svg>
);

const InfoIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </svg>
);

const CloseIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const getDefaultIcon = (variant: ZToastVariant) => {
  switch (variant) {
    case "success":
      return <SuccessIcon />;
    case "error":
      return <ErrorIcon />;
    case "warning":
      return <WarningIcon />;
    case "info":
      return <InfoIcon />;
    default:
      return null;
  }
};

/**
 * ZToast - Toast notification component
 */
export const ZToast = forwardRef<HTMLDivElement, ZToastProps>(
  (
    {
      variant = "default",
      title,
      description,
      icon,
      closable = true,
      duration = 5000,
      onClose,
      action,
      className,
      ...props
    },
    ref
  ) => {
    const [isExiting, setIsExiting] = useState(false);

    const handleClose = useCallback(() => {
      setIsExiting(true);
      setTimeout(() => {
        onClose?.();
      }, 200);
    }, [onClose]);

    useEffect(() => {
      if (duration > 0) {
        const timer = setTimeout(handleClose, duration);
        return () => clearTimeout(timer);
      }
    }, [duration, handleClose]);

    const displayIcon = icon ?? getDefaultIcon(variant);

    return (
      <div
        ref={ref}
        className={cn(
          styles.toast,
          styles[variant],
          isExiting && styles.exiting,
          className
        )}
        role="alert"
        aria-live="polite"
        {...props}
      >
        {displayIcon && <span className={styles.icon}>{displayIcon}</span>}

        <div className={styles.content}>
          {title && <div className={styles.title}>{title}</div>}
          {description && (
            <div className={styles.description}>{description}</div>
          )}
        </div>

        {action && <div className={styles.action}>{action}</div>}

        {closable && (
          <button
            type="button"
            className={styles.close}
            onClick={handleClose}
            aria-label="Close toast"
          >
            <CloseIcon />
          </button>
        )}
      </div>
    );
  }
);

ZToast.displayName = "ZToast";

/* Toast Container */
export interface ZToastContainerProps extends HTMLAttributes<HTMLDivElement> {
  position?: ZToastPosition;
}

export const ZToastContainer = forwardRef<HTMLDivElement, ZToastContainerProps>(
  ({ position = "top-right", children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(styles.container, styles[position], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ZToastContainer.displayName = "ZToastContainer";

export default ZToast;
