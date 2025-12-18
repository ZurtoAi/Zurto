import {
  HTMLAttributes,
  forwardRef,
  useState,
  useCallback,
  useRef,
  useEffect,
  ReactNode,
} from "react";
import { cn } from "@/utils/cn";
import styles from "./ZSplitPane.module.css";

export type ZSplitDirection = "horizontal" | "vertical";

export interface ZSplitPaneProps extends HTMLAttributes<HTMLDivElement> {
  /** Split direction */
  direction?: ZSplitDirection;
  /** Initial size of first pane (pixels or percentage) */
  defaultSize?: number | string;
  /** Minimum size of first pane */
  minSize?: number;
  /** Maximum size of first pane */
  maxSize?: number;
  /** First pane content */
  first: ReactNode;
  /** Second pane content */
  second: ReactNode;
  /** On resize callback */
  onResize?: (size: number) => void;
  /** Resizer width */
  resizerSize?: number;
  /** Allow collapse */
  collapsible?: boolean;
}

/**
 * ZSplitPane - Resizable split pane component
 */
export const ZSplitPane = forwardRef<HTMLDivElement, ZSplitPaneProps>(
  (
    {
      direction = "horizontal",
      defaultSize = "50%",
      minSize = 100,
      maxSize,
      first,
      second,
      onResize,
      resizerSize = 4,
      collapsible = false,
      className,
      ...props
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const isHorizontal = direction === "horizontal";

    // Calculate initial size
    useEffect(() => {
      if (size === null && containerRef.current) {
        const containerSize = isHorizontal
          ? containerRef.current.offsetWidth
          : containerRef.current.offsetHeight;

        let initialSize: number;
        if (typeof defaultSize === "string" && defaultSize.endsWith("%")) {
          initialSize = (parseFloat(defaultSize) / 100) * containerSize;
        } else {
          initialSize =
            typeof defaultSize === "number" ? defaultSize : containerSize / 2;
        }
        setSize(initialSize);
      }
    }, [defaultSize, isHorizontal, size]);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
    }, []);

    const handleMouseMove = useCallback(
      (e: MouseEvent) => {
        if (!isDragging || !containerRef.current) return;

        const container = containerRef.current.getBoundingClientRect();
        let newSize = isHorizontal
          ? e.clientX - container.left
          : e.clientY - container.top;

        // Apply constraints
        if (minSize) newSize = Math.max(newSize, minSize);
        if (maxSize) newSize = Math.min(newSize, maxSize);

        const containerSize = isHorizontal ? container.width : container.height;
        newSize = Math.min(newSize, containerSize - minSize);

        setSize(newSize);
        onResize?.(newSize);
      },
      [isDragging, isHorizontal, minSize, maxSize, onResize]
    );

    const handleMouseUp = useCallback(() => {
      setIsDragging(false);
    }, []);

    const handleDoubleClick = useCallback(() => {
      if (collapsible) {
        setIsCollapsed(!isCollapsed);
      }
    }, [collapsible, isCollapsed]);

    useEffect(() => {
      if (isDragging) {
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        document.body.style.cursor = isHorizontal ? "col-resize" : "row-resize";
        document.body.style.userSelect = "none";
      }

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };
    }, [isDragging, handleMouseMove, handleMouseUp, isHorizontal]);

    const firstPaneStyle: React.CSSProperties = isHorizontal
      ? {
          width: isCollapsed ? 0 : size ?? undefined,
          minWidth: isCollapsed ? 0 : minSize,
        }
      : {
          height: isCollapsed ? 0 : size ?? undefined,
          minHeight: isCollapsed ? 0 : minSize,
        };

    return (
      <div
        ref={(node) => {
          (containerRef as any).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        className={cn(
          styles.splitPane,
          styles[direction],
          isDragging && styles.dragging,
          className
        )}
        {...props}
      >
        <div className={styles.pane} style={firstPaneStyle}>
          {first}
        </div>

        <div
          className={cn(styles.resizer, styles[`resizer-${direction}`])}
          style={
            isHorizontal ? { width: resizerSize } : { height: resizerSize }
          }
          onMouseDown={handleMouseDown}
          onDoubleClick={handleDoubleClick}
        >
          <div className={styles.resizerHandle} />
        </div>

        <div className={cn(styles.pane, styles.second)}>{second}</div>
      </div>
    );
  }
);

ZSplitPane.displayName = "ZSplitPane";

export default ZSplitPane;
