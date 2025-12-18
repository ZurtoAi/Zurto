import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZList.module.css";

export type ZListVariant = "unordered" | "ordered";
export type ZListSize = "sm" | "md" | "lg";

export interface ZListProps
  extends HTMLAttributes<HTMLUListElement | HTMLOListElement> {
  /** List variant */
  variant?: ZListVariant;
  /** List size */
  size?: ZListSize;
  /** Show dividers between items */
  withDividers?: boolean;
  /** Children */
  children: React.ReactNode;
}

export const ZList = forwardRef<
  HTMLUListElement | HTMLOListElement,
  ZListProps
>(
  (
    {
      variant = "unordered",
      size = "md",
      withDividers = false,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const Component = variant === "ordered" ? "ol" : "ul";

    return (
      <Component
        ref={ref as any}
        className={cn(
          styles.list,
          styles[variant],
          styles[size],
          withDividers && styles.withDividers,
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

export const ZListItem = forwardRef<
  HTMLLIElement,
  HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn(styles.item, className)} {...props} />
));
ZListItem.displayName = "ZListItem";

export default ZList;
