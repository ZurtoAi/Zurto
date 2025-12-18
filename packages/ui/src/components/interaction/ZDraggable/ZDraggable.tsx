import { forwardRef, HTMLAttributes, useState, useRef, useEffect } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZDraggable.module.css";

export interface ZDraggableProps extends HTMLAttributes<HTMLDivElement> {
  /** On drag end */
  onDragEnd?: (x: number, y: number) => void;
  /** Constrain to parent */
  constrain?: boolean;
}

export const ZDraggable = forwardRef<HTMLDivElement, ZDraggableProps>(
  ({ onDragEnd, constrain = false, className, children, ...props }, ref) => {
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const dragRef = useRef({ startX: 0, startY: 0, offsetX: 0, offsetY: 0 });

    useEffect(() => {
      if (!isDragging) return;

      const handleMouseMove = (e: MouseEvent) => {
        const newX =
          e.clientX - dragRef.current.startX + dragRef.current.offsetX;
        const newY =
          e.clientY - dragRef.current.startY + dragRef.current.offsetY;
        setPosition({ x: newX, y: newY });
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        dragRef.current.offsetX = position.x;
        dragRef.current.offsetY = position.y;
        onDragEnd?.(position.x, position.y);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }, [isDragging, position, onDragEnd]);

    const handleMouseDown = (e: React.MouseEvent) => {
      setIsDragging(true);
      dragRef.current.startX = e.clientX;
      dragRef.current.startY = e.clientY;
    };

    return (
      <div
        ref={ref}
        className={cn(
          styles.draggable,
          isDragging && styles.dragging,
          className
        )}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
        onMouseDown={handleMouseDown}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ZDraggable.displayName = "ZDraggable";

export default ZDraggable;
