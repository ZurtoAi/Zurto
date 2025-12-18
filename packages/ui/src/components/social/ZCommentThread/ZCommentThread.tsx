import { forwardRef, useState, HTMLAttributes, ReactNode } from "react";
import { ThumbsUp, MessageCircle, Share2 } from "lucide-react";
import { cn } from "@/utils/cn";
import styles from "./ZCommentThread.module.css";

export interface Comment {
  /** Comment ID */
  id: string;
  /** Author name */
  author: string;
  /** Author avatar */
  avatar?: string;
  /** Comment content */
  content: string;
  /** Timestamp */
  timestamp: Date;
  /** Like count */
  likes?: number;
  /** Is liked by user */
  isLiked?: boolean;
  /** Nested replies */
  replies?: Comment[];
}

export interface ZCommentThreadProps extends HTMLAttributes<HTMLDivElement> {
  /** Comments array */
  comments: Comment[];
  /** Show reply button */
  showReply?: boolean;
  /** Show like button */
  showLike?: boolean;
  /** Max nesting level */
  maxDepth?: number;
  /** Reply callback */
  onReply?: (commentId: string) => void;
  /** Like callback */
  onLike?: (commentId: string) => void;
}

const CommentItem = ({
  comment,
  depth,
  maxDepth,
  showReply,
  showLike,
  onReply,
  onLike,
}: {
  comment: Comment;
  depth: number;
  maxDepth: number;
  showReply: boolean;
  showLike: boolean;
  onReply?: (id: string) => void;
  onLike?: (id: string) => void;
}) => {
  const canNest = depth < maxDepth;
  const timeAgo = formatTimeAgo(comment.timestamp);

  return (
    <div className={styles.comment}>
      <div className={styles.avatar}>
        {comment.avatar ? (
          <img src={comment.avatar} alt={comment.author} />
        ) : (
          <div className={styles.avatarPlaceholder}>
            {comment.author.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.author}>{comment.author}</span>
          <span className={styles.timestamp}>{timeAgo}</span>
        </div>

        <div className={styles.text}>{comment.content}</div>

        <div className={styles.actions}>
          {showLike && (
            <button
              onClick={() => onLike?.(comment.id)}
              className={cn(styles.action, comment.isLiked && styles.liked)}
            >
              <ThumbsUp />
              {comment.likes ? <span>{comment.likes}</span> : null}
            </button>
          )}
          {showReply && canNest && (
            <button
              onClick={() => onReply?.(comment.id)}
              className={styles.action}
            >
              <MessageCircle />
              <span>Reply</span>
            </button>
          )}
        </div>

        {comment.replies && comment.replies.length > 0 && canNest && (
          <div className={styles.replies}>
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                depth={depth + 1}
                maxDepth={maxDepth}
                showReply={showReply}
                showLike={showLike}
                onReply={onReply}
                onLike={onLike}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export const ZCommentThread = forwardRef<HTMLDivElement, ZCommentThreadProps>(
  (
    {
      comments,
      showReply = true,
      showLike = true,
      maxDepth = 3,
      onReply,
      onLike,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div ref={ref} className={cn(styles.thread, className)} {...props}>
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            depth={0}
            maxDepth={maxDepth}
            showReply={showReply}
            showLike={showLike}
            onReply={onReply}
            onLike={onLike}
          />
        ))}
      </div>
    );
  }
);

ZCommentThread.displayName = "ZCommentThread";

export default ZCommentThread;
