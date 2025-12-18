import {
  forwardRef,
  useState,
  useEffect,
  useRef,
  HTMLAttributes,
  ReactNode,
} from "react";
import { ChevronLeft, ChevronRight, Circle } from "lucide-react";
import { cn } from "@/utils/cn";
import styles from "./ZCarousel.module.css";

export type ZCarouselVariant = "default" | "cards" | "fade";

export interface CarouselItem {
  /** Item ID */
  id: string;
  /** Item content */
  content: ReactNode;
}

export interface ZCarouselProps extends HTMLAttributes<HTMLDivElement> {
  /** Carousel variant */
  variant?: ZCarouselVariant;
  /** Carousel items */
  items: CarouselItem[];
  /** Auto-play interval (ms) */
  autoPlay?: number;
  /** Show navigation arrows */
  showArrows?: boolean;
  /** Show dots */
  showDots?: boolean;
  /** Loop items */
  loop?: boolean;
  /** Items per view */
  itemsPerView?: number;
}

export const ZCarousel = forwardRef<HTMLDivElement, ZCarouselProps>(
  (
    {
      variant = "default",
      items,
      autoPlay,
      showArrows = true,
      showDots = true,
      loop = true,
      itemsPerView = 1,
      className,
      ...props
    },
    ref
  ) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const autoPlayRef = useRef<NodeJS.Timeout>();

    const goToSlide = (index: number) => {
      if (loop) {
        setCurrentIndex((index + items.length) % items.length);
      } else {
        setCurrentIndex(
          Math.max(0, Math.min(index, items.length - itemsPerView))
        );
      }
    };

    const goToPrev = () => {
      goToSlide(currentIndex - 1);
    };

    const goToNext = () => {
      goToSlide(currentIndex + 1);
    };

    useEffect(() => {
      if (autoPlay && !isHovered) {
        autoPlayRef.current = setInterval(() => {
          goToNext();
        }, autoPlay);

        return () => {
          if (autoPlayRef.current) {
            clearInterval(autoPlayRef.current);
          }
        };
      }
    }, [autoPlay, isHovered, currentIndex]);

    const canGoPrev = loop || currentIndex > 0;
    const canGoNext = loop || currentIndex < items.length - itemsPerView;

    return (
      <div
        ref={ref}
        className={cn(styles.carousel, styles[variant], className)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        <div className={styles.viewport}>
          <div
            className={styles.container}
            style={{
              transform: `translateX(-${(currentIndex * 100) / itemsPerView}%)`,
            }}
          >
            {items.map((item) => (
              <div
                key={item.id}
                className={styles.slide}
                style={{ flex: `0 0 ${100 / itemsPerView}%` }}
              >
                {item.content}
              </div>
            ))}
          </div>
        </div>

        {showArrows && (
          <>
            <button
              onClick={goToPrev}
              disabled={!canGoPrev}
              className={cn(styles.arrow, styles.prevArrow)}
              aria-label="Previous slide"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={goToNext}
              disabled={!canGoNext}
              className={cn(styles.arrow, styles.nextArrow)}
              aria-label="Next slide"
            >
              <ChevronRight />
            </button>
          </>
        )}

        {showDots && (
          <div className={styles.dots}>
            {Array.from({ length: Math.ceil(items.length / itemsPerView) }).map(
              (_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index * itemsPerView)}
                  className={cn(
                    styles.dot,
                    Math.floor(currentIndex / itemsPerView) === index &&
                      styles.activeDot
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                >
                  <Circle />
                </button>
              )
            )}
          </div>
        )}
      </div>
    );
  }
);

ZCarousel.displayName = "ZCarousel";

export default ZCarousel;
