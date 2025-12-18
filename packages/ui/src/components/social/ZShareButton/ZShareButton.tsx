import { forwardRef, ButtonHTMLAttributes } from "react";
import {
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/utils/cn";
import styles from "./ZShareButton.module.css";
import { useState } from "react";

export interface ZShareButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Share URL */
  url: string;
  /** Share title */
  title?: string;
  /** Platform */
  platform?: "facebook" | "twitter" | "linkedin" | "email" | "copy" | "native";
  /** Size */
  size?: "sm" | "md" | "lg";
  /** Icon only */
  iconOnly?: boolean;
}

export const ZShareButton = forwardRef<HTMLButtonElement, ZShareButtonProps>(
  (
    {
      url,
      title,
      platform = "native",
      size = "md",
      iconOnly = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
      const shareData = { title, url };

      switch (platform) {
        case "facebook":
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              url
            )}`,
            "_blank"
          );
          break;
        case "twitter":
          window.open(
            `https://twitter.com/intent/tweet?url=${encodeURIComponent(
              url
            )}&text=${encodeURIComponent(title || "")}`,
            "_blank"
          );
          break;
        case "linkedin":
          window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
              url
            )}`,
            "_blank"
          );
          break;
        case "email":
          window.location.href = `mailto:?subject=${encodeURIComponent(
            title || ""
          )}&body=${encodeURIComponent(url)}`;
          break;
        case "copy":
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
          break;
        case "native":
          if (navigator.share) {
            await navigator.share(shareData);
          }
          break;
      }
    };

    const getIcon = () => {
      if (platform === "copy" && copied)
        return <Check className={styles.icon} />;
      switch (platform) {
        case "facebook":
          return <Facebook className={styles.icon} />;
        case "twitter":
          return <Twitter className={styles.icon} />;
        case "linkedin":
          return <Linkedin className={styles.icon} />;
        case "email":
          return <Mail className={styles.icon} />;
        case "copy":
          return <Copy className={styles.icon} />;
        default:
          return <Share2 className={styles.icon} />;
      }
    };

    const getLabel = () => {
      if (platform === "copy" && copied) return "Copied!";
      if (children) return children;
      switch (platform) {
        case "facebook":
          return "Facebook";
        case "twitter":
          return "Twitter";
        case "linkedin":
          return "LinkedIn";
        case "email":
          return "Email";
        case "copy":
          return "Copy";
        default:
          return "Share";
      }
    };

    return (
      <button
        ref={ref}
        onClick={handleShare}
        className={cn(
          styles.button,
          styles[size],
          styles[platform],
          iconOnly && styles.iconOnly,
          className
        )}
        aria-label={`Share on ${platform}`}
        {...props}
      >
        {getIcon()}
        {!iconOnly && <span>{getLabel()}</span>}
      </button>
    );
  }
);

ZShareButton.displayName = "ZShareButton";

export default ZShareButton;
