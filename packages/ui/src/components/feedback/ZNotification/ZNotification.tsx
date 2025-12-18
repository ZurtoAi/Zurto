import { forwardRef, HTMLAttributes, ReactNode } from "react";
import { AlertCircle, CheckCircle, Info, XCircle, X } from "lucide-react";
import { cn } from "@/utils/cn";
import styles from "./ZNotification.module.css";

export type ZNotificationVariant = "info" | "success" | "warning" | "error";
export type ZNotificationPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "top-center"
  | "bottom-center";

export interface ZNotificationProps extends HTMLAttributes<HTMLDivElement> {
  /** Notification variant */
  variant?: ZNotificationVariant;
  /** Notification title */
  title?: string;
  /** Notification message */
  message: ReactNode;
  /** Show close button */
  showClose?: boolean;
  /** Close callback */
  onClose?: () => void;
  /** Auto-dismiss duration (ms) */
  autoDismiss?: number;
}

export const ZNotification = forwardRef<HTMLDivElement, ZNotificationProps>(
  (
    {
      variant = "info",
      title,
      message,
      showClose = true,
      onClose,
      autoDismiss,
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

    React.useEffect(() => {
      if (autoDismiss && onClose) {
        const timer = setTimeout(onClose, autoDismiss);
        return () => clearTimeout(timer);
      }
    }, [autoDismiss, onClose]);

    return (
      <div
        ref={ref}
        className={cn(styles.notification, styles[variant], className)}
        role="alert"
        {...props}
      >
        <div className={styles.icon}>
          <Icon />
        </div>

        <div className={styles.content}>
          {title && <div className={styles.title}>{title}</div>}
          <div className={styles.message}>{message}</div>
        </div>

        {showClose && onClose && (
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close notification"
          >
            <X />
          </button>
        )}
      </div>
    );
  }
);

// Add React import
import React from "react";

ZNotification.displayName = "ZNotification";

export default ZNotification;
