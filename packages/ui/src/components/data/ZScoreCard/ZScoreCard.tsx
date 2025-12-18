import { forwardRef, HTMLAttributes } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/utils/cn";
import styles from "./ZScoreCard.module.css";

export interface ZScoreCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Score value */
  score: number;
  /** Max score */
  maxScore?: number;
  /** Label */
  label: string;
  /** Trend */
  trend?: "up" | "down" | "neutral";
  /** Trend value */
  trendValue?: string;
  /** Color variant */
  variant?: "default" | "success" | "warning" | "error";
}

export const ZScoreCard = forwardRef<HTMLDivElement, ZScoreCardProps>(
  (
    {
      score,
      maxScore = 100,
      label,
      trend,
      trendValue,
      variant = "default",
      className,
      ...props
    },
    ref
  ) => {
    const percentage = (score / maxScore) * 100;

    return (
      <div
        ref={ref}
        className={cn(styles.card, styles[variant], className)}
        {...props}
      >
        <div className={styles.header}>
          <span className={styles.label}>{label}</span>
          {trend && trendValue && (
            <div className={cn(styles.trend, styles[trend])}>
              {trend === "up" ? (
                <TrendingUp className={styles.trendIcon} />
              ) : trend === "down" ? (
                <TrendingDown className={styles.trendIcon} />
              ) : null}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div className={styles.scoreContainer}>
          <div className={styles.score}>{score}</div>
          {maxScore && <div className={styles.maxScore}>/ {maxScore}</div>}
        </div>
        <div className={styles.progressBar}>
          <div
            className={styles.progress}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);

ZScoreCard.displayName = "ZScoreCard";

export default ZScoreCard;
