import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZKeyValue.module.css";

export interface ZKeyValuePair {
  key: string;
  value: string | number | React.ReactNode;
}

export interface ZKeyValueProps extends HTMLAttributes<HTMLDListElement> {
  /** Key-value pairs */
  items: ZKeyValuePair[];
  /** Layout */
  layout?: "horizontal" | "vertical";
  /** Divider */
  divider?: boolean;
}

export const ZKeyValue = forwardRef<HTMLDListElement, ZKeyValueProps>(
  (
    { items, layout = "horizontal", divider = false, className, ...props },
    ref
  ) => {
    return (
      <dl
        ref={ref}
        className={cn(
          styles.list,
          styles[layout],
          divider && styles.divider,
          className
        )}
        {...props}
      >
        {items.map((item, index) => (
          <div key={index} className={styles.item}>
            <dt className={styles.key}>{item.key}</dt>
            <dd className={styles.value}>{item.value}</dd>
          </div>
        ))}
      </dl>
    );
  }
);

ZKeyValue.displayName = "ZKeyValue";

export default ZKeyValue;
