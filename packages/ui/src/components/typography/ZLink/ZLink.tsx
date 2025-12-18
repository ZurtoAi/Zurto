import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZLink.module.css";

export interface ZLinkProps extends HTMLAttributes<HTMLAnchorElement> {
  /** URL */
  href: string;
  /** External link */
  external?: boolean;
  /** Underline */
  underline?: "none" | "hover" | "always";
  /** Variant */
  variant?: "default" | "accent" | "muted";
}

export const ZLink = forwardRef<HTMLAnchorElement, ZLinkProps>(
  (
    {
      href,
      external = false,
      underline = "hover",
      variant = "default",
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <a
        ref={ref}
        href={href}
        className={cn(
          styles.link,
          styles[variant],
          styles[`underline-${underline}`],
          className
        )}
        {...(external && { target: "_blank", rel: "noopener noreferrer" })}
        {...props}
      >
        {children}
      </a>
    );
  }
);

ZLink.displayName = "ZLink";

export default ZLink;
