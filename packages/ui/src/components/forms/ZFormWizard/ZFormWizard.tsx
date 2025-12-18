import { forwardRef, useState, HTMLAttributes, ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/utils/cn";
import { ZButton } from "../../core/ZButton";
import styles from "./ZFormWizard.module.css";

export interface WizardStep {
  /** Step ID */
  id: string;
  /** Step title */
  title: string;
  /** Step description */
  description?: string;
  /** Step content */
  content: ReactNode;
  /** Validation function */
  validate?: () => boolean | Promise<boolean>;
}

export interface ZFormWizardProps extends HTMLAttributes<HTMLDivElement> {
  /** Wizard steps */
  steps: WizardStep[];
  /** Current step index */
  currentStep?: number;
  /** Show step numbers */
  showNumbers?: boolean;
  /** Submit callback */
  onSubmit?: () => void;
  /** Step change callback */
  onStepChange?: (stepIndex: number) => void;
}

export const ZFormWizard = forwardRef<HTMLDivElement, ZFormWizardProps>(
  (
    {
      steps,
      currentStep = 0,
      showNumbers = true,
      onSubmit,
      onStepChange,
      className,
      ...props
    },
    ref
  ) => {
    const [activeStep, setActiveStep] = useState(currentStep);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);

    const handleNext = async () => {
      const currentStepData = steps[activeStep];

      if (currentStepData.validate) {
        const isValid = await currentStepData.validate();
        if (!isValid) return;
      }

      if (!completedSteps.includes(activeStep)) {
        setCompletedSteps([...completedSteps, activeStep]);
      }

      if (activeStep < steps.length - 1) {
        const nextStep = activeStep + 1;
        setActiveStep(nextStep);
        onStepChange?.(nextStep);
      } else {
        onSubmit?.();
      }
    };

    const handlePrev = () => {
      if (activeStep > 0) {
        const prevStep = activeStep - 1;
        setActiveStep(prevStep);
        onStepChange?.(prevStep);
      }
    };

    const handleStepClick = (index: number) => {
      if (index <= activeStep || completedSteps.includes(index - 1)) {
        setActiveStep(index);
        onStepChange?.(index);
      }
    };

    const isLastStep = activeStep === steps.length - 1;

    return (
      <div ref={ref} className={cn(styles.wizard, className)} {...props}>
        <div className={styles.steps}>
          {steps.map((step, index) => {
            const isActive = index === activeStep;
            const isCompleted = completedSteps.includes(index);
            const isClickable =
              index <= activeStep || completedSteps.includes(index - 1);

            return (
              <button
                key={step.id}
                onClick={() => handleStepClick(index)}
                disabled={!isClickable}
                className={cn(
                  styles.step,
                  isActive && styles.active,
                  isCompleted && styles.completed,
                  !isClickable && styles.disabled
                )}
              >
                <div className={styles.stepIndicator}>
                  {isCompleted ? (
                    <Check className={styles.checkIcon} />
                  ) : showNumbers ? (
                    <span>{index + 1}</span>
                  ) : (
                    <span />
                  )}
                </div>
                <div className={styles.stepContent}>
                  <div className={styles.stepTitle}>{step.title}</div>
                  {step.description && (
                    <div className={styles.stepDesc}>{step.description}</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className={styles.content}>{steps[activeStep].content}</div>

        <div className={styles.actions}>
          <ZButton
            variant="outline"
            onClick={handlePrev}
            disabled={activeStep === 0}
          >
            Previous
          </ZButton>
          <ZButton onClick={handleNext}>
            {isLastStep ? "Submit" : "Next"}
          </ZButton>
        </div>
      </div>
    );
  }
);

ZFormWizard.displayName = "ZFormWizard";

export default ZFormWizard;
