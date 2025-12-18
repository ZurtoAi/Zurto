import { forwardRef, InputHTMLAttributes, useState } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZSlider.module.css";

export interface ZSliderProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "value" | "onChange"
  > {
  /** Current value */
  value: number;
  /** On value change */
  onChange: (value: number) => void;
  /** Min value */
  min?: number;
  /** Max value */
  max?: number;
  /** Step */
  step?: number;
  /** Show value */
  showValue?: boolean;
  /** Show marks */
  marks?: number[];
  /** Size */
  size?: "sm" | "md" | "lg";
}

export const ZSlider = forwardRef<HTMLInputElement, ZSliderProps>(
  (
    {
      value,
      onChange,
      min = 0,
      max = 100,
      step = 1,
      showValue = false,
      marks,
      size = "md",
      className,
      ...props
    },
    ref
  ) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(Number(e.target.value));
    };

    const percentage = ((value - min) / (max - min)) * 100;

    return (
      <div className={cn(styles.container, styles[size], className)}>
        <div className={styles.track}>
          <div className={styles.fill} style={{ width: `${percentage}%` }} />
          <input
            ref={ref}
            type="range"
            value={value}
            onChange={handleChange}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            min={min}
            max={max}
            step={step}
            className={cn(styles.slider, isDragging && styles.dragging)}
            {...props}
          />
          {marks && (
            <div className={styles.marks}>
              {marks.map((mark) => {
                const markPercentage = ((mark - min) / (max - min)) * 100;
                return (
                  <div
                    key={mark}
                    className={styles.mark}
                    style={{ left: `${markPercentage}%` }}
                  />
                );
              })}
            </div>
          )}
        </div>
        {showValue && <div className={styles.value}>{value}</div>}
      </div>
    );
  }
);

ZSlider.displayName = "ZSlider";

export default ZSlider;
