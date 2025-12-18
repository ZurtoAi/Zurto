import { HTMLAttributes, forwardRef, ReactNode } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZCard.module.css";

export type ZCardVariant = "default" | "glass" | "bordered" | "elevated";

export interface ZCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Card variant style */
  variant?: ZCardVariant;
  /** Make card hoverable */
  hoverable?: boolean;
  /** Make card clickable (adds cursor pointer) */
  clickable?: boolean;
  /** Custom padding */
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  /** Header content */
  header?: ReactNode;
  /** Footer content */
  footer?: ReactNode;
  /** Card contents */
  children?: ReactNode;
}

/**
 * ZCard - Card container component for Zurto UI
 *
 * @example
 * <ZCard>Simple card content</ZCard>
 * <ZCard variant="glass" hoverable>Glass card</ZCard>
 * <ZCard header="Title" footer={<Button>Action</Button>}>Content</ZCard>
 */
export const ZCard = forwardRef<HTMLDivElement, ZCardProps>(
  (
    {
      variant = "default",
      hoverable = false,
      clickable = false,
      padding = "md",
      header,
      footer,
      className,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const isInteractive = hoverable || clickable || onClick;

    return (
      <div
        ref={ref}
        className={cn(
          styles.card,
          styles[variant],
          styles[`padding-${padding}`],
          hoverable && styles.hoverable,
          clickable && styles.clickable,
          className
        )}
        onClick={onClick}
        role={clickable ? "button" : undefined}
        tabIndex={clickable ? 0 : undefined}
        onKeyDown={
          clickable
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
                }
              }
            : undefined
        }
        {...props}
      >
        {header && <div className={styles.header}>{header}</div>}
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    );
  }
);

ZCard.displayName = "ZCard";

export default ZCard;

/* Sub-components for more control */

export interface ZCardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
}

export const ZCardHeader = forwardRef<HTMLDivElement, ZCardHeaderProps>(
  ({ title, subtitle, action, className, children, ...props }, ref) => (
    <div ref={ref} className={cn(styles.headerContent, className)} {...props}>
      {title || subtitle ? (
        <div className={styles.headerText}>
          {title && <h3 className={styles.title}>{title}</h3>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      ) : (
        children
      )}
      {action && <div className={styles.headerAction}>{action}</div>}
    </div>
  )
);

ZCardHeader.displayName = "ZCardHeader";

export const ZCardBody = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(styles.body, className)} {...props} />
));

ZCardBody.displayName = "ZCardBody";

export const ZCardFooter = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(styles.footer, className)} {...props} />
));

ZCardFooter.displayName = "ZCardFooter";
