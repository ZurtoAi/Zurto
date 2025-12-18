import { forwardRef, HTMLAttributes, ReactNode, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";
import styles from "./ZDialog.module.css";

export type ZDialogSize = "sm" | "md" | "lg" | "xl" | "full";

export interface ZDialogProps extends HTMLAttributes<HTMLDivElement> {
  /** Is dialog open */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
  /** Dialog title */
  title?: string;
  /** Dialog description */
  description?: string;
  /** Dialog size */
  size?: ZDialogSize;
  /** Show close button */
  showClose?: boolean;
  /** Close on overlay click */
  closeOnOverlayClick?: boolean;
  /** Close on escape key */
  closeOnEscape?: boolean;
  /** Children */
  children: ReactNode;
}

export const ZDialog = forwardRef<HTMLDivElement, ZDialogProps>(
  (
    {
      isOpen,
      onClose,
      title,
      description,
      size = "md",
      showClose = true,
      closeOnOverlayClick = true,
      closeOnEscape = true,
      children,
      className,
      ...props
    },
    ref
  ) => {
    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape" && closeOnEscape) {
          onClose();
        }
      };

      if (isOpen) {
        document.addEventListener("keydown", handleEscape);
        document.body.style.overflow = "hidden";
      }

      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "";
      };
    }, [isOpen, closeOnEscape, onClose]);

    if (!isOpen) return null;

    return (
      <div
        className={styles.overlay}
        onClick={closeOnOverlayClick ? onClose : undefined}
      >
        <div
          ref={ref}
          className={cn(styles.dialog, styles[size], className)}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "dialog-title" : undefined}
          {...props}
        >
          {showClose && (
            <button
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Close dialog"
            >
              <X />
            </button>
          )}

          {(title || description) && (
            <div className={styles.header}>
              {title && (
                <h2 id="dialog-title" className={styles.title}>
                  {title}
                </h2>
              )}
              {description && (
                <p className={styles.description}>{description}</p>
              )}
            </div>
          )}

          <div className={styles.content}>{children}</div>
        </div>
      </div>
    );
  }
);

ZDialog.displayName = "ZDialog";

export default ZDialog;
