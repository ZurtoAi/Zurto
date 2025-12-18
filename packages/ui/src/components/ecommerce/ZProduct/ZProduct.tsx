import { forwardRef, HTMLAttributes } from "react";
import { Star, ShoppingCart } from "lucide-react";
import { cn } from "@/utils/cn";
import styles from "./ZProduct.module.css";

export interface ZProductProps extends HTMLAttributes<HTMLDivElement> {
  /** Product image */
  image: string;
  /** Product title */
  title: string;
  /** Price */
  price: number;
  /** Original price (for discount) */
  originalPrice?: number;
  /** Rating */
  rating?: number;
  /** Reviews count */
  reviews?: number;
  /** On add to cart */
  onAddToCart?: () => void;
  /** Badge */
  badge?: string;
}

export const ZProduct = forwardRef<HTMLDivElement, ZProductProps>(
  (
    {
      image,
      title,
      price,
      originalPrice,
      rating,
      reviews,
      onAddToCart,
      badge,
      className,
      ...props
    },
    ref
  ) => {
    const discount = originalPrice
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

    return (
      <div ref={ref} className={cn(styles.product, className)} {...props}>
        <div className={styles.imageContainer}>
          <img src={image} alt={title} className={styles.image} />
          {badge && <div className={styles.badge}>{badge}</div>}
          {discount > 0 && <div className={styles.discount}>-{discount}%</div>}
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>{title}</h3>
          {rating !== undefined && (
            <div className={styles.rating}>
              <div className={styles.stars}>
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      styles.star,
                      i < Math.floor(rating) && styles.filled
                    )}
                  />
                ))}
              </div>
              {reviews !== undefined && (
                <span className={styles.reviews}>({reviews})</span>
              )}
            </div>
          )}
          <div className={styles.pricing}>
            <span className={styles.price}>${price.toFixed(2)}</span>
            {originalPrice && (
              <span className={styles.originalPrice}>
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          {onAddToCart && (
            <button onClick={onAddToCart} className={styles.addToCart}>
              <ShoppingCart className={styles.icon} />
              Add to Cart
            </button>
          )}
        </div>
      </div>
    );
  }
);

ZProduct.displayName = "ZProduct";

export default ZProduct;
