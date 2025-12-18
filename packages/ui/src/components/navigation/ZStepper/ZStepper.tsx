import { forwardRef, HTMLAttributes } from "react";
import { Check } from "lucide-react";
import { cn } from "@/utils/cn";
import styles from "./ZStepper.module.css";

export interface Step {
  /** Step label */
  label: string;
  /** Step description */
  description?: string;
  /** Optional icon */
  icon?: React.ReactNode;
}

export interface ZStepperProps extends HTMLAttributes<HTMLDivElement> {
  /** Steps */
  steps: Step[];
  /** Current step index */
  currentStep: number;
  /** Orientation */
  orientation?: "horizontal" | "vertical";
  /** Show connectors */
  showConnectors?: boolean;
}

export const ZStepper = forwardRef<HTMLDivElement, ZStepperProps>(
  (
    {
      steps,
      currentStep,
      orientation = "horizontal",
      showConnectors = true,
      className,
      ...props
    },
    ref
  ) => {
    const getStepStatus = (index: number) => {
      if (index < currentStep) return "completed";
      if (index === currentStep) return "current";
      return "upcoming";
    };

    return (
      <div
        ref={ref}
        className={cn(styles.stepper, styles[orientation], className)}
        {...props}
      >
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const isLast = index === steps.length - 1;

          return (
            <div key={index} className={styles.stepWrapper}>
              <div className={cn(styles.step, styles[status])}>
                <div className={styles.indicator}>
                  {status === "completed" ? (
                    <Check className={styles.checkIcon} />
                  ) : step.icon ? (
                    <span className={styles.customIcon}>{step.icon}</span>
                  ) : (
                    <span className={styles.number}>{index + 1}</span>
                  )}
                </div>
                <div className={styles.content}>
                  <div className={styles.label}>{step.label}</div>
                  {step.description && (
                    <div className={styles.description}>{step.description}</div>
                  )}
                </div>
              </div>
              {showConnectors && !isLast && (
                <div
                  className={cn(
                    styles.connector,
                    status === "completed" && styles.completed
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }
);

ZStepper.displayName = "ZStepper";

export default ZStepper;
