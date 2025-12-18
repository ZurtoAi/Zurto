import { forwardRef, HTMLAttributes, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/utils/cn";
import styles from "./ZVisibilityToggle.module.css";

export interface ZVisibilityToggleProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Initially visible */
  defaultVisible?: boolean;
  /** On change */
  onChange?: (visible: boolean) => void;
  /** Label when hidden */
  hiddenLabel?: string;
  /** Label when visible */
  visibleLabel?: string;
}

export const ZVisibilityToggle = forwardRef<
  HTMLDivElement,
  ZVisibilityToggleProps
>(
  (
    {
      defaultVisible = false,
      onChange,
      hiddenLabel = "Show",
      visibleLabel = "Hide",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState(defaultVisible);

    const handleToggle = () => {
      const newVisible = !isVisible;
      setIsVisible(newVisible);
      onChange?.(newVisible);
    };

    return (
      <div ref={ref} className={cn(styles.container, className)} {...props}>
        <button onClick={handleToggle} className={styles.toggle}>
          {isVisible ? (
            <>
              <EyeOff className={styles.icon} />
              <span>{visibleLabel}</span>
            </>
          ) : (
            <>
              <Eye className={styles.icon} />
              <span>{hiddenLabel}</span>
            </>
          )}
        </button>
        {isVisible && <div className={styles.content}>{children}</div>}
      </div>
    );
  }
);

ZVisibilityToggle.displayName = "ZVisibilityToggle";

export default ZVisibilityToggle;
