import { InputHTMLAttributes, forwardRef, ReactNode } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZSwitch.module.css";

export type ZSwitchSize = "sm" | "md" | "lg";

export interface ZSwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  /** Switch size */
  size?: ZSwitchSize;
  /** Label text */
  label?: ReactNode;
  /** Description text */
  description?: string;
  /** Label on left side */
  labelLeft?: boolean;
}

/**
 * ZSwitch - Toggle switch component for Zurto UI
 *
 * @example
 * <ZSwitch label="Enable notifications" />
 * <ZSwitch checked size="lg" />
 */
export const ZSwitch = forwardRef<HTMLInputElement, ZSwitchProps>(
  (
    {
      size = "md",
      label,
      description,
      labelLeft = false,
      disabled,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `z-switch-${Math.random().toString(36).substring(7)}`;

    const content = (label || description) && (
      <span className={styles.content}>
        {label && <span className={styles.label}>{label}</span>}
        {description && (
          <span className={styles.description}>{description}</span>
        )}
      </span>
    );

    return (
      <label
        className={cn(
          styles.wrapper,
          styles[size],
          labelLeft && styles.labelLeft,
          disabled && styles.disabled,
          className
        )}
        htmlFor={inputId}
      >
        {labelLeft && content}

        <span className={styles.switchWrapper}>
          <input
            ref={ref}
            type="checkbox"
            id={inputId}
            disabled={disabled}
            className={styles.input}
            role="switch"
            {...props}
          />
          <span className={styles.track}>
            <span className={styles.thumb} />
          </span>
        </span>

        {!labelLeft && content}
      </label>
    );
  }
);

ZSwitch.displayName = "ZSwitch";

export default ZSwitch;
