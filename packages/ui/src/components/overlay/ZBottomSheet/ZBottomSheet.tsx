import {
  forwardRef,
  HTMLAttributes,
  ReactNode,
  useState,
  useRef,
  useEffect,
} from "react";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";
import styles from "./ZBottomSheet.module.css";

export type ZBottomSheetSize = "sm" | "md" | "lg" | "full";

export interface ZBottomSheetProps extends HTMLAttributes<HTMLDivElement> {
  /** Is sheet open */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
  /** Sheet title */
  title?: string;
  /** Sheet size */
  size?: ZBottomSheetSize;
  /** Show close button */
  showClose?: boolean;
  /** Show drag handle */
  showHandle?: boolean;
  /** Close on overlay click */
  closeOnOverlayClick?: boolean;
  /** Children */
  children: ReactNode;
}

export const ZBottomSheet = forwardRef<HTMLDivElement, ZBottomSheetProps>(
  (
    {
      isOpen,
      onClose,
      title,
      size = "md",
      showClose = true,
      showHandle = true,
      closeOnOverlayClick = true,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const [isDragging, setIsDragging] = useState(false);
    const [startY, setStartY] = useState(0);
    const [currentY, setCurrentY] = useState(0);
    const sheetRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }

      return () => {
        document.body.style.overflow = "";
      };
    }, [isOpen]);

    const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
      setIsDragging(true);
      const y = "touches" in e ? e.touches[0].clientY : e.clientY;
      setStartY(y);
      setCurrentY(y);
    };

    const handleDragMove = (e: React.TouchEvent | React.MouseEvent) => {
      if (!isDragging) return;
      const y = "touches" in e ? e.touches[0].clientY : e.clientY;
      setCurrentY(y);
    };

    const handleDragEnd = () => {
      if (!isDragging) return;
      setIsDragging(false);

      const dragDistance = currentY - startY;
      if (dragDistance > 100) {
        onClose();
      }

      setStartY(0);
      setCurrentY(0);
    };

    if (!isOpen) return null;

    const translateY = isDragging ? Math.max(0, currentY - startY) : 0;

    return (
      <div
        className={styles.overlay}
        onClick={closeOnOverlayClick ? onClose : undefined}
      >
        <div
          ref={ref}
          className={cn(styles.sheet, styles[size], className)}
          style={{ transform: `translateY(${translateY}px)` }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          {...props}
        >
          {showHandle && (
            <div
              className={styles.handleWrapper}
              onTouchStart={handleDragStart}
              onTouchMove={handleDragMove}
              onTouchEnd={handleDragEnd}
              onMouseDown={handleDragStart}
              onMouseMove={handleDragMove}
              onMouseUp={handleDragEnd}
            >
              <div className={styles.handle} />
            </div>
          )}

          {(title || showClose) && (
            <div className={styles.header}>
              {title && <h2 className={styles.title}>{title}</h2>}
              {showClose && (
                <button
                  className={styles.closeButton}
                  onClick={onClose}
                  aria-label="Close sheet"
                >
                  <X />
                </button>
              )}
            </div>
          )}

          <div className={styles.content}>{children}</div>
        </div>
      </div>
    );
  }
);

ZBottomSheet.displayName = "ZBottomSheet";

export default ZBottomSheet;
