import { forwardRef, AudioHTMLAttributes, useState, useRef } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { cn } from "@/utils/cn";
import styles from "./ZAudioPlayer.module.css";

export interface ZAudioPlayerProps
  extends AudioHTMLAttributes<HTMLAudioElement> {
  /** Audio source */
  src: string;
  /** Title */
  title?: string;
  /** Artist */
  artist?: string;
}

export const ZAudioPlayer = forwardRef<HTMLAudioElement, ZAudioPlayerProps>(
  ({ src, title, artist, className, ...props }, ref) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);

    const togglePlay = () => {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    };

    const toggleMute = () => {
      if (audioRef.current) {
        audioRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
      }
    };

    const handleTimeUpdate = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration);
      }
    };

    const formatTime = (time: number) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
      <div className={cn(styles.container, className)}>
        <audio
          ref={audioRef}
          src={src}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          {...props}
        />
        {(title || artist) && (
          <div className={styles.info}>
            {title && <div className={styles.title}>{title}</div>}
            {artist && <div className={styles.artist}>{artist}</div>}
          </div>
        )}
        <div className={styles.progress}>
          <div
            className={styles.progressBar}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className={styles.controls}>
          <button className={styles.button}>
            <SkipBack className={styles.icon} />
          </button>
          <button
            onClick={togglePlay}
            className={cn(styles.button, styles.playButton)}
          >
            {isPlaying ? (
              <Pause className={styles.icon} />
            ) : (
              <Play className={styles.icon} />
            )}
          </button>
          <button className={styles.button}>
            <SkipForward className={styles.icon} />
          </button>
          <div className={styles.time}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
          <button onClick={toggleMute} className={styles.button}>
            {isMuted ? (
              <VolumeX className={styles.icon} />
            ) : (
              <Volume2 className={styles.icon} />
            )}
          </button>
        </div>
      </div>
    );
  }
);

ZAudioPlayer.displayName = "ZAudioPlayer";

export default ZAudioPlayer;
