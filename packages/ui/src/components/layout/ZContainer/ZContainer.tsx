import { HTMLAttributes, forwardRef, ElementType } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZContainer.module.css";

export type ZContainerSize = "sm" | "md" | "lg" | "xl" | "2xl" | "full";

export interface ZContainerProps extends HTMLAttributes<HTMLElement> {
  /** HTML element to render */
  as?: ElementType;
  /** Max width size */
  size?: ZContainerSize;
  /** Center content */
  center?: boolean;
  /** Padding X (responsive) */
  px?: number;
  /** Padding Y */
  py?: number;
}

/**
 * ZContainer - Responsive container component
 *
 * @example
 * <ZContainer size="lg" center>
 *   <h1>Page Content</h1>
 * </ZContainer>
 */
export const ZContainer = forwardRef<HTMLElement, ZContainerProps>(
  (
    {
      as: Component = "div",
      size = "lg",
      center = true,
      px = 4,
      py,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <Component
        ref={ref}
        className={cn(
          styles.container,
          styles[size],
          center && styles.center,
          className
        )}
        style={{
          paddingLeft: `var(--z-space-${px})`,
          paddingRight: `var(--z-space-${px})`,
          paddingTop: py !== undefined ? `var(--z-space-${py})` : undefined,
          paddingBottom: py !== undefined ? `var(--z-space-${py})` : undefined,
          ...style,
        }}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

ZContainer.displayName = "ZContainer";

export default ZContainer;
