import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZAspectRatio.module.css";

export interface ZAspectRatioProps extends HTMLAttributes<HTMLDivElement> {
  /** Aspect ratio */
  ratio?: "1/1" | "4/3" | "16/9" | "21/9" | "3/2";
}

export const ZAspectRatio = forwardRef<HTMLDivElement, ZAspectRatioProps>(
  ({ ratio = "16/9", className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          styles.aspectRatio,
          styles[`ratio-${ratio.replace("/", "-")}`],
          className
        )}
        {...props}
      >
        <div className={styles.content}>{children}</div>
      </div>
    );
  }
);

ZAspectRatio.displayName = "ZAspectRatio";

export default ZAspectRatio;
