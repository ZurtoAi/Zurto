import { forwardRef, HTMLAttributes, useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZScale.module.css";

export type ZScaleDirection = "in" | "out";

export interface ZScaleProps extends HTMLAttributes<HTMLDivElement> {
  /** Scale direction */
  direction?: ZScaleDirection;
  /** Duration (ms) */
  duration?: number;
  /** Delay (ms) */
  delay?: number;
  /** Initial scale */
  from?: number;
  /** Final scale */
  to?: number;
}

export const ZScale = forwardRef<HTMLDivElement, ZScaleProps>(
  (
    {
      direction = "in",
      duration = 400,
      delay = 0,
      from = 0.8,
      to = 1,
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

    const initialScale = direction === "in" ? from : to;
    const finalScale = direction === "in" ? to : from;

    return (
      <div
        ref={ref}
        className={cn(styles.scale, isVisible && styles.visible, className)}
        style={{
          ...style,
          transitionDuration: `${duration}ms`,
          transform: `scale(${isVisible ? finalScale : initialScale})`,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ZScale.displayName = "ZScale";

export default ZScale;
