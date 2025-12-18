import { HTMLAttributes, forwardRef, ReactNode, useState } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZPagination.module.css";

export type ZPaginationSize = "sm" | "md" | "lg";
export type ZPaginationVariant = "default" | "minimal" | "bordered";

export interface ZPaginationProps
  extends Omit<HTMLAttributes<HTMLElement>, "onChange"> {
  /** Total number of pages */
  totalPages: number;
  /** Current page (1-indexed) */
  page?: number;
  /** Default page */
  defaultPage?: number;
  /** On page change */
  onChange?: (page: number) => void;
  /** Number of siblings to show */
  siblings?: number;
  /** Show first/last buttons */
  showEdges?: boolean;
  /** Size variant */
  size?: ZPaginationSize;
  /** Visual variant */
  variant?: ZPaginationVariant;
  /** Disabled state */
  disabled?: boolean;
  /** Show page count */
  showPageCount?: boolean;
}

const ChevronLeft = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const ChevronRight = () => (
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

const ChevronsLeft = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" />
  </svg>
);

const ChevronsRight = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M13 17l5-5-5-5M6 17l5-5-5-5" />
  </svg>
);

function getPageNumbers(
  currentPage: number,
  totalPages: number,
  siblings: number
): (number | "dots")[] {
  const totalNumbers = siblings * 2 + 3; // siblings + current + 2 dots
  const totalBlocks = totalNumbers + 2; // + first + last

  if (totalPages <= totalBlocks) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(currentPage - siblings, 1);
  const rightSibling = Math.min(currentPage + siblings, totalPages);

  const showLeftDots = leftSibling > 2;
  const showRightDots = rightSibling < totalPages - 1;

  if (!showLeftDots && showRightDots) {
    const leftRange = Array.from({ length: 3 + siblings * 2 }, (_, i) => i + 1);
    return [...leftRange, "dots", totalPages];
  }

  if (showLeftDots && !showRightDots) {
    const rightRange = Array.from(
      { length: 3 + siblings * 2 },
      (_, i) => totalPages - (3 + siblings * 2) + i + 1
    );
    return [1, "dots", ...rightRange];
  }

  const middleRange = Array.from(
    { length: rightSibling - leftSibling + 1 },
    (_, i) => leftSibling + i
  );
  return [1, "dots", ...middleRange, "dots", totalPages];
}

/**
 * ZPagination - Page navigation component
 */
export const ZPagination = forwardRef<HTMLElement, ZPaginationProps>(
  (
    {
      totalPages,
      page: pageProp,
      defaultPage = 1,
      onChange,
      siblings = 1,
      showEdges = true,
      size = "md",
      variant = "default",
      disabled = false,
      showPageCount = false,
      className,
      ...props
    },
    ref
  ) => {
    const [internalPage, setInternalPage] = useState(defaultPage);
    const currentPage = pageProp ?? internalPage;

    const handlePageChange = (page: number) => {
      if (page < 1 || page > totalPages || page === currentPage || disabled)
        return;
      if (pageProp === undefined) {
        setInternalPage(page);
      }
      onChange?.(page);
    };

    const pageNumbers = getPageNumbers(currentPage, totalPages, siblings);

    return (
      <nav
        ref={ref}
        aria-label="Pagination"
        className={cn(
          styles.pagination,
          styles[size],
          styles[variant],
          disabled && styles.disabled,
          className
        )}
        {...props}
      >
        {showEdges && (
          <button
            type="button"
            className={cn(styles.button, styles.nav)}
            onClick={() => handlePageChange(1)}
            disabled={disabled || currentPage === 1}
            aria-label="First page"
          >
            <ChevronsLeft />
          </button>
        )}

        <button
          type="button"
          className={cn(styles.button, styles.nav)}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={disabled || currentPage === 1}
          aria-label="Previous page"
        >
          <ChevronLeft />
        </button>

        <div className={styles.pages}>
          {pageNumbers.map((pageNum, index) =>
            pageNum === "dots" ? (
              <span key={`dots-${index}`} className={styles.dots}>
                ···
              </span>
            ) : (
              <button
                key={pageNum}
                type="button"
                className={cn(
                  styles.button,
                  styles.page,
                  currentPage === pageNum && styles.active
                )}
                onClick={() => handlePageChange(pageNum)}
                disabled={disabled}
                aria-current={currentPage === pageNum ? "page" : undefined}
              >
                {pageNum}
              </button>
            )
          )}
        </div>

        <button
          type="button"
          className={cn(styles.button, styles.nav)}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={disabled || currentPage === totalPages}
          aria-label="Next page"
        >
          <ChevronRight />
        </button>

        {showEdges && (
          <button
            type="button"
            className={cn(styles.button, styles.nav)}
            onClick={() => handlePageChange(totalPages)}
            disabled={disabled || currentPage === totalPages}
            aria-label="Last page"
          >
            <ChevronsRight />
          </button>
        )}

        {showPageCount && (
          <span className={styles.pageCount}>
            Page {currentPage} of {totalPages}
          </span>
        )}
      </nav>
    );
  }
);

ZPagination.displayName = "ZPagination";

export default ZPagination;
