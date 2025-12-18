import { forwardRef, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZContainer.module.css";

export type ZContainerSize = "xs" | "sm" | "md" | "lg" | "xl" | "full";

export interface ZContainerProps extends HTMLAttributes<HTMLDivElement> {
  /** Container max-width size */
  size?: ZContainerSize;
  /** Center content */
  centered?: boolean;
  /** Add padding */
  padding?: boolean;
  /** Children */
  children: ReactNode;
}

export const ZContainer = forwardRef<HTMLDivElement, ZContainerProps>(
  (
    {
      size = "lg",
      centered = true,
      padding = true,
      children,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          styles.container,
          styles[size],
          centered && styles.centered,
          padding && styles.padding,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ZContainer.displayName = "ZContainer";

export default ZContainer;
