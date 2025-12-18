import { forwardRef, HTMLAttributes, ReactNode } from "react";
import { Check, X, Minus } from "lucide-react";
import { cn } from "@/utils/cn";
import styles from "./ZKbd.module.css";

export type ZKbdSize = "sm" | "md" | "lg";

export interface ZKbdProps extends HTMLAttributes<HTMLElement> {
  /** Keyboard key size */
  size?: ZKbdSize;
  /** Children */
  children: ReactNode;
}

export const ZKbd = forwardRef<HTMLElement, ZKbdProps>(
  ({ size = "md", children, className, ...props }, ref) => {
    return (
      <kbd
        ref={ref}
        className={cn(styles.kbd, styles[size], className)}
        {...props}
      >
        {children}
      </kbd>
    );
  }
);

ZKbd.displayName = "ZKbd";

export default ZKbd;
