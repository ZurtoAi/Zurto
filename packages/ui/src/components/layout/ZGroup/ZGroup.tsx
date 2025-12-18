import { forwardRef, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZGroup.module.css";

export type ZGroupSpacing = "xs" | "sm" | "md" | "lg";
export type ZGroupPosition = "left" | "center" | "right" | "apart";

export interface ZGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Gap between items */
  spacing?: ZGroupSpacing;
  /** Position */
  position?: ZGroupPosition;
  /** Wrap items */
  wrap?: boolean;
  /** Grow items to fill space */
  grow?: boolean;
  /** Children */
  children: ReactNode;
}

export const ZGroup = forwardRef<HTMLDivElement, ZGroupProps>(
  (
    {
      spacing = "md",
      position = "left",
      wrap = false,
      grow = false,
      children,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          styles.group,
          styles[`spacing-${spacing}`],
          styles[`position-${position}`],
          wrap && styles.wrap,
          grow && styles.grow,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ZGroup.displayName = "ZGroup";

export default ZGroup;
