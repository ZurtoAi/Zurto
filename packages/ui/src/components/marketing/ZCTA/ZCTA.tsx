import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZCTA.module.css";
import { ZButton } from "../../core/ZButton";

export type ZCTAVariant = "default" | "banner" | "card";
export type ZCTASize = "sm" | "md" | "lg";

export interface ZCTAProps extends HTMLAttributes<HTMLDivElement> {
  /** CTA variant */
  variant?: ZCTAVariant;
  /** CTA size */
  size?: ZCTASize;
  /** Main heading */
  title: string;
  /** Description */
  description?: string;
  /** Primary button text */
  primaryText?: string;
  /** Primary button handler */
  onPrimary?: () => void;
  /** Secondary button text */
  secondaryText?: string;
  /** Secondary button handler */
  onSecondary?: () => void;
  /** Show gradient background */
  gradient?: boolean;
}

export const ZCTA = forwardRef<HTMLDivElement, ZCTAProps>(
  (
    {
      variant = "default",
      size = "md",
      title,
      description,
      primaryText = "Get Started",
      onPrimary,
      secondaryText,
      onSecondary,
      gradient = true,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          styles.cta,
          styles[variant],
          styles[size],
          gradient && styles.gradient,
          className
        )}
        {...props}
      >
        <div className={styles.content}>
          <div className={styles.text}>
            <h2 className={styles.title}>{title}</h2>
            {description && <p className={styles.description}>{description}</p>}
          </div>

          <div className={styles.actions}>
            {primaryText && (
              <ZButton size="lg" variant="primary" onClick={onPrimary}>
                {primaryText}
              </ZButton>
            )}
            {secondaryText && (
              <ZButton size="lg" variant="ghost" onClick={onSecondary}>
                {secondaryText}
              </ZButton>
            )}
          </div>

          {children}
        </div>
      </div>
    );
  }
);

ZCTA.displayName = "ZCTA";

export default ZCTA;
