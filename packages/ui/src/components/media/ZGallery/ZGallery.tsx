import { forwardRef, useState, HTMLAttributes } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/utils/cn";
import { ZImage } from "../ZImage";
import styles from "./ZGallery.module.css";

export type ZGalleryVariant = "grid" | "masonry" | "carousel";

export interface GalleryImage {
  /** Image URL */
  src: string;
  /** Image alt text */
  alt: string;
  /** Image caption */
  caption?: string;
  /** Thumbnail URL */
  thumbnail?: string;
}

export interface ZGalleryProps extends HTMLAttributes<HTMLDivElement> {
  /** Gallery variant */
  variant?: ZGalleryVariant;
  /** Gallery images */
  images: GalleryImage[];
  /** Grid columns */
  columns?: 2 | 3 | 4 | 5;
  /** Enable lightbox */
  lightbox?: boolean;
  /** Show captions */
  showCaptions?: boolean;
}

export const ZGallery = forwardRef<HTMLDivElement, ZGalleryProps>(
  (
    {
      variant = "grid",
      images,
      columns = 3,
      lightbox = true,
      showCaptions = true,
      className,
      ...props
    },
    ref
  ) => {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const openLightbox = (index: number) => {
      if (lightbox) setLightboxIndex(index);
    };

    const closeLightbox = () => {
      setLightboxIndex(null);
    };

    const nextImage = () => {
      if (lightboxIndex !== null) {
        setLightboxIndex((lightboxIndex + 1) % images.length);
      }
    };

    const prevImage = () => {
      if (lightboxIndex !== null) {
        setLightboxIndex((lightboxIndex - 1 + images.length) % images.length);
      }
    };

    return (
      <>
        <div
          ref={ref}
          className={cn(
            styles.gallery,
            styles[variant],
            styles[`columns${columns}`],
            className
          )}
          {...props}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className={styles.item}
              onClick={() => openLightbox(index)}
            >
              <ZImage
                src={image.thumbnail || image.src}
                alt={image.alt}
                fit="cover"
                className={styles.image}
              />
              {showCaptions && image.caption && (
                <div className={styles.caption}>{image.caption}</div>
              )}
            </div>
          ))}
        </div>

        {lightboxIndex !== null && (
          <div className={styles.lightbox} onClick={closeLightbox}>
            <button
              className={styles.closeButton}
              onClick={closeLightbox}
              aria-label="Close lightbox"
            >
              <X />
            </button>

            <button
              className={cn(styles.navButton, styles.prevButton)}
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              aria-label="Previous image"
            >
              <ChevronLeft />
            </button>

            <div
              className={styles.lightboxContent}
              onClick={(e) => e.stopPropagation()}
            >
              <ZImage
                src={images[lightboxIndex].src}
                alt={images[lightboxIndex].alt}
                fit="contain"
                className={styles.lightboxImage}
              />
              {images[lightboxIndex].caption && (
                <div className={styles.lightboxCaption}>
                  {images[lightboxIndex].caption}
                </div>
              )}
            </div>

            <button
              className={cn(styles.navButton, styles.nextButton)}
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              aria-label="Next image"
            >
              <ChevronRight />
            </button>

            <div className={styles.counter}>
              {lightboxIndex + 1} / {images.length}
            </div>
          </div>
        )}
      </>
    );
  }
);

ZGallery.displayName = "ZGallery";

export default ZGallery;
