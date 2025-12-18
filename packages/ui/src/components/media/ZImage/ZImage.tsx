import { forwardRef, useState, ImgHTMLAttributes } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/utils/cn";
import styles from "./ZImage.module.css";

export type ZImageFit = "cover" | "contain" | "fill" | "none";
export type ZImageRadius = "none" | "sm" | "md" | "lg" | "full";

export interface ZImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, "onError"> {
  /** Image source */
  src: string;
  /** Image alt text */
  alt: string;
  /** Object fit */
  fit?: ZImageFit;
  /** Border radius */
  radius?: ZImageRadius;
  /** Aspect ratio */
  aspectRatio?: string;
  /** Fallback image */
  fallback?: string;
  /** Loading state */
  loading?: "lazy" | "eager";
  /** Error handler */
  onError?: () => void;
  /** Show loading skeleton */
  showSkeleton?: boolean;
}

export const ZImage = forwardRef<HTMLImageElement, ZImageProps>(
  (
    {
      src,
      alt,
      fit = "cover",
      radius = "md",
      aspectRatio,
      fallback,
      loading = "lazy",
      onError,
      showSkeleton = true,
      className,
      ...props
    },
    ref
  ) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [currentSrc, setCurrentSrc] = useState(src);

    const handleLoad = () => {
      setIsLoading(false);
    };

    const handleError = () => {
      setIsLoading(false);
      setHasError(true);
      if (fallback && currentSrc !== fallback) {
        setCurrentSrc(fallback);
        setHasError(false);
      } else {
        onError?.();
      }
    };

    return (
      <div
        className={cn(styles.wrapper, styles[radius], className)}
        style={{ aspectRatio }}
      >
        {showSkeleton && isLoading && (
          <div className={styles.skeleton} aria-hidden="true" />
        )}

        {hasError ? (
          <div className={styles.error}>
            <ImageOff className={styles.errorIcon} />
            <span className={styles.errorText}>Failed to load image</span>
          </div>
        ) : (
          <img
            ref={ref}
            src={currentSrc}
            alt={alt}
            loading={loading}
            onLoad={handleLoad}
            onError={handleError}
            className={cn(
              styles.image,
              styles[fit],
              isLoading && styles.loading
            )}
            {...props}
          />
        )}
      </div>
    );
  }
);

ZImage.displayName = "ZImage";

export default ZImage;
