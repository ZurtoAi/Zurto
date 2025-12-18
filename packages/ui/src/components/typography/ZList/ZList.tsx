import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZList.module.css";

export interface ZListProps
  extends HTMLAttributes<HTMLUListElement | HTMLOListElement> {
  /** List type */
  ordered?: boolean;
  /** Variant */
  variant?: "default" | "disc" | "circle" | "square" | "none";
  /** Spacing */
  spacing?: "compact" | "default" | "relaxed";
}

export const ZList = forwardRef<
  HTMLUListElement | HTMLOListElement,
  ZListProps
>(
  (
    {
      ordered = false,
      variant = "default",
      spacing = "default",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const Component = ordered ? "ol" : "ul";

    return (
      <Component
        ref={ref as any}
        className={cn(
          styles.list,
          ordered ? styles.ordered : styles.unordered,
          styles[variant],
          styles[`spacing-${spacing}`],
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

ZList.displayName = "ZList";

export default ZList;
