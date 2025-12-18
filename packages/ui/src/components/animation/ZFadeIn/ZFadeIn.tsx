import { forwardRef, HTMLAttributes, useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZFadeIn.module.css";

export type ZFadeInDirection = "up" | "down" | "left" | "right" | "none";

export interface ZFadeInProps extends HTMLAttributes<HTMLDivElement> {
  /** Fade direction */
  direction?: ZFadeInDirection;
  /** Duration (ms) */
  duration?: number;
  /** Delay (ms) */
  delay?: number;
  /** Distance to move (px) */
  distance?: number;
}

export const ZFadeIn = forwardRef<HTMLDivElement, ZFadeInProps>(
  (
    {
      direction = "up",
      duration = 600,
      delay = 0,
      distance = 30,
      children,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      const timer = setTimeout(() => setIsVisible(true), delay);
      return () => clearTimeout(timer);
    }, [delay]);

    const translateMap = {
      up: `translateY(${distance}px)`,
      down: `translateY(-${distance}px)`,
      left: `translateX(${distance}px)`,
      right: `translateX(-${distance}px)`,
      none: "none",
    };

    return (
      <div
        ref={ref}
        className={cn(styles.fadeIn, isVisible && styles.visible, className)}
        style={{
          ...style,
          transitionDuration: `${duration}ms`,
          transform: !isVisible ? translateMap[direction] : "translate(0, 0)",
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ZFadeIn.displayName = "ZFadeIn";

export default ZFadeIn;
