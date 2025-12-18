import { forwardRef, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZText.module.css";

export type ZTextSize = "xs" | "sm" | "base" | "lg" | "xl";
export type ZTextWeight = "light" | "normal" | "medium" | "semibold" | "bold";
export type ZTextAlign = "left" | "center" | "right" | "justify";
export type ZTextTransform = "none" | "uppercase" | "lowercase" | "capitalize";

export interface ZTextProps extends HTMLAttributes<HTMLParagraphElement> {
  /** Text size */
  size?: ZTextSize;
  /** Font weight */
  weight?: ZTextWeight;
  /** Text alignment */
  align?: ZTextAlign;
  /** Text transform */
  transform?: ZTextTransform;
  /** Text color (secondary, tertiary, or inherit) */
  color?: "primary" | "secondary" | "tertiary" | "inherit";
  /** Truncate text */
  truncate?: boolean;
  /** Line clamp (number of lines before truncating) */
  lineClamp?: number;
  /** Children */
  children: ReactNode;
}

export const ZText = forwardRef<HTMLParagraphElement, ZTextProps>(
  (
    {
      size = "base",
      weight = "normal",
      align = "left",
      transform = "none",
      color = "primary",
      truncate = false,
      lineClamp,
      children,
      className,
      style,
      ...props
    },
    ref
  ) => {
    return (
      <p
        ref={ref}
        className={cn(
          styles.text,
          styles[size],
          styles[weight],
          styles[`align-${align}`],
          styles[`transform-${transform}`],
          styles[`color-${color}`],
          truncate && styles.truncate,
          lineClamp && styles.lineClamp,
          className
        )}
        style={{
          ...style,
          ...(lineClamp && { WebkitLineClamp: lineClamp }),
        }}
        {...props}
      >
        {children}
      </p>
    );
  }
);

ZText.displayName = "ZText";

export default ZText;
