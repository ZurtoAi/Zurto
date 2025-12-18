import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZDivider.module.css";

export type ZDividerOrientation = "horizontal" | "vertical";
export type ZDividerVariant = "solid" | "dashed" | "dotted";

export interface ZDividerProps extends HTMLAttributes<HTMLElement> {
  /** Divider orientation */
  orientation?: ZDividerOrientation;
  /** Line style */
  variant?: ZDividerVariant;
  /** Label text */
  label?: string;
  /** Label position */
  labelPosition?: "left" | "center" | "right";
  /** Spacing (token scale) */
  spacing?: number;
  /** Color */
  color?: "default" | "subtle" | "strong";
}

/**
 * ZDivider - Visual separator component
 *
 * @example
 * <ZDivider />
 * <ZDivider label="OR" labelPosition="center" />
 * <ZDivider orientation="vertical" />
 */
export const ZDivider = forwardRef<HTMLHRElement, ZDividerProps>(
  (
    {
      orientation = "horizontal",
      variant = "solid",
      label,
      labelPosition = "center",
      spacing = 4,
      color = "default",
      className,
      ...props
    },
    ref
  ) => {
    const isHorizontal = orientation === "horizontal";

    if (!label) {
      return (
        <hr
          ref={ref}
          className={cn(
            styles.divider,
            styles[orientation],
            styles[variant],
            styles[color],
            className
          )}
          style={{
            marginTop: isHorizontal ? `var(--z-space-${spacing})` : undefined,
            marginBottom: isHorizontal
              ? `var(--z-space-${spacing})`
              : undefined,
            marginLeft: !isHorizontal ? `var(--z-space-${spacing})` : undefined,
            marginRight: !isHorizontal
              ? `var(--z-space-${spacing})`
              : undefined,
          }}
          {...props}
        />
      );
    }

    return (
      <div
        className={cn(
          styles.wrapper,
          styles[orientation],
          styles[`label-${labelPosition}`],
          className
        )}
        style={{
          marginTop: isHorizontal ? `var(--z-space-${spacing})` : undefined,
          marginBottom: isHorizontal ? `var(--z-space-${spacing})` : undefined,
        }}
        role="separator"
      >
        <span className={cn(styles.line, styles[variant], styles[color])} />
        <span className={styles.label}>{label}</span>
        <span className={cn(styles.line, styles[variant], styles[color])} />
      </div>
    );
  }
);

ZDivider.displayName = "ZDivider";

export default ZDivider;
