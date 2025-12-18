import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZTrendChart.module.css";

export interface DataPoint {
  value: number;
  label?: string;
}

export interface ZTrendChartProps extends HTMLAttributes<HTMLDivElement> {
  /** Data points */
  data: DataPoint[];
  /** Trend direction */
  trend?: "up" | "down" | "neutral";
  /** Color */
  color?: string;
  /** Height */
  height?: number;
}

export const ZTrendChart = forwardRef<HTMLDivElement, ZTrendChartProps>(
  (
    {
      data,
      trend = "neutral",
      color = "var(--z-accent-color)",
      height = 60,
      className,
      ...props
    },
    ref
  ) => {
    if (data.length === 0) return null;

    const maxValue = Math.max(...data.map((d) => d.value));
    const minValue = Math.min(...data.map((d) => d.value));
    const range = maxValue - minValue || 1;

    const points = data
      .map((point, index) => {
        const x = (index / (data.length - 1)) * 100;
        const y = 100 - ((point.value - minValue) / range) * 100;
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <div
        ref={ref}
        className={cn(styles.container, styles[trend], className)}
        style={{ height }}
        {...props}
      >
        <svg
          className={styles.svg}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <polyline
            className={styles.line}
            points={points}
            style={{ stroke: color }}
            fill="none"
            strokeWidth="2"
          />
          <polyline
            className={styles.area}
            points={`0,100 ${points} 100,100`}
            style={{ fill: color }}
          />
        </svg>
      </div>
    );
  }
);

ZTrendChart.displayName = "ZTrendChart";

export default ZTrendChart;
