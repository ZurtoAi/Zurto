import { forwardRef, AudioHTMLAttributes, useState } from "react";
import { cn } from "@/utils/cn";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import styles from "./ZAudio.module.css";

export interface ZAudioProps extends AudioHTMLAttributes<HTMLAudioElement> {
  /** Title */
  title?: string;
  /** Artist */
  artist?: string;
}

export const ZAudio = forwardRef<HTMLAudioElement, ZAudioProps>(
  ({ title, artist, className, ...props }, ref) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    return (
      <div className={cn(styles.container, className)}>
        <audio
          ref={ref}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          {...props}
        />
        <div className={styles.controls}>
          <button
            className={styles.playBtn}
            onClick={() => {
              const audio = ref as React.RefObject<HTMLAudioElement>;
              if (audio.current) {
                isPlaying ? audio.current.pause() : audio.current.play();
              }
            }}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <div className={styles.info}>
            {title && <div className={styles.title}>{title}</div>}
            {artist && <div className={styles.artist}>{artist}</div>}
          </div>
          <button
            className={styles.muteBtn}
            onClick={() => {
              const audio = ref as React.RefObject<HTMLAudioElement>;
              if (audio.current) {
                audio.current.muted = !isMuted;
                setIsMuted(!isMuted);
              }
            }}
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>
      </div>
    );
  }
);

ZAudio.displayName = "ZAudio";

export default ZAudio;
