import { forwardRef, HTMLAttributes } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn";
import styles from "./ZStat.module.css";

export type ZStatVariant = "default" | "card" | "minimal";
export type ZStatTrend = "up" | "down" | "neutral";

export interface ZStatProps extends HTMLAttributes<HTMLDivElement> {
  /** Stat variant */
  variant?: ZStatVariant;
  /** Stat label */
  label: string;
  /** Stat value */
  value: string | number;
  /** Optional icon */
  icon?: LucideIcon;
  /** Change percentage */
  change?: string;
  /** Trend direction */
  trend?: ZStatTrend;
  /** Helper text */
  helpText?: string;
}

export const ZStat = forwardRef<HTMLDivElement, ZStatProps>(
  (
    {
      variant = "default",
      label,
      value,
      icon: Icon,
      change,
      trend = "neutral",
      helpText,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(styles.stat, styles[variant], className)}
        {...props}
      >
        <div className={styles.header}>
          <span className={styles.label}>{label}</span>
          {Icon && (
            <div className={styles.iconWrapper}>
              <Icon className={styles.icon} />
            </div>
          )}
        </div>

        <div className={styles.body}>
          <span className={styles.value}>{value}</span>
          {change && (
            <span className={cn(styles.change, styles[trend])}>
              {trend === "up" && "▲"}
              {trend === "down" && "▼"}
              {change}
            </span>
          )}
        </div>

        {helpText && <p className={styles.helpText}>{helpText}</p>}
      </div>
    );
  }
);

ZStat.displayName = "ZStat";

export default ZStat;
