import { forwardRef, HTMLAttributes, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/utils/cn";
import { ZButton } from "../../core/ZButton";
import styles from "./ZHero.module.css";

export type ZHeroVariant = "default" | "centered" | "split";
export type ZHeroSize = "sm" | "md" | "lg" | "xl";

export interface ZHeroProps extends HTMLAttributes<HTMLElement> {
  /** Hero variant */
  variant?: ZHeroVariant;
  /** Hero size */
  size?: ZHeroSize;
  /** Main heading */
  title: string;
  /** Subtitle/description */
  subtitle?: string;
  /** Primary CTA text */
  primaryAction?: string;
  /** Primary CTA click handler */
  onPrimaryAction?: () => void;
  /** Secondary CTA text */
  secondaryAction?: string;
  /** Secondary CTA click handler */
  onSecondaryAction?: () => void;
  /** Hero image/visual */
  image?: ReactNode;
  /** Badge/label above title */
  badge?: ReactNode;
  /** Show background pattern */
  showPattern?: boolean;
}

export const ZHero = forwardRef<HTMLElement, ZHeroProps>(
  (
    {
      variant = "default",
      size = "lg",
      title,
      subtitle,
      primaryAction,
      onPrimaryAction,
      secondaryAction,
      onSecondaryAction,
      image,
      badge,
      showPattern = true,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <section
        ref={ref}
        className={cn(
          styles.hero,
          styles[variant],
          styles[size],
          showPattern && styles.withPattern,
          className
        )}
        {...props}
      >
        {showPattern && <div className={styles.pattern} aria-hidden="true" />}

        <div className={styles.container}>
          <div className={styles.content}>
            {badge && <div className={styles.badge}>{badge}</div>}

            <h1 className={styles.title}>{title}</h1>

            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

            {(primaryAction || secondaryAction) && (
              <div className={styles.actions}>
                {primaryAction && (
                  <ZButton
                    size="lg"
                    variant="primary"
                    onClick={onPrimaryAction}
                    rightIcon={<ArrowRight />}
                  >
                    {primaryAction}
                  </ZButton>
                )}
                {secondaryAction && (
                  <ZButton
                    size="lg"
                    variant="ghost"
                    onClick={onSecondaryAction}
                  >
                    {secondaryAction}
                  </ZButton>
                )}
              </div>
            )}

            {children}
          </div>

          {image && variant !== "centered" && (
            <div className={styles.imageWrapper}>{image}</div>
          )}
        </div>
      </section>
    );
  }
);

ZHero.displayName = "ZHero";

export default ZHero;
