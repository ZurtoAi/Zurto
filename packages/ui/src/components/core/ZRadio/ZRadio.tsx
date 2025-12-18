import {
  InputHTMLAttributes,
  forwardRef,
  ReactNode,
  createContext,
  useContext,
} from "react";
import { cn } from "@/utils/cn";
import styles from "./ZRadio.module.css";

export type ZRadioSize = "sm" | "md" | "lg";

/* Radio Group Context */
interface RadioGroupContextValue {
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  size?: ZRadioSize;
  disabled?: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue>({});

/* Radio Group */
export interface ZRadioGroupProps {
  /** Group name */
  name?: string;
  /** Selected value */
  value?: string;
  /** Default value */
  defaultValue?: string;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Size for all radios */
  size?: ZRadioSize;
  /** Disable all radios */
  disabled?: boolean;
  /** Orientation */
  orientation?: "horizontal" | "vertical";
  /** Label */
  label?: string;
  /** Children radios */
  children: ReactNode;
  /** Additional class */
  className?: string;
}

export const ZRadioGroup = ({
  name,
  value,
  defaultValue,
  onChange,
  size = "md",
  disabled = false,
  orientation = "vertical",
  label,
  children,
  className,
}: ZRadioGroupProps) => {
  return (
    <RadioGroupContext.Provider
      value={{ name, value, onChange, size, disabled }}
    >
      <div
        className={cn(styles.group, styles[orientation], className)}
        role="radiogroup"
        aria-label={label}
      >
        {label && <span className={styles.groupLabel}>{label}</span>}
        <div className={cn(styles.groupItems, styles[orientation])}>
          {children}
        </div>
      </div>
    </RadioGroupContext.Provider>
  );
};

/* Radio */
export interface ZRadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  /** Radio size */
  size?: ZRadioSize;
  /** Label text */
  label?: ReactNode;
  /** Description text */
  description?: string;
  /** Error state */
  error?: boolean;
}

export const ZRadio = forwardRef<HTMLInputElement, ZRadioProps>(
  (
    {
      size: sizeProp,
      label,
      description,
      error = false,
      disabled: disabledProp,
      className,
      id,
      name: nameProp,
      value,
      onChange: onChangeProp,
      ...props
    },
    ref
  ) => {
    const group = useContext(RadioGroupContext);

    const name = nameProp ?? group.name;
    const size = sizeProp ?? group.size ?? "md";
    const disabled = disabledProp ?? group.disabled;
    const checked =
      group.value !== undefined ? group.value === value : undefined;

    const inputId = id || `z-radio-${Math.random().toString(36).substring(7)}`;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChangeProp?.(e);
      if (value && group.onChange) {
        group.onChange(value as string);
      }
    };

    return (
      <label
        className={cn(
          styles.wrapper,
          styles[size],
          disabled && styles.disabled,
          error && styles.error,
          className
        )}
        htmlFor={inputId}
      >
        <span className={styles.radioWrapper}>
          <input
            ref={ref}
            type="radio"
            id={inputId}
            name={name}
            value={value}
            checked={checked}
            disabled={disabled}
            onChange={handleChange}
            className={styles.input}
            {...props}
          />
          <span className={styles.radio}>
            <span className={styles.dot} />
          </span>
        </span>

        {(label || description) && (
          <span className={styles.content}>
            {label && <span className={styles.label}>{label}</span>}
            {description && (
              <span className={styles.description}>{description}</span>
            )}
          </span>
        )}
      </label>
    );
  }
);

ZRadio.displayName = "ZRadio";
ZRadioGroup.displayName = "ZRadioGroup";

export default ZRadio;
