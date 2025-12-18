import { forwardRef, HTMLAttributes } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/utils/cn";
import styles from "./ZCollapsible.module.css";

export interface ZCollapsibleProps extends HTMLAttributes<HTMLDivElement> {
  /** Is expanded */
  isOpen?: boolean;
  /** Trigger element */
  trigger: React.ReactNode;
  /** Content */
  children: React.ReactNode;
  /** Toggle callback */
  onToggle?: (isOpen: boolean) => void;
}

export const ZCollapsible = forwardRef<HTMLDivElement, ZCollapsibleProps>(
  (
    { isOpen = false, trigger, children, onToggle, className, ...props },
    ref
  ) => {
    const [open, setOpen] = React.useState(isOpen);

    React.useEffect(() => {
      setOpen(isOpen);
    }, [isOpen]);

    const handleToggle = () => {
      const newState = !open;
      setOpen(newState);
      onToggle?.(newState);
    };

    return (
      <div ref={ref} className={cn(styles.collapsible, className)} {...props}>
        <button
          className={styles.trigger}
          onClick={handleToggle}
          aria-expanded={open}
        >
          <span className={styles.triggerContent}>{trigger}</span>
          <span className={styles.icon}>
            {open ? <ChevronUp /> : <ChevronDown />}
          </span>
        </button>

        <div className={cn(styles.content, open && styles.open)}>
          <div className={styles.inner}>{children}</div>
        </div>
      </div>
    );
  }
);

// Add React import at top
import React from "react";

ZCollapsible.displayName = "ZCollapsible";

export default ZCollapsible;
