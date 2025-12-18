import { forwardRef, VideoHTMLAttributes, useState } from "react";
import { cn } from "@/utils/cn";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import styles from "./ZVideo.module.css";

export interface ZVideoProps extends VideoHTMLAttributes<HTMLVideoElement> {
  /** Show controls */
  showControls?: boolean;
  /** Poster image */
  poster?: string;
}

export const ZVideo = forwardRef<HTMLVideoElement, ZVideoProps>(
  ({ showControls = true, poster, className, ...props }, ref) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    return (
      <div className={cn(styles.container, className)}>
        <video
          ref={ref}
          className={styles.video}
          poster={poster}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          {...props}
        />
        {showControls && (
          <div className={styles.controls}>
            <button
              className={styles.controlBtn}
              onClick={() => {
                const video = ref as React.RefObject<HTMLVideoElement>;
                if (video.current) {
                  isPlaying ? video.current.pause() : video.current.play();
                }
              }}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button
              className={styles.controlBtn}
              onClick={() => {
                const video = ref as React.RefObject<HTMLVideoElement>;
                if (video.current) {
                  video.current.muted = !isMuted;
                  setIsMuted(!isMuted);
                }
              }}
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>
        )}
      </div>
    );
  }
);

ZVideo.displayName = "ZVideo";

export default ZVideo;
