import {
  useState,
  createContext,
  useContext,
  ReactNode,
  HTMLAttributes,
  forwardRef,
} from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";
import styles from "./ZAccordion.module.css";

type AccordionContextValue = {
  openItems: Set<string>;
  toggleItem: (value: string) => void;
  multiple?: boolean;
};

const AccordionContext = createContext<AccordionContextValue | null>(null);

export interface ZAccordionProps extends HTMLAttributes<HTMLDivElement> {
  /** Allow multiple items open at once */
  multiple?: boolean;
  /** Default open items */
  defaultValue?: string | string[];
  /** Controlled open items */
  value?: string | string[];
  /** Callback when items change */
  onValueChange?: (value: string | string[]) => void;
  children: ReactNode;
}

/**
 * ZAccordion - Collapsible content sections
 *
 * @example
 * <ZAccordion>
 *   <ZAccordionItem value="1">
 *     <ZAccordionTrigger>Section 1</ZAccordionTrigger>
 *     <ZAccordionContent>Content 1</ZAccordionContent>
 *   </ZAccordionItem>
 * </ZAccordion>
 */
export const ZAccordion = forwardRef<HTMLDivElement, ZAccordionProps>(
  (
    {
      multiple = false,
      defaultValue,
      value,
      onValueChange,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState<Set<string>>(() => {
      const initial = value ?? defaultValue;
      if (!initial) return new Set();
      return new Set(Array.isArray(initial) ? initial : [initial]);
    });

    const openItems =
      value !== undefined
        ? new Set(Array.isArray(value) ? value : [value])
        : internalValue;

    const toggleItem = (itemValue: string) => {
      const newSet = new Set(openItems);

      if (newSet.has(itemValue)) {
        newSet.delete(itemValue);
      } else {
        if (!multiple) {
          newSet.clear();
        }
        newSet.add(itemValue);
      }

      const newValue = multiple
        ? Array.from(newSet)
        : Array.from(newSet)[0] || "";

      if (value === undefined) {
        setInternalValue(newSet);
      }
      onValueChange?.(newValue);
    };

    return (
      <AccordionContext.Provider value={{ openItems, toggleItem, multiple }}>
        <div ref={ref} className={cn(styles.accordion, className)} {...props}>
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);

ZAccordion.displayName = "ZAccordion";

export interface ZAccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
  children: ReactNode;
}

export const ZAccordionItem = forwardRef<HTMLDivElement, ZAccordionItemProps>(
  ({ value, disabled = false, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(styles.item, disabled && styles.disabled, className)}
        data-state={disabled ? "disabled" : undefined}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ZAccordionItem.displayName = "ZAccordionItem";

export interface ZAccordionTriggerProps
  extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export const ZAccordionTrigger = forwardRef<
  HTMLButtonElement,
  ZAccordionTriggerProps
>(({ className, children, ...props }, ref) => {
  const context = useContext(AccordionContext);
  if (!context)
    throw new Error("ZAccordionTrigger must be used within ZAccordion");

  const parent = (ref as any)?.current?.parentElement;
  const value =
    parent?.closest("[data-value]")?.getAttribute("data-value") || "";
  const isOpen = context.openItems.has(value);

  return (
    <button
      ref={ref as any}
      className={cn(styles.trigger, isOpen && styles.open, className)}
      onClick={() => context.toggleItem(value)}
      aria-expanded={isOpen}
      {...props}
    >
      <span className={styles.triggerText}>{children}</span>
      <ChevronDown className={styles.icon} aria-hidden="true" />
    </button>
  );
});

ZAccordionTrigger.displayName = "ZAccordionTrigger";

export interface ZAccordionContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const ZAccordionContent = forwardRef<
  HTMLDivElement,
  ZAccordionContentProps
>(({ className, children, ...props }, ref) => {
  const context = useContext(AccordionContext);
  if (!context)
    throw new Error("ZAccordionContent must be used within ZAccordion");

  const parent = (ref as any)?.current?.parentElement;
  const value =
    parent?.closest("[data-value]")?.getAttribute("data-value") || "";
  const isOpen = context.openItems.has(value);

  return (
    <div
      ref={ref}
      className={cn(styles.content, isOpen && styles.open, className)}
      aria-hidden={!isOpen}
      {...props}
    >
      <div className={styles.contentInner}>{children}</div>
    </div>
  );
});

ZAccordionContent.displayName = "ZAccordionContent";

export default ZAccordion;
