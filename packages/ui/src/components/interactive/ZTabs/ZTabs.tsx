import {
  useState,
  createContext,
  useContext,
  ReactNode,
  HTMLAttributes,
  forwardRef,
} from "react";
import { cn } from "@/utils/cn";
import styles from "./ZTabs.module.css";

type TabsContextValue = {
  value: string;
  onChange: (value: string) => void;
  orientation?: "horizontal" | "vertical";
};

const TabsContext = createContext<TabsContextValue | null>(null);

export interface ZTabsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Active tab value */
  value?: string;
  /** Default active tab */
  defaultValue?: string;
  /** Change callback */
  onChange?: (value: string) => void;
  /** Tab orientation */
  orientation?: "horizontal" | "vertical";
  children: ReactNode;
}

export const ZTabs = forwardRef<HTMLDivElement, ZTabsProps>(
  (
    {
      value: controlledValue,
      defaultValue,
      onChange,
      orientation = "horizontal",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue || "");
    const value = controlledValue ?? internalValue;

    const handleChange = (newValue: string) => {
      if (controlledValue === undefined) setInternalValue(newValue);
      onChange?.(newValue);
    };

    return (
      <TabsContext.Provider
        value={{ value, onChange: handleChange, orientation }}
      >
        <div
          ref={ref}
          className={cn(styles.tabs, styles[orientation], className)}
          {...props}
        >
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);

ZTabs.displayName = "ZTabs";

export interface ZTabsListProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const ZTabsList = forwardRef<HTMLDivElement, ZTabsListProps>(
  ({ className, children, ...props }, ref) => {
    const context = useContext(TabsContext);
    if (!context) throw new Error("ZTabsList must be used within ZTabs");

    return (
      <div
        ref={ref}
        role="tablist"
        className={cn(
          styles.tabsList,
          styles[`${context.orientation}List`],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ZTabsList.displayName = "ZTabsList";

export interface ZTabsTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  value: string;
  disabled?: boolean;
  children: ReactNode;
}

export const ZTabsTrigger = forwardRef<HTMLButtonElement, ZTabsTriggerProps>(
  ({ value, disabled = false, className, children, ...props }, ref) => {
    const context = useContext(TabsContext);
    if (!context) throw new Error("ZTabsTrigger must be used within ZTabs");

    const isActive = context.value === value;

    return (
      <button
        ref={ref}
        role="tab"
        type="button"
        aria-selected={isActive}
        aria-disabled={disabled}
        disabled={disabled}
        className={cn(
          styles.trigger,
          isActive && styles.active,
          disabled && styles.disabled,
          className
        )}
        onClick={() => !disabled && context.onChange(value)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

ZTabsTrigger.displayName = "ZTabsTrigger";

export interface ZTabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  children: ReactNode;
}

export const ZTabsContent = forwardRef<HTMLDivElement, ZTabsContentProps>(
  ({ value, className, children, ...props }, ref) => {
    const context = useContext(TabsContext);
    if (!context) throw new Error("ZTabsContent must be used within ZTabs");

    const isActive = context.value === value;

    if (!isActive) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        className={cn(styles.content, className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ZTabsContent.displayName = "ZTabsContent";

export default ZTabs;
