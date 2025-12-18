import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZBlockquote.module.css";

export interface ZBlockquoteProps extends HTMLAttributes<HTMLQuoteElement> {
  /** Author */
  author?: string;
  /** Source */
  source?: string;
  /** Variant */
  variant?: "default" | "bordered" | "accent";
}

export const ZBlockquote = forwardRef<HTMLQuoteElement, ZBlockquoteProps>(
  (
    { author, source, variant = "default", className, children, ...props },
    ref
  ) => {
    return (
      <blockquote
        ref={ref}
        className={cn(styles.blockquote, styles[variant], className)}
        {...props}
      >
        <div className={styles.content}>{children}</div>
        {(author || source) && (
          <footer className={styles.footer}>
            {author && <cite className={styles.author}>{author}</cite>}
            {source && <span className={styles.source}>{source}</span>}
          </footer>
        )}
      </blockquote>
    );
  }
);

ZBlockquote.displayName = "ZBlockquote";

export default ZBlockquote;
