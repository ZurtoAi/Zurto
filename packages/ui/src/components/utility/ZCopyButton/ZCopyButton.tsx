import { forwardRef, HTMLAttributes } from "react";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/utils/cn";
import { ZButton } from "../../core/ZButton";
import styles from "./ZCopyButton.module.css";

export type ZCopyButtonVariant = "icon" | "text" | "both";

export interface ZCopyButtonProps
  extends Omit<HTMLAttributes<HTMLButtonElement>, "onClick"> {
  /** Text to copy */
  value: string;
  /** Button variant */
  variant?: ZCopyButtonVariant;
  /** Copy confirmation timeout (ms) */
  timeout?: number;
  /** Custom copy label */
  copyLabel?: string;
  /** Custom copied label */
  copiedLabel?: string;
  /** Copy callback */
  onCopy?: () => void;
}

export const ZCopyButton = forwardRef<HTMLButtonElement, ZCopyButtonProps>(
  (
    {
      value,
      variant = "icon",
      timeout = 2000,
      copyLabel = "Copy",
      copiedLabel = "Copied!",
      onCopy,
      className,
      ...props
    },
    ref
  ) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        onCopy?.();

        setTimeout(() => {
          setCopied(false);
        }, timeout);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    };

    if (variant === "icon") {
      return (
        <button
          ref={ref}
          onClick={handleCopy}
          className={cn(styles.iconButton, copied && styles.copied, className)}
          title={copied ? copiedLabel : copyLabel}
          {...props}
        >
          {copied ? (
            <Check className={styles.icon} />
          ) : (
            <Copy className={styles.icon} />
          )}
        </button>
      );
    }

    return (
      <ZButton
        ref={ref}
        variant="outline"
        size="sm"
        onClick={handleCopy}
        leftIcon={copied ? <Check /> : <Copy />}
        className={cn(copied && styles.copiedButton, className)}
        {...props}
      >
        {copied ? copiedLabel : copyLabel}
      </ZButton>
    );
  }
);

ZCopyButton.displayName = "ZCopyButton";

export default ZCopyButton;
