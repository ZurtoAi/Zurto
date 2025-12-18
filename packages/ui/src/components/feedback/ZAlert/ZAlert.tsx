import { HTMLAttributes, forwardRef, ReactNode } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZAlert.module.css";

export type ZAlertVariant =
  | "default"
  | "success"
  | "error"
  | "warning"
  | "info";

export interface ZAlertProps extends HTMLAttributes<HTMLDivElement> {
  /** Alert variant */
  variant?: ZAlertVariant;
  /** Title text */
  title?: ReactNode;
  /** Custom icon */
  icon?: ReactNode;
  /** Show close button */
  closable?: boolean;
  /** On close callback */
  onClose?: () => void;
  /** Action buttons */
  actions?: ReactNode;
  /** Bordered style */
  bordered?: boolean;
  /** Filled style */
  filled?: boolean;
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

const getDefaultIcon = (variant: ZAlertVariant) => {
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
      return <InfoIcon />;
  }
};

/**
 * ZAlert - Alert banner component
 */
export const ZAlert = forwardRef<HTMLDivElement, ZAlertProps>(
  (
    {
      variant = "default",
      title,
      icon,
      closable = false,
      onClose,
      actions,
      bordered = false,
      filled = false,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const displayIcon = icon ?? getDefaultIcon(variant);

    return (
      <div
        ref={ref}
        className={cn(
          styles.alert,
          styles[variant],
          bordered && styles.bordered,
          filled && styles.filled,
          className
        )}
        role="alert"
        {...props}
      >
        {displayIcon && <span className={styles.icon}>{displayIcon}</span>}

        <div className={styles.content}>
          {title && <div className={styles.title}>{title}</div>}
          {children && <div className={styles.description}>{children}</div>}
        </div>

        {actions && <div className={styles.actions}>{actions}</div>}

        {closable && (
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Close alert"
          >
            <CloseIcon />
          </button>
        )}
      </div>
    );
  }
);

ZAlert.displayName = "ZAlert";

export default ZAlert;
