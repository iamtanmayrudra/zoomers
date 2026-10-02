"use client";

import { useZoom } from "../../hooks/useZoom";

export interface ZoomControlsProps {
  className?: string;
}

export function ZoomControls({ className }: ZoomControlsProps) {
  const { zoom, increaseZoom, decreaseZoom, resetZoom, config } = useZoom();

  return (
    <div
      className={["zoom-magnifier-controls", className].filter(Boolean).join(" ")}
      role="group"
      aria-label="Zoom controls"
    >
      <button
        type="button"
        aria-label="Decrease zoom"
        onClick={decreaseZoom}
        disabled={zoom <= config.minZoom}
      >
        −
      </button>
      <span aria-live="polite">{`Zoom level: ${zoom}x`}</span>
      <button
        type="button"
        aria-label="Increase zoom"
        onClick={increaseZoom}
        disabled={zoom >= config.maxZoom}
      >
        +
      </button>
      <button type="button" aria-label="Reset zoom" onClick={resetZoom}>
        Reset
      </button>
    </div>
  );
}
