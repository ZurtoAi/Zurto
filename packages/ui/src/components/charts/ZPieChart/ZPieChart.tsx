import { forwardRef, HTMLAttributes, useState } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZPieChart.module.css";

export interface PieChartSegment {
  label: string;
  value: number;
  color?: string;
}

export interface ZPieChartProps extends HTMLAttributes<HTMLDivElement> {
  /** Chart data */
  data: PieChartSegment[];
  /** Chart size */
  size?: number;
  /** Show legend */
  showLegend?: boolean;
  /** Donut mode */
  donut?: boolean;
}

const defaultColors = [
  "#df3e53",
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
];

export const ZPieChart = forwardRef<HTMLDivElement, ZPieChartProps>(
  (
    { data, size = 200, showLegend = true, donut = false, className, ...props },
    ref
  ) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const total = data.reduce((sum, segment) => sum + segment.value, 0);

    let currentAngle = -90;
    const segments = data.map((segment, index) => {
      const percentage = (segment.value / total) * 100;
      const angle = (segment.value / total) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      currentAngle = endAngle;

      const largeArc = angle > 180 ? 1 : 0;
      const startX = 50 + 40 * Math.cos((Math.PI * startAngle) / 180);
      const startY = 50 + 40 * Math.sin((Math.PI * startAngle) / 180);
      const endX = 50 + 40 * Math.cos((Math.PI * endAngle) / 180);
      const endY = 50 + 40 * Math.sin((Math.PI * endAngle) / 180);

      const pathData = donut
        ? `M ${startX} ${startY} A 40 40 0 ${largeArc} 1 ${endX} ${endY} L 50 50 Z`
        : `M 50 50 L ${startX} ${startY} A 40 40 0 ${largeArc} 1 ${endX} ${endY} Z`;

      return {
        ...segment,
        pathData,
        percentage,
        color: segment.color || defaultColors[index % defaultColors.length],
      };
    });

    return (
      <div ref={ref} className={cn(styles.container, className)} {...props}>
        <svg
          className={styles.chart}
          viewBox="0 0 100 100"
          style={{ width: size, height: size }}
        >
          {donut && (
            <circle
              cx="50"
              cy="50"
              r="25"
              fill="var(--z-primary-bg)"
              className={styles.donutHole}
            />
          )}
          {segments.map((segment, index) => (
            <path
              key={index}
              d={segment.pathData}
              fill={segment.color}
              className={cn(
                styles.segment,
                hoveredIndex === index && styles.hovered
              )}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          ))}
        </svg>

        {showLegend && (
          <div className={styles.legend}>
            {segments.map((segment, index) => (
              <div
                key={index}
                className={cn(
                  styles.legendItem,
                  hoveredIndex === index && styles.hovered
                )}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  className={styles.legendColor}
                  style={{ background: segment.color }}
                />
                <span className={styles.legendLabel}>{segment.label}</span>
                <span className={styles.legendValue}>
                  {segment.percentage.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

ZPieChart.displayName = "ZPieChart";

export default ZPieChart;
