/**
 * ZInlineEdit - Inline editable text field
 */

import React, {
  useState,
  useRef,
  useEffect,
  KeyboardEvent,
  FocusEvent,
} from "react";
import styles from "./ZInlineEdit.module.css";

export type ZInlineEditProps = {
  /** Current value */
  value: string;
  /** Called when value changes */
  onChange: (value: string) => void;
  /** Placeholder when empty */
  placeholder?: string;
  /** Disable editing */
  disabled?: boolean;
  /** Input type */
  type?: "text" | "number" | "email" | "url";
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Show edit icon on hover */
  showEditIcon?: boolean;
  /** Validate before saving */
  validate?: (value: string) => string | undefined;
  /** Called when edit mode starts */
  onEditStart?: () => void;
  /** Called when edit mode ends */
  onEditEnd?: () => void;
  /** Additional class name */
  className?: string;
  /** aria-label for accessibility */
  "aria-label"?: string;
};

export function ZInlineEdit({
  value,
  onChange,
  placeholder = "Click to edit",
  disabled = false,
  type = "text",
  size = "md",
  showEditIcon = true,
  validate,
  onEditStart,
  onEditEnd,
  className,
  "aria-label": ariaLabel,
}: ZInlineEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [error, setError] = useState<string | undefined>();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const startEditing = () => {
    if (disabled) return;
    setIsEditing(true);
    setEditValue(value);
    setError(undefined);
    onEditStart?.();
  };

  const saveEdit = () => {
    if (validate) {
      const validationError = validate(editValue);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    if (editValue !== value) {
      onChange(editValue);
    }
    setIsEditing(false);
    setError(undefined);
    onEditEnd?.();
  };

  const cancelEdit = () => {
    setEditValue(value);
    setIsEditing(false);
    setError(undefined);
    onEditEnd?.();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveEdit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancelEdit();
    }
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    // Check if focus is moving to a related element
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (relatedTarget?.closest(`.${styles.container}`)) {
      return;
    }
    saveEdit();
  };

  if (isEditing) {
    return (
      <div className={`${styles.container} ${styles[size]} ${className || ""}`}>
        <input
          ref={inputRef}
          type={type}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className={`${styles.input} ${error ? styles.hasError : ""}`}
          aria-label={ariaLabel}
          aria-invalid={!!error}
        />
        {error && (
          <span className={styles.error} role="alert">
            {error}
          </span>
        )}
        <div className={styles.actions}>
          <button
            type="button"
            onClick={saveEdit}
            className={styles.saveButton}
            aria-label="Save"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>
          <button
            type="button"
            onClick={cancelEdit}
            className={styles.cancelButton}
            aria-label="Cancel"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={startEditing}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          startEditing();
        }
      }}
      disabled={disabled}
      className={`${styles.display} ${styles[size]} ${
        !value ? styles.placeholder : ""
      } ${disabled ? styles.disabled : ""} ${className || ""}`}
      aria-label={ariaLabel || (value ? `Edit: ${value}` : placeholder)}
    >
      <span className={styles.text}>{value || placeholder}</span>
      {showEditIcon && !disabled && (
        <span className={styles.editIcon} aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </span>
      )}
    </button>
  );
}

export default ZInlineEdit;
