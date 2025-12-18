import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZSlider.module.css";

export type ZSliderSize = "sm" | "md" | "lg";

export interface ZSliderProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "size" | "onChange"
  > {
  /** Slider size */
  size?: ZSliderSize;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step increment */
  step?: number;
  /** Current value */
  value?: number;
  /** Change callback */
  onChange?: (value: number) => void;
  /** Show value label */
  showValue?: boolean;
  /** Label text */
  label?: string;
  /** Show min/max labels */
  showLabels?: boolean;
}

export const ZSlider = forwardRef<HTMLInputElement, ZSliderProps>(
  (
    {
      size = "md",
      min = 0,
      max = 100,
      step = 1,
      value = 0,
      onChange,
      showValue = false,
      label,
      showLabels = false,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(parseFloat(e.target.value));
    };

    const percentage = ((value - min) / (max - min)) * 100;

    return (
      <div className={cn(styles.wrapper, className)}>
        {label && (
          <div className={styles.labelRow}>
            <label className={styles.label}>{label}</label>
            {showValue && <span className={styles.value}>{value}</span>}
          </div>
        )}

        <div className={cn(styles.sliderWrapper, styles[size])}>
          {showLabels && <span className={styles.minLabel}>{min}</span>}

          <div className={styles.track}>
            <input
              ref={ref}
              type="range"
              className={cn(styles.slider, disabled && styles.disabled)}
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={handleChange}
              disabled={disabled}
              style={{
                background: `linear-gradient(to right, var(--z-accent) 0%, var(--z-accent) ${percentage}%, var(--z-border) ${percentage}%, var(--z-border) 100%)`,
              }}
              {...props}
            />
          </div>

          {showLabels && <span className={styles.maxLabel}>{max}</span>}
        </div>
      </div>
    );
  }
);

ZSlider.displayName = "ZSlider";

export default ZSlider;
