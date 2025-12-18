import {
  HTMLAttributes,
  forwardRef,
  ReactNode,
  useState,
  useRef,
  useEffect,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/utils/cn";
import styles from "./ZTooltip.module.css";

export type ZTooltipPlacement =
  | "top"
  | "top-start"
  | "top-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "left-start"
  | "left-end"
  | "right"
  | "right-start"
  | "right-end";

export interface ZTooltipProps {
  /** Tooltip content */
  content: ReactNode;
  /** Placement of tooltip */
  placement?: ZTooltipPlacement;
  /** Delay before showing (ms) */
  delay?: number;
  /** Delay before hiding (ms) */
  hideDelay?: number;
  /** Disable tooltip */
  disabled?: boolean;
  /** Always show */
  open?: boolean;
  /** Arrow indicator */
  arrow?: boolean;
  /** Max width */
  maxWidth?: number;
  /** Trigger element */
  children: ReactNode;
}

/**
 * ZTooltip - Tooltip component for Zurto UI
 *
 * @example
 * <ZTooltip content="Hello!">
 *   <button>Hover me</button>
 * </ZTooltip>
 */
export const ZTooltip = ({
  content,
  placement = "top",
  delay = 200,
  hideDelay = 0,
  disabled = false,
  open: controlledOpen,
  arrow = true,
  maxWidth = 250,
  children,
}: ZTooltipProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const showTimeoutRef = useRef<NodeJS.Timeout>();
  const hideTimeoutRef = useRef<NodeJS.Timeout>();

  const open = controlledOpen ?? isOpen;

  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const trigger = triggerRef.current.getBoundingClientRect();
    const tooltip = tooltipRef.current.getBoundingClientRect();
    const gap = 8;

    let x = 0;
    let y = 0;

    // Primary axis
    if (placement.startsWith("top")) {
      y = trigger.top - tooltip.height - gap;
    } else if (placement.startsWith("bottom")) {
      y = trigger.bottom + gap;
    } else if (placement.startsWith("left")) {
      x = trigger.left - tooltip.width - gap;
    } else if (placement.startsWith("right")) {
      x = trigger.right + gap;
    }

    // Secondary axis
    if (placement.startsWith("top") || placement.startsWith("bottom")) {
      if (placement.endsWith("start")) {
        x = trigger.left;
      } else if (placement.endsWith("end")) {
        x = trigger.right - tooltip.width;
      } else {
        x = trigger.left + (trigger.width - tooltip.width) / 2;
      }
    } else {
      if (placement.endsWith("start")) {
        y = trigger.top;
      } else if (placement.endsWith("end")) {
        y = trigger.bottom - tooltip.height;
      } else {
        y = trigger.top + (trigger.height - tooltip.height) / 2;
      }
    }

    // Clamp to viewport
    x = Math.max(8, Math.min(x, window.innerWidth - tooltip.width - 8));
    y = Math.max(8, Math.min(y, window.innerHeight - tooltip.height - 8));

    setPosition({ x, y });
  };

  useEffect(() => {
    if (open) {
      // Small delay to let tooltip render before calculating position
      requestAnimationFrame(calculatePosition);
    }
  }, [open, placement]);

  const handleMouseEnter = () => {
    if (disabled) return;
    clearTimeout(hideTimeoutRef.current);
    showTimeoutRef.current = setTimeout(() => setIsOpen(true), delay);
  };

  const handleMouseLeave = () => {
    clearTimeout(showTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => setIsOpen(false), hideDelay);
  };

  useEffect(() => {
    return () => {
      clearTimeout(showTimeoutRef.current);
      clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  return (
    <>
      <div
        ref={triggerRef}
        className={styles.trigger}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
      >
        {children}
      </div>

      {open &&
        createPortal(
          <div
            ref={tooltipRef}
            className={cn(styles.tooltip, styles[placement.split("-")[0]])}
            style={{
              left: position.x,
              top: position.y,
              maxWidth,
            }}
            role="tooltip"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {content}
            {arrow && <span className={styles.arrow} />}
          </div>,
          document.body
        )}
    </>
  );
};

ZTooltip.displayName = "ZTooltip";

export default ZTooltip;
