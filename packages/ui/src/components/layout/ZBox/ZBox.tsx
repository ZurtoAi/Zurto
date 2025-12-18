import { HTMLAttributes, forwardRef, ElementType } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZBox.module.css";

export type ZBoxDisplay =
  | "block"
  | "inline"
  | "inline-block"
  | "flex"
  | "inline-flex"
  | "grid"
  | "none";
export type ZBoxPosition =
  | "static"
  | "relative"
  | "absolute"
  | "fixed"
  | "sticky";

export interface ZBoxProps extends HTMLAttributes<HTMLElement> {
  /** HTML element to render */
  as?: ElementType;
  /** Display property */
  display?: ZBoxDisplay;
  /** Position property */
  position?: ZBoxPosition;
  /** Padding (token scale: 0-12) */
  p?: number | string;
  /** Padding X */
  px?: number | string;
  /** Padding Y */
  py?: number | string;
  /** Padding Top */
  pt?: number | string;
  /** Padding Right */
  pr?: number | string;
  /** Padding Bottom */
  pb?: number | string;
  /** Padding Left */
  pl?: number | string;
  /** Margin (token scale: 0-12) */
  m?: number | string;
  /** Margin X */
  mx?: number | string;
  /** Margin Y */
  my?: number | string;
  /** Margin Top */
  mt?: number | string;
  /** Margin Right */
  mr?: number | string;
  /** Margin Bottom */
  mb?: number | string;
  /** Margin Left */
  ml?: number | string;
  /** Width */
  w?: string | number;
  /** Min Width */
  minW?: string | number;
  /** Max Width */
  maxW?: string | number;
  /** Height */
  h?: string | number;
  /** Min Height */
  minH?: string | number;
  /** Max Height */
  maxH?: string | number;
  /** Border Radius */
  radius?: "none" | "sm" | "md" | "lg" | "xl" | "full";
  /** Background variant */
  bg?:
    | "transparent"
    | "primary"
    | "secondary"
    | "tertiary"
    | "elevated"
    | "glass";
  /** Border */
  border?: boolean;
  /** Shadow */
  shadow?: "none" | "sm" | "md" | "lg" | "xl";
}

const spacingValue = (val: number | string | undefined): string | undefined => {
  if (val === undefined) return undefined;
  if (typeof val === "number") return `var(--z-space-${val})`;
  return val;
};

const sizeValue = (val: string | number | undefined): string | undefined => {
  if (val === undefined) return undefined;
  if (typeof val === "number") return `${val}px`;
  return val;
};

/**
 * ZBox - Primitive layout component for Zurto UI
 *
 * @example
 * <ZBox p={4} bg="secondary" radius="md">Content</ZBox>
 * <ZBox as="section" display="flex" p={6}>...</ZBox>
 */
export const ZBox = forwardRef<HTMLElement, ZBoxProps>(
  (
    {
      as: Component = "div",
      display,
      position,
      p,
      px,
      py,
      pt,
      pr,
      pb,
      pl,
      m,
      mx,
      my,
      mt,
      mr,
      mb,
      ml,
      w,
      minW,
      maxW,
      h,
      minH,
      maxH,
      radius,
      bg,
      border = false,
      shadow,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const inlineStyle: React.CSSProperties = {
      display,
      position,
      padding: spacingValue(p),
      paddingLeft: spacingValue(px ?? pl),
      paddingRight: spacingValue(px ?? pr),
      paddingTop: spacingValue(py ?? pt),
      paddingBottom: spacingValue(py ?? pb),
      margin: spacingValue(m),
      marginLeft: spacingValue(mx ?? ml),
      marginRight: spacingValue(mx ?? mr),
      marginTop: spacingValue(my ?? mt),
      marginBottom: spacingValue(my ?? mb),
      width: sizeValue(w),
      minWidth: sizeValue(minW),
      maxWidth: sizeValue(maxW),
      height: sizeValue(h),
      minHeight: sizeValue(minH),
      maxHeight: sizeValue(maxH),
      ...style,
    };

    return (
      <Component
        ref={ref}
        className={cn(
          styles.box,
          radius && styles[`radius-${radius}`],
          bg && styles[`bg-${bg}`],
          border && styles.border,
          shadow && styles[`shadow-${shadow}`],
          className
        )}
        style={inlineStyle}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

ZBox.displayName = "ZBox";

export default ZBox;
