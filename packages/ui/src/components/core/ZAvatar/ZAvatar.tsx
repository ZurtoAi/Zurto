import { HTMLAttributes, forwardRef, useMemo } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZAvatar.module.css";

export type ZAvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type ZAvatarStatus = "online" | "offline" | "away" | "busy";

export interface ZAvatarProps extends HTMLAttributes<HTMLDivElement> {
  /** Image source URL */
  src?: string;
  /** Alt text for image */
  alt?: string;
  /** Name for generating initials */
  name?: string;
  /** Avatar size */
  size?: ZAvatarSize;
  /** Status indicator */
  status?: ZAvatarStatus;
  /** Show status indicator */
  showStatus?: boolean;
  /** Make avatar rounded square instead of circle */
  rounded?: boolean;
  /** Border around avatar */
  bordered?: boolean;
}

/**
 * ZAvatar - Avatar component for Zurto UI
 *
 * @example
 * <ZAvatar src="/user.jpg" alt="John Doe" />
 * <ZAvatar name="John Doe" size="lg" />
 * <ZAvatar name="Jane" status="online" showStatus />
 */
export const ZAvatar = forwardRef<HTMLDivElement, ZAvatarProps>(
  (
    {
      src,
      alt,
      name,
      size = "md",
      status,
      showStatus = false,
      rounded = false,
      bordered = false,
      className,
      ...props
    },
    ref
  ) => {
    const initials = useMemo(() => {
      if (!name) return "";
      const parts = name.trim().split(" ");
      if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
      return (
        parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
      ).toUpperCase();
    }, [name]);

    const bgColor = useMemo(() => {
      if (!name) return "var(--z-bg-elevated)";
      // Generate consistent color from name
      let hash = 0;
      for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
      }
      const colors = [
        "var(--z-primary)",
        "var(--z-success)",
        "var(--z-warning)",
        "var(--z-info)",
        "#8b5cf6", // purple
        "#ec4899", // pink
        "#06b6d4", // cyan
        "#f97316", // orange
      ];
      return colors[Math.abs(hash) % colors.length];
    }, [name]);

    return (
      <div
        ref={ref}
        className={cn(
          styles.avatar,
          styles[size],
          rounded && styles.rounded,
          bordered && styles.bordered,
          className
        )}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt || name || "Avatar"}
            className={styles.image}
            onError={(e) => {
              // Hide image on error, show initials
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <span
            className={styles.initials}
            style={{ backgroundColor: bgColor }}
          >
            {initials || "?"}
          </span>
        )}

        {showStatus && status && (
          <span
            className={cn(styles.status, styles[`status-${status}`])}
            aria-label={`Status: ${status}`}
          />
        )}
      </div>
    );
  }
);

ZAvatar.displayName = "ZAvatar";

export default ZAvatar;

/* Avatar Group */
export interface ZAvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Maximum avatars to show */
  max?: number;
  /** Size for all avatars */
  size?: ZAvatarSize;
  children: React.ReactNode;
}

export const ZAvatarGroup = forwardRef<HTMLDivElement, ZAvatarGroupProps>(
  ({ max = 5, size = "md", className, children, ...props }, ref) => {
    const childArray = Array.isArray(children) ? children : [children];
    const visibleChildren = childArray.slice(0, max);
    const remainingCount = childArray.length - max;

    return (
      <div ref={ref} className={cn(styles.group, className)} {...props}>
        {visibleChildren}
        {remainingCount > 0 && (
          <div className={cn(styles.avatar, styles[size], styles.overflow)}>
            <span className={styles.overflowText}>+{remainingCount}</span>
          </div>
        )}
      </div>
    );
  }
);

ZAvatarGroup.displayName = "ZAvatarGroup";
