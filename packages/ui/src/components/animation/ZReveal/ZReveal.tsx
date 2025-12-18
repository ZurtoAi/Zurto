import { forwardRef, HTMLAttributes, useEffect, useRef } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZReveal.module.css";

export interface ZRevealProps extends HTMLAttributes<HTMLDivElement> {
  /** Duration (ms) */
  duration?: number;
  /** Delay (ms) */
  delay?: number;
  /** Trigger when in viewport */
  once?: boolean;
}

export const ZReveal = forwardRef<HTMLDivElement, ZRevealProps>(
  (
    {
      duration = 800,
      delay = 0,
      once = true,
      children,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => setIsVisible(true), delay);
            if (once) {
              observer.disconnect();
            }
          } else if (!once) {
            setIsVisible(false);
          }
        },
        { threshold: 0.1 }
      );

      const element = elementRef.current;
      if (element) {
        observer.observe(element);
      }

      return () => {
        if (element) {
          observer.unobserve(element);
        }
      };
    }, [delay, once]);

    // Handle both refs
    React.useImperativeHandle(ref, () => elementRef.current!);

    return (
      <div
        ref={elementRef}
        className={cn(styles.reveal, isVisible && styles.visible, className)}
        style={{
          ...style,
          transitionDuration: `${duration}ms`,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

// Add React import
import React from "react";

ZReveal.displayName = "ZReveal";

export default ZReveal;
