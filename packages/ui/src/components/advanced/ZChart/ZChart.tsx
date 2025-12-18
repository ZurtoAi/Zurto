/**
 * ZChart - Simple charting component (no dependencies)
 */

import React, { useMemo } from "react";
import styles from "./ZChart.module.css";

export type ChartDataPoint = {
  label: string;
  value: number;
  color?: string;
};

export type ZChartProps = {
  /** Chart data */
  data: ChartDataPoint[];
  /** Chart type */
  type?: "bar" | "line" | "pie" | "donut";
  /** Chart title */
  title?: string;
  /** Width */
  width?: number | string;
  /** Height */
  height?: number;
  /** Show legend */
  showLegend?: boolean;
  /** Show values on chart */
  showValues?: boolean;
  /** Primary color for charts */
  primaryColor?: string;
  /** Additional class name */
  className?: string;
  /** Y-axis label */
  yAxisLabel?: string;
  /** X-axis label */
  xAxisLabel?: string;
  /** Animation enabled */
  animated?: boolean;
};

const DEFAULT_COLORS = [
  "#df3e53",
  "#3b82f6",
  "#22c55e",
  "#eab308",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#f97316",
];

export function ZChart({
  data,
  type = "bar",
  title,
  width = "100%",
  height = 300,
  showLegend = true,
  showValues = true,
  primaryColor = "#df3e53",
  className,
  yAxisLabel,
  xAxisLabel,
  animated = true,
}: ZChartProps) {
  // Calculate chart dimensions
  const chartPadding = 40;
  const chartHeight = height - chartPadding * 2;

  // Get max value for scaling
  const maxValue = useMemo(
    () => Math.max(...data.map((d) => d.value), 0) * 1.1,
    [data]
  );

  // Assign colors
  const coloredData = useMemo(
    () =>
      data.map((item, index) => ({
        ...item,
        color: item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length],
      })),
    [data]
  );

  // Render based on type
  const renderChart = () => {
    switch (type) {
      case "bar":
        return renderBarChart();
      case "line":
        return renderLineChart();
      case "pie":
        return renderPieChart(false);
      case "donut":
        return renderPieChart(true);
      default:
        return renderBarChart();
    }
  };

  const renderBarChart = () => {
    const barWidth = Math.min(50, 600 / (data.length * 2));
    const gap = barWidth / 2;

    return (
      <svg
        viewBox={`0 0 ${
          data.length * (barWidth + gap) + chartPadding * 2
        } ${height}`}
        className={styles.svg}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Y-axis */}
        <line
          x1={chartPadding}
          y1={chartPadding}
          x2={chartPadding}
          y2={height - chartPadding}
          stroke="var(--z-border)"
          strokeWidth="1"
        />

        {/* X-axis */}
        <line
          x1={chartPadding}
          y1={height - chartPadding}
          x2={data.length * (barWidth + gap) + chartPadding}
          y2={height - chartPadding}
          stroke="var(--z-border)"
          strokeWidth="1"
        />

        {/* Bars */}
        {coloredData.map((item, index) => {
          const barHeight = (item.value / maxValue) * chartHeight;
          const x = chartPadding + index * (barWidth + gap) + gap / 2;
          const y = height - chartPadding - barHeight;

          return (
            <g key={item.label}>
              <rect
                x={x}
                y={animated ? height - chartPadding : y}
                width={barWidth}
                height={animated ? 0 : barHeight}
                fill={item.color}
                rx="4"
                className={animated ? styles.barAnimated : ""}
                style={
                  {
                    "--target-y": `${y}px`,
                    "--target-height": `${barHeight}px`,
                  } as React.CSSProperties
                }
              >
                <animate
                  attributeName="y"
                  from={height - chartPadding}
                  to={y}
                  dur="0.5s"
                  fill="freeze"
                  begin="0s"
                />
                <animate
                  attributeName="height"
                  from="0"
                  to={barHeight}
                  dur="0.5s"
                  fill="freeze"
                  begin="0s"
                />
              </rect>

              {/* Value label */}
              {showValues && (
                <text
                  x={x + barWidth / 2}
                  y={y - 8}
                  textAnchor="middle"
                  fill="var(--z-text-secondary)"
                  fontSize="12"
                >
                  {item.value}
                </text>
              )}

              {/* X-axis label */}
              <text
                x={x + barWidth / 2}
                y={height - chartPadding + 20}
                textAnchor="middle"
                fill="var(--z-text-tertiary)"
                fontSize="11"
              >
                {item.label}
              </text>
            </g>
          );
        })}

        {/* Y-axis label */}
        {yAxisLabel && (
          <text
            x={15}
            y={height / 2}
            textAnchor="middle"
            fill="var(--z-text-tertiary)"
            fontSize="12"
            transform={`rotate(-90, 15, ${height / 2})`}
          >
            {yAxisLabel}
          </text>
        )}
      </svg>
    );
  };

  const renderLineChart = () => {
    const pointSpacing = 600 / (data.length - 1 || 1);

    const points = coloredData.map((item, index) => ({
      x: chartPadding + index * pointSpacing,
      y: height - chartPadding - (item.value / maxValue) * chartHeight,
      ...item,
    }));

    const pathD = points
      .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
      .join(" ");

    return (
      <svg
        viewBox={`0 0 ${600 + chartPadding} ${height}`}
        className={styles.svg}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map((ratio) => (
          <line
            key={ratio}
            x1={chartPadding}
            y1={height - chartPadding - ratio * chartHeight}
            x2={600 + chartPadding}
            y2={height - chartPadding - ratio * chartHeight}
            stroke="var(--z-border)"
            strokeWidth="1"
            strokeDasharray="4"
            opacity="0.5"
          />
        ))}

        {/* Line path */}
        <path
          d={pathD}
          fill="none"
          stroke={primaryColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={animated ? styles.lineAnimated : ""}
        />

        {/* Area fill */}
        <path
          d={`${pathD} L ${points[points.length - 1]?.x || 0} ${
            height - chartPadding
          } L ${chartPadding} ${height - chartPadding} Z`}
          fill={primaryColor}
          opacity="0.1"
        />

        {/* Data points */}
        {points.map((point) => (
          <g key={point.label}>
            <circle
              cx={point.x}
              cy={point.y}
              r="5"
              fill={primaryColor}
              stroke="var(--z-bg-primary)"
              strokeWidth="2"
            />

            {showValues && (
              <text
                x={point.x}
                y={point.y - 12}
                textAnchor="middle"
                fill="var(--z-text-secondary)"
                fontSize="12"
              >
                {point.value}
              </text>
            )}

            <text
              x={point.x}
              y={height - chartPadding + 20}
              textAnchor="middle"
              fill="var(--z-text-tertiary)"
              fontSize="11"
            >
              {point.label}
            </text>
          </g>
        ))}
      </svg>
    );
  };

  const renderPieChart = (isDonut: boolean) => {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    const centerX = 150;
    const centerY = 150;
    const radius = 120;
    const innerRadius = isDonut ? 60 : 0;

    let currentAngle = -90; // Start from top

    const slices = coloredData.map((item) => {
      const percentage = (item.value / total) * 100;
      const angle = (item.value / total) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      currentAngle = endAngle;

      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      const x1 = centerX + radius * Math.cos(startRad);
      const y1 = centerY + radius * Math.sin(startRad);
      const x2 = centerX + radius * Math.cos(endRad);
      const y2 = centerY + radius * Math.sin(endRad);

      const largeArc = angle > 180 ? 1 : 0;

      let d = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

      if (isDonut) {
        const ix1 = centerX + innerRadius * Math.cos(startRad);
        const iy1 = centerY + innerRadius * Math.sin(startRad);
        const ix2 = centerX + innerRadius * Math.cos(endRad);
        const iy2 = centerY + innerRadius * Math.sin(endRad);

        d = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix1} ${iy1} Z`;
      }

      // Label position
      const labelAngle = (startAngle + angle / 2) * (Math.PI / 180);
      const labelRadius = isDonut ? (radius + innerRadius) / 2 : radius * 0.6;
      const labelX = centerX + labelRadius * Math.cos(labelAngle);
      const labelY = centerY + labelRadius * Math.sin(labelAngle);

      return {
        ...item,
        percentage,
        d,
        labelX,
        labelY,
      };
    });

    return (
      <svg viewBox="0 0 300 300" className={styles.svg}>
        {slices.map((slice) => (
          <g key={slice.label}>
            <path
              d={slice.d}
              fill={slice.color}
              stroke="var(--z-bg-primary)"
              strokeWidth="2"
              className={animated ? styles.pieAnimated : ""}
            />

            {showValues && slice.percentage > 5 && (
              <text
                x={slice.labelX}
                y={slice.labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize="12"
                fontWeight="600"
              >
                {Math.round(slice.percentage)}%
              </text>
            )}
          </g>
        ))}

        {isDonut && (
          <text
            x={centerX}
            y={centerY}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="var(--z-text-primary)"
            fontSize="24"
            fontWeight="600"
          >
            {total}
          </text>
        )}
      </svg>
    );
  };

  return (
    <div className={`${styles.container} ${className || ""}`} style={{ width }}>
      {title && <h3 className={styles.title}>{title}</h3>}

      <div className={styles.chartWrapper} style={{ height }}>
        {renderChart()}
      </div>

      {showLegend && (
        <div className={styles.legend}>
          {coloredData.map((item) => (
            <div key={item.label} className={styles.legendItem}>
              <span
                className={styles.legendColor}
                style={{ backgroundColor: item.color }}
              />
              <span className={styles.legendLabel}>{item.label}</span>
              <span className={styles.legendValue}>{item.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ZChart;
