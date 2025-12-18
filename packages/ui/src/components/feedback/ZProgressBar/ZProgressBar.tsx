import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZProgressBar.module.css";

export type ZProgressBarVariant = "default" | "gradient" | "striped";
export type ZProgressBarSize = "xs" | "sm" | "md" | "lg";
export type ZProgressBarColor =
  | "primary"
  | "accent"
  | "success"
  | "warning"
  | "error";

export interface ZProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  /** Progress value (0-100) */
  value: number;
  /** Maximum value */
  max?: number;
  /** Progress bar variant */
  variant?: ZProgressBarVariant;
  /** Progress bar size */
  size?: ZProgressBarSize;
  /** Color scheme */
  color?: ZProgressBarColor;
  /** Show label */
  showLabel?: boolean;
  /** Custom label */
  label?: string;
  /** Animated */
  animated?: boolean;
}

export const ZProgressBar = forwardRef<HTMLDivElement, ZProgressBarProps>(
  (
    {
      value,
      max = 100,
      variant = "default",
      size = "md",
      color = "accent",
      showLabel = false,
      label,
      animated = false,
      className,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    const displayLabel = label || `${Math.round(percentage)}%`;

    return (
      <div ref={ref} className={cn(styles.container, className)} {...props}>
        {showLabel && <span className={styles.label}>{displayLabel}</span>}
        <div
          className={cn(styles.track, styles[size], styles[variant])}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        >
          <div
            className={cn(
              styles.fill,
              styles[color],
              animated && styles.animated
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);

ZProgressBar.displayName = "ZProgressBar";

export default ZProgressBar;
