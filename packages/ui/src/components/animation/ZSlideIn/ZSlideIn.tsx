import { forwardRef, HTMLAttributes, useEffect, useState, useRef } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZSlideIn.module.css";

export interface ZSlideInProps extends HTMLAttributes<HTMLDivElement> {
  /** Direction */
  direction?: "left" | "right" | "up" | "down";
  /** Delay (ms) */
  delay?: number;
  /** Duration (ms) */
  duration?: number;
  /** Trigger when in view */
  triggerOnce?: boolean;
}

export const ZSlideIn = forwardRef<HTMLDivElement, ZSlideInProps>(
  (
    {
      direction = "up",
      delay = 0,
      duration = 500,
      triggerOnce = true,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (triggerOnce) {
              observer.disconnect();
            }
          } else if (!triggerOnce) {
            setIsVisible(false);
          }
        },
        { threshold: 0.1 }
      );

      if (elementRef.current) {
        observer.observe(elementRef.current);
      }

      return () => observer.disconnect();
    }, [triggerOnce]);

    return (
      <div
        ref={(node) => {
          elementRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        className={cn(
          styles.container,
          styles[direction],
          isVisible && styles.visible,
          className
        )}
        style={{
          transitionDelay: `${delay}ms`,
          transitionDuration: `${duration}ms`,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ZSlideIn.displayName = "ZSlideIn";

export default ZSlideIn;
