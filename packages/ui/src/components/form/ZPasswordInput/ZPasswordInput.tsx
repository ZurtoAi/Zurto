import { forwardRef, InputHTMLAttributes, useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import { Eye, EyeOff } from "lucide-react";
import styles from "./ZPasswordInput.module.css";

export interface ZPasswordInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  /** Show strength indicator */
  showStrength?: boolean;
  /** Show toggle visibility */
  showToggle?: boolean;
}

export const ZPasswordInput = forwardRef<HTMLInputElement, ZPasswordInputProps>(
  (
    {
      showStrength = true,
      showToggle = true,
      className,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState(false);
    const [strength, setStrength] = useState<"weak" | "medium" | "strong">(
      "weak"
    );

    useEffect(() => {
      if (showStrength && typeof value === "string") {
        const len = value.length;
        const hasUpper = /[A-Z]/.test(value);
        const hasLower = /[a-z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        const hasSymbol = /[^A-Za-z0-9]/.test(value);

        const score =
          len +
          (hasUpper ? 1 : 0) +
          (hasLower ? 1 : 0) +
          (hasNumber ? 1 : 0) +
          (hasSymbol ? 1 : 0);
        if (score < 8) setStrength("weak");
        else if (score < 12) setStrength("medium");
        else setStrength("strong");
      }
    }, [value, showStrength]);

    return (
      <div className={cn(styles.container, className)}>
        <div className={styles.inputWrapper}>
          <input
            ref={ref}
            type={isVisible ? "text" : "password"}
            className={styles.input}
            value={value}
            onChange={onChange}
            {...props}
          />
          {showToggle && (
            <button
              type="button"
              className={styles.toggleBtn}
              onClick={() => setIsVisible(!isVisible)}
              aria-label={isVisible ? "Hide password" : "Show password"}
            >
              {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {showStrength && value && (
          <div className={styles.strengthIndicator}>
            <div className={cn(styles.strengthBar, styles[strength])} />
            <span className={styles.strengthLabel}>
              {strength.charAt(0).toUpperCase() + strength.slice(1)}
            </span>
          </div>
        )}
      </div>
    );
  }
);

ZPasswordInput.displayName = "ZPasswordInput";

export default ZPasswordInput;
