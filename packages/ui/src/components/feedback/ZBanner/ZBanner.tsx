import { forwardRef, HTMLAttributes, ReactNode } from "react";
import { AlertCircle, CheckCircle, Info, XCircle, X } from "lucide-react";
import { cn } from "@/utils/cn";
import styles from "./ZBanner.module.css";

export type ZBannerVariant = "info" | "success" | "warning" | "error";

export interface ZBannerProps extends HTMLAttributes<HTMLDivElement> {
  /** Banner variant */
  variant?: ZBannerVariant;
  /** Banner title */
  title?: string;
  /** Banner message */
  message: ReactNode;
  /** Show icon */
  showIcon?: boolean;
  /** Show close button */
  showClose?: boolean;
  /** Close callback */
  onClose?: () => void;
  /** Actions */
  actions?: ReactNode;
}

export const ZBanner = forwardRef<HTMLDivElement, ZBannerProps>(
  (
    {
      variant = "info",
      title,
      message,
      showIcon = true,
      showClose = false,
      onClose,
      actions,
      className,
      ...props
    },
    ref
  ) => {
    const icons = {
      info: Info,
      success: CheckCircle,
      warning: AlertCircle,
      error: XCircle,
    };

    const Icon = icons[variant];

    return (
      <div
        ref={ref}
        className={cn(styles.banner, styles[variant], className)}
        role="alert"
        {...props}
      >
        {showIcon && (
          <div className={styles.icon}>
            <Icon />
          </div>
        )}

        <div className={styles.content}>
          <div className={styles.text}>
            {title && <div className={styles.title}>{title}</div>}
            <div className={styles.message}>{message}</div>
          </div>
          {actions && <div className={styles.actions}>{actions}</div>}
        </div>

        {showClose && onClose && (
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close banner"
          >
            <X />
          </button>
        )}
      </div>
    );
  }
);

ZBanner.displayName = "ZBanner";

export default ZBanner;
