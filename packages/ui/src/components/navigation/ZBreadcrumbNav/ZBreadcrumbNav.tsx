import { forwardRef, HTMLAttributes } from "react";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/utils/cn";
import styles from "./ZBreadcrumbNav.module.css";

export interface Breadcrumb {
  /** Label */
  label: string;
  /** Link href */
  href?: string;
  /** Icon */
  icon?: React.ReactNode;
}

export interface ZBreadcrumbNavProps extends HTMLAttributes<HTMLElement> {
  /** Breadcrumb items */
  items: Breadcrumb[];
  /** Separator */
  separator?: React.ReactNode;
  /** Show home icon */
  showHome?: boolean;
  /** Max items to show */
  maxItems?: number;
}

export const ZBreadcrumbNav = forwardRef<HTMLElement, ZBreadcrumbNavProps>(
  (
    {
      items,
      separator = <ChevronRight className={styles.separator} />,
      showHome = true,
      maxItems,
      className,
      ...props
    },
    ref
  ) => {
    let displayItems = [...items];

    if (maxItems && items.length > maxItems) {
      const firstItems = items.slice(0, 1);
      const lastItems = items.slice(items.length - maxItems + 2);
      displayItems = [...firstItems, { label: "..." }, ...lastItems];
    }

    return (
      <nav
        ref={ref}
        className={cn(styles.breadcrumb, className)}
        aria-label="Breadcrumb"
        {...props}
      >
        <ol className={styles.list}>
          {showHome && (
            <>
              <li className={styles.item}>
                <a href="/" className={cn(styles.link, styles.home)}>
                  <Home className={styles.homeIcon} />
                  <span className={styles.srOnly}>Home</span>
                </a>
              </li>
              {displayItems.length > 0 && (
                <li className={styles.separatorItem} aria-hidden="true">
                  {separator}
                </li>
              )}
            </>
          )}
          {displayItems.map((item, index) => {
            const isLast = index === displayItems.length - 1;
            const isEllipsis = item.label === "...";

            return (
              <li key={index} className={styles.item}>
                {isEllipsis ? (
                  <span className={styles.ellipsis}>{item.label}</span>
                ) : item.href && !isLast ? (
                  <a href={item.href} className={styles.link}>
                    {item.icon && (
                      <span className={styles.icon}>{item.icon}</span>
                    )}
                    {item.label}
                  </a>
                ) : (
                  <span
                    className={cn(styles.current)}
                    aria-current={isLast ? "page" : undefined}
                  >
                    {item.icon && (
                      <span className={styles.icon}>{item.icon}</span>
                    )}
                    {item.label}
                  </span>
                )}
                {!isLast && (
                  <span className={styles.separatorItem} aria-hidden="true">
                    {separator}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }
);

ZBreadcrumbNav.displayName = "ZBreadcrumbNav";

export default ZBreadcrumbNav;
