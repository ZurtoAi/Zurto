import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZTimeline.module.css";

export interface ZTimelineItem {
  id: string;
  title: string;
  description?: string;
  timestamp?: string;
  icon?: React.ReactNode;
}

export interface ZTimelineProps extends HTMLAttributes<HTMLDivElement> {
  /** Timeline items */
  items: ZTimelineItem[];
  /** Variant */
  variant?: "default" | "alternating";
}

export const ZTimeline = forwardRef<HTMLDivElement, ZTimelineProps>(
  ({ items, variant = "default", className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(styles.timeline, styles[variant], className)}
        {...props}
      >
        {items.map((item, index) => (
          <div key={item.id} className={styles.item}>
            <div className={styles.marker}>
              {item.icon || <div className={styles.dot} />}
            </div>
            <div className={styles.content}>
              {item.timestamp && (
                <div className={styles.timestamp}>{item.timestamp}</div>
              )}
              <div className={styles.title}>{item.title}</div>
              {item.description && (
                <div className={styles.description}>{item.description}</div>
              )}
            </div>
            {index < items.length - 1 && <div className={styles.line} />}
          </div>
        ))}
      </div>
    );
  }
);

ZTimeline.displayName = "ZTimeline";

export default ZTimeline;
