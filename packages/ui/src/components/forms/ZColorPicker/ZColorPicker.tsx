/**
 * ZColorPicker - Color selection component
 */

import React, { useState, useRef, useEffect, useCallback } from "react";
import styles from "./ZColorPicker.module.css";

export type ZColorPickerProps = {
  /** Current color value (hex) */
  value?: string;
  /** Called when color changes */
  onChange: (color: string) => void;
  /** Preset color palette */
  presets?: string[];
  /** Allow alpha/opacity */
  showAlpha?: boolean;
  /** Show hex input */
  showInput?: boolean;
  /** Disable picker */
  disabled?: boolean;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Additional class name */
  className?: string;
  /** Placeholder */
  placeholder?: string;
  /** ID for form association */
  id?: string;
};

const DEFAULT_PRESETS = [
  "#df3e53", // Zurto primary
  "#ef4444", // Red
  "#f97316", // Orange
  "#eab308", // Yellow
  "#22c55e", // Green
  "#06b6d4", // Cyan
  "#3b82f6", // Blue
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#ffffff", // White
  "#a1a1aa", // Gray
  "#18181b", // Black
];

export function ZColorPicker({
  value = "#df3e53",
  onChange,
  presets = DEFAULT_PRESETS,
  showAlpha = false,
  showInput = true,
  disabled = false,
  size = "md",
  className,
  placeholder = "Select color",
  id,
}: ZColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localColor, setLocalColor] = useState(value);
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [alpha, setAlpha] = useState(100);
  const containerRef = useRef<HTMLDivElement>(null);
  const satBrightRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);

  // Parse hex to HSB on value change
  useEffect(() => {
    const { h, s, b } = hexToHsb(value);
    setHue(h);
    setSaturation(s);
    setBrightness(b);
    setLocalColor(value);
  }, [value]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Update color when HSB changes
  useEffect(() => {
    const hex = hsbToHex(hue, saturation, brightness);
    setLocalColor(hex);
  }, [hue, saturation, brightness]);

  const handleSatBrightChange = useCallback(
    (e: React.MouseEvent | MouseEvent) => {
      if (!satBrightRef.current) return;
      const rect = satBrightRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
      const s = Math.round((x / rect.width) * 100);
      const b = Math.round(100 - (y / rect.height) * 100);
      setSaturation(s);
      setBrightness(b);
    },
    []
  );

  const handleHueChange = useCallback((e: React.MouseEvent | MouseEvent) => {
    if (!hueRef.current) return;
    const rect = hueRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const h = Math.round((x / rect.width) * 360);
    setHue(h);
  }, []);

  const handleMouseDown = (
    handler: (e: MouseEvent) => void,
    e: React.MouseEvent
  ) => {
    handler(e.nativeEvent);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      handler(moveEvent);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      onChange(localColor);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      setLocalColor(hex);
      const { h, s, b } = hexToHsb(hex);
      setHue(h);
      setSaturation(s);
      setBrightness(b);
      onChange(hex);
    } else {
      setLocalColor(hex);
    }
  };

  const handlePresetClick = (color: string) => {
    setLocalColor(color);
    const { h, s, b } = hexToHsb(color);
    setHue(h);
    setSaturation(s);
    setBrightness(b);
    onChange(color);
  };

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${styles[size]} ${className || ""}`}
    >
      <button
        type="button"
        id={id}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`${styles.trigger} ${isOpen ? styles.open : ""} ${
          disabled ? styles.disabled : ""
        }`}
        aria-label={placeholder}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <span className={styles.swatch} style={{ backgroundColor: value }} />
        <span className={styles.value}>{value.toUpperCase()}</span>
        <span className={styles.chevron}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div
          className={styles.dropdown}
          role="dialog"
          aria-label="Color picker"
        >
          {/* Saturation/Brightness picker */}
          <div
            ref={satBrightRef}
            className={styles.satBright}
            style={{ backgroundColor: `hsl(${hue}, 100%, 50%)` }}
            onMouseDown={(e) => handleMouseDown(handleSatBrightChange, e)}
          >
            <div className={styles.satOverlay} />
            <div className={styles.brightOverlay} />
            <div
              className={styles.satBrightHandle}
              style={{
                left: `${saturation}%`,
                top: `${100 - brightness}%`,
                backgroundColor: localColor,
              }}
            />
          </div>

          {/* Hue slider */}
          <div
            ref={hueRef}
            className={styles.hueSlider}
            onMouseDown={(e) => handleMouseDown(handleHueChange, e)}
          >
            <div
              className={styles.hueHandle}
              style={{ left: `${(hue / 360) * 100}%` }}
            />
          </div>

          {/* Alpha slider */}
          {showAlpha && (
            <div className={styles.alphaSlider}>
              <div
                className={styles.alphaTrack}
                style={{
                  background: `linear-gradient(to right, transparent, ${localColor})`,
                }}
              />
              <input
                type="range"
                min="0"
                max="100"
                value={alpha}
                onChange={(e) => setAlpha(Number(e.target.value))}
                className={styles.alphaInput}
              />
            </div>
          )}

          {/* Hex input */}
          {showInput && (
            <div className={styles.inputRow}>
              <span className={styles.inputLabel}>HEX</span>
              <input
                type="text"
                value={localColor}
                onChange={handleInputChange}
                className={styles.hexInput}
                maxLength={7}
                pattern="^#[0-9A-Fa-f]{6}$"
              />
            </div>
          )}

          {/* Presets */}
          {presets.length > 0 && (
            <div className={styles.presets}>
              {presets.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handlePresetClick(color)}
                  className={`${styles.preset} ${
                    localColor.toLowerCase() === color.toLowerCase()
                      ? styles.presetSelected
                      : ""
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`Select ${color}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Helper functions
function hexToHsb(hex: string): { h: number; s: number; b: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === r) {
      h = ((g - b) / delta) % 6;
    } else if (max === g) {
      h = (b - r) / delta + 2;
    } else {
      h = (r - g) / delta + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }

  const s = max === 0 ? 0 : Math.round((delta / max) * 100);
  const brightness = Math.round(max * 100);

  return { h, s, b: brightness };
}

function hsbToHex(h: number, s: number, b: number): string {
  const saturation = s / 100;
  const brightness = b / 100;

  const c = brightness * saturation;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = brightness - c;

  let r = 0,
    g = 0,
    bl = 0;

  if (h < 60) {
    r = c;
    g = x;
  } else if (h < 120) {
    r = x;
    g = c;
  } else if (h < 180) {
    g = c;
    bl = x;
  } else if (h < 240) {
    g = x;
    bl = c;
  } else if (h < 300) {
    r = x;
    bl = c;
  } else {
    r = c;
    bl = x;
  }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(bl)}`;
}

export default ZColorPicker;
