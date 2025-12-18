import { forwardRef, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZTimeline.module.css";

export type ZTimelineVariant = "default" | "alternate" | "compact";

export interface TimelineItem {
  /** Item ID */
  id: string;
  /** Item title */
  title: string;
  /** Item description */
  description?: string;
  /** Timestamp */
  time: string;
  /** Custom icon */
  icon?: ReactNode;
  /** Highlight color */
  color?: string;
}

export interface ZTimelineProps extends HTMLAttributes<HTMLDivElement> {
  /** Timeline variant */
  variant?: ZTimelineVariant;
  /** Timeline items */
  items: TimelineItem[];
  /** Active item ID */
  active?: string;
}

export const ZTimeline = forwardRef<HTMLDivElement, ZTimelineProps>(
  ({ variant = "default", items, active, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(styles.timeline, styles[variant], className)}
        {...props}
      >
        {items.map((item, index) => {
          const isActive = item.id === active;
          const isLast = index === items.length - 1;

          return (
            <div
              key={item.id}
              className={cn(
                styles.item,
                isActive && styles.active,
                isLast && styles.last
              )}
            >
              <div className={styles.marker}>
                <div
                  className={styles.dot}
                  style={{ background: item.color || "var(--z-accent)" }}
                >
                  {item.icon}
                </div>
                {!isLast && <div className={styles.line} />}
              </div>

              <div className={styles.content}>
                <div className={styles.time}>{item.time}</div>
                <div className={styles.title}>{item.title}</div>
                {item.description && (
                  <div className={styles.description}>{item.description}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
);

ZTimeline.displayName = "ZTimeline";

export default ZTimeline;
