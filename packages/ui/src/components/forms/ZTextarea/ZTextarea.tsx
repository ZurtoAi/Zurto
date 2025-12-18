import {
  TextareaHTMLAttributes,
  forwardRef,
  useState,
  useEffect,
  useRef,
} from "react";
import { cn } from "@/utils/cn";
import styles from "./ZTextarea.module.css";

export type ZTextareaSize = "sm" | "md" | "lg";

export interface ZTextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Textarea size */
  size?: ZTextareaSize;
  /** Error state */
  error?: boolean;
  /** Success state */
  success?: boolean;
  /** Helper text below textarea */
  helperText?: string;
  /** Label text */
  label?: string;
  /** Show character count */
  showCount?: boolean;
  /** Auto-resize to content */
  autoResize?: boolean;
  /** Min rows when auto-resize */
  minRows?: number;
  /** Max rows when auto-resize */
  maxRows?: number;
}

/**
 * ZTextarea - Multi-line text input
 *
 * @example
 * <ZTextarea label="Description" placeholder="Enter description..." />
 * <ZTextarea autoResize maxLength={500} showCount />
 */
export const ZTextarea = forwardRef<HTMLTextAreaElement, ZTextareaProps>(
  (
    {
      size = "md",
      error = false,
      success = false,
      helperText,
      label,
      showCount = false,
      autoResize = false,
      minRows = 3,
      maxRows = 10,
      disabled,
      className,
      maxLength,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [charCount, setCharCount] = useState(0);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
      if (value !== undefined) {
        setCharCount(String(value).length);
      }
    }, [value]);

    useEffect(() => {
      if (autoResize && textareaRef.current) {
        const textarea = textareaRef.current;
        textarea.style.height = "auto";
        const scrollHeight = textarea.scrollHeight;

        const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
        const minHeight = lineHeight * minRows;
        const maxHeight = lineHeight * maxRows;

        const newHeight = Math.min(
          Math.max(scrollHeight, minHeight),
          maxHeight
        );
        textarea.style.height = `${newHeight}px`;
      }
    }, [value, autoResize, minRows, maxRows]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      onChange?.(e);
    };

    return (
      <div className={cn(styles.wrapper, className)}>
        {label && (
          <label className={styles.label}>
            {label}
            {props.required && <span className={styles.required}>*</span>}
          </label>
        )}

        <textarea
          ref={(node) => {
            textareaRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
          }}
          className={cn(
            styles.textarea,
            styles[size],
            error && styles.error,
            success && styles.success,
            disabled && styles.disabled
          )}
          disabled={disabled}
          maxLength={maxLength}
          value={value}
          onChange={handleChange}
          rows={autoResize ? minRows : undefined}
          {...props}
        />

        {(helperText || showCount) && (
          <div className={styles.footer}>
            {helperText && (
              <span
                className={cn(styles.helperText, error && styles.errorText)}
              >
                {helperText}
              </span>
            )}
            {showCount && (
              <span className={styles.count}>
                {charCount}
                {maxLength && ` / ${maxLength}`}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);

ZTextarea.displayName = "ZTextarea";

export default ZTextarea;
