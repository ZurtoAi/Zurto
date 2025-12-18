import { forwardRef, TextareaHTMLAttributes, useState } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZTextarea.module.css";

export interface ZTextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Show character count */
  showCount?: boolean;
  /** Auto resize */
  autoResize?: boolean;
}

export const ZTextarea = forwardRef<HTMLTextAreaElement, ZTextareaProps>(
  (
    {
      showCount = false,
      autoResize = false,
      maxLength,
      className,
      onChange,
      ...props
    },
    ref
  ) => {
    const [count, setCount] = useState(0);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (showCount) {
        setCount(e.target.value.length);
      }
      if (autoResize) {
        e.target.style.height = "auto";
        e.target.style.height = e.target.scrollHeight + "px";
      }
      onChange?.(e);
    };

    return (
      <div className={cn(styles.container, className)}>
        <textarea
          ref={ref}
          className={styles.textarea}
          maxLength={maxLength}
          onChange={handleChange}
          {...props}
        />
        {showCount && (
          <div className={styles.counter}>
            {count}
            {maxLength && ` / ${maxLength}`}
          </div>
        )}
      </div>
    );
  }
);

ZTextarea.displayName = "ZTextarea";

export default ZTextarea;
