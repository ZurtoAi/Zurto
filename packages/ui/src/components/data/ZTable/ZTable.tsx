import { forwardRef, TableHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";
import styles from "./ZTable.module.css";

export type ZTableVariant = "default" | "striped" | "bordered";
export type ZTableSize = "sm" | "md" | "lg";

export interface ZTableProps extends TableHTMLAttributes<HTMLTableElement> {
  /** Table variant */
  variant?: ZTableVariant;
  /** Table size */
  size?: ZTableSize;
  /** Highlight rows on hover */
  highlightOnHover?: boolean;
  /** Children */
  children: ReactNode;
}

export const ZTable = forwardRef<HTMLTableElement, ZTableProps>(
  (
    {
      variant = "default",
      size = "md",
      highlightOnHover = true,
      children,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div className={styles.wrapper}>
        <table
          ref={ref}
          className={cn(
            styles.table,
            styles[variant],
            styles[size],
            highlightOnHover && styles.hover,
            className
          )}
          {...props}
        >
          {children}
        </table>
      </div>
    );
  }
);

ZTable.displayName = "ZTable";

// Sub-components
export const ZTableHead = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn(styles.thead, className)} {...props} />
));
ZTableHead.displayName = "ZTableHead";

export const ZTableBody = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn(styles.tbody, className)} {...props} />
));
ZTableBody.displayName = "ZTableBody";

export const ZTableRow = forwardRef<
  HTMLTableRowElement,
  HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr ref={ref} className={cn(styles.tr, className)} {...props} />
));
ZTableRow.displayName = "ZTableRow";

export const ZTableCell = forwardRef<
  HTMLTableCellElement,
  HTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td ref={ref} className={cn(styles.td, className)} {...props} />
));
ZTableCell.displayName = "ZTableCell";

export const ZTableHeader = forwardRef<
  HTMLTableCellElement,
  HTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th ref={ref} className={cn(styles.th, className)} {...props} />
));
ZTableHeader.displayName = "ZTableHeader";

export default ZTable;
