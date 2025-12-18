/**
 * Accessibility utilities for Zurto UI components
 */

import { useCallback, useEffect, useRef } from "react";

/**
 * Trap focus within a container element (for modals, dialogs)
 */
export function useFocusTrap(isActive: boolean = true) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener("keydown", handleKeyDown);
    firstElement?.focus();

    return () => {
      container.removeEventListener("keydown", handleKeyDown);
    };
  }, [isActive]);

  return containerRef;
}

/**
 * Restore focus to previously focused element when component unmounts
 */
export function useRestoreFocus() {
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement;

    return () => {
      previouslyFocused.current?.focus();
    };
  }, []);
}

/**
 * Handle keyboard navigation for lists/menus
 */
export function useArrowNavigation(
  items: HTMLElement[],
  options: {
    orientation?: "horizontal" | "vertical";
    loop?: boolean;
  } = {}
) {
  const { orientation = "vertical", loop = true } = options;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const currentIndex = items.findIndex(
        (item) => item === document.activeElement
      );
      if (currentIndex === -1) return;

      const isVertical = orientation === "vertical";
      const prevKey = isVertical ? "ArrowUp" : "ArrowLeft";
      const nextKey = isVertical ? "ArrowDown" : "ArrowRight";

      let newIndex = currentIndex;

      if (e.key === prevKey) {
        e.preventDefault();
        newIndex = currentIndex - 1;
        if (newIndex < 0) {
          newIndex = loop ? items.length - 1 : 0;
        }
      } else if (e.key === nextKey) {
        e.preventDefault();
        newIndex = currentIndex + 1;
        if (newIndex >= items.length) {
          newIndex = loop ? 0 : items.length - 1;
        }
      } else if (e.key === "Home") {
        e.preventDefault();
        newIndex = 0;
      } else if (e.key === "End") {
        e.preventDefault();
        newIndex = items.length - 1;
      }

      items[newIndex]?.focus();
    },
    [items, orientation, loop]
  );

  return handleKeyDown;
}

/**
 * Announce message to screen readers
 */
export function announce(
  message: string,
  priority: "polite" | "assertive" = "polite"
) {
  const announcer = document.createElement("div");
  announcer.setAttribute("aria-live", priority);
  announcer.setAttribute("aria-atomic", "true");
  announcer.setAttribute("class", "sr-only");
  announcer.style.cssText = `
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  `;

  document.body.appendChild(announcer);

  // Small delay to ensure screen reader picks up the change
  setTimeout(() => {
    announcer.textContent = message;
  }, 100);

  setTimeout(() => {
    document.body.removeChild(announcer);
  }, 1000);
}

/**
 * Generate ARIA description ID
 */
export function getAriaDescribedBy(
  ...ids: (string | undefined)[]
): string | undefined {
  const validIds = ids.filter(Boolean);
  return validIds.length > 0 ? validIds.join(" ") : undefined;
}

/**
 * Screen reader only styles (for visually hidden text)
 */
export const srOnlyStyles = {
  position: "absolute" as const,
  width: "1px",
  height: "1px",
  padding: "0",
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap" as const,
  borderWidth: "0",
};
