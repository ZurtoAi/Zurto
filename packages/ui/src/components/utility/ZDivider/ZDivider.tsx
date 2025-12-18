import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZDivider.module.css";

export type ZDividerOrientation = "horizontal" | "vertical";
export type ZDividerVariant = "solid" | "dashed" | "dotted";

export interface ZDividerProps extends HTMLAttributes<HTMLDivElement> {
  /** Divider orientation */
  orientation?: ZDividerOrientation;
  /** Divider variant */
  variant?: ZDividerVariant;
  /** Label text */
  label?: string;
  /** Label position */
  labelPosition?: "left" | "center" | "right";
}

export const ZDivider = forwardRef<HTMLDivElement, ZDividerProps>(
  (
    {
      orientation = "horizontal",
      variant = "solid",
      label,
      labelPosition = "center",
      className,
      ...props
    },
    ref
  ) => {
    if (label && orientation === "horizontal") {
      return (
        <div
          ref={ref}
          className={cn(
            styles.divider,
            styles.horizontal,
            styles[variant],
            styles[`label-${labelPosition}`],
            className
          )}
          role="separator"
          {...props}
        >
          <span className={styles.label}>{label}</span>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          styles.divider,
          styles[orientation],
          styles[variant],
          className
        )}
        role="separator"
        aria-orientation={orientation}
        {...props}
      />
    );
  }
);

ZDivider.displayName = "ZDivider";

export default ZDivider;
