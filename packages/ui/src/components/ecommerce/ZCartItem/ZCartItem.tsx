import { forwardRef, HTMLAttributes } from "react";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { cn } from "@/utils/cn";
import styles from "./ZCartItem.module.css";

export interface ZCartItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Product name */
  name: string;
  /** Product price */
  price: number;
  /** Quantity */
  quantity: number;
  /** Product image URL */
  image?: string;
  /** Currency symbol */
  currency?: string;
  /** On quantity change */
  onQuantityChange?: (quantity: number) => void;
  /** On remove */
  onRemove?: () => void;
  /** Compact mode */
  compact?: boolean;
}

export const ZCartItem = forwardRef<HTMLDivElement, ZCartItemProps>(
  (
    {
      name,
      price,
      quantity,
      image,
      currency = "$",
      onQuantityChange,
      onRemove,
      compact = false,
      className,
      ...props
    },
    ref
  ) => {
    const total = price * quantity;

    const handleIncrease = () => {
      onQuantityChange?.(quantity + 1);
    };

    const handleDecrease = () => {
      if (quantity > 1) {
        onQuantityChange?.(quantity - 1);
      }
    };

    return (
      <div
        ref={ref}
        className={cn(styles.cartItem, compact && styles.compact, className)}
        {...props}
      >
        {image && (
          <div className={styles.image}>
            <img src={image} alt={name} />
          </div>
        )}

        <div className={styles.info}>
          <div className={styles.name}>{name}</div>
          <div className={styles.price}>
            {currency}
            {price.toFixed(2)}
          </div>
        </div>

        <div className={styles.controls}>
          <div className={styles.quantity}>
            <button
              onClick={handleDecrease}
              className={styles.quantityBtn}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
            >
              <Minus />
            </button>
            <span className={styles.quantityValue}>{quantity}</span>
            <button
              onClick={handleIncrease}
              className={styles.quantityBtn}
              aria-label="Increase quantity"
            >
              <Plus />
            </button>
          </div>

          {!compact && (
            <div className={styles.total}>
              {currency}
              {total.toFixed(2)}
            </div>
          )}
        </div>

        {onRemove && (
          <button
            onClick={onRemove}
            className={styles.removeBtn}
            aria-label="Remove item"
          >
            <Trash2 />
          </button>
        )}
      </div>
    );
  }
);

ZCartItem.displayName = "ZCartItem";

export default ZCartItem;
