import {
  HTMLAttributes,
  forwardRef,
  useState,
  useRef,
  useEffect,
  ReactNode,
  KeyboardEvent,
} from "react";
import { cn } from "@/utils/cn";
import styles from "./ZCommandPalette.module.css";

export interface ZCommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  shortcut?: string;
  group?: string;
  onSelect?: () => void;
  disabled?: boolean;
}

export interface ZCommandPaletteProps extends HTMLAttributes<HTMLDivElement> {
  /** Items to display */
  items: ZCommandItem[];
  /** Open state */
  open?: boolean;
  /** Default open state */
  defaultOpen?: boolean;
  /** On open change */
  onOpenChange?: (open: boolean) => void;
  /** On item select */
  onSelect?: (item: ZCommandItem) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Empty state message */
  emptyMessage?: string;
  /** Recent items */
  recentItems?: string[];
  /** Keyboard shortcut hint */
  shortcutHint?: string;
}

/**
 * ZCommandPalette - Command palette / spotlight search
 */
export const ZCommandPalette = forwardRef<HTMLDivElement, ZCommandPaletteProps>(
  (
    {
      items,
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      onSelect,
      placeholder = "Search commands...",
      emptyMessage = "No results found",
      recentItems = [],
      shortcutHint = "⌘K",
      className,
      ...props
    },
    ref
  ) => {
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const [search, setSearch] = useState("");
    const [focusedIndex, setFocusedIndex] = useState(0);

    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const dialogRef = useRef<HTMLDivElement>(null);

    const isOpen = openProp ?? internalOpen;

    // Filter items
    const filteredItems = items.filter(
      (item) =>
        item.label.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase())
    );

    // Group items
    const groupedItems = filteredItems.reduce((acc, item) => {
      const group = item.group || "Commands";
      if (!acc[group]) acc[group] = [];
      acc[group].push(item);
      return acc;
    }, {} as Record<string, ZCommandItem[]>);

    const flatItems = Object.values(groupedItems).flat();

    const handleOpen = (open: boolean) => {
      if (openProp === undefined) {
        setInternalOpen(open);
      }
      onOpenChange?.(open);
      if (open) {
        setSearch("");
        setFocusedIndex(0);
      }
    };

    const handleSelect = (item: ZCommandItem) => {
      if (item.disabled) return;
      item.onSelect?.();
      onSelect?.(item);
      handleOpen(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setFocusedIndex((i) => Math.min(i + 1, flatItems.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusedIndex((i) => Math.max(i - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (flatItems[focusedIndex]) {
            handleSelect(flatItems[focusedIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          handleOpen(false);
          break;
      }
    };

    // Global keyboard shortcut
    useEffect(() => {
      const handleGlobalKey = (e: globalThis.KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "k") {
          e.preventDefault();
          handleOpen(!isOpen);
        }
      };

      document.addEventListener("keydown", handleGlobalKey);
      return () => document.removeEventListener("keydown", handleGlobalKey);
    }, [isOpen]);

    // Focus input when opened
    useEffect(() => {
      if (isOpen && inputRef.current) {
        inputRef.current.focus();
      }
    }, [isOpen]);

    // Scroll focused item into view
    useEffect(() => {
      if (listRef.current && isOpen) {
        const item = listRef.current.querySelector(
          `[data-index="${focusedIndex}"]`
        );
        item?.scrollIntoView({ block: "nearest" });
      }
    }, [focusedIndex, isOpen]);

    // Focus trap removed - not needed

    // Reset focus index on search
    useEffect(() => {
      setFocusedIndex(0);
    }, [search]);

    if (!isOpen) return null;

    let itemIndex = 0;

    return (
      <div className={styles.overlay} onClick={() => handleOpen(false)}>
        <div
          ref={(node) => {
            (dialogRef as any).current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
          }}
          className={cn(styles.palette, className)}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          {...props}
        >
          <div className={styles.header}>
            <svg
              className={styles.searchIcon}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              className={styles.input}
              placeholder={placeholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <kbd className={styles.shortcut}>ESC</kbd>
          </div>

          <div ref={listRef} className={styles.list}>
            {Object.entries(groupedItems).map(([group, groupItems]) => (
              <div key={group} className={styles.group}>
                <div className={styles.groupLabel}>{group}</div>
                {groupItems.map((item) => {
                  const currentIndex = itemIndex++;
                  return (
                    <div
                      key={item.id}
                      data-index={currentIndex}
                      className={cn(
                        styles.item,
                        currentIndex === focusedIndex && styles.focused,
                        item.disabled && styles.disabled
                      )}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setFocusedIndex(currentIndex)}
                    >
                      {item.icon && (
                        <span className={styles.itemIcon}>{item.icon}</span>
                      )}
                      <div className={styles.itemContent}>
                        <span className={styles.itemLabel}>{item.label}</span>
                        {item.description && (
                          <span className={styles.itemDesc}>
                            {item.description}
                          </span>
                        )}
                      </div>
                      {item.shortcut && (
                        <kbd className={styles.itemShortcut}>
                          {item.shortcut}
                        </kbd>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}

            {flatItems.length === 0 && (
              <div className={styles.empty}>{emptyMessage}</div>
            )}
          </div>

          <div className={styles.footer}>
            <span>
              <kbd>↑↓</kbd> Navigate
            </span>
            <span>
              <kbd>↵</kbd> Select
            </span>
            <span>
              <kbd>Esc</kbd> Close
            </span>
          </div>
        </div>
      </div>
    );
  }
);

ZCommandPalette.displayName = "ZCommandPalette";

export default ZCommandPalette;
