import { forwardRef, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZCode.module.css";

export type ZCodeVariant = "inline" | "block";

export interface ZCodeProps extends HTMLAttributes<HTMLElement> {
  /** Code variant */
  variant?: ZCodeVariant;
  /** Code language (for syntax highlighting hint) */
  language?: string;
  /** Children */
  children: ReactNode;
}

export const ZCode = forwardRef<HTMLElement, ZCodeProps>(
  ({ variant = "inline", language, children, className, ...props }, ref) => {
    if (variant === "block") {
      return (
        <pre
          ref={ref as any}
          className={cn(styles.block, className)}
          {...props}
        >
          <code className={styles.code} data-language={language}>
            {children}
          </code>
        </pre>
      );
    }

    return (
      <code ref={ref} className={cn(styles.inline, className)} {...props}>
        {children}
      </code>
    );
  }
);

ZCode.displayName = "ZCode";

export default ZCode;
