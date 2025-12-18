import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";
import { cn } from "@/utils/cn";
import { Loader2 } from "lucide-react";
import styles from "./ZButton.module.css";

export type ZButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  | "success"
  | "outline";
export type ZButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface ZButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button variant style */
  variant?: ZButtonVariant;
  /** Button size */
  size?: ZButtonSize;
  /** Show loading spinner */
  loading?: boolean;
  /** Loading text to display */
  loadingText?: string;
  /** Icon to show before text */
  leftIcon?: ReactNode;
  /** Icon to show after text */
  rightIcon?: ReactNode;
  /** Make button full width */
  fullWidth?: boolean;
  /** Icon-only button (square) */
  iconOnly?: boolean;
  /** Button contents */
  children?: ReactNode;
}

/**
 * ZButton - Primary button component for Zurto UI
 *
 * @example
 * <ZButton variant="primary" onClick={() => {}}>Click me</ZButton>
 * <ZButton variant="ghost" leftIcon={<Icon />}>With Icon</ZButton>
 * <ZButton loading loadingText="Saving...">Save</ZButton>
 */
export const ZButton = forwardRef<HTMLButtonElement, ZButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      loadingText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      iconOnly = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        className={cn(
          styles.button,
          styles[variant],
          styles[size],
          fullWidth && styles.fullWidth,
          iconOnly && styles.iconOnly,
          loading && styles.loading,
          className
        )}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        {...props}
      >
        {loading && <Loader2 className={styles.spinner} aria-hidden="true" />}
        {!loading && leftIcon && (
          <span className={styles.leftIcon} aria-hidden="true">
            {leftIcon}
          </span>
        )}
        {loading && loadingText ? loadingText : children}
        {!loading && rightIcon && (
          <span className={styles.rightIcon} aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

ZButton.displayName = "ZButton";

export default ZButton;
