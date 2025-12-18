import { HTMLAttributes, forwardRef, ReactNode } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZStatCard.module.css";

export type ZStatCardSize = "sm" | "md" | "lg";
export type ZStatTrend = "up" | "down" | "neutral";

export interface ZStatCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Stat label */
  label: ReactNode;
  /** Stat value */
  value: ReactNode;
  /** Icon */
  icon?: ReactNode;
  /** Change value */
  change?: ReactNode;
  /** Trend direction */
  trend?: ZStatTrend;
  /** Helper text */
  helpText?: ReactNode;
  /** Size variant */
  size?: ZStatCardSize;
  /** Glassmorphism effect */
  glass?: boolean;
}

const TrendUpIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M18 15l-6-6-6 6" />
  </svg>
);

const TrendDownIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

/**
 * ZStatCard - Statistics display card
 */
export const ZStatCard = forwardRef<HTMLDivElement, ZStatCardProps>(
  (
    {
      label,
      value,
      icon,
      change,
      trend = "neutral",
      helpText,
      size = "md",
      glass = false,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          styles.statCard,
          styles[size],
          glass && styles.glass,
          className
        )}
        {...props}
      >
        <div className={styles.header}>
          <span className={styles.label}>{label}</span>
          {icon && <span className={styles.icon}>{icon}</span>}
        </div>

        <div className={styles.body}>
          <span className={styles.value}>{value}</span>

          {change && (
            <span className={cn(styles.change, styles[`trend-${trend}`])}>
              {trend === "up" && <TrendUpIcon />}
              {trend === "down" && <TrendDownIcon />}
              {change}
            </span>
          )}
        </div>

        {helpText && <div className={styles.helpText}>{helpText}</div>}
      </div>
    );
  }
);

ZStatCard.displayName = "ZStatCard";

export default ZStatCard;
