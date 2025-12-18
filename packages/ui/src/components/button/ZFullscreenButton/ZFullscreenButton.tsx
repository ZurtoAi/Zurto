import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import { Maximize2, Minimize2 } from "lucide-react";
import styles from "./ZFullscreenButton.module.css";
import { useState } from "react";

export interface ZFullscreenButtonProps
  extends HTMLAttributes<HTMLButtonElement> {
  /** Target element selector (optional, defaults to document.documentElement) */
  target?: string;
  /** Variant */
  variant?: "default" | "primary" | "outline";
  /** Size */
  size?: "sm" | "md" | "lg";
}

export const ZFullscreenButton = forwardRef<
  HTMLButtonElement,
  ZFullscreenButtonProps
>(
  (
    { target, variant = "default", size = "md", className, children, ...props },
    ref
  ) => {
    const [isFullscreen, setIsFullscreen] = useState(false);

    const handleToggle = async () => {
      const element = target
        ? document.querySelector(target)
        : document.documentElement;
      if (!element) return;

      if (!document.fullscreenElement) {
        try {
          await (element as HTMLElement).requestFullscreen();
          setIsFullscreen(true);
        } catch (err) {
          console.error("Error entering fullscreen:", err);
        }
      } else {
        try {
          await document.exitFullscreen();
          setIsFullscreen(false);
        } catch (err) {
          console.error("Error exiting fullscreen:", err);
        }
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        className={cn(styles.button, styles[variant], styles[size], className)}
        onClick={handleToggle}
        {...props}
      >
        {isFullscreen ? (
          <Minimize2
            className={styles.icon}
            size={size === "sm" ? 16 : size === "lg" ? 24 : 20}
          />
        ) : (
          <Maximize2
            className={styles.icon}
            size={size === "sm" ? 16 : size === "lg" ? 24 : 20}
          />
        )}
        {children || (isFullscreen ? "Exit Fullscreen" : "Fullscreen")}
      </button>
    );
  }
);

ZFullscreenButton.displayName = "ZFullscreenButton";

export default ZFullscreenButton;
