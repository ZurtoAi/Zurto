import { forwardRef, HTMLAttributes, ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/utils/cn";
import styles from "./ZPricingTable.module.css";

export interface PricingPlan {
  id: string;
  name: string;
  price: string | number;
  period?: string;
  description?: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
  buttonText?: string;
  onSelect?: () => void;
}

export interface ZPricingTableProps extends HTMLAttributes<HTMLDivElement> {
  /** Pricing plans */
  plans: PricingPlan[];
  /** Currency symbol */
  currency?: string;
}

export const ZPricingTable = forwardRef<HTMLDivElement, ZPricingTableProps>(
  ({ plans, currency = "$", className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(styles.table, className)} {...props}>
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={cn(styles.plan, plan.highlighted && styles.highlighted)}
          >
            {plan.badge && <div className={styles.badge}>{plan.badge}</div>}

            <div className={styles.header}>
              <h3 className={styles.name}>{plan.name}</h3>
              {plan.description && (
                <p className={styles.description}>{plan.description}</p>
              )}
            </div>

            <div className={styles.price}>
              <span className={styles.currency}>{currency}</span>
              <span className={styles.amount}>{plan.price}</span>
              {plan.period && (
                <span className={styles.period}>/{plan.period}</span>
              )}
            </div>

            <ul className={styles.features}>
              {plan.features.map((feature, index) => (
                <li key={index} className={styles.feature}>
                  <Check className={styles.checkIcon} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={plan.onSelect}
              className={cn(
                styles.button,
                plan.highlighted && styles.buttonHighlighted
              )}
            >
              {plan.buttonText || "Get Started"}
            </button>
          </div>
        ))}
      </div>
    );
  }
);

ZPricingTable.displayName = "ZPricingTable";

export default ZPricingTable;
