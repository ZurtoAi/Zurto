import { forwardRef, HTMLAttributes, ReactNode } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/utils/cn";
import styles from "./ZComparison.module.css";

export interface ComparisonItem {
  /** Feature name */
  feature: string;
  /** Value for option A */
  optionA: boolean | string | ReactNode;
  /** Value for option B */
  optionB: boolean | string | ReactNode;
}

export interface ZComparisonProps extends HTMLAttributes<HTMLDivElement> {
  /** Option A label */
  labelA: string;
  /** Option B label */
  labelB: string;
  /** Comparison items */
  items: ComparisonItem[];
  /** Highlight option */
  highlight?: "A" | "B";
}

export const ZComparison = forwardRef<HTMLDivElement, ZComparisonProps>(
  ({ labelA, labelB, items, highlight, className, ...props }, ref) => {
    const renderValue = (value: boolean | string | ReactNode) => {
      if (typeof value === "boolean") {
        return value ? (
          <Check className={styles.checkIcon} />
        ) : (
          <X className={styles.xIcon} />
        );
      }
      return value;
    };

    return (
      <div ref={ref} className={cn(styles.comparison, className)} {...props}>
        <div className={styles.header}>
          <div className={styles.featureHeader}>Features</div>
          <div
            className={cn(
              styles.optionHeader,
              highlight === "A" && styles.highlighted
            )}
          >
            {labelA}
          </div>
          <div
            className={cn(
              styles.optionHeader,
              highlight === "B" && styles.highlighted
            )}
          >
            {labelB}
          </div>
        </div>

        <div className={styles.body}>
          {items.map((item, index) => (
            <div key={index} className={styles.row}>
              <div className={styles.feature}>{item.feature}</div>
              <div
                className={cn(
                  styles.value,
                  highlight === "A" && styles.highlighted
                )}
              >
                {renderValue(item.optionA)}
              </div>
              <div
                className={cn(
                  styles.value,
                  highlight === "B" && styles.highlighted
                )}
              >
                {renderValue(item.optionB)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

ZComparison.displayName = "ZComparison";

export default ZComparison;
