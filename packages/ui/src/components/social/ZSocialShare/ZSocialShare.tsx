import { forwardRef, HTMLAttributes } from "react";
import {
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Link2,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/utils/cn";
import styles from "./ZSocialShare.module.css";

export type SocialPlatform =
  | "facebook"
  | "twitter"
  | "linkedin"
  | "email"
  | "copy"
  | "whatsapp";
export type ZSocialShareSize = "sm" | "md" | "lg";

export interface ZSocialShareProps extends HTMLAttributes<HTMLDivElement> {
  /** URL to share */
  url: string;
  /** Share title */
  title?: string;
  /** Share description */
  description?: string;
  /** Platforms to show */
  platforms?: SocialPlatform[];
  /** Button size */
  size?: ZSocialShareSize;
  /** Show labels */
  showLabels?: boolean;
  /** Callback on share */
  onShare?: (platform: SocialPlatform) => void;
}

export const ZSocialShare = forwardRef<HTMLDivElement, ZSocialShareProps>(
  (
    {
      url,
      title = "",
      description = "",
      platforms = ["facebook", "twitter", "linkedin", "email"],
      size = "md",
      showLabels = false,
      onShare,
      className,
      ...props
    },
    ref
  ) => {
    const shareUrls: Record<SocialPlatform, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        url
      )}`,
      email: `mailto:?subject=${encodeURIComponent(
        title
      )}&body=${encodeURIComponent(description + "\n\n" + url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`,
      copy: url,
    };

    const platformIcons: Record<SocialPlatform, any> = {
      facebook: Facebook,
      twitter: Twitter,
      linkedin: Linkedin,
      email: Mail,
      copy: Link2,
      whatsapp: MessageCircle,
    };

    const platformLabels: Record<SocialPlatform, string> = {
      facebook: "Facebook",
      twitter: "Twitter",
      linkedin: "LinkedIn",
      email: "Email",
      copy: "Copy Link",
      whatsapp: "WhatsApp",
    };

    const handleShare = async (platform: SocialPlatform) => {
      if (platform === "copy") {
        await navigator.clipboard.writeText(url);
        onShare?.(platform);
      } else {
        window.open(shareUrls[platform], "_blank", "width=600,height=400");
        onShare?.(platform);
      }
    };

    return (
      <div
        ref={ref}
        className={cn(styles.container, styles[size], className)}
        {...props}
      >
        {platforms.map((platform) => {
          const Icon = platformIcons[platform];
          return (
            <button
              key={platform}
              onClick={() => handleShare(platform)}
              className={cn(styles.button, styles[platform])}
              aria-label={`Share on ${platformLabels[platform]}`}
            >
              <Icon className={styles.icon} />
              {showLabels && (
                <span className={styles.label}>{platformLabels[platform]}</span>
              )}
            </button>
          );
        })}
      </div>
    );
  }
);

ZSocialShare.displayName = "ZSocialShare";

export default ZSocialShare;
