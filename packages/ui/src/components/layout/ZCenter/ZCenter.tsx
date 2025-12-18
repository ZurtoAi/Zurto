import { forwardRef, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZCenter.module.css";

export interface ZCenterProps extends HTMLAttributes<HTMLDivElement> {
  /** Center inline (horizontally) */
  inline?: boolean;
  /** Children */
  children: ReactNode;
}

export const ZCenter = forwardRef<HTMLDivElement, ZCenterProps>(
  ({ inline = false, children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(styles.center, inline && styles.inline, className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ZCenter.displayName = "ZCenter";

export default ZCenter;
