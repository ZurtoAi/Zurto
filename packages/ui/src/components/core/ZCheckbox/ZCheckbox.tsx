import { InputHTMLAttributes, forwardRef, ReactNode } from "react";
import { cn } from "@/utils/cn";
import { Check, Minus } from "lucide-react";
import styles from "./ZCheckbox.module.css";

export type ZCheckboxSize = "sm" | "md" | "lg";

export interface ZCheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  /** Checkbox size */
  size?: ZCheckboxSize;
  /** Indeterminate state */
  indeterminate?: boolean;
  /** Label text */
  label?: ReactNode;
  /** Description text */
  description?: string;
  /** Error state */
  error?: boolean;
}

/**
 * ZCheckbox - Checkbox component for Zurto UI
 *
 * @example
 * <ZCheckbox label="Accept terms" />
 * <ZCheckbox checked indeterminate />
 */
export const ZCheckbox = forwardRef<HTMLInputElement, ZCheckboxProps>(
  (
    {
      size = "md",
      indeterminate = false,
      label,
      description,
      error = false,
      disabled,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId =
      id || `z-checkbox-${Math.random().toString(36).substring(7)}`;

    return (
      <label
        className={cn(
          styles.wrapper,
          styles[size],
          disabled && styles.disabled,
          error && styles.error,
          className
        )}
        htmlFor={inputId}
      >
        <span className={styles.checkboxWrapper}>
          <input
            ref={ref}
            type="checkbox"
            id={inputId}
            disabled={disabled}
            className={styles.input}
            {...props}
          />
          <span className={styles.checkbox}>
            {indeterminate ? (
              <Minus className={styles.icon} />
            ) : (
              <Check className={styles.icon} />
            )}
          </span>
        </span>

        {(label || description) && (
          <span className={styles.content}>
            {label && <span className={styles.label}>{label}</span>}
            {description && (
              <span className={styles.description}>{description}</span>
            )}
          </span>
        )}
      </label>
    );
  }
);

ZCheckbox.displayName = "ZCheckbox";

export default ZCheckbox;
