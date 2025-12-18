import { HTMLAttributes, forwardRef, ReactNode, Fragment } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZBreadcrumbs.module.css";

export interface ZBreadcrumbItem {
  /** Item label */
  label: ReactNode;
  /** Link href */
  href?: string;
  /** Icon */
  icon?: ReactNode;
  /** Click handler */
  onClick?: () => void;
}

export interface ZBreadcrumbsProps extends HTMLAttributes<HTMLElement> {
  /** Breadcrumb items */
  items: ZBreadcrumbItem[];
  /** Custom separator */
  separator?: ReactNode;
  /** Max items to show (with collapse) */
  maxItems?: number;
  /** Show home icon for first item */
  showHomeIcon?: boolean;
}

const DefaultSeparator = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
);

const HomeIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

/**
 * ZBreadcrumbs - Navigation breadcrumb trail
 */
export const ZBreadcrumbs = forwardRef<HTMLElement, ZBreadcrumbsProps>(
  (
    {
      items,
      separator = <DefaultSeparator />,
      maxItems,
      showHomeIcon = false,
      className,
      ...props
    },
    ref
  ) => {
    const displayItems =
      maxItems && items.length > maxItems
        ? [
            items[0],
            { label: "...", collapsed: true } as ZBreadcrumbItem & {
              collapsed?: boolean;
            },
            ...items.slice(-(maxItems - 1)),
          ]
        : items;

    return (
      <nav
        ref={ref}
        aria-label="Breadcrumb"
        className={cn(styles.breadcrumbs, className)}
        {...props}
      >
        <ol className={styles.list}>
          {displayItems.map((item, index) => {
            const isLast = index === displayItems.length - 1;
            const isCollapsed = (item as any).collapsed;

            return (
              <Fragment key={index}>
                <li className={styles.item}>
                  {isCollapsed ? (
                    <span className={styles.collapsed}>...</span>
                  ) : item.href ? (
                    <a
                      href={item.href}
                      className={cn(styles.link, isLast && styles.current)}
                      aria-current={isLast ? "page" : undefined}
                      onClick={item.onClick}
                    >
                      {index === 0 && showHomeIcon ? <HomeIcon /> : item.icon}
                      {(!showHomeIcon || index !== 0) && item.label}
                    </a>
                  ) : (
                    <span
                      className={cn(styles.link, isLast && styles.current)}
                      aria-current={isLast ? "page" : undefined}
                      onClick={item.onClick}
                    >
                      {index === 0 && showHomeIcon ? <HomeIcon /> : item.icon}
                      {(!showHomeIcon || index !== 0) && item.label}
                    </span>
                  )}
                </li>

                {!isLast && (
                  <li className={styles.separator} aria-hidden="true">
                    {separator}
                  </li>
                )}
              </Fragment>
            );
          })}
        </ol>
      </nav>
    );
  }
);

ZBreadcrumbs.displayName = "ZBreadcrumbs";

export default ZBreadcrumbs;
