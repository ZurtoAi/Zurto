import { forwardRef, HTMLAttributes, useState, DragEvent } from "react";
import { GripVertical, Plus } from "lucide-react";
import { cn } from "@/utils/cn";
import styles from "./ZKanban.module.css";

export interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
}

export interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCard[];
  limit?: number;
}

export interface ZKanbanProps extends HTMLAttributes<HTMLDivElement> {
  /** Columns */
  columns: KanbanColumn[];
  /** On card move */
  onCardMove?: (cardId: string, fromColumn: string, toColumn: string) => void;
  /** On add card */
  onAddCard?: (columnId: string) => void;
}

export const ZKanban = forwardRef<HTMLDivElement, ZKanbanProps>(
  ({ columns, onCardMove, onAddCard, className, ...props }, ref) => {
    const [draggedCard, setDraggedCard] = useState<{
      id: string;
      columnId: string;
    } | null>(null);

    const handleDragStart = (cardId: string, columnId: string) => {
      setDraggedCard({ id: cardId, columnId });
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleDrop = (toColumnId: string) => {
      if (draggedCard && draggedCard.columnId !== toColumnId) {
        onCardMove?.(draggedCard.id, draggedCard.columnId, toColumnId);
      }
      setDraggedCard(null);
    };

    return (
      <div ref={ref} className={cn(styles.kanban, className)} {...props}>
        {columns.map((column) => (
          <div
            key={column.id}
            className={styles.column}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column.id)}
          >
            <div className={styles.columnHeader}>
              <h3 className={styles.columnTitle}>{column.title}</h3>
              <span className={styles.cardCount}>
                {column.cards.length}
                {column.limit && ` / ${column.limit}`}
              </span>
            </div>

            <div className={styles.cards}>
              {column.cards.map((card) => (
                <div
                  key={card.id}
                  className={styles.card}
                  draggable
                  onDragStart={() => handleDragStart(card.id, column.id)}
                >
                  <div className={styles.cardHeader}>
                    <GripVertical className={styles.dragHandle} />
                    <span className={styles.cardTitle}>{card.title}</span>
                  </div>
                  {card.description && (
                    <p className={styles.cardDescription}>{card.description}</p>
                  )}
                  {card.tags && card.tags.length > 0 && (
                    <div className={styles.tags}>
                      {card.tags.map((tag, index) => (
                        <span key={index} className={styles.tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {onAddCard && (
              <button
                onClick={() => onAddCard(column.id)}
                className={styles.addButton}
              >
                <Plus />
                Add Card
              </button>
            )}
          </div>
        ))}
      </div>
    );
  }
);

ZKanban.displayName = "ZKanban";

export default ZKanban;
