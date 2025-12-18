import { forwardRef, HTMLAttributes, useState } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZSwipeable.module.css";

export interface ZSwipeableProps extends HTMLAttributes<HTMLDivElement> {
  /** On swipe left */
  onSwipeLeft?: () => void;
  /** On swipe right */
  onSwipeRight?: () => void;
  /** On swipe up */
  onSwipeUp?: () => void;
  /** On swipe down */
  onSwipeDown?: () => void;
  /** Threshold (px) */
  threshold?: number;
}

export const ZSwipeable = forwardRef<HTMLDivElement, ZSwipeableProps>(
  (
    {
      onSwipeLeft,
      onSwipeRight,
      onSwipeUp,
      onSwipeDown,
      threshold = 50,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });

    const handleTouchStart = (e: React.TouchEvent) => {
      setTouchStart({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      });
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
      const touchEnd = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
      };

      const deltaX = touchEnd.x - touchStart.x;
      const deltaY = touchEnd.y - touchStart.y;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (Math.abs(deltaX) > threshold) {
          if (deltaX > 0) {
            onSwipeRight?.();
          } else {
            onSwipeLeft?.();
          }
        }
      } else {
        if (Math.abs(deltaY) > threshold) {
          if (deltaY > 0) {
            onSwipeDown?.();
          } else {
            onSwipeUp?.();
          }
        }
      }
    };

    return (
      <div
        ref={ref}
        className={cn(styles.swipeable, className)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ZSwipeable.displayName = "ZSwipeable";

export default ZSwipeable;
