import { forwardRef, ButtonHTMLAttributes, useState } from "react";
import { UserPlus, UserCheck } from "lucide-react";
import { cn } from "@/utils/cn";
import styles from "./ZFollowButton.module.css";

export interface ZFollowButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  /** Is following */
  following?: boolean;
  /** On change */
  onChange?: (following: boolean) => void;
  /** Size */
  size?: "sm" | "md" | "lg";
  /** Variant */
  variant?: "default" | "outline" | "solid";
}

export const ZFollowButton = forwardRef<HTMLButtonElement, ZFollowButtonProps>(
  (
    {
      following = false,
      onChange,
      size = "md",
      variant = "default",
      className,
      ...props
    },
    ref
  ) => {
    const [isFollowing, setIsFollowing] = useState(following);
    const [isHovering, setIsHovering] = useState(false);

    const handleClick = () => {
      const newFollowing = !isFollowing;
      setIsFollowing(newFollowing);
      onChange?.(newFollowing);
    };

    return (
      <button
        ref={ref}
        onClick={handleClick}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className={cn(
          styles.button,
          styles[size],
          styles[variant],
          isFollowing && styles.following,
          className
        )}
        aria-label={isFollowing ? "Unfollow" : "Follow"}
        {...props}
      >
        {isFollowing ? (
          <>
            <UserCheck className={styles.icon} />
            <span>{isHovering ? "Unfollow" : "Following"}</span>
          </>
        ) : (
          <>
            <UserPlus className={styles.icon} />
            <span>Follow</span>
          </>
        )}
      </button>
    );
  }
);

ZFollowButton.displayName = "ZFollowButton";

export default ZFollowButton;
