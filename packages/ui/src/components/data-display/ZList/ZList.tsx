import { HTMLAttributes, forwardRef, ReactNode } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZList.module.css";

export type ZListSize = "sm" | "md" | "lg";
export type ZListVariant = "default" | "bordered" | "separated";

export interface ZListItemProps extends HTMLAttributes<HTMLLIElement> {
  /** Left content (icon/avatar) */
  left?: ReactNode;
  /** Primary text */
  primary?: ReactNode;
  /** Secondary text */
  secondary?: ReactNode;
  /** Right content */
  right?: ReactNode;
  /** Disabled state */
  disabled?: boolean;
  /** Selected state */
  selected?: boolean;
  /** Clickable */
  clickable?: boolean;
}

export interface ZListProps extends HTMLAttributes<HTMLUListElement> {
  /** Size variant */
  size?: ZListSize;
  /** Visual variant */
  variant?: ZListVariant;
  /** Hoverable items */
  hoverable?: boolean;
}

/**
 * ZList - List container component
 */
export const ZList = forwardRef<HTMLUListElement, ZListProps>(
  (
    {
      size = "md",
      variant = "default",
      hoverable = true,
      children,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <ul
        ref={ref}
        className={cn(
          styles.list,
          styles[size],
          styles[variant],
          hoverable && styles.hoverable,
          className
        )}
        {...props}
      >
        {children}
      </ul>
    );
  }
);

ZList.displayName = "ZList";

/**
 * ZListItem - List item component
 */
export const ZListItem = forwardRef<HTMLLIElement, ZListItemProps>(
  (
    {
      left,
      primary,
      secondary,
      right,
      disabled = false,
      selected = false,
      clickable = false,
      children,
      className,
      onClick,
      ...props
    },
    ref
  ) => {
    return (
      <li
        ref={ref}
        className={cn(
          styles.item,
          disabled && styles.disabled,
          selected && styles.selected,
          (clickable || onClick) && styles.clickable,
          className
        )}
        onClick={disabled ? undefined : onClick}
        {...props}
      >
        {left && <span className={styles.left}>{left}</span>}

        <span className={styles.content}>
          {primary && <span className={styles.primary}>{primary}</span>}
          {secondary && <span className={styles.secondary}>{secondary}</span>}
          {children}
        </span>

        {right && <span className={styles.right}>{right}</span>}
      </li>
    );
  }
);

ZListItem.displayName = "ZListItem";

export default ZList;
