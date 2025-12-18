import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZSkeleton.module.css";

export type ZSkeletonVariant = "text" | "circular" | "rectangular" | "rounded";

export interface ZSkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Shape variant */
  variant?: ZSkeletonVariant;
  /** Width */
  width?: string | number;
  /** Height */
  height?: string | number;
  /** Animation type */
  animation?: "pulse" | "wave" | "none";
  /** Number of lines (for text variant) */
  lines?: number;
}

/**
 * ZSkeleton - Loading placeholder component
 */
export const ZSkeleton = forwardRef<HTMLDivElement, ZSkeletonProps>(
  (
    {
      variant = "text",
      width,
      height,
      animation = "pulse",
      lines = 1,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const sizeStyle: React.CSSProperties = {
      width: typeof width === "number" ? `${width}px` : width,
      height: typeof height === "number" ? `${height}px` : height,
      ...style,
    };

    if (variant === "text" && lines > 1) {
      return (
        <div ref={ref} className={cn(styles.textGroup, className)} {...props}>
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className={cn(
                styles.skeleton,
                styles.text,
                styles[animation],
                i === lines - 1 && styles.lastLine
              )}
            />
          ))}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          styles.skeleton,
          styles[variant],
          styles[animation],
          className
        )}
        style={sizeStyle}
        {...props}
      />
    );
  }
);

ZSkeleton.displayName = "ZSkeleton";

/* Skeleton Group - For complex layouts */
export interface ZSkeletonGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Gap between elements */
  gap?: number;
}

export const ZSkeletonGroup = forwardRef<HTMLDivElement, ZSkeletonGroupProps>(
  ({ gap = 3, children, className, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(styles.group, className)}
        style={{ gap: `var(--z-space-${gap})`, ...style }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ZSkeletonGroup.displayName = "ZSkeletonGroup";

export default ZSkeleton;
