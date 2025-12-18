import { forwardRef, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZActivityFeed.module.css";

export interface Activity {
  /** Activity ID */
  id: string;
  /** Activity type */
  type?: "comment" | "update" | "create" | "delete" | "custom";
  /** User avatar */
  avatar?: string;
  /** User name */
  user: string;
  /** Activity text */
  text: string;
  /** Timestamp */
  timestamp: string;
  /** Custom icon */
  icon?: ReactNode;
}

export interface ZActivityFeedProps extends HTMLAttributes<HTMLDivElement> {
  /** Activities list */
  activities: Activity[];
  /** Show avatars */
  showAvatars?: boolean;
  /** Max items to show */
  maxItems?: number;
}

export const ZActivityFeed = forwardRef<HTMLDivElement, ZActivityFeedProps>(
  ({ activities, showAvatars = true, maxItems, className, ...props }, ref) => {
    const displayActivities = maxItems
      ? activities.slice(0, maxItems)
      : activities;

    const getTypeColor = (type?: string) => {
      switch (type) {
        case "comment":
          return "var(--z-accent)";
        case "update":
          return "#3b82f6";
        case "create":
          return "var(--z-success)";
        case "delete":
          return "var(--z-error)";
        default:
          return "var(--z-text-secondary)";
      }
    };

    return (
      <div ref={ref} className={cn(styles.feed, className)} {...props}>
        {displayActivities.map((activity, index) => (
          <div
            key={activity.id}
            className={cn(
              styles.item,
              index === displayActivities.length - 1 && styles.last
            )}
          >
            {showAvatars && (
              <div className={styles.avatarWrapper}>
                {activity.avatar ? (
                  <img
                    src={activity.avatar}
                    alt={activity.user}
                    className={styles.avatar}
                  />
                ) : (
                  <div
                    className={styles.avatarFallback}
                    style={{ background: getTypeColor(activity.type) }}
                  >
                    {activity.user.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            )}

            <div className={styles.content}>
              <div className={styles.header}>
                <span className={styles.user}>{activity.user}</span>
                <span className={styles.timestamp}>{activity.timestamp}</span>
              </div>
              <p className={styles.text}>{activity.text}</p>
            </div>

            {activity.icon && (
              <div className={styles.icon}>{activity.icon}</div>
            )}
          </div>
        ))}

        {maxItems && activities.length > maxItems && (
          <div className={styles.more}>
            +{activities.length - maxItems} more activities
          </div>
        )}
      </div>
    );
  }
);

ZActivityFeed.displayName = "ZActivityFeed";

export default ZActivityFeed;
