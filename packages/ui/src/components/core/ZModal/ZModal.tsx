import {
  HTMLAttributes,
  forwardRef,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/utils/cn";
import { useFocusTrap, useRestoreFocus } from "@/utils/a11y";
import { X } from "lucide-react";
import styles from "./ZModal.module.css";

export type ZModalSize = "sm" | "md" | "lg" | "xl" | "full";

export interface ZModalProps extends HTMLAttributes<HTMLDivElement> {
  /** Whether modal is open */
  open: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Modal size */
  size?: ZModalSize;
  /** Modal title */
  title?: string;
  /** Modal description */
  description?: string;
  /** Show close button */
  showCloseButton?: boolean;
  /** Close on overlay click */
  closeOnOverlay?: boolean;
  /** Close on escape key */
  closeOnEscape?: boolean;
  /** Disable body scroll when open */
  preventScroll?: boolean;
  /** Header content */
  header?: ReactNode;
  /** Footer content */
  footer?: ReactNode;
  /** Modal contents */
  children?: ReactNode;
}

/**
 * ZModal - Modal/Dialog component for Zurto UI
 *
 * @example
 * <ZModal open={isOpen} onClose={() => setIsOpen(false)} title="Confirm">
 *   Are you sure?
 * </ZModal>
 */
export const ZModal = forwardRef<HTMLDivElement, ZModalProps>(
  (
    {
      open,
      onClose,
      size = "md",
      title,
      description,
      showCloseButton = true,
      closeOnOverlay = true,
      closeOnEscape = true,
      preventScroll = true,
      header,
      footer,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const focusTrapRef = useFocusTrap(open);
    useRestoreFocus();

    // Handle escape key
    useEffect(() => {
      if (!open || !closeOnEscape) return;

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };

      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }, [open, closeOnEscape, onClose]);

    // Prevent body scroll
    useEffect(() => {
      if (!preventScroll) return;

      if (open) {
        const scrollbarWidth =
          window.innerWidth - document.documentElement.clientWidth;
        document.body.style.overflow = "hidden";
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      return () => {
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
      };
    }, [open, preventScroll]);

    if (!open) return null;

    const modalContent = (
      <div
        className={styles.overlay}
        onClick={closeOnOverlay ? onClose : undefined}
      >
        <div
          ref={(node) => {
            // Merge refs
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
            (
              focusTrapRef as React.MutableRefObject<HTMLElement | null>
            ).current = node;
          }}
          className={cn(styles.modal, styles[size], className)}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "modal-title" : undefined}
          aria-describedby={description ? "modal-description" : undefined}
          {...props}
        >
          {/* Header */}
          {(title || header || showCloseButton) && (
            <div className={styles.header}>
              {header || (
                <div className={styles.headerContent}>
                  {title && (
                    <h2 id="modal-title" className={styles.title}>
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p id="modal-description" className={styles.description}>
                      {description}
                    </p>
                  )}
                </div>
              )}
              {showCloseButton && (
                <button
                  type="button"
                  className={styles.closeButton}
                  onClick={onClose}
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div className={styles.body}>{children}</div>

          {/* Footer */}
          {footer && <div className={styles.footer}>{footer}</div>}
        </div>
      </div>
    );

    // Render in portal
    return createPortal(modalContent, document.body);
  }
);

ZModal.displayName = "ZModal";

export default ZModal;
