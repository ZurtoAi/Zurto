import { forwardRef, HTMLAttributes } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn";
import styles from "./ZFeatureGrid.module.css";

export type ZFeatureGridVariant = "default" | "cards" | "minimal";
export type ZFeatureGridColumns = 2 | 3 | 4;

export interface Feature {
  /** Feature icon */
  icon?: LucideIcon;
  /** Feature title */
  title: string;
  /** Feature description */
  description: string;
  /** Icon color */
  iconColor?: string;
}

export interface ZFeatureGridProps extends HTMLAttributes<HTMLDivElement> {
  /** Grid variant */
  variant?: ZFeatureGridVariant;
  /** Number of columns */
  columns?: ZFeatureGridColumns;
  /** Features to display */
  features: Feature[];
  /** Section title */
  title?: string;
  /** Section description */
  description?: string;
}

export const ZFeatureGrid = forwardRef<HTMLDivElement, ZFeatureGridProps>(
  (
    {
      variant = "default",
      columns = 3,
      features,
      title,
      description,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div ref={ref} className={cn(styles.container, className)} {...props}>
        {(title || description) && (
          <div className={styles.header}>
            {title && <h2 className={styles.title}>{title}</h2>}
            {description && <p className={styles.description}>{description}</p>}
          </div>
        )}

        <div
          className={cn(
            styles.grid,
            styles[variant],
            styles[`columns${columns}`]
          )}
        >
          {features.map((feature, index) => (
            <div key={index} className={styles.feature}>
              {feature.icon && (
                <div
                  className={styles.iconWrapper}
                  style={{ color: feature.iconColor || "var(--z-accent)" }}
                >
                  <feature.icon className={styles.icon} />
                </div>
              )}
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

ZFeatureGrid.displayName = "ZFeatureGrid";

export default ZFeatureGrid;
