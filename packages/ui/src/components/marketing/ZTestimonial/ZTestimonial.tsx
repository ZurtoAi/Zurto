import { forwardRef, HTMLAttributes } from "react";
import { Star } from "lucide-react";
import { cn } from "@/utils/cn";
import { ZAvatar } from "../../core/ZAvatar";
import styles from "./ZTestimonial.module.css";

export type ZTestimonialVariant = "default" | "card" | "quote";

export interface Testimonial {
  /** Testimonial content */
  content: string;
  /** Author name */
  author: string;
  /** Author role/title */
  role?: string;
  /** Author avatar URL */
  avatar?: string;
  /** Rating (1-5) */
  rating?: number;
}

export interface ZTestimonialProps extends HTMLAttributes<HTMLDivElement> {
  /** Testimonial variant */
  variant?: ZTestimonialVariant;
  /** Testimonial data */
  testimonial: Testimonial;
}

export const ZTestimonial = forwardRef<HTMLDivElement, ZTestimonialProps>(
  ({ variant = "default", testimonial, className, ...props }, ref) => {
    const { content, author, role, avatar, rating } = testimonial;

    return (
      <div
        ref={ref}
        className={cn(styles.testimonial, styles[variant], className)}
        {...props}
      >
        {rating && (
          <div className={styles.rating}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(styles.star, i < rating && styles.filled)}
                fill={i < rating ? "currentColor" : "none"}
              />
            ))}
          </div>
        )}

        <blockquote className={styles.content}>
          {variant === "quote" && <span className={styles.quoteIcon}>"</span>}
          <p>{content}</p>
        </blockquote>

        <div className={styles.author}>
          <ZAvatar
            src={avatar}
            alt={author}
            size="md"
            fallback={author.charAt(0)}
          />
          <div className={styles.authorInfo}>
            <p className={styles.authorName}>{author}</p>
            {role && <p className={styles.authorRole}>{role}</p>}
          </div>
        </div>
      </div>
    );
  }
);

ZTestimonial.displayName = "ZTestimonial";

export default ZTestimonial;
