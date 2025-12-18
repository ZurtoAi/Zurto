import {
  forwardRef,
  useState,
  useRef,
  useCallback,
  KeyboardEvent,
} from "react";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";
import styles from "./ZTagInput.module.css";

export interface ZTagInputProps {
  /** Current tags */
  tags?: string[];
  /** Tag change handler */
  onChange?: (tags: string[]) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Max tags allowed */
  maxTags?: number;
  /** Allow duplicates */
  allowDuplicates?: boolean;
  /** Tag validation function */
  validate?: (tag: string) => boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Error state */
  error?: boolean;
  /** Custom className */
  className?: string;
}

export const ZTagInput = forwardRef<HTMLInputElement, ZTagInputProps>(
  (
    {
      tags = [],
      onChange,
      placeholder = "Type and press Enter",
      maxTags,
      allowDuplicates = false,
      validate,
      disabled = false,
      error = false,
      className,
    },
    ref
  ) => {
    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const addTag = useCallback(
      (tag: string) => {
        const trimmed = tag.trim();
        if (!trimmed) return;

        // Check max tags
        if (maxTags && tags.length >= maxTags) return;

        // Check duplicates
        if (!allowDuplicates && tags.includes(trimmed)) return;

        // Validate
        if (validate && !validate(trimmed)) return;

        onChange?.([...tags, trimmed]);
        setInputValue("");
      },
      [tags, maxTags, allowDuplicates, validate, onChange]
    );

    const removeTag = useCallback(
      (index: number) => {
        const updated = tags.filter((_, i) => i !== index);
        onChange?.(updated);
      },
      [tags, onChange]
    );

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addTag(inputValue);
      } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
        removeTag(tags.length - 1);
      }
    };

    const handleContainerClick = () => {
      inputRef.current?.focus();
    };

    return (
      <div
        className={cn(
          styles.container,
          error && styles.error,
          disabled && styles.disabled,
          className
        )}
        onClick={handleContainerClick}
      >
        <div className={styles.tags}>
          {tags.map((tag, index) => (
            <span key={index} className={styles.tag}>
              {tag}
              {!disabled && (
                <button
                  onClick={() => removeTag(index)}
                  className={styles.removeButton}
                  type="button"
                  aria-label={`Remove ${tag}`}
                >
                  <X />
                </button>
              )}
            </span>
          ))}
          <input
            ref={ref || inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? placeholder : ""}
            disabled={
              disabled || (maxTags !== undefined && tags.length >= maxTags)
            }
            className={styles.input}
          />
        </div>
      </div>
    );
  }
);

ZTagInput.displayName = "ZTagInput";

export default ZTagInput;
