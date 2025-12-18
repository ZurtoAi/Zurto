import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZStatCard.module.css";
import { TrendingUp, TrendingDown } from "lucide-react";

export interface ZStatCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Label */
  label: string;
  /** Value */
  value: string | number;
  /** Change percentage */
  change?: number;
  /** Icon */
  icon?: React.ReactNode;
  /** Variant */
  variant?: "default" | "accent" | "success" | "warning";
}

export const ZStatCard = forwardRef<HTMLDivElement, ZStatCardProps>(
  (
    { label, value, change, icon, variant = "default", className, ...props },
    ref
  ) => {
    const isPositive = change !== undefined && change >= 0;

    return (
      <div
        ref={ref}
        className={cn(styles.card, styles[variant], className)}
        {...props}
      >
        <div className={styles.header}>
          <span className={styles.label}>{label}</span>
          {icon && <div className={styles.icon}>{icon}</div>}
        </div>
        <div className={styles.value}>{value}</div>
        {change !== undefined && (
          <div
            className={cn(
              styles.change,
              isPositive ? styles.positive : styles.negative
            )}
          >
            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
    );
  }
);

ZStatCard.displayName = "ZStatCard";

export default ZStatCard;
