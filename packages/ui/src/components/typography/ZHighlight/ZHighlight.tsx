import { forwardRef, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZHighlight.module.css";

export interface ZHighlightProps extends HTMLAttributes<HTMLElement> {
  /** Text to highlight */
  children: ReactNode;
  /** Highlight color */
  color?: string;
  /** Background color */
  bgColor?: string;
}

export const ZHighlight = forwardRef<HTMLElement, ZHighlightProps>(
  (
    {
      children,
      color,
      bgColor = "var(--z-accent-color)",
      className,
      style,
      ...props
    },
    ref
  ) => {
    return (
      <mark
        ref={ref}
        className={cn(styles.highlight, className)}
        style={{
          ...style,
          ...(color && { color }),
          backgroundColor: bgColor,
        }}
        {...props}
      >
        {children}
      </mark>
    );
  }
);

ZHighlight.displayName = "ZHighlight";

export default ZHighlight;
