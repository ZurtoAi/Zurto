/**
 * ZVirtualList - Virtualized list for large datasets
 */

import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
  ReactNode,
} from "react";
import styles from "./ZVirtualList.module.css";

export type ZVirtualListProps<T> = {
  /** Array of items to render */
  items: T[];
  /** Height of each item in pixels */
  itemHeight: number;
  /** Container height */
  height: number | string;
  /** Render function for each item */
  renderItem: (item: T, index: number) => ReactNode;
  /** Number of extra items to render above/below viewport */
  overscan?: number;
  /** Called when scroll reaches near bottom */
  onEndReached?: () => void;
  /** Threshold in pixels for onEndReached */
  endReachedThreshold?: number;
  /** Loading state */
  isLoading?: boolean;
  /** Loading component */
  loadingComponent?: ReactNode;
  /** Empty state component */
  emptyComponent?: ReactNode;
  /** Additional class name */
  className?: string;
  /** Gap between items */
  gap?: number;
  /** Item key extractor */
  keyExtractor?: (item: T, index: number) => string | number;
};

export function ZVirtualList<T>({
  items,
  itemHeight,
  height,
  renderItem,
  overscan = 3,
  onEndReached,
  endReachedThreshold = 200,
  isLoading = false,
  loadingComponent,
  emptyComponent,
  className,
  gap = 0,
  keyExtractor,
}: ZVirtualListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  // Calculate effective item height including gap
  const effectiveItemHeight = itemHeight + gap;

  // Get container height
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateHeight = () => {
      setContainerHeight(container.clientHeight);
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Calculate visible range
  const { startIndex, endIndex, offsetY } = useMemo(() => {
    const start = Math.max(
      0,
      Math.floor(scrollTop / effectiveItemHeight) - overscan
    );
    const visibleCount = Math.ceil(containerHeight / effectiveItemHeight);
    const end = Math.min(items.length - 1, start + visibleCount + overscan * 2);

    return {
      startIndex: start,
      endIndex: end,
      offsetY: start * effectiveItemHeight,
    };
  }, [scrollTop, containerHeight, effectiveItemHeight, items.length, overscan]);

  // Get visible items
  const visibleItems = useMemo(() => {
    return items.slice(startIndex, endIndex + 1);
  }, [items, startIndex, endIndex]);

  // Handle scroll
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const {
        scrollTop: newScrollTop,
        scrollHeight,
        clientHeight,
      } = e.currentTarget;
      setScrollTop(newScrollTop);

      // Check if near bottom
      if (onEndReached) {
        const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
        if (distanceFromBottom < endReachedThreshold && !isLoading) {
          onEndReached();
        }
      }
    },
    [onEndReached, endReachedThreshold, isLoading, scrollTop]
  );

  // Total content height
  const totalHeight = items.length * effectiveItemHeight - gap;

  // Get item key
  const getKey = (item: T, index: number): string | number => {
    if (keyExtractor) {
      return keyExtractor(item, index);
    }
    return startIndex + index;
  };

  // Empty state
  if (items.length === 0 && !isLoading) {
    return (
      <div
        className={`${styles.container} ${className || ""}`}
        style={{ height }}
      >
        {emptyComponent || (
          <div className={styles.empty}>
            <p>No items to display</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${className || ""}`}
      style={{ height }}
      onScroll={handleScroll}
    >
      <div className={styles.content} style={{ height: totalHeight }}>
        <div
          className={styles.viewport}
          style={{ transform: `translateY(${offsetY}px)` }}
        >
          {visibleItems.map((item, index) => (
            <div
              key={getKey(item, index)}
              className={styles.item}
              style={{
                height: itemHeight,
                marginBottom: index < visibleItems.length - 1 ? gap : 0,
              }}
            >
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className={styles.loading}>
          {loadingComponent || (
            <div className={styles.spinner}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" opacity="0.25" />
                <path
                  d="M12 2a10 10 0 0 1 10 10"
                  className={styles.spinnerPath}
                />
              </svg>
              <span>Loading...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Utility hook for infinite loading
export function useInfiniteScroll<T>(
  fetchMore: () => Promise<T[]>,
  hasMore: boolean
) {
  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setError(null);

    try {
      const newItems = await fetchMore();
      setItems((prev) => [...prev, ...newItems]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load items"));
    } finally {
      setIsLoading(false);
    }
  }, [fetchMore, hasMore, isLoading]);

  return {
    items,
    isLoading,
    error,
    loadMore,
    setItems,
  };
}

export default ZVirtualList;
