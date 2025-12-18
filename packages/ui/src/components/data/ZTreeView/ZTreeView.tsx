import { forwardRef, HTMLAttributes, ReactNode } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { cn } from "@/utils/cn";
import styles from "./ZTreeView.module.css";

export interface TreeNode {
  /** Node ID */
  id: string;
  /** Node label */
  label: string;
  /** Icon */
  icon?: ReactNode;
  /** Children nodes */
  children?: TreeNode[];
  /** Custom data */
  data?: any;
}

export interface ZTreeViewProps extends HTMLAttributes<HTMLDivElement> {
  /** Tree data */
  data: TreeNode[];
  /** Selected node ID */
  selectedId?: string;
  /** Expanded node IDs */
  expandedIds?: string[];
  /** Selection callback */
  onSelect?: (node: TreeNode) => void;
  /** Toggle callback */
  onToggle?: (nodeId: string, expanded: boolean) => void;
}

const TreeNodeItem = ({
  node,
  level,
  selectedId,
  expandedIds,
  onSelect,
  onToggle,
}: {
  node: TreeNode;
  level: number;
  selectedId?: string;
  expandedIds?: string[];
  onSelect?: (node: TreeNode) => void;
  onToggle?: (nodeId: string, expanded: boolean) => void;
}) => {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedIds?.includes(node.id);
  const isSelected = selectedId === node.id;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      onToggle?.(node.id, !isExpanded);
    }
  };

  return (
    <div className={styles.node}>
      <button
        onClick={() => onSelect?.(node)}
        className={cn(styles.nodeButton, isSelected && styles.selected)}
        style={{ paddingLeft: `${level * 20 + 12}px` }}
      >
        {hasChildren && (
          <span onClick={handleToggle} className={styles.toggle}>
            {isExpanded ? <ChevronDown /> : <ChevronUp />}
          </span>
        )}
        {!hasChildren && <span className={styles.spacer} />}
        {node.icon && <span className={styles.icon}>{node.icon}</span>}
        <span className={styles.label}>{node.label}</span>
      </button>

      {hasChildren && isExpanded && (
        <div className={styles.children}>
          {node.children!.map((child) => (
            <TreeNodeItem
              key={child.id}
              node={child}
              level={level + 1}
              selectedId={selectedId}
              expandedIds={expandedIds}
              onSelect={onSelect}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const ZTreeView = forwardRef<HTMLDivElement, ZTreeViewProps>(
  (
    {
      data,
      selectedId,
      expandedIds = [],
      onSelect,
      onToggle,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div ref={ref} className={cn(styles.tree, className)} {...props}>
        {data.map((node) => (
          <TreeNodeItem
            key={node.id}
            node={node}
            level={0}
            selectedId={selectedId}
            expandedIds={expandedIds}
            onSelect={onSelect}
            onToggle={onToggle}
          />
        ))}
      </div>
    );
  }
);

ZTreeView.displayName = "ZTreeView";

export default ZTreeView;
