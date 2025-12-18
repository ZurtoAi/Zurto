import { forwardRef, HTMLAttributes, useState } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZRangeSlider.module.css";

export interface ZRangeSliderProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Min value */
  min?: number;
  /** Max value */
  max?: number;
  /** Current range [start, end] */
  value: [number, number];
  /** On change */
  onChange: (value: [number, number]) => void;
  /** Step */
  step?: number;
  /** Show values */
  showValues?: boolean;
}

export const ZRangeSlider = forwardRef<HTMLDivElement, ZRangeSliderProps>(
  (
    {
      min = 0,
      max = 100,
      value,
      onChange,
      step = 1,
      showValues = false,
      className,
      ...props
    },
    ref
  ) => {
    const [dragging, setDragging] = useState<"start" | "end" | null>(null);

    const startPercentage = ((value[0] - min) / (max - min)) * 100;
    const endPercentage = ((value[1] - min) / (max - min)) * 100;

    const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value);
      onChange([Math.min(newValue, value[1]), value[1]]);
    };

    const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value);
      onChange([value[0], Math.max(newValue, value[0])]);
    };

    return (
      <div ref={ref} className={cn(styles.container, className)} {...props}>
        <div className={styles.track}>
          <div
            className={styles.fill}
            style={{
              left: `${startPercentage}%`,
              width: `${endPercentage - startPercentage}%`,
            }}
          />
          <input
            type="range"
            value={value[0]}
            onChange={handleStartChange}
            onMouseDown={() => setDragging("start")}
            onMouseUp={() => setDragging(null)}
            min={min}
            max={max}
            step={step}
            className={cn(
              styles.slider,
              dragging === "start" && styles.dragging
            )}
          />
          <input
            type="range"
            value={value[1]}
            onChange={handleEndChange}
            onMouseDown={() => setDragging("end")}
            onMouseUp={() => setDragging(null)}
            min={min}
            max={max}
            step={step}
            className={cn(styles.slider, dragging === "end" && styles.dragging)}
          />
        </div>
        {showValues && (
          <div className={styles.values}>
            <span className={styles.value}>{value[0]}</span>
            <span className={styles.separator}>-</span>
            <span className={styles.value}>{value[1]}</span>
          </div>
        )}
      </div>
    );
  }
);

ZRangeSlider.displayName = "ZRangeSlider";

export default ZRangeSlider;
