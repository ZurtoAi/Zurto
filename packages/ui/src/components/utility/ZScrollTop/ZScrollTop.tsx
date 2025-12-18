import { forwardRef, ButtonHTMLAttributes, useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/utils/cn";
import styles from "./ZScrollTop.module.css";

export interface ZScrollTopProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Show threshold (pixels) */
  threshold?: number;
  /** Smooth scroll */
  smooth?: boolean;
  /** Position */
  position?: "bottom-right" | "bottom-left" | "bottom-center";
}

export const ZScrollTop = forwardRef<HTMLButtonElement, ZScrollTopProps>(
  (
    {
      threshold = 300,
      smooth = true,
      position = "bottom-right",
      className,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      const handleScroll = () => {
        setIsVisible(window.scrollY > threshold);
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, [threshold]);

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: smooth ? "smooth" : "auto",
      });
    };

    if (!isVisible) return null;

    return (
      <button
        ref={ref}
        onClick={scrollToTop}
        className={cn(styles.button, styles[position], className)}
        aria-label="Scroll to top"
        {...props}
      >
        <ArrowUp className={styles.icon} />
      </button>
    );
  }
);

ZScrollTop.displayName = "ZScrollTop";

export default ZScrollTop;
