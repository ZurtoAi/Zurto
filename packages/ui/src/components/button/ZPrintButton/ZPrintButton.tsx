import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import { Print } from "lucide-react";
import styles from "./ZPrintButton.module.css";

export interface ZPrintButtonProps extends HTMLAttributes<HTMLButtonElement> {
  /** Target selector to print (optional) */
  target?: string;
  /** Variant */
  variant?: "default" | "primary" | "outline";
  /** Size */
  size?: "sm" | "md" | "lg";
}

export const ZPrintButton = forwardRef<HTMLButtonElement, ZPrintButtonProps>(
  (
    { target, variant = "default", size = "md", className, children, ...props },
    ref
  ) => {
    const handlePrint = () => {
      if (target) {
        const element = document.querySelector(target);
        if (element) {
          const printWindow = window.open("", "_blank");
          if (printWindow) {
            printWindow.document.write(`
              <html>
                <head>
                  <title>Print</title>
                  <style>body { font-family: system-ui; padding: 20px; }</style>
                </head>
                <body>${element.innerHTML}</body>
              </html>
            `);
            printWindow.document.close();
            printWindow.print();
          }
        }
      } else {
        window.print();
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        className={cn(styles.button, styles[variant], styles[size], className)}
        onClick={handlePrint}
        {...props}
      >
        <Print
          className={styles.icon}
          size={size === "sm" ? 16 : size === "lg" ? 24 : 20}
        />
        {children || "Print"}
      </button>
    );
  }
);

ZPrintButton.displayName = "ZPrintButton";

export default ZPrintButton;
