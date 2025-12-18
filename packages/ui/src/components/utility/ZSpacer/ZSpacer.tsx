import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZSpacer.module.css";

export interface ZSpacerProps extends HTMLAttributes<HTMLDivElement> {
  /** Size */
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  /** Direction */
  direction?: "horizontal" | "vertical";
}

export const ZSpacer = forwardRef<HTMLDivElement, ZSpacerProps>(
  ({ size = "md", direction = "vertical", className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          styles.spacer,
          styles[size],
          styles[direction],
          className
        )}
        aria-hidden="true"
        {...props}
      />
    );
  }
);

ZSpacer.displayName = "ZSpacer";

export default ZSpacer;
