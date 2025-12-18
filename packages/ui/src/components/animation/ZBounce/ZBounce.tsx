import { forwardRef, HTMLAttributes, useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZBounce.module.css";

export interface ZBounceProps extends HTMLAttributes<HTMLDivElement> {
  /** Trigger animation */
  trigger?: boolean;
  /** Delay (ms) */
  delay?: number;
  /** Repeat */
  repeat?: boolean;
  /** Intensity */
  intensity?: "soft" | "medium" | "hard";
}

export const ZBounce = forwardRef<HTMLDivElement, ZBounceProps>(
  (
    {
      trigger = false,
      delay = 0,
      repeat = false,
      intensity = "medium",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
      if (trigger) {
        setTimeout(() => {
          setIsAnimating(true);
          if (!repeat) {
            setTimeout(() => setIsAnimating(false), 1000);
          }
        }, delay);
      } else {
        setIsAnimating(false);
      }
    }, [trigger, delay, repeat]);

    return (
      <div
        ref={ref}
        className={cn(
          styles.container,
          isAnimating && styles.bouncing,
          styles[intensity],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ZBounce.displayName = "ZBounce";

export default ZBounce;
