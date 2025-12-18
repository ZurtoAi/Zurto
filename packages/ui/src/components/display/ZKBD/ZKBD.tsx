import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZKBD.module.css";

export interface ZKBDProps extends HTMLAttributes<HTMLElement> {
  /** Keys to display */
  keys: string | string[];
  /** Size */
  size?: "sm" | "md" | "lg";
}

export const ZKBD = forwardRef<HTMLElement, ZKBDProps>(
  ({ keys, size = "md", className, children, ...props }, ref) => {
    const keyArray = Array.isArray(keys) ? keys : [keys];

    return (
      <kbd
        ref={ref}
        className={cn(styles.container, styles[size], className)}
        {...props}
      >
        {keyArray.map((key, index) => (
          <span key={index}>
            <span className={styles.key}>{key}</span>
            {index < keyArray.length - 1 && (
              <span className={styles.separator}>+</span>
            )}
          </span>
        ))}
        {children}
      </kbd>
    );
  }
);

ZKBD.displayName = "ZKBD";

export default ZKBD;
