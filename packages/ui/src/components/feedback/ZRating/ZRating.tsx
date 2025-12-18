import { forwardRef, HTMLAttributes } from "react";
import { Star } from "lucide-react";
import { cn } from "@/utils/cn";
import styles from "./ZRating.module.css";

export type ZRatingSize = "xs" | "sm" | "md" | "lg" | "xl";
export type ZRatingVariant = "filled" | "outline";

export interface ZRatingProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Rating variant */
  variant?: ZRatingVariant;
  /** Rating size */
  size?: ZRatingSize;
  /** Current rating value */
  value: number;
  /** Max rating value */
  max?: number;
  /** Allow half stars */
  allowHalf?: boolean;
  /** Read-only mode */
  readOnly?: boolean;
  /** Change handler */
  onChange?: (value: number) => void;
  /** Show rating value */
  showValue?: boolean;
  /** Custom color */
  color?: string;
}

export const ZRating = forwardRef<HTMLDivElement, ZRatingProps>(
  (
    {
      variant = "filled",
      size = "md",
      value,
      max = 5,
      allowHalf = false,
      readOnly = false,
      onChange,
      showValue = false,
      color = "#fbbf24",
      className,
      ...props
    },
    ref
  ) => {
    const handleClick = (index: number, isHalf: boolean) => {
      if (readOnly || !onChange) return;
      const newValue = isHalf ? index + 0.5 : index + 1;
      onChange(newValue);
    };

    const renderStar = (index: number) => {
      const filled = index < Math.floor(value);
      const half = allowHalf && index === Math.floor(value) && value % 1 !== 0;

      return (
        <div
          key={index}
          className={cn(styles.starWrapper, !readOnly && styles.interactive)}
        >
          {allowHalf && !readOnly ? (
            <>
              <div
                className={styles.halfStar}
                onClick={() => handleClick(index, true)}
              >
                <Star
                  className={cn(styles.star, half && styles.filled)}
                  fill={half ? color : "none"}
                  style={{ color }}
                />
              </div>
              <div
                className={styles.halfStar}
                onClick={() => handleClick(index, false)}
              >
                <Star
                  className={cn(styles.star, filled && styles.filled)}
                  fill={filled ? color : "none"}
                  style={{ color }}
                />
              </div>
            </>
          ) : (
            <Star
              className={cn(styles.star, (filled || half) && styles.filled)}
              fill={filled || half ? color : "none"}
              style={{ color }}
              onClick={() => handleClick(index, false)}
            />
          )}
        </div>
      );
    };

    return (
      <div
        ref={ref}
        className={cn(
          styles.rating,
          styles[size],
          styles[variant],
          readOnly && styles.readOnly,
          className
        )}
        {...props}
      >
        <div className={styles.stars}>
          {Array.from({ length: max }).map((_, i) => renderStar(i))}
        </div>
        {showValue && (
          <span className={styles.value}>
            {value.toFixed(allowHalf ? 1 : 0)}
          </span>
        )}
      </div>
    );
  }
);

ZRating.displayName = "ZRating";

export default ZRating;
