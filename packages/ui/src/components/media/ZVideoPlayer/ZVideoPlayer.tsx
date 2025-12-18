import { forwardRef, VideoHTMLAttributes, useState } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
} from "lucide-react";
import { cn } from "@/utils/cn";
import styles from "./ZVideoPlayer.module.css";

export interface ZVideoPlayerProps
  extends VideoHTMLAttributes<HTMLVideoElement> {
  /** Video source */
  src: string;
  /** Poster image */
  poster?: string;
  /** Show controls */
  showControls?: boolean;
}

export const ZVideoPlayer = forwardRef<HTMLVideoElement, ZVideoPlayerProps>(
  ({ src, poster, showControls = true, className, ...props }, ref) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    const togglePlay = () => {
      const video = ref as React.RefObject<HTMLVideoElement>;
      if (video.current) {
        if (isPlaying) {
          video.current.pause();
        } else {
          video.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    };

    const toggleMute = () => {
      const video = ref as React.RefObject<HTMLVideoElement>;
      if (video.current) {
        video.current.muted = !isMuted;
        setIsMuted(!isMuted);
      }
    };

    return (
      <div className={cn(styles.container, className)}>
        <video
          ref={ref}
          src={src}
          poster={poster}
          className={styles.video}
          {...props}
        />
        {showControls && (
          <div className={styles.controls}>
            <button onClick={togglePlay} className={styles.button}>
              {isPlaying ? (
                <Pause className={styles.icon} />
              ) : (
                <Play className={styles.icon} />
              )}
            </button>
            <button onClick={toggleMute} className={styles.button}>
              {isMuted ? (
                <VolumeX className={styles.icon} />
              ) : (
                <Volume2 className={styles.icon} />
              )}
            </button>
            <div className={styles.spacer} />
            <button className={styles.button}>
              <Settings className={styles.icon} />
            </button>
            <button className={styles.button}>
              <Maximize className={styles.icon} />
            </button>
          </div>
        )}
      </div>
    );
  }
);

ZVideoPlayer.displayName = "ZVideoPlayer";

export default ZVideoPlayer;
