import { forwardRef, HTMLAttributes, useState } from "react";
import { ShoppingCart, Heart, Star } from "lucide-react";
import { cn } from "@/utils/cn";
import { ZButton } from "../../core/ZButton";
import { ZBadge } from "../../core/ZBadge";
import styles from "./ZProductCard.module.css";

export type ZProductCardVariant = "default" | "compact" | "detailed";

export interface ZProductCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Card variant */
  variant?: ZProductCardVariant;
  /** Product image */
  image: string;
  /** Product title */
  title: string;
  /** Product description */
  description?: string;
  /** Product price */
  price: string;
  /** Original price (if on sale) */
  originalPrice?: string;
  /** Product rating (0-5) */
  rating?: number;
  /** Number of reviews */
  reviews?: number;
  /** Out of stock */
  outOfStock?: boolean;
  /** Sale badge */
  onSale?: boolean;
  /** Add to cart handler */
  onAddToCart?: () => void;
  /** Wishlist handler */
  onWishlist?: () => void;
}

export const ZProductCard = forwardRef<HTMLDivElement, ZProductCardProps>(
  (
    {
      variant = "default",
      image,
      title,
      description,
      price,
      originalPrice,
      rating,
      reviews,
      outOfStock = false,
      onSale = false,
      onAddToCart,
      onWishlist,
      className,
      ...props
    },
    ref
  ) => {
    const [isWishlisted, setIsWishlisted] = useState(false);

    const handleWishlist = () => {
      setIsWishlisted(!isWishlisted);
      onWishlist?.();
    };

    return (
      <div
        ref={ref}
        className={cn(
          styles.card,
          styles[variant],
          outOfStock && styles.outOfStock,
          className
        )}
        {...props}
      >
        <div className={styles.imageWrapper}>
          <img src={image} alt={title} className={styles.image} />

          {onSale && (
            <ZBadge className={styles.saleBadge} variant="accent">
              SALE
            </ZBadge>
          )}

          {outOfStock && (
            <div className={styles.stockOverlay}>Out of Stock</div>
          )}

          <button
            onClick={handleWishlist}
            className={cn(
              styles.wishlistButton,
              isWishlisted && styles.wishlisted
            )}
            aria-label="Add to wishlist"
          >
            <Heart fill={isWishlisted ? "currentColor" : "none"} />
          </button>
        </div>

        <div className={styles.content}>
          <h3 className={styles.title}>{title}</h3>

          {description && variant === "detailed" && (
            <p className={styles.description}>{description}</p>
          )}

          {rating !== undefined && (
            <div className={styles.rating}>
              <div className={styles.stars}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(styles.star, i < rating && styles.filled)}
                    fill={i < rating ? "currentColor" : "none"}
                  />
                ))}
              </div>
              {reviews && <span className={styles.reviews}>({reviews})</span>}
            </div>
          )}

          <div className={styles.pricing}>
            <span className={styles.price}>{price}</span>
            {originalPrice && (
              <span className={styles.originalPrice}>{originalPrice}</span>
            )}
          </div>

          <ZButton
            variant="primary"
            fullWidth
            onClick={onAddToCart}
            disabled={outOfStock}
            leftIcon={<ShoppingCart />}
          >
            {outOfStock ? "Out of Stock" : "Add to Cart"}
          </ZButton>
        </div>
      </div>
    );
  }
);

ZProductCard.displayName = "ZProductCard";

export default ZProductCard;
