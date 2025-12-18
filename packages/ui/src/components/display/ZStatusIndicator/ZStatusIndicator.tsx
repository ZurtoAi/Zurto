import { forwardRef, HTMLAttributes } from "react";
import { Circle } from "lucide-react";
import { cn } from "@/utils/cn";
import styles from "./ZStatusIndicator.module.css";

export interface ZStatusIndicatorProps extends HTMLAttributes<HTMLDivElement> {
  /** Status */
  status: "online" | "offline" | "away" | "busy" | "idle";
  /** Show label */
  label?: string;
  /** Pulse animation */
  pulse?: boolean;
  /** Size */
  size?: "sm" | "md" | "lg";
}

export const ZStatusIndicator = forwardRef<
  HTMLDivElement,
  ZStatusIndicatorProps
>(({ status, label, pulse = false, size = "md", className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(styles.container, styles[size], className)}
      {...props}
    >
      <div
        className={cn(styles.indicator, styles[status], pulse && styles.pulse)}
      >
        <Circle className={styles.dot} />
      </div>
      {label && <span className={styles.label}>{label}</span>}
    </div>
  );
});

ZStatusIndicator.displayName = "ZStatusIndicator";

export default ZStatusIndicator;
