import { forwardRef, HTMLAttributes, ReactNode } from "react";
import { ThumbsUp, MessageCircle } from "lucide-react";
import { cn } from "@/utils/cn";
import styles from "./ZCommentCard.module.css";

export interface ZCommentCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Author name */
  author: string;
  /** Author avatar */
  avatar?: string;
  /** Comment text */
  content: string;
  /** Timestamp */
  timestamp: string;
  /** Like count */
  likes?: number;
  /** Reply count */
  replies?: number;
  /** Is liked */
  isLiked?: boolean;
  /** On like */
  onLike?: () => void;
  /** On reply */
  onReply?: () => void;
  /** Badge */
  badge?: ReactNode;
}

export const ZCommentCard = forwardRef<HTMLDivElement, ZCommentCardProps>(
  (
    {
      author,
      avatar,
      content,
      timestamp,
      likes = 0,
      replies = 0,
      isLiked = false,
      onLike,
      onReply,
      badge,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div ref={ref} className={cn(styles.card, className)} {...props}>
        <div className={styles.avatar}>
          {avatar ? (
            <img src={avatar} alt={author} />
          ) : (
            <div className={styles.defaultAvatar}>
              {author.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className={styles.content}>
          <div className={styles.header}>
            <span className={styles.author}>{author}</span>
            {badge && <span className={styles.badge}>{badge}</span>}
            <span className={styles.timestamp}>{timestamp}</span>
          </div>

          <div className={styles.body}>{content}</div>

          <div className={styles.actions}>
            {onLike && (
              <button
                onClick={onLike}
                className={cn(styles.action, isLiked && styles.liked)}
              >
                <ThumbsUp />
                {likes > 0 && <span>{likes}</span>}
              </button>
            )}
            {onReply && (
              <button onClick={onReply} className={styles.action}>
                <MessageCircle />
                {replies > 0 && <span>{replies}</span>}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
);

ZCommentCard.displayName = "ZCommentCard";

export default ZCommentCard;
