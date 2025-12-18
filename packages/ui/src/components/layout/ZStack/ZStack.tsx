import { HTMLAttributes, forwardRef, ElementType } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZStack.module.css";

export type ZStackDirection = "horizontal" | "vertical";
export type ZStackAlign = "start" | "center" | "end" | "stretch" | "baseline";
export type ZStackJustify =
  | "start"
  | "center"
  | "end"
  | "between"
  | "around"
  | "evenly";
export type ZStackWrap = "nowrap" | "wrap" | "wrap-reverse";

export interface ZStackProps extends HTMLAttributes<HTMLElement> {
  /** HTML element to render */
  as?: ElementType;
  /** Stack direction */
  direction?: ZStackDirection;
  /** Gap between items (token scale: 0-12) */
  gap?: number;
  /** Align items */
  align?: ZStackAlign;
  /** Justify content */
  justify?: ZStackJustify;
  /** Wrap behavior */
  wrap?: ZStackWrap;
  /** Full width */
  fullWidth?: boolean;
  /** Full height */
  fullHeight?: boolean;
  /** Inline stack */
  inline?: boolean;
}

/**
 * ZStack - Flexbox stack layout component
 *
 * @example
 * <ZStack direction="vertical" gap={4}>
 *   <ZButton>First</ZButton>
 *   <ZButton>Second</ZButton>
 * </ZStack>
 */
export const ZStack = forwardRef<HTMLElement, ZStackProps>(
  (
    {
      as: Component = "div",
      direction = "vertical",
      gap = 2,
      align = "stretch",
      justify = "start",
      wrap = "nowrap",
      fullWidth = false,
      fullHeight = false,
      inline = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <Component
        ref={ref}
        className={cn(
          styles.stack,
          styles[direction],
          styles[`align-${align}`],
          styles[`justify-${justify}`],
          styles[wrap],
          fullWidth && styles.fullWidth,
          fullHeight && styles.fullHeight,
          inline && styles.inline,
          className
        )}
        style={{ gap: `var(--z-space-${gap})` }}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

ZStack.displayName = "ZStack";

/* HStack - Horizontal Stack shorthand */
export const HStack = forwardRef<HTMLElement, Omit<ZStackProps, "direction">>(
  (props, ref) => <ZStack ref={ref} direction="horizontal" {...props} />
);
HStack.displayName = "HStack";

/* VStack - Vertical Stack shorthand */
export const VStack = forwardRef<HTMLElement, Omit<ZStackProps, "direction">>(
  (props, ref) => <ZStack ref={ref} direction="vertical" {...props} />
);
VStack.displayName = "VStack";

export default ZStack;
