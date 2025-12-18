import { HTMLAttributes, forwardRef, ReactNode, useState } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZTabs.module.css";

export type ZTabsVariant = "default" | "pills" | "underline" | "bordered";
export type ZTabsSize = "sm" | "md" | "lg";

export interface ZTabItem {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  badge?: ReactNode;
}

export interface ZTabsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Tab items */
  items: ZTabItem[];
  /** Active tab ID */
  value?: string;
  /** Default active tab */
  defaultValue?: string;
  /** On tab change */
  onChange?: (id: string) => void;
  /** Visual variant */
  variant?: ZTabsVariant;
  /** Size */
  size?: ZTabsSize;
  /** Full width tabs */
  fullWidth?: boolean;
  /** Vertical orientation */
  vertical?: boolean;
}

/**
 * ZTabs - Tab navigation component
 */
export const ZTabs = forwardRef<HTMLDivElement, ZTabsProps>(
  (
    {
      items,
      value: valueProp,
      defaultValue,
      onChange,
      variant = "default",
      size = "md",
      fullWidth = false,
      vertical = false,
      className,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(
      defaultValue ?? items[0]?.id
    );
    const activeId = valueProp ?? internalValue;

    const handleClick = (id: string) => {
      if (valueProp === undefined) {
        setInternalValue(id);
      }
      onChange?.(id);
    };

    return (
      <div
        ref={ref}
        className={cn(
          styles.tabs,
          styles[variant],
          styles[size],
          vertical && styles.vertical,
          fullWidth && styles.fullWidth,
          className
        )}
        role="tablist"
        aria-orientation={vertical ? "vertical" : "horizontal"}
        {...props}
      >
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={activeId === item.id}
            aria-disabled={item.disabled}
            className={cn(
              styles.tab,
              activeId === item.id && styles.active,
              item.disabled && styles.disabled
            )}
            onClick={() => !item.disabled && handleClick(item.id)}
            tabIndex={activeId === item.id ? 0 : -1}
          >
            {item.icon && <span className={styles.icon}>{item.icon}</span>}
            <span className={styles.label}>{item.label}</span>
            {item.badge && <span className={styles.badge}>{item.badge}</span>}
          </button>
        ))}
      </div>
    );
  }
);

ZTabs.displayName = "ZTabs";

/* Tab Panel */
export interface ZTabPanelProps extends HTMLAttributes<HTMLDivElement> {
  /** Tab ID this panel belongs to */
  tabId: string;
  /** Currently active tab ID */
  activeId: string;
}

export const ZTabPanel = forwardRef<HTMLDivElement, ZTabPanelProps>(
  ({ tabId, activeId, children, className, ...props }, ref) => {
    if (tabId !== activeId) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        aria-labelledby={tabId}
        className={cn(styles.panel, className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ZTabPanel.displayName = "ZTabPanel";

export default ZTabs;
