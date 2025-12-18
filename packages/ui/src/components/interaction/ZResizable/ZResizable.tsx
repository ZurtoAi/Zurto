import { forwardRef, HTMLAttributes, useState } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZResizable.module.css";

export interface ZResizableProps extends HTMLAttributes<HTMLDivElement> {
  /** Initial width */
  initialWidth?: number;
  /** Initial height */
  initialHeight?: number;
  /** Min width */
  minWidth?: number;
  /** Min height */
  minHeight?: number;
  /** On resize */
  onResize?: (width: number, height: number) => void;
}

export const ZResizable = forwardRef<HTMLDivElement, ZResizableProps>(
  (
    {
      initialWidth = 300,
      initialHeight = 200,
      minWidth = 100,
      minHeight = 100,
      onResize,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [size, setSize] = useState({
      width: initialWidth,
      height: initialHeight,
    });
    const [isResizing, setIsResizing] = useState(false);

    const handleMouseDown = (e: React.MouseEvent) => {
      e.preventDefault();
      setIsResizing(true);

      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = size.width;
      const startHeight = size.height;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const newWidth = Math.max(
          minWidth,
          startWidth + moveEvent.clientX - startX
        );
        const newHeight = Math.max(
          minHeight,
          startHeight + moveEvent.clientY - startY
        );
        setSize({ width: newWidth, height: newHeight });
        onResize?.(newWidth, newHeight);
      };

      const handleMouseUp = () => {
        setIsResizing(false);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    return (
      <div
        ref={ref}
        className={cn(
          styles.resizable,
          isResizing && styles.resizing,
          className
        )}
        style={{ width: size.width, height: size.height }}
        {...props}
      >
        <div className={styles.content}>{children}</div>
        <div className={styles.handle} onMouseDown={handleMouseDown} />
      </div>
    );
  }
);

ZResizable.displayName = "ZResizable";

export default ZResizable;
