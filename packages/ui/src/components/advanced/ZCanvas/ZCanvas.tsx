/**
 * ZCanvas - Drawing canvas component
 */

import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import styles from "./ZCanvas.module.css";

export type DrawingTool = "pen" | "eraser" | "line" | "rectangle" | "circle";

export type ZCanvasProps = {
  /** Canvas width */
  width?: number;
  /** Canvas height */
  height?: number;
  /** Current drawing tool */
  tool?: DrawingTool;
  /** Stroke color */
  strokeColor?: string;
  /** Stroke width */
  strokeWidth?: number;
  /** Fill color (for shapes) */
  fillColor?: string;
  /** Background color */
  backgroundColor?: string;
  /** Disable drawing */
  disabled?: boolean;
  /** Called when canvas changes */
  onChange?: (dataUrl: string) => void;
  /** Additional class name */
  className?: string;
  /** Show grid */
  showGrid?: boolean;
  /** Grid size */
  gridSize?: number;
};

export type ZCanvasRef = {
  clear: () => void;
  undo: () => void;
  redo: () => void;
  toDataURL: (type?: string) => string;
  fromDataURL: (dataUrl: string) => void;
};

export const ZCanvas = forwardRef<ZCanvasRef, ZCanvasProps>(
  (
    {
      width = 600,
      height = 400,
      tool = "pen",
      strokeColor = "#df3e53",
      strokeWidth = 2,
      fillColor = "transparent",
      backgroundColor = "#ffffff",
      disabled = false,
      onChange,
      className,
      showGrid = false,
      gridSize = 20,
    },
    ref
  ) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [history, setHistory] = useState<ImageData[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    // Get canvas context
    const getContext = useCallback(() => {
      return canvasRef.current?.getContext("2d");
    }, []);

    // Save state to history
    const saveToHistory = useCallback(() => {
      const ctx = getContext();
      if (!ctx) return;

      const imageData = ctx.getImageData(0, 0, width, height);
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(imageData);

      // Limit history size
      if (newHistory.length > 50) {
        newHistory.shift();
      }

      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);

      // Notify change
      if (onChange && canvasRef.current) {
        onChange(canvasRef.current.toDataURL());
      }
    }, [getContext, width, height, history, historyIndex, onChange]);

    // Initialize canvas
    useEffect(() => {
      const ctx = getContext();
      if (!ctx) return;

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);

      if (showGrid) {
        drawGrid(ctx, width, height, gridSize);
      }

      // Save initial state
      const imageData = ctx.getImageData(0, 0, width, height);
      setHistory([imageData]);
      setHistoryIndex(0);
    }, [width, height, backgroundColor, showGrid, gridSize, getContext]);

    // Get mouse position relative to canvas
    const getMousePos = (
      e:
        | React.MouseEvent<HTMLCanvasElement>
        | React.TouchEvent<HTMLCanvasElement>
    ) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      if ("touches" in e) {
        const touch = e.touches[0] || e.changedTouches[0];
        return {
          x: (touch.clientX - rect.left) * scaleX,
          y: (touch.clientY - rect.top) * scaleY,
        };
      }

      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    };

    // Draw functions
    const draw = useCallback(
      (fromX: number, fromY: number, toX: number, toY: number) => {
        const ctx = getContext();
        if (!ctx) return;

        ctx.strokeStyle = tool === "eraser" ? backgroundColor : strokeColor;
        ctx.lineWidth = tool === "eraser" ? strokeWidth * 3 : strokeWidth;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
      },
      [getContext, tool, strokeColor, strokeWidth, backgroundColor]
    );

    const drawShape = useCallback(
      (endX: number, endY: number, preview = false) => {
        const ctx = getContext();
        if (!ctx) return;

        // Restore previous state for preview
        if (preview && historyIndex >= 0) {
          ctx.putImageData(history[historyIndex], 0, 0);
        }

        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidth;
        ctx.fillStyle = fillColor;

        ctx.beginPath();

        switch (tool) {
          case "line":
            ctx.moveTo(startPos.x, startPos.y);
            ctx.lineTo(endX, endY);
            ctx.stroke();
            break;

          case "rectangle":
            const rectWidth = endX - startPos.x;
            const rectHeight = endY - startPos.y;
            ctx.rect(startPos.x, startPos.y, rectWidth, rectHeight);
            if (fillColor !== "transparent") {
              ctx.fill();
            }
            ctx.stroke();
            break;

          case "circle":
            const radius = Math.sqrt(
              Math.pow(endX - startPos.x, 2) + Math.pow(endY - startPos.y, 2)
            );
            ctx.arc(startPos.x, startPos.y, radius, 0, Math.PI * 2);
            if (fillColor !== "transparent") {
              ctx.fill();
            }
            ctx.stroke();
            break;
        }
      },
      [
        getContext,
        tool,
        strokeColor,
        strokeWidth,
        fillColor,
        startPos,
        history,
        historyIndex,
      ]
    );

    // Event handlers
    const handleStart = (
      e:
        | React.MouseEvent<HTMLCanvasElement>
        | React.TouchEvent<HTMLCanvasElement>
    ) => {
      if (disabled) return;

      const pos = getMousePos(e);
      setIsDrawing(true);
      setStartPos(pos);

      if (tool === "pen" || tool === "eraser") {
        draw(pos.x, pos.y, pos.x, pos.y);
      }
    };

    const handleMove = (
      e:
        | React.MouseEvent<HTMLCanvasElement>
        | React.TouchEvent<HTMLCanvasElement>
    ) => {
      if (!isDrawing || disabled) return;

      const pos = getMousePos(e);

      if (tool === "pen" || tool === "eraser") {
        draw(startPos.x, startPos.y, pos.x, pos.y);
        setStartPos(pos);
      } else {
        drawShape(pos.x, pos.y, true);
      }
    };

    const handleEnd = (
      e:
        | React.MouseEvent<HTMLCanvasElement>
        | React.TouchEvent<HTMLCanvasElement>
    ) => {
      if (!isDrawing || disabled) return;

      if (tool !== "pen" && tool !== "eraser") {
        const pos = getMousePos(e);
        drawShape(pos.x, pos.y, false);
      }

      setIsDrawing(false);
      saveToHistory();
    };

    // Imperative methods
    useImperativeHandle(ref, () => ({
      clear: () => {
        const ctx = getContext();
        if (!ctx) return;

        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);

        if (showGrid) {
          drawGrid(ctx, width, height, gridSize);
        }

        saveToHistory();
      },

      undo: () => {
        if (historyIndex > 0) {
          const ctx = getContext();
          if (!ctx) return;

          const newIndex = historyIndex - 1;
          ctx.putImageData(history[newIndex], 0, 0);
          setHistoryIndex(newIndex);
        }
      },

      redo: () => {
        if (historyIndex < history.length - 1) {
          const ctx = getContext();
          if (!ctx) return;

          const newIndex = historyIndex + 1;
          ctx.putImageData(history[newIndex], 0, 0);
          setHistoryIndex(newIndex);
        }
      },

      toDataURL: (type = "image/png") => {
        return canvasRef.current?.toDataURL(type) || "";
      },

      fromDataURL: (dataUrl: string) => {
        const ctx = getContext();
        if (!ctx) return;

        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
          saveToHistory();
        };
        img.src = dataUrl;
      },
    }));

    return (
      <div className={`${styles.container} ${className || ""}`}>
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className={`${styles.canvas} ${disabled ? styles.disabled : ""}`}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
          style={{
            cursor: disabled
              ? "not-allowed"
              : tool === "eraser"
              ? "cell"
              : "crosshair",
          }}
        />
      </div>
    );
  }
);

function drawGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  gridSize: number
) {
  ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
  ctx.lineWidth = 0.5;

  for (let x = 0; x <= width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for (let y = 0; y <= height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
}

ZCanvas.displayName = "ZCanvas";

export default ZCanvas;
