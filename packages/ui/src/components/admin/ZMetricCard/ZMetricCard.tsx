import { forwardRef, HTMLAttributes } from "react";
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn";
import { ZProgressBar } from "../../feedback/ZProgressBar";
import styles from "./ZMetricCard.module.css";

export type ZMetricCardVariant = "default" | "minimal" | "detailed";

export interface ZMetricCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Card variant */
  variant?: ZMetricCardVariant;
  /** Metric title */
  title: string;
  /** Metric value */
  value: string | number;
  /** Change percentage */
  change?: number;
  /** Comparison text */
  comparison?: string;
  /** Progress value (0-100) */
  progress?: number;
  /** Icon */
  icon?: LucideIcon;
  /** Icon color */
  iconColor?: string;
  /** Loading state */
  loading?: boolean;
}

export const ZMetricCard = forwardRef<HTMLDivElement, ZMetricCardProps>(
  (
    {
      variant = "default",
      title,
      value,
      change,
      comparison = "vs last month",
      progress,
      icon: Icon,
      iconColor,
      loading = false,
      className,
      ...props
    },
    ref
  ) => {
    const isPositive = change !== undefined && change > 0;
    const isNegative = change !== undefined && change < 0;

    if (loading) {
      return (
        <div
          ref={ref}
          className={cn(
            styles.card,
            styles[variant],
            styles.loading,
            className
          )}
          {...props}
        >
          <div className={styles.skeleton} />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(styles.card, styles[variant], className)}
        {...props}
      >
        <div className={styles.header}>
          <span className={styles.title}>{title}</span>
          {Icon && (
            <div
              className={styles.iconWrapper}
              style={{ color: iconColor || "var(--z-accent)" }}
            >
              <Icon className={styles.icon} />
            </div>
          )}
        </div>

        <div className={styles.body}>
          <div className={styles.value}>{value}</div>

          {change !== undefined && (
            <div className={styles.change}>
              <span
                className={cn(
                  styles.changeValue,
                  isPositive && styles.positive,
                  isNegative && styles.negative
                )}
              >
                {isPositive && <TrendingUp className={styles.trendIcon} />}
                {isNegative && <TrendingDown className={styles.trendIcon} />}
                {Math.abs(change)}%
              </span>
              {comparison && (
                <span className={styles.comparison}>{comparison}</span>
              )}
            </div>
          )}
        </div>

        {progress !== undefined && variant === "detailed" && (
          <div className={styles.progress}>
            <ZProgressBar value={progress} size="sm" color="accent" showLabel />
          </div>
        )}
      </div>
    );
  }
);

ZMetricCard.displayName = "ZMetricCard";

export default ZMetricCard;
