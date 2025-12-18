import { forwardRef, IframeHTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZEmbed.module.css";

export interface ZEmbedProps extends IframeHTMLAttributes<HTMLIFrameElement> {
  /** Aspect ratio */
  aspectRatio?: "16/9" | "4/3" | "1/1" | "21/9";
}

export const ZEmbed = forwardRef<HTMLIFrameElement, ZEmbedProps>(
  ({ aspectRatio = "16/9", className, ...props }, ref) => {
    return (
      <div
        className={cn(
          styles.container,
          styles[`aspect-${aspectRatio.replace("/", "-")}`],
          className
        )}
      >
        <iframe ref={ref} className={styles.iframe} {...props} />
      </div>
    );
  }
);

ZEmbed.displayName = "ZEmbed";

export default ZEmbed;
