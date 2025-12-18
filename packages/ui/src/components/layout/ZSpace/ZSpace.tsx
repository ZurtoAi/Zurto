import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZSpace.module.css";

export type ZSpaceSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type ZSpaceDirection = "horizontal" | "vertical" | "both";

export interface ZSpaceProps extends HTMLAttributes<HTMLDivElement> {
  /** Space size */
  size?: ZSpaceSize;
  /** Space direction */
  direction?: ZSpaceDirection;
}

export const ZSpace = forwardRef<HTMLDivElement, ZSpaceProps>(
  ({ size = "md", direction = "both", className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(styles.space, styles[size], styles[direction], className)}
        {...props}
      />
    );
  }
);

ZSpace.displayName = "ZSpace";

export default ZSpace;
