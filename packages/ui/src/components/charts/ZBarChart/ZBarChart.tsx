import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZBarChart.module.css";

export interface BarChartData {
  label: string;
  value: number;
  color?: string;
}

export interface ZBarChartProps extends HTMLAttributes<HTMLDivElement> {
  /** Chart data */
  data: BarChartData[];
  /** Chart height */
  height?: number;
  /** Show values */
  showValues?: boolean;
  /** Orientation */
  orientation?: "vertical" | "horizontal";
}

export const ZBarChart = forwardRef<HTMLDivElement, ZBarChartProps>(
  (
    {
      data,
      height = 300,
      showValues = false,
      orientation = "vertical",
      className,
      ...props
    },
    ref
  ) => {
    const maxValue = Math.max(...data.map((d) => d.value));

    return (
      <div
        ref={ref}
        className={cn(styles.chart, styles[orientation], className)}
        style={{ height: `${height}px` }}
        {...props}
      >
        <div className={styles.bars}>
          {data.map((item, index) => {
            const percentage = (item.value / maxValue) * 100;
            const barColor = item.color || "var(--z-accent-color)";

            return (
              <div key={index} className={styles.barWrapper}>
                <div className={styles.barContainer}>
                  <div
                    className={styles.bar}
                    style={{
                      [orientation === "vertical"
                        ? "height"
                        : "width"]: `${percentage}%`,
                      background: barColor,
                    }}
                  >
                    {showValues && (
                      <span className={styles.value}>{item.value}</span>
                    )}
                  </div>
                </div>
                <span className={styles.label}>{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

ZBarChart.displayName = "ZBarChart";

export default ZBarChart;
