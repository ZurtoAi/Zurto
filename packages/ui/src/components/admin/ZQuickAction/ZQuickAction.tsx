import { forwardRef, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZQuickAction.module.css";

export interface ZQuickActionProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Icon */
  icon: ReactNode;
  /** Label */
  label: string;
  /** Description */
  description?: string;
  /** Color variant */
  variant?: "default" | "primary" | "success" | "warning" | "error";
}

export const ZQuickAction = forwardRef<HTMLButtonElement, ZQuickActionProps>(
  (
    { icon, label, description, variant = "default", className, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(styles.action, styles[variant], className)}
        {...props}
      >
        <div className={styles.icon}>{icon}</div>
        <div className={styles.content}>
          <div className={styles.label}>{label}</div>
          {description && (
            <div className={styles.description}>{description}</div>
          )}
        </div>
      </button>
    );
  }
);

ZQuickAction.displayName = "ZQuickAction";

export default ZQuickAction;
