/**
 * ZFieldGroup - Group form fields with label, description, and error display
 */

import React, { ReactNode, useId } from "react";
import styles from "./ZFieldGroup.module.css";

export type ZFieldGroupProps = {
  /** Label for the field group */
  label?: string;
  /** Description/helper text */
  description?: string;
  /** Error message to display */
  error?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Children (form control) */
  children: ReactNode;
  /** Additional class name */
  className?: string;
  /** Horizontal layout */
  horizontal?: boolean;
  /** Field ID for label association */
  htmlFor?: string;
};

export function ZFieldGroup({
  label,
  description,
  error,
  required = false,
  disabled = false,
  children,
  className,
  horizontal = false,
  htmlFor,
}: ZFieldGroupProps) {
  const generatedId = useId();
  const fieldId = htmlFor || generatedId;
  const descriptionId = `${fieldId}-description`;
  const errorId = `${fieldId}-error`;

  return (
    <div
      className={`${styles.fieldGroup} ${horizontal ? styles.horizontal : ""} ${
        disabled ? styles.disabled : ""
      } ${error ? styles.hasError : ""} ${className || ""}`}
    >
      {label && (
        <label htmlFor={fieldId} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}

      <div className={styles.control}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(
              child as React.ReactElement<Record<string, unknown>>,
              {
                id: fieldId,
                "aria-describedby": description
                  ? descriptionId
                  : error
                  ? errorId
                  : undefined,
                "aria-invalid": error ? true : undefined,
                disabled:
                  disabled || (child.props as Record<string, unknown>).disabled,
              }
            );
          }
          return child;
        })}

        {description && !error && (
          <p id={descriptionId} className={styles.description}>
            {description}
          </p>
        )}

        {error && (
          <p id={errorId} className={styles.error} role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export default ZFieldGroup;
