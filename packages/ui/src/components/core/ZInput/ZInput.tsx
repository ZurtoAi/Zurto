import { InputHTMLAttributes, forwardRef, ReactNode, useState } from "react";
import { cn } from "@/utils/cn";
import { Eye, EyeOff, Search, X } from "lucide-react";
import styles from "./ZInput.module.css";

export type ZInputSize = "sm" | "md" | "lg";
export type ZInputVariant = "default" | "filled" | "ghost";

export interface ZInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Input size */
  size?: ZInputSize;
  /** Input variant */
  variant?: ZInputVariant;
  /** Label text */
  label?: string;
  /** Helper text below input */
  helperText?: string;
  /** Error message (also sets error state) */
  error?: string;
  /** Icon to show on the left */
  leftIcon?: ReactNode;
  /** Icon to show on the right */
  rightIcon?: ReactNode;
  /** Show clear button when has value */
  clearable?: boolean;
  /** Callback when clear is clicked */
  onClear?: () => void;
  /** Full width input */
  fullWidth?: boolean;
}

/**
 * ZInput - Input field component for Zurto UI
 *
 * @example
 * <ZInput placeholder="Enter email" />
 * <ZInput type="password" label="Password" />
 * <ZInput leftIcon={<Search />} placeholder="Search..." />
 */
export const ZInput = forwardRef<HTMLInputElement, ZInputProps>(
  (
    {
      size = "md",
      variant = "default",
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      clearable,
      onClear,
      fullWidth = false,
      type = "text",
      disabled,
      className,
      id,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [internalValue, setInternalValue] = useState("");

    const inputId = id || `z-input-${Math.random().toString(36).substring(7)}`;
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;

    const isPassword = type === "password";
    const isSearch = type === "search";
    const hasValue =
      value !== undefined ? Boolean(value) : Boolean(internalValue);
    const showClear = clearable && hasValue && !disabled;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInternalValue(e.target.value);
      onChange?.(e);
    };

    const handleClear = () => {
      setInternalValue("");
      onClear?.();
    };

    const togglePassword = () => setShowPassword(!showPassword);

    const getInputType = () => {
      if (isPassword) return showPassword ? "text" : "password";
      return type;
    };

    return (
      <div
        className={cn(styles.wrapper, fullWidth && styles.fullWidth, className)}
      >
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
        )}

        <div
          className={cn(
            styles.inputWrapper,
            styles[size],
            styles[variant],
            error && styles.error,
            disabled && styles.disabled,
            leftIcon && styles.hasLeftIcon,
            (rightIcon || isPassword || showClear) && styles.hasRightIcon
          )}
        >
          {leftIcon && (
            <span className={styles.leftIcon} aria-hidden="true">
              {isSearch ? <Search size={16} /> : leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            type={getInputType()}
            disabled={disabled}
            className={styles.input}
            value={value}
            onChange={handleChange}
            aria-invalid={!!error}
            aria-describedby={
              cn(helperText && helperId, error && errorId) || undefined
            }
            {...props}
          />

          {showClear && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={handleClear}
              aria-label="Clear input"
            >
              <X size={14} />
            </button>
          )}

          {isPassword && (
            <button
              type="button"
              className={styles.togglePassword}
              onClick={togglePassword}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}

          {rightIcon && !isPassword && !showClear && (
            <span className={styles.rightIcon} aria-hidden="true">
              {rightIcon}
            </span>
          )}
        </div>

        {helperText && !error && (
          <span id={helperId} className={styles.helperText}>
            {helperText}
          </span>
        )}

        {error && (
          <span id={errorId} className={styles.errorText} role="alert">
            {error}
          </span>
        )}
      </div>
    );
  }
);

ZInput.displayName = "ZInput";

export default ZInput;
