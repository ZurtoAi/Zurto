import { forwardRef, HTMLAttributes } from "react";
import { Check } from "lucide-react";
import { cn } from "@/utils/cn";
import styles from "./ZCheckoutSteps.module.css";

export interface CheckoutStep {
  /** Step ID */
  id: string;
  /** Step label */
  label: string;
  /** Description */
  description?: string;
}

export interface ZCheckoutStepsProps extends HTMLAttributes<HTMLDivElement> {
  /** Steps */
  steps: CheckoutStep[];
  /** Current step index */
  currentStep: number;
  /** On step click */
  onStepClick?: (index: number) => void;
  /** Allow clicking completed steps */
  allowStepClick?: boolean;
}

export const ZCheckoutSteps = forwardRef<HTMLDivElement, ZCheckoutStepsProps>(
  (
    {
      steps,
      currentStep,
      onStepClick,
      allowStepClick = false,
      className,
      ...props
    },
    ref
  ) => {
    const handleStepClick = (index: number) => {
      if (allowStepClick && index < currentStep) {
        onStepClick?.(index);
      }
    };

    return (
      <div ref={ref} className={cn(styles.steps, className)} {...props}>
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isClickable = allowStepClick && isCompleted;

          return (
            <div
              key={step.id}
              className={cn(
                styles.step,
                isActive && styles.active,
                isCompleted && styles.completed,
                isClickable && styles.clickable
              )}
              onClick={() => handleStepClick(index)}
            >
              <div className={styles.stepNumber}>
                {isCompleted ? <Check /> : index + 1}
              </div>
              <div className={styles.stepContent}>
                <div className={styles.stepLabel}>{step.label}</div>
                {step.description && (
                  <div className={styles.stepDescription}>
                    {step.description}
                  </div>
                )}
              </div>
              {index < steps.length - 1 && <div className={styles.connector} />}
            </div>
          );
        })}
      </div>
    );
  }
);

ZCheckoutSteps.displayName = "ZCheckoutSteps";

export default ZCheckoutSteps;
