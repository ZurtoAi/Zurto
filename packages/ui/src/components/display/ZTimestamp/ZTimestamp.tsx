import { forwardRef, HTMLAttributes, useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZTimestamp.module.css";

export interface ZTimestampProps extends HTMLAttributes<HTMLTimeElement> {
  /** Date to display */
  date: Date | string | number;
  /** Format */
  format?: "relative" | "absolute" | "both";
  /** Update interval (ms) for relative */
  updateInterval?: number;
}

export const ZTimestamp = forwardRef<HTMLTimeElement, ZTimestampProps>(
  (
    { date, format = "relative", updateInterval = 60000, className, ...props },
    ref
  ) => {
    const [, setTick] = useState(0);
    const dateObj = date instanceof Date ? date : new Date(date);

    useEffect(() => {
      if (format === "relative" || format === "both") {
        const interval = setInterval(() => {
          setTick((prev) => prev + 1);
        }, updateInterval);

        return () => clearInterval(interval);
      }
    }, [format, updateInterval]);

    const getRelativeTime = () => {
      const now = new Date();
      const diff = now.getTime() - dateObj.getTime();
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      const weeks = Math.floor(days / 7);
      const months = Math.floor(days / 30);
      const years = Math.floor(days / 365);

      if (seconds < 60) return "just now";
      if (minutes < 60) return `${minutes}m ago`;
      if (hours < 24) return `${hours}h ago`;
      if (days < 7) return `${days}d ago`;
      if (weeks < 4) return `${weeks}w ago`;
      if (months < 12) return `${months}mo ago`;
      return `${years}y ago`;
    };

    const getAbsoluteTime = () => {
      return dateObj.toLocaleString();
    };

    const displayText = () => {
      if (format === "relative") return getRelativeTime();
      if (format === "absolute") return getAbsoluteTime();
      return `${getRelativeTime()} (${getAbsoluteTime()})`;
    };

    return (
      <time
        ref={ref}
        dateTime={dateObj.toISOString()}
        className={cn(styles.timestamp, className)}
        title={getAbsoluteTime()}
        {...props}
      >
        {displayText()}
      </time>
    );
  }
);

ZTimestamp.displayName = "ZTimestamp";

export default ZTimestamp;
