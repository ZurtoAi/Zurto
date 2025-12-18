import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZLineChart.module.css";

export interface LineChartPoint {
  x: number | string;
  y: number;
}

export interface ZLineChartProps extends HTMLAttributes<HTMLDivElement> {
  /** Chart data */
  data: LineChartPoint[];
  /** Chart height */
  height?: number;
  /** Line color */
  color?: string;
  /** Show dots */
  showDots?: boolean;
  /** Fill area */
  filled?: boolean;
}

export const ZLineChart = forwardRef<HTMLDivElement, ZLineChartProps>(
  (
    {
      data,
      height = 200,
      color = "var(--z-accent-color)",
      showDots = true,
      filled = false,
      className,
      ...props
    },
    ref
  ) => {
    const maxY = Math.max(...data.map((d) => d.y));
    const minY = Math.min(...data.map((d) => d.y));
    const range = maxY - minY || 1;

    const points = data
      .map((point, index) => {
        const x = (index / (data.length - 1)) * 100;
        const y = 100 - ((point.y - minY) / range) * 100;
        return `${x},${y}`;
      })
      .join(" ");

    const pathD = `M ${points
      .split(" ")
      .map((p) => p.split(",").join(" "))
      .join(" L ")}`;
    const filledPathD = filled ? `${pathD} L 100,100 L 0,100 Z` : pathD;

    return (
      <div
        ref={ref}
        className={cn(styles.chart, className)}
        style={{ height: `${height}px` }}
        {...props}
      >
        <svg
          className={styles.svg}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {filled && (
            <path
              d={filledPathD}
              className={styles.area}
              style={{ fill: color, opacity: 0.2 }}
            />
          )}
          <path d={pathD} className={styles.line} style={{ stroke: color }} />
          {showDots &&
            data.map((point, index) => {
              const x = (index / (data.length - 1)) * 100;
              const y = 100 - ((point.y - minY) / range) * 100;
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="1.5"
                  className={styles.dot}
                  style={{ fill: color }}
                />
              );
            })}
        </svg>
      </div>
    );
  }
);

ZLineChart.displayName = "ZLineChart";

export default ZLineChart;
