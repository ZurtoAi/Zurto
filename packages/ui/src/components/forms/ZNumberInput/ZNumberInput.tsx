import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import { Plus, Minus } from "lucide-react";
import styles from "./ZNumberInput.module.css";

export type ZNumberInputSize = "sm" | "md" | "lg";

export interface ZNumberInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  /** Input size */
  size?: ZNumberInputSize;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step increment */
  step?: number;
  /** Error state */
  error?: boolean;
  /** Success state */
  success?: boolean;
  /** Helper text */
  helperText?: string;
  /** Label text */
  label?: string;
  /** Value */
  value?: number;
  /** Change handler */
  onChange?: (value: number) => void;
  /** Hide increment/decrement buttons */
  hideControls?: boolean;
}

/**
 * ZNumberInput - Number input with increment/decrement controls
 *
 * @example
 * <ZNumberInput label="Quantity" min={0} max={100} step={1} />
 * <ZNumberInput value={5} onChange={(val) => console.log(val)} />
 */
export const ZNumberInput = forwardRef<HTMLInputElement, ZNumberInputProps>(
  (
    {
      size = "md",
      min,
      max,
      step = 1,
      error = false,
      success = false,
      helperText,
      label,
      value,
      onChange,
      hideControls = false,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    const handleIncrement = () => {
      const currentValue = value ?? 0;
      const newValue = currentValue + step;
      if (max === undefined || newValue <= max) {
        onChange?.(newValue);
      }
    };

    const handleDecrement = () => {
      const currentValue = value ?? 0;
      const newValue = currentValue - step;
      if (min === undefined || newValue >= min) {
        onChange?.(newValue);
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseFloat(e.target.value);
      if (!isNaN(newValue)) {
        onChange?.(newValue);
      }
    };

    const isMinDisabled =
      min !== undefined && value !== undefined && value <= min;
    const isMaxDisabled =
      max !== undefined && value !== undefined && value >= max;

    return (
      <div className={cn(styles.wrapper, className)}>
        {label && (
          <label className={styles.label}>
            {label}
            {props.required && <span className={styles.required}>*</span>}
          </label>
        )}

        <div className={styles.inputWrapper}>
          {!hideControls && (
            <button
              type="button"
              className={cn(styles.controlButton, styles.leftButton)}
              onClick={handleDecrement}
              disabled={disabled || isMinDisabled}
              aria-label="Decrease value"
            >
              <Minus className={styles.icon} />
            </button>
          )}

          <input
            ref={ref}
            type="number"
            className={cn(
              styles.input,
              styles[size],
              error && styles.error,
              success && styles.success,
              disabled && styles.disabled,
              !hideControls && styles.withControls
            )}
            value={value}
            onChange={handleChange}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            {...props}
          />

          {!hideControls && (
            <button
              type="button"
              className={cn(styles.controlButton, styles.rightButton)}
              onClick={handleIncrement}
              disabled={disabled || isMaxDisabled}
              aria-label="Increase value"
            >
              <Plus className={styles.icon} />
            </button>
          )}
        </div>

        {helperText && (
          <span className={cn(styles.helperText, error && styles.errorText)}>
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

ZNumberInput.displayName = "ZNumberInput";

export default ZNumberInput;
