import { forwardRef, HTMLAttributes, ReactNode } from "react";
import { Calendar, User } from "lucide-react";
import { cn } from "@/utils/cn";
import styles from "./ZArticle.module.css";

export interface ZArticleProps extends HTMLAttributes<HTMLElement> {
  /** Article title */
  title: string;
  /** Article content/excerpt */
  content: string;
  /** Author name */
  author?: string;
  /** Author avatar */
  authorAvatar?: string;
  /** Publication date */
  date?: string;
  /** Featured image */
  image?: string;
  /** Tags */
  tags?: string[];
  /** Reading time */
  readTime?: string;
  /** Show excerpt only */
  excerpt?: boolean;
}

export const ZArticle = forwardRef<HTMLElement, ZArticleProps>(
  (
    {
      title,
      content,
      author,
      authorAvatar,
      date,
      image,
      tags,
      readTime,
      excerpt = false,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <article ref={ref} className={cn(styles.article, className)} {...props}>
        {image && (
          <div className={styles.image}>
            <img src={image} alt={title} />
          </div>
        )}

        <div className={styles.content}>
          <h2 className={styles.title}>{title}</h2>

          <div className={styles.meta}>
            {author && (
              <div className={styles.author}>
                {authorAvatar ? (
                  <img
                    src={authorAvatar}
                    alt={author}
                    className={styles.avatar}
                  />
                ) : (
                  <User className={styles.defaultAvatar} />
                )}
                <span>{author}</span>
              </div>
            )}
            {date && (
              <div className={styles.date}>
                <Calendar />
                <span>{date}</span>
              </div>
            )}
            {readTime && <span className={styles.readTime}>{readTime}</span>}
          </div>

          <div className={cn(styles.body, excerpt && styles.excerpt)}>
            {content}
          </div>

          {tags && tags.length > 0 && (
            <div className={styles.tags}>
              {tags.map((tag, index) => (
                <span key={index} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    );
  }
);

ZArticle.displayName = "ZArticle";

export default ZArticle;
