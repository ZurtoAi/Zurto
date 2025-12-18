import {
  forwardRef,
  HTMLAttributes,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";
import styles from "./ZDrawer.module.css";

export type ZDrawerPosition = "left" | "right" | "top" | "bottom";
export type ZDrawerSize = "sm" | "md" | "lg" | "xl" | "full";

export interface ZDrawerProps extends HTMLAttributes<HTMLDivElement> {
  /** Whether drawer is open */
  open: boolean;
  /** Close callback */
  onClose: () => void;
  /** Drawer position */
  position?: ZDrawerPosition;
  /** Drawer size */
  size?: ZDrawerSize;
  /** Drawer title */
  title?: string;
  /** Show close button */
  showCloseButton?: boolean;
  /** Close on overlay click */
  closeOnOverlayClick?: boolean;
  /** Close on escape key */
  closeOnEscape?: boolean;
  children: ReactNode;
}

export const ZDrawer = forwardRef<HTMLDivElement, ZDrawerProps>(
  (
    {
      open,
      onClose,
      position = "right",
      size = "md",
      title,
      showCloseButton = true,
      closeOnOverlayClick = true,
      closeOnEscape = true,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [mounted, setMounted] = useState(false);
    const drawerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      setMounted(true);
    }, []);

    useEffect(() => {
      if (!open || !closeOnEscape) return;

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };

      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }, [open, onClose, closeOnEscape]);

    useEffect(() => {
      if (open) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
      return () => {
        document.body.style.overflow = "";
      };
    }, [open]);

    if (!mounted) return null;

    const content = (
      <div
        className={cn(styles.wrapper, open && styles.open)}
        aria-hidden={!open}
      >
        <div
          className={styles.overlay}
          onClick={closeOnOverlayClick ? onClose : undefined}
          aria-hidden="true"
        />
        <div
          ref={ref || drawerRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "drawer-title" : undefined}
          className={cn(
            styles.drawer,
            styles[position],
            styles[size],
            className
          )}
          {...props}
        >
          {(title || showCloseButton) && (
            <div className={styles.header}>
              {title && (
                <h2 id="drawer-title" className={styles.title}>
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <button
                  type="button"
                  className={styles.closeButton}
                  onClick={onClose}
                  aria-label="Close drawer"
                >
                  <X className={styles.closeIcon} />
                </button>
              )}
            </div>
          )}
          <div className={styles.content}>{children}</div>
        </div>
      </div>
    );

    return createPortal(content, document.body);
  }
);

ZDrawer.displayName = "ZDrawer";

export default ZDrawer;
