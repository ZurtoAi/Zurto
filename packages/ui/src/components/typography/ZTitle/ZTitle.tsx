import { forwardRef, HTMLAttributes, ReactNode, ElementType } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZTitle.module.css";

export type ZTitleOrder = 1 | 2 | 3 | 4 | 5 | 6;
export type ZTitleWeight = "light" | "normal" | "medium" | "semibold" | "bold";
export type ZTitleAlign = "left" | "center" | "right";

export interface ZTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  /** Heading level (1-6) */
  order?: ZTitleOrder;
  /** Font weight */
  weight?: ZTitleWeight;
  /** Text alignment */
  align?: ZTitleAlign;
  /** Children */
  children: ReactNode;
}

export const ZTitle = forwardRef<HTMLHeadingElement, ZTitleProps>(
  (
    {
      order = 1,
      weight = "bold",
      align = "left",
      children,
      className,
      ...props
    },
    ref
  ) => {
    const Component = `h${order}` as ElementType;

    return (
      <Component
        ref={ref}
        className={cn(
          styles.title,
          styles[`h${order}`],
          styles[weight],
          styles[`align-${align}`],
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

ZTitle.displayName = "ZTitle";

export default ZTitle;
