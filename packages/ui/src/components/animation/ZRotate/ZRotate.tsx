import { forwardRef, HTMLAttributes, useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZRotate.module.css";

export interface ZRotateProps extends HTMLAttributes<HTMLDivElement> {
  /** Trigger animation */
  trigger?: boolean;
  /** Degrees */
  degrees?: number;
  /** Duration (ms) */
  duration?: number;
  /** Repeat */
  repeat?: boolean;
}

export const ZRotate = forwardRef<HTMLDivElement, ZRotateProps>(
  (
    {
      trigger = false,
      degrees = 360,
      duration = 500,
      repeat = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [isRotating, setIsRotating] = useState(false);

    useEffect(() => {
      if (trigger) {
        setIsRotating(true);
        if (!repeat) {
          setTimeout(() => setIsRotating(false), duration);
        }
      } else {
        setIsRotating(false);
      }
    }, [trigger, duration, repeat]);

    return (
      <div
        ref={ref}
        className={cn(
          styles.container,
          isRotating && styles.rotating,
          className
        )}
        style={
          {
            "--rotation-degrees": `${degrees}deg`,
            "--rotation-duration": `${duration}ms`,
          } as React.CSSProperties
        }
        {...props}
      >
        {children}
      </div>
    );
  }
);

ZRotate.displayName = "ZRotate";

export default ZRotate;
