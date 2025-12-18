import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import { Download } from "lucide-react";
import styles from "./ZDownloadButton.module.css";

export interface ZDownloadButtonProps
  extends HTMLAttributes<HTMLButtonElement> {
  /** Download URL */
  href: string;
  /** Filename */
  filename?: string;
  /** Variant */
  variant?: "default" | "primary" | "outline";
  /** Size */
  size?: "sm" | "md" | "lg";
}

export const ZDownloadButton = forwardRef<
  HTMLButtonElement,
  ZDownloadButtonProps
>(
  (
    {
      href,
      filename,
      variant = "default",
      size = "md",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const handleDownload = () => {
      const link = document.createElement("a");
      link.href = href;
      if (filename) link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    return (
      <button
        ref={ref}
        type="button"
        className={cn(styles.button, styles[variant], styles[size], className)}
        onClick={handleDownload}
        {...props}
      >
        <Download
          className={styles.icon}
          size={size === "sm" ? 16 : size === "lg" ? 24 : 20}
        />
        {children || "Download"}
      </button>
    );
  }
);

ZDownloadButton.displayName = "ZDownloadButton";

export default ZDownloadButton;
