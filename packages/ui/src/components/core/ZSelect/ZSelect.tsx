import {
  HTMLAttributes,
  forwardRef,
  useState,
  useRef,
  useEffect,
  ReactNode,
  KeyboardEvent,
} from "react";
import { cn } from "@/utils/cn";
import styles from "./ZSelect.module.css";

export type ZSelectSize = "sm" | "md" | "lg";
export type ZSelectVariant = "default" | "ghost" | "glass";

export interface ZSelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  disabled?: boolean;
  group?: string;
}

export interface ZSelectProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Options list */
  options: ZSelectOption[];
  /** Selected value(s) */
  value?: string | string[];
  /** Default value(s) */
  defaultValue?: string | string[];
  /** Change handler */
  onChange?: (value: string | string[]) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Size variant */
  size?: ZSelectSize;
  /** Visual variant */
  variant?: ZSelectVariant;
  /** Multiple selection */
  multiple?: boolean;
  /** Searchable */
  searchable?: boolean;
  /** Clearable */
  clearable?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Error state */
  error?: boolean;
  /** Error message */
  errorMessage?: string;
  /** Max height of dropdown */
  maxHeight?: number;
  /** Label text */
  label?: string;
  /** Full width */
  fullWidth?: boolean;
}

/**
 * ZSelect - Select dropdown component for Zurto UI
 */
export const ZSelect = forwardRef<HTMLDivElement, ZSelectProps>(
  (
    {
      options,
      value: valueProp,
      defaultValue,
      onChange,
      placeholder = "Select...",
      size = "md",
      variant = "default",
      multiple = false,
      searchable = false,
      clearable = false,
      disabled = false,
      error = false,
      errorMessage,
      maxHeight = 280,
      label,
      fullWidth = false,
      className,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [internalValue, setInternalValue] = useState<string | string[]>(
      defaultValue ?? (multiple ? [] : "")
    );
    const [focusedIndex, setFocusedIndex] = useState(-1);

    const wrapperRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    const value = valueProp !== undefined ? valueProp : internalValue;

    // Filter options based on search
    const filteredOptions = options.filter((opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase())
    );

    // Group options
    const groupedOptions = filteredOptions.reduce((acc, opt) => {
      const group = opt.group || "";
      if (!acc[group]) acc[group] = [];
      acc[group].push(opt);
      return acc;
    }, {} as Record<string, ZSelectOption[]>);

    // Get selected labels
    const selectedLabels = Array.isArray(value)
      ? options.filter((o) => value.includes(o.value)).map((o) => o.label)
      : options.find((o) => o.value === value)?.label;

    const handleSelect = (optValue: string) => {
      let newValue: string | string[];

      if (multiple) {
        const arr = Array.isArray(value) ? value : [];
        newValue = arr.includes(optValue)
          ? arr.filter((v) => v !== optValue)
          : [...arr, optValue];
      } else {
        newValue = optValue;
        setIsOpen(false);
      }

      if (valueProp === undefined) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      const newValue = multiple ? [] : "";
      if (valueProp === undefined) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled) return;

      switch (e.key) {
        case "Enter":
        case " ":
          if (!isOpen) {
            setIsOpen(true);
          } else if (focusedIndex >= 0 && filteredOptions[focusedIndex]) {
            handleSelect(filteredOptions[focusedIndex].value);
          }
          e.preventDefault();
          break;
        case "ArrowDown":
          if (!isOpen) {
            setIsOpen(true);
          } else {
            setFocusedIndex((i) => Math.min(i + 1, filteredOptions.length - 1));
          }
          e.preventDefault();
          break;
        case "ArrowUp":
          if (isOpen) {
            setFocusedIndex((i) => Math.max(i - 1, 0));
          }
          e.preventDefault();
          break;
        case "Escape":
          setIsOpen(false);
          e.preventDefault();
          break;
      }
    };

    // Close on outside click
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          wrapperRef.current &&
          !wrapperRef.current.contains(e.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Focus search when opened
    useEffect(() => {
      if (isOpen && searchable && searchRef.current) {
        searchRef.current.focus();
      }
    }, [isOpen, searchable]);

    // Reset focus index when search changes
    useEffect(() => {
      setFocusedIndex(0);
    }, [search]);

    const hasValue = multiple ? (value as string[]).length > 0 : Boolean(value);

    return (
      <div
        ref={ref}
        className={cn(styles.wrapper, fullWidth && styles.fullWidth, className)}
        {...props}
      >
        {label && <label className={styles.label}>{label}</label>}

        <div
          ref={wrapperRef}
          className={cn(
            styles.select,
            styles[size],
            styles[variant],
            isOpen && styles.open,
            disabled && styles.disabled,
            error && styles.error
          )}
        >
          <button
            type="button"
            className={styles.trigger}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
          >
            <span className={cn(styles.value, !hasValue && styles.placeholder)}>
              {hasValue
                ? Array.isArray(selectedLabels)
                  ? selectedLabels.join(", ")
                  : selectedLabels
                : placeholder}
            </span>

            <span className={styles.icons}>
              {clearable && hasValue && (
                <span className={styles.clearBtn} onClick={handleClear}>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </span>
              )}
              <svg
                className={cn(styles.chevron, isOpen && styles.chevronOpen)}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </span>
          </button>

          {isOpen && (
            <div className={styles.dropdown} style={{ maxHeight }}>
              {searchable && (
                <div className={styles.searchWrapper}>
                  <input
                    ref={searchRef}
                    type="text"
                    className={styles.search}
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}

              <ul
                ref={listRef}
                className={styles.list}
                role="listbox"
                aria-multiselectable={multiple}
              >
                {Object.entries(groupedOptions).map(([group, opts]) => (
                  <li key={group || "default"}>
                    {group && <div className={styles.groupLabel}>{group}</div>}
                    <ul>
                      {opts.map((opt, i) => {
                        const isSelected = Array.isArray(value)
                          ? value.includes(opt.value)
                          : value === opt.value;
                        const flatIndex = filteredOptions.indexOf(opt);

                        return (
                          <li
                            key={opt.value}
                            className={cn(
                              styles.option,
                              isSelected && styles.selected,
                              opt.disabled && styles.optionDisabled,
                              flatIndex === focusedIndex && styles.focused
                            )}
                            role="option"
                            aria-selected={isSelected}
                            onClick={() =>
                              !opt.disabled && handleSelect(opt.value)
                            }
                          >
                            {opt.icon && (
                              <span className={styles.optionIcon}>
                                {opt.icon}
                              </span>
                            )}
                            <span className={styles.optionContent}>
                              <span className={styles.optionLabel}>
                                {opt.label}
                              </span>
                              {opt.description && (
                                <span className={styles.optionDesc}>
                                  {opt.description}
                                </span>
                              )}
                            </span>
                            {isSelected && multiple && (
                              <svg
                                className={styles.check}
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M20 6L9 17l-5-5" />
                              </svg>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                ))}

                {filteredOptions.length === 0 && (
                  <li className={styles.empty}>No options found</li>
                )}
              </ul>
            </div>
          )}
        </div>

        {errorMessage && (
          <span className={styles.errorText}>{errorMessage}</span>
        )}
      </div>
    );
  }
);

ZSelect.displayName = "ZSelect";

export default ZSelect;
