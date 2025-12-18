import { HTMLAttributes, forwardRef, ElementType, ReactNode } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZGrid.module.css";

export interface ZGridProps extends HTMLAttributes<HTMLElement> {
  /** HTML element to render */
  as?: ElementType;
  /** Number of columns */
  columns?: number | "auto" | string;
  /** Number of rows */
  rows?: number | "auto" | string;
  /** Gap between items (token scale: 0-12) */
  gap?: number;
  /** Column gap */
  gapX?: number;
  /** Row gap */
  gapY?: number;
  /** Align items */
  align?: "start" | "center" | "end" | "stretch";
  /** Justify items */
  justify?: "start" | "center" | "end" | "stretch";
  /** Auto flow */
  flow?: "row" | "column" | "dense" | "row-dense" | "column-dense";
  /** Min column width for auto-fit */
  minChildWidth?: string;
  /** Full width */
  fullWidth?: boolean;
}

/**
 * ZGrid - CSS Grid layout component
 *
 * @example
 * <ZGrid columns={3} gap={4}>
 *   <ZCard>1</ZCard>
 *   <ZCard>2</ZCard>
 *   <ZCard>3</ZCard>
 * </ZGrid>
 */
export const ZGrid = forwardRef<HTMLElement, ZGridProps>(
  (
    {
      as: Component = "div",
      columns = 1,
      rows,
      gap = 4,
      gapX,
      gapY,
      align,
      justify,
      flow,
      minChildWidth,
      fullWidth = false,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const getColumns = () => {
      if (minChildWidth) {
        return `repeat(auto-fit, minmax(${minChildWidth}, 1fr))`;
      }
      if (typeof columns === "number") {
        return `repeat(${columns}, 1fr)`;
      }
      if (columns === "auto") {
        return "auto";
      }
      return columns;
    };

    const getRows = () => {
      if (!rows) return undefined;
      if (typeof rows === "number") {
        return `repeat(${rows}, 1fr)`;
      }
      if (rows === "auto") {
        return "auto";
      }
      return rows;
    };

    const inlineStyle: React.CSSProperties = {
      gridTemplateColumns: getColumns(),
      gridTemplateRows: getRows(),
      gap: `var(--z-space-${gap})`,
      columnGap: gapX !== undefined ? `var(--z-space-${gapX})` : undefined,
      rowGap: gapY !== undefined ? `var(--z-space-${gapY})` : undefined,
      alignItems: align,
      justifyItems: justify,
      gridAutoFlow: flow,
      ...style,
    };

    return (
      <Component
        ref={ref}
        className={cn(styles.grid, fullWidth && styles.fullWidth, className)}
        style={inlineStyle}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

ZGrid.displayName = "ZGrid";

/* Grid Item */
export interface ZGridItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Column span */
  colSpan?: number | "full";
  /** Row span */
  rowSpan?: number;
  /** Column start */
  colStart?: number;
  /** Column end */
  colEnd?: number;
  /** Row start */
  rowStart?: number;
  /** Row end */
  rowEnd?: number;
}

export const ZGridItem = forwardRef<HTMLDivElement, ZGridItemProps>(
  (
    {
      colSpan,
      rowSpan,
      colStart,
      colEnd,
      rowStart,
      rowEnd,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const inlineStyle: React.CSSProperties = {
      gridColumn:
        colSpan === "full" ? "1 / -1" : colSpan ? `span ${colSpan}` : undefined,
      gridRow: rowSpan ? `span ${rowSpan}` : undefined,
      gridColumnStart: colStart,
      gridColumnEnd: colEnd,
      gridRowStart: rowStart,
      gridRowEnd: rowEnd,
      ...style,
    };

    return (
      <div ref={ref} className={className} style={inlineStyle} {...props}>
        {children}
      </div>
    );
  }
);

ZGridItem.displayName = "ZGridItem";

export default ZGrid;
