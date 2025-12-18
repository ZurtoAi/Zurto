import { forwardRef, ButtonHTMLAttributes, useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/utils/cn";
import styles from "./ZLikeButton.module.css";

export interface ZLikeButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  /** Is liked */
  liked?: boolean;
  /** On change */
  onChange?: (liked: boolean) => void;
  /** Like count */
  count?: number;
  /** Show count */
  showCount?: boolean;
  /** Size */
  size?: "sm" | "md" | "lg";
  /** Animated */
  animated?: boolean;
}

export const ZLikeButton = forwardRef<HTMLButtonElement, ZLikeButtonProps>(
  (
    {
      liked = false,
      onChange,
      count,
      showCount = true,
      size = "md",
      animated = true,
      className,
      ...props
    },
    ref
  ) => {
    const [isLiked, setIsLiked] = useState(liked);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleClick = () => {
      const newLiked = !isLiked;
      setIsLiked(newLiked);
      onChange?.(newLiked);

      if (animated) {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 300);
      }
    };

    return (
      <button
        ref={ref}
        onClick={handleClick}
        className={cn(
          styles.button,
          styles[size],
          isLiked && styles.liked,
          isAnimating && styles.animating,
          className
        )}
        aria-label={isLiked ? "Unlike" : "Like"}
        {...props}
      >
        <Heart className={styles.icon} />
        {showCount && count !== undefined && (
          <span className={styles.count}>{count}</span>
        )}
      </button>
    );
  }
);

ZLikeButton.displayName = "ZLikeButton";

export default ZLikeButton;
