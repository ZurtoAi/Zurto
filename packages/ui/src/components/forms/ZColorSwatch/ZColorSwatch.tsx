import { forwardRef, HTMLAttributes } from "react";
import { Check } from "lucide-react";
import { cn } from "@/utils/cn";
import styles from "./ZColorSwatch.module.css";

export interface ZColorSwatchProps
  extends Omit<HTMLAttributes<HTMLButtonElement>, "onChange"> {
  /** Color value */
  color: string;
  /** Is selected */
  selected?: boolean;
  /** On select */
  onChange?: (color: string) => void;
  /** Size */
  size?: "sm" | "md" | "lg";
  /** Disabled */
  disabled?: boolean;
}

export const ZColorSwatch = forwardRef<HTMLButtonElement, ZColorSwatchProps>(
  (
    {
      color,
      selected = false,
      onChange,
      size = "md",
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    const handleClick = () => {
      if (!disabled) {
        onChange?.(color);
      }
    };

    return (
      <button
        ref={ref}
        onClick={handleClick}
        disabled={disabled}
        className={cn(
          styles.swatch,
          styles[size],
          selected && styles.selected,
          disabled && styles.disabled,
          className
        )}
        style={{ background: color }}
        aria-label={`Select color ${color}`}
        {...props}
      >
        {selected && <Check className={styles.checkIcon} />}
      </button>
    );
  }
);

ZColorSwatch.displayName = "ZColorSwatch";

export default ZColorSwatch;
