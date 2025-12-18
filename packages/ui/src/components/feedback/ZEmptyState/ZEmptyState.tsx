import { HTMLAttributes, forwardRef, ReactNode } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZEmptyState.module.css";

export type ZEmptyStateSize = "sm" | "md" | "lg";

export interface ZEmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  /** Custom icon or illustration */
  icon?: ReactNode;
  /** Title text */
  title?: ReactNode;
  /** Description text */
  description?: ReactNode;
  /** Action button(s) */
  action?: ReactNode;
  /** Size variant */
  size?: ZEmptyStateSize;
}

const DefaultIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7" />
    <path d="M4 13l4-4 4 4 4-4 4 4" />
    <path d="M4 17v1a2 2 0 002 2h12a2 2 0 002-2v-1" />
    <circle cx="12" cy="16" r="1" />
  </svg>
);

/**
 * ZEmptyState - Empty state placeholder
 */
export const ZEmptyState = forwardRef<HTMLDivElement, ZEmptyStateProps>(
  (
    {
      icon = <DefaultIcon />,
      title = "No data",
      description,
      action,
      size = "md",
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(styles.emptyState, styles[size], className)}
        {...props}
      >
        {icon && <div className={styles.icon}>{icon}</div>}
        {title && <h3 className={styles.title}>{title}</h3>}
        {description && <p className={styles.description}>{description}</p>}
        {action && <div className={styles.action}>{action}</div>}
      </div>
    );
  }
);

ZEmptyState.displayName = "ZEmptyState";

export default ZEmptyState;
