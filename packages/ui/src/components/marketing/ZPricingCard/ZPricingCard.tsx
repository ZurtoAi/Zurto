import { forwardRef, HTMLAttributes } from "react";
import { Check } from "lucide-react";
import { cn } from "@/utils/cn";
import { ZButton } from "../../core/ZButton";
import { ZBadge } from "../../core/ZBadge";
import styles from "./ZPricingCard.module.css";

export type ZPricingCardVariant = "default" | "featured" | "enterprise";

export interface PricingFeature {
  /** Feature text */
  text: string;
  /** Is feature included */
  included?: boolean;
}

export interface ZPricingCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Card variant */
  variant?: ZPricingCardVariant;
  /** Plan name */
  name: string;
  /** Price amount */
  price: string;
  /** Billing period */
  period?: string;
  /** Plan description */
  description?: string;
  /** List of features */
  features: PricingFeature[];
  /** Button text */
  buttonText?: string;
  /** Button click handler */
  onButtonClick?: () => void;
  /** Popular badge */
  popular?: boolean;
}

export const ZPricingCard = forwardRef<HTMLDivElement, ZPricingCardProps>(
  (
    {
      variant = "default",
      name,
      price,
      period = "month",
      description,
      features,
      buttonText = "Get Started",
      onButtonClick,
      popular = false,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          styles.card,
          styles[variant],
          popular && styles.popular,
          className
        )}
        {...props}
      >
        {popular && (
          <ZBadge className={styles.badge} variant="accent">
            Most Popular
          </ZBadge>
        )}

        <div className={styles.header}>
          <h3 className={styles.name}>{name}</h3>
          {description && <p className={styles.description}>{description}</p>}
        </div>

        <div className={styles.pricing}>
          <span className={styles.price}>{price}</span>
          {period && <span className={styles.period}>/{period}</span>}
        </div>

        <ZButton
          variant={variant === "featured" ? "primary" : "outline"}
          size="lg"
          fullWidth
          onClick={onButtonClick}
          className={styles.button}
        >
          {buttonText}
        </ZButton>

        <ul className={styles.features}>
          {features.map((feature, index) => (
            <li
              key={index}
              className={cn(
                styles.feature,
                feature.included === false && styles.excluded
              )}
            >
              <Check className={styles.checkIcon} />
              <span>{feature.text}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
);

ZPricingCard.displayName = "ZPricingCard";

export default ZPricingCard;
