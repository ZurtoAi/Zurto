import {
  HTMLAttributes,
  forwardRef,
  ReactNode,
  useState,
  useMemo,
} from "react";
import { cn } from "@/utils/cn";
import styles from "./ZTable.module.css";

export interface ZTableColumn<T = any> {
  /** Unique column key */
  key: string;
  /** Column header */
  header: ReactNode;
  /** Cell renderer */
  cell?: (row: T, index: number) => ReactNode;
  /** Access key for simple data */
  accessor?: keyof T;
  /** Column width */
  width?: string | number;
  /** Alignment */
  align?: "left" | "center" | "right";
  /** Sortable */
  sortable?: boolean;
}

export type ZTableSize = "sm" | "md" | "lg";

export interface ZTableProps<T = any>
  extends Omit<HTMLAttributes<HTMLTableElement>, "children"> {
  /** Table columns */
  columns: ZTableColumn<T>[];
  /** Table data */
  data: T[];
  /** Row key accessor */
  rowKey?: keyof T | ((row: T, index: number) => string);
  /** Size variant */
  size?: ZTableSize;
  /** Striped rows */
  striped?: boolean;
  /** Hoverable rows */
  hoverable?: boolean;
  /** Bordered */
  bordered?: boolean;
  /** Sticky header */
  stickyHeader?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Empty state content */
  emptyContent?: ReactNode;
  /** Row click handler */
  onRowClick?: (row: T, index: number) => void;
  /** Selected rows */
  selectedRows?: string[];
  /** On selection change */
  onSelectionChange?: (keys: string[]) => void;
  /** Selectable rows */
  selectable?: boolean;
}

/**
 * ZTable - Data table component
 */
export function ZTable<T extends Record<string, any>>({
  columns,
  data,
  rowKey = "id",
  size = "md",
  striped = false,
  hoverable = true,
  bordered = false,
  stickyHeader = false,
  loading = false,
  emptyContent = "No data available",
  onRowClick,
  selectedRows = [],
  onSelectionChange,
  selectable = false,
  className,
  ...props
}: ZTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const getRowKey = (row: T, index: number): string => {
    if (typeof rowKey === "function") return rowKey(row, index);
    return String(row[rowKey] ?? index);
  };

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sortedData = useMemo(() => {
    if (!sortKey) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      const cmp = aVal < bVal ? -1 : 1;
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir]);

  const handleSelectAll = () => {
    if (!onSelectionChange) return;
    if (selectedRows.length === data.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(data.map((row, i) => getRowKey(row, i)));
    }
  };

  const handleSelectRow = (key: string) => {
    if (!onSelectionChange) return;
    if (selectedRows.includes(key)) {
      onSelectionChange(selectedRows.filter((k) => k !== key));
    } else {
      onSelectionChange([...selectedRows, key]);
    }
  };

  const allSelected = data.length > 0 && selectedRows.length === data.length;
  const someSelected =
    selectedRows.length > 0 && selectedRows.length < data.length;

  return (
    <div className={cn(styles.wrapper, className)}>
      <table
        className={cn(
          styles.table,
          styles[size],
          striped && styles.striped,
          hoverable && styles.hoverable,
          bordered && styles.bordered,
          stickyHeader && styles.stickyHeader
        )}
        {...props}
      >
        <thead className={styles.thead}>
          <tr>
            {selectable && (
              <th className={cn(styles.th, styles.checkboxCell)}>
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected;
                  }}
                  onChange={handleSelectAll}
                  className={styles.checkbox}
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  styles.th,
                  styles[`align-${col.align || "left"}`],
                  col.sortable && styles.sortable
                )}
                style={{ width: col.width }}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                <span className={styles.thContent}>
                  {col.header}
                  {col.sortable && (
                    <span
                      className={cn(
                        styles.sortIcon,
                        sortKey === col.key && styles.sortActive
                      )}
                    >
                      {sortKey === col.key && sortDir === "desc" ? "↓" : "↑"}
                    </span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {loading ? (
            <tr>
              <td
                colSpan={columns.length + (selectable ? 1 : 0)}
                className={styles.emptyCell}
              >
                <div className={styles.loading}>Loading...</div>
              </td>
            </tr>
          ) : sortedData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (selectable ? 1 : 0)}
                className={styles.emptyCell}
              >
                <div className={styles.empty}>{emptyContent}</div>
              </td>
            </tr>
          ) : (
            sortedData.map((row, index) => {
              const key = getRowKey(row, index);
              const isSelected = selectedRows.includes(key);

              return (
                <tr
                  key={key}
                  className={cn(
                    styles.tr,
                    isSelected && styles.selected,
                    onRowClick && styles.clickable
                  )}
                  onClick={() => onRowClick?.(row, index)}
                >
                  {selectable && (
                    <td className={cn(styles.td, styles.checkboxCell)}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRow(key)}
                        onClick={(e) => e.stopPropagation()}
                        className={styles.checkbox}
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        styles.td,
                        styles[`align-${col.align || "left"}`]
                      )}
                    >
                      {col.cell
                        ? col.cell(row, index)
                        : col.accessor
                        ? String(row[col.accessor] ?? "")
                        : String(row[col.key] ?? "")}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

ZTable.displayName = "ZTable";

export default ZTable;
