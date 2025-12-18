/**
 * ZForm - Form wrapper with validation and submission handling
 */

import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  FormEvent,
  ReactNode,
} from "react";
import styles from "./ZForm.module.css";

// Types
export type ValidationRule<T = unknown> = {
  validate: (value: T, formData: Record<string, unknown>) => boolean;
  message: string;
};

export type FieldConfig = {
  name: string;
  rules?: ValidationRule[];
  defaultValue?: unknown;
};

export type FormErrors = Record<string, string[]>;

export type FormState = {
  values: Record<string, unknown>;
  errors: FormErrors;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
};

export type ZFormContextValue = {
  state: FormState;
  setValue: (name: string, value: unknown) => void;
  setTouched: (name: string) => void;
  getFieldError: (name: string) => string | undefined;
  registerField: (config: FieldConfig) => void;
  unregisterField: (name: string) => void;
};

const ZFormContext = createContext<ZFormContextValue | null>(null);

export function useZForm() {
  const context = useContext(ZFormContext);
  if (!context) {
    throw new Error("useZForm must be used within a ZForm");
  }
  return context;
}

export type ZFormProps = {
  /** Form submission handler */
  onSubmit?: (values: Record<string, unknown>) => void | Promise<void>;
  /** Called when form values change */
  onChange?: (values: Record<string, unknown>) => void;
  /** Initial form values */
  defaultValues?: Record<string, unknown>;
  /** Validation mode */
  validateOn?: "change" | "blur" | "submit";
  /** Form children */
  children: ReactNode;
  /** Additional class name */
  className?: string;
  /** Disable all form fields */
  disabled?: boolean;
  /** ID for form element */
  id?: string;
};

export function ZForm({
  onSubmit,
  onChange,
  defaultValues = {},
  validateOn = "blur",
  children,
  className,
  disabled = false,
  id,
}: ZFormProps) {
  const [fields, setFields] = useState<Map<string, FieldConfig>>(new Map());
  const [state, setState] = useState<FormState>({
    values: defaultValues,
    errors: {},
    touched: {},
    isSubmitting: false,
    isValid: true,
  });

  const validateField = useCallback(
    (name: string, value: unknown): string[] => {
      const config = fields.get(name);
      if (!config?.rules) return [];

      const errors: string[] = [];
      for (const rule of config.rules) {
        if (!rule.validate(value, state.values)) {
          errors.push(rule.message);
        }
      }
      return errors;
    },
    [fields, state.values]
  );

  const validateAllFields = useCallback((): FormErrors => {
    const errors: FormErrors = {};
    let hasErrors = false;

    fields.forEach((config, name) => {
      const fieldErrors = validateField(name, state.values[name]);
      if (fieldErrors.length > 0) {
        errors[name] = fieldErrors;
        hasErrors = true;
      }
    });

    return errors;
  }, [fields, state.values, validateField]);

  const setValue = useCallback(
    (name: string, value: unknown) => {
      setState((prev) => {
        const newValues = { ...prev.values, [name]: value };
        const newErrors = { ...prev.errors };

        if (validateOn === "change") {
          const fieldErrors = validateField(name, value);
          if (fieldErrors.length > 0) {
            newErrors[name] = fieldErrors;
          } else {
            delete newErrors[name];
          }
        }

        onChange?.(newValues);

        return {
          ...prev,
          values: newValues,
          errors: newErrors,
          isValid: Object.keys(newErrors).length === 0,
        };
      });
    },
    [validateOn, validateField, onChange]
  );

  const setTouched = useCallback(
    (name: string) => {
      setState((prev) => {
        const newTouched = { ...prev.touched, [name]: true };
        const newErrors = { ...prev.errors };

        if (validateOn === "blur") {
          const fieldErrors = validateField(name, prev.values[name]);
          if (fieldErrors.length > 0) {
            newErrors[name] = fieldErrors;
          } else {
            delete newErrors[name];
          }
        }

        return {
          ...prev,
          touched: newTouched,
          errors: newErrors,
          isValid: Object.keys(newErrors).length === 0,
        };
      });
    },
    [validateOn, validateField]
  );

  const getFieldError = useCallback(
    (name: string): string | undefined => {
      const errors = state.errors[name];
      return errors?.[0];
    },
    [state.errors]
  );

  const registerField = useCallback((config: FieldConfig) => {
    setFields((prev) => {
      const next = new Map(prev);
      next.set(config.name, config);
      return next;
    });

    if (config.defaultValue !== undefined) {
      setState((prev) => ({
        ...prev,
        values: { ...prev.values, [config.name]: config.defaultValue },
      }));
    }
  }, []);

  const unregisterField = useCallback((name: string) => {
    setFields((prev) => {
      const next = new Map(prev);
      next.delete(name);
      return next;
    });
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (disabled) return;

    // Mark all fields as touched
    const allTouched: Record<string, boolean> = {};
    fields.forEach((_, name) => {
      allTouched[name] = true;
    });

    // Validate all fields
    const errors = validateAllFields();
    const isValid = Object.keys(errors).length === 0;

    setState((prev) => ({
      ...prev,
      touched: allTouched,
      errors,
      isValid,
      isSubmitting: isValid,
    }));

    if (!isValid) return;

    try {
      await onSubmit?.(state.values);
    } finally {
      setState((prev) => ({
        ...prev,
        isSubmitting: false,
      }));
    }
  };

  const contextValue: ZFormContextValue = {
    state,
    setValue,
    setTouched,
    getFieldError,
    registerField,
    unregisterField,
  };

  return (
    <ZFormContext.Provider value={contextValue}>
      <form
        id={id}
        className={`${styles.form} ${disabled ? styles.disabled : ""} ${
          className || ""
        }`}
        onSubmit={handleSubmit}
        noValidate
      >
        <fieldset disabled={disabled} className={styles.fieldset}>
          {children}
        </fieldset>
      </form>
    </ZFormContext.Provider>
  );
}

// Common validation rules
export const FormValidation = {
  required: (message = "This field is required"): ValidationRule => ({
    validate: (value) => value !== undefined && value !== null && value !== "",
    message,
  }),

  minLength: (min: number, message?: string): ValidationRule<string> => ({
    validate: (value) => typeof value === "string" && value.length >= min,
    message: message || `Must be at least ${min} characters`,
  }),

  maxLength: (max: number, message?: string): ValidationRule<string> => ({
    validate: (value) => typeof value === "string" && value.length <= max,
    message: message || `Must be at most ${max} characters`,
  }),

  email: (message = "Invalid email address"): ValidationRule<string> => ({
    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || ""),
    message,
  }),

  pattern: (regex: RegExp, message: string): ValidationRule<string> => ({
    validate: (value) => regex.test(value || ""),
    message,
  }),

  min: (min: number, message?: string): ValidationRule<number> => ({
    validate: (value) => typeof value === "number" && value >= min,
    message: message || `Must be at least ${min}`,
  }),

  max: (max: number, message?: string): ValidationRule<number> => ({
    validate: (value) => typeof value === "number" && value <= max,
    message: message || `Must be at most ${max}`,
  }),

  custom: <T,>(
    validate: (value: T, formData: Record<string, unknown>) => boolean,
    message: string
  ): ValidationRule<T> => ({
    validate,
    message,
  }),
};

export default ZForm;
