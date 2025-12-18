import { forwardRef, InputHTMLAttributes, useState, ChangeEvent } from "react";
import { cn } from "@/utils/cn";
import { Search, X } from "lucide-react";
import styles from "./ZSearchInput.module.css";

export interface ZSearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  /** On search */
  onSearch?: (value: string) => void;
  /** On clear */
  onClear?: () => void;
  /** Show clear button */
  showClear?: boolean;
}

export const ZSearchInput = forwardRef<HTMLInputElement, ZSearchInputProps>(
  (
    { onSearch, onClear, showClear = true, className, value, ...props },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState("");
    const displayValue = value !== undefined ? value : internalValue;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      if (value === undefined) {
        setInternalValue(newValue);
      }
      onSearch?.(newValue);
    };

    const handleClear = () => {
      if (value === undefined) {
        setInternalValue("");
      }
      onClear?.();
      onSearch?.("");
    };

    return (
      <div className={cn(styles.container, className)}>
        <Search className={styles.searchIcon} size={18} />
        <input
          ref={ref}
          type="text"
          className={styles.input}
          value={displayValue}
          onChange={handleChange}
          {...props}
        />
        {showClear && displayValue && (
          <button
            type="button"
            className={styles.clearBtn}
            onClick={handleClear}
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>
    );
  }
);

ZSearchInput.displayName = "ZSearchInput";

export default ZSearchInput;
