import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/utils/cn";
import { Loader2 } from "lucide-react";
import styles from "./ZSpinner.module.css";

export type ZSpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface ZSpinnerProps extends HTMLAttributes<HTMLDivElement> {
  /** Spinner size */
  size?: ZSpinnerSize;
  /** Custom color */
  color?: string;
  /** Loading text */
  label?: string;
  /** Spinner thickness (for ring variant) */
  thickness?: number;
  /** Variant style */
  variant?: "spinner" | "dots" | "pulse";
}

/**
 * ZSpinner - Loading spinner component for Zurto UI
 *
 * @example
 * <ZSpinner />
 * <ZSpinner size="lg" label="Loading..." />
 * <ZSpinner variant="dots" />
 */
export const ZSpinner = forwardRef<HTMLDivElement, ZSpinnerProps>(
  (
    {
      size = "md",
      color,
      label,
      thickness = 2,
      variant = "spinner",
      className,
      style,
      ...props
    },
    ref
  ) => {
    const customStyle = {
      ...style,
      "--spinner-color": color,
      "--spinner-thickness": `${thickness}px`,
    } as React.CSSProperties;

    return (
      <div
        ref={ref}
        className={cn(styles.wrapper, className)}
        role="status"
        aria-label={label || "Loading"}
        {...props}
      >
        {variant === "spinner" && (
          <Loader2
            className={cn(styles.spinner, styles[size])}
            style={customStyle}
          />
        )}

        {variant === "dots" && (
          <div className={cn(styles.dots, styles[size])} style={customStyle}>
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
          </div>
        )}

        {variant === "pulse" && (
          <div className={cn(styles.pulse, styles[size])} style={customStyle} />
        )}

        {label && <span className={styles.label}>{label}</span>}
      </div>
    );
  }
);

ZSpinner.displayName = "ZSpinner";

export default ZSpinner;
