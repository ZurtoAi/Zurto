import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZProgress.module.css";

export type ZProgressSize = "xs" | "sm" | "md" | "lg";
export type ZProgressVariant =
  | "default"
  | "success"
  | "warning"
  | "error"
  | "info";

export interface ZProgressProps extends HTMLAttributes<HTMLDivElement> {
  /** Progress value (0-100) */
  value?: number;
  /** Maximum value */
  max?: number;
  /** Size variant */
  size?: ZProgressSize;
  /** Color variant */
  variant?: ZProgressVariant;
  /** Show percentage label */
  showLabel?: boolean;
  /** Indeterminate loading state */
  indeterminate?: boolean;
  /** Striped animation */
  striped?: boolean;
  /** Animated stripes */
  animated?: boolean;
  /** Glow effect */
  glow?: boolean;
}

/**
 * ZProgress - Progress bar component for Zurto UI
 *
 * @example
 * <ZProgress value={75} />
 * <ZProgress value={50} variant="success" showLabel />
 * <ZProgress indeterminate />
 */
export const ZProgress = forwardRef<HTMLDivElement, ZProgressProps>(
  (
    {
      value = 0,
      max = 100,
      size = "md",
      variant = "default",
      showLabel = false,
      indeterminate = false,
      striped = false,
      animated = false,
      glow = false,
      className,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    return (
      <div ref={ref} className={cn(styles.wrapper, className)} {...props}>
        <div
          className={cn(styles.track, styles[size], glow && styles.glow)}
          role="progressbar"
          aria-valuenow={indeterminate ? undefined : value}
          aria-valuemin={0}
          aria-valuemax={max}
        >
          <div
            className={cn(
              styles.bar,
              styles[variant],
              indeterminate && styles.indeterminate,
              striped && styles.striped,
              animated && styles.animated
            )}
            style={indeterminate ? undefined : { width: `${percentage}%` }}
          />
        </div>

        {showLabel && !indeterminate && (
          <span className={styles.label}>{Math.round(percentage)}%</span>
        )}
      </div>
    );
  }
);

ZProgress.displayName = "ZProgress";

export default ZProgress;

/* Circular Progress */
export interface ZCircularProgressProps extends HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  variant?: ZProgressVariant;
  showLabel?: boolean;
  indeterminate?: boolean;
}

export const ZCircularProgress = forwardRef<
  HTMLDivElement,
  ZCircularProgressProps
>(
  (
    {
      value = 0,
      max = 100,
      size = 48,
      strokeWidth = 4,
      variant = "default",
      showLabel = false,
      indeterminate = false,
      className,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div
        ref={ref}
        className={cn(styles.circularWrapper, className)}
        style={{ width: size, height: size }}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : value}
        aria-valuemin={0}
        aria-valuemax={max}
        {...props}
      >
        <svg
          className={cn(
            styles.circular,
            indeterminate && styles.circularIndeterminate
          )}
          width={size}
          height={size}
        >
          <circle
            className={styles.circularTrack}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />
          <circle
            className={cn(styles.circularBar, styles[`circular-${variant}`])}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={indeterminate ? circumference * 0.75 : offset}
          />
        </svg>

        {showLabel && !indeterminate && (
          <span className={styles.circularLabel}>
            {Math.round(percentage)}%
          </span>
        )}
      </div>
    );
  }
);

ZCircularProgress.displayName = "ZCircularProgress";
