import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZActivityFeed.module.css";

export interface Activity {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  description?: string;
  timestamp: Date | string;
  icon?: React.ReactNode;
  user?: {
    name: string;
    avatar?: string;
  };
}

export interface ZActivityFeedProps extends HTMLAttributes<HTMLDivElement> {
  /** Activities */
  activities: Activity[];
  /** Max items to show */
  maxItems?: number;
}

export const ZActivityFeed = forwardRef<HTMLDivElement, ZActivityFeedProps>(
  ({ activities, maxItems, className, ...props }, ref) => {
    const displayActivities = maxItems
      ? activities.slice(0, maxItems)
      : activities;

    const formatTimestamp = (timestamp: Date | string) => {
      const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (minutes < 1) return "just now";
      if (minutes < 60) return `${minutes}m ago`;
      if (hours < 24) return `${hours}h ago`;
      return `${days}d ago`;
    };

    return (
      <div ref={ref} className={cn(styles.container, className)} {...props}>
        {displayActivities.map((activity, index) => (
          <div
            key={activity.id}
            className={cn(styles.activity, styles[activity.type])}
          >
            {activity.icon && (
              <div className={styles.icon}>{activity.icon}</div>
            )}
            <div className={styles.content}>
              <div className={styles.header}>
                {activity.user && (
                  <div className={styles.user}>
                    {activity.user.avatar && (
                      <img
                        src={activity.user.avatar}
                        alt={activity.user.name}
                        className={styles.avatar}
                      />
                    )}
                    <span className={styles.userName}>
                      {activity.user.name}
                    </span>
                  </div>
                )}
                <span className={styles.timestamp}>
                  {formatTimestamp(activity.timestamp)}
                </span>
              </div>
              <div className={styles.title}>{activity.title}</div>
              {activity.description && (
                <div className={styles.description}>{activity.description}</div>
              )}
            </div>
            {index < displayActivities.length - 1 && (
              <div className={styles.connector} />
            )}
          </div>
        ))}
      </div>
    );
  }
);

ZActivityFeed.displayName = "ZActivityFeed";

export default ZActivityFeed;
