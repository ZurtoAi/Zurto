import { HTMLAttributes, forwardRef, ReactNode } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZBadge.module.css";

export type ZBadgeVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "error"
  | "info";
export type ZBadgeSize = "sm" | "md" | "lg";

export interface ZBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Badge variant/color */
  variant?: ZBadgeVariant;
  /** Badge size */
  size?: ZBadgeSize;
  /** Show as dot only (no content) */
  dot?: boolean;
  /** Make badge rounded pill style */
  pill?: boolean;
  /** Add glow effect */
  glow?: boolean;
  /** Badge contents */
  children?: ReactNode;
}

/**
 * ZBadge - Badge/tag component for Zurto UI
 *
 * @example
 * <ZBadge variant="success">Active</ZBadge>
 * <ZBadge variant="error" dot />
 * <ZBadge variant="primary" pill>New</ZBadge>
 */
export const ZBadge = forwardRef<HTMLSpanElement, ZBadgeProps>(
  (
    {
      variant = "default",
      size = "md",
      dot = false,
      pill = false,
      glow = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={cn(
          styles.badge,
          styles[variant],
          styles[size],
          dot && styles.dot,
          pill && styles.pill,
          glow && styles.glow,
          className
        )}
        {...props}
      >
        {!dot && children}
      </span>
    );
  }
);

ZBadge.displayName = "ZBadge";

export default ZBadge;
