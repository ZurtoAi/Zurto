import { forwardRef, HTMLAttributes } from "react";
import { Check } from "lucide-react";
import { cn } from "@/utils/cn";
import styles from "./ZSteps.module.css";

export type ZStepsOrientation = "horizontal" | "vertical";
export type ZStepsVariant = "default" | "simple" | "arrows";

export interface Step {
  /** Step label */
  label: string;
  /** Step description */
  description?: string;
  /** Step icon */
  icon?: React.ReactNode;
}

export interface ZStepsProps extends HTMLAttributes<HTMLDivElement> {
  /** Steps orientation */
  orientation?: ZStepsOrientation;
  /** Steps variant */
  variant?: ZStepsVariant;
  /** Current active step (0-indexed) */
  current: number;
  /** Steps data */
  steps: Step[];
  /** Allow clicking completed steps */
  clickable?: boolean;
  /** Step click handler */
  onChange?: (step: number) => void;
}

export const ZSteps = forwardRef<HTMLDivElement, ZStepsProps>(
  (
    {
      orientation = "horizontal",
      variant = "default",
      current,
      steps,
      clickable = false,
      onChange,
      className,
      ...props
    },
    ref
  ) => {
    const handleStepClick = (index: number) => {
      if (clickable && index < current && onChange) {
        onChange(index);
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          styles.steps,
          styles[orientation],
          styles[variant],
          className
        )}
        {...props}
      >
        {steps.map((step, index) => {
          const isActive = index === current;
          const isCompleted = index < current;
          const isClickable = clickable && isCompleted;

          return (
            <div
              key={index}
              className={cn(
                styles.step,
                isActive && styles.active,
                isCompleted && styles.completed,
                isClickable && styles.clickable
              )}
              onClick={() => handleStepClick(index)}
            >
              <div className={styles.indicator}>
                <div className={styles.circle}>
                  {isCompleted ? (
                    <Check className={styles.checkIcon} />
                  ) : step.icon ? (
                    step.icon
                  ) : (
                    <span className={styles.number}>{index + 1}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={styles.connector} />
                )}
              </div>

              <div className={styles.content}>
                <div className={styles.label}>{step.label}</div>
                {step.description && (
                  <div className={styles.description}>{step.description}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
);

ZSteps.displayName = "ZSteps";

export default ZSteps;
