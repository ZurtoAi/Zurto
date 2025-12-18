import { forwardRef, InputHTMLAttributes, useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/utils/cn";
import styles from "./ZSearchBar.module.css";

export type ZSearchBarSize = "sm" | "md" | "lg";

export interface Suggestion {
  /** Suggestion ID */
  id: string;
  /** Display text */
  text: string;
  /** Optional description */
  description?: string;
}

export interface ZSearchBarProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Size */
  size?: ZSearchBarSize;
  /** Placeholder text */
  placeholder?: string;
  /** Show search icon */
  showIcon?: boolean;
  /** Show clear button */
  showClear?: boolean;
  /** Suggestions */
  suggestions?: Suggestion[];
  /** Search callback */
  onSearch?: (query: string) => void;
  /** Clear callback */
  onClear?: () => void;
  /** Suggestion select callback */
  onSelectSuggestion?: (suggestion: Suggestion) => void;
}

export const ZSearchBar = forwardRef<HTMLInputElement, ZSearchBarProps>(
  (
    {
      size = "md",
      placeholder = "Search...",
      showIcon = true,
      showClear = true,
      suggestions = [],
      onSearch,
      onClear,
      onSelectSuggestion,
      className,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!showSuggestions || suggestions.length === 0) {
        if (e.key === "Enter") {
          onSearch?.(e.currentTarget.value);
        }
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (selectedIndex >= 0) {
          onSelectSuggestion?.(suggestions[selectedIndex]);
          setShowSuggestions(false);
        } else {
          onSearch?.(e.currentTarget.value);
        }
      } else if (e.key === "Escape") {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    const handleClear = () => {
      onClear?.();
      setShowSuggestions(false);
    };

    return (
      <div className={cn(styles.container, styles[size], className)}>
        <div className={styles.inputWrapper}>
          {showIcon && <Search className={styles.searchIcon} />}
          <input
            ref={ref}
            type="text"
            className={styles.input}
            placeholder={placeholder}
            value={value}
            onChange={(e) => {
              onChange?.(e);
              setShowSuggestions(
                suggestions.length > 0 && e.target.value.length > 0
              );
              setSelectedIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() =>
              suggestions.length > 0 && value && setShowSuggestions(true)
            }
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            {...props}
          />
          {showClear && value && (
            <button
              type="button"
              onClick={handleClear}
              className={styles.clearButton}
              aria-label="Clear search"
            >
              <X />
            </button>
          )}
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div className={styles.suggestions}>
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion.id}
                onClick={() => {
                  onSelectSuggestion?.(suggestion);
                  setShowSuggestions(false);
                }}
                className={cn(
                  styles.suggestion,
                  index === selectedIndex && styles.selected
                )}
              >
                <div className={styles.suggestionText}>{suggestion.text}</div>
                {suggestion.description && (
                  <div className={styles.suggestionDesc}>
                    {suggestion.description}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
);

ZSearchBar.displayName = "ZSearchBar";

export default ZSearchBar;
