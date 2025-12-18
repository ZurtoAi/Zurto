import { forwardRef, HTMLAttributes, ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/utils/cn";
import styles from "./ZMetric.module.css";

export type ZMetricTrend = "up" | "down" | "neutral";

export interface ZMetricProps extends HTMLAttributes<HTMLDivElement> {
  /** Metric label */
  label: string;
  /** Metric value */
  value: string | number;
  /** Change percentage */
  change?: number;
  /** Trend direction */
  trend?: ZMetricTrend;
  /** Icon */
  icon?: ReactNode;
  /** Prefix (e.g., $, #) */
  prefix?: string;
  /** Suffix (e.g., %, users) */
  suffix?: string;
  /** Size variant */
  size?: "sm" | "md" | "lg";
}

export const ZMetric = forwardRef<HTMLDivElement, ZMetricProps>(
  (
    {
      label,
      value,
      change,
      trend = "neutral",
      icon,
      prefix,
      suffix,
      size = "md",
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(styles.metric, styles[size], className)}
        {...props}
      >
        <div className={styles.header}>
          <span className={styles.label}>{label}</span>
          {icon && <div className={styles.icon}>{icon}</div>}
        </div>

        <div className={styles.value}>
          {prefix && <span className={styles.prefix}>{prefix}</span>}
          <span>{value}</span>
          {suffix && <span className={styles.suffix}>{suffix}</span>}
        </div>

        {change !== undefined && (
          <div className={cn(styles.change, styles[`trend-${trend}`])}>
            {trend === "up" && <TrendingUp className={styles.trendIcon} />}
            {trend === "down" && <TrendingDown className={styles.trendIcon} />}
            <span>
              {change > 0 ? "+" : ""}
              {change}%
            </span>
            <span className={styles.changeLabel}>vs last period</span>
          </div>
        )}
      </div>
    );
  }
);

ZMetric.displayName = "ZMetric";

export default ZMetric;
