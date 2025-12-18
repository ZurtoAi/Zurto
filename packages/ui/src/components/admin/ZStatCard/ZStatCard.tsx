import { forwardRef, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZStatCard.module.css";

export interface ZStatCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Title */
  title: string;
  /** Value */
  value: string | number;
  /** Description */
  description?: string;
  /** Icon */
  icon?: ReactNode;
  /** Color variant */
  variant?: "default" | "success" | "warning" | "error" | "info";
  /** Show border */
  bordered?: boolean;
}

export const ZStatCard = forwardRef<HTMLDivElement, ZStatCardProps>(
  (
    {
      title,
      value,
      description,
      icon,
      variant = "default",
      bordered = true,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          styles.card,
          styles[variant],
          bordered && styles.bordered,
          className
        )}
        {...props}
      >
        {icon && <div className={styles.icon}>{icon}</div>}

        <div className={styles.content}>
          <div className={styles.title}>{title}</div>
          <div className={styles.value}>{value}</div>
          {description && (
            <div className={styles.description}>{description}</div>
          )}
        </div>
      </div>
    );
  }
);

ZStatCard.displayName = "ZStatCard";

export default ZStatCard;
