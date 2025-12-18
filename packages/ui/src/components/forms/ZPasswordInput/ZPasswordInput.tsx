import { forwardRef, useState, InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/utils/cn";
import styles from "./ZPasswordInput.module.css";

export type ZPasswordInputSize = "sm" | "md" | "lg";

export interface ZPasswordInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  /** Input size */
  size?: ZPasswordInputSize;
  /** Error state */
  error?: boolean;
  /** Success state */
  success?: boolean;
  /** Helper text */
  helperText?: string;
  /** Label text */
  label?: string;
  /** Show password strength meter */
  showStrength?: boolean;
}

/**
 * ZPasswordInput - Password input with toggle visibility
 *
 * @example
 * <ZPasswordInput label="Password" placeholder="Enter password" />
 * <ZPasswordInput showStrength />
 */
export const ZPasswordInput = forwardRef<HTMLInputElement, ZPasswordInputProps>(
  (
    {
      size = "md",
      error = false,
      success = false,
      helperText,
      label,
      showStrength = false,
      disabled,
      className,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [strength, setStrength] = useState(0);

    const calculateStrength = (password: string): number => {
      let score = 0;
      if (password.length >= 8) score++;
      if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
      if (/\d/.test(password)) score++;
      if (/[^a-zA-Z\d]/.test(password)) score++;
      return score;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (showStrength) {
        setStrength(calculateStrength(e.target.value));
      }
      onChange?.(e);
    };

    const strengthLabels = ["Weak", "Fair", "Good", "Strong"];
    const strengthColors = ["error", "warning", "success", "success"];

    return (
      <div className={cn(styles.wrapper, className)}>
        {label && (
          <label className={styles.label}>
            {label}
            {props.required && <span className={styles.required}>*</span>}
          </label>
        )}

        <div className={styles.inputWrapper}>
          <input
            ref={ref}
            type={showPassword ? "text" : "password"}
            className={cn(
              styles.input,
              styles[size],
              error && styles.error,
              success && styles.success,
              disabled && styles.disabled
            )}
            disabled={disabled}
            value={value}
            onChange={handleChange}
            {...props}
          />
          <button
            type="button"
            className={styles.toggleButton}
            onClick={() => setShowPassword(!showPassword)}
            disabled={disabled}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className={styles.icon} />
            ) : (
              <Eye className={styles.icon} />
            )}
          </button>
        </div>

        {showStrength && value && (
          <div className={styles.strengthMeter}>
            <div className={styles.strengthBars}>
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={cn(
                    styles.strengthBar,
                    i < strength && styles[strengthColors[strength - 1]]
                  )}
                />
              ))}
            </div>
            {strength > 0 && (
              <span
                className={cn(
                  styles.strengthLabel,
                  styles[strengthColors[strength - 1]]
                )}
              >
                {strengthLabels[strength - 1]}
              </span>
            )}
          </div>
        )}

        {helperText && (
          <span className={cn(styles.helperText, error && styles.errorText)}>
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

ZPasswordInput.displayName = "ZPasswordInput";

export default ZPasswordInput;
