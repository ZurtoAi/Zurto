import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZMasonry.module.css";

export interface ZMasonryProps extends HTMLAttributes<HTMLDivElement> {
  /** Number of columns */
  columns?: 2 | 3 | 4;
  /** Gap size */
  gap?: "sm" | "md" | "lg";
}

export const ZMasonry = forwardRef<HTMLDivElement, ZMasonryProps>(
  ({ columns = 3, gap = "md", className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          styles.masonry,
          styles[`columns-${columns}`],
          styles[`gap-${gap}`],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ZMasonry.displayName = "ZMasonry";

export default ZMasonry;
